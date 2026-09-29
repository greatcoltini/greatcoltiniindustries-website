# Verification

## Production checks

- Astro type-check: zero errors, warnings, or hints.
- Nineteen static HTML files generated (Home, thirteen projects, 404, and four redirects from the former Games, Apps, Mods, and About pages).
- Generated internal links, local assets, section anchors, and canonical/description metadata verified.
- All nine external project actions returned HTTP 200.
- Dependencies audited with zero known vulnerabilities at implementation time.

## Browser matrix

Automated checks cover Home and representative game/app/mod details at 320, 390, 768, 1024, and 1440 pixels. Additional checks cover landscape, 200% text enlargement, no JavaScript, reduced motion, email links, browser history, active navigation, keyboard skip links, and deferred trailer loading.

Chromium and Edge passed locally. WebKit passed responsive, accessibility, no-JavaScript, text enlargement, and trailer checks. Its Windows headless runtime reports the document unfocused and does not dispatch keyboard traversal; that keyboard test is explicitly skipped on Windows and runs on Linux CI. The local Firefox runtime could not start because Windows reported an incorrect side-by-side configuration. The deployment workflow installs and runs Chromium, Firefox, and WebKit on Ubuntu before publishing.

The axe scan found no WCAG A/AA violations in the tested pages. Manual inspection covers the desktop scrolling portfolio, phone navigation, artwork proportions, readable contrast, and detail reading order. Browser engines and viewport emulation do not substitute for testing on physical iOS/Android devices.

## Launch checks still dependent on DNS

After the registrar records are updated, verify domain ownership in GitHub, HTTPS certificate issuance/enforcement, www redirect, live nested routes, and the custom 404. See deployment.md for the exact DNS changes.

## Screenshot gallery update (2026-09-28)

Thirty-six authentic screenshots across ten projects were visually reviewed. The production build and all nine external action checks pass. Local Chromium, WebKit, and Edge checks pass for gallery image loading, larger-image links, browser Back, mobile layouts, text enlargement, light/dark accessibility, and no-JavaScript/reduced-motion navigation. The existing Windows WebKit keyboard limitation remains the only skipped check. Shelf & Score captures were rendered successfully from its Flutter source with synthetic data and complete font/icon assets.


## UI/UX improvements (2026-09-28)

- The production build passes for all 19 pages. Local Chromium, Edge, and WebKit: 49 passed, 2 Windows-only keyboard skips; both skipped checks run on Linux CI.
- Coverage includes five viewport widths, landscape, doubled text, no JavaScript, reduced motion, light/dark axe checks, all 36 gallery images, native disclosure, raw-image fallback, and viewer arrow keys/Escape/focus cycling and return.
- Manual review covered the compact phone introduction, actual app screen previews, desktop overview/features layout, compact portrait galleries, and the image viewer. At 390px the hero is about 747px tall (previously 921px); BoulderLog's collapsed gallery is about 593px (previously 4042px).
- The generated social cards use 1200×630 JPEGs. Build verification requires each page's Open Graph image to exist locally.

## UX review fixes (2026-09-28)

- Production build and `astro check` pass with zero errors, warnings, or hints. The build check confirms 19 HTML files, including the four section redirects, and all internal links, anchors, assets, and metadata.
- `npm run test:links` returned HTTP 200 for all nine project actions and both profile links.
- Local Edge: 20 of 20 Playwright tests passed. New checks cover the section redirects without JavaScript, onward links and breadcrumbs, the mod heading order and Steam text links, visible button focus, the theme toggle, and all-visible galleries.
- Chromium and WebKit did not run locally because their Playwright browser binaries are not installed on this machine; CI installs and runs Chromium, Firefox, and WebKit.
- Manual review at 1366px (light and dark), 1024, 900, 700, and 390px covered the hero collage labels, the Apps heading arrow, the Kingdom TD trailer poster, gallery grids, onward links, the phone mods layout, and focus outlines.

## Version-history sidebar (2026-09-28)

The optional project changelog uses typed Markdown frontmatter and native details/summary controls; no new client JavaScript is required. Twenty sourced entries populate Lone Survivors and six Workshop mods. Local checks passed: the 60 existing applicable browser tests plus all nine new no-JavaScript changelog tests; three existing Windows WebKit keyboard checks remain covered by Linux CI. The sidebar was manually reviewed at 1440px and 390px in light/dark themes. The production build, internal links/anchors, and source URLs passed. Steam briefly rate-limited repeated anchor requests; the checker now deduplicates by document URL and the affected pages returned 200 on recheck.

## Dev log and automatic changelogs (2026-09-28)

- `npm run poll` read 9 public sources with no failures: Lone Survivors (Steam news), six Workshop change-notes pages, and Minecraft Enderman (Thunderstore). Kingdom TD's own Steam news feed is empty. The saved file contains no spoiler-tagged text.
- Production build and `astro check` pass with zero errors, warnings, or hints; the build check covers 20 HTML files, including `/devlog/` and every dev log link to a changelog entry anchor.
- Local Edge: 27 of 27 Playwright tests passed. New checks cover opening the sidebar from a project page, focus on Close, Escape and focus return, the unread dot, filters, axe in both themes, the home Latest link, and the `/devlog/` fallback without JavaScript. The Lone Survivors changelog test now checks that the curated history stays last and in order, and that no release is listed twice.
- Manual review at 1366px (light and dark) and 390px covered the header button, the Latest strip, the sidebar, `/devlog/`, and the Lone Survivors Updated line and changelog.
