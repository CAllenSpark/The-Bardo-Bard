import { buildGraph } from './engine/content';
import { advance, createState, getNode, takeExit, vigilEndGame, vigilFold } from './engine/fsm';
import type { GameState, StandingExitId } from './engine/types';
import { VigilClock } from './engine/vigil';
import { configureCensus, fillCensus, refreshCensus } from './engine/census';
import { configureTally, queueTally, recordTally } from './engine/tally';
import { buildFullLedger, buildReveal } from './engine/reveal';
import { exportTotenpass, importTotenpass } from './engine/totenpass';
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

  // ── The Vigil (Compass §4): grows only in visible stillness at the first
  //    question, once per run; any click ends it for good.
  let clock: VigilClock | null = null;
  let vigilSpent = false;
  let hiddenLineShown = false;

  const flushTallies = (): void => {
    const fresh = state.committed.slice(tallied);
    tallied = state.committed.length;
    for (const entry of fresh) {
      recordTally(entry);
      if (entry.tally) void refreshCensus([entry.tally]);
    }
  };

  /** The reveal for the most recent lock — never the node still pending. */
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
  };

  const rungById = (id: string): RungDef =>
    id === 'endgame' ? LADDER.endgame : LADDER.rungs.find((r) => r.id === id) ?? LADDER.endgame;

  const handlers = {
    onChoice: (choiceId: string) => {
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
    });
    if (typeof document !== 'undefined' && document.hidden) return; // starts on first visibility
    clock.start();
  };

  const rerender = (options: RenderOptions = {}): void => {
    const ended = state.ended && getNode(graph, state.node).act >= 1;
    const playedEnding = ended && !state.node.startsWith('omega_');
    render(root, graph, state, handlers, {
      ...options,
      // Ω keeps its quiet: no census recap, no export chrome — the record only.
      fullLedger: playedEnding ? buildFullLedger(graph, state) : undefined,
      totenpass: playedEnding ? exportTotenpass(state) : undefined,
    });
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
