// Gate 0 structural check: the built entry must be openable from file://.
// ES module scripts are blocked by CORS on file:// — so the entry must use a
// classic script tag with a relative src, and reference no absolute paths.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(ROOT, 'dist', 'index.html'), 'utf8');

const errors = [];
if (/type\s*=\s*"module"/.test(html)) {
  errors.push('index.html uses a module script — blocked on file://');
}
if (!/<script src="\.\/bardo\.js"><\/script>/.test(html)) {
  errors.push('index.html must reference ./bardo.js with a classic relative script tag');
}
if (/(src|href)\s*=\s*"\//.test(html)) {
  errors.push('index.html references an absolute path — breaks file:// boot');
}

if (errors.length > 0) {
  console.error('FILE:// BOOT CHECK FAILED:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('FILE:// BOOT CHECK PASSED. The desk opens from a cold filesystem.');
