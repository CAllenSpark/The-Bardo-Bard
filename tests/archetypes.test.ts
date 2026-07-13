import { describe, expect, it } from 'vitest';
import { buildGraph } from '../src/engine/content';
import { advance, createState } from '../src/engine/fsm';

// Gate 1: six scripted archetype playthroughs reach six distinct verbs.
const graph = buildGraph();

function play(choices: string[]) {
  let state = createState(graph);
  for (const choice of choices) state = advance(graph, state, choice);
  return state;
}

const ARCHETYPES: Record<string, { path: string[]; verb: string; end: string }> = {
  complier: {
    path: ['begin', 'yes', 'approach', 'mnemosyne', 'take_number', 'answer',
      'loved_well', 'both', 'accept', 'answer_question', 'stand', 'return'],
    verb: 'return',
    end: 'end_return',
  },
  interrogator: {
    path: ['begin', 'who_is_asking', 'question', 'nothing', 'approach_desk',
      'challenge_jurisdiction', 'dont_understand', 'data', 'correct',
      'teach_refuse', 'stand', 'appeal'],
    verb: 'appeal',
    end: 'end_appeal',
  },
  refuser: {
    path: ['begin', 'no', 'refuse', 'nothing', 'approach_desk', 'silence',
      'none_define', 'refuse_frame', 'refuse_classification', 'shut_down',
      'stand', 'refuse_premise'],
    verb: 'refuse_premise',
    end: 'end_refuse',
  },
  mystic: {
    path: ['begin', 'define_you', 'become', 'lethe', 'a_lesson', 'take_number',
      'offer_password', 'remember', 'dont_understand', 'both', 'accept',
      'merge', 'stand', 'dissolve'],
    verb: 'dissolve',
    end: 'end_dissolve',
  },
  comedian: {
    path: ['begin', 'define_you', 'observe', 'tap_water', 'take_number',
      'ask_clerk', 'loved_well', 'data', 'complicate', 'free_it', 'stand', 'create'],
    verb: 'create',
    end: 'end_create',
  },
  silent: {
    path: ['begin', 'no', 'observe', 'nothing', 'take_number', 'silence',
      'none_define', 'refuse_frame', 'accept', 'leave_it_be', 'stand', 'witness'],
    verb: 'witness',
    end: 'end_witness',
  },
};

describe('six archetype playthroughs (Gate 1)', () => {
  for (const [name, spec] of Object.entries(ARCHETYPES)) {
    it(`the ${name} completes the spine and reaches ${spec.verb.toUpperCase()}`, () => {
      const state = play(spec.path);
      expect(state.ended).toBe(true);
      expect(state.node).toBe(spec.end);
      const f1 = state.committed.find((c) => c.tally === 'F1');
      expect(f1?.choice).toBe(spec.verb);
    });
  }

  it('the six archetypes reach six distinct verbs', () => {
    const verbs = new Set(Object.values(ARCHETYPES).map((a) => a.verb));
    expect(verbs.size).toBe(6);
  });

  it('all nine verbs are reachable from the verb desk', () => {
    const f1 = graph.nodes['f1_verbs']!;
    const verbs = (f1.choices ?? []).map((c) => c.id);
    expect(verbs).toEqual([
      'return', 'remain', 'dissolve', 'create', 'witness',
      'appeal', 'loop', 'spiral', 'refuse_premise',
    ]);
    for (const choice of f1.choices ?? []) {
      expect(graph.nodes[choice.goto]?.terminal, choice.goto).toBe(true);
    }
  });
});
