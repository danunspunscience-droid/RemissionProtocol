# Remission Protocol - System Architecture & Standards

## 1. System Core
- **Frontend:** React + Vite + Tailwind CSS + Lucide React (`apps/web`)
- **Edge API:** Cloudflare Pages Functions (`functions/api/*`)
- **Shared edge helpers:** `functions/_lib/`
- **Database Engine:** Cloudflare D1 SQLite (`remission-db`)
- **Storage Engine:** Cloudflare R2 (`remission-media`)

## 2. Authentication Standard

### 2a. Admin Auth — WebCrypto HMAC-SHA-256 signed sessions
- **Primitives:** `functions/_lib/adminSession.js`. Password hashing and payload signing both use `crypto.subtle.digest` / `crypto.subtle.sign` with SHA-256. No third-party crypto dependency.
- **Session token:** base64url-encoded JSON payload with an appended HMAC-SHA-256 signature over the serialized payload. Base64url (`+/` → `-_`, `=` stripped) so the token is cookie-safe.
- **Verification:** `crypto.subtle.verify` plus a `timingSafeEqualString` comparison on the signature before any payload field is trusted.
- **Cookie:** `admin_session` — HTTP-Only, `Secure`, `SameSite=Strict`, `Path=/`, `Max-Age=28800` (8 hours, `SESSION_TTL_SECONDS`).
- **Signing key:** deployment secret. `assertSecretConfigured(env)` runs before any token is minted; a missing secret returns HTTP 500 rather than issuing an unsigned session.
- **Endpoints:** `POST /api/admin/login` (mint), `GET /api/admin/verify` (validate TTL + signature), `POST /api/admin/logout` (clear cookie). `requireAdmin.js` wraps the remaining `/api/admin/*` handlers.
- **Credential store:** D1 table `admins`.

### 2b. Client Auth — opaque Bearer tokens
- **Guard:** `functions/api/client/_middleware.js`. Client endpoints do not use HMAC sessions. They read an `Authorization: Bearer <token>` header and look the token up in D1 `client_sessions`, joined to `client_profiles`, rejecting rows where `expires_at <= datetime('now')`.
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
