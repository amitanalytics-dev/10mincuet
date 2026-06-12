# Deploy 10minCUET — 30-minute setup

End-to-end deployment from this codebase to a live Vercel site on `10mincuet.com`.

## Prerequisites (10 min)

| Account | Why | Cost |
|---|---|---|
| GitHub | Source control | Free |
| Vercel | Hosting (separate from 10minJEE + 10minNEET) | Free → $20/mo Pro |
| Convex | Backend (separate deployment) | Free → $50/mo Pro |
| Resend | Verify `10mincuet.com` separately | Free → $20/mo |
| Razorpay | **Reuse 10minJEE account** | 2% per transaction |
| Anthropic | Content gen + doubt solver | ~$30/mo at 10k MAU |
| PostHog | Shared with 10minJEE OK | Free tier |
| Domain | `10mincuet.com` | ~$15/year |

## Step 1 — Extract clone

```bash
bash scripts/extract-clone.sh cuet ~/projects/10mincuet
cd ~/projects/10mincuet
```

## Step 2 — Push to new GitHub repo

```bash
gh repo create amitanalytics-dev/10mincuet --private --source=. --push
```

## Step 3 — Provision Convex

```bash
npm install --legacy-peer-deps
npx convex dev
# Create new project named "10mincuet"
```

## Step 4 — Local smoke test

```bash
cp .env.example .env.local
# Fill in secrets (use openssl rand to generate)
npm run dev
```

## Step 5 — Vercel project

```bash
npx vercel link
# Add env vars from .env.local
npx vercel --prod
```

## Step 6 — Deploy Convex prod

```bash
npx convex deploy
```

## Step 7 — Seed Convex (via dashboard)

Run mutations:
- `internal.teams.seedTeams` — 10 IPL franchises
- `internal.teams.ensureCurrentSeason`
- `internal.cronHandlers.weeklyChallengeReset`
- `internal.tournaments.tick`
- `internal.cronHandlers.kpiCalculation`

## Step 8 — Generate content (~$1, 5 min)

```bash
ANTHROPIC_API_KEY=sk-ant-... node scripts/gen-questions-cuet.mjs --section "General Test" --count 200
ANTHROPIC_API_KEY=sk-ant-... node scripts/gen-questions-cuet.mjs --section Languages --domain English --count 200
ANTHROPIC_API_KEY=sk-ant-... node scripts/gen-questions-cuet.mjs --section Domain --domain Mathematics --count 100
# Add more domain subjects as needed (Economics, Business Studies, etc.)
git add app/data/cuet/ && git commit -m "content: seed CUET questions" && git push
```

## Step 9 — Translate i18n

```bash
ANTHROPIC_API_KEY=sk-ant-... node scripts/translate-i18n.mjs
```

## Step 10 — Domain

1. Buy `10mincuet.com`
2. Vercel → Settings → Domains → Add
3. Update DNS at registrar
4. Update `NEXT_PUBLIC_BASE_URL`

## Step 11 — Resend domain

1. Resend → Domains → Add `10mincuet.com`
2. Add DNS records
3. Verify

## Step 12 — Smoke test

- [ ] Landing page loads
- [ ] OTP signup works
- [ ] Trial pill shows "🎁 Trial · 30d left"
- [ ] `/leaderboard`, `/teams`, `/challenge`, `/tournaments` render
- [ ] `/admin` returns 403 for non-founder, dashboards for `amit@berriesadvisory.com`
- [ ] Razorpay test payment works (test card 4111 1111 1111 1111)

## Sync with 10minJEE

When 10minJEE ships → port within 2 weeks → commit as `chore(cuet): port jee/feat-X`.
