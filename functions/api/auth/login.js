export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB || env.remission_db;

  if (!db) {
    return new Response(JSON.stringify({ error: 'D1 database binding missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await db
      .prepare("SELECT id, email, full_name, password_hash FROM client_profiles WHERE email = ? AND status = 'active'")
      .bind(email)
      .first();

    if (!client) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 86400000 * 7).toISOString(); // 7 days

    await db
      .prepare("INSERT INTO client_sessions (id, client_id, token, expires_at) VALUES (?, ?, ?, ?)")
      .bind(crypto.randomUUID(), client.id, token, expiresAt)
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        token,
        client: { id: client.id, name: client.full_name, email: client.email },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}