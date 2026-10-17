/**
 * PLAYBOOK ICONS & GLYPHS
 * ---------------------------------------------------------------------------
 * Reuses the site icon registry (components/StorySpine/icons.tsx) for all
 * 7 stage tiles. Adds exact 14px row icons for ICP criteria chips,
 * skip dash, and book cover glyphs (hash glyph, lock).
 *
 * All icons follow the site tokens: ink #0A0A0A, ~1.5px strokes, round caps.
 */

import React from 'react';
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
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      data-icon={id || 'icon-row-person'}
      className="shrink-0"
    >
      <circle cx="7" cy="4" r="2.5" stroke={INK} strokeWidth="1.2" />
      <path
        d="M2.5 12c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5"
        stroke={INK}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 14px Row Icon: Building (industry criteria) */
export function BuildingRowIcon({ id }: { id?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      data-icon={id || 'icon-row-building'}
      className="shrink-0"
    >
      <rect x="2.5" y="2" width="9" height="10" rx="1" stroke={INK} strokeWidth="1.2" />
      <path d="M5 4.5h1.5M7.5 4.5h1.5M5 7h1.5M7.5 7h1.5M5 9.5h1.5M7.5 9.5h1.5" stroke={INK_MUTED} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/** 14px Row Icon: Size Bars (company size criteria) */
export function SizeBarsRowIcon({ id }: { id?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      data-icon={id || 'icon-row-size'}
      className="shrink-0"
    >
      <path d="M3 11V8M7 11V5M11 11V2.5" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/** 14px Row Icon: Globe Pin (geography criteria) */
export function GlobePinRowIcon({ id }: { id?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      data-icon={id || 'icon-row-globe'}
      className="shrink-0"
    >
      <circle cx="7" cy="5.5" r="3" stroke={INK} strokeWidth="1.2" />
      <path d="M7 8.5V12M5.5 12h3" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="5.5" r="1" fill={INK_MUTED} />
    </svg>
  );
}

/** 14px Row Icon: Bolt (pain points criteria) */
export function BoltRowIcon({ id }: { id?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      data-icon={id || 'icon-row-bolt'}
      className="shrink-0"
    >
      <path
        d="M7.5 1.5L3 8h4.5L6.5 12.5 11 6H6.5L7.5 1.5Z"
        stroke={INK}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 14px Row Icon: Stop Circle (disqualifier criteria) */
export function StopCircleRowIcon({ id }: { id?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      data-icon={id || 'icon-row-stop'}
      className="shrink-0"
    >
      <circle cx="7" cy="7" r="5" stroke={INK} strokeWidth="1.2" />
      <path d="M4.5 4.5L9.5 9.5" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/** 14px Row Icon: Dash (skip criteria chips) */
export function DashRowIcon({ id }: { id?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      data-icon={id || 'icon-row-dash'}
      className="shrink-0"
    >
      <path d="M3.5 7h7" stroke={INK_MUTED} strokeWidth="1.3" strokeLinecap="round" strokeDasharray="2 1.5" />
    </svg>
  );
}

/** Hash glyph made of four strokes (shapes, not characters - Rule 0 compliant) */
export function HashCoverGlyph({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      data-icon="cover-hash-glyph"
    >
      <path d="M5 8.5h14M5 15.5h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M9.5 4.5l-2 15M16.5 4.5l-2 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** Small Lock Icon for book cover */
export function LockGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      data-icon="cover-lock-glyph"
    >
      <rect x="3.5" y="6.5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M5.5 6.5V4.5a2.5 2.5 0 0 1 5 0v2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="8" cy="10" r="0.9" fill="currentColor" />
    </svg>
  );
}

/** Down-chevron in a circle (scroll cue) */
export function ScrollCueIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      data-icon="cue-chevron"
    >
      <circle cx="12" cy="12" r="10.5" stroke="rgba(10,10,10,0.18)" strokeWidth="1.2" fill="white" />
      <path
        d="M8.5 10.5L12 14L15.5 10.5"
        stroke="rgba(10,10,10,0.6)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
