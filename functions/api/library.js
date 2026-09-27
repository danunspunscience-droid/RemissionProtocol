export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500 });
  }

  try {
    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        "SELECT * FROM library_content ORDER BY published_at DESC"
      ).all();
      return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } });
    }

    if (method === 'POST') {
      const item = await request.json();
      const res = await env.DB.prepare(
        `INSERT INTO library_content (title, slug, category, description, video_url, custom_cover_url)
         VALUES (?,?,?,?,?,?)`
      ).bind(
        item.title,
        item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        item.category || 'Metabolic Medicine',
        item.description || '',
        item.video_url || '',
        item.custom_cover_url || ''
      ).run();

      return new Response(JSON.stringify({ success: true, id: res.meta.last_row_id }), { status: 201 });
    }

    if (method === 'DELETE') {
      const url = new URL(request.url);
      const id = url.searchParams.get('id');
      if (id) {
        await env.DB.prepare("SELECT * FROM library_content WHERE id = ?").bind(id).run(); // verify or delete
        await env.DB.prepare("DELETE FROM library_content WHERE id = ?").bind(id).run();
      }
      return new Response(JSON.stringify({ success: true }));
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
