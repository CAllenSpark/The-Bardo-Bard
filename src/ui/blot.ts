import type { Gesture, Mood } from '../engine/rorschach';
import { describe, frame } from '../engine/rorschach';

/**
 * The Bard's face, mounted. Drives the deterministic Rorschach frames on a
 * slow heartbeat (~7 fps — breath, not video). Under prefers-reduced-motion
 * the face holds a single still frame and gestures are skipped: the character
 * survives, the motion does not.
 */

const TICK_MS = 140;
const GESTURE_TICKS = 8;
const SEED = 108;

export class Blot {
  private readonly wrap: HTMLElement;
  private readonly pre: HTMLElement;
  private mood: Mood = 'calm';
  private sparseness = 0;
  private gesture: Gesture = 'none';
  private gestureStart = 0;
  private tick = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private readonly reduced: boolean;

  constructor(container: HTMLElement) {
    this.wrap = document.createElement('div');
    this.wrap.className = 'blot-wrap';
    this.wrap.setAttribute('role', 'img');
    this.pre = document.createElement('pre');
    this.pre.className = 'blot';
    this.pre.setAttribute('aria-hidden', 'true');
    this.wrap.appendChild(this.pre);
    container.appendChild(this.wrap);
    this.reduced =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.reduced) {
      this.timer = setInterval(() => {
        this.tick += 1;
        this.draw();
      }, TICK_MS);
    }
    this.draw();
  }

  /** Set the face's weather. Label updates so the description stays true. */
  set(mood: Mood, sparseness = 0): void {
    this.mood = mood;
    this.sparseness = sparseness;
    this.wrap.setAttribute('aria-label', describe(mood, sparseness));
    this.draw();
  }

  /** A momentary reaction — the unspoken performance. 'still' is the loudest. */
  react(gesture: Gesture): void {
    if (this.reduced || gesture === 'none') return;
    this.gesture = gesture;
    this.gestureStart = this.tick;
    this.draw();
  }

  destroy(): void {
    if (this.timer !== null) clearInterval(this.timer);
    this.wrap.remove();
  }

  private draw(): void {
    let gestureT = 0;
    if (this.gesture !== 'none') {
      gestureT = (this.tick - this.gestureStart) / GESTURE_TICKS;
      if (gestureT >= 1) {
        this.gesture = 'none';
        gestureT = 0;
      }
    }
    this.pre.textContent = frame(
      {
        mood: this.mood,
        seed: SEED,
        sparseness: this.sparseness,
        gesture: this.gesture,
        gestureT,
      },
      this.reduced ? 0 : this.tick,
    );
  }
}
