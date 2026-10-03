import { jsonResponse, errorResponse } from './_utils/response';

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare(
      `SELECT id, title, description, category, r2_key, download_count, members_only, published, created_at, slug
       FROM resource_assets ORDER BY id DESC`
    ).all();
    return jsonResponse({ success: true, data: results });
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to fetch resource assets', 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as {
      title: string;
      description?: string;
      category?: string;
      r2_key: string;
      members_only?: boolean;
      published?: boolean;
    };

    if (!body.title || !body.r2_key) {
      return errorResponse('Title and r2_key are required', 400);
    }

    const res = await context.env.DB.prepare(
      `INSERT INTO resource_assets (title, description, category, r2_key, members_only, published)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(
        body.title,
        body.description || '',
        body.category || 'Protocol',
        body.r2_key,
        body.members_only ? 1 : 0,
        body.published !== false ? 1 : 0
      )
      .run();

    return jsonResponse({ success: true, id: res.meta.last_row_id });
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to create resource asset', 500);
  }
};
