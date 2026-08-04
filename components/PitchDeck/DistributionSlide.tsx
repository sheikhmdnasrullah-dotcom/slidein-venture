'use client';

/**
 * CONTENT DISTRIBUTION — SlideIn Venture
 * ---------------------------------------
 * A three-layer content operating system visualization:
 *   Layer 1  Content Engine (living processing core)
 *   Layer 2  Processing ring (AI + human automation)
 *   Layer 3  Destination clusters with intelligent routing
 *
 * Brand marks are official simple-icons path data (YouTube, Spotify,
 * Apple Podcasts, Instagram, TikTok, X) + official LinkedIn brand path.
 * Monochrome at rest, brand color on hover.
 */

import { motion } from 'framer-motion';

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

const E = { x: 520, y: 415 }; // engine center

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

const JUNCTION = { x: 830, y: 415 };

const ASSET_ITEMS = [
  'ASSET',
  'EP 14 · FULL EPISODE',
  'HIGHLIGHT · 0:41 TO 1:52',
  'CLIPS · 6 OF 6',
  'THUMBNAILS · 6 OF 6',
  'ARTICLE · 1,640 WORDS',
  'POSTS · 4 OF 4',
];

const RIGHT_NODES = [
  {
    title: 'Video & Audio',
    branch: 'M 838 407 C 938 380, 872 140, 1006 140',
    platforms: [
      { name: 'YouTube', logo: LOGOS.youtube, brand: '#FF0000' },
      { name: 'Spotify', logo: LOGOS.spotify, brand: '#1ED760' },
      { name: 'Apple Podcasts', logo: LOGOS.applepodcasts, brand: '#9933CC' },
    ],
  },
  {
    title: 'Social Distribution',
    branch: 'M 844 416 C 918 418, 952 330, 1042 330',
    platforms: [
      { name: 'Instagram', logo: LOGOS.instagram, brand: '#E4405F' },
      { name: 'TikTok', logo: LOGOS.tiktok, brand: 'var(--on-surface)' },
      { name: 'LinkedIn', logo: LOGOS.linkedin, brand: '#0A66C2' },
      { name: 'X', logo: LOGOS.x, brand: 'var(--on-surface)' },
    ],
  },
  {
    title: 'Owned Channels',
    branch: 'M 838 423 C 938 452, 872 520, 1006 520',
    platforms: [
      { name: 'Website', logo: undefined, brand: 'var(--accent-vivid)', strokeIcon: 'globe' as const },
      { name: 'Newsletter', logo: undefined, brand: 'var(--accent-vivid)', strokeIcon: 'mail' as const },
    ],
  },
];

const RING_NODES = [
  { x: E.x, y: E.y - 168, label: 'TRANSCRIBE', lx: 0, ly: -14 },
  { x: E.x - 145, y: E.y + 84, label: 'REPURPOSE', lx: -58, ly: 4 },
  { x: E.x + 145, y: E.y - 84, label: 'SCHEDULE', lx: 56, ly: -4 },
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

function ClusterCard({ c, i }: { c: Cluster; i: number }) {
  const n = c.items.length;
  const iconR = n === 4 ? 21 : 23;
  const gap = n === 4 ? 84 : n === 3 ? 104 : 120;
  const start = c.x + (c.w - (n - 1) * gap) / 2;
  const cy = c.y + 96;
  return (
    <motion.g
      className="cd-cluster"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 1.7 + i * 0.14 }}
    >
      <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={20}
        fill="var(--surface-glass)" stroke="var(--rule)" strokeWidth={1} filter="url(#cdCard)" />
      <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={20} fill="url(#cdGlass)" pointerEvents="none" />
      {/* cable port on the left edge */}
      <circle cx={c.x} cy={c.entryY} r={4} fill="var(--accent-vivid)" filter="url(#cdGlow)" />
      <circle cx={c.x} cy={c.entryY} r={8} fill="none" stroke="var(--accent-vivid)" strokeOpacity={0.3} strokeWidth={1} />
      {/* header */}
      <circle cx={c.x + 26} cy={c.y + 31} r={3.2} fill="var(--accent-vivid)" />
      <text x={c.x + 38} y={c.y + 35} className="cd-cluster-title">{c.title.toUpperCase()}</text>
      <text x={c.x + c.w - 24} y={c.y + 35} textAnchor="end" className="cd-cluster-count">{c.count}</text>
      <line x1={c.x + 24} y1={c.y + 50} x2={c.x + c.w - 24} y2={c.y + 50} stroke="var(--rule)" strokeWidth={1} />
      {c.items.map((it, k) => (
        <PlatformIcon key={it.name} cx={start + k * gap} cy={cy} r={iconR} item={it} />
      ))}
    </motion.g>
  );
}

/* ------------------------------ main slide -------------------------------- */

export default function DistributionSlide() {
  return (
    <section className="relative mx-auto w-full max-w-[920px] overflow-hidden rounded-[28px] bg-[var(--surface)] font-sans antialiased shadow-[var(--shadow-float)]">
      {/* corner ticks */}
      <span className="pointer-events-none absolute left-5 top-5 h-3 w-3 border-l-2 border-t-2 border-[var(--accent-vivid)]/70" />
      <span className="pointer-events-none absolute bottom-5 right-5 h-3 w-3 border-b-2 border-r-2 border-[var(--accent-vivid)]/70" />

      {/* header */}
      <div className="relative z-10 flex items-end justify-between px-8 pt-5 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            04 — Content Distribution
          </p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-[var(--on-surface)] md:text-[26px] md:leading-[1.05]">
            Record once.{' '}
            <span className="bg-gradient-to-r from-[var(--accent-vivid)] to-[var(--color-brand-lift)] bg-clip-text text-transparent">
              Publish everywhere.
            </span>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="hidden items-center gap-2 rounded-full border border-[var(--rule)] bg-[var(--surface-glass)] px-4 py-2 backdrop-blur md:flex"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-vivid)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-vivid)]" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
            Live system
          </span>
        </motion.div>
      </div>

      {/* ------------------------------ canvas ------------------------------ */}
      <div className="relative">
        <svg viewBox="0 80 1440 675" className="block h-auto w-full" role="img"
          aria-label="Content distribution system: one recording flows through the content engine, is processed by AI and humans, then routes automatically to video, social and owned channels.">
          <defs>
            <radialGradient id="cdAmbient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent-vivid)" stopOpacity="0.14" />
              <stop offset="55%" stopColor="var(--accent-vivid)" stopOpacity="0.05" />
              <stop offset="100%" stopColor="var(--accent-vivid)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cdCore" cx="36%" cy="30%" r="80%">
              <stop offset="0%" stopColor="var(--color-brand-pale)" />
              <stop offset="45%" stopColor="var(--color-brand-lift)" />
              <stop offset="100%" stopColor="var(--color-ember)" />
            </radialGradient>
            <radialGradient id="cdHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-brand-lift)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--color-brand-lift)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="cdGlass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gloss)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--gloss)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cdCable" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--accent-vivid)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--accent-vivid)" stopOpacity="0.14" />
            </linearGradient>
            <linearGradient id="cdArc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent-vivid)" stopOpacity="0.65" />
              <stop offset="100%" stopColor="var(--color-brand-pale)" stopOpacity="0.1" />
            </linearGradient>
            <pattern id="cdDots" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="1.2" cy="1.2" r="1.2" fill="var(--rule)" />
            </pattern>
            <radialGradient id="cdDotFade" cx="42%" cy="50%" r="60%">
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
            <filter id="cdEngineShadow" x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow dx="0" dy="18" stdDeviation="24" floodColor="var(--color-ember)" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* --------------------------- background --------------------------- */}
          <rect width="1440" height="810" fill="url(#cdDots)" mask="url(#cdDotMask)" opacity="0.55" />
          <circle cx={E.x} cy={E.y} r={430} fill="url(#cdAmbient)" />
          <circle cx={E.x} cy={E.y} r={262} fill="none" stroke="var(--rule)" strokeOpacity="0.55" strokeWidth="1" />
          <circle cx={E.x} cy={E.y} r={430} fill="none" stroke="var(--rule)" strokeOpacity="0.35" strokeWidth="1" />
          <line x1="60" y1={E.y} x2="1380" y2={E.y} stroke="var(--rule)" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="1 8" />

          {/* --------------------- routing cables (layer 3) -------------------- */}
          {/* input: record → engine */}
          <motion.path
            id="cd-in" d="M 196 415 C 300 415, 356 415, 424 415"
            fill="none" stroke="url(#cdCable)" strokeWidth={2}
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.9 }}
          />
          {/* trunk: engine → junction */}
          <motion.path
            id="cd-trunk" d="M 612 415 C 690 415, 748 415, 816 415"
            fill="none" stroke="url(#cdCable)" strokeWidth={2.5}
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 1.2 }}
          />
          {RIGHT_NODES.map((c, i) => (
             <g key={c.title}>
               {/* soft glow underlay */}
               <path d={c.branch} fill="none" stroke="var(--accent-vivid)" strokeOpacity={0.07} strokeWidth={7} />
               <motion.path
                 id={`cd-branch-${c.title}`} d={c.branch}
                 fill="none" stroke="url(#cdCable)" strokeWidth={1.8}
                 initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                 transition={{ duration: 0.7, ease: 'easeOut', delay: 1.45 + i * 0.12 }}
               />
               {/* flowing energy overlay */}
               <path className="cd-flow" d={c.branch} fill="none" stroke="var(--accent-vivid)" strokeOpacity={0.5} strokeWidth={1.8} />
             </g>
           ))}
           <path className="cd-flow" d="M 196 415 C 300 415, 356 415, 424 415" fill="none" stroke="var(--accent-vivid)" strokeOpacity={0.45} strokeWidth={2} />
           <path className="cd-flow" d="M 612 415 C 690 415, 748 415, 816 415" fill="none" stroke="var(--accent-vivid)" strokeOpacity={0.55} strokeWidth={2.2} />

           {/* traveling particles */}
           <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3, duration: 0.8 }}>
             {RIGHT_NODES.map((c, i) => (
               <g key={c.title}>
                <circle r={3.2} fill="var(--color-brand-lift)" filter="url(#cdGlow)">
                  <animateMotion dur={`${2.6 + i * 0.4}s`} begin={`${i * 0.9}s`} repeatCount="indefinite" path={c.branch} />
                </circle>
                <circle r={2} fill="var(--color-brand-pale)" filter="url(#cdGlow)">
                  <animateMotion dur={`${2.6 + i * 0.4}s`} begin={`${1.3 + i * 0.9}s`} repeatCount="indefinite" path={c.branch} />
                </circle>
              </g>
            ))}
            <circle r={3} fill="var(--color-brand-lift)" filter="url(#cdGlow)">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="M 196 415 C 300 415, 356 415, 424 415" />
            </circle>
            <circle r={3.4} fill="var(--color-brand-lift)" filter="url(#cdGlow)">
              <animateMotion dur="1.8s" repeatCount="indefinite" path="M 612 415 C 690 415, 748 415, 816 415" />
            </circle>
          </motion.g>

          {/* ------------------------ record node (input) ---------------------- */}
          <motion.g
            initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.65 }}
          >
            <circle cx={160} cy={415} r={34} fill="var(--surface)" stroke="var(--rule)" strokeWidth={1} filter="url(#cdSoft)" />
            <circle cx={160} cy={415} r={10} fill="var(--accent-vivid)" className="cd-rec" />
            <circle cx={160} cy={415} r={17} fill="none" stroke="var(--accent-vivid)" strokeOpacity={0.35} strokeWidth={1.5} className="cd-rec-ring" />
            <text x={160} y={475} textAnchor="middle" className="cd-stage">RECORD ONCE</text>
            <text x={160} y={492} textAnchor="middle" className="cd-substage">one long-form session</text>
          </motion.g>

          {/* -------------------- processing ring (layer 2) -------------------- */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.55 }}>
            <circle className="cd-ring-slow" cx={E.x} cy={E.y} r={134} fill="none"
              stroke="var(--accent-vivid)" strokeOpacity={0.28} strokeWidth={1.2} strokeDasharray="1 7" strokeLinecap="round" />
            <circle className="cd-ring-fast" cx={E.x} cy={E.y} r={168} fill="none"
              stroke="url(#cdArc)" strokeWidth={2.4} strokeDasharray="72 46 148 64 96 104" strokeLinecap="round" />
            {/* orbiting particles */}
            <circle r={3} fill="var(--accent-vivid)" filter="url(#cdGlow)">
              <animateMotion dur="9s" repeatCount="indefinite"
                path={`M ${E.x + 151} ${E.y} a 151 151 0 1 1 -302 0 a 151 151 0 1 1 302 0`} />
            </circle>
            <circle r={2.2} fill="var(--color-brand-pale)" filter="url(#cdGlow)">
              <animateMotion dur="13s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear"
                path={`M ${E.x + 151} ${E.y} a 151 151 0 1 1 -302 0 a 151 151 0 1 1 302 0`} />
            </circle>
            {/* automation micro-nodes */}
            {RING_NODES.map((n) => (
              <g key={n.label}>
                <circle cx={n.x} cy={n.y} r={4} fill="var(--accent-vivid)" filter="url(#cdGlow)" />
                <circle cx={n.x} cy={n.y} r={9} fill="none" stroke="var(--accent-vivid)" strokeOpacity={0.3} strokeWidth={1} className="cd-rec-ring" />
                <text x={n.x + n.lx} y={n.y + n.ly} textAnchor="middle" className="cd-micro">{n.label}</text>
              </g>
            ))}
            <text x={E.x} y={E.y + 205} textAnchor="middle" className="cd-stage">AI + HUMAN PROCESSING</text>
          </motion.g>

          {/* ---------------------- content engine (layer 1) -------------------- */}
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          >
            <circle cx={E.x} cy={E.y} r={122} fill="url(#cdHalo)" className="cd-halo" />
            <circle cx={E.x} cy={E.y} r={88} fill="url(#cdCore)" filter="url(#cdEngineShadow)" />
            <circle cx={E.x} cy={E.y} r={88} fill="none" stroke="var(--on-accent)" strokeOpacity={0.35} strokeWidth={1.2} />
            <circle cx={E.x} cy={E.y} r={72} fill="none" stroke="var(--on-accent)" strokeOpacity={0.16} strokeWidth={1} strokeDasharray="2 5" />
            <ellipse cx={E.x - 26} cy={E.y - 38} rx={40} ry={22} fill="var(--on-accent)" opacity={0.18} />
            {/* living waveform */}
            <g fill="var(--on-accent)">
              {[-24, -12, 0, 12, 24].map((dx, i) => (
                <rect key={dx} className="cd-wave" x={E.x + dx - 2.5} y={E.y - 34} width={5} height={26} rx={2.5}
                  style={{ animationDelay: `${i * 0.14}s` }} />
              ))}
            </g>
            <text x={E.x} y={E.y + 26} textAnchor="middle" className="cd-engine-t1">CONTENT ENGINE</text>
            <text x={E.x} y={E.y + 46} textAnchor="middle" className="cd-engine-t2">PROCESSING CORE</text>
          </motion.g>

          {/* ------------------------- routing junction ------------------------ */}
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            transition={{ duration: 0.6, ease: EASE, delay: 1.5 }}>
            <circle cx={JUNCTION.x} cy={JUNCTION.y} r={15} fill="var(--surface)" stroke="var(--accent-vivid)" strokeOpacity={0.4}
              strokeWidth={1.2} strokeDasharray="3 4" className="cd-ring-slow2" />
            <circle cx={JUNCTION.x} cy={JUNCTION.y} r={5.5} fill="var(--accent-vivid)" filter="url(#cdGlow)" />
            <text x={JUNCTION.x} y={JUNCTION.y + 46} textAnchor="middle" className="cd-stage">SMART ROUTING</text>
          </motion.g>

          {/* --------------------- left text items ------------------------ */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {ASSET_ITEMS.map((text, i) => {
              const y = 120 + i * 52;
              const targetNodeIndex = i < 3 ? 0 : i < 5 ? 1 : 2;
              const targetY = 160 + targetNodeIndex * 190;

              return (
                <g key={text}>
                  <text x={560} y={y} textAnchor="end" className="cd-left-text">
                    {text}
                  </text>
                  <line x1={580} y1={y - 4} x2={620} y2={targetY} stroke="var(--rule)" strokeWidth={1} strokeDasharray="2 2" />
                </g>
              );
            })}
          </motion.g>

          {/* --------------------- destination clusters ------------------------ */}
          {RIGHT_NODES.map((node, i) => (
            <motion.g
              key={node.title}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 1.7 + i * 0.14 }}
            >
              {/* Node title */}
              <text x={980} y={140 + i * 190} textAnchor="end" className="cd-cluster-title">
                {node.title.toUpperCase()}
              </text>

              {/* Connection line from left text to icons */}
              <line x1={620} y1={160 + i * 190} x2={680} y2={160 + i * 190} stroke="var(--rule)" strokeWidth={1} />

              {/* Platform icons */}
              {node.platforms.map((platform, k) => {
                const cx = 760 + k * 90;
                const cy = 160 + i * 190;
                const iconSize = 36;
                const s = ((iconSize - 8) / 24);
                const off = (24 * Number(s)) / 2;

                return (
                  <g key={platform.name} className="cd-icon" style={{ ['--brand' as string]: platform.brand }}>
                    <circle cx={cx} cy={cy} r={iconSize / 2} fill="var(--surface)" stroke="var(--rule)" strokeWidth={1} />
                    {platform.logo ? (
                      <g transform={`translate(${cx - off} ${cy - off}) scale(${s})`}>
                        <path d={platform.logo} fill="currentColor" />
                      </g>
                     ) : (
                       <g transform={`translate(${cx - off} ${cy - off}) scale(${s})`}>
                         {'strokeIcon' in platform && platform.strokeIcon === 'globe' ? (
                           <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                             <circle cx={12} cy={12} r={10} />
                             <path d="M2 12h20" />
                             <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                           </g>
                         ) : (
                           <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                             <rect x={2} y={4} width={20} height={16} rx={2.5} />
                             <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                           </g>
                         )}
                       </g>
                     )}
                    <text x={cx} y={cy + 20} textAnchor="middle" className="cd-item-label">
                      {platform.name}
                    </text>
                  </g>
                );
              })}
            </motion.g>
          ))}
        </svg>
      </div>

      {/* story strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 2.1 }}
        className="relative z-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-8 pb-5 pt-0.5 text-[10.5px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]"
      >
        {['Record once', 'Content engine', 'AI + human processing', 'Smart routing', 'Nine destinations'].map(
          (s, i, arr) => (
            <span key={s} className="flex items-center gap-3">
              <span className={i === arr.length - 1 ? 'text-[var(--accent)]' : ''}>{s}</span>
              {i < arr.length - 1 && <span className="text-[var(--muted)]">→</span>}
            </span>
          )
        )}
      </motion.div>

      {/* scoped animation styles */}
      <style>{`
        .cd-flow { stroke-dasharray: 3 15; animation: cdDash 1.4s linear infinite; }
        @keyframes cdDash { to { stroke-dashoffset: -18; } }

        .cd-ring-slow  { transform-origin: ${E.x}px ${E.y}px; animation: cdSpin 52s linear infinite; }
        .cd-ring-fast  { transform-origin: ${E.x}px ${E.y}px; animation: cdSpinRev 30s linear infinite; opacity: .55; }
        .cd-ring-slow2 { transform-box: fill-box; transform-origin: center; animation: cdSpin 14s linear infinite; }
        @keyframes cdSpin    { to { transform: rotate(360deg); } }
        @keyframes cdSpinRev { to { transform: rotate(-360deg); } }

        .cd-halo { animation: cdPulse 3.4s ease-in-out infinite; }
        @keyframes cdPulse { 0%,100% { opacity: .5; } 50% { opacity: 1; } }

        .cd-rec { transform-box: fill-box; transform-origin: center; animation: cdRec 2s ease-in-out infinite; }
        @keyframes cdRec { 0%,100% { transform: scale(1); } 50% { transform: scale(.78); } }
        .cd-rec-ring { transform-box: fill-box; transform-origin: center; animation: cdRecRing 2.6s ease-out infinite; }
        @keyframes cdRecRing { 0% { transform: scale(.7); opacity: .8; } 100% { transform: scale(1.7); opacity: 0; } }

        .cd-wave { transform-box: fill-box; transform-origin: center; animation: cdWave 1.1s ease-in-out infinite; }
        @keyframes cdWave { 0%,100% { transform: scaleY(.35); } 50% { transform: scaleY(1); } }

        .cd-cluster { transition: transform .45s cubic-bezier(.22,1,.36,1); transform-box: fill-box; transform-origin: center; }
        .cd-cluster:hover { transform: translateY(-6px); }

        .cd-icon { cursor: pointer; }
        .cd-glyph { color: var(--on-surface); transition: color .3s ease; }
        .cd-icon:hover .cd-glyph { color: var(--brand); }
        .cd-icon > circle { transition: transform .3s cubic-bezier(.22,1,.36,1); transform-box: fill-box; transform-origin: center; }
        .cd-icon:hover > circle { transform: scale(1.08); }

        .cd-item-label { font-size: 9px; letter-spacing: .04em; fill: var(--muted); font-weight: 500; }
        .cd-left-text { font-size: 11px; letter-spacing: .04em; fill: var(--on-surface); font-weight: 500; }
        .cd-cluster-title { font-size: 10.5px; letter-spacing: .22em; fill: var(--accent); font-weight: 700; }
        .cd-cluster-count { font-size: 10.5px; letter-spacing: .18em; fill: var(--muted); font-weight: 600; }
        .cd-stage { font-size: 10px; letter-spacing: .24em; fill: var(--muted); font-weight: 600; }
        .cd-substage { font-size: 10px; letter-spacing: .04em; fill: var(--muted); font-weight: 500; }
        .cd-micro { font-size: 8.5px; letter-spacing: .2em; fill: var(--muted); font-weight: 600; }
        .cd-engine-t1 { font-size: 13px; letter-spacing: .18em; fill: var(--on-accent); font-weight: 700; }
        .cd-engine-t2 { font-size: 8px; letter-spacing: .3em; fill: color-mix(in oklch, var(--on-accent) 75%, transparent); font-weight: 600; }

        @media (prefers-reduced-motion: reduce) {
          .cd-flow, .cd-ring-slow, .cd-ring-fast, .cd-ring-slow2, .cd-halo,
          .cd-rec, .cd-rec-ring, .cd-wave { animation: none; }
        }
      `}</style>
    </section>
  );
}
