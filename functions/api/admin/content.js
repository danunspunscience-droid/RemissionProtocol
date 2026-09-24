export async function onRequestGet(context) {
  const { env } = context;
  try {
    const db = env.DB || env.remission_db;
    const { results: content } = await db.prepare("SELECT * FROM library_content ORDER BY created_at DESC").all();
    const { results: podcasts } = await db.prepare("SELECT * FROM podcast_episodes ORDER BY created_at DESC").all();
    return new Response(JSON.stringify({ content: content || [], podcasts: podcasts || [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
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

    if (body.type === 'podcast') {
      await db.prepare(
        "INSERT INTO podcast_episodes (id, title, summary, video_url, cover_url, status, published_at, created_at) VALUES (?, ?, ?, ?, ?, 'published', datetime('now'), datetime('now'))"
      ).bind(id, body.title, body.summary, body.video_url, body.cover_url).run();
    } else {
      await db.prepare(
        "INSERT INTO library_content (id, title, category, summary, body_text, key_insight, video_url, cover_url, media_type, status, published_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', datetime('now'), datetime('now'))"
      ).bind(id, body.title, body.category || 'Clinical Article', body.summary, body.body_text || '', body.key_insight || '', body.video_url || '', body.cover_url || '', body.media_type || 'article').run();
    }

    return new Response(JSON.stringify({ success: true, id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}