---

title: Lone Survivors
category: games
summary: Face the horde. Find your build. Push a little further.
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
updates:
  - id: "v1-2-10"
    date: "2026-08-10"
    version: "1.2.10"
    title: "Queen Bee"
    changes:
      - "Added the Queen Bee boss to late Grasslands Endless runs."
      - "Defeating her unlocks the Royal Apiary weapon."
      - "Unattended Alchemy Tables relocate after a countdown."
    url: "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1840310314352466"
  - id: "v1-2-9"
    date: "2026-07-12"
    version: "1.2.9"
    title: "Placement and leaderboard fixes"
    changes:
      - "Tightened Alchemy Table placement to avoid out-of-bounds spawns."
      - "Made the Endless level cap visible in the pause menu and fixed a leaderboard issue."
    url: "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1837955055361712"
  - id: "v1-2-8"
    date: "2026-06-29"
    version: "1.2.8"
    title: "Endless and ability fixes"
    changes:
      - "Fixed Beach Endless music and Village Endless boss spawning."
      - "Fixed errors involving grab-all powerups, magic beams, and rescued NPC abilities persisting after death."
    url: "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1836506165559377"
  - id: "v1-2-7"
    date: "2026-06-27"
    version: "1.2.7"
    title: "Damage summary and weapons menu"
    changes:
      - "Expanded the damage summary with separate weapon, status, amplifier, and crowd-control tracking."
      - "Reworked the weapons menu and fixed visibility, speed-buff, and Weekly Challenge leaderboard issues."
    url: "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1836506165555968"
---

## Development

I built the class, weapon, upgrade, and progression systems in Godot with GDScript. A shared structure lets me add abilities with their own behaviors.

Pixel-art environments and characters are supported by systems for weather, events, progression, and run statistics. I keep Steam integration separate from the core game so the project can also run outside Steam.
