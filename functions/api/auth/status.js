export const onRequestGet = async ({ env, request }) => {
  const cookieHeader = request.headers.get('Cookie') || '';
  const match = cookieHeader.match(/session=([^;]+)/);
  if (!match) {
    return Response.json({ authed: false }, { status: 401 });
  }
  const sessionToken = match[1];
  try {
    const { results } = await env.DB.prepare(
      'SELECT user_id FROM sessions WHERE token = ? AND expires > datetime("now") LIMIT 1'
    ).bind(sessionToken).all();
    if (results.length === 0) {
      return Response.json({ authed: false }, { status: 401 });
    }
    const userId = results[0].user_id;
    const { results: userResults } = await env.DB.prepare(
      'SELECT id, email FROM users WHERE id = ? LIMIT 1'
    ).bind(userId).all();
    if (userResults.length === 0) {
      return Response.json({ authed: false }, { status: 401 });
    }
    const user = userResults[0];
    return Response.json({ authed: true, user: { id: user.id, email: user.email } });
  } catch (err) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
};