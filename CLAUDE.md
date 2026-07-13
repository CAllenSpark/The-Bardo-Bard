# THE BARDO BARD

A responsive, zero-cost browser game: grounded philosophical questions and player
choices that shape whether an imagined soul returns to Earth or walks into the
light. Tone: Neil Gaiman (myth, ache) × Douglas Adams (dry, nerdy, procedural).
It is also an anonymous census (the Ledger) and an art piece about agency.

## Start every session here

1. **Read `docs/BARD_COMPASS.md` first.** It is the living design authority and
   reconciles all other documents. Precedence: Compass → `docs/reference/MDD_v2.md`
   → `docs/reference/MDD_v1_extracted.md` → the philosophical report (source
   material only, never design authority).
2. Check `PROGRESS.md` for the current phase and gate status.
3. When any design decision is made in-session, record it in the Compass
   (§12 Open Decisions + §13 Session Log). Chat is not a record.

## Invariants (never violate)

- **The Ledger is sacred.** Bare anonymous tallies only ({node, choice} counters,
  day-bucket; canonical 14-key manifest in Compass §3); no session IDs, paths,
  fine timestamps, IPs, or free text server-side. Within the game UI, a node's
  aggregate numbers render only *after* the player's choice at that node locks
  (the public dashboard is a deliberate, bounded exception — Compass OD-11).
  Never present fake numbers as real ones, and never quote a statistic the
  manifest cannot actually produce (no pace/timing stats — Compass §4.4).
- **The Vigil is the heart** (Compass §4): waiting at the first question grows a
  ladder of authored temptations ending in [END GAME] → the light → the game
  truly ends. The game never labels any path "correct," including that one.
- **No secretly correct cosmology.** No encounter has a single right answer; no
  choice is strictly dominant.
- **Buttons are the only input at MVP.** No free text, no runtime LLM calls.
- **$0 operation**: static bundle (< 300 KB gz) + one Cloudflare Worker fronting
  a Durable Object counter (NOT KV — free-tier KV cannot hold counters; Compass §7).
  The game never blocks on the network; offline mode uses the labeled seed census.
- **Deterministic everywhere testable**: FSM over schema-validated content JSON;
  identical state vectors → identical sigils.
- **Phase gates are scripts, not vibes** — do not advance past a failing gate
  (Compass §10). One commit per gate; keep `PROGRESS.md` current.
- **Safety & integrity**: content notice before Act I (covers manipulation as an
  act performed on the player); Vigil ethics rules incl. bereavement/suicidality
  authoring limits and in-Vigil crisis signposting (Compass §9); symbolic mode in
  the Life Review; gentle exit is never failure; TRADITION / INTERPRETATION /
  HYPOTHESIS / FICTION labels on borrowed material; never mock living traditions.

## Working agreements

- Branch: `claude/bardo-bard-game-d1r2co`. Commit with clear messages; push with
  `git push -u origin claude/bardo-bard-game-d1r2co`.
- All narrative lives in `/content` JSON (schema-validated in CI), engine in
  `/src`, Ledger worker in `/worker`, tests in `/tests`.
- Write game copy in the Bard's voice (Compass §8): three modes — incompetent
  bureaucracy, competent observation, unexpected gentleness. When in doubt, be
  quieter and funnier than you first drafted.
- Claude is a full creative collaborator: raise emotional/intellectual design
  questions with the creative director rather than silently resolving them.
