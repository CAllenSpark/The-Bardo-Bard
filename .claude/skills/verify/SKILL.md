---
name: verify
description: Build and drive THE BARDO BARD end-to-end in real Chromium over file:// to verify changes at the player surface.
---

# Verifying THE BARDO BARD

The surface is a browser game booted from `file://` (a hard requirement — Gate 0).
Do not verify with vitest alone; drive the built bundle in real Chromium.

## Build

```sh
npm run build        # dist/index.html + dist/bardo.js (IIFE, no module scripts)
```

## Drive

Playwright-core + the pre-installed Chromium (`/opt/pw-browsers/chromium` via
`executablePath`; do NOT `playwright install`). Install `playwright-core` in the
scratchpad, not this repo.

```js
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
await page.goto('file:///home/user/The-Bardo-Bard/dist/index.html');
```

Useful handles:
- Choice buttons: `button.choice` with `data-choice-id` (e.g. `begin`, `decline`,
  `yes`, `define_you`, `tap_water`).
- Standing exits: `button.door` with `data-exit-id` (`exit_return`, `exit_light`) —
  present from Act I on, absent on boot and terminal screens.
- All copy renders inside `#bardo`; assert on `page.textContent('#bardo')`.

## Mobile is mandatory (CD directive 2026-07-13)

Drive every flow at three widths: desktop (900px), 375px, and 320px. On each
content-heavy screen (the seven-cup cart, the nine verbs, endings with soul
records) run a tap-target audit: every button ≥ 40px tall, no horizontal page
scroll, and — scrolled to the bottom — no button hidden under the doors bar.
The doors bar is `position: sticky` in flow (a fixed overlay failed this audit
once already; don't reintroduce it). Scroll buttons to `block: 'center'`
before clicking on small viewports.

## Flows worth driving

1. Boot → notice (`NOTICE, FILED IN PLAIN LANGUAGE`) → BEGIN → full spine to a
   verb ending: A1 → light → cart (`lethe` detours through the keeping
   question) → Department (`offer_password` → `key` detours through the Dead
   Letter Office) → life review → verdict → interpretation → confession →
   disclosure → nine verbs. Assert the ending passage AND the `— SOUL RECORD —`
   block (title, reflection traceable to the actual choices, shadow, question).
2. Gentle decline at boot (`NOT TODAY` → "Go well", terminal, NO soul record).
3. Standing exits at each scale: early (act 1), mid (acts 2–4), late (acts 5–6)
   get different passages; all end the run with a record.
4. Posture variants: choose `define_you` (curiosity) then check A2 serves the
   curious light ("naming it feels important").
5. Keyboard-only: Tab + Enter must drive everything.
6. Collect console errors for the whole session; expect zero.
7. Vigil (Phase 2+): timers are visibility-gated — use fake timers in vitest for
   ladder timing; in Playwright, only smoke-test that stillness produces the
   first authored beat.

## Gotchas

- ES module scripts do not load over `file://` — the bundle must stay IIFE with
  a classic `<script src="./bardo.js">` tag (`scripts/check-file-boot.mjs` guards this).
- No persistence exists until Phase 5; reload resetting to boot is correct for now.
