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
- **2026-07-16** — **Theatrical moments + survey-per-loop fix** (CD directive;
  Compass §13). Fixed a state bug: the returning-customer intake could be re-taken
  on the same home screen — now offered once per life (reset on CONTINUE). Built
  three more designer moments (all content-driven, reduced-motion-safe): the walk
  into the light (END GAME floods to light over the disclosure), the held
  non-response at the keeper (~1.4s of silence), and the cursor gasp behind the
  desk. 137 tests; 62 KB gz; verified in real Chromium.
- **2026-07-16** — **Presentation & theatrical pass** (CD directive; Compass §13,
  `docs/THEATRICAL_PASS.md`). Fixed stage: the entity is pinned in view above a
  scroll box with glowing ▴/▾ cues (the reported scroll-away bug). A CONTINUE
  button turns the loop from any ending through a fade-to-light **rebirth** ("a
  life occurred in the moment between"). The entity is now living art —
  cursor-follow, click-bloom, press-to-pool, wary recoil — and **letters swirl
  off it** as the first question and the nine verbs arrive (rare, content-driven).
  All new motion is reduced-motion-safe. A commissioned Journey/ustwo designer
  proposed 11 moments; #1/#2/#4 shipped, the rest queued. 136 tests; 62 KB gz;
  verified in real Chromium.
- **2026-07-15** — **Full Mad-Libs coverage + the Ω-glyph spark** (CD directive;
  Compass §15). Wired the last four intake variables to nodes reached in normal
  play (weather / animal / joy / word), each tied to a running gag; a test guards
  nothing collected goes unspoken. Shipped the tester's #1: the END GAME glyph is
  now a first-class, emoji-free, method-concealing *absence* — the shareable
  anomaly built to make a stranger ask "how did you get a blank one?" 135 tests;
  61 KB gz; verified in real Chromium (incl. the full Vigil-to-Ω walk).
- **2026-07-15** — **The Returning-Customer Intake / Mad-Libs** (CD bonus; Compass
  §15, OD-14 resolved). Optional second-visit intake: ~8 light-preference
  questions (button / SKIP / OTHER free-text), stored local-only and injected as
  the Bard's personalized asides through the run, with a re-survey diff that gently
  favors variety as curiosity ("Pepsi became lemonade"). The free-text OTHER is a
  bounded, ratified exception to buttons-only: never transmitted, never in the
  Ledger, no runtime LLM, sanitized/capped, textContent-only, preferences only.
  134 tests; 61 KB gz; verified in real Chromium.
- **2026-07-15** — **The back office + bite** (CD directive; Compass §15). A
  structurally-forking route only a recognized soul finds: ask to see behind the
  desk (gated at the cart) and go sideways through the works — the waiting line,
  the un-filed, the form press, the engine that renders the light, the Bard's own
  empty room — rejoining at the keeper; the run skips the standard middle, so the
  record comes back a different *shape* (the tester's structural-fork ask). Plus
  two archetypal *bite* passes: the Vigil's opening notice now recognizes the wait
  with playful FOMO, and the returning greeting needles rather than soothes. Logged
  OD-14 (the returning-customer survey / Mad-Libs bonus needs a free-text exception
  ratified; designed, not built). 129 tests; 57 KB gz; verified in real Chromium.
- **2026-07-15** — **The Seams + recognition** (CD directive; Compass §15). Second
  Cycle-Ladder pass on "everyone is trapped, including the Bard": run-gated
  encounter seams for the curious (cycle ≥4 — ask what the light is for; turn the
  keeper's "whom do I serve?" back on it), a binding rule that gated choices are
  never tallied, and a **recognition** arc where seeing the Bard as a fellow
  prisoner (or investing to 5 lives) persistently changes the game master — a peer
  boot greeting and a new OFF THE FORM topic — reversible by Lethe, never crowned.
  Plus a commissioned indie-narrative AI tester SWOT (`docs/TESTER_SWOT.md`). 127
  tests; 55 KB gz; verified in real Chromium at 900/375/320px.
- **2026-07-15** — **The Cycle Ladder, first pass** (CD directive; Compass §15).
  Reincarnation now reveals the seams: intro variety across loops so returning
  never goes stale (Hades), a curiosity "thumb on the scale" that names an
  unopened door after a genuine rut (never a verdict — "the desk does not rank
  doors"), a general run-gating mechanism (`choice.gated` + `unlockedChoices`),
  and **OFF THE FORM** — a buttons-only dialogue that unlocks after 3 completed
  cycles, in which a Bard aware of the game (the wink, not the reveal) voices the
  matured thesis: you cannot leave the games, but you can play them on purpose,
  as a soul who chose the table. §1.2 heart evolved (declining is one door among
  many). §9.2 intact. 123 tests (+6); 53 KB gz; verified in real Chromium at
  900/375/320px.
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
