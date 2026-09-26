# Remission Protocol - System Architecture & Standards

## 1. System Core
- **Frontend:** React + Vite + Tailwind CSS + Lucide React (`apps/web`)
- **Edge API:** Cloudflare Pages Functions (`functions/api/*`)
- **Database Engine:** Cloudflare D1 SQLite (`remission-db`)
- **Storage Engine:** Cloudflare R2 (`remission-media`)

## 2. Authentication Architecture
- **Admin Authentication:** Edge-native WebCrypto `crypto.subtle.digest('SHA-256')` against D1 `admin_users` table with HTTP-Only `admin_session` cookie.
- **Client Authentication:** WebCrypto `SHA-256` against D1 `client_users` table with HTTP-Only `client_session` cookie.
- **Worker Auth Middleware:** `/api/client/_middleware.js` enforces session validation for all client routes except `/api/client/login`.

## 3. Storage & Document Isolation Standards
- **Public Assets:** `/public/` path in R2.
- **Private Client Storage:** `/private/clients/{client_id}/` isolated via `files/[key].js` path checking against context identity.
- **WebP Auto-Compression:** Client-side HTML5 Canvas conversion (`1920px` max dimension, `0.82` WebP quality).

## 4. Engineering Standards
- **File Line Limit:** All React components and handlers must remain strictly under 300 lines (target <200 lines).
- **D1 Query Safety:** All SQLite queries MUST use positional `?` parameter placeholders.
- Because the token is a random opaque string compared server-side, revocation is immediate — a revoked row stops working with no wait for a token to expire.

## 3. Media Upload & WebP Auto-Compression Engine
- **Client utility:** `apps/web/src/lib/imageCompression.js` — FileReader → Image → Canvas → `canvas.toBlob('image/webp', 0.8)`.
- **Compression parameters:** longest edge clamped to `MAX_SIZE = 1920` px with aspect ratio preserved; output filename has its extension rewritten to `.webp`.
- **Consumer:** `components/admin/BlogAdmin.jsx` is currently the only caller.
- **R2 storage path strategy:**
  - Public assets: `/public/`
  - Private client documents: served through `/api/client/documents/[key]`, behind the Bearer-token middleware, with `decodeURIComponent(params.key)` to handle encoded spaces in R2 keys.

## 4. Engineering Constraints
- **File line limit:** React components and handlers stay under 300 lines; target under 200. Admin components currently sit between 6 and 134 lines.
- **D1 parameter binding:** all SQLite queries use positional `?` placeholders — no string interpolation of user input into SQL.
- **Responsibility split:** thin re-export bridges (e.g. `HeroAdmin.jsx`) are the accepted way to expose an implementation under a different name without duplicating logic.
