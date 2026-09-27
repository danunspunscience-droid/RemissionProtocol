export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST' && request.method !== 'PUT') {
    return new Response("Method not allowed", { status: 405 });
  }
  try {
    const body = await request.json();
    const { eyebrow, headline_prefix, headline_italic, subheadline, primary_cta_text, primary_cta_url } = body;

    await env.DB.prepare(
      `INSERT INTO hero_copy (id, eyebrow, headline_prefix, headline_italic, subheadline, primary_cta_text, primary_cta_url, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'))`
    ).bind(
      crypto.randomUUID(),
      eyebrow || '',
      headline_prefix || '',
      headline_italic || '',
      subheadline || '',
      primary_cta_text || 'Request a Consultation →',
      primary_cta_url || '/consultation'
    ).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
