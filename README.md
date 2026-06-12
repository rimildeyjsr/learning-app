# Greenroom

Interview-prep learning app for backend, system design, and AI engineer topics.

## What it does and how

- Tracks progress across the full roadmap you pasted in
- Shows module completion and total path completion
- Picks one daily topic with two authoritative reading links
- Unlocks flashcards only after a topic is marked complete
- Runs random interview-style drills and stores your self-score locally
- Adds ADHD-friendly mechanics: one visible next step, short focus sprints, streaks, and low-friction restart mode

## Stack

- React
- TypeScript
- Vite
- Browser localStorage for persistence

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy free

This is a static app, so the simplest free options are:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

Any of them can deploy the `dist/` output or connect directly to the repo.

## Notes

- All state is local to the browser right now.
- Topic content is generated from your roadmap structure, with curated official resources for priority topics and phase-level resources for the rest.
- If you want, the next iteration can add real spaced repetition, notes, tagging, or synced storage.
