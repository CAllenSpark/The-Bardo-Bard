import { buildGraph } from './engine/content';
import { advance, createState, takeExit } from './engine/fsm';
import type { GameState, StandingExitId } from './engine/types';
import { render } from './ui/render';

export function mount(root: HTMLElement): void {
  const graph = buildGraph();
  let state: GameState = createState(graph);

  const rerender = (): void =>
    render(root, graph, state, {
      onChoice: (choiceId) => {
        state = advance(graph, state, choiceId);
        rerender();
      },
      onExit: (exitId: StandingExitId) => {
        state = takeExit(graph, state, exitId);
        rerender();
      },
    });

  rerender();
}

// Browser entry; tests import mount() directly instead.
const root = typeof document !== 'undefined' ? document.getElementById('bardo') : null;
if (root) mount(root);
