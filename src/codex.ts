import codexFile from '../content/codex/codex.json';

/** The codex page: sources + labels + the data statement (Compass Phase 5). */

const CODEX = codexFile as unknown as {
  title: string;
  preamble: string;
  sections: Array<{ title: string; entries: Array<{ label: string; text: string }> }>;
  lineage: { label: string; text: string; locked_text: string };
  data_statement: string;
  crisis: string;
};

function el(tag: string, className: string, text: string): HTMLElement {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

export function mountCodex(root: HTMLElement, storage?: Pick<Storage, 'getItem'>): void {
  root.textContent = '';
  root.appendChild(el('h1', 'room-title', CODEX.title));
  root.appendChild(el('p', 'body', CODEX.preamble));

  for (const section of CODEX.sections) {
    root.appendChild(el('h2', 'section-title', section.title));
    for (const entry of section.entries) {
      root.appendChild(el('p', 'entry-label', entry.label));
      root.appendChild(el('p', 'body', entry.text));
    }
  }

  // The lineage entry unlocks after a completed run (OD-6 spoiler economics).
  let completed = false;
  try {
    completed = (storage ?? localStorage).getItem('bardo_completed') === '1';
  } catch {
    completed = false;
  }
  root.appendChild(el('h2', 'section-title', 'LINEAGE'));
  if (completed) {
    root.appendChild(el('p', 'entry-label', CODEX.lineage.label));
    root.appendChild(el('p', 'body', CODEX.lineage.text));
  } else {
    root.appendChild(el('p', 'body locked', CODEX.lineage.locked_text));
  }

  root.appendChild(el('h2', 'section-title', 'DATA'));
  root.appendChild(el('p', 'body', CODEX.data_statement));
  root.appendChild(el('p', 'body locked', CODEX.crisis));

  const back = document.createElement('a');
  back.href = './index.html';
  back.className = 'back';
  back.textContent = '→ THE DESK';
  root.appendChild(back);
}

const rootEl = typeof document !== 'undefined' ? document.getElementById('codex-room') : null;
if (rootEl) mountCodex(rootEl);
