/**
 * FLOATING OBJECTS — placement config (data only, no user-facing text)
 * ---------------------------------------------------------------------------
 * Every decorative object on the hero and the process page is placed from
 * here. Nudge positions, sizes, rotations and layers without touching the
 * components that render them.
 *
 * FIELD GUIDE
 *   id        Stable handle. Used for trajectory anchors, cluster registry
 *             and the Playwright report. Never rendered.
 *   kind      'tile' | 'orb' | 'fragment'. Satellites belong to their parent
 *             (see `sat`) and trajectories/crosses are separate small lists.
 *   icon      Tile/orb artwork key (see icons.tsx). Legacy hero tiles keep
 *             their exact artwork under the `legacy-*` keys.
 *   frag      Fragment variant key (see UiFragment.tsx): typing | toggle |
 *             slider | receipt | avatars | toast | progress | message | quote.
 *   layer     Depth: 'far' | 'mid' | 'near' (see LAYERS below).
 *   x         Object CENTER, percent of gutter width from the gutter's left
 *             edge. Values below 0 / above 100 crop past the viewport edge
 *             (near-layer cue). The hero section clips horizontally, so this
 *             never creates sideways scroll. Ignored when `inner`/`outer` set.
 *   inner     Alternative to `x`: px from the COLUMN edge to the object's
 *             near edge (gutter modes only). Anchoring to the column keeps
 *             text clearance exact at every viewport width — prefer this for
 *             any object near the text.
 *   outer     Alternative to `x`: px from the VIEWPORT edge to the object's
 *             near edge; negative crops past the edge (near-layer cue).
 *   y         Object TOP in px from the gutter top. Px, not percent: gutter
 *             height tracks the text column, whose wrapping changes with
 *             width — a percent would drift against the text it must clear.
 *   yb        Alternative to `y`: object BOTTOM in px from the gutter bottom
 *             (for edge-anchored tiles). Set either `y` or `yb`, not both.
 *   size      Design size in px at scale 1. The layer scale multiplies it,
 *             so `size` 120 on 'far' renders at ~86px. Tiles 72–160, orbs
 *             56–96, fragments give width in `size` (height is intrinsic).
 *   rotate    Rest tilt in degrees (±14 max). Orbs ignore it (circles).
 *   tilt3d    Legacy perspective tilt for the two hero tiles that had it.
 *   phase     Float-cycle offset in seconds. Every object needs a UNIQUE
 *             value so the group never moves in sync.
 *   cluster   Deliberate-overlap group id. Objects sharing a cluster may
 *             overlap each other (offset ≥24px between centers, smaller one
 *             in front via `z`). The Playwright check exempts in-cluster
 *             pairs and fails every other overlap.
 *   z         Stack order inside the gutter. Higher renders in front.
 *   hideBelow Viewport width under which the object unmounts: 1100 (gutter
 *             tiers) or 1024 (far layer + satellites per spec).
 *   sat       Satellites riding on this object: tiny sparkles/dots/arcs that
 *             move with their parent. Offsets are px from the parent CENTER;
 *             keep them on the outer/top/bottom sides, never reaching toward
 *             the text column past the parent's own clearance.
 *
 * No field here holds copy, digits-as-content, or alt text. Decorative
 * objects render aria-hidden with empty alt at the component level.
 */

export type DepthLayer = 'far' | 'mid' | 'near';

export interface LayerSpec {
  /** Rest scale multiplier applied to `size`. */
  scale: number;
  /** Soft-focus for the far layer only, px. */
  blur: number;
  /** Rest opacity. */
  opacity: number;
  /** Pointer-parallax multiplier (base travel 8px). */
  parallax: number;
  /** Idle float amplitude, px. */
  floatAmp: number;
  /** Idle float duration, seconds. */
  floatDuration: number;
  /** Scroll-drift speed multiplier (hero exit). */
  drift: number;
}

export const LAYERS: Record<DepthLayer, LayerSpec> = {
  far: {
    scale: 0.72,
    blur: 2,
    opacity: 0.55,
    parallax: 0.4,
    floatAmp: 3,
    floatDuration: 9,
    drift: 0.45,
  },
  mid: {
    scale: 1,
    blur: 0,
    opacity: 1,
    parallax: 1,
    floatAmp: 6,
    floatDuration: 7,
    drift: 1,
  },
  near: {
    scale: 1.25,
    blur: 0,
    opacity: 1,
    parallax: 1.7,
    floatAmp: 9,
    floatDuration: 5,
    drift: 1.6,
  },
};

/* ─── Shared vocab ─────────────────────────────────────────────────── */

export type TileIconId =
  | 'legacy-envelope'
  | 'legacy-dotmatrix'
  | 'legacy-check'
  | 'legacy-plane'
  | 'legacy-magnifier'
  | 'legacy-stack'
  | 'dotfill'
  | 'bell'
  | 'target'
  | 'globe-pin'
  | 'funnel'
  | 'link'
  | 'shield'
  | 'clock'
  | 'video'
  | 'phone'
  | 'calendar'
  | 'sheets'
  | 'sparkle-pen'
  | 'radar';

export type OrbIconId = 'bell' | 'pin' | 'target' | 'spark' | 'phone';

export type FragmentKind =
  | 'typing'
  | 'toggle'
  | 'slider'
  | 'receipt'
  | 'avatars'
  | 'toast'
  | 'progress'
  | 'message'
  | 'quote';

export type SatelliteKind = 'sparkle' | 'plus' | 'dot' | 'arc';

export interface SatelliteSpec {
  /** Artwork. 'arc' is a thin ring arc partly orbiting the parent. */
  kind: SatelliteKind;
  /** Offset px from the parent center. */
  dx: number;
  dy: number;
  /** Render size in px (sparkle 10–16, arc = ring radius). */
  size: number;
  /** Arc sweep in degrees (arc only). */
  sweep?: number;
  /** Arc start angle in degrees (arc only). */
  start?: number;
}

export interface FloatingSpec {
  id: string;
  kind: 'tile' | 'orb' | 'fragment';
  icon?: TileIconId | OrbIconId;
  frag?: FragmentKind;
  layer: DepthLayer;
  x?: number;
  inner?: number;
  outer?: number;
  y?: number;
  yb?: number;
  size: number;
  rotate?: number;
  tilt3d?: boolean;
  phase: number;
  cluster?: string;
  z?: number;
  hideBelow?: 1100 | 1024;
  sat?: SatelliteSpec[];
}

export interface TrajectorySpec {
  id: string;
  /** Anchor object id the path starts near. */
  from: string;
  /** Offset px from the anchor's box (gutter space). */
  fromOffset: { dx: number; dy: number };
  /** Anchor object id the path ends near. */
  to: string;
  toOffset: { dx: number; dy: number };
  /** Control-point bow in px (positive bows toward the viewport edge). */
  bow: number;
  hideBelow?: 1100 | 1024;
}

/* ─── Hero (≥1100px): the 6 original tiles, declustered ────────────────
   Minimal by request: no orbs, fragments, trajectories or satellites here —
   those families live on the process page. Artwork, sizes, rotations and
   3D tilts are exactly as the hero shipped; only positions moved, to fix
   the Step 0 finding (lower pairs sat at zero gap at 1440 and overlapped
   ~68×60px at 1280). Dot-matrix rose (470→380) and the plane rose
   (600→410) so every pair clears with room for rotation + float.
   Gutter apportion at 1440: each gutter is 260px wide, the column 260–1180.
   Inner edges stay ≥52px clear of the column (test asserts 40). */

export const HERO_LEFT: FloatingSpec[] = [
  {
    id: 'env',
    kind: 'tile',
    icon: 'legacy-envelope',
    layer: 'mid',
    inner: 52,
    y: 190,
    size: 140,
    rotate: -8,
    tilt3d: true,
    phase: 0,
    z: 2,
  },
  {
    id: 'dotmatrix',
    kind: 'tile',
    icon: 'legacy-dotmatrix',
    layer: 'mid',
    inner: 56,
    y: 380,
    size: 120,
    rotate: 6,
    phase: 1.1,
    z: 2,
  },
  {
    id: 'magnifier',
    kind: 'tile',
    icon: 'legacy-magnifier',
    layer: 'mid',
    outer: -36,
    yb: 48,
    size: 120,
    rotate: -10,
    phase: 0.3,
    z: 2,
  },
];

export const HERO_RIGHT: FloatingSpec[] = [
  {
    id: 'check',
    kind: 'tile',
    icon: 'legacy-check',
    layer: 'mid',
    inner: 52,
    y: 180,
    size: 130,
    rotate: -6,
    phase: 0.6,
    z: 2,
  },
  {
    id: 'plane',
    kind: 'tile',
    icon: 'legacy-plane',
    layer: 'mid',
    inner: 52,
    y: 404,
    size: 130,
    rotate: 10,
    tilt3d: true,
    phase: 1.6,
    z: 2,
  },
  {
    id: 'stack',
    kind: 'tile',
    icon: 'legacy-stack',
    layer: 'mid',
    outer: -32,
    yb: 40,
    size: 110,
    rotate: 8,
    phase: 2,
    z: 2,
  },
];

/** No hero trajectories — the hero stays minimal (see process steps). */
export const HERO_TRAJECTORIES: TrajectorySpec[] = [];

/* ─── Hero compact row (<1100px): 2 small tiles ────────────────────────
   One calm pair floating between the nav and the pill. `x` is percent of
   the hero width, `y` px from the hero top. */

export const HERO_COMPACT: FloatingSpec[] = [
  { id: 'c-env', kind: 'tile', icon: 'legacy-envelope', layer: 'mid', x: 30, y: 100, size: 56, rotate: -8, phase: 0.4 },
  { id: 'c-check', kind: 'tile', icon: 'legacy-check', layer: 'mid', x: 70, y: 100, size: 56, rotate: 9, phase: 1.8 },
];

/* ─── Process steps: 3–4 props per step, same three layers ────────────
   Step gutters flank a centered column (panel + marker). `x` is percent
   of the step-gutter width, `y` px from the section top. Sections are
   ~min-h-svh so props spread down the full scroll length.
   Step 3 bundles toggle+receipt as cluster 'reach-confirm'; step 4
   bundles calendar+toast as cluster 'call-toast'. */

export interface ProcessStepField {
  /** Section anchor id (no names, no copy — identity only). */
  step: string;
  left: FloatingSpec[];
  right: FloatingSpec[];
  trajectories: TrajectorySpec[];
}

export const PROCESS_STEPS: ProcessStepField[] = [
  {
    step: 'step-1',
    left: [
      { id: 'p1-radar', kind: 'tile', icon: 'radar', layer: 'mid', inner: 64, y: 160, size: 128, rotate: -9, phase: 0.5, z: 2, sat: [{ kind: 'dot', dx: -80, dy: -70, size: 8 }] },
      { id: 'p1-dotfill', kind: 'tile', icon: 'dotfill', layer: 'far', inner: 100, y: 550, size: 120, rotate: 8, phase: 2.2, z: 1, hideBelow: 1024 },
    ],
    right: [
      { id: 'p1-funnel', kind: 'tile', icon: 'funnel', layer: 'mid', inner: 64, y: 260, size: 120, rotate: 10, phase: 1.4, z: 2 },
      { id: 'p1-pin', kind: 'orb', icon: 'pin', layer: 'near', outer: -20, y: 520, size: 76, phase: 3.6, z: 3, sat: [{ kind: 'sparkle', dx: 52, dy: -48, size: 12 }] },
    ],
    trajectories: [],
  },
  {
    step: 'step-2',
    left: [
      { id: 'p2-sparkle', kind: 'tile', icon: 'sparkle-pen', layer: 'mid', inner: 64, y: 220, size: 128, rotate: 7, phase: 1.1, z: 2, sat: [{ kind: 'plus', dx: -84, dy: 60, size: 12 }] },
      { id: 'p2-quote', kind: 'fragment', frag: 'quote', layer: 'far', inner: 92, y: 560, size: 132, rotate: -6, phase: 2.9, z: 1, hideBelow: 1024 },
    ],
    right: [
      { id: 'p2-link', kind: 'tile', icon: 'link', layer: 'mid', inner: 64, y: 250, size: 116, rotate: -11, phase: 0.9, z: 2 },
      { id: 'p2-sheets', kind: 'tile', icon: 'sheets', layer: 'near', outer: -24, y: 510, size: 104, rotate: 6, phase: 4.1, z: 3 },
    ],
    trajectories: [],
  },
  {
    step: 'step-3',
    left: [
      { id: 'p3-plane', kind: 'tile', icon: 'legacy-plane', layer: 'mid', inner: 64, y: 220, size: 128, rotate: 9, tilt3d: true, phase: 0.3, z: 2 },
      { id: 'p3-shield', kind: 'tile', icon: 'shield', layer: 'far', inner: 100, y: 550, size: 112, rotate: -7, phase: 2.5, z: 1, hideBelow: 1024 },
    ],
    right: [
      { id: 'p3-toggle', kind: 'fragment', frag: 'toggle', layer: 'mid', inner: 104, y: 240, size: 84, rotate: 0, phase: 1.7, cluster: 'reach-confirm', z: 4 },
      { id: 'p3-receipt', kind: 'fragment', frag: 'receipt', layer: 'mid', inner: 52, y: 300, size: 96, rotate: 6, phase: 3.2, cluster: 'reach-confirm', z: 2 },
      { id: 'p3-envelopes', kind: 'tile', icon: 'sheets', layer: 'near', outer: -24, y: 500, size: 108, rotate: -8, phase: 4.9, z: 3 },
    ],
    trajectories: [
      { id: 'traj-p3', from: 'p3-plane', fromOffset: { dx: 52, dy: -40 }, to: 'p3-shield', toOffset: { dx: 30, dy: -50 }, bow: 40, hideBelow: 1024 },
    ],
  },
  {
    step: 'step-4',
    left: [
      { id: 'p4-calendar', kind: 'tile', icon: 'calendar', layer: 'mid', inner: 64, y: 220, size: 128, rotate: -6, phase: 0.8, z: 2 },
      { id: 'p4-toast', kind: 'fragment', frag: 'toast', layer: 'mid', inner: 52, y: 300, size: 140, rotate: 4, phase: 2.7, cluster: 'call-toast', z: 4 },
      { id: 'p4-clock', kind: 'tile', icon: 'clock', layer: 'far', inner: 100, y: 580, size: 112, rotate: 9, phase: 3.8, z: 1, hideBelow: 1024 },
    ],
    right: [
      { id: 'p4-video', kind: 'tile', icon: 'video', layer: 'mid', inner: 64, y: 240, size: 124, rotate: 11, phase: 1.5, z: 2, sat: [{ kind: 'dot', dx: 76, dy: -58, size: 8 }] },
      { id: 'p4-phone', kind: 'orb', icon: 'phone', layer: 'near', outer: -20, y: 520, size: 76, phase: 4.4, z: 3 },
    ],
    trajectories: [],
  },
];

/** Traveling tile icon per step (crossfaded on scroll). No names. */
export const TRAVELER_ICONS: TileIconId[] = [
  'legacy-envelope',
  'radar',
  'sparkle-pen',
  'legacy-plane',
  'calendar',
];

/** Tilt of the traveling tile per stop: base −6°, +4° each step. */
export const TRAVELER_TILTS = [-6, -2, 2, 6, 10];

/* ─── Motion constants (single source, shared by hero + process) ───── */

export const ENTRANCE = {
  /** Drop-in travel, px above rest. */
  drop: 24,
  stiffness: 220,
  damping: 20,
  /** Stagger between objects, seconds. */
  stagger: 0.06,
  /** Wait for the text entrance first, seconds. */
  afterText: 0.55,
} as const;

export const POINTER = {
  /** Max tilt toward the cursor, degrees. */
  maxTilt: 6,
  /** Base parallax travel, px (multiplied by the layer factor). */
  baseTravel: 8,
  stiffness: 120,
  damping: 18,
} as const;

/** Clearances the Playwright check enforces (px). */
export const CLEARANCE = {
  text: 40,
  nav: 24,
  clusterOffset: 24,
} as const;
