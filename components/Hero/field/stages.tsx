/**
 * HERO FIELD STAGES — the eight stages of the loop, in story order.
 * ---------------------------------------------------------------------------
 * Order is the whole point: this one array is the reading order, the DOM
 * order, the tab order and the path order. Nothing re-sorts it.
 *
 * Words come from content/stages.ts — the only strings this field may render.
 * Glyphs come from components/StorySpine/icons.tsx via STAGE_GLYPH (keyed by
 * stage id), so the artwork is the SAME component the process rail draws and
 * the icons are ink-only with no accent dot. Per-instance `data-icon` ids
 * keep the page-wide registry unique.
 *
 * `activity` exists in stages.ts and is deliberately NOT here: the loop is
 * the eight stages this field narrates. Adding a ninth is a content change,
 * not a layout one.
 */

import { ChartMark, STAGE_GLYPH, type GlyphProps } from '@/components/StorySpine/icons';
import { LOOP_STAGE_ORDER, STAGE_WORD, type StageId } from '@/content/stages';

/** The eight, in story order — re-exported from content/stages (one copy). */
export const STAGE_ORDER: StageId[] = LOOP_STAGE_ORDER;

export interface FieldStage {
  stage: StageId;
  /** The single word this stage may render; also its accessible name. */
  word: string;
  /** Unique data-icon id for this instance. */
  iconId: string;
  glyph: React.ReactNode;
}

export const FIELD_STAGES: FieldStage[] = STAGE_ORDER.map((stage) => {
  const iconId = `hero-${stage}`;
  const G = STAGE_GLYPH[stage];
  return {
    stage,
    word: STAGE_WORD[stage],
    iconId,
    // overview is an exempt primitive in stages.ts (no registry id), so it
    // renders the shared ChartMark instead of an STAGE_GLYPH entry.
    glyph: G ? <G {...({ id: iconId } as GlyphProps)} /> : <ChartMark />,
  };
});

/** Stage id by index — the clock speaks indices, not ids. */
export const STAGE_AT = (k: number): StageId => STAGE_ORDER[k];
