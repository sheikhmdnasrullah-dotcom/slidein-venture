'use client';

/**
 * SLIDE 02 — TWO SYSTEMS. ONE LOOP.
 * ---------------------------------------------------------------------------
 * The deck's thesis diagram, read left to right:
 *
 *   SYS-01 CONTENT    You Record Once → Content Production → Multi-Platform Presence
 *   SYS-02 OUTREACH   Learn Your Client Once → Manual Outreach → Qualified Conversations
 *
 * Both pipelines converge through a glowing junction into one elevated
 * outcome module. White canvas, blueprint geometry, Bézier routing,
 * flowing particles. Orange only guides attention.
 *
 * WHAT WAS TAKEN OUT, AND WHY
 * The centred orange eyebrow ("THE COMPLETE FRAMEWORK") is gone: the top-left
 * SYS labels already say it, and the title now lives inside the canvas, set in
 * the display serif and left-aligned to the first track card. That reclaimed
 * roughly 200px of vertical space, all of which went back into the diagram —
 * the cards are 112px tall instead of 78, and the type inside them grew with
 * them.
 *
 * Three floating serif asides also went: two explaining what each track does,
 * one restating "two systems, one outcome" beside the junction. The diagram
 * already says all three. The two track asides survive as hover states on the
 * SYS labels, which is where a reader goes looking for them anyway.
 *
 * THE MOTION IS THE ARGUMENT
 * The dot from slide 01 arrives at the far left of the top track, runs through
 * all three content nodes, the outreach track builds beneath it, both curve
 * into the junction, and the outcome card fills last. 1.4s end to end — long
 * for this deck, and worth it: it is the only slide whose animation *is* the
 * pitch. See TIMELINE below; every delay in this file is keyed to it.
 */

import { motion } from 'framer-motion';

const ORANGE = 'var(--accent-vivid)';
const INK = 'var(--on-surface)';
const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------- geometry -------------------------------- */

const VB = { w: 1240, h: 620 };

const NODE_W = 252;
const NODE_H = 120; // was 78 — the reclaimed title space went here
const COLS = [50, 358, 666]; // x of each pipeline column
const ROW_TOP = 196; // card top, content system
const ROW_BOT = 436; // card top, outreach system
const TOP_CY = ROW_TOP + NODE_H / 2; // 256
const BOT_CY = ROW_BOT + NODE_H / 2; // 496

const TRACK_END = COLS[2] + NODE_W; // 918 — right edge of the last track card

const HERO = { x: 990, y: 276, w: 210, h: 200 };
const HERO_CY = HERO.y + HERO.h / 2; // 376 — the midpoint of the two tracks
const JUNCTION = { x: TRACK_END + 42, y: HERO_CY }; // 960

const TITLE_X = COLS[0]; // the title aligns to the first track card, not the canvas
const TITLE_BASELINE = 76;

/* ------------------------------- timeline --------------------------------
   One clock for the whole slide. The thread dot leads, each node lands as the
   dot reaches it, the outreach track follows, then the merge, then the card.
   Nothing here is a free number — moving one means moving its neighbours. */
const T = {
  title: 0,
  chrome: 0.1,
  thread: 0.72, // dot's travel time across the top track
  topNode: (i: number) => 0.02 + i * 0.22, // 0.02 · 0.24 · 0.46
  topLink: (i: number) => 0.16 + i * 0.22, // 0.16 · 0.38
  botNode: (i: number) => 0.62 + i * 0.12, // 0.62 · 0.74 · 0.86
  botLink: (i: number) => 0.7 + i * 0.12, // 0.70 · 0.82
  mergeTop: 0.96,
  mergeBot: 1.02,
  junction: 1.1,
  heroLink: 1.16,
  hero: 1.2, // + 0.2s = 1.40s, the whole sequence
  particles: 1.5, // the ambient loop only starts once the argument has landed
} as const;

/* `title` is an array because SVG <text> does not wrap and the card type is now
   16px, not 12.5. Three of the six titles are too long for one line at that
   size, so the break is authored rather than left to a truncation the browser
   would make for us. One or two lines; anything needing three is bad copy. */
type NodeDef = {
  id: string;
  title: string[];
  desc: string;
  icon: 'video' | 'layers' | 'broadcast' | 'target' | 'send' | 'inbox' | 'script' | 'tell';
};

/* Columns 02 and 03. Column 01 is the split card below, not a NodeDef. */
const TOP_NODES: NodeDef[] = [
  { id: 'production', title: ['Content Production'], desc: 'Edited, clipped, written for you', icon: 'layers' },
  { id: 'presence', title: ['Multi-Platform', 'Presence'], desc: 'Published everywhere, weekly', icon: 'broadcast' },
];

const BOT_NODES: NodeDef[] = [
  { id: 'outreach', title: ['Manual Outreach'], desc: 'Researched and written by hand', icon: 'send' },
  { id: 'convos', title: ['Qualified', 'Conversations'], desc: 'Real replies, sorted for you', icon: 'inbox' },
];

/* ── The 01 INPUT cell, on both tracks ──────────────────────────────────────
   Not a fifth column: a fifth column would break the four-across symmetry
   between the two tracks, and that symmetry is what holds the diagram
   together. Instead the input cell splits into two stacked rows inside one
   card — who does the thinking on top, the client's one small job underneath.

   Each row carries a mono owner tag. The client's row is the only orange one
   on the left half of the canvas, so the eye finds it immediately and reads
   the point without being told: of everything in this column, one strip is
   yours. It is also the row the connector leaves from — the recording, and
   the one briefing, are what actually move downstream. */
type SplitRow = { owner: string; title: string; icon: NodeDef['icon']; mine?: boolean };
type SplitDef = { id: string; rows: [SplitRow, SplitRow] };

const TOP_INPUT: SplitDef = {
  id: 'content-input',
  rows: [
    { owner: 'SlideIn', title: 'Ideation & Script', icon: 'script' },
    { owner: 'You', title: 'You Record', icon: 'video', mine: true },
  ],
};

const BOT_INPUT: SplitDef = {
  id: 'outreach-input',
  rows: [
    { owner: 'SlideIn', title: 'Ideal Client Research', icon: 'target' },
    { owner: 'You', title: 'You Tell Us Once', icon: 'tell', mine: true },
  ],
};

const SECTIONS = [
  { label: '01 · Input', x: COLS[0] },
  { label: '02 · System', x: COLS[1] },
  { label: '03 · Output', x: COLS[2] },
  { label: '04 · Outcome', x: HERO.x },
];

/* connector paths — control offsets stay inside the 56px column gap so the
   curve segments never fold back on themselves */
const link = (col: number, cy: number) =>
  `M ${COLS[col] + NODE_W} ${cy} C ${COLS[col] + NODE_W + 24} ${cy}, ${COLS[col + 1] - 24} ${cy}, ${COLS[col + 1]} ${cy}`;

/* Rows of the split input card, measured from the card's top edge. */
const ROW_H = NODE_H / 2; // 60
const SPLIT_DROP = ROW_H / 2; // 30 — how far row 2's centre sits below the track line

/* The input card's connector leaves from row 2 only, so it starts 30px low and
   climbs to the track line. The lift is the diagram saying which of the two
   rows is the thing that moves. */
const splitLink = (cy: number) => {
  const from = cy + SPLIT_DROP;
  return `M ${COLS[0] + NODE_W} ${from} C ${COLS[0] + NODE_W + 26} ${from}, ${COLS[1] - 26} ${cy}, ${COLS[1]} ${cy}`;
};

const MERGE_TOP = `M ${TRACK_END} ${TOP_CY} C ${TRACK_END + 52} ${TOP_CY}, ${JUNCTION.x} ${TOP_CY + 60}, ${JUNCTION.x} ${HERO_CY - 34} L ${JUNCTION.x} ${HERO_CY}`;
const MERGE_BOT = `M ${TRACK_END} ${BOT_CY} C ${TRACK_END + 52} ${BOT_CY}, ${JUNCTION.x} ${BOT_CY - 60}, ${JUNCTION.x} ${HERO_CY + 34} L ${JUNCTION.x} ${HERO_CY}`;

/* The thread's run: in from outside the left edge, straight through all three
   content cards. It enters where slide 01's dot left, at the same y as the
   track it is about to describe. */
const THREAD = `M 14 ${TOP_CY} L ${TRACK_END} ${TOP_CY}`;

/* ------------------------------- icon set -------------------------------- */

function Glyph({ kind }: { kind: NodeDef['icon'] | 'check' }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  switch (kind) {
    case 'video':
      return (
        <g {...s}>
          <rect x={2.5} y={6} width={13.5} height={12} rx={2.5} />
          <path d="m16 10.5 5.5-3v9l-5.5-3" />
        </g>
      );
    case 'layers':
      return (
        <g {...s}>
          <path d="m12 3 9 5-9 5-9-5z" />
          <path d="m3 13 9 5 9-5" />
          <path d="m3 17.5 9 5 9-5" opacity={0.45} />
        </g>
      );
    case 'broadcast':
      return (
        <g {...s}>
          <circle cx={12} cy={12} r={2.2} />
          <path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9" />
          <path d="M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 4.6a10.5 10.5 0 0 1 0 14.8" opacity={0.45} />
        </g>
      );
    case 'target':
      return (
        <g {...s}>
          <circle cx={12} cy={12} r={9} />
          <circle cx={12} cy={12} r={5} />
          <circle cx={12} cy={12} r={1.2} fill="currentColor" stroke="none" />
        </g>
      );
    case 'send':
      return (
        <g {...s}>
          <path d="M21 3 10.5 13.5" />
          <path d="M21 3 14.2 21l-3.7-7.5L3 9.8z" />
        </g>
      );
    case 'script':
      return (
        <g {...s}>
          <path d="M6.5 3h7.5L19 8v12.5A1.5 1.5 0 0 1 17.5 22h-11A1.5 1.5 0 0 1 5 20.5v-16A1.5 1.5 0 0 1 6.5 3z" />
          <path d="M13.8 3v5h5" opacity={0.5} />
          <path d="M8.6 13h6.8M8.6 17h4.4" />
        </g>
      );
    case 'tell':
      return (
        <g {...s}>
          <path d="M21 12.4a7.5 7.5 0 0 1-7.5 7.5H9.2L4.5 23v-4.7A7.5 7.5 0 0 1 10.5 4.9h3A7.5 7.5 0 0 1 21 12.4z" />
          <path d="M9.4 12.4h6.2" opacity={0.55} />
        </g>
      );
    case 'inbox':
      return (
        <g {...s}>
          <path d="M3 13.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4.5" />
          <path d="M3 13.5h5l1.6 2.5h4.8l1.6-2.5h5" />
          <path d="M6.5 13.5 8 5.5h8l1.5 8" opacity={0.6} />
        </g>
      );
    case 'check':
      return (
        <g {...s} strokeWidth={2}>
          <circle cx={12} cy={12} r={9.5} />
          <path d="m8 12.2 2.8 2.8L16.2 9.4" />
        </g>
      );
  }
}

/* --------------------------------- title ---------------------------------- */

/** The slide title, inside the canvas and left-aligned to the first track card
 *  so the diagram and the sentence share one left edge. */
function Title() {
  return (
    <motion.g
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: T.title }}
    >
      <text x={TITLE_X} y={TITLE_BASELINE} className="fw-title">
        Two systems. One loop.
      </text>
    </motion.g>
  );
}

/* --------------------------- blueprint chrome ----------------------------- */

/** A track's identifier, plus the aside that used to float over the diagram.
 *  The aside is a hover state now: available on demand, silent by default. */
function SysLabel({ y, id, note }: { y: number; id: string; note: string }) {
  return (
    <g className="fw-sys-group">
      {/* The hit area spans the label AND the space the aside appears in, so
          the note does not vanish the moment the pointer drifts toward it.
          fill="transparent" rather than "none" — "none" is not hit-testable. */}
      <rect x={COLS[0] - 8} y={y - 14} width={444} height={22} fill="transparent" />
      <text x={COLS[0]} y={y} className="fw-sys">{id}</text>
      <text x={COLS[0] + 182} y={y} className="fw-sys-note">{note}</text>
    </g>
  );
}

function Chrome() {
  return (
    <g aria-hidden>
      {Array.from({ length: 30 }, (_, i) => COLS[0] + i * 40).map((x, i) => (
        <line key={x} x1={x} y1={12} x2={x} y2={i % 5 === 0 ? 20 : 16} stroke={INK} strokeOpacity={0.08} strokeWidth={1} />
      ))}
      {[330, 638, JUNCTION.x].map((x) => (
        <line key={x} x1={x} y1={108} x2={x} y2={576} stroke={INK} strokeOpacity={0.04} strokeWidth={1} strokeDasharray="1 7" />
      ))}
      {/* system baselines — where the thread runs in from */}
      <line x1={26} y1={TOP_CY} x2={COLS[0] - 10} y2={TOP_CY} stroke={INK} strokeOpacity={0.14} strokeWidth={1} />
      <line x1={26} y1={BOT_CY} x2={COLS[0] - 10} y2={BOT_CY} stroke={INK} strokeOpacity={0.14} strokeWidth={1} />
      {/* construction circles behind hero */}
      <circle cx={HERO.x + HERO.w / 2} cy={HERO_CY} r={150} fill="none" stroke={ORANGE} strokeOpacity={0.06} strokeWidth={1} strokeDasharray="2 6" />
      <circle cx={HERO.x + HERO.w / 2} cy={HERO_CY} r={196} fill="none" stroke={INK} strokeOpacity={0.04} strokeWidth={1} />
      {/* corner crosshairs — two, not four. Four is a pattern; two is a detail. */}
      {[[1196, 40], [44, 584]].map(([x, y]) => (
        <g key={`${x}-${y}`} stroke={INK} strokeOpacity={0.14} strokeWidth={1}>
          <line x1={x - 5} y1={y} x2={x + 5} y2={y} />
          <line x1={x} y1={y - 5} x2={x} y2={y + 5} />
        </g>
      ))}
      {/* section labels */}
      {SECTIONS.map((sec) => (
        <g key={sec.label}>
          <line x1={sec.x + 1} y1={118} x2={sec.x + 1} y2={127} stroke={ORANGE} strokeOpacity={0.8} strokeWidth={2} strokeLinecap="round" />
          <text x={sec.x + 10} y={126} className="fw-section">{sec.label.toUpperCase()}</text>
        </g>
      ))}
      {/* system identifiers */}
      <SysLabel y={ROW_TOP - 16} id="SYS-01 · CONTENT" note="Builds trust before you ever reach out." />
      <SysLabel y={ROW_BOT - 16} id="SYS-02 · OUTREACH" note="Starts conversations while content compounds." />
    </g>
  );
}

/* ------------------------------- connectors ------------------------------- */

function Connectors() {
  const draws: { d: string; delay: number; hot?: boolean; w?: number; dur?: number }[] = [
    { d: splitLink(TOP_CY), delay: T.topLink(0), dur: 0.22 },
    { d: link(1, TOP_CY), delay: T.topLink(1), dur: 0.22 },
    { d: splitLink(BOT_CY), delay: T.botLink(0), dur: 0.22 },
    { d: link(1, BOT_CY), delay: T.botLink(1), dur: 0.22 },
    { d: MERGE_TOP, delay: T.mergeTop, hot: true, w: 1.6, dur: 0.24 },
    { d: MERGE_BOT, delay: T.mergeBot, hot: true, w: 1.6, dur: 0.24 },
    { d: `M ${JUNCTION.x} ${HERO_CY} L ${HERO.x} ${HERO_CY}`, delay: T.heroLink, hot: true, w: 1.8, dur: 0.16 },
  ];
  return (
    <g aria-hidden>
      {/* Soft glow underlay on the merge. Held back to the merge's own cue —
          it is a 6px orange stroke, and drawing it from frame 0 gave away the
          convergence a full second before the tracks got there. */}
      <motion.g
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: T.mergeTop }}
      >
        <path d={MERGE_TOP} fill="none" stroke={ORANGE} strokeOpacity={0.06} strokeWidth={6} />
        <path d={MERGE_BOT} fill="none" stroke={ORANGE} strokeOpacity={0.06} strokeWidth={6} />
      </motion.g>
      {draws.map((p, i) => (
        <motion.path
          key={i}
          d={p.d} fill="none"
          stroke={p.hot ? ORANGE : INK}
          strokeOpacity={p.hot ? 0.4 : 0.16}
          strokeWidth={p.w ?? 1.4}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: p.dur ?? 0.22, ease: 'easeOut', delay: p.delay }}
        />
      ))}
      {/* Joints. Column 0's exit joint rides 30px low with the split card's
          second row — it marks where the client's contribution enters. */}
      <g fill="var(--surface)" stroke={INK} strokeOpacity={0.28} strokeWidth={1}>
        {[TOP_CY, BOT_CY].map((cy) =>
          COLS.map((x, c) => (
            <g key={`${cy}-${c}`}>
              {c > 0 && <circle cx={x} cy={cy} r={2.4} />}
              <circle cx={x + NODE_W} cy={c === 0 ? cy + SPLIT_DROP : cy} r={2.4} />
            </g>
          ))
        )}
      </g>
      {/* glowing junction where the two systems merge */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        transition={{ duration: 0.2, ease: EASE, delay: T.junction }}
      >
        <circle cx={JUNCTION.x} cy={JUNCTION.y} r={13} fill="var(--surface)" stroke={ORANGE} strokeOpacity={0.4} strokeWidth={1.2} strokeDasharray="3 4" className="fw-spin" />
        <circle cx={JUNCTION.x} cy={JUNCTION.y} r={4.5} fill={ORANGE} className="fw-glow" />
      </motion.g>
      {/* flowing particles — the ambient loop, once the argument has landed */}
      <motion.g className="fw-particles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: T.particles, duration: 0.6 }}>
        {[
          { d: splitLink(TOP_CY), dur: 2.4, b: 0 },
          { d: link(1, TOP_CY), dur: 2.4, b: 0.7 },
          { d: splitLink(BOT_CY), dur: 2.6, b: 0.4 },
          { d: link(1, BOT_CY), dur: 2.6, b: 1.1 },
          { d: MERGE_TOP, dur: 2.2, b: 0.2 },
          { d: MERGE_BOT, dur: 2.2, b: 1.3 },
        ].map((p, i) => (
          <circle key={i} r={2.4} fill={ORANGE} className="fw-glow">
            <animateMotion dur={`${p.dur}s`} begin={`${p.b}s`} repeatCount="indefinite" path={p.d} />
          </circle>
        ))}
      </motion.g>
    </g>
  );
}

/* -------------------------------- the thread ------------------------------ */

/** Slide 01's dot, arriving. It enters from outside the left edge on the top
 *  track's baseline and runs the whole content pipeline in one pass, which is
 *  what hands the deck's spine over to this diagram. Drawn after the nodes so
 *  it rides over the cards rather than under them. */
function Thread() {
  return (
    <g className="fw-thread" aria-hidden>
      <circle r={4.5} fill={ORANGE} opacity={0} className="fw-glow">
        <animateMotion dur={`${T.thread}s`} begin="0s" fill="freeze" path={THREAD} />
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.1;0.82;1"
          dur={`${T.thread + 0.08}s`}
          begin="0s"
          fill="freeze"
        />
      </circle>
    </g>
  );
}

/* --------------------------------- nodes ---------------------------------- */

function SystemNode({ n, col, row, delay }: { n: NodeDef; col: number; row: 'top' | 'bot'; delay: number }) {
  const x = COLS[col];
  const y = row === 'top' ? ROW_TOP : ROW_BOT;
  /* Both layouts optically centre the text block on the card's midline (y+60):
     one-line titles sit lower and looser, two-line titles start higher. */
  const twoLine = n.title.length > 1;
  const titleY = twoLine ? [43, 63] : [53];
  const descY = twoLine ? 84 : 75;
  return (
    <motion.g
      className="fw-node"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, ease: EASE, delay }}
    >
      <rect className="fw-node-bg" x={x} y={y} width={NODE_W} height={NODE_H} rx={18}
        fill="var(--surface)" stroke={INK} strokeOpacity={0.11} filter="url(#fwCard)" />
      <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={18} fill="url(#fwGloss)" pointerEvents="none" />
      <rect className="fw-node-chip" x={x + 18} y={y + 37} width={46} height={46} rx={14} fill="color-mix(in oklch, var(--on-surface) 3.5%, transparent)" />
      <g className="fw-node-icon" transform={`translate(${x + 18 + 9} ${y + 37 + 9}) scale(1.16)`}>
        <Glyph kind={n.icon} />
      </g>
      {n.title.map((lineText, li) => (
        <text key={lineText} x={x + 72} y={y + titleY[li]} className="fw-node-title">{lineText}</text>
      ))}
      <text x={x + 72} y={y + descY} className="fw-node-desc">{n.desc}</text>
      <circle cx={x + NODE_W - 18} cy={y + 22} r={2.2} fill={ORANGE} className="fw-blink" style={{ animationDelay: `${delay}s` }} />
    </motion.g>
  );
}

/* ---------------------------- the split input card ------------------------- */

/** One row of the input card: owner tag over the thing that happens, with the
 *  same chip-then-text anatomy as a process node so the two card types read as
 *  one family at half the scale. */
function SplitRowContent({ r, x, y }: { r: SplitRow; x: number; y: number }) {
  return (
    <g className={r.mine ? 'fw-row fw-row-mine' : 'fw-row'}>
      <rect className="fw-row-chip" x={x + 16} y={y + 15} width={30} height={30} rx={10} fill="color-mix(in oklch, var(--on-surface) 3.5%, transparent)" />
      <g className="fw-row-icon" transform={`translate(${x + 16 + 6} ${y + 15 + 6}) scale(0.75)`}>
        <Glyph kind={r.icon} />
      </g>
      <circle cx={x + 62} cy={y + 19} r={2.1} className="fw-row-dot" />
      <text x={x + 70} y={y + 22} className="fw-row-owner">{r.owner.toUpperCase()}</text>
      <text x={x + 62} y={y + 42} className="fw-row-title">{r.title}</text>
    </g>
  );
}

/** The 01 INPUT cell. Same outer box as every other card — same width, same
 *  height, same corner radius — divided by one hairline. Keeping the box
 *  identical is what lets it hold the column without becoming a fifth one. */
function SplitNode({ n, row, delay }: { n: SplitDef; row: 'top' | 'bot'; delay: number }) {
  const x = COLS[0];
  const y = row === 'top' ? ROW_TOP : ROW_BOT;
  return (
    <motion.g
      className="fw-node fw-split"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, ease: EASE, delay }}
    >
      <rect className="fw-node-bg" x={x} y={y} width={NODE_W} height={NODE_H} rx={18}
        fill="var(--surface)" stroke={INK} strokeOpacity={0.11} filter="url(#fwCard)" />
      <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={18} fill="url(#fwGloss)" pointerEvents="none" />

      <SplitRowContent r={n.rows[0]} x={x} y={y} />
      {/* the hairline — the whole structural idea of the card */}
      <line x1={x + 14} y1={y + ROW_H} x2={x + NODE_W - 14} y2={y + ROW_H} stroke={INK} strokeOpacity={0.1} strokeWidth={1} />
      <SplitRowContent r={n.rows[1]} x={x} y={y + ROW_H} />

      <circle cx={x + NODE_W - 18} cy={y + 22} r={2.2} fill={ORANGE} className="fw-blink" style={{ animationDelay: `${delay}s` }} />
    </motion.g>
  );
}

/* ------------------------------ hero module -------------------------------- */

/** The outcome card. It earns the only saturated orange on the canvas by
 *  carrying the number as well as the claim: six stages between the Monday
 *  recording and the reply, none of which you touch. */
function HeroModule() {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      transition={{ duration: 0.2, ease: EASE, delay: T.hero }}
    >
      {/* ambient light */}
      <circle cx={HERO.x + HERO.w / 2} cy={HERO_CY} r={128} fill="url(#fwAmbient)" className="fw-halo" />
      {/* layered stack */}
      <rect x={HERO.x + 8} y={HERO.y + 10} width={HERO.w} height={HERO.h} rx={22} fill="var(--surface)" stroke={INK} strokeOpacity={0.06} />
      <rect x={HERO.x + 4} y={HERO.y + 5} width={HERO.w} height={HERO.h} rx={22} fill="var(--surface)" stroke={INK} strokeOpacity={0.08} />
      <rect x={HERO.x} y={HERO.y} width={HERO.w} height={HERO.h} rx={22} fill="var(--surface)" stroke={ORANGE} strokeOpacity={0.45} strokeWidth={1.2} filter="url(#fwHero)" />
      <rect x={HERO.x} y={HERO.y} width={HERO.w} height={HERO.h} rx={22} fill="url(#fwGloss)" pointerEvents="none" />
      {/* success chip */}
      <rect x={HERO.x + 20} y={HERO.y + 20} width={46} height={46} rx={14} fill={ORANGE} filter="url(#fwChip)" />
      <g transform={`translate(${HERO.x + 20 + 10} ${HERO.y + 20 + 10}) scale(1.1)`} style={{ color: 'var(--on-accent)' }}>
        <Glyph kind="check" />
      </g>
      <circle cx={HERO.x + HERO.w - 21} cy={HERO.y + 22} r={2.6} fill="var(--color-live)" className="fw-blink" />
      <text x={HERO.x + HERO.w - 30} y={HERO.y + 26} textAnchor="end" className="fw-hero-live">LIVE</text>
      {/* the claim */}
      <text x={HERO.x + 20} y={HERO.y + 110} className="fw-hero-title">More Clients,</text>
      <text x={HERO.x + 20} y={HERO.y + 132} className="fw-hero-title">Faster</text>
      {/* the number that gives the card its brightness */}
      <line x1={HERO.x + 20} y1={HERO.y + 152} x2={HERO.x + HERO.w - 20} y2={HERO.y + 152} stroke={ORANGE} strokeOpacity={0.22} strokeWidth={1} />
      <text x={HERO.x + 20} y={HERO.y + 186} className="fw-hero-num">6</text>
      <text x={HERO.x + 50} y={HERO.y + 186} className="fw-hero-unit">stages, hands off</text>
    </motion.g>
  );
}

/* --------------------------------- slide ----------------------------------- */

export default function FrameworkFlowSlide() {
  return (
    <div className="relative w-full max-w-[1100px] mx-auto">
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="block h-auto w-full"
        role="img"
        aria-label="Two systems, one loop. A content system (SlideIn writes the ideation and script, you record once, then content production and multi-platform presence) and an outreach system (SlideIn researches your ideal client, you tell us once, then manual outreach and qualified conversations) converge into one outcome — more clients, faster, across six hands-off stages."
      >
        <defs>
          <pattern id="fwDots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="color-mix(in oklch, var(--on-surface) 5%, transparent)" />
          </pattern>
          <linearGradient id="fwGloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gloss)" stopOpacity="0.7" />
            <stop offset="45%" stopColor="var(--gloss)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="fwAmbient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ORANGE} stopOpacity="0.13" />
            <stop offset="60%" stopColor={ORANGE} stopOpacity="0.05" />
            <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
          </radialGradient>
          <filter id="fwCard" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={INK} floodOpacity="0.07" />
          </filter>
          <filter id="fwHero" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="var(--color-ember)" floodOpacity="0.18" />
          </filter>
          <filter id="fwChip" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="var(--color-ember)" floodOpacity="0.4" />
          </filter>
        </defs>

        <rect width={VB.w} height={VB.h} fill="url(#fwDots)" opacity={0.7} />
        <Title />
        <Chrome />
        <Connectors />

        <SplitNode n={TOP_INPUT} row="top" delay={T.topNode(0)} />
        {TOP_NODES.map((n, i) => (
          <SystemNode key={n.id} n={n} col={i + 1} row="top" delay={T.topNode(i + 1)} />
        ))}
        <SplitNode n={BOT_INPUT} row="bot" delay={T.botNode(0)} />
        {BOT_NODES.map((n, i) => (
          <SystemNode key={n.id} n={n} col={i + 1} row="bot" delay={T.botNode(i + 1)} />
        ))}
        <Thread />
        <HeroModule />
      </svg>

      <style>{`
        /* The title carries the same tokens as .font-display-md, restated here
           because an SVG <text> cannot inherit a utility class's font-size and
           font-variation-settings has to name opsz or it silently resets to 14. */
        .fw-title {
          font-family: var(--font-display);
          font-size: 40px;
          font-weight: var(--font-weight-display-md);
          letter-spacing: var(--tracking-display-md);
          fill: ${INK};
          font-variation-settings: 'opsz' var(--opsz-display-md), 'SOFT' 8, 'WONK' 0;
        }

        .fw-section { font-size: 10.5px; letter-spacing: .22em; fill: color-mix(in oklch, var(--on-surface) 38%, transparent); font-weight: 700; }
        .fw-sys { font-size: 10px; letter-spacing: .24em; fill: color-mix(in oklch, var(--on-surface) 30%, transparent); font-weight: 800; transition: fill .28s cubic-bezier(.22,1,.36,1); }

        /* The two asides that used to float over the diagram. Silent until the
           reader asks for them by hovering the track they belong to. */
        .fw-sys-group { cursor: help; }
        .fw-sys-note {
          font-size: 11.5px;
          font-style: italic;
          font-family: ui-serif, Georgia, serif;
          fill: color-mix(in oklch, var(--on-surface) 40%, transparent);
          opacity: 0;
          pointer-events: none;
          transition: opacity .28s cubic-bezier(.22,1,.36,1);
        }
        .fw-sys-group:hover .fw-sys-note { opacity: 1; }
        .fw-sys-group:hover .fw-sys { fill: color-mix(in oklch, var(--on-surface) 52%, transparent); }

        .fw-node-bg, .fw-node-chip, .fw-node-icon { transition: all .3s cubic-bezier(.22,1,.36,1); }
        .fw-node-icon { color: color-mix(in oklch, var(--on-surface) 68%, transparent); }
        .fw-node:hover .fw-node-bg { stroke: ${ORANGE}; stroke-opacity: .5; }
        .fw-node:hover .fw-node-chip { fill: color-mix(in oklch, var(--accent-vivid) 9%, transparent); }
        .fw-node:hover .fw-node-icon { color: ${ORANGE}; }
        .fw-node-title { font-size: 16px; font-weight: 800; fill: ${INK}; letter-spacing: -0.014em; }
        .fw-node-desc { font-size: 11px; fill: color-mix(in oklch, var(--on-surface) 45%, transparent); font-weight: 500; }

        /* ── the split input card ─────────────────────────────────────────
           Everything here is the process card's anatomy at half scale, with
           one exception: the client's row gets the orange owner tag. It is
           the only orange on the left two-thirds of the canvas, so the eye
           lands on the one strip of the diagram that is the client's job. */
        .fw-row-chip, .fw-row-icon { transition: all .3s cubic-bezier(.22,1,.36,1); }
        .fw-row-icon { color: color-mix(in oklch, var(--on-surface) 62%, transparent); }
        .fw-row-title { font-size: 14px; font-weight: 800; fill: ${INK}; letter-spacing: -0.012em; }
        .fw-row-owner { font-size: 8px; font-weight: 700; letter-spacing: .18em; fill: color-mix(in oklch, var(--on-surface) 38%, transparent); }
        .fw-row-dot { fill: color-mix(in oklch, var(--on-surface) 30%, transparent); }

        .fw-row-mine .fw-row-owner { fill: ${ORANGE}; }
        .fw-row-mine .fw-row-dot { fill: ${ORANGE}; }
        .fw-row-mine .fw-row-chip { fill: var(--accent-wash); }
        .fw-row-mine .fw-row-icon { color: ${ORANGE}; }

        .fw-split:hover .fw-row-chip { fill: color-mix(in oklch, var(--accent-vivid) 9%, transparent); }
        .fw-split:hover .fw-row-icon { color: ${ORANGE}; }

        .fw-hero-title { font-size: 17px; font-weight: 800; fill: ${INK}; letter-spacing: -0.015em; }
        .fw-hero-num {
          font-family: var(--font-display);
          font-size: 34px;
          font-weight: var(--font-weight-display-sm);
          letter-spacing: var(--tracking-display-sm);
          fill: ${ORANGE};
          font-variation-settings: 'opsz' var(--opsz-display-sm), 'SOFT' 22, 'WONK' 0;
          font-feature-settings: 'tnum' 1;
        }
        .fw-hero-unit { font-size: 11.5px; font-weight: 700; fill: color-mix(in oklch, var(--on-surface) 52%, transparent); letter-spacing: -0.005em; }
        .fw-hero-live { font-size: 8px; letter-spacing: .2em; fill: color-mix(in oklch, var(--on-surface) 35%, transparent); font-weight: 700; }

        .fw-glow { filter: drop-shadow(0 0 3px color-mix(in oklch, var(--accent-vivid) 55%, transparent)); }
        .fw-blink { animation: fwBlink 2.2s ease-in-out infinite; }
        @keyframes fwBlink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        .fw-halo { transform-box: fill-box; transform-origin: center; animation: fwHalo 4.4s ease-in-out infinite; }
        @keyframes fwHalo { 0%,100% { transform: scale(1); opacity: .85; } 50% { transform: scale(1.07); opacity: 1; } }
        .fw-spin { transform-box: fill-box; transform-origin: center; animation: fwSpin 14s linear infinite; }
        @keyframes fwSpin { to { transform: rotate(360deg); } }

        /* SMIL ignores prefers-reduced-motion, so the travelling marks have to
           be hidden outright rather than slowed. */
        @media (prefers-reduced-motion: reduce) {
          .fw-blink, .fw-halo, .fw-spin { animation: none; }
          .fw-thread, .fw-particles { display: none; }
        }
      `}</style>
    </div>
  );
}
