# Remission Protocol — Architectural Specification

## Architecture Overview
- **Frontend:** React + Vite + Tailwind CSS + Lucide React (`apps/web`)
- **API Layer:** Cloudflare Pages Functions (`functions/api/*`)
- **Database:** Cloudflare D1 (`remission-db`) SQLite relational database
- **Storage:** Cloudflare R2 (`remission-media`) with auto-compressed WebP image uploads
- **Deployment:** Cloudflare Pages continuously deployed via Wrangler CLI (`--branch=main`)

---

## Durable API Endpoints
- `/api/hero`: Aggregate endpoint returning normalized `{ copy: {...}, slides: [...] }`.
- `/api/hero_copy`: GET latest hero copy / POST single-row upsert with custom typography colors.
- `/api/hero_slides`: GET active slides / POST new slide / PUT array update / DELETE by ID.
- `/api/library`: GET all library items / POST new video lecture / DELETE by ID.
- `/api/resources`: GET all resource assets / POST new downloadable protocol PDF / DELETE by ID.
- `/api/files/public/*`: Public R2 media bucket handler with WebP compression for hero slides and video covers.

---

## Component Structure & Standards
- **Line Count Budget:** Every component file MUST remain strictly under 200 lines to prevent context fragmentation and maintain modular assembly.
- **D1 Prepared Statements:** All SQL queries MUST bind parameters using positional `?` placeholders.
- **Non-Lead Magnet Standard:** Public protocols and PDF guides are served open-access with direct download links and zero gated email lead capture.
