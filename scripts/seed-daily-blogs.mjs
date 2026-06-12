#!/usr/bin/env node
/**
 * seed-daily-blogs.mjs
 *
 * Submits 50 JEE blog topics to Claude batch API (claude-haiku-4-5-20251001).
 * Runs daily at 7am IST (1:30am UTC) via cron.
 * Saves batch ID to scripts/batch-ids-blogs.json.
 * Retrieve results by running: node scripts/retrieve-daily-blogs.mjs
 *
 * Cost: ~75% cheaper than standard API via batch pricing.
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// Load .env.local
const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const BATCH_IDS_FILE = path.join(__dirname, "batch-ids-blogs.json");
const SLUG_CACHE_FILE = path.join(__dirname, "slug-cache.json");

// ── Topic seeds ───────────────────────────────────────────────────────────────

const PHYSICS_TOPICS = [
  "Kinematics", "Laws of Motion", "Work Energy Power", "Rotational Motion",
  "Gravitation", "Simple Harmonic Motion", "Waves", "Thermodynamics",
  "Electrostatics", "Current Electricity", "Magnetic Effects of Current",
  "Electromagnetic Induction", "Alternating Current", "Optics (Ray)",
  "Optics (Wave)", "Dual Nature of Matter", "Atoms and Nuclei",
  "Semiconductor Devices", "Communication Systems", "Units and Measurement",
];

const CHEMISTRY_TOPICS = [
  "Structure of Atom", "Chemical Bonding", "States of Matter",
  "Thermodynamics", "Equilibrium", "Redox Reactions", "Electrochemistry",
  "Chemical Kinetics", "Surface Chemistry", "Periodic Table",
  "Coordination Compounds", "Haloalkanes", "Aldehydes and Ketones",
  "Carboxylic Acids", "Amines", "Polymers", "Biomolecules",
  "p-Block Elements", "d and f Block Elements", "Solutions",
];

const MATHS_TOPICS = [
  "Sets and Relations", "Complex Numbers", "Quadratic Equations",
  "Matrices and Determinants", "Permutations and Combinations",
  "Binomial Theorem", "Sequences and Series", "Straight Lines",
  "Circles", "Conic Sections", "Limits and Derivatives",
  "Continuity and Differentiability", "Application of Derivatives",
  "Integrals", "Application of Integrals", "Differential Equations",
  "Vector Algebra", "3D Geometry", "Probability", "Trigonometry",
];

// ── Title templates (5 patterns × topics) ────────────────────────────────────

function pickTopics(date) {
  // Use date as a seed to deterministically pick 50 topics per day
  const dayOfYear = Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const offset = (dayOfYear * 17) % 20; // cycle with prime offset to spread coverage

  const topics = [];

  // ~17 from each subject, balanced 17/17/16 = 50
  const pick = (arr, count, shift) =>
    Array.from({ length: count }, (_, i) => arr[(offset + shift + i) % arr.length]);

  const physicsPicks  = pick(PHYSICS_TOPICS,   17, 0);
  const chemPicks     = pick(CHEMISTRY_TOPICS, 17, 3);
  const mathPicks     = pick(MATHS_TOPICS,     16, 7);

  const formats = [
    (topic, subj) => `Complete guide to ${topic} for JEE Main 2026`,
    (topic, subj) => `How IIT ${subj} topper cracked ${topic} in 10 minutes`,
    (topic, subj) => `JEE Main ${subj} — ${topic} analysis and what changed`,
    (topic, subj) => `NCERT ${subj} ${topic} — 5 things JEE always tests`,
    (topic, subj) => `All ${topic} formulas you need for JEE Main 2026`,
  ];

  physicsPicks.forEach((topic, i) => {
    topics.push({
      title: formats[i % formats.length](topic, "Physics"),
      topic,
      subject: "Physics",
      ncertBook: i % 2 === 0 ? "Physics Part 1" : "Physics Part 2",
      ncertChapter: topic,
      targetClasses: i % 3 === 0 ? ["11"] : i % 3 === 1 ? ["12"] : ["11", "12"],
    });
  });

  chemPicks.forEach((topic, i) => {
    topics.push({
      title: formats[i % formats.length](topic, "Chemistry"),
      topic,
      subject: "Chemistry",
      ncertBook: i % 2 === 0 ? "Chemistry Part 1" : "Chemistry Part 2",
      ncertChapter: topic,
      targetClasses: i % 3 === 0 ? ["11"] : i % 3 === 1 ? ["12"] : ["11", "12"],
    });
  });

  mathPicks.forEach((topic, i) => {
    topics.push({
      title: formats[i % formats.length](topic, "Mathematics"),
      topic,
      subject: "Mathematics",
      ncertBook: i % 2 === 0 ? "Mathematics Part 1" : "Mathematics Part 2",
      ncertChapter: topic,
      targetClasses: i % 3 === 0 ? ["11"] : i % 3 === 1 ? ["12"] : ["11", "12"],
    });
  });

  return topics;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function loadSlugCache() {
  if (fs.existsSync(SLUG_CACHE_FILE)) {
    try {
      return new Set(JSON.parse(fs.readFileSync(SLUG_CACHE_FILE, "utf8")));
    } catch {
      return new Set();
    }
  }
  return new Set();
}

function buildPrompt(titleSeed, topic, subject, ncertBook, ncertChapter, targetClasses) {
  return `You are writing an SEO-optimized JEE preparation blog post.

Title seed: "${titleSeed}"
Topic: ${topic}
Subject: ${subject}
NCERT Book: ${ncertBook}
NCERT Chapter: ${ncertChapter}
Target Classes: ${targetClasses.join(", ")}

Write a 600–800 word HTML blog post. Use these HTML tags only: <h1>, <h2>, <p>, <ul>, <li>, <strong>.

CRITICAL: Return ONLY a valid JSON object. No markdown. No code blocks. No extra text.

JSON format:
{
  "title": "final SEO title (50-70 chars, contains topic keyword)",
  "content": "full HTML string (all quotes inside HTML must be single quotes, no backslashes needed)",
  "estimatedStudyTime": 20
}

Requirements for content:
- H1 = blog title
- Include: why this topic matters for JEE, key concepts, common mistakes, 3–5 must-know formulas or facts, exam strategy
- 600–800 words
- No markdown, pure HTML`;
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY not set. Check .env.local");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];

  const existingSlugs = loadSlugCache();
  const rawTopics = pickTopics(today);

  // Deduplicate against cache
  const topics = rawTopics.filter((t) => {
    const slug = `jee-${slugify(t.subject)}-${slugify(t.topic)}-${dateStr}`;
    return !existingSlugs.has(slug);
  });

  if (topics.length === 0) {
    console.log("All topics for today already submitted. Nothing to do.");
    process.exit(0);
  }

  console.log(`Submitting ${topics.length} blog topics to Claude batch API...`);
  console.log(`Date: ${dateStr}`);
  console.log(`Model: claude-haiku-4-5-20251001 (batch — ~75% cheaper)`);

  // Build batch requests
  const requests = topics.map((t, i) => ({
    custom_id: `blog-${dateStr}-${i}-${slugify(t.topic)}`,
    params: {
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1800,
      messages: [
        {
          role: "user",
          content: buildPrompt(
            t.title,
            t.topic,
            t.subject,
            t.ncertBook,
            t.ncertChapter,
            t.targetClasses
          ),
        },
      ],
    },
  }));

  // Submit batch
  let batch;
  try {
    batch = await client.messages.batches.create({ requests });
  } catch (err) {
    console.error("Batch submission failed:", err.message);
    process.exit(1);
  }

  console.log(`Batch submitted. ID: ${batch.id}`);
  console.log(`Status: ${batch.processing_status}`);

  // Save batch record
  let records = [];
  if (fs.existsSync(BATCH_IDS_FILE)) {
    try {
      records = JSON.parse(fs.readFileSync(BATCH_IDS_FILE, "utf8"));
    } catch {
      records = [];
    }
  }

  const record = {
    batchId: batch.id,
    date: dateStr,
    status: "pending",
    submittedAt: Date.now(),
    topicCount: topics.length,
    topics: topics.map((t, i) => ({
      customId: `blog-${dateStr}-${i}-${slugify(t.topic)}`,
      slug: `jee-${slugify(t.subject)}-${slugify(t.topic)}-${dateStr}`,
      title: t.title,
      topic: t.topic,
      subject: t.subject,
      ncertBook: t.ncertBook,
      ncertChapter: t.ncertChapter,
      targetClasses: t.targetClasses,
    })),
  };

  records.push(record);
  fs.writeFileSync(BATCH_IDS_FILE, JSON.stringify(records, null, 2));

  console.log(`\nSaved to scripts/batch-ids-blogs.json`);
  console.log(`\nNext step: run 'node scripts/retrieve-daily-blogs.mjs' after ~6-12h`);
  console.log(`(batches typically complete within 1-6 hours)`);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
