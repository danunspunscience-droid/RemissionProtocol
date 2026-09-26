export async function onRequestGet(context) {
  const { params, env, data } = context;
  const clientId = data.clientUser.id;

  if (!params.key) {
    return new Response(JSON.stringify({ error: 'File key parameter is required.' }), { status: 400 });
  }

  const rawKey = decodeURIComponent(params.key);
  const expectedPrefix = `private/clients/${clientId}/`;

  // Enforce directory isolation guard
  if (!rawKey.startsWith(expectedPrefix)) {
    return new Response(JSON.stringify({ error: 'Access denied: Path outside client scope.' }), { status: 403 });
  }

  try {
    const bucket = env.R2 || env.MEDIA_BUCKET;
    if (!bucket) {
      return new Response(JSON.stringify({ error: 'R2 storage binding unavailable.' }), { status: 500 });
    }

    const object = await bucket.get(rawKey);
    if (!object) {
      return new Response(JSON.stringify({ error: 'Requested client document not found.' }), { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'private, max-age=3600');

    return new Response(object.body, { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'File retrieval failure', details: err.message }), { status: 500 });
  }
}