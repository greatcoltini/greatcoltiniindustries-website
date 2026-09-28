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
| closer-mini-biomes.png  | vapok-backpack-deep-north/valheim-patches/icon.png                                                  |
| epicloot-bounties.png   | vapok-backpack-deep-north/valheim-patches/UnofficialEpicLootBountyAdditions/icon.png                |
| kingdom-td-gameplay.mp4 | Original 30-second Kingdom TD gameplay trailer                                                      |

The R.E.P.O. mod has a clearly styled text/icon tile because no verified original promotional image was selected. The favicon and brand monogram use native vector/text styling. No generated mockup is used as page content.

Anton and Source Sans 3 are self-hosted Fontsource packages, distributed under the SIL Open Font License. Their license files are included in the installed packages.

The collection contains thirteen projects. Nine external destinations were verified: two Steam games, six Steam Workshop entries, and MinecraftAdditions on Thunderstore. Apps and Valheim mods have no external actions until a public destination is verified. Private or unavailable GitHub repositories are not linked as public source.

The Kingdom TD homepage feature uses its original `kingdom-td.jpg` cover. The scrolling homepage additionally uses `lone-team.png` from `lone-survivors-ordered/lone-survivors-ordered/library-team.png`. These are original project assets, not generated substitutes. The small arrows and board-game die are decorative SVG shapes.

The Meccha Chameleon map previews come from `meccha-chameleon-repo-snow/build/preview.png` and `meccha-chameleon-repo-wizard/build/preview.png`. Their original R.E.P.O. setting/assets are credited on the detail pages. Steam's GetPublishedFileDetails API verified creator 76561198038365196, public visibility, and non-banned status for Workshop items 3759385002 and 3755237299 on 2026-09-28.

Mod group headings use the games' original logos from Steam and Necesse's official website, stored locally in `src/assets/game-logos/`. Transparent outer margins are trimmed and images are resized without altering the wordmarks. The logos retain transparent backgrounds in both site themes and link to each game’s verified Steam product page in a new tab. Screen-reader headings and text jump links retain the game names. Logos remain the property of their respective creators.

Official asset sources (retrieved 2026-09-28):
- Meccha Chameleon: https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4704690/47ca71d0efd73bb9f7552e6d4076840a5a4b114b/logo_2x.png
- R.E.P.O.: https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3241660/0792bd657a88c95b72c337de40de3f80151557a1/logo_2x.png
- Valheim: https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/892970/1637482fa841381d2b9d7a88fe3dc4d9aee17485/logo_2x.png
- Necesse: https://necesse-website.s3.eu-central-1.amazonaws.com/assets/necesse_logo.png

## Screenshot galleries (2026-09-28)

- 27 original gameplay/UI images from the two Steam game listings and six Steam Workshop galleries. Exact public sources are recorded in `screenshot-sources.json`.
- Six BoulderLog phone screenshots from its English (United Kingdom) Google Play Console listing, retrieved with the owner signed in. The app is in closed testing; no public Play Store action is implied.
- Three Shelf & Score captures rendered from the actual `board-game-stats` Flutter repository using an isolated copy, an in-memory database, and synthetic game/player records. Fonts and icons are loaded from the app/Flutter assets. Captions explicitly identify sample data; no personal database was used. Shelf & Score is a local app with no store action.
- No genuine gameplay screenshots were found for Minecraft Enderman or the two Valheim projects; their detail pages omit the gallery.

Portrait galleries preserve the full screen, with no crop, and link to a larger image. Screenshots are lazy-loaded and carry descriptive alt text.
