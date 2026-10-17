/**
 * PROCESS STORY ICON REGISTRY (G5: no repeated metaphor)
 * ---------------------------------------------------------------------------
 * Every recognizable glyph on the page is registered here and rendered with
 * a unique data-icon id per INSTANCE (recap/handoff copies share the
 * component but take distinct ids — identical rendering, unique identity).
 * The Playwright registry test collects [data-icon] page-wide and fails on
 * any duplicate. Shared primitives (dots, rings, lines, bars, chevrons,
 * plus marks, arrowheads) carry no data-icon and are exempt.
 *
 * Style: 24-grid, 1.5px stroke, round caps — the story's one icon voice.
 * Palette: ink + ink tints + the single accent (one status mark max).
 */

'use client';

import type { ReactNode } from 'react';

export const INK = 'rgba(10,10,10,1)';
export const INK70 = 'rgba(10,10,10,0.7)';
export const SOFT = 'rgba(10,10,10,0.14)';
export const FAINT = 'rgba(10,10,10,0.07)';
export const HAIR = 'rgba(10,10,10,0.06)';
export const ACCENT = 'var(--scaffold-accent)';

export const STROKE = {
  stroke: INK,
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

function Svg({
  id,
  children,
  size = '46%',
}: {
  id: string;
  children: ReactNode;
  size?: string | number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" data-icon={id}>
      {children}
    </svg>
  );
}

/* ─── Anchor tile glyphs (one per chapter, never repeated) ──────────── */

/** Ch1: sliders — the saved profile. */
export function SlidersGlyph({ id }: { id: string }) {
  return (
    <Svg id={id}>
      <path d="M4 8h16M4 16h16" stroke={SOFT} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M9 5.5v5M15 13.5v5" {...STROKE} />
      <circle cx="9" cy="8" r="2.2" fill="rgba(255,255,255,1)" {...STROKE} />
      <circle cx="15" cy="16" r="2.2" fill="rgba(255,255,255,1)" {...STROKE} />
      <circle cx="18.6" cy="5.4" r="1.2" fill={ACCENT} />
    </Svg>
  );
}

/** Ch2: document with magnifier — research. */
export function ResearchGlyph({ id }: { id: string }) {
  return (
    <Svg id={id}>
      <path d="M6 3.5h7l4 4v13H6z" {...STROKE} />
      <path d="M13 3.5v4h4" {...STROKE} />
      <path d="M9 12.5h4M9 15.5h2.5" stroke={SOFT} strokeWidth={1.3} strokeLinecap="round" />
      <circle cx="15.5" cy="15.5" r="4" fill="rgba(255,255,255,1)" {...STROKE} />
      <path d="M18.4 18.4L21 21" {...STROKE} />
      <circle cx="15.5" cy="15.5" r="1" fill={ACCENT} />
    </Svg>
  );
}

/** Ch3: outline paper plane — outreach (open folds, unlike any solid glyph). */
export function PlaneGlyph({ id }: { id: string }) {
  return (
    <Svg id={id}>
      <path d="M20.5 3.5L10 13.5l-2.6-2.6 8-8.4 5.1 1Z" {...STROKE} />
      <path d="M10 13.5l-4.9 4.9 2.3-7.5" {...STROKE} />
      <path d="M10 13.5l-2.6-2.6" stroke={SOFT} strokeWidth={1.2} strokeLinecap="round" />
      <circle cx="18.8" cy="5.2" r="1.2" fill={ACCENT} />
    </Svg>
  );
}

/** Ch4: week grid — scheduled time (gridded, one tinted cell, no digits). */
export function CalendarGlyph({ id }: { id: string }) {
  return (
    <Svg id={id}>
      <rect x="4" y="5" width="16" height="15" rx="3" {...STROKE} />
      <path d="M4 9.5h16" {...STROKE} />
      <path d="M9 3v3.4M15 3v3.4" {...STROKE} />
      <path d="M9.3 12.6v4.6M14.7 12.6v4.6M6.6 15h10.8" stroke={SOFT} strokeWidth={1.2} strokeLinecap="round" />
      <rect x="10" y="12.9" width="3.8" height="1.7" rx="0.85" fill="var(--scaffold-accent-chip)" />
    </Svg>
  );
}

/* ─── Gate emblems (chapter 3 — four unique checks) ─────────────────── */

export function GateArcs({ id }: { id: string }) {
  return (
    <Svg id={id} size={34}>
      <path d="M5 19a7 7 0 0 1 14 0" {...STROKE} />
      <path d="M8.5 19a3.5 3.5 0 0 1 7 0" {...STROKE} />
      <circle cx="12" cy="19" r="1.2" fill={INK} />
    </Svg>
  );
}

export function GateShield({ id }: { id: string }) {
  return (
    <Svg id={id} size={34}>
      <path d="M12 3.5l7 2.6v5.2c0 4.6-3 7.9-7 9.2-4-1.3-7-4.6-7-9.2V6.1z" {...STROKE} />
      <path d="M9 11.8l2.2 2.2 4-4.2" {...STROKE} />
    </Svg>
  );
}

/** Circuit breaker: closed (on) or open (tripped) rendering, one instance. */
export function GateSwitch({ id, open = false }: { id: string; open?: boolean }) {
  return (
    <Svg id={id} size={34}>
      <path d="M4 17h5M15 17h5" {...STROKE} />
      <circle cx="4" cy="17" r="1.2" fill={INK} />
      <circle cx="20" cy="17" r="1.2" fill={INK} />
      {open ? <path d="M9 17l3.5-7" {...STROKE} /> : <path d="M9 17h6" {...STROKE} />}
      {!open && <circle cx="12" cy="17" r="1" fill={INK} />}
    </Svg>
  );
}

export function GateSlash({ id }: { id: string }) {
  return (
    <Svg id={id} size={34}>
      <path d="M6 4.5h12v15H6z" {...STROKE} />
      <path d="M9 9.5h6M9 12.5h6" stroke={SOFT} strokeWidth={1.3} strokeLinecap="round" />
      <path d="M7 19L17 5" stroke={INK} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

/* ─── Sorter lane glyphs (chapter 4 — four distinct pills) ──────────── */

function GlyphShell({ id, children }: { id: string; children: ReactNode }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true" data-icon={id}>
      <rect x="2" y="2" width="20" height="20" rx="10" fill="rgba(255,255,255,1)" stroke={HAIR} strokeWidth="1" />
      {children}
    </svg>
  );
}

export function GlyphArrow({ id }: { id: string }) {
  return (
    <GlyphShell id={id}>
      <path d="M8 16L16 8M9.5 8H16v6.5" {...STROKE} />
    </GlyphShell>
  );
}

export function GlyphQuestion({ id }: { id: string }) {
  return (
    <GlyphShell id={id}>
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.8.3-.9.9-.9 1.7" {...STROKE} />
      <circle cx="12" cy="16.4" r="1" fill={INK} />
    </GlyphShell>
  );
}

export function GlyphMoon({ id }: { id: string }) {
  return (
    <GlyphShell id={id}>
      <path d="M15.5 14.5A5.5 5.5 0 0 1 9.5 8.5a5.5 5.5 0 1 0 6 6Z" {...STROKE} />
    </GlyphShell>
  );
}

export function GlyphStop({ id }: { id: string }) {
  return (
    <GlyphShell id={id}>
      <path d="M8.5 5.5h7l3 3v7l-3 3h-7l-3-3v-7z" {...STROKE} />
      <path d="M10 10l4 4M14 10l-4 4" stroke={SOFT} strokeWidth={1.3} strokeLinecap="round" />
    </GlyphShell>
  );
}

/* ─── Handoff artifacts (shared renderings, unique ids per instance) ──
   Each ~40px, identical shape/size wherever it appears (G4). */

/** Shortlist pill: 6 dots, one accent. `twinDot` registers the accent dot
    with the spine engine (accents only near the rider); `dim` mutes. */
export function ShortlistArtifact({
  id,
  dim = false,
  twinDot,
}: {
  id: string;
  dim?: boolean;
  twinDot?: string;
}) {
  return (
    <svg width="72" height="28" viewBox="0 0 72 28" fill="none" aria-hidden="true" data-icon={id}>
      <rect x="1" y="1" width="70" height="26" rx="13" fill="rgba(255,255,255,1)" stroke={HAIR} strokeWidth="1" />
      {[12, 22, 32, 42, 52].map((cx) => (
        <circle key={cx} cx={cx} cy="14" r="3" fill={INK70} opacity={dim ? 0.25 : 1} />
      ))}
      <circle
        cx="62"
        cy="14"
        r="4"
        fill={ACCENT}
        opacity={dim ? 0.15 : 1}
        data-twin-dot={twinDot}
        data-accent={twinDot ? '1' : undefined}
      />
    </svg>
  );
}

/** Miniature draft card: rounded rect, 3 bars, thread stub on left edge. */
export function DraftArtifact({
  id,
  dim = false,
  twinDot,
}: {
  id: string;
  dim?: boolean;
  twinDot?: string;
}) {
  return (
    <svg width="52" height="40" viewBox="0 0 52 40" fill="none" aria-hidden="true" data-icon={id}>
      <path d="M2 20h8" stroke={INK} strokeWidth="1" strokeDasharray="2 3" strokeLinecap="round" opacity={dim ? 0.25 : 1} />
      <rect x="10" y="4" width="40" height="32" rx="8" fill="rgba(255,255,255,1)" stroke={HAIR} strokeWidth="1" />
      <rect x="17" y="12" width="26" height="4" rx="2" fill={FAINT} />
      <rect x="17" y="19" width="18" height="4" rx="2" fill={FAINT} />
      <rect x="17" y="26" width="22" height="4" rx="2" fill={FAINT} />
      <circle
        cx="40"
        cy="29"
        r="2.5"
        fill={ACCENT}
        opacity={dim ? 0.15 : 1}
        data-twin-dot={twinDot}
        data-accent={twinDot ? '1' : undefined}
      />
    </svg>
  );
}

/** Sealed capsule: pill with a seal ring. */
export function CapsuleArtifact({
  id,
  dim = false,
  twinDot,
}: {
  id: string;
  dim?: boolean;
  twinDot?: string;
}) {
  return (
    <svg width="64" height="28" viewBox="0 0 64 28" fill="none" aria-hidden="true" data-icon={id}>
      <rect x="1" y="1" width="62" height="26" rx="13" fill="rgba(255,255,255,1)" stroke={HAIR} strokeWidth="1" />
      <circle cx="50" cy="14" r="6" fill="rgba(255,255,255,1)" stroke={INK} strokeWidth="1.5" opacity={dim ? 0.3 : 1} />
      <circle
        cx="50"
        cy="14"
        r="2"
        fill={ACCENT}
        opacity={dim ? 0.15 : 1}
        data-twin-dot={twinDot}
        data-accent={twinDot ? '1' : undefined}
      />
      <rect x="10" y="11" width="24" height="6" rx="3" fill={FAINT} />
    </svg>
  );
}

/** Loop check: check dot riding a curved arrow stub. */
export function LoopCheckArtifact({
  id,
  dim = false,
  twinDot,
}: {
  id: string;
  dim?: boolean;
  twinDot?: string;
}) {
  return (
    <svg width="44" height="40" viewBox="0 0 44 40" fill="none" aria-hidden="true" data-icon={id}>
      <path d="M8 34C8 18 18 8 34 8" stroke={INK} strokeWidth="1.5" strokeLinecap="round" opacity={dim ? 0.3 : 1} />
      <path d="M28 8h6v6" stroke={INK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={dim ? 0.3 : 1} />
      <circle
        cx="8"
        cy="34"
        r="5"
        fill={ACCENT}
        opacity={dim ? 0.15 : 1}
        data-twin-dot={twinDot}
        data-accent={twinDot ? '1' : undefined}
      />
      <path d="M5.8 34l1.6 1.6 2.8-3" stroke="rgba(255,255,255,1)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Contract pod: 56×28 pill, input dots, ring, output dots ───────── */

export function ContractPod({ id }: { id: string }) {
  return (
    <svg width="56" height="44" viewBox="0 0 56 44" fill="none" aria-hidden="true" data-icon={id}>
      <circle cx="28" cy="6" r="2.5" fill={INK} opacity="0.7" />
      <circle cx="28" cy="38" r="2.5" fill={INK} opacity="0.25" />
      <rect x="4" y="12" width="48" height="20" rx="10" fill="rgba(255,255,255,1)" stroke={HAIR} strokeWidth="1" />
      <circle cx="28" cy="22" r="6" fill="rgba(255,255,255,1)" stroke={INK} strokeWidth="1.5" data-pod-ring={id} />
      <circle cx="18" cy="22" r="1.8" fill={SOFT} />
      <circle cx="38" cy="22" r="1.8" fill={SOFT} />
    </svg>
  );
}

/* ─── Static glossy tile shell (anchor tiles — same construction) ───── */

export function StaticTile({ children, size = 72 }: { children: ReactNode; size?: number }) {
  return (
    <div aria-hidden="true" className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 translate-y-[4px]"
        style={{ borderRadius: '28%', background: 'var(--scaffold-lip)' }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          borderRadius: '28%',
          background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(244,244,245,1) 100%)',
          border: '1px solid rgba(10,10,10,0.03)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.04), var(--scaffold-shadow-object)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
