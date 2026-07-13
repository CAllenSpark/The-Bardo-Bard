import { describe, expect, it } from 'vitest';
// @ts-expect-error — plain .mjs module shared with the CLI validator
import { validateContent } from '../scripts/validate-content.mjs';
import { buildGraph } from '../src/engine/content';

describe('content schema and graph integrity (Gate 0)', () => {
  it('validates every content file against the schema with a coherent graph', () => {
    const { errors, nodeCount } = validateContent() as { errors: string[]; nodeCount: number };
    expect(errors).toEqual([]);
    expect(nodeCount).toBeGreaterThanOrEqual(30);
  });

  it('assembles the graph with a boot start node, all six acts, and all six exit passages', () => {
    const graph = buildGraph();
    expect(graph.nodes[graph.start]).toBeDefined();
    const acts = new Set(Object.values(graph.nodes).map((n) => n.act));
    for (const act of [1, 2, 3, 4, 5, 6]) expect(acts.has(act), `act ${act}`).toBe(true);
    for (const exit of ['exit_return', 'exit_light']) {
      for (const scale of ['early', 'mid', 'late']) {
        expect(graph.nodes[`${exit}_${scale}`]?.terminal, `${exit}_${scale}`).toBe(true);
      }
    }
  });

  it('gives every node fallback copy and an accessibility description', () => {
    const graph = buildGraph();
    for (const node of Object.values(graph.nodes)) {
      expect(node.fallback.length, node.id).toBeGreaterThan(0);
      expect(node.a11y.length, node.id).toBeGreaterThan(0);
    }
  });
});
