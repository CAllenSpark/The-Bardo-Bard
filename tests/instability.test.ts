// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '../src/main';
import { clearTallies } from '../src/engine/tally';
import { Glitch } from '../src/ui/glitch';
import type { GlitchContent } from '../src/ui/glitch';
import instabilityFile from '../content/instability/instability.json';

const INSTABILITY = instabilityFile as unknown as GlitchContent;

function resetStorage(): void {
  try {
    localStorage.removeItem('bardo_lives');
    localStorage.removeItem('bardo_completed');
  } catch {
    /* nothing to reset */
  }
}

function harness(): { root: HTMLElement; stage: HTMLElement; blot: { glitch: ReturnType<typeof vi.fn> } } {
  document.body.innerHTML =
    '<div id="bardo"><div class="scroll-region"><div id="stage">' +
    '<main class="screen"><div class="choices">' +
    '<button class="choice" data-choice-id="real">[ real ]</button>' +
    '</div></main></div></div></div>';
  return {
    root: document.getElementById('bardo') as HTMLElement,
    stage: document.getElementById('stage') as HTMLElement,
    blot: { glitch: vi.fn() },
  };
}

describe('THE INSTABILITY LAYER (CD 2026-07-16; OD-16): unstable, and inert where it must be', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ── the flicker copy can never read as Ledger truth ────────────────────────
  it('the copy is well-formed and digit-free (Compass §4.4)', () => {
    expect(INSTABILITY.asides.length).toBeGreaterThan(0);
    for (const a of INSTABILITY.asides) {
      expect(typeof a).toBe('string');
      expect(a.trim()).not.toBe('');
      expect(a).not.toMatch(/\d/);
    }
    expect(INSTABILITY.phantoms.length).toBeGreaterThan(0);
    for (const p of INSTABILITY.phantoms) {
      expect(p.label).toBeTruthy();
      expect(p.apology).toBeTruthy();
      expect(`${p.label}${p.apology}`).not.toMatch(/\d/);
    }
  });

  // ── THE INVARIANT: the deterministic core never sees a glitch ──────────────
  it('never injects a glitch into a jsdom playthrough (real-browser-only)', () => {
    clearTallies();
    resetStorage();
    document.body.innerHTML = '<div id="bardo"></div>';
    const root = document.getElementById('bardo') as HTMLElement;
    mount(root);
    (root.querySelector('button.choice[data-choice-id="begin"]') as HTMLButtonElement).click();
    expect(document.querySelector('.phantom')).toBeNull();
    expect(document.querySelector('.desk-aside')).toBeNull();
    expect(document.body.querySelector('.desk-glitch')).toBeNull();
  });

  // ── driven directly (as a real browser would): it disturbs, then heals ─────
  it('a flicker shudders the desk and drops a spoken aside, then clears', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // fire proceeds; run → aside
    const { root, stage, blot } = harness();
    const g = new Glitch({ root, stage, blot, canGlitch: () => true, content: INSTABILITY });
    g.start();
    vi.advanceTimersByTime(52600); // past the first-arm delay → one disturbance
    const aside = stage.querySelector('.desk-aside');
    expect(aside).not.toBeNull();
    expect(aside!.getAttribute('role')).toBe('status'); // the Bard speaks — announced
    expect(INSTABILITY.asides).toContain(aside!.textContent);
    expect(blot.glitch).toHaveBeenCalled();
    expect(root.classList.contains('desk-glitch')).toBe(true);
    vi.advanceTimersByTime(6000); // the aside fades and is removed; the desk settles
    expect(stage.querySelector('.desk-aside')).toBeNull();
    expect(root.classList.contains('desk-glitch')).toBe(false);
    g.stop();
  });

  it('a phantom option is inert theatre: aria-hidden, unfocusable, self-removing', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.4); // fire proceeds; run → phantom
    const { root, stage, blot } = harness();
    const g = new Glitch({ root, stage, blot, canGlitch: () => true, content: INSTABILITY });
    g.start();
    vi.advanceTimersByTime(49100); // → the phantom flickers in
    const phantom = stage.querySelector('button.phantom') as HTMLButtonElement;
    expect(phantom).not.toBeNull();
    expect(phantom.getAttribute('aria-hidden')).toBe('true'); // never chased by SR / keyboard
    expect(phantom.tabIndex).toBe(-1);
    expect(phantom.dataset.choiceId).toBeUndefined(); // no real id — it cannot advance state
    // touching it only withdraws it, apologetically — it has no handler but its own
    phantom.click();
    vi.advanceTimersByTime(500);
    expect(stage.querySelector('button.phantom')).toBeNull();
    expect(stage.querySelector('.desk-aside[aria-hidden="true"]')).not.toBeNull(); // the apology
    g.stop();
  });

  it('respects canGlitch: nothing appears when the moment forbids it', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const { root, stage, blot } = harness();
    const g = new Glitch({ root, stage, blot, canGlitch: () => false, content: INSTABILITY });
    g.start();
    vi.advanceTimersByTime(200000);
    expect(stage.querySelector('.desk-aside')).toBeNull();
    expect(stage.querySelector('.phantom')).toBeNull();
    g.stop();
  });
});
