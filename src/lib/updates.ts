import type { ImageMetadata } from 'astro';
import polledData from '../data/updates.json';
import { projectUrl, type Project } from './projects';

// Written by scripts/poll-updates.mjs from each project's public changelog
// and the Bluesky account in src/lib/profiles.ts.
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
interface SavedMedia {
  kind: 'image' | 'video' | 'link';
  /** The post itself for pictures and video; the linked page for link cards. */
  href: string;
  alt?: string;
  /** Pictures in the post, when there is more than one. */
  count?: number;
  /** A link card's title. */
  title?: string;
  /** A preview image in src/assets/devlog/. */
  image?: string;
}
interface BlueskyPost {
  id: string;
  date: string;
  title: string;
  summary?: string;
  /** The whole post, used to credit it to the project it names. */
  text: string;
  url: string;
  media?: SavedMedia;
}
const data = polledData as {
  projects: Record<string, PolledProject>;
  bluesky?: { handle: string; posts: BlueskyPost[] };
};
const polled = data.projects;

export type UpdateKind = PolledKind | 'update' | 'note' | 'post';
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
export interface PostMedia extends Omit<SavedMedia, 'image'> {
  image?: ImageMetadata;
}
export interface FeedItem extends ProjectUpdate {
  /** Missing for Bluesky posts that don't name a project. */
  project?: Project;
  /** Further updates of the same sort to the same project that day, folded in. */
  more: number;
  /** A Bluesky post's first picture, video, or link card. */
  media?: PostMedia;
}

const previews = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/devlog/*.{jpg,png,webp}',
  { eager: true },
);
function postMedia(media?: SavedMedia): PostMedia | undefined {
  if (!media) return undefined;
  const image = media.image
    ? previews[`../assets/devlog/${media.image}`]?.default
    : undefined;
  return { ...media, image };
}

/**
 * Where an entry's title leads: changelog entries to themselves on the project
 * page, news and posts to the project, and posts that name none straight to Bluesky.
 */
export const entryHref = (item: FeedItem) =>
  !item.project
    ? item.url
    : item.kind === 'news' || item.kind === 'post'
      ? projectUrl(item.project)
      : `${projectUrl(item.project)}#update-${item.id}`;

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
    post: 'Bluesky',
  }[update.kind];
};

export const sourceLabel = (update: ProjectUpdate) =>
  update.url?.includes('bsky.app')
    ? 'Bluesky'
    : update.url?.includes('thunderstore.io')
      ? 'Thunderstore'
      : 'Steam';

/**
 * Every project's changelog plus news and Bluesky posts, newest first. A Steam
 * news post that names another project (Kingdom TD announced on the Lone
 * Survivors page) is credited to that project; a Bluesky post goes to the first
 * project it names, or to none. Same-day items of one sort fold together.
 */
export function devlogFeed(projects: Project[]): FeedItem[] {
  const names = (p: Project) =>
    [p.data.shortTitle, p.data.title].filter(Boolean) as string[];
  // Ignores spacing and punctuation, so "KingdomTD" and #LoneSurvivors still count.
  const squash = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const firstNamed = (text: string) => {
    const squashed = squash(text);
    const mentions = projects
      .map((project) => ({
        project,
        at: Math.min(
          ...names(project)
            .map((name) => squashed.indexOf(squash(name)))
            .filter((at) => at >= 0),
        ),
      }))
      .filter((mention) => Number.isFinite(mention.at))
      .sort((a, b) => a.at - b.at);
    return mentions[0]?.project;
  };
  const items: FeedItem[] = projects.flatMap((project) =>
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
  for (const post of data.bluesky?.posts ?? []) {
    items.push({
      id: post.id,
      date: post.date.slice(0, 10),
      title: post.title,
      changes: post.summary ? [post.summary] : [],
      url: post.url,
      kind: 'post',
      automatic: true,
      project: firstNamed(post.text),
      more: 0,
      media: postMedia(post.media),
    });
  }
  items.sort((a, b) => b.date.localeCompare(a.date));
  const feed: FeedItem[] = [];
  for (const item of items) {
    const same = feed.find(
      (f) =>
        f.project === item.project &&
        f.date === item.date &&
        (f.kind === 'post') === (item.kind === 'post'),
    );
    if (same) same.more++;
    else feed.push(item);
  }
  return feed;
}
