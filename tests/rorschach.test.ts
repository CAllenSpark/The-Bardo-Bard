import { describe, expect, it } from 'vitest';
import { COLS, ROWS, describe as describeMood, frame, frameCells, hoverGesture, rampChar } from '../src/engine/rorschach';
import type { BlotParams, Cell, Mood } from '../src/engine/rorschach';

const MOODS: Mood[] = ['calm', 'fear', 'curious', 'angular', 'soft', 'bare', 'spiral', 'dispersal', 'asym', 'point', 'ember'];

function params(mood: Mood, extra: Partial<BlotParams> = {}): BlotParams {
  return { mood, seed: 108, ...extra };
}

function inkCount(text: string): number {
  return text.replace(/[\s\n]/g, '').length;
}

describe('the Rorschach — the Bard\'s face (Gate 4)', () => {
  it('is deterministic: identical params and tick, identical frame — every mood', () => {
    for (const mood of MOODS) {
      expect(frame(params(mood), 17)).toBe(frame(params(mood), 17));
    }
  });

  it('is alive: consecutive ticks differ — every mood, including the last ember', () => {
    for (const mood of MOODS) {
      const frames = new Set([frame(params(mood), 1), frame(params(mood), 7), frame(params(mood), 13)]);
      expect(frames.size, mood).toBeGreaterThan(1);
    }
  });

  it('keeps the frame within its grid', () => {
    const lines = frame(params('calm'), 5).split('\n');
    expect(lines).toHaveLength(ROWS);
    for (const line of lines) expect(line).toHaveLength(COLS);
  });

  it('moods are visually distinct fields', () => {
    const rendered = new Set(MOODS.map((mood) => frame(params(mood), 9)));
    expect(rendered.size).toBe(MOODS.length);
  });

  it('the point is a single pulsing pixel — one character of ink, at most', () => {
    for (const tick of [0, 2, 4, 6, 8]) {
      expect(inkCount(frame(params('point'), tick))).toBeLessThanOrEqual(1);
    }
    // and across the pulse cycle it breathes rather than freezes
    const cycle = new Set([0, 2, 4, 6, 8, 10].map((t) => frame(params('point'), t)));
    expect(cycle.size).toBeGreaterThan(1);
  });

  it('the Vigil thins the face: more sparseness, less ink, until the pulse', () => {
    const dense = inkCount(frame(params('calm'), 5));
    const thin = inkCount(frame(params('calm', { sparseness: 5 }), 5));
    expect(thin).toBeLessThan(dense);
    expect(inkCount(frame(params('calm', { sparseness: 9 }), 5))).toBeLessThanOrEqual(1);
  });

  it('the ember keeps the closed desk alive with at most three faint points', () => {
    for (const tick of [0, 3, 6, 9]) {
      expect(inkCount(frame(params('ember'), tick))).toBeLessThanOrEqual(3);
    }
  });

  it('refusing the premise breaks the mirror; every other blot is symmetric', () => {
    const symmetric = frame(params('calm'), 9).split('\n');
    for (const line of symmetric) {
      expect(line).toBe([...line].reverse().join(''));
    }
    const broken = frame(params('asym'), 9).split('\n');
    expect(broken.some((line) => line !== [...line].reverse().join(''))).toBe(true);
  });

  it('the still gesture overrides the field with the pulse — the loudest non-response', () => {
    const still = frame(params('calm', { gesture: 'still', gestureT: 0.5 }), 9);
    expect(inkCount(still)).toBeLessThanOrEqual(1);
  });

  it('the canvas body and the text body are the same face', () => {
    for (const mood of MOODS) {
      const cells = frameCells(params(mood), 9);
      expect(cells).toHaveLength(ROWS);
      const text = cells.map((row) => row.map((c) => c.ch).join('')).join('\n');
      expect(text).toBe(frame(params(mood), 9));
      // every glyph's intensity stays in range for the painter
      for (const row of cells) for (const c of row) {
        expect(c.v).toBeGreaterThanOrEqual(0);
        expect(rampChar(c.v)).toBe(c.ch);
      }
    }
  });

  it('attend draws the ink downward — anticipation, not judgment', () => {
    const centerOfMassY = (cells: Cell[][]): number => {
      let weighted = 0;
      let total = 0;
      cells.forEach((row, y) =>
        row.forEach((c) => {
          weighted += y * c.v;
          total += c.v;
        }),
      );
      return weighted / total;
    };
    const atRest = centerOfMassY(frameCells(params('calm'), 9));
    const attending = centerOfMassY(frameCells(params('calm', { gesture: 'attend', gestureT: 1 }), 9));
    expect(attending).toBeGreaterThan(atRest + 1);
  });

  it('sway keeps the face whole while it dances', () => {
    const still = frame(params('calm'), 9);
    const dancing = frame(params('calm', { gesture: 'sway', gestureT: 1 }), 9);
    expect(dancing).not.toBe(still);
    expect(inkCount(dancing)).toBeGreaterThan(inkCount(still) * 0.5);
    // and it is deterministic like everything else
    expect(dancing).toBe(frame(params('calm', { gesture: 'sway', gestureT: 1 }), 9));
  });

  it('hover preference is deterministic, two-flavored, and consults only the ids', () => {
    expect(hoverGesture('a2_arrival', 'accept')).toBe(hoverGesture('a2_arrival', 'accept'));
    const flavors = new Set<string>();
    for (const node of ['a1_consent', 'a2_arrival', 'b1_frame', 'c1_regret', 'd1_verdict', 'e1_keeper'])
      for (const choice of ['yes', 'no', 'wait', 'refuse', 'ask'])
        flavors.add(hoverGesture(node, choice));
    expect(flavors).toEqual(new Set(['attend', 'sway']));
  });

  it('the lone pulse breathes slower as the field depletes (#7 thinning-as-depletion)', () => {
    // A shallow field pulses briskly (phase turns every 2 ticks); a fully
    // depleted field — the plea and END GAME (sparse 9) — holds each phase
    // twice as long: a tired heartbeat, not a metronome.
    const at = (sparse: number, tick: number) => frame(params('point', { sparseness: sparse }), tick);
    expect(at(0, 0)).not.toBe(at(0, 2)); // brisk: changed by tick 2
    expect(at(9, 0)).toBe(at(9, 2)); // depleted: still the same at tick 2
    expect(at(9, 0)).not.toBe(at(9, 4)); // ...but changed by tick 4
    // and it stays deterministic
    expect(at(9, 5)).toBe(frame(params('point', { sparseness: 9 }), 5));
  });

  it('every mood carries a text alternative', () => {
    for (const mood of MOODS) {
      expect(describeMood(mood).length).toBeGreaterThan(10);
    }
    expect(describeMood('calm', 9)).toContain('single point');
  });
});
