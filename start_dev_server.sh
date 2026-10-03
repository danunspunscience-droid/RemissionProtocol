#!/usr/bin/env bash
echo "Building apps/web frontend..."
(cd apps/web && npm run build) || { echo "Frontend build failed! Halting."; exit 1; }

echo "Starting Cloudflare Pages local emulator on port 8790..."
npx wrangler pages dev dist/apps/web --port 8790
