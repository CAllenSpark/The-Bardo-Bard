/** Posture variants a node's text may provide (Compass §6: posture-variant text). */
export type PostureVariant = 'fear' | 'curiosity' | 'reverence' | 'defiance';

export interface NodeText {
  base: string;
  fear?: string;
  curiosity?: string;
  reverence?: string;
  defiance?: string;
}

export interface ChoiceDef {
  id: string;
  label: string;
  /** Additive numeric effects on the state flags. */
  state?: Record<string, number>;
  goto: string;
}

/** Ledger node keys — the canonical Compass §3 manifest, and no other. */
export type TallyKey =
  | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  | 'D1' | 'D2' | 'D3' | 'E1' | 'F1'
  | 'V' | 'OMEGA';

export interface EncounterNode {
  id: string;
  act: number;
  tally?: TallyKey;
  terminal?: boolean;
  text: NodeText;
  choices?: ChoiceDef[];
  labels?: string[];
  /** The Bard's face at this node (Compass Phase 4): authored mood, and
   *  optionally the reaction to any choice made here ('still' = deliberate
   *  non-response). */
  visual?: { mood?: string; react?: string };
  a11y: string;
  fallback: string;
}

export interface ContentGraph {
  start: string;
  nodes: Record<string, EncounterNode>;
}

/** A committed, lockable decision — the only thing the Ledger ever hears about. */
export interface CommittedChoice {
  node: string;
  choice: string;
  /** Tally key if this commitment is census-relevant. */
  tally?: TallyKey;
}

export interface GameState {
  node: string;
  /** Local-only numeric flags (postures, memory, etc.). Never transmitted. */
  flags: Record<string, number>;
  /** Local-only committed-choice log (feeds sigil/glyph/profile). Never transmitted as a trail. */
  committed: CommittedChoice[];
  ended: boolean;
}

/** The two standing exits — the doors always in the room (Compass §3). */
export const STANDING_EXITS = ['exit_return', 'exit_light'] as const;
export type StandingExitId = (typeof STANDING_EXITS)[number];
