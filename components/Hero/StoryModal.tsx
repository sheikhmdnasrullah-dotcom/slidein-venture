'use client';

/**
 * HERO STORY MODAL
 * ---------------------------------------------------------------------------
 * Opens the SlideIn 7-step workflow story in a video card modal from the hero triggers:
 * (a) "See How It Works" video play button in the hero column
 * (b) 72px glossy play tile button on the product preview console
 * Deep link: ?story=1 opens player on load.
 *
 * ONE MASTER CLOCK drives everything in the card: the caption band's
 * word-by-word rhythm, the focus player's scene + segment progress, and the
 * stage advance. A cue runs its full `duration` (4800ms); when it elapses
 * the next stage mounts and its caption starts — animation and captions
 * cannot drift apart. Pause freezes the clock, the captions and the scene
 * timelines together.
 *
 * The card floats above the fixed nav (z-1200 over nav z-1000) and fits the
 * viewport with no internal scroll: header, focus stage and caption band
 * share a fixed column budget.
 *
 * Locks body scroll, traps focus, Esc closes, closing restores focus.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { EmbedStoryPlayer } from '@/components/Workflow/EmbedStoryPlayer';
import { NextIcon, PauseIcon, PlayIcon, PrevIcon } from '@/components/Workflow/icons';
import { CaptionBand } from '@/components/Story/CaptionBand';
import { WORKFLOW_CAPTIONS, STORY_CHROME } from '@/content/workflowCaptions';
import { UTILITY_STRINGS } from '@/content/story';

interface Props {
  open: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function StoryModal({ open, onClose, triggerRef }: Props) {
  const still = !!useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  /* Bumped on every seek so the scene remounts — and its CSS timelines
     restart — even when seeking to the already-active stage. */
  const [runId, setRunId] = useState(0);
  const localTime = useMotionValue(0);
  const progress = useMotionValue(0);

  /* Master-clock refs — the rAF loop reads these without re-subscribing. */
  const stageRef = useRef(0);
  const playingRef = useRef(false);
  const startRef = useRef(0);
  const frozenRef = useRef(0);

  /* Restart from the first cue on open; autoplay unless reduced motion. */
  useEffect(() => {
    if (!open) return;
    const now = performance.now();
    stageRef.current = 0;
    startRef.current = now;
    frozenRef.current = 0;
    localTime.set(0);
    progress.set(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStageIndex(0);
    setPlaying(!still);
  }, [open, still, localTime, progress]);

  useEffect(() => {
    playingRef.current = playing;
    if (playing) {
      /* Resume where the freeze left off. */
      startRef.current = performance.now() - frozenRef.current;
    }
  }, [playing]);

  /* The one clock: caption time, stage progress and stage advance. */
  useEffect(() => {
    if (!open) return;
    let anim = 0;
    const loop = (now: number) => {
      if (playingRef.current) {
        const cue = WORKFLOW_CAPTIONS[stageRef.current] ?? WORKFLOW_CAPTIONS[0];
        const elapsed = now - startRef.current;
        if (elapsed >= cue.duration) {
          const next = (stageRef.current + 1) % WORKFLOW_CAPTIONS.length;
          stageRef.current = next;
          startRef.current = now;
          frozenRef.current = 0;
          localTime.set(0);
          progress.set(0);
          setStageIndex(next);
        } else {
          frozenRef.current = elapsed;
          localTime.set(elapsed);
          progress.set(elapsed / cue.duration);
        }
      }
      anim = requestAnimationFrame(loop);
    };
    anim = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim);
  }, [open, localTime, progress]);

  /* Seek to a cue and restart its clock. */
  const seek = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), WORKFLOW_CAPTIONS.length - 1);
      const now = performance.now();
      stageRef.current = clamped;
      startRef.current = now;
      frozenRef.current = 0;
      localTime.set(0);
      progress.set(0);
      setStageIndex(clamped);
      setRunId((id) => id + 1);
    },
    [localTime, progress],
  );

  const toggle = useCallback(() => setPlaying((p) => !p), []);

  /* Hidden tab: freeze the clock rather than drift. */
  useEffect(() => {
    if (!open) return;
    const onVis = () => {
      if (document.hidden && playingRef.current) setPlaying(false);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [open ]);

  // Esc key closes modal & lock body scroll
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    closeBtnRef.current?.focus();
    const trigger = triggerRef?.current;

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  const currentCue = WORKFLOW_CAPTIONS[stageIndex] || WORKFLOW_CAPTIONS[0];

  return (
    <AnimatePresence>
      {open && (
        <div
          data-testid="story-modal-portal"
          className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-5"
        >
          {/* Backdrop (rgba(10,10,10,0.48)) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-[rgba(10,10,10,0.48)] backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Video Card — compact column that fits the viewport outright:
              header + focus stage + caption band, no internal scroll. */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="How SlideIn Works Video Walkthrough"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex w-[min(880px,100%)] h-[min(640px,calc(100dvh-24px))] sm:h-[min(680px,calc(100dvh-48px))] flex-col overflow-hidden rounded-[20px] md:rounded-[28px] border border-[rgba(10,10,10,0.1)] bg-white shadow-[0_24px_64px_-16px_rgba(10,10,10,0.22)]"
          >
            {/* Modal Card Header Bar — title, transport, close */}
            <div className="flex h-12 items-center justify-between gap-2 pl-4 pr-2 md:px-5 md:pr-3 border-b border-[rgba(10,10,10,0.06)] bg-white shrink-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--scaffold-accent)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--scaffold-accent)]" />
                </span>
                <span className="hidden min-[480px]:inline text-[12px] font-[550] tracking-[-0.01em] text-[rgba(10,10,10,0.7)] whitespace-nowrap">
                  {STORY_CHROME.title}
                </span>
                <span className="hidden min-[480px]:inline text-[rgba(10,10,10,0.25)] text-xs font-mono">•</span>
                <span className="text-[11px] font-mono font-medium text-[rgba(10,10,10,0.48)] whitespace-nowrap">
                  {stageIndex < 7 ? STORY_CHROME.step(stageIndex + 1) : STORY_CHROME.overview}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* Transport — seeks the master clock */}
                <button
                  type="button"
                  onClick={() => seek((stageIndex + WORKFLOW_CAPTIONS.length - 1) % WORKFLOW_CAPTIONS.length)}
                  aria-label={UTILITY_STRINGS.prevScene}
                  className="story-btn flex h-8 w-8 items-center justify-center rounded-full text-[rgba(10,10,10,0.6)] transition hover:bg-neutral-100 hover:text-[var(--scaffold-ink)] active:scale-95 cursor-pointer"
                >
                  <PrevIcon size={15} />
                </button>
                <button
                  type="button"
                  onClick={toggle}
                  aria-label={playing ? UTILITY_STRINGS.pause : UTILITY_STRINGS.play}
                  aria-pressed={playing}
                  data-testid="story-play-toggle"
                  className="story-btn flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(10,10,10,0.12)] bg-neutral-50/80 text-[rgba(10,10,10,0.75)] shadow-xs transition hover:bg-neutral-100 hover:text-[var(--scaffold-ink)] active:scale-95 cursor-pointer"
                >
                  {playing ? <PauseIcon size={15} /> : <PlayIcon size={15} />}
                </button>
                <button
                  type="button"
                  onClick={() => seek((stageIndex + 1) % WORKFLOW_CAPTIONS.length)}
                  aria-label={UTILITY_STRINGS.nextScene}
                  className="story-btn flex h-8 w-8 items-center justify-center rounded-full text-[rgba(10,10,10,0.6)] transition hover:bg-neutral-100 hover:text-[var(--scaffold-ink)] active:scale-95 cursor-pointer"
                >
                  <NextIcon size={15} />
                </button>

                <span className="mx-1 h-5 w-px bg-[rgba(10,10,10,0.08)]" aria-hidden="true" />

                {/* Top-Right Round Close Button */}
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close story player"
                  className="story-btn flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(10,10,10,0.12)] bg-neutral-50/80 text-[rgba(10,10,10,0.6)] shadow-xs transition hover:bg-neutral-100 hover:border-[rgba(10,10,10,0.25)] hover:text-[var(--scaffold-ink)] active:scale-95 cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 1. Compact focus stage — one scene + one icon, caption-locked. */}
            <div className="relative flex min-h-0 w-full flex-1 flex-col px-3 pt-2 md:px-5 md:pt-3">
              <EmbedStoryPlayer
                cue={currentCue}
                stageIndex={stageIndex}
                runId={runId}
                progress={progress}
                playing={playing}
                onSelect={seek}
              />
            </div>

            {/* 2. Reels-Style Word-by-Word Caption Band (Sticky at bottom of video card) */}
            <div className="w-full shrink-0 bg-white pt-2">
              <CaptionBand
                cue={currentCue}
                localTime={localTime}
                captionsVisible={true}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
