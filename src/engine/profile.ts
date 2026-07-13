import type { GameState } from './types';
import profilesFile from '../../content/profiles/profiles.json';

/**
 * The soul record (Compass §6 / MDD v2 §6): tension-based title, a reflection
 * built strictly from committed choices, one shadow, one unresolved question.
 * Deterministic: identical committed choices → identical profile.
 * Never a religious label, never a diagnosis.
 */

export interface Profile {
  title: string;
  reflection: string;
  shadow: string;
  question: string;
}

interface ProfileDef extends Profile {
  id?: string;
  when?: string;
  unlessVerb?: string;
}

interface ProfilesData {
  clauses: Record<string, Record<string, string>>;
  omega: Profile;
  overrides: ProfileDef[];
  buckets: Record<string, Profile>;
}

const DATA = profilesFile as unknown as ProfilesData;

/** Choice ids that count as refusals across the graph (for the dissenter override). */
const REFUSAL_CHOICES = new Set([
  'no', 'refuse', 'nothing', 'keep_nothing', 'withdraw',
  'none_define', 'refuse_frame', 'refuse_classification',
]);

function committedChoiceByTally(state: GameState, tally: string): string | null {
  const entry = state.committed.find((c) => c.tally === tally);
  return entry ? entry.choice : null;
}

function fillClauses(template: string, state: GameState): string {
  return template.replace(/\{(A2|B1|C1|D2)\}/g, (_, key: string) => {
    const clauseMap = DATA.clauses[key] ?? {};
    const choice = committedChoiceByTally(state, key);
    return (choice && clauseMap[choice]) || clauseMap['_missing'] || '';
  });
}

function overrideApplies(def: ProfileDef, state: GameState, verb: string): boolean {
  if (def.unlessVerb && def.unlessVerb === verb) return false;
  const when = def.when ?? '';
  const endedAt = when.match(/^ended_at:(\w+)$/);
  if (endedAt) return state.node === endedAt[1];
  const refusals = when.match(/^refusals>=(\d+)$/);
  if (refusals) {
    const count = state.committed.filter((c) => REFUSAL_CHOICES.has(c.choice)).length;
    return count >= Number(refusals[1]);
  }
  return false;
}

/** Compute the soul record for an ended run. Null when no destination was ever committed. */
export function computeProfile(state: GameState): Profile | null {
  if (!state.ended) return null;

  // The Vigil's END GAME (Node Ω) has its own record — the near-blank one.
  const def = committedChoiceByTally(state, 'OMEGA')
    ? DATA.omega
    : (() => {
        const verb = committedChoiceByTally(state, 'F1');
        if (!verb) return null; // declining at boot leaves no record — by design
        return DATA.overrides.find((o) => overrideApplies(o, state, verb)) ?? DATA.buckets[verb];
      })();
  if (!def) return null;

  return {
    title: def.title,
    reflection: fillClauses(def.reflection, state),
    shadow: fillClauses(def.shadow, state),
    question: fillClauses(def.question, state),
  };
}

/** Exposed for tests: the gate requires 12–18 authored titles. */
export function allTitles(): string[] {
  return [
    DATA.omega.title,
    ...DATA.overrides.map((o) => o.title),
    ...Object.values(DATA.buckets).map((b) => b.title),
  ];
}
