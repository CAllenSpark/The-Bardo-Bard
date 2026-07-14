/**
 * Optional generative audio (Compass Phase 5; MDD v1 §17.3): a minimal drone —
 * two barely-detuned sines through a lowpass, breathing on a slow LFO. Muted
 * by default; NEVER autoplays (constructed only inside the toggle's click
 * handler); no manipulative cues — the drone does not react to choices.
 */

interface DroneHandle {
  ctx: AudioContext;
  stop(): void;
}

function startDrone(): DroneHandle | null {
  const Ctx = (globalThis as { AudioContext?: typeof AudioContext }).AudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const gain = ctx.createGain();
  gain.gain.value = 0.028;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 240;

  for (const freq of [82, 82.35]) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(filter);
    osc.start();
  }
  // the breath: a very slow LFO on the gain
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.012;
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  lfo.start();

  filter.connect(gain);
  gain.connect(ctx.destination);
  return { ctx, stop: () => void ctx.close() };
}

export function mountAudioToggle(): void {
  if (typeof document === 'undefined') return;
  if (document.querySelector('.audio-toggle')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'system audio-toggle';
  button.dataset.systemId = 'audio_toggle';
  button.textContent = 'SOUND: OFF';
  button.setAttribute('aria-pressed', 'false');
  let drone: DroneHandle | null = null;
  button.addEventListener('click', () => {
    if (drone) {
      drone.stop();
      drone = null;
      button.textContent = 'SOUND: OFF';
      button.setAttribute('aria-pressed', 'false');
    } else {
      drone = startDrone();
      if (!drone) return; // no WebAudio here; the silence was authentic anyway
      (globalThis as { __bardoAudioStarted?: boolean }).__bardoAudioStarted = true;
      button.textContent = 'SOUND: ON';
      button.setAttribute('aria-pressed', 'true');
    }
  });
  document.body.appendChild(button);
}
