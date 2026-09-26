import fs from 'fs';
import crypto from 'crypto';

const email = process.argv[2] || 'admin@metxbootcamp.com';
const password = process.argv[3] || 'RemissionAdmin2026!';

if (!email || !password) {
 console.error('Usage: node scripts/seed-admin-prod.js <email> <password>');
 process.exit(1);
}

const hashHex = crypto.createHash('sha256').update(password).digest('hex');

const sqlContent = `-- Production Admin Credential Seed
INSERT OR REPLACE INTO admins (email, password, name)
VALUES ('${email.replace(/'/g, "''")}', '${hashHex}', 'Administrator');
`;

fs.writeFileSync('scripts/seed-admin.sql', sqlContent);
console.log(`Generated scripts/seed-admin.sql for email: ${email}`);
console.log(`Temporary Password set to: ${password}`);
