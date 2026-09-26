import { requireAdmin } from '../../_lib/requireAdmin.js';

/**
 * Admin CMS content endpoint.
 *
 * Column shapes follow migrations/0001 + 0003:
 *  - library_content  : ordered by `created_at` (0003 shape)
 *  - podcast_episodes : ordered by `created`      (0001 shape, never redefined in 0003)
 */
export async function onRequestGet(context) {
  const guard = await requireAdmin(context);
  if (guard) return guard;
  const { env } = context;
  const db = env.DB || env.remission_db;
  try {
    const { results: content } = await db
      .prepare("SELECT * FROM library_content ORDER BY created_at DESC")
      .all();
    const { results: podcasts } = await db
      .prepare("SELECT * FROM podcast_episodes ORDER BY created DESC")
      .all();
    return Response.json({ content: content || [], podcasts: podcasts || [] });
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

    if (body.type === 'podcast') {
      await db
        .prepare(
          `INSERT INTO podcast_episodes
             (id, title, description, duration, audio_file, author_name, status, publish_date, created, updated)
           VALUES (?, ?, ?, ?, ?, ?, 'published', datetime('now'), datetime('now'), datetime('now'))`,
        )
        .bind(
          id,
          body.title,
          body.summary || body.description || '',
          body.duration || '',
          body.audio_file || body.video_url || '',
          body.author_name || 'Remission Protocol',
        )
        .run();
    } else {
      await db
        .prepare(
          `INSERT INTO library_content
             (id, title, category, summary, body_text, key_insight, video_url, cover_url,
              media_type, status, published_at, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', datetime('now'), datetime('now'))`,
        )
        .bind(
          id,
          body.title,
          body.category || 'Clinical Article',
          body.summary || '',
          body.body_text || '',
          body.key_insight || '',
          body.video_url || '',
          body.cover_url || '',
          body.media_type || 'article',
        )
        .run();
    }

    return Response.json({ success: true, id });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
