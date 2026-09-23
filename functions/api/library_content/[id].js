export const onRequestPut = async ({ env, params, request }) => {
  try {
    const id = params.id;
    let data = {};
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    const status = data.status;
    const featured = data.featured !== undefined ? (data.featured ? 1 : 0) : null;

    await env.DB.prepare(`
      UPDATE library_content SET
        status = COALESCE(?, status),
        featured = COALESCE(?, featured)
      WHERE id = ?
    `).bind(status || null, featured, id).run();

    return Response.json({ success: true, id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const onRequestDelete = async ({ env, params }) => {
  try {
    const id = params.id;
    await env.DB.prepare("DELETE FROM library_content WHERE id = ?").bind(id).run();
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};