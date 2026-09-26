#!/usr/bin/env node
/**
 * Seeds an initial admin into D1 with a SHA-256 password digest.
 *
 * Generates a high-entropy random password, prints it ONCE, and never
 * stores it in the repo. Run with:
 *   node scripts/seed-admin.mjs --email you@remissionprotocol.com [--local|--remote]
 *
 * The digest written to `admins.password` is what functions/api/admin/login.js
 * compares against, so the plaintext must be captured from stdout at seed time.
 */
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const emailArg = args.indexOf('--email');
const email = emailArg !== -1 ? args[emailArg + 1] : null;
const remote = args.includes('--remote');

if (!email) {
  console.error('Usage: node scripts/seed-admin.mjs --email <admin@email> [--remote]');
  process.exit(1);
}

// Strict allowlist: the email is interpolated into SQL below, so anything
// outside a plain address shape is rejected rather than escaped.
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (!EMAIL_RE.test(email)) {
  console.error('Invalid email address.');
  process.exit(1);
}

const normalizedEmail = email.toLowerCase();
const password = randomBytes(18).toString('base64url');
const passwordHash = createHash('sha256').update(password, 'utf8').digest('hex');
const id = randomUUID();
const sql = `INSERT OR REPLACE INTO admins (id, email, name, password, verified, created_at)
VALUES ('${id}', '${normalizedEmail}', 'Administrator', '${passwordHash}', 1, datetime('now'));`;

const flag = remote ? '--remote' : '--local';
execFileSync(
  'npx',
  ['wrangler', 'd1', 'execute', 'remission-db', flag, '--command', sql],
  { stdio: 'inherit' },
);

console.log('\n──────────────────────────────────────────────');
console.log('  Admin seeded: ' + normalizedEmail);
console.log('  Password (shown once, not stored):');
console.log('  ' + password);
console.log('──────────────────────────────────────────────\n');
