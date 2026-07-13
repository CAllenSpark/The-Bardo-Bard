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

describe('DOM playthrough driver (Gates 0-1)', () => {
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
    expect(buttons(root, 'button.door')).toHaveLength(0);
  });

  it('declining at boot is a supported, gentle end — with no soul record', () => {
    clickChoice(root, 'decline');
    expect(root.textContent).toContain('Go well');
    expect(root.textContent).not.toContain('SOUL RECORD');
    expect(buttons(root, 'button.choice')).toHaveLength(0);
  });

  it('boots to Act I: A1 renders with exactly its four authored options and both doors', () => {
    clickChoice(root, 'begin');
    expect(root.textContent).toContain('A process identifying itself as YOU has been detected');
    const ids = buttons(root, 'button.choice').map((b) => b.dataset.choiceId);
    expect(ids).toEqual(['yes', 'no', 'define_you', 'who_is_asking']);
    const doors = buttons(root, 'button.door').map((b) => b.dataset.exitId);
    expect(doors).toEqual(['exit_return', 'exit_light']);
  });

  it('plays the full spine to a verb ending and receives a soul record', () => {
    for (const id of ['begin', 'define_you', 'question', 'tap_water', 'take_number',
      'silence', 'none_define', 'refuse_frame', 'accept', 'leave_it_be', 'stand', 'witness']) {
      clickChoice(root, id);
    }
    expect(root.textContent).toContain('You take the long seat');
    expect(root.textContent).toContain('— SOUL RECORD —');
    expect(root.textContent).toContain('SHADOW ON FILE');
    expect(root.textContent).toContain('CARRIED FORWARD');
    expect(buttons(root, 'button.choice')).toHaveLength(0);
    expect(buttons(root, 'button.door')).toHaveLength(0);
  });

  it('waypoints of the spine render in order', () => {
    clickChoice(root, 'begin');
    clickChoice(root, 'define_you');
    expect(root.textContent).toContain('There is a light');
    clickChoice(root, 'question');
    expect(root.textContent).toContain('Seven cups');
    clickChoice(root, 'lethe');
    expect(root.textContent).toContain('IF KEEPING WERE ALLOWED');
    clickChoice(root, 'a_joke');
    expect(root.textContent).toContain('DEPARTMENT OF ONTOLOGICAL CLAIMS');
    clickChoice(root, 'take_number');
    clickChoice(root, 'offer_password');
    expect(root.textContent).toContain('child of Earth and starry Heaven');
    clickChoice(root, 'key');
    expect(root.textContent).toContain('ADDRESSEE NOT YET PRESENT');
    clickChoice(root, 'continue');
    expect(root.textContent).toContain('SYMBOLIC MODE: ON');
    clickChoice(root, 'caused_harm');
    clickChoice(root, 'debt');
    expect(root.textContent).toContain('INTERPRETATION — OFFERED, NOT FILED');
    clickChoice(root, 'correct');
    expect(root.textContent).toContain('WHOM DO I SERVE?');
    clickChoice(root, 'teach_refuse');
    expect(root.textContent).toContain('DISCLOSURE, FILED LATE');
    clickChoice(root, 'stand');
    expect(root.textContent).toContain('NINE VERBS ARE AVAILABLE');
  });

  it('a standing exit ends the run at any point, honored with a record', () => {
    clickChoice(root, 'begin');
    const lightDoor = buttons(root, 'button.door').find((b) => b.dataset.exitId === 'exit_light');
    lightDoor?.click();
    expect(root.textContent).toContain('always optional');
    expect(root.textContent).toContain('The Unhesitating');
    expect(buttons(root, 'button.choice')).toHaveLength(0);
  });

  it('reflects posture in later text: a curious soul meets a curious light', () => {
    clickChoice(root, 'begin');
    clickChoice(root, 'define_you');
    expect(root.textContent).toContain('naming it feels important');
  });
});
