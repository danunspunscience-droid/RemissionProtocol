export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500 });
  }

  try {
    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        "SELECT * FROM hero_slides WHERE active = 1 ORDER BY sort_order ASC"
      ).all();
      return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } });
    }

    if (method === 'POST') {
      const slide = await request.json();
      const res = await env.DB.prepare(
        `INSERT INTO hero_slides (image_url, sort_order, display_duration_ms, transition_speed_ms, overlay_opacity, overlay_color, object_position, active, ken_burns_mode, zoom_scale)
         VALUES (?,?,?,?,?,?,?,?,?,?)`
      ).bind(
        slide.image_url,
        slide.sort_order ?? 0,
        slide.display_duration_ms ?? 6000,
        slide.transition_speed_ms ?? 1200,
        slide.overlay_opacity ?? 60,
        slide.overlay_color || '#022c22',
        slide.object_position || 'center 30%',
        slide.active ?? 1,
        slide.ken_burns_mode || 'zoom-in',
        slide.zoom_scale ?? 1.08
      ).run();

      return new Response(JSON.stringify({ success: true, id: res.meta.last_row_id }), { status: 201 });
    }

    if (method === 'PUT') {
      const { slides } = await request.json();
      if (Array.isArray(slides)) {
        for (const s of slides) {
          if (s.id && typeof s.id === 'number') {
            await env.DB.prepare(
              `UPDATE hero_slides SET
                sort_order = ?, display_duration_ms = ?, transition_speed_ms = ?,
                overlay_opacity = ?, overlay_color = ?, object_position = ?, active = ?,
                ken_burns_mode = ?, zoom_scale = ?
               WHERE id = ?`
            ).bind(
              s.sort_order,
              s.display_duration_ms,
              s.transition_speed_ms,
              s.overlay_opacity,
              s.overlay_color || '#022c22',
              s.object_position,
              s.active ?? 1,
              s.ken_burns_mode || 'zoom-in',
              s.zoom_scale ?? 1.08,
              s.id
            ).run();
          }
        }
      }
      return new Response(JSON.stringify({ success: true }));
    }

    if (method === 'DELETE') {
      const url = new URL(request.url);
      const id = url.searchParams.get('id');
      if (id) {
        await env.DB.prepare("DELETE FROM hero_slides WHERE id = ?").bind(id).run();
      }
      return new Response(JSON.stringify({ success: true }));
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
