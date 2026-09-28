---
title: BoulderLog
category: apps
summary: A place for every climb, every session, and a little progress.
artwork: ../../assets/boulderlog-wall.png
artworkAlt: A climbing wall with colorful holds, used as BoulderLog's promotional artwork.
icon: ../../assets/boulderlog-icon.png
artStyle: boulderlog
order: 3
tech: [Expo, React Native, TypeScript]
screenshots:
  - image: ../../assets/screenshots/boulderlog-2.jpg
    alt: 'BoulderLog home screen showing a climber profile, experience level, and session summary.'
    caption: 'Your climbing profile and progress.'
  - image: ../../assets/screenshots/boulderlog-1.jpg
    alt: 'BoulderLog session screen with a Start Session button and climbing tip.'
    caption: 'Start a session at the wall.'
  - image: ../../assets/screenshots/boulderlog-3.jpg
    alt: 'BoulderLog statistics showing climbing grades, attempts, send rate, and time.'
    caption: 'Grades, sends, and session statistics.'
  - image: ../../assets/screenshots/boulderlog-5.jpg
    alt: 'BoulderLog history calendar with a session summary and grade breakdown.'
    caption: 'A calendar of past sessions.'
  - image: ../../assets/screenshots/boulderlog-6.jpg
    alt: 'BoulderLog climb details showing route photos with numbered climbing holds.'
    caption: 'Route photos with marked holds.'
  - image: ../../assets/screenshots/boulderlog-7.jpg
    alt: 'BoulderLog achievement grid with unlocked milestones and progress.'
    caption: 'Achievements for climbing milestones.'
features:
  - title: Log a session
    description: Keep track of climbs, grades, attempts, and notes while your session is still fresh.
  - title: See your progress
    description: Look back through session history and climbing statistics to see how things are changing.
  - title: Keep showing up
    description: Progress tracking and achievements add a little encouragement to the next session.
overviewTitle: "Made for the climbing wall"
overview:
  - "BoulderLog is a mobile bouldering tracker for recording sessions and the climbs within them. Alongside grades and attempts, you can capture style tags, notes, and wall photos to keep the details that a number alone misses."
  - "Session history and statistics bring those individual climbs together into a picture of your progress."
availability:
  label: "Closed testing"
  platform: "Android"
  detail: "Not publicly released yet."
---

## Development

I built BoulderLog with Expo, React Native, and TypeScript. Expo Router connects the session, history, statistics, and tips screens; local storage keeps climbing records on the device.

I use charcoal surfaces and orange accents to keep the logging controls easy to find between climbs.
