// Build: single IIFE bundle + one HTML entry. No module scripts, relative
// paths only — the built game must boot from file:// (Gate 0).
import { build } from 'esbuild';
import { copyFileSync, mkdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

mkdirSync(DIST, { recursive: true });

await build({
  entryPoints: [join(ROOT, 'src', 'main.ts')],
  bundle: true,
  format: 'iife',
  minify: true,
  sourcemap: false,
  target: 'es2020',
  outfile: join(DIST, 'bardo.js'),
});

copyFileSync(join(ROOT, 'src', 'index.html'), join(DIST, 'index.html'));

const BUDGET_GZ = 300 * 1024; // Compass §7: < 300 KB gz for the complete run
let total = 0;
for (const file of ['bardo.js', 'index.html']) {
  const raw = readFileSync(join(DIST, file));
  const gz = gzipSync(raw).length;
  total += gz;
  console.log(`${file.padEnd(12)} ${String(statSync(join(DIST, file)).size).padStart(8)} B  (${gz} B gz)`);
}
console.log(`total gz: ${total} B of ${BUDGET_GZ} B budget (${((total / BUDGET_GZ) * 100).toFixed(1)}%)`);
if (total > BUDGET_GZ) {
  console.error('BUNDLE OVER BUDGET (Compass §7). The desk rejects the filing.');
  process.exit(1);
}
