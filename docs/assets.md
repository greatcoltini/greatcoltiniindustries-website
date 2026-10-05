# Asset provenance

These files come from Colton’s existing project assets. They are used directly, with responsive WebP derivatives produced by Astro.

| Website asset           | Original project source                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| kingdom-td.jpg          | godot-defenders/marketing/steam/upload/store_main_1232x706.jpg                                      |
| kingdom-td-hero.png     | godot-defenders/marketing/steam/upload/library_hero_3840x1240.png                                   |
| lone-survivors.png      | lone-survivors-ordered/lone-survivors-ordered/lone-survivors-new-logo/Main capsule LONE SUVIVOR.png |
| boulderlog-wall.png     | Boulder-Log/artifacts/mobile/assets/images/feature-graphic.png                                      |
| boulderlog-icon.png     | Boulder-Log/artifacts/mobile/assets/images/app-icon-store.png                                       |
| shelf-and-score.png     | board-game-stats/assets/shelf_and_score_icon.png                                                    |
| Necesse mod images      | Each corresponding mod’s src/main/resources/preview.png                                             |
| closer-mini-biomes.png  | valheim-patches/CloserMiniBiomes/icon.png                                                           |
| epicloot-bounties.png   | valheim-patches/UnofficialEpicLootBountyAdditions/icon.png                                          |
| dvergr-reclaimer.png    | valheim-patches/DvergrReclaimer/icon.png                                                            |
| minecraft-enderman.png  | Thunderstore icon of GreatColtini/MinecraftAdditions 1.0.7 (see below)                              |
| kingdom-td-gameplay.mp4 | Original 30-second Kingdom TD gameplay trailer                                                      |

The R.E.P.O. mod uses its published Thunderstore package icon, a 256×256 pixel-art Enderman face, retrieved unchanged on 2026-09-29 from https://ccdn.thunderstore.io/live/repository/icons/GreatColtini-MinecraftAdditions-1.0.7.png with Colton's approval. Thunderstore's package API lists the owner as GreatColtini. The project sets `pixelArt: true`, so the site and its social card enlarge it with hard pixel edges. The favicon and brand monogram use native vector/text styling. No generated mockup is used as page content.

## Dev log media

Bluesky posts in the dev log show the first picture, video thumbnail, or link-card image of each post. `scripts/poll-updates.mjs` saves these unchanged to `src/assets/devlog/`, named after the post, and removes them once the post drops out of the newest twelve. It fetches Bluesky's feed thumbnail. If Bluesky's image CDN is unavailable, it fetches the original upload from the account's own server instead. Astro serves responsive WebP copies, so visitors never request Bluesky directly. Link cards to YouTube or Steam use the preview image Bluesky attached to the post.

Anton and Source Sans 3 are self-hosted Fontsource packages, distributed under the SIL Open Font License. Their license files are included in the installed packages.

The collection contains fourteen projects. Thirteen external destinations were verified: two Steam games, six Steam Workshop entries, MinecraftAdditions on Thunderstore, the three Valheim mods on Hexium, and Unofficial EpicLoot BountyAdditions on Thunderstore. Apps have no external actions until a public destination is verified. Private or unavailable GitHub repositories are not linked as public source; on 2026-10-04 every mod's repository was private.

The Kingdom TD homepage feature uses its original `kingdom-td.jpg` cover. The homepage collage uses the `kingdom-td-2.jpg` Steam screenshot instead, so the cover appears only once. The scrolling homepage additionally uses `lone-team.png` from `lone-survivors-ordered/lone-survivors-ordered/library-team.png`. These are original project assets, not generated substitutes. The small arrows are decorative SVG shapes; app homepage previews now use the authentic screenshots described below.

The Meccha Chameleon map previews come from `meccha-chameleon-repo-snow/build/preview.png` and `meccha-chameleon-repo-wizard/build/preview.png`. Their original R.E.P.O. setting/assets are credited on the detail pages. Steam's GetPublishedFileDetails API verified creator 76561198038365196, public visibility, and non-banned status for Workshop items 3759385002 and 3755237299 on 2026-09-28.

Mod group headings use the games' original logos from Steam and Necesse's official website, stored locally in `src/assets/game-logos/`. Transparent outer margins are trimmed and images are resized without altering the wordmarks. The logos retain transparent backgrounds in both site themes and are plain headings. A separate text link below each logo opens the game’s verified Steam product page in a new tab. Screen-reader headings and text jump links retain the game names. Logos remain the property of their respective creators.

Official asset sources (retrieved 2026-09-28):
- Meccha Chameleon: https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4704690/47ca71d0efd73bb9f7552e6d4076840a5a4b114b/logo_2x.png
- R.E.P.O.: https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3241660/0792bd657a88c95b72c337de40de3f80151557a1/logo_2x.png
- Valheim: https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/892970/1637482fa841381d2b9d7a88fe3dc4d9aee17485/logo_2x.png
- Necesse: https://necesse-website.s3.eu-central-1.amazonaws.com/assets/necesse_logo.png

## Screenshot galleries (2026-09-28)

- 27 original gameplay/UI images from the two Steam game listings and six Steam Workshop galleries. Exact public sources are recorded in `screenshot-sources.json`.
- Six BoulderLog phone screenshots from its English (United Kingdom) Google Play Console listing, retrieved with the owner signed in. The app is in closed testing; no public Play Store action is implied.
- Three Shelf & Score captures rendered from the actual `board-game-stats` Flutter repository using an isolated copy, an in-memory database, and synthetic game/player records. Fonts and icons are loaded from the app/Flutter assets. Captions explicitly identify sample data; no personal database was used. Shelf & Score is a local app with no store action.
- Six Dvergr Reclaimer captures (2026-10-04), rendered from the real game by the mod's own in-game test harness (`DvergrReclaimer/tests/StoreScreenshots.cs`, `Run-SmokeTests.ps1 -Scenario screenshots`) in an isolated test world with a test character. They show the mod as it plays: the workshop scene is staged by the harness, and the interface shots composite Valheim's own GUI over the game camera. They are the mod's store screenshots, copied unchanged from `valheim-patches/DvergrReclaimer/screenshots/`.
- No genuine gameplay screenshots were found for Minecraft Enderman, Closer Mini-Biomes or Unofficial EpicLoot BountyAdditions; their detail pages omit the gallery.

Portrait galleries preserve the full screen, with no crop, and link to a larger image. `kingdom-td-1.jpg` is the one exception: it is cropped to rows 150–1028 of the Steam capture to remove the black bars above and below the scene, with no other changes. Re-running `scripts/collect-screenshots.mjs` restores the uncropped original. Screenshots are lazy-loaded and carry descriptive alt text.

## Availability and sharing previews (2026-09-28)

Steam app details confirmed Kingdom TD (4990780) as coming soon in Q1 2027 and Lone Survivors (3629280) as released, both with Windows support. BoulderLog's authenticated Play Console state is closed testing; Shelf & Score is a local build as confirmed by Colton. Public Workshop actions are labeled Workshop release without implying current compatibility. MinecraftAdditions is marked deprecated on Thunderstore. On 2026-10-04, Hexium listed Closer Mini-Biomes (1.2.1), Unofficial EpicLoot BountyAdditions (1.3.0) and Dvergr Reclaimer (0.2.0) under GreatColtini, and Thunderstore's package API listed Unofficial EpicLoot BountyAdditions 1.3.0 under owner GreatColtini, not deprecated. These are labeled as releases without implying current compatibility.

Social preview cards are generated at build time from these existing project titles and original cover/icon assets, with selectable page text remaining separate from those images. Homepage app previews use the first and last genuine gallery captures.

## Profile links (2026-09-28)

The About section and footer link to https://github.com/greatcoltini (a public GitHub user named Colton Donkersgoed) and to the Steam Workshop items of creator 76561198038365196, which list the published mods. Both were checked on 2026-09-28.

## Initial project changelogs (2026-09-28)

The optional sidebar starts with 20 verified entries across Lone Survivors and six Workshop mods. Dates use the UTC day of each source timestamp. Same-day Workshop entries retain the source's newest-first order. Each entry links to its public source.

- Lone Survivors: four patch announcements (1.2.10, 1.2.9, 1.2.8, 1.2.7) from Steam's GetNewsForApp API for app 3629280, authored by GreatColtini. Cross-project announcements are excluded. Change bullets are concise summaries.
- Workshop: the latest two or three notes from each project's linked Change Notes page. Versions are included only where explicitly published; Meccha map updates remain unversioned. Necesse entries report the version recorded in the release notes without implying present-day compatibility.
- Projects without verified dated notes have no sidebar until the owner adds entries. No placeholder releases, inferred app versions, or invented dates are published.
