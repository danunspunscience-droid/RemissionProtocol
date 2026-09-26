#!/usr/bin/env bash
set -e

echo "=================================================="
echo " 🏁 REMISSION PROTOCOL — ENDING SESSION"
echo "=================================================="

CURRENT_BRANCH=$(git branch --show-current)
echo "Active Branch: $CURRENT_BRANCH"

# 1. Check working tree state
UNCOMMITTED_CHANGES=$(git status --porcelain)

if [ -n "$UNCOMMITTED_CHANGES" ]; then
 echo "================================================================="
 echo "⚠️ UNCOMMITTED CHANGES DETECTED!"
 echo "Staging all changes and prompting for session commit."
 echo "================================================================="
 git status --short

 git add -A
 read -p "Enter session commit message: " COMMIT_MSG
 if [ -z "$COMMIT_MSG" ]; then
 COMMIT_MSG="docs/chore: session wrap-up and status sync"
 fi
 git commit -m "$COMMIT_MSG"
 echo "✅ Changes committed successfully."
else
 echo "✅ Working tree is clean. No local uncommitted changes."
fi

# 2. Push active branch to GitHub
echo "📤 Pushing '$CURRENT_BRANCH' to GitHub (origin)."
git push origin "$CURRENT_BRANCH"

echo "=================================================="
echo " ✅ SESSION WRAP-UP & REMOTE SYNC COMPLETE"
echo " You may now switch physical coding rigs safely."
echo "=================================================="