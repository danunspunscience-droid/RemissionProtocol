# Remission Protocol — Architectural Reference

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS + Lucide React (`apps/web`)
- **Serverless API:** Cloudflare Pages Functions (`functions/api/`)
- **Database:** Cloudflare D1 (`remission-db`)
- **Storage:** Cloudflare R2 (`remission-media`)
- **Offline Telemetry Storage:** Native IndexedDB (`RemissionOfflineDB`)

## Core Subsystems & Security Architecture
1. **Decoupled Hero CMS Engine:** Independent copy and media background rotation with customizable vignette opacity controls.
2. **Public Content Hub:** Non-lead magnet compliance. Direct downloadable PDFs and clinical monographs with custom cover embeds.
3. **Admin Platform:** Modular child components (`AdminHeroTab`, `AdminContentTab`, `AdminResourcesTab`) backed by client-side Canvas WebP auto-compression.
4. **Client Portal & Auth Guards:** Cloudflare Worker WebCrypto middleware (`functions/api/client/_middleware.js`) verifying D1 HMAC tokens for encrypted client metrics.
5. **PWA Offline Telemetry Engine:** `offlineDb.js` providing an offline metric queue in IndexedDB. Automatically flushes queued metrics to `/api/client/metrics` upon network restoration.
6. **Private Client Document Engine:**
 - **Endpoint `functions/api/client/documents.js`:** List (GET) and upload (POST) client lab records under `private/clients/${client.id}/`.
 - **Endpoint `functions/api/client/documents/[key].js`:** Guarded streaming download handler using `decodeURIComponent(params.key)` and verifying client ID path isolation.
 - **UI Component `ClientDocumentsTab.jsx`:** Modular UI (<200 lines) for managing client medical records.
