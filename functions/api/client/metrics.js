export async function onRequestGet(context) {
  const { env, data } = context;
  const client = data.client;

  try {
    const db = env.DB || env.remission_db;
    const { results } = await db
      .prepare("SELECT * FROM client_metrics WHERE client_id = ? ORDER BY recorded_at DESC LIMIT 100")
      .bind(client.client_id)
      .all();

    return new Response(JSON.stringify({ client: { name: client.full_name, email: client.email }, metrics: results || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestPost(context) {
  const { env, request, data } = context;
  const client = data.client;

  try {
    const db = env.DB || env.remission_db;
    const { metric_type, metric_value, unit, notes } = await request.json();

    if (!metric_type || metric_value === undefined || !unit) {
      return new Response(JSON.stringify({ error: 'Missing required metric fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = crypto.randomUUID();
    await db
      .prepare(
        "INSERT INTO client_metrics (id, client_id, metric_type, metric_value, unit, notes, recorded_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))"
      )
      .bind(id, client.client_id, metric_type, metric_value, unit, notes || '')
      .run();

    return new Response(JSON.stringify({ success: true, id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
