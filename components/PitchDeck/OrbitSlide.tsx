'use client';

/**
 * CHAPTER 03 — THE CONTENT SYSTEM · ONE IN. NINE OUT.
 * ---------------------------------------------------------------------------
 * Read top to bottom:
 *
 *   01 ORIGIN      one orange focal card — "You Record Once a Week"
 *   02 PRODUCTION  six output modules (click → service modal)
 *   03 PUBLISH     grouped destinations (video & audio / social / owned)
 *
 * WHY IT TURNED NINETY DEGREES — see the header of FrameworkFlowSlide.tsx.
 * Same move, same reason: cards in DOM, wires in one measured SVG overlay
 * (flow/FlowCanvas.tsx), single column at every breakpoint.
 *
 * THE TWO GUTTERS
 * A vertical column has two channels to run wire in, and this diagram uses
 * both to keep three different relationships apart:
 *
 *   left,  above routing   the DISTRIBUTION bus — one recording reaching six
 *                          modules that all run in parallel
 *   right, above routing   the GATHER — six finished assets converging on one
 *                          routing decision
 *   left,  below routing   the FAN — one decision reaching nine destinations
 *
 * Wire that crosses a card is wire nobody can follow. Everything that has to
 * travel more than one card's distance travels in a gutter.
 */

import { useCallback } from 'react';
import FlowCanvas, {
  useFlowNode,
  type FlowNodes,
  type FlowPath,
  type FlowSize,
} from '@/components/PitchDeck/flow/FlowCanvas';

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

/* ------------------------------ pipeline data ----------------------------- */

type Module = {
  id: string;
  serviceId: string;
  title: string;
  desc: string;
  turnaround: string;
  icon: 'notes' | 'film' | 'image' | 'play' | 'doc' | 'linkedin';
};

const PIPELINE: Module[] = [
  { id: 'show-notes', serviceId: 'c-notes', title: 'Show Notes', desc: 'Timestamped, ready to publish', turnaround: '2 HRS', icon: 'notes' },
  { id: 'edited-episode', serviceId: 'c-audio', title: 'Edited Episode', desc: 'Trimmed, balanced, mastered', turnaround: '24 HRS', icon: 'film' },
  { id: 'thumbnail', serviceId: 'c-thumbnails', title: 'Thumbnail', desc: 'One look, reused every episode', turnaround: '4 HRS', icon: 'image' },
  { id: 'short-clips', serviceId: 'c-clips', title: 'Short Clips', desc: 'Captioned 30 to 60s cuts', turnaround: '24 HRS', icon: 'play' },
  { id: 'full-articles', serviceId: 'c-blog', title: 'Full Articles', desc: 'Rewritten in your voice', turnaround: '24 HRS', icon: 'doc' },
  { id: 'linkedin-posts', serviceId: 'c-social', title: 'LinkedIn Posts', desc: 'From what you actually said', turnaround: '4 HRS', icon: 'linkedin' },
];

type OutputGroup = {
  id: string;
  label: string;
  count: string;
  items: { name: string; brand: string; logo?: string; strokeIcon?: 'globe' | 'mail' }[];
};

const OUTPUTS: OutputGroup[] = [
  {
    id: 'video',
    label: 'Video & Audio',
    count: '03',
    items: [
      { name: 'YouTube', brand: '#FF0000', logo: LOGOS.youtube },
      { name: 'Spotify', brand: '#1ED760', logo: LOGOS.spotify },
      { name: 'Podcasts', brand: '#9933CC', logo: LOGOS.applepodcasts },
    ],
  },
  {
    id: 'social',
    label: 'Social',
    count: '04',
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
    items: [
      { name: 'Website', brand: 'var(--accent-vivid)', strokeIcon: 'globe' },
      { name: 'Newsletter', brand: 'var(--accent-vivid)', strokeIcon: 'mail' },
    ],
  },
];

/* ------------------------------ tiny icons -------------------------------- */

function ModuleGlyph({ kind }: { kind: Module['icon'] }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden>
      {kind === 'notes' && (
        <g {...s}>
          <rect x={4} y={3} width={16} height={18} rx={2.5} />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </g>
      )}
      {kind === 'film' && (
        <g {...s}>
          <rect x={3} y={5} width={18} height={14} rx={2.5} />
          <path d="M7 5v14M17 5v14M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4" />
        </g>
      )}
      {kind === 'image' && (
        <g {...s}>
          <rect x={3} y={4} width={18} height={16} rx={2.5} />
          <circle cx={8.7} cy={9.5} r={1.7} />
          <path d="m21 15.6-4.4-4.4L6 21" />
        </g>
      )}
      {kind === 'play' && (
        <g {...s}>
          <rect x={3} y={3} width={18} height={18} rx={4.5} />
          <path d="M10 8.6v6.8l5.6-3.4z" />
        </g>
      )}
      {kind === 'doc' && (
        <g {...s}>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v4h4M9 12h6M9 16h6" />
        </g>
      )}
      {kind === 'linkedin' && <path d={LOGOS.linkedin} fill="currentColor" transform="scale(0.9) translate(1.3 1.3)" />}
    </svg>
  );
}

function ChipGlyph({ item }: { item: OutputGroup['items'][number] }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden>
      {item.logo && <path d={item.logo} fill="currentColor" />}
      {item.strokeIcon === 'globe' && (
        <g {...s}>
          <circle cx={12} cy={12} r={10} />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </g>
      )}
      {item.strokeIcon === 'mail' && (
        <g {...s}>
          <rect x={2} y={4} width={20} height={16} rx={2.5} />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </g>
      )}
    </svg>
  );
}

/* ------------------------------- the wires -------------------------------- */

/** Out of a card's bottom edge, swung into a gutter, then straight down it.
 *  One continuous path so a pulse can ride the whole run without a seam. */
function intoGutter(fromX: number, fromY: number, gutterX: number, toY: number) {
  const bend = 46;
  return `M ${fromX.toFixed(1)} ${fromY.toFixed(1)} C ${fromX.toFixed(1)} ${(fromY + bend).toFixed(1)}, ${gutterX.toFixed(1)} ${(fromY + 8).toFixed(1)}, ${gutterX.toFixed(1)} ${(fromY + bend).toFixed(1)} V ${toY.toFixed(1)}`;
}

/** Out of a gutter, up into a card's bottom edge — the gather's last move. */
function outOfGutter(gutterX: number, fromY: number, toX: number, toY: number) {
  const bend = 46;
  return `M ${gutterX.toFixed(1)} ${fromY.toFixed(1)} V ${(toY - bend).toFixed(1)} C ${gutterX.toFixed(1)} ${(toY - 8).toFixed(1)}, ${toX.toFixed(1)} ${(toY - bend).toFixed(1)}, ${toX.toFixed(1)} ${toY.toFixed(1)}`;
}

const stub = (x1: number, y: number, x2: number) =>
  `M ${x1.toFixed(1)} ${y.toFixed(1)} H ${x2.toFixed(1)}`;

function contentPaths(n: FlowNodes, size: FlowSize): FlowPath[] {
  const out: FlowPath[] = [];
  const origin = n.origin;
  const routing = n.routing;
  const first = n[`m-${PIPELINE[0].id}`];
  const last = n[`m-${PIPELINE[PIPELINE.length - 1].id}`];
  if (!origin || !first || !last) return out;

  const pad = first.left;
  const gL = Math.max(6, pad * 0.45);
  const gR = size.w - Math.max(6, pad * 0.45);

  /* left gutter — one recording reaching six modules in parallel */
  out.push({ id: 'bus-in', d: intoGutter(origin.cx, origin.bottom, gL, last.cy) });
  PIPELINE.forEach((m) => {
    const c = n[`m-${m.id}`];
    if (c) out.push({ id: `feed-${m.id}`, d: stub(gL, c.cy, c.left), opacity: 0.12 });
  });

  if (!routing) return out;

  /* right gutter — six finished assets converging on one routing decision */
  out.push({ id: 'gather', d: outOfGutter(gR, first.cy, routing.cx, routing.top) });
  PIPELINE.forEach((m) => {
    const c = n[`m-${m.id}`];
    if (c) out.push({ id: `gather-${m.id}`, d: stub(c.right, c.cy, gR), opacity: 0.12 });
  });

  /* left gutter again, below routing — one decision reaching nine places */
  const groups = OUTPUTS.map((g) => n[`g-${g.id}`]).filter(Boolean);
  const lastGroup = groups[groups.length - 1];
  if (lastGroup) {
    out.push({ id: 'fan', d: intoGutter(routing.cx, routing.bottom, gL, lastGroup.cy), hot: true });
    OUTPUTS.forEach((g) => {
      const c = n[`g-${g.id}`];
      if (c) out.push({ id: `fan-${g.id}`, d: stub(gL, c.cy, c.left), hot: true, opacity: 0.28, width: 1.3 });
    });
  }

  return out;
}

/* --------------------------------- parts ---------------------------------- */

function StageLabel({ children }: { children: string }) {
  return (
    <p className="cs-stage">
      <span className="cs-stage-tick" aria-hidden />
      {children.toUpperCase()}
    </p>
  );
}

function OriginCard() {
  return (
    <div ref={useFlowNode('origin')} data-flow-node="origin" className="cs-origin">
      <div className="flex items-start gap-4">
        <span className="cs-origin-chip" aria-hidden>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
            <rect x={9} y={2} width={6} height={12} rx={3} />
            <path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="cs-origin-title">You Record Once a Week</p>
          <p className="cs-origin-meta">ONE LONG-FORM SESSION · 45 MIN</p>
        </div>
        <span className="cs-rec">
          <span className="cs-rec-dot" aria-hidden />
          REC
        </span>
      </div>
    </div>
  );
}

function ProductionModule({ m, onOpen }: { m: Module; onOpen: (id: string) => void }) {
  return (
    <button
      ref={useFlowNode(`m-${m.id}`)}
      data-flow-node={`m-${m.id}`}
      type="button"
      onClick={() => onOpen(m.serviceId)}
      className="cs-mod group"
    >
      <span className="cs-mod-chip" aria-hidden>
        <ModuleGlyph kind={m.icon} />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="cs-mod-title">{m.title}</span>
        <span className="cs-mod-desc">{m.desc}</span>
      </span>
      <span className="cs-mod-meta">
        <span className="cs-blink cs-mod-dot" aria-hidden />
        {m.turnaround}
      </span>
      <span className="cs-mod-open" aria-hidden>
        <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      </span>
    </button>
  );
}

function RoutingNode() {
  return (
    /* The label sits BESIDE the node, not under it. Under it is exactly where
       the fan leaves for the left gutter, and a caption with a wire drawn
       through it reads as a rendering bug. */
    <div className="relative flex items-center justify-center py-14">
      <span ref={useFlowNode('routing')} data-flow-node="routing" className="cs-junction" aria-hidden>
        <span className="cs-junction-ring" />
        <span className="cs-junction-core" />
      </span>
      {/* Absolute, so the node itself stays exactly on the column's centre
          line — every wire in this diagram is aimed at that line. */}
      <span className="cs-junction-label absolute left-1/2 ml-5 whitespace-nowrap">SMART ROUTING</span>
    </div>
  );
}

function OutputGroupCard({ g }: { g: OutputGroup }) {
  return (
    <div ref={useFlowNode(`g-${g.id}`)} data-flow-node={`g-${g.id}`} className="cs-group">
      <div className="mb-3 flex items-center gap-2">
        <span className="cs-group-tick" aria-hidden />
        <span className="cs-group-title">{g.label.toUpperCase()}</span>
        <span className="cs-group-count">{g.count}</span>
      </div>
      <div className="flex flex-wrap items-start gap-x-5 gap-y-3">
        {g.items.map((item) => (
          <span key={item.name} className="cs-chip" style={{ ['--brand' as string]: item.brand }}>
            <span className="cs-chip-ring" aria-hidden>
              <ChipGlyph item={item} />
            </span>
            <span className="cs-chip-label">{item.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- slide ---------------------------------- */

export default function OrbitSlide({ onOpenService }: { onOpenService: (id: string) => void }) {
  const paths = useCallback((n: FlowNodes, size: FlowSize) => contentPaths(n, size), []);

  return (
    <div className="cs w-full max-w-165">
      <h3 className="font-display-md mb-8 text-[clamp(1.6rem,4vw,2.4rem)] text-(--on-surface)">
        One in. Nine out.
      </h3>

      <FlowCanvas paths={paths} stackClassName="px-8 sm:px-12 md:px-14">
        <StageLabel>01 · Origin</StageLabel>
        <OriginCard />

        <div className="mt-19">
          <StageLabel>02 · Production</StageLabel>
          <div className="flex flex-col gap-3">
            {PIPELINE.map((m) => (
              <ProductionModule key={m.id} m={m} onOpen={onOpenService} />
            ))}
          </div>
        </div>

        <RoutingNode />

        <StageLabel>03 · Publish</StageLabel>
        <div className="flex flex-col gap-4">
          {OUTPUTS.map((g) => (
            <OutputGroupCard key={g.id} g={g} />
          ))}
        </div>

        <p className="cs-foot">
          <span className="cs-foot-rule" aria-hidden />
          HUMAN REVIEWED. EVERY PIECE.
        </p>
      </FlowCanvas>

      <style>{`
        /* ── stage labels ───────────────────────────────────────────────── */
        .cs .cs-stage {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: .22em;
          color: color-mix(in oklch, var(--on-surface) 38%, transparent);
        }
        .cs .cs-stage-tick {
          width: 2px;
          height: 10px;
          border-radius: var(--radius-pill);
          background: color-mix(in oklch, var(--accent-vivid) 80%, transparent);
        }

        /* ── the origin ─────────────────────────────────────────────────── */
        .cs .cs-origin {
          position: relative;
          border-radius: var(--radius-md);
          padding: 20px;
          background: linear-gradient(135deg, var(--color-brand-lift), var(--accent-vivid) 55%, var(--color-ember));
          box-shadow: 0 14px 30px color-mix(in oklch, var(--color-ember) 26%, transparent);
          border: 1px solid color-mix(in oklch, var(--on-accent) 22%, transparent);
        }
        .cs .cs-origin-chip {
          display: grid;
          place-items: center;
          flex: none;
          width: 42px;
          height: 42px;
          border-radius: var(--radius-pill);
          background: color-mix(in oklch, var(--on-accent) 16%, transparent);
          border: 1px solid color-mix(in oklch, var(--on-accent) 30%, transparent);
          color: var(--on-accent);
        }
        .cs .cs-origin-title {
          font-size: clamp(1.05rem, 3vw, 1.35rem);
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--on-accent);
        }
        .cs .cs-origin-meta {
          margin-top: 6px;
          font-size: 8.5px;
          font-weight: 600;
          letter-spacing: .18em;
          color: color-mix(in oklch, var(--on-accent) 78%, transparent);
        }
        .cs .cs-rec {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex: none;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .2em;
          color: color-mix(in oklch, var(--on-accent) 80%, transparent);
        }
        .cs .cs-rec-dot {
          width: 7px;
          height: 7px;
          border-radius: var(--radius-pill);
          background: var(--on-accent);
          animation: csRec 1.8s ease-in-out infinite;
        }

        /* ── production modules ─────────────────────────────────────────── */
        .cs .cs-mod {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          background: var(--surface);
          border: 1px solid color-mix(in oklch, var(--on-surface) 11%, transparent);
          box-shadow: 0 4px 12px color-mix(in oklch, var(--on-surface) 6%, transparent);
          cursor: pointer;
          transition: border-color var(--dur-base) var(--ease-expo),
                      box-shadow var(--dur-base) var(--ease-expo),
                      transform var(--dur-base) var(--ease-expo);
        }
        .cs .cs-mod:hover {
          border-color: color-mix(in oklch, var(--accent-vivid) 55%, transparent);
          box-shadow: 0 8px 20px color-mix(in oklch, var(--accent-vivid) 10%, transparent);
          transform: translateY(-2px);
        }
        .cs .cs-mod-chip {
          display: grid;
          place-items: center;
          flex: none;
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: color-mix(in oklch, var(--on-surface) 3.5%, transparent);
          color: color-mix(in oklch, var(--on-surface) 70%, transparent);
          transition: background var(--dur-base) var(--ease-expo), color var(--dur-base) var(--ease-expo);
        }
        .cs .cs-mod:hover .cs-mod-chip { background: color-mix(in oklch, var(--accent-vivid) 9%, transparent); color: var(--accent-vivid); }
        .cs .cs-mod-title { display: block; font-size: 13.5px; font-weight: 800; color: var(--on-surface); }
        .cs .cs-mod-desc { display: block; margin-top: 2px; font-size: 10.5px; font-weight: 500; color: color-mix(in oklch, var(--on-surface) 45%, transparent); }
        .cs .cs-mod-meta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex: none;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .16em;
          font-variant-numeric: tabular-nums;
          color: color-mix(in oklch, var(--on-surface) 35%, transparent);
        }
        .cs .cs-mod-dot { width: 5px; height: 5px; border-radius: var(--radius-pill); background: var(--accent-vivid); }
        .cs .cs-mod-open {
          display: grid;
          place-items: center;
          flex: none;
          width: 18px;
          height: 18px;
          border-radius: 6px;
          border: 1px solid var(--rule-strong);
          color: color-mix(in oklch, var(--on-surface) 40%, transparent);
          transition: all var(--dur-base) var(--ease-expo);
        }
        .cs .cs-mod:hover .cs-mod-open {
          border-color: color-mix(in oklch, var(--accent-vivid) 60%, transparent);
          background: color-mix(in oklch, var(--accent-vivid) 10%, transparent);
          color: var(--accent-vivid);
        }

        /* ── routing junction ───────────────────────────────────────────── */
        .cs .cs-junction { position: relative; display: grid; place-items: center; width: 28px; height: 28px; }
        .cs .cs-junction-ring {
          position: absolute;
          inset: 0;
          border-radius: var(--radius-pill);
          border: 1px dashed color-mix(in oklch, var(--accent-vivid) 38%, transparent);
          background: var(--surface);
          animation: csSpin 14s linear infinite;
        }
        .cs .cs-junction-core {
          position: relative;
          width: 10px;
          height: 10px;
          border-radius: var(--radius-pill);
          background: var(--accent-vivid);
          filter: drop-shadow(0 0 3px color-mix(in oklch, var(--accent-vivid) 55%, transparent));
        }
        .cs .cs-junction-label {
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .2em;
          color: color-mix(in oklch, var(--on-surface) 40%, transparent);
        }

        /* ── destination groups ─────────────────────────────────────────── */
        .cs .cs-group {
          border-radius: var(--radius-md);
          padding: 16px 18px;
          background: color-mix(in oklch, var(--on-surface) 1.4%, transparent);
          border: 1px dashed color-mix(in oklch, var(--on-surface) 12%, transparent);
        }
        .cs .cs-group-tick { width: 6px; height: 6px; border-radius: var(--radius-pill); background: var(--accent-vivid); }
        .cs .cs-group-title { font-size: 9.5px; font-weight: 800; letter-spacing: .2em; color: color-mix(in oklch, var(--on-surface) 55%, transparent); }
        .cs .cs-group-count {
          margin-left: auto;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: .12em;
          font-variant-numeric: tabular-nums;
          color: color-mix(in oklch, var(--on-surface) 25%, transparent);
        }
        .cs .cs-chip { display: inline-flex; flex-direction: column; align-items: center; gap: 6px; width: 62px; }
        .cs .cs-chip-ring {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-pill);
          background: var(--surface);
          border: 1px solid color-mix(in oklch, var(--on-surface) 11%, transparent);
          box-shadow: 0 4px 10px color-mix(in oklch, var(--on-surface) 6%, transparent);
          color: color-mix(in oklch, var(--on-surface) 60%, transparent);
          transition: transform var(--dur-base) var(--ease-expo), color var(--dur-base) var(--ease-expo);
        }
        .cs .cs-chip:hover .cs-chip-ring { transform: scale(1.1); color: var(--brand); }
        .cs .cs-chip-label {
          font-size: 8.5px;
          font-weight: 600;
          letter-spacing: .03em;
          text-align: center;
          color: color-mix(in oklch, var(--on-surface) 50%, transparent);
        }

        /* ── footnote ───────────────────────────────────────────────────── */
        .cs .cs-foot {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 28px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .2em;
          color: color-mix(in oklch, var(--on-surface) 42%, transparent);
        }
        .cs .cs-foot-rule { width: 22px; height: 1.5px; border-radius: var(--radius-pill); background: color-mix(in oklch, var(--accent-vivid) 70%, transparent); }

        .cs .cs-blink { animation: csBlink 2.2s ease-in-out infinite; }
        @keyframes csBlink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        @keyframes csRec { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
        @keyframes csSpin { to { transform: rotate(360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .cs .cs-blink, .cs .cs-rec-dot, .cs .cs-junction-ring { animation: none; }
        }
      `}</style>
    </div>
  );
}
