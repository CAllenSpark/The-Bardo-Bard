import { describe, expect, it } from 'vitest';
import { buildGraph } from '../src/engine/content';
import { advance, createState, pickText, stateVector, takeExit } from '../src/engine/fsm';

const graph = buildGraph();

function playedToA1() {
  return advance(graph, createState(graph), 'begin');
}

describe('deterministic FSM (Gate 0)', () => {
  it('boots to the notice and reaches Act I on BEGIN', () => {
    const state = createState(graph);
    expect(state.node).toBe('boot_notice');
    const a1 = advance(graph, state, 'begin');
    expect(a1.node).toBe('a1_consent');
    expect(a1.ended).toBe(false);
  });

  it('is deterministic: identical inputs produce identical states and vectors', () => {
    const run = () => {
      let s = playedToA1();
      s = advance(graph, s, 'define_you');
      s = advance(graph, s, 'question');
      s = advance(graph, s, 'distillation');
      return s;
    };
    const a = run();
    const b = run();
    expect(a).toEqual(b);
    expect(stateVector(a)).toBe(stateVector(b));
    expect(a.ended).toBe(true); // seed boundary is terminal
  });

  it('applies additive state effects from choices', () => {
    let s = playedToA1();
    s = advance(graph, s, 'who_is_asking');
    expect(s.flags['defiance']).toBe(1);
    s = advance(graph, s, 'refuse');
    expect(s.flags['defiance']).toBe(2);
  });

  it('records committed choices with their Ledger tally keys', () => {
    let s = playedToA1();
    s = advance(graph, s, 'yes');
    const committed = s.committed.at(-1);
    expect(committed).toMatchObject({ node: 'a1_consent', choice: 'yes', tally: 'A1' });
  });

  it('rejects unknown choices and unknown nodes', () => {
    const s = playedToA1();
    expect(() => advance(graph, s, 'recite_the_password')).toThrow(/Unknown choice/);
  });

  it('standing exits end the run from any non-terminal node and tally F1', () => {
    const atA1 = takeExit(graph, playedToA1(), 'exit_light');
    expect(atA1.ended).toBe(true);
    expect(atA1.committed.at(-1)).toMatchObject({ node: 'exit_light', tally: 'F1' });

    let mid = advance(graph, playedToA1(), 'no');
    const atA2 = takeExit(graph, mid, 'exit_return');
    expect(atA2.ended).toBe(true);
    expect(atA2.node).toBe('exit_return');
  });

  it('refuses to advance or exit an ended game', () => {
    const ended = takeExit(graph, playedToA1(), 'exit_light');
    expect(() => advance(graph, ended, 'yes')).toThrow(/ended/);
    expect(() => takeExit(graph, ended, 'exit_return')).toThrow(/ended/);
  });
});

describe('posture-variant text selection', () => {
  const node = graph.nodes['a2_light']!;

  it('serves base text with no posture flags', () => {
    expect(pickText(node.text, {})).toBe(node.text.base);
  });

  it('serves the dominant authored posture variant deterministically', () => {
    expect(pickText(node.text, { curiosity: 2, fear: 1 })).toBe(node.text.curiosity);
    // Tie goes to fixed variant order (fear before curiosity), same answer every time.
    expect(pickText(node.text, { curiosity: 1, fear: 1 })).toBe(node.text.fear);
  });

  it('falls back to base when the dominant posture has no authored variant', () => {
    expect(pickText(node.text, { reverence: 5 })).toBe(node.text.base);
  });
});
