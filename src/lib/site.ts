/** Site-level constants. Presentation concerns, not the content schema. */

export const SITE = {
  name: "Can’t Explain",
  short: "Can’t Explain",
  url: "https://cantexplain.au",
  domain: "cantexplain.au",
  altDomain: "cantexplain.com.au",
  tagline: "The claim was loud. The evidence was not.",
  descriptionLong:
    "A receipt-first hall of ridiculous claims: low-evidence, high-emotion accusations, " +
    "pinned to original sources and Git-timestamped evidence. Observational humour. " +
    "Sibling of ministryofdoubt.com and electiontracker.au.",
  repo: "https://github.com/coldix/cantexplain",
  issues: "https://github.com/coldix/cantexplain/issues/new",
  email: "colin@cantexplain.au",
  publisher: "Oze",
  publisherUrl: "https://oze.au",
  gaMeasurementId: "G-J0TM5BKG3S",
};

export const MAINTAINER = {
  name: "Colin Dixon",
  x: "https://x.com/colindixon",
  xHandle: "@colindixon",
  linkedin: "https://www.linkedin.com/in/colindixon/",
  publisherUrl: SITE.publisherUrl,
};

export const FAMILY = [
  {
    name: "Ministry of Doubt",
    href: "https://ministryofdoubt.com",
    line: "Suspicion is not proof. Authority is not proof either.",
  },
  {
    name: "Election Tracker",
    href: "https://electiontracker.au",
    line: "Sourced Australian election ledger. Not a forecast.",
  },
  {
    name: "Oze Unleashed",
    href: "https://ozeunleashed.substack.com",
    line: "Longer essays. Still sourced.",
  },
] as const;

export const CLAIM_TYPE_LABEL: Record<string, string> = {
  derangement: "Derangement",
  puppet: "Puppet",
  "no-evidence-required": "No evidence required",
  "guilt-by-association": "Guilt by association",
  "secret-agenda": "Secret agenda",
  other: "Other",
};

/**
 * Date-only strings must not shift by build-host timezone.
 * Parse as noon UTC and format in Melbourne, same as electiontracker.au.
 */
export const formatDate = (iso: string | Date, opts: Intl.DateTimeFormatOptions = {}) => {
  const raw = iso instanceof Date ? iso.toISOString().slice(0, 10) : iso;
  if (!raw) return null;
  return new Date(`${raw}T12:00:00Z`).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Australia/Melbourne",
    ...opts,
  });
};

export const formatDateLong = (iso: string | Date) =>
  formatDate(iso, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export const isLive = (status: string) => status === "published" || status === "featured";
