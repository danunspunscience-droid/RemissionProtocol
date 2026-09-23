#!/usr/bin/env bash
set -e

echo "=================================================="
echo " 🚀 REMISSION PROTOCOL — STARTING SESSION"
echo "=================================================="

# 1. Pull latest code from GitHub
echo "📥 Syncing latest code from GitHub..."
git pull --rebase origin main

# 2. Symlink Hermes skills to local home directory
echo "🧠 Linking Hermes skills..."
mkdir -p ~/.hermes/skills
ln -sf "$(pwd)/.hermes/skills"/* ~/.hermes/skills/ 2>/dev/null || true

# 3. Ensure local D1 schema is hydrated
if [ -f "schema.sql" ]; then
  echo "🗄️ Syncing local D1 schema..."
  npx --yes wrangler d1 execute remission-db --local --file=schema.sql >/dev/null 2>&1 || true
fi

echo ""
echo "✅ Rig synchronized and ready! Current status:"
git status -s
echo "=================================================="
