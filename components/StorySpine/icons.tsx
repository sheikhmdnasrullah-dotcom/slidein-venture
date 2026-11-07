/**
 * SITE ICON REGISTRY — Unified Lucide React Interface Icon System
 * ---------------------------------------------------------------------------
 * One canonical 24×24 geometric icon per stage, shared across the homepage
 * hero process rail, the story spine, the capabilities section, and the
 * playbook workflow spine.
 *
 * Construction standards:
 *   - Grid: 24 × 24
 *   - Stroke weight: 1.75
 *   - Stroke endings: round caps & joins
 *   - Color: currentColor (monochromatic graphite/ink by default; orange accent
 *     applied only by the active state of the parent stage container)
 */

import React from 'react';
import {
  Activity,
  BadgeCheck,
  BarChart3,
  MessagesSquare,
  PenLine,
  Radar,
  Search,
  Send,
  SlidersHorizontal,
} from 'lucide-react';

export type GlyphProps = { id: string; size?: string | number };

const DEFAULT_SIZE = '48%';
const STROKE_WIDTH = 1.75;

/** 01 configure — SlidersHorizontal */
export function SlidersGlyph({ id, size = DEFAULT_SIZE }: GlyphProps) {
  return (
    <SlidersHorizontal
      data-icon={id}
      size={size}
      strokeWidth={STROKE_WIDTH}
      aria-hidden="true"
    />
  );
}

/** 02 discover — Radar */
export function DotGridGlyph({ id, size = DEFAULT_SIZE }: GlyphProps) {
  return (
    <Radar
      data-icon={id}
      size={size}
      strokeWidth={STROKE_WIDTH}
      aria-hidden="true"
    />
  );
}

/** 03 research — Search */
export function MagnifierGlyph({ id, size = DEFAULT_SIZE }: GlyphProps) {
  return (
    <Search
      data-icon={id}
      size={size}
      strokeWidth={STROKE_WIDTH}
      aria-hidden="true"
    />
  );
}

/** 04 qualify — BadgeCheck */
export function CheckGlyph({ id, size = DEFAULT_SIZE }: GlyphProps) {
  return (
    <BadgeCheck
      data-icon={id}
      size={size}
      strokeWidth={STROKE_WIDTH}
      aria-hidden="true"
    />
  );
}

/** 05 personalize — PenLine */
export function EnvelopeGlyph({ id, size = DEFAULT_SIZE }: GlyphProps) {
  return (
    <PenLine
      data-icon={id}
      size={size}
      strokeWidth={STROKE_WIDTH}
      aria-hidden="true"
    />
  );
}

/** 06 outreach — Send */
export function PlaneGlyph({ id, size = DEFAULT_SIZE }: GlyphProps) {
  return (
    <Send
      data-icon={id}
      size={size}
      strokeWidth={STROKE_WIDTH}
      aria-hidden="true"
    />
  );
}

/** 07 converse — MessagesSquare */
export function ChatGlyph({ id, size = DEFAULT_SIZE }: GlyphProps) {
  return (
    <MessagesSquare
      data-icon={id}
      size={size}
      strokeWidth={STROKE_WIDTH}
      aria-hidden="true"
    />
  );
}

/** Stage → glyph (activity/overview: none, exempt primitives only). */
export const STAGE_GLYPH: Record<string, ((p: GlyphProps) => React.ReactNode) | null> = {
  configure: SlidersGlyph,
  discover: DotGridGlyph,
  research: MagnifierGlyph,
  qualify: CheckGlyph,
  personalize: EnvelopeGlyph,
  outreach: PlaneGlyph,
  converse: ChatGlyph,
  activity: null,
  overview: null,
};

/** Exempt ledger mark for the activity node (no registry id). */
export function LedgerMark() {
  return (
    <Activity
      size={DEFAULT_SIZE}
      strokeWidth={STROKE_WIDTH}
      aria-hidden="true"
    />
  );
}

/** Exempt chart mark for the overview node (no registry id). */
export function ChartMark() {
  return (
    <BarChart3
      size={DEFAULT_SIZE}
      strokeWidth={STROKE_WIDTH}
      aria-hidden="true"
    />
  );
}
