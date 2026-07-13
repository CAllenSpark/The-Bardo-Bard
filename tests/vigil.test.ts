import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { VigilClock } from '../src/engine/vigil';
import schedule from '../content/vigil/schedule.json';

describe('Vigil clock skeleton (fake-timer harness for Phase 2)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const smallSchedule = {
    rungs: [
      { id: 'patience', afterMs: 1000 },
      { id: 'fear', afterMs: 2500 },
      { id: 'endgame', afterMs: 4000 },
    ],
  };

  it('surfaces rungs in order as visible stillness accumulates', () => {
    const seen: string[] = [];
    const clock = new VigilClock(smallSchedule, (r) => seen.push(r.id));
    clock.start();
    vi.advanceTimersByTime(999);
    expect(seen).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(seen).toEqual(['patience']);
    vi.advanceTimersByTime(3000);
    expect(seen).toEqual(['patience', 'fear', 'endgame']);
    expect(clock.done()).toBe(true);
  });

  it('hidden-tab time does not advance the ladder (Compass §4.3)', () => {
    const seen: string[] = [];
    const clock = new VigilClock(smallSchedule, (r) => seen.push(r.id));
    clock.start();
    vi.advanceTimersByTime(500);
    clock.pause(); // tab hidden — the desk keeps your place
    vi.advanceTimersByTime(60_000);
    expect(seen).toEqual([]);
    expect(clock.visibleElapsedMs).toBe(500);
    clock.start(); // visible again
    vi.advanceTimersByTime(500);
    expect(seen).toEqual(['patience']);
  });

  it('stop() ends the vigil permanently (the player chose)', () => {
    const seen: string[] = [];
    const clock = new VigilClock(smallSchedule, (r) => seen.push(r.id));
    clock.start();
    vi.advanceTimersByTime(500);
    clock.stop();
    vi.advanceTimersByTime(60_000);
    clock.start();
    vi.advanceTimersByTime(60_000);
    expect(seen).toEqual([]);
  });

  it('the shipped schedule walks the full authored ladder to END GAME in 7-10 minutes', () => {
    const seen: string[] = [];
    const clock = new VigilClock(schedule as { rungs: { id: string; afterMs: number }[] }, (r) =>
      seen.push(r.id),
    );
    clock.start();
    vi.advanceTimersByTime(10 * 60 * 1000);
    expect(seen).toEqual([
      'patience', 'fear', 'temptation', 'desire', 'hope',
      'loss', 'guilt', 'conformity', 'plea', 'endgame',
    ]);
    const endgame = (schedule as { rungs: { id: string; afterMs: number }[] }).rungs.at(-1)!;
    expect(endgame.afterMs).toBeGreaterThanOrEqual(7 * 60 * 1000);
    expect(endgame.afterMs).toBeLessThanOrEqual(10 * 60 * 1000);
  });
});
