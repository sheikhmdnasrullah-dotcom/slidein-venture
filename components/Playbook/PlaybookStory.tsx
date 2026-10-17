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
import { StoryCaptionBar } from './StoryCaptionBar';

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
  const [isPortrait, setIsPortrait] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
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

  // Update layout on mount
  useEffect(() => {
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
        const portrait = window.innerWidth < 768;
        const chips = portrait ? PORTRAIT_CHIPS : LANDSCAPE_CHIPS;
        const fragments = portrait ? PORTRAIT_FRAGMENTS : LANDSCAPE_FRAGMENTS;

        // Create Master Timeline (duration 100)
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: 'power2.out' },
        });

        masterTimeline.current = tl;

        // Labels
        tl.addLabel('start', 0);
        tl.addLabel('rest1', 34);
        tl.addLabel('rest2', 70);
        tl.addLabel('rest3', 100);

        // ==========================================
        // ACT 1: GATHER (0 to 34)
        // ==========================================
        // Initial setup
        gsap.set('[data-act="distill"]', { opacity: 0, pointerEvents: 'none' });
        gsap.set('[data-act="compile"]', { opacity: 0, pointerEvents: 'none' });
        gsap.set('[data-testid="scan-beam"]', { y: 0, opacity: 1 });
        gsap.set('.act1-cue', { opacity: 0.8 });
        gsap.set('.story-caption-1', { opacity: 1, y: 0 });
        gsap.set('.story-caption-2', { opacity: 0, y: 14 });
        gsap.set('.story-caption-3', { opacity: 0, y: 14 });
        gsap.set('.act3-paper-crease', { opacity: 0 });

        // Dotted threads start hidden (strokeDashoffset)
        gsap.set('.act1-thread', { drawSVG: '0% 0%' });

        // Chips start at opacity 0 in their constellation poses
        gsap.set('.act-chip-wrap', { opacity: 0, scale: 0.6 });

        // Beat 1: Beam enters top and sweeps to bottom (0 to 12)
        tl.to(
          '[data-testid="scan-beam"]',
          {
            y: portrait ? CANVAS_PORTRAIT.h : CANVAS_LANDSCAPE.h,
            duration: 12,
            ease: 'none',
          },
          0,
        );

        // Scroll cue fades on first scroll (0 to 5)
        tl.to('.act1-cue', { opacity: 0, duration: 5 }, 0);

        // Beat 2: As beam hits fragments, fragments pop and chips emerge (12 to 30)
        fragments.forEach((frag) => {
          const hitTime = frag.hitProgress * 100; // 13 to 26

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
                duration: 4,
                ease: 'back.out(2)',
              },
              hitTime + 1,
            );

            // Thread draws from fragment to chip
            tl.to(
              `[data-thread-id="${chipId}"]`,
              {
                drawSVG: '0% 100%',
                duration: 4,
                ease: 'power2.out',
              },
              hitTime + 1,
            );
          });
        });

        // Beat 3: Beam exits bottom, fragments dim to 0.35 (30 to 34, rest1)
        tl.to(
          '[data-testid="scan-beam"]',
          { opacity: 0, duration: 2 },
          32,
        );
        tl.to(
          '.act1-frag-wrap',
          { opacity: 0.35, duration: 4, ease: 'power2.out' },
          30,
        );

        // ==========================================
        // TRANSITION 1 (34 to 40)
        // ==========================================
        // Fragments fade out and lift 6px
        tl.to(
          '.act1-frag-wrap',
          {
            opacity: 0,
            y: '-=6',
            scale: 0.92,
            stagger: 0.15,
            duration: 5,
            ease: 'power2.in',
          },
          34,
        );

        // Threads erase
        tl.to(
          '.act1-thread',
          {
            drawSVG: '100% 100%',
            duration: 4,
            ease: 'power2.in',
          },
          34,
        );

        // Chips lift 6px in anticipation
        tl.to(
          '.act-chip-wrap',
          {
            y: '-=6',
            duration: 5,
            ease: 'power2.out',
          },
          34,
        );

        // Hide Act 1 background container
        tl.to('[data-act="gather"]', { opacity: 0, duration: 2 }, 38);

        // Transition Caption 1 to Caption 2 in the same anchored spot
        tl.to('.story-caption-1', { opacity: 0, y: -10, duration: 4, ease: 'power2.in' }, 34);
        tl.to('.story-caption-2', { opacity: 1, y: 0, duration: 4, ease: 'power2.out' }, 37);

        // ==========================================
        // ACT 2: DISTILL (40 to 70)
        // ==========================================
        // Columns fade in and rise 18px (40 to 46)
        tl.to(
          '[data-act="distill"]',
          { opacity: 1, duration: 1 },
          40,
        );
        tl.fromTo(
          '.act2-col-card',
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, stagger: 1, duration: 5, ease: 'power2.out' },
          40,
        );

        // Chips fly along curved MotionPath arcs into docked slots (40 to 52)
        chips.forEach((chip, i) => {
          const dx = chip.docked.x - chip.constellation.x;
          const dy = chip.docked.y - chip.constellation.y;

          tl.to(
            `[data-chip-wrapper="${chip.id}"]`,
            {
              motionPath: {
                path: [
                  { x: dx * 0.45, y: dy * 0.45 - 80 },
                  { x: dx, y: dy },
                ],
                curviness: 1.4,
              },
              rotation: 0,
              duration: 9,
              ease: 'power3.inOut',
            },
            40 + (i % 8) * 0.7,
          );
        });

        // Beat 2: ICP column spotlight (52 to 64)
        tl.to(
          '[data-col-id="col-icps"]',
          { scale: 1.06, duration: 5, ease: 'power2.out' },
          52,
        );
        tl.to(
          ['[data-col-id="col-profile"]', '[data-col-id="col-offers"]'],
          { scale: 0.94, opacity: 0.7, duration: 5, ease: 'power2.out' },
          52,
        );

        // ICP Ring scales up and center dot pulses
        tl.to(
          '.act2-icp-ring',
          { scale: 1.35, duration: 4, ease: 'back.out(1.5)' },
          53,
        );
        tl.to(
          '.act2-icp-dot',
          { scale: 1.25, duration: 4 },
          53,
        );

        // 6 Spokes draw to criteria chips + dash links to skip chips
        tl.fromTo(
          '.act2-spoke',
          { drawSVG: '0% 0%' },
          { drawSVG: '0% 100%', stagger: 0.7, duration: 6, ease: 'power2.out' },
          55,
        );

        // Beat 3: Short settle, columns return to equal scale 1.0 (64 to 70, rest2)
        tl.to(
          ['[data-col-id="col-icps"]', '[data-col-id="col-profile"]', '[data-col-id="col-offers"]'],
          { scale: 1.0, opacity: 1.0, duration: 5, ease: 'power2.out' },
          64,
        );

        // ==========================================
        // TRANSITION 2 (70 to 76)
        // ==========================================
        // Columns lift 12px and fade
        tl.to(
          '.act2-col-card',
          { y: -12, opacity: 0, duration: 5, ease: 'power2.in' },
          70,
        );

        // Spokes erase
        tl.to(
          '.act2-spoke',
          { drawSVG: '100% 100%', duration: 4, ease: 'power2.in' },
          70,
        );

        // Chips fly into the book center in vortex convergence (70 to 76)
        chips.forEach((chip, i) => {
          const bookTargetX = portrait ? 360 : 640;
          const bookTargetY = portrait ? 280 : 255;
          const endDx = bookTargetX - chip.constellation.x - 48;
          const endDy = bookTargetY - chip.constellation.y - 14;

          tl.to(
            `[data-chip-wrapper="${chip.id}"]`,
            {
              x: endDx,
              y: endDy,
              scale: 0.35,
              opacity: 0,
              duration: 5,
              ease: 'power3.in',
            },
            70 + (i % 6) * 0.35,
          );
        });

        // Hide Act 2 container and ensure all chips are absorbed
        tl.to('.act-chip-wrap', { opacity: 0, duration: 1 }, 75);
        tl.to('[data-act="distill"]', { opacity: 0, duration: 1 }, 75);

        // ==========================================
        // ACT 3: COMPILE & PERSISTENT KNOWLEDGE (76 to 100)
        // ==========================================
        // Initial setup for Act 3 elements
        gsap.set('.act3-book-container', { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.92, y: 24, rotation: 0 });
        gsap.set('[data-testid="book-cover"]', { rotateY: 0 });
        gsap.set('.act3-brain-container', { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.4, rotation: 0 });
        gsap.set('.brain-circuit', { drawSVG: '0% 0%' });
        gsap.set('.brain-node', { scale: 0 });
        gsap.set('.brain-core', { scale: 0 });
        gsap.set('.brain-pulse-ring', { scale: 0.8, opacity: 0 });
        gsap.set('.act3-tagline-container', { opacity: 0, y: 22 });
        gsap.set('.act3-tagline-word', { opacity: 0, y: 10 });

        // Show Act 3 container
        tl.to(
          '[data-act="compile"]',
          { opacity: 1, duration: 1 },
          76,
        );

        // 1. Master Playbook Book rises and cover opens (76 to 82)
        tl.fromTo(
          '.act3-book-container',
          { xPercent: -50, yPercent: -50, y: 24, scale: 0.92, opacity: 0, rotation: 0 },
          { xPercent: -50, yPercent: -50, y: 0, scale: 1, opacity: 1, rotation: 0, duration: 5, ease: 'power2.out' },
          76,
        );

        // Cover opens (rotateY: 0 -> -160deg)
        tl.fromTo(
          '[data-testid="book-cover"]',
          { rotateY: 0 },
          { rotateY: -160, duration: 5, ease: 'power2.inOut' },
          77,
        );

        // Chapter tabs slide out on right edge
        tl.fromTo(
          '.act3-chapter-tab',
          { x: -16, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.6, duration: 2.5, ease: 'back.out(1.8)' },
          78.5,
        );

        // Checkmark seals and rule bars pop in
        tl.fromTo(
          '.act3-check-seal',
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.5, duration: 2.5, ease: 'back.out(2)' },
          79.5,
        );
        tl.fromTo(
          '.act3-rule-bar',
          { scaleX: 0 },
          { scaleX: 1, stagger: 0.5, duration: 2.5, ease: 'power2.out' },
          79.5,
        );

        // Bookmark ribbon lowers
        tl.fromTo(
          '[data-bookmark="ribbon"]',
          { y: -10 },
          { y: 10, duration: 2.5, ease: 'power2.out' },
          80.5,
        );

        // Settle as Open Master Business Playbook (82 to 86) with Caption 2

        // 2. FOLD / SCRAMBLE INTO REALISTIC BRAIN (86 to 88.5)
        // Cover folds shut
        tl.to(
          '[data-testid="book-cover"]',
          { rotateY: 0, duration: 2.2, ease: 'power2.inOut' },
          86,
        );

        // Chapter tabs slide in & bookmark ribbon retracts
        tl.to(
          '.act3-chapter-tab',
          { x: -16, opacity: 0, duration: 2, ease: 'power2.in' },
          86,
        );
        tl.to(
          '[data-bookmark="ribbon"]',
          { y: -10, duration: 2, ease: 'power2.in' },
          86,
        );

        // Paper creases appear as physical book crumples
        tl.fromTo(
          '.act3-paper-crease',
          { opacity: 0 },
          { opacity: 0.9, duration: 1.5, ease: 'power1.in' },
          86.2,
        );

        // Book scrambles like paper, rotates, and folds down into center vortex
        tl.to(
          '.act3-book-container',
          { xPercent: -50, yPercent: -50, scale: 0.18, rotation: -22, skewX: 16, opacity: 0, duration: 2.4, ease: 'power2.in' },
          86.5,
        );

        // Brain design materializes and expands from the vortex center (88 to 94)
        tl.fromTo(
          '.act3-brain-container',
          { xPercent: -50, yPercent: -50, scale: 0.35, rotation: 8, opacity: 0, filter: 'blur(0px)' },
          { xPercent: -50, yPercent: -50, scale: 1, rotation: 0, opacity: 1, filter: 'blur(0px)', duration: 3.2, ease: 'back.out(1.5)' },
          88,
        );

        // Brain circuit lines draw in
        tl.fromTo(
          '.brain-circuit',
          { drawSVG: '0% 0%' },
          { drawSVG: '0% 100%', stagger: 0.08, duration: 2.8, ease: 'power2.out' },
          88.4,
        );

        // Synaptic nodes pop in
        tl.fromTo(
          '.brain-node',
          { scale: 0 },
          { scale: 1, stagger: 0.06, duration: 2.2, ease: 'back.out(2)' },
          88.8,
        );

        // Protagonist orange core dot springs to life
        tl.fromTo(
          '.brain-core',
          { scale: 0 },
          { scale: 1.35, duration: 1.8, ease: 'back.out(3)' },
          89.2,
        );
        tl.to(
          '.brain-core',
          { scale: 1.0, duration: 1.2, ease: 'power1.out' },
          91,
        );

        // Concentric knowledge aura rings ripple outward
        tl.fromTo(
          '.brain-pulse-ring',
          { scale: 0.7, opacity: 0 },
          { scale: 1.25, opacity: 0.8, stagger: 0.4, duration: 3, ease: 'power1.out' },
          88.5,
        );

        // Transition Caption 2 to Caption 3 in the exact same anchored place
        tl.to(
          '.story-caption-2',
          { opacity: 0, y: -8, duration: 2.2, ease: 'power2.in' },
          87.5,
        );
        tl.to(
          '.story-caption-3',
          { opacity: 1, y: 0, duration: 2.8, ease: 'power2.out' },
          89.5,
        );

        // 3. BRAIN DISSOLVES INTO RADIANT KNOWLEDGE (94.5 to 98.5)
        // Upon scrolling, the brain dissolves into particles, leaving the persistent knowledge caption
        tl.to(
          '.act3-brain-container',
          { xPercent: -50, yPercent: -50, scale: 1.18, opacity: 0, filter: 'blur(8px)', duration: 3.8, ease: 'power2.in' },
          94.5,
        );
        tl.to(
          '.brain-pulse-ring',
          { scale: 1.85, opacity: 0, stagger: 0.2, duration: 3.5, ease: 'power1.out' },
          94.5,
        );
        tl.to(
          '.brain-core',
          { scale: 2.4, opacity: 0, duration: 3, ease: 'power2.out' },
          94.5,
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
              const rests = [0.34, 0.7, 1.0];
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

            // Update Rest Index
            if (p < 0.52) {
              setCurrentRestIndex(0);
            } else if (p < 0.85) {
              setCurrentRestIndex(1);
            } else {
              setCurrentRestIndex(2);
            }

            // Heading swash draws at rest3 (p >= 0.95)
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
            tl.progress(p);
            setCurrentProgress(p);
            if (p < 0.52) setCurrentRestIndex(0);
            else if (p < 0.85) setCurrentRestIndex(1);
            else setCurrentRestIndex(2);
            setSwashDrawn(p >= 0.95);
          },
          progress: () => tl.progress(),
          duration: () => tl.totalDuration(),
          state: () => ({
            progress: tl.progress(),
            restIndex: tl.progress() < 0.52 ? 0 : tl.progress() < 0.85 ? 1 : 2,
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
      const targets = [0.34, 0.7, 1.0];
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
            spotlight={currentProgress >= 0.52 && currentProgress < 0.65}
          />

          {/* Act 3: COMPILE & PERSISTENT KNOWLEDGE */}
          <CanvasAct3
            isPortrait={isPortrait}
            bookOpen={currentProgress >= 0.78 && currentProgress < 0.88}
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
        </div>

        {/* Pinned Consistent Story Caption Bar across all 3 acts */}
        <StoryCaptionBar className="absolute bottom-11 sm:bottom-12 left-1/2 -translate-x-1/2 z-35" />

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
