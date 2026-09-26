/**
 * GET /api/admin/verify
 * Session-validation guard used by AdminPage before rendering CMS modules.
 */
import { verifySession, readSessionCookie } from '../../_lib/adminSession.js';

export async function onRequestGet({ request, env }) {
  let session;
  try {
    session = await verifySession(env, readSessionCookie(request));
  } catch (err) {
    // Missing secret => sessions cannot be trusted.
    console.error('Admin verify unavailable:', err.message);
    return Response.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  if (!session) {
    return Response.json({ authed: false }, { status: 401 });
  }

  return Response.json({
    authed: true,
    admin: { id: session.sub, email: session.email, name: session.name },
    expiresAt: session.exp,
  });
}

export async function onRequest() {
  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
