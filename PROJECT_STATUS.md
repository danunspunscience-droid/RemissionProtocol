# Remission Protocol — Project Status

**Last Updated:** Session Baseline
**Current Stage:** Stage 1 Verified (Database Schema & Hydration Complete)
**Active Branch:** `main`

---

### Key Accomplishments
- Configured Cloudflare Pages, D1 (`remission-db`), and R2 (`remission-media`) local stack.
- Synchronized Git environment across desktop and ThinkPad X1 with automated `start-session` / `end-session` scripts.
- Hydrated D1 schema and seed data (founders, research profiles, public resources).
- Configured Hermes skills (`/remission-engineering`, `/remission-codebase-analysis`).

---

### Current Architecture State
- **Database:** Local D1 active with 15 application tables: `admins`, `users`, `site_settings`, `hero_copy`, `hero_assets`, `hero_media`, `library_content`, `resources`, `podcast_episodes`, `founders`, `contact_requests`, `membership_applications`, `client_documents`, `appointments`, and `client_metrics`.
- **Storage:** Local R2 bucket configured as `remission-media`; Functions accept either `MEDIA_BUCKET` or the configured `remission_media` binding.
- **Frontend:** React/Vite application with 11 registered routes in `apps/web/src/App.jsx`; mixed data paths remain: PocketBase for the live hero, founders, member resources, contact requests, and membership applications; Cloudflare Pages Functions for public resources, library content, podcast episodes, and admin content.
- **Documentation:** `CODEBASE_MAP.md` maps active routes, functions, HTTP methods, tables, R2 use, and frontend consumers; `GAP_ANALYSIS_CURRENT.md` records Phase 2 drift and integration gaps.

---

### Active Stage Priorities (Stage 2 & 3)
1. [ ] Implement client-side WebP image auto-compression prior to R2 uploads.
2. [ ] Fix filename space decoding (`decodeURIComponent`) in `functions/api/files/[key].js`.
3. [ ] Build Decoupled Hero CMS API and overlay opacity management.
4. [ ] Refactor `AdminPage.jsx` to interface directly with D1/R2 serverless endpoints.

---

### Known Issues / Blockers
- `schema.sql` does not define the active `contact_requests`, `membership_applications`, and `hero_media` tables; the local D1 database contains them.
- `schema.sql` defines `client_documents`, `appointments`, and `client_metrics`, but no matching Cloudflare Functions or frontend route currently consume them.
- The frontend still depends on PocketBase for hero media, founders, member resources, contact requests, membership applications, and podcast audio resolution.
- The public resource endpoint is GET-only, while the admin content UI expects create/update/delete support for resources.
- The podcast episode endpoint is GET-only, while the admin UI expects create/update/delete support for podcast episodes.
- `functions/api/files/[key].js` reads `params.key` directly; filenames containing spaces or URL-encoded characters can fail to resolve.
- R2 upload bindings work, but there are no dedicated R2 metadata/delete endpoints.
- Authentication is demonstrative: `auth/status.js` always reports an authenticated admin and `auth/login.js` accepts the seeded admin email without validating the password hash.
- `AdminPage.jsx` calls `/api/hero_media/{id}` and `/api/library_content/{id}` with JSON updates; those dynamic routes do not expose the required methods.
- `products`, `/store`, and `/product/{id}` are referenced by the ecommerce code but are not registered routes in `App.jsx`.

---

### Session Restoration Steps
1. Confirm the working tree is clean before continuing: `git status --short`.
2. Re-run the local D1 schema check: `npx wrangler d1 execute remission-db --local --command "PRAGMA table_list;"`.
3. Re-run the frontend build and foreign-key check from the root workspace: `npm run build --prefix apps/web && npx wrangler d1 execute remission-db --local --command "PRAGMA foreign_key_check;"`.
4. Review `CODEBASE_MAP.md` for route and endpoint ownership before changing a page or function.
5. Review `GAP_ANALYSIS_CURRENT.md` before implementing a fix; do not generate or execute discrete Phase 3 task cards until Daniel approves the Phase 2 analysis.

---

### Verification (Halt-on-Fail)
- [x] Phase 1 reconnaissance completed: local D1 tables, Functions, routes, media components, and frontend fetch calls mapped.
- [x] Phase 2 gap analysis completed: schema drift, endpoint coverage, R2 binding/streaming, frontend expectations, and auth concerns recorded.
- [ ] Frontend build and D1 foreign-key verification completed during this session.
- [ ] Daniel approval of `GAP_ANALYSIS_CURRENT.md` received.

---

### Approval Gate
Phase 3 task-card generation is intentionally paused. No discrete implementation cards have been generated. Daniel must review and explicitly approve `GAP_ANALYSIS_CURRENT.md` before implementation work proceeds.
