import type { CommittedChoice } from './types';

/**
 * Tally client — Phase 2 stub. Records the exact events the Phase 3 Worker
 * will receive ({node-key, choice} only; nothing else ever). The game never
 * blocks on this; the queue is fire-and-forget by design.
 */

export interface TallyEvent {
  node: string;
  choice: string;
}

const queue: TallyEvent[] = [];

/** Emit a tally for a committed choice. No-op for untallied commitments. */
export function recordTally(entry: CommittedChoice): void {
  if (!entry.tally) return;
  queue.push({ node: entry.tally, choice: entry.choice });
}

/** Exposed for tests and, later, the Phase 3 flush loop. */
export function pendingTallies(): readonly TallyEvent[] {
  return queue;
}

export function clearTallies(): void {
  queue.length = 0;
}
