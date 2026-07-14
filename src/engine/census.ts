import seedFile from '../../content/census/seed.json';

/**
 * Census access (Compass §7). A small cache over GET /tally with the labeled
 * seed as fallback: reads are synchronous (render never waits), refreshes are
 * background fire-and-forget. Sacred rules: real numbers only; anything not
 * confirmed live carries the degraded-mode label.
 */

interface SeedCensus {
  label: string;
  counts: Record<string, number | Record<string, number>>;
}

const SEED = seedFile as unknown as SeedCensus;

type Fetcher = (url: string) => Promise<{ status: number; json(): Promise<unknown> }>;

let endpoint = '';
let fetcher: Fetcher | null = null;
const live = new Map<string, Record<string, number>>();

export function configureCensus(options: { url?: string; fetcher?: Fetcher }): void {
  if (options.url !== undefined) endpoint = options.url;
  if (options.fetcher !== undefined) fetcher = options.fetcher;
}

export interface NodeCensus {
  counts: Record<string, number>;
  total: number;
  /** Empty when live; the degraded-mode label otherwise. */
  label: string;
}

function seedCounts(node: string): Record<string, number> {
  const entry = SEED.counts[node];
  if (typeof entry === 'number') return { done: entry };
  return entry ?? {};
}

/** Synchronous read: live cache if we have it, else the labeled seed. */
export function getNodeCensus(node: string): NodeCensus {
  const counts = live.get(node) ?? seedCounts(node);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return { counts, total, label: live.has(node) ? '' : SEED.label };
}

/** Background refresh; resolves true when live data landed. Never throws. */
export async function refreshCensus(nodes: string[]): Promise<boolean> {
  const doFetch = fetcher ?? (typeof fetch !== 'undefined' ? fetch : null);
  if (!doFetch || !endpoint || nodes.length === 0) return false;
  try {
    const response = await doFetch(`${endpoint}/tally?nodes=${nodes.join(',')}`);
    if (response.status !== 200) return false;
    const data = (await response.json()) as Record<string, Record<string, number>>;
    for (const [node, counts] of Object.entries(data)) live.set(node, counts);
    return true;
  } catch {
    return false;
  }
}

export function clearCensusCache(): void {
  live.clear();
}

// ── Back-compat for the Vigil's conformity acknowledgment ──────────────────

export interface Census {
  completions: number;
  label: string;
}

export function getCensus(): Census {
  const { counts, label } = getNodeCensus('completions');
  return { completions: counts['done'] ?? 0, label };
}

/** Fill census placeholders in authored copy (the conformity acknowledgment). */
export function fillCensus(template: string, census: Census = getCensus()): string {
  return template
    .replace(/\{COMPLETIONS\}/g, census.completions.toLocaleString('en-US'))
    .replace(/\{CENSUS_LABEL\}/g, census.label)
    .replace(/  +/g, ' ')
    .replace(/ \./g, '.');
}
