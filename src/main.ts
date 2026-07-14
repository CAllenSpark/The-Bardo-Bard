import { buildGraph } from './engine/content';
import { advance, createState, getNode, takeExit, vigilEndGame, vigilFold } from './engine/fsm';
import type { GameState, StandingExitId } from './engine/types';
import { VigilClock } from './engine/vigil';
import { configureCensus, fillCensus, getNodeCensus, refreshCensus } from './engine/census';
import { configureTally, queueTally, recordTally } from './engine/tally';
import { buildFullLedger, buildReveal } from './engine/reveal';
import { exportTotenpass, importTotenpass } from './engine/totenpass';
import { buildSigil } from './engine/sigil';
import { GLYPH_DISCLOSURE, buildGlyphText } from './engine/glyph';
import type { Gesture, Mood } from './engine/rorschach';
import { Blot } from './ui/blot';
import { appendVigilBeat, appendVigilOption, ensureCrisisFooter, render } from './ui/render';
import type { RenderOptions } from './ui/render';
import ladderFile from '../content/vigil/ladder.json';
import scheduleFile from '../content/vigil/schedule.json';
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
  hiddenTabLine: string;
}

const LADDER = ladderFile as unknown as Ladder;
const SCHEDULE = scheduleFile as unknown as { rungs: { id: string; afterMs: number }[] };
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

  // ── The Vigil (Compass §4): grows only in visible stillness at the first
  //    question, once per run; any click ends it for good.
  let clock: VigilClock | null = null;
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
      try {
        localStorage.setItem('bardo_completed', '1');
      } catch {
        /* an unrecorded incarnation — by design */
      }
    }
  };

  const stopVigil = (): void => {
    clock?.stop();
    clock = null;
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
      const choice = getNode(graph, state.node).choices?.find((c) => c.id === choiceId);
      reactToChoice(choice?.state);
      if (clock) stopVigil();
      state = advance(graph, state, choiceId);
      flushTallies();
      onEnded();
      rerender({ reveal: latestReveal() });
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
    if (typeof document !== 'undefined' && document.hidden) return; // starts on first visibility
    clock.start();
  };

  const rerender = (options: RenderOptions = {}): void => {
    const trueEnding = state.ended && getNode(graph, state.node).act >= 1;
    const playedEnding = trueEnding && !state.node.startsWith('omega_');
    const soulN = (getNodeCensus('completions').counts['done'] ?? 0) + 1;
    render(stage, graph, state, handlers, {
      ...options,
      // Ω keeps its quiet: sigil and glyph only — no census recap, no export chrome.
      sigil: trueEnding ? buildSigil(state) : undefined,
      glyph: trueEnding ? { text: buildGlyphText(state, soulN), disclosure: GLYPH_DISCLOSURE } : undefined,
      fullLedger: playedEnding ? buildFullLedger(graph, state) : undefined,
      totenpass: playedEnding ? exportTotenpass(state) : undefined,
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
      } else {
        if (!hiddenLineShown && clock.visibleElapsedMs > 0) {
          hiddenLineShown = true;
          appendVigilBeat(root, LADDER.hiddenTabLine);
        }
        clock.start();
      }
    });
  }

  ensureCrisisFooter();
  rerender();
}

// Browser entry; tests import mount() directly instead.
const rootEl = typeof document !== 'undefined' ? document.getElementById('bardo') : null;
if (rootEl) mount(rootEl);
