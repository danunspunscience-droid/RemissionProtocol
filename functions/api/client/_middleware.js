export async function onRequest(context) {
  const { request, env } = context;
  const db = env.DB || env.remission_db;

  if (!db) {
    return new Response(JSON.stringify({ error: 'D1 binding missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const authHeader = request.headers.get('Authorization');
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : null;

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Missing authentication token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const session = await db
      .prepare(
        "SELECT s.client_id, c.email, c.full_name FROM client_sessions s JOIN client_profiles c ON s.client_id = c.id WHERE s.token = ? AND s.expires_at > datetime('now')"
      )
      .bind(token)
      .first();

    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid or expired session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    context.data.client = session;
    return await context.next();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Authentication verification failed', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}