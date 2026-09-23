export const onRequestPost = async ({ env, request }) => {
  try {
    const { email, password } = await request.json();
    
    // Basic validation
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // In a real implementation, you would verify credentials and return a JWT
    // For now, we'll check if the admin exists in the database
    const result = await env.DB.prepare(
      "SELECT * FROM admins WHERE email = @email"
    ).bind({
      email
    }).first();
    
    if (!result) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // In a real app, you would verify the password hash and create a JWT token
    // For this example, we'll just return success (in production, use proper auth)
    return new Response(JSON.stringify({ success: true, admin: { id: result.id, email: result.email } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to authenticate' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};