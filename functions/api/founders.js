export const onRequestGet = async ({ env }) => {
  try {
    const result = await env.DB.prepare(
      "SELECT * FROM founders WHERE status = 'published' ORDER BY sort_order"
    ).all();
    
    return new Response(JSON.stringify(result.results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch founders' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestPost = async ({ env, request }) => {
  try {
    const { name, slug, title, bio, photo, status, sort_order } = await request.json();
    
    // Basic validation
    if (!name || !slug) {
      return new Response(JSON.stringify({ error: 'Name and slug are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const result = await env.DB.prepare(
      "INSERT INTO founders (name, slug, title, bio, photo, status, sort_order) VALUES (@name, @slug, @title, @bio, @photo, @status, @sort_order)"
    ).bind({
      name,
      slug,
      title: title || null,
      bio: bio || null,
      photo: photo || null,
      status: status || 'draft',
      sort_order: sort_order || 0
    }).run();
    
    return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create founder' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestPut = async ({ env, request }) => {
  try {
    const { id } = await request.json();
    const { name, slug, title, bio, photo, status, sort_order } = await request.json();
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const result = await env.DB.prepare(
      "UPDATE founders SET name = @name, slug = @slug, title = @title, bio = @bio, photo = @photo, status = @status, sort_order = @sort_order WHERE id = @id"
    ).bind({
      id,
      name,
      slug,
      title: title || undefined,
      bio: bio || undefined,
      photo: photo || undefined,
      status: status || undefined,
      sort_order: sort_order || undefined
    }).run();
    
    if (result.meta.changes === 0) {
      return new Response(JSON.stringify({ error: 'Founder not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true, id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update founder' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestDelete = async ({ env, request }) => {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const result = await env.DB.prepare(
      "DELETE FROM founders WHERE id = @id"
    ).bind({
      id
    }).run();
    
    if (result.meta.changes === 0) {
      return new Response(JSON.stringify({ error: 'Founder not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete founder' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};