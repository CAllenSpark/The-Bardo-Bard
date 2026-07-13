import manifestFile from '../worker/manifest.json';
import seedFile from '../content/census/seed.json';

/**
 * THE LEDGER — public reading room (Compass §3 Layer C, OD-11 resolved):
 * headlines only in public — souls served, plus one unexplained row. The
 * waiting exit is never acknowledged as a path; it is only ever a number.
 * Per-node splits unlock after a completed run on this browser.
 */

const MANIFEST = manifestFile as Record<string, string[]>;
const SEED = seedFile as unknown as { label: string; counts: { completions: number } };

type Fetcher = (url: string) => Promise<{ status: number; json(): Promise<unknown> }>;

export interface DashboardDeps {
  url: string;
  fetcher?: Fetcher;
  storage?: Pick<Storage, 'getItem'>;
}

type Counts = Record<string, Record<string, number>>;

async function loadCounts(deps: DashboardDeps, nodes: string[]): Promise<{ counts: Counts; live: boolean }> {
  const doFetch = deps.fetcher ?? (typeof fetch !== 'undefined' ? fetch : null);
  if (doFetch && deps.url) {
    try {
      const response = await doFetch(`${deps.url}/tally?nodes=${nodes.join(',')}`);
      if (response.status === 200) {
        return { counts: (await response.json()) as Counts, live: true };
      }
    } catch {
      /* fall through to the seed */
    }
  }
  return { counts: { completions: { done: SEED.counts.completions } }, live: false };
}

function line(className: string, text: string): HTMLElement {
  const p = document.createElement('p');
  p.className = className;
  p.textContent = text;
  return p;
}

export async function renderDashboard(root: HTMLElement, deps: DashboardDeps): Promise<void> {
  let unlocked = false;
  try {
    unlocked = (deps.storage ?? localStorage).getItem('bardo_completed') === '1';
  } catch {
    unlocked = false;
  }

  const nodes = unlocked ? Object.keys(MANIFEST) : ['completions', 'OMEGA'];
  const { counts, live } = await loadCounts(deps, nodes);

  root.textContent = '';
  root.appendChild(line('room-title', 'THE LEDGER — PUBLIC READING ROOM'));

  const served = Object.values(counts['completions'] ?? {}).reduce((a, b) => a + b, 0);
  const departed = Object.values(counts['OMEGA'] ?? {}).reduce((a, b) => a + b, 0);
  root.appendChild(line('headline', `SOULS SERVED: ${served.toLocaleString('en-US')}`));
  root.appendChild(line('headline unexplained', `DEPARTED WITHOUT FILING: ${departed.toLocaleString('en-US')}`));
  if (!live) root.appendChild(line('census-label', SEED.label));

  if (unlocked && live) {
    const splits = document.createElement('section');
    splits.className = 'splits';
    splits.appendChild(line('splits-title', 'THE CENSUS, BY QUESTION — unlocked by your completed run:'));
    for (const node of Object.keys(MANIFEST)) {
      if (node === 'completions' || node === 'OMEGA') continue;
      const nodeCounts = counts[node] ?? {};
      const total = Object.values(nodeCounts).reduce((a, b) => a + b, 0);
      const parts = Object.entries(nodeCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([choice, count]) =>
          total > 0
            ? `${choice.replace(/_/g, ' ').toUpperCase()} ${Math.round((count / total) * 100)}%`
            : choice.toUpperCase(),
        );
      splits.appendChild(line('split-row', `${node} · ${total > 0 ? parts.join(' · ') : 'no souls yet'}`));
    }
    root.appendChild(splits);
  } else {
    root.appendChild(
      line('locked', 'Per-node breakdowns unlock after a completed run. The desk keeps its rule.'),
    );
  }

  const back = document.createElement('a');
  back.href = './index.html';
  back.className = 'back';
  back.textContent = '→ THE DESK';
  root.appendChild(back);
}

// Browser entry; tests call renderDashboard directly.
const rootEl = typeof document !== 'undefined' ? document.getElementById('ledger-room') : null;
if (rootEl) {
  const url = (globalThis as { BARDO_LEDGER_URL?: string }).BARDO_LEDGER_URL ?? '';
  void renderDashboard(rootEl, { url });
}
