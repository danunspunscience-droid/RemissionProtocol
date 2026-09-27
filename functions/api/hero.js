export async function onRequest(context) {
  const { env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500 });
  }

  try {
    const copyRes = await env.DB.prepare(
      "SELECT * FROM hero_copy ORDER BY id DESC LIMIT 1"
    ).first();

    const sanitizedCopy = copyRes ? {
      ...copyRes,
      headline_color: copyRes.headline_color || '#ffffff',
      italic_color: copyRes.italic_color || '#c5a059',
      subheadline_color: copyRes.subheadline_color || '#a1a1aa',
      text_shadow_enabled: copyRes.text_shadow_enabled !== null && copyRes.text_shadow_enabled !== undefined ? Number(copyRes.text_shadow_enabled) : 1
    } : {};

    const { results: slides } = await env.DB.prepare(
      "SELECT * FROM hero_slides WHERE active = 1 ORDER BY sort_order ASC"
    ).all();

    return new Response(
      JSON.stringify({
        Copy: sanitizedCopy,
        Slides: slides || []
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}