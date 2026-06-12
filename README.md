# 10minCUET — CUET UG Prep in 10 Minutes a Day

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Famitanalytics-dev%2Fjee-analyser&root-directory=clones%2F10mincuet&project-name=10mincuet&env=NEXT_PUBLIC_BASE_URL,NEXT_PUBLIC_CONVEX_URL,JWT_SECRET,CRON_SECRET,ANTHROPIC_API_KEY,RESEND_API_KEY,RAZORPAY_KEY_ID,RAZORPAY_KEY_SECRET&envDescription=See%20.env.example%20in%20this%20directory)

CUET UG (central university entrance) clone of the 10minJEE engine.
Lives on its own Vercel project + Convex deployment with zero shared infra.

## Brand

- **Domain:** `10mincuet.com`
- **Tagline:** "Crack CUET in 10 minutes a day"
- **Sections:** Languages / Domain / General Test (3 sections × 50 Q × 60 min = 150 Q / 180 min)
- **Marking:** +5 / −1 (note: different from JEE/NEET's +4/−1)
- **Accent colour:** university purple `#7C3AED`
- **Entity:** EAZEALLIANCE SERVICES PRIVATE LIMITED (shared with 10minJEE)

## Pricing — 30-day free launch promotion, then hard paywall

| Tier | Price |
|---|---|
| **First 30 days** | **Free for everyone** (premium features unlocked) |
| Per subject (Languages / Domain / General Test) | ₹99 each |
| 5-subject bundle | ₹349 |
| Annual | ₹999 |

After 30 days, unsubscribed users see a hard paywall on premium features. CUET aspirants are price-sensitive (newer exam, less prep market money), so tiers are intentionally low vs JEE/NEET.

**No parent+kid tier** — CUET aspirants are mostly 18-year-olds making their own decisions.

## CUET-specific features (vs JEE/NEET engine)

1. **3 sections, not 3 subjects** — `exam-config.ts` `sections` array drives mock test structure
2. **Per-section timer** — mock UI shows separate timer per 50 Q × 60 min section
3. **27 domain subjects** — user picks 1 language + 1-3 domain subjects + General Test during onboarding. v1 default: English + Mathematics + General Test
4. **Subject keys** = `"Languages"`, `"Domain"`, `"General Test"` (not Physics/Chemistry/Math)
5. **Schema fields** — `mockResults` uses `languagesScore`, `domainScore`, `generalTestScore`
6. **No score normalisation** — CUET doesn't normalise (each subject standalone), so the score-normalisation page is removed
7. **College predictor** filters central universities (DU, JNU, BHU, Jamia, AMU, Allahabad) by program (B.A. English, B.Sc. Physics, etc.) instead of MBBS seats

## Content sourcing

CUET launched in 2022, so the historical corpus is shorter (4 years vs NEET's 15). Coverage approach:

- **Question bank:** `scripts/gen-questions-cuet.mjs` generates Claude-Haiku questions using NTA CUET 2022-2025 patterns. Per-section context: Languages (RC + grammar + vocab), Domain (NCERT Class 12), General Test (GK + reasoning + Class 10 numerical). Cost ~$0.30 per 100 questions.
- **NCERT explanations:** `scripts/generate-ncert-explanations.mjs` (inherited from 10minJEE; targets Class 12 NCERT per domain subject)
- **When actual past paper data is ingested** (NTA PDFs, coaching question banks), replace the SYSTEM_PROMPT in `gen-questions-cuet.mjs` with the real data.

## Engine — shared with 10minJEE

Same engine as 10minJEE + 10minNEET. **Sync protocol:** whenever a feature ships on 10minJEE main, port it here within 2 weeks. See `PRODUCT_NOTE_NEET_CUET.md` in the 10minJEE repo for the canonical sync rule.

Inherited features:
- Auth (email + OTP), kid-code login, parent invites
- Razorpay subscriptions + referrals
- Bloom-level tracking (L1–L6) per subconcept
- Study rooms with chat + shared notes
- Educators with notes + question sets publishing, flat tier monthly payouts
- Leaderboards (Languages / Domain / General Test / Overall × weekly / monthly / all-time)
- **IPL × CUET Cup** — same 10 IPL franchises (cross-app consistency)
- Weekly challenges (24-week CUET topic rotation)
- 8-player tournament brackets
- Readiness score, streak system
- A/B testing platform
- Admin console with KPI snapshots, cron monitoring, payouts admin
- Email pipeline (welcome day 2/7, re-engagement day 7/14/21, weekly retention, daily ops report)
- 13-language i18n

## Local setup

```bash
cd 10mincuet
npm install --legacy-peer-deps
cp .env.example .env.local
# Fill in env vars (see .env.example)
npx convex dev   # in another tab — provisions fresh Convex deployment
npm run dev      # http://localhost:3000
```

## Deployment

Same as `clones/10minneet/`. See `DEPLOY.md` for the 12-step playbook adapted for CUET (different domain, different Resend domain, different pricing).

## Founder allowlist (for `/admin`)

Same as 10minJEE + 10minNEET:
- `mehrotrarishabh41@gmail.com`
- `amit@berriesadvisory.com`
- `amit@berriesadvisory.com`

## Sync with 10minJEE

When a new feature lands on 10minJEE `main`:
1. Update `PRODUCT_NOTE_NEET_CUET.md` in the 10minJEE repo
2. Within 2 weeks, port the feature to this repo
3. Commit with `chore(cuet): port jee/feat-X`
4. Re-run `node scripts/translate-i18n.mjs` to fill new translation keys
