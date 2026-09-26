import { requireAdmin } from '../../_lib/requireAdmin.js';

/**
 * Admin resource library endpoint.
 * `resources` is redefined by migrations/0003 with a `created_at` column.
 */
export async function onRequestGet(context) {
  const guard = await requireAdmin(context);
  if (guard) return guard;
  const { env } = context;
  const db = env.DB || env.remission_db;
  try {
    const { results } = await db
      .prepare("SELECT * FROM resources ORDER BY created_at DESC")
      .all();
    return Response.json(results || []);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  const guard = await requireAdmin(context);
  if (guard) return guard;
  const { env, request } = context;
  const db = env.DB || env.remission_db;
  try {
    const body = await request.json();
    if (!body.title) {
      return Response.json({ error: 'title is required' }, { status: 400 });
    }
    const id = crypto.randomUUID();

    await db
      .prepare(
        `INSERT INTO resources
           (id, title, description, file_key, category, status, created_at)
         VALUES (?, ?, ?, ?, ?, 'published', datetime('now'))`,
      )
      .bind(
        id,
        body.title,
        body.description || '',
        body.file_key || '',
        body.category || 'Guide',
      )
      .run();

    return Response.json({ success: true, id });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
