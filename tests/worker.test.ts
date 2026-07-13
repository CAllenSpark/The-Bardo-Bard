import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — portable worker module, plain JS
import { createLedger, createMemoryCounter } from '../worker/ledger.mjs';
import manifest from '../worker/manifest.json';

const ORIGIN = 'https://bardobard.pages.dev';

function makeLedger() {
  return createLedger({
    counter: createMemoryCounter(),
    manifest,
    allowOrigins: [ORIGIN, 'null'],
  });
}

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://ledger.example/tally', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: ORIGIN, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('the Ledger worker handler (Gate 3)', () => {
  let ledger: { fetch(request: Request): Promise<Response> };

  beforeEach(() => {
    ledger = makeLedger();
  });

  it('answers preflight with CORS for the game origin and for null (file://)', async () => {
    for (const origin of [ORIGIN, 'null']) {
      const response = await ledger.fetch(
        new Request('https://ledger.example/tally', { method: 'OPTIONS', headers: { Origin: origin } }),
      );
      expect(response.status).toBe(204);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe(origin);
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    }
  });

  it('withholds CORS from unknown origins', async () => {
    const response = await ledger.fetch(
      new Request('https://ledger.example/tally', { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } }),
    );
    expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('counts valid tallies and serves the GET shape', async () => {
    expect((await ledger.fetch(post({ node: 'A2', choice: 'question' }))).status).toBe(204);
    expect((await ledger.fetch(post({ node: 'A2', choice: 'question' }))).status).toBe(204);
    expect((await ledger.fetch(post({ node: 'OMEGA', choice: 'end_game' }))).status).toBe(204);

    const response = await ledger.fetch(
      new Request('https://ledger.example/tally?nodes=A2,OMEGA,completions', { headers: { Origin: ORIGIN } }),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      A2: { question: 2 },
      OMEGA: { end_game: 1 },
      completions: {},
    });
    expect(response.headers.get('Cache-Control')).toContain('max-age=60');
  });

  it('rejects unknown nodes and unknown choices per the manifest', async () => {
    expect((await ledger.fetch(post({ node: 'X9', choice: 'yes' }))).status).toBe(400);
    expect((await ledger.fetch(post({ node: 'A2', choice: 'transcend' }))).status).toBe(400);
  });

  it('rejects tallies that are not bare (no session ids, no timestamps, nothing)', async () => {
    expect((await ledger.fetch(post({ node: 'A2', choice: 'question', session: 'abc' }))).status).toBe(400);
    expect((await ledger.fetch(post({ node: 'A2', choice: 'question', t: 123 }))).status).toBe(400);
  });

  it('rejects malformed json and wrong methods', async () => {
    expect((await ledger.fetch(post('{not json'))).status).toBe(400);
    const response = await ledger.fetch(
      new Request('https://ledger.example/tally', { method: 'DELETE', headers: { Origin: ORIGIN } }),
    );
    expect(response.status).toBe(405);
  });

  it('soft rate limit trips within a minute window', async () => {
    let last = 0;
    for (let i = 0; i < 31; i += 1) {
      const response = await ledger.fetch(
        post({ node: 'A1', choice: 'yes' }, { 'X-Forwarded-For': '203.0.113.7' }),
      );
      last = response.status;
    }
    expect(last).toBe(429);
  });

  it('GET filters unknown nodes instead of erroring', async () => {
    const response = await ledger.fetch(
      new Request('https://ledger.example/tally?nodes=A1,NOPE', { headers: { Origin: ORIGIN } }),
    );
    expect(await response.json()).toEqual({ A1: {} });
  });
});

describe('the manifest derives from content (single source of truth)', () => {
  it('matches the checked-in worker/manifest.json exactly', async () => {
    // @ts-expect-error — plain .mjs module
    const { deriveManifest } = await import('../scripts/gen-manifest.mjs');
    expect(deriveManifest()).toEqual(manifest);
  });

  it('covers the Compass §3 canonical keys', () => {
    expect(Object.keys(manifest).sort()).toEqual(
      ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'D3', 'E1', 'F1', 'OMEGA', 'V', 'completions'].sort(),
    );
    expect(manifest.F1).toContain('light');
    expect(manifest.F1).toHaveLength(10);
    expect(manifest.V).toHaveLength(9);
  });
});
