# Remission Protocol — Architecture & System Directives

## Tech Stack & Directory Topography
- **Project Root:** `/mnt/SSD1/projects/RemissionProtocol`
- **Frontend App:** `apps/web` (React 18 + Vite + TypeScript + Tailwind CSS + Lucide React)
- **Edge API Engine:** `functions/api/` (Cloudflare Pages Functions)
- **Master Configuration:** `wrangler.jsonc` (Root level bindings & compatibility rules)
- **Database:** Cloudflare D1 (`env.DB` / `remission-db`)
- **Object Storage:** Cloudflare R2 (`env.BUCKET` / `remission-media`)

## Dual Type-Safety Architecture
- **Web App Scope (`apps/web/tsconfig.json`):** DOM & Vite bundler environment (`moduleResolution: "bundler"`). Excludes `functions/`.
- **Edge API Scope (`functions/tsconfig.json`):** Cloudflare Workers runtime environment (`types: ["@cloudflare/workers-types"]`). Excludes DOM/web code.

## Cloudflare Binding Maps & Invariants
- **D1 Database (`env.DB`):**
  - Always use prepared statements (`env.DB.prepare(...)`) with positional `?` placeholders.
  - Singleton CMS tables (`hero_copy`, `site_settings`) MUST read and write strictly targeting canonical record `id = 1` using atomic SQLite `UPSERT` statements.
  - Schema migrations MUST be sequential in `migrations/000X_description.sql` and applied locally via `npx wrangler d1 migrations apply remission-db --local`.
- **R2 Storage (`env.BUCKET`):**
  - Access buckets strictly through `env.BUCKET`.
  - Always decode storage keys with `decodeURIComponent(params.key)`.
  - Explicitly set `httpMetadata: { contentType: ... }` on file writes and handle binary stream piping.
  - **Storage Paths:** Unauthenticated public files reside in `/public/`. Private patient records and metric data reside in `/private/clients/{client_id}/` guarded by `functions/api/client/_middleware.ts`.

## Core System & Domain Invariants
1. **Config Hardening:** `wrangler.jsonc` and all JSON configs MUST NOT contain external `$schema` URLs to prevent IDE untrusted-location security blocks.
2. **Non-Lead Magnet Philosophy:** All public resources, PDFs, and guides MUST be freely downloadable without email acquisition forms or lead-capture gates.
3. **Decoupled Hero CMS Engine:** Hero text copy and background media assets rotate independently via CMS scheduling parameters or manual triggers.
4. **Vite Cleanliness:** `apps/web/vite.config.js` must remain lean (React plugin, `@` path aliases, local proxy to port `8790`). Ban external iframe hooks, monkey-patches, or external CORS origin arrays.
5. **Shared API Schema:** All `functions/api/` endpoints must format responses using `functions/api/_utils/response.ts`. Frontend calls must cast JSON responses: `(await res.json()) as InterfaceName`.

## System Verification Commands
- **Dual Type Check:** `(cd apps/web && npx tsc --noEmit) && npx tsc --noEmit -p functions/tsconfig.json`
- **Dead Code Audit:** `npx knip`
- **Local Development Server:** `./start_dev_server.sh` or `npx wrangler pages dev apps/web/dist --port 8790`
