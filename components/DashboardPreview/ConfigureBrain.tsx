'use client';

/**
 * CONFIGURE SCENE — one brain, six inputs
 * ---------------------------------------------------------------------------
 * Six things the client can tell us about their business, six strings, one
 * brain at the middle. That is the whole claim the section has to make, so
 * nothing else is on screen: no sub-lists under the categories, no repeat of
 * the pipeline stages (the sidebar already carries those), no status copy.
 *
 * As a fragment arrives the brain briefly brightens — the one piece of state
 * worth showing is that the shared context is being fed and gets stronger.
 *
 * The brain artwork is the same high-craft vector the Playbook uses, lifted out
 * of its 340x290 pedestal so it can sit at scene scale. Gradient ids are
 * prefixed so the two copies can coexist on one page.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import { DocIcon, ShieldIcon, SlashIcon, StackIcon, UserIcon, UsersIcon } from '@/components/Sections/icons';
import { CONFIGURE_FEEDS } from '@/content/home';

interface Feed {
  id: string;
  label: string;
  angle: number;
  Icon: (p: { size?: string }) => React.ReactElement;
}

/* Angle 0 is the right-hand node; the rest step round clockwise. */
const FEEDS: Feed[] = [
  { id: 'knowledge', label: CONFIGURE_FEEDS[0], angle: 0, Icon: DocIcon },
  { id: 'offers', label: CONFIGURE_FEEDS[1], angle: 60, Icon: StackIcon },
  { id: 'profile', label: CONFIGURE_FEEDS[2], angle: 120, Icon: UserIcon },
  { id: 'icp', label: CONFIGURE_FEEDS[3], angle: 180, Icon: UsersIcon },
  { id: 'exclusions', label: CONFIGURE_FEEDS[4], angle: 240, Icon: SlashIcon },
  { id: 'rules', label: CONFIGURE_FEEDS[5], angle: 300, Icon: ShieldIcon },
];

const round = (n: number) => Math.round(n * 100) / 100;

/* Elliptical placement in percent of the scene box, so the ring reflows with
   the panel instead of needing a second set of breakpoints. Percentages are
   rounded because the raw float serialises differently on the server pass
   than on the client, which React reports as a hydration mismatch. */
const RX = 39;
const RY = 33;

const spot = (angle: number) => {
  const t = (angle * Math.PI) / 180;
  return { left: round(50 + RX * Math.cos(t)), top: round(50 - RY * Math.sin(t)) };
};

interface Geo {
  w: number;
  h: number;
  strings: string[];
}

const EMPTY: Geo = { w: 0, h: 0, strings: [] };

export default function ConfigureBrain() {
  const rootRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [geo, setGeo] = useState<Geo>(EMPTY);

  const measure = useCallback(() => {
    const root = rootRef.current;
    const hub = root && hubRef.current;
    if (!root || !hub) return;
    const rr = root.getBoundingClientRect();
    const hr = hub.getBoundingClientRect();
    const cx = round(hr.left - rr.left + hr.width / 2);
    const cy = round(hr.top - rr.top + hr.height / 2);

    const strings = FEEDS.map((f) => {
      const el = nodeRefs.current[f.id];
      if (!el) return '';
      const nr = el.getBoundingClientRect();
      const nx = round(nr.left - rr.left + nr.width / 2);
      const ny = round(nr.top - rr.top + nr.height / 2);
      /* land on the brain's own edge, pulled back by the art's half-width so
         the line stops at the silhouette rather than under it */
      const r = hr.width / 2;
      const t = Math.atan2(ny - cy, nx - cx);
      return `M ${nx} ${ny} Q ${round(cx + Math.cos(t) * r * 0.62)} ${round(cy + Math.sin(t) * r * 0.62)}, ${round(cx + Math.cos(t) * r * 0.92)} ${round(cy + Math.sin(t) * r * 0.92)}`;
    });

    setGeo({ w: round(rr.width), h: round(rr.height), strings });
  }, []);

  useLayoutEffect(() => {
    measure();
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(root);
    if (hubRef.current) ro.observe(hubRef.current);
    Object.values(nodeRefs.current).forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    if (!geo.w) return;
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<SVGPathElement>('[data-string]');
      const packets = gsap.utils.toArray<SVGPathElement>('[data-packet]');
      const nodes = gsap.utils.toArray<HTMLElement>('[data-feed-node]');

      if (reduce) {
        gsap.set(lines, { opacity: 1, strokeDashoffset: 0 });
        gsap.set(nodes, { opacity: 1, scale: 1 });
        gsap.set('[data-hub]', { opacity: 1, scale: 1 });
        gsap.set(packets, { opacity: 0 });
        return;
      }

      const lens = lines.map((l) => l.getTotalLength());
      const plens = packets.map((l) => l.getTotalLength());

      lines.forEach((l, i) => gsap.set(l, { strokeDasharray: lens[i], strokeDashoffset: lens[i], opacity: 1 }));
      gsap.set(nodes, { opacity: 1, scale: 1 });
      gsap.set(packets, { opacity: 0 });

      /* entrance: the brain is already there, the inputs arrive and tie in */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('[data-hub]', { opacity: 0, scale: 0.9, duration: 0.5, transformOrigin: '50% 50%' }, 0)
        .from(nodes, { opacity: 0, scale: 0.86, duration: 0.34, stagger: 0.07, transformOrigin: '50% 50%' }, 0.16);
      lines.forEach((_, i) => {
        tl.to(lines[i], { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }, 0.42 + i * 0.08);
      });

      /* the living part — a fragment runs each string, the brain takes it in */
      const cycle = gsap.timeline({ repeat: -1, repeatDelay: 5.6, delay: 2.2 });

      FEEDS.forEach((_, i) => {
        const at = i * 0.55;
        const L = plens[i] || 1;
        cycle
          .set(packets[i], { opacity: 1, strokeDasharray: `10 ${L + 10}`, strokeDashoffset: 10 }, at)
          .to(packets[i], { strokeDashoffset: -(L + 10), duration: 0.8, ease: 'power1.inOut' }, at)
          .set(packets[i], { opacity: 0, strokeDasharray: `10 ${L + 10}` }, at + 0.82)
          .to(`[data-feed-node="${FEEDS[i].id}"]`, { scale: 1.06, duration: 0.2, ease: 'power2.out', transformOrigin: '50% 50%' }, at)
          .to(`[data-feed-node="${FEEDS[i].id}"]`, { scale: 1, duration: 0.38, ease: 'power2.inOut' }, at + 0.22);
      });

      /* the brain getting stronger as it takes the six in */
      cycle
        .to('[data-hub]', { scale: 1.035, duration: 0.42, ease: 'sine.inOut', transformOrigin: '50% 50%' }, 1.5)
        .to('[data-hub]', { scale: 1, duration: 0.9, ease: 'sine.inOut', transformOrigin: '50% 50%' }, 1.92)
        .fromTo('[data-aura]', { opacity: 0.25 }, { opacity: 0.9, duration: 0.5, ease: 'sine.inOut' }, 1.5)
        .to('[data-aura]', { opacity: 0.25, duration: 1.5, ease: 'sine.inOut' }, 2.0)
        .fromTo('[data-core]', { opacity: 0.5 }, { opacity: 1, duration: 0.5 }, 1.5)
        .to('[data-core]', { opacity: 0.5, duration: 1.6 }, 2.0);
    }, root);

    return () => ctx.revert();
  }, [geo.w, geo.h]);

  return (
    <div ref={rootRef} data-brain-root className="relative h-full w-full">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${geo.w} ${geo.h}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        {FEEDS.map((f, i) => (
          <path
            key={`s-${f.id}`}
            data-string
            d={geo.strings[i] ?? ''}
            fill="none"
            stroke="rgba(10,10,10,0.16)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        ))}
        {FEEDS.map((f, i) => (
          <path
            key={`p-${f.id}`}
            data-packet
            d={geo.strings[i] ?? ''}
            fill="none"
            stroke="var(--scaffold-accent)"
            strokeWidth="1.75"
            strokeLinecap="round"
            opacity={0}
          />
        ))}
      </svg>

      {/* the brain */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span
          data-aura
          className="pointer-events-none absolute left-1/2 top-1/2 -ml-[132px] -mt-[132px] h-[264px] w-[264px] rounded-full"
          style={{ background: 'radial-gradient(circle, var(--scaffold-accent-row) 0%, transparent 68%)' }}
        />
        <div ref={hubRef} data-hub className="relative flex items-center justify-center">
          <svg viewBox="0 0 280 240" className="relative h-auto w-[236px] overflow-visible">
          <svg
          data-brain-art
          viewBox="0 0 280 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          >
          <defs>
          <linearGradient id="ocCortexL" x1="40" y1="20" x2="140" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0.05" />
          <stop offset="60%" stopColor="#0A0A0A" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0.005" />
          </linearGradient>
          <linearGradient id="ocCortexR" x1="240" y1="20" x2="140" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0.05" />
          <stop offset="60%" stopColor="#0A0A0A" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0.005" />
          </linearGradient>
          <radialGradient id="ocThalamus" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--scaffold-accent)" stopOpacity="0.45" />
          <stop offset="50%" stopColor="var(--scaffold-accent)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--scaffold-accent)" stopOpacity="0" />
          </radialGradient>
          </defs>
          {/* Left Hemisphere Lobe Silhouette Fill */}
          <path
          data-lobe
          d="M 140 38
          C 122 14, 88 16, 70 38
          C 48 44, 36 72, 44 98
          C 32 116, 40 144, 56 158
          C 50 178, 68 198, 92 196
          C 114 194, 130 180, 140 170 Z"
          fill="url(#ocCortexL)"
          />
          {/* Right Hemisphere Lobe Silhouette Fill */}
          <path
          data-lobe
          d="M 140 38
          C 158 14, 192 16, 210 38
          C 232 44, 244 72, 236 98
          C 248 116, 240 144, 224 158
          C 230 178, 212 198, 188 196
          C 166 194, 150 180, 140 170 Z"
          fill="url(#ocCortexR)"
          />
          {/* Left Hemisphere Outer Lobular Outline */}
          <path
          data-cortex
          d="M 140 40
          C 122 16, 88 18, 70 40
          C 48 46, 36 74, 44 100
          C 32 118, 40 146, 56 160
          C 50 180, 68 200, 92 198
          C 114 196, 130 182, 140 172"
          stroke="#0A0A0A"
          strokeWidth="2.5"
          strokeLinecap="round"
          />
          {/* Right Hemisphere Outer Lobular Outline */}
          <path
          data-cortex
          d="M 140 40
          C 158 16, 192 18, 210 40
          C 232 46, 244 74, 236 100
          C 248 118, 240 146, 224 160
          C 230 180, 212 200, 188 198
          C 166 196, 150 182, 140 172"
          stroke="#0A0A0A"
          strokeWidth="2.5"
          strokeLinecap="round"
          />
          {/* Central Longitudinal Seam */}
          <line
          data-cortex
          x1="140"
          y1="40"
          x2="140"
          y2="172"
          stroke="rgba(10,10,10,0.22)"
          strokeWidth="1.8"
          strokeDasharray="3 3"
          />
          {/* LEFT HEMISPHERE GYRI / DENDRITES */}
          <path
          data-cortex
          d="M 100 44 C 112 60, 128 54, 138 60"
          stroke="rgba(10,10,10,0.8)"
          strokeWidth="1.9"
          strokeLinecap="round"
          />
          <path
          data-cortex
          d="M 80 50 C 92 64, 102 70, 114 66"
          stroke="rgba(10,10,10,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
          />
          <path
          data-cortex
          d="M 60 82 C 78 76, 98 90, 122 84 C 132 82, 138 88, 138 94"
          stroke="rgba(10,10,10,0.8)"
          strokeWidth="1.9"
          strokeLinecap="round"
          />
          <path
          data-cortex
          d="M 76 96 C 88 102, 102 96, 116 100"
          stroke="rgba(10,10,10,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
          />
          <path
          data-cortex
          d="M 52 122 C 70 118, 92 128, 112 120 C 126 114, 134 122, 138 128"
          stroke="rgba(10,10,10,0.78)"
          strokeWidth="1.9"
          strokeLinecap="round"
          />
          <path
          data-cortex
          d="M 78 134 C 92 128, 106 136, 120 132"
          stroke="rgba(10,10,10,0.58)"
          strokeWidth="1.4"
          strokeLinecap="round"
          />
          <path
          data-cortex
          d="M 70 162 C 86 152, 108 160, 132 154"
          stroke="rgba(10,10,10,0.7)"
          strokeWidth="1.8"
          strokeLinecap="round"
          />
          <path
          data-cortex
          d="M 94 178 C 108 172, 122 178, 134 174"
          stroke="rgba(10,10,10,0.5)"
          strokeWidth="1.4"
          strokeLinecap="round"
          />
          {/* RIGHT HEMISPHERE GYRI / DENDRITES */}
          <path
          data-cortex
          d="M 180 44 C 168 60, 152 54, 142 60"
          stroke="rgba(10,10,10,0.8)"
          strokeWidth="1.9"
          strokeLinecap="round"
          />
          <path
          data-cortex
          d="M 200 50 C 188 64, 178 70, 166 66"
          stroke="rgba(10,10,10,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
          />
          <path
          data-cortex
          d="M 220 82 C 202 76, 182 90, 158 84 C 148 82, 142 88, 142 94"
          stroke="rgba(10,10,10,0.8)"
          strokeWidth="1.9"
          strokeLinecap="round"
          />
          <path
          data-cortex
          d="M 204 96 C 192 102, 178 96, 164 100"
          stroke="rgba(10,10,10,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
          />
          <path
          data-cortex
          d="M 228 122 C 210 118, 188 128, 168 120 C 154 114, 146 122, 142 128"
          stroke="rgba(10,10,10,0.78)"
          strokeWidth="1.9"
          strokeLinecap="round"
          />
          <path
          data-cortex
          d="M 202 134 C 188 128, 174 136, 160 132"
          stroke="rgba(10,10,10,0.58)"
          strokeWidth="1.4"
          strokeLinecap="round"
          />
          <path
          data-cortex
          d="M 210 162 C 194 152, 172 160, 148 154"
          stroke="rgba(10,10,10,0.7)"
          strokeWidth="1.8"
          strokeLinecap="round"
          />
          <path
          data-cortex
          d="M 186 178 C 172 172, 158 178, 146 174"
          stroke="rgba(10,10,10,0.5)"
          strokeWidth="1.4"
          strokeLinecap="round"
          />
          {/* SYNAPTIC NODES (Left) */}
          <circle className="brain-node" cx="100" cy="44" r="3.0" fill="#0A0A0A" />
          <circle className="brain-node" cx="80" cy="50" r="2.2" fill="rgba(10,10,10,0.75)" />
          <circle className="brain-node" cx="60" cy="82" r="3.0" fill="#0A0A0A" />
          <circle className="brain-node" cx="122" cy="84" r="2.5" fill="rgba(10,10,10,0.85)" />
          <circle className="brain-node" cx="76" cy="96" r="2.4" fill="rgba(10,10,10,0.75)" />
          <circle className="brain-node" cx="52" cy="122" r="3.0" fill="#0A0A0A" />
          <circle className="brain-node" cx="112" cy="120" r="2.5" fill="rgba(10,10,10,0.85)" />
          <circle className="brain-node" cx="70" cy="162" r="2.8" fill="#0A0A0A" />
          <circle className="brain-node" cx="94" cy="178" r="2.2" fill="rgba(10,10,10,0.7)" />
          {/* SYNAPTIC NODES (Right) */}
          <circle className="brain-node" cx="180" cy="44" r="3.0" fill="#0A0A0A" />
          <circle className="brain-node" cx="200" cy="50" r="2.2" fill="rgba(10,10,10,0.75)" />
          <circle className="brain-node" cx="220" cy="82" r="3.0" fill="#0A0A0A" />
          <circle className="brain-node" cx="158" cy="84" r="2.5" fill="rgba(10,10,10,0.85)" />
          <circle className="brain-node" cx="204" cy="96" r="2.4" fill="rgba(10,10,10,0.75)" />
          <circle className="brain-node" cx="228" cy="122" r="3.0" fill="#0A0A0A" />
          <circle className="brain-node" cx="168" cy="120" r="2.5" fill="rgba(10,10,10,0.85)" />
          <circle className="brain-node" cx="210" cy="162" r="2.8" fill="#0A0A0A" />
          <circle className="brain-node" cx="186" cy="178" r="2.2" fill="rgba(10,10,10,0.7)" />
          {/* THALAMIC COGNITIVE PROTAGONIST CORE */}
          <circle
          cx="140"
          cy="112"
          r="26"
          fill="url(#ocThalamus)"
          className="brain-core-aura pointer-events-none"
          />
          <circle
          cx="140"
          cy="112"
          r="13"
          stroke="var(--scaffold-accent)"
          strokeWidth="1.5"
          opacity="0.55"
          data-cortex
          />
          <circle
          data-protagonist="brain-core"
          className="brain-core"
          cx="140"
          cy="112"
          r="5.5"
          fill="var(--scaffold-accent)"
          />
          </svg>
            <circle data-core cx="140" cy="118" r="9" fill="var(--scaffold-accent)" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* the six inputs */}
      {FEEDS.map((f) => {
        const at = spot(f.angle);
        return (
          <div
            key={f.id}
            ref={(el) => {
              nodeRefs.current[f.id] = el;
            }}
            data-feed-node={f.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-[12px] border border-[rgba(10,10,10,0.08)] bg-white px-3 py-2 shadow-[var(--scaffold-shadow-soft)]"
            style={{ left: `${at.left}%`, top: `${at.top}%` }}
          >
            <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] bg-[var(--scaffold-accent-row)]">
              <f.Icon size="12px" />
            </span>
            <span className="whitespace-nowrap text-[11.5px] font-medium tracking-[-0.01em] text-[var(--scaffold-ink)]">
              {f.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
