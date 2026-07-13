import type { ContentGraph, EncounterNode } from './types';

import bootFile from '../../content/system/boot.json';
import exitsFile from '../../content/system/exits.json';
import act1File from '../../content/acts/act1.json';
import act2File from '../../content/acts/act2.json';
import act3File from '../../content/acts/act3.json';
import act4File from '../../content/acts/act4.json';
import act5File from '../../content/acts/act5.json';
import act6File from '../../content/acts/act6.json';

interface ContentFile {
  nodes: EncounterNode[];
}

const FILES: ContentFile[] = [
  bootFile as unknown as ContentFile,
  exitsFile as unknown as ContentFile,
  act1File as unknown as ContentFile,
  act2File as unknown as ContentFile,
  act3File as unknown as ContentFile,
  act4File as unknown as ContentFile,
  act5File as unknown as ContentFile,
  act6File as unknown as ContentFile,
];

export const START_NODE = 'boot_notice';

/** Assemble the full content graph. Content is schema-validated in CI/tests, not at runtime. */
export function buildGraph(): ContentGraph {
  const nodes: Record<string, EncounterNode> = {};
  for (const file of FILES) {
    for (const node of file.nodes) {
      if (nodes[node.id]) throw new Error(`Duplicate node id: ${node.id}`);
      nodes[node.id] = node;
    }
  }
  return { start: START_NODE, nodes };
}
