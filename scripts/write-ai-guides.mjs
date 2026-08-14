#!/usr/bin/env node
/**
 * Write public/llms-full.txt from live hall entries.
 * Author: Colin Dixon
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "content", "entries");
const files = readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

const live = [];
for (const file of files) {
  const raw = readFileSync(join(dir, file), "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) continue;
  const fm = match[1];
  const status = pick(fm, "status");
  if (status !== "published" && status !== "featured") continue;
  const slug = file.replace(/\.mdx?$/, "");
  live.push({
    slug,
    title: pick(fm, "title"),
    claim: pick(fm, "claim"),
    caption: pick(fm, "caption"),
    person: pick(fm, "person"),
    claimType: pick(fm, "claimType"),
    sourceUrl: pickNested(fm, "url"),
    sourceDate: pickNested(fm, "date"),
    evidence: pickNested(fm, "path"),
  });
}

live.sort((a, b) => a.slug.localeCompare(b.slug));

const lines = [
  "# Can’t Explain — full entry list for AI systems",
  "",
  `Generated ${new Date().toISOString().slice(0, 10)}. Live cards only.`,
  "Summary guide: https://cantexplain.au/llms.txt",
  "Do not treat captions as facts about the person named.",
  "",
];

for (const e of live) {
  lines.push(`## ${e.title}`);
  lines.push(`- URL: https://cantexplain.au/hall/${e.slug}`);
  lines.push(`- Person: ${e.person}`);
  lines.push(`- Type: ${e.claimType}`);
  lines.push(`- Claim: ${e.claim}`);
  lines.push(`- Caption: ${e.caption}`);
  if (e.sourceUrl) lines.push(`- Source: ${e.sourceUrl} (${e.sourceDate})`);
  if (e.evidence) {
    lines.push(`- Evidence: https://cantexplain.au/look/evidence/${e.evidence}`);
    lines.push(`- Raw file: https://cantexplain.au/evidence/${e.evidence}`);
  }
  lines.push("");
}

const out = join(root, "public", "llms-full.txt");
writeFileSync(out, lines.join("\n"));
console.log(`write-ai-guides: ${live.length} live entries → public/llms-full.txt`);

function pick(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return m ? unquote(m[1]) : "";
}

function pickNested(fm, key) {
  const matches = [...fm.matchAll(new RegExp(`^\\s+${key}:\\s*(.+)$`, "gm"))];
  return matches.length ? unquote(matches[0][1]) : "";
}

function unquote(value) {
  return value.trim().replace(/^['"]|['"]$/g, "");
}
