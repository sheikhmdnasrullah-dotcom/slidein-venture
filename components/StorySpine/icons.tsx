/**
 * SITE ICON REGISTRY — one glyph per stage, shared everywhere
 * ---------------------------------------------------------------------------
 * H1 fixes the home set: sliders, dot grid, magnifier, check, envelope,
 * paper plane, chat bubble. The same COMPONENT renders in the hero tile and
 * the spine node (distinct data-icon ids per instance — the ProcessStory
 * pattern: identical rendering, unique identity). Activity/overview use
 * exempt primitives (bars/dots) and carry no registry id.
 *
 * Voice: 48-grid, ~3px strokes, round caps; ink + soft grey + one accent
 * dot max — the FloatingTiles voice (which imports from here).
 */

const INK = 'rgba(10,10,10,1)';
const SOFT = 'rgba(10,10,10,0.14)';
// const FAINT = 'rgba(10,10,10,0.07)';
const ACCENT = 'var(--scaffold-accent)';

function Svg({
  id,
  children,
  size = '46%',
}: {
  id: string;
  children: React.ReactNode;
  size?: string | number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" data-icon={id}>
      {children}
    </svg>
  );
}

/** configure — sliders. */
export function SlidersGlyph({ id, size }: { id: string; size?: string | number }) {
  return (
    <Svg id={id} size={size}>
      <path d="M8 14h32M8 24h32M8 34h32" stroke={SOFT} strokeWidth="3" strokeLinecap="round" />
      <circle cx="19" cy="14" r="4.5" fill="rgba(255,255,255,1)" stroke={INK} strokeWidth="3" />
      <circle cx="30" cy="24" r="4.5" fill="rgba(255,255,255,1)" stroke={INK} strokeWidth="3" />
      <circle cx="22" cy="34" r="4.5" fill="rgba(255,255,255,1)" stroke={INK} strokeWidth="3" />
      <circle cx="36" cy="9.5" r="2.2" fill={ACCENT} />
    </Svg>
  );
}

/** discover — dot grid. */
export function DotGridGlyph({ id, size }: { id: string; size?: string | number }) {
  const dots = [];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const accent = r === 2 && c === 3;
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={9 + c * 6}
          cy={9 + r * 6}
          r="1.9"
          fill={accent ? ACCENT : SOFT}
        />,
      );
    }
  }
  return (
    <Svg id={id} size={size ?? '52%'}>
      {dots}
    </Svg>
  );
}

/** research — magnifier. */
export function MagnifierGlyph({ id, size }: { id: string; size?: string | number }) {
  return (
    <Svg id={id} size={size ?? '52%'}>
      <circle cx="21" cy="21" r="11" stroke={INK} strokeWidth="3.5" />
      <path d="M29.5 29.5 L39 39" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="17.5" cy="17.5" r="2.2" fill={ACCENT} />
    </Svg>
  );
}

/** qualify — check in circle. */
export function CheckGlyph({ id, size }: { id: string; size?: string | number }) {
  return (
    <Svg id={id} size={size ?? '52%'}>
      <circle cx="24" cy="24" r="14" stroke={INK} strokeWidth="3" />
      <path
        d="M17.5 24.5 L22 29 L30.5 19.5"
        stroke={INK}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** personalize — envelope. */
export function EnvelopeGlyph({ id, size }: { id: string; size?: string | number }) {
  return (
    <Svg id={id} size={size}>
      <rect x="8" y="13" width="32" height="23" rx="5" stroke={INK} strokeWidth="3" />
      <path
        d="M9 17.5 L24 28 L39 17.5"
        stroke={INK}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="28.5" r="3" fill={ACCENT} />
    </Svg>
  );
}

/** outreach — paper plane. */
export function PlaneGlyph({ id, size }: { id: string; size?: string | number }) {
  return (
    <Svg id={id} size={size ?? '50%'}>
      <path
        d="M9 25.5 L39 10 L27 39 L22.5 28.5 Z"
        fill={INK}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="33" cy="15" r="2.4" fill={ACCENT} />
    </Svg>
  );
}

/** converse — chat bubble. */
export function ChatGlyph({ id, size }: { id: string; size?: string | number }) {
  return (
    <Svg id={id} size={size}>
      <path
        d="M12 10h24q4 0 4 4v14q0 4-4 4H24l-9 8v-8h-3q-4 0-4-4V14q0-4 4-4Z"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="21" r="2" fill={INK} />
      <circle cx="25" cy="21" r="2" fill={INK} />
      <circle cx="31" cy="21" r="2" fill={ACCENT} />
    </Svg>
  );
}

export type GlyphProps = { id: string; size?: string | number };

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

/** Exempt ledger mark for the activity node (stacked bars, no registry id). */
export function LedgerMark() {
  return (
    <svg width="46%" height="46%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="12" y="10" width="24" height="5" rx="2.5" fill={SOFT} />
      <rect x="12" y="19" width="24" height="5" rx="2.5" fill={SOFT} />
      <rect x="12" y="28" width="16" height="5" rx="2.5" fill={SOFT} />
      <circle cx="34" cy="30.5" r="2.5" fill={ACCENT} />
    </svg>
  );
}

/** Exempt chart mark for the overview node (bars + line, no registry id). */
export function ChartMark() {
  return (
    <svg width="46%" height="46%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M10 38V14M10 38h28" stroke={SOFT} strokeWidth="3" strokeLinecap="round" />
      <path d="M16 30v-8M24 30V18M32 30v-5" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="22" r="2.2" fill={ACCENT} />
    </svg>
  );
}
