import seedFile from '../../content/census/seed.json';

/**
 * Census access (Phase 2: offline seed only; Phase 3 adds the live Ledger).
 * Sacred-Ledger rules apply even to the stub: only real numbers, always
 * labeled when they come from the seed instead of the live Ledger, and only
 * non-node aggregates before a lock (Compass §4.4).
 */

interface SeedCensus {
  label: string;
  counts: { completions: number };
}

const SEED = seedFile as unknown as SeedCensus;

export interface Census {
  completions: number;
  /** Empty when live; the degraded-mode label when served from the seed. */
  label: string;
}

export function getCensus(): Census {
  return { completions: SEED.counts.completions, label: SEED.label };
}

/** Fill census placeholders in authored copy (the conformity acknowledgment). */
export function fillCensus(template: string, census: Census = getCensus()): string {
  return template
    .replace(/\{COMPLETIONS\}/g, String(census.completions))
    .replace(/\{CENSUS_LABEL\}/g, census.label)
    .replace(/  +/g, ' ');
}
