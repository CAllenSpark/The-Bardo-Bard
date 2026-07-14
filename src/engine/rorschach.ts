/**
 * The Rorschach — the Bard's face (Compass Phase 4; MDD v1 §17.2; CD directives
 * 2026-07-14: the blot is a character — emotion, shape, rhythm, reaction; a
 * deliberate non-response can say more than a paragraph; it must stay living —
 * and it is the dominant presence on the desk: hypnotic, responsive, a moving
 * art piece. When a hand hovers near a choice it may draw down with
 * anticipation, or dance — but the reaction never maps to the choice.)
 *
 * Deterministic everywhere testable: frame(params, tick) is a pure function —
 * identical params and tick produce the identical grid, forever. Life comes
 * from advancing the tick, not from randomness.
 *
 * v1 §17.2 cautions hold: fear is not moral failure (the fear field is the
 * player's weather, mirrored, never a punishment); kindness never turns
 * saccharine (bloom is brief); silence is an active choice (the pulse).
 */

export type Mood =
  | 'calm'      // symmetric blot, breathing
  | 'fear'      // compression, jitter, narrowed
  | 'curious'   // ridged branching, open apertures
  | 'angular'   // quantized spokes — boundary-setting, not hostility
  | 'soft'      // slow, tender, mirrored
  | 'bare'      // low-intensity sparse field (the confession, the review)
  | 'spiral'    // slow rotation
  | 'dispersal' // an outline letting go outward
  | 'asym'      // the mirror deliberately broken (refusing the premise)
  | 'point'     // a single pulsing pixel
  | 'ember';    // the closed desk: two or three faint, patient flickers

/**
 * bloom/contract/jitter/still are one-shot reactions (a sine envelope, then
 * gone). attend/sway are *held* attention — the level itself is passed as
 * gestureT and eased by the body that hosts the face:
 *   attend — the ink draws downward, gathering slightly: anticipation.
 *   sway   — the whole blot rocks side to side, still mirrored: a small dance.
 */
export type Gesture = 'bloom' | 'contract' | 'jitter' | 'still' | 'attend' | 'sway' | 'none';

export interface BlotParams {
  mood: Mood;
  seed: number;
  /** 0..9 — the Vigil's thinning; each rung raises it, the plea leaves a pulse. */
  sparseness?: number;
  gesture?: Gesture;
  /** 0..1 — one-shot progress, or the held level for attend/sway. */
  gestureT?: number;
}

/** One cell of the face: the glyph, and the raw ink intensity that chose it. */
export interface Cell {
  ch: string;
  v: number;
}

export const COLS = 61;
export const ROWS = 21;

const RAMP = ' ····::∘∘++**#';

/** The glyph a given ink intensity earns. Exposed so a renderer that blends
 *  intensities between ticks can stay in the same alphabet as the face. */
export function rampChar(v: number): string {
  const idx = Math.max(0, Math.min(RAMP.length - 1, Math.floor(v * RAMP.length)));
  return RAMP[idx]!;
}

function hash(x: number, y: number, t: number, seed: number): number {
  let h = (seed ^ (x * 374761393) ^ (y * 668265263) ^ (t * 2246822519)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Smooth-ish value noise: bilinear blend of lattice hashes, slow time drift. */
function noise(x: number, y: number, t: number, seed: number, scale: number): number {
  const gx = x / scale;
  const gy = y / scale;
  const x0 = Math.floor(gx);
  const y0 = Math.floor(gy);
  const fx = gx - x0;
  const fy = gy - y0;
  const blend = (a: number, b: number, f: number) => a + (b - a) * (f * f * (3 - 2 * f));
  const n = (ix: number, iy: number) => {
    const a = hash(ix, iy, Math.floor(t), seed);
    const b = hash(ix, iy, Math.floor(t) + 1, seed);
    return blend(a, b, t - Math.floor(t));
  };
  return blend(blend(n(x0, y0), n(x0 + 1, y0), fx), blend(n(x0, y0 + 1), n(x0 + 1, y0 + 1), fx), fy);
}

const PULSE_CHARS = [' ', '·', '∘', '*', '∘', '·'];
const PULSE_V = [0, 0.3, 0.55, 0.85, 0.55, 0.3];

function emptyGrid(cols: number, rows: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ ch: ' ', v: 0 })),
  );
}

function pulseCells(tick: number, cols: number, rows: number): Cell[][] {
  const grid = emptyGrid(cols, rows);
  const cy = Math.floor(rows / 2);
  const cx = Math.floor(cols / 2);
  const phase = Math.floor(tick / 2) % PULSE_CHARS.length;
  grid[cy]![cx] = { ch: PULSE_CHARS[phase]!, v: PULSE_V[phase]! };
  return grid;
}

function emberCells(tick: number, seed: number, cols: number, rows: number): Cell[][] {
  const grid = emptyGrid(cols, rows);
  const cy = Math.floor(rows / 2);
  const cx = Math.floor(cols / 2);
  const spots: Array<[number, number]> = [[cx, cy], [cx - 6, cy + 2], [cx + 8, cy - 2]];
  spots.forEach(([x, y], i) => {
    const v = hash(i, 0, Math.floor(tick / 3), seed);
    grid[y]![x] = v > 0.66 ? { ch: '∘', v: 0.55 } : v > 0.33 ? { ch: '·', v: 0.3 } : { ch: ' ', v: 0 };
  });
  return grid;
}

/** One deterministic frame of the Bard's face, as cells with raw intensity. */
export function frameCells(params: BlotParams, tick: number): Cell[][] {
  const { mood, seed } = params;
  const sparse = params.sparseness ?? 0;
  const gesture = params.gesture ?? 'none';
  const g = gesture !== 'none' ? Math.min(Math.max(params.gestureT ?? 0, 0), 1) : 0;
  // One-shot gestures rise and settle; held attention is the level itself.
  const held = gesture === 'attend' || gesture === 'sway';
  const envelope = g > 0 ? (held ? g : Math.sin(g * Math.PI)) : 0;

  if (mood === 'point' || sparse >= 9) return pulseCells(tick, COLS, ROWS);
  if (mood === 'ember') return emberCells(tick, seed, COLS, ROWS);
  if (gesture === 'still' && envelope > 0.3) return pulseCells(tick, COLS, ROWS);

  const t = tick * (mood === 'soft' ? 0.05 : mood === 'fear' ? 0.35 : 0.12);
  const cx = (COLS - 1) / 2;
  // attend: the ink draws downward — leaning over the desk toward the hand.
  const cy = (ROWS - 1) / 2 + (gesture === 'attend' ? envelope * ROWS * 0.14 : 0);

  let radius = 0.82 + 0.09 * Math.sin(tick * 0.09);
  if (gesture === 'bloom') radius *= 1 + 0.3 * envelope;
  if (gesture === 'contract') radius *= 1 - 0.35 * envelope;
  if (gesture === 'attend') radius *= 1 - 0.1 * envelope; // gathering, focused
  if (mood === 'fear') radius *= 0.7;

  const grid: Cell[][] = [];
  for (let y = 0; y < ROWS; y += 1) {
    const row: Cell[] = [];
    // sway: each row shifts as a unit, so the mirrored body rocks whole.
    const shift = gesture === 'sway' ? envelope * COLS * 0.07 * Math.sin(tick * 0.28 + y * 0.5) : 0;
    for (let x = 0; x < COLS; x += 1) {
      const xs = x - shift;
      // Rorschach symmetry: mirror across the vertical axis — unless the
      // premise itself is being refused.
      const mx = mood === 'asym' ? xs : xs <= cx ? xs : 2 * cx - xs;
      let dx = (xs - cx) / (COLS * 0.42);
      const dy = (y - cy) / (ROWS * 0.62);
      if (mood === 'fear') dx *= 1.7; // narrowing corridors
      let d = Math.sqrt(dx * dx + dy * dy);
      if (mood === 'dispersal') d = Math.abs(d - 0.85 - tick * 0.004); // a ring, leaving
      if (mood === 'spiral') {
        const angle = Math.atan2(dy, dx) + tick * 0.04;
        d += 0.16 * Math.sin(angle * 3 + d * 5);
      }
      if (mood === 'angular') {
        const angle = Math.atan2(dy, (xs - cx) / (COLS * 0.42));
        d *= 1 + 0.28 * Math.abs(Math.sin(angle * 2.5));
      }

      let n = noise(mx, y * 2, t, seed, 3.1);
      if (mood === 'curious') n = 1 - Math.abs(2 * n - 1); // ridged: branches and apertures
      if (mood === 'fear') n = n * 0.6 + hash(x, y, tick, seed) * 0.4; // jitter
      if (gesture === 'jitter') n = n * (1 - 0.5 * envelope) + hash(x, y, tick, seed + 7) * 0.5 * envelope;

      let v = Math.max(0, 1 - d / radius) * (0.45 + 0.55 * n);
      if (mood === 'bare') v *= 0.5;
      if (mood === 'soft') v = Math.min(v, 0.62);
      v -= sparse * 0.085;
      v = Math.max(0, v);

      row.push({ ch: rampChar(v), v });
    }
    grid.push(row);
  }
  return grid;
}

/** One deterministic frame of the Bard's face, as text (the same face). */
export function frame(params: BlotParams, tick: number): string {
  return frameCells(params, tick)
    .map((row) => row.map((cell) => cell.ch).join(''))
    .join('\n');
}

/**
 * The face's reaction when a hand hovers near a button. Deterministic and
 * deliberately arbitrary: a hash of the two ids and nothing else — never the
 * choice's content, tally, or effects — so the Bard seems to have preferences
 * without the preferences meaning anything (CD directive 2026-07-14: never
 * overtly mapping to the choice).
 */
export function hoverGesture(nodeId: string, choiceId: string): 'attend' | 'sway' {
  let h = 2166136261 >>> 0;
  const key = `${nodeId}§${choiceId}`;
  for (let i = 0; i < key.length; i += 1) {
    h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  }
  return (h >>> 0) / 4294967296 < 0.3 ? 'sway' : 'attend';
}

/** A concise text alternative per mood (v1 §20: ASCII carries descriptions). */
export function describe(mood: Mood, sparseness = 0): string {
  if (sparseness >= 9 || mood === 'point') return 'A single point of ink, pulsing slowly, alone on the page.';
  if (sparseness > 0) return 'An ink blot thinned almost to nothing; scattered points remain, still moving.';
  switch (mood) {
    case 'fear': return 'An ink blot compressed and trembling, its corridors narrowed.';
    case 'curious': return 'An ink blot branching outward, openings appearing like doorways.';
    case 'angular': return 'An ink blot thrown into hard angles and spokes.';
    case 'soft': return 'An ink blot moving slowly and gently, its edges tender.';
    case 'bare': return 'A faint, sparse ink blot, holding very still.';
    case 'spiral': return 'An ink blot turning slowly around its own center.';
    case 'dispersal': return 'An ink blot loosening into a widening ring, letting go of its outline.';
    case 'asym': return 'An ink blot that has stopped mirroring itself; its two halves disagree.';
    case 'ember': return 'Two or three faint points of ink, flickering patiently on an empty page.';
    default: return 'A symmetrical ink blot, breathing slowly.';
  }
}
