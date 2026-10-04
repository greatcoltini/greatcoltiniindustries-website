---
title: Dvergr Reclaimer
category: mods
hostGame: Valheim
summary: An iron furnace that breaks old gear back down into materials.
artwork: ../../assets/dvergr-reclaimer.png
artworkAlt: 'Dvergr Reclaimer mod icon: a small iron furnace with a chimney, a glowing round door and a side wheel.'
artStyle: mod
order: 32
tech: [C#, BepInEx, Jötunn, Recycle N' Reclaim integration]
features:
  - title: Load it and leave it
    description: Fill the 8×12 crate with old gear. It breaks each item down with Recycle N' Reclaim's yields and rules, burning Coal as it works.
  - title: Results where you want them
    description: Materials go into nearby chests. Anything they can't take drops out of the front, the way a Smelter drops its bars.
  - title: Only what your world knows
    description: It reclaims only recipes someone on the world has discovered.
  - title: Epic Loot sacrifices
    description: With Epic Loot and an Enchanting Table nearby, trophies and boss items are sacrificed for enchanting materials.
links:
  - label: View on Hexium
    url: https://valheim.hexium.gg/mods/GreatColtini/DvergrReclaimer
screenshots:
  - image: ../../assets/screenshots/dvergr-reclaimer-1.jpg
    alt: 'The Dvergr Reclaimer working on a wooden floor beside two chests and a Forge, its door glowing and its chimney smoking, while a player in iron armor stands nearby.'
    caption: 'The Reclaimer at work in a small workshop.'
  - image: ../../assets/screenshots/dvergr-reclaimer-2.jpg
    alt: 'A close-up of the Dvergr Reclaimer at night, with firelight from its round door and smoke rising from the chimney.'
    caption: 'Firelight and chimney smoke while it works.'
  - image: ../../assets/screenshots/dvergr-reclaimer-3.jpg
    alt: 'The Reclaimer crate open in the inventory, with a panel below it showing 34 of 40 Coal, a Bronze Plate Tunic 45% reclaimed, and Bronze and Deer Hide to come.'
    caption: 'The panel below the crate shows fuel, progress and results.'
  - image: ../../assets/screenshots/dvergr-reclaimer-4.jpg
    alt: 'A crate of trophies being sacrificed beside an Epic Loot Enchanting Table, with the panel showing The Elder Trophy producing a Rare Runestone.'
    caption: 'With Epic Loot, trophies become enchanting materials.'
  - image: ../../assets/screenshots/dvergr-reclaimer-5.jpg
    alt: 'The Hammer build menu on the Crafting tab, with the Dvergr Reclaimer selected and its cost of 10 Iron, 10 Stone and 2 Surtling Cores at a Forge.'
    caption: 'Built with the Hammer from the Swamp onwards.'
  - image: ../../assets/screenshots/dvergr-reclaimer-6.jpg
    alt: 'Hover text over the Reclaimer listing Coal 34 of 40, 13 items queued, and a Bronze Plate Tunic 62% reclaimed.'
    caption: 'Hovering shows its fuel, queue and progress.'
overviewTitle: "Put the old gear to work"
overview:
  - "Dvergr Reclaimer adds an iron furnace to Valheim's Hammer from the Swamp onwards. Items placed in its crate are broken down one at a time, using Recycle N' Reclaim's yields and rules, and the materials are moved into nearby chests."
  - "It needs Recycle N' Reclaim and Jötunn. Epic Loot is optional and adds trophy sacrifices."
availability:
  label: "Hexium release"
  platform: "Valheim · Hexium"
  detail: "A development build; balance may still change."
---

## Development

I built the Reclaimer as a Hammer piece whose model is assembled at runtime from a Meshy-generated mesh, prepared in Blender, without a Unity project. It breaks items down through Recycle N' Reclaim's public API, with a recipe ledger shared across everyone on the world, and borrows the vanilla Smelter's fire, smoke and sounds. Epic Loot's sacrifice is bound only when Epic Loot is installed.

The mod is tested headless inside the real game, including against a dedicated server. The screenshots on this page were rendered by that test harness from the game itself.

Recycle N' Reclaim is the work of Azumatt, and Epic Loot of its original creators.
