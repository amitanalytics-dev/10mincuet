-- Run once in Neon SQL editor

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  password_hash TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by_code TEXT,
  is_kid BOOLEAN NOT NULL DEFAULT FALSE,
  parent_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'free'
    CHECK (tier IN ('free','physics','chemistry','math','bundle','annual','parent_kid')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','cancelled','expired')),
  free_months_remaining INTEGER NOT NULL DEFAULT 0,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id),
  referred_id UUID NOT NULL REFERENCES users(id),
  paid_at TIMESTAMPTZ,
  months_credited INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(referred_id)
);

CREATE TABLE IF NOT EXISTS progress (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_slug TEXT NOT NULL,
  sub_concept TEXT NOT NULL,
  bloom_level INTEGER NOT NULL DEFAULT 1,
  last_quiz_score REAL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, topic_slug, sub_concept)
);

CREATE TABLE IF NOT EXISTS kid_codes (
  code TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
