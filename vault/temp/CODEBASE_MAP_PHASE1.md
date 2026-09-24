# Remission Protocol — Codebase Map (Phase 1)

## D1 Schema Audit
- Migration Files: 0001, 0002, 0003
- Active Tables: admins, appointments, client_documents, client_metrics, client_profiles, client_sessions, contact_requests, founders, hero_assets, hero_copy, hero_media, library_content, membership_applications, podcast_episodes, resources, sessions, site_settings, users

## API Endpoints & Auth Middleware
- Public Routes: /api/hero, /api/library_content, /api/podcast_episodes, /api/resources, /api/files/*
- Admin Routes: /api/admin/hero, /api/admin/content, /api/admin/resources, /api/admin/upload
- Authenticated Client Routes: /api/client/metrics (Guarded by functions/api/client/_middleware.js)

## PWA & Telemetry Scaffolding
- Web App Manifest: apps/web/public/manifest.json
- Service Worker: apps/web/public/sw.js
- Offline Storage Status: Pending IndexedDB client queue implementation (Stage 6 enhancement)
EOF