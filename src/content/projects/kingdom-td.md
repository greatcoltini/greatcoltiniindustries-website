---
title: 'Kingdom TD: Draft Your Demise'
shortTitle: Kingdom TD
category: games
summary: Choose the enemies. Build the defense. Survive your decisions.
artwork: ../../assets/kingdom-td.jpg
artworkAlt: 'Kingdom TD cover: a mounted rider, defensive towers, and enemy cards under a stormy sky.'
order: 1
trailer: /media/kingdom-td-gameplay.mp4
tech: [Godot, GDScript]
features:
  - title: Draft the horde
    description: Choose the enemies you will face. Balance a safer wave against a riskier, more rewarding one.
  - title: Build the answer
    description: Place and upgrade towers, then shape the routes that bring enemies through your defenses.
  - title: Ride the line
    description: Reposition your mounted rider to support nearby towers and gather fallen gold.
links:
  - label: Wishlist on Steam
    url: https://store.steampowered.com/app/4990780/Kingdom_TD_Draft_Your_Demise/
roadmap:
  - title: Announced, with its Steam page
    when: 31 Jul 2026
    status: done
    url: https://steamcommunity.com/games/3629280/announcements/detail/715660216997250635
  - title: Public demo
    status: next
  - title: Steam Next Fest
    status: planned
  - title: Launch on Steam
    when: Q1 2027
    status: planned
screenshots:
  - image: ../../assets/screenshots/kingdom-td-1.jpg
    alt: 'Towers and combat effects along the route.'
    caption: 'Towers and combat effects along the route.'
  - image: ../../assets/screenshots/kingdom-td-2.jpg
    alt: 'Choose the enemies for an upcoming wave.'
    caption: 'Choose the enemies for an upcoming wave.'
  - image: ../../assets/screenshots/kingdom-td-3.jpg
    alt: 'Plan the route with the path-building tools.'
    caption: 'Plan the route with the path-building tools.'
  - image: ../../assets/screenshots/kingdom-td-4.jpg
    alt: 'Boss-wave draft choices and enemy details.'
    caption: 'Boss-wave draft choices and enemy details.'
overviewTitle: "A different kind of tower defense"
overview:
  - "In Kingdom TD, the next wave starts with a choice. You draft the enemies yourself, trading danger for the resources to build a stronger defense. Planning is untimed, so there is room to consider the route, the towers, and the consequences."
  - "A connected fantasy campaign, persistent tower progression, challenges, and fixed-seed Endless play give those decisions room to grow."
availability:
  label: "Coming soon · Q1 2027"
  platform: "Windows · Steam"
updates:
  - id: "2026-10-02-calmer-look"
    date: "2026-10-02"
    title: "A calmer look, and more time to save your sparks"
    changes:
      - "Menus, shops, the HUD and pop-ups have a simpler parchment-and-wood look that stays sharp at any size. Draft cards, save banners, and the wave and level reports keep their decoration."
      - "Text across the game is easier to read."
      - "The turret shop is slimmer, and choosing a turret shows its details beside the shop."
      - "Building a path uses a compact bar along the bottom of the screen instead of a large tray."
      - "The wave tracker rolls forward to each new wave."
      - "The draft's confirm bar is smaller, and every wave modifier is listed above it. Shortcut cards now say so."
      - "On/off options, including Skip the tutorial, are clear ON/OFF switches."
      - "Campfire sparks now last 15 seconds, and a wave won't end while one is still out, so you can still bring it home after the last enemy falls."
      - "Your abilities only appear during combat, and their descriptions show when you hover them or first use them."
      - "The War Table reveals new upgrades as you unlock them."
      - "Monster Codex portraits fit their frames, The Path fits taller screens, and Hall of Echoes cards no longer cut off their text."
  - id: "2026-10-01-first-player-polish"
    date: "2026-10-01"
    title: "A friendlier first hour"
    changes:
      - "Tutorial hints and tooltips no longer cover the things they point at, and the camera shows the whole island while you build your path."
      - "Placing a path tile or tower with the mouse now lands exactly under the cursor."
      - "Towers placed too far from the enemy road now warn you before you spend the gold."
      - "The tutorial now builds its path before the first draft, just like every campaign level, and editing that path is optional."
      - "The turret shop shows every tower's name, explains rising prices, and marks prices you can't afford yet."
      - "Your rider is easier to spot, and your abilities explain what they do and why a cast didn't go off."
      - "Clearer messages around boss rewards, wave events, and the speed button."
      - "Fixed level intros where some cliffs and terraces stayed missing while the island assembled, then popped in at the end. Every piece now rises into place."
  - id: "2026-09-30-crowds-and-blight"
    date: "2026-09-30"
    title: "Wider crowds, creeping blight, and a smoother tutorial"
    changes:
      - "Enemy crowds now spread across the whole road instead of marching in three tidy lanes. Bosses still hold the center."
      - "Portal blight now creeps over cliff edges and drips down the rock faces below."
      - "Widescreen, ultrawide, and taller displays fill the screen instead of showing black bars."
      - "The tutorial's first draft is clearer: no duplicate cards, and the required pick is marked Forced."
      - "The intro shows Skip and Continue prompts."
      - "In the demo, winning the tutorial battle unlocks Endless."
      - "Clearer labels throughout: the draft shows each wave's payout, the deck shows its card count, and locked landmarks name the level to clear."
---

## Development

I built Kingdom TD in Godot with GDScript, keeping the rules of a run separate from the scenes that present them. Authored maps, enemy definitions, tower specifications, and draft choices feed shared gameplay systems.

I designed the mounted rider as a support character: positioning strengthens nearby towers rather than turning the game into direct hero combat. That distinction keeps the focus on the defense you have built.
