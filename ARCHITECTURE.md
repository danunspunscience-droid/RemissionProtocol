# Remission Protocol — Architectural Reference

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS + Lucide React (`apps/web`)
- **Serverless API:** Cloudflare Pages Functions (`functions/api/`)
- **Database:** Cloudflare D1 (`remission-db`)
- **Storage:** Cloudflare R2 (`remission-media`)
- **Offline Telemetry:** Native IndexedDB (`RemissionOfflineDB`)
- **Test Automation:** Playwright E2E (`apps/web/e2e/`) + Vitest API Contracts (`apps/web/src/__tests__/`)

## Core Subsystems & Security Blueprint
1. **Decoupled Hero CMS Engine:** Independent copy and media background rotation with customizable vignette overlay opacity controls.
2. **Public Content Hub:** Non-lead magnet architecture. Direct downloadable PDFs and clinical monographs with custom cover embeds.
3. **Admin Platform:** Modular child components (`AdminHeroTab`, `AdminContentTab`, `AdminResourcesTab`) backed by client-side Canvas WebP auto-compression.
4. **Client Portal & Auth Guards:** Cloudflare Worker WebCrypto middleware (`functions/api/client/_middleware.js`) verifying D1 HMAC tokens for encrypted client metrics.
5. **PWA Offline Telemetry Engine:** `offlineDb.js` providing an offline metric queue in IndexedDB. Automatically flushes queued metrics to `/api/client/metrics` upon network restoration.
6. **Private Client Document Engine:**
 - `functions/api/client/documents.js`: List (GET) and upload (POST) client lab records under `private/clients/${client.id}/`.
 - `functions/api/client/documents/[key].js`: Guarded streaming download handler using `decodeURIComponent(params.key)` and verifying client ID path isolation.
 - `ClientDocumentsTab.jsx`: Modular UI (<200 lines) for managing client medical records.
7. **Automated Testing Suite:**
 - **Playwright (`playwright.config.js`):** E2E test runner executing browser-level tab switching and session token validation against Wrangler emulator (`http://localhost:8788`).
 - **Vitest (`vitest.config.js`):** Unit/contract tests verifying 401 unauthenticated enforcement and HMAC session authorization.