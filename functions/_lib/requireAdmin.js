/**
 * Per-route admin session guard.
 * Usage inside a handler:
 *   const guard = await requireAdmin(context);
 *   if (guard) return guard;
 */
import { verifySession, readSessionCookie } from '../_lib/adminSession.js';

export async function requireAdmin(context) {
  const { request, env } = context;
  let session;
  try {
    session = await verifySession(env, readSessionCookie(request));
  } catch (err) {
    console.error('Admin auth unavailable:', err.message);
    return Response.json({ error: 'Server misconfigured' }, { status: 500 });
  }
  if (!session) {
    return Response.json(
      { error: 'Unauthorized: invalid or expired admin session' },
      { status: 401 },
    );
  }
  context.data.admin = session;
  return null;
}
