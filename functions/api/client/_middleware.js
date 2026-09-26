export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Bypass auth check for login route
  if (url.pathname === '/api/client/login') {
    return next();
  }

  const cookieHeader = request.headers.get('Cookie') || '';
  const match = cookieHeader.match(/client_session=([^;]+)/);

  if (!match) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Client session required.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const sessionData = JSON.parse(atob(match[1]));

    if (Date.now() > sessionData.exp) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Client session expired.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Attach authenticated client identity to request context
    context.data.clientUser = sessionData;
    return next();
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized: Invalid session token.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}