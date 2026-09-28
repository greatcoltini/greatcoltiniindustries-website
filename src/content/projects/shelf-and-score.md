---
title: Shelf & Score
category: apps
summary: Your collection, your game nights, and the stories in the scores.
artwork: ../../assets/shelf-and-score.png
artworkAlt: Shelf & Score icon showing an orange meeple with a pencil and a green scorebook.
artStyle: shelf
order: 4
tech: [Flutter, Dart, SQLite]
screenshots:
  - image: ../../assets/screenshots/shelf-plays.png
    alt: 'Shelf & Score play log listing sample Catan, Chess, Wingspan, and Azul sessions.'
    caption: 'Recent game nights in the play log (sample data).'
  - image: ../../assets/screenshots/shelf-games.png
    alt: 'Shelf & Score Games screen with four sample board games and collection filters.'
    caption: 'The board-game collection and filters (sample data).'
  - image: ../../assets/screenshots/shelf-stats.png
    alt: 'Shelf & Score statistics with total plays, win rate, an activity chart, and most-played games.'
    caption: 'Play activity and statistics (sample data).'
features:
  - title: Know your shelf
    description: Keep a board-game collection and bring in game information from BoardGameGeek.
  - title: Remember game night
    description: Record players, scores, and plays in a quick, phone-friendly flow.
  - title: Follow the story
    description: Browse your calendar of plays and explore player statistics and win rates.
overviewTitle: "More time playing. Less time logging."
overview:
  - "Shelf & Score is a personal board-game collection and play tracker, currently available as a local app. It is designed for the phone at the table: pick the game, add the players and scores, and get back to game night."
  - "A play calendar and statistics help you revisit past sessions. BoardGameGeek integration supports building a collection without entering every detail by hand."
availability:
  label: "Local app"
  platform: "Not publicly released"
  detail: "A personal build, with no public download."
---

## Development

I built Shelf & Score in Flutter, using a local SQLite database through Drift to keep the play log available offline. Network-powered features, such as collection imports, sit alongside that local-first foundation.

The small meeple-and-scorebook icon gives the app its identity while the screens focus on straightforward logging and useful statistics.
