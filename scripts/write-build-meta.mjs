#!/usr/bin/env node
/**
 * Stamp the footer: git SHA + Melbourne date/time.
 * Author: Colin Dixon
 */
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function sh(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8", cwd: root }).trim();
  } catch {
    return null;
  }
}

const now = new Date();
const aest = new Intl.DateTimeFormat("en-AU", {
  timeZone: "Australia/Melbourne",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
  timeZoneName: "short",
}).format(now);

const parts = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Australia/Melbourne",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
})
  .formatToParts(now)
  .reduce((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});

const offsetFmt = new Intl.DateTimeFormat("en-AU", {
  timeZone: "Australia/Melbourne",
  timeZoneName: "longOffset",
})
  .formatToParts(now)
  .find((p) => p.type === "timeZoneName")?.value;

const sha = sh("git rev-parse --short HEAD") || "unknown";
const shaFull = sh("git rev-parse HEAD") || null;
const dirty = Boolean(sh("git status --porcelain"));
const version = `${parts.year}${parts.month}${parts.day}.${parts.hour}${parts.minute}-aest+${sha}${dirty ? "-dirty" : ""}`;

const meta = {
  version,
  git_sha: sha,
  git_sha_full: shaFull,
  git_dirty: dirty,
  built_at_utc: now.toISOString(),
  built_at_aest: aest,
  built_at_aest_offset: offsetFmt || "Australia/Melbourne",
  built_at_aest_compact: `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`,
};

const json = JSON.stringify(meta, null, 2) + "\n";
const genDir = join(root, "src", "generated");
mkdirSync(genDir, { recursive: true });
writeFileSync(join(genDir, "build-meta.json"), json);
mkdirSync(join(root, "public"), { recursive: true });
writeFileSync(join(root, "public", "build-meta.json"), json);
console.log(`build-meta: ${version} (${aest})`);
