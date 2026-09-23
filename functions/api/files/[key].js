export const onRequestGet = async ({ env, params }) => {
  try {
    const key = params.key;

    if (!key) {
      return new Response("File key required", { status: 400 });
    }

    const bucket = env.MEDIA_BUCKET || env.remission_media;
    if (!bucket) {
      return new Response("R2 Storage bucket binding missing", { status: 500 });
    }

    const object = await bucket.get(key);

    if (!object) {
      return new Response("File not found in R2", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=31536000");

    return new Response(object.body, { headers });
  } catch (error) {
    return new Response(`Storage Error: ${error.message}`, { status: 500 });
  }
};