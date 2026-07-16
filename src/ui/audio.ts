/**
 * Optional generative audio (Compass Phase 5; MDD v1 §17.3) — the entity has a
 * voice now (CD 2026-07-16: "as playful and curious as the entity"):
 *
 *  - a low breathing drone, the bed (two barely-detuned sines through a lowpass,
 *    on a slow LFO, with a slower drift on the cutoff so even the bed is faintly
 *    curious);
 *  - soft pentatonic bells that voice the creature's own gestures and, now and
 *    then, its idle curiosity — a note it plays on its own in the stillness.
 *
 * NON-VERDICT INVARIANT (Compass §4 / §15): like every one of the entity's
 * reactions, the voice never encodes a verdict. A tone's PITCH comes from a
 * wandering index that advances on every note — the same gesture never sounds
 * the same twice, so a note can carry no ranking. Its timbre only mirrors the
 * gesture the player already SEES (bloom brighter, contract lower), and the
 * visible gesture is itself authored to reflect the Bard's stakes, never the
 * quality of an answer. The reaction stays "another vector in did-I-answer-
 * correctly" — deliberate, and meaningless.
 *
 * Muted by default; NEVER autoplays — the engine is constructed only inside the
 * toggle's click handler. No WebAudio (jsdom, older browsers) → a silent no-op.
 */

// Two octaves of a pentatonic scale, in semitones from the root.
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
const ROOT = 196.0; // G3 — the bells sit well above the ~82 Hz drone bed

interface Shape {
  octave: number; // semitone octaves added to the wandering pitch
  peak: number; // envelope peak gain
  decay: number; // seconds to silence
  type: OscillatorType;
}

// Timbre per visible gesture (never pitch — pitch wanders regardless).
const SHAPES: Record<string, Shape> = {
  bloom: { octave: 1, peak: 0.075, decay: 1.4, type: 'sine' },
  contract: { octave: -1, peak: 0.06, decay: 1.9, type: 'sine' },
  jitter: { octave: 1, peak: 0.05, decay: 0.7, type: 'triangle' },
  attend: { octave: 1, peak: 0.04, decay: 1.1, type: 'sine' },
  stir: { octave: 0, peak: 0.028, decay: 1.6, type: 'sine' }, // the idle curiosity note
};

interface Engine {
  ctx: AudioContext;
  bells: GainNode; // the voice bus (through a warm lowpass)
  wander: number; // the curiosity index into SCALE — advances on every note
  last: number; // ctx time of the last note (rate limit)
  idle: ReturnType<typeof setInterval> | null;
  stop(): void;
}

let engine: Engine | null = null;

function build(): Engine | null {
  const Ctx = (globalThis as { AudioContext?: typeof AudioContext }).AudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  if (ctx.state === 'suspended') void ctx.resume(); // the click is our user gesture

  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);

  // ── the breath: the low drone bed ─────────────────────────────────────────
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.028;
  const droneFilter = ctx.createBiquadFilter();
  droneFilter.type = 'lowpass';
  droneFilter.frequency.value = 240;
  for (const freq of [82, 82.35]) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(droneFilter);
    osc.start();
  }
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.012;
  lfo.connect(lfoGain);
  lfoGain.connect(droneGain.gain);
  lfo.start();
  // a slower drift on the cutoff — the bed is faintly curious too
  const drift = ctx.createOscillator();
  drift.frequency.value = 0.017;
  const driftGain = ctx.createGain();
  driftGain.gain.value = 60;
  drift.connect(driftGain);
  driftGain.connect(droneFilter.frequency);
  drift.start();
  droneFilter.connect(droneGain);
  droneGain.connect(master);

  // ── the voice: pentatonic bells through a shared warm lowpass ─────────────
  const bells = ctx.createGain();
  bells.gain.value = 1;
  const bellFilter = ctx.createBiquadFilter();
  bellFilter.type = 'lowpass';
  bellFilter.frequency.value = 1800;
  bells.connect(bellFilter);
  bellFilter.connect(master);

  const eng: Engine = {
    ctx,
    bells,
    wander: 0,
    last: 0,
    idle: null,
    stop() {
      if (eng.idle) clearInterval(eng.idle);
      void ctx.close();
    },
  };
  return eng;
}

function strike(eng: Engine, kind: string): void {
  const now = eng.ctx.currentTime;
  if (now - eng.last < 0.12) return; // no machine-gunning on a fast hand
  eng.last = now;
  const shape = SHAPES[kind] ?? SHAPES['stir']!;

  // The wandering pitch: it advances every note, so the same gesture never
  // repeats the same tone. Deterministic step; no RNG (and none is needed —
  // the point is variety, not secrecy).
  eng.wander = (eng.wander + 2 + (kind.length % 3)) % SCALE.length;
  const semis = SCALE[eng.wander]! + shape.octave * 12;
  const freq = ROOT * Math.pow(2, semis / 12);

  const g = eng.ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(shape.peak, now + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, now + shape.decay);
  g.connect(eng.bells);
  const osc = eng.ctx.createOscillator();
  osc.type = shape.type;
  osc.frequency.value = freq;
  osc.connect(g);
  osc.start(now);
  osc.stop(now + shape.decay + 0.05);

  // a faint fifth above — warmth, not a chord
  const g2 = eng.ctx.createGain();
  g2.gain.setValueAtTime(0.0001, now);
  g2.gain.exponentialRampToValueAtTime(shape.peak * 0.4, now + 0.02);
  g2.gain.exponentialRampToValueAtTime(0.0001, now + shape.decay * 0.7);
  g2.connect(eng.bells);
  const osc2 = eng.ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = freq * 1.5;
  osc2.connect(g2);
  osc2.start(now);
  osc2.stop(now + shape.decay);
}

/** The entity's voice. Every method is a silent no-op while sound is off. */
export const voice = {
  /** Voice a visible gesture (bloom / contract / jitter / attend / stir). */
  note(kind: string): void {
    if (engine) strike(engine, kind);
  },
  running(): boolean {
    return engine !== null;
  },
};

export function mountAudioToggle(): void {
  if (typeof document === 'undefined') return;
  if (document.querySelector('.audio-toggle')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'system audio-toggle';
  button.dataset.systemId = 'audio_toggle';
  button.textContent = 'SOUND: OFF';
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    if (engine) {
      engine.stop();
      engine = null;
      button.textContent = 'SOUND: OFF';
      button.setAttribute('aria-pressed', 'false');
      return;
    }
    engine = build();
    if (!engine) return; // no WebAudio here; the silence was authentic anyway
    (globalThis as { __bardoAudioStarted?: boolean }).__bardoAudioStarted = true;
    button.textContent = 'SOUND: ON';
    button.setAttribute('aria-pressed', 'true');
    // The entity's idle curiosity: every so often it voices a soft note on its
    // own, so the room stays alive even in stillness. Sparse (roughly one note
    // every ~13 s), and quiet while the tab is hidden.
    engine.idle = setInterval(() => {
      if (!engine) return;
      if (typeof document !== 'undefined' && document.hidden) return;
      engine.wander = (engine.wander + 1) % SCALE.length;
      if (engine.wander % 3 === 0) strike(engine, 'stir');
    }, 4300);
  });
  document.body.appendChild(button);
}
