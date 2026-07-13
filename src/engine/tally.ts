import type { CommittedChoice } from './types';

/**
 * Tally client (Compass §7). Fire-and-forget: the game NEVER blocks on the
 * network. Failed sends are retried exactly once, then dropped — tallies are
 * a census, not a ledger of record for the player.
 * With no endpoint configured the client is a silent queue (offline by design).
 */

export interface TallyEvent {
  node: string;
  choice: string;
}

type Fetcher = (url: string, init?: RequestInit) => Promise<{ status: number }>;

let endpoint = '';
let fetcher: Fetcher | null = null;
const log: TallyEvent[] = []; // every event this session emitted, permanently
const outbox: TallyEvent[] = []; // events awaiting a send
let flushing = false;

export function configureTally(options: { url?: string; fetcher?: Fetcher }): void {
  if (options.url !== undefined) endpoint = options.url;
  if (options.fetcher !== undefined) fetcher = options.fetcher;
}

async function post(event: TallyEvent): Promise<boolean> {
  const doFetch = fetcher ?? (typeof fetch !== 'undefined' ? fetch : null);
  if (!doFetch || !endpoint) return false;
  try {
    const response = await doFetch(`${endpoint}/tally`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    return response.status === 204;
  } catch {
    return false;
  }
}

async function flush(): Promise<void> {
  if (flushing) return;
  flushing = true;
  try {
    while (outbox.length > 0) {
      const event = outbox[0]!;
      // one retry, then the census simply misses a bead — never the game.
      const ok = (await post(event)) || (await post(event));
      if (ok || endpoint) {
        outbox.shift();
      }
      if (!ok) break; // offline-by-config keeps its queue for a later flush
    }
  } finally {
    flushing = false;
  }
}

/** Emit a tally for a committed choice. No-op for untallied commitments. */
export function recordTally(entry: CommittedChoice): void {
  if (!entry.tally) return;
  queueTally(entry.tally, entry.choice);
}

/** Emit a bare tally event (e.g. completions/done). */
export function queueTally(node: string, choice: string): void {
  const event = { node, choice };
  log.push(event);
  outbox.push(event);
  void flush();
}

/** Every event emitted this session — tests and diagnostics. */
export function pendingTallies(): readonly TallyEvent[] {
  return log;
}

export function clearTallies(): void {
  log.length = 0;
  outbox.length = 0;
}
