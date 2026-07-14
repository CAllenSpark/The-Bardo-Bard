import type { GameState } from './types';
import { stateVector } from './fsm';

/**
 * The sigil (MDD v1 §16, MVP subset): deterministic evidence, not decoration —
 * identical state vectors produce identical SVG, always. Encodings:
 *   outer geometry ← authority posture · open/closed perimeter ← tolerance
 *   for uncertainty · vertical axis ← transcendence vs embodiment ·
 *   horizontal ← sovereignty vs belonging · central glyph ← memory posture ·
 *   fractures ← corrections and refusals · one moving particle ← the question
 *   carried forward · chirality ← loop vs spiral.
 * The Ω sigil is almost entirely negative space (Compass §4.2).
 */

export interface Sigil {
  svg: string;
  description: string;
}

function hashString(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function flag(state: GameState, key: string): number {
  return state.flags[key] ?? 0;
}

function committed(state: GameState, tally: string): string | null {
  return state.committed.find((c) => c.tally === tally)?.choice ?? null;
}

const CENTER_GLYPHS: Record<string, (c: string) => string> = {
  lethe: () => `<circle cx="100" cy="100" r="9" fill="none" stroke-width="1.5"/>`,
  mnemosyne: () => `<circle cx="100" cy="100" r="9" fill="currentColor"/>`,
  mercy: () => `<path d="M 100 91 A 9 9 0 0 0 100 109 Z" fill="currentColor"/><circle cx="100" cy="100" r="9" fill="none" stroke-width="1.5"/>`,
  distillation: () => `<path d="M 100 90 L 109 100 L 100 110 L 91 100 Z" fill="none" stroke-width="1.5"/>`,
  communion: () => `<circle cx="100" cy="100" r="9" fill="none" stroke-width="1.5"/><line x1="91" y1="100" x2="109" y2="100" stroke-width="1.5"/><line x1="100" y1="91" x2="100" y2="109" stroke-width="1.5"/>`,
  tap_water: () => `<path d="M 92 100 Q 96 95 100 100 T 108 100" fill="none" stroke-width="1.5"/>`,
  nothing: () => `<circle cx="100" cy="100" r="2" fill="currentColor"/>`,
};

export function buildSigil(state: GameState, incarnation = 1): Sigil {
  const seed = hashString(stateVector(state));

  // Ω: the rarest sigil is nearly blank.
  if (committed(state, 'OMEGA')) {
    return {
      svg:
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" stroke="currentColor" class="sigil">` +
        `<circle cx="100" cy="100" r="2.5" fill="currentColor" stroke="none" class="sigil-particle"/></svg>`,
      description:
        'A sigil that is almost entirely empty space: one small point of ink, alone, near the center of the page.',
    };
  }

  const defianceScore = flag(state, 'defiance') + flag(state, 'refusal');
  const complyScore = flag(state, 'comply') + flag(state, 'reverence');
  const sides = Math.max(3, Math.min(11, 7 + complyScore - defianceScore));

  const open = flag(state, 'complication') + flag(state, 'mystery') + flag(state, 'honesty') > 0;
  const verb = committed(state, 'F1');
  const up = (verb === 'dissolve' || verb === 'light' ? 8 : 0) + flag(state, 'light_become') * 4;
  const down = verb === 'return' || verb === 'loop' ? 8 : 0;
  const cy = 100 - up + down;
  const cx = 100 - Math.min(10, defianceScore * 2) + Math.min(10, (flag(state, 'communion') + flag(state, 'compassion')) * 3);

  const radius = 62;
  const points: string[] = [];
  for (let i = 0; i < sides; i += 1) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`);
  }
  // An open perimeter drops one edge: a polyline that does not return home.
  const perimeter = open
    ? `<polyline points="${points.join(' ')}" fill="none" stroke-width="2"/>`
    : `<polygon points="${points.join(' ')}" fill="none" stroke-width="2"/>`;

  const fractures: string[] = [];
  const fractureCount = Math.min(4, flag(state, 'correction') + flag(state, 'refusal'));
  for (let i = 0; i < fractureCount; i += 1) {
    const a = ((hashString(`${seed}f${i}`) % 360) / 360) * Math.PI * 2;
    const r1 = 20 + (hashString(`${seed}r${i}`) % 18);
    fractures.push(
      `<line x1="${(cx + r1 * Math.cos(a)).toFixed(1)}" y1="${(cy + r1 * Math.sin(a)).toFixed(1)}" ` +
        `x2="${(cx + (r1 + 16) * Math.cos(a)).toFixed(1)}" y2="${(cy + (r1 + 16) * Math.sin(a)).toFixed(1)}" stroke-width="1"/>`,
    );
  }

  // Chirality: a spiral arm turns; a loop closes.
  let motion = '';
  if (verb === 'spiral') {
    motion = `<path d="M ${cx} ${cy - 34} A 34 34 0 1 1 ${cx - 24} ${cy + 24}" fill="none" stroke-width="1" stroke-dasharray="3 4"/>`;
  } else if (verb === 'loop') {
    motion = `<circle cx="${cx}" cy="${cy}" r="34" fill="none" stroke-width="1" stroke-dasharray="3 4"/>`;
  }

  const particleAngle = ((seed % 360) / 360) * Math.PI * 2;
  const particle =
    `<circle cx="${(cx + radius * Math.cos(particleAngle)).toFixed(1)}" cy="${(cy + radius * Math.sin(particleAngle)).toFixed(1)}" ` +
    `r="3" fill="currentColor" stroke="none" class="sigil-particle"/>`;

  const memory = committed(state, 'B1');
  const center = memory && CENTER_GLYPHS[memory] ? CENTER_GLYPHS[memory](memory) : '';

  // Rings count completed incarnations (v1 §16: number of rings = repeat runs).
  const ringCount = Math.min(3, Math.max(0, incarnation - 1));
  let rings = '';
  for (let i = 0; i < ringCount; i += 1) {
    rings += `<circle cx="${cx}" cy="${cy}" r="${70 + i * 6}" fill="none" stroke-width="0.6" opacity="0.5"/>`;
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" stroke="currentColor" class="sigil">` +
    rings + perimeter + motion + fractures.join('') + center + particle + `</svg>`;

  const description =
    `A hand-drawn sigil: a ${sides}-sided ${open ? 'open' : 'closed'} figure` +
    `${ringCount > 0 ? ` inside ${ringCount + 1 === 2 ? 'a second ring' : `${ringCount} faint rings`} — one per incarnation` : ''}` +
    `${fractureCount > 0 ? ` with ${fractureCount} fracture${fractureCount === 1 ? '' : 's'}` : ''}` +
    `${memory ? `, a ${memory.replace(/_/g, ' ')} mark at its heart` : ''}` +
    `${verb === 'spiral' ? ', a spiral arm turning through it' : verb === 'loop' ? ', a closed ring inside it' : ''}` +
    `, and one small particle resting on its edge — the question carried forward.`;

  return { svg, description };
}
