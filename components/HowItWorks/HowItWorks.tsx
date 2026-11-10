'use client';

/**
 * HOW IT WORKS — the foot of the hero. Not a video card: a pinned story that
 * plays as the visitor scrolls. One GSAP master timeline (62 s of story, the
 * script and sample data come from how-it-works-video/) is scrubbed directly
 * by scroll, so the visitor sets the pace and can scrub back. Eight scenes,
 * three objects that persist across them (the saved profile, the prospect, the
 * matched offer), one orange thread that ties every output to its origin.
 *
 * Reduced motion / no JS: no pin, no playback. The stage rests on the finished
 * frame and the full script is written out below it.
 */

import '@/app/styles/howitworks.css';
import { Check } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCENES } from '@/how-it-works-video/data/scenes.config';
import { useSettledStill } from '@/lib/useSettledStill';
import { runSync, tokenize, W } from './helpers';
import { Persist, Scenes } from './Scenes';
import { buildTimeline, TOTAL } from './timeline';

gsap.registerPlugin(ScrollTrigger);

/** Pinned scroll distance, in viewport heights (about 1.1 per scene). */
const SCROLL_VH = 9;

declare global {
  interface Window {
    __howitworks?: { seek: (p: number) => void; progress: () => number; scene: () => number };
  }
}

export function HowItWorks() {
  const still = useSettledStill();
  const sectionRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [scene, setScene] = useState(0);
  const reduce = useReducedMotion();

  /* Depth: the stage tilts a little toward the pointer, on a spring. */
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const rotateY = useSpring(tx, { stiffness: 120, damping: 20, mass: 0.6 });
  const rotateX = useSpring(ty, { stiffness: 120, damping: 20, mass: 0.6 });
  const tilt = !still && !reduce;
  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!tilt || e.pointerType !== 'mouse') return;
      const r = e.currentTarget.getBoundingClientRect();
      tx.set(((e.clientX - r.left) / r.width - 0.5) * 3);
      ty.set(-((e.clientY - r.top) / r.height - 0.5) * 3);
    },
    [tilt, tx, ty],
  );
  const onLeave = useCallback(() => {
    tx.set(0);
    ty.set(0);
  }, [tx, ty]);

  /* Fit the artboard into the space left by the header and the caption. */
  useLayoutEffect(() => {
    const slot = slotRef.current;
    const stage = stageRef.current;
    const art = artRef.current;
    if (!slot || !stage || !art) return;
    const fit = () => {
      const w = Math.max(280, Math.min(slot.clientWidth, (slot.clientHeight * 16) / 9, 1180));
      stage.style.width = `${w}px`;
      stage.style.height = `${(w * 9) / 16}px`;
      art.style.setProperty('--hw-k', String(w / W));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(slot);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const art = artRef.current;
    if (!section || !art) return;
    let cancelled = false;
    let ctx: gsap.Context | null = null;

    /* Measure after the faces load: text widths decide where the threads land. */
    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const { tl, sceneAt } = buildTimeline(section, art);
        const show = (t: number) => {
          const i = sceneAt(t);
          setScene((cur) => (cur === i ? cur : i));
        };
        if (still) {
          tl.time(TOTAL, false);
          runSync();
          show(TOTAL);
          return;
        }
        const st = ScrollTrigger.create({
          animation: tl,
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.round(SCROLL_VH * window.innerHeight)}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            runSync();
            show(self.progress * TOTAL);
          },
          onRefresh: (self) => {
            runSync();
            show(self.progress * TOTAL);
          },
        });
        triggerRef.current = st;
        window.__howitworks = {
          seek: (p) => {
            window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: 'instant' });
          },
          progress: () => st.progress,
          scene: () => sceneAt(st.progress * TOTAL),
        };
        ScrollTrigger.refresh();
      }, section);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      triggerRef.current = null;
      delete window.__howitworks;
    };
  }, [still]);

  useEffect(() => {
    if (countRef.current) countRef.current.textContent = `${String(scene + 1).padStart(2, '0')} / 08`;
  }, [scene]);

  const jump = useCallback((i: number) => {
    const st = triggerRef.current;
    if (!st) return;
    const p = (SCENES[i].start + 0.8) / TOTAL;
    window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: 'smooth' });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      data-testid="how-it-works"
      aria-label="How it works"
      className="hw"
      data-still={still ? 'true' : 'false'}
    >
      <div className="hw-top">
        <div className="hw-title">
          <i aria-hidden="true" />
          <h2 className="font-display-sm">How it works</h2>
          <span ref={countRef} className="hw-count" aria-hidden="true">01 / 08</span>
        </div>
        <nav className="hw-rail" aria-label="Steps">
          <i className="hw-rail-fill" aria-hidden="true" />
          {SCENES.map((s, i) => {
            const state = i < scene ? 'done' : i === scene ? 'active' : 'upcoming';
            return (
              <button
                key={s.id}
                type="button"
                className="hw-node"
                data-state={state}
                aria-current={state === 'active' ? 'step' : undefined}
                onClick={() => jump(i)}
              >
                <span className="hw-nc">
                  {state === 'done' ? <Check size={11} strokeWidth={2.6} aria-hidden="true" /> : i + 1}
                </span>
                <span className="hw-nl">{s.railLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div ref={slotRef} className="hw-slot">
        <motion.div
          ref={stageRef}
          className="hw-stage"
          data-scene={scene + 1}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={{ rotateX, rotateY, transformPerspective: 1800 }}
        >
          {/* ambient layer: a light that follows the action, slow geometry behind the work */}
          <div className="hw-amb" aria-hidden="true">
            <i className="hw-amb-spot" />
            <i className="hw-amb-glow" />
            <svg className="hw-amb-geo" viewBox="0 0 400 400">
              <circle className="hw-amb-r1" cx="200" cy="200" r="190" />
              <circle className="hw-amb-r2" cx="200" cy="200" r="140" />
              <circle className="hw-amb-r3" cx="200" cy="200" r="90" />
              <g className="hw-amb-orbit"><circle cx="200" cy="10" r="4" /></g>
            </svg>
          </div>
          <div ref={artRef} className="hw-art" aria-hidden="true">
            <div className="hw-cam">
              <Scenes />
              <Persist />
            </div>
          </div>
          {/* a sweep of light marks each change of scene */}
          {!still && <i key={scene} className="hw-wipe" aria-hidden="true" />}
        </motion.div>
      </div>

      <div className="hw-dock">
        <div className="hw-cmark" aria-hidden="true">
          <svg viewBox="0 0 44 44">
            <circle className="hw-cring-bg" cx="22" cy="22" r="20" />
            <circle className="hw-cring" cx="22" cy="22" r="20" pathLength={1} />
          </svg>
          <span key={scene} className="hw-cnum">{String(scene + 1).padStart(2, '0')}</span>
        </div>
        <div className="hw-caps">
        {SCENES.map((s, i) => (
          <p key={s.id} className="hw-cap" data-cap={i} aria-hidden="true">
            {tokenize(s.caption, s.emphasis).map((w, k) => (
              <span key={k}>
                {k > 0 ? ' ' : null}
                <span className="hw-cw" data-em={w.em ? 'true' : 'false'}>{w.text}</span>
              </span>
            ))}
          </p>
        ))}
        </div>
      </div>

      {/* The same script as text: for screen readers always, and for everyone when motion is off. */}
      <ol className={still ? 'hw-script' : 'hw-sr'}>
        {SCENES.map((s) => (
          <li key={s.id}>
            <b>{s.railLabel}</b>
            {s.caption}
          </li>
        ))}
      </ol>
    </section>
  );
}

export default HowItWorks;
