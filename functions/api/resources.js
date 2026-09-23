export const onRequestGet = async ({ env }) => {
  try {
    const result = await env.DB.prepare(
      "SELECT * FROM resources WHERE members_only = false ORDER BY title"
    ).all();
    
    return new Response(JSON.stringify(result.results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch resources' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};