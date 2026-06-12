#!/usr/bin/env node
/**
 * retrieve-daily-blogs.mjs
 *
 * Polls completed Claude batches from batch-ids-blogs.json,
 * parses blog JSON from each result, and seeds them into Convex
 * via the internal bulkInsert mutation.
 *
 * Usage: node scripts/retrieve-daily-blogs.mjs
 *
 * Requires ANTHROPIC_API_KEY and CONVEX_URL in .env.local
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

function saveSlugCache(slugSet) {
  fs.writeFileSync(SLUG_CACHE_FILE, JSON.stringify([...slugSet], null, 2));
}

function parseJson(text) {
  let t = text.trim();
  // Strip markdown code fences if present
  if (t.startsWith("```json")) t = t.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  else if (t.startsWith("```")) t = t.replace(/^```\s*/, "").replace(/\s*```$/, "");

  // Extract the outermost JSON object
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start !== -1 && end !== -1) t = t.substring(start, end + 1);

  return JSON.parse(t);
}

async function seedToConvex(blogs) {
  const convexUrl = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.error("CONVEX_URL not set. Cannot seed to Convex.");
    return false;
  }

  // Call internal mutation via Convex HTTP API
  // Internal mutations are accessible via /api/mutation on self-hosted or via
  // the CONVEX_URL endpoint using the Convex client HTTP wire protocol.
  // We use the standard fetch-based JSON call.
  const url = `${convexUrl.replace(/\/$/, "")}/api/mutation`;

  const payload = {
    path: "blogSeeder:bulkInsert",
    args: { blogs },
    format: "json",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Internal mutations require admin key if auth is enforced
        ...(process.env.CONVEX_ADMIN_KEY
          ? { Authorization: `Convex ${process.env.CONVEX_ADMIN_KEY}` }
          : {}),
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error(`Convex HTTP error ${res.status}:`, text);
      return false;
    }

    const data = JSON.parse(text);
    console.log(`Convex response:`, data);
    return true;
  } catch (err) {
    console.error("Failed to call Convex:", err.message);
    return false;
  }
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY not set.");
    process.exit(1);
  }

  if (!fs.existsSync(BATCH_IDS_FILE)) {
    console.log("No batch-ids-blogs.json found. Run seed-daily-blogs.mjs first.");
    process.exit(0);
  }

  const client = new Anthropic({ apiKey });
  let records = JSON.parse(fs.readFileSync(BATCH_IDS_FILE, "utf8"));
  const slugCache = loadSlugCache();

  const pending = records.filter((r) => r.status === "pending");
  if (pending.length === 0) {
    console.log("No pending batches found.");
    process.exit(0);
  }

  console.log(`Found ${pending.length} pending batch(es). Checking status...`);

  let totalInserted = 0;

  for (const record of pending) {
    console.log(`\nBatch ${record.batchId} (${record.date})...`);

    let batchStatus;
    try {
      batchStatus = await client.messages.batches.retrieve(record.batchId);
    } catch (err) {
      console.error(`Could not retrieve batch ${record.batchId}:`, err.message);
      continue;
    }

    console.log(`  Status: ${batchStatus.processing_status}`);

    if (batchStatus.processing_status !== "ended") {
      console.log(`  Not ready yet. Check back later.`);
      continue;
    }

    // Batch is done — collect results
    const topicMap = {};
    for (const t of record.topics) {
      topicMap[t.customId] = t;
    }

    const blogs = [];
    let successCount = 0;
    let errorCount = 0;

    for await (const result of await client.messages.batches.results(record.batchId)) {
      const meta = topicMap[result.custom_id];
      if (!meta) continue;

      if (result.result.type !== "succeeded") {
        console.warn(`  Skipped ${result.custom_id}: ${result.result.type}`);
        errorCount++;
        continue;
      }

      const rawText = result.result.message.content[0]?.text || "";

      let parsed;
      try {
        parsed = parseJson(rawText);
      } catch (err) {
        console.warn(`  JSON parse failed for ${result.custom_id}: ${err.message}`);
        errorCount++;
        continue;
      }

      const slug = meta.slug;
      if (slugCache.has(slug)) {
        console.log(`  Skipping duplicate slug: ${slug}`);
        continue;
      }

      // Build blog record matching Convex blogs table schema exactly
      const blog = {
        slug,
        title: parsed.title || meta.title,
        content: parsed.content || `<h1>${meta.title}</h1>`,
        ncertBook: meta.ncertBook,
        ncertChapter: meta.ncertChapter,
        targetClasses: meta.targetClasses,
        richContent: parsed.content || undefined,
        estimatedStudyTime: parsed.estimatedStudyTime || 30,
        createdAt: Date.now(),
      };

      blogs.push(blog);
      slugCache.add(slug);
      successCount++;
    }

    console.log(`  Parsed: ${successCount} ok, ${errorCount} errors`);

    if (blogs.length === 0) {
      console.log(`  Nothing to insert.`);
      record.status = "done";
      record.processedAt = Date.now();
      record.blogsGenerated = 0;
      continue;
    }

    console.log(`  Seeding ${blogs.length} blogs into Convex...`);
    const seeded = await seedToConvex(blogs);

    if (seeded) {
      record.status = "done";
      record.processedAt = Date.now();
      record.blogsGenerated = blogs.length;
      totalInserted += blogs.length;
      saveSlugCache(slugCache);
      console.log(`  Done. ${blogs.length} blogs seeded.`);
    } else {
      record.status = "seed_failed";
      console.error(`  Seeding failed. Batch marked as seed_failed — re-run to retry.`);
    }
  }

  // Persist updated records
  fs.writeFileSync(BATCH_IDS_FILE, JSON.stringify(records, null, 2));

  console.log(`\nFinished. Total blogs seeded this run: ${totalInserted}`);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
