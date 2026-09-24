export async function onRequestGet(context) {
  const { env, data, params } = context;
  const client = data.client;
  const clientId = client?.client_id || client?.id;
  const bucket = env.REMISSION_MEDIA || env.MEDIA_BUCKET;

  if (!bucket) {
    return new Response(JSON.stringify({ error: 'R2 bucket binding missing' }), { status: 500 });
  }

  if (!clientId) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Client ID missing' }), { status: 401 });
  }

  const rawKey = params.key;
  if (!rawKey) {
    return new Response(JSON.stringify({ error: 'File key parameter missing' }), { status: 400 });
  }

  const key = decodeURIComponent(rawKey);

  // Security Guard: Ensure clients can only access their own private storage partition
  if (!key.startsWith(`private/clients/${clientId}/`)) {
    return new Response(JSON.stringify({ error: 'Forbidden: Access restricted to authorized client partition' }), { status: 403 });
  }

  try {
    const object = await bucket.get(key);
    if (!object) {
      return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Content-Disposition', `attachment; filename="${key.split('_').slice(1).join('_') || 'document'}"`);

    return new Response(object.body, { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
