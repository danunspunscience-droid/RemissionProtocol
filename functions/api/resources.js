export async function onRequestGet(context) {
  const { env } = context;

  try {
    const db = env.DB || env.remission_db;
    if (!db) {
      return new Response(JSON.stringify({ error: 'D1 database binding missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await db
      .prepare("SELECT id, title, description, file_key, category, created_at FROM resources WHERE status = ? ORDER BY created_at DESC")
      .bind('published')
      .all();

    return new Response(JSON.stringify(results || []), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}