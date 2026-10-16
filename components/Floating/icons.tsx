/**
 * FLOATING ICONS — one consistent 1.5px stroke style
 * ---------------------------------------------------------------------------
 * New icons come from the installed HugeIcons set (free outline icons:
 * 24-grid, 1.5px stroke, round caps — exactly the specified style), imported
 * by name from the tree-shaken root. Glyphs the free set lacks (funnel,
 * globe-with-pin, week-grid calendar, sheet stack, radar sweep) are
 * hand-drawn on the same 24-grid with the same stroke so the family reads
 * as one style.
 *
 * The six `legacy-*` icons are the existing hero tile artwork, byte for
 * byte — the scope lock forbids touching them. They keep their heavier
 * 48-grid strokes; everything new uses the thin style.
 *
 * Palette: ink, two ink tints, and the single accent for at most one tiny
 * status mark per object. No text, no digits, aria-hidden throughout.
 */

'use client';

import type { CSSProperties, ReactNode } from 'react';
import {
  Call02Icon,
  Clock01Icon,
  Link01Icon,
  Location01Icon,
  Notification01Icon,
  PenTool02Icon,
  Shield02Icon,
  SparklesIcon,
  Target02Icon,
  Video01Icon,
} from 'hugeicons-react';
import { motion } from 'framer-motion';
import type { OrbIconId, TileIconId } from './config';

export const INK = 'rgba(10,10,10,1)';
export const SOFT = 'rgba(10,10,10,0.14)';
export const FAINT = 'rgba(10,10,10,0.07)';
export const MID = 'rgba(10,10,10,0.4)';
const ACCENT = 'var(--scaffold-accent)';

/* ─── Legacy hero artwork — do not modify ───────────────────────────── */

function LegacyEnvelopeIcon() {
  return (
    <svg width="46%" height="46%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="8" y="13" width="32" height="23" rx="5" stroke={INK} strokeWidth="3" />
      <path d="M9 17.5 L24 28 L39 17.5" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="28.5" r="3" fill={ACCENT} />
    </svg>
  );
}

function dotMatrixDots(animated: boolean): ReactNode {
  const dots = [];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const accent = r === 2 && c === 3;
      const i = r * 6 + c;
      dots.push(
        animated && !accent ? (
          <motion.circle
            key={`${r}-${c}`}
            cx={9 + c * 6}
            cy={9 + r * 6}
            r="1.9"
            fill={SOFT}
            initial={false}
            animate={{ opacity: [0.2, 1, 1, 0.2] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.09 }}
          />
        ) : (
          <circle
            key={`${r}-${c}`}
            cx={9 + c * 6}
            cy={9 + r * 6}
            r="1.9"
            fill={accent ? ACCENT : SOFT}
          />
        ),
      );
    }
  }
  return dots;
}

/** Legacy dot matrix. `fillIn` runs the process-page fill sequence. */
export function DotMatrixIcon({ fillIn = false }: { fillIn?: boolean }) {
  return (
    <svg width="52%" height="52%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {dotMatrixDots(fillIn)}
    </svg>
  );
}

function LegacyCheckIcon() {
  return (
    <svg width="52%" height="52%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="14" stroke={INK} strokeWidth="3" />
      <path d="M17.5 24.5 L22 29 L30.5 19.5" stroke={INK} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LegacyPlaneIcon() {
  return (
    <svg width="50%" height="50%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M9 25.5 L39 10 L27 39 L22.5 28.5 Z"
        fill={INK}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="33" cy="15" r="2.4" fill={ACCENT} />
    </svg>
  );
}

function LegacyMagnifierIcon() {
  return (
    <svg width="52%" height="52%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="21" cy="21" r="11" stroke={INK} strokeWidth="3.5" />
      <path d="M29.5 29.5 L39 39" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="17.5" cy="17.5" r="2.2" fill={ACCENT} />
    </svg>
  );
}

function LegacyStackIcon() {
  return (
    <svg width="50%" height="50%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="16" y="8" width="22" height="28" rx="4" fill={FAINT} stroke={SOFT} strokeWidth="1.5" />
      <rect x="9" y="14" width="24" height="27" rx="4" fill="rgba(255,255,255,1)" stroke="rgba(10,10,10,0.18)" strokeWidth="1.8" />
      <path d="M14 22 h14 M14 28 h14 M14 34 h9" stroke={SOFT} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Thin set: HugeIcons wrappers ────────────────────────────────────
   HugeIcons free glyphs draw in currentColor at 1.5px with round caps.
   Rendered at ~46% of the tile face so their optical size matches the
   legacy icons beside them. */

function Thin({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        width: '46%',
        height: '46%',
        color: INK,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

type HugeIcon = React.ComponentType<{
  size?: string | number;
  strokeWidth?: number;
  style?: CSSProperties;
}>;

function thin(Huge: HugeIcon) {
  return function ThinIcon() {
    return (
      <Thin>
        <Huge size="100%" strokeWidth={1.5} style={{ width: '100%', height: '100%' }} />
      </Thin>
    );
  };
}

const BellIcon = thin(Notification01Icon);
const TargetIcon = thin(Target02Icon);
const LinkIcon = thin(Link01Icon);
const ShieldIcon = thin(Shield02Icon);
const ClockIcon = thin(Clock01Icon);
const VideoIcon = thin(Video01Icon);
const PhoneTileIcon = thin(Call02Icon);
const PinIcon = thin(Location01Icon);

/* ─── Thin set: hand-drawn on the same 24-grid ────────────────────────
   Same stroke (1.5, round caps/joins), same 46% face share. Each carries
   at most one tiny accent status mark. */

function ThinSvg({ children }: { children: ReactNode }) {
  return (
    <svg width="46%" height="46%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {children}
    </svg>
  );
}

const STROKE = {
  stroke: INK,
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

function FunnelIcon() {
  return (
    <ThinSvg>
      <path d="M4 5h16l-6.2 7.2v4.6l-3.6 2v-6.6L4 5Z" {...STROKE} />
      <circle cx="18.6" cy="17.6" r="1.3" fill={ACCENT} />
    </ThinSvg>
  );
}

function GlobePinIcon() {
  return (
    <ThinSvg>
      <circle cx="10.5" cy="12" r="7" {...STROKE} />
      <ellipse cx="10.5" cy="12" rx="3.2" ry="7" {...STROKE} />
      <path d="M3.9 9.2h13.2M3.9 14.8h12.4" {...STROKE} />
      <path
        d="M17.8 8.2a2.6 2.6 0 0 1 3.6 2.4c0 1.9-1.9 3-3.6 4.4-1.7-1.4-3.6-2.5-3.6-4.4a2.6 2.6 0 0 1 3.6-2.4Z"
        fill="rgba(255,255,255,1)"
        stroke={INK}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <circle cx="17.8" cy="10.4" r="1" fill={ACCENT} />
    </ThinSvg>
  );
}

/** Empty week grid: frame, two hangers, grid hairlines, one tinted cell. */
function CalendarIcon() {
  return (
    <ThinSvg>
      <rect x="4" y="5" width="16" height="15" rx="3" {...STROKE} />
      <path d="M4 9.5h16" {...STROKE} />
      <path d="M9 3v3.4M15 3v3.4" {...STROKE} />
      <path d="M9.3 12.6v4.6M14.7 12.6v4.6M6.6 15h10.8" stroke={SOFT} strokeWidth={1.2} strokeLinecap="round" />
      <rect x="10" y="12.9" width="3.8" height="1.7" rx="0.85" fill="var(--scaffold-accent-chip)" />
    </ThinSvg>
  );
}

/** Three offset sheets, front one blank with hairline rules. */
function SheetsIcon() {
  return (
    <ThinSvg>
      <rect x="8.5" y="3.5" width="11" height="14" rx="2.5" fill={FAINT} stroke={SOFT} strokeWidth={1.2} />
      <rect x="6" y="6" width="11" height="14" rx="2.5" fill="rgba(255,255,255,1)" stroke={SOFT} strokeWidth={1.2} />
      <rect x="3.5" y="8.5" width="11" height="12" rx="2.5" fill="rgba(255,255,255,1)" {...STROKE} />
      <path d="M6.2 12.4h5.6M6.2 15.4h5.6" stroke={SOFT} strokeWidth={1.3} strokeLinecap="round" />
      <circle cx="12.4" cy="18" r="1" fill={ACCENT} />
    </ThinSvg>
  );
}

/** Pen with an ink sparkle and one accent status dot. */
function SparklePenIcon() {
  return (
    <span aria-hidden="true" style={{ position: 'relative', display: 'inline-flex', width: '46%', height: '46%', color: INK }}>
      <PenTool02Icon size="100%" strokeWidth={1.5} style={{ width: '100%', height: '100%' }} />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <path
          d="M18.5 2.5c.4 1.9 1 2.5 2.9 2.9-1.9.4-2.5 1-2.9 2.9-.4-1.9-1-2.5-2.9-2.9 1.9-.4 2.5-1 2.9-2.9Z"
          fill={MID}
        />
        <circle cx="5" cy="18.6" r="1.2" fill={ACCENT} />
      </svg>
    </span>
  );
}

/** Sweep screen: rings, crosshair, one accent blip, rotating sweep wedge. */
export function RadarIcon({ sweep = false }: { sweep?: boolean }) {
  return (
    <ThinSvg>
      <circle cx="12" cy="12" r="8" {...STROKE} />
      <circle cx="12" cy="12" r="4.6" stroke={SOFT} strokeWidth={1.2} />
      <path d="M12 4v2.4M12 17.6V20M4 12h2.4M17.6 12H20" stroke={SOFT} strokeWidth={1.2} strokeLinecap="round" />
      <motion.g
        initial={false}
        animate={sweep ? { rotate: 360 } : { rotate: 0 }}
        transition={sweep ? { duration: 6, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }}
        style={{ transformOrigin: '12px 12px' }}
      >
        <path d="M12 12L12 4.2A7.8 7.8 0 0 1 17.6 6.4L12 12Z" fill={FAINT} />
        <path d="M12 12L12 4.4" stroke={MID} strokeWidth={1.2} strokeLinecap="round" />
      </motion.g>
      <circle cx="14.8" cy="13.8" r="1.3" fill={ACCENT} />
    </ThinSvg>
  );
}

/** Double-check for the read-receipt fragment. */
export function DoubleCheckIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.5 12.8l3.6 3.6L13.5 9" {...STROKE} />
      <path d="M10.5 16.4l1.6 1.6 7.4-7.4" {...STROKE} />
    </svg>
  );
}

/** Small sparkle glyph shared by orbs and satellites. */
export function SparkIcon() {
  return (
    <span aria-hidden="true" style={{ display: 'inline-flex', width: '46%', height: '46%', color: INK }}>
      <SparklesIcon size="100%" strokeWidth={1.5} style={{ width: '100%', height: '100%' }} />
    </span>
  );
}

/* ─── Registries ───────────────────────────────────────────────────── */

export const TILE_ICONS: Record<TileIconId, React.ComponentType> = {
  'legacy-envelope': LegacyEnvelopeIcon,
  'legacy-dotmatrix': DotMatrixIcon,
  dotfill: DotMatrixIcon,
  'legacy-check': LegacyCheckIcon,
  'legacy-plane': LegacyPlaneIcon,
  'legacy-magnifier': LegacyMagnifierIcon,
  'legacy-stack': LegacyStackIcon,
  bell: BellIcon,
  target: TargetIcon,
  'globe-pin': GlobePinIcon,
  funnel: FunnelIcon,
  link: LinkIcon,
  shield: ShieldIcon,
  clock: ClockIcon,
  video: VideoIcon,
  phone: PhoneTileIcon,
  calendar: CalendarIcon,
  sheets: SheetsIcon,
  'sparkle-pen': SparklePenIcon,
  radar: () => RadarIcon({}),
};

export const ORB_ICONS: Record<OrbIconId, React.ComponentType> = {
  bell: BellIcon,
  pin: PinIcon,
  target: TargetIcon,
  spark: SparkIcon,
  phone: PhoneTileIcon,
};
