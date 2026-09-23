// Helper to extract ID from URL query params, URL path, or FormData
function extractId(request, formData = null) {
  const url = new URL(request.url);
  
  let id = url.searchParams.get('id');
  if (id) return id;

  const pathSegments = url.pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  if (lastSegment && lastSegment !== 'hero_media' && !isNaN(lastSegment)) {
    return lastSegment;
  }

  if (formData && formData.get('id')) {
    return formData.get('id');
  }

  return null;
}

export const onRequestGet = async ({ env }) => {
  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM hero_media ORDER BY created DESC"
    ).all();
    
    return Response.json(results || []);
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to fetch hero media' }, { status: 500 });
  }
};

export const onRequestPost = async ({ env, request }) => {
  try {
    const formData = await request.formData();
    
    const headline = formData.get('headline') || '';
    const subheading = formData.get('subheading') || '';
    const cta_label = formData.get('cta_label') || '';
    const cta_link = formData.get('cta_link') || '';
    const object_position = formData.get('object_position') || 'center';
    const video_autoplay = formData.get('video_autoplay') === 'true' ? 1 : 0;
    const video_muted = formData.get('video_muted') === 'true' ? 1 : 0;
    const video_loop = formData.get('video_loop') === 'true' ? 1 : 0;
    const video_controls = formData.get('video_controls') === 'true' ? 1 : 0;
    const status = formData.get('status') || 'draft';
    const file = formData.get('file');
    const media_type = formData.get('media_type') || (file && typeof file === 'object' && file.type?.startsWith('video/') ? 'video' : 'image');
    
    if (!headline) {
      return Response.json({ error: 'Headline is required' }, { status: 400 });
    }
    
    // Upload to Cloudflare R2 bucket if file present
    let file_key = '';
    if (file && typeof file === 'object' && file.name) {
      file_key = `${Date.now()}-${file.name}`;
      const bucket = env.MEDIA_BUCKET || env.remission_media;
      if (bucket) {
        await bucket.put(file_key, file.stream(), {
          httpMetadata: { contentType: file.type }
        });
      }
    }
    
    const result = await env.DB.prepare(`
      INSERT INTO hero_media 
      (headline, subheading, cta_label, cta_link, object_position, video_autoplay, video_muted, video_loop, video_controls, status, file, media_type, created) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
    `).bind(
      headline,
      subheading,
      cta_label,
      cta_link,
      object_position,
      video_autoplay,
      video_muted,
      video_loop,
      video_controls,
      status,
      file_key,
      media_type
    ).run();
    
    return Response.json({ success: true, id: result.meta?.last_row_id }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to create hero media' }, { status: 500 });
  }
};

export const onRequestPut = async ({ env, request }) => {
  try {
    const formData = await request.formData();
    const id = extractId(request, formData);
    
    if (!id) {
      return Response.json({ error: 'ID is required for update' }, { status: 400 });
    }
    
    const headline = formData.get('headline');
    const subheading = formData.get('subheading');
    const cta_label = formData.get('cta_label');
    const cta_link = formData.get('cta_link');
    const object_position = formData.get('object_position');
    const video_autoplay = formData.get('video_autoplay') !== null ? (formData.get('video_autoplay') === 'true' ? 1 : 0) : null;
    const video_muted = formData.get('video_muted') !== null ? (formData.get('video_muted') === 'true' ? 1 : 0) : null;
    const video_loop = formData.get('video_loop') !== null ? (formData.get('video_loop') === 'true' ? 1 : 0) : null;
    const video_controls = formData.get('video_controls') !== null ? (formData.get('video_controls') === 'true' ? 1 : 0) : null;
    const status = formData.get('status');
    const file = formData.get('file');
    const media_type = formData.get('media_type');
    
    let file_key = null;
    if (file && typeof file === 'object' && file.name) {
      file_key = `${Date.now()}-${file.name}`;
      const bucket = env.MEDIA_BUCKET || env.remission_media;
      if (bucket) {
        await bucket.put(file_key, file.stream(), {
          httpMetadata: { contentType: file.type }
        });
      }
    }
    
    await env.DB.prepare(`
      UPDATE hero_media SET 
        headline = COALESCE(?, headline),
        subheading = COALESCE(?, subheading),
        cta_label = COALESCE(?, cta_label),
        cta_link = COALESCE(?, cta_link),
        object_position = COALESCE(?, object_position),
        video_autoplay = COALESCE(?, video_autoplay),
        video_muted = COALESCE(?, video_muted),
        video_loop = COALESCE(?, video_loop),
        video_controls = COALESCE(?, video_controls),
        status = COALESCE(?, status),
        file = COALESCE(?, file),
        media_type = COALESCE(?, media_type)
      WHERE id = ?
    `).bind(
      headline || null,
      subheading || null,
      cta_label || null,
      cta_link || null,
      object_position || null,
      video_autoplay,
      video_muted,
      video_loop,
      video_controls,
      status || null,
      file_key,
      media_type || null,
      id
    ).run();
    
    return Response.json({ success: true, id });
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to update hero media' }, { status: 500 });
  }
};

export const onRequestDelete = async ({ env, request }) => {
  try {
    let id = extractId(request);

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch (_) {}
    }
    
    if (!id) {
      return Response.json({ error: 'ID is required for deletion' }, { status: 400 });
    }
    
    await env.DB.prepare("DELETE FROM hero_media WHERE id = ?").bind(id).run();
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to delete hero media' }, { status: 500 });
  }
};