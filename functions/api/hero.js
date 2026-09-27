export async function onRequest(context) {
  const { env } = context;
  try {
    const copyRes = await env.DB.prepare("SELECT * FROM hero_copy WHERE status = 'active' ORDER BY created_at DESC LIMIT 1").first();
    const { results: slides } = await env.DB.prepare(
      "SELECT * FROM hero_slides WHERE active = 1 ORDER BY sort_order ASC, id ASC"
    ).all();

    const copy = copyRes || {
      eyebrow: 'CONCIERGE HEALTH COACHING · CANCER SURVIVORS · AUSTIN, TX',
      headline_prefix: 'Live Beyond',
      headline_italic: 'the Prognosis.',
      subheadline: 'For high-achievers who have cleared active treatment and refuse to simply wait. Physician guidance and elite coaching on one team — reclaiming vitality after cancer, metabolic syndrome, and serious illness. Not disease management. Survivorship excellence.',
      primary_cta_text: 'Request a Consultation →',
      primary_cta_url: '/consultation'
    };

    return new Response(JSON.stringify({ copy, slides: slides || [] }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
