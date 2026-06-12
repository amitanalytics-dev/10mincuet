#!/usr/bin/env node
/**
 * translate-i18n.mjs
 *
 * Translates any keys present in app/i18n/translations/en.ts but missing
 * in the other 12 locales, via the Anthropic Claude API.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... node scripts/translate-i18n.mjs
 *   ANTHROPIC_API_KEY=... node scripts/translate-i18n.mjs --only hi,bn
 *   ANTHROPIC_API_KEY=... node scripts/translate-i18n.mjs --model claude-haiku-4-5-20251001
 *
 * The script is idempotent: existing translations are never overwritten.
 * Estimated cost on Haiku: ~$0.01–$0.05 per locale per batch of 50 keys.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TRANS_DIR = path.join(ROOT, "app/i18n/translations");

dotenv.config({ path: path.join(ROOT, ".env.local") });

const LOCALES = ["hi", "bn", "te", "mr", "ta", "gu", "kn", "ml", "or", "pa", "as", "ur"];
const NAMES = {
  hi: "Hindi", bn: "Bengali", te: "Telugu", mr: "Marathi", ta: "Tamil",
  gu: "Gujarati", kn: "Kannada", ml: "Malayalam", or: "Odia", pa: "Punjabi",
  as: "Assamese", ur: "Urdu",
};

const args = process.argv.slice(2);
const onlyIdx = args.indexOf("--only");
const only = onlyIdx >= 0 ? args[onlyIdx + 1].split(",") : LOCALES;
const modelIdx = args.indexOf("--model");
const model = modelIdx >= 0 ? args[modelIdx + 1] : "claude-haiku-4-5-20251001";

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("Missing ANTHROPIC_API_KEY in env. Set it or add to .env.local.");
  process.exit(1);
}
const client = new Anthropic({ apiKey });

// Extract keys from a translations file. Very naive — handles only string
// literals (no template strings, no nested objects). Good enough for our flat
// key-value structure.
function parseTranslationFile(filepath) {
  const src = fs.readFileSync(filepath, "utf8");
  const result = {};
  const re = /^\s*(\w+):\s*"((?:[^"\\]|\\.)*)"\s*,?\s*$/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    result[m[1]] = m[2];
  }
  return { src, dict: result };
}

async function translateBatch(targetLang, items) {
  const prompt = `You are translating UI strings for a JEE (engineering entrance exam) prep app from English to ${targetLang}.

Return ONLY valid JSON: { "key1": "translation1", "key2": "translation2", ... }

Rules:
- Translate naturally for a 17-year-old student audience
- Keep emoji and "JEE" untranslated
- Keep "{n}", "{total}", "%", numbers, and curly placeholders intact
- Be concise — UI labels not paragraphs
- Use the script appropriate for the language (Devanagari for Hindi/Marathi, Bengali, Tamil, etc.)

Strings to translate:
${JSON.stringify(items, null, 2)}`;

  const msg = await client.messages.create({
    model,
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });
  const raw = msg.content[0]?.text ?? "{}";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object in response");
  return JSON.parse(match[0]);
}

async function processLocale(locale) {
  const langName = NAMES[locale];
  if (!langName) return;
  const enPath = path.join(TRANS_DIR, "en.ts");
  const localePath = path.join(TRANS_DIR, `${locale}.ts`);
  const en = parseTranslationFile(enPath).dict;
  const cur = parseTranslationFile(localePath).dict;

  const missing = Object.keys(en).filter((k) => !(k in cur));
  if (missing.length === 0) {
    console.log(`[${locale}] up to date`);
    return;
  }
  console.log(`[${locale}] translating ${missing.length} keys into ${langName}…`);

  const BATCH = 30;
  const translated = {};
  for (let i = 0; i < missing.length; i += BATCH) {
    const slice = missing.slice(i, i + BATCH);
    const items = Object.fromEntries(slice.map((k) => [k, en[k]]));
    try {
      const out = await translateBatch(langName, items);
      Object.assign(translated, out);
      console.log(`  · batch ${i / BATCH + 1}: ${Object.keys(out).length} translated`);
    } catch (err) {
      console.error(`  ! batch ${i / BATCH + 1} failed: ${err.message}`);
    }
  }

  // Splice the new keys in just before the closing brace
  const src = fs.readFileSync(localePath, "utf8");
  const closeIdx = src.lastIndexOf("};");
  if (closeIdx < 0) throw new Error(`No closing brace in ${localePath}`);
  const insertion = Object.entries(translated)
    .map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`)
    .join("\n");
  const next = src.slice(0, closeIdx) + insertion + "\n" + src.slice(closeIdx);
  fs.writeFileSync(localePath, next);
  console.log(`[${locale}] wrote ${Object.keys(translated).length} keys`);
}

async function main() {
  for (const locale of only) {
    if (!LOCALES.includes(locale)) {
      console.log(`Skipping unknown locale: ${locale}`);
      continue;
    }
    try {
      await processLocale(locale);
    } catch (err) {
      console.error(`[${locale}] failed:`, err.message);
    }
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
