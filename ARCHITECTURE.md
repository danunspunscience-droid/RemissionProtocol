# Remission Protocol — Architectural Reference

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS + Lucide React (`apps/web`)
- **Serverless API:** Cloudflare Pages Functions (`functions/api/`)
- **Database:** Cloudflare D1 (`remission-db`)
- **Storage:** Cloudflare R2 (`remission-media`)
- **Offline Storage:** Native IndexedDB (`RemissionOfflineDB`)

## Core Subsystems
1. **Decoupled Hero CMS Engine:** Independent copy and video/image media rotation with vignette opacity slider controls.
2. **Public Content Hub:** Non-lead magnet architecture serving un-gated PDF guides, clinical monographs, and custom cover video embeds.
3. **Admin Platform:** Modular tabs (`AdminHeroTab`, `AdminContentTab`, `AdminResourcesTab`) backed by client-side Canvas WebP auto-compression.
4. **Client Portal & Auth Guards:** Worker WebCrypto middleware intercepting `/api/client/*` endpoints with session verification against D1.
5. **PWA Offline Telemetry Engine:** `offlineDb.js` providing an offline metric queue in IndexedDB. When network connectivity is restored (`online` event), `ClientPortalPage.jsx` automatically flushes pending metrics to `/api/client/metrics`.
