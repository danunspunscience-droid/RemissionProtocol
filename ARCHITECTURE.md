# Remission Protocol — Architectural Standards & Binding Index
Last Updated: October 1, 2026

## Core Architectural Directives

### 1. Cloudflare Pages Functions & Type Engine
- All API handlers inside `functions/api/` MUST be written in TypeScript (`.ts`).
- Context interface: `PagesFunction<Env>` imported from `@cloudflare/workers-types`.
- Ambient types defined in `functions/types/env.d.ts`.
- Dual `tsconfig` boundaries enforce strict isolation:
  - `apps/web/tsconfig.json`: DOM/Vite bundler scope. Excludes `functions/`.
  - `functions/tsconfig.json`: Cloudflare Worker V8 Isolate scope. Excludes web code.

### 2. Cloudflare R2 Storage Standard
- Canonical R2 Binding: `env.MEDIA_BUCKET` (`remission-media`).
- Object Key Spaces:
  - `/public/hero/`: Public media assets served via `/api/files/public/*`.
  - `/private/clients/{client_id}/`: Protected client assets guarded by `functions/api/client/_middleware.ts`.

### 3. Local Development Emulator
- Command: `npx wrangler pages dev apps/web/dist --ip 127.0.0.1 --port 8790 --inspector-port 9230`
- IPv4 explicit binding (`127.0.0.1`) is required to prevent Linux loopback IPv6 socket hangs.
