#!/usr/bin/env bash
# 10minCUET bootstrap — runs the deployment checklist end-to-end.
set -e
cd "$(dirname "$0")/.."

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "  10minCUET bootstrap"
echo "════════════════════════════════════════════════════════════════════"
echo ""

if [ ! -f .env.local ]; then
  echo "[1/6] Creating .env.local from .env.example…"
  cp .env.example .env.local
  echo "  ✓ .env.local created. Edit it now, then re-run this script."
  echo ""
  echo "  Generate secrets:"
  echo "    JWT_SECRET   = $(openssl rand -base64 48 2>/dev/null || echo 'install openssl')"
  echo "    CRON_SECRET  = $(openssl rand -base64 32 2>/dev/null || echo 'install openssl')"
  exit 0
fi
echo "[1/6] ✓ .env.local exists"

if [ ! -d node_modules ]; then
  echo "[2/6] Installing deps…"
  npm install --legacy-peer-deps
fi
echo "[2/6] ✓ deps installed"

if [ ! -d convex/_generated ]; then
  echo ""
  echo "[3/6] Convex not provisioned. Run: npx convex dev"
  exit 0
fi
echo "[3/6] ✓ Convex generated files present"

echo "[4/6] Typechecking…"
npx tsc --noEmit 2>&1 | grep -vE "TS5101|baseUrl|deprecated" | head -10 || true
echo "[4/6] ✓ typecheck complete"

echo ""
echo "[5/6] Seed Convex via dashboard (https://dashboard.convex.dev):"
echo "        internal.teams.seedTeams"
echo "        internal.teams.ensureCurrentSeason"
echo "        internal.cronHandlers.kpiCalculation"
echo "        internal.cronHandlers.weeklyChallengeReset"
echo "        internal.tournaments.tick"
echo ""

QUESTIONS_FILE=app/data/cuet/general-test-questions.json
if [ ! -f "$QUESTIONS_FILE" ]; then
  echo "[6/6] Generate initial question bank?"
  read -p "      Run gen-questions-cuet for all 3 sections, 100 each? (y/n) " yn
  if [ "$yn" = "y" ]; then
    node scripts/gen-questions-cuet.mjs --section "General Test" --count 100
    node scripts/gen-questions-cuet.mjs --section Languages --domain English --count 100
    node scripts/gen-questions-cuet.mjs --section Domain --domain Mathematics --count 100
  fi
else
  echo "[6/6] ✓ question banks exist (skip)"
fi

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "  Bootstrap complete. Next: npm run dev, then npx vercel --prod"
echo "════════════════════════════════════════════════════════════════════"
