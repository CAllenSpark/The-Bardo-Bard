import type { ContentGraph, GameState, StandingExitId } from '../engine/types';
import { STANDING_EXITS } from '../engine/types';
import { getNode, pickText } from '../engine/fsm';
import { computeProfile } from '../engine/profile';

export interface RenderHandlers {
  onChoice: (choiceId: string) => void;
  onExit: (exitId: StandingExitId) => void;
}

const EXIT_LABELS: Record<StandingExitId, string> = {
  exit_return: 'RETURN TO EARTH',
  exit_light: 'WALK INTO THE LIGHT',
};

/** True once the player is past the boot screens and inside the game proper. */
function inPlay(graph: ContentGraph, state: GameState): boolean {
  return !state.ended && getNode(graph, state.node).act >= 1;
}

export function render(
  root: HTMLElement,
  graph: ContentGraph,
  state: GameState,
  handlers: RenderHandlers,
): void {
  const node = getNode(graph, state.node);
  root.textContent = '';

  const screen = document.createElement('main');
  screen.className = 'screen';
  screen.setAttribute('aria-label', node.a11y);

  const text = document.createElement('pre');
  text.className = 'bard-text';
  text.setAttribute('role', 'status');
  text.setAttribute('aria-live', 'polite');
  text.textContent = pickText(node.text, state.flags);
  screen.appendChild(text);

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
