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
---

## Development

I built Kingdom TD in Godot with GDScript, keeping the rules of a run separate from the scenes that present them. Authored maps, enemy definitions, tower specifications, and draft choices feed shared gameplay systems.

I designed the mounted rider as a support character: positioning strengthens nearby towers rather than turning the game into direct hero combat. That distinction keeps the focus on the defense you have built.
