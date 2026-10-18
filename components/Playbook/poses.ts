/**
 * PLAYBOOK POSES & GEOMETRY
 * ---------------------------------------------------------------------------
 * Master coordinates for the 3-act scroll-driven Playbook story.
 * Authored ONCE here; no hardcoded layout values elsewhere.
 *
 * Canvases:
 * - Landscape: 1280 x 640 (>= 768px). Safe rect: [48, 48, 1232, 592].
 * - Portrait:  720 x 900  (< 768px).  Safe rect: [48, 48, 672, 852].
 *
 * Story Acts:
 * - Act 1 (Gather): 14 diverse scattered business fragments + 24 typed chips.
 * - Act 2 (Distill): 3 columns (profile, offers, icps) with docked chips & ICP spotlight.
 * - Act 3 (Compile): Master Playbook book + 7 stage tiles reading from it.
 */

export const CANVAS_LANDSCAPE = {
  w: 1280,
  h: 640,
  pad: 48,
} as const;

export const CANVAS_PORTRAIT = {
  w: 720,
  h: 900,
  pad: 48,
} as const;

export const PLAYBOOK_CONFIG = {
  showBeam: true,
  showVersions: true,
  autoAdvance: true,
} as const;

export type ChipType = 'profile' | 'offers' | 'icps';

export interface FragmentDef {
  id: string;
  kind:
    | 'website'
    | 'about'
    | 'pricing'
    | 'email'
    | 'social'
    | 'brochure'
    | 'sheet'
    | 'notes'
    | 'review'
    | 'calendar'
    | 'logo'
    | 'map'
    | 'org'
    | 'call';
  x: number;
  y: number;
  w: number;
  h: number;
  scale: number;
  rot: number;
  hitProgress: number; // scan beam crossing progress (0.12 - 0.28)
  sourceAnchor: { x: number; y: number }; // local offset for chip tether
  chipIds: string[];
}

export interface ChipDef {
  id: string;
  type: ChipType;
  label?: string; // only allowed stage words or empty
  criteriaIndex?: number; // 0..5 for ICP criteria chips
  isSkip?: boolean; // true for 2 ICP skip chips
  leadShape: 'circle' | 'square' | 'diamond';
  // Act 1 constellation pose
  fragId: string;
  constellation: {
    x: number;
    y: number;
    rot: number;
  };
  // Act 2 docked slot pose
  docked: {
    x: number;
    y: number;
    colIndex: number;
    rowIndex: number;
  };
}

/* ==========================================================================
   LANDSCAPE (1280 x 640)
   ========================================================================== */

export const LANDSCAPE_FRAGMENTS: FragmentDef[] = [
  // Top band (y: 50 - 180)
  {
    id: 'frag-website',
    kind: 'website',
    x: 60,
    y: 54,
    w: 200,
    h: 120,
    scale: 1.0,
    rot: -4,
    hitProgress: 0.13,
    sourceAnchor: { x: 100, y: 15 },
    chipIds: ['chip-p0', 'chip-p1'],
  },
  {
    id: 'frag-about',
    kind: 'about',
    x: 300,
    y: 62,
    w: 180,
    h: 110,
    scale: 0.8,
    rot: 5,
    hitProgress: 0.14,
    sourceAnchor: { x: 90, y: 20 },
    chipIds: ['chip-p2', 'chip-p3'],
  },
  {
    id: 'frag-pricing',
    kind: 'pricing',
    x: 530,
    y: 36,
    w: 210,
    h: 115,
    scale: 1.15,
    rot: -5,
    hitProgress: 0.14,
    sourceAnchor: { x: 105, y: 25 },
    chipIds: ['chip-o0', 'chip-o1'],
  },
  {
    id: 'frag-email',
    kind: 'email',
    x: 790,
    y: 58,
    w: 170,
    h: 95,
    scale: 0.8,
    rot: 7,
    hitProgress: 0.15,
    sourceAnchor: { x: 85, y: 18 },
    chipIds: ['chip-o2'],
  },
  {
    id: 'frag-social',
    kind: 'social',
    x: 1005,
    y: 54,
    w: 170,
    h: 105,
    scale: 1.0,
    rot: -3,
    hitProgress: 0.15,
    sourceAnchor: { x: 85, y: 22 },
    chipIds: ['chip-i0', 'chip-o3'],
  },

  // Middle band (y: 200 - 340)
  {
    id: 'frag-brochure',
    kind: 'brochure',
    x: 68,
    y: 220,
    w: 150,
    h: 120,
    scale: 0.8,
    rot: 6,
    hitProgress: 0.19,
    sourceAnchor: { x: 75, y: 20 },
    chipIds: ['chip-p4', 'chip-o4'],
  },
  {
    id: 'frag-sheet',
    kind: 'sheet',
    x: 230,
    y: 235,
    w: 200,
    h: 110,
    scale: 1.15,
    rot: 4,
    hitProgress: 0.20,
    sourceAnchor: { x: 100, y: 20 },
    chipIds: ['chip-o5', 'chip-i1'],
  },
  {
    id: 'frag-notes',
    kind: 'notes',
    x: 885,
    y: 210,
    w: 140,
    h: 100,
    scale: 0.8,
    rot: -8,
    hitProgress: 0.19,
    sourceAnchor: { x: 70, y: 15 },
    chipIds: ['chip-p5'],
  },
  {
    id: 'frag-review',
    kind: 'review',
    x: 1015,
    y: 210,
    w: 180,
    h: 90,
    scale: 1.0,
    rot: 4,
    hitProgress: 0.20,
    sourceAnchor: { x: 90, y: 15 },
    chipIds: ['chip-i2', 'chip-o6'],
  },

  // Bottom band (y: 330 - 460)
  {
    id: 'frag-calendar',
    kind: 'calendar',
    x: 62,
    y: 340,
    w: 170,
    h: 115,
    scale: 0.8,
    rot: -5,
    hitProgress: 0.25,
    sourceAnchor: { x: 85, y: 20 },
    chipIds: ['chip-o7'],
  },
  {
    id: 'frag-logo',
    kind: 'logo',
    x: 270,
    y: 395,
    w: 145,
    h: 95,
    scale: 0.8,
    rot: 6,
    hitProgress: 0.25,
    sourceAnchor: { x: 72, y: 15 },
    chipIds: ['chip-p6'],
  },
  {
    id: 'frag-map',
    kind: 'map',
    x: 505,
    y: 410,
    w: 160,
    h: 105,
    scale: 1.0,
    rot: -7,
    hitProgress: 0.26,
    sourceAnchor: { x: 80, y: 20 },
    chipIds: ['chip-i3', 'chip-p7'],
  },
  {
    id: 'frag-org',
    kind: 'org',
    x: 775,
    y: 345,
    w: 190,
    h: 115,
    scale: 1.15,
    rot: 4,
    hitProgress: 0.26,
    sourceAnchor: { x: 95, y: 20 },
    chipIds: ['chip-i4', 'chip-i5'],
  },
  {
    id: 'frag-call',
    kind: 'call',
    x: 1008,
    y: 340,
    w: 185,
    h: 100,
    scale: 1.0,
    rot: -2,
    hitProgress: 0.25,
    sourceAnchor: { x: 92, y: 15 },
    chipIds: ['chip-i6', 'chip-i7'],
  },
];

/* 24 Chips (8 profile, 8 offers, 8 icps) */
export const LANDSCAPE_CHIPS: ChipDef[] = [
  // 8 PROFILE CHIPS (Circle lead)
  {
    id: 'chip-p0',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'frag-website',
    constellation: { x: 50, y: 22, rot: -3 },
    docked: { x: 144, y: 296, colIndex: 0, rowIndex: 0 },
  },
  {
    id: 'chip-p1',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'frag-website',
    constellation: { x: 160, y: 24, rot: 2 },
    docked: { x: 256, y: 296, colIndex: 0, rowIndex: 0 },
  },
  {
    id: 'chip-p2',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'frag-about',
    constellation: { x: 290, y: 30, rot: -4 },
    docked: { x: 144, y: 332, colIndex: 0, rowIndex: 1 },
  },
  {
    id: 'chip-p3',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'frag-about',
    constellation: { x: 400, y: 32, rot: 4 },
    docked: { x: 256, y: 332, colIndex: 0, rowIndex: 1 },
  },
  {
    id: 'chip-p4',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'frag-brochure',
    constellation: { x: 55, y: 188, rot: 3 },
    docked: { x: 144, y: 368, colIndex: 0, rowIndex: 2 },
  },
  {
    id: 'chip-p5',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'frag-notes',
    constellation: { x: 870, y: 178, rot: -5 },
    docked: { x: 256, y: 368, colIndex: 0, rowIndex: 2 },
  },
  {
    id: 'chip-p6',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'frag-logo',
    constellation: { x: 260, y: 360, rot: 5 },
    docked: { x: 144, y: 404, colIndex: 0, rowIndex: 3 },
  },
  {
    id: 'chip-p7',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'frag-map',
    constellation: { x: 575, y: 380, rot: -3 },
    docked: { x: 256, y: 404, colIndex: 0, rowIndex: 3 },
  },

  // 8 OFFERS CHIPS (Square lead)
  {
    id: 'chip-o0',
    type: 'offers',
    leadShape: 'square',
    fragId: 'frag-pricing',
    constellation: { x: 520, y: 18, rot: -2 },
    docked: { x: 536, y: 296, colIndex: 1, rowIndex: 0 },
  },
  {
    id: 'chip-o1',
    type: 'offers',
    leadShape: 'square',
    fragId: 'frag-pricing',
    constellation: { x: 635, y: 20, rot: 3 },
    docked: { x: 648, y: 296, colIndex: 1, rowIndex: 0 },
  },
  {
    id: 'chip-o2',
    type: 'offers',
    leadShape: 'square',
    fragId: 'frag-email',
    constellation: { x: 780, y: 26, rot: 6 },
    docked: { x: 536, y: 332, colIndex: 1, rowIndex: 1 },
  },
  {
    id: 'chip-o3',
    type: 'offers',
    leadShape: 'square',
    fragId: 'frag-social',
    constellation: { x: 1080, y: 22, rot: -3 },
    docked: { x: 648, y: 332, colIndex: 1, rowIndex: 1 },
  },
  {
    id: 'chip-o4',
    type: 'offers',
    leadShape: 'square',
    fragId: 'frag-brochure',
    constellation: { x: 160, y: 190, rot: -4 },
    docked: { x: 536, y: 368, colIndex: 1, rowIndex: 2 },
  },
  {
    id: 'chip-o5',
    type: 'offers',
    leadShape: 'square',
    fragId: 'frag-sheet',
    constellation: { x: 220, y: 202, rot: 2 },
    docked: { x: 648, y: 368, colIndex: 1, rowIndex: 2 },
  },
  {
    id: 'chip-o6',
    type: 'offers',
    leadShape: 'square',
    fragId: 'frag-review',
    constellation: { x: 1105, y: 178, rot: 4 },
    docked: { x: 536, y: 404, colIndex: 1, rowIndex: 3 },
  },
  {
    id: 'chip-o7',
    type: 'offers',
    leadShape: 'square',
    fragId: 'frag-calendar',
    constellation: { x: 55, y: 310, rot: -6 },
    docked: { x: 648, y: 404, colIndex: 1, rowIndex: 3 },
  },

  // 8 ICPS CHIPS (Diamond lead: 6 criteria + 2 skip)
  {
    id: 'chip-i0',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 0, // Person / Role
    fragId: 'frag-social',
    constellation: { x: 975, y: 22, rot: -4 },
    docked: { x: 928, y: 296, colIndex: 2, rowIndex: 0 },
  },
  {
    id: 'chip-i1',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 1, // Building / Industry
    fragId: 'frag-sheet',
    constellation: { x: 320, y: 202, rot: 5 },
    docked: { x: 1040, y: 296, colIndex: 2, rowIndex: 0 },
  },
  {
    id: 'chip-i2',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 2, // Size bars / Company Size
    fragId: 'frag-review',
    constellation: { x: 1000, y: 178, rot: -3 },
    docked: { x: 928, y: 332, colIndex: 2, rowIndex: 1 },
  },
  {
    id: 'chip-i3',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 3, // Globe Pin / Geography
    fragId: 'frag-map',
    constellation: { x: 470, y: 380, rot: 6 },
    docked: { x: 1040, y: 332, colIndex: 2, rowIndex: 1 },
  },
  {
    id: 'chip-i4',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 4, // Bolt / Pain Points
    fragId: 'frag-org',
    constellation: { x: 760, y: 315, rot: -5 },
    docked: { x: 928, y: 368, colIndex: 2, rowIndex: 2 },
  },
  {
    id: 'chip-i5',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 5, // Stop Circle / Disqualifier
    fragId: 'frag-org',
    constellation: { x: 875, y: 315, rot: 3 },
    docked: { x: 1040, y: 368, colIndex: 2, rowIndex: 2 },
  },
  {
    id: 'chip-i6',
    type: 'icps',
    leadShape: 'diamond',
    isSkip: true, // Skip 1 (dash)
    fragId: 'frag-call',
    constellation: { x: 980, y: 310, rot: -4 },
    docked: { x: 928, y: 404, colIndex: 2, rowIndex: 3 },
  },
  {
    id: 'chip-i7',
    type: 'icps',
    leadShape: 'diamond',
    isSkip: true, // Skip 2 (dash)
    fragId: 'frag-call',
    constellation: { x: 1095, y: 310, rot: 4 },
    docked: { x: 1040, y: 404, colIndex: 2, rowIndex: 3 },
  },
];

/* Act 2 Columns: profile, offers, icps */
export const LANDSCAPE_COLUMNS = [
  { id: 'col-profile', title: 'profile' as const, x: 68, y: 124, w: 360, h: 332 },
  { id: 'col-offers', title: 'offers' as const, x: 460, y: 124, w: 360, h: 332 },
  { id: 'col-icps', title: 'icps' as const, x: 852, y: 124, w: 360, h: 332 },
];

/* ICP Spokes: from ICP ring center (col 2 + persona card center) to criteria chips */
export const ICP_RING_CENTER_LANDSCAPE = {
  x: 852 + 360 - 70, // inside persona card on the right
  y: 124 + 20 + 24 + 14 + 50, // inside persona card
};

/* Act 3 Book & Stage Tiles */
export const BOOK_LANDSCAPE = {
  cx: 840,
  cy: 280,
  w: 220, // closed width
  openW: 440,
  h: 240,
  bookmark: { x: 840 - 20, y: 160, w: 14, h: 48 },
  tabs: [
    { title: 'profile' as const, lead: 'circle' as const, y: 205 },
    { title: 'offers' as const, lead: 'square' as const, y: 245 },
    { title: 'icps' as const, lead: 'diamond' as const, y: 285 },
  ],
};



/* ==========================================================================
   PORTRAIT (720 x 900) - For Mobile / Viewports < 768px
   ========================================================================== */

export const PORTRAIT_FRAGMENTS: FragmentDef[] = [
  {
    id: 'p-frag-website',
    kind: 'website',
    x: 52,
    y: 55,
    w: 160,
    h: 100,
    scale: 1.0,
    rot: -4,
    hitProgress: 0.13,
    sourceAnchor: { x: 80, y: 15 },
    chipIds: ['p-chip-p0', 'p-chip-p1'],
  },
  {
    id: 'p-frag-about',
    kind: 'about',
    x: 270,
    y: 65,
    w: 150,
    h: 90,
    scale: 0.8,
    rot: 5,
    hitProgress: 0.14,
    sourceAnchor: { x: 75, y: 15 },
    chipIds: ['p-chip-p2'],
  },
  {
    id: 'p-frag-pricing',
    kind: 'pricing',
    x: 480,
    y: 52,
    w: 175,
    h: 95,
    scale: 1.15,
    rot: -5,
    hitProgress: 0.14,
    sourceAnchor: { x: 85, y: 18 },
    chipIds: ['p-chip-o0', 'p-chip-o1'],
  },
  {
    id: 'p-frag-email',
    kind: 'email',
    x: 55,
    y: 205,
    w: 150,
    h: 85,
    scale: 0.8,
    rot: 6,
    hitProgress: 0.18,
    sourceAnchor: { x: 75, y: 15 },
    chipIds: ['p-chip-o2'],
  },
  {
    id: 'p-frag-social',
    kind: 'social',
    x: 275,
    y: 200,
    w: 140,
    h: 90,
    scale: 1.0,
    rot: -3,
    hitProgress: 0.19,
    sourceAnchor: { x: 70, y: 15 },
    chipIds: ['p-chip-i0', 'p-chip-p3'],
  },
  {
    id: 'p-frag-sheet',
    kind: 'sheet',
    x: 485,
    y: 195,
    w: 165,
    h: 95,
    scale: 1.15,
    rot: 4,
    hitProgress: 0.20,
    sourceAnchor: { x: 80, y: 15 },
    chipIds: ['p-chip-i1', 'p-chip-o3'],
  },
  {
    id: 'p-frag-review',
    kind: 'review',
    x: 52,
    y: 350,
    w: 150,
    h: 80,
    scale: 1.0,
    rot: 4,
    hitProgress: 0.25,
    sourceAnchor: { x: 75, y: 15 },
    chipIds: ['p-chip-i2', 'p-chip-o4'],
  },
  {
    id: 'p-frag-map',
    kind: 'map',
    x: 270,
    y: 345,
    w: 140,
    h: 90,
    scale: 1.0,
    rot: -6,
    hitProgress: 0.26,
    sourceAnchor: { x: 70, y: 15 },
    chipIds: ['p-chip-i3', 'p-chip-p4'],
  },
  {
    id: 'p-frag-org',
    kind: 'org',
    x: 480,
    y: 340,
    w: 165,
    h: 95,
    scale: 1.15,
    rot: 3,
    hitProgress: 0.26,
    sourceAnchor: { x: 80, y: 15 },
    chipIds: ['p-chip-i4'],
  },
];

export const PORTRAIT_CHIPS: ChipDef[] = [
  // 5 Profile
  {
    id: 'p-chip-p0',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'p-frag-website',
    constellation: { x: 50, y: 25, rot: -3 },
    docked: { x: 220, y: 250, colIndex: 0, rowIndex: 0 },
  },
  {
    id: 'p-chip-p1',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'p-frag-website',
    constellation: { x: 145, y: 25, rot: 2 },
    docked: { x: 305, y: 250, colIndex: 0, rowIndex: 0 },
  },
  {
    id: 'p-chip-p2',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'p-frag-about',
    constellation: { x: 275, y: 32, rot: 4 },
    docked: { x: 390, y: 250, colIndex: 0, rowIndex: 0 },
  },
  {
    id: 'p-chip-p3',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'p-frag-social',
    constellation: { x: 335, y: 170, rot: -3 },
    docked: { x: 475, y: 250, colIndex: 0, rowIndex: 0 },
  },
  {
    id: 'p-chip-p4',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'p-frag-map',
    constellation: { x: 330, y: 315, rot: 4 },
    docked: { x: 560, y: 250, colIndex: 0, rowIndex: 0 },
  },

  // 5 Offers
  {
    id: 'p-chip-o0',
    type: 'offers',
    leadShape: 'square',
    fragId: 'p-frag-pricing',
    constellation: { x: 475, y: 22, rot: -2 },
    docked: { x: 220, y: 410, colIndex: 1, rowIndex: 0 },
  },
  {
    id: 'p-chip-o1',
    type: 'offers',
    leadShape: 'square',
    fragId: 'p-frag-pricing',
    constellation: { x: 575, y: 22, rot: 3 },
    docked: { x: 305, y: 410, colIndex: 1, rowIndex: 0 },
  },
  {
    id: 'p-chip-o2',
    type: 'offers',
    leadShape: 'square',
    fragId: 'p-frag-email',
    constellation: { x: 55, y: 175, rot: 5 },
    docked: { x: 390, y: 410, colIndex: 1, rowIndex: 0 },
  },
  {
    id: 'p-chip-o3',
    type: 'offers',
    leadShape: 'square',
    fragId: 'p-frag-sheet',
    constellation: { x: 570, y: 165, rot: -4 },
    docked: { x: 475, y: 410, colIndex: 1, rowIndex: 0 },
  },
  {
    id: 'p-chip-o4',
    type: 'offers',
    leadShape: 'square',
    fragId: 'p-frag-review',
    constellation: { x: 135, y: 320, rot: 3 },
    docked: { x: 560, y: 410, colIndex: 1, rowIndex: 0 },
  },

  // 5 ICPs (4 criteria + 1 skip)
  {
    id: 'p-chip-i0',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 0,
    fragId: 'p-frag-social',
    constellation: { x: 260, y: 170, rot: -3 },
    docked: { x: 220, y: 570, colIndex: 2, rowIndex: 0 },
  },
  {
    id: 'p-chip-i1',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 1,
    fragId: 'p-frag-sheet',
    constellation: { x: 475, y: 165, rot: 4 },
    docked: { x: 305, y: 570, colIndex: 2, rowIndex: 0 },
  },
  {
    id: 'p-chip-i2',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 2,
    fragId: 'p-frag-review',
    constellation: { x: 50, y: 320, rot: -4 },
    docked: { x: 390, y: 570, colIndex: 2, rowIndex: 0 },
  },
  {
    id: 'p-chip-i3',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 3,
    fragId: 'p-frag-map',
    constellation: { x: 250, y: 315, rot: 5 },
    docked: { x: 475, y: 570, colIndex: 2, rowIndex: 0 },
  },
  {
    id: 'p-chip-i4',
    type: 'icps',
    leadShape: 'diamond',
    isSkip: true,
    fragId: 'p-frag-org',
    constellation: { x: 475, y: 310, rot: -3 },
    docked: { x: 560, y: 570, colIndex: 2, rowIndex: 0 },
  },
];

export const PORTRAIT_BANDS = [
  { id: 'band-profile', title: 'profile' as const, x: 40, y: 185, w: 640, h: 140 },
  { id: 'band-offers', title: 'offers' as const, x: 40, y: 345, w: 640, h: 140 },
  { id: 'band-icps', title: 'icps' as const, x: 40, y: 505, w: 640, h: 140 },
];

export const BOOK_PORTRAIT = {
  cx: 360,
  cy: 480,
  w: 180,
  openW: 360,
  h: 210,
  scale: 0.8,
  bookmark: { x: 360 - 15, y: 480 - 105, w: 12, h: 42 },
  tabs: [
    { title: 'profile' as const, lead: 'circle' as const, y: 480 - 65 },
    { title: 'offers' as const, lead: 'square' as const, y: 480 - 30 },
    { title: 'icps' as const, lead: 'diamond' as const, y: 480 + 5 },
  ],
};


