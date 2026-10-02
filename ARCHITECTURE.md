# Remission Protocol — System Architecture & Design Decisions

## Core Tech Stack
- **Frontend:** React 18 + Vite + TypeScript (`apps/web`)
- **Edge API:** Cloudflare Pages Functions (`functions/api/`)
- **Database:** Cloudflare D1 (`remission-db`)
- **Storage:** Cloudflare R2 (`remission-media`)

## Durable System Decisions

### 1. D1 Singleton Tables (`hero_copy`)
- Single-row CMS configurations (such as hero copy and site branding) MUST write and read exclusively using `id = 1`.
- API endpoints use atomic SQLite `UPSERT` statements (`INSERT INTO ... VALUES (1, ...) ON CONFLICT(id) DO UPDATE SET ...`) to guarantee single-record database consistency.

### 2. Edge-First LCP Initial Paint Pattern
- Public components (`HeroSection.jsx`) MUST render a static, high-contrast baseline on tick zero (initial mount) rather than displaying loading spinners or blocking renders on `fetch()` calls.
- API network requests (`/api/hero`) run asynchronously in the background to re-hydrate state without delaying Largest Contentful Paint (LCP).

### 3. Zero-Idle Animation Standard
- Full-bleed hero visuals must avoid continuous matrix scale transforms (`transform: scale()`) to preserve GPU clocks and main-thread responsiveness.
- Slide transitions execute via hardware-accelerated opacity cross-fades (`will-change: opacity`), and hidden slides are completely unmounted from the DOM to free browser texture memory.
