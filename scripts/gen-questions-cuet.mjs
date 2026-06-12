#!/usr/bin/env node
/**
 * gen-questions-cuet.mjs
 *
 * Generates CUET UG MCQs grounded in NTA CUET papers (2022–2025).
 * CUET launched in 2022, so 4 years of papers — much less history than NEET.
 * To compensate, we also reference the AISSEE / CUET-PG style for adjacency.
 *
 * Output: appends to app/data/cuet/{section}-questions.json
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... node scripts/gen-questions-cuet.mjs --section Languages --domain English --count 100
 *   ANTHROPIC_API_KEY=... node scripts/gen-questions-cuet.mjs --section "General Test" --count 100
 *   ANTHROPIC_API_KEY=... node scripts/gen-questions-cuet.mjs --section Domain --domain Mathematics --count 100
 *
 * Sections: Languages | Domain | "General Test"
 * Domain (when --section Domain): Mathematics, Economics, Accountancy,
 *   Business Studies, Physics, Chemistry, Biology, Political Science,
 *   History, Geography, Sociology, Psychology, Computer Science, ...
 *
 * Cost estimate (Haiku): ~$0.30 per 100 questions.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
dotenv.config({ path: path.join(ROOT, ".env.local") });

const args = process.argv.slice(2);
function arg(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
}

const SECTION = arg("section", "General Test");
const DOMAIN = arg("domain", null);
const COUNT = Number(arg("count", "20"));
const MODEL = arg("model", "claude-haiku-4-5-20251001");
const BATCH = 10;

const VALID_SECTIONS = ["Languages", "Domain", "General Test"];
if (!VALID_SECTIONS.includes(SECTION)) {
  console.error(`Invalid section "${SECTION}". Use: ${VALID_SECTIONS.join(", ")}`);
  process.exit(1);
}
if (SECTION === "Domain" && !DOMAIN) {
  console.error("--domain required when --section Domain");
  process.exit(1);
}

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("Missing ANTHROPIC_API_KEY. Set in env or .env.local.");
  process.exit(1);
}
const client = new Anthropic({ apiKey });

const SECTION_CONTEXT = {
  Languages: `CUET Languages section tests reading comprehension, vocabulary, grammar, sentence correction, and para-jumbles. Available in 13 Indian languages (Section IA) + 20 foreign + Indian languages (Section IB). Default to English unless --domain specifies a language.

Question distribution observed across CUET 2022-2025 papers:
- Reading Comprehension (4 passages × 5 questions): 40%
- Vocabulary (synonyms, antonyms, one-word substitution): 15%
- Grammar (tenses, prepositions, articles, voice): 15%
- Sentence correction / error spotting: 15%
- Para jumbles / sentence rearrangement: 10%
- Cloze test: 5%

Difficulty: easy-medium — CUET targets Class 12 level. Avoid CAT/GMAT-style verbal reasoning.`,

  Domain: `CUET Domain subjects (27 total). User picks up to 6. Each domain is essentially the Class 12 NCERT syllabus for that subject. Question distribution roughly matches NCERT chapter weightage.

Common domain subjects and 2022-2025 question patterns:
- Mathematics: Calculus, Algebra, Vectors, Probability, Linear Programming
- Economics: Microeconomics + Macroeconomics + Indian Economy
- Accountancy: Partnership accounts, Company accounts, Financial statements
- Business Studies: Management principles, Marketing, Finance, HR
- Political Science: Indian Constitution, Politics in India since Independence, Contemporary World Politics
- History: Themes in Indian History (3 volumes)
- Geography: Fundamentals of Human Geography, India People & Economy
- Sociology: Indian Society, Social Change & Development
- Psychology: Variations in Psychological Attributes, Self & Personality

For ${DOMAIN ?? "the chosen domain"}, frame questions at NCERT Class 12 application level. CUET is less calculation-heavy than JEE — emphasise concept + factual recall.`,

  "General Test": `CUET General Test covers:
- General Knowledge: Indian polity, history (especially Modern India + Freedom Struggle), geography, awards, books, sports — 30%
- Current Affairs: Last 12 months (national + international, govt schemes, appointments) — 20%
- General Mental Ability: Logical reasoning, series, coding-decoding, syllogisms, blood relations — 20%
- Numerical Ability: Class 10 level arithmetic — percentages, ratio, profit/loss, time-work, simple/compound interest — 20%
- Quantitative Reasoning: Data interpretation, basic statistics — 10%

Difficulty: easy-medium. The General Test is the equaliser across all CUET aspirants regardless of stream.`,
};

const SYSTEM_PROMPT = `You are a CUET UG question setter modelled on NTA's standard. You have studied the last 4 years of CUET UG papers (2022-2025), the AISSEE precursor, and Class 12 NCERT question patterns.

Your output must:
1. Match NTA's actual difficulty distribution (~50% easy, ~35% medium, ~15% hard — CUET is easier than NEET/JEE)
2. Reference Class 12 NCERT chapters by canonical name in explanations
3. Use Bloom's Taxonomy levels: L1 Remember, L2 Understand, L3 Apply (mostly L1-L2 for General Test, L2-L3 for Domain)
4. Use the +5/-1 marking awareness — questions should have one clear correct answer (no ambiguity)
5. Avoid copying past paper questions verbatim — generate fresh questions in the same style

${SECTION_CONTEXT[SECTION]}`;

function buildPrompt(batchSize) {
  const sectionKey = SECTION === "General Test" ? "gt" : SECTION === "Domain" ? `dom-${(DOMAIN || "x").toLowerCase().slice(0, 3)}` : "lang";
  const subjectLabel = SECTION === "Domain" ? DOMAIN : SECTION;
  return `Generate exactly ${batchSize} CUET UG MCQs for ${subjectLabel}. Distribute topics per the weightage above — do not cluster.

Rules:
- 4 options (A/B/C/D), exactly one correct (no ambiguity — strict +5/-1)
- bloomLevel: 1, 2, or 3 (mostly 1-2 for CUET General Test, 2-3 for Domain)
- difficulty: "easy", "medium", or "hard"
- explanation: 1-2 sentences with reference to NCERT chapter or current affairs source
- subConcept: specific sub-concept (e.g. "Profit & Loss percentage" not just "Numerical Ability")
- topic: chapter / sub-section name
- IDs sequential starting from cuet-${sectionKey}-0001 within this batch

Return ONLY valid JSON array, no markdown:
[
  {
    "id": "cuet-${sectionKey}-0001",
    "text": "question text",
    "options": ["A", "B", "C", "D"],
    "correct": 0,
    "explanation": "...",
    "subConcept": "...",
    "topic": "...",
    "subject": "${subjectLabel}",
    "section": "${SECTION}",
    "bloomLevel": 2,
    "difficulty": "easy",
    "source": "synthetic-2022-2025"
  }
]`;
}

async function generateBatch(size) {
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildPrompt(size) }],
  });
  const raw = msg.content[0]?.text ?? "[]";
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array in response");
  return JSON.parse(match[0]);
}

async function main() {
  const outDir = path.join(ROOT, "app/data/cuet");
  fs.mkdirSync(outDir, { recursive: true });
  const fileName =
    SECTION === "Domain"
      ? `domain-${DOMAIN.toLowerCase()}-questions.json`
      : SECTION === "General Test"
        ? "general-test-questions.json"
        : "language-questions.json";
  const outPath = path.join(outDir, fileName);
  const existing = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, "utf8")) : [];

  console.log(`[CUET ${SECTION}${DOMAIN ? " · " + DOMAIN : ""}] Generating ${COUNT} questions…`);
  let allNew = [];
  for (let i = 0; i < COUNT; i += BATCH) {
    const size = Math.min(BATCH, COUNT - i);
    try {
      const batch = await generateBatch(size);
      allNew = allNew.concat(batch);
      console.log(`  ✓ batch ${Math.floor(i / BATCH) + 1}: +${batch.length}`);
    } catch (err) {
      console.error(`  ✗ batch ${Math.floor(i / BATCH) + 1}: ${err.message}`);
    }
  }

  const all = [...existing, ...allNew];
  const idPrefix = SECTION === "General Test"
    ? "cuet-gt-"
    : SECTION === "Domain"
      ? `cuet-dom-${(DOMAIN || "x").toLowerCase().slice(0, 3)}-`
      : "cuet-lang-";
  all.forEach((q, i) => {
    q.id = `${idPrefix}${String(i + 1).padStart(4, "0")}`;
  });

  fs.writeFileSync(outPath, JSON.stringify(all, null, 2));
  console.log(`\n[CUET ${SECTION}] wrote ${all.length} total (${allNew.length} new) → ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
