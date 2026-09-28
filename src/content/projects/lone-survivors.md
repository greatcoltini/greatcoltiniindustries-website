---
title: Lone Survivors
category: games
summary: Face the horde. Find your build. Survive one more run.
artwork: ../../assets/lone-survivors.png
artworkAlt: Lone Survivors cover featuring a wizard, a hooded swordsman, and an axe-wielding dwarf.
order: 2
tech: [Godot, GDScript]
features:
  - title: Find your playstyle
    description: Choose a character class and shape a run around its abilities, weapons, and upgrades.
  - title: Survive a changing world
    description: Complete campaign objectives while facing enemies, bosses, and events across fantasy biomes.
  - title: Keep growing
    description: Unlock persistent upgrades and test your builds in Endless runs.
links:
  - label: View on Steam
    url: https://store.steampowered.com/app/3629280/Lone_Survivors/
screenshots:
  - image: ../../assets/screenshots/lone-survivors-1.jpg
    alt: 'Surviving an enemy swarm.'
    caption: 'Surviving an enemy swarm.'
  - image: ../../assets/screenshots/lone-survivors-2.jpg
    alt: 'Choose an upgrade during a run.'
    caption: 'Choose an upgrade during a run.'
  - image: ../../assets/screenshots/lone-survivors-3.jpg
    alt: 'Combat and weapon effects in a dungeon.'
    caption: 'Combat and weapon effects in a dungeon.'
  - image: ../../assets/screenshots/lone-survivors-4.jpg
    alt: 'Permanent upgrades in the skill tree.'
    caption: 'Permanent upgrades in the skill tree.'
overviewTitle: "Small beginnings. Overwhelming odds."
overview:
  - "Lone Survivors is a top-down, objective-driven survival game. Each run begins with a character and a few choices; weapons, upgrades, and class abilities gradually turn that starting point into a very different build."
  - "The campaign combines surviving enemies with completing objectives. New biomes, events, and bosses ask you to adapt as you go."
availability:
  label: "Available now"
  platform: "Windows · Steam"
---

## Development

I built the class, weapon, upgrade, and progression systems in Godot with GDScript. A shared structure lets me add abilities with their own behaviors.

Pixel-art environments and characters are supported by systems for weather, events, progression, and run statistics. I keep Steam integration separate from the core game so the project can also run outside Steam.
