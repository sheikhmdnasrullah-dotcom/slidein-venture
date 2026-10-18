'use client';

/**
 * PLAYBOOK STORY — 3-ACT PINNED SCROLL-DRIVEN EXPERIENCE
 * ---------------------------------------------------------------------------
 * Replaces the compare-slider with a GSAP-driven 3-act story:
 * - Act 1: GATHER (scattered business info scanned by beam, chips pop off)
 * - Act 2: DISTILL (chips fly into 3 organized columns, ICP spotlight)
 * - Act 3: COMPILE (columns fuse into the Master Playbook book, 7 stage tiles read)
 *
 * Strict Rule 0: Heading unchanged, only allowed stage words, zero digits.
 * Performance: GSAP lazy-loaded when within 800px; transforms/opacity only.
 * Fallback: Static PlaybookTriptych for SSR and reduced motion.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  CANVAS_LANDSCAPE,
  CANVAS_PORTRAIT,
  LANDSCAPE_FRAGMENTS,
  LANDSCAPE_CHIPS,
  PORTRAIT_FRAGMENTS,
  PORTRAIT_CHIPS,
  PLAYBOOK_CONFIG,
} from './poses';
import { CanvasAct1 } from './CanvasAct1';
import { CanvasAct2 } from './CanvasAct2';
import { CanvasAct3 } from './CanvasAct3';
import { Chip } from './Chip';
import { PlaybookTriptych } from './PlaybookTriptych';
import { PlaybookHeading } from './HeadingSwash';
import { ProgressDots } from './ProgressDots';
import { KineticTypography } from './KineticTypography';

declare global {
  interface Window {
    __playbook?: {
      seek: (p: number) => void;
      progress: () => number;
      duration?: () => number;
      state: () => { progress: number; restIndex: number };
    };
  }
}

export function PlaybookStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();
  const [isGsapReady, setIsGsapReady] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentRestIndex, setCurrentRestIndex] = useState(0);
  const [swashDrawn, setSwashDrawn] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);

  // Auto-advance state
  const autoAdvanceCancelled = useRef(false);
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);
  const masterTimeline = useRef<any>(null);
  const scrollTriggerInstance = useRef<any>(null);

  // Measure breakpoint and scale
  const updateLayout = useCallback(() => {
    if (!cardRef.current) return;
    const cardRect = cardRef.current.getBoundingClientRect();
    const portrait = window.innerWidth < 768;
    setIsPortrait(portrait);

    const baseW = portrait ? CANVAS_PORTRAIT.w : CANVAS_LANDSCAPE.w;
    const baseH = portrait ? CANVAS_PORTRAIT.h : CANVAS_LANDSCAPE.h;

    // Available width and height for stage card
    const scaleW = cardRect.width / baseW;
    const scaleH = cardRect.height / baseH;
    const scale = portrait
      ? Math.min(1.0, scaleW)
      : Math.min(1.0, Math.max(0.6, Math.min(scaleW, scaleH)));
    setCanvasScale(scale);
  }, []);

  // Update layout on mount & detect portrait mode
  useEffect(() => {
    setIsPortrait(window.innerWidth < 768);
    updateLayout();
  }, [updateLayout]);

  // 1. IntersectionObserver to trigger lazy GSAP load when within 800px
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '800px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2. Load GSAP and plugins dynamically
  useEffect(() => {
    if (!isNearViewport || reducedMotion) return;

    let mounted = true;

    async function loadGsap() {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        const { MotionPathPlugin } = await import('gsap/MotionPathPlugin');
        const { ScrollToPlugin } = await import('gsap/ScrollToPlugin');
        const { DrawSVGPlugin } = await import('gsap/DrawSVGPlugin');

        gsap.registerPlugin(
          ScrollTrigger,
          MotionPathPlugin,
          ScrollToPlugin,
          DrawSVGPlugin,
        );

        if (mounted) {
          setIsGsapReady(true);
        }
      } catch (err) {
        console.error('Failed to load GSAP plugins:', err);
      }
    }

    loadGsap();

    return () => {
      mounted = false;
    };
  }, [isNearViewport, reducedMotion]);

  // 3. Build master timeline and ScrollTrigger
  useEffect(() => {
    if (!isGsapReady || reducedMotion || !cardRef.current || !containerRef.current) return;

    let ctx: any;

    async function initAnimation() {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      updateLayout();
      window.addEventListener('resize', updateLayout);

      ctx = gsap.context(() => {
        const portrait = isPortrait;
        const chips = portrait ? PORTRAIT_CHIPS : LANDSCAPE_CHIPS;
        const fragments = portrait ? PORTRAIT_FRAGMENTS : LANDSCAPE_FRAGMENTS;

        // Create Master Timeline (duration 100)
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: 'power2.out' },
        });

        masterTimeline.current = tl;

        // Labels for 4 scenes
        tl.addLabel('start', 0);
        tl.addLabel('rest1', 24);
        tl.addLabel('rest2', 50);
        tl.addLabel('rest3', 74);
        tl.addLabel('rest4', 100);

        // ==========================================
        // INITIAL SETUP
        // ==========================================
        gsap.set('[data-act="gather"]', { opacity: 1 });
        gsap.set('[data-act="distill"]', { opacity: 0, pointerEvents: 'none' });
        gsap.set('[data-act="compile"]', { opacity: 0, pointerEvents: 'none' });
        gsap.set('[data-testid="scan-beam"]', { y: 0, opacity: 1 });
        gsap.set('.act1-cue', { opacity: 0.8 });
        gsap.set('.story-caption-1', { opacity: 1, y: 0 });
        gsap.set('.story-caption-2', { opacity: 0, y: 24 });
        gsap.set('.story-caption-3', { opacity: 0, y: 24 });
        gsap.set('.story-caption-4', { opacity: 0, y: 24 });
        gsap.set('.act3-paper-crease', { opacity: 0 });

        // Dotted threads start hidden (strokeDashoffset)
        gsap.set('.act1-thread', { drawSVG: '0% 0%' });

        // Chips start at opacity 0 in their constellation poses
        gsap.set('.act-chip-wrap', { opacity: 0, scale: 0.6 });

        // Act 3 Book & Brain initial states
        gsap.set('.act3-book-container', { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.92, y: 24, rotation: 0 });
        gsap.set('[data-testid="book-cover"]', { rotateY: 0 });
        gsap.set('.act3-brain-container', { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.35, rotation: 0 });
        gsap.set('.brain-circuit', { drawSVG: '0% 0%' });
        gsap.set('.brain-node', { scale: 0 });
        gsap.set('.brain-core', { scale: 0 });
        gsap.set('.brain-pulse-ring', { scale: 0.8, opacity: 0 });

        // ==========================================
        // SCENE 01: SCATTERED BUSINESS INFORMATION (0 to 24)
        // Caption 1: "From scattered business information"
        // ==========================================
        tl.to(
          '[data-testid="scan-beam"]',
          {
            y: portrait ? CANVAS_PORTRAIT.h : CANVAS_LANDSCAPE.h,
            duration: 13,
            ease: 'none',
          },
          0,
        );

        // Scroll cue fades on first scroll
        tl.to('.act1-cue', { opacity: 0, duration: 4 }, 0);

        // Fragments pop and chips emerge
        fragments.forEach((frag) => {
          const hitTime = frag.hitProgress * 55; // 7 to 15

          // Fragment hit bounce
          tl.to(
            `[data-frag-wrapper="${frag.id}"]`,
            {
              scale: frag.scale * 1.04,
              duration: 2,
              yoyo: true,
              repeat: 1,
              ease: 'power1.inOut',
            },
            hitTime,
          );

          // Tethered chips pop off
          frag.chipIds.forEach((chipId) => {
            tl.to(
              `[data-chip-wrapper="${chipId}"]`,
              {
                opacity: 1,
                scale: 1,
                duration: 3.5,
                ease: 'back.out(2)',
              },
              hitTime + 0.8,
            );

            // Thread draws from fragment to chip
            tl.to(
              `[data-thread-id="${chipId}"]`,
              {
                drawSVG: '0% 100%',
                duration: 3.5,
                ease: 'power2.out',
              },
              hitTime + 0.8,
            );
          });
        });

        // Beam exits at bottom and fragments dim
        tl.to('[data-testid="scan-beam"]', { opacity: 0, duration: 2 }, 18);
        tl.to('.act1-frag-wrap', { opacity: 0.4, duration: 3, ease: 'power2.out' }, 18);

        // Settle as Scene 01 (Rest 1 at 24): Only Caption 1 is visible

        // ==========================================
        // TRANSITION 1: SCENE 01 -> SCENE 02 (24 to 34)
        // ==========================================
        // Fragments fade out and lift slightly
        tl.to(
          '.act1-frag-wrap',
          {
            opacity: 0,
            y: '-=8',
            scale: 0.92,
            stagger: 0.1,
            duration: 4.5,
            ease: 'power2.in',
          },
          24,
        );

        // Threads erase
        tl.to(
          '.act1-thread',
          {
            drawSVG: '100% 100%',
            duration: 3.5,
            ease: 'power2.in',
          },
          24,
        );

        // Hide Act 1 background container
        tl.to('[data-act="gather"]', { opacity: 0, duration: 2 }, 28);

        // Synchronized Caption 1 -> Caption 2 Transition
        tl.to('.story-caption-1', { opacity: 0, y: -20, duration: 3.5, ease: 'power2.in' }, 24);
        tl.to('.story-caption-2', { opacity: 1, y: 0, duration: 4, ease: 'power2.out' }, 27.5);

        // Chips fly along curved MotionPath arcs into table slots
        chips.forEach((chip, i) => {
          const dx = chip.docked.x - chip.constellation.x;
          const dy = chip.docked.y - chip.constellation.y;

          tl.to(
            `[data-chip-wrapper="${chip.id}"]`,
            {
              motionPath: {
                path: [
                  { x: dx * 0.45, y: dy * 0.45 - 60 },
                  { x: dx, y: dy },
                ],
                curviness: 1.3,
              },
              rotation: 0,
              duration: 8,
              ease: 'power3.inOut',
            },
            26 + (i % 8) * 0.5,
          );
        });

        // ==========================================
        // SCENE 02: ORGANIZED BUSINESS CONTEXT (34 to 52)
        // Caption 2: "To organized Profile, Offers and Ideal Client Profile."
        // ==========================================
        tl.to('[data-act="distill"]', { opacity: 1, duration: 1 }, 30);
        tl.fromTo(
          '.act2-col-card',
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.8, duration: 4.5, ease: 'power2.out' },
          30,
        );

        // ICP column spotlight and spokes
        tl.to(
          '[data-col-id="col-icps"]',
          { scale: 1.05, duration: 4, ease: 'power2.out' },
          40,
        );
        tl.to(
          ['[data-col-id="col-profile"]', '[data-col-id="col-offers"]'],
          { scale: 0.95, opacity: 0.75, duration: 4, ease: 'power2.out' },
          40,
        );

        if (!portrait) {
          tl.to(
            '.act2-icp-ring',
            { scale: 1.3, duration: 3.5, ease: 'back.out(1.5)' },
            40.5,
          );
          tl.to(
            '.act2-icp-dot',
            { scale: 1.25, duration: 3.5 },
            40.5,
          );
          tl.fromTo(
            '.act2-spoke',
            { drawSVG: '0% 0%' },
            { drawSVG: '0% 100%', stagger: 0.5, duration: 4.5, ease: 'power2.out' },
            41,
          );
        }

        // Settle at Rest 2 (columns return to equal scale 1.0)
        tl.to(
          ['[data-col-id="col-icps"]', '[data-col-id="col-profile"]', '[data-col-id="col-offers"]'],
          { scale: 1.0, opacity: 1.0, duration: 3, ease: 'power2.out' },
          48,
        );

        // ==========================================
        // TRANSITION 2: SCENE 02 -> SCENE 03 (52 to 62)
        // ==========================================
        // Columns lift and fade out
        tl.to(
          '.act2-col-card',
          { y: -14, opacity: 0, duration: 4.5, ease: 'power2.in' },
          52,
        );

        if (!portrait) {
          tl.to(
            '.act2-spoke',
            { drawSVG: '100% 100%', duration: 3.5, ease: 'power2.in' },
            52,
          );
        }

        // Chips fly into the book center in vortex convergence
        chips.forEach((chip, i) => {
          const bookTargetX = portrait ? 360 : 640;
          const bookTargetY = portrait ? 280 : 235;
          const endDx = bookTargetX - chip.constellation.x - 48;
          const endDy = bookTargetY - chip.constellation.y - 14;

          tl.to(
            `[data-chip-wrapper="${chip.id}"]`,
            {
              x: endDx,
              y: endDy,
              scale: 0.3,
              opacity: 0,
              duration: 5,
              ease: 'power3.in',
            },
            52 + (i % 6) * 0.3,
          );
        });

        // Hide Act 2 container
        tl.to('.act-chip-wrap', { opacity: 0, duration: 1 }, 58);
        tl.to('[data-act="distill"]', { opacity: 0, duration: 1 }, 58);

        // Transition Caption 2 -> Caption 3
        tl.to('.story-caption-2', { opacity: 0, y: -20, duration: 3.5, ease: 'power2.in' }, 52);
        tl.to('.story-caption-3', { opacity: 1, y: 0, duration: 4, ease: 'power2.out' }, 56);

        // ==========================================
        // SCENE 03: THE MASTER PLAYBOOK (62 to 78)
        // Caption 3: "2 Organized Master Playbook, which has all the context about your business."
        // ==========================================
        tl.to('[data-act="compile"]', { opacity: 1, duration: 1 }, 59);

        // Master Playbook Book rises
        tl.fromTo(
          '.act3-book-container',
          { xPercent: -50, yPercent: -50, y: 24, scale: 0.92, opacity: 0, rotation: 0 },
          { xPercent: -50, yPercent: -50, y: 0, scale: 1, opacity: 1, rotation: 0, duration: 5, ease: 'power2.out' },
          60,
        );

        // Cover opens (rotateY: 0 -> -160deg)
        tl.fromTo(
          '[data-testid="book-cover"]',
          { rotateY: 0 },
          { rotateY: -160, duration: 5.5, ease: 'power2.inOut' },
          61,
        );

        // Chapter tabs slide out on right edge
        tl.fromTo(
          '.act3-chapter-tab',
          { x: -16, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.5, duration: 2.5, ease: 'back.out(1.8)' },
          63.5,
        );

        // Checkmark seals and rule bars pop in
        tl.fromTo(
          '.act3-check-seal',
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.4, duration: 2.2, ease: 'back.out(2)' },
          64.5,
        );
        tl.fromTo(
          '.act3-rule-bar',
          { scaleX: 0 },
          { scaleX: 1, stagger: 0.4, duration: 2.2, ease: 'power2.out' },
          64.5,
        );

        // Bookmark ribbon lowers
        tl.fromTo(
          '[data-bookmark="ribbon"]',
          { y: -10 },
          { y: 10, duration: 2.5, ease: 'power2.out' },
          65.5,
        );

        // Settle at Rest 3 (72 to 76) with Caption 3

        // ==========================================
        // TRANSITION 3: SCENE 03 -> SCENE 04 (78 to 88)
        // ==========================================
        // Cover folds shut
        tl.to(
          '[data-testid="book-cover"]',
          { rotateY: 0, duration: 2.5, ease: 'power2.inOut' },
          78,
        );

        // Chapter tabs slide in & bookmark ribbon retracts
        tl.to('.act3-chapter-tab', { x: -16, opacity: 0, duration: 2, ease: 'power2.in' }, 78);
        tl.to('[data-bookmark="ribbon"]', { y: -10, duration: 2, ease: 'power2.in' }, 78);

        // Paper creases appear as physical book crumples
        tl.fromTo('.act3-paper-crease', { opacity: 0 }, { opacity: 0.9, duration: 1.8, ease: 'power1.in' }, 78.5);

        // Book scrambles like paper, rotates, and folds down into center vortex
        tl.to(
          '.act3-book-container',
          { xPercent: -50, yPercent: -50, scale: 0.16, rotation: -22, skewX: 16, opacity: 0, duration: 3, ease: 'power2.in' },
          79.5,
        );

        // Transition Caption 3 -> Caption 4
        tl.to('.story-caption-3', { opacity: 0, y: -20, duration: 3, ease: 'power2.in' }, 78);
        tl.to('.story-caption-4', { opacity: 1, y: 0, duration: 4, ease: 'power2.out' }, 82);

        // Brain design materializes and emerges from center vortex
        tl.fromTo(
          '.act3-brain-container',
          { xPercent: -50, yPercent: -50, scale: 0.35, rotation: 8, opacity: 0, filter: 'blur(0px)' },
          { xPercent: -50, yPercent: -50, scale: 1, rotation: 0, opacity: 1, filter: 'blur(0px)', duration: 4.5, ease: 'back.out(1.5)' },
          82,
        );

        // Brain circuit lines draw in
        tl.fromTo(
          '.brain-circuit',
          { drawSVG: '0% 0%' },
          { drawSVG: '0% 100%', stagger: 0.08, duration: 3.5, ease: 'power2.out' },
          82.5,
        );

        // Synaptic nodes pop in
        tl.fromTo(
          '.brain-node',
          { scale: 0 },
          { scale: 1, stagger: 0.05, duration: 2.8, ease: 'back.out(2)' },
          83,
        );

        // Protagonist orange core dot springs to life
        tl.fromTo(
          '.brain-core',
          { scale: 0 },
          { scale: 1.35, duration: 2.2, ease: 'back.out(3)' },
          84,
        );
        tl.to('.brain-core', { scale: 1.0, duration: 1.5, ease: 'power1.out' }, 86.5);

        // Concentric knowledge aura rings ripple outward
        tl.fromTo(
          '.brain-pulse-ring',
          { scale: 0.7, opacity: 0 },
          { scale: 1.15, opacity: 0.7, stagger: 0.4, duration: 3.5, ease: 'power1.out' },
          83.5,
        );

        // ==========================================
        // SCENE 04: PERSISTENT KNOWLEDGE (88 to 100)
        // Caption 4: "1 Persistent Knowledge from the Master Playbook that evolves every time you interact with it."
        // THE BRAIN ICON REMAINS 100% VISIBLE THROUGHOUT SCENE 04! NO DISSOLVE!
        // ==========================================
        tl.to(
          '.brain-pulse-ring',
          { scale: 1.25, opacity: 0.5, stagger: 0.3, duration: 10, ease: 'sine.inOut' },
          88,
        );

        // Lock timeline total duration strictly to 100
        tl.set({}, {}, 100);

        // ==========================================
        // ScrollTrigger Pin & Scrub Setup
        // ==========================================
        const endDistance = portrait
          ? window.innerHeight * 2.8
          : window.innerHeight * 3.6;

        scrollTriggerInstance.current = ScrollTrigger.create({
          trigger: containerRef.current,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          start: 'top top+=80',
          end: `+=${endDistance}`,
          scrub: 0.6,
          animation: tl,
          snap: {
            snapTo: (value: number) => {
              if (value < 0.03) return 0;
              const rests = [0.24, 0.50, 0.74, 1.0];
              let closest = rests[0];
              let minDiff = Math.abs(value - rests[0]);
              for (const r of rests) {
                const diff = Math.abs(value - r);
                if (diff < minDiff) {
                  minDiff = diff;
                  closest = r;
                }
              }
              return closest;
            },
            delay: 0.12,
            duration: { min: 0.25, max: 0.9 },
            ease: 'power2.inOut',
          },
          onUpdate: (self) => {
            const p = self.progress;
            setCurrentProgress(p);

            // Update Rest Index for 4 Scenes
            if (p < 0.37) {
              setCurrentRestIndex(0);
            } else if (p < 0.63) {
              setCurrentRestIndex(1);
            } else if (p < 0.86) {
              setCurrentRestIndex(2);
            } else {
              setCurrentRestIndex(3);
            }

            // Heading swash draws at rest4 (p >= 0.95)
            if (p >= 0.95) {
              setSwashDrawn(true);
            } else {
              setSwashDrawn(false);
            }
          },
          onRefresh: () => {
            updateLayout();
          },
        });

        if (!containerRef.current) return;
        const container = containerRef.current;

        // Interactive micro-pulse on Brain Design
        const brainEl = container.querySelector('[data-testid="playbook-brain"]');
        if (brainEl) {
          brainEl.addEventListener('mouseenter', () => {
            gsap.to('.brain-core', { scale: 1.4, duration: 0.3, ease: 'back.out(2)' });
            gsap.to('.brain-pulse-ring', { scale: 1.35, opacity: 0.9, stagger: 0.1, duration: 0.4 });
          });
          brainEl.addEventListener('mouseleave', () => {
            gsap.to('.brain-core', { scale: 1.0, duration: 0.3 });
            gsap.to('.brain-pulse-ring', { scale: 1.0, opacity: 0.4, stagger: 0.1, duration: 0.4 });
          });
        }

        // Interactive pulse on criteria chips
        const criteriaChips = container.querySelectorAll('[data-chip-id^="chip-i"]');
        criteriaChips.forEach((chip) => {
          chip.addEventListener('mouseenter', () => {
            gsap.to('.act2-icp-ring', { scale: 1.6, duration: 0.25, yoyo: true, repeat: 1 });
          });
        });

        // Fine pointer parallax on card
        if (window.matchMedia('(pointer: fine)').matches && cardRef.current) {
          const card = cardRef.current;
          const moveFar = gsap.quickTo('.act1-frag-wrap', 'x', { duration: 0.8, ease: 'power2.out' });
          const moveNear = gsap.quickTo('.act3-book-container', 'x', { duration: 0.8, ease: 'power2.out' });
          const moveBrain = gsap.quickTo('.act3-brain-container', 'x', { duration: 0.8, ease: 'power2.out' });

          const onPointerMove = (e: PointerEvent) => {
            const rect = card.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            moveFar(relX * 8);
            moveNear(relX * -12);
            moveBrain(relX * -8);
          };

          card.addEventListener('pointermove', onPointerMove);
        }

        // Expose test hook
        window.__playbook = {
          seek: (p: number) => {
            if (scrollTriggerInstance.current) {
              const st = scrollTriggerInstance.current;
              const target = st.start + (st.end - st.start) * p;
              st.scroll(target);
            }
            tl.progress(p);
            setCurrentProgress(p);
            if (p < 0.37) setCurrentRestIndex(0);
            else if (p < 0.63) setCurrentRestIndex(1);
            else if (p < 0.86) setCurrentRestIndex(2);
            else setCurrentRestIndex(3);
            setSwashDrawn(p >= 0.95);
          },
          progress: () => tl.progress(),
          duration: () => tl.totalDuration(),
          state: () => ({
            progress: tl.progress(),
            restIndex: tl.progress() < 0.37 ? 0 : tl.progress() < 0.63 ? 1 : tl.progress() < 0.86 ? 2 : 3,
          }),
        };
      }, containerRef);

      return () => {
        window.removeEventListener('resize', updateLayout);
        if (ctx) ctx.revert();
      };
    }

    initAnimation();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [isGsapReady, reducedMotion, isPortrait, updateLayout]);

  // 4. Auto-Advance Logic
  useEffect(() => {
    if (!PLAYBOOK_CONFIG.autoAdvance || reducedMotion || !isGsapReady) return;

    const cancelAutoAdvance = () => {
      autoAdvanceCancelled.current = true;
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
        autoAdvanceTimer.current = null;
      }
    };

    window.addEventListener('wheel', cancelAutoAdvance, { passive: true });
    window.addEventListener('touchstart', cancelAutoAdvance, { passive: true });
    window.addEventListener('keydown', cancelAutoAdvance);
    window.addEventListener('pointerdown', cancelAutoAdvance);

    return () => {
      cancelAutoAdvance();
      window.removeEventListener('wheel', cancelAutoAdvance);
      window.removeEventListener('touchstart', cancelAutoAdvance);
      window.removeEventListener('keydown', cancelAutoAdvance);
      window.removeEventListener('pointerdown', cancelAutoAdvance);
    };
  }, [isGsapReady, reducedMotion]);

  // 5. Scroll to Rest handler for progress dots
  const handleSelectRest = useCallback(
    async (restIdx: number) => {
      if (!scrollTriggerInstance.current) return;
      const { gsap } = await import('gsap');

      const st = scrollTriggerInstance.current;
      const targets = [0.24, 0.50, 0.74, 1.0];
      const targetP = targets[restIdx];
      const targetScroll = st.start + (st.end - st.start) * targetP;

      gsap.to(window, {
        scrollTo: targetScroll,
        duration: 1.2,
        ease: 'power2.inOut',
        autoKill: true,
      });
    },
    [],
  );

  // If reduced motion is requested or server render before GSAP, render static Triptych
  if (reducedMotion || !isGsapReady) {
    return (
      <div
        ref={containerRef}
        data-testid="playbook-story-container"
        className="w-full flex flex-col items-center py-8"
      >
        <div className="mx-auto mb-10 max-w-[1080px] text-center">
          <PlaybookHeading drawn={true} />
        </div>
        <PlaybookTriptych isPortrait={isPortrait} />
      </div>
    );
  }

  const fragments = isPortrait ? PORTRAIT_FRAGMENTS : LANDSCAPE_FRAGMENTS;
  const chips = isPortrait ? PORTRAIT_CHIPS : LANDSCAPE_CHIPS;
  const baseW = isPortrait ? CANVAS_PORTRAIT.w : CANVAS_LANDSCAPE.w;
  const baseH = isPortrait ? CANVAS_PORTRAIT.h : CANVAS_LANDSCAPE.h;

  return (
    <div
      ref={containerRef}
      data-testid="playbook-story-container"
      className="w-full flex flex-col items-center justify-start relative select-none py-4"
    >
      {/* Pinned Heading */}
      <div className="mx-auto mb-6 max-w-[1080px] text-center px-4">
        <PlaybookHeading drawn={swashDrawn} />
      </div>

      {/* Stage Card with Fixed Design Canvas */}
      <div
        ref={cardRef}
        data-testid="playbook-stage-card"
        className="relative w-full max-w-[1280px] rounded-[40px] border border-[rgba(10,10,10,0.06)] bg-white overflow-hidden flex items-center justify-center"
        style={{
          height: 'min(640px, calc(100svh - 190px))',
          boxShadow: 'var(--scaffold-shadow-object)',
        }}
      >
        {/* Subtle dot-grid background */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #0A0A0A 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Scaled Design Canvas */}
        <div
          ref={canvasRef}
          data-testid="playbook-design-canvas"
          className="relative pointer-events-auto"
          style={{
            width: baseW,
            height: baseH,
            transform: `scale(${canvasScale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Act 1: GATHER */}
          <CanvasAct1
            fragments={fragments}
            chips={chips}
            isPortrait={isPortrait}
            showCue={currentProgress < 0.05}
          />

          {/* Act 2: DISTILL */}
          <CanvasAct2
            chips={chips}
            isPortrait={isPortrait}
            spotlight={currentProgress >= 0.40 && currentProgress < 0.54}
          />

          {/* Act 3: COMPILE & PERSISTENT KNOWLEDGE */}
          <CanvasAct3
            isPortrait={isPortrait}
            bookOpen={currentProgress >= 0.64 && currentProgress < 0.80}
          />

          {/* Persistent 24 Chips Layer (Animated continuously across all 3 acts) */}
          <div
            data-testid="playbook-chips-layer"
            className="absolute inset-0 w-full h-full pointer-events-none z-25"
          >
            {chips.map((chip) => (
              <div
                key={chip.id}
                data-chip-wrapper={chip.id}
                className="absolute act-chip-wrap"
                style={{
                  left: chip.constellation.x,
                  top: chip.constellation.y,
                  transform: `rotate(${chip.constellation.rot}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                <Chip chip={chip} compact={isPortrait} />
              </div>
            ))}
          </div>

          {/* Bold Kinetic Typography Synchronized with each scene */}
          <KineticTypography isPortrait={isPortrait} />
        </div>

        {/* Progress Navigation Dots at card bottom center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
          <ProgressDots
            currentRestIndex={currentRestIndex}
            onSelectRest={handleSelectRest}
          />
        </div>
      </div>
    </div>
  );
}
