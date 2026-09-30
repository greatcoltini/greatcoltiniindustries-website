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
