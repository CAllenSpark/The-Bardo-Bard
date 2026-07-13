import { buildGraph } from './engine/content';
import { advance, createState, takeExit, vigilEndGame, vigilFold } from './engine/fsm';
import type { GameState, StandingExitId } from './engine/types';
import { VigilClock } from './engine/vigil';
import { fillCensus } from './engine/census';
import { recordTally } from './engine/tally';
import { appendVigilBeat, appendVigilOption, ensureCrisisFooter, render } from './ui/render';
import ladderFile from '../content/vigil/ladder.json';
import scheduleFile from '../content/vigil/schedule.json';

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

export function mount(root: HTMLElement): void {
  const graph = buildGraph();
  let state: GameState = createState(graph);
  let tallied = 0;

  // ── The Vigil (Compass §4): grows only in visible stillness at the first
  //    question, once per run; any click ends it for good.
  let clock: VigilClock | null = null;
  let vigilSpent = false;
  let hiddenLineShown = false;

  const flushTallies = (): void => {
    for (; tallied < state.committed.length; tallied += 1) {
      recordTally(state.committed[tallied]!);
    }
  };

  const stopVigil = (): void => {
    clock?.stop();
    clock = null;
    vigilSpent = true;
  };

  const rungById = (id: string): RungDef =>
    id === 'endgame' ? LADDER.endgame : LADDER.rungs.find((r) => r.id === id) ?? LADDER.endgame;

  const handlers = {
    onChoice: (choiceId: string) => {
      if (clock) stopVigil();
      state = advance(graph, state, choiceId);
      flushTallies();
      rerender();
    },
    onExit: (exitId: StandingExitId) => {
      if (clock) stopVigil();
      state = takeExit(graph, state, exitId);
      flushTallies();
      rerender();
    },
    onVigil: (rungId: string) => {
      stopVigil();
      if (rungId === 'endgame') {
        state = vigilEndGame(graph, state);
        flushTallies();
        rerender();
      } else {
        const rung = rungById(rungId);
        state = vigilFold(state, rung);
        flushTallies();
        rerender(rung.ack ? fillCensus(rung.ack) : undefined);
      }
    },
  };

  const startVigilIfEligible = (): void => {
    if (vigilSpent || state.ended || state.node !== 'a1_consent') return;
    clock = new VigilClock({ rungs: SCHEDULE.rungs }, (scheduled) => {
      const rung = rungById(scheduled.id);
      appendVigilBeat(root, rung.beat);
      appendVigilOption(root, rung.id, rung.label, handlers);
    });
    if (typeof document !== 'undefined' && document.hidden) return; // starts on first visibility
    clock.start();
  };

  const rerender = (ackLine?: string): void => {
    render(root, graph, state, handlers, { ackLine });
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
