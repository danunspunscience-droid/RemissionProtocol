export async function onRequest(context) {
  const { request, env, params } = context;
  const method = request.method;

  // 1. Enforce Edge Binding Guard
  if (!env.STORAGE) {
    return new Response(JSON.stringify({ error: "STORAGE binding missing. Update Cloudflare Pages Dashboard." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  // 2. Sanitize and Reconstruct Key Path
  let rawPathArray = Array.isArray(params.path) ? params.path : [params.path || ''];
  let cleanPathArray = rawPathArray.filter(segment => segment && segment !== '.' && segment !== '..');
  const key = decodeURIComponent(cleanPathArray.join('/'));

  if (!key) {
    return new Response(JSON.stringify({ error: "Missing or invalid object key path" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    if (method === 'GET') {
      const object = await env.STORAGE.get(key);
      if (!object) {
        return new Response(JSON.stringify({ error: "File not found", key }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);

      let contentType = headers.get('content-type');
      if (!contentType || contentType === 'application/octet-stream') {
        if (key.endsWith('.webp')) contentType = 'image/webp';
        else if (key.endsWith('.png')) contentType = 'image/png';
        else if (key.endsWith('.jpg') || key.endsWith('.jpeg')) contentType = 'image/jpeg';
        else if (key.endsWith('.svg')) contentType = 'image/svg+xml';
        else contentType = 'image/webp';
        headers.set('content-type', contentType);
      }

      headers.set('etag', object.httpEtag);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');

      return new Response(object.body, { headers });
    }

    if (method === 'POST' || method === 'PUT') {
      const buffer = await request.arrayBuffer();
      if (buffer.byteLength === 0) {
        return new Response(JSON.stringify({ error: "Empty request body payload" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      let contentType = request.headers.get('content-type');
      if (!contentType || contentType === 'application/octet-stream') {
        contentType = key.endsWith('.webp') ? 'image/webp' : 'application/octet-stream';
      }

      await env.STORAGE.put(key, buffer, {
        httpMetadata: { contentType }
      });

      const publicUrl = `/api/files/${key}`;
      return new Response(JSON.stringify({ success: true, key, url: publicUrl, size: buffer.byteLength }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'DELETE') {
      await env.STORAGE.delete(key);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}