#!/usr/bin/env bash
set -e

echo "=================================================="
echo " 🏁 REMISSION PROTOCOL — WRAPPING UP SESSION"
echo "=================================================="

# 1. Run Pre-flight Build Verification
echo "🔍 Running pre-flight build check..."
npm run build --prefix apps/web 2>&1 | tail -n 15 || {
  echo ""
  echo "❌ Build verification failed! Fix errors or run 'git reset --hard HEAD' before ending session."
  exit 1
}

# 2. Check Git Status
echo ""
echo "📋 Modified files:"
git status -s

if [ -z "$(git status --porcelain)" ]; then
  echo "✨ Working directory clean. Nothing to commit."
  echo "=================================================="
  exit 0
fi

# 3. Prompt for Commit Message
echo ""
read -p "💬 Enter commit message (press Enter for 'wip: session sync'): " msg
msg=${msg:-"wip: session sync"}

# 4. Commit and Push
git add .
git commit -m "$msg"
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Session wrapped and backed up to GitHub!"
echo "=================================================="
