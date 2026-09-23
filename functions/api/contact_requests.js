export const onRequestPost = async ({ env, request }) => {
  try {
    const { name, email, phone, topic, message } = await request.json();
    
    // Basic validation
    if (!name || !email || !topic || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Insert into contact_requests table
    const result = await env.DB.prepare(
      "INSERT INTO contact_requests (name, email, phone, topic, message) VALUES (?, ?, ?, ?, ?)"
    ).bind(
      name,
      email,
      phone || null,
      topic,
      message
    ).run();
    
    return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to submit contact request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};