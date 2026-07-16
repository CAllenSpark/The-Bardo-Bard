// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '../src/main';
import { clearTallies } from '../src/engine/tally';
import { getIntake, recordLife } from '../src/engine/memory';
import type { GameState } from '../src/engine/types';
import { intakeDiff, outroText, personalize, sanitizeOther } from '../src/engine/intake';
import type { Survey } from '../src/engine/intake';
import surveyFile from '../content/survey/survey.json';

const SURVEY = surveyFile as unknown as Survey;

function resetStorage(): void {
  try {
    localStorage.removeItem('bardo_lives');
    localStorage.removeItem('bardo_completed');
  } catch {
    /* nothing to reset */
  }
}

function seedLife(): void {
  const state: GameState = {
    node: 'end_spiral',
    flags: {},
    ended: true,
    committed: [
      { node: 'a2_light', choice: 'approach', tally: 'A2' },
      { node: 'b1_beverage_cart', choice: 'lethe', tally: 'B1' },
      { node: 'end_spiral', choice: 'spiral', tally: 'F1' },
    ],
  };
  recordLife(state, 'The Spiral-Walker');
}

function freshMount(): HTMLElement {
  document.body.innerHTML = '<div id="bardo"></div>';
  const root = document.getElementById('bardo') as HTMLElement;
  mount(root);
  return root;
}

const act = (root: HTMLElement, a: string): HTMLButtonElement | null =>
  root.querySelector(`button[data-survey-act="${a}"]`);

describe('THE RETURNING-CUSTOMER INTAKE (§15 / OD-14): local-only Mad-Libs', () => {
  beforeEach(() => {
    clearTallies();
    resetStorage();
  });

  // ── the free-text guardrail ────────────────────────────────────────────────
  it('sanitizeOther strips control characters and markup, caps length, skips empties', () => {
    expect(sanitizeOther('  lemonade  ')).toBe('lemonade');
    expect(sanitizeOther('a\nb\tc')).toBe('a b c');
    expect(sanitizeOther('<script>x</script>')).toBe('script x /script'); // angle brackets gone
    expect(sanitizeOther('')).toBeNull();
    expect(sanitizeOther('     ')).toBeNull();
    expect(sanitizeOther('z'.repeat(200))!.length).toBe(40);
  });

  // ── injection is pure substitution, and only where answered ────────────────
  it('personalize injects a stored answer only at its node, only when answered', () => {
    const intake = { place: { value: 'in a library', source: 'preset' as const } };
    const line = personalize('a2_light', SURVEY, intake);
    expect(line).toContain('in a library');
    expect(line).not.toContain('{value}');
    expect(personalize('a2_light', SURVEY, null)).toBeUndefined(); // no intake
    expect(personalize('b1_beverage_cart', SURVEY, intake)).toBeUndefined(); // needs `drink`
    expect(personalize('boot_notice', SURVEY, intake)).toBeUndefined(); // no injection there
  });

  // ── nothing is collected that is never spoken ──────────────────────────────
  it('every question the survey asks is injected somewhere in the run', () => {
    const injectedVars = new Set(Object.values(SURVEY.injections).map((i) => i.var));
    for (const q of SURVEY.questions) {
      expect(injectedVars.has(q.id), `question "${q.id}" is collected but never spoken`).toBe(true);
    }
    // and the newly-wired nodes speak their variable
    expect(personalize('d1_review', SURVEY, { joy: { value: 'a good pen', source: 'preset' } })).toContain('a good pen');
    expect(personalize('c0_dept_intro', SURVEY, { weather: { value: 'fog', source: 'preset' } })).toContain('fog');
  });

  // ── the diff gently favors variety, and never invents a change ─────────────
  it('intakeDiff compares only answers given both times', () => {
    expect(intakeDiff(null, { drink: { value: 'lemonade', source: 'preset' } }).hadPrior).toBe(false);
    const changed = intakeDiff(
      { drink: { value: 'lemonade', source: 'preset' } },
      { drink: { value: 'pepsi', source: 'other' } },
    );
    expect(changed.allSame).toBe(false);
    expect(changed.changes).toEqual([{ was: 'lemonade', now: 'pepsi' }]);
    const same = intakeDiff(
      { drink: { value: 'lemonade', source: 'preset' } },
      { drink: { value: 'lemonade', source: 'preset' } },
    );
    expect(same.allSame).toBe(true);
    // a newly-answered question is not a "change" — nothing to change from
    const fresh = intakeDiff(
      { drink: { value: 'lemonade', source: 'preset' } },
      { place: { value: 'by the sea', source: 'preset' } },
    );
    expect(fresh.changes).toEqual([]);
    expect(fresh.allSame).toBe(false);
    expect(outroText(SURVEY, changed)).toContain('lemonade became pepsi');
    expect(outroText(SURVEY, same)).toContain(SURVEY.outro.unchanged_all);
  });

  // ── the intake is a returning-customer courtesy ────────────────────────────
  it('the intake is offered only from the second visit', () => {
    expect(freshMount().querySelector('button[data-system-id="intake"]')).toBeNull();
    seedLife();
    expect(freshMount().querySelector('button[data-system-id="intake"]')).not.toBeNull();
  });

  // ── the whole flow: answer (incl. OTHER), inject, then note the change ──────
  it('an answer in your own words comes back in the Bard\'s mouth, then a change is noted', () => {
    seedLife();
    let root = freshMount();
    (root.querySelector('button[data-system-id="intake"]') as HTMLButtonElement).click();
    act(root, 'next')!.click(); // intro → first question (drink)

    // answer the first question (drink) in the player's own words
    act(root, 'other')!.click();
    const field = root.querySelector('input[data-survey-input="other"]') as HTMLInputElement;
    field.value = 'Pepsi';
    act(root, 'file')!.click();
    // skip the rest to reach the outro
    for (let i = 0; i < SURVEY.questions.length && act(root, 'skip'); i += 1) act(root, 'skip')!.click();
    expect(getIntake()?.drink).toEqual({ value: 'Pepsi', source: 'other' });
    act(root, 'back')!.click(); // outro → the desk

    // play into the beverage cart; the desk uses the player's own word
    (root.querySelector('button[data-choice-id="begin"]') as HTMLButtonElement).click();
    (root.querySelector('button[data-choice-id="yes"]') as HTMLButtonElement).click();
    (root.querySelector('button[data-choice-id="approach"]') as HTMLButtonElement).click();
    const memory = root.querySelector('.memory')?.textContent ?? '';
    expect(memory).toContain('reaches for Pepsi');

    // a second intake that changes the answer is noted, favoring variety
    root = freshMount();
    (root.querySelector('button[data-system-id="intake"]') as HTMLButtonElement).click();
    act(root, 'next')!.click();
    (root.querySelector('button[data-opt-id="lemonade"]') as HTMLButtonElement).click(); // drink → lemonade
    for (let i = 0; i < SURVEY.questions.length && act(root, 'skip'); i += 1) act(root, 'skip')!.click();
    const outro = root.querySelector('.bard-text')?.textContent ?? '';
    expect(outro).toContain('Pepsi became lemonade');
    expect(getIntake()?.drink).toEqual({ value: 'lemonade', source: 'preset' });
  });
});
