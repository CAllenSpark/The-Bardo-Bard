// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '../src/main';
import { clearTallies } from '../src/engine/tally';
import { choiceHistory, recordLife } from '../src/engine/memory';
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
    expect(greetingAfter(5)).toContain('past counting'); // 5th+ shares the deepest framing
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
});
