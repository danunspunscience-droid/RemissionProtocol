#!/usr/bin/env bash
set -e

echo "=================================================="
echo " 🚀 REMISSION PROTOCOL — STARTING SESSION"
echo "=================================================="

# 1. Pre-flight Guard: Check for uncommitted working tree changes
if [ -n "$(git status --porcelain)" ]; then
 echo "================================================================="
 echo "⚠️ DIRTY WORKING TREE DETECTED!"
 echo "You have uncommitted local changes. Commit, stash, or"
 echo "discard them before syncing across physical coding rigs."
 echo "================================================================="
 git status --short
 exit 1
fi

# 2. Sync remote refs from GitHub
echo "📥 Fetching latest remote branches from GitHub."
git fetch origin

CURRENT_BRANCH=$(git branch --show-current)

# 3. Pull updates based on branch state
if [ "$CURRENT_BRANCH" = "main" ]; then
 echo "🔄 Rebasing local 'main' with 'origin/main'."
 git pull --rebase origin main
 echo "✅ Local 'main' updated cleanly."
else
 echo "ℹ️ Active feature branch is '$CURRENT_BRANCH'."
 echo "Checking if remote branch 'origin/$CURRENT_BRANCH' exists."
 if git ls-remote --exit-code --heads origin "$CURRENT_BRANCH" >/dev/null 2>&1; then
 echo "🔄 Pulling latest commits from 'origin/$CURRENT_BRANCH'."
 git pull --rebase origin "$CURRENT_BRANCH"
 else
 echo "ℹ️ Branch 'origin/$CURRENT_BRANCH' does not exist yet on remote. Ready for push."
 fi
fi

echo "=================================================="
echo " ✅ SESSION STARTUP COMPLETE"
echo "=================================================="