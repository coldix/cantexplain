import { getCollection, type CollectionEntry } from "astro:content";
import { isLive } from "./site";

export type Entry = CollectionEntry<"entries">;

export async function liveEntries(): Promise<Entry[]> {
  const all = await getCollection("entries");
  return all
    .filter((e) => isLive(e.data.status))
    .sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
}

export async function featuredEntries(): Promise<Entry[]> {
  const live = await liveEntries();
  const featured = live.filter((e) => e.data.status === "featured");
  return featured.length ? featured : live.slice(0, 3);
}

export function entryHref(entry: Entry) {
  return `/hall/${entry.id}`;
}

export function evidenceHref(path: string) {
  return `/evidence/${path.replace(/^\//, "")}`;
}

export function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "en-AU"));
}
