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
---

## Less repetition underground

Mine It All is a vein-mining mod for Necesse. It makes clearing a connected ore deposit a single action, while retaining a toggle for moments when you want more control.

## Development

I implemented a bounded flood-fill over matching connected blocks, a configurable ore list, and a toggle shared with the server. The traversal limit keeps large connected deposits from becoming unbounded work.
