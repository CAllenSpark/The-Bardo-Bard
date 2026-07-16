import type { IntakeAnswer } from '../engine/memory';
import { getIntake, setIntake } from '../engine/memory';
import type { Survey } from '../engine/intake';
import { OTHER_MAX, intakeDiff, outroText, sanitizeOther } from '../engine/intake';

/**
 * The Returning-Customer Intake UI (Compass §15 / OD-14). A self-contained
 * buttons-first flow mounted into the stage; the one free-text field (OTHER) is
 * the ratified exception, sanitized and length-capped in the engine and only
 * ever echoed via textContent. LOCAL-ONLY: answers are written to localStorage
 * and never transmitted. Calls onDone() when the player returns to the desk.
 */
export function mountSurvey(stage: HTMLElement, survey: Survey, onDone: (completed: boolean) => void): void {
  const answers: Record<string, IntakeAnswer> = {};

  const screen = (aria: string): HTMLElement => {
    stage.textContent = '';
    const main = document.createElement('main');
    main.className = 'screen';
    main.setAttribute('aria-label', aria);
    stage.appendChild(main);
    return main;
  };

  const paragraph = (parent: HTMLElement, text: string, cls = 'bard-text'): void => {
    const p = document.createElement('pre');
    p.className = cls;
    p.textContent = text;
    parent.appendChild(p);
  };

  const button = (
    parent: HTMLElement,
    label: string,
    onClick: () => void,
    act: string,
    cls = 'choice',
  ): HTMLButtonElement => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.dataset.surveyAct = act;
    b.textContent = `[ ${label} ]`;
    b.addEventListener('click', onClick);
    parent.appendChild(b);
    return b;
  };

  const renderIntro = (): void => {
    const main = screen('Returning-customer intake: an optional set of light preference questions.');
    paragraph(main, survey.intro);
    const choices = document.createElement('div');
    choices.className = 'choices';
    main.appendChild(choices);
    button(choices, survey.next_label, () => renderQuestion(0), 'next');
    button(choices, survey.back_label, () => onDone(false), 'back'); // bailed before answering
  };

  const record = (q: Survey['questions'][number], value: string, source: IntakeAnswer['source'], index: number): void => {
    answers[q.id] = { value, source };
    advance(index);
  };

  const advance = (index: number): void => {
    if (index + 1 < survey.questions.length) renderQuestion(index + 1);
    else renderOutro();
  };

  const renderQuestion = (index: number): void => {
    const q = survey.questions[index];
    if (!q) return renderOutro();
    const main = screen(`Question ${index + 1} of ${survey.questions.length}: ${q.prompt}`);
    const counter = document.createElement('p');
    counter.className = 'profile-rule';
    counter.textContent = `— ${index + 1} / ${survey.questions.length} —`;
    main.appendChild(counter);
    paragraph(main, q.prompt);

    const choices = document.createElement('div');
    choices.className = 'choices';
    main.appendChild(choices);
    for (const option of q.options) {
      const b = button(choices, option.label, () => record(q, option.value, 'preset', index), 'pick');
      b.dataset.optId = option.id;
    }
    // OTHER — the ratified free-text exception. Reveals a capped, sanitized input.
    button(choices, survey.other_label, () => {
      const row = document.createElement('div');
      row.className = 'system-row';
      const field = document.createElement('input');
      field.className = 'totenpass-input';
      field.dataset.surveyInput = 'other';
      field.maxLength = OTHER_MAX;
      field.setAttribute('aria-label', survey.other_prompt);
      field.placeholder = survey.other_prompt;
      const confirm = document.createElement('button');
      confirm.type = 'button';
      confirm.className = 'system';
      confirm.dataset.surveyAct = 'file';
      confirm.textContent = 'FILE IT';
      const submit = (): void => {
        const clean = sanitizeOther(field.value);
        if (clean) record(q, clean, 'other', index);
        else advance(index); // nothing usable typed → treated as a skip
      };
      confirm.addEventListener('click', submit);
      field.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submit();
        }
      });
      row.append(field, confirm);
      choices.appendChild(row);
      field.focus();
    }, 'other');
    button(choices, survey.skip_label, () => advance(index), 'skip', 'choice door');
  };

  const renderOutro = (): void => {
    // Diff against the prior intake BEFORE it is overwritten, then persist.
    const diff = intakeDiff(getIntake(), answers);
    setIntake(answers); // local-only; never transmitted
    const main = screen('Intake filed. The desk notes what changed since last time, and returns you to the desk.');
    paragraph(main, outroText(survey, diff));
    const choices = document.createElement('div');
    choices.className = 'choices';
    main.appendChild(choices);
    button(choices, survey.back_label, () => onDone(true), 'back'); // filed — done this loop
  };

  renderIntro();
}
