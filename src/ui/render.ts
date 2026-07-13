import type { ContentGraph, GameState, StandingExitId } from '../engine/types';
import { STANDING_EXITS } from '../engine/types';
import { getNode, pickText } from '../engine/fsm';
import { computeProfile } from '../engine/profile';

export interface RenderHandlers {
  onChoice: (choiceId: string) => void;
  onExit: (exitId: StandingExitId) => void;
  onVigil: (rungId: string) => void;
  onImport: (token: string) => void;
}

export interface RenderOptions {
  /** A one-line acknowledgment played above the node text (a Vigil fold). */
  ackLine?: string;
  /** Reveal-after-lock block for the previously locked node (Compass §3). */
  reveal?: { node: string; text: string } | null;
  /** VI.c — the full census block on played endings. */
  fullLedger?: string;
  /** Export token offered on played endings. */
  totenpass?: string;
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

  if (options.reveal) {
    const reveal = document.createElement('pre');
    reveal.className = 'bard-text ledger-reveal';
    reveal.dataset.node = options.reveal.node;
    reveal.textContent = options.reveal.text;
    screen.appendChild(reveal);
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

    if (options.fullLedger) {
      const ledger = document.createElement('pre');
      ledger.className = 'bard-text full-ledger';
      ledger.textContent = options.fullLedger;
      screen.appendChild(ledger);
    }

    if (options.totenpass) {
      const row = document.createElement('div');
      row.className = 'system-row';
      const exportButton = document.createElement('button');
      exportButton.type = 'button';
      exportButton.className = 'system';
      exportButton.dataset.systemId = 'export_totenpass';
      exportButton.textContent = 'EXPORT TOTENPASS';
      exportButton.addEventListener('click', () => {
        const token = document.createElement('pre');
        token.className = 'totenpass-token';
        token.setAttribute('aria-label', 'Your totenpass token. Copy it to carry this incarnation to another device.');
        token.textContent = options.totenpass!;
        row.replaceChildren(token);
        void navigator.clipboard?.writeText(options.totenpass!).catch(() => undefined);
      });
      row.appendChild(exportButton);
      screen.appendChild(row);
    }
  }

  // The passport desk: importing a totenpass, boot screen only.
  if (node.id === 'boot_notice') {
    const row = document.createElement('div');
    row.className = 'system-row';
    const importButton = document.createElement('button');
    importButton.type = 'button';
    importButton.className = 'system';
    importButton.dataset.systemId = 'import_totenpass';
    importButton.textContent = 'IMPORT TOTENPASS';
    importButton.addEventListener('click', () => {
      const field = document.createElement('input');
      field.className = 'totenpass-input';
      field.setAttribute('aria-label', 'Paste a totenpass token');
      field.placeholder = 'BB1.…';
      const restore = document.createElement('button');
      restore.type = 'button';
      restore.className = 'system';
      restore.dataset.systemId = 'restore_totenpass';
      restore.textContent = 'RESTORE';
      restore.addEventListener('click', () => handlers.onImport(field.value.trim()));
      row.replaceChildren(field, restore);
      field.focus();
    });
    row.appendChild(importButton);
    screen.appendChild(row);
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
