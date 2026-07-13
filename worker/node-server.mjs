// Local adapter: serves the EXACT portable Ledger handler over Node's HTTP
// server for the Gate 3 real-browser integration test (the censusless-launch
// guard). The Cloudflare entry (index.mjs) wraps the same handler; only the
// counter storage differs (memory here, Durable Object SQLite in production).
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLedger, createMemoryCounter } from './ledger.mjs';

const manifest = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'manifest.json'), 'utf8'),
);

const PORT = Number(process.env.PORT ?? 8787);
const allowOrigins = (process.env.ALLOW_ORIGINS ?? 'null,http://localhost:8000').split(',');

const ledger = createLedger({ counter: createMemoryCounter(), manifest, allowOrigins });

const server = createServer(async (req, res) => {
  const body = await new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
  });
  const request = new Request(`http://127.0.0.1:${PORT}${req.url}`, {
    method: req.method,
    headers: req.headers,
    body: ['GET', 'HEAD', 'OPTIONS'].includes(req.method) ? undefined : body,
  });
  const response = await ledger.fetch(request);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
});

server.listen(PORT, () => console.log(`ledger listening on :${PORT}`));
