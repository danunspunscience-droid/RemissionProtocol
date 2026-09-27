# Remission Protocol — Project Status & Roadmap

## Current Status
- **Active Stage:** Stage 5 Complete / Transitioning to Stage 6 (Auth-Guarded Client Portal & PWA Metric Foundation)
- **Active Branch:** `main` (Synchronized with `origin/main`)
- **Deployment Target:** `https://remission-protocol.pages.dev` (Cloudflare Pages Production)

---

## Accomplishments (Stage 4 & Stage 5)
1. **Stage 4 — Public Content Hub & Open Access Distribution:**
   - Created D1 tables `library_content` and `resource_assets`.
   - Implemented `/api/library` and `/api/resources` supporting GET, POST, and DELETE operations.
   - Built `LibraryPage.jsx` with YouTube/Vimeo video embeds and high-res custom R2 cover overrides.
   - Built `ResourcesPage.jsx` providing ungated protocol PDF asset downloads reflecting the non-lead-magnet philosophy.

2. **Stage 5 — Integrated Admin Dashboard CMS:**
   - Refactored `AdminPage.jsx` into a modular, tabbed control hub (`Hero Engine`, `Content Library`, `Clinical Resources`).
   - Created `HeroAdmin.jsx` (<200 lines) supporting Ken Burns scale settings, object position controls, display durations, native HTML color swatch pickers (`overlay_color`), and opacity sliders.
   - Extended `hero_copy` schema and `/api/hero_copy` to persist custom typography colors (`headline_color`, `italic_color`, `subheadline_color`) and contrast drop-shadow toggles (`text_shadow_enabled`).
   - Implemented single-row SQL upsert logic and non-null JSON normalization in `/api/hero_copy` and `/api/hero` to ensure robust database persistence.
   - Created `LibraryAdmin.jsx` and `ResourcesAdmin.jsx` for client-side WebP compression/upload of custom video covers and raw document upload of protocol PDFs directly to Cloudflare R2.

---

## Active Database Schemas (Cloudflare D1: `remission-db`)
- `hero_copy`: `id`, `eyebrow_tag`, `headline_prefix`, `headline_italic`, `subheadline`, `headline_color`, `italic_color`, `subheadline_color`, `text_shadow_enabled`, `created_at`
- `hero_slides`: `id`, `image_url`, `sort_order`, `display_duration_ms`, `transition_speed_ms`, `overlay_opacity`, `overlay_color`, `object_position`, `active`, `ken_burns_mode`, `zoom_scale`
- `library_content`: `id`, `title`, `slug`, `category`, `description`, `video_url`, `custom_cover_url`, `published_at`, `created_at`
- `resource_assets`: `id`, `title`, `slug`, `category`, `description`, `file_url`, `file_size_bytes`, `created_at`

---

## Next Restoration & Roadmap Steps (Stage 6)
1. **Worker Auth Guards:** Implement Cloudflare Worker session middleware (`functions/api/client/*`) verifying D1 user sessions and role permissions.
2. **Private Client Vault:** Establish secure R2 paths `/private/clients/{client_id}/` for isolated client health records and diagnostic PDFs.
3. **Client Metric Engine:** Create D1 schema (`client_metrics`) to support metabolic, physical performance, and bio-marker tracking for high-achieving cancer survivors.
