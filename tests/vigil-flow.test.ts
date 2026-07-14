// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '../src/main';
import { clearTallies, pendingTallies } from '../src/engine/tally';
import schedule from '../content/vigil/schedule.json';

const ENDGAME_AT = schedule.rungs.find((r) => r.id === 'endgame')!.afterMs;

function buttons(root: HTMLElement, selector: string): HTMLButtonElement[] {
  return Array.from(root.querySelectorAll<HTMLButtonElement>(selector));
}

function clickChoice(root: HTMLElement, choiceId: string): void {
  const button = buttons(root, 'button.choice').find((b) => b.dataset.choiceId === choiceId);
  if (!button) throw new Error(`No choice button: ${choiceId}`);
  button.click();
}

function clickRung(root: HTMLElement, rungId: string): void {
  const button = buttons(root, 'button').find((b) => b.dataset.rungId === rungId);
  if (!button) throw new Error(`No rung button: ${rungId}`);
  button.click();
}

let hidden = false;
function setHidden(value: boolean): void {
  hidden = value;
  document.dispatchEvent(new Event('visibilitychange'));
}

describe('THE VIGIL (Gate 2)', () => {
  let root: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    clearTallies();
    hidden = false;
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
    document.body.innerHTML = '<div id="bardo"></div>';
    root = document.getElementById('bardo') as HTMLElement;
    mount(root);
    clickChoice(root, 'begin');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('stillness grows the ladder in authored order; options accrete and never expire', () => {
    expect(buttons(root, 'button[data-rung-id]')).toHaveLength(0);

    vi.advanceTimersByTime(44_750); // first beat at 45s (P0-4)
    expect(buttons(root, 'button[data-rung-id]')).toHaveLength(0);
    vi.advanceTimersByTime(250);
    expect(buttons(root, 'button').find((b) => b.dataset.rungId === 'patience')).toBeDefined();
    expect(root.textContent).toContain('The desk is very good at fine');

    vi.advanceTimersByTime(ENDGAME_AT - 45_000);
    const rungIds = buttons(root, 'button[data-rung-id]').map((b) => b.dataset.rungId);
    expect(rungIds).toEqual([
      'patience', 'fear', 'temptation', 'desire', 'hope',
      'loss', 'guilt', 'conformity', 'plea', 'endgame',
    ]);
    // The original four options never expired — zero required reaction time.
    const choiceIds = buttons(root, 'button.choice:not([data-rung-id])').map((b) => b.dataset.choiceId);
    expect(choiceIds).toEqual(['yes', 'no', 'define_you', 'who_is_asking']);
    // The Vigil's live region is announced politely.
    expect(root.querySelector('.vigil-log')?.getAttribute('aria-live')).toBe('polite');
  });

  it('END GAME walks into a faceless light, tallies Ω, closes the desk, and files The Unprocessed', () => {
    vi.advanceTimersByTime(ENDGAME_AT);
    clickRung(root, 'endgame');
    expect(root.textContent).toContain('The light does not take a shape');
    expect(buttons(root, 'button.door')).toHaveLength(0); // outside the game's frame
    expect(pendingTallies()).toContainEqual({ node: 'OMEGA', choice: 'end_game' });

    clickChoice(root, 'go_on');
    expect(root.textContent).toContain('I retract');
    expect(root.textContent).toContain('THE DESK IS CLOSED');
    expect(root.textContent).toContain('The Unprocessed');
    expect(root.textContent).toContain('the cart never reached you');
    // The closed desk keeps exactly one affordance: the blank glyph (Compass
    // §4.2 — the rarest glyph is shareable). No choices, no doors, no ledger.
    expect(buttons(root, 'button.choice')).toHaveLength(0);
    expect(buttons(root, 'button.door')).toHaveLength(0);
    const systems = buttons(root, 'button.system').map((b) => b.dataset.systemId);
    expect(systems).toEqual(['copy_glyph']);
    expect(root.textContent).not.toContain('THE LEDGER, IN FULL');
    expect(document.querySelector('.crisis a')?.getAttribute('href')).toContain('findahelpline');
  });

  it('clicking a rung folds into normal play: V tally, posture flag, ack line, ladder gone for good', () => {
    vi.advanceTimersByTime(120_000); // patience (45s) + fear (120s) on screen
    clickRung(root, 'fear');

    expect(pendingTallies()).toContainEqual({ node: 'V', choice: 'fear' });
    expect(root.textContent).toContain('Let us be a moving target anyway');
    expect(root.textContent).toContain('A process identifying itself as YOU');
    expect(buttons(root, 'button[data-rung-id]')).toHaveLength(0);

    // The vigil is spent: ten more minutes of stillness grow nothing.
    vi.advanceTimersByTime(600_000);
    expect(buttons(root, 'button[data-rung-id]')).toHaveLength(0);

    // And normal play proceeds.
    clickChoice(root, 'yes');
    expect(root.textContent).toContain('There is a light');
  });

  it('the conformity rung shows no numbers before its lock, and only labeled census truth after', () => {
    const conformityAt = schedule.rungs.find((r) => r.id === 'conformity')!.afterMs;
    vi.advanceTimersByTime(conformityAt);
    const beat = root.querySelector('.vigil-log')!.textContent!;
    expect(beat).toContain('a very specific number');
    expect(beat).not.toMatch(/\d/); // reveal-after-lock holds even here

    clickRung(root, 'conformity');
    expect(pendingTallies()).toContainEqual({ node: 'V', choice: 'conformity' });
    expect(root.textContent).toContain('41,377 souls have completed'); // seeded last-census (P0-5)
    expect(root.textContent).toContain('(last census — the Ledger is unreachable)');
  });

  it('hidden-tab time does not advance the ladder, and the Bard notes it exactly once', () => {
    vi.advanceTimersByTime(30_000);
    setHidden(true);
    vi.advanceTimersByTime(600_000); // ten hidden minutes
    expect(buttons(root, 'button[data-rung-id]')).toHaveLength(0);

    setHidden(false);
    expect(root.textContent).toContain('The desk kept your place');

    vi.advanceTimersByTime(30_000); // 60s of *visible* stillness total
    expect(buttons(root, 'button').find((b) => b.dataset.rungId === 'patience')).toBeDefined();

    setHidden(true);
    setHidden(false);
    const mentions = root.textContent!.split('The desk kept your place').length - 1;
    expect(mentions).toBe(1); // exactly one dry joke — §4.3
  });

  it('the relational rungs volunteer a soft retraction if left un-clicked (P0-6)', () => {
    const log = () => root.querySelector('.vigil-log')!.textContent!;
    // Past hope (313s) and its retraction (353s), still waiting:
    vi.advanceTimersByTime(360_000);
    expect(log()).toContain('I do not truly know who is in that light');
    // Past loss (365s) and its retraction (405s):
    vi.advanceTimersByTime(50_000);
    expect(log()).toContain('grief is not a thing you are doing wrong');
    // The retractions stay digit-free (they share the pre-lock log).
    expect(log().replace(/[№]/g, '')).not.toMatch(/\d/);
  });

  it('clicking a rung cancels the pending relational retraction', () => {
    vi.advanceTimersByTime(313_000); // hope on screen, retraction not yet due
    clickRung(root, 'hope');
    vi.advanceTimersByTime(600_000); // the retraction clock is stopped with the vigil
    expect(root.textContent).not.toContain('I do not truly know who is in that light');
  });

  it('choosing a normal option or a door also ends the vigil for the run', () => {
    vi.advanceTimersByTime(60_000);
    clickChoice(root, 'define_you');
    expect(root.textContent).toContain('There is a light');
    vi.advanceTimersByTime(600_000);
    expect(buttons(root, 'button[data-rung-id]')).toHaveLength(0);
  });

  it('the crisis signpost is present from boot through the vigil', () => {
    expect(document.querySelector('.crisis')).not.toBeNull();
    vi.advanceTimersByTime(ENDGAME_AT);
    expect(document.querySelector('.crisis a')?.getAttribute('href')).toContain('findahelpline');
  });
});
