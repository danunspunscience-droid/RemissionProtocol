export async function onRequest(context) {
  const { request, env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500 });
  }

  try {
    const copyRes = await env.DB.prepare(
      "SELECT * FROM hero_copy ORDER BY id DESC LIMIT 1"
    ).first();

    const { results: slides } = await env.DB.prepare(
      "SELECT * FROM hero_slides WHERE active = 1 ORDER BY sort_order ASC"
    ).all();

    return new Response(
      JSON.stringify({
        copy: copyRes || {},
        slides: slides || []
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
