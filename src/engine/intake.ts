import type { IntakeAnswer } from './memory';

/**
 * The Returning-Customer Intake (Compass §15 / OD-14, CD ratified 2026-07-15).
 *
 * Pure helpers over the survey content + stored answers. Everything here is
 * LOCAL-ONLY: intake answers live in localStorage, are NEVER transmitted, NEVER
 * enter the Ledger, and are only ever string-substituted (no runtime LLM). The
 * OTHER free-text path is the ratified exception to buttons-only; it is
 * sanitized and length-capped here, and always rendered via textContent.
 */

export interface SurveyOption {
  id: string;
  label: string;
  value: string;
}
export interface SurveyQuestion {
  id: string;
  prompt: string;
  options: SurveyOption[];
}
export interface SurveyInjection {
  var: string;
  line: string;
}
export interface Survey {
  boot_button: string;
  intro: string;
  other_prompt: string;
  other_label: string;
  skip_label: string;
  next_label: string;
  back_label: string;
  questions: SurveyQuestion[];
  injections: Record<string, SurveyInjection>;
  outro: {
    base: string;
    unchanged_all: string;
    changed_prefix: string;
    changed_line: string;
    changed_suffix: string;
  };
}

/** Longest a free-text OTHER answer may be, after sanitizing. A preference,
 *  not an essay — the desk has a very small field. */
export const OTHER_MAX = 40;

/**
 * Guardrail for the free-text exception: collapse whitespace, strip control
 * characters and anything that reads as markup, cap the length. Returns null
 * for an answer that is empty once cleaned (treated as a skip). The result is
 * only ever inserted via textContent, so this is defense-in-depth, not the
 * sole protection.
 */
export function sanitizeOther(raw: string): string | null {
  if (typeof raw !== 'string') return null;
  const cleaned = raw
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, OTHER_MAX)
    .trim();
  return cleaned.length > 0 ? cleaned : null;
}

/** The Bard's personalized aside at a node, if the player answered the question
 *  that node draws on. Undefined otherwise (most nodes, most players). */
export function personalize(
  nodeId: string,
  survey: Survey,
  intake: Record<string, IntakeAnswer> | null,
): string | undefined {
  if (!intake) return undefined;
  const injection = survey.injections[nodeId];
  if (!injection) return undefined;
  const answer = intake[injection.var];
  if (!answer || !answer.value) return undefined;
  return injection.line.replaceAll('{value}', answer.value);
}

export interface IntakeDiff {
  /** The player answered the same on every question they answered both times. */
  allSame: boolean;
  /** Per changed answer: the old value and the new one. */
  changes: Array<{ was: string; now: string }>;
  /** Whether there was any prior intake at all to compare against. */
  hadPrior: boolean;
}

/**
 * What moved between the previous intake and this one — for the outro's gentle
 * favoring of variety-as-curiosity. Only questions answered BOTH times count
 * toward "same or changed"; a newly-answered or newly-skipped question is not a
 * "change" (there is nothing to have changed from).
 */
export function intakeDiff(
  prev: Record<string, IntakeAnswer> | null,
  curr: Record<string, IntakeAnswer>,
): IntakeDiff {
  if (!prev || Object.keys(prev).length === 0) {
    return { allSame: false, changes: [], hadPrior: false };
  }
  const changes: Array<{ was: string; now: string }> = [];
  let comparable = 0;
  for (const [key, answer] of Object.entries(curr)) {
    const before = prev[key];
    if (!before) continue; // not answered last time — nothing to compare
    comparable += 1;
    if (before.value !== answer.value) changes.push({ was: before.value, now: answer.value });
  }
  return { allSame: comparable > 0 && changes.length === 0, changes, hadPrior: true };
}

/** Render the outro copy for a completed survey, folding in the diff. */
export function outroText(survey: Survey, diff: IntakeDiff): string {
  const { outro } = survey;
  const parts = [outro.base];
  if (diff.hadPrior) {
    if (diff.allSame) {
      parts.push(outro.unchanged_all);
    } else if (diff.changes.length > 0) {
      const lines = diff.changes.map((c) =>
        outro.changed_line.replaceAll('{was}', c.was).replaceAll('{now}', c.now),
      );
      parts.push(`${outro.changed_prefix}\n${lines.join('\n')}\n\n${outro.changed_suffix}`);
    }
  }
  return parts.join('\n\n');
}
