export const onRequestGet = async ({ env }) => {
  try {
    const result = await env.DB.prepare(
      "SELECT * FROM podcast_episodes WHERE status = 'published' ORDER BY publish_date DESC, created DESC"
    ).all();
    
    return new Response(JSON.stringify(result.results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch podcast episodes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};