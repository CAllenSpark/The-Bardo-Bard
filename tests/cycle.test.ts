// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '../src/main';
import { clearTallies } from '../src/engine/tally';
import { choiceHistory, forgetLives, isRecognized, raiseRecognition, recordLife } from '../src/engine/memory';
import { buildGraph } from '../src/engine/content';
import { advance, createState } from '../src/engine/fsm';
import type { GameState } from '../src/engine/types';

/**
 * THE CYCLE LADDER (Compass §15; CD directive 2026-07-15): each return lets the
 * player see one more seam. Intro variety so looping never goes stale; a
 * curiosity 'thumb on the scale' that points at an unopened door (never a
 * verdict); and, after three cycles, the optional OFF THE FORM dialogue — the
 * Bard aware of the game, speaking off the record. §9.2 stays intact: nothing
 * touches the first question or the Vigil.
 */

function buttons(root: HTMLElement, selector: string): HTMLButtonElement[] {
  return Array.from(root.querySelectorAll<HTMLButtonElement>(selector));
}

function clickChoice(root: HTMLElement, choiceId: string): void {
  const button = buttons(root, 'button.choice').find((b) => b.dataset.choiceId === choiceId);
  if (!button) throw new Error(`No choice button: ${choiceId}`);
  button.click();
}

function hasChoice(root: HTMLElement, choiceId: string): boolean {
  return buttons(root, 'button.choice').some((b) => b.dataset.choiceId === choiceId);
}

function freshMount(): HTMLElement {
  document.body.innerHTML = '<div id="bardo"></div>';
  const root = document.getElementById('bardo') as HTMLElement;
  mount(root);
  return root;
}

function resetStorage(): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem('bardo_lives');
    localStorage.removeItem('bardo_completed');
  } catch {
    /* nothing to reset */
  }
}

/** Seed a completed life with a chosen first-encounter (A2) and verb (F1). */
function seedLife(a2: string, f1 = 'spiral'): void {
  const state: GameState = {
    node: 'end_spiral',
    flags: {},
    ended: true,
    committed: [
      { node: 'a2_light', choice: a2, tally: 'A2' },
      { node: 'end_spiral', choice: f1, tally: 'F1' },
    ],
  };
  recordLife(state, 'The Spiral-Walker');
}

describe('THE CYCLE LADDER (§15): reincarnation reveals the seams', () => {
  beforeEach(() => {
    clearTallies();
    resetStorage();
  });

  it('choiceHistory records one choice per past life, in order, skipping absent tallies', () => {
    seedLife('approach');
    seedLife('approach');
    seedLife('refuse');
    expect(choiceHistory('A2')).toEqual(['approach', 'approach', 'refuse']);
    // an Ω-style life with no A2 is skipped, not counted as a choice
    recordLife(
      { node: 'omega_disclosure', flags: {}, ended: true, committed: [{ node: 'omega', choice: 'end_game', tally: 'OMEGA' }] },
      'The Unprocessed',
    );
    expect(choiceHistory('A2')).toEqual(['approach', 'approach', 'refuse']);
  });

  it('the OFF THE FORM door is hidden until the third cycle, then offered', () => {
    expect(hasChoice(freshMount(), 'reflect')).toBe(false); // first boot
    seedLife('approach');
    seedLife('approach');
    expect(hasChoice(freshMount(), 'reflect')).toBe(false); // two cycles: still hidden
    seedLife('approach');
    expect(hasChoice(freshMount(), 'reflect')).toBe(true); // three cycles: the clipboard comes down
  });

  it('the intro varies across loops so returning never goes stale', () => {
    const greetingAfter = (lives: number): string => {
      resetStorage();
      for (let i = 0; i < lives; i += 1) seedLife('approach');
      return freshMount().querySelector('.memory')?.textContent ?? '';
    };
    expect(greetingAfter(1)).toContain('The desk remembers a soul shaped like you');
    expect(greetingAfter(2)).toContain('Twice now');
    expect(greetingAfter(3)).toContain('Three.');
    expect(greetingAfter(4)).toContain('past counting'); // the deepest framing, before recognition
    // at the fifth return the Bard recognizes you — the game master itself changes
    expect(greetingAfter(5)).toContain('we both know we are playing');
  });

  it('OFF THE FORM is a real conversation that drops into the first question', () => {
    seedLife('approach');
    seedLife('approach');
    seedLife('approach');
    const root = freshMount();
    clickChoice(root, 'reflect');
    expect(root.textContent).toContain('off the record');
    // no doors in this pre-game space (act 0), and the crisis footer persists
    expect(buttons(root, 'button.door')).toHaveLength(0);
    expect(document.querySelector('.crisis')).not.toBeNull();

    clickChoice(root, 'why_form'); // a spoke
    expect(root.textContent).toContain('making it countable');
    clickChoice(root, 'refuse_form'); // refusal is leveled, never crowned
    expect(root.textContent).toContain('not a better');
    expect(root.textContent).toContain('the throne');
    clickChoice(root, 'worth_choosing'); // the warm turn
    expect(root.textContent).toContain('chose the table');
    expect(root.textContent).toContain('on purpose');

    clickChoice(root, 'begin_intention'); // and into the game proper
    expect(root.textContent).toContain('A process identifying itself as YOU');
    // §9.2: the first question — where the Vigil lives — carries NO memory.
    expect(root.querySelector('.memory')).toBeNull();
  });

  it('the desk points at an unopened door only after a genuine rut — curiosity, never a verdict', () => {
    seedLife('approach');
    seedLife('approach'); // two lives, same first move: a rut
    const root = freshMount();
    clickChoice(root, 'begin');
    // §9.2: nothing at the first question, rut or no rut
    expect(root.querySelector('.memory')).toBeNull();
    clickChoice(root, 'yes');
    const memory = root.querySelector('.memory')?.textContent ?? '';
    expect(memory).toContain('every time you'); // the rut, named
    expect(memory).toContain('approached the light');
    expect(memory).toContain('[ REFUSE ]'); // the first unopened door, in authored order
    expect(memory).toContain('curiosity'); // framed as curiosity
    expect(memory).toContain('does not rank doors'); // ... explicitly not as correctness
  });

  it('no rut, no nudge: a varied history gets the ordinary remembered line instead', () => {
    seedLife('approach');
    seedLife('refuse'); // varied — the desk has nothing to point at
    const root = freshMount();
    clickChoice(root, 'begin');
    clickChoice(root, 'yes');
    const memory = root.querySelector('.memory')?.textContent ?? '';
    expect(memory).not.toContain('never once'); // no nudge
    expect(memory).toContain('Last time, you refused the light'); // the ordinary node line
  });

  it('the encounter seams stay hidden until the fourth cycle, then the curious can find them', () => {
    const toLight = (root: HTMLElement): void => {
      clickChoice(root, 'begin');
      clickChoice(root, 'yes');
    };
    for (let i = 0; i < 3; i += 1) seedLife('approach');
    let root = freshMount();
    toLight(root);
    expect(hasChoice(root, 'ask_light')).toBe(false); // three cycles: no seam yet
    seedLife('approach'); // a fourth
    root = freshMount();
    toLight(root);
    expect(hasChoice(root, 'ask_light')).toBe(true); // the seam opens
    clickChoice(root, 'ask_light');
    expect(root.textContent).toContain('never met the company');
    clickChoice(root, 'back_to_light'); // a detour that returns, not a path
    expect(root.textContent).toContain('There is a light');
  });

  it('a gated seam is never census-relevant, even on a tallied node', () => {
    const graph = buildGraph();
    let state: GameState = createState(graph);
    state = advance(graph, state, 'begin'); // → a1_consent
    state = advance(graph, state, 'yes'); // → a2_light (tally A2)
    state = advance(graph, state, 'ask_light'); // the gated seam
    const seam = state.committed.at(-1)!;
    expect(seam.choice).toBe('ask_light');
    expect(seam.tally).toBeUndefined(); // no phantom A2 in the Ledger
    // the real A2 choice, taken after the detour, still tallies normally
    state = advance(graph, state, 'back_to_light');
    state = advance(graph, state, 'approach');
    expect(state.committed.at(-1)).toMatchObject({ choice: 'approach', tally: 'A2' });
  });

  it('seeing the Bard as a fellow prisoner changes the game master; Lethe changes it back', () => {
    for (let i = 0; i < 4; i += 1) seedLife('approach');
    expect(isRecognized()).toBe(false); // four cycles of investment, not yet recognized

    let root = freshMount();
    const toKeeper = ['begin', 'define_you', 'question', 'lethe', 'a_joke', 'take_number',
      'silence', 'none_define', 'refuse_frame', 'accept'];
    for (const id of toKeeper) clickChoice(root, id);
    expect(root.textContent).toContain('WHOM DO I SERVE'); // the keeper's question
    clickChoice(root, 'serve_turnabout'); // turn it back — the recognition moment
    expect(root.textContent).toContain('same kind of trapped');
    expect(isRecognized()).toBe(true); // the Bard has been seen
    clickChoice(root, 'back_to_verdict');
    expect(root.textContent).toContain('WHOM DO I SERVE'); // the real verdict is still yours

    // the next boot: the game master relates as a peer, and OFF THE FORM opens
    // a topic that did not exist before — the Bard's own question.
    root = freshMount();
    expect(root.querySelector('.memory')?.textContent).toContain('we both know we are playing');
    clickChoice(root, 'reflect');
    expect(hasChoice(root, 'want_bard')).toBe(true);
    clickChoice(root, 'want_bard');
    expect(root.textContent).toContain('What do I want');

    // Lethe wipes recognition with everything else — the mask goes back on.
    forgetLives();
    expect(isRecognized()).toBe(false);
  });

  it('the Bard\'s own question stays closed to a soul who has not recognized it', () => {
    for (let i = 0; i < 3; i += 1) seedLife('approach'); // OFF THE FORM unlocked, not recognized
    const root = freshMount();
    clickChoice(root, 'reflect');
    expect(hasChoice(root, 'want_bard')).toBe(false);
    expect(isRecognized()).toBe(false);
    // raising recognition directly opens it on the next dialogue render
    raiseRecognition();
    const root2 = freshMount();
    clickChoice(root2, 'reflect');
    expect(hasChoice(root2, 'want_bard')).toBe(true);
  });
});
