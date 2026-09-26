/**
 * POST /api/admin/logout
 * Clears the admin session cookie.
 */
import { buildClearedCookie } from '../../_lib/adminSession.js';

export async function onRequestPost() {
  return Response.json(
    { success: true },
    { status: 200, headers: { 'Set-Cookie': buildClearedCookie() } },
  );
}

export async function onRequest() {
  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
