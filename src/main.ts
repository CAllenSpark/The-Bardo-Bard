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
import { choiceHistory, forgetLives, lastLife, lifeCount, longAbsence, noteOmegaReturn, recordLife } from './engine/memory';
import type { Life } from './engine/memory';
import type { Gesture, Mood } from './engine/rorschach';
import { hoverGesture } from './engine/rorschach';
import { Blot } from './ui/blot';
import { appendVigilBeat, appendVigilOption, ensureCrisisFooter, render } from './ui/render';
import type { RenderOptions } from './ui/render';
import { mountAudioToggle } from './ui/audio';
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
  greeting_long_absence: string;
  greeting_omega: string[];
  nudge_a2: string;
  node_lines: Record<string, string>;
};

/** Reincarnation depth at which the Bard sets down the clipboard (CD: "after
 *  the 3rd cycle"). The gated boot choice `reflect` unlocks here. */
const REFLECT_UNLOCK_LIVES = 3;

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

  // The Ledger endpoint; empty string = offline by design (seed census).
  const ledgerUrl = (globalThis as { BARDO_LEDGER_URL?: string }).BARDO_LEDGER_URL ?? '';
  configureTally({ url: ledgerUrl });
  configureCensus({ url: ledgerUrl });
  void refreshCensus(MANIFEST_KEYS);

  // The Bard's face lives above the stage and survives re-renders.
  root.textContent = '';
  const blot = new Blot(root);
  const stage = document.createElement('div');
  stage.id = 'stage';
  root.appendChild(stage);

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
    blot.react(authored ?? gestureFor(effects));
  };

  const handlers = {
    onChoice: (choiceId: string) => {
      const leaving = getNode(graph, state.node);
      const choice = leaving.choices?.find((c) => c.id === choiceId);
      reactToChoice(choice?.state);
      // The confirmation pattern pays off: 'the record, working' shown working.
      const ackLine = leaving.tally === 'D3' ? CONFIRMATION_ACKS[choiceId] : undefined;
      if (clock) stopVigil();
      state = advance(graph, state, choiceId);
      flushTallies();
      onEnded();
      rerender({ reveal: latestReveal(), ackLine });
    },
    onExit: (exitId: StandingExitId) => {
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
  };

  const startVigilIfEligible = (): void => {
    if (vigilSpent || state.ended || state.node !== 'a1_consent') return;
    clock = new VigilClock({ rungs: SCHEDULE.rungs }, (scheduled) => {
      const rung = rungById(scheduled.id);
      appendVigilBeat(root, rung.beat);
      appendVigilOption(root, rung.id, rung.label, handlers);
      // The face thins as the silence lengthens (v1 §17.2: silence reduces
      // to sparse points or a single pulse — the CD's living pixel).
      vigilSparseness = Math.min(9, SCHEDULE.rungs.findIndex((r) => r.id === scheduled.id) + 2);
      blot.set(moodFor(graph, state), vigilSparseness);
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
      // The rut nudge supersedes the generic remembered line where it fires.
      memoryLine: nudgeFor(state.node) ?? memoryFor(state.node),
      canForget: state.node === 'boot_notice' && (prior !== null || lifeCount() > 0),
      unlockedChoices: lifeCount() >= REFLECT_UNLOCK_LIVES ? new Set(['reflect']) : undefined,
    });
    blot.set(moodFor(graph, state), vigilSparseness);
    startVigilIfEligible();
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

  ensureCrisisFooter();
  mountAudioToggle();
  rerender();
}

// Browser entry; tests import mount() directly instead.
const rootEl = typeof document !== 'undefined' ? document.getElementById('bardo') : null;
if (rootEl) mount(rootEl);
