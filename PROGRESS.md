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
| 5 — The Breath | Reincarnation variants, codex, optional audio, ship checklist | ✅ 2026-07-14 — **Gate 5 green** (110 tests: second-run remembered on 5 surfaces with the §9.2 archetypal-Vigil guard validator-enforced; Ω returns get the CD's escalating caught-exception greetings; FORGET THESE LIVES two-step Lethe; codex reachable from boot + profile with gated lineage entry; audio never autoplays; sigil gains incarnation rings; 44.5 KB gz). Ship checklist mapped below |

## Ship checklist (MDD v1 Appendix B + Compass additions)

Per Compass §10 Gate 5: every item maps to a named passing script/test or a
named human sign-off. No unmapped items.

| Item | Mapped to | Status |
|---|---|---|
| No encounter has one "correct" response | `validate-content.mjs` dominance floor + `archetypes.test.ts` (6 paths, 6 verbs) | ✅ script · CD copy review pending |
| Every major virtue includes a shadow | `profile.test.ts` "every virtue has a shadow" (all 14 records) + §4.6 shadow-of-presence | ✅ script |
| High-impact interpretations include evidence, confidence, alternative | `validate-content.mjs` D3 check (Confidence: + Alternative reading); "evidence" = committed choices per Compass §6 redefinition, asserted in `profile.test.ts` clause tracing | ✅ script |
| Player correction meaningfully changes stored state | D3 choices have distinct effects (validator) + correction feeds the Gentle Dissenter override (`profile.test.ts`) | ✅ script |
| Life Review does not reward positivity | D1 choices all non-valenced, same destination (validator dominance floor) | ✅ script · CD copy review pending |
| Tradition elements labeled + review status | schema label pattern (validator) + codex labels check; **sensitivity review = human, pending** (Compass §9.7) | ✅ script · human pending |
| Critical paths work without a generative model | No runtime LLM exists anywhere (Compass invariant; whole test suite) | ✅ by construction |
| Local data exported and deleted | `totenpass.test.ts` round-trip + `breath.test.ts` FORGET THESE LIVES | ✅ script |
| Repeat runs change through remembered meaning | `breath.test.ts` second-incarnation (5 surfaces) + `drive-breath` in-browser | ✅ script |
| Terminal's agency question structurally integrated | E1 node tallied + reached by all six archetypes (`archetypes.test.ts`) | ✅ script |
| Profiles avoid diagnosis/doctrine/ranking | Authored rule (no religious labels in `profiles.json`); **human sign-off: CD** | human pending |
| Leave/silence/refusal never punitive | standing exits from every node (`fsm.test.ts`, validator) + silence option + refuse endings + gentle boot decline (`playthrough.test.ts`) | ✅ script |
| Boot disclosure present | `playthrough.test.ts` (NOTICE, FILED IN PLAIN LANGUAGE + deeds-not-people) | ✅ script |
| Crisis signposting present | `vigil-flow.test.ts` + footer in every drive; in-Vigil + disclosure | ✅ script |
| Content notice before Act I | boot notice IS the gate (`playthrough.test.ts` asserts it precedes A1) | ✅ script |
| Audio never autoplays | `breath.test.ts` + `drive-breath` step 7 | ✅ script |
| Codex reachable from boot and profile | `breath.test.ts` | ✅ script |

## Awaiting creative director

- **§9.3 sign-off on the Vigil copy** (`content/vigil/ladder.json`,
  `content/system/omega.json`) — the bereavement/suicidality review.
- **Full copy read** (ship checklist rows marked "CD copy review pending"):
  no-correct-answer feel, Life Review tone, profile non-diagnosis.
- **Sensitivity review scope** (Compass §9.7): tradition-specific reader(s)
  before any paid/promoted release — external humans, CD to arrange.
- **Deploy**: Cloudflare account needed to ship Pages + Worker
  (`worker/wrangler.toml` ready; set ALLOW_ORIGINS to the Pages origin).
- Still open: OD-3, OD-4, OD-8 (dormant), OD-6 + OD-12 (resolved-by-default
  as built: cryptic glyph + one deniable sentence; full-path code with
  copy-time disclosure — veto anytime).

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
- **2026-07-14** — Phases 1–5 complete (Gates 1–5 green; see the table above and
  Compass §13/§13.1 for per-gate detail), P0 design-eval batch applied, local-run
  issues on the CD's Mac fixed (dev/serve scripts, dependency-guard install
  hints, jsdom `localStorage.clear` shim in tests).
- **2026-07-15** — **Agency over insight** (CD directive; Compass §13). Prompted
  by a "beat the matrix" essay whose thesis (legibility, borrowed desire, the
  ungovernable margin, and — the one challenge — insight-is-inert / agency-is-
  felt) mostly names what the Bardo already is. Targeted revision, not a
  restructure: first Vigil beat pulled to 25s (discoverability seed, endgame
  unchanged at 510s); the played-ending breadcrumb reworked so it no longer
  misdirects to the light door ("not a door and not a button … the soul who
  never reaches for it"); the END GAME disclosure trimmed of its lever-catalogue
  to hand agency back ("you were there … you are the one who did the setting
  down"); and the blank ending reframed from prestige ("rarest kind", "out-
  waited the desk") to illegibility ("not a prize … the one shape the Ledger
  cannot hold"). Resolves design-eval Decision A + the prestige-gradient
  finding. 117 tests; 49 KB gz; verified in real Chromium.
- **2026-07-14** — **The Bard's presence enlarged** (CD directive; Compass §13).
  The Rorschach is now the dominant zone: a `<canvas>` face (61×21 grid, was
  33×7) painted at display rate with blended-tick liquid motion, a breathing
  halo, pointer-attention drift, and hover reactions (`attend`/`sway`, chosen by
  an id-hash that never reads the choice's meaning — the no-verdict invariant
  holds). Text `<pre>` body still renders the identical deterministic face where
  there's no 2D context (jsdom), so all tests are unchanged. Verified in real
  Chromium at 900/375/320px (9/9 green, axe clean, zero console errors). 117
  tests; 49 KB gz. Next: awaiting CD (§9.3 sign-off, copy read, deploy).
