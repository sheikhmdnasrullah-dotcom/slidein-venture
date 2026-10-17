/**
 * RECAP — the four artifacts, and the thread that closes the loop
 * ---------------------------------------------------------------------------
 * The four handoff artifacts side by side, joined by threads, with four
 * caption slots below. Minis render DIM (spent artifacts — the rider
 * carries the charge through), keeping the stage accent budget. The spine
 * path jogs through the four minis (data-spine-node recap-1..4).
 *
 * Underneath, a curved return thread runs from the 4th artifact
 * (LoopCheckArtifact) back to the 1st (ShortlistArtifact) and ends in an
 * arrowhead — the visual feedback leg that turns a linear pipeline back
 * into the loop the intro started from.
 *
 * Hydration: the return curve needs both endpoints measured, so it renders
 * nothing until the first post-hydration measurement. Server and first
 * client render are identical — no layout shift, no mismatch.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { TextSlot } from '@/components/Hero/Skeleton';
import { PROCESS_COPY } from '@/content/process';
import { round05 } from './geometry';
import { CapsuleArtifact, DraftArtifact, LoopCheckArtifact, ShortlistArtifact } from './icons';

/** Vertical drop below the row before the curve turns back. */
const DROP = 56;

interface Ends {
  w: number;
  h: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export function StoryRecap() {
  const copy = PROCESS_COPY.recap;
  const captions = [copy.caption1, copy.caption2, copy.caption3, copy.caption4];
  const wrapRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLSpanElement>(null);
  const toRef = useRef<HTMLSpanElement>(null);
  const [ends, setEnds] = useState<Ends | null>(null);

  /* Measure both artifact centres relative to the wrap. */
  useEffect(() => {
    const wrap = wrapRef.current;
    const from = fromRef.current;
    const to = toRef.current;
    if (!wrap || !from || !to) return;
    const read = () => {
      const w = wrap.getBoundingClientRect();
      const f = from.getBoundingClientRect();
      const t = to.getBoundingClientRect();
      if (w.width <= 0) return;
      setEnds({
        w: round05(w.width),
        h: round05(w.height),
        from: { x: round05(f.x + f.width / 2 - w.x), y: round05(f.y - w.y) },
        to: { x: round05(t.x + t.width / 2 - w.x), y: round05(t.y - w.y) },
      });
    };
    read();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(read);
    ro.observe(wrap);
    document.fonts?.ready.then(read).catch(() => {});
    window.addEventListener('resize', read);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', read);
    };
  }, []);

  const path = ends ? returnPath(ends, DROP) : null;
  const loop = path && ends ? { path, w: ends.w } : null;

  return (
    <section data-recap aria-label={copy.ariaLabel || undefined} className="story-recap">
      <div className="story-container" aria-hidden="true">
        {/* The wrap reserves the loop's vertical run so the curve never
            overlaps the caption slots below. */}
        <div ref={wrapRef} style={{ position: 'relative', paddingBottom: DROP + 16 }}>
          <div className="recap-row">
            <span ref={toRef} data-spine-node="recap-1" style={{ position: 'relative', zIndex: 2 }}>
              <ShortlistArtifact id="recap-1" dim />
            </span>
            <span className="recap-thread" />
            <span data-spine-node="recap-2" style={{ position: 'relative', zIndex: 2 }}>
              <DraftArtifact id="recap-2" dim />
            </span>
            <span className="recap-thread" />
            <span data-spine-node="recap-3" style={{ position: 'relative', zIndex: 2 }}>
              <CapsuleArtifact id="recap-3" dim />
            </span>
            <span className="recap-thread" />
            <span ref={fromRef} data-spine-node="recap-4" style={{ position: 'relative', zIndex: 2 }}>
              <LoopCheckArtifact id="recap-4" dim />
            </span>
          </div>
          {/* The return leg: 4 → 1, closing the loop. */}
          {loop && ends && (
            <svg
              width={loop.w}
              height={DROP + 20}
              viewBox={`0 0 ${loop.w} ${DROP + 20}`}
              fill="none"
              data-icon="recap-loop"
              style={{
                position: 'absolute',
                left: 0,
                top: ends.h - 8,
                overflow: 'visible',
                pointerEvents: 'none',
              }}
            >
              <path d={loop.path.d} stroke="rgba(10,10,10,0.22)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              <path d={loop.path.head} stroke="rgba(10,10,10,0.22)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          )}
        </div>
        <div className="recap-captions">
          {captions.map((c, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <TextSlot text={c} textClassName="block" barWidth="10ch" barClassName="mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The return curve, in the svg's local space (origin at the wrap's left,
 * DROP below the row baseline). One cubic from the 4th artifact down and
 * back to the 1st, plus the two-stroke arrowhead at the receiving end.
 */
function returnPath(ends: Ends, drop: number): { d: string; head: string } {
  const y0 = 8;
  const y1 = y0 + drop;
  const { from, to } = ends;
  /* Control points pull the curve below both ends so it reads as a sweep
     under the row, not a straight chord across it. */
  const c1 = { x: from.x + 34, y: y1 };
  const c2 = { x: to.x - 34, y: y1 };
  const d = `M${from.x} ${y0} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${to.x} ${y0}`;
  /* Arrowhead: two short strokes off the tangent at the receiving end. The
     tangent there points up-left, so the head opens up and back. */
  const head = `M${to.x - 9} ${y0 + 8} L${to.x} ${y0} L${to.x + 8} ${y0 + 7}`;
  return { d, head };
}