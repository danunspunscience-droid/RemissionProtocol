export async function onRequestGet(context) {
  const { env, data } = context;
  const clientId = data.clientUser.id;

  try {
    const { results } = await env.DB.prepare(
      'SELECT id, metric_type, value, unit, notes, recorded_at FROM client_metrics WHERE client_id = ? ORDER BY recorded_at DESC LIMIT 100'
    ).bind(clientId).all();

    return new Response(JSON.stringify(results || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch metrics', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost(context) {
  const { request, env, data } = context;
  const clientId = data.clientUser.id;

  try {
    const { metric_type, value, unit, notes } = await request.json();

    if (!metric_type || value === undefined || !unit) {
      return new Response(JSON.stringify({ error: 'metric_type, value, and unit are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const metricId = `metric-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    await env.DB.prepare(
      'INSERT INTO client_metrics (id, client_id, metric_type, value, unit, notes) VALUES (?,?,?,?,?,?)'
    ).bind(metricId, clientId, metric_type, value, unit, notes || null).run();

    return new Response(JSON.stringify({ success: true, id: metricId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to record metric', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}