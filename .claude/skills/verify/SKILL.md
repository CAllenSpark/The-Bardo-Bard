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

## Flows worth driving

1. Boot → notice (`NOTICE, FILED IN PLAIN LANGUAGE`) → BEGIN → A1 (four options
   + both doors) → seed path to `SEED CENSUS BOUNDARY` (fully terminal).
2. Gentle decline at boot (`NOT TODAY` → "Go well", terminal).
3. A standing exit mid-run — ends the run, no buttons remain.
4. Posture variants: choose `define_you` (curiosity) then check A2 serves the
   curious light ("naming it feels important").
5. Keyboard-only: Tab + Enter must drive everything.
6. 375px viewport: buttons ≥ 44px tall.
7. Collect console errors for the whole session; expect zero.
8. Vigil (Phase 2+): timers are visibility-gated — use fake timers in vitest for
   ladder timing; in Playwright, only smoke-test that stillness produces the
   first authored beat.

## Gotchas

- ES module scripts do not load over `file://` — the bundle must stay IIFE with
  a classic `<script src="./bardo.js">` tag (`scripts/check-file-boot.mjs` guards this).
- No persistence exists until Phase 5; reload resetting to boot is correct for now.
