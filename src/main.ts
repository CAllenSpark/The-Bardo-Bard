import { buildGraph } from './engine/content';
import { advance, createState, getNode, takeExit, vigilEndGame, vigilFold } from './engine/fsm';
import type { GameState, StandingExitId } from './engine/types';
import { VigilClock } from './engine/vigil';
import { configureCensus, fillCensus, getNodeCensus, refreshCensus } from './engine/census';
import { configureTally, queueTally, recordTally } from './engine/tally';
import { buildFullLedger, buildReveal } from './engine/reveal';
import { exportTotenpass, importTotenpass } from './engine/totenpass';
import { buildSigil } from './engine/sigil';
import { GLYPH_DISCLOSURE, buildGlyphText, phrase } from './engine/glyph';
import { computeProfile } from './engine/profile';
import { choiceHistory, forgetLives, getIntake, isRecognized, lastLife, lifeCount, longAbsence, noteOmegaReturn, raiseRecognition, recordLife } from './engine/memory';
import type { Life } from './engine/memory';
import { personalize } from './engine/intake';
import type { Survey } from './engine/intake';
import { mountSurvey } from './ui/survey';
import surveyFile from '../content/survey/survey.json';
import type { Gesture, Mood } from './engine/rorschach';
import { hoverGesture } from './engine/rorschach';
import { Blot } from './ui/blot';
import { appendVigilBeat, appendVigilOption, ensureCrisisFooter, render } from './ui/render';
import type { RenderOptions } from './ui/render';
import { mountAudioToggle, voice } from './ui/audio';
import { Glitch } from './ui/glitch';
import type { GlitchContent } from './ui/glitch';
import instabilityFile from '../content/instability/instability.json';
import reincarnationFile from '../content/reincarnation/reincarnation.json';
import ladderFile from '../content/vigil/ladder.json';
import scheduleFile from '../content/vigil/schedule.json';
import confirmationFile from '../content/confirmation/confirmation.json';
import manifestFile from '../worker/manifest.json';

interface RungDef {
  id: string;
  beat: string;
  label: string;
  ack?: string;
  state?: Record<string, number>;
}

interface Ladder {
  rungs: RungDef[];
  endgame: RungDef;
  softRetractions?: Array<{ id: string; afterMs: number; beat: string }>;
  hiddenTabLine: string;
}

const LADDER = ladderFile as unknown as Ladder;
const REINCARNATION = reincarnationFile as unknown as {
  greeting_return: string;
  greeting_returns_deeper: string[];
  greeting_recognized: string;
  greeting_long_absence: string;
  greeting_omega: string[];
  nudge_a2: string;
  node_lines: Record<string, string>;
};

/** Reincarnation depths that open the Cycle Ladder's gated doors (§15).
 *  REFLECT: the Bard sets down the clipboard (OFF THE FORM). SEAMS: the curious
 *  can start probing the encounters themselves. Recognition (the changed game
 *  master) is reached by seeing the Bard OR by investing to 5 lives — see
 *  memory.isRecognized(). */
const REFLECT_UNLOCK_LIVES = 3;
const SEAM_UNLOCK_LIVES = 4;

/** Fill {A2}/{B1}/{E1}/{F1} from a prior life's phrase book; null if a slot is unfillable. */
function fillMemory(template: string, prior: Life): string | null {
  let missing = false;
  const filled = template.replace(/\{(A2|B1|E1|F1)\}/g, (_, key: string) => {
    const choice = prior.choices[key];
    if (!choice) {
      missing = true;
      return '';
    }
    return phrase(key, choice);
  });
  return missing ? null : filled;
}
const SURVEY = surveyFile as unknown as Survey;
const INSTABILITY = instabilityFile as unknown as GlitchContent;
const SCHEDULE = scheduleFile as unknown as { rungs: { id: string; afterMs: number }[] };
const CONFIRMATION_ACKS = (confirmationFile as unknown as { acks: Record<string, string> }).acks;
const MANIFEST_KEYS = Object.keys(manifestFile as Record<string, string[]>);

const IMPORT_ERROR_LINE =
  'This tablet is from another underworld. The desk returns it, apologetically.';

/** The face reflects the player's weather — their posture, never a verdict. */
function moodFor(graph: ReturnType<typeof buildGraph>, state: GameState): Mood {
  const authored = getNode(graph, state.node).visual?.mood as Mood | undefined;
  if (authored) return authored;
  const postures: Array<[Mood, number]> = [
    ['fear', state.flags['fear'] ?? 0],
    ['curious', state.flags['curiosity'] ?? 0],
    ['angular', state.flags['defiance'] ?? 0],
    ['soft', state.flags['reverence'] ?? 0],
  ];
  postures.sort((a, b) => b[1] - a[1]);
  return postures[0]![1] > 1 ? postures[0]![0] : 'calm';
}

/** The reaction reflects the Bard's own stakes, never a ranking of answers. */
function gestureFor(effects: Record<string, number> | undefined): Gesture {
  if (!effects) return 'none';
  if ((effects['compassion'] ?? 0) > 0 || (effects['warmth'] ?? 0) > 0 || (effects['liberation'] ?? 0) > 0) return 'bloom';
  if ((effects['termination'] ?? 0) > 0 || (effects['refusal'] ?? 0) > 0) return 'contract';
  if ((effects['fear'] ?? 0) > 0) return 'jitter';
  if ((effects['curiosity'] ?? 0) > 0 || (effects['mystery'] ?? 0) > 0) return 'bloom';
  return 'none';
}

export function mount(root: HTMLElement): void {
  const graph = buildGraph();
  let state: GameState = createState(graph);
  let tallied = 0;
  let completionsSent = false;
  let lastEntranceNode = ''; // the last node whose entrance flourish has played
  let intakeTakenThisLoop = false; // the intake is offered once per life, then not until the next
  let transitioning = false; // true while a held non-response plays out (blocks input)

  // ── Reincarnation (Phase 5): the desk remembers, locally and optionally.
  let prior = lastLife();
  let bootGreeting: string | undefined;
  const rememberBoot = (): void => {
    bootGreeting = undefined;
    if (!prior) return;
    if (prior.verb === 'omega') {
      // The repeatable caught exception (OD-7, CD copy).
      const returns = noteOmegaReturn();
      bootGreeting = REINCARNATION.greeting_omega[Math.min(returns, REINCARNATION.greeting_omega.length) - 1];
    } else if (isRecognized()) {
      // The game master changed (§15): once the Bard has been seen as a fellow
      // prisoner, it drops the clerk's mask on every later boot. Supersedes the
      // deeper-return framings — the relationship, not just the tally, moved.
      bootGreeting = fillMemory(REINCARNATION.greeting_recognized, prior) ?? undefined;
    } else {
      // Intro variety across loops (Cycle Ladder §15): the first return uses
      // greeting_return; each deeper visit varies the framing so looping never
      // goes stale and the desk grows one seam more candid. lives === prior
      // count: 1 = 2nd visit, 2 = 3rd (deeper[0]), 3 = 4th (deeper[1]), … .
      const lives = lifeCount();
      const deeper = REINCARNATION.greeting_returns_deeper;
      const template =
        lives <= 1 ? REINCARNATION.greeting_return : deeper[Math.min(lives - 2, deeper.length - 1)]!;
      bootGreeting = fillMemory(template, prior) ?? undefined;
    }
    if (bootGreeting && longAbsence()) bootGreeting += `\n\n${REINCARNATION.greeting_long_absence}`;
  };
  rememberBoot();

  /** §9.2 GUARD: no template exists for a1_consent, so the Vigil's screen can
   *  never carry a remembered line — a returning soul's Vigil stays archetypal. */
  const memoryFor = (nodeId: string): string | undefined => {
    if (!prior) return undefined;
    if (nodeId === 'boot_notice') return bootGreeting;
    const template = REINCARNATION.node_lines[nodeId];
    if (!template) return undefined;
    return fillMemory(template, prior) ?? undefined;
  };

  /** The curiosity 'thumb on the scale' (Cycle Ladder §15): when a soul has
   *  repeated the SAME first-encounter choice across every past life, the Bard
   *  names a door it has never opened — curiosity, never a verdict, never at
   *  a1 (§9.2). Deterministic: the first untaken door in authored order. */
  const nudgeFor = (nodeId: string): string | undefined => {
    if (nodeId !== 'a2_light') return undefined; // exemplar; extends to b1/e1/f1
    const history = choiceHistory('A2');
    if (history.length < 2 || new Set(history).size !== 1) return undefined; // needs a real rut
    const always = history[0]!;
    const untaken = (getNode(graph, 'a2_light').choices ?? []).find(
      (c) => c.id !== always && !c.gated,
    );
    if (!untaken) return undefined;
    return REINCARNATION.nudge_a2
      .replace('{A2_ALWAYS}', phrase('A2', always))
      .replace('{A2_UNTAKEN}', untaken.label);
  };

  /** The gated doors this soul is deep enough to see (§15 Cycle Ladder): the
   *  OFF THE FORM word at 3 cycles; the encounter seams at 4; and — once the
   *  Bard has been recognized as a fellow prisoner — its own question. */
  const unlockedGated = (): Set<string> | undefined => {
    const lives = lifeCount();
    const ids: string[] = [];
    if (lives >= REFLECT_UNLOCK_LIVES) ids.push('reflect');
    if (lives >= SEAM_UNLOCK_LIVES) ids.push('ask_light', 'serve_turnabout');
    // Recognition is the key to the back office: once the Bard relates to you
    // as a peer, it will show you the works (a structurally different route).
    if (isRecognized()) ids.push('want_bard', 'see_behind');
    return ids.length ? new Set(ids) : undefined;
  };

  // The Ledger endpoint; empty string = offline by design (seed census).
  const ledgerUrl = (globalThis as { BARDO_LEDGER_URL?: string }).BARDO_LEDGER_URL ?? '';
  configureTally({ url: ledgerUrl });
  configureCensus({ url: ledgerUrl });
  void refreshCensus(MANIFEST_KEYS);

  // The Bard's face lives above the stage and survives re-renders. The stage
  // scrolls within its own box (CD 2026-07-16) so the entity is never scrolled
  // out of view; glowing cues appear when there is more text above or below.
  root.textContent = '';
  const blot = new Blot(root);
  const scrollRegion = document.createElement('div');
  scrollRegion.className = 'scroll-region';
  const stage = document.createElement('div');
  stage.id = 'stage';
  scrollRegion.appendChild(stage);
  const cueUp = document.createElement('div');
  cueUp.className = 'scroll-cue up';
  cueUp.setAttribute('aria-hidden', 'true');
  cueUp.textContent = '▴';
  const cueDown = document.createElement('div');
  cueDown.className = 'scroll-cue down';
  cueDown.setAttribute('aria-hidden', 'true');
  cueDown.textContent = '▾';
  cueUp.addEventListener('click', () => stage.scrollBy({ top: -stage.clientHeight * 0.8, behavior: 'smooth' }));
  cueDown.addEventListener('click', () => stage.scrollBy({ top: stage.clientHeight * 0.8, behavior: 'smooth' }));
  scrollRegion.append(cueUp, cueDown);
  root.appendChild(scrollRegion);

  const updateCues = (): void => {
    const max = stage.scrollHeight - stage.clientHeight;
    scrollRegion.classList.toggle('can-up', stage.scrollTop > 4);
    scrollRegion.classList.toggle('can-down', stage.scrollTop < max - 4);
  };
  stage.addEventListener('scroll', updateCues, { passive: true });
  if (typeof window !== 'undefined') window.addEventListener('resize', updateCues);

  // Timed screen flourishes (rebirth, light-flood, the held non-response) run
  // only in a real, motion-friendly browser — never under reduced motion and
  // never in the no-canvas test env, where they resolve instantly and keep the
  // synchronous playthroughs deterministic (CD 2026-07-16).
  const reduced =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animated =
    !reduced &&
    typeof requestAnimationFrame === 'function' &&
    (typeof navigator === 'undefined' || !/jsdom/i.test(navigator.userAgent));
  const rebirthEl = document.createElement('div');
  rebirthEl.className = 'rebirth';
  rebirthEl.setAttribute('aria-hidden', 'true');
  if (typeof document !== 'undefined') document.body.appendChild(rebirthEl);
  const rebirth = (atPeak: () => void): void => {
    if (!animated) {
      atPeak();
      return;
    }
    // The entity comes apart with you as the screen goes to light, and the new
    // life blooms open on the far side (the designer's "moment between"). The
    // drama stays in the entity's band so it never paints over the desk's text.
    blot.react('contract');
    rebirthEl.classList.add('rising'); // fade to light
    window.setTimeout(() => {
      atPeak(); // a life turns over behind the light
      blot.react('bloom'); // and the next one opens
      window.setTimeout(() => rebirthEl.classList.remove('rising'), 250); // fade back in
    }, 900);
  };
  // The walk into the light (the designer's #3): at END GAME the screen floods
  // to white over the already-rendered disclosure, holds a breath, and clears —
  // you don't reach the light, you become the aperture. Reduced-motion: no flood.
  const flood = (): void => {
    if (!animated) return;
    rebirthEl.classList.add('rising');
    window.setTimeout(() => rebirthEl.classList.remove('rising'), 1100);
  };
  // IT WAS ALWAYS THE ROOM (the designer's #8): once, for a soul the Bard has
  // recognized, the whole page breathes in the entity's colour for a few seconds
  // then recedes. Rare and earned; body-level tint only, never ink over text.
  const roomBreath = (): void => {
    if (!animated || typeof document === 'undefined') return;
    document.body.classList.add('stage-breath');
    window.setTimeout(() => document.body.classList.remove('stage-breath'), 6500);
  };

  // Hover attention (CD directive 2026-07-14): when a pointer rests on any
  // button the face draws down with anticipation — or dances, if the hash of
  // the two ids says so. Deterministic, arbitrary, and never a verdict: the
  // reaction consults the ids alone, never the choice's content or effects.
  // Hover-capable pointers only; touch never triggers it.
  if (typeof matchMedia !== 'undefined' && matchMedia('(hover: hover)').matches) {
    const buttonOf = (target: EventTarget | null): HTMLButtonElement | null =>
      target instanceof Element ? target.closest('button') : null;
    root.addEventListener('pointerover', (e) => {
      const button = buttonOf(e.target);
      if (!button) return;
      const id =
        button.dataset.choiceId ?? button.dataset.rungId ?? button.dataset.exitId ??
        button.dataset.systemId ?? button.textContent ?? '';
      blot.hold(hoverGesture(state.node, id));
    });
    root.addEventListener('pointerout', (e) => {
      const button = buttonOf(e.target);
      if (!button) return;
      const to = e.relatedTarget;
      if (to instanceof Node && button.contains(to)) return;
      blot.release();
    });
  }

  // ── The Vigil (Compass §4): grows only in visible stillness at the first
  //    question, once per run; any click ends it for good.
  let clock: VigilClock | null = null;
  let retractClock: VigilClock | null = null; // soft relational retractions (P0-6)
  let vigilSpent = false;
  let hiddenLineShown = false;
  let vigilSparseness = 0; // each rung thins the face; the plea leaves a pulse

  const flushTallies = (): void => {
    const fresh = state.committed.slice(tallied);
    tallied = state.committed.length;
    for (const entry of fresh) {
      recordTally(entry);
      if (entry.tally) void refreshCensus([entry.tally]);
    }
  };

  const latestReveal = (): RenderOptions['reveal'] => {
    const last = state.committed.at(-1);
    return last ? buildReveal(graph, last) : null;
  };

  const onEnded = (): void => {
    if (state.ended && getNode(graph, state.node).act >= 1 && !completionsSent) {
      completionsSent = true;
      queueTally('completions', 'done');
      recordLife(state, computeProfile(state)?.title ?? 'unfiled');
      try {
        localStorage.setItem('bardo_completed', '1');
      } catch {
        /* an unrecorded incarnation — by design */
      }
    }
  };

  const stopVigil = (): void => {
    clock?.stop();
    retractClock?.stop();
    clock = null;
    retractClock = null;
    vigilSpent = true;
    vigilSparseness = 0;
  };

  const rungById = (id: string): RungDef =>
    id === 'endgame' ? LADDER.endgame : LADDER.rungs.find((r) => r.id === id) ?? LADDER.endgame;

  const reactToChoice = (effects: Record<string, number> | undefined): void => {
    const authored = getNode(graph, state.node).visual?.react as Gesture | undefined;
    const gesture = authored ?? gestureFor(effects);
    blot.react(gesture);
    // The voice follows the visible reaction — never the choice's meaning, and
    // never the held silence (which stays silent). Pitch wanders, so it ranks
    // nothing (see audio.ts).
    if (gesture !== 'still' && gesture !== 'none') voice.note(gesture);
  };

  const handlers = {
    onChoice: (choiceId: string) => {
      if (transitioning) return; // a held non-response is playing out
      const leaving = getNode(graph, state.node);
      const choice = leaving.choices?.find((c) => c.id === choiceId);
      reactToChoice(choice?.state);
      // Turning the keeper's question back on it is the recognition moment
      // (§15): the Bard is seen as a fellow prisoner, and the game master is
      // changed for every later run. Persistent; Lethe wipes it.
      if (choiceId === 'serve_turnabout') raiseRecognition();
      // The confirmation pattern pays off: 'the record, working' shown working.
      const ackLine = leaving.tally === 'D3' ? CONFIRMATION_ACKS[choiceId] : undefined;
      if (clock) stopVigil();
      const proceed = (): void => {
        transitioning = false;
        state = advance(graph, state, choiceId);
        flushTallies();
        onEnded();
        rerender({ reveal: latestReveal(), ackLine });
      };
      // The held non-response (the designer's #6): when a node answers with
      // stillness ('whom do I serve?'), the desk holds the silence before it
      // moves on — the mirror refusing, for a beat, to reflect you.
      if (leaving.visual?.react === 'still' && animated) {
        transitioning = true;
        window.setTimeout(proceed, 1400);
      } else {
        proceed();
      }
    },
    onExit: (exitId: StandingExitId) => {
      if (transitioning) return;
      if (clock) stopVigil();
      state = takeExit(graph, state, exitId);
      flushTallies();
      onEnded();
      rerender({ reveal: latestReveal() });
    },
    onVigil: (rungId: string) => {
      stopVigil();
      if (rungId === 'endgame') {
        state = vigilEndGame(graph, state);
        flushTallies();
        rerender();
      } else {
        const rung = rungById(rungId);
        blot.react('bloom'); // the Bard got what it asked for
        voice.note('bloom');
        // THEY WERE COMPANY (#11): as the true count is spoken, the near-blank
        // face briefly populates — a wash of many faint motes that bloom and
        // fade back to your single point. Atmosphere, never the real figure
        // (§4.4 honesty guardrail — see blot.crowd()).
        if (rungId === 'conformity') blot.crowd();
        state = vigilFold(state, rung);
        flushTallies();
        rerender({ ackLine: rung.ack ? fillCensus(rung.ack) : undefined });
      }
    },
    onForget: () => {
      forgetLives();
      prior = null;
      bootGreeting = undefined;
      rerender();
    },
    onImport: (token: string) => {
      try {
        const restored = importTotenpass(graph, token);
        state = restored;
        tallied = state.committed.length; // an old life is not re-counted
        completionsSent = true;
        stopVigil();
        rerender();
      } catch {
        rerender({ ackLine: IMPORT_ERROR_LINE });
      }
    },
    onIntake: () => {
      // The intake takes over the stage; when the soul returns to the desk, the
      // boot re-renders (now carrying whatever it filed). Local-only throughout.
      // Once filed, it is not offered again until the next loop (CD 2026-07-16).
      if (clock) stopVigil();
      mountSurvey(stage, SURVEY, (completed) => {
        if (completed) intakeTakenThisLoop = true;
        rerender();
      });
    },
    onContinue: () => {
      // The loop turns (CD 2026-07-16): the screen goes to light, a life passes
      // in the white, and the desk re-opens for the next one. The life just
      // lived is already recorded (onEnded), so the next boot greets a return.
      stopVigil();
      rebirth(() => {
        state = createState(graph);
        tallied = 0;
        completionsSent = false;
        vigilSpent = false;
        hiddenLineShown = false;
        vigilSparseness = 0;
        intakeTakenThisLoop = false; // a new life may answer the desk's questions anew
        prior = lastLife();
        rememberBoot();
        void refreshCensus(MANIFEST_KEYS);
        rerender();
      });
    },
  };

  const startVigilIfEligible = (): void => {
    if (vigilSpent || state.ended || state.node !== 'a1_consent') return;
    clock = new VigilClock({ rungs: SCHEDULE.rungs }, (scheduled) => {
      const rung = rungById(scheduled.id);
      appendVigilBeat(root, rung.beat);
      appendVigilOption(root, rung.id, rung.label, handlers);
      // The face thins as the silence lengthens (v1 §17.2). #7 thinning-as-
      // depletion: a gentle ramp that reserves the lone pulse (sparse 9) for the
      // plea and END GAME — the emotional floor — so the entity wears down
      // gradually and only collapses to a single tired point at the very end
      // (which also breathes slower there; see rorschach pulseCells). #5 END GAME
      // UNADORNED: the endgame rung arrives through this same quiet path, held at
      // its thinnest, with no entrance flourish of any kind — the withholding is
      // the theatre.
      const idx = SCHEDULE.rungs.findIndex((r) => r.id === scheduled.id);
      vigilSparseness = scheduled.id === 'plea' || scheduled.id === 'endgame' ? 9 : Math.min(8, idx + 2);
      blot.set(moodFor(graph, state), vigilSparseness);
      updateCues(); // the ladder grew — there may now be more below
    });
    // A second, visibility-locked clock volunteers the relational retractions
    // if the player keeps waiting past hope/loss (P0-6). No buttons, no state.
    if (LADDER.softRetractions && LADDER.softRetractions.length > 0) {
      retractClock = new VigilClock({ rungs: LADDER.softRetractions }, (entry) => {
        appendVigilBeat(root, (entry as unknown as { beat: string }).beat);
      });
    }
    if (typeof document !== 'undefined' && document.hidden) return; // starts on first visibility
    clock.start();
    retractClock?.start();
  };

  const rerender = (options: RenderOptions = {}): void => {
    // A re-render replaces the buttons under the pointer; any held hover
    // attention would otherwise linger with nothing to point at.
    blot.release();
    const trueEnding = state.ended && getNode(graph, state.node).act >= 1;
    const playedEnding = trueEnding && !state.node.startsWith('omega_');
    const soulN = (getNodeCensus('completions').counts['done'] ?? 0) + 1;
    render(stage, graph, state, handlers, {
      ...options,
      // Ω keeps its quiet: sigil and glyph only — no census recap, no export chrome.
      sigil: trueEnding ? buildSigil(state, Math.max(1, lifeCount())) : undefined,
      glyph: trueEnding ? { text: buildGlyphText(state, soulN), disclosure: GLYPH_DISCLOSURE } : undefined,
      fullLedger: playedEnding ? buildFullLedger(graph, state) : undefined,
      totenpass: playedEnding ? exportTotenpass(state) : undefined,
      // The rut nudge supersedes the generic remembered line where it fires; a
      // personalized aside (§15 / OD-14, local-only) appends beneath either.
      memoryLine:
        [nudgeFor(state.node) ?? memoryFor(state.node), personalize(state.node, SURVEY, getIntake())]
          .filter(Boolean)
          .join('\n\n') || undefined,
      canForget: state.node === 'boot_notice' && (prior !== null || lifeCount() > 0),
      canIntake: state.node === 'boot_notice' && lifeCount() >= 1 && !intakeTakenThisLoop,
      unlockedChoices: unlockedGated(),
    });
    blot.set(moodFor(graph, state), vigilSparseness);
    // Authored entrance flourishes (§ theatrical pass), fired once on entering a
    // node, never on same-node re-renders: 'emit' — letters swirl off as the
    // question arrives (first question + the nine verbs); 'gasp' — the entity
    // forgets to follow your cursor for a beat; 'flood' — the screen goes to
    // light (the walk into the light). Kept rare and deterministic.
    const entered = getNode(graph, state.node);
    if (lastEntranceNode !== state.node) {
      if (typeof document !== 'undefined') document.body.classList.remove('stage-breath');
      const entrance = entered.visual?.entrance;
      if (entrance === 'emit') {
        blot.emit(entered.text.base.slice(0, 28));
        voice.note('attend'); // a faint tone as the question thinks itself into being
      } else if (entrance === 'gasp') blot.gasp(1300);
      else if (entrance === 'flood') flood();
      // The room breathes for a recognized soul at the desk (#8) — rare, earned.
      if (state.node === 'boot_notice' && isRecognized()) roomBreath();
    }
    lastEntranceNode = state.node;
    startVigilIfEligible();
    // A fresh screen starts at the top of its scroll box, and the cues re-read
    // whether there is more above or below.
    stage.scrollTop = 0;
    updateCues();
  };

  // Waiting must be waiting (Compass §4.3): hidden-tab time never counts, and
  // the Bard gets exactly one dry line about it.
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (!clock) return;
      if (document.hidden) {
        clock.pause();
        retractClock?.pause();
      } else {
        if (!hiddenLineShown && clock.visibleElapsedMs > 0) {
          hiddenLineShown = true;
          appendVigilBeat(root, LADDER.hiddenTabLine);
        }
        clock.start();
        retractClock?.start();
      }
    });
  }

  // The instability layer (CD 2026-07-16): rare, random flickers and phantom
  // options that keep the between feeling unstable — a place one is not meant to
  // linger in. Presentation-only and real-browser-only (never in tests, never
  // under reduced motion); excluded from endings, the endgame rung (#5 stays
  // unadorned), the survey, and the sincere boot notice. See src/ui/glitch.ts.
  const canGlitch = (): boolean =>
    animated &&
    !transitioning &&
    !state.ended &&
    state.node !== 'boot_notice' &&
    !state.node.startsWith('omega_') &&
    !root.querySelector('[data-rung-id="endgame"]') &&
    !stage.querySelector('[data-survey-act]');
  const glitch = new Glitch({ root, stage, blot, canGlitch, content: INSTABILITY });
  if (animated) glitch.start();

  ensureCrisisFooter();
  mountAudioToggle();
  rerender();
}

// Browser entry; tests import mount() directly instead.
const rootEl = typeof document !== 'undefined' ? document.getElementById('bardo') : null;
if (rootEl) mount(rootEl);
