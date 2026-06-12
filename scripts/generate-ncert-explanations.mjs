#!/usr/bin/env node
/**
 * generate-ncert-explanations.mjs
 *
 * Reads topics + NCERT mapping from app/data/*.ts (via regex — no TS import),
 * builds one batch request per sub-concept, submits them to the Claude batch API
 * in groups of 100, and saves all batch IDs to scripts/batch-ids-explanations.json.
 *
 * Run:  node scripts/generate-ncert-explanations.mjs
 * Cost: claude-haiku-4-5-20251001 via batch API — ~75% cheaper than standard.
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// ── Load .env.local ────────────────────────────────────────────────────────
const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ERROR: ANTHROPIC_API_KEY not set in .env.local or environment");
  process.exit(1);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Parse topics.ts via regex ───────────────────────────────────────────────
function parseTopicsFile() {
  const topicsPath = path.join(ROOT, "app/data/topics.ts");
  const src = fs.readFileSync(topicsPath, "utf8");

  const topics = [];

  // Find each top-level topic block: name: "...", ... subConcepts: [ ... ]
  // We'll do a two-pass approach:
  // 1. Extract topic names in order
  // 2. Extract subConcept names per topic

  // Split the source into topic blocks by finding `name:` inside the topics array
  // Strategy: find all `{ name: "TopicName"` blocks inside the subjects array

  // Extract subject+topic structure by scanning for patterns
  const subjectRegex = /name:\s*"(Physics|Chemistry|Mathematics)",[\s\S]*?topics:\s*\[/g;
  const topicNameRegex = /name:\s*"([^"]+)",\s*\n\s*avgQuestionsPerPaper/g;
  const subConceptRegex = /\{\s*name:\s*"([^"]+)",\s*tip:\s*"[^"]*"\s*\}/g;

  // Get all topic names
  const topicNames = [];
  let m;
  while ((m = topicNameRegex.exec(src)) !== null) {
    topicNames.push(m[1]);
  }

  // For each topic, extract its sub-concepts by isolating the subConcepts array
  for (const topicName of topicNames) {
    // Find the index of this topic's subConcepts block
    const topicIdx = src.indexOf(`"${topicName}"`);
    if (topicIdx === -1) continue;

    const subConceptsStart = src.indexOf("subConcepts:", topicIdx);
    if (subConceptsStart === -1) continue;

    // Find the matching closing bracket for the subConcepts array
    const arrayStart = src.indexOf("[", subConceptsStart);
    let depth = 0;
    let arrayEnd = arrayStart;
    for (let i = arrayStart; i < src.length; i++) {
      if (src[i] === "[") depth++;
      else if (src[i] === "]") {
        depth--;
        if (depth === 0) { arrayEnd = i; break; }
      }
    }

    const subConceptsBlock = src.slice(arrayStart, arrayEnd + 1);
    const subNames = [];
    const scRegex = /name:\s*"([^"]+)"/g;
    let sm;
    while ((sm = scRegex.exec(subConceptsBlock)) !== null) {
      subNames.push(sm[1]);
    }

    topics.push({ name: topicName, subConcepts: subNames });
  }

  return topics;
}

// ── Parse ncert-mapping.ts via regex ───────────────────────────────────────
function parseNcertMapping() {
  const mappingPath = path.join(ROOT, "app/data/ncert-mapping.ts");
  const src = fs.readFileSync(mappingPath, "utf8");

  const map = {};

  // Each entry looks like:
  //   "Topic Name": {
  //     book: "...",
  //     chapter: N,
  //     chapterName: "...",
  //     pageStart: N,
  //     pageEnd: N,
  //   },
  const entryRegex = /"([^"]+)":\s*\{([^}]+)\}/g;
  let m;
  while ((m = entryRegex.exec(src)) !== null) {
    const topicName = m[1];
    const body = m[2];

    const book = (body.match(/book:\s*"([^"]+)"/) || [])[1];
    const chapter = parseInt((body.match(/chapter:\s*(\d+)/) || [])[1] || "0");
    const chapterName = (body.match(/chapterName:\s*"([^"]+)"/) || [])[1];
    const pageStart = parseInt((body.match(/pageStart:\s*(\d+)/) || [])[1] || "0");
    const pageEnd = parseInt((body.match(/pageEnd:\s*(\d+)/) || [])[1] || "0");

    if (book) {
      map[topicName] = { book, chapter, chapterName, pageStart, pageEnd };
    }
  }

  return map;
}

// ── Slug helpers ────────────────────────────────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Build batch requests ────────────────────────────────────────────────────
function buildRequests(topics, ncertMap) {
  const requests = [];

  for (const topic of topics) {
    const topicSlug = slugify(topic.name);
    const ncertRef = ncertMap[topic.name] || null;

    for (const subConceptName of topic.subConcepts) {
      const subSlug = slugify(subConceptName);
      const customId = `${topicSlug}__${subSlug}`;

      let promptContent;
      if (ncertRef) {
        promptContent =
          `You are an expert JEE teacher. Explain the concept "${subConceptName}" from the topic "${topic.name}" for a JEE Main student.\n\n` +
          `NCERT Reference: ${ncertRef.book}, Chapter ${ncertRef.chapter}: ${ncertRef.chapterName}, Pages ${ncertRef.pageStart}–${ncertRef.pageEnd}\n\n` +
          `Write a focused 200-250 word explanation that:\n` +
          `1. Opens with the core concept in one sentence\n` +
          `2. Explains the key formula or principle with an example\n` +
          `3. Gives 1 JEE-specific tip (what NTA tests most)\n` +
          `4. Ends with: "📖 Study this in NCERT ${ncertRef.book}, Chapter ${ncertRef.chapter} (${ncertRef.chapterName}), Pages ${ncertRef.pageStart}–${ncertRef.pageEnd}"\n\n` +
          `Be direct. No fluff. JEE student voice.`;
      } else {
        promptContent =
          `You are an expert JEE teacher. Explain the concept "${subConceptName}" from the topic "${topic.name}" for a JEE Main student.\n\n` +
          `Write a focused 200-250 word explanation that:\n` +
          `1. Opens with the core concept in one sentence\n` +
          `2. Explains the key formula or principle with an example\n` +
          `3. Gives 1 JEE-specific tip (what NTA tests most)\n\n` +
          `Be direct. No fluff. JEE student voice.`;
      }

      requests.push({
        custom_id: customId,
        params: {
          model: "claude-haiku-4-5-20251001",
          max_tokens: 600,
          messages: [{ role: "user", content: promptContent }],
        },
      });
    }
  }

  return requests;
}

// ── Chunk array into groups of N ────────────────────────────────────────────
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Reading topics from app/data/topics.ts...");
  const topics = parseTopicsFile();
  console.log(`Found ${topics.length} topics`);

  console.log("Reading NCERT mapping from app/data/ncert-mapping.ts...");
  const ncertMap = parseNcertMapping();
  console.log(`Found ${Object.keys(ncertMap).length} NCERT mappings`);

  const requests = buildRequests(topics, ncertMap);
  console.log(`\nTotal sub-concepts to explain: ${requests.length}`);

  const BATCH_SIZE = 100;
  const chunks = chunkArray(requests, BATCH_SIZE);
  console.log(`Splitting into ${chunks.length} batch(es) of up to ${BATCH_SIZE} requests each\n`);

  const batchIds = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Submitting batch ${i + 1}/${chunks.length} (${chunk.length} requests)...`);

    try {
      const batch = await client.messages.batches.create({ requests: chunk });
      batchIds.push({
        batchIndex: i + 1,
        batchId: batch.id,
        requestCount: chunk.length,
        submittedAt: new Date().toISOString(),
        status: batch.processing_status,
      });
      console.log(`  Submitted batch ${i + 1} with ${chunk.length} requests. Batch ID: ${batch.id}`);
    } catch (err) {
      console.error(`  ERROR on batch ${i + 1}:`, err.message);
      // Still save what we have so partial progress isn't lost
    }

    // Brief pause between batch submissions to avoid rate-limiting
    if (i < chunks.length - 1) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const outputPath = path.join(__dirname, "batch-ids-explanations.json");
  fs.writeFileSync(outputPath, JSON.stringify(batchIds, null, 2));
  console.log(`\nSaved ${batchIds.length} batch ID(s) to scripts/batch-ids-explanations.json`);
  console.log("\nDone! Run `node scripts/retrieve-ncert-explanations.mjs` once batches complete (usually 1-6 hours).");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
