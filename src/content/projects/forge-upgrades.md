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
---

## A better workshop, one upgrade at a time

Forge Upgrades extends Necesse's vanilla forge with three upgrade tiers. Each improves processing capacity and speed, giving a familiar crafting station a longer progression path.

## Development

I created a shared upgradable forge implementation and the tier-specific objects, then connected them to an in-place upgrade flow. Upgrading consumes the materials and replaces the station while preserving its inventory.
