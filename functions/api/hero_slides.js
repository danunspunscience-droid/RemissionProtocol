export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;

  try {
    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        "SELECT * FROM hero_slides WHERE active = 1 ORDER BY sort_order ASC, id ASC"
      ).all();
      return new Response(JSON.stringify(results || []), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'POST') {
      const body = await request.json();
      const { image_url, sort_order, display_duration_ms, transition_speed_ms, overlay_opacity, object_position } = body;

      const { success } = await env.DB.prepare(
        `INSERT INTO hero_slides (image_url, sort_order, display_duration_ms, transition_speed_ms, overlay_opacity, object_position)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(
        image_url,
        sort_order || 0,
        display_duration_ms || 6000,
        transition_speed_ms || 1200,
        overlay_opacity ?? 60,
        object_position || 'center 30%'
      ).run();

      return new Response(JSON.stringify({ success }), { status: 201 });
    }

    if (method === 'PUT') {
      const { slides } = await request.json();
      if (!Array.isArray(slides)) return new Response("Invalid slides array", { status: 400 });

      for (const slide of slides) {
        await env.DB.prepare(
          `UPDATE hero_slides
           SET sort_order = ?, display_duration_ms = ?, transition_speed_ms = ?, overlay_opacity = ?, object_position = ?, active = ?
           WHERE id = ?`
        ).bind(
          slide.sort_order,
          slide.display_duration_ms,
          slide.transition_speed_ms,
          slide.overlay_opacity,
          slide.object_position,
          slide.active ?? 1,
          slide.id
        ).run();
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (method === 'DELETE') {
      const slideId = url.searchParams.get('id');
      if (!slideId) return new Response("Missing id parameter", { status: 400 });
      await env.DB.prepare("DELETE FROM hero_slides WHERE id = ?").bind(slideId).run();
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
