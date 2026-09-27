export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500 });
  }

  try {
    if (method === 'GET') {
      const copy = await env.DB.prepare(
        "SELECT * FROM hero_copy ORDER BY id DESC LIMIT 1"
      ).first();
      return new Response(JSON.stringify(copy || {}), { headers: { 'Content-Type': 'application/json' } });
    }

    if (method === 'POST') {
      const data = await request.json();
      const res = await env.DB.prepare(
        `INSERT INTO hero_copy (eyebrow_tag, headline_prefix, headline_italic, subheadline, headline_color, italic_color, subheadline_color, text_shadow_enabled)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        data.eyebrow_tag || '',
        data.headline_prefix || '',
        data.headline_italic || '',
        data.subheadline || '',
        data.headline_color || '#ffffff',
        data.italic_color || '#c5a059',
        data.subheadline_color || '#a1a1aa',
        data.text_shadow_enabled ?? 1
      ).run();

      return new Response(JSON.stringify({ success: true, id: res.meta.last_row_id }), { status: 201 });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
