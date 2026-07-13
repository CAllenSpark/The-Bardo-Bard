/**
 * The Vigil clock (skeleton — full ladder ships in Phase 2).
 *
 * Counts VISIBLE stillness only (Compass §4.3): the ladder advances while the
 * page is visible and the player has not chosen; pausing (tab hidden) freezes
 * accumulated time. Rungs accrete and never expire.
 *
 * Deterministic and fake-timer friendly: driven by an injected interval timer,
 * no Date.now() — accumulated visible time is the only clock.
 */

export interface VigilRung {
  id: string;
  /** Cumulative milliseconds of visible stillness before this rung appears. */
  afterMs: number;
}

export interface VigilSchedule {
  rungs: VigilRung[];
}

const TICK_MS = 250;

export class VigilClock {
  private readonly rungs: VigilRung[];
  private readonly onRung: (rung: VigilRung) => void;
  private elapsed = 0;
  private nextIndex = 0;
  private running = false;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(schedule: VigilSchedule, onRung: (rung: VigilRung) => void) {
    this.rungs = [...schedule.rungs].sort((a, b) => a.afterMs - b.afterMs);
    this.onRung = onRung;
  }

  /** Begin (or resume) counting visible stillness. */
  start(): void {
    if (this.running || this.done()) return;
    this.running = true;
    this.timer = setInterval(() => this.tick(TICK_MS), TICK_MS);
  }

  /** Pause: hidden tab, or the player chose (the vigil only exists in stillness). */
  pause(): void {
    this.running = false;
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /** Stop permanently (player entered play or the run ended). */
  stop(): void {
    this.pause();
    this.nextIndex = this.rungs.length;
  }

  done(): boolean {
    return this.nextIndex >= this.rungs.length;
  }

  get visibleElapsedMs(): number {
    return this.elapsed;
  }

  private tick(ms: number): void {
    if (!this.running) return;
    this.elapsed += ms;
    while (!this.done()) {
      const rung = this.rungs[this.nextIndex];
      if (!rung || rung.afterMs > this.elapsed) break;
      this.nextIndex += 1;
      this.onRung(rung);
    }
    if (this.done()) this.pause();
  }
}
