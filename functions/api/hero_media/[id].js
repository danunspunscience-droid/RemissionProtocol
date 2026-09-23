export const onRequestPut = async ({ env, params, request }) => {
  try {
    const id = params.id;
    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    // Parse incoming JSON or FormData request
    let data = {};
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    const status = data.status;
    const headline = data.headline;
    const subheading = data.subheading;

    // If publishing this item, set all other hero media items to draft first
    if (status === 'published') {
      await env.DB.prepare("UPDATE hero_media SET status = 'draft' WHERE id != ?").bind(id).run();
    }

    await env.DB.prepare(`
      UPDATE hero_media SET
        headline = COALESCE(?, headline),
        subheading = COALESCE(?, subheading),
        status = COALESCE(?, status)
      WHERE id = ?
    `).bind(
      headline || null,
      subheading || null,
      status || null,
      id
    ).run();

    return Response.json({ success: true, id });
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to update hero media' }, { status: 500 });
  }
};

export const onRequestDelete = async ({ env, params }) => {
  try {
    const id = params.id;
    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    await env.DB.prepare("DELETE FROM hero_media WHERE id = ?").bind(id).run();
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to delete hero media' }, { status: 500 });
  }
};