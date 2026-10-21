'use client';

/**
 * AGENTIC DASHBOARD SECTION — the full-view autonomous workspace
 * ---------------------------------------------------------------------------
 * Gives the living Agentic Dashboard the full, compact, proper grand view
 * it deserves on the website screen.
 *
 * On desktop the card pins and GSAP ScrollTrigger scrubs the workspace
 * through its stages in order — configure, discover, research, qualify,
 * personalize, outreach, converse — one per scroll step. Reduced motion
 * and narrow viewports get the plain, unpinned card instead.
 */

import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AgenticDashboard, { SCROLL_STAGES } from '@/components/DashboardPreview/AgenticDashboard';
import { Band, Reveal } from '@/components/Sections/primitives';
import { HOME } from '@/content/home';
import { useSettledStill } from '@/lib/useSettledStill';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STAGE_COUNT = SCROLL_STAGES.length;

function DashboardTagline() {
  const { full, highlight } = HOME.dashboardTagline;
  const at = full.indexOf(highlight);
  const preWords = (at < 0 ? full : full.slice(0, at)).trim().split(' ').filter(Boolean);
  const postWords = at < 0 ? [] : full.slice(at + highlight.length).trim().split(' ').filter(Boolean);
  const highlightWords = at < 0 ? [] : highlight.split(' ');

  /* isolate on the h2 contains the z--1 swash so the section's own flat
     background can never paint over it. */
  return (
    <h2 className="isolate text-[clamp(1.75rem,3.2vw,3rem)] font-[600] tracking-[-0.032em] text-[var(--scaffold-ink)] leading-[1.12] text-center text-balance">
      {preWords.map((word, i) => (
        <React.Fragment key={`pre-${i}`}>
          <span>{word}</span>{' '}
        </React.Fragment>
      ))}
      {at >= 0 && (
        <span className="relative inline-block whitespace-nowrap">
          {/* Swash background shape — always drawn; the Reveal above owns
              the entrance, so this adds no second motion. */}
          <span
            data-testid="dashboard-swash"
            className="hero-swash"
            aria-hidden="true"
            style={{
              zIndex: -1,
            }}
          >
            <svg
              className="hero-swash-shape [clip-path:inset(-8%_-1%_-8%_-1%)] opacity-100"
              viewBox="0 0 120 26"
              preserveAspectRatio="none"
              focusable="false"
            >
              <defs>
                <linearGradient id="dashboard-swash-grad" x1="0" y1="0" x2="0.985" y2="0.17">
                  <stop offset="0" style={{ stopColor: 'var(--hero-accent-300)' }} />
                  <stop offset="1" style={{ stopColor: 'var(--hero-accent-500)' }} />
                </linearGradient>
              </defs>
              <path
                d="M2.5 17.5 C4.5 12.5 7.5 9.5 12.5 8.2 L30 6.6 C35 6.3 37.5 4.3 43.5 4.5 C49.5 4.7 51.5 6.5 57.5 6.3 L70 6.1 C75.5 5.9 77.5 4.1 83.5 4.3 C89.5 4.5 91.5 6.1 97.5 6.3 L109.5 6.7 C114.5 6.9 117.5 9.2 117.5 13 C117.5 16.8 114.5 19.2 109.5 19.6 L96 20.4 C88 20.8 80 20.4 72 20.8 C60 21.4 48 20.8 36 21.2 C26 21.5 16 21.2 10.5 20.2 C5.5 19.4 3 18.7 2.5 17.5 Z"
                fill="url(#dashboard-swash-grad)"
              />
            </svg>
          </span>
          <span className="relative z-10">
            {highlightWords.map((word, i) => (
              <React.Fragment key={`hl-${i}`}>
                <span>{word}</span>
                {i < highlightWords.length - 1 && ' '}
              </React.Fragment>
            ))}
          </span>
        </span>
      )}
      {postWords.map((word, i) => (
        <React.Fragment key={`post-${i}`}>
          {' '}
          <span>{word}</span>
        </React.Fragment>
      ))}
    </h2>
  );
}

export default function AgenticDashboardSection() {
  const calm = useSettledStill();
  const rootRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  /* The tall track only exists when the scroll sequence will actually run. */
  const [pinned, setPinned] = useState(false);
  /* Rail state. `shown` is the stage on screen, `desired` is where scroll
     is asking to be. They converge one stage at a time, gated on the stage
     having finished drawing — never on a timer, so the pace is the viewer's
     scroll and each stage gets to actually resolve before the next. */
  const rail = useRef({ shown: 0, desired: 0, settled: true, failSafe: 0 });
  /* Only the stage actually on screen can open the gate. A scene that
     unmounts late and reports in would otherwise release the gate twice and
     jump a stage. */
  const markSettled = useCallback((stage: string) => {
    const r = rail.current;
    if (SCROLL_STAGES[r.shown] === stage) r.settled = true;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-width: 768px)').matches;
    if (reduce || !wide) return;
    /* Deferred out of the effect body so the layout flag lands in its own
       render rather than cascading synchronously here. */
    const pinFrame = window.requestAnimationFrame(() => setPinned(true));

    const track = rootRef.current;
    if (!track) return;

    /* Numeric start/end, measured from the track's own box.
       ScrollTrigger's string positions are resolved against the document at
       a moment when this page has not settled its full height yet, so the
       trigger would sit thousands of pixels off and read as always-ended.
       Measuring the element directly removes that dependency; the handler
       re-measures on resize and on the next frames after mount. */
    const measure = () => {
      const rect = track.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      return { top, height: rect.height };
    };

    let stageTrigger: ScrollTrigger | undefined;

    const ctx = gsap.context(() => {
      const build = () => {
        const { top, height } = measure();
        const start = top;
        const end = Math.max(start + 1, top + height - window.innerHeight);

        gsap.fromTo(
          track.querySelector('[data-dash-card]'),
          { yPercent: 4, scale: 0.99, autoAlpha: 0 },
          {
            yPercent: 0,
            scale: 1,
            autoAlpha: 1,
            ease: 'none',
            immediateRender: true,
            scrollTrigger: { start: top - window.innerHeight * 0.85, end: top - window.innerHeight * 0.5 },
          },
        );

        return ScrollTrigger.create({
          start,
          end,
          onUpdate: (self) => {
            const r = rail.current;
            const next = Math.min(STAGE_COUNT - 1, Math.max(0, Math.floor(self.progress * STAGE_COUNT)));

            if (next < r.desired) {
              /* Scrolling back is immediate; only forward movement is gated. */
              r.desired = next;
              r.shown = next;
              r.settled = true;
              setStep(next);
              setStageProgress(0);
              return;
            }
            /* Only `desired` moves here. The gate tracks the stage that is
               actually on screen, so scrolling further ahead must not clear
               it — the tick resets it when it hands over to the next stage. */
            r.desired = next;
          },
        });
      };

      stageTrigger = build();
    }, track);

    let resizeTimer = 0;
    const remeasure = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const { top, height } = measure();
        if (!stageTrigger) return;
        stageTrigger.vars.start = top;
        stageTrigger.vars.end = Math.max(top + 1, top + height - window.innerHeight);
        stageTrigger.refresh();
      }, 160);
    };

    /* Advances one stage per settle. It runs on its own rather than on
       scroll events, so a fast scroll plays every stage back to back
       instead of skipping the ones in between. */
    let raf = 0;
    const tick = (): void => {
      const r = rail.current;
      if (r.desired > r.shown && r.settled) {
        r.shown = Math.min(r.desired, r.shown + 1);
        r.settled = false;
        setStep(r.shown);
        /* Failsafe. A fast scroll can unmount a scene before its timeline
           reports completion, which would leave the gate shut and the walk
           stranded. This only ever releases a gate that animation forgot to
           open; it never decides when a stage should change. */
        window.clearTimeout(r.failSafe);
        r.failSafe = window.setTimeout(() => {
          if (!r.settled) r.settled = true;
        }, 1600);
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    window.addEventListener('resize', remeasure);
    const settle = window.setTimeout(remeasure, 240);
    document.fonts?.ready.then(remeasure).catch(() => undefined);

    return () => {
      window.cancelAnimationFrame(raf);
      window.cancelAnimationFrame(pinFrame);
      window.clearTimeout(rail.current.failSafe);
      window.clearTimeout(settle);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', remeasure);
      setPinned(false);
      ctx.revert();
    };
  }, []);

  return (
    <Band tone="flat" id="dashboard" className="relative">
      <div className="mx-auto max-w-[1600px] px-2 sm:px-4">
        <Reveal y={16}>
          <div className="mx-auto mb-8 md:mb-10 max-w-[900px] px-4">
            <DashboardTagline />
          </div>
        </Reveal>
        <div ref={rootRef} data-dash-scroll className={pinned ? 'relative md:h-[420vh]' : 'relative'}>
          <div className="sticky top-[84px] py-6 md:py-10">
            <div
              data-dash-card
              className="w-full origin-top overflow-hidden rounded-[24px] border border-[var(--scaffold-hairline)] bg-[var(--scaffold-bg)] shadow-[var(--scaffold-shadow-object)] sm:rounded-[32px]"
            >
              <AgenticDashboard
                step={step}
                stageProgress={stageProgress}
                stages={SCROLL_STAGES}
                still={calm}
                compact={false}
                onStageSettled={markSettled}
              />
            </div>
          </div>
        </div>
      </div>
    </Band>
  );
}