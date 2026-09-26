export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // SHA-256 hash calculation via WebCrypto
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passwordHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Query client_users in D1
    const user = await env.DB.prepare(
      'SELECT id, email, full_name, role FROM client_users WHERE email = ? AND password_hash = ?'
    ).bind(email.toLowerCase().trim(), passwordHashHex).first();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid client credentials.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate session token
    const sessionPayload = JSON.stringify({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      exp: Date.now() + (12 * 60 * 60 * 1000) // 12-hour session
    });

    const sessionToken = btoa(sessionPayload);
    const cookieHeader = `client_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200`;

    return new Response(JSON.stringify({
      success: true,
      user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieHeader
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Auth system failure', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}