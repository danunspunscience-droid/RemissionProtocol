import { jsonResponse, errorResponse } from './_utils/response';

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare(
      `SELECT id, title, category, summary, body_text, key_insight, video_url, cover_url, media_type, status, published_at, created_at, slug, description FROM library_content ORDER BY created_at DESC`
    ).all();
    return jsonResponse({ success: true, data: results });
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to fetch library content', 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as {
      title: string;
      category?: string;
      summary?: string;
      body_text?: string;
      video_url?: string;
      cover_url?: string;
      media_type?: string;
      status?: string;
    };

    if (!body.title) {
      return errorResponse('Title is required', 400);
    }

    const res = await context.env.DB.prepare(
      `INSERT INTO library_content (title, category, summary, body_text, video_url, cover_url, media_type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        body.title,
        body.category || 'General',
        body.summary || '',
        body.body_text || '',
        body.video_url || '',
        body.cover_url || '',
        body.media_type || 'article',
        body.status || 'published'
      )
      .run();

    return jsonResponse({ success: true, id: res.meta.last_row_id });
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to create library item', 500);
  }
};
