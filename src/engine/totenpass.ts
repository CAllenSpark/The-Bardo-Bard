import type { ContentGraph, GameState } from './types';
import { getNode } from './fsm';

/**
 * The Totenpass (Compass §6 carry-forward of MDD v2 §7): a passport for the
 * dead. Exports the run state as a short copyable token; importing restores
 * it exactly — cross-device continuity with zero accounts, zero servers.
 */

const PREFIX = 'BB1.';

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(token: string): string {
  const binary = atob(token.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = Uint8Array.from(binary, (c: string) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function exportTotenpass(state: GameState): string {
  const payload = {
    v: 1,
    node: state.node,
    flags: state.flags,
    committed: state.committed,
    ended: state.ended,
  };
  return PREFIX + toBase64Url(JSON.stringify(payload));
}

/** Restore a state from a token. Throws on anything malformed — the caller
 *  translates that into the desk's gentler language. */
export function importTotenpass(graph: ContentGraph, token: string): GameState {
  if (!token.startsWith(PREFIX)) throw new Error('unrecognized tablet');
  let payload: unknown;
  try {
    payload = JSON.parse(fromBase64Url(token.slice(PREFIX.length)));
  } catch {
    throw new Error('unreadable tablet');
  }
  const p = payload as {
    v?: number;
    node?: unknown;
    flags?: unknown;
    committed?: unknown;
    ended?: unknown;
  };
  if (p.v !== 1 || typeof p.node !== 'string' || typeof p.ended !== 'boolean') {
    throw new Error('unrecognized tablet');
  }
  getNode(graph, p.node); // throws on unknown node
  if (typeof p.flags !== 'object' || p.flags === null) throw new Error('unreadable tablet');
  for (const value of Object.values(p.flags as Record<string, unknown>)) {
    if (typeof value !== 'number') throw new Error('unreadable tablet');
  }
  if (!Array.isArray(p.committed)) throw new Error('unreadable tablet');
  for (const entry of p.committed as unknown[]) {
    const e = entry as { node?: unknown; choice?: unknown };
    if (typeof e.node !== 'string' || typeof e.choice !== 'string') {
      throw new Error('unreadable tablet');
    }
  }
  return {
    node: p.node,
    flags: { ...(p.flags as Record<string, number>) },
    committed: (p.committed as GameState['committed']).map((c) => ({ ...c })),
    ended: p.ended,
  };
}
