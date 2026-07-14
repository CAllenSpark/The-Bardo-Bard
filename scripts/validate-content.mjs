// Content validator — Gate 0: "schema validates all seed content".
// Runs standalone (npm run validate) and inside the test suite.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeManifest } from './gen-manifest.mjs';

// ajv is a devDependency; a fresh clone must `npm install` first.
let Ajv;
try {
  Ajv = (await import('ajv')).default;
} catch (err) {
  if (err?.code === 'ERR_MODULE_NOT_FOUND') {
    console.error('\n  Dependencies are not installed — run: npm install\n');
    process.exit(1);
  }
  throw err;
}

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

  // Standing exits: all six progress-scaled passages exist, terminal, tallied F1 (Compass §3, OD-13).
  for (const exitId of STANDING_EXITS) {
    for (const scale of ['early', 'mid', 'late']) {
      const id = `${exitId}_${scale}`;
      const exit = nodes.get(id);
      if (!exit) errors.push(`standing exit missing: ${id}`);
      else {
        if (!exit.terminal) errors.push(`standing exit ${id} must be terminal`);
        if (exit.tally !== 'F1') errors.push(`standing exit ${id} must tally F1`);
      }
    }
  }

  // Graph audit (Gate 1): every node reachable — via choices from the start,
  // or via the engine-injected standing exits.
  // BFS seeds: the boot screen plus engine-injected entry points (the Vigil's
  // END GAME lands on omega_light without a graph edge).
  const reachable = new Set(['boot_notice', 'omega_light']);
  const queue = ['boot_notice', 'omega_light'];
  while (queue.length > 0) {
    const node = nodes.get(queue.shift());
    for (const choice of node?.choices ?? []) {
      if (!reachable.has(choice.goto) && nodes.has(choice.goto)) {
        reachable.add(choice.goto);
        queue.push(choice.goto);
      }
    }
  }
  for (const node of nodes.values()) {
    const engineInjected =
      /^exit_(return|light)_(early|mid|late)$/.test(node.id) || node.id === 'omega_light';
    if (!reachable.has(node.id) && !engineInjected) {
      errors.push(`unreachable node: ${node.id}`);
    }
  }

  // Posture-variant coverage (Gate 1): every Act I–III node except the game's
  // first question carries at least one authored posture variant.
  for (const node of nodes.values()) {
    if (node.act >= 1 && node.act <= 3 && node.id !== 'a1_consent') {
      const variants = Object.keys(node.text).filter((k) => k !== 'base');
      if (variants.length === 0) errors.push(`act ${node.act} node ${node.id} has no posture variants`);
    }
  }

  // Dominance proxy (Gate 1): no two choices at a node are mechanically
  // interchangeable or strictly redundant — every choice must differ in
  // destination or state effects. (Flags are non-valenced by design — MDD v1
  // §11: no variable reads as universally good — so full dominance is a copy
  // review concern; this is the machine-checkable floor.)
  for (const node of nodes.values()) {
    const seenEffects = new Map();
    for (const choice of node.choices ?? []) {
      const signature = `${choice.goto}|${JSON.stringify(choice.state ?? {})}`;
      if (seenEffects.has(signature)) {
        errors.push(
          `node ${node.id}: choices "${seenEffects.get(signature)}" and "${choice.id}" are mechanically identical`,
        );
      }
      seenEffects.set(signature, choice.id);
    }
  }

  // Vigil ladder: every scheduled rung has authored beat/label (and ack +
  // fold for temptation rungs); the conformity rung's pre-lock copy contains
  // no digits (Compass §4.4 — numbers only after the V:conformity lock).
  const ladder = loadJson(join(CONTENT, 'vigil', 'ladder.json'));
  const ladderIds = [...ladder.rungs.map((r) => r.id), ladder.endgame.id];
  for (const rung of ladder.rungs) {
    if (!rung.beat || !rung.label || !rung.ack) {
      errors.push(`vigil rung ${rung.id}: beat, label, and ack are all required`);
    }
    if (rung.id === 'conformity' && /\d/.test(`${rung.beat}${rung.label}`)) {
      errors.push('conformity rung: beat/label must contain no digits before the lock (Compass §4.4)');
    }
  }
  if (!ladder.endgame.beat || !ladder.endgame.label) {
    errors.push('vigil endgame: beat and label are required');
  }
  if (ladder.endgame.ack) {
    errors.push('vigil endgame must have no ack — it does not fold, it leaves');
  }
  if (!ladder.hiddenTabLine) errors.push('vigil ladder: hiddenTabLine is required');

  // Soft relational retractions (P0-6): digit-free — they render into the same
  // pre-lock log the conformity beat is checked against (Compass §4.4).
  for (const r of ladder.softRetractions ?? []) {
    if (!r.beat) errors.push(`vigil softRetraction ${r.id}: beat required`);
    if (/\d/.test(r.beat ?? '')) errors.push(`vigil softRetraction ${r.id}: must be digit-free (Compass §4.4)`);
  }

  // Omega passage exists and ends the game.
  const omegaLight = nodes.get('omega_light');
  const omegaDisclosure = nodes.get('omega_disclosure');
  if (!omegaLight) errors.push('omega_light missing');
  if (!omegaDisclosure) errors.push('omega_disclosure missing');
  else if (!omegaDisclosure.terminal) errors.push('omega_disclosure must be terminal');

  // Vigil schedule: shape, order, and the §4.3 hard timing constraint.
  const schedule = loadJson(join(CONTENT, 'vigil', 'schedule.json'));
  const scheduleIds = schedule.rungs.map((r) => r.id);
  if (JSON.stringify(scheduleIds) !== JSON.stringify(ladderIds)) {
    errors.push(`vigil schedule/ladder mismatch: [${scheduleIds}] vs [${ladderIds}]`);
  }
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

  // Glyph phrase book covers every manifest key and choice (glyph + Soul
  // Analysis both draw from it — a missing phrase is a blank line in someone's
  // soul reading).
  const manifest = JSON.parse(readFileSync(join(ROOT, 'worker', 'manifest.json'), 'utf8'));
  const glyphData = loadJson(join(CONTENT, 'glyph', 'glyph.json'));
  const soulData = loadJson(join(CONTENT, 'glyph', 'soul_analysis.json'));
  for (const [key, choices] of Object.entries(manifest)) {
    if (key === 'completions') continue;
    for (const choice of choices) {
      if (!glyphData.phrases[key]?.[choice]) {
        errors.push(`glyph.json: missing phrase for ${key}/${choice}`);
      }
    }
    if (!soulData.names[key]) errors.push(`soul_analysis.json: missing display name for ${key}`);
    if (typeof glyphData.emoji[key] === 'object') {
      for (const choice of choices) {
        if (!glyphData.emoji[key][choice]) errors.push(`glyph.json: missing emoji for ${key}/${choice}`);
      }
    } else if (!glyphData.emoji[key]) {
      errors.push(`glyph.json: missing emoji for ${key}`);
    }
  }

  // Ship checklist (Appendix B): every high-impact interpretation carries
  // confidence and an alternative reading (buttons-only redefinition, §6).
  for (const node of nodes.values()) {
    if (node.tally === 'D3') {
      if (!node.text.base.includes('Confidence:')) errors.push(`${node.id}: missing confidence statement`);
      if (!node.text.base.includes('Alternative reading')) errors.push(`${node.id}: missing alternative reading`);
    }
  }

  // Codex: every entry labeled; lineage gated; data statement present.
  const codex = loadJson(join(CONTENT, 'codex', 'codex.json'));
  for (const section of codex.sections) {
    for (const entry of section.entries) {
      if (!/^(TRADITION|INTERPRETATION|HYPOTHESIS|FICTION): /.test(entry.label)) {
        errors.push(`codex entry without a valid label: ${entry.label}`);
      }
    }
  }
  if (!codex.lineage?.gated) errors.push('codex lineage entry must be gated (OD-6)');
  if (!codex.data_statement?.includes('deeds, not people')) errors.push('codex data statement missing its one-line core');

  // Reincarnation copy: the §9.2 guard — no template may target the Vigil's node.
  const reincarnation = loadJson(join(CONTENT, 'reincarnation', 'reincarnation.json'));
  if (reincarnation.node_lines['a1_consent']) {
    errors.push('reincarnation.json: a1_consent template forbidden (§9.2 — the Vigil stays archetypal)');
  }

  // Seed census carries its degraded-mode label (Compass §7).
  const census = loadJson(join(CONTENT, 'census', 'seed.json'));
  if (census.label !== '(last census — the Ledger is unreachable)') {
    errors.push('seed census must carry the exact degraded-mode label (Compass §7)');
  }

  return { errors, nodeCount: nodes.size };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const manifest = writeManifest();
  console.log(`ledger manifest: ${manifest.keys} tally keys${manifest.changed ? ' (regenerated)' : ''}`);
  const { errors, nodeCount } = validateContent();
  if (errors.length > 0) {
    console.error(`CONTENT INVALID (${errors.length} error${errors.length === 1 ? '' : 's'}):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`CONTENT VALID. ${nodeCount} nodes filed correctly. The scribe is satisfied.`);
}
