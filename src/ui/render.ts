import type { ContentGraph, GameState, StandingExitId } from '../engine/types';
import { STANDING_EXITS } from '../engine/types';
import { getNode, pickText } from '../engine/fsm';
import { computeProfile } from '../engine/profile';

export interface RenderHandlers {
  onChoice: (choiceId: string) => void;
  onExit: (exitId: StandingExitId) => void;
  onVigil: (rungId: string) => void;
}

export interface RenderOptions {
  /** A one-line acknowledgment played above the node text (a Vigil fold). */
  ackLine?: string;
}

const EXIT_LABELS: Record<StandingExitId, string> = {
  exit_return: 'RETURN TO EARTH',
  exit_light: 'WALK INTO THE LIGHT',
};

/** True once the player is past the boot screens and inside the game proper.
 *  The omega passages sit outside the game's frame — no doors there. */
function inPlay(graph: ContentGraph, state: GameState): boolean {
  if (state.node.startsWith('omega_')) return false;
  return !state.ended && getNode(graph, state.node).act >= 1;
}

export function render(
  root: HTMLElement,
  graph: ContentGraph,
  state: GameState,
  handlers: RenderHandlers,
  options: RenderOptions = {},
): void {
  const node = getNode(graph, state.node);
  root.textContent = '';

  const screen = document.createElement('main');
  screen.className = 'screen';
  screen.setAttribute('aria-label', node.a11y);

  if (options.ackLine) {
    const ack = document.createElement('pre');
    ack.className = 'bard-text ack';
    ack.textContent = options.ackLine;
    screen.appendChild(ack);
  }

  const text = document.createElement('pre');
  text.className = 'bard-text';
  text.textContent = pickText(node.text, state.flags);
  screen.appendChild(text);

  // The Vigil speaks into this region; aria-live announces each new beat
  // without re-reading the whole screen. Present (empty) on every node so the
  // live region exists before content arrives.
  const vigilLog = document.createElement('div');
  vigilLog.className = 'vigil-log';
  vigilLog.setAttribute('role', 'log');
  vigilLog.setAttribute('aria-live', 'polite');
  screen.appendChild(vigilLog);

  const choices = document.createElement('div');
  choices.className = 'choices';
  for (const choice of node.choices ?? []) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice';
    button.dataset.choiceId = choice.id;
    button.textContent = `[ ${choice.label} ]`;
    button.addEventListener('click', () => handlers.onChoice(choice.id));
    choices.appendChild(button);
  }
  screen.appendChild(choices);

  // The soul record — rendered on every true ending (never at the boot decline).
  if (state.ended && node.act >= 1) {
    const profile = computeProfile(state);
    if (profile) {
      const record = document.createElement('section');
      record.className = 'profile';
      record.setAttribute('aria-label', 'Your soul record: a title, a reflection, a shadow, and a question carried forward.');
      const heading = document.createElement('p');
      heading.className = 'profile-rule';
      heading.textContent = '— SOUL RECORD —';
      const title = document.createElement('h2');
      title.className = 'profile-title';
      title.textContent = profile.title;
      const reflection = document.createElement('p');
      reflection.className = 'profile-body';
      reflection.textContent = profile.reflection;
      const shadow = document.createElement('p');
      shadow.className = 'profile-dim';
      shadow.textContent = profile.shadow;
      const question = document.createElement('p');
      question.className = 'profile-dim';
      question.textContent = profile.question;
      record.append(heading, title, reflection, shadow, question);
      screen.appendChild(record);
    }
  }

  root.appendChild(screen);

  // The doors are always in the room (Compass §3) — from Act I on, never after the end.
  if (inPlay(graph, state)) {
    const doors = document.createElement('nav');
    doors.className = 'doors';
    doors.setAttribute('aria-label', 'The two doors, always available: return to Earth, or walk into the light.');
    for (const exitId of STANDING_EXITS) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'door';
      button.dataset.exitId = exitId;
      button.textContent = EXIT_LABELS[exitId];
      button.addEventListener('click', () => handlers.onExit(exitId));
      doors.appendChild(button);
    }
    root.appendChild(doors);
  }
}

/** Append a Vigil beat to the live log — announced, never re-announced. */
export function appendVigilBeat(root: HTMLElement, text: string): void {
  const log = root.querySelector('.vigil-log');
  if (!log) return;
  const beat = document.createElement('pre');
  beat.className = 'bard-text vigil-beat';
  beat.textContent = text;
  log.appendChild(beat);
}

/** Append a Vigil option. Options accrete and never expire (Compass §4.1). */
export function appendVigilOption(
  root: HTMLElement,
  rungId: string,
  label: string,
  handlers: RenderHandlers,
): void {
  const choices = root.querySelector('.choices');
  if (!choices) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = rungId === 'endgame' ? 'choice endgame' : 'choice rung';
  button.dataset.rungId = rungId;
  button.textContent = `[ ${label} ]`;
  button.addEventListener('click', () => handlers.onVigil(rungId));
  choices.appendChild(button);
}

/** The crisis signpost (Compass §9.3/§9.8): present site-wide, quiet, real. */
export function ensureCrisisFooter(): void {
  if (document.querySelector('.crisis')) return;
  const footer = document.createElement('footer');
  footer.className = 'crisis';
  const line = document.createElement('p');
  line.append('This is a game about death — not a substitute for a person. If you are carrying more than a game should ask: ');
  const link = document.createElement('a');
  link.href = 'https://findahelpline.com';
  link.rel = 'noopener';
  link.textContent = 'findahelpline.com';
  line.appendChild(link);
  footer.appendChild(line);
  document.body.appendChild(footer);
}
