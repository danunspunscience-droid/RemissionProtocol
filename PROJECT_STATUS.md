# Remission Protocol - Project Status

## Active Baseline: Stage 5 Complete (Integrated Admin CMS & Admin Auth)
- **Active Branch:** `feature/admin-auth-cms` (ready for merge into `main`)
- **Backend Architecture:** Cloudflare Pages Functions (`functions/api/*`) + D1 (`remission-db`) + R2 (`remission-media`, binding `remission_media`)
- **Build Status:** Passing (`npm run build --prefix apps/web`)
- **Database Integrity:** Passing (`PRAGMA foreign_key_check;` returns 0 violations)
- **Config:** `wrangler.jsonc`

### Carried forward from earlier milestones
- 100% decoupled from PocketBase; all runtime pages and modules use native Pages Functions.
- Public routes: `/api/hero_media`, `/api/founders`, `/api/resources?all=true`, `/api/contact_requests`, `/api/files/`.
- Playwright suite `apps/web/e2e/public-routes.spec.js` (6/6 passing) and Vitest contracts in `apps/web/src/__tests__/`.

---

## Session Accomplishments

### 1. Modular Admin CMS Refactor
- `AdminPage.jsx` reduced from **1235 lines to 87** — now a thin orchestrator that verifies the session and switches between tabs.
- New tab modules under `apps/web/src/components/admin/`:
  - `BlogAdmin.jsx` (134 lines) — articles, vlogs, podcast entries.
  - `HeroAdmin.jsx` (6 lines) — bridge re-exporting the existing `AdminHeroTab` implementation.
  - `ResourceAdmin.jsx` (9 lines) — **still a placeholder**, see Known Gaps.
- `LoginPage.jsx` (93 lines) — admin sign-in form wired to `/api/admin/login`.

### 2. Client-Side Canvas Compression
- `apps/web/src/lib/imageCompression.js` (54 lines) — HTML5 Canvas pipeline that resizes to `maxDimension: 1920px` and converts to `image/webp` at **quality `0.8`**.

### 3. Admin Authentication Engine (new this session)
The admin panel previously called `/api/admin/login` and `/api/admin/verify`, which **did not exist** — the admin area could not authenticate at all. Both are now implemented and verified end-to-end against the Wrangler emulator.

- `functions/_lib/adminSession.js` — WebCrypto primitives: SHA-256 digests, HMAC-SHA-256 session signing, constant-time comparison, cookie builders.
- `functions/_lib/requireAdmin.js` — per-route guard returning 401 for missing/invalid/expired sessions.
- `functions/api/admin/login.js` — credential check against D1 `admins`, issues an 8-hour signed cookie.
- `functions/api/admin/verify.js` — session validation used by `AdminPage` on mount.
- `functions/api/admin/logout.js` — clears the cookie.
- `scripts/seed-admin.mjs` — seeds an admin with a **randomly generated** password printed once and never stored.
- `functions/api/admin/{hero,content,resources}.js` — were completely unauthenticated; now guarded by `requireAdmin`.
- `AdminPage.jsx` "Exit" now calls `/api/admin/logout` instead of merely navigating to `/login`.

Session format: `admin_session=<base64url(payload)>.<hmac-sha256-hex>`, flags `HttpOnly; Secure; SameSite=Strict; Max-Age=28800`. The signing key comes from the `ADMIN_SESSION_SECRET` binding; `wrangler.jsonc` carries a **local-development-only** default that must be overridden in production with `wrangler pages secret put ADMIN_SESSION_SECRET`.

### 4. Pre-existing Bugs Found and Fixed
- **Invalid SQL in migrations.** `migrations/0001_initial_schema.sql` and `schema.sql` contained `DATETIME(\"now\")` — backslash-escaped quotes inside a single-quoted literal. The migration could never be applied from scratch. Fixed to `DATETIME('now')`.
- **Column mismatches.** `functions/api/admin/content.js` ordered `podcast_episodes` by `created_at`, but that table is only defined in migration 0001 and uses `created`. Both admin endpoints returned 500. Corrected, and the podcast insert now matches the real column set.

---

## Verified Test Results
Against `wrangler pages dev` on port 8788 (17/17 passing):

| Check | Result |
|---|---|
| `verify` with no cookie | 401 |
| `hero` / `content` / `resources` with no cookie | 401 |
| Login, wrong password | 401 `Invalid credentials` |
| Login, unknown email | 401 `Invalid credentials` |
| Login, missing fields | 400 |
| Login, malformed body | 400 |
| Login, GET verb | 405 |
| Login, correct credentials | 200 + `Set-Cookie` |
| `verify` with valid cookie | 200 `authed: true` |
| `hero` / `resources` / `content` with cookie | 200 |
| Content insert (article + podcast) | 200 |
| Resources insert | 200 |
| Post with missing title | 400 |
| Tampered cookie signature | 401 |
| Forged payload with invalid signature | 401 |
| Logout clears cookie | `Max-Age=0` |

Build: `2012 modules transformed`, clean. `PRAGMA foreign_key_check` → 0 rows.

---

## Known Gaps
- `ResourceAdmin.jsx` renders a "Pending Implementation" placeholder. The Resources tab is navigable but non-functional.
- `BlogAdmin.jsx` posts to `/api/admin/upload`, which **does not exist**. Cover-image uploads fall back to a local object-URL preview; nothing is persisted to R2.
- `functions/api/auth.js`, `functions/api/auth/*` and `functions/api/admins.js` are legacy, largely unconnected paths. `admins.js` in particular authenticates on email alone with no password check.
- SHA-256 password hashing is unsalted and fast. Acceptable only because seeded passwords are high-entropy; migrate to PBKDF2/Argon2 before any human-chosen password.
- The local D1 state is split across two SQLite files; the `wrangler d1 execute --local` CLI and `wrangler pages dev` do not always resolve the same one. Seeding through one and testing through the other can appear to "lose" data.

---

## Recommended Next Steps
1. Implement `ResourceAdmin.jsx` against the now-authenticated `/api/admin/resources`.
2. Add `/api/admin/upload` (R2, `remission_media`) and wire `BlogAdmin` cover uploads to it.
3. Delete or quarantine the legacy `functions/api/auth*` and `functions/api/admins.js` paths.
4. Merge `feature/admin-auth-cms` into `main`.
