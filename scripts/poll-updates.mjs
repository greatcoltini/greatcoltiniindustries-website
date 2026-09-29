// Fetches each project's public changelog into src/data/updates.json.
// The poll-updates workflow runs this every six hours; it is safe to run locally.
// Sources come from each project's action link: Steam store pages use Steam news,
// Workshop items use their change notes, and Thunderstore packages use their changelog.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const dir = 'src/content/projects';
const out = 'src/data/updates.json';
const keep = 6;
const previous = existsSync(out)
  ? JSON.parse(readFileSync(out, 'utf8')).projects
  : {};

const entities = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};
const decode = (text) =>
  text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(parseInt(code, 16)),
    )
    .replace(
      /&([a-z]+);/gi,
      (match, name) => entities[name.toLowerCase()] ?? match,
    );
const tidy = (text) => text.replace(/\s+/g, ' ').trim();
const versionOf = (text) => text.match(/\b(\d+\.\d+(?:\.\d+)*)\b/)?.[1];

// Joins lines until there is enough to read, then trims to a sentence or word.
function summarize(lines, min = 80, max = 240) {
  let text = '';
  for (const line of lines) {
    text = text ? `${text} ${line}` : line;
    if (text.length >= min) break;
  }
  if (text.length <= max) return text || undefined;
  const cut = text.slice(0, max);
  const sentence = cut.match(/^[\s\S]*[.!?](?=\s)/)?.[0];
  if (sentence && sentence.length >= min) return sentence;
  return `${cut.replace(/\s+\S*$/, '')}…`;
}

async function get(url, as = 'json') {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': 'greatcoltiniindustries.com update poller' },
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return as === 'json' ? await response.json() : await response.text();
    } catch (error) {
      if (attempt === 2) throw new Error(`${url}: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

// Steam posts use BBCode-style markup. Spoilers are dropped so hidden details stay hidden.
function steamLines(markup) {
  const text = markup
    .replace(/\[spoiler\][\s\S]*?\[\/spoiler\]/gi, '')
    .replace(/\[(h1|img|previewyoutube|video)\b[^\]]*\][\s\S]*?\[\/\1\]/gi, '')
    .replace(/\[(h[2-6])\][\s\S]*?\[\/\1\]/gi, '\n')
    .replace(
      /\[\/?(p|list|olist|\*|hr|table|tr|td|th|quote|code)\b[^\]]*\]/gi,
      '\n',
    )
    .replace(/\[[^\]]+\]/g, '')
    .replace(/\{STEAM_CLAN_IMAGE\}\S*/g, '');
  return decode(text).split('\n').map(tidy).filter(Boolean);
}

function steamTitle(title, markup, projectTitle, version) {
  const strip = (text) =>
    tidy(text)
      .replace(/^patch notes?\s*:?\s*/i, '')
      .replace(/^v?\d+(?:\.\d+)+\s*[-–—:]?\s*/, '')
      .trim();
  let clean = strip(title);
  const heading = markup.match(/\[h1\]([\s\S]*?)\[\/h1\]/i)?.[1];
  if (!clean && heading)
    clean = strip(
      decode(heading.replace(/\[[^\]]+\]/g, '')).replace(projectTitle, ''),
    );
  return clean || (version ? 'Patch notes' : tidy(title));
}

async function steamNews(appid, project) {
  const { appnews } = await get(
    `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${appid}&count=20&maxlength=0&format=json`,
  );
  return (appnews?.newsitems ?? [])
    .filter((item) => item.feedname === 'steam_community_announcements')
    .map((item) => {
      const version = versionOf(item.title);
      const patch = version || item.tags?.includes('patchnotes');
      return {
        id: `steam-${item.gid}`,
        date: new Date(item.date * 1000).toISOString(),
        title: steamTitle(item.title, item.contents, project.title, version),
        summary: summarize(steamLines(item.contents)),
        version,
        kind: patch ? 'patch' : 'news',
        url: `https://store.steampowered.com/news/app/${appid}/view/${item.gid}`,
      };
    });
}

// Workshop change notes have no API; each note's element id is its Unix timestamp.
async function workshopNotes(id) {
  const page = `https://steamcommunity.com/sharedfiles/filedetails/changelog/${id}`;
  const html = await get(page, 'text');
  const notes = [
    ...html.matchAll(/changeLogCtn[\s\S]*?<p id="(\d+)">([\s\S]*?)<\/p>/g),
  ];
  if (!notes.length) throw new Error(`${page}: no change notes found`);
  return notes.map(([, stamp, body]) => {
    const lines = decode(
      body.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ''),
    )
      .split('\n')
      .map(tidy)
      .filter(Boolean);
    return {
      id: `workshop-${stamp}`,
      date: new Date(Number(stamp) * 1000).toISOString(),
      title: lines[0] || 'Workshop update',
      summary: summarize(lines.slice(1)),
      version: lines[0]?.match(/mod version (\d+(?:\.\d+)+)/i)?.[1],
      kind: 'workshop',
      url: `${page}#${stamp}`,
    };
  });
}

async function thunderstoreReleases(namespace, name, packageUrl) {
  const api = `https://thunderstore.io/api/experimental/package/${namespace}/${name}`;
  const { latest } = await get(`${api}/`);
  const { markdown } = await get(`${api}/${latest.version_number}/changelog/`);
  const lines = markdown
    .split(/\r?\n/)
    .map((line) => line.match(/^v?(\d+(?:\.\d+)+)\s*:\s*(.+)$/))
    .filter(Boolean)
    .slice(0, keep);
  return Promise.all(
    lines.map(async ([, version, text]) => ({
      id: `thunderstore-${version}`,
      date: (await get(`${api}/${version}/`)).date_created,
      title: tidy(decode(text.replace(/<br\s*\/?>/gi, ' '))),
      version,
      kind: 'release',
      url: packageUrl,
    })),
  );
}

function sourceFor(url, project) {
  const steam = url.match(/store\.steampowered\.com\/app\/(\d+)/);
  if (steam)
    return {
      source: 'steam-news',
      sourceUrl: `https://store.steampowered.com/news/app/${steam[1]}`,
      fetch: () => steamNews(steam[1], project),
    };
  const workshop = url.match(
    /steamcommunity\.com\/sharedfiles\/filedetails\/\?id=(\d+)/,
  );
  if (workshop)
    return {
      source: 'workshop',
      sourceUrl: `https://steamcommunity.com/sharedfiles/filedetails/changelog/${workshop[1]}`,
      fetch: () => workshopNotes(workshop[1]),
    };
  const thunderstore = url.match(
    /thunderstore\.io\/c\/[^/]+\/p\/([^/]+)\/([^/]+)/,
  );
  if (thunderstore)
    return {
      source: 'thunderstore',
      sourceUrl: url,
      fetch: () => thunderstoreReleases(thunderstore[1], thunderstore[2], url),
    };
}

const projects = readdirSync(dir)
  .filter((file) => file.endsWith('.md'))
  .map((file) => {
    const text = readFileSync(`${dir}/${file}`, 'utf8');
    const title = text.match(/^title:\s*['"]?(.+?)['"]?\s*$/m)?.[1] ?? file;
    const url = text.match(/^\s+url:\s*(\S+)/m)?.[1];
    return { slug: file.replace(/\.md$/, ''), title, url };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

const results = {};
let polled = 0;
let failed = 0;
for (const project of projects) {
  const source = project.url && sourceFor(project.url, project);
  if (!source) continue;
  polled++;
  try {
    const entries = (await source.fetch())
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, keep);
    results[project.slug] = {
      source: source.source,
      sourceUrl: source.sourceUrl,
      entries,
    };
    console.log(`${project.slug}: ${entries.length} entries`);
  } catch (error) {
    failed++;
    // Keep the last good entries so one failed request never empties a changelog.
    if (previous[project.slug]) results[project.slug] = previous[project.slug];
    console.warn(`${project.slug}: kept previous entries (${error.message})`);
  }
}

writeFileSync(out, `${JSON.stringify({ projects: results }, null, 2)}\n`);
console.log(`Polled ${polled} sources, ${failed} failed.`);
if (polled && failed === polled) process.exitCode = 1;
