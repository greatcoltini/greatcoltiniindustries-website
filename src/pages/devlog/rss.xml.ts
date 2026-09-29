import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { projectsIn } from '../../lib/projects';
import {
  devlogFeed,
  entryHref,
  sourceLabel,
  updateLabel,
  type FeedItem,
} from '../../lib/updates';

// The dev log as RSS 2.0, newest first. Readers get the same entries as /devlog/.
const limit = 30;
const escape = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const pubDate = (date: string) => new Date(`${date}T12:00:00Z`).toUTCString();

function itemTitle(item: FeedItem) {
  const project = item.project;
  if (!project) return item.title;
  const name = project.data.shortTitle || project.data.title;
  return `${name}${item.version ? ` ${item.version}` : ''}: ${item.title}`;
}

export const GET: APIRoute = async ({ site }) => {
  const absolute = (path: string) => new URL(path, site).href;
  const feed = devlogFeed(await projectsIn()).slice(0, limit);
  const items = await Promise.all(
    feed.map(async (item) => {
      // News and posts live on Steam or Bluesky; everything else on its project page.
      const link =
        (item.kind === 'news' || item.kind === 'post') && item.url
          ? item.url
          : absolute(entryHref(item) ?? '/devlog/');
      const parts = item.changes.map((change) => `<p>${escape(change)}</p>`);
      const { media } = item;
      if (media?.image) {
        const preview = await getImage({
          src: media.image,
          width: 800,
          format: 'webp',
          quality: 72,
        });
        parts.push(
          `<p><a href="${escape(media.href)}"><img src="${escape(absolute(preview.src))}" alt="${escape(media.alt ?? '')}" /></a></p>`,
        );
      }
      if (item.more > 0)
        parts.push(
          `<p>+${item.more} more ${item.more === 1 ? 'update' : 'updates'} that day.</p>`,
        );
      if (item.url && item.url !== link)
        parts.push(
          `<p><a href="${escape(item.url)}">Read on ${sourceLabel(item)}</a></p>`,
        );
      return [
        '<item>',
        `<title>${escape(itemTitle(item))}</title>`,
        `<link>${escape(link)}</link>`,
        `<guid isPermaLink="false">${escape(`${item.project?.id ?? 'studio'}/${item.id}`)}</guid>`,
        `<pubDate>${pubDate(item.date)}</pubDate>`,
        `<category>${escape(updateLabel(item))}</category>`,
        parts.length
          ? `<description>${escape(parts.join(''))}</description>`
          : '',
        '</item>',
      ]
        .filter(Boolean)
        .join('');
    }),
  );
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    '<title>GreatColtini Industries dev log</title>',
    `<link>${absolute('/devlog/')}</link>`,
    `<atom:link href="${absolute('/devlog/rss.xml')}" rel="self" type="application/rss+xml" />`,
    '<description>Patch notes, Workshop updates, and Bluesky posts from the games, apps, and mods of Colton Donkersgoed.</description>',
    '<language>en</language>',
    feed[0] ? `<lastBuildDate>${pubDate(feed[0].date)}</lastBuildDate>` : '',
    ...items,
    '</channel>',
    '</rss>',
  ]
    .filter(Boolean)
    .join('\n');
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
