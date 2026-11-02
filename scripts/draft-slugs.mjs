/**
 * Slugs of entries still at `status: draft`. Their entry Markdown and
 * evidence folders stay out of the public build until a human publishes them.
 *
 * Author: Colin Dixon
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export function draftSlugs(root) {
  const dir = join(root, "content", "entries");
  const out = new Set();
  let names = [];
  try { names = readdirSync(dir); } catch { return out; }
  for (const name of names) {
    if (!/\.mdx?$/.test(name)) continue;
    const fm = readFileSync(join(dir, name), "utf8").split(/^---\s*$/m)[1] || "";
    const m = fm.match(/^status:\s*["']?(\w+)/m);
    if (!m || m[1] === "draft") out.add(name.replace(/\.mdx?$/, ""));
  }
  return out;
}

/** True when a repo-relative path belongs to a draft entry. */
export function isDraftPath(rel, drafts) {
  const p = rel.split("\\").join("/");
  const e = p.match(/^content\/entries\/([^/]+)\.mdx?$/);
  if (e) return drafts.has(e[1]);
  const v = p.match(/^evidence\/[^/]+\/([^/]+)\//);
  return v ? drafts.has(v[1]) : false;
}
