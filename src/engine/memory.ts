import type { GameState } from './types';

/**
 * Reincarnation (MDD v1 §14, Compass Phase 5): localStorage is the
 * reincarnation system. Persistence is optional by design — no feature may
 * hard-require storage; a blocked store is an unrecorded incarnation.
 * Everything here is local-only and never transmitted.
 */

const KEY = 'bardo_lives';

export interface Life {
  /** F1 choice, or 'omega' for the last door. */
  verb: string;
  /** Committed choice per tally key, for remembered lines + comparisons. */
  choices: Record<string, string>;
  title: string;
  /** Day-bucket only, even locally — for the long-absence line. */
  day: string;
}

export interface Memory {
  v: 1;
  lives: Life[];
  omegaReturns: number;
}

function store(): Storage | null {
  try {
    const probe = '__bardo_probe';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return localStorage;
  } catch {
    return null;
  }
}

export function loadMemory(): Memory | null {
  const s = store();
  if (!s) return null;
  try {
    const raw = s.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Memory;
    if (parsed.v !== 1 || !Array.isArray(parsed.lives)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function save(memory: Memory): void {
  try {
    store()?.setItem(KEY, JSON.stringify(memory));
  } catch {
    /* an unrecorded incarnation — by design */
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10); // day-bucket, local-only
}

/** Record a finished life. Call once per true ending. */
export function recordLife(state: GameState, title: string): void {
  const memory = loadMemory() ?? { v: 1 as const, lives: [], omegaReturns: 0 };
  const choices: Record<string, string> = {};
  for (const c of state.committed) {
    if (c.tally && !(c.tally in choices)) choices[c.tally] = c.choice;
  }
  const verb = choices['OMEGA'] ? 'omega' : choices['F1'] ?? 'unfiled';
  memory.lives.push({ verb, choices, title, day: today() });
  save(memory);
}

/** The greeting the desk owes a returning soul, if any. */
export function lastLife(): Life | null {
  const memory = loadMemory();
  return memory?.lives.at(-1) ?? null;
}

export function lifeCount(): number {
  return loadMemory()?.lives.length ?? 0;
}

/** Count a post-END-GAME return (the repeatable caught exception, OD-7). */
export function noteOmegaReturn(): number {
  const memory = loadMemory();
  if (!memory) return 1;
  memory.omegaReturns += 1;
  save(memory);
  return memory.omegaReturns;
}

/** More than ~two months of Earth time since the last life? */
export function longAbsence(): boolean {
  const last = lastLife();
  if (!last) return false;
  const elapsed = Date.now() - new Date(`${last.day}T00:00:00Z`).getTime();
  return elapsed > 60 * 24 * 60 * 60 * 1000;
}

/** Forget this life — the deliberate drink from Lethe (v1 §14.2, §20.3). */
export function forgetLives(): void {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem('bardo_completed');
  } catch {
    /* nothing stored, nothing to forget */
  }
}
