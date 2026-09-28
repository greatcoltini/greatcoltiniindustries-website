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

Add or edit Markdown files in `src/content/projects/`. The schema is in `src/content.config.ts`. The filename becomes the `/projects/<slug>/` URL. Set `category` to `games`, `apps`, or `mods`; mods include `hostGame`. `order` controls display order. Frontmatter provides the summary, overview paragraphs, availability, artwork, features, technology, and verified actions; Markdown provides development notes. Availability describes publication status, not a promise of current mod compatibility. The optional `listingName` preserves an original Workshop title while the display name stays consistent.

Keep a `## Development` heading because detail pages link to it. Development notes can link to related projects with ordinary Markdown links, such as `/projects/deconstructor/`. Use project-owned artwork and accurate alt text. External actions are optional: do not infer publication from local source files. Test public links with `npm run test:links` and manually verify the publisher and destination before adding them.

Fonts are self-hosted through Fontsource. Astro generates responsive WebP images. The local gameplay video loads only on request and never autoplays.

See [deployment](docs/deployment.md), [asset sources](docs/assets.md), and [verification](docs/verification.md).

The header theme toggle cycles System, Light, and Dark, and shows the current mode. System follows the browser's light/dark preference. Explicit Light or Dark choices are saved locally; returning to System clears that override. Without JavaScript the toggle is hidden and System styling still applies.

The mod group display order follows Colton's requested popularity order: Meccha Chameleon, R.E.P.O., Valheim, Necesse. It is curated in `src/lib/mod-groups.ts`; no live or inferred download totals are displayed.

Project galleries use optional `screenshots` frontmatter entries, each with an `image` path, descriptive `alt`, and a `caption`. Store originals in `src/assets/screenshots/`. Astro creates responsive WebP thumbnails and larger linked images; galleries show up to six screenshots, and a native disclosure holds any beyond that. Portrait phone captures use a compact multi-column grid. With JavaScript, an accessible dialog adds Previous/Next, captions, arrow keys, Escape, and focus return. Without JavaScript, links open the images directly and browser Back works. Preserve authentic screenshots and record their provenance in `docs/assets.md`.

The home page is the only section page. `/games/`, `/apps/`, `/mods/`, and `/about/` are meta-refresh redirects to the matching home sections, configured in `astro.config.mjs`. Each project page ends with links to related projects: other mods for the same game, otherwise the rest of its category.

Profile links for the About section and footer live in `src/lib/profiles.ts`; `npm run test:links` checks them with the project links.

Social cards are generated from project titles and original artwork by `scripts/generate-social-images.mjs` during dev/build. The generated `public/social/` directory is ignored by Git; it is included in the published build. Each project has its own Open Graph and large Twitter preview.
