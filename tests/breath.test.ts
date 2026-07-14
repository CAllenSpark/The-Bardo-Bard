// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '../src/main';
import { clearTallies } from '../src/engine/tally';
import { lifeCount, loadMemory, recordLife } from '../src/engine/memory';
import { mountCodex } from '../src/codex';

function buttons(root: HTMLElement, selector: string): HTMLButtonElement[] {
  return Array.from(root.querySelectorAll<HTMLButtonElement>(selector));
}

function clickChoice(root: HTMLElement, choiceId: string): void {
  const button = buttons(root, 'button.choice').find((b) => b.dataset.choiceId === choiceId);
  if (!button) throw new Error(`No choice button: ${choiceId}`);
  button.click();
}

function clickSystem(root: HTMLElement, systemId: string): void {
  const button = buttons(root, 'button.system').find((b) => b.dataset.systemId === systemId);
  if (!button) throw new Error(`No system button: ${systemId}`);
  button.click();
}

const SPINE = ['begin', 'define_you', 'question', 'lethe', 'a_joke', 'take_number',
  'silence', 'none_define', 'refuse_frame', 'accept', 'leave_it_be', 'stand', 'spiral'];

function freshMount(): HTMLElement {
  document.body.innerHTML = '<div id="bardo"></div>';
  const root = document.getElementById('bardo') as HTMLElement;
  mount(root);
  return root;
}

describe('THE BREATH (Gate 5): reincarnation, Lethe, the codex', () => {
  beforeEach(() => {
    clearTallies();
    localStorage.clear();
  });

  it('a first boot carries no memory, no forget control', () => {
    const root = freshMount();
    expect(root.querySelector('.memory')).toBeNull();
    expect(buttons(root, 'button.system').some((b) => b.dataset.systemId === 'forget_lives')).toBe(false);
  });

  it('a finished life is recorded locally with its verb, choices, and title', () => {
    const root = freshMount();
    for (const id of SPINE) clickChoice(root, id);
    expect(lifeCount()).toBe(1);
    const life = loadMemory()!.lives[0]!;
    expect(life.verb).toBe('spiral');
    expect(life.choices['B1']).toBe('lethe');
    expect(life.title).toBe('The Spiral-Walker');
    expect(life.day).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('the second incarnation is remembered on at least five surfaces — never at the first question', () => {
    let root = freshMount();
    for (const id of SPINE) clickChoice(root, id);

    root = freshMount(); // reincarnation
    const changed: string[] = [];
    // 1. boot greeting
    expect(root.querySelector('.memory')?.textContent).toContain('Last incarnation, you chose SPIRAL');
    changed.push('boot');
    clickChoice(root, 'begin');
    // §9.2: the first question — where the Vigil lives — carries NO memory.
    expect(root.querySelector('.memory')).toBeNull();
    clickChoice(root, 'yes');
    // 2. the light remembers
    expect(root.querySelector('.memory')?.textContent).toContain('Last time, you questioned the light');
    changed.push('a2');
    clickChoice(root, 'approach');
    // 3. the cart remembers
    expect(root.querySelector('.memory')?.textContent).toContain('Last time, you drank Lethe');
    changed.push('b1');
    for (const id of ['mnemosyne', 'take_number', 'answer', 'loved_well', 'both', 'accept']) {
      clickChoice(root, id);
    }
    // 4. the Bard remembers your answer to its question
    expect(root.querySelector('.memory')?.textContent).toContain('You left the Bard be');
    changed.push('e1');
    clickChoice(root, 'free_it');
    clickChoice(root, 'stand');
    // 5. the verb desk remembers
    expect(root.querySelector('.memory')?.textContent).toContain('last time, you chose SPIRAL');
    changed.push('f1');
    expect(changed).toHaveLength(5);
  });

  it('a returning Ω soul is a caught exception, with escalating-rarity variants', () => {
    // An Ω life recorded through the real memory API (the full-ladder walk to
    // END GAME is exercised in vigil-flow; here we test the return greeting).
    recordLife(
      { node: 'omega_disclosure', flags: {}, committed: [{ node: 'omega', choice: 'end_game', tally: 'OMEGA' }], ended: true },
      'The Unprocessed',
    );
    let root = freshMount();
    expect(root.querySelector('.memory')?.textContent).toContain('You came back');
    expect(root.querySelector('.memory')?.textContent).toContain('Shall we begin again?');

    root = freshMount(); // and again
    expect(root.querySelector('.memory')?.textContent).toContain('Again and… again?');

    root = freshMount(); // and AGAIN
    expect(root.querySelector('.memory')?.textContent).toContain('stopped being surprised');
  });

  it('FORGET THESE LIVES is two-step, then the next boot is a first incarnation', () => {
    let root = freshMount();
    for (const id of SPINE) clickChoice(root, id);
    expect(localStorage.getItem('bardo_completed')).toBe('1');

    root = freshMount();
    clickSystem(root, 'forget_lives');
    // second sip of certainty: nothing forgotten yet
    expect(lifeCount()).toBe(1);
    clickSystem(root, 'keep_lives');
    expect(lifeCount()).toBe(1);
    clickSystem(root, 'forget_lives');
    clickSystem(root, 'confirm_forget');
    expect(lifeCount()).toBe(0);
    expect(localStorage.getItem('bardo_completed')).toBeNull();
    expect(root.querySelector('.memory')).toBeNull();
  });

  it('the codex is reachable from boot and from the profile', () => {
    const root = freshMount();
    expect(root.querySelector('a[data-system-id="codex_link"]')?.getAttribute('href')).toBe('./codex.html');
    for (const id of SPINE) clickChoice(root, id);
    expect(root.querySelector('.codex-link')?.getAttribute('href')).toBe('./codex.html');
  });

  it('the codex gates its lineage entry behind a completed run', () => {
    document.body.innerHTML = '<div id="codex-room"></div>';
    const room = document.getElementById('codex-room') as HTMLElement;
    mountCodex(room, { getItem: () => null });
    expect(room.textContent).toContain('sealed until you have finished a game');
    expect(room.textContent).not.toContain('deepest structural borrowing');
    expect(room.textContent).toContain('deeds, not people');

    mountCodex(room, { getItem: (k) => (k === 'bardo_completed' ? '1' : null) });
    expect(room.textContent).toContain('deepest structural borrowing');
    expect(room.textContent).toContain('Bardo Thodol');
  });

  it('audio never autoplays: the toggle exists, off, and no context before a click', () => {
    freshMount();
    const toggle = document.querySelector('.audio-toggle')!;
    expect(toggle.textContent).toBe('SOUND: OFF');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    expect((globalThis as { __bardoAudioStarted?: boolean }).__bardoAudioStarted).toBeUndefined();
    // jsdom has no AudioContext: clicking stays silent AND stays off — the
    // no-WebAudio failure mode is also authored.
    (toggle as HTMLButtonElement).click();
    expect(toggle.textContent).toBe('SOUND: OFF');
  });

  it('storage-blocked environments still play: an unrecorded incarnation', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage')!;
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('blocked');
      },
    });
    try {
      const root = freshMount();
      clickChoice(root, 'begin');
      expect(root.textContent).toContain('A process identifying itself as YOU');
    } finally {
      Object.defineProperty(window, 'localStorage', original);
    }
  });
});
