# Remission Protocol — Architectural Reference

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS + Lucide React (`apps/web`)
- **Serverless API:** Cloudflare Pages Functions (`functions/api/`)
- **Database:** Cloudflare D1 (`remission-db`)
- **Storage:** Cloudflare R2 (`remission-media`)

## Core Subsystems
1. **Decoupled Hero CMS Engine:** Dynamic rotation of copy and video/image media backgrounds with adjustable vignette overlay opacity sliders.
2. **Public Content Hub:** Non-lead magnet architecture. Downloadable PDF guides, clinical monographs, and custom cover video embeds.
3. **Admin Platform:** Modular tabs (`AdminHeroTab`, `AdminContentTab`, `AdminResourcesTab`) backed by client-side Canvas WebP auto-compression.
4. **Client Portal & Auth Guards:** Cloudflare Worker WebCrypto middleware verifying D1 HMAC tokens for encrypted client metrics.