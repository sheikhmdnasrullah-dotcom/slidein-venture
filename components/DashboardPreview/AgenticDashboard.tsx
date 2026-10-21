'use client';

/**
 * AGENTIC DASHBOARD — the living SlideIn autonomous workspace
 * ---------------------------------------------------------------------------
 * Advanced, interactive, motion-rich AI agent console designed for the
 * marketing website hero/platform section.
 *
 * Architecture:
 *  - L1 Chrome:
 *      * Sidebar (168px): Workspace switcher button, 7 autonomous stage rows with
 *        real-time state badges (running arc, done check, idle dot, held pause),
 *        hairline, overview & activity rows, bottom user block.
 *      * Top Bar (48px): Breadcrumb (brand tile mark + chevron + activeStage),
 *        live command bar with typing simulation & blinking accent caret,
 *        3 agent presence avatars (Research, Personalize, Outreach) with live
 *        pulsing status indicator.
 *      * Activity Strip (44px): Integrated bottom agent telemetry and execution
 *        stream with active agent card, 10-tick progress meter, and live run tags.
 *      * Bot Launcher: Floating round dark #151515 agent button with ambient glow
 *        and expandable quick-action agent drawer.
 *  - L2 Stage Views:
 *      * `discover`: Prospect matrix, signal radar sweep, convergence into a
 *        single enriched profile.
 *      * `research`: Deep dossier, scanner sweep, branching public-signal lines.
 *      * `qualify`: Fit matrix, sequential checks, rejected branch.
 *      * `personalize`: Draft composer with highlighted personalized
 *        phrases wired back to the signal that produced them.
 *      * `outreach`: Dispatch queue and delivery confirmation.
 *      * `converse`: Inbound reply and meeting confirmation.
 *      * `configure`: Structured setup columns (profile, offers, icps).
 *      * `overview`: Funnel completion velocity, sparklines, agent execution health.
 *  - L3 Agent Layer:
 *      * Autonomous demo loop smoothly cycling stages when idle.
 *      * Synchronized with PlatformSection scroll steps.
 *      * Interactive hover/click overrides with 8s idle auto-resume.
 *      * Reduced motion fallback to crisp settled frames.
 *
 * Text Integrity (Rule 0):
 *  - ONLY words from `EQUATION_WORDS` in content/stages.ts.
 *  - All other metrics and copy are rendered as geometric skeleton bars,
 *    gauges, sparklines, and icon marks. Zero fake AI synthetic copy.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  ChatGlyph,
  CheckGlyph,
  DotGridGlyph,
  EnvelopeGlyph,
  LedgerMark,
  MagnifierGlyph,
  PlaneGlyph,
  SlidersGlyph,
} from '@/components/StorySpine/icons';
import { type StageId } from '@/content/stages';
import ConfigureBrain from './ConfigureBrain';
import React from 'react';
import { cn } from '@/lib/utils';
import { PEOPLE } from '@/components/prospect-journey/journey';

const PEOPLE_KEYS = ['daniel', 'olivia', 'marcus', 'sophia'] as const;
import { sceneMarkup } from '@/components/prospect-journey/journey';
import '@/components/prospect-journey/journey.css';
import { BrainDesign } from '@/components/Playbook/BrainDesign';
import { PLAYBOOK_COLUMNS } from '@/components/Playbook/poses';

/* The scene reports when it has finished drawing; the section uses that as
   the gate for moving to the next stage, so no stage is skipped and none is
   cut off mid-animation. */
const StageSettledContext = React.createContext<((stage: StageId) => void) | undefined>(undefined);

const POP = { type: 'spring' as const, stiffness: 320, damping: 26 };
const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Journey Scene Renderer ────────────────────────────────────────────── */

function JourneyScene({ stage, live }: { stage: number; live: boolean }) {
  const onSettled = React.useContext(StageSettledContext);
  const stageId = (['configure','discover','research','qualify','personalize','outreach','converse','overview'] as StageId[])[stage] ?? 'discover';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.registerPlugin(ScrollTrigger);

    const scene = container.querySelector<HTMLElement>('.scene');
    if (!scene) return;

    const wireLayer = scene.querySelector<SVGSVGElement>('.wires');
    const NS = 'http://www.w3.org/2000/svg';

    /* Wire geometry follows the rendered layout (called on mount + resize).
       Paths and dots persist across redraws; only coordinates update.
       The curve family tracks the same 680px breakpoint as journey.css:
       side-by-side curves on desktop grids, vertical S-curves on the
       stacked mobile layout. */
    const drawWires = (): void => {
      if (!wireLayer) return;
      const r = scene.getBoundingClientRect();
      wireLayer.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
      const narrow = window.matchMedia('(max-width:680px)').matches;

      const links: [string, string][] = [];
      if (stage === 0) {
        for (let n = 0; n < 4; n++) links.push([`#source-${n}`, '#discover-target']);
      } else if (stage === 1) {
        for (let n = 0; n < 4; n++) links.push(['#research-profile', `#insight-${n}`]);
      } else if (stage === 2) {
        links.push(['#qualified-target', '#rejected-target']);
      } else if (stage === 3) {
        for (let n = 0; n < 3; n++) links.push([`#context-${n}`, `#socket-${n}`]);
      } else if (stage === 4) {
        links.push(['#send-source', '#send-target']);
      }

      const q = (s: string): Element | null => scene.querySelector(s);
      links.forEach(([a, b], n) => {
        const x = q(a);
        const y = q(b);
        if (!x || !y) return;
        const xr = x.getBoundingClientRect();
        const yr = y.getBoundingClientRect();
        const r2 = scene.getBoundingClientRect();
        /* A hidden or not-yet-laid-out endpoint yields a non-finite rect.
           Drawing from it writes "undefined"/NaN into the circle and the
           browser rejects the attribute, so bail instead. */
        if (![xr.left, xr.top, yr.left, yr.top, r2.left, r2.top].every(Number.isFinite)) return;
        let sx: number;
        let sy: number;
        let ex: number;
        let ey: number;
        let d: string;
        if (narrow) {
          sx = xr.left - r2.left + xr.width / 2;
          sy = xr.bottom - r2.top;
          ex = yr.left - r2.left + yr.width / 2;
          ey = yr.top - r2.top;
          const mid = (sy + ey) / 2;
          d = `M${sx},${sy} C${sx},${mid} ${ex},${mid} ${ex},${ey}`;
        } else {
          sx = xr.right - r2.left;
          sy = xr.top - r2.top + xr.height / 2;
          ex = yr.left - r2.left;
          ey = yr.top - r2.top + yr.height / 2 + (stage === 0 ? (n - 1.5) * 10 : 0);
          /* Personalization wires stop at the composer's edge, level with
             their phrase. The highlighted phrase already ties the two sides
             together, so the wire never needs to run across the sentence. */
          let stopX = ex;
          if (stage === 3) {
            const composer = scene.querySelector('.composer');
            if (composer) {
              stopX = composer.getBoundingClientRect().left - r2.left + 6;
              ex = stopX;
            }
          }
          const bend = Math.max(24, (ex - sx) * 0.5);
          d = `M${sx},${sy} C${sx + bend},${sy} ${ex - bend},${ey} ${ex},${ey}`;
        }

        let p = wireLayer.querySelector<SVGPathElement>(`path.wire[data-index="${n}"]`);
        if (!p) {
          p = document.createElementNS(NS, 'path');
          p.setAttribute('class', 'wire');
          p.dataset.index = String(n);
          if (stage === 2) {
            p.style.stroke = 'var(--sj-passive)';
            p.style.opacity = '.55';
          }
          wireLayer.append(p);
        }
        p.setAttribute('d', d);

        let dot = wireLayer.querySelector<SVGCircleElement>(`circle.wire-dot[data-index="${n}"]`);
        if (!dot) {
          dot = document.createElementNS(NS, 'circle');
          dot.setAttribute('r', '4');
          dot.setAttribute('class', 'wire-dot');
          dot.dataset.index = String(n);
          wireLayer.append(dot);
        }
        /* Never write a non-numeric coordinate: the browser rejects the
           whole attribute and logs an error for the element. */
        if (Number.isFinite(sx) && Number.isFinite(sy)) {
          dot.setAttribute('cx', String(sx));
          dot.setAttribute('cy', String(sy));
        }
      });

      if (stage === 4 && !wireLayer.querySelector('.plane-group')) {
        const g = document.createElementNS(NS, 'g');
        g.classList.add('plane-group');
        g.innerHTML = '<path class="paper-plane" d="M-12,-9 L14,0 L-12,9 L-7,0 Z M-7,0 L14,0"/>';
        wireLayer.append(g);
      }
    };

    drawWires();

    /* Endpoints come from real layout, so they must be measured after the
       webfont metrics settle. The scene's own box does not resize when only
       its text reflows, so ResizeObserver alone would leave the wires aimed
       at pre-swap line positions. */
    let reflowTimer: number | undefined;
    const reflowFonts = (): void => {
      drawWires();
      reflowTimer = window.setTimeout(drawWires, 140);
    };
    if (document.fonts?.ready) document.fonts.ready.then(reflowFonts).catch(() => drawWires());
    else reflowTimer = window.setTimeout(drawWires, 140);

    /* The pinned section settles its own height a few frames after mount,
       which shifts the scene inside it. Re-measure through that window. */
    [280, 700, 1400].forEach((ms) => {
      window.setTimeout(drawWires, ms);
    });

    const paths = Array.from(scene.querySelectorAll<SVGPathElement>('path.wire'));
    const dots = Array.from(scene.querySelectorAll<SVGCircleElement>('circle.wire-dot'));

    const ctx = gsap.context(() => {}, container);

    /* Still mode (reduced motion / compact): every accent at rest, nothing
       moves and nothing hides. */
    if (!live) {
      paths.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = '0';
      });
      scene.querySelectorAll<HTMLElement>('.check').forEach((el) => {
        el.style.backgroundColor = 'rgb(43 138 62)';
        el.style.borderColor = 'rgb(43 138 62)';
        el.style.color = 'rgb(255 255 255)';
      });
      scene.querySelectorAll<SVGPathElement>('.tickpath path').forEach((t) => {
        const len = t.getTotalLength();
        t.style.strokeDasharray = String(len);
        t.style.strokeDashoffset = '0';
      });
      scene.querySelectorAll<HTMLElement>('.socket').forEach((el) => {
        el.style.backgroundColor = 'rgb(255 229 217)';
      });
      const beacon = scene.querySelector<HTMLElement>('.delivery-beacon');
      if (beacon) {
        beacon.style.backgroundColor = 'rgb(43 138 62)';
        beacon.style.borderColor = 'rgb(43 138 62)';
      }
      const plane = scene.querySelector('.plane-group');
      if (plane) gsap.set(plane, { autoAlpha: 0 });
      const ro = new ResizeObserver(() => drawWires());
      ro.observe(scene);
      onSettled?.(stageId);
      return () => {
        if (reflowTimer) window.clearTimeout(reflowTimer);
        ctx.revert();
        ro.disconnect();
      };
    }

    const tl = ctx.add(() => {
      const t = gsap.timeline();
      t.from(scene.querySelectorAll('.source-card, .queue-item, .insight-row, .context-event, .check-row, .reply-card, .meeting-card, .draft-card, .target-card, .research-card, .qualified-card, .context-card, .composer'), {
        y: 16, autoAlpha: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out',
      }, 0);

      paths.forEach((p, n) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        const at = 0.3 + n * 0.09;
        t.to(p, { strokeDashoffset: 0, duration: 0.6, ease: 'power1.inOut' }, at);
        if (dots[n]) t.from(dots[n], { autoAlpha: 0, duration: 0.2 }, at);
        if (stage === 3) {
          const socket = scene.querySelector(`#socket-${n}`);
          if (socket) {
            t.fromTo(socket, { backgroundColor: 'rgb(10 10 10 / 8%)' }, { backgroundColor: 'rgb(255 229 217)', duration: 0.4 }, at + 0.2);
          }
        }
      });

      if (stage === 1) {
        /* Research: each finding's glyph lands just after its own row, so the
           eye follows the wire out from the profile and down the nodes. */
        const rows = scene.querySelectorAll<HTMLElement>('.insight-row');
        rows.forEach((row, n) => {
          const at = 0.55 + n * 0.22;
          const glyph = row.querySelector('.insight-glyph');
          if (glyph) t.from(glyph, { scale: 0.72, autoAlpha: 0, duration: 0.34, ease: 'power2.out' }, at);
        });
        const profile = scene.querySelector('#research-profile');
        if (profile) t.from(profile, { scale: 0.97, duration: 0.4, ease: 'power2.out' }, 0.2);
      }

      if (stage === 2) {
        scene.querySelectorAll<HTMLElement>('.check').forEach((el, n) => {
          const at = 0.55 + n * 0.3;
          const tick = el.querySelector<SVGPathElement>('.tickpath path');
          if (tick) {
            const len = tick.getTotalLength();
            gsap.set(tick, { strokeDasharray: len, strokeDashoffset: len });
            t.to(tick, { strokeDashoffset: 0, duration: 0.25, ease: 'power2.out' }, at);
          }
          t.to(el, { backgroundColor: 'rgb(43 138 62)', borderColor: 'rgb(43 138 62)', color: 'rgb(255 255 255)', duration: 0.15 }, at);
        });
        t.to(scene.querySelector('.qualified-card'), { borderColor: 'rgb(43 138 62)', borderWidth: '1px', duration: 0.3 }, 1.75);
      }

      if (stage === 4) {
        const plane = scene.querySelector('.plane-group');
        const route = paths[0];
        if (plane && route) {
          const proxy = { t: 0 };
          const move = (): void => {
            const len = route.getTotalLength();
            const v = route.getPointAtLength(proxy.t * len);
            const a = route.getPointAtLength(Math.max(0, proxy.t * len - 1));
            const b = route.getPointAtLength(Math.min(len, proxy.t * len + 1));
            plane.setAttribute('transform', `translate(${v.x},${v.y}) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI})`);
          };
          move();
          t.from(plane, { autoAlpha: 0, duration: 0.1 }, 0.9)
            .to(proxy, { t: 1, duration: 1.5, ease: 'power2.inOut', onUpdate: move }, 0.9)
            .to(plane, { autoAlpha: 0, duration: 0.15 }, 2.35);
          const beacon = scene.querySelector('.delivery-beacon');
          if (beacon) {
            t.to(beacon, { backgroundColor: 'rgb(43 138 62)', borderColor: 'rgb(43 138 62)', duration: 0.2 }, 2.45)
              .fromTo(beacon, { scale: 1.2 }, { scale: 1, duration: 0.4, ease: 'power2.out' }, 2.45);
          }
        }
      }

      return t;
    });

    tl.eventCallback('onComplete', () => onSettled?.(stageId));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        tl.restart();
      },
      { threshold: 0.5 },
    );
    observer.observe(scene);

    const ro = new ResizeObserver(() => drawWires());
    ro.observe(scene);

    return () => {
      if (reflowTimer) window.clearTimeout(reflowTimer);
      ctx.revert();
      observer.disconnect();
      ro.disconnect();
    };
  }, [stage, live, onSettled, stageId]);

  return (
    <div
      ref={containerRef}
      /* `sj` scopes the journey stylesheet (all scene rules hang off it);
         `sj-scene-wrapper` strips the standalone frame chrome — border,
         radius, ground — so the scene sits directly on the canvas. */
      className="sj sj-scene-wrapper"
      dangerouslySetInnerHTML={{ __html: sceneMarkup(stage) }}
    />
  );
}

/* ─── Atomic Geometry & Skeletons ─────────────────────────────────────────── */

function Bar({
  w,
  h = 8,
  className,
  tint = false,
}: {
  w: number | string;
  h?: number;
  className?: string;
  tint?: boolean;
}) {
  return (
    <span
      className={cn('block shrink-0 rounded-full', className)}
      style={{
        width: w,
        height: h,
        background: tint
          ? 'color-mix(in oklch, var(--color-brand) 18%, rgba(255,255,255,1))'
          : 'var(--scaffold-skeleton)',
      }}
    />
  );
}

/* ─── Audio Waveform Component ───────────────────────────────────────────── */

const WAVE_BARS = [4, 8, 14, 7, 18, 12, 6, 15, 9, 19, 8, 13, 5, 16, 10, 6, 13, 8];

function Waveform({ live }: { live: boolean }) {
  return (
    <span className="flex h-[18px] w-full items-center justify-between gap-[2px]" aria-hidden="true">
      {WAVE_BARS.map((h, i) => (
        <motion.span
          key={i}
          className="block w-[2.5px] shrink-0 rounded-full"
          style={{ height: h, background: 'var(--scaffold-skeleton)' }}
          animate={
            live
              ? {
                  scaleY: [1, 1.4, 0.8, 1.25, 1],
                  backgroundColor:
                    i % 4 === 0
                      ? ['rgba(10,10,10,0.12)', 'var(--scaffold-accent)', 'rgba(10,10,10,0.12)']
                      : 'rgba(10,10,10,0.12)',
                }
              : undefined
          }
          transition={
            live
              ? {
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.08,
                }
              : undefined
          }
        />
      ))}
    </span>
  );
}

/* ─── Stage Status Badges ────────────────────────────────────────────────── */

type AgentStatus = 'running' | 'done' | 'idle' | 'held';

function StatusBadge({ status, live }: { status: AgentStatus; live: boolean }) {
  if (status === 'running') {
    return (
      <span className="relative flex h-[14px] w-[14px] shrink-0 items-center justify-center">
        {live ? (
          <motion.span
            className="absolute inset-0 rounded-full border border-dashed border-[var(--scaffold-accent)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <span className="absolute inset-0 rounded-full border border-[var(--scaffold-accent)] opacity-40" />
        )}
        <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent-dot)]" />
      </span>
    );
  }

  if (status === 'done') {
    return (
      <span className="flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full bg-[rgba(10,10,10,0.06)]">
        <svg width="8" height="8" viewBox="0 0 9 9" aria-hidden="true">
          <path
            d="M1.8 4.8 L3.6 6.8 L7.4 2.4"
            stroke="rgba(10,10,10,0.65)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
    );
  }

  if (status === 'held') {
    return (
      <span className="flex h-[14px] w-[14px] shrink-0 items-center justify-center gap-[2px]">
        <span className="h-[7px] w-[2px] rounded-full bg-[rgba(10,10,10,0.3)]" />
        <span className="h-[7px] w-[2px] rounded-full bg-[rgba(10,10,10,0.3)]" />
      </span>
    );
  }

  return (
    <span className="flex h-[14px] w-[14px] shrink-0 items-center justify-center">
      <span className="h-[4px] w-[4px] rounded-full bg-[rgba(10,10,10,0.2)]" />
    </span>
  );
}

/* ─── Stage Row Glyph Icon ───────────────────────────────────────────────── */

function StageGlyphIcon({ stage, size = 14 }: { stage: StageId; size?: number }) {
  const p = { id: `dash-${stage}`, size: '100%' };
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[6px] border border-[rgba(10,10,10,0.08)] bg-white p-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      style={{ width: size + 8, height: size + 8 }}
    >
      {stage === 'configure' && <SlidersGlyph {...p} />}
      {stage === 'discover' && <DotGridGlyph {...p} />}
      {stage === 'research' && <MagnifierGlyph {...p} />}
      {stage === 'qualify' && <CheckGlyph {...p} />}
      {stage === 'personalize' && <EnvelopeGlyph {...p} />}
      {stage === 'outreach' && <PlaneGlyph {...p} />}
      {stage === 'converse' && <ChatGlyph {...p} />}
      {stage === 'activity' && <LedgerMark />}
      {stage === 'overview' && (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 19h16M4 15l4-5 4 3 6-7" stroke="rgba(10,10,10,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="6" r="1.8" fill="var(--scaffold-accent)" />
        </svg>
      )}
    </span>
  );
}

/* ─── Step mapping for PlatformSection steps ─────────────────────────────── */

const PLATFORM_STEPS: StageId[] = [
  'discover',
  'research',
  'qualify',
  'personalize',
  'outreach',
];

const SIDEBAR_STAGES: StageId[] = [
  'configure',
  'discover',
  'research',
  'qualify',
  'personalize',
  'outreach',
  'converse',
];

/* The order the section walks while the user scrolls through it. Every
   stage the sidebar offers is in the list, so none is unreachable by
   scroll: setup, the pipeline, the conversation, then the overview. */
export const SCROLL_STAGES: StageId[] = [...SIDEBAR_STAGES, 'overview'];

/* ─── Top Command Bar Component ──────────────────────────────────────────── */

function CommandBar({ live, activeStage }: { live: boolean; activeStage: StageId }) {
  return (
    <div className="flex h-[30px] max-w-[260px] flex-1 items-center gap-2 rounded-full border border-[rgba(10,10,10,0.08)] bg-white px-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Sparkle AI Glyph */}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
        <path
          d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
          fill="var(--scaffold-accent)"
        />
      </svg>
      {/* Typing simulated bar */}
      <span className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
        <span className="text-[11px] font-medium tracking-tight text-[rgba(10,10,10,0.55)]">
          {activeStage}
        </span>
        <Bar w={live ? '36%' : '28%'} h={5} />
      </span>
      {/* Blinking accent caret */}
      <span
        className={cn(
          'block h-[11px] w-[2px] shrink-0 rounded-full bg-[var(--scaffold-accent)]',
          live ? 'animate-pulse' : '',
        )}
      />
    </div>
  );
}

/* ─── Agent Presence Avatars Cluster ─────────────────────────────────────── */

function AgentPresenceCluster({ live }: { live: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex -space-x-1 overflow-hidden p-0.5">
        {/* Research Agent */}
        <span
          className="relative flex h-[22px] w-[22px] items-center justify-center rounded-full border border-white bg-[rgba(10,10,10,0.06)] shadow-xs"
          title="research"
        >
          <MagnifierGlyph id="dash-agent-res" size="10px" />
        </span>
        {/* Personalize Agent */}
        <span
          className="relative flex h-[22px] w-[22px] items-center justify-center rounded-full border border-white bg-[rgba(10,10,10,0.06)] shadow-xs"
          title="personalize"
        >
          <EnvelopeGlyph id="dash-agent-per" size="10px" />
        </span>
        {/* Outreach Agent */}
        <span
          className="relative flex h-[22px] w-[22px] items-center justify-center rounded-full border border-white bg-[var(--scaffold-accent-chip)] shadow-xs"
          title="outreach"
        >
          <PlaneGlyph id="dash-agent-out" size="9px" />
        </span>
      </div>
      {/* Live status dot */}
      <span className="relative flex h-[7px] w-[7px] shrink-0 items-center justify-center">
        {live ? (
          <motion.span
            className="absolute inset-0 rounded-full bg-[var(--scaffold-accent)] opacity-60"
            animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : null}
        <span className="h-[4.5px] w-[4.5px] rounded-full bg-[var(--scaffold-accent-dot)]" />
      </span>
    </div>
  );
}

/* ─── L2 STAGE VIEWS ─────────────────────────────────────────────────────── */

/* 1. DISCOVER VIEW — prospect radar and lead generation stream */
function DiscoverStageView({ live }: { live: boolean }) {
  return (
    <div className="relative">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border border-[rgba(10,10,10,0.08)] bg-white shadow-xs">
          <DotGridGlyph id="disc-view-icon" size="13px" />
        </span>
      </div>
      <JourneyScene stage={0} live={live} />
    </div>
  );
}

/* 2. RESEARCH VIEW — deep account dossier with claim verification */
function ResearchStageView({ live }: { live: boolean }) {
  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border border-[rgba(10,10,10,0.08)] bg-white shadow-xs">
            <MagnifierGlyph id="res-view-icon" size="13px" />
          </span>
          <span className="text-[12px] font-medium text-[rgba(10,10,10,0.8)]">research</span>
        </div>
      </div>
      <JourneyScene stage={1} live={live} />
    </div>
  );
}

/* 3. QUALIFY VIEW — multi-factor ICP qualification matrix */
function QualifyStageView({ live }: { live: boolean }) {
  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border border-[rgba(10,10,10,0.08)] bg-white shadow-xs">
            <CheckGlyph id="qual-view-icon" size="13px" />
          </span>
          <span className="text-[12px] font-medium text-[rgba(10,10,10,0.8)]">qualify</span>
        </div>
      </div>
      <JourneyScene stage={2} live={live} />
    </div>
  );
}

/* 4. PERSONALIZE VIEW — dynamic video asset preview + versioned draft socket */
function PersonalizeStageView({ live }: { live: boolean }) {
  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border border-[rgba(10,10,10,0.08)] bg-white shadow-xs">
            <EnvelopeGlyph id="per-view-icon" size="13px" />
          </span>
          <span className="text-[12px] font-medium text-[rgba(10,10,10,0.8)]">personalize</span>
        </div>
      </div>
      <JourneyScene stage={3} live={live} />
    </div>
  );
}

/* 5. OUTREACH VIEW — outbound queue, policy safeguards matrix, and delivery pipeline */
/* ── Outreach column bodies ─────────────────────────────────────────────
   Authored once and reused by the desktop grid and the stacked mobile tabs,
   so the two layouts can never drift apart. */

function OutreachQueueColumn({ live }: { live: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between gap-2 rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-2.5 shadow-xs">
      <div>
        <div className="flex items-center justify-between border-b border-[var(--scaffold-hairline)] pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[rgba(10,10,10,0.85)]">message</span>
            <span className="text-[10px] text-[rgba(10,10,10,0.4)]">·</span>
            <span className="text-[10px] font-medium text-[rgba(10,10,10,0.5)]">personalized</span>
          </div>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                className="flex h-[15px] items-center gap-1 rounded-[4px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] px-1"
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    idx === 0 ? 'bg-[var(--scaffold-accent)]' : 'bg-[rgba(10,10,10,0.25)]',
                  )}
                />
                <Bar w={10} h={3} />
              </span>
            ))}
          </div>
        </div>
        <div className="mt-2 rounded-[10px] border border-[var(--scaffold-accent-chip)] bg-[var(--scaffold-accent-row)]/30 p-2">
          <div className="flex items-center gap-2">
            <img
              src="/journey-faces/daniel.png"
              alt=""
              aria-hidden="true"
              className="h-7 w-7 rounded-full object-cover shadow-2xs border border-white"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Bar w="65%" h={5} />
              <Bar w="40%" h={4} />
            </div>
            <span className="flex h-4 items-center rounded-full bg-[rgba(43,138,62,0.12)] px-1.5">
              <span className="h-1 w-1 rounded-full bg-[rgb(43,138,62)]" />
            </span>
          </div>
          <div className="mt-2 flex flex-col gap-1 rounded-[6px] border border-[rgba(10,10,10,0.06)] bg-white p-1.5">
            <div className="flex items-center gap-1.5">
              <EnvelopeGlyph id="out-env-icon" size="9px" />
              <Bar w="45%" h={4} />
            </div>
            <Bar w="88%" h={4} />
            <div className="flex items-center gap-1">
              <Bar w="35%" h={4} tint />
              <Bar w="40%" h={4} />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="relative h-[3px] flex-1 rounded-full bg-[rgba(10,10,10,0.08)] overflow-hidden">
              <motion.div
                className="absolute inset-y-0 bg-[var(--scaffold-accent)] rounded-full"
                animate={live ? { left: ['0%', '100%'], width: ['20%', '40%'] } : { left: '30%', width: '35%' }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <Bar w={24} h={3} />
          </div>
        </div>
        <div className="mt-1.5 flex items-center gap-2 rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-1.5">
          <img
            src="/journey-faces/marcus.png"
            alt=""
            aria-hidden="true"
            className="h-5 w-5 rounded-full object-cover opacity-80"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Bar w="50%" h={4} />
            <Bar w="30%" h={3} />
          </div>
          <span className="h-1.5 w-1.5 rounded-full bg-[rgba(10,10,10,0.25)]" />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1.5">
        <Bar w={28} h={4} />
      </div>
    </div>
  );
}

function OutreachChecksColumn({ live }: { live: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between gap-2 rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-2.5 shadow-xs">
      <div>
        <div className="flex items-center justify-between border-b border-[var(--scaffold-hairline)] pb-1.5">
          <span className="text-[11px] font-semibold text-[rgba(10,10,10,0.85)]">checks</span>
          <span className="flex h-[15px] items-center gap-1 rounded-full border border-[var(--scaffold-hairline)] bg-white px-1.5">
            <Bar w={16} h={3} />
          </span>
        </div>
        <div className="my-2 flex flex-col gap-1.5">
          {[72, 58, 64, 52].map((w) => (
            <div
              key={w}
              className="flex items-center justify-between rounded-[6px] border border-[rgba(10,10,10,0.05)] bg-[var(--scaffold-panel)] px-2 py-1"
            >
              <div className="flex items-center gap-1.5">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[rgba(43,138,62,0.12)] text-[rgb(43,138,62)]">
                  <svg width="7" height="7" viewBox="0 0 9 9" fill="none">
                    <path d="M1.8 4.8 L3.6 6.8 L7.4 2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <Bar w={w} h={4} />
              </div>
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(10,10,10,0.25)]" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1.5">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[rgb(43,138,62)]" />
          <Bar w={32} h={4} />
        </div>
        <Bar w={20} h={3} />
      </div>
    </div>
  );
}

function OutreachDeliveryColumn({ live }: { live: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between gap-2 rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-2.5 shadow-xs">
      <div>
        <div className="flex items-center justify-between border-b border-[var(--scaffold-hairline)] pb-1.5">
          <span className="text-[11px] font-semibold text-[rgba(10,10,10,0.85)]">delivered</span>
          <span className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[rgba(43,138,62,0.12)]">
            <span className="h-1 w-1 rounded-full bg-[rgb(43,138,62)]" />
          </span>
        </div>
        <div className="mt-2 flex flex-col items-center justify-center rounded-[10px] border border-[var(--scaffold-hairline)] bg-white p-3 text-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(43,138,62,0.25)] text-[rgb(43,138,62)]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <div className="mt-2 flex w-full flex-col items-center gap-1">
            <Bar w="55%" h={5} />
            <Bar w="35%" h={4} />
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-1.5 rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(10,10,10,0.25)]" />
              <Bar w={40} h={4} />
            </div>
            <Bar w={24} h={4} />
          </div>
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center justify-between">
              <Bar w={48} h={3} />
              <Bar w={16} h={3} />
            </div>
            <div className="relative h-1.5 w-full rounded-full bg-[rgba(10,10,10,0.08)] overflow-hidden">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-[rgba(10,10,10,0.3)]"
                style={{ width: '84%' }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1.5">
        <div className="flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-[rgba(10,10,10,0.25)]" />
          <Bar w={24} h={4} />
        </div>
      </div>
    </div>
  );
}

/* 5. OUTREACH VIEW — outbound queue, policy safeguards matrix, and delivery pipeline */
function OutreachStageView({ live }: { live: boolean }) {
  const [mobileTab, setMobileTab] = useState<'queue' | 'checks' | 'delivery'>('queue');

  // In live mode, auto-cycle mobile tabs every 3.5s so the phone view keeps moving
  useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => {
      setMobileTab((prev) => {
        if (prev === 'queue') return 'checks';
        if (prev === 'checks') return 'delivery';
        return 'queue';
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [live]);

  return (
    <div className="flex h-full flex-col gap-2.5">
      {/* Header with Stage Name & Responsive Telemetry Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border border-[rgba(10,10,10,0.08)] bg-white shadow-xs">
            <PlaneGlyph id="out-view-icon" size="13px" />
          </span>
          <span className="hidden sm:inline text-[12px] font-medium text-[rgba(10,10,10,0.8)]">outreach</span>
        </div>

        {/* Desktop Telemetry Pills */}
        <div className="hidden md:flex items-center gap-2">
          <span className="flex h-[22px] items-center gap-1.5 rounded-full border border-[rgba(43,138,62,0.22)] bg-[rgba(43,138,62,0.08)] px-2.5 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[rgb(43,138,62)]" />
            <span className="text-[10.5px] font-medium text-[rgb(43,138,62)]">checks</span>
          </span>

          <span className="flex h-[22px] items-center gap-1.5 rounded-full border border-[var(--scaffold-hairline)] bg-white px-2.5 shadow-2xs">
            <span className={cn('h-1.5 w-1.5 rounded-full bg-[var(--scaffold-accent)]', live && 'animate-pulse')} />
            <span className="text-[10.5px] font-medium text-[rgba(10,10,10,0.75)]">delivered</span>
          </span>
        </div>

        {/* Mobile Segmented Switcher */}
        <div className="flex md:hidden items-center gap-0.5 rounded-full border border-[var(--scaffold-hairline)] bg-white p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setMobileTab('queue')}
            className={cn(
              'flex h-[19px] w-[19px] items-center justify-center rounded-full transition-colors cursor-pointer',
              mobileTab === 'queue' ? 'bg-[var(--scaffold-accent-row)] text-[var(--scaffold-accent)]' : 'text-[rgba(10,10,10,0.4)]',
            )}
          >
            <EnvelopeGlyph id="tab-env" size="8px" />
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('checks')}
            className={cn(
              'flex h-[19px] w-[19px] items-center justify-center rounded-full transition-colors cursor-pointer',
              mobileTab === 'checks' ? 'bg-[var(--scaffold-accent-row)] text-[var(--scaffold-accent)]' : 'text-[rgba(10,10,10,0.4)]',
            )}
          >
            <CheckGlyph id="tab-chk" size="8px" />
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('delivery')}
            className={cn(
              'flex h-[19px] w-[19px] items-center justify-center rounded-full transition-colors cursor-pointer',
              mobileTab === 'delivery' ? 'bg-[var(--scaffold-accent-row)] text-[var(--scaffold-accent)]' : 'text-[rgba(10,10,10,0.4)]',
            )}
          >
            <PlaneGlyph id="tab-pln" size="8px" />
          </button>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* DESKTOP: 3 COLUMNS SIDE-BY-SIDE */}
        <div className="hidden md:grid h-full grid-cols-3 gap-2.5">
          <OutreachQueueColumn live={live} />
          <OutreachChecksColumn live={live} />
          <OutreachDeliveryColumn live={live} />
        </div>

        {/* MOBILE: ONE COLUMN AT A TIME */}
        <div className="block md:hidden h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="h-full"
            >
              {mobileTab === 'queue' && <OutreachQueueColumn live={live} />}
              {mobileTab === 'checks' && <OutreachChecksColumn live={live} />}
              {mobileTab === 'delivery' && <OutreachDeliveryColumn live={live} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* 6. CONVERSE VIEW — automated reply detection & scheduling */
function ConverseStageView({ live }: { live: boolean }) {
  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border border-[rgba(10,10,10,0.08)] bg-white shadow-xs">
            <ChatGlyph id="conv-view-icon" size="13px" />
          </span>
          <span className="text-[12px] font-medium text-[rgba(10,10,10,0.8)]">converse</span>
        </div>
      </div>
      <JourneyScene stage={5} live={live} />
    </div>
  );
}

/* 7. CONFIGURE VIEW — deep, advanced 3-pillar architecture (profile · offers · icps) */

function ProfilePillarCard({ live }: { live: boolean }) {
  return (
    <div className="flex flex-col justify-between rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-2.5 shadow-xs">
      <div>
        {/* Column Header */}
        <div className="flex items-center justify-between border-b border-[var(--scaffold-hairline)] pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--scaffold-accent)]" />
            <span className="text-[11px] font-semibold text-[rgba(10,10,10,0.85)]">profile</span>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-[rgba(43,138,62,0.1)] px-1.5 py-0.5 text-[9px] font-medium text-[rgb(43,138,62)]">
            <span className="h-1 w-1 rounded-full bg-[rgb(43,138,62)]" />
            <span>versioned</span>
          </span>
        </div>

        {/* Business Identity & Verified Domain Block */}
        <div className="mt-2 flex items-center justify-between rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[rgba(10,10,10,0.85)] text-white shadow-2xs">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <Bar w={58} h={4.5} />
              <Bar w={36} h={3.5} />
            </div>
          </div>
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[rgba(43,138,62,0.15)] text-[rgb(43,138,62)]">
            <svg width="7" height="7" viewBox="0 0 9 9" fill="none">
              <path d="M1.8 4.8 L3.6 6.8 L7.4 2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        {/* DNS Fortress Authentication Matrix (SPF / DKIM / DMARC / MX) */}
        <div className="mt-2 flex flex-col gap-1 rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-2">
          <div className="flex items-center justify-between pb-1 border-b border-[rgba(10,10,10,0.04)]">
            <div className="flex items-center gap-1 text-[9.5px] font-medium text-[rgba(10,10,10,0.5)]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>policy</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-[rgb(43,138,62)]" />
          </div>

          <div className="grid grid-cols-2 gap-1 pt-0.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-[4px] bg-white px-1.5 py-1 border border-[rgba(10,10,10,0.04)]">
                <div className="flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-[rgb(43,138,62)]" />
                  <Bar w={i % 2 === 0 ? 32 : 28} h={3} />
                </div>
                <svg width="6" height="6" viewBox="0 0 9 9" fill="none" className="text-[rgb(43,138,62)]">
                  <path d="M1.8 4.8 L3.6 6.8 L7.4 2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Mailbox Pool Rotation Stream */}
        <div className="mt-2 flex flex-col gap-1 rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-2">
          <div className="flex items-center justify-between">
            <Bar w={46} h={3.5} />
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgb(43,138,62)]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[rgb(43,138,62)]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[rgb(43,138,62)]" />
            </div>
          </div>
          <div className="flex flex-col gap-1 pt-0.5">
            {[78, 64, 45].map((pct, idx) => (
              <div key={idx} className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1">
                  <span className={cn('h-1 w-1 rounded-full', idx < 2 && live ? 'bg-[rgb(43,138,62)] animate-pulse' : 'bg-[rgb(43,138,62)]')} />
                  <Bar w={idx === 0 ? 42 : idx === 1 ? 36 : 30} h={3} />
                </div>
                <div className="relative h-1 w-20 rounded-full bg-[rgba(10,10,10,0.08)] overflow-hidden">
                  <span className="absolute inset-y-0 left-0 rounded-full bg-[rgb(43,138,62)]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1.5">
        <div className="flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-[rgb(43,138,62)]" />
          <span className="text-[9.5px] font-medium text-[rgba(10,10,10,0.45)]">policy</span>
        </div>
        <span className="text-[9.5px] font-medium text-[rgba(10,10,10,0.45)]">versioned</span>
      </div>
    </div>
  );
}

function OffersPillarCard({ live }: { live: boolean }) {
  return (
    <div className="flex flex-col justify-between rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-2.5 shadow-xs">
      <div>
        {/* Column Header */}
        <div className="flex items-center justify-between border-b border-[var(--scaffold-hairline)] pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-sm bg-[var(--scaffold-accent)]" />
            <span className="text-[11px] font-semibold text-[rgba(10,10,10,0.85)]">offers</span>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-[var(--scaffold-accent-row)] px-1.5 py-0.5 text-[9px] font-medium text-[var(--scaffold-accent)]">
            <span className="h-1 w-1 rounded-full bg-[var(--scaffold-accent)]" />
            <span>offer match</span>
          </span>
        </div>

        {/* Primary Offering Card — Managed System Package */}
        <div className="mt-2 flex flex-col gap-1.5 rounded-[8px] border border-[rgba(255,85,0,0.22)] bg-gradient-to-b from-white to-[rgba(255,85,0,0.03)] p-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-[var(--scaffold-accent)] text-white shadow-xs">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
              <Bar w={54} h={4.5} tint={true} />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-[rgba(255,85,0,0.1)] px-1.5 py-0.5">
              <span className="h-1 w-1 rounded-full bg-[var(--scaffold-accent)]" />
              <Bar w={18} h={3} tint={true} />
            </div>
          </div>

          {/* 5 Deliverables Fan-Out Pipeline Icons */}
          <div className="grid grid-cols-5 gap-1 pt-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-0.5 rounded-[4px] border border-[rgba(10,10,10,0.05)] bg-white py-1">
                <span className="text-[rgba(10,10,10,0.6)]">
                  {i === 0 && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                  {i === 1 && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    </svg>
                  )}
                  {i === 2 && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                    </svg>
                  )}
                  {i === 3 && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  )}
                  {i === 4 && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )}
                </span>
                <Bar w={12} h={2.5} />
              </div>
            ))}
          </div>
        </div>

        {/* Software Platform Engine Modules */}
        <div className="mt-2 flex flex-col gap-1 rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-2">
          <div className="flex items-center justify-between pb-1 border-b border-[rgba(10,10,10,0.04)]">
            <Bar w={44} h={3.5} />
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[rgba(43,138,62,0.12)] text-[rgb(43,138,62)]">
              <svg width="6" height="6" viewBox="0 0 9 9" fill="none">
                <path d="M1.8 4.8 L3.6 6.8 L7.4 2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          <div className="flex flex-col gap-1 pt-0.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-[4px] bg-white px-2 py-1 border border-[rgba(10,10,10,0.04)]">
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[var(--scaffold-accent)]" />
                  <Bar w={i === 0 ? 50 : i === 1 ? 58 : 42} h={3.5} />
                </div>
                <Bar w={16} h={3} />
              </div>
            ))}
          </div>
        </div>

        {/* Value Vector Alignment Meter */}
        <div className="mt-2 flex items-center justify-between rounded-[8px] border border-[rgba(10,10,10,0.05)] bg-[var(--scaffold-panel)] px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[rgb(43,138,62)]" />
            <Bar w={48} h={3.5} />
          </div>
          <div className="flex items-center gap-1">
            <Bar w={20} h={3} />
            <span className="h-1 w-1 rounded-full bg-[var(--scaffold-accent)]" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1.5">
        <div className="flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-[var(--scaffold-accent)]" />
          <span className="text-[9.5px] font-medium text-[rgba(10,10,10,0.45)]">offer match</span>
        </div>
        <span className="text-[9.5px] font-medium text-[rgba(10,10,10,0.45)]">evidence</span>
      </div>
    </div>
  );
}

function IcpsPillarCard({ live }: { live: boolean }) {
  return (
    <div className="flex flex-col justify-between rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-2.5 shadow-xs">
      <div>
        {/* Column Header */}
        <div className="flex items-center justify-between border-b border-[var(--scaffold-hairline)] pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rotate-45 bg-[rgb(43,138,62)]" />
            <span className="text-[11px] font-semibold text-[rgba(10,10,10,0.85)]">icps</span>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-[rgba(43,138,62,0.1)] px-1.5 py-0.5 text-[9px] font-medium text-[rgb(43,138,62)]">
            <span className="h-1 w-1 rounded-full bg-[rgb(43,138,62)]" />
            <span>qualification</span>
          </span>
        </div>

        {/* 3 Target Segments Pills */}
        <div className="mt-2 flex flex-col gap-1 rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-2">
          <div className="flex items-center justify-between pb-1 border-b border-[rgba(10,10,10,0.04)]">
            <Bar w={44} h={3.5} />
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rotate-45 bg-[rgb(43,138,62)]" />
              <span className="h-1.5 w-1.5 rotate-45 bg-[rgb(43,138,62)]" />
              <span className="h-1.5 w-1.5 rotate-45 bg-[rgb(43,138,62)]" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 pt-0.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1 rounded-[4px] bg-white p-1 border border-[rgba(10,10,10,0.04)]">
                <span className="h-1 w-1 rounded-full bg-[rgb(43,138,62)]" />
                <Bar w={i === 0 ? 24 : i === 1 ? 20 : 22} h={3} />
              </div>
            ))}
          </div>
        </div>

        {/* 10-Point Qualification Checklist Matrix */}
        <div className="mt-2 flex flex-col gap-1 rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-2">
          <div className="flex items-center justify-between pb-1 border-b border-[rgba(10,10,10,0.04)]">
            <div className="flex items-center gap-1">
              <span className="h-1 w-1 rotate-45 bg-[rgb(43,138,62)]" />
              <Bar w={48} h={3.5} />
            </div>
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[rgba(43,138,62,0.12)] text-[rgb(43,138,62)]">
              <svg width="7" height="7" viewBox="0 0 9 9" fill="none">
                <path d="M1.8 4.8 L3.6 6.8 L7.4 2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-0.5">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="flex items-center gap-1">
                <svg width="6" height="6" viewBox="0 0 9 9" fill="none" className="text-[rgb(43,138,62)] shrink-0">
                  <path d="M1.8 4.8 L3.6 6.8 L7.4 2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <Bar w={i % 3 === 0 ? 36 : i % 3 === 1 ? 30 : 26} h={2.8} />
              </div>
            ))}
          </div>
        </div>

        {/* Qualification Bar Threshold & Universal Suppression */}
        <div className="mt-2 flex flex-col gap-1.5 rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgb(43,138,62)]" />
              <Bar w={38} h={3.5} />
            </div>
            <div className="flex items-center gap-1">
              <Bar w={14} h={3} />
              <Bar w={16} h={3} />
            </div>
          </div>

          {/* 10 Segmented Qualification Gate Ticks (7 Active Emerald, 3 Reserve) */}
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  i < 7 ? 'bg-[rgb(43,138,62)]' : 'bg-[rgba(10,10,10,0.1)]',
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1.5">
        <div className="flex items-center gap-1">
          <span className="h-1 w-1 rotate-45 bg-[rgb(43,138,62)]" />
          <span className="text-[9.5px] font-medium text-[rgba(10,10,10,0.45)]">qualification</span>
        </div>
        <span className="text-[9.5px] font-medium text-[rgba(10,10,10,0.45)]">provenance</span>
      </div>
    </div>
  );
}

function KnowledgeCoreView({
  live,
  onSelectPillar,
}: {
  live: boolean;
  onSelectPillar: (pillar: 'profile' | 'offers' | 'icps') => void;
}) {
  return (
    <div className="relative flex h-full flex-col justify-between rounded-[18px] border border-[var(--scaffold-hairline)] bg-white p-3.5 shadow-xs">
      {/* Central Neural Brain Vector Emblem */}
      <div className="relative flex flex-1 items-center justify-center py-1 overflow-hidden">
        {/* Ambient Synaptic Guides */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-44 w-44 rounded-full border border-[rgba(255,85,0,0.08)]" />
          <div className="absolute h-64 w-64 rounded-full border border-[rgba(10,10,10,0.04)]" />
        </div>

        {/* Realistic Brain Emblem */}
        <div className="relative z-10">
          <BrainDesign className="scale-[0.72] origin-center" />
        </div>

        {/* 3 Interactive Satellite Nodes */}
        <button
          type="button"
          onClick={() => onSelectPillar('profile')}
          className="group absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-[var(--scaffold-hairline)] bg-white px-2.5 py-1 shadow-2xs transition-all hover:border-[var(--scaffold-accent)] hover:shadow-xs cursor-pointer"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--scaffold-accent)]" />
          <span className="text-[10px] font-medium text-[rgba(10,10,10,0.7)] group-hover:text-black">profile</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectPillar('offers')}
          className="group absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-[var(--scaffold-hairline)] bg-white px-2.5 py-1 shadow-2xs transition-all hover:border-[var(--scaffold-accent)] hover:shadow-xs cursor-pointer"
        >
          <span className="h-1.5 w-1.5 rounded-sm bg-[var(--scaffold-accent)]" />
          <span className="text-[10px] font-medium text-[rgba(10,10,10,0.7)] group-hover:text-black">offers</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectPillar('icps')}
          className="group absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-[var(--scaffold-hairline)] bg-white px-2.5 py-1 shadow-2xs transition-all hover:border-[var(--scaffold-accent)] hover:shadow-xs cursor-pointer"
        >
          <span className="h-1.5 w-1.5 rotate-45 bg-[rgb(43,138,62)]" />
          <span className="text-[10px] font-medium text-[rgba(10,10,10,0.7)] group-hover:text-black">icps</span>
        </button>
      </div>

      {/* Status Telemetry Strip: profile · offers · icps */}
      <div className="flex w-full items-center justify-between border-t border-[var(--scaffold-hairline)] pt-2.5">
        <div className="flex items-center gap-1.5">
          <span className="flex h-[18px] items-center gap-1 rounded-full bg-[rgba(43,138,62,0.1)] px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[rgb(43,138,62)]" />
            <span className="text-[10px] font-medium text-[rgb(43,138,62)]">profile</span>
          </span>
          <span className="flex h-[18px] items-center gap-1 rounded-full bg-[rgba(43,138,62,0.1)] px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[rgb(43,138,62)]" />
            <span className="text-[10px] font-medium text-[rgb(43,138,62)]">offers</span>
          </span>
          <span className="flex h-[18px] items-center gap-1 rounded-full bg-[rgba(43,138,62,0.1)] px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[rgb(43,138,62)]" />
            <span className="text-[10px] font-medium text-[rgb(43,138,62)]">icps</span>
          </span>
        </div>

        <span className="text-[10px] font-medium text-[rgba(10,10,10,0.45)]">versioned</span>
      </div>
    </div>
  );
}

/* One brain, six inputs. Replaces the pillars / knowledge-core subviews, which
   were another way of showing the same six categories. The previous version is
   at /tmp/AgenticDashboard.pillars-backup.tsx for this session only. */
function ConfigureStageView() {
  return <ConfigureBrain />;
}

function OverviewStageView() {
  const rail: StageId[] = [
    'configure',
    'discover',
    'research',
    'qualify',
    'personalize',
    'outreach',
    'converse',
  ];

  return (
    <div className="flex h-full flex-col gap-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border border-[rgba(10,10,10,0.08)] bg-white shadow-xs">
            <LedgerMark />
          </span>
          <span className="text-[12px] font-medium text-[rgba(10,10,10,0.8)]">overview</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-[22px] items-center gap-1.5 rounded-full border border-[rgba(43,138,62,0.22)] bg-[rgba(43,138,62,0.08)] px-2.5 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[rgb(43,138,62)] animate-pulse" />
            <span className="text-[10px] font-medium text-[rgb(43,138,62)]">versioned</span>
          </span>
        </div>
      </div>

      {/* Connected 7-Node Stage Bus Rail */}
      <div className="relative rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-2.5 shadow-xs">
        <div className="relative flex items-center justify-between">
          {/* Animated Connecting Track Wire */}
          <span
            aria-hidden="true"
            className="absolute left-6 right-6 top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-[rgba(10,10,10,0.06)] via-[var(--scaffold-accent)] to-[rgb(43,138,62)] opacity-40"
          />

          {rail.map((stage, idx) => (
            <div key={stage} className="relative z-10 flex flex-col items-center gap-1">
              <span
                className={cn(
                  'flex items-center justify-center rounded-[9px] border transition-all shadow-xs',
                  idx === rail.length - 1
                    ? 'border-[rgb(43,138,62)] bg-[rgba(43,138,62,0.08)]'
                    : idx === 0
                    ? 'border-[var(--scaffold-accent)] bg-[var(--scaffold-accent-row)]'
                    : 'border-[var(--scaffold-hairline)] bg-white hover:border-[rgba(10,10,10,0.2)]',
                )}
                style={{ width: 32, height: 32 }}
              >
                <StageGlyphIcon stage={stage} size={13} />
              </span>

              <span className="text-[9px] font-medium text-[rgba(10,10,10,0.65)]">
                {stage}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Telemetry Cards Grid */}
      <div className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Card 1: Prospects & Provenance */}
        <div className="flex flex-col justify-between rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-2.5 shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--scaffold-hairline)] pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--scaffold-accent)]" />
                <span className="text-[11px] font-semibold text-[rgba(10,10,10,0.85)]">prospects</span>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-[rgba(43,138,62,0.1)] px-1.5 py-0.5 text-[9px] font-medium text-[rgb(43,138,62)]">
                <span className="h-1 w-1 rounded-full bg-[rgb(43,138,62)]" />
                <span>versioned</span>
              </span>
            </div>

            {/* Profile Row with Dalian Carter avatar */}
            <div className="mt-2 flex items-center justify-between rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-1.5">
              <div className="flex items-center gap-2">
                <img
                  src="/journey-faces/daniel.png"
                  alt=""
                  aria-hidden="true"
                  className="h-7 w-7 rounded-full object-cover border border-[var(--scaffold-hairline)] shadow-2xs"
                />
                <div className="flex flex-col gap-1">
                  <Bar w={52} h={4} />
                  <Bar w={32} h={3} />
                </div>
              </div>
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[rgba(43,138,62,0.15)] text-[rgb(43,138,62)]">
                <svg width="7" height="7" viewBox="0 0 9 9" fill="none">
                  <path d="M1.8 4.8 L3.6 6.8 L7.4 2.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </div>

            {/* 4 Inbound Sources Streams */}
            <div className="mt-2 flex flex-col gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between rounded-[4px] border border-[rgba(10,10,10,0.04)] bg-white px-2 py-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-[var(--scaffold-accent)]" />
                    <Bar w={i === 0 ? 44 : i === 1 ? 52 : i === 2 ? 38 : 46} h={3.2} />
                  </div>
                  <Bar w={18} h={3} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1.5">
            <span className="text-[9.5px] font-medium text-[rgba(10,10,10,0.45)]">provenance</span>
            <span className="text-[9.5px] font-medium text-[rgba(10,10,10,0.45)]">evidence</span>
          </div>
        </div>

        {/* Card 2: Qualification & Policy */}
        <div className="flex flex-col justify-between rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-2.5 shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--scaffold-hairline)] pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rotate-45 bg-[rgb(43,138,62)]" />
                <span className="text-[11px] font-semibold text-[rgba(10,10,10,0.85)]">qualification</span>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-[var(--scaffold-accent-row)] px-1.5 py-0.5 text-[9px] font-medium text-[var(--scaffold-accent)]">
                <span className="h-1 w-1 rounded-full bg-[var(--scaffold-accent)]" />
                <span>offer match</span>
              </span>
            </div>

            {/* Radial Score Gauge Simulation */}
            <div className="mt-2 flex items-center justify-between rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-2">
              <div className="flex items-center gap-2">
                <div className="relative flex h-8 w-8 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(10,10,10,0.08)" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="rgb(43,138,62)"
                      strokeWidth="3"
                      strokeDasharray="88"
                      strokeDashoffset="12"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute h-1.5 w-1.5 rounded-full bg-[rgb(43,138,62)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <Bar w={46} h={4} />
                  <Bar w={28} h={3} />
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-[rgb(43,138,62)]" />
            </div>

            {/* Checklist items */}
            <div className="mt-2 grid grid-cols-2 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-1 rounded-[4px] border border-[rgba(10,10,10,0.04)] bg-white p-1">
                  <svg width="6" height="6" viewBox="0 0 9 9" fill="none" className="text-[rgb(43,138,62)] shrink-0">
                    <path d="M1.8 4.8 L3.6 6.8 L7.4 2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <Bar w={i % 2 === 0 ? 32 : 26} h={3} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1.5">
            <span className="text-[9.5px] font-medium text-[rgba(10,10,10,0.45)]">policy</span>
            <span className="text-[9.5px] font-medium text-[rgba(10,10,10,0.45)]">qualification</span>
          </div>
        </div>

        {/* Card 3: Sent Mails & Replies */}
        <div className="flex flex-col justify-between rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-2.5 shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--scaffold-hairline)] pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--scaffold-accent)]" />
                <span className="text-[11px] font-semibold text-[rgba(10,10,10,0.85)]">sent mails</span>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-[rgba(43,138,62,0.1)] px-1.5 py-0.5 text-[9px] font-medium text-[rgb(43,138,62)]">
                <span className="h-1 w-1 rounded-full bg-[rgb(43,138,62)]" />
                <span>intent</span>
              </span>
            </div>

            {/* Inbound Booking confirmation preview */}
            <div className="mt-2 flex flex-col gap-1.5 rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-[rgba(43,138,62,0.15)] text-[rgb(43,138,62)]">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </span>
                  <Bar w={48} h={4} />
                </div>
                <div className="flex -space-x-1">
                  <img src="/journey-faces/marcus.png" alt="" aria-hidden="true" className="h-4 w-4 rounded-full border border-white object-cover" />
                  <img src="/journey-faces/sophia.png" alt="" aria-hidden="true" className="h-4 w-4 rounded-full border border-white object-cover" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[rgba(10,10,10,0.04)]">
                <Bar w={56} h={3} />
                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[rgba(43,138,62,0.2)] text-[rgb(43,138,62)]">
                  <svg width="6" height="6" viewBox="0 0 9 9" fill="none">
                    <path d="M1.8 4.8 L3.6 6.8 L7.4 2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Conversation activity stream */}
            <div className="mt-2 flex flex-col gap-1">
              <div className="flex items-center justify-between rounded-[4px] border border-[rgba(10,10,10,0.04)] bg-white px-2 py-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[rgb(43,138,62)]" />
                  <Bar w={48} h={3.2} />
                </div>
                <span className="text-[9px] font-medium text-[rgba(10,10,10,0.4)]">replies</span>
              </div>
              <div className="flex items-center justify-between rounded-[4px] border border-[rgba(10,10,10,0.04)] bg-white px-2 py-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[var(--scaffold-accent)]" />
                  <Bar w={40} h={3.2} />
                </div>
                <Bar w={16} h={3} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1.5">
            <span className="text-[9.5px] font-medium text-[rgba(10,10,10,0.45)]">replies</span>
            <span className="text-[9.5px] font-medium text-[rgba(10,10,10,0.45)]">drafts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Integrated Bottom Activity & Telemetry Strip ────────────────────────── */

function BottomActivityStrip({ live, activeStage }: { live: boolean; activeStage: StageId }) {
  return (
    <footer className="flex h-[42px] shrink-0 items-center justify-between border-t border-[var(--scaffold-hairline)] bg-white px-3.5">
      {/* Left: Active agent indicator */}
      <div className="flex items-center gap-2">
        <span className="flex h-[20px] w-[20px] items-center justify-center rounded-[5px] bg-[var(--scaffold-accent-row)]">
          <StageGlyphIcon stage={activeStage} size={11} />
        </span>
        <span className="text-[11px] font-medium tracking-tight text-[rgba(10,10,10,0.8)]">
          {activeStage}
        </span>
      </div>

      {/* Center: 10-tick progress meter */}
      <div className="flex items-center gap-[3px] w-[90px]">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <motion.span
            key={i}
            className="h-[5px] flex-1 rounded-[1.5px]"
            style={{
              background:
                i < 7 ? 'var(--scaffold-accent)' : 'rgba(10,10,10,0.10)',
            }}
            animate={
              live && i === 6
                ? { opacity: [0.4, 1, 0.4] }
                : undefined
            }
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Right: live marker only. The dot carries the state; the word did not
          add anything the rail beside it does not already say. */}
      <div className="flex items-center gap-2">
        <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full border border-[rgba(10,10,10,0.08)] bg-[var(--scaffold-panel)]">
          <span className="h-[3.5px] w-[3.5px] rounded-full bg-[var(--scaffold-accent)]" />
        </span>
      </div>
    </footer>
  );
}

/* ─── MAIN AGENTIC DASHBOARD COMPONENT ───────────────────────────────────── */

export default function AgenticDashboard({
  step = 0,
  stageProgress = 0,
  compact = false,
  still = false,
  stages = PLATFORM_STEPS,
  onStageSettled,
}: {
  step?: number;
  stageProgress?: number;
  compact?: boolean;
  still?: boolean;
  stages?: readonly StageId[];
  onStageSettled?: (stage: StageId) => void;
}) {
  const [selectedStageOverride, setSelectedStageOverride] = useState<StageId | null>(null);
  /* The rail collapses like a Notion sidebar: closed, the workspace takes
     the full width and every scene gets more room. */
  const [railOpen, setRailOpen] = useState(true);
  const [botDrawerOpen, setBotDrawerOpen] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Concept sync: Map the PlatformSection scroll step to workflow stage
  const scrollMappedStage: StageId = useMemo(() => {
    return stages[Math.min(step, stages.length - 1)] ?? 'discover';
  }, [step, stages]);

  // When step changes externally, clear override to maintain sync
  useEffect(() => {
    setSelectedStageOverride(null);
  }, [step]);

  // Active stage is user override (if clicked) or scroll mapped stage
  const activeStage = selectedStageOverride ?? scrollMappedStage;

  // Handle stage click in sidebar
  const handleSelectStage = useCallback((st: StageId) => {
    setSelectedStageOverride(st);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    // After 8s of idle, return to external scroll rhythm
    idleTimerRef.current = setTimeout(() => {
      setSelectedStageOverride(null);
    }, 8000);
  }, []);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const live = !still && !compact;

  /* Configure and overview have no scene timeline to report completion, so
     they are settled as soon as they are on screen. */
  const sceneBacked = activeStage !== 'configure' && activeStage !== 'overview';
  useEffect(() => {
    if (!sceneBacked) onStageSettled?.(activeStage);
  }, [activeStage, sceneBacked, onStageSettled]);

  /* Bind every report to the stage that is on screen right now, so a scene
     that unmounts late cannot settle the stage that replaced it. */
  const activeStageReport = React.useCallback(
    (stage: StageId) => {
      if (stage === activeStage) onStageSettled?.(stage);
    },
    [activeStage, onStageSettled],
  );

  /* ── Compact mobile preview ─────────────────────────────────────────────── */
  if (compact) {
    return (
      <div
        aria-hidden="true"
        className="overflow-hidden rounded-[20px] border border-[var(--scaffold-hairline)] bg-white p-2"
        style={{ boxShadow: 'var(--scaffold-shadow-soft)' }}
      >
        <div className="flex h-[154px] overflow-hidden rounded-[14px] border border-[var(--scaffold-hairline)] bg-[var(--scaffold-panel)]">
          {/* Mini Sidebar */}
          <aside className="flex w-[68px] shrink-0 flex-col gap-1 border-r border-[var(--scaffold-hairline)] bg-white p-1.5">
            {PLATFORM_STEPS.slice(0, 4).map((st) => {
              const isCurrent = st === activeStage;
              return (
                <div
                  key={st}
                  className={cn(
                    'flex h-[28px] items-center gap-1.5 rounded-[8px] px-1.5',
                    isCurrent ? 'bg-[var(--scaffold-accent-row)]' : 'bg-transparent',
                  )}
                >
                  <StageGlyphIcon stage={st} size={11} />
                  {isCurrent && (
                    <span className="ml-auto block h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent-dot)]" />
                  )}
                </div>
              );
            })}
          </aside>

          {/* Mini Stage Content */}
          <div className="flex flex-1 flex-col p-2.5">
            <div className="flex items-center justify-between pb-1.5">
              <span className="text-[11px] font-medium text-[rgba(10,10,10,0.8)]">{activeStage}</span>
              <span className="h-[5px] w-[5px] rounded-full bg-[var(--scaffold-accent-dot)]" />
            </div>
            <div className="flex flex-1 flex-col justify-between rounded-[10px] border border-[var(--scaffold-hairline)] bg-white p-2">
              {activeStage === 'discover' && (
                <>
                  <div className="flex items-center gap-1.5 rounded-[6px] border border-[var(--scaffold-accent-chip)] bg-[var(--scaffold-accent-row)]/40 p-1">
                    <span className="h-[3.5px] w-[3.5px] rounded-full bg-[var(--scaffold-accent)]" />
                    <Bar w="65%" h={5} tint />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-[6px] border border-[rgba(10,10,10,0.06)] bg-white p-1">
                    <span className="h-[3.5px] w-[3.5px] rounded-full bg-[rgba(10,10,10,0.25)]" />
                    <Bar w="80%" h={5} />
                  </div>
                  <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.5)]">four signals</span>
                    <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent-dot)]" />
                  </div>
                </>
              )}
              {activeStage === 'research' && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="h-[18px] w-[18px] shrink-0 rounded-full bg-[rgba(10,10,10,0.05)]" />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <Bar w="70%" h={5} />
                      <Bar w="45%" h={4} />
                    </div>
                  </div>
                  <div className="py-0.5">
                    <Waveform live={live} />
                  </div>
                  <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.5)]">public signals</span>
                    <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent-dot)]" />
                  </div>
                </>
              )}
              {activeStage === 'qualify' && (
                <>
                  <div className="flex items-center justify-between rounded-[6px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-1">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.7)]">fit</span>
                    <div className="flex items-center gap-0.5">
                      {[0, 1, 2, 3].map((k) => (
                        <span key={k} className="h-[7px] w-[2.5px] rounded-full bg-[var(--scaffold-accent)]" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.6)]">company size</span>
                    <Bar w={36} h={4} />
                  </div>
                  <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.5)]">right fit</span>
                    <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent-dot)]" />
                  </div>
                </>
              )}
              {activeStage === 'personalize' && (
                <>
                  <div className="relative flex aspect-21/9 w-full items-center justify-center rounded-[5px] bg-[rgba(10,10,10,0.05)]">
                    <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-white shadow-xs">
                      <svg width="6" height="6" viewBox="0 0 12 12" fill="none">
                        <path d="M4.6 3 9.4 6l-4.8 3Z" fill="var(--scaffold-accent)" />
                      </svg>
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bar w="32%" h={4} />
                    <span className="inline-flex rounded-[2px] bg-[var(--scaffold-accent-row)] px-1 py-0.5">
                      <Bar w={20} h={3} tint />
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.5)]">draft</span>
                    <span className="text-[9px] font-medium text-[var(--scaffold-accent)]">personalized</span>
                  </div>
                </>
              )}
              {activeStage === 'outreach' && (
                <>
                  <div className="flex items-center justify-between rounded-[6px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-1">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.7)]">approved</span>
                    <span className="h-[3.5px] w-[3.5px] rounded-full bg-[var(--scaffold-accent)]" />
                  </div>
                  <div className="relative h-[4px] w-full rounded-full bg-[var(--scaffold-hairline)]">
                    <motion.span
                      className="absolute top-1/2 block h-[8px] w-[18px] -translate-y-1/2 rounded-full border border-[rgba(10,10,10,0.1)] bg-white shadow-2xs"
                      animate={live ? { left: ['0%', '70%', '0%'] } : { left: '35%' }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                  <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.5)]">delivered</span>
                    <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent-dot)]" />
                  </div>
                </>
              )}
              {activeStage !== 'discover' &&
                activeStage !== 'research' &&
                activeStage !== 'qualify' &&
                activeStage !== 'personalize' &&
                activeStage !== 'outreach' && (
                  <>
                    <Bar w="60%" h={5} />
                    <Bar w="90%" h={5} />
                    <Bar w="75%" h={5} />
                    <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1">
                      <Bar w={32} h={4} />
                      <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent-dot)]" />
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Desktop full preview ───────────────────────────────────────────────── */
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden rounded-[28px] border border-[var(--scaffold-hairline)] bg-white p-3"
      style={{
        boxShadow: 'var(--scaffold-shadow-object)',
      }}
    >
      {/* Inner Workspace Container */}
      <div className="flex h-[510px] overflow-hidden rounded-[20px] border border-[var(--scaffold-hairline)] bg-[var(--scaffold-panel)]">
        {/* ── L1 SIDEBAR (168px desktop, 46px mobile icon rail) ── */}
        <aside
          className={cn(
            'flex shrink-0 flex-col border-r border-[var(--scaffold-hairline)] bg-white p-1.5 md:p-2.5 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            railOpen ? 'w-[46px] md:w-[168px]' : 'w-[46px] md:w-[46px]',
          )}
        >
          {/* Workspace Header Switcher / rail toggle */}
          <button
            type="button"
            onClick={() => setRailOpen((v) => !v)}
            aria-expanded={railOpen}
            aria-label={railOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title={railOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="flex w-full items-center justify-center md:justify-start gap-2 rounded-[9px] px-1 md:px-2 py-2 text-left transition-colors hover:bg-[rgba(10,10,10,0.03)]"
          >
            <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] bg-[rgba(10,10,10,0.06)] shadow-2xs">
              <span className="h-[7px] w-[7px] rounded-full bg-[var(--scaffold-accent)]" />
            </span>
            <div className="hidden md:flex flex-col gap-1">
              <Bar w={52} h={7} />
              <Bar w={34} h={5} />
            </div>
            <svg width="7" height="5" viewBox="0 0 8 6" fill="none" className="hidden md:block ml-auto opacity-35">
              <path d="M1 1.5L4 4.5L7 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <span className="my-1.5 block h-px w-full bg-[var(--scaffold-hairline)]" />

          {/* 7 Workflow Stages */}
          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
            {SIDEBAR_STAGES.map((st) => {
              const isCurrent = st === activeStage;
              const status: AgentStatus = isCurrent
                ? 'running'
                : SIDEBAR_STAGES.indexOf(st) < SIDEBAR_STAGES.indexOf(activeStage)
                ? 'done'
                : 'idle';

              return (
                <button
                  key={st}
                  type="button"
                  data-dash-stage={st}
                  onClick={() => handleSelectStage(st)}
                  className={cn(
                    'group relative flex h-[35px] w-full items-center justify-center md:justify-start gap-2 rounded-[8px] px-1 md:px-2 text-left transition-colors',
                    isCurrent ? 'bg-[var(--scaffold-accent-row)]' : 'hover:bg-[rgba(10,10,10,0.03)]',
                  )}
                >
                  {isCurrent ? (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 rounded-[8px] bg-[var(--scaffold-accent-row)]"
                      transition={POP}
                    />
                  ) : null}

                  <span className="relative">
                    <StageGlyphIcon stage={st} size={12} />
                  </span>

                  <span className={cn('hidden md:inline relative text-[11.5px] font-medium tracking-tight text-[rgba(10,10,10,0.85)]', !railOpen && 'md:hidden')}>
                    {st}
                  </span>

                  <span className="hidden md:inline relative ml-auto">
                    <StatusBadge status={status} live={live} />
                  </span>
                </button>
              );
            })}

            {/* Hairline + Overview Stage */}
            <span className="my-1 block h-px w-full bg-[var(--scaffold-hairline)]" />

            <button
              type="button"
              onClick={() => handleSelectStage('overview')}
              className={cn(
                'group relative flex h-[34px] w-full items-center justify-center md:justify-start gap-2 rounded-[8px] px-1 md:px-2 text-left transition-colors',
                activeStage === 'overview'
                  ? 'bg-[var(--scaffold-accent-row)]'
                  : 'hover:bg-[rgba(10,10,10,0.03)]',
              )}
            >
              <StageGlyphIcon stage="overview" size={12} />
              <span className={cn('hidden md:inline text-[11.5px] font-medium tracking-tight text-[rgba(10,10,10,0.85)]', !railOpen && 'md:hidden')}>
                overview
              </span>
              <span className="hidden md:inline ml-auto">
                <StatusBadge status={activeStage === 'overview' ? 'running' : 'idle'} live={live} />
              </span>
            </button>
          </nav>

          {/* Bottom User Profile Block */}
          <div className="mt-auto flex items-center justify-center md:justify-start gap-2 border-t border-[var(--scaffold-hairline)] px-1 md:px-1.5 pt-2">
            <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--color-brand)_10%,rgba(255,255,255,1))]">
              <span className="h-[5px] w-[5px] rounded-full bg-[var(--scaffold-accent-dot)]" />
            </span>
            <div className="hidden md:flex flex-col gap-1">
              <Bar w={54} h={5} />
              <Bar w={32} h={4} />
            </div>
            <span className="hidden md:block ml-auto h-[4.5px] w-[4.5px] rounded-full bg-[var(--scaffold-accent-dot)]" />
          </div>
        </aside>

        {/* ── MAIN WORKSPACE CANVAS ── */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* L1 TOP BAR (48px) */}
          <header className="flex h-[48px] shrink-0 items-center justify-between border-b border-[var(--scaffold-hairline)] bg-white px-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-[rgba(10,10,10,0.06)] shadow-2xs">
                <span className="h-[5px] w-[5px] rounded-full bg-[var(--scaffold-accent)]" />
              </span>
              <svg width="5" height="8" viewBox="0 0 6 10" fill="none" className="text-[rgba(10,10,10,0.3)]">
                <path d="M1 1.5L4.5 5L1 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[12px] font-semibold tracking-tight text-[var(--scaffold-ink)]">
                {activeStage}
              </span>
            </div>

            {/* Live Command Bar */}
            <CommandBar live={live} activeStage={activeStage} />

            {/* Agent Presence Avatars Cluster */}
            <AgentPresenceCluster live={live} />
          </header>

          {/* Focal Stage Canvas */}
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 sm:p-2.5 md:p-3.5">
            <StageSettledContext.Provider value={activeStageReport}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE_SMOOTH }}
                className="flex h-full flex-col justify-center"
              >
                {activeStage === 'discover' && <DiscoverStageView live={live} />}
                {activeStage === 'research' && <ResearchStageView live={live} />}
                {activeStage === 'qualify' && <QualifyStageView live={live} />}
                {activeStage === 'personalize' && <PersonalizeStageView live={live} />}
                {activeStage === 'outreach' && <OutreachStageView live={live} />}
                {activeStage === 'converse' && <ConverseStageView live={live} />}
                {activeStage === 'configure' && <ConfigureStageView />}
                {activeStage === 'overview' && <OverviewStageView />}
              </motion.div>
            </AnimatePresence>
            </StageSettledContext.Provider>
          </main>

          {/* Bottom Integrated Activity & Telemetry Strip */}
          <BottomActivityStrip live={live} activeStage={activeStage} />

          {/* Autonomous Bot Launcher Action Button & Drawer */}
          <div className="absolute bottom-12 right-3.5 z-20 hidden md:block">
            {botDrawerOpen ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="mb-2 w-[190px] rounded-[12px] border border-[rgba(10,10,10,0.1)] bg-white p-2.5 shadow-lg backdrop-blur-md"
              >
                <div className="flex items-center justify-between pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" />
                    <span className="text-[10px] font-medium text-[rgba(10,10,10,0.8)]">{activeStage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBotDrawerOpen(false)}
                    className="text-[10px] text-[rgba(10,10,10,0.4)] hover:text-black"
                  >
                    ×
                  </button>
                </div>
                <Bar w="90%" h={5} />
                <div className="mt-1.5 flex items-center justify-between pt-1">
                  <Bar w={38} h={4} />
                  <span className="inline-flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[var(--scaffold-accent-row)]">
                    <span className="h-[3px] w-[3px] rounded-full bg-[var(--scaffold-accent)]" />
                  </span>
                </div>
              </motion.div>
            ) : null}

            <button
              type="button"
              onClick={() => setBotDrawerOpen(!botDrawerOpen)}
              className="relative flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border border-[rgba(255,255,255,0.22)] bg-[#151515] shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-transform hover:scale-110 active:scale-95"
            >
              {/* Subtle ambient aura */}
              <span className="absolute inset-0 rounded-full bg-[var(--scaffold-accent)] opacity-25 animate-ping" />
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="relative z-10">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="var(--scaffold-accent)" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
