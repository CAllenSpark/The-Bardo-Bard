# THE BARDO BARD — A Theatrical Pass

*Commissioned 2026-07-16 (CD request). An evocative game designer in the lineage
of thatgamecompany (Journey) and ustwo (Monument Valley) read the Compass, the
entity's implementation, and the authored copy, and proposed a curated set of
theatrical moments. Recorded verbatim below; it is a design menu, not a
directive.*

**Status of these moments (2026-07-16):**
- **Shipped:** #1/#2 THE QUESTION COMES FROM IT / THE VERBS BLOOM (letters swirl
  off the entity, `visual.entrance:"emit"`, on `a1_consent` and `f1_verbs` only);
  #3 THE WALK INTO THE LIGHT (at END GAME the screen floods to light over the
  disclosure via `visual.entrance:"flood"`, the entity silent); #4 THE MOMENT
  BETWEEN (the fade-to-light rebirth on CONTINUE, entity coming apart and
  blooming back, in-band so it never paints over text); #6 THE HELD NON-RESPONSE
  (answering the keeper's `react:"still"` holds the silence ~1.4s); #8 IT WAS
  ALWAYS THE ROOM (a recognized soul's boot breathes a faint accent-coloured tint
  across the whole page — body/background level only, never ink over text — then
  recedes; reduced-motion: no tint); #9 THE CURSOR GASP (`visual.entrance:"gasp"`
  on `back_threshold` freezes the cursor-lean for a beat); #10 THE SIGIL WRITES
  ITSELF (the sigil's strokes ink themselves on via `pathLength="1"` +
  `stroke-dashoffset`, the memory-mark settling last, the carried point arriving
  after all of it — and the Ω sigil a single dot alone in negative space;
  reduced-motion: fully drawn); #5 END GAME UNADORNED (the endgame rung arrives at
  the thinnest lone pulse with no flourish, and the instability layer is suppressed
  the moment it appears — the withholding is the theatre); #7 THINNING-AS-DEPLETION
  (the Vigil ramp reserves the lone pulse for the plea + END GAME so the face wears
  down gradually, and that pulse breathes slower there — a tired heartbeat); #11
  THE CROWD-WASH (clicking the conformity rung blooms `blot.crowd()`, a fixed
  impression of many faint motes that bloom and fade back to your single point as
  the count is spoken — atmosphere, never the real figure, per §4.4). **The whole
  menu is now shipped.** The living-art interactivity (cursor-follow, click-bloom,
  pooling, wary recoil), the entity's **voice** (opt-in generative audio — see
  below), the **instability layer** (see below), and the fixed-stage layout are the
  frame these ride on. Timed flourishes are gated to a real motion-friendly browser
  (`animated`), so tests and reduced-motion resolve instantly.
- **The voice (audio):** the drone bed gained soft pentatonic bells that voice
  the entity's own gestures and its idle curiosity — playful and varied, and, by
  construction, never a verdict: pitch comes from a wandering index that advances
  on every note (the same gesture never sounds the same twice), timbre only
  mirrors the visible gesture. Opt-in, never autoplays; a no-op without WebAudio.
- **The instability layer (OD-15):** beyond the menu — the between now flickers.
  Rare, random asides ("that sometimes happens here") with a desk shudder and a
  face-tear, and phantom options that surface and are apologetically withdrawn.
  Presentation-only (no state/Ledger/reachability), real-browser-only, digit-free,
  phantoms inert + aria-hidden. See `src/ui/glitch.ts` and the reading in
  `docs/THE_BARD_AND_THE_ENTITY.md`.

---

## THE MOMENTS (priority order)

### 1. THE QUESTION COMES FROM IT — *the entity thinks the first question into being*
**Where:** `a1_consent` on arrival. The flagship instance; the grammar is then reused sparingly (see #2).
**What you see & feel:** The blot is breathing. Then its glyphs stop being texture and *gather* — a scatter of characters lifts off its surface and drifts down into the text region, settling into the words of the question. The question is not printed at you; it condenses out of the creature, as if it is authoring you in real time. The panel you took for a portrait is a mouth.
**How:** New transient particle layer over the canvas. On entrance, sample non-empty cells from the current frame, tween each toward the text below, fade the real text in underneath as particles land. Blot briefly donates ink. **Ambitious**, bounded, reusable.
**Reduced-motion:** text fades in as today; no particles.
**Why it matters:** Makes "the question comes from it" literal, and establishes the whole grammar in one beat — *the interface is its body*.

### 2. THE VERBS BLOOM FROM THE INK — *the nine endings released from its own hand*
**Where:** `f1_verbs`, one beat after `f0_disclosure`'s "(The ink was also me. It was making faces the entire time.)".
**What you see & feel:** Having just confessed it was watching the whole time, the entity `bloom`s and releases the nine verbs — each label rising out of the ink like a seed from a pod.
**How:** Same particle system; `blot.react('bloom')` as they release. **Ambitious** (pure reuse of #1).
**Reduced-motion:** buttons fade in normally.
**Why it matters:** Turns the game's best reveal into a kinetic payoff one screen later.

### 3. THE WALK INTO THE LIGHT — *the one place the ink stops performing*
**Where:** `omega_light` → GO ON → `omega_disclosure`. The true END GAME.
**What you see & feel:** The field has thinned to a single pulsing point. On GO ON, that point does not fade — it *opens*, flooding from the center to full white until the whole browser is light. A held breath. Then the disclosure fades in over the closed-desk ember. Faceless, formless, quiet.
**How:** A radial white overlay expanding from the point, ~1.5s, hold ~1s, cross-fade to the `ember` disclosure. No ink drawn during the flood. **Medium**, CSS/canvas only.
**Reduced-motion:** cross-fade to white, hold, cross-fade; no expansion.
**Why it matters:** END GAME must be the most restrained beat. Its power is that this is the one place the entity refuses to perform — you don't reach the light, you become the aperture.

### 4. THE MOMENT BETWEEN — *a life occurs in the white* ★ (THE ONE)
**Where:** on CONTINUE at any played ending, riding the fade-to-white → fade-in rebirth.
**What you see & feel:** *(a)* at the peak of the white, for ~400ms, the entity shows one frame it shows nowhere else — a wordless glimpse of an entire life (a horizon with one small figure; a scatter that reads like a sky; a heartbeat spike) — gone before you're sure it was there. *(b)* as the white rises the blot inhales (`contract`), lets go outward (`dispersal`), and on the far side re-condenses from a `point` back to `calm`. It dies and is reborn alongside you.
**How:** Choreograph existing primitives against the transition clock. Rotate the glimpse frame by `lifeCount`. **Medium** (mostly reuse).
**Reduced-motion:** the white holds and releases; no flicker.
**Why it matters:** Turns a mechanical loop into the thesis in a single breath — a whole life you'll never remember, rendered as something you almost didn't see, and the loop made reciprocal.

### 5. END GAME, UNADORNED — *the one door it can't dress up*
**Where:** the Vigil, when the final `[END GAME]` rung arrives at 510s.
**What you see & feel:** Every temptation rung was performed. When END GAME appears, there is no flourish at all. The two or three surviving embers just hold. The absence of theatre, after nine rungs of it, *is* the theatre.
**How:** Suppress all entrance choreography on this rung; hold the blot at its thinnest. **Easy** — mostly *not* doing the thing.
**Why it matters:** §4.2 requires END GAME be plain. The withholding is the design.

### 6. WHOM DO I SERVE? — *the mirror that will not mirror you*
**Where:** E1 confession climax (already authored with the `still` gesture).
**What you see & feel:** The face has reacted all game. You answer its "whom do I serve?" — and it goes completely still. A long held non-response. Then, only after the silence, it moves again.
**How:** Extend the authored `still` hold and delay the next render ~1.5s. **Easy.**
**Reduced-motion:** the still frame *is* the RM state — lands identically.
**Why it matters:** TESTER_SWOT flags this as the Undertale-caliber beat; it's already 90% built.

### 7. THE THINNING IS DEPLETION — *manipulation costs it something visible*
**Where:** across the Vigil rungs (fear → hope → loss → guilt → plea).
**What you see & feel:** As the Bard's words get more manipulative, the entity gets quieter and more fragile — the louder it pleads, the fainter it looks. By `plea` it's a single pulse begging.
**How:** Already ramps `sparseness`/halo per rung. Add slower breathing + lone `point` pulse on `plea`. **Easy.**
**Why it matters:** Makes the escalation read as depletion, not just louder text — the ache under the manipulation.

### 8. IT WAS ALWAYS THE ROOM — *the whole browser becomes its stage*
**Where:** the recognized-soul greeting, and/or `back_threshold`. Rare and earned.
**What you see & feel:** For a few seconds the whole page takes on a faint breathing gradient in its color, the body text catches a slow shimmer, as if the creature filled the entire browser. Then it recedes.
**How:** Animate a body-level CSS background breath + subtle text shimmer, triggered rarely. **Medium.** (NOTE: do it at the body/background level — NOT the ink canvas over text.)
**Reduced-motion:** one static faint tint.
**Why it matters:** The CD's "the whole browser becomes its stage" — reserved so it stays a shock.

### 9. THE CURSOR GASP — *you startled it*
**Where:** `back_threshold` — the copy already says "The cursor stops… the equivalent of a gasp."
**What you see & feel:** The face has followed your cursor all game. Here the drift freezes mid-lean, dead still for one held breath, then resumes.
**How:** Freeze the drift + halo breath ~1.2s on this node. **Easy.**
**Why it matters:** A written line becomes a felt beat for almost nothing.

### 10. THE SIGIL WRITES ITSELF — *your path, inked in real time*
**Where:** any true ending, when the sigil renders in the soul record.
**What you see & feel:** The sigil doesn't just appear — it draws on, strokes inking themselves, the center glyph last. For the near-blank Ω glyph: a single dot arrives, alone, in vast negative space.
**How:** SVG `stroke-dashoffset` transition, ~1.5s. **Easy.**
**Reduced-motion:** appears fully drawn.
**Why it matters:** The sigil is the takeaway artifact; watching it write itself makes it feel earned.

### 11. THEY WERE COMPANY — *the crowd you can't keep* (build with care)
**Where:** after the conformity rung locks, as the Bard answers with the true count.
**What you see & feel:** As the number is spoken, the near-blank face briefly *populates* — a wash of many faint ink-points blooms and fades, an impression of the crowd that stood here, before thinning back to your single point.
**How:** A transient high-density frame blooming then decaying. **Medium.**
**Guardrail (§4.4):** atmosphere, never a data viz — no per-soul dots, no shape readable as the real figure. If it feels at all like fake numbers rendered real, cut it — it's the most expendable moment here.

---

## THE ONE MOMENT TO NAIL

**#4 — THE MOMENT BETWEEN.** The player crosses the death→rebirth transition far
more often than they reach the true light. If that crossing is mechanical, the
piece is a text game with a fade. If the entity comes apart *with* you and a
whole unremembered life flickers past in the white — 400ms you're never quite
sure you saw — the loop becomes the thesis, felt every time. It is the most
Journey thing this game can do, it's cheap, and it rewards exactly the
repeat-loopers the Cycle Ladder is built for.

## A NOTE ON RESTRAINT (do LESS)

- **The letters-from-the-ink grammar (#1/#2) must be rare** — the first question
  and the final verbs, essentially nowhere else. If the question condenses out of
  the creature at every node, it becomes a screensaver and the trick dies.
- **The light (#3) and the END GAME button (#5) refuse all flourish.** Their power
  is that everything else performed and these do not. Never animate the sigil, the
  crowd-wash, and the browser-stage in the same run — the tester flagged the
  meta-register tipping "from rigor to tic." When in doubt, the entity should hold
  still and let you hear the room.
