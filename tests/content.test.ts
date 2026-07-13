import { describe, expect, it } from 'vitest';
// @ts-expect-error — plain .mjs module shared with the CLI validator
import { validateContent } from '../scripts/validate-content.mjs';
import { buildGraph } from '../src/engine/content';

describe('content schema and graph integrity (Gate 0)', () => {
  it('validates every content file against the schema with a coherent graph', () => {
    const { errors, nodeCount } = validateContent() as { errors: string[]; nodeCount: number };
    expect(errors).toEqual([]);
    expect(nodeCount).toBeGreaterThanOrEqual(7);
  });

  it('assembles the graph with a boot start node and both standing exits', () => {
    const graph = buildGraph();
    expect(graph.nodes[graph.start]).toBeDefined();
    expect(graph.nodes['exit_return']?.terminal).toBe(true);
    expect(graph.nodes['exit_light']?.terminal).toBe(true);
  });

  it('gives every node fallback copy and an accessibility description', () => {
    const graph = buildGraph();
    for (const node of Object.values(graph.nodes)) {
      expect(node.fallback.length, node.id).toBeGreaterThan(0);
      expect(node.a11y.length, node.id).toBeGreaterThan(0);
    }
  });
});
