import { describe, expect, it } from 'vitest';
import { buildGraph } from '../src/engine/content';
import { advance, createState, vigilEndGame } from '../src/engine/fsm';
import { buildSigil } from '../src/engine/sigil';
import { buildGlyphText, decodeGlyphCode, encodeGlyphCode } from '../src/engine/glyph';

const graph = buildGraph();

function play(choices: string[]) {
  let state = createState(graph);
  for (const choice of choices) state = advance(graph, state, choice);
  return state;
}

const SPIRAL_PATH = ['begin', 'define_you', 'question', 'lethe', 'a_joke', 'take_number',
  'compassion', 'caused_harm', 'debt', 'complicate', 'answer_question', 'stand', 'spiral'];

function omegaState() {
  let state = advance(graph, createState(graph), 'begin');
  state = vigilEndGame(graph, state);
  return advance(graph, state, 'go_on');
}

describe('the sigil (Gate 4: deterministic evidence)', () => {
  it('identical state vectors produce identical SVG, twice', () => {
    const a = buildSigil(play(SPIRAL_PATH));
    const b = buildSigil(play(SPIRAL_PATH));
    expect(a.svg).toBe(b.svg);
    expect(a.description).toBe(b.description);
    expect(a.svg.startsWith('<svg')).toBe(true);
  });

  it('different paths produce different sigils', () => {
    const spiral = buildSigil(play(SPIRAL_PATH));
    const returner = buildSigil(play(['begin', 'yes', 'approach', 'mnemosyne', 'take_number',
      'answer', 'loved_well', 'both', 'accept', 'free_it', 'stand', 'return']));
    expect(spiral.svg).not.toBe(returner.svg);
  });

  it('encodes its parameters legibly: spiral arm, memory mark, open perimeter', () => {
    const sigil = buildSigil(play(SPIRAL_PATH));
    expect(sigil.description).toContain('spiral arm');
    expect(sigil.description).toContain('lethe mark');
    expect(sigil.description).toContain('open');
    expect(sigil.svg).toContain('polyline'); // complicate opened the perimeter — it does not return home
  });

  it('the Ω sigil is almost entirely negative space', () => {
    const sigil = buildSigil(omegaState());
    expect(sigil.svg.length).toBeLessThan(300);
    expect((sigil.svg.match(/<circle/g) ?? []).length).toBe(1);
    expect(sigil.description).toContain('empty space');
  });
});

describe('the share glyph (Gate 4: code round-trips)', () => {
  it('round-trips the committed choice vector exactly', () => {
    const state = play(SPIRAL_PATH);
    const decoded = decodeGlyphCode(encodeGlyphCode(state));
    expect(decoded).toEqual(state.committed.filter((c) => c.tally).map((c) => [c.tally, c.choice]));
  });

  it('rejects garbage and unknown path entries', () => {
    expect(() => decodeGlyphCode('nope')).toThrow();
    expect(() => decodeGlyphCode('BG1.!!!!')).toThrow();
    const forged = 'BG1.' + btoa(JSON.stringify([['A2', 'transcend']])).replace(/=+$/, '');
    expect(() => decodeGlyphCode(forged)).toThrow(/unknown path entry/);
  });

  it('builds the Wordle-grammar block: emoji lines, phrases, soul №, code', () => {
    const text = buildGlyphText(play(SPIRAL_PATH), 41378);
    expect(text).toContain('THE BARDO BARD · soul №41,378');
    expect(text).toContain('🌫️ questioned the light');
    expect(text).toContain('🏺 drank Lethe');
    expect(text).toContain('🌀 chose SPIRAL');
    expect(text).toContain('BG1.');
  });

  it('the Ω glyph is nearly blank and explains nothing', () => {
    const text = buildGlyphText(omegaState(), 42);
    const lines = text.split('\n');
    expect(lines[0]).toContain('soul №42');
    expect(text).not.toMatch(/wait|vigil|END GAME/i);
    expect(lines.filter((l) => l.trim() === '' || l.trim() === '·').length).toBeGreaterThanOrEqual(3);
    expect(decodeGlyphCode(lines.at(-1)!)).toContainEqual(['OMEGA', 'end_game']);
  });
});
