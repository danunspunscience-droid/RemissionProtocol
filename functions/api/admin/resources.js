export async function onRequestGet(context) {
  const { env } = context;
  try {
    const db = env.DB || env.remission_db;
    const { results } = await db.prepare("SELECT * FROM resources ORDER BY created_at DESC").all();
    return new Response(JSON.stringify(results || []), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const db = env.DB || env.remission_db;
    const body = await request.json();
    const id = crypto.randomUUID();

    await db.prepare(
      "INSERT INTO resources (id, title, description, file_key, category, status, created_at) VALUES (?, ?, ?, ?, ?, 'published', datetime('now'))"
    ).bind(id, body.title, body.description, body.file_key, body.category || 'Guide').run();

    return new Response(JSON.stringify({ success: true, id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}