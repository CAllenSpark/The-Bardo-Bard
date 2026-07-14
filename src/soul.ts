import { decodeGlyphCode, phrase } from './engine/glyph';
import type { GlyphPath } from './engine/glyph';
import soulFile from '../content/glyph/soul_analysis.json';

/**
 * SOUL ANALYSIS (Compass §3 Layer C): paste one or two glyph codes, receive an
 * authored comparison. Pure client-side decode; nothing transmitted. The Ω
 * case acknowledges absence without explaining the method (§4.7 / OD-6).
 */

const COPY = soulFile as unknown as {
  names: Record<string, string>;
  intro: string;
  solo_intro: string;
  same: string;
  differ: string;
  missing_one: string;
  solo_line: string;
  omega_compare: string;
  omega_solo: string;
  joke: string;
  question: string;
  error: string;
};

function fill(template: string, key: string, a?: string, b?: string): string {
  return template
    .replace('{KEY}', COPY.names[key] ?? key)
    .replace('{A}', a ?? '')
    .replace('{B}', b ?? '');
}

function byKey(path: GlyphPath): Map<string, string> {
  const map = new Map<string, string>();
  for (const [tally, choice] of path) if (!map.has(tally)) map.set(tally, choice);
  return map;
}

const KEY_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'D3', 'E1', 'V', 'F1', 'OMEGA'];

function soloLines(path: GlyphPath): string[] {
  const map = byKey(path);
  if (map.has('OMEGA')) return [COPY.omega_solo];
  const lines: string[] = [];
  for (const key of KEY_ORDER) {
    const choice = map.get(key);
    if (choice) lines.push(fill(COPY.solo_line, key, phrase(key, choice)));
  }
  return lines;
}

export function analyze(codeA: string, codeB: string): string[] {
  const pathA = decodeGlyphCode(codeA);
  if (!codeB.trim()) {
    return [COPY.solo_intro, '', ...soloLines(pathA)];
  }
  const pathB = decodeGlyphCode(codeB);
  const mapA = byKey(pathA);
  const mapB = byKey(pathB);

  // §4.7 — comparing against the blank glyph must neither explain nor error.
  if (mapA.has('OMEGA') || mapB.has('OMEGA')) {
    const played = mapA.has('OMEGA') ? pathB : pathA;
    const lines = [COPY.intro, '', COPY.omega_compare, ''];
    if (!byKey(played).has('OMEGA')) lines.push(...soloLines(played));
    return lines;
  }

  const lines: string[] = [COPY.intro, ''];
  for (const key of KEY_ORDER) {
    const a = mapA.get(key);
    const b = mapB.get(key);
    if (a && b) {
      lines.push(
        a === b
          ? fill(COPY.same, key, phrase(key, a))
          : fill(COPY.differ, key, phrase(key, a), phrase(key, b)),
      );
    } else if (a || b) {
      lines.push(fill(COPY.missing_one, key, phrase(key, (a ?? b)!)));
    }
  }
  lines.push('', COPY.joke, '', COPY.question);
  return lines;
}

export function mountSoulAnalysis(root: HTMLElement): void {
  root.textContent = '';
  const title = document.createElement('p');
  title.className = 'room-title';
  title.textContent = 'SOUL ANALYSIS — COMPARATIVE ESCHATOLOGY, LTD.';

  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.textContent =
    'Paste one glyph code to read a soul, or two to compare them. Codes travel on shared glyphs; nothing you paste here leaves this page.';

  const fieldA = document.createElement('input');
  fieldA.className = 'code-input';
  fieldA.placeholder = 'BG1.… (a soul)';
  fieldA.setAttribute('aria-label', 'First glyph code');
  const fieldB = document.createElement('input');
  fieldB.className = 'code-input';
  fieldB.placeholder = 'BG1.… (another soul, optional)';
  fieldB.setAttribute('aria-label', 'Second glyph code, optional');

  const read = document.createElement('button');
  read.type = 'button';
  read.className = 'system';
  read.dataset.systemId = 'read_souls';
  read.textContent = 'READ THE SOULS';

  const out = document.createElement('pre');
  out.className = 'analysis';
  out.setAttribute('role', 'status');
  out.setAttribute('aria-live', 'polite');

  read.addEventListener('click', () => {
    try {
      out.textContent = analyze(fieldA.value.trim(), fieldB.value.trim()).join('\n');
    } catch {
      out.textContent = COPY.error;
    }
  });

  const back = document.createElement('a');
  back.href = './index.html';
  back.className = 'back';
  back.textContent = '→ THE DESK';

  root.append(title, hint, fieldA, fieldB, read, out, back);
}

// Browser entry; tests call analyze()/mountSoulAnalysis directly.
const rootEl = typeof document !== 'undefined' ? document.getElementById('soul-room') : null;
if (rootEl) mountSoulAnalysis(rootEl);
