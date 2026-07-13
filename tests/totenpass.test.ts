import { describe, expect, it } from 'vitest';
import { buildGraph } from '../src/engine/content';
import { advance, createState } from '../src/engine/fsm';
import { exportTotenpass, importTotenpass } from '../src/engine/totenpass';

const graph = buildGraph();

function play(choices: string[]) {
  let state = createState(graph);
  for (const choice of choices) state = advance(graph, state, choice);
  return state;
}

describe('the totenpass (Gate 3: round-trips state exactly)', () => {
  it('round-trips a completed run exactly', () => {
    const state = play(['begin', 'define_you', 'question', 'lethe', 'a_person', 'take_number',
      'compassion', 'caused_harm', 'both', 'accept', 'free_it', 'stand', 'spiral']);
    const token = exportTotenpass(state);
    expect(token.startsWith('BB1.')).toBe(true);
    expect(importTotenpass(graph, token)).toEqual(state);
  });

  it('round-trips a mid-run state exactly', () => {
    const state = play(['begin', 'no', 'observe']);
    expect(importTotenpass(graph, exportTotenpass(state))).toEqual(state);
  });

  it('rejects garbage, tampering, and other underworlds', () => {
    expect(() => importTotenpass(graph, 'HADES.abc')).toThrow();
    expect(() => importTotenpass(graph, 'BB1.%%%%')).toThrow();
    expect(() => importTotenpass(graph, '')).toThrow();
    const forged =
      'BB1.' +
      btoa(JSON.stringify({ v: 1, node: 'valhalla', flags: {}, committed: [], ended: false }))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    expect(() => importTotenpass(graph, forged)).toThrow(/Unknown node/);
  });
});
