#!/usr/bin/env node
/**
 * Copy repo-root /evidence into public/evidence so Astro can serve it.
 * Source of truth stays at the root: Git history is the timestamp.
 *
 * Author: Colin Dixon
 */
import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { draftSlugs, isDraftPath } from "./draft-slugs.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const from = join(root, "evidence");
const to = join(root, "public", "evidence");

if (!existsSync(from)) {
  console.error("sync-evidence: missing evidence/");
  process.exit(1);
}

await rm(to, { recursive: true, force: true });
await mkdir(dirname(to), { recursive: true });
const drafts = draftSlugs(root);
await cp(from, to, {
  recursive: true,
  // Draft entries keep their evidence out of the public build.
  filter: (src) => !isDraftPath(`evidence/${src.slice(from.length + 1)}/`, drafts),
});
console.log("sync-evidence: copied evidence/ → public/evidence/");
