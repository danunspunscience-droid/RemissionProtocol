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

      const sanitized = copy ? {
        ...copy,
        headline_color: copy.headline_color || '#ffffff',
        italic_color: copy.italic_color || '#c5a059',
        subheadline_color: copy.subheadline_color || '#a1a1aa',
        text_shadow_enabled: copy.text_shadow_enabled !== null && copy.text_shadow_enabled !== undefined ? Number(copy.text_shadow_enabled) : 1
      } : {};

      return new Response(JSON.stringify(sanitized), { headers: { 'Content-Type': 'application/json' } });
    }

    if (method === 'POST') {
      const data = await request.json();
      const existing = await env.DB.prepare(
        "SELECT id FROM hero_copy ORDER BY id DESC LIMIT 1"
      ).first();

      if (existing && existing.id) {
        await env.DB.prepare(
          `UPDATE hero_copy SET
            eyebrow_tag = ?, headline_prefix = ?, headline_italic = ?, subheadline = ?,
            headline_color = ?, italic_color = ?, subheadline_color = ?, text_shadow_enabled = ?
           WHERE id = ?`
        ).bind(
          data.eyebrow_tag || '',
          data.headline_prefix || '',
          data.headline_italic || '',
          data.subheadline || '',
          data.headline_color || '#ffffff',
          data.italic_color || '#c5a059',
          data.subheadline_color || '#a1a1aa',
          data.text_shadow_enabled !== undefined ? (data.text_shadow_enabled ? 1 : 0) : 1,
          existing.id
        ).run();
      } else {
        await env.DB.prepare(
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
          data.text_shadow_enabled !== undefined ? (data.text_shadow_enabled ? 1 : 0) : 1
        ).run();
      }

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}