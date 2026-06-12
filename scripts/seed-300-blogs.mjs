#!/usr/bin/env node
/**
 * seed-300-blogs.mjs
 *
 * Submits 300 JEE blog posts to Claude batch API in one shot.
 * Strategy: 60 topics × 5 title formats = 300 unique SEO posts.
 * Model: claude-haiku-4-5-20251001 (~75% cheaper via batch pricing).
 *
 * Usage:
 *   node scripts/seed-300-blogs.mjs
 *
 * After ~6-12 hours, retrieve results:
 *   node scripts/retrieve-daily-blogs.mjs
 *
 * Cost estimate: ~$0.80 total at batch pricing (vs ~$3.20 standard)
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

dotenv.config({ path: path.join(ROOT, ".env.local") });

const BATCH_IDS_FILE = path.join(__dirname, "batch-ids-blogs.json");
const SLUG_CACHE_FILE = path.join(__dirname, "slug-cache.json");

// ── All 60 JEE topics ─────────────────────────────────────────────────────────

const ALL_TOPICS = [
  // Physics (20)
  { topic: "Kinematics",                    subject: "Physics",     book: "Physics Part 1", cls: ["11"] },
  { topic: "Laws of Motion",               subject: "Physics",     book: "Physics Part 1", cls: ["11"] },
  { topic: "Work Energy Power",            subject: "Physics",     book: "Physics Part 1", cls: ["11"] },
  { topic: "Rotational Motion",            subject: "Physics",     book: "Physics Part 1", cls: ["11"] },
  { topic: "Gravitation",                  subject: "Physics",     book: "Physics Part 1", cls: ["11"] },
  { topic: "Simple Harmonic Motion",       subject: "Physics",     book: "Physics Part 2", cls: ["11"] },
  { topic: "Waves",                        subject: "Physics",     book: "Physics Part 2", cls: ["11"] },
  { topic: "Thermodynamics",              subject: "Physics",     book: "Physics Part 2", cls: ["11"] },
  { topic: "Electrostatics",              subject: "Physics",     book: "Physics Part 1", cls: ["12"] },
  { topic: "Current Electricity",         subject: "Physics",     book: "Physics Part 1", cls: ["12"] },
  { topic: "Magnetic Effects of Current", subject: "Physics",     book: "Physics Part 1", cls: ["12"] },
  { topic: "Electromagnetic Induction",   subject: "Physics",     book: "Physics Part 1", cls: ["12"] },
  { topic: "Alternating Current",         subject: "Physics",     book: "Physics Part 1", cls: ["12"] },
  { topic: "Ray Optics",                  subject: "Physics",     book: "Physics Part 2", cls: ["12"] },
  { topic: "Wave Optics",                 subject: "Physics",     book: "Physics Part 2", cls: ["12"] },
  { topic: "Dual Nature of Matter",       subject: "Physics",     book: "Physics Part 2", cls: ["12"] },
  { topic: "Atoms and Nuclei",            subject: "Physics",     book: "Physics Part 2", cls: ["12"] },
  { topic: "Semiconductor Devices",       subject: "Physics",     book: "Physics Part 2", cls: ["12"] },
  { topic: "Communication Systems",       subject: "Physics",     book: "Physics Part 2", cls: ["12"] },
  { topic: "Units and Measurement",       subject: "Physics",     book: "Physics Part 1", cls: ["11", "12"] },

  // Chemistry (20)
  { topic: "Structure of Atom",           subject: "Chemistry",   book: "Chemistry Part 1", cls: ["11"] },
  { topic: "Chemical Bonding",            subject: "Chemistry",   book: "Chemistry Part 1", cls: ["11"] },
  { topic: "States of Matter",            subject: "Chemistry",   book: "Chemistry Part 1", cls: ["11"] },
  { topic: "Thermodynamics",             subject: "Chemistry",   book: "Chemistry Part 1", cls: ["11"] },
  { topic: "Equilibrium",                subject: "Chemistry",   book: "Chemistry Part 1", cls: ["11"] },
  { topic: "Redox Reactions",            subject: "Chemistry",   book: "Chemistry Part 1", cls: ["11"] },
  { topic: "Periodic Table",             subject: "Chemistry",   book: "Chemistry Part 1", cls: ["11"] },
  { topic: "p-Block Elements",           subject: "Chemistry",   book: "Chemistry Part 2", cls: ["11"] },
  { topic: "Electrochemistry",           subject: "Chemistry",   book: "Chemistry Part 1", cls: ["12"] },
  { topic: "Chemical Kinetics",          subject: "Chemistry",   book: "Chemistry Part 1", cls: ["12"] },
  { topic: "Surface Chemistry",          subject: "Chemistry",   book: "Chemistry Part 1", cls: ["12"] },
  { topic: "d and f Block Elements",     subject: "Chemistry",   book: "Chemistry Part 1", cls: ["12"] },
  { topic: "Coordination Compounds",     subject: "Chemistry",   book: "Chemistry Part 1", cls: ["12"] },
  { topic: "Haloalkanes",                subject: "Chemistry",   book: "Chemistry Part 2", cls: ["12"] },
  { topic: "Aldehydes and Ketones",      subject: "Chemistry",   book: "Chemistry Part 2", cls: ["12"] },
  { topic: "Carboxylic Acids",           subject: "Chemistry",   book: "Chemistry Part 2", cls: ["12"] },
  { topic: "Amines",                     subject: "Chemistry",   book: "Chemistry Part 2", cls: ["12"] },
  { topic: "Polymers",                   subject: "Chemistry",   book: "Chemistry Part 2", cls: ["12"] },
  { topic: "Biomolecules",               subject: "Chemistry",   book: "Chemistry Part 2", cls: ["12"] },
  { topic: "Solutions",                  subject: "Chemistry",   book: "Chemistry Part 1", cls: ["12"] },

  // Mathematics (20)
  { topic: "Sets and Relations",          subject: "Mathematics", book: "Mathematics Part 1", cls: ["11"] },
  { topic: "Complex Numbers",             subject: "Mathematics", book: "Mathematics Part 1", cls: ["11"] },
  { topic: "Quadratic Equations",         subject: "Mathematics", book: "Mathematics Part 1", cls: ["11"] },
  { topic: "Matrices and Determinants",   subject: "Mathematics", book: "Mathematics Part 1", cls: ["12"] },
  { topic: "Permutations and Combinations", subject: "Mathematics", book: "Mathematics Part 1", cls: ["11"] },
  { topic: "Binomial Theorem",            subject: "Mathematics", book: "Mathematics Part 2", cls: ["11"] },
  { topic: "Sequences and Series",        subject: "Mathematics", book: "Mathematics Part 2", cls: ["11"] },
  { topic: "Straight Lines",              subject: "Mathematics", book: "Mathematics Part 2", cls: ["11"] },
  { topic: "Circles",                     subject: "Mathematics", book: "Mathematics Part 2", cls: ["11"] },
  { topic: "Conic Sections",              subject: "Mathematics", book: "Mathematics Part 2", cls: ["11"] },
  { topic: "Limits and Derivatives",      subject: "Mathematics", book: "Mathematics Part 1", cls: ["11"] },
  { topic: "Continuity and Differentiability", subject: "Mathematics", book: "Mathematics Part 1", cls: ["12"] },
  { topic: "Application of Derivatives",  subject: "Mathematics", book: "Mathematics Part 1", cls: ["12"] },
  { topic: "Integrals",                   subject: "Mathematics", book: "Mathematics Part 2", cls: ["12"] },
  { topic: "Application of Integrals",    subject: "Mathematics", book: "Mathematics Part 2", cls: ["12"] },
  { topic: "Differential Equations",      subject: "Mathematics", book: "Mathematics Part 2", cls: ["12"] },
  { topic: "Vector Algebra",              subject: "Mathematics", book: "Mathematics Part 2", cls: ["12"] },
  { topic: "3D Geometry",                 subject: "Mathematics", book: "Mathematics Part 2", cls: ["12"] },
  { topic: "Probability",                 subject: "Mathematics", book: "Mathematics Part 2", cls: ["11", "12"] },
  { topic: "Trigonometry",                subject: "Mathematics", book: "Mathematics Part 1", cls: ["11"] },
];

// ── 5 title formats ───────────────────────────────────────────────────────────

const FORMATS = [
  (t, s) => `Complete guide to ${t} for JEE Main 2026`,
  (t, s) => `How IIT toppers crack ${t} in 10 minutes`,
  (t, s) => `JEE Main ${s} — ${t}: what changed and what to do`,
  (t, s) => `NCERT ${s} ${t} — 5 things JEE always tests`,
  (t, s) => `${t} formulas, tricks and shortcuts for JEE Main 2026`,
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function loadSlugCache() {
  if (fs.existsSync(SLUG_CACHE_FILE)) {
    try { return new Set(JSON.parse(fs.readFileSync(SLUG_CACHE_FILE, "utf8"))); }
    catch { return new Set(); }
  }
  return new Set();
}

function buildPrompt(title, topic, subject, ncertBook, targetClasses) {
  return `You are writing an SEO-optimized JEE preparation blog post.

Title: "${title}"
Topic: ${topic}
Subject: ${subject}
NCERT Book: ${ncertBook}
Target Classes: ${targetClasses.join(", ")}

Write a 600–800 word HTML blog post. Use only: <h1>, <h2>, <p>, <ul>, <li>, <strong>.

CRITICAL: Return ONLY a valid JSON object. No markdown. No code blocks. No extra text.

JSON format:
{
  "title": "final SEO title (50-70 chars, contains topic keyword)",
  "content": "full HTML string (all quotes inside HTML must be single quotes)",
  "estimatedStudyTime": 20
}

Content requirements:
- H1 = blog title
- Why this topic matters for JEE, key concepts, common mistakes, 3-5 must-know formulas or facts, exam strategy
- 600-800 words, pure HTML`;
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_anthropic_api_key_here") {
    console.error("❌ ANTHROPIC_API_KEY not set or still placeholder.");
    console.error("   Set it in .env.local: ANTHROPIC_API_KEY=sk-ant-...");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  const existingSlugs = loadSlugCache();

  // Generate all 300 combinations: 60 topics × 5 formats
  const allJobs = [];
  for (const t of ALL_TOPICS) {
    for (let fi = 0; fi < FORMATS.length; fi++) {
      const title = FORMATS[fi](t.topic, t.subject);
      const slug = `jee-${slugify(t.subject)}-${slugify(t.topic)}-f${fi}`;
      if (existingSlugs.has(slug)) continue;
      allJobs.push({
        customId: `blog-300-${slugify(t.subject)}-${slugify(t.topic)}-f${fi}`,
        slug,
        title,
        topic: t.topic,
        subject: t.subject,
        ncertBook: t.book,
        ncertChapter: t.topic,
        targetClasses: t.cls,
      });
    }
  }

  if (allJobs.length === 0) {
    console.log("✅ All 300 slugs already submitted. Nothing new to do.");
    process.exit(0);
  }

  console.log(`📦 Submitting ${allJobs.length} blog topics to Claude batch API...`);
  console.log(`   Model: claude-haiku-4-5-20251001`);
  console.log(`   Est. cost: ~$${(allJobs.length * 0.0008).toFixed(2)} (batch pricing)`);
  console.log(`   Est. time: 6-12 hours`);

  const requests = allJobs.map((j) => ({
    custom_id: j.customId,
    params: {
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1800,
      messages: [
        {
          role: "user",
          content: buildPrompt(j.title, j.topic, j.subject, j.ncertBook, j.targetClasses),
        },
      ],
    },
  }));

  let batch;
  try {
    batch = await client.messages.batches.create({ requests });
  } catch (err) {
    console.error("❌ Batch submission failed:", err.message);
    process.exit(1);
  }

  console.log(`\n✅ Batch submitted!`);
  console.log(`   Batch ID: ${batch.id}`);
  console.log(`   Status: ${batch.processing_status}`);

  // Append to batch-ids-blogs.json (same file as daily seeds — same retrieve script works)
  let records = [];
  if (fs.existsSync(BATCH_IDS_FILE)) {
    try { records = JSON.parse(fs.readFileSync(BATCH_IDS_FILE, "utf8")); }
    catch { records = []; }
  }

  records.push({
    batchId: batch.id,
    date: new Date().toISOString().split("T")[0],
    label: "300-blogs-bulk",
    status: "pending",
    submittedAt: Date.now(),
    topicCount: allJobs.length,
    topics: allJobs,
  });

  fs.writeFileSync(BATCH_IDS_FILE, JSON.stringify(records, null, 2));

  console.log(`\n📝 Saved to scripts/batch-ids-blogs.json`);
  console.log(`\n⏰ Next step (after 6-12 hours):`);
  console.log(`   node scripts/retrieve-daily-blogs.mjs`);
  console.log(`   OR: npm run retrieve:blogs`);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
