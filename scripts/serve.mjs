// A tiny, dependency-free static server for the built game (dist/).
// The desk boots fine straight from file://, but serving over http://localhost
// gives you working reincarnation (localStorage is blocked on file:// in some
// browsers) and lets you point at a local Ledger. $0, no deps.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT ?? 5173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (pathname === '/' || pathname === '') pathname = '/index.html';
  // Resolve within DIST only — no path traversal out of the built bundle.
  const filePath = normalize(join(DIST, pathname));
  if (!filePath.startsWith(DIST)) {
    res.writeHead(403);
    res.end('forbidden');
    return;
  }
  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error('not a file');
    const body = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': TYPES[extname(filePath)] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('NOT FOUND. The desk has no record of that page.');
  }
});

server.listen(PORT, () => {
  console.log(`\n  THE BARDO BARD is open at  http://localhost:${PORT}\n`);
  console.log(`  the desk        →  http://localhost:${PORT}/`);
  console.log(`  the ledger      →  http://localhost:${PORT}/dashboard.html`);
  console.log(`  soul analysis   →  http://localhost:${PORT}/soul.html`);
  console.log(`  the codex       →  http://localhost:${PORT}/codex.html\n`);
  console.log('  (Ctrl-C to close the desk.)\n');
});
