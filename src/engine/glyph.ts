import type { GameState } from './types';
import { fromBase64Url, toBase64Url } from './b64';
import glyphFile from '../../content/glyph/glyph.json';
import manifestFile from '../../worker/manifest.json';

/**
 * The share glyph (Compass §7): the zero-PII viral unit. Visible lines in
 * Wordle grammar plus a compact machine-readable code carrying exactly the
 * committed choice at each tallied node the player locked — nothing else.
 * OD-12: the copy action always carries the plain-language disclosure line.
 */

const GLYPH = glyphFile as unknown as {
  glyphOrder: string[];
  emoji: Record<string, string | Record<string, string>>;
  phrases: Record<string, Record<string, string>>;
};
const MANIFEST = manifestFile as Record<string, string[]>;

const CODE_PREFIX = 'BG1.';
export const GLYPH_DISCLOSURE = 'this code contains your full path through the desk.';

export type GlyphPath = Array<[tally: string, choice: string]>;

function pathOf(state: GameState): GlyphPath {
  return state.committed
    .filter((c) => c.tally)
    .map((c) => [c.tally as string, c.choice]);
}

export function encodeGlyphCode(state: GameState): string {
  return CODE_PREFIX + toBase64Url(JSON.stringify(pathOf(state)));
}

/** Decode + validate against the Ledger manifest. Throws on anything foreign. */
export function decodeGlyphCode(token: string): GlyphPath {
  if (!token.startsWith(CODE_PREFIX)) throw new Error('unrecognized glyph code');
  let parsed: unknown;
  try {
    parsed = JSON.parse(fromBase64Url(token.slice(CODE_PREFIX.length).trim()));
  } catch {
    throw new Error('unreadable glyph code');
  }
  if (!Array.isArray(parsed)) throw new Error('unreadable glyph code');
  const path: GlyphPath = [];
  for (const entry of parsed as unknown[]) {
    if (!Array.isArray(entry) || entry.length !== 2) throw new Error('unreadable glyph code');
    const [tally, choice] = entry as [unknown, unknown];
    if (typeof tally !== 'string' || typeof choice !== 'string' || !MANIFEST[tally]?.includes(choice)) {
      throw new Error('unknown path entry');
    }
    path.push([tally, choice]);
  }
  return path;
}

export function phrase(tally: string, choice: string): string {
  return GLYPH.phrases[tally]?.[choice] ?? `${choice.replace(/_/g, ' ')}`;
}

function emojiFor(tally: string, choice: string): string {
  const entry = GLYPH.emoji[tally];
  if (typeof entry === 'string') return entry;
  return entry?.[choice] ?? '·';
}

/** The shareable text block. soulN comes from the census when available. */
export function buildGlyphText(state: GameState, soulN: number): string {
  const path = pathOf(state);
  const byTally = new Map(path);
  const lines = [`THE BARDO BARD · soul №${soulN.toLocaleString('en-US')}`];

  if (byTally.has('OMEGA')) {
    // The rarest glyph is a deliberate, shareable absence (Compass §4.2; the
    // tester SWOT's "ship the spark"): nearly blank, emoji-free (renders
    // everywhere, never as boxes), and it withholds how it was earned — the
    // whole point is that a friend sees an empty one and has to ask.
    lines.push(
      '',
      '',
      '              ·',
      '',
      '',
      'a record the Ledger could not fill —',
      'and the desk declines, this once, to say how.',
      '',
    );
  } else {
    for (const key of GLYPH.glyphOrder) {
      const choice = byTally.get(key);
      if (!choice) continue;
      lines.push(`${emojiFor(key, choice)} ${phrase(key, choice)}`);
    }
  }
  lines.push(encodeGlyphCode(state));
  return lines.join('\n');
}
