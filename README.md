# Great Coltini Industries

Colton Donkersgoed’s personal portfolio, built around a single scrolling page with bold cobalt typography, original artwork, alternating game features, and an illustrated project collage. Built with Astro, TypeScript, typed Markdown collections, and CSS. All navigation and project content work without JavaScript.

Canonical domain: **greatcoltiniindustries.com**

Repository: https://github.com/greatcoltini/greatcoltiniindustries-website

## Development

Requires Node.js 24 or later.

```sh
npm ci
npm run dev
```

## Verification

```sh
npm run build
npx playwright install
npm test
npm run test:links
```

The production build type-checks Astro and verifies generated pages, internal links, anchors, assets, and metadata. Browser tests cover responsive navigation, accessibility, reduced motion, no JavaScript, text enlargement, and deferred video. The local test matrix includes Edge; CI uses Chromium, Firefox, and WebKit.

## Content

Add or edit Markdown files in `src/content/projects/`. The schema is in `src/content.config.ts`. The filename becomes the `/projects/<slug>/` URL. Set `category` to `games`, `apps`, or `mods`; mods include `hostGame`. `order` controls display order. Frontmatter provides the summary, artwork, features, technology, and verified actions; Markdown provides overview and development notes.

Keep a `## Development` heading because detail pages link to it. Use project-owned artwork and accurate alt text. External actions are optional: do not infer publication from local source files. Test public links with `npm run test:links` and manually verify the publisher and destination before adding them.

Fonts are self-hosted through Fontsource. Astro generates responsive WebP images. The local gameplay video loads only on request and never autoplays.

See [deployment](docs/deployment.md), [asset sources](docs/assets.md), and [verification](docs/verification.md).
