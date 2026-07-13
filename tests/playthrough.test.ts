// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '../src/main';

function buttons(root: HTMLElement, selector: string): HTMLButtonElement[] {
  return Array.from(root.querySelectorAll<HTMLButtonElement>(selector));
}

function clickChoice(root: HTMLElement, choiceId: string): void {
  const button = buttons(root, 'button.choice').find((b) => b.dataset.choiceId === choiceId);
  if (!button) throw new Error(`No choice button: ${choiceId}`);
  button.click();
}

describe('DOM playthrough driver (Gate 0)', () => {
  let root: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '<div id="bardo"></div>';
    root = document.getElementById('bardo') as HTMLElement;
    mount(root);
  });

  it('boots to the plain-language notice with begin and gentle-decline options', () => {
    expect(root.textContent).toContain('NOTICE, FILED IN PLAIN LANGUAGE');
    expect(root.textContent).toContain('We count deeds, not people');
    const ids = buttons(root, 'button.choice').map((b) => b.dataset.choiceId);
    expect(ids).toEqual(['begin', 'decline']);
    // No standing exits on the boot screen — the doors belong to the game.
    expect(buttons(root, 'button.door')).toHaveLength(0);
  });

  it('declining at boot is a supported, gentle end', () => {
    clickChoice(root, 'decline');
    expect(root.textContent).toContain('Go well');
    expect(buttons(root, 'button.choice')).toHaveLength(0);
  });

  it('boots to Act I: A1 renders with exactly its four authored options', () => {
    clickChoice(root, 'begin');
    expect(root.textContent).toContain('A process identifying itself as YOU has been detected');
    const ids = buttons(root, 'button.choice').map((b) => b.dataset.choiceId);
    expect(ids).toEqual(['yes', 'no', 'define_you', 'who_is_asking']);
  });

  it('the two doors are in the room from Act I onward', () => {
    clickChoice(root, 'begin');
    const doors = buttons(root, 'button.door').map((b) => b.dataset.exitId);
    expect(doors).toEqual(['exit_return', 'exit_light']);
  });

  it('plays the seed path to the boundary', () => {
    clickChoice(root, 'begin');
    clickChoice(root, 'define_you');
    expect(root.textContent).toContain('There is a light');
    clickChoice(root, 'question');
    expect(root.textContent).toContain('Seven cups');
    clickChoice(root, 'tap_water');
    expect(root.textContent).toContain('SEED CENSUS BOUNDARY');
    // Terminal: no choices, no doors.
    expect(buttons(root, 'button.choice')).toHaveLength(0);
    expect(buttons(root, 'button.door')).toHaveLength(0);
  });

  it('a standing exit ends the run at any point, fully honored', () => {
    clickChoice(root, 'begin');
    const lightDoor = buttons(root, 'button.door').find((b) => b.dataset.exitId === 'exit_light');
    lightDoor?.click();
    expect(root.textContent).toContain('always optional');
    expect(buttons(root, 'button.choice')).toHaveLength(0);
  });

  it('reflects posture in later text: a curious soul meets a curious light', () => {
    clickChoice(root, 'begin');
    clickChoice(root, 'define_you'); // curiosity +1
    expect(root.textContent).toContain('naming it feels important');
  });
});
