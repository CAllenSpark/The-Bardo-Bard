// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '../src/main';
import { clearTallies, pendingTallies } from '../src/engine/tally';
import { clearCensusCache, configureCensus } from '../src/engine/census';
import manifest from '../worker/manifest.json';

function buttons(root: HTMLElement, selector: string): HTMLButtonElement[] {
  return Array.from(root.querySelectorAll<HTMLButtonElement>(selector));
}

function clickChoice(root: HTMLElement, choiceId: string): void {
  const button = buttons(root, 'button.choice').find((b) => b.dataset.choiceId === choiceId);
  if (!button) throw new Error(`No choice button: ${choiceId}`);
  button.click();
}

const SPINE = ['begin', 'define_you', 'question', 'tap_water', 'take_number',
  'silence', 'none_define', 'refuse_frame', 'accept', 'leave_it_be', 'stand', 'witness'];

// Tally keys locked so far, updated as we walk — the reveal on screen may
// only ever reference one of these (Gate 3: reveal after lock, never before).
const LOCKS_BY_STEP: Record<string, string> = {
  begin: '', define_you: 'A1', question: 'A2', tap_water: 'B1', take_number: 'B1',
  silence: 'C1', none_define: 'D1', refuse_frame: 'D2', accept: 'D3',
  leave_it_be: 'E1', stand: 'E1', witness: 'F1',
};

describe('reveal-after-lock and the offline census (Gate 3)', () => {
  let root: HTMLElement;

  beforeEach(() => {
    clearTallies();
    clearCensusCache();
    configureCensus({ url: '', fetcher: undefined });
    document.body.innerHTML = '<div id="bardo"></div>';
    root = document.getElementById('bardo') as HTMLElement;
    mount(root);
  });

  it('never renders a node aggregate before that node locks, across the full spine', () => {
    const locked = new Set<string>();
    for (const step of SPINE) {
      // Before clicking: any reveal on screen must belong to an already-locked key.
      for (const reveal of Array.from(root.querySelectorAll('.ledger-reveal'))) {
        expect(locked.has((reveal as HTMLElement).dataset.node!)).toBe(true);
      }
      clickChoice(root, step);
      if (LOCKS_BY_STEP[step]) locked.add(LOCKS_BY_STEP[step]!);
    }
  });

  it('shows the labeled cold-start reveal after a lock, offline', () => {
    clickChoice(root, 'begin');
    expect(root.querySelector('.ledger-reveal')).toBeNull(); // nothing locked but boot
    clickChoice(root, 'yes'); // locks A1
    const reveal = root.querySelector('.ledger-reveal') as HTMLElement;
    expect(reveal.dataset.node).toBe('A1');
    expect(reveal.textContent).toContain('THE LEDGER IS YOUNG');
    expect(reveal.textContent).toContain('traveler №1');
    expect(reveal.textContent).toContain('(last census — the Ledger is unreachable)');
  });

  it('a full offline playthrough completes with the full ledger, labeled', () => {
    for (const step of SPINE) clickChoice(root, step);
    expect(root.textContent).toContain('— SOUL RECORD —');
    expect(root.textContent).toContain('THE LEDGER, IN FULL:');
    expect(root.textContent).toContain('The Ledger is young here');
    expect(root.textContent).toContain('You are soul №1');
    expect(root.textContent).toContain('(last census — the Ledger is unreachable)');
  });

  it('a finished run queues completions/done exactly once, plus its F1 tally', () => {
    for (const step of SPINE) clickChoice(root, step);
    const events = pendingTallies();
    expect(events.filter((e) => e.node === 'completions')).toEqual([{ node: 'completions', choice: 'done' }]);
    expect(events).toContainEqual({ node: 'F1', choice: 'witness' });
  });

  it('percentages render once a node has 500+ souls', async () => {
    const counts = { A1: { yes: 400, no: 200, define_you: 300, who_is_asking: 100 } };
    configureCensus({
      url: 'https://ledger.test',
      fetcher: async () => ({ status: 200, json: async () => counts }),
    });
    const { refreshCensus } = await import('../src/engine/census');
    await refreshCensus(['A1']);
    clickChoice(root, 'begin');
    clickChoice(root, 'no');
    const reveal = root.querySelector('.ledger-reveal') as HTMLElement;
    expect(reveal.textContent).toContain('Of 1,000 souls before you');
    expect(reveal.textContent).toContain('Y 40%');
    expect(reveal.textContent).not.toContain('unreachable');
  });

  it('the totenpass round-trips through the UI: export at an ending, import at boot', () => {
    for (const step of SPINE) clickChoice(root, step);
    const exportButton = buttons(root, 'button.system').find((b) => b.dataset.systemId === 'export_totenpass')!;
    exportButton.click();
    const token = root.querySelector('.totenpass-token')!.textContent!;
    expect(token.startsWith('BB1.')).toBe(true);

    // A fresh desk, another browser, the same soul.
    document.body.innerHTML = '<div id="bardo"></div>';
    const fresh = document.getElementById('bardo') as HTMLElement;
    mount(fresh);
    buttons(fresh, 'button.system').find((b) => b.dataset.systemId === 'import_totenpass')!.click();
    (fresh.querySelector('.totenpass-input') as HTMLInputElement).value = token;
    buttons(fresh, 'button.system').find((b) => b.dataset.systemId === 'restore_totenpass')!.click();
    expect(fresh.textContent).toContain('The Long-Seated');
    expect(fresh.textContent).toContain('— SOUL RECORD —');
  });

  it('a bad totenpass gets the desk’s apology, not a crash', () => {
    buttons(root, 'button.system').find((b) => b.dataset.systemId === 'import_totenpass')!.click();
    (root.querySelector('.totenpass-input') as HTMLInputElement).value = 'BB1.garbage!!!';
    buttons(root, 'button.system').find((b) => b.dataset.systemId === 'restore_totenpass')!.click();
    expect(root.textContent).toContain('another underworld');
    expect(root.textContent).toContain('NOTICE, FILED IN PLAIN LANGUAGE');
  });

  it('the omega path stays quiet: no census recap, no export chrome', () => {
    // reach omega via a direct vigil walk is covered in vigil tests; here we
    // assert the played ending DOES get chrome that omega must not (guard the contrast)
    for (const step of SPINE) clickChoice(root, step);
    expect(root.querySelector('.full-ledger')).not.toBeNull();
    expect(buttons(root, 'button.system').some((b) => b.dataset.systemId === 'export_totenpass')).toBe(true);
  });

  it('manifest keys refreshed at boot cover every tally the game can emit', () => {
    const emittable = new Set(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'D3', 'E1', 'F1', 'V', 'OMEGA', 'completions']);
    expect(new Set(Object.keys(manifest))).toEqual(emittable);
  });
});
