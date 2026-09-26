# Remission Protocol — Architectural Reference

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS + Lucide React (`apps/web`)
- **Serverless API:** Cloudflare Pages Functions (`functions/api/`)
- **Database:** Cloudflare D1 (`remission-db`, binding `DB`)
- **Storage:** Cloudflare R2 (`remission-media`, binding `remission_media`)
- **Offline Telemetry:** Native IndexedDB (`RemissionOfflineDB`)
- **Test Automation:** Playwright E2E (`apps/web/e2e/`) + Vitest API Contracts (`apps/web/src/__tests__/`)
- **Config:** `wrangler.jsonc`

## Core Subsystems & Security Blueprint
1. **Decoupled Hero CMS Engine:** Independent copy and media background rotation with customizable vignette overlay opacity controls.
2. **Public Content Hub:** Non-lead magnet architecture. Direct downloadable PDFs and clinical monographs with custom cover embeds.
3. **Admin Platform:** Modular child components under `apps/web/src/components/admin/` (`HeroAdmin` → `AdminHeroTab`, `BlogAdmin`, `ResourceAdmin`) orchestrated by `AdminPage.jsx`, backed by client-side Canvas WebP auto-compression.
4. **Client Portal & Auth Guards:** `functions/api/client/_middleware.js` verifies a D1-backed `client_sessions` token from an `Authorization: Bearer` header on every `/api/client/*` route.
5. **PWA Offline Telemetry Engine:** `offlineDb.js` providing an offline metric queue in IndexedDB. Automatically flushes queued metrics to `/api/client/metrics` upon network restoration.
6. **Private Client Document Engine:**
   - `functions/api/client/documents.js`: List (GET) and upload (POST) client lab records under `private/clients/${client.id}/`.
   - `functions/api/client/documents/[key].js`: Guarded streaming download handler using `decodeURIComponent(params.key)` and verifying client ID path isolation.
   - `ClientDocumentsTab.jsx`: Modular UI for managing client medical records.
7. **Automated Testing Suite:**
   - **Playwright (`apps/web/playwright.config.js`):** E2E runner for browser-level tab switching and session token validation against the Wrangler emulator (`http://localhost:8788`).
   - **Vitest (`apps/web/vitest.config.js`):** Unit/contract tests verifying 401 unauthenticated enforcement and session authorization.

---

## 8. Admin Authentication Protocol (WebCrypto Standard)

There are **two separate auth systems**. Do not conflate them.

### 8.1 Admin sessions — `admin_session` cookie
- **Endpoints:** `POST /api/admin/login`, `GET /api/admin/verify`, `POST /api/admin/logout`.
- **Credential store:** D1 table `admins` (columns `id`, `email`, `name`, `password`, `verified`). `password` holds a lowercase SHA-256 hex digest.
- **Digest:** `crypto.subtle.digest('SHA-256', …)`, compared in constant time (`timingSafeEqualString`). A missing admin is compared against a dummy digest so the failure path costs about the same as a real check.
- **Token format:** `admin_session=<base64url(JSON payload)>.<hmac-sha256-hex signature>`.
  Payload: `{ sub, email, name, iat, exp }`.
- **Signing key:** HMAC-SHA-256 via `crypto.subtle`, keyed by the `ADMIN_SESSION_SECRET` binding. Tokens cannot be forged without it. A missing secret is a hard 500, never a silent unsigned session.
- **Cookie flags:** `Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800` (8 hours). Expiry is enforced server-side against `exp` on every verify.
- **Shared code:** `functions/_lib/adminSession.js` (crypto + cookie primitives) and `functions/_lib/requireAdmin.js` (per-route guard).
- **Guard placement:** each handler calls `const guard = await requireAdmin(context); if (guard) return guard;` at the top. A `_middleware.js` under `functions/api/admin/` was deliberately **not** used, because it would also gate `login.js` and deadlock authentication.
- **Seeding:** `node scripts/seed-admin.mjs --email <addr> [--remote]` generates a random 18-byte password, prints it once, and stores only the digest. There is no default credential in the repo.

### 8.2 Client sessions — `client_sessions` table
- Separate system for the `/portal` area. `functions/api/client/_middleware.js` resolves a bearer token against `client_sessions` joined to `client_profiles`, and populates `context.data.client`.
- Do not reuse `admin_session` for client routes or vice versa.

### 8.3 Known auth weaknesses
- SHA-256 is unsalted and fast. Tolerable only for high-entropy seeded secrets; migrate to PBKDF2/Argon2 before onboarding human-chosen passwords.
- `functions/api/admins.js` is a legacy route that authenticates on email alone with no password check. Do not use it; prefer `/api/admin/login`.

---

## 9. Media Upload & Canvas Auto-Compression Pipeline
- **Client-Side Engine:** `apps/web/src/lib/imageCompression.js` using the HTML5 Canvas API via `FileReader` → `Image` → `canvas.toBlob`.
- **Compression Specs:** longest edge clamped to `maxDimension: 1920px` (aspect ratio preserved), output `image/webp` at **quality `0.8`**, filename rewritten to `.webp`.
- **R2 Storage Pathing:**
  - Public assets: `/public/`
  - Private client assets: `private/clients/${client.id}/` (auth-guarded)
- **Gap:** there is no `/api/admin/upload` endpoint yet. `BlogAdmin.jsx` posts to it and falls back to a local object-URL preview when it fails, so cover images are not yet persisted to R2.

---

## 10. Architectural Rules
- **Modular Component Limit:** React components and admin modules must stay under 300 lines; target under 200. `AdminPage.jsx` was reduced 1235 → 87 lines this way.
- **SQLite Parameter Binding:** all D1 queries must use positional `?` placeholders — never string interpolation. (Exception: `scripts/seed-admin.mjs` interpolates, but validates the email against a strict allowlist regex first and generates all other values itself.)
- **No default credentials:** never commit a seeded password or session secret to source.
- **Schema is the source of truth:** column names differ per table and per migration. `podcast_episodes` uses `created`/`publish_date` (migration 0001), while `library_content` and `resources` are redefined in migration 0003 with `created_at`. Check `PRAGMA table_info` before writing a query — mismatches here produced silent 500s.
- **Error hygiene:** never return raw driver/SQL error text to a client; log server-side and return a generic message.
- **Do not fake completion:** an unimplemented tab must be reported as unimplemented, not stubbed with "Pending Implementation" UI that reads as finished work.
