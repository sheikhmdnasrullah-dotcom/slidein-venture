'use client';

/**
 * THE CONTENT SYSTEM — SlideIn Venture
 * -------------------------------------
 * A product-blueprint canvas, read left to right:
 *
 *   01 ORIGIN      one orange focal card — "You Record Once a Week"
 *   02 ENGINE      the SlideIn Content Engine, a living processing module
 *   03 PRODUCTION  six intelligent output modules (click → service modal)
 *   04 PUBLISH     grouped destinations (video / social / owned)
 *
 * White canvas, architectural helper lines, thin FigJam-style connectors,
 * flowing data particles, tiny handwritten annotations. Orange is used
 * only to guide attention.
 *
 * Platform marks are official simple-icons path data.
 */

import { motion } from 'framer-motion';

const ORANGE = 'var(--accent-vivid)';
const INK = 'var(--on-surface)';
const EASE = [0.22, 1, 0.36, 1] as const;

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

const VB = { w: 1240, h: 560 };

const ORIGIN = { x: 56, y: 216, w: 216, h: 128 };
const ENGINE = { x: 352, y: 200, w: 208, h: 160 };
const COL = { x: 636, w: 248, cardH: 58, gap: 14, top: 71 };
const BUS1 = 608; // engine → production
const BUS2 = 918; // production → publish

const O_CY = ORIGIN.y + ORIGIN.h / 2; // 280
const E_CY = ENGINE.y + ENGINE.h / 2; // 280

const cardY = (i: number) => COL.top + i * (COL.cardH + COL.gap);
const cardCY = (i: number) => cardY(i) + COL.cardH / 2;

/* ------------------------------ pipeline data ----------------------------- */

type Module = {
  id: string;
  /** Matching id in framework.data.ts's ENGINES[0].items */
  serviceId: string;
  title: string;
  desc: string;
  icon: 'notes' | 'film' | 'image' | 'play' | 'doc' | 'linkedin';
};

const PIPELINE: Module[] = [
  { id: 'show-notes', serviceId: 'c-notes', title: 'Show Notes', desc: 'Timestamped, ready to publish', icon: 'notes' },
  { id: 'edited-episode', serviceId: 'c-audio', title: 'Edited Episode', desc: 'Trimmed, balanced, mastered', icon: 'film' },
  { id: 'thumbnail', serviceId: 'c-thumbnails', title: 'Thumbnail', desc: 'One look, reused every episode', icon: 'image' },
  { id: 'short-clips', serviceId: 'c-clips', title: 'Short Clips', desc: 'Captioned 30–60s cuts', icon: 'play' },
  { id: 'full-articles', serviceId: 'c-blog', title: 'Full Articles', desc: 'Rewritten in your voice', icon: 'doc' },
  { id: 'linkedin-posts', serviceId: 'c-social', title: 'LinkedIn Posts', desc: 'From what you actually said', icon: 'linkedin' },
];

type OutputGroup = {
  id: string;
  label: string;
  count: string;
  y: number;
  h: number;
  items: { name: string; brand: string; logo?: string; strokeIcon?: 'globe' | 'mail' }[];
};

const GROUP_X = 952;
const GROUP_W = 236;

const OUTPUTS: OutputGroup[] = [
  {
    id: 'video',
    label: 'Video & Audio',
    count: '03',
    y: 64,
    h: 126,
    items: [
  /* The `brand` values below are third-party marks (YouTube red, Spotify green,
     Apple Podcasts purple, Instagram, LinkedIn). They are fixed by their owners
     and are the one exemption from the palette — a tokenised YouTube red would
     not be YouTube red. Everything else in this file speaks the tone contract. */
      { name: 'YouTube', brand: '#FF0000', logo: LOGOS.youtube },
      { name: 'Spotify', brand: '#1ED760', logo: LOGOS.spotify },
      { name: 'Podcasts', brand: '#9933CC', logo: LOGOS.applepodcasts },
    ],
  },
  {
    id: 'social',
    label: 'Social',
    count: '04',
    y: 214,
    h: 132,
    items: [
      { name: 'Instagram', brand: '#E4405F', logo: LOGOS.instagram },
      { name: 'LinkedIn', brand: '#0A66C2', logo: LOGOS.linkedin },
      { name: 'TikTok', brand: 'var(--on-surface)', logo: LOGOS.tiktok },
      { name: 'X', brand: 'var(--on-surface)', logo: LOGOS.x },
    ],
  },
  {
    id: 'owned',
    label: 'Owned',
    count: '02',
    y: 370,
    h: 118,
    items: [
      { name: 'Website', brand: ORANGE, strokeIcon: 'globe' },
      { name: 'Newsletter', brand: ORANGE, strokeIcon: 'mail' },
    ],
  },
];

const GROUP_CY = (g: OutputGroup) => g.y + g.h / 2;

const SECTIONS = [
  { label: '01 — Origin', x: ORIGIN.x },
  { label: '02 — Engine', x: ENGINE.x },
  { label: '03 — Production', x: COL.x },
  { label: '04 — Publish', x: GROUP_X },
];

/* ------------------------------ tiny icons -------------------------------- */

function ModuleGlyph({ kind }: { kind: Module['icon'] }) {
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  switch (kind) {
    case 'notes':
      return (
        <g {...stroke}>
          <rect x={4} y={3} width={16} height={18} rx={2.5} />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </g>
      );
    case 'film':
      return (
        <g {...stroke}>
          <rect x={3} y={5} width={18} height={14} rx={2.5} />
          <path d="M7 5v14M17 5v14M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4" />
        </g>
      );
    case 'image':
      return (
        <g {...stroke}>
          <rect x={3} y={4} width={18} height={16} rx={2.5} />
          <circle cx={8.7} cy={9.5} r={1.7} />
          <path d="m21 15.6-4.4-4.4L6 21" />
        </g>
      );
    case 'play':
      return (
        <g {...stroke}>
          <rect x={3} y={3} width={18} height={18} rx={4.5} />
          <path d="M10 8.6v6.8l5.6-3.4z" />
        </g>
      );
    case 'doc':
      return (
        <g {...stroke}>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v4h4M9 12h6M9 16h6" />
        </g>
      );
    case 'linkedin':
      return <path d={LOGOS.linkedin} fill="currentColor" transform="scale(0.9) translate(1.3 1.3)" />;
  }
}

function ChipGlyph({ item }: { item: OutputGroup['items'][number] }) {
  if (item.logo) return <path d={item.logo} fill="currentColor" />;
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  if (item.strokeIcon === 'globe')
    return (
      <g {...stroke}>
        <circle cx={12} cy={12} r={10} />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </g>
    );
  return (
    <g {...stroke}>
      <rect x={2} y={4} width={20} height={16} rx={2.5} />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </g>
  );
}

/* --------------------------- blueprint chrome ----------------------------- */

function BlueprintChrome() {
  return (
    <g aria-hidden>
      {/* ruler ticks along the top */}
      {Array.from({ length: 30 }, (_, i) => 56 + i * 40).map((x) => (
        <line key={x} x1={x} y1={10} x2={x} y2={x % 200 === 56 % 200 ? 18 : 14} stroke={INK} strokeOpacity={0.08} strokeWidth={1} />
      ))}
      {/* zone separator guides */}
      {[320, 610, 920].map((x) => (
        <line key={x} x1={x} y1={26} x2={x} y2={540} stroke={INK} strokeOpacity={0.045} strokeWidth={1} strokeDasharray="1 7" />
      ))}
      {/* construction circles behind the engine */}
      <circle cx={ENGINE.x + ENGINE.w / 2} cy={E_CY} r={124} fill="none" stroke={INK} strokeOpacity={0.05} strokeWidth={1} strokeDasharray="2 6" />
      <circle cx={ENGINE.x + ENGINE.w / 2} cy={E_CY} r={156} fill="none" stroke={ORANGE} strokeOpacity={0.05} strokeWidth={1} />
      {/* corner crosshairs */}
      {[
        [40, 40], [1200, 40], [40, 524], [1200, 524],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} stroke={INK} strokeOpacity={0.14} strokeWidth={1}>
          <line x1={x - 5} y1={y} x2={x + 5} y2={y} />
          <line x1={x} y1={y - 5} x2={x} y2={y + 5} />
        </g>
      ))}
      {/* horizontal baseline through the system */}
      <line x1={40} y1={280} x2={1200} y2={280} stroke={INK} strokeOpacity={0.04} strokeWidth={1} strokeDasharray="1 8" />
    </g>
  );
}

function SectionLabels() {
  return (
    <g>
      {SECTIONS.map((s) => (
        <g key={s.label}>
          <line x1={s.x + 1} y1={26} x2={s.x + 1} y2={34} stroke={ORANGE} strokeOpacity={0.8} strokeWidth={2} strokeLinecap="round" />
          <text x={s.x + 9} y={33} className="bp-section">{s.label.toUpperCase()}</text>
        </g>
      ))}
    </g>
  );
}

/* ------------------------------- connectors ------------------------------- */

function Connectors() {
  return (
    <g aria-hidden>
      {/* origin → engine */}
      <motion.line
        x1={ORIGIN.x + ORIGIN.w} y1={O_CY} x2={ENGINE.x} y2={E_CY}
        stroke={INK} strokeOpacity={0.16} strokeWidth={1.4}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: 'easeOut', delay: 0.7 }}
      />
      {/* engine → production trunk + bus */}
      <motion.path
        d={`M ${ENGINE.x + ENGINE.w} ${E_CY} H ${BUS1}`}
        fill="none" stroke={INK} strokeOpacity={0.16} strokeWidth={1.4}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, ease: 'easeOut', delay: 1.0 }}
      />
      <motion.line
        x1={BUS1} y1={cardCY(0)} x2={BUS1} y2={cardCY(5)}
        stroke={INK} strokeOpacity={0.12} strokeWidth={1.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 1.15 }}
      />
      {PIPELINE.map((m, i) => (
        <motion.line
          key={`b1-${m.id}`}
          x1={BUS1} y1={cardCY(i)} x2={COL.x} y2={cardCY(i)}
          stroke={INK} strokeOpacity={0.14} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 1.3 + i * 0.07 }}
        />
      ))}
      {/* production → publish bus */}
      {PIPELINE.map((m, i) => (
        <motion.line
          key={`b2-${m.id}`}
          x1={COL.x + COL.w} y1={cardCY(i)} x2={BUS2} y2={cardCY(i)}
          stroke={INK} strokeOpacity={0.1} strokeWidth={1.1}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 1.6 + i * 0.05 }}
        />
      ))}
      <motion.line
        x1={BUS2} y1={cardCY(0)} x2={BUS2} y2={cardCY(5)}
        stroke={INK} strokeOpacity={0.12} strokeWidth={1.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 1.8 }}
      />
      {OUTPUTS.map((g, i) => (
        <motion.line
          key={`b3-${g.id}`}
          x1={BUS2} y1={GROUP_CY(g)} x2={GROUP_X} y2={GROUP_CY(g)}
          stroke={INK} strokeOpacity={0.14} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 1.95 + i * 0.08 }}
        />
      ))}

      {/* connector joints */}
      <g fill="var(--surface)" stroke={INK} strokeOpacity={0.28} strokeWidth={1}>
        <circle cx={ORIGIN.x + ORIGIN.w} cy={O_CY} r={2.6} />
        <circle cx={ENGINE.x} cy={E_CY} r={2.6} />
        <circle cx={ENGINE.x + ENGINE.w} cy={E_CY} r={2.6} />
        <circle cx={BUS1} cy={E_CY} r={2.6} />
        {PIPELINE.map((m, i) => (
          <circle key={`j1-${m.id}`} cx={BUS1} cy={cardCY(i)} r={2.2} />
        ))}
        {OUTPUTS.map((g) => (
          <circle key={`j2-${g.id}`} cx={BUS2} cy={GROUP_CY(g)} r={2.6} />
        ))}
      </g>

      {/* flowing data particles */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4, duration: 0.8 }}>
        <circle r={2.6} fill={ORANGE} className="bp-glow">
          <animateMotion dur="2.4s" repeatCount="indefinite" path={`M ${ORIGIN.x + ORIGIN.w} ${O_CY} L ${ENGINE.x} ${E_CY}`} />
        </circle>
        {[0, 2, 4].map((i, k) => (
          <circle key={`p1-${i}`} r={2.2} fill={ORANGE} className="bp-glow">
            <animateMotion
              dur={`${3 + k * 0.5}s`} begin={`${k * 0.8}s`} repeatCount="indefinite"
              path={`M ${ENGINE.x + ENGINE.w} ${E_CY} L ${BUS1} ${E_CY} L ${BUS1} ${cardCY(i)} L ${COL.x} ${cardCY(i)}`}
            />
          </circle>
        ))}
        {[1, 3, 5].map((i, k) => (
          <circle key={`p2-${i}`} r={2} fill={ORANGE} fillOpacity={0.85} className="bp-glow">
            <animateMotion
              dur={`${3.4 + k * 0.4}s`} begin={`${0.6 + k * 0.9}s`} repeatCount="indefinite"
              path={`M ${COL.x + COL.w} ${cardCY(i)} L ${BUS2} ${cardCY(i)} L ${BUS2} ${GROUP_CY(OUTPUTS[k])} L ${GROUP_X} ${GROUP_CY(OUTPUTS[k])}`}
            />
          </circle>
        ))}
      </motion.g>
    </g>
  );
}

/* ------------------------------ annotations ------------------------------- */

function Annotations() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 2.6 }} aria-hidden>
      <g className="bp-annot-g">
        <text x={ORIGIN.x + 8} y={196} className="bp-annot">Everything starts here.</text>
        <path d={`M ${ORIGIN.x + 60} 202 Q ${ORIGIN.x + 68} 210 ${ORIGIN.x + 74} 214`} fill="none" stroke={INK} strokeOpacity={0.22} strokeWidth={1} />
      </g>
      <g className="bp-annot-g">
        <text x={ENGINE.x + 4} y={398} className="bp-annot">Repurpose automatically.</text>
        <path d={`M ${ENGINE.x + 60} 384 Q ${ENGINE.x + 54} 372 ${ENGINE.x + 56} 364`} fill="none" stroke={INK} strokeOpacity={0.22} strokeWidth={1} />
      </g>
      <g className="bp-annot-g">
        <text x={COL.x + 62} y={526} className="bp-annot">Human reviewed. Every piece.</text>
        <path d={`M ${COL.x + 118} 512 Q ${COL.x + 112} 502 ${COL.x + 114} 494`} fill="none" stroke={INK} strokeOpacity={0.22} strokeWidth={1} />
      </g>
      <g className="bp-annot-g">
        <text x={GROUP_X + 62} y={46} className="bp-annot">Publish everywhere.</text>
      </g>
      <g className="bp-annot-g">
        <text x={472} y={124} className="bp-annot">One recording in.</text>
        <path d="M 512 130 Q 500 146 484 160" fill="none" stroke={INK} strokeOpacity={0.22} strokeWidth={1} />
      </g>
    </motion.g>
  );
}

/* ------------------------------ origin card ------------------------------- */

function OriginCard() {
  return (
    <motion.g
      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
    >
      {/* breathing halo */}
      <circle cx={ORIGIN.x + ORIGIN.w / 2} cy={O_CY} r={110} fill={ORANGE} opacity={0.06} className="bp-halo" />
      <rect
        x={ORIGIN.x} y={ORIGIN.y} width={ORIGIN.w} height={ORIGIN.h} rx={20}
        fill="url(#bpOrigin)" filter="url(#bpOriginShadow)"
      />
      <rect x={ORIGIN.x} y={ORIGIN.y} width={ORIGIN.w} height={ORIGIN.h} rx={20} fill="none" stroke="var(--on-accent)" strokeOpacity={0.22} strokeWidth={1} />
      {/* mic icon chip */}
      <circle cx={ORIGIN.x + 36} cy={ORIGIN.y + 36} r={17} fill="color-mix(in oklch, var(--on-accent) 16%, transparent)" stroke="color-mix(in oklch, var(--on-accent) 30%, transparent)" strokeWidth={1} />
      <g fill="none" stroke="var(--on-accent)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"
        transform={`translate(${ORIGIN.x + 36 - 8} ${ORIGIN.y + 36 - 8}) scale(0.667)`}>
        <rect x={9} y={2} width={6} height={12} rx={3} />
        <path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4" />
      </g>
      {/* REC dot */}
      <circle cx={ORIGIN.x + ORIGIN.w - 26} cy={ORIGIN.y + 26} r={4} fill="var(--on-accent)" className="bp-rec" />
      <text x={ORIGIN.x + ORIGIN.w - 36} y={ORIGIN.y + 30} textAnchor="end" className="bp-rec-label">REC</text>
      <text x={ORIGIN.x + 22} y={ORIGIN.y + 82} className="bp-origin-t1">You Record</text>
      <text x={ORIGIN.x + 22} y={ORIGIN.y + 104} className="bp-origin-t1">Once a Week</text>
      <text x={ORIGIN.x + 22} y={ORIGIN.y + ORIGIN.h - 8} className="bp-origin-t2" opacity={0.75}>ONE LONG-FORM SESSION · 45 MIN</text>
    </motion.g>
  );
}

/* ------------------------------ engine module ----------------------------- */

const ENGINE_ROWS = ['Transcribe', 'Repurpose', 'Schedule'];

function EngineModule() {
  return (
    <motion.g
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
    >
      {/* layered card stack */}
      <rect x={ENGINE.x + 10} y={ENGINE.y + 12} width={ENGINE.w} height={ENGINE.h} rx={18} fill="var(--surface)" stroke={INK} strokeOpacity={0.06} />
      <rect x={ENGINE.x + 5} y={ENGINE.y + 6} width={ENGINE.w} height={ENGINE.h} rx={18} fill="var(--surface)" stroke={INK} strokeOpacity={0.08} />
      <rect x={ENGINE.x} y={ENGINE.y} width={ENGINE.w} height={ENGINE.h} rx={18} fill="var(--surface)" stroke={INK} strokeOpacity={0.13} filter="url(#bpCard)" />
      {/* header */}
      <circle cx={ENGINE.x + 22} cy={ENGINE.y + 24} r={3} fill={ORANGE} className="bp-glow" />
      <text x={ENGINE.x + 33} y={ENGINE.y + 28} className="bp-engine-title">SLIDEIN CONTENT ENGINE</text>
      <line x1={ENGINE.x + 18} y1={ENGINE.y + 40} x2={ENGINE.x + ENGINE.w - 18} y2={ENGINE.y + 40} stroke={INK} strokeOpacity={0.08} />
      {/* process rows */}
      {ENGINE_ROWS.map((row, i) => {
        const ry = ENGINE.y + 62 + i * 30;
        return (
          <g key={row}>
            <circle cx={ENGINE.x + 26} cy={ry} r={3.2} fill={ORANGE} className="bp-blink" style={{ animationDelay: `${i * 0.5}s` }} />
            <text x={ENGINE.x + 40} y={ry + 3.5} className="bp-engine-row">{row}</text>
            {/* mini equalizer */}
            <g fill={INK} fillOpacity={0.22}>
              {[0, 1, 2].map((b) => (
                <rect
                  key={b}
                  className="bp-eq"
                  style={{ animationDelay: `${i * 0.3 + b * 0.18}s` }}
                  x={ENGINE.x + ENGINE.w - 44 + b * 9} y={ry - 6} width={3.5} height={12} rx={1.75}
                />
              ))}
            </g>
          </g>
        );
      })}
      {/* footer */}
      <line x1={ENGINE.x + 18} y1={ENGINE.y + ENGINE.h - 26} x2={ENGINE.x + ENGINE.w - 18} y2={ENGINE.y + ENGINE.h - 26} stroke={INK} strokeOpacity={0.08} />
      <circle cx={ENGINE.x + 24} cy={ENGINE.y + ENGINE.h - 13} r={2.6} fill="var(--color-live)" className="bp-blink" />
      <text x={ENGINE.x + 34} y={ENGINE.y + ENGINE.h - 9.5} className="bp-engine-foot">RUNNING · AI + HUMAN IN THE LOOP</text>
    </motion.g>
  );
}

/* ---------------------------- production module --------------------------- */

function ProductionModule({
  m, i, onOpen,
}: { m: Module; i: number; onOpen: (id: string) => void }) {
  const y = cardY(i);
  return (
    <motion.g
      className="bp-mod"
      initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: EASE, delay: 1.35 + i * 0.09 }}
      onClick={() => onOpen(m.serviceId)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen(m.serviceId);
      }}
    >
      <rect className="bp-mod-bg" x={COL.x} y={y} width={COL.w} height={COL.cardH} rx={14}
        fill="var(--surface)" stroke={INK} strokeOpacity={0.11} filter="url(#bpCard)" />
      {/* icon chip */}
      <rect className="bp-mod-chip" x={COL.x + 13} y={y + 13} width={32} height={32} rx={9} fill="color-mix(in oklch, var(--on-surface) 3.5%, transparent)" />
      <g className="bp-mod-icon" transform={`translate(${COL.x + 13 + 7} ${y + 13 + 7}) scale(0.75)`}>
        <ModuleGlyph kind={m.icon} />
      </g>
      <text x={COL.x + 57} y={y + 25} className="bp-mod-title">{m.title}</text>
      <text x={COL.x + 57} y={y + 42} className="bp-mod-desc">{m.desc}</text>
      {/* status */}
      <circle cx={COL.x + COL.w - 45} cy={y + 20} r={2.4} fill={ORANGE} className="bp-blink" style={{ animationDelay: `${i * 0.4}s` }} />
      <text x={COL.x + COL.w - 38} y={y + 23.5} className="bp-mod-status">AUTO</text>
      {/* open hint */}
      <g className="bp-mod-arrow" fill="none" stroke={INK} strokeOpacity={0.3} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={`M ${COL.x + COL.w - 26} ${y + 36} l 5 5 m 0 -5 v 5 h -5`} transform={`rotate(-90 ${COL.x + COL.w - 23.5} ${y + 38.5})`} />
      </g>
    </motion.g>
  );
}

/* ------------------------------ output groups ----------------------------- */

function OutputGroupCard({ g, i }: { g: OutputGroup; i: number }) {
  const n = g.items.length;
  const gap = n === 4 ? 58 : n === 3 ? 70 : 84;
  const startX = GROUP_X + (GROUP_W - (n - 1) * gap) / 2;
  const chipCY = g.y + g.h / 2 + 10;
  return (
    <motion.g
      className="bp-group"
      initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 2.0 + i * 0.12 }}
    >
      <rect x={GROUP_X} y={g.y} width={GROUP_W} height={g.h} rx={16}
        fill="color-mix(in oklch, var(--on-surface) 1.4%, transparent)" stroke={INK} strokeOpacity={0.1} strokeDasharray="3 5" />
      <circle cx={GROUP_X + 18} cy={g.y + 20} r={2.6} fill={ORANGE} />
      <text x={GROUP_X + 28} y={g.y + 24} className="bp-group-title">{g.label.toUpperCase()}</text>
      <text x={GROUP_X + GROUP_W - 16} y={g.y + 24} textAnchor="end" className="bp-group-count">{g.count}</text>
      {g.items.map((item, k) => {
        const cx = startX + k * gap;
        return (
          <g key={item.name} className="bp-chip" style={{ ['--brand' as string]: item.brand }}>
            <circle cx={cx} cy={chipCY} r={17} fill="var(--surface)" stroke={INK} strokeOpacity={0.12} filter="url(#bpCard)" />
            <g className="bp-chip-glyph" transform={`translate(${cx - 8} ${chipCY - 8}) scale(0.667)`}>
              <ChipGlyph item={item} />
            </g>
            <text x={cx} y={chipCY + 31} textAnchor="middle" className="bp-chip-label">{item.name}</text>
          </g>
        );
      })}
    </motion.g>
  );
}

/* --------------------------------- slide ---------------------------------- */

export default function OrbitSlide({ onOpenService }: { onOpenService: (id: string) => void }) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center"
      >
        <p className="text-[11px] md:text-xs font-bold tracking-[0.14em] uppercase text-[var(--accent)]">The Content System</p>
        <h2 className="mt-1.5 display-headline text-[clamp(1.3rem,2.6vw,1.9rem)] text-[var(--on-surface)]">
          One recording becomes an <span className="text-[var(--accent)]">entire content ecosystem</span>.
        </h2>
      </motion.div>

      {/* blueprint canvas */}
      <div className="relative w-full max-w-[1080px] mt-2">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          className="block h-auto w-full"
          role="img"
          aria-label="The content system blueprint: you record once a week, the SlideIn content engine turns it into show notes, an edited episode, a thumbnail, short clips, full articles and LinkedIn posts, then publishes to video, social and owned channels."
        >
          <defs>
            <pattern id="bpDots" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="color-mix(in oklch, var(--on-surface) 5%, transparent)" />
            </pattern>
            <linearGradient id="bpOrigin" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-brand-lift)" />
              <stop offset="55%" stopColor={ORANGE} />
              <stop offset="100%" stopColor="var(--color-ember)" />
            </linearGradient>
            <filter id="bpOriginShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="var(--color-ember)" floodOpacity="0.3" />
            </filter>
            <filter id="bpCard" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={INK} floodOpacity="0.07" />
            </filter>
          </defs>

          {/* canvas texture */}
          <rect width={VB.w} height={VB.h} fill="url(#bpDots)" opacity={0.7} />
          <BlueprintChrome />
          <SectionLabels />

          <Connectors />
          <OriginCard />
          <EngineModule />
          {PIPELINE.map((m, i) => (
            <ProductionModule key={m.id} m={m} i={i} onOpen={onOpenService} />
          ))}
          {OUTPUTS.map((g, i) => (
            <OutputGroupCard key={g.id} g={g} i={i} />
          ))}
          <Annotations />
        </svg>
      </div>

      {/* scoped styles */}
      <style>{`
        .bp-section { font-size: 9.5px; letter-spacing: .22em; fill: color-mix(in oklch, var(--on-surface) 38%, transparent); font-weight: 700; }
        .bp-annot { font-size: 12px; fill: color-mix(in oklch, var(--on-surface) 40%, transparent); font-style: italic; font-family: ui-serif, Georgia, serif; }

        .bp-origin-t1 { font-size: 19px; font-weight: 800; fill: var(--on-accent); letter-spacing: -0.01em; }
        .bp-origin-t2 { font-size: 8.5px; font-weight: 600; fill: var(--on-accent); letter-spacing: .18em; }
        .bp-rec-label { font-size: 8px; font-weight: 700; fill: color-mix(in oklch, var(--on-accent) 80%, transparent); letter-spacing: .2em; }

        .bp-engine-title { font-size: 9.5px; letter-spacing: .18em; fill: ${INK}; font-weight: 800; }
        .bp-engine-row { font-size: 11px; fill: color-mix(in oklch, var(--on-surface) 72%, transparent); font-weight: 600; }
        .bp-engine-foot { font-size: 7.5px; letter-spacing: .14em; fill: color-mix(in oklch, var(--on-surface) 40%, transparent); font-weight: 700; }

        .bp-mod { cursor: pointer; }
        .bp-mod-bg, .bp-mod-chip, .bp-mod-icon, .bp-mod-arrow { transition: all .3s cubic-bezier(.22,1,.36,1); }
        .bp-mod-icon { color: color-mix(in oklch, var(--on-surface) 70%, transparent); }
        .bp-mod:hover .bp-mod-bg { stroke: ${ORANGE}; stroke-opacity: .55; }
        .bp-mod:hover .bp-mod-chip { fill: color-mix(in oklch, var(--accent-vivid) 9%, transparent); }
        .bp-mod:hover .bp-mod-icon { color: ${ORANGE}; }
        .bp-mod:hover .bp-mod-arrow { stroke: ${ORANGE}; stroke-opacity: .8; }
        .bp-mod-title { font-size: 12px; font-weight: 800; fill: ${INK}; }
        .bp-mod-desc { font-size: 9.5px; fill: color-mix(in oklch, var(--on-surface) 45%, transparent); font-weight: 500; }
        .bp-mod-status { font-size: 7.5px; letter-spacing: .16em; fill: color-mix(in oklch, var(--on-surface) 35%, transparent); font-weight: 700; }

        .bp-group-title { font-size: 9.5px; letter-spacing: .2em; fill: color-mix(in oklch, var(--on-surface) 55%, transparent); font-weight: 800; }
        .bp-group-count { font-size: 9.5px; letter-spacing: .12em; fill: color-mix(in oklch, var(--on-surface) 25%, transparent); font-weight: 700; }
        .bp-chip-glyph { color: color-mix(in oklch, var(--on-surface) 60%, transparent); transition: color .3s ease; }
        .bp-chip { cursor: default; }
        .bp-chip:hover .bp-chip-glyph { color: var(--brand); }
        .bp-chip > circle { transition: transform .3s cubic-bezier(.22,1,.36,1); transform-box: fill-box; transform-origin: center; }
        .bp-chip:hover > circle { transform: scale(1.1); }
        .bp-chip-label { font-size: 8.5px; fill: color-mix(in oklch, var(--on-surface) 50%, transparent); font-weight: 600; letter-spacing: .03em; }

        .bp-glow { filter: drop-shadow(0 0 3px color-mix(in oklch, var(--accent-vivid) 55%, transparent)); }
        .bp-halo { transform-box: fill-box; transform-origin: center; animation: bpHalo 4.6s ease-in-out infinite; }
        @keyframes bpHalo { 0%,100% { transform: scale(1); opacity: .06; } 50% { transform: scale(1.08); opacity: .1; } }
        .bp-rec { transform-box: fill-box; transform-origin: center; animation: bpRec 1.8s ease-in-out infinite; }
        @keyframes bpRec { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
        .bp-blink { animation: bpBlink 2.2s ease-in-out infinite; }
        @keyframes bpBlink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        .bp-eq { transform-box: fill-box; transform-origin: center bottom; animation: bpEq 1.1s ease-in-out infinite; }
        @keyframes bpEq { 0%,100% { transform: scaleY(.35); } 50% { transform: scaleY(1); } }

        @media (prefers-reduced-motion: reduce) {
          .bp-halo, .bp-rec, .bp-blink, .bp-eq { animation: none; }
        }
      `}</style>
    </div>
  );
}
