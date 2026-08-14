#!/usr/bin/env node
/**
 * Fail the build if a published/featured entry is missing its source or file.
 *
 * Author: Colin Dixon
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "content", "entries");
const evidenceRoot = join(root, "evidence");

const files = existsSync(dir)
  ? readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
  : [];

const errors = [];

for (const file of files) {
  const raw = readFileSync(join(dir, file), "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    errors.push(`${file}: missing frontmatter`);
    continue;
  }
  const fm = match[1];
  const status = pick(fm, "status");
  if (status !== "published" && status !== "featured") continue;

  const url = pickNested(fm, "url");
  const date = pickNested(fm, "date");
  const path = pickNested(fm, "path");

  if (!url || !/^https?:\/\//.test(url)) {
    errors.push(`${file}: published entry needs source.url`);
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push(`${file}: published entry needs source.date (YYYY-MM-DD)`);
  }
  if (!path) {
    errors.push(`${file}: published entry needs evidence.path`);
  } else if (!existsSync(join(evidenceRoot, path))) {
    errors.push(`${file}: evidence file missing: evidence/${path}`);
  }
}

if (errors.length) {
  console.error("validate-entries failed:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

console.log(`validate-entries: ${files.length} file(s) checked`);

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
