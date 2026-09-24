export const onRequestPost = async ({ env, request }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Query D1 for user record
    let user;
    try {
      const { results } = await env.DB.prepare(
        'SELECT id, email, password_hash FROM users WHERE email = ? LIMIT 1'
      ).bind(email).all();
      user = results[0];
    } catch (dbErr) {
      return Response.json({ error: 'Database error' }, { status: 500 });
    }

    if (!user || !user.password_hash) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password using WebCrypto SHA-256
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', passwordBytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashHex !== user.password_hash) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create session token
    const tokenArray = new Uint32Array(5);
    crypto.getRandomValues(tokenArray);
    const sessionToken = tokenArray.map(v => v.toString(16)).join('');

    // Insert session into database
    try {
      await env.DB.prepare(
        'INSERT INTO sessions (token, user_id, expires) VALUES (?, ?, datetime("now", "+1 hour"))'
      ).bind(sessionToken, user.id).run();
    } catch (insertErr) {
      return Response.json({ error: 'Failed to create session' }, { status: 500 });
    }

    // Set secure, HTTP-only, SameSite cookie
    const cookie = `session=${sessionToken}; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600`;

    return Response.json(
      { authed: true, user: { id: user.id, email: user.email } },
      { status: 200, headers: { 'Set-Cookie': cookie } }
    );
  } catch (err) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
};