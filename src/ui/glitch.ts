/**
 * The instability layer (CD directive 2026-07-16): the between is an unstable
 * place, and a soul is not meant to linger in it. At rare, random intervals the
 * desk flickers — the entity hiccups and the Bard, usually, dismisses it ("that
 * sometimes happens here"); or a button surfaces that was never meant to be
 * available and is withdrawn, apologetically. It keeps the player a little off
 * balance and underscores that this is a place between worlds.
 *
 * INVARIANT — presentation only. Nothing here touches game state, the Ledger, or
 * reachability. A phantom option is inert: it has no valid choice id, carries no
 * tally, and its only effect on click is its own apologetic removal (per-button
 * listeners in render.ts mean it can never reach a real handler). The whole layer
 * is gated to a real, motion-friendly browser by the caller (`animated`) and is
 * inert under reduced motion and in the no-canvas test env, so the deterministic
 * testable core never sees it (Compass §11 determinism carve-out; OD-15).
 *
 * A11y: the flicker asides are the Bard speaking, so they announce (role=status).
 * Phantom options and their apologies are pure visual theatre — aria-hidden and
 * unfocusable — so a keyboard or screen-reader soul is never sent chasing a ghost.
 */

export interface GlitchContent {
  asides: string[];
  phantoms: Array<{ label: string; apology: string }>;
}

export interface GlitchDeps {
  /** #bardo — takes the brief shudder. */
  root: HTMLElement;
  /** Where screens render — asides and phantoms are injected here, and wiped
   *  naturally on the next re-render (glitches are ephemeral by construction). */
  stage: HTMLElement;
  blot: { glitch(ms?: number): void };
  /** Whether this moment permits a disturbance (excludes endings, the endgame
   *  rung, the survey, the sincere boot notice — see main.ts). */
  canGlitch: () => boolean;
  content: GlitchContent;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/** Reveal on the next frame so the CSS fade-in transition catches — falling back
 *  to a direct call where requestAnimationFrame is unavailable (test envs). */
function onNextFrame(cb: () => void): void {
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(cb);
  else cb();
}

export class Glitch {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private stopped = false;

  constructor(private readonly deps: GlitchDeps) {}

  /** Begin the loop. The first disturbance lands 35–70 s in — soon enough that a
   *  lingering soul meets the instability early, never so soon it feels scripted. */
  start(): void {
    this.stopped = false;
    this.arm(35000 + Math.random() * 35000);
  }

  stop(): void {
    this.stopped = true;
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }

  private arm(ms: number): void {
    if (this.stopped) return;
    this.timer = setTimeout(() => this.fire(), ms);
  }

  private fire(): void {
    if (this.stopped) return;
    // ~30% of the time nothing happens — the unpredictability is the point.
    const already = this.deps.stage.querySelector('.phantom');
    if (!already && this.deps.canGlitch() && Math.random() > 0.3) this.run();
    this.arm(55000 + Math.random() * 75000); // 55–130 s between attempts
  }

  private run(): void {
    const choices = this.deps.stage.querySelector('.choices');
    const realChoices = choices?.querySelectorAll('button.choice:not(.phantom)').length ?? 0;
    if (choices && realChoices > 0 && Math.random() < 0.45) {
      this.phantom(pick(this.deps.content.phantoms), choices);
    } else {
      this.speak(pick(this.deps.content.asides), { hidden: false, shudder: true });
    }
  }

  /** A flicker + a line: the desk shudders, the face tears, the Bard remarks. */
  private speak(text: string, opts: { hidden: boolean; shudder: boolean }): void {
    if (opts.shudder) {
      this.deps.blot.glitch(340);
      this.deps.root.classList.add('desk-glitch');
      setTimeout(() => this.deps.root.classList.remove('desk-glitch'), 380);
    }
    const screen = this.deps.stage.querySelector('.screen') ?? this.deps.stage;
    const line = document.createElement('p');
    line.className = 'bard-text desk-aside';
    if (opts.hidden) line.setAttribute('aria-hidden', 'true');
    else line.setAttribute('role', 'status');
    line.textContent = text;
    const anchor = screen.querySelector('.choices');
    if (anchor) anchor.insertAdjacentElement('afterend', line);
    else screen.appendChild(line);
    onNextFrame(() => line.classList.add("show"));
    setTimeout(() => {
      line.classList.remove('show');
      setTimeout(() => line.remove(), 700);
    }, 4200);
  }

  /** A button that should not be here: it flickers in among the choices, then is
   *  withdrawn — on the player's touch, or on its own after a beat — with an
   *  apology. Inert throughout: no choice id, no tally, no handler but its own. */
  private phantom(def: { label: string; apology: string }, choices: Element): void {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice phantom';
    btn.setAttribute('aria-hidden', 'true');
    btn.tabIndex = -1;
    btn.dataset.glitch = 'phantom';
    btn.textContent = `[ ${def.label} ]`;
    let retracted = false;
    const retract = (): void => {
      if (retracted) return;
      retracted = true;
      if (!btn.isConnected) return; // the screen moved on — let it go, silently
      btn.classList.add('retract');
      setTimeout(() => btn.remove(), 420);
      this.speak(def.apology, { hidden: true, shudder: false }); // the Bard explains
    };
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      retract();
    });
    choices.appendChild(btn);
    onNextFrame(() => btn.classList.add("show"));
    this.deps.blot.glitch(260);
    setTimeout(retract, 2200 + Math.random() * 1400); // withdraw if untouched
  }
}
