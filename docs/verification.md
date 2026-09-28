# Verification

## Production checks

- Astro type-check: zero errors, warnings, or hints.
- Nineteen static HTML pages generated (Home, three categories, About, thirteen projects, 404).
- Generated internal links, local assets, section anchors, and canonical/description metadata verified.
- All nine external project actions returned HTTP 200.
- Dependencies audited with zero known vulnerabilities at implementation time.

## Browser matrix

Automated checks cover Home, Games, Apps, Mods, About, and representative game/app/mod details at 320, 390, 768, 1024, and 1440 pixels. Additional checks cover landscape, 200% text enlargement, no JavaScript, reduced motion, email links, browser history, active navigation, keyboard skip links, and deferred trailer loading.

Chromium and Edge passed locally. WebKit passed responsive, accessibility, no-JavaScript, text enlargement, and trailer checks. Its Windows headless runtime reports the document unfocused and does not dispatch keyboard traversal; that keyboard test is explicitly skipped on Windows and runs on Linux CI. The local Firefox runtime could not start because Windows reported an incorrect side-by-side configuration. The deployment workflow installs and runs Chromium, Firefox, and WebKit on Ubuntu before publishing.

The axe scan found no WCAG A/AA violations in the tested pages. Manual inspection covers the desktop scrolling portfolio, phone navigation, artwork proportions, readable contrast, category pages, and detail reading order. Browser engines and viewport emulation do not substitute for testing on physical iOS/Android devices.

## Launch checks still dependent on DNS

After the registrar records are updated, verify domain ownership in GitHub, HTTPS certificate issuance/enforcement, www redirect, live nested routes, and the custom 404. See deployment.md for the exact DNS changes.

## Screenshot gallery update (2026-09-28)

Thirty-six authentic screenshots across ten projects were visually reviewed. The production build and all nine external action checks pass. Local Chromium, WebKit, and Edge checks pass for gallery image loading, larger-image links, browser Back, mobile layouts, text enlargement, light/dark accessibility, and no-JavaScript/reduced-motion navigation. The existing Windows WebKit keyboard limitation remains the only skipped check. Shelf & Score captures were rendered successfully from its Flutter source with synthetic data and complete font/icon assets.

