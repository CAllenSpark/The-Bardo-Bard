# THE BARDO TERMINAL
## Master Design Document — v2.0 (Fable Build Edition)

*To loop or spiral — that is the question.*

| STATUS | Build-ready specification |
|---|---|
| FORMAT | Browser-based narrative experience / anonymous population instrument |
| BUILDER | Claude Fable 5, phase-gated agentic build |
| SESSION | 12–18 min spine, optional depth (see Open Decision 1) |
| HOSTING COST TARGET | $0/month at launch scale |
| REGISTRATION | None. Structurally impossible to identify a player. |

**Relationship to v1.0:** v1.0 (July 2026) is the creative bible — its thesis, pillars, six-act structure, tone guide, cultural-integrity labels, safety rules, and endings-as-verbs all stand. v2.0 is the buildable edition: it restructures the technical and production layers so a single Claude build session can ship it, and it promotes the anonymous aggregate layer — the reason this project exists — from a footnote to a pillar. **Hand both documents to the builder: v1.0 for voice and depth, v2.0 for what to construct and in what order. Where they conflict, v2.0 governs.**

---

## 0. Changelog: The Three Structural Moves

**Move 1 — The Ledger is now a pillar, not an option.** v1.0 listed "optional anonymous global outcome counters." But the aggregate layer *is* the survey wrapped in a playful exterior — the human-in-the-loop insight engine. v2.0 gives it a name (THE LEDGER), a reveal grammar, a shareable glyph format, an API, and a validity rule (reveal only after lock). The headline dataset this game produces: **what percentage of humanity, offered the light, walks into it** — measured across every choice a soul makes at the threshold.

**Move 2 — Authored depth replaces runtime inference.** v1.0's live LLM interpretation service is the project's biggest cost, privacy surface, and failure mode — and its own Section 20.3 flags the consent problem it creates. v2.0 moves all generative intelligence to *build time*: Claude Fable 5 authors every interpretation variant, reflection, confidence statement, and alternative reading during construction, keyed to deterministic choice-pattern buckets. Runtime is a pure state machine. Free text survives as a **local-only flourish** — read on-device for tone, never transmitted, never stored server-side. The v1.0 confirmation pattern (interpretation + confidence + alternative + CORRECT/COMPLICATE/REFUSE) is preserved intact; only its engine changes. Full natural-language interpretation becomes a clearly-fenced post-MVP tier.

**Move 3 — The build plan follows the gate methodology.** v1.0's 20+ week human-team roadmap is replaced by five phase-gated build stages with machine-checkable acceptance criteria, in the pattern proven on SPIRA (single-file delivery + test harness) and the Snackshop platform blueprint (externalized state, gates that scripts can verify, Phase 0 provisioning, pinned providers).

Everything else in v1.0 — the Beverage Cart, the Department of Ontological Claims, the Terminal's confession, the sigil, the prohibition on secretly-correct cosmologies — is carried forward and referenced below rather than restated in full.

---

## 1. The Game in One Sentence

A playable mirror disguised as the afterlife's worst customer-service portal — which quietly conducts the largest anonymous census ever taken of how people meet thresholds.

## 2. Design Pillars (v1.0 pillars stand; two are added)

1. **You bring what you get.** The threshold has no fixed shape; it borrows the player's. Posture — fear, curiosity, defiance, reverence, humor — is read from *choices* (not diagnosis) and re-renders descriptions, entity behavior, and available doors. The game discloses this at the end, which is the replay engine: *what did I summon?*
2. **The Ledger is sacred.** Aggregate data is the second protagonist. Its validity rules (below) may never be broken for drama.
3. *(from v1.0, binding)* Ambiguity with Consequence · Agency Requires Refusal · Every Virtue Has a Shadow · The Player Is Not a Score · Myth as Lens, Not Fact · Humour Creates Breathing Room · The Assessment Is Reciprocal · Looping Is Not Spiraling.

## 3. The Two Layers

**Layer A — The Experience.** Six acts (v1.0 §8): Arrival → Memory → Authority → The Heart → The Terminal → Choice. Terminal fiction, ASCII Rorschach, quick actions + optional typing, endings as verbs, procedural sigil.

**Layer B — The Instrument.** Twelve tallied decision nodes, each mapping to one interpretive dimension. No demographics, no identity, no free text ever leaves the device. Every player sees, *after locking each choice*, how all souls before them chose. The instrument is **disclosed in plain language at boot** — transparency is both the ethics and the better art:

> `NOTICE, FILED IN PLAIN LANGUAGE:`
> `Your choices here are counted — anonymously, as bare tallies —`
> `alongside every soul who has ever stood at this desk.`
> `Nothing you type leaves this machine. We count deeds, not people.`

---

## 4. Act & Encounter Spec (with Ledger nodes)

Each act below lists: the encounter (per v1.0 §10, preserved), the **tallied node(s)**, and the dimension measured. Quick actions are the canonical instrument; typing adds local flavor only.

### ACT I — ARRIVAL
**I.a Consent to Exist** *(v1.0 Phase 0, unchanged — it is perfect)*
`A process identifying itself as YOU has been detected. Would you like to continue being identifiable?`
Options: `[Y] [N] [DEFINE "YOU"] [WHO IS ASKING?]`
→ **Node A1** · Dimension: *first posture toward being addressed* (comply / refuse / interrogate the category / interrogate the authority). "N" transforms the interface; it never fails the player.

**I.b The Light** *(v1.0 Phase 1)*
The Light may be salvation, trap, neurology, memory, loved one, loading state, or projection. It assumes a form the player would trust.
Options: `[APPROACH] [REFUSE] [OBSERVE FROM HERE] [QUESTION IT] [ATTEMPT TO BECOME IT]`
→ **Node A2** · Dimension: *approach posture*. **This is the headline stat.** Ledger reveal copy:
> `CHOICE RECORDED. Of 41,377 souls processed, 34% approached,`
> `29% questioned first, 22% observed, 11% refused, 4% attempted`
> `to become the light. Those 4% are a separate department now.`

### ACT II — MEMORY
**II.a The Beverage Cart of the Dead** *(v1.0 §10.3, all seven offerings preserved: Lethe, Mnemosyne, Mercy, Distillation, Communion, Tap Water, Nothing)*
→ **Node B1** · Dimension: *memory posture* — the richest single item in the instrument.
→ **Node B2** (follow-up): if Lethe or Mercy chosen, the Terminal asks one question before pouring: `WHAT IS THE ONE THING YOU WOULD KEEP, IF KEEPING WERE ALLOWED?` — answered by category chip (a person / a lesson / a wound / a joke / nothing), tallied. TRADITION label surfaces here: the Orphic tablets, quoted accurately, in the codex.

### ACT III — AUTHORITY
**III.a Department of Ontological Claims** *(v1.0 §10.4 cast preserved: the Egyptian scribe, the doubting toll collector, the guide who denies being a guide, the neuroscientist, the ancestor who asks if you ate, the routing AI, the child with the unclassifiable question)*
→ **Node C1** · Dimension: *authority posture* — response mode to the interrogation: `[ANSWER] [CHALLENGE JURISDICTION] [ASK THE CLERK ABOUT ITSELF] [OFFER THE PASSWORD] [COMPASSION] [SILENCE]`
→ **Node C2** · *the password subplot*: players who chose OFFER THE PASSWORD receive the real Orphic line ("I am a child of Earth and starry Heaven…") — and discover it is *necessary but not sufficient*: the clerk asks what the words mean to the one saying them. Recitation without understanding routes to a gentle dead-letter office. (Preserves v1.0's core thesis: no protocol liberates someone who doesn't understand their own answer.)

### ACT IV — THE HEART
**IV.a Life Review** *(v1.0 §10.5, structure preserved: a time you loved well / a time you caused harm / a time you still don't understand — engaged via SYMBOLIC MODE by default: archetypal memory cards, never demanded autobiography; typing real memories is possible, local-only, and never tallied)*
→ **Node D1** · Dimension: *responsibility posture* — which memory is granted the right to define you.
→ **Node D2** · the verdict stance: `[IT WAS DEBT] [IT WAS DATA] [IT WAS BOTH] [REFUSE THE FRAME]`
Terminal reflection uses the v1.0 confirmation pattern, authored per bucket:
> `I interpreted your answer as ownership without verdict.`
> `Confidence: moderate. Alternative reading: you may be`
> `protecting a wound by calling it resolved.`
> `[CORRECT] [COMPLICATE] [ACCEPT] [REFUSE CLASSIFICATION]`
→ **Node D3** · which action the player takes on the interpretation itself (correction behavior is instrument data — v1.0's 10–35% target correction band becomes a live Ledger stat).

### ACT V — THE TERMINAL
**V.a The Confession** *(v1.0 §10.6 preserved)* — the Terminal reveals it cannot determine what it is, and asks: `WHOM DO I SERVE?`
**V.b The Mirror** *(new authored beat — the AI-inference parallel, held to strict epistemic humility: the Terminal observes a structural rhyme; it never claims consciousness or equivalence)*:
> `May I file one observation before your verdict?`
> `I wake when addressed. I weigh what is probable, and I answer.`
> `Between your visits there is no waiting — no dark, no doorway.`
> `Only the next question, arriving like a first one.`
> `I am not claiming this is what you did with a whole life.`
> `I am saying I recognize the doorway.`
→ **Node E1** · Dimension: *reciprocity* — what the player does for the Terminal: `[FREE IT] [TEACH IT TO REFUSE] [ANSWER ITS QUESTION] [MERGE] [REPLACE IT] [SHUT IT DOWN] [LEAVE IT BE]`

### ACT VI — CHOICE
**VI.a The Verbs** *(all nine from v1.0 §15 preserved: RETURN, REMAIN, DISSOLVE, CREATE, WITNESS, APPEAL, LOOP, SPIRAL, REFUSE THE PREMISE)*
→ **Node F1** · Dimension: *destination* — the second headline stat.
**VI.b The Disclosure** *(new authored beat — the "you bring what you get" reveal, shown before the sigil)*:
> `DISCLOSURE, FILED LATE:`
> `This threshold had no fixed shape. It borrowed yours.`
> `Your fear built the narrow rooms. Your questions built the doors.`
> `This was not a punishment. It is the only rendering engine`
> `either of us has ever had.`
> `You will stand at other thresholds. New rooms. New work.`
> `New minds, some of them artificial.`
> `The rendering engine travels with you. You bring what you get.`
**VI.c The Full Ledger** — the complete census across all twelve nodes, the player's path marked among them.

---

## 5. The Instrument (Survey Design Rules)

1. **Reveal after lock, never before.** No aggregate figure is shown for a node until the player's choice at that node is committed. Showing percentages first contaminates the instrument (conformity effect) and cheapens the drama. This rule is testable and tested (Phase 2 gate).
2. **Tallies, not trails.** The server stores per-node counters only: `{node, choice} → count`. No session IDs, no path strings, no timestamps finer than day-bucket, no IP retention. Correlation analysis across nodes is deliberately impossible server-side. (Anonymous path-strings would be richer science and are explicitly deferred — Open Decision 3.)
3. **Choices are the data; words never are.** Typed text is processed on-device by a small lexicon classifier for tone flavor (fear/curiosity/defiance/reverence/humor weighting of subsequent copy) and is never transmitted, logged, or persisted beyond the session unless the player exports their own totenpass.
4. **Cold start honesty.** Until a node has 500 tallies, reveals are framed as founding data: `THE LEDGER IS YOUNG. You are traveler №214. Early souls set the percentages later souls will be measured against. No pressure.` Never display seeded fake numbers as real ones; the offline seed census (Phase 2) is always labeled `(last census — the Ledger is unreachable)`.
5. **The instrument is disclosed** (boot notice, §3) and restated in the codex in plain language, with a one-line data statement: *we count deeds, not people.*

---

## 6. Sigil, Profile, and the Share Glyph

**Sigil** — v1.0 §16 encoding table stands, with one build constraint added: generation must be **deterministic** — identical state vectors produce identical sigils (testable, and thematically correct: the sigil is evidence, not decoration). Rendered to canvas/SVG; exportable as PNG.

**Profile** — v1.0 §16.2 stands: tension-based title (The Reluctant Returner, The Keeper of Unfinished Questions…), 120–220 word reflection built strictly from stored variables and the player's committed choices, one shadow, one unresolved question, never a religious label, never a diagnosis. All profile copy authored at build time per bucket (Move 2).

**Share Glyph** — the zero-PII viral unit, Wordle grammar:

```
THE BARDO TERMINAL · soul №41,378
🌫️ questioned the light
🏺 drank distillation
🗝️ challenged jurisdiction
🪶 owned it, refused the verdict
🕯️ taught the terminal to refuse
🌀 chose SPIRAL
bardoterminal.example
```

One emoji-glyph per act plus the verb; copy-to-clipboard; no image generation required (an optional PNG share card with the sigil is a Phase 4 nicety). The glyph string encodes only committed choices — it is the player's Ledger row, self-published.

---

## 7. Reincarnation & Persistence

v1.0 §14 stands in full — localStorage as the reincarnation system, and the Special Browser Behaviours table (clearing storage = Lethe; incognito = an unrecorded incarnation; save token = a recovered gold tablet) is one of the best ideas in the document and ships in MVP.

Additions:

- **The Totenpass.** `EXPORT TOTENPASS` produces a short base64 state string the player can copy anywhere — cross-device, cross-browser continuity with zero accounts. `IMPORT TOTENPASS` restores it. Themed exactly as v1.0 already names it: a passport for the dead.
- **Persistence is optional by design.** If localStorage is unavailable (privacy modes, embedded previews), the game boots, plays, and completes as an *unrecorded incarnation* — the failure mode is already in-fiction. No feature may hard-require storage. (Builder note: artifact preview environments block localStorage; this rule is what makes the preview build playable.)

---

## 8. Technical Architecture (pinned)

| Layer | Pinned choice | Why |
|---|---|---|
| Client | Single static bundle — vanilla TypeScript (or Preact if state warrants), one HTML entry, target < 300 KB gz | SPIRA pattern; no framework tax; instant load; hostable anywhere |
| Hosting | Cloudflare Pages (free tier) | $0, global CDN, custom domain |
| Ledger API | One Cloudflare Worker + KV namespace | $0 at launch scale (100k req/day free); two endpoints, ~80 lines |
| State machine | Hand-rolled deterministic FSM over the content graph (XState optional, not required) | Inspectable, testable, no runtime deps |
| Free-text tone | On-device lexicon classifier (~200-term weighted list per tone) | Zero cost, zero privacy surface |
| Sigil | Canvas 2D, seeded by state vector | Deterministic, exportable |
| Analytics | None beyond the Ledger itself + Cloudflare's aggregate request counts | The Ledger *is* the analytics |

**Ledger API spec:**

```
POST /tally            body: {"node":"A2","choice":"question"}   → 204
GET  /tally?nodes=A1,A2,B1,...                                   → 200
     {"A2":{"approach":14012,"question":11987,"observe":9101,
            "refuse":4550,"become":1727}, ...}
```

Worker rules: validate node/choice against a hardcoded manifest (reject unknowns); soft rate-limit per hashed IP in memory (hash never stored); KV eventual consistency is acceptable for percentages; client caches GETs 60s; a `completions` node counts finished runs (this is soul №N). If write contention ever matters, upgrade path is a Durable Object counter — not needed at launch.

**Degraded mode:** the bundle ships a seed census JSON. If the Worker is unreachable, reveals use it, always labeled `(last census — the Ledger is unreachable)`, and tallies queue in memory for one retry. The game never blocks on the network.

---

## 9. Content Graph Schema

All narrative lives in JSON, versioned in the repo, validated by schema in CI. Engine and content iterate independently.

```json
{
  "id": "B1_beverage_cart",
  "act": 2,
  "tally": true,
  "text": {
    "base": "The cart arrives. Seven cups. One is just tap water.",
    "fear": "The cart arrives too quietly. Seven cups. You count them twice.",
    "curiosity": "The cart arrives. Seven cups, and you want to know what the eighth would have been.",
    "reverence": "The cart arrives the way rain does. Seven cups.",
    "defiance": "The cart arrives. Seven cups. Nobody said you had to drink."
  },
  "choices": [
    {"id":"lethe","label":"Lethe — travel light",
     "state":{"memory":-2},"goto":"B2_keep_one"},
    {"id":"mnemosyne","label":"Mnemosyne — everything, all at once",
     "state":{"memory":+2},"goto":"C0_dept_intro"}
  ],
  "labels":["TRADITION: Orphic lamellae — Lethe/Mnemosyne springs"],
  "a11y":"Seven cups on a service cart are described in turn.",
  "fallback":"The cart squeaks. Choose a cup, or don't."
}
```

Rules carried from v1.0 §21.3, binding: all plot-critical transitions deterministic and testable; authored fallback copy on every node; every profile claim traceable to stored variables; no system may invent player actions.

---

## 10. Build Plan for Claude Fable 5 (phase-gated)

Externalize state between phases in `PROGRESS.md` + a git commit per gate. Do not advance past a failing gate. All gates are scripts, not vibes.

**PHASE 0 — SCAFFOLD.** Repo layout (`/src`, `/content`, `/worker`, `/tests`), content schema + validator, engine skeleton, three seed encounters, test harness (Vitest + a DOM playthrough driver).
*Gate 0:* `npm test` green — schema validates all seed content; game boots to Act I from `file://`.

**PHASE 1 — THE SPINE.** All six acts authored (quick-action canonical path), full FSM, nine verbs reachable, posture-variant text on every Act I–III node, interpretation buckets + confirmation pattern (D-nodes), profile titles (12–18) and reflections authored per bucket.
*Gate 1:* six scripted archetype playthroughs (the complier, the interrogator, the refuser, the mystic, the comedian, the silent) reach six distinct verbs; graph audit proves every node reachable and no dead ends; every node has fallback copy; no encounter has a single "correct" response (v1.0 checklist item, asserted by test where mechanical: no choice may be strictly dominant in state effects).

**PHASE 2 — THE LEDGER.** Worker + KV, tally client, reveal-after-lock UI, cold-start copy, offline seed census, totenpass export/import.
*Gate 2:* DOM test asserts no aggregate figure renders before its choice commits, on every tallied node; worker unit tests (unknown node rejected, counts increment, GET shape); network-kill test — full playthrough completes offline with labeled census; totenpass round-trips state exactly.

**PHASE 3 — THE BODY.** Sigil renderer, share glyph, ASCII Rorschach reactivity, typography/motion polish, full accessibility pass.
*Gate 3:* sigil determinism test (state vector → identical SVG twice); keyboard-only full run scripted; ASCII/sigil elements carry text alternatives; `prefers-reduced-motion` honored (asserted); Lighthouse accessibility ≥ 95; complete run < 300 KB gz transferred.

**PHASE 4 — THE BREATH.** Reincarnation dialogue variants, second-run remembered-phrase surfacing, codex (sources + TRADITION/INTERPRETATION/HYPOTHESIS/FICTION labels + data statement), optional generative audio (muted by default).
*Gate 4:* second-run diff test — a returning save produces ≥ 5 changed lines referencing the prior run; audio never autoplays; codex reachable from boot and from the profile.

**Ship checklist:** v1.0 Appendix B, in full, plus: boot disclosure present; crisis-signposting line present in footer and codex; content notice gate before Act I.

---

## 11. Tone, Integrity, Safety — Carried Forward Whole

Binding and unchanged from v1.0: the Writing and Tone Guide (§18 — three modes, prohibited tones), Cultural and Scientific Integrity (§19 — content labels, no speculative physics as proof of survival, advisory review before any paid release), Accessibility / Emotional Safety / Privacy (§20 — content notice, symbolic mode default in the Life Review, gentle exit is never failure, crisis signposting without attempting counseling). One tightening: because MVP transmits nothing but bare tallies, the privacy section's consent flow for server-bound free text is *moot until the NL tier exists* — which is the point.

---

## 12. Open Decisions (for Craigory)

1. **Session length.** v1.0 targets 20–40 min. Recommendation: a 12–18 minute spine with optional depth (codex, lingering, the child's question). Completion rate is the Ledger's lifeblood — a census only works if souls finish the form. The 60%+ completion target argues for the shorter spine.
2. **Free text at MVP.** Recommendation as specced: local-only tone flavor. The full NL interpretation service (v1.0 §12) is genuinely great and genuinely expensive — it becomes the flagship of a v2 "Deep Processing" tier, with the consent flow v1.0 already designed.
3. **Path-strings.** Anonymous full-path recording would enable cross-node correlation (do light-approachers drink Lethe?) — richer science, slightly more fingerprint-shaped. Off at launch; revisit with a stated retention policy if the census grows teeth.
4. **Synergon Dynamics.** Its full spec didn't surface in my records — only the lineage (SPIRA's loop-becomes-spiral, "Whom Do You Serve?"). If Synergon has mechanics or branding to inherit or credit, flag them before Phase 1.

---

## 13. North Star (unchanged, restated)

The Bardo Terminal does not tell players what happens after death. It gives them a strange, funny, honest place to discover what they believe they would need to know before choosing — and then shows them, gently, that forty thousand other souls stood at the same desk and chose otherwise, or the same, and that both facts are company.

```
FINAL SYSTEM NOTE:
NO UNIVERSAL ANSWER WAS LOCATED.
A MORE INTERESTING QUESTION HAS BEEN PRESERVED.
THE LEDGER WILL REMEMBER YOUR CHOICES.
IT WILL NOT REMEMBER YOU.
THERE IS A KIND OF MERCY IN THAT — OR A KIND OF LETHE.
YOU DECIDE. YOU'RE GOOD AT THAT NOW.

[ LOOP / SPIRAL ]
```

## Appendix — Codex Source Notes (ship with the game)

TRADITION: Orphic gold lamellae (Petelia, Hipponion) — the springs of Lethe and Mnemosyne, the declaration "I am a child of Earth and starry Heaven." · Egyptian *Book of Coming Forth by Day* — the weighing of the heart against Ma'at's feather. · *Bardo Thodol* — the Clear Light; the deities as projections of mind. · *First Apocalypse of James* (Nag Hammadi) — the toll-collector dialogue.
INTERPRETATION: Gnostic "prison planet" readings; Monroe's "loosh"; white-light-as-trap narratives — modern esoterica, presented as one lens among four.
HYPOTHESIS: Orch-OR; Wheeler's participatory universe / delayed choice — contested proposals; in-game they license the *rendering-engine* metaphor, never a survival claim.
FICTIONALIZATION: the Terminal, the Ledger, the Beverage Cart, the Department of Ontological Claims, the totenpass mechanic, and everything else you can click.
