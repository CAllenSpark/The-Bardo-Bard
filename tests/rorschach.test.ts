import { describe, expect, it } from 'vitest';
import { COLS, ROWS, describe as describeMood, frame } from '../src/engine/rorschach';
import type { BlotParams, Mood } from '../src/engine/rorschach';

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

  it('every mood carries a text alternative', () => {
    for (const mood of MOODS) {
      expect(describeMood(mood).length).toBeGreaterThan(10);
    }
    expect(describeMood('calm', 9)).toContain('single point');
  });
});
