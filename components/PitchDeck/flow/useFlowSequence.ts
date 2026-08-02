'use client';

/**
 * FLOW SEQUENCE — the three-part animation split
 * ---------------------------------------------------------------------------
 * Every diagram in the framework run animates the same three ways, and mixing
 * the two modes is the whole reason it reads as alive rather than mechanical:
 *
 *   1. LINE DRAW — continuous, scrubbed 1:1. `stroke-dasharray` is the path's
 *      own length; `stroke-dashoffset` is driven straight off scroll progress
 *      with no easing in between. It should feel glued to the scrollbar.
 *
 *   2. TRAVELLING PULSE — continuous, scrubbed 1:1. One dot rides whichever
 *      connector is currently drawing, positioned with `getPointAtLength` on
 *      the same progress value. Same clock as the line, by construction.
 *
 *   3. CARD POP-IN — discrete, springy, NOT scrubbed. A card crosses its
 *      threshold once and that fires an independent eased transition
 *      (`back.out(1.7)`). This is the only place a bounce exists, and it has to
 *      have its own clock: a continuously scrubbed property cannot play out an
 *      overshoot, because scrubbing back would just replay the overshoot in
 *      reverse as a wobble.
 *
 * SCROLLING UP MUST UNDO ALL THREE. The line un-draws for free, since the
 * offset is a pure function of progress. The pops are tracked in a `shown`
 * array and animated back out when progress falls below their threshold —
 * that is this hook's `onLeaveBack`, done once for every node instead of one
 * ScrollTrigger per card.
 *
 * PATH LENGTHS ARE NOT CONSTANT. The connectors are measured from live DOM
 * (see FlowCanvas), so a breakpoint change, a font swap or a reflow rewrites
 * every `d`. Lengths are cached and the cache is dropped on resize.
 */

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** A connector, plus the slice of overall progress it draws across. */
export type Wire = { id: string; from: number; to: number };

/** A card, plus the single progress value at which it pops in. */
export type Pop = { id: string; at: number };

export type FlowSequenceOptions = {
  /** The element whose scroll travel drives the sequence. */
  root: RefObject<HTMLElement | null>;
  /** The subtree holding the `data-flow-*` elements. */
  scope: RefObject<HTMLElement | null>;
  wires: Wire[];
  pops: Pop[];
  start?: string;
  end?: string;
};

const POP_IN = { duration: 0.55, ease: 'back.out(1.7)' } as const;
const POP_OUT = { duration: 0.3, ease: 'power2.in' } as const;

export function useFlowSequence({
  root,
  scope,
  wires,
  pops,
  start = 'top 80%',
  end = 'bottom 65%',
}: FlowSequenceOptions) {
  useEffect(() => {
    const rootEl = root.current;
    const scopeEl = scope.current;
    if (!rootEl || !scopeEl) return;

    const node = (id: string) =>
      scopeEl.querySelector<HTMLElement>(`[data-flow-node="${CSS.escape(id)}"]`);
    const path = (id: string) =>
      scopeEl.querySelector<SVGPathElement>(`[data-flow-path="${CSS.escape(id)}"]`);
    const pulse = scopeEl.querySelector<SVGCircleElement>('[data-flow-pulse]');

    /* Reduced motion gets the finished drawing, not a slower one. There is no
       degraded version of a scroll-scrubbed reveal worth shipping. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pops.forEach((p) => {
        const el = node(p.id);
        if (el) gsap.set(el, { opacity: 1, scale: 1, clearProps: 'transform' });
      });
      wires.forEach((w) => {
        const el = path(w.id);
        if (el) el.style.removeProperty('stroke-dasharray');
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lengths = new Map<string, number>();
    const lengthOf = (el: SVGPathElement, id: string) => {
      const cached = lengths.get(id);
      if (cached !== undefined) return cached;
      const len = el.getTotalLength();
      lengths.set(id, len);
      return len;
    };

    /* One entry per pop, in the same order. `false` means "currently hidden",
       which is also the state the hook sets up below. */
    const shown = pops.map(() => false);

    const ctx = gsap.context(() => {
      pops.forEach((p) => {
        const el = node(p.id);
        if (el) gsap.set(el, { opacity: 0, scale: 0.86, transformOrigin: '50% 50%' });
      });

      const apply = (progress: number) => {
        /* 1 · the lines */
        let active: { el: SVGPathElement; t: number; id: string } | null = null;
        wires.forEach((w) => {
          const el = path(w.id);
          if (!el) return;
          const len = lengthOf(el, w.id);
          const span = Math.max(w.to - w.from, 0.0001);
          const t = gsap.utils.clamp(0, 1, (progress - w.from) / span);
          el.style.strokeDasharray = `${len}`;
          el.style.strokeDashoffset = `${len * (1 - t)}`;
          if (t > 0 && t < 1) active = { el, t, id: w.id };
        });

        /* 2 · the pulse, on whichever line is mid-draw */
        if (pulse) {
          if (active) {
            const { el, t, id } = active as { el: SVGPathElement; t: number; id: string };
            const pt = el.getPointAtLength(lengthOf(el, id) * t);
            pulse.setAttribute('cx', String(pt.x));
            pulse.setAttribute('cy', String(pt.y));
            pulse.setAttribute('opacity', '1');
          } else {
            pulse.setAttribute('opacity', '0');
          }
        }

        /* 3 · the pops, on their own clock once crossed */
        pops.forEach((p, i) => {
          const el = node(p.id);
          if (!el) return;
          const past = progress >= p.at;
          if (past === shown[i]) return;
          shown[i] = past;
          gsap.to(el, past ? { opacity: 1, scale: 1, ...POP_IN } : { opacity: 0, scale: 0.86, ...POP_OUT });
        });
      };

      const trigger = ScrollTrigger.create({
        trigger: rootEl,
        start,
        end,
        scrub: 1,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => {
          lengths.clear();
          apply(self.progress);
        },
      });

      apply(trigger.progress);
    }, scopeEl);

    /* A connector's `d` is rewritten whenever the stack reflows, and a stale
       cached length shows up as a line that draws to 80% and stops. */
    const ro = new ResizeObserver(() => {
      lengths.clear();
      ScrollTrigger.refresh();
    });
    ro.observe(scopeEl);

    return () => {
      ro.disconnect();
      ctx.revert();
    };
  }, [root, scope, wires, pops, start, end]);
}
