/**
 * PROCESS STORY ROOT — composition + chapter ownership
 * ---------------------------------------------------------------------------
 * Spine engine, intro, four chapter shells (scene art arrives per chapter),
 * handoff zones, recap, debug overlay. Owns two discrete observers:
 *
 *  - activeChapter (all widths): argmax chapter ratio ≥ 0.25 — drives the
 *    chapter-ring progress fill.
 *  - Mobile ownership: the scene with max visibility ≥ 0.3 owns the
 *    protagonist; its visibility bucket (33/66%) is its beat. Manual beat
 *    taps write the same beat state (scroll IO retakes over on scroll).
 *    The owner mirrors into zoneRef for the spine engine (one reader, no
 *    re-renders in the hot loop).
 *
 * CSS micro-loops pause via .story-paused (offscreen + tab hidden).
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { PROCESS_COPY } from '@/content/process';
import { useIsMobile } from './geometry';
import { ChapterShell } from './ChapterShell';
import { Chapter1Scene } from './scenes/Chapter1';
import { Chapter2Scene } from './scenes/Chapter2';
import { Chapter3Scene } from './scenes/Chapter3';
import { Chapter4Scene } from './scenes/Chapter4';
import { HandoffZone } from './Handoff';
import { StoryIntro } from './Intro';
import { StoryRecap } from './Recap';
import { SpineEngine } from './Spine';
import { ProcessDebug } from './Debug';
import {
  CalendarGlyph,
  CapsuleArtifact,
  DraftArtifact,
  LoopCheckArtifact,
  PlaneGlyph,
  ResearchGlyph,
  ShortlistArtifact,
  SlidersGlyph,
} from './icons';
import './story.css';

function DotMini({ id }: { id: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" data-icon={id}>
      <circle cx="7" cy="7" r="4" fill="rgba(10,10,10,0.7)" />
    </svg>
  );
}

const CHAPTERS = [
  {
    anchor: <SlidersGlyph id="anchor-sliders" />,
    inMini: <DotMini id="ch1-in" />,
    outMini: <ShortlistArtifact id="ch1-out" dim />,
  },
  {
    anchor: <ResearchGlyph id="anchor-research" />,
    inMini: <ShortlistArtifact id="ch2-in" dim />,
    outMini: <DraftArtifact id="ch2-out" dim />,
  },
  {
    anchor: <PlaneGlyph id="anchor-plane" />,
    inMini: <DraftArtifact id="ch3-in" dim />,
    outMini: <CapsuleArtifact id="ch3-out" dim />,
  },
  {
    anchor: <CalendarGlyph id="anchor-calendar" />,
    inMini: <CapsuleArtifact id="ch4-in" dim />,
    outMini: <LoopCheckArtifact id="ch4-out" dim />,
  },
];

export function ProcessStory() {
  const mobile = useIsMobile();
  const [activeChapter, setActiveChapter] = useState(0);
  const [owner, setOwner] = useState<number | null>(null);
  const [beats, setBeats] = useState<Record<number, number>>({});
  const [paused, setPaused] = useState(false);
  const zoneRef = useRef<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* Active chapter for ring progress (all widths). */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const ratios = new Map<number, number>();
    const sections = [...root.querySelectorAll('[data-chapter]')];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = sections.indexOf(e.target as HTMLElement);
          if (i >= 0) ratios.set(i, e.intersectionRatio);
        }
        let best = 0;
        let bestRatio = 0;
        for (const [i, r] of ratios) {
          if (r > bestRatio) {
            bestRatio = r;
            best = i;
          }
        }
        setActiveChapter(bestRatio >= 0.2 ? best : 0);
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* Mobile ownership + beats from scene visibility. */
  useEffect(() => {
    if (!mobile) {
      zoneRef.current = null;
      return;
    }
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const ratios = new Map<number, number>();
    const scenes = [...root.querySelectorAll('[data-scene-surface]')];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = scenes.indexOf(e.target as HTMLElement);
          if (i >= 0) ratios.set(i, e.intersectionRatio);
        }
        let best = -1;
        let bestRatio = 0.3;
        for (const [i, r] of ratios) {
          if (r >= bestRatio) {
            bestRatio = r;
            best = i;
          }
        }
        zoneRef.current = best >= 0 ? `ch${best + 1}` : null;
        setOwner(best >= 0 ? best : null);
        if (best >= 0) {
          const beat = bestRatio < 0.55 ? 0 : bestRatio < 0.85 ? 1 : 2;
          setBeats((prev) => (prev[best] === beat ? prev : { ...prev, [best]: beat }));
        }
      },
      { threshold: [0, 0.3, 0.55, 0.85, 1] },
    );
    scenes.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [mobile]);

  /* Pause CSS micro-loops offscreen / tab hidden. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let offscreen = false;
    let hidden = document.hidden;
    const apply = () => setPaused(offscreen || hidden);
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver((list) => {
            offscreen = !list.some((r) => r.isIntersecting);
            apply();
          })
        : null;
    if (io) io.observe(root);
    const onVis = () => {
      hidden = document.hidden;
      apply();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const chapters = [PROCESS_COPY.ch1, PROCESS_COPY.ch2, PROCESS_COPY.ch3, PROCESS_COPY.ch4];

  return (
    <div ref={rootRef} data-story-root className={`story-root${paused ? ' story-paused' : ''}`}>
      <SpineEngine mobile={mobile} zone={zoneRef} />
      <StoryIntro />
      {chapters.map((copy, i) => (
        <div key={i}>
          <ChapterShell
            index={i}
            copy={copy}
            anchorGlyph={CHAPTERS[i].anchor}
            anchorId={`anchor-${i + 1}`}
            inputMini={CHAPTERS[i].inMini}
            outputMini={CHAPTERS[i].outMini}
            active={activeChapter >= i}
            mobileBeat={mobile && owner === i ? (beats[i] ?? 0) : null}
            owned={mobile ? owner === i : true}
            onBeat={(b) => setBeats((prev) => ({ ...prev, [i]: b }))}
            scene={
              i === 0
                ? (props) => <Chapter1Scene {...props} />
                : i === 1
                  ? (props) => <Chapter2Scene {...props} />
                  : i === 2
                    ? (props) => <Chapter3Scene {...props} />
                    : (props) => <Chapter4Scene {...props} />
            }
          />
          {i < 3 && <HandoffZone n={i + 1} />}
        </div>
      ))}
      <HandoffZone n={4} />
      <StoryRecap />
      <ProcessDebug />
    </div>
  );
}
