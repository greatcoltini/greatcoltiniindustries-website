import polledData from '../data/updates.json';
import type { Project } from './projects';

// Written by scripts/poll-updates.mjs from each project's public changelog.
type PolledKind = 'patch' | 'news' | 'workshop' | 'release';
interface PolledEntry {
  id: string;
  date: string;
  title: string;
  summary?: string;
  version?: string;
  kind: PolledKind;
  url?: string;
}
interface PolledProject {
  source: 'steam-news' | 'workshop' | 'thunderstore';
  sourceUrl: string;
  entries: PolledEntry[];
}
const polled = (polledData as { projects: Record<string, PolledProject> })
  .projects;

export type UpdateKind = PolledKind | 'update' | 'note';
export interface ProjectUpdate {
  id: string;
  date: string;
  version?: string;
  title: string;
  changes: string[];
  url?: string;
  kind: UpdateKind;
  automatic: boolean;
}
export interface FeedItem extends ProjectUpdate {
  project: Project;
  /** Further updates to the same project on the same day, folded into this one. */
  more: number;
}

const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
/** "28 Sep 2026"; pass `year: false` for "28 Sep". Dates are UTC days. */
export function formatDate(date: string, { year = true } = {}) {
  const [y, m, d] = date.slice(0, 10).split('-').map(Number);
  return `${d} ${months[m - 1]}${year ? ` ${y}` : ''}`;
}

// Curated entries link to the same Steam post or Workshop note the poller records.
const sourceId = (url?: string) => {
  const steam = url?.match(/(?:announcements|view)\/(\d+)/)?.[1];
  if (steam) return `steam-${steam}`;
  const workshop = url?.match(/changelog\/\d+#(\d+)/)?.[1];
  return workshop ? `workshop-${workshop}` : undefined;
};

function curatedKind(
  project: Project,
  update: { url?: string; version?: string },
) {
  if (!update.url) return 'note';
  if (!update.version) return 'update';
  const source = polled[project.id]?.source;
  return source === 'workshop'
    ? 'workshop'
    : source === 'thunderstore'
      ? 'release'
      : 'patch';
}

function fromPolled(entry: PolledEntry): ProjectUpdate {
  return {
    id: entry.version ? `v${entry.version.replaceAll('.', '-')}` : entry.id,
    date: entry.date.slice(0, 10),
    version: entry.version,
    title: entry.title,
    changes: entry.summary ? [entry.summary] : [],
    url: entry.url,
    kind: entry.kind,
    automatic: true,
  };
}

/**
 * A project's changelog, newest first. Curated `updates` frontmatter is the
 * history; polled releases from the same day or later that it does not cover yet
 * are added until they are curated. News posts stay out of changelogs.
 */
export function projectUpdates(project: Project): ProjectUpdate[] {
  const curated = project.data.updates.map((update) => ({
    ...update,
    kind: curatedKind(project, update) as UpdateKind,
    automatic: false,
  }));
  const newest = curated.reduce((max, u) => (u.date > max ? u.date : max), '');
  const covered = new Set(curated.map((u) => sourceId(u.url)));
  const ids = new Set(curated.map((u) => u.id));
  const automatic = (polled[project.id]?.entries ?? [])
    .filter(
      (entry) =>
        entry.kind !== 'news' &&
        !covered.has(entry.id) &&
        entry.date.slice(0, 10) >= newest,
    )
    .map(fromPolled)
    .filter((update) => !ids.has(update.id));
  // Stable sort keeps newer automatic entries above curated ones from the same day.
  return [...automatic, ...curated].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

/** The newest released update, for "Updated …" lines. Notes without a source don't count. */
export const latestRelease = (project: Project) =>
  projectUpdates(project).find((update) => update.url);

export const updateLabel = (update: ProjectUpdate) => {
  const version = update.version ? ` ${update.version}` : '';
  return {
    patch: `Patch${version}`,
    workshop: update.version ? `Mod${version}` : 'Workshop',
    release: `Version${version}`,
    news: 'News',
    update: 'Update',
    note: 'Dev note',
  }[update.kind];
};

export const sourceLabel = (update: ProjectUpdate) =>
  update.url?.includes('thunderstore.io') ? 'Thunderstore' : 'Steam';

/**
 * Every project's changelog plus news posts, newest first. A post that names
 * another project (Kingdom TD announced on the Lone Survivors page) is credited
 * to that project. Same-day updates to one project fold into a single item.
 */
export function devlogFeed(projects: Project[]): FeedItem[] {
  const names = (p: Project) =>
    [p.data.shortTitle, p.data.title].filter(Boolean) as string[];
  const items = projects.flatMap((project) =>
    projectUpdates(project).map((update) => ({ ...update, project, more: 0 })),
  );
  for (const [slug, source] of Object.entries(polled)) {
    const home = projects.find((p) => p.id === slug);
    if (!home) continue;
    for (const entry of source.entries.filter((e) => e.kind === 'news')) {
      const named = projects.find(
        (p) => p !== home && names(p).some((n) => entry.title.includes(n)),
      );
      items.push({ ...fromPolled(entry), project: named ?? home, more: 0 });
    }
  }
  items.sort((a, b) => b.date.localeCompare(a.date));
  const feed: FeedItem[] = [];
  for (const item of items) {
    const same = feed.find(
      (f) => f.project === item.project && f.date === item.date,
    );
    if (same) same.more++;
    else feed.push(item);
  }
  return feed;
}
