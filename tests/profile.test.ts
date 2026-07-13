import { describe, expect, it } from 'vitest';
import { buildGraph } from '../src/engine/content';
import { advance, createState, takeExit } from '../src/engine/fsm';
import { allTitles, computeProfile } from '../src/engine/profile';

const graph = buildGraph();

function play(choices: string[]) {
  let state = createState(graph);
  for (const choice of choices) state = advance(graph, state, choice);
  return state;
}

const SILENT_PATH = ['begin', 'no', 'observe', 'nothing', 'take_number', 'silence',
  'none_define', 'refuse_frame', 'accept', 'leave_it_be', 'stand', 'witness'];

describe('soul records (Gate 1: 12-18 authored titles, deterministic, choice-traceable)', () => {
  it('authors between 12 and 18 unique titles', () => {
    const titles = allTitles();
    expect(titles.length).toBeGreaterThanOrEqual(12);
    expect(titles.length).toBeLessThanOrEqual(18);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('is deterministic: identical runs produce identical records', () => {
    const a = computeProfile(play(SILENT_PATH));
    const b = computeProfile(play(SILENT_PATH));
    expect(a).toEqual(b);
  });

  it('builds the reflection from the actual committed choices, no placeholders left', () => {
    const state = play(['begin', 'yes', 'observe', 'mercy', 'a_person', 'take_number',
      'compassion', 'caused_harm', 'debt', 'complicate', 'free_it', 'stand', 'return']);
    const profile = computeProfile(state)!;
    expect(profile.title).toBe('The Returner, Eyes Open');
    expect(profile.reflection).toContain('you kept the light at watching distance');
    expect(profile.reflection).toContain('kindness instead of credentials');
    expect(profile.reflection).toContain('called the weight a debt');
    expect(profile.reflection).not.toMatch(/[{}]/);
    expect(profile.shadow).toContain('SHADOW ON FILE');
    expect(profile.question).toContain('CARRIED FORWARD');
  });

  it('an early light exit earns The Unhesitating, with missing acts filled honestly', () => {
    const state = takeExit(graph, play(['begin']), 'exit_light');
    const profile = computeProfile(state)!;
    expect(profile.title).toBe('The Unhesitating');
    expect(profile.reflection).toContain('you left before the light could introduce itself');
    expect(profile.reflection).toContain('the cart never reached you');
    expect(profile.reflection).not.toMatch(/[{}]/);
  });

  it('an early return earns The Homesick', () => {
    const state = takeExit(graph, play(['begin']), 'exit_return');
    expect(computeProfile(state)!.title).toBe('The Homesick');
  });

  it('a mid-game exit falls through to the verb bucket, not the early override', () => {
    const state = takeExit(graph, play(['begin', 'yes', 'approach', 'tap_water']), 'exit_return');
    const profile = computeProfile(state)!;
    expect(profile.title).toBe('The Returner, Eyes Open');
    expect(profile.reflection).toContain('no verdict was ever filed');
  });

  it('three or more refusals earn The Gentle Dissenter — unless the verb already refuses', () => {
    const dissenter = computeProfile(play(SILENT_PATH))!;
    expect(dissenter.title).toBe('The Gentle Dissenter');

    const refuser = play(['begin', 'no', 'refuse', 'nothing', 'approach_desk', 'silence',
      'none_define', 'refuse_frame', 'refuse_classification', 'shut_down', 'stand', 'refuse_premise']);
    expect(computeProfile(refuser)!.title).toBe('The Unclassified');
  });

  it('declining at boot leaves no record — by design', () => {
    const state = play(['decline']);
    expect(state.ended).toBe(true);
    expect(computeProfile(state)).toBeNull();
  });
});
