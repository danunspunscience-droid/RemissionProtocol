export async function onRequestPost(context) {
  const { env } = context;
  const db = env.DB || env.remission_db;

  if (!db) {
    return new Response(JSON.stringify({ error: 'D1 binding missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const clientId = 'client_test_001';
    const email = 'test@remissionprotocol.com';
    const token = 'test_client_token_12345';
    const expiresAt = new Date(Date.now() + 864000000).toISOString();

    await db
      .prepare(
        "INSERT OR REPLACE INTO client_profiles (id, email, password_hash, full_name, status) VALUES (?,?, 'hashed_pass_123', 'Dr. Daniel Test Client', 'active')"
      )
      .bind(clientId, email)
      .run();

    await db
      .prepare("INSERT OR REPLACE INTO client_sessions (id, client_id, token, expires_at) VALUES (?,?,?,?)")
      .bind('session_test_001', clientId, token, expiresAt)
      .run();

    await db
      .prepare(
        "INSERT OR REPLACE INTO client_metrics (id, client_id, metric_type, metric_value, unit, notes) VALUES (?,?, 'glucose', 88.5, 'mg/dL', 'Baseline fasting glucose')"
      )
      .bind('metric_001', clientId)
      .run();

    await db
      .prepare(
        "INSERT OR REPLACE INTO client_metrics (id, client_id, metric_type, metric_value, unit, notes) VALUES (?,?, 'ketones', 1.2, 'mmol/L', 'Post-fasting ketones')"
      )
      .bind('metric_002', clientId)
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test client seeded. Set localStorage item: rp_client_token = test_client_token_12345',
        token,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}