/**
 * PLAYBOOK ICONS & GLYPHS — Unified Lucide React Interface Icon System
 * ---------------------------------------------------------------------------
 * Reuses the site icon registry (components/StorySpine/icons.tsx) for all
 * 7 stage tiles, and standardizes the 14px row icons and cover glyphs on
 * Lucide React (24×24 grid, 1.75 stroke weight, round caps & joins).
 */

import React from 'react';
import {
  Ban,
  BarChart2,
  Building2,
  ChevronDown,
  Hash,
  Lock,
  MapPin,
  Minus,
  User,
  Zap,
} from 'lucide-react';
import {
  SlidersGlyph,
  DotGridGlyph,
  MagnifierGlyph,
  CheckGlyph,
  EnvelopeGlyph,
  PlaneGlyph,
  ChatGlyph,
} from '@/components/StorySpine/icons';

export {
  SlidersGlyph,
  DotGridGlyph,
  MagnifierGlyph,
  CheckGlyph,
  EnvelopeGlyph,
  PlaneGlyph,
  ChatGlyph,
};

const INK = 'rgba(10, 10, 10, 0.85)';
const INK_MUTED = 'rgba(10, 10, 10, 0.45)';

/** 14px Row Icon: Person (job title / persona criteria) */
export function PersonRowIcon({ id }: { id?: string }) {
  return (
    <User
      size={14}
      strokeWidth={1.75}
      color={INK}
      aria-hidden="true"
      data-icon={id || 'icon-row-person'}
      className="shrink-0"
    />
  );
}

/** 14px Row Icon: Building (industry criteria) */
export function BuildingRowIcon({ id }: { id?: string }) {
  return (
    <Building2
      size={14}
      strokeWidth={1.75}
      color={INK}
      aria-hidden="true"
      data-icon={id || 'icon-row-building'}
      className="shrink-0"
    />
  );
}

/** 14px Row Icon: Size Bars (company size criteria) */
export function SizeBarsRowIcon({ id }: { id?: string }) {
  return (
    <BarChart2
      size={14}
      strokeWidth={1.75}
      color={INK}
      aria-hidden="true"
      data-icon={id || 'icon-row-size'}
      className="shrink-0"
    />
  );
}

/** 14px Row Icon: Globe Pin (geography criteria) */
export function GlobePinRowIcon({ id }: { id?: string }) {
  return (
    <MapPin
      size={14}
      strokeWidth={1.75}
      color={INK}
      aria-hidden="true"
      data-icon={id || 'icon-row-globe'}
      className="shrink-0"
    />
  );
}

/** 14px Row Icon: Bolt (pain points criteria) */
export function BoltRowIcon({ id }: { id?: string }) {
  return (
    <Zap
      size={14}
      strokeWidth={1.75}
      color={INK}
      aria-hidden="true"
      data-icon={id || 'icon-row-bolt'}
      className="shrink-0"
    />
  );
}

/** 14px Row Icon: Stop Circle (disqualifier criteria) */
export function StopCircleRowIcon({ id }: { id?: string }) {
  return (
    <Ban
      size={14}
      strokeWidth={1.75}
      color={INK}
      aria-hidden="true"
      data-icon={id || 'icon-row-stop'}
      className="shrink-0"
    />
  );
}

/** 14px Row Icon: Dash (skip criteria chips) */
export function DashRowIcon({ id }: { id?: string }) {
  return (
    <Minus
      size={14}
      strokeWidth={1.75}
      color={INK_MUTED}
      aria-hidden="true"
      data-icon={id || 'icon-row-dash'}
      className="shrink-0"
    />
  );
}

/** Hash glyph (Rule 0 compliant) */
export function HashCoverGlyph({ size = 28 }: { size?: number }) {
  return (
    <Hash
      size={size}
      strokeWidth={1.85}
      aria-hidden="true"
      data-icon="cover-hash-glyph"
    />
  );
}

/** Small Lock Icon for book cover */
export function LockGlyph({ size = 16 }: { size?: number }) {
  return (
    <Lock
      size={size}
      strokeWidth={1.75}
      aria-hidden="true"
      data-icon="cover-lock-glyph"
    />
  );
}

/** Down-chevron in a circle (scroll cue) */
export function ScrollCueIcon({ size = 24 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-white border border-[rgba(10,10,10,0.16)]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <ChevronDown
        size={Math.round(size * 0.6)}
        strokeWidth={1.75}
        color="rgba(10, 10, 10, 0.65)"
        data-icon="cue-chevron"
      />
    </span>
  );
}
