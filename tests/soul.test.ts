// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { buildGraph } from '../src/engine/content';
import { advance, createState, vigilEndGame } from '../src/engine/fsm';
import { encodeGlyphCode } from '../src/engine/glyph';
import { analyze, mountSoulAnalysis } from '../src/soul';

const graph = buildGraph();

function play(choices: string[]) {
  let state = createState(graph);
  for (const choice of choices) state = advance(graph, state, choice);
  return state;
}

const SOUL_A = encodeGlyphCode(play(['begin', 'define_you', 'question', 'lethe', 'a_joke',
  'take_number', 'compassion', 'caused_harm', 'debt', 'complicate', 'answer_question', 'stand', 'spiral']));
const SOUL_B = encodeGlyphCode(play(['begin', 'yes', 'question', 'mnemosyne', 'take_number',
  'answer', 'loved_well', 'both', 'accept', 'free_it', 'stand', 'return']));
const SOUL_OMEGA = encodeGlyphCode(advance(graph, vigilEndGame(graph, play(['begin'])), 'go_on'));

describe('Soul Analysis (Gate 4: authored comparisons, client-side)', () => {
  it('compares two played souls: rhymes, divergences, a joke, a question', () => {
    const lines = analyze(SOUL_A, SOUL_B).join('\n');
    expect(lines).toContain('COMPARATIVE ESCHATOLOGY');
    expect(lines).toContain('At the light, both souls questioned the light.');
    expect(lines).toContain('one soul drank Lethe; the other drank Mnemosyne');
    expect(lines).toContain('Only one soul met the keeping field');
    expect(lines).toContain('one soul chose SPIRAL; the other chose RETURN');
    expect(lines).toContain('CARRIED FORWARD, JOINTLY');
  });

  it('a played soul against the blank glyph gets the §4.7 copy — brief, unexplaining', () => {
    const lines = analyze(SOUL_A, SOUL_OMEGA).join('\n');
    expect(lines).toContain('left almost no footprints');
    expect(lines).not.toMatch(/wait|vigil|END GAME/i);
    // the played soul still gets read
    expect(lines).toContain('questioned the light');
  });

  it('a single code reads one soul', () => {
    const lines = analyze(SOUL_B, '').join('\n');
    expect(lines).toContain('one soul, read closely');
    expect(lines).toContain('At the cart: drank Mnemosyne.');
  });

  it('mounts with two inputs and reads souls on demand, gently erroring on garbage', () => {
    document.body.innerHTML = '<div id="soul-room"></div>';
    const root = document.getElementById('soul-room') as HTMLElement;
    mountSoulAnalysis(root);
    const inputs = root.querySelectorAll<HTMLInputElement>('.code-input');
    expect(inputs).toHaveLength(2);
    inputs[0]!.value = SOUL_A;
    inputs[1]!.value = SOUL_B;
    (root.querySelector('button[data-system-id="read_souls"]') as HTMLButtonElement).click();
    expect(root.textContent).toContain('COMPARATIVE ESCHATOLOGY');

    inputs[0]!.value = 'BG1.zzzz';
    (root.querySelector('button[data-system-id="read_souls"]') as HTMLButtonElement).click();
    expect(root.textContent).toContain('another underworld');
  });
});

describe('the face is mounted with its description (Gate 4 a11y)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="bardo"></div>';
  });

  it('the blot has role img, a living label, and hidden raw characters', async () => {
    const { mount } = await import('../src/main');
    mount(document.getElementById('bardo') as HTMLElement);
    const wrap = document.querySelector('.blot-wrap')!;
    expect(wrap.getAttribute('role')).toBe('img');
    expect(wrap.getAttribute('aria-label')).toContain('ink blot');
    expect(wrap.querySelector('.blot')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('endings carry the sigil as an image with a description', async () => {
    const { mount } = await import('../src/main');
    const root = document.getElementById('bardo') as HTMLElement;
    mount(root);
    for (const id of ['begin', 'yes', 'approach', 'mnemosyne', 'take_number', 'answer',
      'loved_well', 'both', 'accept', 'free_it', 'stand', 'return']) {
      (Array.from(root.querySelectorAll<HTMLButtonElement>('button.choice'))
        .find((b) => b.dataset.choiceId === id))!.click();
    }
    const sigil = root.querySelector('.sigil-wrap')!;
    expect(sigil.getAttribute('role')).toBe('img');
    expect(sigil.getAttribute('aria-label')).toContain('sigil');
    expect(sigil.querySelector('svg')).not.toBeNull();
    // and the glyph is one click away with its OD-12 disclosure
    expect(root.textContent).toContain('this code contains your full path through the desk.');
  });
});
