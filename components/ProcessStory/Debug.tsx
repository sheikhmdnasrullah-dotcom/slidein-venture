/**
 * PROCESS DEBUG OVERLAY (?debug=process — dev only, stripped from prod)
 * ---------------------------------------------------------------------------
 * Draws container edges, the spine path, all anchors (spine nodes, exit
 * markers, callout anchors), handoff artifact boxes, scene art boxes, the
 * live accent count, and per-chapter active beats. The NODE_ENV gate lets
 * the bundler strip this from production entirely. Tiny dev-only labels
 * are aria-hidden and never ship.
 */

'use client';

import { useEffect, useState } from 'react';

interface Mark {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  kind: 'container' | 'spine' | 'anchor' | 'handoff' | 'scene' | 'callout';
}

const COLORS: Record<Mark['kind'], string> = {
  container: 'rgba(10,10,10,0.18)',
  spine: 'var(--scaffold-accent)',
  anchor: 'rgba(10,10,10,0.45)',
  handoff: 'rgba(10,10,10,0.35)',
  scene: 'rgba(10,10,10,0.25)',
  callout: 'rgba(10,10,10,0.5)',
};

export function ProcessDebug() {
  const [on, setOn] = useState(false);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [spineD, setSpineD] = useState('');
  const [accents, setAccents] = useState(0);
  const [beats, setBeats] = useState<string[]>([]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (!window.location.search.includes('debug=process')) return;
    const kick = setTimeout(() => setOn(true), 0);
    let raf = 0;
    const measure = () => {
      const out: Mark[] = [];
      const box = (el: Element, label: string, kind: Mark['kind']) => {
        const b = el.getBoundingClientRect();
        if (b.width === 0 && b.height === 0) return;
        out.push({ x: b.x, y: b.y, w: b.width, h: b.height, label, kind });
      };
      document.querySelectorAll('[data-story-root] .story-container').forEach((el, i) => {
        if (i % 3 === 0) box(el, '', 'container');
      });
      document.querySelectorAll('[data-spine-node]').forEach((el) => {
        box(el, el.getAttribute('data-spine-node') ?? '', 'anchor');
      });
      document.querySelectorAll('[data-exit-marker]').forEach((el) => {
        box(el, `exit-${el.getAttribute('data-exit-marker')}`, 'anchor');
      });
      document.querySelectorAll('[data-callout-anchor]').forEach((el) => {
        box(el, el.getAttribute('data-callout-anchor') ?? '', 'callout');
      });
      document.querySelectorAll('[data-handoff]').forEach((el) => {
        box(el, el.getAttribute('data-handoff') ?? '', 'handoff');
      });
      document.querySelectorAll('[data-scene-surface]').forEach((el) => {
        box(el, `scene-${el.getAttribute('data-scene-surface')}`, 'scene');
      });
      const spine = document.querySelector('[data-spine-svg] path');
      setSpineD(spine?.getAttribute('d') ?? '');
      let n = 0;
      document.querySelectorAll('[data-accent]').forEach((el) => {
        if (Number(getComputedStyle(el as HTMLElement).opacity) >= 0.5) n++;
      });
      setAccents(n);
      setBeats(
        [...document.querySelectorAll('[data-chapter]')].map(
          (el) => el.getAttribute('data-active-beat') ?? '?',
        ),
      );
      setMarks(out);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    const t = setTimeout(measure, 800);
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      clearTimeout(kick);
      clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule);
    };
  }, []);

  if (process.env.NODE_ENV === 'production' || !on) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0" style={{ zIndex: 9999 }}>
      <svg className="absolute inset-0 h-full w-full">
        {spineD && (
          <path d={spineD} fill="none" stroke={COLORS.spine} strokeWidth="1" strokeDasharray="4 4" opacity="0.7" />
        )}
      </svg>
      {marks.map((m, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: m.x,
            top: m.y,
            width: Math.max(m.w, 6),
            height: Math.max(m.h, 6),
            outline: `1px solid ${COLORS[m.kind]}`,
          }}
        >
          {m.label && (
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: -13,
                fontSize: 9,
                lineHeight: 1,
                color: 'rgba(10,10,10,0.6)',
                background: 'rgba(255,255,255,0.9)',
                padding: '2px 3px',
                whiteSpace: 'nowrap',
              }}
            >
              {m.label}
            </span>
          )}
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          right: 12,
          top: 84,
          fontSize: 11,
          lineHeight: 1.5,
          color: 'rgba(10,10,10,0.75)',
          background: 'rgba(255,255,255,0.92)',
          border: '1px solid rgba(10,10,10,0.12)',
          borderRadius: 8,
          padding: '8px 10px',
          fontFamily: 'monospace',
        }}
      >
        <div>accents: {accents}</div>
        <div>beats: [{beats.join(' ')}]</div>
      </div>
    </div>
  );
}
