import type { Cell, Gesture, Mood } from '../engine/rorschach';
import { COLS, ROWS, describe, frame, frameCells, rampChar } from '../engine/rorschach';

/**
 * The Bard's face, mounted — the dominant presence on the desk (CD directive
 * 2026-07-14: hypnotic, responsive, a moving art piece; the Self-Portrait's
 * energy in the Bardo's ink).
 *
 * Two bodies, one brain:
 *  - Canvas body (browsers): the deterministic frame grid painted at display
 *    rate, ink intensity blended between adjacent ticks so the blot moves like
 *    liquid; per-glyph shimmer; a faint breathing halo; the whole field drifts
 *    a few pixels toward the pointer — attention, the only sense it has.
 *  - Text body (no 2D context, e.g. jsdom): the original <pre> at ~7 fps.
 *
 * The character grid itself stays a pure function of (params, tick) — life
 * comes from advancing the tick, never from randomness. Under
 * prefers-reduced-motion the face holds a single still frame and all gestures
 * (one-shot and held) are skipped: the character survives, the motion does not.
 */

const TICK_MS = 140;
const GESTURE_TICKS = 8;
const SEED = 108;
/** Held attention eases in over ~4 ticks and lets go a little slower. */
const HOLD_IN_TICKS = 4;
const HOLD_OUT_TICKS = 6;

/** Cell aspect of the page's monospace stack — width as a fraction of height. */
const CELL_ASPECT = 0.62;
const FONT_STACK = '"IBM Plex Mono", "Menlo", "Consolas", monospace';

/** Ink by intensity: dim ground, body, and the bright living core. */
const INK_DIM = '#6f6f68';
const INK_BODY = '#9a9a90';
const INK_CORE = '#c2c8b2';
const HALO_RGB = '184, 196, 168'; // --accent

export class Blot {
  private readonly wrap: HTMLElement;
  private readonly reduced: boolean;

  // brain
  private mood: Mood = 'calm';
  private sparseness = 0;
  private gesture: Gesture = 'none';
  private gestureStart = 0; // in ticks (fractional in the canvas body)
  private held: Gesture = 'none';
  private heldLevel = 0;
  private heldTarget = 0;

  // canvas body
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private raf = 0;
  private t0 = -1;
  private tickF = 0;
  private lastNow = 0;
  private pointerX = 0.5; // 0..1 across the viewport
  private drift = 0; // eased px offset toward the pointer
  private readonly onPointerMove = (e: PointerEvent): void => {
    const w = window.innerWidth || 1;
    this.pointerX = Math.min(1, Math.max(0, e.clientX / w));
  };
  private readonly onResize = (): void => this.resize();
  private readonly onVisibility = (): void => {
    if (document.hidden) this.stopLoop();
    else this.startLoop();
  };

  // text body
  private pre: HTMLElement | null = null;
  private tick = 0;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(container: HTMLElement) {
    this.wrap = document.createElement('div');
    this.wrap.className = 'blot-wrap';
    this.wrap.setAttribute('role', 'img');
    container.appendChild(this.wrap);
    this.reduced =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.ctx = this.probeCanvas();
    if (this.ctx && this.canvas) {
      this.canvas.className = 'blot-canvas';
      this.canvas.setAttribute('aria-hidden', 'true');
      this.wrap.appendChild(this.canvas);
      this.resize();
      window.addEventListener('resize', this.onResize);
      if (!this.reduced) {
        window.addEventListener('pointermove', this.onPointerMove);
        document.addEventListener('visibilitychange', this.onVisibility);
        this.startLoop();
      } else {
        this.paint(0);
      }
    } else {
      this.pre = document.createElement('pre');
      this.pre.className = 'blot';
      this.pre.setAttribute('aria-hidden', 'true');
      this.wrap.appendChild(this.pre);
      if (!this.reduced) {
        this.timer = setInterval(() => {
          this.tick += 1;
          this.drawText();
        }, TICK_MS);
      }
      this.drawText();
    }
  }

  /** Set the face's weather. Label updates so the description stays true. */
  set(mood: Mood, sparseness = 0): void {
    this.mood = mood;
    this.sparseness = sparseness;
    this.wrap.setAttribute('aria-label', describe(mood, sparseness));
    if (this.pre) this.drawText();
    else if (this.reduced) this.paint(0);
  }

  /** A momentary reaction — the unspoken performance. 'still' is the loudest. */
  react(gesture: Gesture): void {
    if (this.reduced || gesture === 'none' || gesture === 'attend' || gesture === 'sway') return;
    this.gesture = gesture;
    this.gestureStart = this.pre ? this.tick : this.tickF;
    this.heldTarget = 0; // a reaction supersedes hover attention
    if (this.pre) this.drawText();
  }

  /** Begin holding attention (a hand hovers near a button). Eases in. */
  hold(gesture: 'attend' | 'sway'): void {
    if (this.reduced || !this.ctx) return;
    this.held = gesture;
    this.heldTarget = 1;
  }

  /** Let the attention go (the hand moved away). Eases out. */
  release(): void {
    this.heldTarget = 0;
  }

  destroy(): void {
    if (this.timer !== null) clearInterval(this.timer);
    this.stopLoop();
    if (this.ctx) {
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener('pointermove', this.onPointerMove);
      document.removeEventListener('visibilitychange', this.onVisibility);
    }
    this.wrap.remove();
  }

  // ── canvas body ────────────────────────────────────────────────────────

  private probeCanvas(): CanvasRenderingContext2D | null {
    // jsdom offers no 2D context (and logs when probed), so the text body is
    // taken directly there — which also keeps the DOM tests on the text path.
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) return null;
    if (typeof requestAnimationFrame !== 'function') return null;
    try {
      this.canvas = document.createElement('canvas');
      return this.canvas.getContext('2d');
    } catch {
      this.canvas = null;
      return null;
    }
  }

  private startLoop(): void {
    if (this.reduced || this.raf !== 0 || !this.ctx) return;
    const loop = (now: number): void => {
      this.raf = requestAnimationFrame(loop);
      if (this.t0 < 0) this.t0 = now;
      const dtTicks = Math.min(3, (now - this.lastNow) / TICK_MS);
      this.lastNow = now;
      this.tickF = (now - this.t0) / TICK_MS;
      this.ease(dtTicks);
      this.paint(this.tickF);
    };
    this.lastNow = typeof performance !== 'undefined' ? performance.now() : 0;
    this.raf = requestAnimationFrame(loop);
  }

  private stopLoop(): void {
    if (this.raf !== 0) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private ease(dtTicks: number): void {
    const rate = this.heldTarget > this.heldLevel ? HOLD_IN_TICKS : HOLD_OUT_TICKS;
    const step = dtTicks / rate;
    this.heldLevel =
      this.heldTarget > this.heldLevel
        ? Math.min(this.heldTarget, this.heldLevel + step)
        : Math.max(this.heldTarget, this.heldLevel - step);
    if (this.heldLevel === 0 && this.heldTarget === 0) this.held = 'none';
    // attention drift: the field leans a few pixels toward the pointer
    const target = (this.pointerX - 0.5) * 10;
    this.drift += (target - this.drift) * Math.min(1, dtTicks * 0.12);
  }

  private resize(): void {
    if (!this.canvas || !this.ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.wrap.clientWidth;
    const h = this.wrap.clientHeight;
    this.canvas.width = Math.max(1, Math.round(w * dpr));
    this.canvas.height = Math.max(1, Math.round(h * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.reduced) this.paint(0);
  }

  private activeGesture(tickNow: number): { gesture: Gesture; gestureT: number } {
    if (this.gesture !== 'none') {
      const t = (tickNow - this.gestureStart) / GESTURE_TICKS;
      if (t < 1) return { gesture: this.gesture, gestureT: Math.max(0, t) };
      this.gesture = 'none';
    }
    if (this.heldLevel > 0.005 && this.held !== 'none') {
      return { gesture: this.held, gestureT: this.heldLevel };
    }
    return { gesture: 'none', gestureT: 0 };
  }

  private paint(tickF: number): void {
    const ctx = this.ctx;
    const canvas = this.canvas;
    if (!ctx || !canvas) return;
    const w = this.wrap.clientWidth;
    const h = this.wrap.clientHeight;
    if (w < 2 || h < 2) return;

    const { gesture, gestureT } = this.activeGesture(tickF);
    const params = { mood: this.mood, seed: SEED, sparseness: this.sparseness, gesture, gestureT };
    const tickA = Math.floor(tickF);
    const frac = tickF - tickA;
    const f = frac * frac * (3 - 2 * frac);
    const cellsA = frameCells(params, tickA);
    const cellsB = frameCells(params, tickA + 1);
    // point/ember/still draw their own sparse glyphs; fields re-pick from the
    // ramp after blending so the ink morphs smoothly between ticks.
    const special =
      this.mood === 'point' || this.mood === 'ember' || this.sparseness >= 9 ||
      (gesture === 'still' && Math.sin(Math.min(Math.max(gestureT, 0), 1) * Math.PI) > 0.3);

    const cellH = Math.min(h / ROWS, w / COLS / CELL_ASPECT);
    const cellW = cellH * CELL_ASPECT;
    const gridW = cellW * COLS;
    const gridH = cellH * ROWS;
    const ox = (w - gridW) / 2 + this.drift;
    const oy = (h - gridH) / 2;
    // attend leans the whole body down a little, beyond the ink's own shift
    const lean = gesture === 'attend' ? gestureT * cellH * 0.6 : 0;

    ctx.clearRect(0, 0, w, h);

    // the halo — a faint breath of light behind the ink, fading as the Vigil thins
    const haloStrength = special ? 0 : Math.max(0, 1 - this.sparseness / 6);
    if (haloStrength > 0.01) {
      const hx = ox + gridW / 2;
      const hy = oy + gridH / 2 + lean;
      const hr = Math.max(gridW, gridH) * 0.55;
      const halo = ctx.createRadialGradient(hx, hy, hr * 0.1, hx, hy, hr);
      const a = (0.05 + 0.02 * Math.sin(tickF * 0.11)) * haloStrength;
      halo.addColorStop(0, `rgba(${HALO_RGB}, ${a.toFixed(4)})`);
      halo.addColorStop(1, `rgba(${HALO_RGB}, 0)`);
      ctx.fillStyle = halo;
      ctx.fillRect(hx - hr, hy - hr, hr * 2, hr * 2);
    }

    ctx.font = `${Math.max(4, cellH * 0.92)}px ${FONT_STACK}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let y = 0; y < ROWS; y += 1) {
      const rowA = cellsA[y]!;
      const rowB = cellsB[y]!;
      const py = oy + (y + 0.5) * cellH + lean;
      for (let x = 0; x < COLS; x += 1) {
        const a = rowA[x]!;
        const b = rowB[x]!;
        const v = a.v + (b.v - a.v) * f;
        if (v <= 0.03) continue;
        let ch: string;
        if (special) {
          ch = (f < 0.5 ? a.ch : b.ch);
          if (ch === ' ') ch = a.ch !== ' ' ? a.ch : b.ch;
        } else {
          ch = rampChar(v);
        }
        if (ch === ' ') continue;
        // per-glyph shimmer: a slow, deterministic breathing of brightness
        const phase = x * 127.1 + y * 311.7;
        const shimmer = 0.78 + 0.22 * Math.sin(tickF * 0.55 + phase);
        ctx.globalAlpha = Math.min(1, (0.16 + 0.84 * Math.min(1, v * 1.15)) * shimmer);
        ctx.fillStyle = v < 0.35 ? INK_DIM : v < 0.65 ? INK_BODY : INK_CORE;
        ctx.fillText(ch, ox + (x + 0.5) * cellW, py);
      }
    }
    ctx.globalAlpha = 1;
  }

  // ── text body ──────────────────────────────────────────────────────────

  private drawText(): void {
    if (!this.pre) return;
    const { gesture, gestureT } = this.activeGesture(this.tick);
    this.pre.textContent = frame(
      { mood: this.mood, seed: SEED, sparseness: this.sparseness, gesture, gestureT },
      this.reduced ? 0 : this.tick,
    );
  }
}
