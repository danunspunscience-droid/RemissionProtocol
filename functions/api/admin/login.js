/**
 * POST /api/admin/login
 * Authenticates an admin against D1 `admins` and issues an HMAC-signed
 * HTTP-only session cookie.
 */
import {
  SESSION_TTL_SECONDS,
  assertSecretConfigured,
  buildSessionCookie,
  sha256Hex,
  signSession,
  timingSafeEqualString,
} from '../../_lib/adminSession.js';

export async function onRequestPost({ request, env }) {
  const db = env.DB || env.remission_db;
  if (!db) {
    return Response.json({ error: 'D1 database binding missing' }, { status: 500 });
  }

  let email;
  let password;
  try {
    ({ email, password } = await request.json());
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return Response.json({ error: 'Email and password are required' }, { status: 400 });
  }

  // Fail loudly on a misconfigured deployment rather than minting a token.
  try {
    assertSecretConfigured(env);
  } catch (err) {
    console.error('Admin login unavailable:', err.message);
    return Response.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  let admin;
  try {
    admin = await db
      .prepare('SELECT id, email, name, password FROM admins WHERE email = ?')
      .bind(email.trim().toLowerCase())
      .first();
  } catch (err) {
    // Never surface raw driver/SQL text to the client.
    console.error('Admin login query failed:', err.message);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }

  // Compare against a dummy digest when the admin is missing so the failure
  // path costs roughly the same as a real password check.
  const storedHash = admin && admin.password ? admin.password : await sha256Hex('__absent__');
  const candidateHash = await sha256Hex(password);
  const passwordOk = timingSafeEqualString(storedHash, candidateHash);

  if (!admin || !admin.password || !passwordOk) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const now = Math.floor(Date.now() / 1000);
  const session = {
    sub: admin.id,
    email: admin.email,
    name: admin.name || '',
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const signed = await signSession(env, JSON.stringify(session));

  return Response.json(
    { success: true, admin: { id: admin.id, email: admin.email, name: admin.name } },
    { status: 200, headers: { 'Set-Cookie': buildSessionCookie(signed) } },
  );
}

/** Any non-POST verb is unsupported on this route. */
export async function onRequest() {
  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
