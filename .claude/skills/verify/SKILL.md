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
before clicking on small viewports. Two more audit points, both from real
regressions: at full scroll an in-play doors bar must sit fully inside the
viewport (`body { height: 100% }` once shrank `#bardo` to one viewport and
trapped the bar mid-page — body uses `min-height`, `#bardo` uses `100dvh` +
`flex-shrink: 0`), and the crisis footer must overlap no content.

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
7. The Vigil, fully drivable in real Chromium: `await page.clock.install()`
   before `goto`, then `page.clock.runFor(ms)` — NOT `fastForward`, which
   fires each interval once and starves the tick-counting VigilClock. Walk:
   begin → runFor(61s) → patience rung → runFor to 516s → all ten options
   (four A1 + nine rungs + END GAME) accreted, nothing expired → END GAME →
   faceless light (no doors) → GO ON → disclosure ("THE DESK IS CLOSED",
   retraction, "The Unprocessed", zero buttons). Also drive a fold: click a
   rung mid-ladder → V tally, ack line, A1 restored, ladder gone for good.
   Hidden-tab pausing stays a vitest concern (visibilitychange + fake timers).
8. Crisis signpost: `.crisis` footer with the findahelpline.com link exists
   from boot and survives to the disclosure.
9. The body (Phase 4+): the blot (`.blot-wrap` role=img, living `aria-label`)
   must be ALIVE (two samples ≥300ms apart differ) except under
   `emulateMedia({reducedMotion:'reduce'})`, where it must hold one frame.
   Vigil thinning: ink chars in `.blot` decrease as rungs appear and reach ≤1
   by the full ladder. Endings: `.sigil-wrap` role=img with description +
   `copy_glyph` reveals the `.glyph-block` (last line = BG1 code, parseable by
   soul.html). a11y: inject `axe-core` (scratchpad npm), run after a ~500ms
   settle (the fade-in animation reads as a contrast violation mid-flight),
   assert zero serious/critical on boot, an ending, dashboard, soul-analysis.
   Keyboard-only runs must cover the spine AND the Vigil (focus + Enter).
   Note: the sandbox lacks emoji fonts — glyph emoji render as boxes in
   screenshots; not a defect.
10. The breath (Phase 5+): reincarnation drives need ONE browser context per
    "soul" (localStorage persists across `page.goto` within a context). Second
    boot must greet (`.memory` block); the second-run Vigil must stay
    archetypal (run the ladder, grep `.vigil-log` for any prior-life phrase —
    §9.2). Ω returns escalate across `greeting_omega` variants per mount.
    FORGET THESE LIVES is two-step (`forget_lives` → `confirm_forget`), after
    which `.memory` and the forget button are gone. Codex lineage entry is
    sealed until `bardo_completed`. Audio: `window.__bardoAudioStarted` must
    be undefined until `.audio-toggle` is clicked.
11. The Ledger (Phase 3+): start the real handler locally —
   `PORT=8787 ALLOW_ORIGINS=null node worker/node-server.mjs` (the exact
   module the Cloudflare Worker wraps; only storage differs). Set the game's
   endpoint per page via `page.addInitScript('window.BARDO_LEDGER_URL = …')`.
   Assert: a file:// (Origin: null) playthrough increments A1/F1/completions
   via `GET /tally` deltas (fire-and-forget queue needs ~600ms to drain);
   reveals lose the seed label when live; with no endpoint the run completes
   offline with `(last census — the Ledger is unreachable)` everywhere;
   `dist/dashboard.html` shows live headlines with splits locked, and
   degrades to the labeled seed against a dead port. Deliberate dead-port
   steps log `ERR_CONNECTION_REFUSED` to the console — filter those, fail on
   anything else. Totenpass: export button reveals `.totenpass-token`; import
   via the boot-screen system row (`data-system-id` handles).

## Gotchas

- ES module scripts do not load over `file://` — the bundle must stay IIFE with
  a classic `<script src="./bardo.js">` tag (`scripts/check-file-boot.mjs` guards this).
- No persistence exists until Phase 5; reload resetting to boot is correct for now.
