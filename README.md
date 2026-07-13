# THE BARDO BARD

*A playable mirror disguised as the afterlife's most tempting customer-service
portal.*

A responsive, zero-cost browser game of grounded philosophical questions: an
imagined soul at a threshold, a Bard-shaped program that assists with the
paperwork, and a choice — return to Earth, or walk into the light. It is also an
anonymous census (the Ledger) and an art piece about agency.

Design authority lives in [`docs/BARD_COMPASS.md`](docs/BARD_COMPASS.md) — read
it first. Build state lives in [`PROGRESS.md`](PROGRESS.md).

## Develop

```sh
npm install
npm test          # schema + FSM + DOM playthrough + vigil clock
npm run validate  # content schema and graph integrity
npm run build     # dist/ — a single HTML entry + IIFE bundle, bootable from file://
npm run gate0     # the whole Gate 0 script
```

Open `dist/index.html` straight from the filesystem — the desk works offline by
design.

## Layout

| Path | What |
|---|---|
| `/content` | All narrative, as schema-validated JSON. Copy lives here, not in code. |
| `/src` | Deterministic engine (FSM, vigil clock) + minimal terminal UI. |
| `/worker` | Ledger API (Cloudflare Worker + Durable Object counter) — Phase 3. |
| `/tests` | Vitest: schema, determinism, DOM playthroughs, fake-timer vigil. |
| `/docs` | The Compass (living design doc) and preserved source documents. |
