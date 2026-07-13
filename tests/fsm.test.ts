import { describe, expect, it } from 'vitest';
import { buildGraph } from '../src/engine/content';
import { advance, createState, pickText, stateVector, takeExit } from '../src/engine/fsm';

const graph = buildGraph();

function playPath(choices: string[]) {
  let state = createState(graph);
  for (const choice of choices) state = advance(graph, state, choice);
  return state;
}

const SPIRAL_PATH = [
  'begin', 'define_you', 'question', 'distillation', 'take_number', 'answer',
  'loved_well', 'both', 'accept', 'answer_question', 'stand', 'spiral',
];

describe('deterministic FSM (Gates 0-1)', () => {
  it('boots to the notice and reaches Act I on BEGIN', () => {
    const state = createState(graph);
    expect(state.node).toBe('boot_notice');
    const a1 = advance(graph, state, 'begin');
    expect(a1.node).toBe('a1_consent');
    expect(a1.ended).toBe(false);
  });

  it('is deterministic across the full spine: identical inputs, identical vectors', () => {
    const a = playPath(SPIRAL_PATH);
    const b = playPath(SPIRAL_PATH);
    expect(a).toEqual(b);
    expect(stateVector(a)).toBe(stateVector(b));
    expect(a.node).toBe('end_spiral');
    expect(a.ended).toBe(true);
  });

  it('applies additive state effects from choices', () => {
    let s = playPath(['begin', 'who_is_asking']);
    expect(s.flags['defiance']).toBe(1);
    s = advance(graph, s, 'refuse');
    expect(s.flags['defiance']).toBe(2);
  });

  it('records committed choices with their Ledger tally keys', () => {
    const s = playPath(['begin', 'yes']);
    expect(s.committed.at(-1)).toMatchObject({ node: 'a1_consent', choice: 'yes', tally: 'A1' });
  });

  it('routes Lethe and Mercy through the keeping question; other cups skip it', () => {
    expect(playPath(['begin', 'yes', 'approach', 'lethe']).node).toBe('b2_keep_one');
    expect(playPath(['begin', 'yes', 'approach', 'mercy']).node).toBe('b2_keep_one');
    expect(playPath(['begin', 'yes', 'approach', 'tap_water']).node).toBe('c0_dept_intro');
  });

  it('the recited-not-meant password routes through the Dead Letter Office, gently', () => {
    const s = playPath(['begin', 'yes', 'approach', 'tap_water', 'take_number', 'offer_password', 'key']);
    expect(s.node).toBe('c2_dead_letter');
    const onward = advance(graph, s, 'continue');
    expect(onward.node).toBe('d1_review');
  });

  it('rejects unknown choices', () => {
    const s = playPath(['begin']);
    expect(() => advance(graph, s, 'recite_the_password')).toThrow(/Unknown choice/);
  });
});

describe('standing exits (Compass §3, OD-13)', () => {
  it('scales the passage to progress: early, mid, late', () => {
    const early = takeExit(graph, playPath(['begin']), 'exit_light');
    expect(early.node).toBe('exit_light_early');

    const mid = takeExit(graph, playPath(['begin', 'no', 'refuse', 'tap_water']), 'exit_return');
    expect(mid.node).toBe('exit_return_mid');

    const late = takeExit(graph, playPath(SPIRAL_PATH.slice(0, 10)), 'exit_light'); // at f0, act 6
    expect(late.node).toBe('exit_light_late');
  });

  it('tallies F1 with the shared return/light choices', () => {
    const light = takeExit(graph, playPath(['begin']), 'exit_light');
    expect(light.committed.at(-1)).toMatchObject({ choice: 'light', tally: 'F1' });
    expect(light.ended).toBe(true);

    const ret = takeExit(graph, playPath(['begin', 'yes']), 'exit_return');
    expect(ret.committed.at(-1)).toMatchObject({ choice: 'return', tally: 'F1' });
  });

  it('refuses to advance or exit an ended game', () => {
    const ended = takeExit(graph, playPath(['begin']), 'exit_light');
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
    expect(pickText(node.text, { curiosity: 1, fear: 1 })).toBe(node.text.fear);
  });

  it('falls back to base when the dominant posture has no authored variant', () => {
    expect(pickText(node.text, { reverence: 5 })).toBe(node.text.base);
  });
});
