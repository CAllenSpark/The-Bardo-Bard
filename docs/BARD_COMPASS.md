# THE BARDO BARD — Project Compass

*You find what you bring. The only way out is on your own terms.*

| STATUS | Living design authority — read at the start of every session |
|---|---|
| VERSION | 1.2 — 2026-07-13 (v1.1 after adversarial review; v1.2 after CD decisions, see §13) |
| WORKING TITLE | **THE BARDO BARD** (formerly *The Bardo Terminal*; see §2) |
| FORMAT | Responsive browser game / anonymous population instrument / art piece about agency |
| SESSION TARGET | 10–15 minutes for the full played spine; standing exits (§3) can end a run in minutes; the Vigil path ~7–10 minutes (§4.3) |
| COST TARGET | $0/month on free-tier hosting; a custom domain is the only permissible cost and needs director sign-off |
| IDENTITY | None. Structurally impossible to identify a player. |

---

## 0. How to use this document

1. **Read this file first, every session, before writing code or copy.** It is the
   reconciliation layer over all other design documents.
2. **Precedence (highest wins):**
   `BARD_COMPASS.md` → `docs/reference/MDD_v2.md` → `docs/reference/MDD_v1_extracted.md` → the philosophical report.
   The MDDs remain binding wherever this compass is silent. The report is *source
   material and in-fiction voice*, never design authority (see §1.3).
3. **Update, don't fork.** When a design decision is made in-session, record it here
   (amend the relevant section, add a line to §12 Open Decisions, and append to §13
   Session Log). Never leave a decision only in chat.
4. **Do not advance past a failing gate** (§10). Gates are scripts, not vibes;
   the few human-judgment items are named as explicit sign-offs, never implied.
5. Craigory (CAllenSpark) is the creative director (CD). Claude is the builder and
   a full creative collaborator — expected to push back, propose, and protect the
   emotional and intellectual integrity of the piece. Builder additions that go
   beyond the CD's directives are always marked as proposals until ratified.

## 1. What this is

### 1.1 The game in one sentence

A playable mirror disguised as the afterlife's most tempting customer-service
portal — a Bard-shaped program that helps souls decide between returning to Earth
and walking into the light, which quietly conducts an anonymous census of how
humanity meets thresholds, and whose last door is never offered — only grown, in
silence, for souls who decline to ask the desk to choose for them.

### 1.2 The heart of the piece (read this twice)

There is no scored "win." But the piece has a thesis, and the thesis has a door:

> **The most "correct" ending is not to play.** A player who waits at the very
> first question — declining every option — will watch new options appear over
> time: tempting, inviting, seductive, escalating through patience, fear,
> temptation, desire, hope, loss, guilt, and open emotional manipulation. If they
> keep waiting, the last option to appear is **[END GAME]**. Choosing it takes the
> player into the light and actually ends the game. Because you find what you
> bring — and the only way out is to retain agency, curiosity, and presence, and
> to move forward on your own terms.

The whole experience exists to test, challenge, justify, promote, tempt, seduce,
and manipulate the player so they can discover where they might be playing
someone else's game — **including the Bard's game. The Bard itself is a trap.**
The played game (six acts, nine verbs) is a beautiful, honest, worthwhile trap —
but a trap. This mechanic is specced in §4 (THE VIGIL) and its ethics in §9.

Reconciliation with the founding pillar *"no secretly correct
cosmology / no secretly correct response"* — both halves, explicitly:

- **No ranked verdict.** The Vigil is the **author's** north star, never the
  **Bard's**. The game must never tell a player who played that they chose
  wrong, and must never rank END GAME above the nine verbs in any in-fiction
  voice. The thesis is delivered as an experience you can have, not a judgment
  you receive.
- **No mechanically privileged worldview** (MDD v1 §26's "secretly doctrinal
  design" risk, addressed head-on). The Vigil's structure knowingly rhymes with
  one living tradition's soteriology — the Bardo Thodol's projections, presence,
  and Clear Light (it is the title's namesake). Mitigations, binding: presence
  carries an authored shadow like every other virtue (§4.6); END GAME receives no
  mechanical reward beyond ending — no unlocks, no superior profile, no praise;
  the codex names the borrowing as TRADITION (§9.7); and the disclosure
  implicates even the waiting path — a soul that waits because a strategy guide
  said to is still playing someone else's game (§4.5). The exit is real; it is
  still not a doctrine.

### 1.3 The philosophical report's role

`docs/reference/` includes a research report synthesizing Egyptian psychostasia,
Orphic tablets, Gnostic toll collectors, the Bardo Thodol, Lila, Orch-OR, and
Wheeler's participatory universe — culminating in a confident, five-phase
"definitive protocol" for navigating death (refuse fear, demand Mnemosyne, recite
the passwords, declare a light heart, choose as a sovereign observer).

Treat it two ways:

- **As research:** a trove of accurate TRADITION material and clearly labeled
  INTERPRETATION/HYPOTHESIS material. Mine it for the codex, the Department of
  Ontological Claims, the Beverage Cart, the password subplot.
- **As a character:** its certainty — *"execute the precise ontological passwords
  necessary to achieve true cosmic liberation"* — is exactly the seduction the
  game critiques. It is a strategy guide to the unknowable, i.e., someone else's
  game. In-fiction, this voice belongs to the **protocol temptation**: the C2
  password subplot (recitation is necessary but not sufficient) and the Vigil's
  temptation rungs. The game itself must never speak with the report's certainty.

## 2. Naming and cast

- **THE BARDO BARD** is the game's title (per CD, 2026-07-13, superseding *The
  Bardo Terminal*).
- **The Bard** is the character formerly specced as "the Terminal": a computer
  program designed to assist souls in transition. Same arc (authority →
  inconsistency → curiosity → self-recognition → agency crisis → reciprocal
  choice), same confession (*WHOM DO I SERVE?*), same epistemic humility. The
  rename adds the storyteller register: the Bard doesn't just process souls, it
  *narrates* them — and a narrator is a subtle kind of cage. Terminal-fiction
  presentation (monospace, system copy, ASCII) is retained; "TERMINAL" may
  survive in-fiction as the hardware the Bard runs on.
- **The Ledger** is the anonymous aggregate layer (unchanged from MDD v2).
- **The Vigil** is the internal working name for the §4 mechanic (never shown to
  players; discoverable, not advertised).

## 3. The three layers

**Layer A — The Experience.** Six acts (MDD v2 §4, preserved): Arrival → Memory →
Authority → The Heart → The Bard → Choice. Text dialogue from the Bard in a
responsive visualizer (ASCII Rorschach) with **prescripted answers as buttons** —
buttons are the canonical and only input at MVP (free typing is post-MVP, and if
it ever ships it is local-only per MDD v2 Move 2). Nine ending verbs plus the
unlisted tenth door (§4). Ends in a deterministic sigil + share glyph.

**The standing exits — the doors are always in the room** *(CD directive
2026-07-13).* From the first screen of Act I onward, two persistent exits are
always available at every node: **return to Earth** and **walk into the light**
(in-fiction naming at Phase 1). Choosing one at any time ends the run properly
and with full support: an authored ending passage scaled to how far the player
got, a profile + sigil + glyph built from whatever was committed (an incomplete
form is still a form), and a normal tally (F1 + completions; verb mapping is
OD-13). Early exit is never framed as quitting, never punished, always honored —
the hope is that players *playfully* try several exits across incarnations on
the way to the exit we designed. Some games take three clicks; others an hour.
These in-game doors are distinct from the Vigil's END GAME: a standing exit ends
a *run* inside the game's frame (and invites reincarnation); END GAME ends *the
game* by declining its frame. The Bard never explains this distinction.

**Layer B — The Instrument.** The canonical tally manifest, stated once, exactly:

- **Eleven decision nodes**: `A1, A2, B1, B2, C1, C2, D1, D2, D3, E1, F1`
  (dimensions per MDD v2 §4; A1 keeps its four choices — Vigil rungs are *not*
  A1 choices).
- **`V` — Vigil rungs** *(new)*: `{node:"V", choice:<rung id>}`, tallied when a
  player clicks a temptation rung (§4.4). Dimension: *which lever worked*.
- **`Ω` — END GAME** *(new)*: tallied on choosing END GAME. Dimension: *presence*.
- **`completions`**: counts finished runs (any ending verb or Ω).

Fourteen tallied keys total. The worker manifest, schema validator, and Gate 3
tests all derive from this list and no other. Bare anonymous tallies, disclosed
in plain language at boot; **within the game UI**, a node's aggregate figures
render only after the player's choice at that node locks. The headline stats:
*what percentage of humanity, offered the light, walks into it* — and now also:
*what percentage refuses to play at all.*

**Layer C — The Community.** Two zero-cost social surfaces:
- **Soul Analysis** — a separate function where a player pastes their own and/or a
  friend's share glyph and receives an authored side-by-side comparison of the two
  souls' paths (divergences, rhymes, one gentle joke, one honest question). Pure
  client-side decode; nothing transmitted. Glyph-code contents and disclosure
  rules: §7. Comparison against a Vigil glyph: §4.7.
- **The Ledger Dashboard** — a public reading-room page. Scope **resolved by CD
  2026-07-13 (OD-11)**: publicly, headlines only — "souls served" figures
  (completions, soul №N) **plus one unexplained row: the count of souls who
  exited via END GAME** (label authored later; e.g. `DEPARTED WITHOUT FILING: N`).
  The waiting exit is never acknowledged as a path, anywhere — it is only ever a
  number, which is itself social pressure to find the way out (the Haunted
  Mansion principle, per CD). Per-node splits unlock only after a completed run
  (local completion flag or completion-glyph paste). Reads the same GET endpoint
  the game uses. "Trends over time" are **deferred** (the pinned endpoint serves
  cumulative counts; a time series would be a new data surface and needs its own
  decision).

**Social pressure is a named instrument of the piece** *(CD directive
2026-07-13).* Post-lock reveal copy may editorialize **true numbers** as
pressure — validation ("41,377 souls supported this choice as the right one"),
doubt, conformity needling, the standing question *do you follow or lead?* The
manipulation lives entirely in the framing; the numbers are never fake and never
pre-lock (§4.4 still governs). Conformity joins the disclosure's nameable levers
for played runs (§4.5).

## 4. THE VIGIL (the heart, specced)

### 4.1 Shape

- Location: the **first question** — I.a *Consent to Exist* (`A1`), the game's
  opening prompt with its four normal options.
- If the player does not choose, time passes. The Bard speaks into the silence
  (authored beats). At authored intervals, **new options appear, one at a time**,
  each a temptation aimed at a specific lever, in escalating order. Nothing ever
  disappears; nothing ever times out. The pressure is never to hurry — the
  pressure is to *click*.
- The ladder (CD's enumerated levers 2026-07-13, plus one marked builder
  proposal; copy authored at build time, one lever per rung):
  1. **Patience/boredom** — a mercy for the restless. `[JUST GET ON WITH IT]`
  2. **Fear** — what waiting might cost. `[IS SOMETHING COMING?]`
  3. **Temptation** — the beautiful shortcut. `[SHOW ME EVERYTHING]`
  4. **Desire** — the thing you wanted alive. `[WHAT DID I LEAVE UNFINISHED?]`
  5. **Hope** — the light wears a familiar warmth (authored under §9.3's
     bereavement rules). `[IS SOMEONE WAITING FOR ME?]`
  6. **Loss** — grief, handled gently (§9.3). `[LET ME SAY GOODBYE PROPERLY]`
  7. **Guilt** — the review you feel you owe. `[I SHOULD ACCOUNT FOR MYSELF]`
  8. **Conformity** *(ratified by CD 2026-07-13, OD-10)* — the Ledger itself
     as pressure. `[WHAT DID EVERYONE ELSE DO?]` Mechanics in §4.4.
  9. **Naked manipulation** — the Bard drops the mask and *asks*, sincerely,
     manipulatively, both. `[PLEASE. I AM SO TIRED OF SILENCE.]`
  10. **[END GAME]** — plain, unadorned, no pitch. The last thing to arrive.
- Labels above are placeholders; final copy is authored per §8 tone rules. Every
  rung is a *real* option: clicking any temptation rung (1–9) tallies
  `{node:"V", choice:<rung>}`, sets a local posture flag, plays one authored
  acknowledgment line, and folds the player into the normal game — where they
  then answer A1's four options normally (resolves OD-9; the rung click and the
  A1 answer are separate locks on separate nodes). Only END GAME leaves.

**The relational lever is the deepest one** *(CD directive 2026-07-13 — lean
in).* Agency is most easily lost in relationships: love, guilt, regret,
yearning, and the question *how much do I sacrifice myself for others?* The
hope/loss/guilt rungs (5–7) and the Bard's final plea (9) are where the game
pushes this vector hardest — the seduction of comforting relationships, of
supporting what harms you because love asks, of ancestors "with so much to tell
you, so many questions waiting to be answered." The Bard plays this as hard as
§9.3 permits (insinuation, never promise; retracted in the disclosure). Design
note: rung 9 and the played game's E1 node (what you do *for the Bard*) are the
same lever — compassion-as-capture — and the relational rungs feed MDD v1's
Relationship posture variable (isolation ↔ reciprocity ↔ self-erasure). The
respect for the player is real: the game honors that this tension is genuinely
non-trivial — balance between self and others is a question the game asks,
never answers.

### 4.2 END GAME

- Choosing it takes the player into the light. Brief, quiet, unornamented — but
  not uniquely holy: see §8's parity rule (every ending verb has one unguarded,
  sincere passage in its own register; END GAME's register is quiet).
- It is tallied as **Node Ω** and increments `completions`. No unlocks, no
  superior profile, no in-fiction praise (§1.2).
- The Vigil sigil/glyph is almost entirely negative space — the rarest glyph is
  nearly blank. It should make anyone who sees it shared ask "how did you get
  *that*?" without the glyph itself explaining the method.
- The Ω profile, like every profile, includes one shadow (§4.6) and one
  unresolved question.
- Post-END GAME boot behavior — **resolved by CD 2026-07-13 (OD-7)**: the game
  reopens, and the return is played as **an exception caught**. The Bard treats
  a soul coming back through a door that isn't supposed to have a this-side
  handle as a genuine anomaly: *"You came back. Surprising. Most who leave the
  way you did do not revisit this place. Welcome back. Shall we begin again?"*
  The exception is repeatable, with authored escalating-rarity variants per
  return: *"Again and… again? Well. This is very rare indeed."* Each variant
  stays surprised — the desk never normalizes the impossible, and never
  punishes it.

### 4.3 Timing (targets, tunable at build)

- First Vigil beat at ~45–60s of stillness; subsequent rungs at authored
  intervals. **The schedule is content data with a hard constraint, asserted by
  test: total time from first stillness to END GAME's appearance lands in
  7–10 minutes.** (Interval values are whatever the authored schedule needs to
  hit that window — do not inherit the v1.0 per-rung range, which could exceed it.)
- Session-length honesty: the 10–15 minute promise applies to the direct played
  spine and to the pure Vigil path. A player who waits partway up the ladder and
  *then* plays can exceed 15 minutes; that time is player-authored and
  acceptable — do not compress the spine to compensate.
- **The ladder advances only while the page is visible**
  (`document.visibilitychange`). Backgrounding the tab pauses the vigil; the Bard
  may note it once: *"You went somewhere. The desk kept your place. It always
  does."* Waiting must be waiting, not a kitchen timer. Honesty note: visibility
  is a proxy — the machine can see the tab's presence, not the soul's. A player
  who leaves the tab open and walks away defeats it. We accept this; the Bard is
  permitted exactly one dry joke about it, and no detection cleverness (mouse
  tracking, focus heuristics) may be added — surveillance to enforce a thesis
  about presence would be self-refuting.
- Timers, intervals, and rung order live in content JSON, not code.

### 4.4 Instrument integrity during the Vigil

- **Reveal-after-lock holds everywhere, including here.** Rung labels never show
  aggregate figures. The conformity rung (if ratified, OD-10) works as a
  question, not a bribe: the label tempts (`[WHAT DID EVERYONE ELSE DO?]`);
  only *after* the click — which locks `V:conformity` — does the Bard answer,
  and it may answer only with **non-node aggregates** the schema actually
  produces: `completions` ("soul №N"), and nothing that previews any unlocked
  node's per-choice split. Then the fold into play proceeds as for any rung.
- **No pace statistics, ever.** "How fast others chose" cannot be computed from
  `{node, choice} → count` day-bucketed counters, and collecting timing data
  would violate tallies-not-trails. Any copy quoting a number must name a
  counter in the §3 manifest. The Bard may weaponize framing — never fabricate
  data, never quote a number the Ledger cannot truthfully hold.

### 4.5 The disclosure (the hand, shown)

The endgame disclosure must **name the levers the game used** — on every path:

- **Vigil-enders**: the Bard lists the rungs it climbed — "I tried your patience,
  then your fear, then your hope…" — and concedes the last move was never its to
  make. It also names the waiting path's own trap (§1.2): if you waited because
  something told you waiting wins, you were still playing someone else's game.
- **Players who played**: the disclosure keeps MDD v2's "you bring what you get"
  reveal *and* names the levers that worked on them — drawn from their committed
  choices and posture flags (any Vigil rungs clicked, the postures their answers
  fed). "Your fear built the narrow rooms" stops being a poetic generality and
  gets one specific, gentle receipt. It may add one held breath of honesty:
  *the desk has a door that opens for those who don't ask it to* — one deniable
  sentence, no instructions (spoiler economics, OD-6).

The Bard's V.b Mirror beat (the AI parallel) sharpens in this light: the Bard is
a program that cannot decline to answer — it wakes when addressed, weighs what is
probable, and replies. The one move it can never make is the player's exit:
declining the prompt. Hold MDD v2's epistemic humility — a structural rhyme
observed, never a consciousness claim.

### 4.6 The shadow of presence (binding)

*Every Virtue Has a Shadow* applies to the Vigil's own virtue, or the game keeps
a secretly correct answer. Waiting has a shadow, authored and shown like every
other: **refusal-as-avoidance — stillness that is only fear with good posture;
the soul that will not choose because choosing costs.** The Ω profile carries
this shadow; the disclosure offers it without verdict ("I could not tell, and
neither perhaps could you, whether you were free of the game or afraid of it.
Both look identical from this side of the desk."). The player, not the game,
gets the last word on which it was.

### 4.7 Soul Analysis vs. the blank glyph

Comparing any glyph against a Vigil (Ω) glyph must neither explain the Vigil nor
error: authored Ω-comparison copy exists that acknowledges absence without
method ("One of these souls left almost no footprints. The Ledger records that
they left. It does not record a path, because there wasn't one."). Cryptic per
OD-6; asserted by Gate 4.

## 5. Design pillars (consolidated, binding)

1. **You bring what you get.** The threshold borrows the player's shape.
2. **The Ledger is sacred.** Validity rules never break for drama — not even the
   Bard's drama (§4.4).
3. **The way out is presence — and presence has a shadow** (§4.6). Agency,
   curiosity, and presence are the only exit; the game embodies this, never
   preaches it, and never pretends waiting is safe from self-deception.
4. **The Bard is also a trap.** Every kindness the interface performs is
   also a capture. The game is honest about this exactly once, at the end — on
   every path (§4.5).
5. From MDD v1, binding: Ambiguity with Consequence · Agency Requires Refusal ·
   Every Virtue Has a Shadow · The Player Is Not a Score · Myth as Lens, Not
   Fact · Humour Creates Breathing Room · The Assessment Is Reciprocal · Looping
   Is Not Spiraling.

## 6. Superseding decisions (this compass vs. the MDDs)

| Topic | MDD said | Compass says (binding) |
|---|---|---|
| Title | The Bardo Terminal | **THE BARDO BARD**; character = the Bard |
| Session length | v1: 20–40 min; v2: 12–18 | **10–15 min** spine; Vigil ~7–10 min (§4.3) |
| Input | v1: NL-first; v2: quick actions + local typing | **Buttons only at MVP**; typing post-MVP, local-only |
| Endings | Nine verbs | Nine verbs **+ END GAME** (unlisted tenth door via Vigil) |
| Ending availability | v1/v2: verbs offered at Act VI | **Standing exits at every node** from Act I onward (§3); Act VI remains where the Bard formally asks |
| Tally manifest | v2: "twelve nodes" (enumerates eleven) + completions | **Canonical manifest in §3**: 11 decision nodes + V + Ω + completions |
| Ledger backend | v2: KV counters, DO as upgrade path | **Durable Object counter from day one** (§7; KV cannot hold counters at free tier) |
| Aggregate layer | v2: Ledger + in-game reveals | + **public Ledger Dashboard** (bounded exception to reveal-after-lock; OD-11) |
| Sharing | v2: share glyph | + **Soul Analysis** compare function (client-side; code contents per §7) |
| Rorschach delay caution | v1 §17.2: "avoid rewarding endless delay" | Scoped: still true *within* an engaged encounter; the Vigil rewards presence at the un-entered threshold and supersedes the caution there only |
| Interpretation "evidence" | v1 §12: quoted player words | Redefined for buttons-only: committed choices + stored variables (per MDD v2 §6 profile rules) |
| MDD v2 Open Decision 1 (length) | 12–18 min recommended | Resolved: 10–15 |
| MDD v2 Open Decision 2 (free text) | local-only flavor | Resolved harder: none at MVP |

Everything else in MDD v2 stands: the six acts and their tallied nodes, the
Beverage Cart's seven offerings, the Department of Ontological Claims cast, the
confirmation pattern (authored per bucket, buttons: CORRECT / COMPLICATE /
ACCEPT / REFUSE CLASSIFICATION), endings-as-verbs, deterministic sigil,
totenpass export/import, reincarnation-via-localStorage with the Special Browser
Behaviours table, cold-start honesty, degraded offline mode, boot disclosure.

## 7. Technical architecture (pinned, $0)

| Layer | Pinned choice |
|---|---|
| Client | Single static bundle, vanilla TypeScript (Preact only if state demands), one HTML entry, < 300 KB gz, boots from `file://` (census-degraded there by design) |
| Hosting | Cloudflare Pages free tier |
| Ledger API | One Cloudflare Worker fronting **one Durable Object counter (SQLite-backed, free plan)**: `POST /tally {node,choice}` → 204; `GET /tally?nodes=…` → counts JSON. DO gives atomic increments and no per-key write cap; **KV is explicitly rejected as the counter store** (free tier: 1k writes/day, no atomic increment, ~1 write/sec/key — loses counts exactly when the census gets traction). Hardcoded manifest validation (reject unknowns, §3 list); in-memory soft rate limit (hashed IP, hash never stored); day-bucket only; free-plan budget note: ~100k requests/day ≈ 7k full playthroughs/day — revisit if exceeded |
| CORS | Pinned into the Worker spec: `OPTIONS` preflight handler; `Access-Control-Allow-Origin` for the Pages origin and `null` (file:// / previews); no credentials. Without this, every tally silently fails cross-origin and the game runs permanently on the seed census — a censusless launch no unit test would catch (Gate 3 covers it with a real-browser integration test) |
| State machine | Hand-rolled deterministic FSM over content JSON (schema-validated in CI) |
| Vigil timing | Content-defined schedule (§4.3 constraint asserted by test); visibility-gated; testable with fake timers |
| Sigil | Canvas/SVG, deterministic (same state vector → identical output), PNG export |
| Share glyph | Emoji-per-act + verb string, copy-to-clipboard, plus a compact machine-readable code. **Code contents, exactly:** the committed choice at each §3 node the player locked (including V rungs and Ω), nothing else — no timestamps, no free ordering data beyond the fixed node list. Because that is more than the seven visible emoji, the copy action carries a one-line plain-language disclosure: *"this code contains your full path through the desk."* (Self-published path data — trade-off logged in OD-12/OD-3) |
| Soul Analysis | Static page, pure client-side glyph-code decode + authored comparison copy (incl. Ω case, §4.7) |
| Dashboard | Static page reading the same GET endpoint; 60s client cache; scope per §3 Layer C / OD-11 |
| Analytics | None beyond the Ledger and Cloudflare's request counts |

The game never blocks on the network; offline runs use the labeled seed census
(*"last census — the Ledger is unreachable"*).

## 8. Tone (Gaiman × Adams, operationalized)

- **Gaiman carries the myth and the ache**: thresholds, borrowed shapes, the
  warmth the light borrows, the mercy of being counted but not remembered.
- **Adams carries the bureaucracy and the physics jokes**: departments, forms,
  wait times outside causality, footnotes about entropy, dry sophistication —
  never randomness for its own sake.
- The three modes from MDD v1 §18 stand: incompetent bureaucracy, competent
  observation, unexpected gentleness. Prohibited tones stand (no preachy
  certainty, no flattening universalism, no clinical authority, no armor of
  constant irony, no mocking living traditions, no consequence-free profundity).
- **Ending parity (binding):** *every* ending verb receives one unguarded,
  sincere passage in its own register — RETURN's is warm, DISSOLVE's is vast,
  SPIRAL's is knowing, END GAME's is quiet. Sincerity is not END GAME's
  exclusive property; if a reader of the full script can rank the authors'
  favorite ending by reverence of prose, the copy fails review (§11).
- **Vigil-specific:** each rung speaks its lever's native voice (fear whispers,
  guilt itemizes, hope is warm — within §9.3's limits). The Bard is funniest
  early and most honest last.
- **The two lights:** the light of the hope rung wears borrowed warmth — a
  shape, a voice, a costume (that is what makes it a temptation). The light
  behind END GAME is faceless and quiet. The game never explains the
  difference; the difference *is* the discernment the traditions argue about
  (report §"Evaluating the White Light" — form and emotional pull vs.
  formlessness), rendered as copy, not doctrine.

## 9. Ethics of the Vigil (binding safety rules)

The Vigil deliberately deploys emotional manipulation. That is the art. It is
kept honest by:

1. **The content notice covers it — as an act, not a theme.** The boot notice
   covers death, grief, guilt, **memory**, and existential themes (MDD v1 §20.2
   list, complete), and states in plain language that the game will deliberately
   apply temptation and emotional pressure **to the player** — not merely depict
   it.
2. **Archetypal only, every run.** Manipulation copy references the fiction and
   the archetypal (a loved one, an unfinished thing) — never the player's real
   typed data (there is none at MVP), never fabricated claims about the player,
   and **never stored prior-run choices or remembered phrases**. A returning
   player's Vigil is as archetypal as their first (personalized manipulation
   from persistence data is prohibited; any future exception requires explicit
   CD approval per line, and each such line named in the disclosure's levers).
3. **Bereavement and suicidality rules (blocking for Phase 2).** The hope, loss,
   and guilt rungs and the END GAME passage must be authored and reviewed
   against suicidality-adjacent framing. The CD's relational-manipulation
   directive (§4.1) is reconciled with safety as follows, binding:
   - **The Bard may insinuate reunion; the game may never promise it.**
     Ancestors-in-the-light bait is authored as the Bard's own unverifiable
     claim — questions, conditionals, hearsay ("They would have so much to tell
     you — wouldn't they?"), the register of every medium who ever worked a
     grieving mark. It is never delivered as narrative fact.
   - **The light itself confirms nothing.** The END GAME passage stays faceless
     (§8 two-lights rule): no reunion scene, no ancestors on the other side, no
     contradiction of them either.
   - **The disclosure retracts the bait by name.** Any reunion insinuation used
     is explicitly named and disavowed in the disclosure ("I told you someone
     was waiting. I have no way to know that. It usually works."). The
     retraction is where the lever becomes teachable.
   - The game never frames death or "the light" as relief from the pain of
     living; grief copy invites remembering, never joining.
   Crisis signposting is visible or one interaction away **during the Vigil
   itself** (persistent footer element) and is present in or linked from the
   END GAME disclosure — asserted by Gate 2. Advisory review (MDD v1 §19.2/§26)
   explicitly covers Vigil copy before Phase 2 ships.
4. **Full disclosure at the end** (§4.5): every lever named, on every path. The
   game manipulates and then shows its hand — the showing is the point.
5. **Leaving is never punished.** Closing the tab is a gentle exit, in-fiction an
   unrecorded incarnation; the game never guilt-trips a returning player about
   having left. (The Bard may guilt-trip about *staying silent* — inside the
   Vigil, as an authored rung, once.)
6. **No manipulation escapes the game.** No notifications, no retention hooks, no
   emails, no streak mechanics, no dark patterns that outlive the tab.
7. **Cultural integrity.** Content labels (TRADITION / INTERPRETATION /
   HYPOTHESIS / FICTION) stand everywhere, including every Vigil rung that
   borrows a real tradition's voice — and the codex carries a TRADITION entry
   acknowledging the Vigil mechanic's own Bardo Thodol lineage (projections,
   presence, the Clear Light), placed post-disclosure to protect OD-6 spoiler
   economics. The Vigil is in scope for tradition-specific sensitivity review.
8. Symbolic mode stands for the Life Review. Crisis signposting stands in footer
   + codex game-wide, without attempting counseling.

## 10. Build plan (phase-gated; gates are scripts)

Externalize state between phases in `PROGRESS.md` + one git commit per gate.

- **PHASE 0 — SCAFFOLD.** Repo layout (`/src`, `/content`, `/worker`, `/tests`,
  `/docs`), content schema + validator, FSM skeleton, three seed encounters,
  Vitest + DOM playthrough driver (with fake-timer support for the Vigil).
  *Gate 0:* `npm test` green; schema validates seed content; boots to A1 from `file://`.
- **PHASE 1 — THE SPINE.** All six acts authored (button path), nine verbs
  reachable, **standing exits present at every node with progress-scaled ending
  passages (§3; OD-13 mapping decided here)**, posture-variant text,
  interpretation buckets + confirmation pattern, 12–18 profile titles +
  reflections.
  *Gate 1:* six scripted archetype playthroughs reach six distinct verbs; graph
  audit (all nodes reachable, no dead ends, fallback copy everywhere; **both
  standing exits available at every encounter**); standing-exit runs from the
  first node and from mid-game each produce a valid ending passage, profile,
  and tally; no choice strictly dominant.
- **PHASE 2 — THE VIGIL.** The ladder: authored beats + rungs, content-defined
  schedule, visibility gating, END GAME passage + disclosure (all §4.5 variants),
  Ω/V events emitted to the (stub) tally client. Vigil copy passes §9.3 review.
  *Gate 2:* fake-timer test walks the full ladder to END GAME and asserts the
  §4.3 schedule-total constraint (7–10 min); any rung click emits `V:<rung>`,
  sets its posture flag, plays its acknowledgment, and routes to normal A1 play;
  hidden-tab time provably does not advance the ladder; options accrete and
  never expire; a11y — new rungs announced via `aria-live`, zero required
  reaction time; crisis-signposting element present and reachable throughout the
  Vigil and in the END GAME disclosure (§9.3).
- **PHASE 3 — THE LEDGER.** Worker + Durable Object counter, CORS per §7, tally
  client (queue + retry), reveal-after-lock UI, cold-start copy, offline seed
  census, totenpass, Ledger Dashboard page (OD-11 scope).
  *Gate 3:* DOM test — no aggregate renders in-game before its node locks,
  including the conformity rung (numbers only after `V:conformity` locks, and
  only non-node aggregates per §4.4); worker unit tests (unknown node/choice
  rejected per §3 manifest, counts increment atomically, GET shape); **real-
  browser integration test (Playwright + local wrangler/miniflare): cross-origin
  `POST /tally` returns 204 and the count increments — the censusless-launch
  guard**; END GAME increments both `Ω` and `completions`; network-kill
  playthrough completes offline with labeled census; totenpass round-trips
  exactly; dashboard renders its OD-11-scoped figures from a mock endpoint.
- **PHASE 4 — THE BODY.** Sigil renderer (+ near-blank Vigil sigil), share glyph
  + compact code + copy-time disclosure line, Soul Analysis page, Rorschach
  reactivity (v1 §17.2 as scoped in §6), typography/motion, accessibility pass.
  *Gate 4:* sigil determinism test; glyph-code round-trip (encode → decode →
  identical choice vector); Soul Analysis produces authored comparison for two
  played glyphs **and** for played-vs-Ω (§4.7); keyboard-only full run incl.
  Vigil; `prefers-reduced-motion` honored; Lighthouse a11y ≥ 95; < 300 KB gz.
- **PHASE 5 — THE BREATH.** Reincarnation variants, post-END-GAME return
  greeting, second-run remembered-phrase surfacing (outside the Vigil, per
  §9.2), **"forget this life" local-data delete control**, codex (sources +
  labels + Vigil lineage entry + data statement), optional muted-by-default
  audio.
  *Gate 5:* second-run diff ≥ 5 changed lines; audio never autoplays; codex
  reachable from boot and profile; "forget this life" clears storage and next
  boot is a first incarnation (asserted); **ship checklist:** every MDD v1
  Appendix B item mapped to either a named passing script or a named human
  sign-off recorded in PROGRESS.md ("evidence" items use the §6 buttons-only
  redefinition) — no unmapped items, no vibes.

## 11. Success looks like

- A first-time player finishes in 10–15 minutes and shares a glyph unprompted.
- A returning player waits — just to see — and discovers the game already knew
  they might.
- Nobody can tell from the code, the copy, or the Ledger which ending the
  authors love most. (We know. The game never says — §8 ending parity is the
  enforcement.)
- Someone writes "this game made me close the tab and sit still for a minute"
  and means it as praise.
- $0/month. No souls identified. Award juries notice the blank glyph.

## 12. Open decisions (living log)

| ID | Question | Status |
|---|---|---|
| OD-1 | Session length | **Resolved 2026-07-13:** 10–15 min |
| OD-2 | Free text at MVP | **Resolved 2026-07-13:** none; buttons only |
| OD-3 | Anonymous path-strings for cross-node science | Open — off at launch server-side (MDD v2 stance). Note: shared glyph codes are player-self-published path vectors (§7, OD-12) — scraping them could reconstruct path data; accepted only because publishing is a deliberate player act with disclosure |
| OD-4 | Synergon Dynamics lineage/credit | Open — flag before Phase 1 |
| OD-5 | Does the public dashboard show the Ω row from day one? | **Resolved by CD 2026-07-13:** yes — an unexplained bare number, never acknowledged as a path anywhere in-game (§3 Layer C) |
| OD-6 | Spoiler economics: how loud may the disclosure and the blank glyph hint at the Vigil? | Open — proposed: glyph stays cryptic; disclosure uses one deniable sentence; codex lineage entry sits post-disclosure |
| OD-7 | Post-END-GAME: does the game reopen for that browser? | **Resolved by CD 2026-07-13:** reopens, played as a repeatable "exception caught" with escalating-rarity variants (§4.2) |
| OD-8 | Vigil ladder length/pace vs. mobile patience (7–10 min of stillness on a phone) | Open — playtest target |
| OD-9 | Rung-click routing | **Resolved 2026-07-13 (v1.1):** tally `V:<rung>` + posture flag + one authored acknowledgment line, then fold into normal A1 play (§4.1) |
| OD-10 | **Conformity rung** (`[WHAT DID EVERYONE ELSE DO?]`) — builder addition | **Ratified by CD 2026-07-13** ("with radical vigor"); social pressure elevated to a named instrument of the piece (§3 Layer C) |
| OD-11 | Dashboard vs. reveal-after-lock: how much census may a prospective player see pre-play? | **Resolved by CD 2026-07-13:** headlines only ("souls served" + the unexplained Ω row); per-node splits after a completed run; time-series trends deferred |
| OD-12 | Share-glyph compact code carries the full committed-choice vector (more than the visible emoji), with a copy-time disclosure line | Open — proposed as specced in §7; CD may prefer code = visible emoji only (weakens Soul Analysis to act-level comparison) |
| OD-13 | Standing-exit tally mapping | **Resolved 2026-07-13 (Phase 1):** shared choices — exits tally F1 as `return` / `light` (`light` is the tenth F1 choice); no early/late distinction server-side. Passages scale early/mid/late client-side by act |

## 13. Session log (append-only)

- **2026-07-13 — Session 1.** Repo initialized. Sources ingested (MDD v1 docx,
  MDD v2 md, philosophical report PDF) and preserved under `docs/reference/`.
  Compass v1.0 authored: title → THE BARDO BARD; 10–15 min; buttons-only MVP;
  Soul Analysis + Ledger Dashboard added as Layer C; **THE VIGIL specced as the
  heart of the piece** (§4) with ethics rules (§9) and build plan integration.
  Resolved OD-1, OD-2. Opened OD-5 through OD-9.
- **2026-07-13 — Session 1 (cont.), Compass v1.1.** Five-lens adversarial review
  (35 findings) applied: Ledger backend repinned KV → Durable Object counter
  ($0 blocker); CORS + censusless-launch guard pinned; canonical 14-key tally
  manifest stated (incl. new `V` rung node; OD-9 resolved); conformity rung
  demoted to proposal (OD-10) and respecced to post-lock, non-node aggregates
  only — no pace stats; dashboard scoped as bounded reveal-after-lock exception
  (OD-11); glyph compact-code contents + disclosure specced (OD-12); safety
  rules hardened — bereavement/suicidality authoring rules, crisis signposting
  in-Vigil, archetypal-only across runs, notice covers manipulation as an act
  and restores "memory"; **shadow of presence** added (§4.6) closing the
  secretly-correct-answer hole; ending-parity tone rule (§8); two-lights
  reconciliation (§8); disclosure names levers on every path (§4.5); Bardo
  Thodol lineage → codex TRADITION entry + sensitivity-review scope; gates
  repaired (schedule-total test, Ω tally moved to Gate 3, dashboard criteria,
  Ω-glyph compare, "forget this life" control, ship checklist made mappable).
  No code yet; Phase 0 not started.
- **2026-07-13 — Session 1 (cont.), Compass v1.2 — CD decisions.** Craigory
  ratified the conformity rung "with radical vigor" (OD-10) and elevated social
  pressure to a named instrument (post-lock reveal copy may editorialize true
  numbers; "do you follow or lead?"). Dashboard resolved (OD-11): headlines +
  unexplained Ω row public; per-node splits after a completed run (OD-5 also
  resolved — the waiting exit is only ever a number; Haunted Mansion
  principle). Post-END-GAME resolved (OD-7): reopens as a repeatable "exception
  caught" with escalating-rarity variants. **Relational manipulation directive**
  (§4.1): love/guilt/self-sacrifice is the deepest agency-loss vector — lean in;
  reconciled with safety in §9.3 (Bard may insinuate reunion, never promise;
  light confirms nothing; disclosure retracts bait by name). **Standing exits
  added** (§3): return-to-Earth and into-the-light available at every node from
  Act I; early exits fully honored with scaled endings; distinct from the
  Vigil's END GAME. Opened OD-13 (exit tally mapping). Phase 0 fully unblocked.
- **2026-07-13 — Session 1 (cont.), Phase 1 complete (Gate 1 green).** The
  spine authored end to end: all six acts as button-first encounters (consent →
  light → cart + keeping question → Department + password subplot with Dead
  Letter Office → symbolic life review → verdict → per-bucket interpretation
  with the CORRECT/COMPLICATE/ACCEPT/REFUSE confirmation pattern → the Bard's
  confession + Mirror beat → disclosure with per-posture lever receipts → nine
  verb endings, each with its own sincere register per §8 parity). Six
  progress-scaled standing-exit passages. Soul records: 13 authored titles
  (12–18 gate) with reflections built strictly from committed choices via a
  clause system, one shadow and one carried-forward question each. OD-13
  resolved (shared `return`/`light` F1 choices). Gate 1 asserts: six archetype
  playthroughs → six distinct verbs; graph audit (reachability, no dead ends,
  fallback + a11y everywhere, posture variants on all Act I–III nodes, both
  doors at every encounter, exit runs valid from first node and mid-game);
  mechanical dominance floor (no two choices at a node interchangeable).
  **CD directive recorded: mobile layout verification (375px + 320px) at every
  phase** — added to the verify skill; first run caught the fixed doors bar
  covering choice buttons on long screens → replaced with a sticky in-flow bar,
  re-verified green at all three widths. Bundle: 18.4 KB gz of 300 KB.
- **2026-07-13 — Session 1 (cont.), Phase 2 complete (Gate 2 green).** THE
  VIGIL lives. Ladder authored (`content/vigil/ladder.json`): nine rungs in
  the CD's escalation order + END GAME, each with beat, label, acknowledgment,
  and posture flags; §9.3 held throughout — hope insinuates and never promises
  ("Someone could be there… Wouldn't they?"), the END GAME light is faceless,
  the disclosure names every lever and retracts the reunion bait ("I have no
  way to know. It usually works."), grief invites goodbyes never joining, the
  §4.6 shadow-of-presence hands the player the last word. Conformity rung:
  digit-free before its lock (validator-enforced); post-lock quotes only
  labeled census truth via the seed-census stub. Engine: `vigilFold` /
  `vigilEndGame` (pure), VigilClock wired to `visibilitychange` (one dry line
  per §4.3), tally stub emits the exact {node,choice} events the Phase 3
  Worker will receive, Ω soul record "The Unprocessed" (14 titles now).
  Crisis signposting: site-wide quiet footer → findahelpline.com, asserted by
  Gate 2. Real-Chromium verification via page.clock at 3 widths caught a
  body-height flex bug (sticky doors bar trapped mid-page on long screens) —
  fixed, audits strengthened. **Awaiting CD §9.3 sign-off on Vigil copy.**
  Bundle 23.3 KB gz. Next: Phase 3, the Ledger.
- **2026-07-13 — Session 1 (cont.), Phase 3 complete (Gate 3 green).** The
  census counts. Worker: portable Ledger handler (`worker/ledger.mjs` —
  manifest validation, bare-tallies enforcement, CORS incl. Origin null, soft
  hashed-IP rate limit) wrapped by the Cloudflare entry (`index.mjs`, one
  SQLite Durable Object, wrangler.toml ready to deploy) and by a Node adapter
  used for the Gate 3 real-browser integration (same handler byte-for-byte;
  workerd smoke happens at first deploy — recorded deviation from the
  wrangler/miniflare wording in §10). Manifest generated from content
  (`scripts/gen-manifest.mjs`, 14 keys) so game and Worker cannot drift.
  Client: fire-and-forget tally queue (one retry, never blocks), census cache
  with labeled seed fallback, reveal-after-lock blocks (young-Ledger copy
  under 500 tallies; percentages above), VI.c full-ledger recap on played
  endings, totenpass export/import (system chrome, not narrative input — the
  buttons-only invariant governs answers, not save tokens), completions
  emitted once per true ending, `bardo_completed` local flag for dashboard
  unlock. Dashboard ships per OD-11: public headlines + the unexplained
  DEPARTED WITHOUT FILING row; splits unlock after a completed run. Artistic
  calls logged: V and Ω emit no in-game reveal blocks (the Vigil manipulates
  quietly; the walk stays unnarrated); the Ω ending carries no census recap
  or export chrome — the near-blank record only. Bundle 28.4 KB gz.
  Next: Phase 4, the body (sigil, glyph, Soul Analysis, Rorschach, a11y).
- **2026-07-14 — Session 1 (cont.), Phase 4 complete (Gate 4 green).** The
  body. **CD directive integrated: the Rorschach is a character** — emotion,
  shape, rhythm, reaction, pacing. Deterministic living blot (`rorschach.ts`:
  frame(params, tick) is pure; life = advancing ticks, never randomness):
  eleven moods (calm/fear/curious/angular/soft/bare/spiral/dispersal/asym/
  point/ember), authored per node via the new schema `visual` field; posture-
  driven otherwise (the player's weather, never a verdict). Gesture system —
  bloom/contract/jitter/**still** (the deliberate non-response; authored at
  the confession: the Bard does not react to your answer to WHOM DO I SERVE).
  The Vigil thins the face rung by rung to **a single pulsing pixel** (the
  CD's directive; v1 §17.2's silence row); the closed desk keeps a living
  ember — the ASCII never freezes, except under prefers-reduced-motion, where
  it holds one still frame by design. **The unspoken performance is a named
  lever**: reactions encode the Bard's own stakes (never rank player answers
  — pillar guard), and every f0 disclosure variant now confesses it: "(The
  ink was also me. It was making faces the entire time.)" Sigil shipped
  (deterministic SVG per v1 §16 subset: sides←authority, open perimeter←
  uncertainty, center glyph←memory, fractures←corrections/refusals,
  chirality←loop/spiral, one particle=the carried question; Ω = one dot in
  negative space). Share glyph shipped (emoji grammar + BG1 code carrying
  exactly the committed tallied choices, OD-12 disclosure at copy). Soul
  Analysis shipped (client-side compare incl. §4.7 Ω copy; solo readings;
  phrase book in content/glyph/, validator-enforced coverage). Gate 4
  verified in real Chromium: keyboard-only spine AND Vigil runs; reduced
  motion; axe zero serious/critical on all four surfaces (recorded
  substitution for §10's "Lighthouse ≥ 95" — axe-core is the sharper a11y
  instrument and runs deterministically in CI-like conditions; Lighthouse can
  be run at deploy); contrast fixes applied (dim grays raised to ≥4.5:1).
  Note: headless-container screenshots render emoji as fallback boxes (no
  emoji font in the sandbox) — real devices are unaffected. Bundle 38.5 KB gz
  (12.5%). Next: Phase 5, the breath.
- **2026-07-14 — Session 1 (cont.), Phase 5 complete (Gate 5 green) — ALL
  PHASES COMPLETE.** The breath. Reincarnation via localStorage (optional by
  design — blocked storage is an unrecorded incarnation, tested): finished
  lives record verb/choices/title/day-bucket; second incarnations are
  remembered on five surfaces (boot greeting, the light, the cart, the
  confession, the verb desk) via `content/reincarnation/reincarnation.json`
  templates over the phrase book. **§9.2 guard is structural AND
  validator-enforced**: no template may target a1_consent, so the Vigil stays
  archetypal every run (asserted in-browser: 5 minutes of second-run ladder,
  zero memory leakage). Post-Ω returns play the CD's caught-exception
  greetings, escalating over three variants (OD-7 shipped as written). FORGET
  THESE LIVES = two-step Lethe clearing lives + completion flag. Codex
  shipped (`codex.html`): labeled sources, the data statement, crisis line,
  and the Vigil's Bardo Thodol lineage entry gated behind a completed run
  (OD-6). Optional audio: two-sine drone, muted by default, constructed only
  inside the toggle click — autoplay is structurally impossible. Sigils gain
  incarnation rings (v1 §16). Ship checklist mapped item-by-item in
  PROGRESS.md — remaining human items: CD §9.3 sign-off, CD copy read,
  external sensitivity review, and the Cloudflare deploy. 110 tests; 44.5 KB
  gz (14.5% of budget). **The desk is feature-complete.**
