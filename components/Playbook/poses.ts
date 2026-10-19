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
  // Top band (y: 35 - 160)
  {
    id: 'frag-website',
    kind: 'website',
    x: 520,
    y: 40,
    w: 190,
    h: 110,
    scale: 1.0,
    rot: -4,
    hitProgress: 0.13,
    sourceAnchor: { x: 95, y: 15 },
    chipIds: ['chip-p0', 'chip-p1'],
  },
  {
    id: 'frag-about',
    kind: 'about',
    x: 720,
    y: 45,
    w: 180,
    h: 105,
    scale: 0.85,
    rot: 4,
    hitProgress: 0.14,
    sourceAnchor: { x: 90, y: 18 },
    chipIds: ['chip-p2', 'chip-p3'],
  },
  {
    id: 'frag-pricing',
    kind: 'pricing',
    x: 915,
    y: 38,
    w: 195,
    h: 110,
    scale: 1.0,
    rot: -4,
    hitProgress: 0.14,
    sourceAnchor: { x: 95, y: 20 },
    chipIds: ['chip-o0', 'chip-o1'],
  },
  {
    id: 'frag-email',
    kind: 'email',
    x: 1085,
    y: 42,
    w: 160,
    h: 95,
    scale: 0.8,
    rot: 5,
    hitProgress: 0.15,
    sourceAnchor: { x: 80, y: 18 },
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

  // Middle band (y: 170 - 310)
  {
    id: 'frag-brochure',
    kind: 'brochure',
    x: 540,
    y: 175,
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
    x: 710,
    y: 180,
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
    x: 540,
    y: 360,
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
    x: 720,
    y: 375,
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
    constellation: { x: 505, y: 14, rot: -3 },
    docked: { x: 165, y: 296, colIndex: 0, rowIndex: 0 },
  },
  {
    id: 'chip-p1',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'frag-website',
    constellation: { x: 605, y: 14, rot: 2 },
    docked: { x: 277, y: 296, colIndex: 0, rowIndex: 0 },
  },
  {
    id: 'chip-p2',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'frag-about',
    constellation: { x: 710, y: 18, rot: -4 },
    docked: { x: 165, y: 332, colIndex: 0, rowIndex: 1 },
  },
  {
    id: 'chip-p3',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'frag-about',
    constellation: { x: 805, y: 18, rot: 4 },
    docked: { x: 277, y: 332, colIndex: 0, rowIndex: 1 },
  },
  {
    id: 'chip-p4',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'frag-brochure',
    constellation: { x: 520, y: 145, rot: 3 },
    docked: { x: 165, y: 368, colIndex: 0, rowIndex: 2 },
  },
  {
    id: 'chip-p5',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'frag-notes',
    constellation: { x: 870, y: 178, rot: -5 },
    docked: { x: 277, y: 368, colIndex: 0, rowIndex: 2 },
  },
  {
    id: 'chip-p6',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'frag-logo',
    constellation: { x: 710, y: 340, rot: 5 },
    docked: { x: 165, y: 404, colIndex: 0, rowIndex: 3 },
  },
  {
    id: 'chip-p7',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'frag-map',
    constellation: { x: 575, y: 380, rot: -3 },
    docked: { x: 277, y: 404, colIndex: 0, rowIndex: 3 },
  },

  // 8 OFFERS CHIPS (Square lead)
  {
    id: 'chip-o0',
    type: 'offers',
    leadShape: 'square',
    fragId: 'frag-pricing',
    constellation: { x: 900, y: 14, rot: -2 },
    docked: { x: 536, y: 296, colIndex: 1, rowIndex: 0 },
  },
  {
    id: 'chip-o1',
    type: 'offers',
    leadShape: 'square',
    fragId: 'frag-pricing',
    constellation: { x: 1005, y: 14, rot: 3 },
    docked: { x: 648, y: 296, colIndex: 1, rowIndex: 0 },
  },
  {
    id: 'chip-o2',
    type: 'offers',
    leadShape: 'square',
    fragId: 'frag-email',
    constellation: { x: 1095, y: 16, rot: 6 },
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
    constellation: { x: 625, y: 145, rot: -4 },
    docked: { x: 536, y: 368, colIndex: 1, rowIndex: 2 },
  },
  {
    id: 'chip-o5',
    type: 'offers',
    leadShape: 'square',
    fragId: 'frag-sheet',
    constellation: { x: 695, y: 150, rot: 2 },
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
    constellation: { x: 530, y: 330, rot: -6 },
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
    docked: { x: 907, y: 296, colIndex: 2, rowIndex: 0 },
  },
  {
    id: 'chip-i1',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 1, // Building / Industry
    fragId: 'frag-sheet',
    constellation: { x: 795, y: 150, rot: 5 },
    docked: { x: 1019, y: 296, colIndex: 2, rowIndex: 0 },
  },
  {
    id: 'chip-i2',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 2, // Size bars / Company Size
    fragId: 'frag-review',
    constellation: { x: 1000, y: 178, rot: -3 },
    docked: { x: 907, y: 332, colIndex: 2, rowIndex: 1 },
  },
  {
    id: 'chip-i3',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 3, // Globe Pin / Geography
    fragId: 'frag-map',
    constellation: { x: 470, y: 380, rot: 6 },
    docked: { x: 1019, y: 332, colIndex: 2, rowIndex: 1 },
  },
  {
    id: 'chip-i4',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 4, // Bolt / Pain Points
    fragId: 'frag-org',
    constellation: { x: 760, y: 315, rot: -5 },
    docked: { x: 907, y: 368, colIndex: 2, rowIndex: 2 },
  },
  {
    id: 'chip-i5',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 5, // Stop Circle / Disqualifier
    fragId: 'frag-org',
    constellation: { x: 875, y: 315, rot: 3 },
    docked: { x: 1019, y: 368, colIndex: 2, rowIndex: 2 },
  },
  {
    id: 'chip-i6',
    type: 'icps',
    leadShape: 'diamond',
    isSkip: true, // Skip 1 (dash)
    fragId: 'frag-call',
    constellation: { x: 980, y: 310, rot: -4 },
    docked: { x: 907, y: 404, colIndex: 2, rowIndex: 3 },
  },
  {
    id: 'chip-i7',
    type: 'icps',
    leadShape: 'diamond',
    isSkip: true, // Skip 2 (dash)
    fragId: 'frag-call',
    constellation: { x: 1095, y: 310, rot: 4 },
    docked: { x: 1019, y: 404, colIndex: 2, rowIndex: 3 },
  },
];

/* Act 2 Columns: profile, offers, icps (generous 348px columns with 95px safe margins) */
export const LANDSCAPE_COLUMNS = [
  { id: 'col-profile', title: 'profile' as const, x: 95, y: 135, w: 348, h: 340 },
  { id: 'col-offers', title: 'offers' as const, x: 466, y: 135, w: 348, h: 340 },
  { id: 'col-icps', title: 'icps' as const, x: 837, y: 135, w: 348, h: 340 },
];

/* ICP Spokes: from ICP ring center (col 2 + persona card center) to criteria chips */
export const ICP_RING_CENTER_LANDSCAPE = {
  x: 837 + 348 - 55, // 1130
  y: 135 + 20 + 24 + 14 + 50, // 243
};

/* Act 3 Book & Stage Tiles */
export const BOOK_LANDSCAPE = {
  cx: 820,
  cy: 300,
  w: 220, // closed width
  openW: 440,
  h: 240,
  bookmark: { x: 820 - 20, y: 180, w: 14, h: 48 },
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
  // Top band (y: 300 - 410)
  {
    id: 'p-frag-website',
    kind: 'website',
    x: 52,
    y: 310,
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
    y: 315,
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
    y: 305,
    w: 175,
    h: 95,
    scale: 1.15,
    rot: -5,
    hitProgress: 0.14,
    sourceAnchor: { x: 85, y: 18 },
    chipIds: ['p-chip-o0', 'p-chip-o1'],
  },

  // Middle band (y: 450 - 560)
  {
    id: 'p-frag-email',
    kind: 'email',
    x: 55,
    y: 465,
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
    y: 460,
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
    y: 455,
    w: 165,
    h: 95,
    scale: 1.15,
    rot: 4,
    hitProgress: 0.20,
    sourceAnchor: { x: 80, y: 15 },
    chipIds: ['p-chip-i1', 'p-chip-o3'],
  },

  // Bottom band (y: 600 - 710)
  {
    id: 'p-frag-review',
    kind: 'review',
    x: 52,
    y: 615,
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
    y: 610,
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
    y: 605,
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
    constellation: { x: 50, y: 275, rot: -3 },
    docked: { x: 220, y: 370, colIndex: 0, rowIndex: 0 },
  },
  {
    id: 'p-chip-p1',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'p-frag-website',
    constellation: { x: 145, y: 275, rot: 2 },
    docked: { x: 305, y: 370, colIndex: 0, rowIndex: 0 },
  },
  {
    id: 'p-chip-p2',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'p-frag-about',
    constellation: { x: 275, y: 282, rot: 4 },
    docked: { x: 390, y: 370, colIndex: 0, rowIndex: 0 },
  },
  {
    id: 'p-chip-p3',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'p-frag-social',
    constellation: { x: 335, y: 430, rot: -3 },
    docked: { x: 475, y: 370, colIndex: 0, rowIndex: 0 },
  },
  {
    id: 'p-chip-p4',
    type: 'profile',
    leadShape: 'circle',
    fragId: 'p-frag-map',
    constellation: { x: 330, y: 575, rot: 4 },
    docked: { x: 560, y: 370, colIndex: 0, rowIndex: 0 },
  },

  // 5 Offers
  {
    id: 'p-chip-o0',
    type: 'offers',
    leadShape: 'square',
    fragId: 'p-frag-pricing',
    constellation: { x: 475, y: 272, rot: -2 },
    docked: { x: 220, y: 515, colIndex: 1, rowIndex: 0 },
  },
  {
    id: 'p-chip-o1',
    type: 'offers',
    leadShape: 'square',
    fragId: 'p-frag-pricing',
    constellation: { x: 575, y: 272, rot: 3 },
    docked: { x: 305, y: 515, colIndex: 1, rowIndex: 0 },
  },
  {
    id: 'p-chip-o2',
    type: 'offers',
    leadShape: 'square',
    fragId: 'p-frag-email',
    constellation: { x: 55, y: 435, rot: 5 },
    docked: { x: 390, y: 515, colIndex: 1, rowIndex: 0 },
  },
  {
    id: 'p-chip-o3',
    type: 'offers',
    leadShape: 'square',
    fragId: 'p-frag-sheet',
    constellation: { x: 570, y: 425, rot: -4 },
    docked: { x: 475, y: 515, colIndex: 1, rowIndex: 0 },
  },
  {
    id: 'p-chip-o4',
    type: 'offers',
    leadShape: 'square',
    fragId: 'p-frag-review',
    constellation: { x: 135, y: 580, rot: 3 },
    docked: { x: 560, y: 515, colIndex: 1, rowIndex: 0 },
  },

  // 5 ICPs (4 criteria + 1 skip)
  {
    id: 'p-chip-i0',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 0,
    fragId: 'p-frag-social',
    constellation: { x: 260, y: 430, rot: -3 },
    docked: { x: 220, y: 660, colIndex: 2, rowIndex: 0 },
  },
  {
    id: 'p-chip-i1',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 1,
    fragId: 'p-frag-sheet',
    constellation: { x: 475, y: 425, rot: 4 },
    docked: { x: 305, y: 660, colIndex: 2, rowIndex: 0 },
  },
  {
    id: 'p-chip-i2',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 2,
    fragId: 'p-frag-review',
    constellation: { x: 50, y: 580, rot: -4 },
    docked: { x: 390, y: 660, colIndex: 2, rowIndex: 0 },
  },
  {
    id: 'p-chip-i3',
    type: 'icps',
    leadShape: 'diamond',
    criteriaIndex: 3,
    fragId: 'p-frag-map',
    constellation: { x: 250, y: 575, rot: 5 },
    docked: { x: 475, y: 660, colIndex: 2, rowIndex: 0 },
  },
  {
    id: 'p-chip-i4',
    type: 'icps',
    leadShape: 'diamond',
    isSkip: true,
    fragId: 'p-frag-org',
    constellation: { x: 475, y: 570, rot: -3 },
    docked: { x: 560, y: 660, colIndex: 2, rowIndex: 0 },
  },
];

export const PORTRAIT_BANDS = [
  { id: 'band-profile', title: 'profile' as const, x: 40, y: 300, w: 640, h: 125 },
  { id: 'band-offers', title: 'offers' as const, x: 40, y: 445, w: 640, h: 125 },
  { id: 'band-icps', title: 'icps' as const, x: 40, y: 590, w: 640, h: 125 },
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



/* The playbook's own three groups, derived from the chips the story actually
   places, so the dashboard's Configure stage reads the same source material
   the playbook does instead of restating it. Order follows the book tabs. */
export const PLAYBOOK_COLUMNS = (
  ['profile', 'offers', 'icps'] as const
).map((id) => {
  const kinds = new Set<string>();
  for (const chip of LANDSCAPE_CHIPS) {
    if (chip.type !== id) continue;
    const frag = LANDSCAPE_FRAGMENTS.find((f) => f.id === chip.fragId);
    if (frag) kinds.add(frag.kind);
  }
  return { id, sources: [...kinds] };
});
