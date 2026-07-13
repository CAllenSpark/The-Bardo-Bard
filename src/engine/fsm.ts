import type {
  ContentGraph,
  EncounterNode,
  GameState,
  NodeText,
  PostureVariant,
  StandingExitId,
} from './types';
import { STANDING_EXITS } from './types';

/**
 * Deterministic finite state machine over the content graph.
 * Pure functions only: identical (graph, state, input) → identical output.
 * Compass §7: "Deterministic everywhere testable."
 */

export function createState(graph: ContentGraph): GameState {
  return { node: graph.start, flags: {}, committed: [], ended: false };
}

export function getNode(graph: ContentGraph, id: string): EncounterNode {
  const node = graph.nodes[id];
  if (!node) throw new Error(`Unknown node: ${id}`);
  return node;
}

function applyEffects(
  flags: Record<string, number>,
  effects: Record<string, number> | undefined,
): Record<string, number> {
  if (!effects) return { ...flags };
  const next = { ...flags };
  for (const [key, delta] of Object.entries(effects)) {
    next[key] = (next[key] ?? 0) + delta;
  }
  return next;
}

/** Advance by choosing one of the current node's authored choices. */
export function advance(graph: ContentGraph, state: GameState, choiceId: string): GameState {
  if (state.ended) throw new Error('Cannot advance an ended game');
  const node = getNode(graph, state.node);
  const choice = (node.choices ?? []).find((c) => c.id === choiceId);
  if (!choice) throw new Error(`Unknown choice "${choiceId}" at node "${node.id}"`);
  const target = getNode(graph, choice.goto);
  return {
    node: target.id,
    flags: applyEffects(state.flags, choice.state),
    committed: [
      ...state.committed,
      { node: node.id, choice: choice.id, ...(node.tally ? { tally: node.tally } : {}) },
    ],
    ended: Boolean(target.terminal),
  };
}

/**
 * Take a standing exit (Compass §3: the doors are always in the room).
 * Valid from any non-terminal node once play has begun; ends the run with a
 * passage scaled to how far the player got (early / mid / late by act).
 * OD-13 (resolved): exits tally F1 with the shared choices `return` / `light`.
 */
export function takeExit(graph: ContentGraph, state: GameState, exitId: StandingExitId): GameState {
  if (state.ended) throw new Error('Cannot exit an ended game');
  if (!STANDING_EXITS.includes(exitId)) throw new Error(`Unknown exit: ${exitId}`);
  const act = getNode(graph, state.node).act;
  const scale = act <= 1 ? 'early' : act <= 4 ? 'mid' : 'late';
  const exitNode = getNode(graph, `${exitId}_${scale}`);
  const f1Choice = exitId === 'exit_return' ? 'return' : 'light';
  return {
    node: exitNode.id,
    flags: { ...state.flags },
    committed: [
      ...state.committed,
      { node: exitNode.id, choice: f1Choice, ...(exitNode.tally ? { tally: exitNode.tally } : {}) },
    ],
    ended: true,
  };
}

/**
 * A Vigil rung click (Compass §4.1, OD-9): tallies {node:"vigil", choice:<rung>},
 * applies the rung's posture flags, and leaves the player exactly where they
 * were — at the first question, now inside the game. The caller plays the
 * rung's acknowledgment line and stops the vigil clock.
 */
export function vigilFold(
  state: GameState,
  rung: { id: string; state?: Record<string, number> },
): GameState {
  if (state.ended) throw new Error('Cannot fold an ended game');
  if (state.node !== 'a1_consent') throw new Error('The vigil only exists at the first question');
  return {
    node: state.node,
    flags: applyEffects(state.flags, rung.state),
    committed: [...state.committed, { node: 'vigil', choice: rung.id, tally: 'V' }],
    ended: false,
  };
}

/**
 * END GAME (Compass §4.2): tallied as Node Ω, then the faceless light and the
 * final disclosure. The one door that declines the game's frame.
 */
export function vigilEndGame(graph: ContentGraph, state: GameState): GameState {
  if (state.ended) throw new Error('Cannot end an ended game');
  if (state.node !== 'a1_consent') throw new Error('END GAME only grows at the first question');
  const light = getNode(graph, 'omega_light');
  return {
    node: light.id,
    flags: { ...state.flags },
    committed: [...state.committed, { node: 'omega', choice: 'end_game', tally: 'OMEGA' }],
    ended: false, // the walk and the disclosure still play; omega_disclosure is terminal
  };
}

/**
 * Pick the text variant for a node from posture flags.
 * Deterministic: highest posture flag wins if the node authors that variant;
 * ties and sub-threshold postures fall back in fixed order, then to base.
 */
const VARIANT_ORDER: PostureVariant[] = ['fear', 'curiosity', 'reverence', 'defiance'];

export function pickText(text: NodeText, flags: Record<string, number>): string {
  let best: PostureVariant | null = null;
  let bestScore = 0;
  for (const variant of VARIANT_ORDER) {
    const score = flags[variant] ?? 0;
    const authored = text[variant] !== undefined;
    if (authored && score > bestScore) {
      best = variant;
      bestScore = score;
    }
  }
  return best ? (text[best] as string) : text.base;
}

/**
 * The deterministic state vector: the seed for sigil generation.
 * Identical committed choices + flags → identical vector, always.
 */
export function stateVector(state: GameState): string {
  const flags = Object.entries(state.flags)
    .filter(([, v]) => v !== 0)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([k, v]) => `${k}=${v}`)
    .join(',');
  const path = state.committed.map((c) => `${c.node}:${c.choice}`).join('>');
  return `${path}|${flags}`;
}
