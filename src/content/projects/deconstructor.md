---
title: Deconstructor
category: mods
hostGame: Necesse
summary: Give old equipment a second life as useful crafting materials.
artwork: ../../assets/deconstructor.png
artworkAlt: Deconstructor mod promotional artwork.
artStyle: mod
order: 10
tech: [Java, Necesse modding]
features:
  - title: Reclaim materials
    description: A workshop breaks crafted items back down into ingredients.
  - title: Power your workshop
    description: Run the machine on fuel, or connect it to a Necesse Power network.
links:
  - label: View on Steam Workshop
    url: https://steamcommunity.com/sharedfiles/filedetails/?id=3730900523
screenshots:
  - image: ../../assets/screenshots/deconstructor-1.jpg
    alt: 'The Deconstructor interface and recovered materials.'
    caption: 'The Deconstructor interface and recovered materials.'
  - image: ../../assets/screenshots/deconstructor-2.jpg
    alt: 'The Deconstructor in the workstation menu.'
    caption: 'The Deconstructor in the workstation menu.'
  - image: ../../assets/screenshots/deconstructor-3.jpg
    alt: 'Breaking down equipment while the machine runs.'
    caption: 'Breaking down equipment while the machine runs.'
overviewTitle: "Make the most of what you have"
overview:
  - "Deconstructor adds a workshop to Necesse that passively recovers crafting ingredients from items. It gives old or unwanted equipment another use within a settlement's crafting loop."
availability:
  label: "Workshop release"
  platform: "Necesse · Steam Workshop"
---

## Development

I built the workshop behavior, inventory interface, and optional integration with my Necesse Power mod. The core deconstruction logic runs on the server, with fuel support available independently of the power-network integration.
