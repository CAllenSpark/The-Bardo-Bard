# PROGRESS — THE BARDO BARD

Phase-gated build state. Rules: gates are scripts, not vibes; one commit per
gate; do not advance past a failing gate. Full gate definitions:
`docs/BARD_COMPASS.md` §10.

| Phase | Scope | Status |
|---|---|---|
| Alignment | Sources ingested, Compass v1.0 authored, heart mechanic (the Vigil) specced | ✅ 2026-07-13 |
| 0 — Scaffold | Repo layout, content schema + validator, FSM skeleton, 3 seed encounters, test harness | ✅ 2026-07-13 — **Gate 0 green** (`npm run gate0`: content valid, 24 tests, typecheck, build 4.9 KB gz of 300 KB, file:// boot check; verified end-to-end in real Chromium incl. keyboard-only and 375px viewport) |
| 1 — The Spine | Six acts authored, nine verbs reachable, posture variants, confirmation pattern, profiles | ✅ 2026-07-13 — **Gate 1 green** (43 tests: 6 archetypes → 6 distinct verbs, graph audit, dominance floor, 13 profile titles; verified in Chromium at 900/375/320px — mobile audit caught + fixed a doors-bar overlap; 18.4 KB gz) |
| 2 — The Vigil | Temptation ladder, visibility-gated timing, END GAME, Node Ω | ✅ 2026-07-13 — **Gate 2 green** (52 tests: full-ladder walk in 7–10 min window, folds tally `V:<rung>`, hidden-tab time never counts, options never expire, aria-live rungs, digit-free conformity beat, in-Vigil crisis signposting; driven in real Chromium via `page.clock` at 900/375/320px — caught + fixed a body-height bug that trapped the doors bar; 23.3 KB gz). **§9.3 human review: Vigil copy awaits CD sign-off** |
| 3 — The Ledger | Worker + Durable Object, reveal-after-lock, offline census, totenpass, dashboard | ✅ 2026-07-13 — **Gate 3 green** (76 tests + real-browser integration: cross-origin tallies from file:// increment through CORS — the censusless-launch guard; reveal-after-lock across the spine; network-kill run labeled; totenpass round-trips through the UI; dashboard OD-11 scope live + degraded; 28.4 KB gz). Note: integration runs the exact portable handler via a Node adapter; workerd smoke happens at first deploy |
| 4 — The Body | Sigil, share glyph, Soul Analysis, Rorschach, a11y pass | ✅ 2026-07-14 — **Gate 4 green** (100 tests: deterministic living Rorschach with 11 moods + gesture system + Vigil thinning to the pulse; sigil determinism incl. near-blank Ω; glyph-code round-trip; Soul Analysis incl. §4.7 Ω case; keyboard-only spine AND Vigil runs; reduced-motion holds a still frame; axe: zero serious/critical across all four surfaces — recorded substitution for the Lighthouse≥95 wording; 38.5 KB gz). CD's unspoken-performance directive shipped: reactions reflect the Bard's stakes, disclosure confesses the ink |
| 5 — The Breath | Reincarnation variants, codex, optional audio, ship checklist | ⬜ |

## Awaiting creative director

- **§9.3 sign-off on the Vigil copy** (`content/vigil/ladder.json`,
  `content/system/omega.json`): the hope/loss/guilt rungs, the END GAME
  passage, and the disclosure's retraction were authored under the
  bereavement/suicidality rules and need the CD's human review before Phase 2
  is considered shipped.
- Still open: OD-3, OD-4, OD-6, OD-8, OD-12 (Compass §12) — none block Phase 3.

## Log

- **2026-07-13** — Session 1: alignment complete. Compass v1.0 authored, then
  hardened to v1.1 via a five-lens adversarial review (35 findings: Ledger
  backend repinned to a Durable Object counter, CORS pinned, canonical tally
  manifest, Vigil safety rules hardened, shadow-of-presence added, gates
  repaired — full list in Compass §13). CLAUDE.md, reference docs committed.
- **2026-07-13** — Session 1 (cont.): Compass v1.2 — CD resolved OD-5, OD-7,
  OD-10, OD-11; relational-manipulation directive integrated with §9.3 safety
  reconciliation; **standing exits** (doors always in the room) added to Layer A
  and Gate 1. Phase 0 fully unblocked.
- **2026-07-13** — Session 1 (cont.): **Phase 0 complete, Gate 0 green.**
  Scaffold shipped: content schema + validator (graph integrity, Vigil schedule
  window, census label), deterministic FSM with standing exits and
  posture-variant text, VigilClock skeleton (visibility-gated, fake-timer
  tested), minimal terminal UI, 3 seed encounters + boot notice + exit
  passages, Vitest suite (24 tests), esbuild IIFE bundle bootable from file://
  (4.9 KB gz), CI workflow, project verify skill. Standing exits and the
  boot-notice invariant are live from the first playable build. Next: Phase 1,
  the spine.
