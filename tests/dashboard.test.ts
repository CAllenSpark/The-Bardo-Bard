// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { renderDashboard } from '../src/dashboard';

const LIVE_COUNTS = {
  completions: { done: 41377 },
  OMEGA: { end_game: 289 },
  A1: { yes: 20000, no: 5000, define_you: 10000, who_is_asking: 6377 },
};

function fetcherFor(counts: unknown) {
  return async () => ({ status: 200, json: async () => counts });
}

const noStorage = { getItem: () => null };
const completedStorage = { getItem: (k: string) => (k === 'bardo_completed' ? '1' : null) };

describe('the Ledger dashboard (Gate 3, OD-11 scope)', () => {
  let root: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '<div id="ledger-room"></div>';
    root = document.getElementById('ledger-room') as HTMLElement;
  });

  it('public face: souls served + the unexplained row, nothing else', async () => {
    await renderDashboard(root, { url: 'https://ledger.test', fetcher: fetcherFor(LIVE_COUNTS), storage: noStorage });
    expect(root.textContent).toContain('SOULS SERVED: 41,377');
    expect(root.textContent).toContain('DEPARTED WITHOUT FILING: 289');
    // The waiting exit is never acknowledged as a path — only a number.
    expect(root.textContent).not.toMatch(/vigil|wait|END GAME/i);
    expect(root.textContent).toContain('Per-node breakdowns unlock after a completed run');
    expect(root.textContent).not.toContain('A1');
  });

  it('per-node splits unlock after a completed run on this browser', async () => {
    await renderDashboard(root, { url: 'https://ledger.test', fetcher: fetcherFor(LIVE_COUNTS), storage: completedStorage });
    expect(root.textContent).toContain('THE CENSUS, BY QUESTION');
    expect(root.textContent).toContain('A1 · YES 48%');
  });

  it('unreachable Ledger degrades to the labeled seed floor (P0-5)', async () => {
    await renderDashboard(root, {
      url: 'https://ledger.test',
      fetcher: async () => { throw new Error('down'); },
      storage: noStorage,
    });
    // The seeded last-census carries weight instead of 0/0, always labeled.
    expect(root.textContent).toContain('SOULS SERVED: 41,377');
    expect(root.textContent).toContain('DEPARTED WITHOUT FILING: 289');
    expect(root.textContent).toContain('(last census — the Ledger is unreachable)');
  });
});
