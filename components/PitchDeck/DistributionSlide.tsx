'use client';

/**
 * CONTENT DISTRIBUTION — SlideIn Venture
 * ---------------------------------------
 * One picture, three zones, left to right:
 *   left     episode 14's finished assets, one per line
 *   centre   the routing junction every asset passes through
 *   right    the destination cards each asset lands in
 *
 * Hovering a line lights the card that line actually ships to and dims the
 * rest, so the routing is readable instead of decorative.
 *
 * Brand marks are official simple-icons path data (YouTube, Spotify,
 * Apple Podcasts, Instagram, TikTok, X) + official LinkedIn brand path.
 * Monochrome at rest, brand color on hover.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DASHBOARD_ROWS } from '@/content/steps';

/* ----------------------------- brand assets ----------------------------- */

const LOGOS: Record<string, string> = {
  youtube:
    'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  spotify:
    'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z',
  applepodcasts:
    'M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.59.12 2.2.007 2.864a8.506 8.506 0 01-3.24 5.296c-.608.46-2.096 1.261-2.336 1.261-.088 0-.096-.091-.056-.46.072-.592.144-.715.48-.856.536-.224 1.448-.874 2.008-1.435a7.644 7.644 0 002.008-3.536c.208-.824.184-2.656-.048-3.504-.728-2.696-2.928-4.792-5.624-5.352-.784-.16-2.208-.16-3 0-2.728.56-4.984 2.76-5.672 5.528-.184.752-.184 2.584 0 3.336.456 1.832 1.64 3.512 3.192 4.512.304.2.672.408.824.472.336.144.408.264.472.856.04.36.03.464-.056.464-.056 0-.464-.176-.896-.384l-.04-.03c-2.472-1.216-4.056-3.274-4.632-6.012-.144-.706-.168-2.392-.03-3.04.36-1.74 1.048-3.1 2.192-4.304 1.648-1.737 3.768-2.656 6.128-2.656zm.134 2.81c.409.004.803.04 1.106.106 2.784.62 4.76 3.408 4.376 6.174-.152 1.114-.536 2.03-1.216 2.88-.336.43-1.152 1.15-1.296 1.15-.023 0-.048-.272-.048-.603v-.605l.416-.496c1.568-1.878 1.456-4.502-.256-6.224-.664-.67-1.432-1.064-2.424-1.246-.64-.118-.776-.118-1.448-.008-1.02.167-1.81.562-2.512 1.256-1.72 1.704-1.832 4.342-.264 6.222l.413.496v.608c0 .336-.027.608-.06.608-.03 0-.264-.16-.512-.36l-.034-.011c-.832-.664-1.568-1.842-1.872-2.997-.184-.698-.184-2.024.008-2.72.504-1.878 1.888-3.335 3.808-4.019.41-.145 1.133-.22 1.814-.211zm-.13 2.99c.31 0 .62.06.844.178.488.253.888.745 1.04 1.259.464 1.578-1.208 2.96-2.72 2.254h-.015c-.712-.331-1.096-.956-1.104-1.77 0-.733.408-1.371 1.112-1.745.224-.117.534-.176.844-.176zm-.011 4.728c.988-.004 1.706.349 1.97.97.198.464.124 1.932-.218 4.302-.232 1.656-.36 2.074-.68 2.356-.44.39-1.064.498-1.656.288h-.003c-.716-.257-.87-.605-1.164-2.644-.341-2.37-.416-3.838-.218-4.302.262-.616.974-.966 1.97-.97z',
  instagram:
    'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077',
  tiktok:
    'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  x: 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z',
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
};

/* ------------------------------- geometry -------------------------------- */

/* The canvas is a single left-to-right run: asset lines, junction, cards.
   Every coordinate below is in the 1440-wide viewBox. */
const JUNCTION = { x: 830, y: 415 };

/* Asset lines. The column is centred on the junction's y-axis so the cables
   fan symmetrically, and its width is fixed so the longest label still clears
   the port. */
const COL = { x: 70, w: 400, rowH: 62 };
const COL_PORT_X = COL.x + COL.w;
const rowCenterY = (i: number) =>
  JUNCTION.y - ((DASHBOARD_ROWS.length - 1) * COL.rowH) / 2 + i * COL.rowH;
const rowCable = (i: number) => {
  const y = rowCenterY(i);
  return `M ${COL_PORT_X + 6} ${y} C ${COL_PORT_X + 150} ${y}, ${JUNCTION.x - 140} ${JUNCTION.y}, ${JUNCTION.x - 16} ${JUNCTION.y}`;
};

type Item = {
  name: string;
  brand: string;
  logo?: string; // filled brand path (24x24)
  strokeIcon?: 'globe' | 'mail'; // owned-channel line icons
};

type Cluster = {
  id: string;
  title: string;
  count: string;
  x: number;
  y: number;
  w: number;
  h: number;
  entryY: number;
  branch: string; // routing path from junction to card port
  items: Item[];
};

const CLUSTERS: Cluster[] = [
  {
    id: 'video',
    title: 'Video & Audio',
    count: '03',
    x: 1010, y: 105, w: 330, h: 172, entryY: 191,
    branch: 'M 838 407 C 938 380, 872 191, 1006 191',
    items: [
  /* The `brand` values below are third-party marks (YouTube red, Spotify green,
     Apple Podcasts purple, Instagram, LinkedIn). They are fixed by their owners
     and are the one exemption from the palette — a tokenised YouTube red would
     not be YouTube red. Everything else in this file speaks the tone contract. */
      { name: 'YouTube', brand: '#FF0000', logo: LOGOS.youtube },
      { name: 'Spotify', brand: '#1ED760', logo: LOGOS.spotify },
      { name: 'Apple Podcasts', brand: '#9933CC', logo: LOGOS.applepodcasts },
    ],
  },
  {
    id: 'social',
    title: 'Social Distribution',
    count: '04',
    x: 1046, y: 332, w: 350, h: 172, entryY: 418,
    branch: 'M 844 416 C 918 418, 952 418, 1042 418',
    items: [
      { name: 'Instagram', brand: '#E4405F', logo: LOGOS.instagram },
      { name: 'TikTok', brand: 'var(--on-surface)', logo: LOGOS.tiktok },
      { name: 'LinkedIn', brand: '#0A66C2', logo: LOGOS.linkedin },
      { name: 'X', brand: 'var(--on-surface)', logo: LOGOS.x },
    ],
  },
  {
    id: 'owned',
    title: 'Owned Channels',
    count: '02',
    x: 1010, y: 560, w: 300, h: 172, entryY: 646,
    branch: 'M 838 423 C 938 452, 872 646, 1006 646',
    items: [
      { name: 'Website', brand: 'var(--accent-vivid)', strokeIcon: 'globe' },
      { name: 'Newsletter', brand: 'var(--accent-vivid)', strokeIcon: 'mail' },
    ],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------ sub-pieces -------------------------------- */

function StrokeIcon({ kind }: { kind: 'globe' | 'mail' }) {
  if (kind === 'globe')
    return (
      <g fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={12} cy={12} r={10} />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </g>
    );
  return (
    <g fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <rect x={2} y={4} width={20} height={16} rx={2.5} />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </g>
  );
}

function PlatformIcon({
  cx, cy, r, item,
}: { cx: number; cy: number; r: number; item: Item }) {
  const s = ((r * 2 - 16) / 24).toFixed(4); // glyph fits with 8px padding
  const off = (24 * Number(s)) / 2;
  return (
    <g className="cd-icon" style={{ ['--brand' as string]: item.brand }}>
      <circle cx={cx} cy={cy} r={r} fill="var(--surface)" stroke="var(--rule)" strokeWidth={1} filter="url(#cdSoft)" />
      <g className="cd-glyph" transform={`translate(${cx - off} ${cy - off}) scale(${s})`}>
        {item.logo ? <path d={item.logo} fill="currentColor" /> : <StrokeIcon kind={item.strokeIcon!} />}
      </g>
      <text x={cx} y={cy + r + 17} textAnchor="middle" className="cd-item-label">
        {item.name}
      </text>
    </g>
  );
}

function ClusterCard({ c, i, dimmed }: { c: Cluster; i: number; dimmed: boolean }) {
  const n = c.items.length;
  const iconR = n === 4 ? 21 : 23;
  const gap = n === 4 ? 84 : n === 3 ? 104 : 120;
  const start = c.x + (c.w - (n - 1) * gap) / 2;
  const cy = c.y + 96;
  return (
    <motion.g
      className="cd-cluster"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: dimmed ? 0.22 : 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.85 + i * 0.12 }}
    >
      <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={20}
        fill="var(--surface-glass)" stroke="var(--rule)" strokeWidth={1} filter="url(#cdCard)" />
      <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={20} fill="url(#cdGlass)" pointerEvents="none" />
      {/* cable port on the left edge */}
      <circle cx={c.x} cy={c.entryY} r={4} fill="var(--accent-vivid)" filter="url(#cdGlow)" />
      <circle cx={c.x} cy={c.entryY} r={8} fill="none" stroke="var(--accent-vivid)" strokeOpacity={0.3} strokeWidth={1} />
      {/* cluster header */}
      <circle cx={c.x + 24} cy={c.y + 31} r={3.2} fill="var(--accent-vivid)" />
      <text x={c.x + 38} y={c.y + 35} className="cd-cluster-title">{c.title.toUpperCase()}</text>
      <line x1={c.x + 24} y1={c.y + 50} x2={c.x + c.w - 24} y2={c.y + 50} stroke="var(--rule)" strokeWidth={1} />
      {c.items.map((it, k) => (
        <PlatformIcon key={it.name} cx={start + k * gap} cy={cy} r={iconR} item={it} />
      ))}
    </motion.g>
  );
}

/* ------------------------------ main slide -------------------------------- */

export default function DistributionSlide() {
  /* Which asset line the reader is on, and therefore which card that line
     actually ships to. Null until they point at one. */
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const activeCluster = activeRow === null ? null : DASHBOARD_ROWS[activeRow].cluster;

  return (
    <section className="relative w-full overflow-hidden bg-[var(--surface)] font-sans antialiased">
      {/* corner ticks */}
      <span className="pointer-events-none absolute left-5 top-5 h-3 w-3 border-l-2 border-t-2 border-[var(--accent-vivid)]/70" />
      <span className="pointer-events-none absolute bottom-5 right-5 h-3 w-3 border-b-2 border-r-2 border-[var(--accent-vivid)]/70" />

      {/* ------------------------------ canvas ------------------------------ */}
      <div className="relative">
        <svg viewBox="0 80 1440 675" className="block h-auto w-full" role="img"
          aria-label="Episode 14 delivered: six finished assets on the left, each routed through smart routing to the video, social and owned channels it publishes to.">
          <defs>
            <radialGradient id="cdAmbient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent-vivid)" stopOpacity="0.14" />
              <stop offset="55%" stopColor="var(--accent-vivid)" stopOpacity="0.05" />
              <stop offset="100%" stopColor="var(--accent-vivid)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="cdGlass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gloss)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--gloss)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cdCable" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--accent-vivid)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--accent-vivid)" stopOpacity="0.14" />
            </linearGradient>
            <pattern id="cdDots" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="1.2" cy="1.2" r="1.2" fill="var(--rule)" />
            </pattern>
            <radialGradient id="cdDotFade" cx="55%" cy="50%" r="60%">
              <stop offset="0%" stopColor="var(--gloss)" stopOpacity="0.75" />
              <stop offset="70%" stopColor="var(--gloss)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--gloss)" stopOpacity="0" />
            </radialGradient>
            <mask id="cdDotMask">
              <rect width="1440" height="810" fill="url(#cdDotFade)" />
            </mask>
            <filter id="cdSoft" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="var(--color-ember)" floodOpacity="0.16" />
            </filter>
            <filter id="cdCard" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="var(--color-ember)" floodOpacity="0.10" />
            </filter>
            <filter id="cdGlow" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* --------------------------- background --------------------------- */}
          <rect width="1440" height="810" fill="url(#cdDots)" mask="url(#cdDotMask)" opacity="0.5" />
          <circle cx={JUNCTION.x} cy={JUNCTION.y} r={430} fill="url(#cdAmbient)" />
          <circle cx={JUNCTION.x} cy={JUNCTION.y} r={262} fill="none" stroke="var(--rule)" strokeOpacity="0.4" strokeWidth="1" />

          {/* ------------------ asset lines → junction cables ------------------ */}
          {DASHBOARD_ROWS.map((row, i) => {
            const d = rowCable(i);
            const on = activeRow === i;
            const off = activeRow !== null && !on;
            return (
              <g key={row.asset} className="cd-fade" style={{ opacity: off ? 0.15 : 1 }}>
                <path d={d} fill="none" stroke="var(--accent-vivid)" strokeOpacity={on ? 0.16 : 0.07} strokeWidth={on ? 9 : 7} />
                <motion.path
                  d={d} fill="none" stroke="url(#cdCable)" strokeWidth={on ? 2.4 : 1.5}
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.45 + i * 0.06 }}
                />
                <path className="cd-flow" d={d} fill="none" stroke="var(--accent-vivid)" strokeOpacity={on ? 0.8 : 0.4} strokeWidth={on ? 2.4 : 1.5} />
                <circle r={2.6} fill="var(--color-brand-lift)" filter="url(#cdGlow)">
                  <animateMotion dur={`${2.4 + i * 0.25}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" path={d} />
                </circle>
              </g>
            );
          })}

          {/* ------------------ junction → destination cables ------------------ */}
          {CLUSTERS.map((c, i) => {
            const on = activeCluster === c.id;
            const off = activeCluster !== null && !on;
            return (
              <g key={c.id} className="cd-fade" style={{ opacity: off ? 0.15 : 1 }}>
                <path d={c.branch} fill="none" stroke="var(--accent-vivid)" strokeOpacity={on ? 0.16 : 0.07} strokeWidth={on ? 9 : 7} />
                <motion.path
                  d={c.branch} fill="none" stroke="url(#cdCable)" strokeWidth={on ? 2.6 : 1.8}
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.7 + i * 0.1 }}
                />
                <path className="cd-flow" d={c.branch} fill="none" stroke="var(--accent-vivid)" strokeOpacity={on ? 0.85 : 0.5} strokeWidth={on ? 2.6 : 1.8} />
                <circle r={3.2} fill="var(--color-brand-lift)" filter="url(#cdGlow)">
                  <animateMotion dur={`${2.6 + i * 0.4}s`} begin={`${i * 0.9}s`} repeatCount="indefinite" path={c.branch} />
                </circle>
              </g>
            );
          })}

          {/* -------------------------- asset lines ---------------------------- */}
          <motion.g
            initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            role="list"
          >
            {DASHBOARD_ROWS.map((row, i) => {
              const cy = rowCenterY(i);
              const on = activeRow === i;
              return (
                <g
                  key={row.asset}
                  className="cd-row"
                  role="listitem"
                  tabIndex={0}
                  aria-label={`${row.asset}, published to ${row.destination}`}
                  onMouseEnter={() => setActiveRow(i)}
                  onMouseLeave={() => setActiveRow(null)}
                  onFocus={() => setActiveRow(i)}
                  onBlur={() => setActiveRow(null)}
                >
                  <rect
                    x={COL.x} y={cy - COL.rowH / 2} width={COL.w} height={COL.rowH} rx={10}
                    fill={on ? 'var(--accent-wash)' : 'transparent'}
                  />
                   <text x={COL.x + 24} y={cy + 5} className={on ? 'cd-row-label cd-row-label-on' : 'cd-row-label'}>
                     {row.asset.replace(/^EP \d+ · /, '')}
                   </text>
                  <line
                    x1={COL.x} y1={cy + COL.rowH / 2} x2={COL_PORT_X} y2={cy + COL.rowH / 2}
                    stroke="var(--rule)" strokeWidth={1}
                  />
                  <circle cx={COL_PORT_X} cy={cy} r={on ? 4.5 : 3} fill="var(--accent-vivid)" filter="url(#cdGlow)" />
                </g>
              );
            })}
            {/* top rule, so the first line is bounded like the rest */}
            <line
              x1={COL.x} y1={rowCenterY(0) - COL.rowH / 2} x2={COL_PORT_X} y2={rowCenterY(0) - COL.rowH / 2}
              stroke="var(--rule)" strokeWidth={1}
            />
          </motion.g>

          {/* ------------------------- routing junction ------------------------ */}
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}>
            <circle cx={JUNCTION.x} cy={JUNCTION.y} r={15} fill="var(--surface)" stroke="var(--accent-vivid)" strokeOpacity={0.4}
              strokeWidth={1.2} strokeDasharray="3 4" className="cd-ring-slow" />
            <circle cx={JUNCTION.x} cy={JUNCTION.y} r={5.5} fill="var(--accent-vivid)" filter="url(#cdGlow)" />
          </motion.g>

          {/* --------------------- destination clusters ------------------------ */}
          {CLUSTERS.map((c, i) => (
            <ClusterCard
              key={c.id}
              c={c}
              i={i}
              dimmed={activeCluster !== null && activeCluster !== c.id}
            />
          ))}
        </svg>
      </div>

      {/* scoped animation styles */}
      <style>{`
        .cd-flow { stroke-dasharray: 3 15; animation: cdDash 1.4s linear infinite; }
        @keyframes cdDash { to { stroke-dashoffset: -18; } }

        .cd-ring-slow { transform-box: fill-box; transform-origin: center; animation: cdSpin 14s linear infinite; }
        @keyframes cdSpin { to { transform: rotate(360deg); } }

        .cd-fade { transition: opacity .3s ease; }

        .cd-cluster { transition: transform .45s cubic-bezier(.22,1,.36,1); transform-box: fill-box; transform-origin: center; }
        .cd-cluster:hover { transform: translateY(-6px); }

        .cd-row rect { transition: fill .25s ease; }
        .cd-row:focus { outline: none; }
        .cd-row:focus-visible rect { fill: var(--accent-wash); stroke: var(--accent-ring); stroke-width: 1.5px; }

        .cd-icon { cursor: pointer; }
        .cd-glyph { color: var(--on-surface); transition: color .3s ease; }
        .cd-icon:hover .cd-glyph { color: var(--brand); }
        .cd-icon > circle { transition: transform .3s cubic-bezier(.22,1,.36,1); transform-box: fill-box; transform-origin: center; }
        .cd-icon:hover > circle { transform: scale(1.08); }

         .cd-row-label {
           font-family: var(--font-mono); font-size: 15px; letter-spacing: .12em;
           fill: var(--on-surface); font-weight: 500; transition: fill .25s ease;
         }
         .cd-row-label-on { fill: var(--accent); }
         .cd-col-head { font-size: 10.5px; letter-spacing: .22em; fill: var(--muted); font-weight: 600; }
         .cd-item-label { font-size: 10px; letter-spacing: .04em; fill: var(--muted); font-weight: 500; }
         .cd-cluster-title { font-size: 10.5px; letter-spacing: .22em; fill: var(--muted); font-weight: 600; }
         .cd-stage { font-size: 10px; letter-spacing: .24em; fill: var(--muted); font-weight: 600; }

        @media (prefers-reduced-motion: reduce) {
          .cd-flow, .cd-ring-slow { animation: none; }
        }
      `}</style>
    </section>
  );
}
