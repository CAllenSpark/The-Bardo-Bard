# THE BARDO BARD

*A playable mirror disguised as the afterlife's most tempting customer-service
portal.*

A responsive, zero-cost browser game of grounded philosophical questions: an
imagined soul at a threshold, a Bard-shaped program that assists with the
paperwork, and a choice — return to Earth, or walk into the light. It is also an
anonymous census (the Ledger) and an art piece about agency.

Design authority lives in [`docs/BARD_COMPASS.md`](docs/BARD_COMPASS.md) — read
it first. Build state lives in [`PROGRESS.md`](PROGRESS.md).

## Run it locally

```sh
npm install
npm start          # builds, then serves the desk at http://localhost:5173
```

Then open **http://localhost:5173** in a browser. `npm start` prints links to the
four pages (the desk, the Ledger dashboard, Soul Analysis, the codex).

There is no dev server with hot-reload — the game is a single static bundle by
design (part of the $0 operation goal). After editing `/content` or `/src`, stop
the server and run `npm start` again (or `npm run build` in another terminal).

You can also just open `dist/index.html` **straight from the filesystem** after
`npm run build` — the desk works fully offline. The only difference: some
browsers block `localStorage` on `file://`, so serving over `http://localhost`
gives you working reincarnation (returning souls, FORGET THESE LIVES). Either
way the census falls back to the labeled offline seed unless you point
`window.BARDO_LEDGER_URL` at a running Worker.

## Develop

```sh
npm test          # 113 tests: schema, FSM, DOM playthroughs, vigil clock, ledger, ...
npm run validate  # content schema + graph integrity (regenerates worker/manifest.json)
npm run build     # dist/ — HTML entries + IIFE bundles, all bootable from file://
npm run gate0     # validate + test + build + the file:// boot check
```

Run the Ledger Worker locally (optional, for live census):

```sh
PORT=8787 ALLOW_ORIGINS=null node worker/node-server.mjs
# then serve the game with window.BARDO_LEDGER_URL = 'http://localhost:8787'
```

## Layout

| Path | What |
|---|---|
| `/content` | All narrative, as schema-validated JSON. Copy lives here, not in code. |
| `/src` | Deterministic engine (FSM, vigil clock) + minimal terminal UI. |
| `/worker` | Ledger API (Cloudflare Worker + Durable Object counter) — Phase 3. |
| `/tests` | Vitest: schema, determinism, DOM playthroughs, fake-timer vigil. |
| `/docs` | The Compass (living design doc) and preserved source documents. |
