// Generate the Ledger manifest (worker/manifest.json) from content — the
// Compass §3 canonical tally keys, choices derived from the content graph so
// the Worker and the game can never drift apart.
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'content');
const OUT = join(ROOT, 'worker', 'manifest.json');

export function deriveManifest() {
  const manifest = {};
  const add = (key, choice) => {
    manifest[key] = manifest[key] ?? [];
    if (!manifest[key].includes(choice)) manifest[key].push(choice);
  };

  for (const dir of ['acts', 'system']) {
    for (const name of readdirSync(join(CONTENT, dir))) {
      if (!name.endsWith('.json')) continue;
      const data = JSON.parse(readFileSync(join(CONTENT, dir, name), 'utf8'));
      if (!Array.isArray(data.nodes)) continue; // skip non-encounter files
      for (const node of data.nodes) {
        if (!node.tally) continue;
        // Gated choices (§15 Cycle Ladder) are never census-relevant, even on a
        // tallied node — they must not enter the manifest or the Ledger.
        for (const choice of node.choices ?? []) if (!choice.gated) add(node.tally, choice.id);
      }
    }
  }

  // Standing exits are terminal (no authored choices); the engine tallies
  // them as the shared F1 choices (OD-13).
  add('F1', 'return');
  add('F1', 'light');

  // The Vigil rungs and END GAME are engine-committed, defined by the ladder.
  const ladder = JSON.parse(readFileSync(join(CONTENT, 'vigil', 'ladder.json'), 'utf8'));
  for (const rung of ladder.rungs) add('V', rung.id);
  add('OMEGA', 'end_game');

  // Finished runs (any true ending, including Ω).
  add('completions', 'done');

  return manifest;
}

export function writeManifest() {
  const manifest = deriveManifest();
  const json = JSON.stringify(manifest, null, 2) + '\n';
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (current !== json) {
    writeFileSync(OUT, json);
    return { changed: true, keys: Object.keys(manifest).length };
  }
  return { changed: false, keys: Object.keys(manifest).length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { changed, keys } = writeManifest();
  console.log(`manifest: ${keys} tally keys${changed ? ' (updated)' : ' (current)'}`);
}
