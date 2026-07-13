// Cloudflare Worker entry — one Durable Object counter (SQLite-backed, free
// plan) behind the portable Ledger handler. Deploy with `wrangler deploy`.
import { DurableObject } from 'cloudflare:workers';
import { createLedger } from './ledger.mjs';
import manifest from './manifest.json';

export class LedgerCounter extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(
      'CREATE TABLE IF NOT EXISTS tallies (node TEXT NOT NULL, choice TEXT NOT NULL, count INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (node, choice))',
    );
  }

  async increment(node, choice) {
    this.sql.exec(
      'INSERT INTO tallies (node, choice, count) VALUES (?, ?, 1) ON CONFLICT (node, choice) DO UPDATE SET count = count + 1',
      node,
      choice,
    );
  }

  async read(nodes) {
    const out = {};
    for (const node of nodes) out[node] = {};
    if (nodes.length === 0) return out;
    const placeholders = nodes.map(() => '?').join(',');
    const rows = this.sql
      .exec(`SELECT node, choice, count FROM tallies WHERE node IN (${placeholders})`, ...nodes)
      .toArray();
    for (const row of rows) out[row.node][row.choice] = row.count;
    return out;
  }
}

export default {
  async fetch(request, env) {
    const id = env.LEDGER.idFromName('the-one-ledger');
    const stub = env.LEDGER.get(id);
    const allowOrigins = (env.ALLOW_ORIGINS ?? 'null').split(',').map((s) => s.trim());
    const ledger = createLedger({
      counter: {
        increment: (node, choice) => stub.increment(node, choice),
        read: (nodes) => stub.read(nodes),
      },
      manifest,
      allowOrigins,
    });
    return ledger.fetch(request);
  },
};
