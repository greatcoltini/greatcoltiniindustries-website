// Fetches each project's public changelog, and recent Bluesky posts, into
// src/data/updates.json. The poll-updates workflow runs this every six hours; it is
// safe to run locally. Sources come from each project's action link: Steam store
// pages use Steam news, Workshop items use their change notes, and Thunderstore
// packages use their changelog. The Bluesky handle comes from src/lib/profiles.ts;
// each post's picture, video thumbnail, or link-card image is saved to src/assets/devlog/.
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';

const dir = 'src/content/projects';
const out = 'src/data/updates.json';
const mediaDir = 'src/assets/devlog';
const keep = 6;
const keepPosts = 12;
const previous = existsSync(out)
  ? JSON.parse(readFileSync(out, 'utf8'))
  : { projects: {} };

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
      if (as === 'json') return await response.json();
      if (as === 'text') return await response.text();
      return {
        type: response.headers.get('content-type')?.split(';')[0],
        bytes: Buffer.from(await response.arrayBuffer()),
      };
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

// A news item's own url redirects to the announcement page, whose id differs from
// the item's gid. Save the destination; fall back to the redirecting url.
async function announcementUrl(url) {
  try {
    const response = await fetch(url, {
      headers: { 'user-agent': 'greatcoltiniindustries.com update poller' },
      signal: AbortSignal.timeout(20000),
    });
    await response.body?.cancel();
    return response.ok && /\/announcements\/detail\/\d+$/.test(response.url)
      ? response.url
      : url;
  } catch {
    return url;
  }
}

async function steamNews(appid, project) {
  const { appnews } = await get(
    `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${appid}&count=20&maxlength=0&format=json`,
  );
  const items = (appnews?.newsitems ?? [])
    .filter((item) => item.feedname === 'steam_community_announcements')
    .sort((a, b) => b.date - a.date)
    .slice(0, keep);
  return Promise.all(
    items.map(async (item) => {
      const version = versionOf(item.title);
      const patch = version || item.tags?.includes('patchnotes');
      return {
        id: `steam-${item.gid}`,
        date: new Date(item.date * 1000).toISOString(),
        title: steamTitle(item.title, item.contents, project.title, version),
        summary: summarize(steamLines(item.contents)),
        version,
        kind: patch ? 'patch' : 'news',
        url: await announcementUrl(item.url),
      };
    }),
  );
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

// A post's first sentence becomes its title; lines of only hashtags are dropped.
function postParts(text) {
  const lines = text
    .split('\n')
    .map(tidy)
    .filter((line) => line && !/^(#\S+\s*)+$/.test(line))
    .map((line) => line.replace(/(\s+#\S+)+$/, ''));
  const first = lines[0] ?? '';
  const sentence = first.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? first;
  const title =
    sentence.length <= 100
      ? sentence
      : `${sentence.slice(0, 100).replace(/\s+\S*$/, '')}…`;
  const rest = [tidy(first.slice(sentence.length)), ...lines.slice(1)];
  return { title, summary: summarize(rest.filter(Boolean)) };
}

// A post's pictures, video, or link card. `from` is the preview image to save.
function postMedia(embed, postUrl) {
  const view = embed?.$type?.startsWith('app.bsky.embed.recordWithMedia')
    ? embed.media
    : embed;
  const type = view?.$type ?? '';
  if (type.startsWith('app.bsky.embed.images') && view.images?.length) {
    const [first] = view.images;
    return {
      kind: 'image',
      href: postUrl,
      alt: tidy(first.alt ?? ''),
      ...(view.images.length > 1 && { count: view.images.length }),
      from: first.thumb,
    };
  }
  if (type.startsWith('app.bsky.embed.video'))
    return {
      kind: 'video',
      href: postUrl,
      alt: tidy(view.alt ?? ''),
      from: view.thumbnail,
    };
  if (type.startsWith('app.bsky.embed.external') && view.external?.uri) {
    const { uri, title, thumb } = view.external;
    return {
      kind: 'link',
      href: uri,
      title: tidy(decode(title ?? '')) || new URL(uri).hostname,
      from: thumb,
    };
  }
}

// Video thumbnails arrive as application/octet-stream, so the bytes decide the type.
function imageType(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'jpg';
  if (bytes.subarray(0, 4).toString('latin1') === '\x89PNG') return 'png';
  if (bytes.subarray(8, 12).toString('latin1') === 'WEBP') return 'webp';
}

// Preview images are named after their post and never change, so a saved one is
// reused. When Bluesky's image CDN is down, the original comes from the account's
// own server instead.
async function savePreview(from, id) {
  const saved = readdirSync(mediaDir).find((file) => file.startsWith(`${id}.`));
  if (saved) return saved;
  const blob = from.match(/\/img\/[^/]+\/plain\/(did:[^/]+)\/([^/@]+)/);
  const sources = [
    from,
    ...(blob
      ? [
          `https://bsky.social/xrpc/com.atproto.sync.getBlob?did=${blob[1]}&cid=${blob[2]}`,
        ]
      : []),
  ];
  let failure;
  for (const source of sources) {
    try {
      const { bytes } = await get(source, 'bytes');
      const type = imageType(bytes);
      if (!type) throw new Error(`${source}: not an image`);
      const file = `${id}.${type}`;
      writeFileSync(`${mediaDir}/${file}`, bytes);
      return file;
    } catch (error) {
      failure = error;
    }
  }
  throw failure;
}

// Bluesky's public API needs no account. Reposts and replies are left out.
async function blueskyPosts(handle) {
  const posts = [];
  let cursor = '';
  while (posts.length < keepPosts) {
    const page = await get(
      `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(handle)}&filter=posts_no_replies&limit=50${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`,
    );
    for (const { post, reason } of page.feed ?? []) {
      if (reason || post.record.reply || !post.record.text) continue;
      const rkey = post.uri.split('/').pop();
      posts.push({
        id: `bsky-${rkey}`,
        date: new Date(post.record.createdAt).toISOString(),
        ...postParts(post.record.text),
        text: tidy(post.record.text),
        url: `https://bsky.app/profile/${post.author.did}/post/${rkey}`,
        embed: post.embed,
      });
    }
    if (!page.cursor || !page.feed?.length) break;
    cursor = page.cursor;
  }
  const kept = posts
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, keepPosts);
  mkdirSync(mediaDir, { recursive: true });
  for (const post of kept) {
    const found = postMedia(post.embed, post.url);
    delete post.embed;
    if (!found) continue;
    const { from, ...media } = found;
    if (from)
      try {
        media.image = await savePreview(from, post.id);
      } catch (error) {
        // The post still links to its media; it just shows no preview.
        console.warn(`${post.id}: no preview image (${error.message})`);
      }
    post.media = media;
  }
  // Images of posts that have dropped out of the newest few are removed.
  for (const file of readdirSync(mediaDir))
    if (!kept.some((post) => file.startsWith(`${post.id}.`)))
      rmSync(`${mediaDir}/${file}`);
  return kept;
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
    if (previous.projects[project.slug])
      results[project.slug] = previous.projects[project.slug];
    console.warn(`${project.slug}: kept previous entries (${error.message})`);
  }
}

let bluesky = previous.bluesky;
const handle = readFileSync('src/lib/profiles.ts', 'utf8').match(
  /bsky\.app\/profile\/([^'"/\s]+)/,
)?.[1];
if (handle) {
  polled++;
  try {
    bluesky = { handle, posts: await blueskyPosts(handle) };
    console.log(`bluesky: ${bluesky.posts.length} posts`);
  } catch (error) {
    failed++;
    console.warn(`bluesky: kept previous posts (${error.message})`);
  }
}

writeFileSync(
  out,
  `${JSON.stringify({ projects: results, bluesky }, null, 2)}\n`,
);
console.log(`Polled ${polled} sources, ${failed} failed.`);
if (polled && failed === polled) process.exitCode = 1;
