export async function onRequestGet(context) {
  const { env, data } = context;
  const client = data.client;
  const clientId = client?.client_id || client?.id;
  const bucket = env.REMISSION_MEDIA || env.MEDIA_BUCKET;

  if (!bucket) {
    return new Response(JSON.stringify({ error: 'R2 bucket binding missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!clientId) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Client ID missing' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const prefix = `private/clients/${clientId}/`;
    const objects = await bucket.list({ prefix });

    const files = (objects.objects || []).map((obj) => ({
      key: obj.key,
      name: obj.key.replace(prefix, '').replace(/^\d+_/, ''),
      size: obj.size,
      uploadedAt: obj.uploaded,
    }));

    return new Response(JSON.stringify({ files }), {
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
  const { request, env, data } = context;
  const client = data.client;
  const clientId = client?.client_id || client?.id;
  const bucket = env.REMISSION_MEDIA || env.MEDIA_BUCKET;

  if (!bucket) {
    return new Response(JSON.stringify({ error: 'R2 bucket binding missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!clientId) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Client ID missing' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return new Response(JSON.stringify({ error: 'Valid file payload required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `private/clients/${clientId}/${Date.now()}_${sanitizedName}`;

    await bucket.put(key, file.stream(), {
      httpMetadata: { contentType: file.type || 'application/octet-stream' },
    });

    return new Response(
      JSON.stringify({ success: true, key, name: sanitizedName }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
