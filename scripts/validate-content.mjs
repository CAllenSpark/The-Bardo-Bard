// Content validator — Gate 0: "schema validates all seed content".
// Runs standalone (npm run validate) and inside the test suite.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'content');

const STANDING_EXITS = ['exit_return', 'exit_light'];
// Compass §4.3: END GAME appears within 7-10 minutes of visible stillness.
const VIGIL_END_MIN_MS = 7 * 60 * 1000;
const VIGIL_END_MAX_MS = 10 * 60 * 1000;
const LADDER_RUNGS = [
  'patience', 'fear', 'temptation', 'desire', 'hope',
  'loss', 'guilt', 'conformity', 'plea', 'endgame',
];

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function* encounterFiles() {
  for (const dir of ['acts', 'system']) {
    for (const name of readdirSync(join(CONTENT, dir))) {
      if (name.endsWith('.json')) yield join(CONTENT, dir, name);
    }
  }
}

export function validateContent() {
  const errors = [];
  const schema = loadJson(join(CONTENT, 'schema', 'encounter.schema.json'));
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);

  const nodes = new Map();
  for (const file of encounterFiles()) {
    const data = loadJson(file);
    if (!validate(data)) {
      for (const err of validate.errors ?? []) {
        errors.push(`${file}: ${err.instancePath} ${err.message}`);
      }
      continue;
    }
    for (const node of data.nodes) {
      if (nodes.has(node.id)) errors.push(`duplicate node id: ${node.id}`);
      nodes.set(node.id, node);
    }
  }

  // Graph integrity: every goto resolves; terminal nodes have no choices;
  // non-terminal nodes have at least one choice (no dead ends).
  for (const node of nodes.values()) {
    const choices = node.choices ?? [];
    if (node.terminal && choices.length > 0) {
      errors.push(`terminal node ${node.id} has choices`);
    }
    if (!node.terminal && choices.length === 0) {
      errors.push(`dead end: non-terminal node ${node.id} has no choices`);
    }
    const seen = new Set();
    for (const choice of choices) {
      if (seen.has(choice.id)) errors.push(`node ${node.id}: duplicate choice id ${choice.id}`);
      seen.add(choice.id);
      if (!nodes.has(choice.goto)) {
        errors.push(`node ${node.id}, choice ${choice.id}: goto target "${choice.goto}" does not exist`);
      }
    }
  }

  // Standing exits exist and are terminal (Compass §3).
  for (const exitId of STANDING_EXITS) {
    const exit = nodes.get(exitId);
    if (!exit) errors.push(`standing exit missing: ${exitId}`);
    else if (!exit.terminal) errors.push(`standing exit ${exitId} must be terminal`);
  }

  // Vigil schedule: shape, order, and the §4.3 hard timing constraint.
  const schedule = loadJson(join(CONTENT, 'vigil', 'schedule.json'));
  const rungIds = schedule.rungs.map((r) => r.id);
  if (JSON.stringify(rungIds) !== JSON.stringify(LADDER_RUNGS)) {
    errors.push(`vigil ladder rungs must be exactly [${LADDER_RUNGS.join(', ')}], got [${rungIds.join(', ')}]`);
  }
  let prev = 0;
  for (const rung of schedule.rungs) {
    if (rung.afterMs <= prev) errors.push(`vigil rung ${rung.id}: afterMs must strictly increase`);
    prev = rung.afterMs;
  }
  const endgame = schedule.rungs.find((r) => r.id === 'endgame');
  if (endgame && (endgame.afterMs < VIGIL_END_MIN_MS || endgame.afterMs > VIGIL_END_MAX_MS)) {
    errors.push(`endgame at ${endgame.afterMs}ms violates the 7-10 minute window (Compass §4.3)`);
  }

  // Seed census carries its degraded-mode label (Compass §7).
  const census = loadJson(join(CONTENT, 'census', 'seed.json'));
  if (census.label !== '(last census — the Ledger is unreachable)') {
    errors.push('seed census must carry the exact degraded-mode label (Compass §7)');
  }

  return { errors, nodeCount: nodes.size };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { errors, nodeCount } = validateContent();
  if (errors.length > 0) {
    console.error(`CONTENT INVALID (${errors.length} error${errors.length === 1 ? '' : 's'}):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`CONTENT VALID. ${nodeCount} nodes filed correctly. The scribe is satisfied.`);
}
