'use client';

/**
 * AMBIENT ENVIRONMENT — SlideIn Venture design language
 * ------------------------------------------------------
 * The hero band's texture. NOT site-wide: it used to be fixed behind the whole
 * document, and one wash running the full page flattened every band it crossed.
 * It belongs to the band that is the light source. Six layers, all nearly
 * invisible:
 *
 *   1 paper grain  2 engineering dot grid  3 geometric mesh  4 drifting radial light
 *   5 blueprint construction guides  6 floating particles
 *   7 cursor-following ambient light
 *
 * Everything pointer-events-none, and every value reads the tone contract —
 * which is what lets the same six layers sit on brand orange without a single
 * per-theme branch. See the .tone-hero ambient overrides in app/styles/tone.css.
 */

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const PARTICLES = [
  { l: '8%', t: '18%', s: 3, d: 0, dr: 18, o: 0.14 },
  { l: '22%', t: '72%', s: 2, d: 4, dr: 14, o: 0.12 },
  { l: '38%', t: '30%', s: 2, d: 8, dr: 20, o: 0.1 },
  { l: '55%', t: '82%', s: 3, d: 2, dr: 16, o: 0.13 },
  { l: '68%', t: '14%', s: 2, d: 6, dr: 22, o: 0.1 },
  { l: '81%', t: '55%', s: 2, d: 10, dr: 15, o: 0.12 },
  { l: '92%', t: '28%', s: 3, d: 3, dr: 19, o: 0.11 },
  { l: '47%', t: '58%', s: 1.5, d: 12, dr: 12, o: 0.1 },
];

export default function AmbientEnvironment() {
  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const move = (e: PointerEvent) => {
      mx.set(e.clientX - 300);
      my.set(e.clientY - 300);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [mx, my]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 2 — paper grain */}
      <div
        className="absolute inset-0 opacity-[0.016]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* 3 — engineering dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%, black 40%, transparent 100%)',
        }}
      />
      {/* 3 — geometric mesh */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-rule) 1px, transparent 1px), linear-gradient(90deg, var(--color-rule) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* 4 — drifting radial light.
             A single ambient source only reads as lighting if it lights the
             thing that matters. Both lobes are pulled up and left so the warm
             centre sits BEHIND and slightly ABOVE the headline — the type is
             what appears illuminated. Parked over empty canvas, the same
             gradient reads as a stray blob rather than as a light source. */}
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full"
        style={{ background: 'radial-gradient(circle, var(--ambient-a) 0%, transparent 65%)', top: '-28%', left: '-16%' }}
        animate={{ x: [0, 120, 0], y: [0, 60, 0] }}
        transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[760px] h-[760px] rounded-full"
        style={{ background: 'radial-gradient(circle, var(--ambient-b) 0%, transparent 62%)', top: '-16%', left: '4%' }}
        animate={{ x: [0, 64, 0], y: [0, 38, 0] }}
        transition={{ duration: 46, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />
      {/* 5 — blueprint construction guides.
             The rules sit on the CONTENT axis, not on the viewport edge. Same
             max-width and padding as the page container, so the dashed line
             marks the actual left edge of the type instead of framing a few
             hundred pixels of nothing. */}
      <div className="absolute inset-y-0 left-1/2 w-full max-w-[1200px] -translate-x-1/2 px-6 md:px-10">
        <div className="relative h-full">
          <div className="absolute inset-y-0 left-0 w-px border-l border-dashed border-[var(--rule)]" />
          <div className="absolute inset-y-0 right-0 w-px border-r border-dashed border-[var(--rule)]" />
          {[...Array(14)].map((_, i) => (
            <span key={i} className="absolute left-0 h-px w-1.5 bg-[var(--rule)]" style={{ top: `${(i + 1) * 7}%` }} />
          ))}
        </div>
      </div>
      {/* 6 — floating particles */}
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          /* --accent-vivid, not --color-brand. This layer now lives inside the
             hero, and the hero band IS brand orange — a brand-orange particle
             on a brand-orange field is nothing at all. Reading the tone makes
             them ink here and would make them orange on any paper band. */
          className="absolute rounded-full bg-[var(--accent-vivid)]"
          style={{ left: p.l, top: p.t, width: p.s, height: p.s }}
          animate={{ y: [0, -p.dr, 0], opacity: [0, p.o, 0] }}
          transition={{ duration: 14 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: p.d }}
        />
      ))}
      {/* 7 — cursor-following ambient light (desktop) */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full hidden md:block"
        style={{ x: sx, y: sy, background: 'radial-gradient(circle, var(--ambient-c) 0%, transparent 60%)' }}
      />
    </div>
  );
}
