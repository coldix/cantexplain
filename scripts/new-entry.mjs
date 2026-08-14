#!/usr/bin/env node
/**
 * Scaffold a draft entry + evidence stub.
 *
 *   npm run new -- --slug gina-puppet-abc --person "Pauline Hanson" --year 2026
 *
 * Author: Colin Dixon
 */
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const args = parseArgs(process.argv.slice(2));
const slug = slugify(args.slug || "");
const person = args.person || "Name";
const year = args.year || String(new Date().getFullYear());
const today = new Date().toISOString().slice(0, 10);

if (!slug) {
  console.error("Usage: npm run new -- --slug short-name --person \"Name\" --year 2026");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const entryPath = join(root, "content", "entries", `${slug}.md`);
const evidenceDir = join(root, "evidence", year, slug);
const evidenceFile = join(evidenceDir, "source.md");

if (existsSync(entryPath)) {
  console.error(`already exists: ${entryPath}`);
  process.exit(1);
}

const entry = `---
title: "${person} — ${slug}"
claim: "Replace with the accusation, quoted or clearly paraphrased."
caption: "One or two observational sentences. Receipt-first."
status: draft
example: false
published: ${today}
person: ${person}
claimType: speech
year: ${Number(year)}
loudness: 5
tags: [${slugify(person)}, "${year}"]
source:
  url: https://example.com/replace-me
  date: "${today}"
  publisher: Replace me
  title: ""
  quote: ""
evidence:
  path: ${year}/${slug}/source.md
  kind: note
  captured: "${today}"
---

Short context. Who said it, what was missing. Keep it short.
`;

const evidence = `# Evidence — ${slug}

- **URL:**
- **Captured:** ${today}
- **Method:** (screenshot / saved HTML / transcript)
- **Note:** Draft stub from \`npm run new\`. Replace this file with the real capture.

Do not rewrite a finished capture in place. Add another file and mention it here.
`;

await mkdir(dirname(entryPath), { recursive: true });
await mkdir(evidenceDir, { recursive: true });
await writeFile(entryPath, entry);
await writeFile(evidenceFile, evidence);

console.log(`draft:    content/entries/${slug}.md`);
console.log(`evidence: evidence/${year}/${slug}/source.md`);
console.log("Leave status: draft until a human has opened the source and the file.");

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseArgs(argv) {
  /** @type {Record<string, string>} */
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) out[key] = "true";
    else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}
