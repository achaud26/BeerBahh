# BeerBahh

**Find Your Herd** — real-time nightlife radar for college towns. Starting in Clemson.

## What's in this MVP

- Branded landing page + waitlist (emails stored in browser `localStorage` for now)
- `/radar` — Clemson map with live-style crowd pins, drink deals, and per-bar chat
- Seed data for Clemson bars with real addresses / map pins
- Auth: Google (when configured) + username login, private profiles, friends
- Cop alerts intentionally **not** included (legal / App Store risk)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Auth setup: see [AUTH.md](./AUTH.md).

## Stack

Next.js · Tailwind · Leaflet/OSM · Auth.js · local JSON store (profiles/friends)
