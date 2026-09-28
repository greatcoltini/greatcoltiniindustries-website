---

title: Mine It All
category: mods
hostGame: Necesse
summary: Find a vein. Break an ore. Keep the adventure moving.
artwork: ../../assets/mine-it-all.png
artworkAlt: Mine It All vein-mining mod promotional artwork.
artStyle: mod
order: 12
tech: [Java, Necesse modding]
features:
  - title: Follow the vein
    description: Breaking a configured ore also breaks connected matching ore blocks.
  - title: Make it your own
    description: Configure the ore list and maximum vein size, and toggle the behavior when you need it.
links:
  - label: View on Steam Workshop
    url: https://steamcommunity.com/sharedfiles/filedetails/?id=3730263197
screenshots:
  - image: ../../assets/screenshots/mine-it-all-1.jpg
    alt: 'Vein mining inside a cave.'
    caption: 'Vein mining inside a cave.'
  - image: ../../assets/screenshots/mine-it-all-2.jpg
    alt: 'The vein-mining toggle in mod settings.'
    caption: 'The vein-mining toggle in mod settings.'
overviewTitle: "Less repetition underground"
overview:
  - "Mine It All is a vein-mining mod for Necesse. It makes clearing a connected ore deposit a single action, while retaining a toggle for moments when you want more control."
availability:
  label: "Workshop release"
  platform: "Necesse · Steam Workshop"
updates:
  - id: "v1-0-9"
    date: "2026-05-26"
    version: "1.0.9"
    title: "Workshop release"
    changes:
      - "Listed for Necesse 1.2.0 in the Workshop release notes."
    url: "https://steamcommunity.com/sharedfiles/filedetails/changelog/3730263197#1779814547"
  - id: "v1-0-8"
    date: "2026-05-26"
    version: "1.0.8"
    title: "Workshop release"
    changes:
      - "Listed for Necesse 1.2.0 in the Workshop release notes."
    url: "https://steamcommunity.com/sharedfiles/filedetails/changelog/3730263197#1779813781"
  - id: "v1-0-7"
    date: "2026-05-23"
    version: "1.0.7"
    title: "Workshop release"
    changes:
      - "Listed for Necesse 1.2.0 in the Workshop release notes."
    url: "https://steamcommunity.com/sharedfiles/filedetails/changelog/3730263197#1779578553"
---

## Development

I implemented a bounded flood-fill over matching connected blocks, a configurable ore list, and a toggle shared with the server. The traversal limit keeps large connected deposits from becoming unbounded work.
