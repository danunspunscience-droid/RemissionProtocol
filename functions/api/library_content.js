export const onRequestGet = async ({ env }) => {
  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM library_content ORDER BY created DESC"
    ).all();

    // Map database column names to match frontend React expectations
    const formatted = (results || []).map((item) => ({
      ...item,
      type: item.content_type || item.type || 'article',
      cover_image: item.featured_image || item.cover_image || '',
      content: item.excerpt || item.key_insight || item.content || '',
    }));

    return Response.json(formatted);
  } catch (error) {
    return Response.json({ error: error.message || 'Database fetch failed' }, { status: 500 });
  }
};

export const onRequestPost = async ({ env, request }) => {
  try {
    const formData = await request.formData();
    const title = formData.get('title') || '';
    const excerpt = formData.get('content') || formData.get('excerpt') || '';
    const content_type = formData.get('type') || formData.get('content_type') || 'article';
    const status = formData.get('status') || 'draft';
    const featured = formData.get('featured') === 'true' ? 1 : 0;
    const youtube_url = formData.get('youtube_url') || '';

    let featured_image = '';
    const file = formData.get('cover_image') || formData.get('featured_image');
    if (file && typeof file === 'object' && file.name) {
      featured_image = `${Date.now()}-${file.name}`;
      const bucket = env.MEDIA_BUCKET || env.remission_media;
      if (bucket) {
        await bucket.put(featured_image, file.stream(), {
          httpMetadata: { contentType: file.type }
        });
      }
    }

    const { meta } = await env.DB.prepare(`
      INSERT INTO library_content (title, excerpt, content_type, status, featured, youtube_url, featured_image, created)
      VALUES (?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
    `).bind(title, excerpt, content_type, status, featured, youtube_url, featured_image).run();

    return Response.json({ success: true, id: meta?.last_row_id }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const onRequestPut = async ({ env, request }) => {
  try {
    const formData = await request.formData();
    const url = new URL(request.url);
    const id = url.searchParams.get('id') || formData.get('id');

    if (!id) {
      return Response.json({ error: 'ID required for update' }, { status: 400 });
    }

    const title = formData.get('title');
    const excerpt = formData.get('content') || formData.get('excerpt');
    const content_type = formData.get('type') || formData.get('content_type');
    const status = formData.get('status');
    const featured = formData.get('featured') !== null ? (formData.get('featured') === 'true' ? 1 : 0) : null;

    await env.DB.prepare(`
      UPDATE library_content SET
        title = COALESCE(?, title),
        excerpt = COALESCE(?, excerpt),
        content_type = COALESCE(?, content_type),
        status = COALESCE(?, status),
        featured = COALESCE(?, featured)
      WHERE id = ?
    `).bind(title || null, excerpt || null, content_type || null, status || null, featured, id).run();

    return Response.json({ success: true, id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const onRequestDelete = async ({ env, request }) => {
  try {
    const url = new URL(request.url);
    let id = url.searchParams.get('id');
    
    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch (_) {}
    }

    if (!id) {
      return Response.json({ error: 'ID required' }, { status: 400 });
    }

    await env.DB.prepare("DELETE FROM library_content WHERE id = ?").bind(id).run();
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};