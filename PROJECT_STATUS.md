# Remission Protocol - Project Status

## Active Baseline: Stage 5 Complete (Admin CMS + WebCrypto Session Auth)
- **Active Branch:** `feature/admin-auth-cms` (ready for merge on main rig)
- **Backend Architecture:** Cloudflare Pages Functions (`functions/api/*`) + Cloudflare D1 (`remission-db`) + Cloudflare R2 (`remission-media`)
- **Build Status:** PASSING (`npm run build --prefix apps/web`, 2012 modules, ~4.5s)
- **Database Integrity:** PASSING (`PRAGMA foreign_key_check;` returned 0 rows)

---

## Accomplishments (Stage 5)

1. **WebCrypto Admin Authentication (HMAC-SHA-256 sessions):**
   - `functions/_lib/adminSession.js` — session primitives: `sha256Hex`, HMAC-SHA-256 signing via `crypto.subtle`, base64url serialization, timing-safe compare.
   - `functions/_lib/requireAdmin.js` — guard used by admin endpoints.
   - `functions/api/admin/login.js` (POST), `verify.js`, `logout.js` — login mints an HMAC-signed token; logout clears the cookie.
   - Cookie: HTTP-Only, `Secure`, `SameSite=Strict`, `Max-Age=28800` (8h TTL), signed with a deployment secret (login fails loudly if `ADMIN_SESSION_SECRET` is unset).
   - Credentials live in the D1 `admins` table (NOT `admin_users` — see Corrections below).

2. **Modular CMS Engine & Client-Side Canvas WebP Compression:**
   - `apps/web/src/lib/imageCompression.js` (54 lines) — HTML5 Canvas compress to WebP, `MAX_SIZE = 1920` px on the longest edge, aspect ratio preserved, `quality 0.8`.
   - `apps/web/src/components/admin/BlogAdmin.jsx` (134 lines) — articles/vlogs, video embeds, WebP cover overrides; sole consumer of `imageCompression`.
   - `apps/web/src/pages/AdminPage.jsx` (96 lines) — session verification gate + tabbed nav over `HeroAdmin`, `ResourceAdmin`, `BlogAdmin`.
   - `components/admin/HeroAdmin.jsx` (6 lines) and `ResourceAdmin.jsx` (9 lines) are thin re-export bridges to `AdminHeroTab.jsx` (63 lines) and the resources implementation.

3. **Client Portal Auth Scaffolding (Stage 6 groundwork, already in tree):**
   - `functions/api/client/_middleware.js` — Bearer-token guard joining `client_sessions` → `client_profiles`, rejecting expired tokens.
   - `functions/api/client/metrics.js`, `documents.js`, `documents/[key].js` — metric reads and R2 document access behind the guard.

---

## Corrections to Prior Session Notes

The following circulated as Stage 5 facts but are **not** true of this tree. Do not propagate them:
- There is no `admin_users` table and no `admin@remissionprotocol.com` / `password123` default credential. The table is `admins`, and the local DB currently has **no seeded admin rows** — admin login cannot be exercised locally until a row is inserted.
- `functions/api/client/_middleware.js` already exists, so it is not pending Stage 6 work.
- D1 tables `client_metrics`, `client_documents`, and `appointments` already exist locally; the Stage 6 migration for those names is not needed.
- `imageCompression.js` uses `quality 0.8`, not `0.82`.
- The last journal entries show `JSON.parse: unexpected character at line 1 column 1` on `/admin` — the admin route has a live client-side JSON parse bug that is **not** fixed.

---

## Immediate Resumption Plan (Main Rig)
1. `git checkout feature/admin-auth-cms && git pull origin feature/admin-auth-cms`
2. `git checkout main && git merge feature/admin-auth-cms`
3. Launch **Stage 6: Auth-Guarded Client Portal & PWA Metric Foundation**:
   - Seed a real `admins` row (or a proper provisioning path) so admin auth is testable end to end.
   - Fix the `/admin` JSON.parse failure before adding portal work.
   - Refactor `ClientPortalPage.jsx` to render physical performance and biomarker charts from the existing `client_metrics` table.
