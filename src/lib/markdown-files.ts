import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
// @ts-ignore plain JS helper shared with the build scripts
import { draftSlugs, isDraftPath } from "../../scripts/draft-slugs.mjs";

const ROOTS = ["evidence", "docs", "content"];

async function walk(dir: string, acc: string[] = []) {
  let names: string[];
  try {
    names = await readdir(dir);
  } catch {
    return acc;
  }
  for (const name of names) {
    if (name.startsWith(".")) continue;
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) await walk(p, acc);
    else if (name.endsWith(".md") || name.endsWith(".mdx")) acc.push(p);
  }
  return acc;
}

export async function listRepoMarkdown(cwd = process.cwd()) {
  const files: string[] = [];
  for (const root of ROOTS) {
    await walk(join(cwd, root), files);
  }
  const readme = join(cwd, "README.md");
  try {
    await stat(readme);
    files.push(readme);
  } catch {
    /* optional */
  }
  const drafts = draftSlugs(cwd);
  return files
    .map((abs) => ({
      abs,
      rel: relative(cwd, abs).split("\\").join("/"),
    }))
    .filter((f) => !isDraftPath(f.rel, drafts));
}

export async function readRepoMarkdown(rel: string, cwd = process.cwd()) {
  const normalised = rel.replace(/^\/+/, "").split("\\").join("/");
  if (normalised.includes("..")) return null;
  const allowed =
    normalised === "README.md" ||
    ROOTS.some((r) => normalised === r || normalised.startsWith(`${r}/`));
  if (!allowed || !/\.mdx?$/i.test(normalised)) return null;
  if (isDraftPath(normalised, draftSlugs(cwd))) return null;
  try {
    const abs = join(cwd, normalised);
    const body = await readFile(abs, "utf8");
    return { rel: normalised, body };
  } catch {
    return null;
  }
}

export function titleFromMarkdown(rel: string, body: string) {
  const h1 = body.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].replace(/\s+/g, " ").trim();
  const title = body.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  if (title) return title[1].trim();
  return rel.split("/").pop() || rel;
}
