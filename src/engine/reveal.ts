import type { CommittedChoice, ContentGraph, GameState } from './types';
import { getNodeCensus } from './census';

/**
 * Reveal-after-lock copy (Compass §3 Layer B / MDD v2 §5): a node's aggregate
 * figures render only after the player's choice at that node locks. Below 500
 * tallies the reveal is founding-data honesty, never seeded fake numbers.
 */

const YOUNG_THRESHOLD = 500;

function choiceLabel(graph: ContentGraph, nodeId: string, choiceId: string): string {
  const node = graph.nodes[nodeId];
  const label = node?.choices?.find((c) => c.id === choiceId)?.label;
  if (!label) return choiceId.replace(/_/g, ' ').toUpperCase();
  return (label.split(' — ')[0] ?? label).trim();
}

/** The reveal block for a just-locked choice. Null for keys that stay quiet. */
export function buildReveal(
  graph: ContentGraph,
  committed: CommittedChoice,
): { node: string; text: string } | null {
  if (!committed.tally) return null;
  // The Vigil manipulates quietly; Ω keeps the walk unnarrated (session log,
  // Phase 3): no reveal blocks for V or OMEGA — they surface on the dashboard.
  if (committed.tally === 'V' || committed.tally === 'OMEGA') return null;

  const census = getNodeCensus(committed.tally);
  const suffix = census.label ? `\n${census.label}` : '';

  if (census.total < YOUNG_THRESHOLD) {
    return {
      node: committed.tally,
      text:
        `CHOICE RECORDED. THE LEDGER IS YOUNG — you are traveler №${census.total + 1} at this question. ` +
        `Early souls set the percentages later souls are measured against. No pressure.${suffix}`,
    };
  }

  const parts = Object.entries(census.counts)
    .sort(([, a], [, b]) => b - a)
    .map(([choice, count]) => {
      const pct = Math.round((count / census.total) * 100);
      return `${choiceLabel(graph, committed.node, choice)} ${pct}%`;
    });
  return {
    node: committed.tally,
    text: `CHOICE RECORDED. Of ${census.total.toLocaleString('en-US')} souls before you: ${parts.join(' · ')}.${suffix}`,
  };
}

/** VI.c — the full census on a played ending, the player's path marked. */
export function buildFullLedger(graph: ContentGraph, state: GameState): string {
  const lines: string[] = ['THE LEDGER, IN FULL:'];
  let anySeed = false;
  for (const committed of state.committed) {
    if (!committed.tally || committed.tally === 'V' || committed.tally === 'OMEGA') continue;
    const census = getNodeCensus(committed.tally);
    if (census.label) anySeed = true;
    const yours = choiceLabel(graph, committed.node, committed.choice);
    if (census.total >= YOUNG_THRESHOLD) {
      const same = census.counts[committed.choice] ?? 0;
      const pct = Math.round((same / census.total) * 100);
      lines.push(`${committed.tally} — yours: ${yours}. ${pct}% of souls chose the same.`);
    } else {
      lines.push(`${committed.tally} — yours: ${yours}. The Ledger is young here.`);
    }
  }
  const completions = getNodeCensus('completions');
  if (completions.label) anySeed = true;
  lines.push(`You are soul №${((completions.counts['done'] ?? 0) + 1).toLocaleString('en-US')}.`);
  if (anySeed) lines.push('(last census — the Ledger is unreachable)');
  return lines.join('\n');
}
