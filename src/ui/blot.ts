import type { Cell, Gesture, Mood } from '../engine/rorschach';
import { COLS, ROWS, describe, frame, frameCells, rampChar } from '../engine/rorschach';

/**
 * The Bard's face, mounted — the dominant presence on the desk (CD 2026-07-14:
 * hypnotic, responsive, a moving art piece; 2026-07-16: living art with plans
 * of its own — it follows the cursor, blooms when touched, pools when you hold,
 * and now and then backs away as if wary of the encounter).
 *
 * Two bodies, one brain:
 *  - Canvas body (browsers): the deterministic frame grid painted at display
 *    rate, ink blended between adjacent ticks so the blot moves like liquid; a
 *    breathing halo; the whole field leans toward the pointer; transient letter
 *    particles can swirl off it (emit) to announce a new question.
 *  - Text body (no 2D context, e.g. jsdom): the original <pre> at ~7 fps.
 *
 * The character grid itself stays a pure function of (params, tick). Under
 * prefers-reduced-motion the face holds one still frame and ALL of the above
 * (gestures, drift, pooling, recoil, particles, takeover) is skipped: the
 * character survives, the motion does not.
 */

const TICK_MS = 140;
const GESTURE_TICKS = 8;
const SEED = 108;
const HOLD_IN_TICKS = 4;
const HOLD_OUT_TICKS = 6;

const CELL_ASPECT = 0.62;
const FONT_STACK = '"IBM Plex Mono", "Menlo", "Consolas", monospace';

const INK_DIM = '#6f6f68';
const INK_BODY = '#9a9a90';
const INK_CORE = '#c2c8b2';
const HALO_RGB = '184, 196, 168'; // --accent

/** How the field leans toward the pointer, and how much a held press pools it. */
const DRIFT_MAX = 13; // px of lean toward the cursor at rest
const POOL_MULT = 2.3; // extra pull while a press is held (flows around the cursor)
const RECOIL_MS = 1100; // how long the entity keeps its distance when it recoils
const TAU = Math.PI * 2;

interface Particle {
  ch: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
}

export class Blot {
  private readonly wrap: HTMLElement;
  private readonly reduced: boolean;

  // brain
  private mood: Mood = 'calm';
  private sparseness = 0;
  private gesture: Gesture = 'none';
  private gestureStart = 0;
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

  // interaction — the living art (CD 2026-07-16)
  private pointerX = 0.5; // 0..1 of the viewport
  private pointerY = 0.5;
  private driftX = 0;
  private driftY = 0;
  private pooling = 0; // 0..1 — a held press pulls the ink toward the cursor
  private poolTarget = 0;
  private engagements = 0;
  private recoilThreshold = 3; // every Nth encounter, it backs away instead
  private recoilUntil = 0;
  private gaspUntil = 0; // it forgets to follow your cursor — a held breath
  private particles: Particle[] = [];

  private readonly onPointerMove = (e: PointerEvent): void => {
    this.pointerX = Math.min(1, Math.max(0, e.clientX / (window.innerWidth || 1)));
    this.pointerY = Math.min(1, Math.max(0, e.clientY / (window.innerHeight || 1)));
  };
  private readonly onPointerDown = (e: PointerEvent): void => {
    this.poolTarget = 1; // holding pools the ink toward you
    // A press on a button is a choice, not an encounter with the entity — leave
    // those to the authored reaction. A press anywhere else is you reaching for
    // the creature: mostly it leans in and blooms; now and then it recoils.
    if (e.target instanceof Element && e.target.closest('button')) return;
    this.engagements += 1;
    if (this.engagements >= this.recoilThreshold) {
      this.engagements = 0;
      this.recoilThreshold = 3 + Math.floor(Math.random() * 3); // 3–5
      this.recoilUntil = this.clock() + RECOIL_MS;
      this.react('contract'); // a flinch — it keeps its distance
    } else {
      this.react('bloom'); // it likes being reached for
    }
  };
  private readonly onPointerUp = (): void => {
    this.poolTarget = 0;
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
        window.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointerup', this.onPointerUp);
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

  private clock(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
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
    this.heldTarget = 0;
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

  /** It forgets to follow you — the cursor-lean freezes mid-motion for a held
   *  breath, then resumes (the designer's "cursor gasp"). Reduced-motion no-op. */
  gasp(ms: number): void {
    if (this.reduced || !this.ctx) return;
    this.gaspUntil = this.clock() + ms;
  }

  /** Shed a scatter of letters that swirl off the ink — the question emerging
   *  from the entity (CD 2026-07-16). Rare by design; reduced-motion no-op. */
  emit(text: string): void {
    if (this.reduced || !this.ctx) return;
    const w = this.wrap.clientWidth;
    const h = this.wrap.clientHeight;
    if (w < 2 || h < 2) return;
    const chars = text.replace(/\s+/g, '');
    if (!chars) return;
    const n = Math.min(7, chars.length);
    for (let i = 0; i < n; i += 1) {
      const ch = chars[Math.floor((i * chars.length) / n)] ?? '·';
      const ang = (i / n) * TAU + (Math.random() - 0.5) * 0.6;
      const speed = 0.7 + Math.random() * 0.6;
      this.particles.push({
        ch,
        x: w / 2 + (Math.random() - 0.5) * w * 0.14,
        y: h / 2 + (Math.random() - 0.5) * h * 0.14,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed - 0.25, // a slight upward drift as they leave
        age: 0,
        life: 11 + Math.random() * 8,
      });
    }
  }

  /** The entity claims the whole browser for a moment, floods, then recollects
   *  into its band (a text-free transition flourish). */
  takeover(ms: number): void {
    if (this.reduced || !this.ctx) return;
    this.wrap.classList.add('stage-full');
    this.resize();
    this.react('bloom');
    window.setTimeout(() => {
      this.wrap.classList.remove('stage-full');
      this.resize();
    }, ms);
  }

  destroy(): void {
    if (this.timer !== null) clearInterval(this.timer);
    this.stopLoop();
    window.removeEventListener('resize', this.onResize);
    if (this.ctx) {
      window.removeEventListener('pointermove', this.onPointerMove);
      window.removeEventListener('pointerdown', this.onPointerDown);
      window.removeEventListener('pointerup', this.onPointerUp);
      document.removeEventListener('visibilitychange', this.onVisibility);
    }
    this.wrap.remove();
  }

  // ── canvas body ────────────────────────────────────────────────────────

  private probeCanvas(): CanvasRenderingContext2D | null {
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
    // held hover attention (attend / sway near a button)
    const rate = this.heldTarget > this.heldLevel ? HOLD_IN_TICKS : HOLD_OUT_TICKS;
    this.heldLevel =
      this.heldTarget > this.heldLevel
        ? Math.min(this.heldTarget, this.heldLevel + dtTicks / rate)
        : Math.max(this.heldTarget, this.heldLevel - dtTicks / rate);
    if (this.heldLevel === 0 && this.heldTarget === 0) this.held = 'none';

    // pooling — a held press pulls the ink harder toward the cursor
    this.pooling =
      this.poolTarget > this.pooling
        ? Math.min(this.poolTarget, this.pooling + dtTicks / 4)
        : Math.max(this.poolTarget, this.pooling - dtTicks / 8);

    // drift toward (or, when recoiling, away from) the pointer — unless it has
    // gasped, in which case the lean holds dead still for a beat
    const now = this.clock();
    if (now >= this.gaspUntil) {
      const recoiling = now < this.recoilUntil;
      const sign = recoiling ? -1.4 : 1;
      const rect = this.wrap.getBoundingClientRect();
      const dx = this.pointerX * (window.innerWidth || 1) - (rect.left + rect.width / 2);
      const dy = this.pointerY * (window.innerHeight || 1) - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const mag = DRIFT_MAX * (1 + (POOL_MULT - 1) * this.pooling) * sign;
      const targetX = (dx / dist) * mag;
      const targetY = (dy / dist) * mag * 0.6; // less vertical — stay mostly in the band
      this.driftX += (targetX - this.driftX) * Math.min(1, dtTicks * 0.12);
      this.driftY += (targetY - this.driftY) * Math.min(1, dtTicks * 0.12);
    }

    // shed letters drift and fade
    if (this.particles.length) {
      for (const p of this.particles) {
        p.x += p.vx * dtTicks;
        p.y += p.vy * dtTicks;
        p.vy += 0.02 * dtTicks; // a little settling
        p.age += dtTicks;
      }
      this.particles = this.particles.filter((p) => p.age < p.life);
    }
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
    const special =
      this.mood === 'point' || this.mood === 'ember' || this.sparseness >= 9 ||
      (gesture === 'still' && Math.sin(Math.min(Math.max(gestureT, 0), 1) * Math.PI) > 0.3);

    const cellH = Math.min(h / ROWS, w / COLS / CELL_ASPECT);
    const cellW = cellH * CELL_ASPECT;
    const gridW = cellW * COLS;
    const gridH = cellH * ROWS;
    // clamp the lean so the ink never wanders out of its band
    const dx = Math.max(-cellW * 3, Math.min(cellW * 3, this.driftX));
    const dy = Math.max(-cellH * 1.4, Math.min(cellH * 1.4, this.driftY));
    const ox = (w - gridW) / 2 + dx;
    const lean = gesture === 'attend' ? gestureT * cellH * 0.6 : 0;
    const oy = (h - gridH) / 2 + dy + lean;

    ctx.clearRect(0, 0, w, h);

    const haloStrength = special ? 0 : Math.max(0, 1 - this.sparseness / 6);
    if (haloStrength > 0.01) {
      const hx = ox + gridW / 2;
      const hy = oy + gridH / 2;
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
      const py = oy + (y + 0.5) * cellH;
      for (let x = 0; x < COLS; x += 1) {
        const a = rowA[x]!;
        const b = rowB[x]!;
        const v = a.v + (b.v - a.v) * f;
        if (v <= 0.03) continue;
        let ch: string;
        if (special) {
          ch = f < 0.5 ? a.ch : b.ch;
          if (ch === ' ') ch = a.ch !== ' ' ? a.ch : b.ch;
        } else {
          ch = rampChar(v);
        }
        if (ch === ' ') continue;
        const phase = x * 127.1 + y * 311.7;
        const shimmer = 0.78 + 0.22 * Math.sin(tickF * 0.55 + phase);
        ctx.globalAlpha = Math.min(1, (0.16 + 0.84 * Math.min(1, v * 1.15)) * shimmer);
        ctx.fillStyle = v < 0.35 ? INK_DIM : v < 0.65 ? INK_BODY : INK_CORE;
        ctx.fillText(ch, ox + (x + 0.5) * cellW, py);
      }
    }

    // shed letters, over the ink
    if (this.particles.length) {
      ctx.font = `${Math.max(6, cellH)}px ${FONT_STACK}`;
      ctx.fillStyle = INK_CORE;
      for (const p of this.particles) {
        ctx.globalAlpha = Math.max(0, 1 - p.age / p.life) * 0.75;
        ctx.fillText(p.ch, p.x, p.y);
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
