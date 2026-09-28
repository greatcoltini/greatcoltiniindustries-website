---
title: Forge Upgrades
category: mods
hostGame: Necesse
summary: Let your settlement's forge grow alongside the rest of your adventure.
artwork: ../../assets/forge-upgrades.png
artworkAlt: Forge Upgrades mod promotional artwork showing upgraded forges.
artStyle: mod
order: 11
tech: [Java, Necesse modding]
features:
  - title: Upgrade in place
    description: Improve a forge through its interface while keeping the items already inside it.
  - title: Keep progressing
    description: Demonic, Tungsten, and Fallen tiers expand the vanilla forge progression.
links:
  - label: View on Steam Workshop
    url: https://steamcommunity.com/sharedfiles/filedetails/?id=3731042527
screenshots:
  - image: ../../assets/screenshots/forge-upgrades-1.jpg
    alt: 'The different forge upgrade tiers.'
    caption: 'The different forge upgrade tiers.'
  - image: ../../assets/screenshots/forge-upgrades-2.jpg
    alt: 'The forge upgrade option and material cost.'
    caption: 'The forge upgrade option and material cost.'
  - image: ../../assets/screenshots/forge-upgrades-3.jpg
    alt: 'The Tungsten Forge crafting interface.'
    caption: 'The Tungsten Forge crafting interface.'
overviewTitle: "A better workshop, one upgrade at a time"
overview:
  - "Forge Upgrades extends Necesse's vanilla forge with three upgrade tiers. Each improves processing capacity and speed, giving a familiar crafting station a longer progression path."
availability:
  label: "Workshop release"
  platform: "Necesse · Steam Workshop"
---

## Development

I created a shared upgradable forge implementation and the tier-specific objects, then connected them to an in-place upgrade flow. Upgrading consumes the materials and replaces the station while preserving its inventory.
