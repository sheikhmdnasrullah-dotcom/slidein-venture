'use client';

/**
 * CAPTION BAND — Reels-style rhythm, textless by default
 * ---------------------------------------------------------------------------
 * Height 112px (96px mobile), single line, Reels/Shorts pop-up style.
 *
 * TWO STATES, ONE ANIMATION CLOCK. Both are driven by `localTime`, so the
 * top progress hairline behaves identically either way.
 *
 *   WITH COPY (`cue.text` non-empty) — the Reels word rhythm:
 *     - Words pop up in sequence, matched with the brand orange accent.
 *     - Active word: saturated accent, scale 1.08, accent pill, glow.
 *     - Spoken words: solid dark ink (0.95).
 *     - Upcoming words: muted transparent ink (0.28).
 *
 *   WITHOUT COPY (`cue.text` empty — the current state) — a nine-bar
 *     skeleton cadence where the sentence would be. Same accent, same
 *     travel, same hairline; no words at all. Nothing is invented to fill
 *     the line. Fill `cue.text` deliberately and this state retires itself.
 *
 * The accessible transcript only lists cues that actually carry copy, so a
 * screen reader is never handed a blank bullet.
 */

import { AnimatePresence, motion, type MotionValue } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SCENES, type Cue } from '@/content/story';

interface Props {
  cue: Cue;
  localTime: MotionValue<number>;
  captionsVisible: boolean;
}

export function CaptionBand({ cue, localTime, captionsVisible }: Props) {
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const lTime = localTime.get();
      const cueElapsed = lTime - cue.start;
      const p = Math.max(0, Math.min(1, cueElapsed / Math.max(1, cue.duration)));
      setProgress(p);
      animRef.current = requestAnimationFrame(update);
    };
    animRef.current = requestAnimationFrame(update);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [localTime, cue]);

  // Words breakdown for Reels-style animation
  const words = useMemo(() => cue.text.split(' ').filter(Boolean), [cue.text]);
  const wordCount = Math.max(1, words.length);
  const activeWordIdx = Math.min(wordCount - 1, Math.max(0, Math.floor(progress * wordCount)));

  /* Emphasis indexes: the contiguous run of words matching `cue.emphasis`
     (case-insensitive, trailing punctuation ignored). Styling only — the
     copy itself is never altered. */
  const emphasisIdx = useMemo(() => {
    const set = new Set<number>();
    const clean = (w: string) => w.toLowerCase().replace(/[.,;!?…:]+$/, '');
    const needle = cue.emphasis.split(' ').filter(Boolean).map(clean);
    if (needle.length === 0) return set;
    const hay = words.map(clean);
    for (let i = 0; i + needle.length <= hay.length; i++) {
      if (needle.every((w, j) => hay[i + j] === w)) {
        needle.forEach((_, j) => set.add(i + j));
        break;
      }
    }
    return set;
  }, [cue.emphasis, words]);

  /* THE TEXTLESS STATE.
     When the cue carries no approved copy, the band keeps its rhythm and
     loses its words: a fixed cadence of skeleton bars where the sentence
     would be, with the progress hairline above still filling and the
     accent bar travelling across the cadence. Nothing here is a word and
     nothing here is invented — it is the same skeleton vocabulary the rest
     of the site uses for empty slots. The moment `cue.text` is filled
     deliberately, the word path below takes over unchanged. */
  const BARS = 9;
  const barWidths = [0.42, 0.3, 0.5, 0.36, 0.46, 0.28, 0.44, 0.34, 0.4];
  const activeBar = Math.min(BARS - 1, Math.floor(progress * BARS));

  return (
    <div
      role="status"
      aria-live="off"
      data-testid="story-caption-band"
      className="relative flex w-full min-h-[64px] shrink-0 items-center justify-center border-t border-[rgba(10,10,10,0.06)] bg-white px-4 py-3 md:min-h-[72px] md:px-8 md:py-4"
      style={{ overflow: 'hidden' }}
    >
      {/* 1px top cue progress hairline (brand orange accent fill) */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[1.5px] bg-[rgba(10,10,10,0.08)]"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[var(--scaffold-accent)] transition-all duration-75 ease-linear"
          style={{ width: `${(progress * 100).toFixed(2)}%` }}
        />
      </div>

      {/* Reels-style Word-by-Word Single Line Captions */}
      {captionsVisible ? (
        words.length === 0 ? (
          /* Textless cadence — see THE TEXTLESS STATE above. */
          <div
            aria-hidden="true"
            className="flex w-full max-w-[680px] items-center justify-center gap-x-2 gap-y-2"
          >
            {barWidths.map((w, i) => {
              const isActive = i === activeBar;
              const isPast = i < activeBar;
              return (
                <span
                  key={i}
                  className="block h-[0.62em] rounded-full"
                  style={{
                    width: `${w * 100}%`,
                    maxWidth: 116,
                    background: isActive
                      ? 'var(--scaffold-accent)'
                      : isPast
                        ? 'rgba(10,10,10,0.34)'
                        : 'rgba(10,10,10,0.1)',
                    transform: isActive ? 'scaleY(1.5)' : 'scaleY(1)',
                    opacity: isActive ? 1 : 0.9,
                    boxShadow: isActive ? '0 3px 12px rgba(255,98,0,0.28)' : 'none',
                    transition:
                      'transform 160ms cubic-bezier(0.22, 1, 0.36, 1), background-color 160ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 160ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                />
              );
            })}
          </div>
        ) : (
          <AnimatePresence mode="wait">
          <motion.div
            key={cue.id}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-w-full items-center justify-center overflow-hidden px-2 text-center"
          >
            <div
              className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center whitespace-normal"
              style={{
                fontSize: 'clamp(0.9375rem, 1.45vw, 1.25rem)',
                lineHeight: 1.4,
                letterSpacing: '-0.015em',
              }}
            >
              {words.map((word, i) => {
                const isActive = i === activeWordIdx;
                const isPast = i < activeWordIdx;
                const isEmphasis = emphasisIdx.has(i);

                return (
                  <span
                    key={`${cue.id}-${i}-${word}`}
                    data-emphasis={isEmphasis ? 'true' : undefined}
                    style={{
                      display: 'inline-block',
                      transition: 'all 120ms cubic-bezier(0.22, 1, 0.36, 1)',
                      color: isActive
                        ? 'var(--scaffold-accent)'
                        : isEmphasis && isPast
                        ? 'var(--scaffold-accent)'
                        : isPast
                        ? 'rgba(10,10,10,0.95)'
                        : isEmphasis
                        ? 'rgba(10,10,10,0.52)'
                        : 'rgba(10,10,10,0.28)',
                      backgroundColor: isActive ? 'var(--scaffold-accent-chip)' : 'transparent',
                      transform: isActive ? 'scale(1.08) translateY(-1px)' : 'scale(1) translateY(0)',
                      borderRadius: 999,
                      padding: isActive ? '0.08em 0.36em' : '0 0.04em',
                      fontWeight: isActive ? 700 : isEmphasis ? 700 : isPast ? 600 : 500,
                      boxShadow: isActive ? '0 2px 10px rgba(255,85,0,0.18)' : 'none',
                      textDecoration:
                        isEmphasis && !isActive && !isPast
                          ? 'underline dotted rgba(255,98,0,0.45)'
                          : 'none',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </motion.div>
          </AnimatePresence>
        )
      ) : (
        <div aria-hidden="true" className="h-6" />
      )}

      {/* Accessible transcript. Only cues that actually carry approved copy
          contribute a line — an empty cue contributes nothing, so the
          screen reader is never handed a blank bullet. */}
      <div className="sr-only">
        <h4>SlideIn Story Transcript</h4>
        {SCENES.map((sc) => {
          const said = sc.cues.map((c) => c.text).filter(Boolean);
          if (said.length === 0) return null;
          return (
            <div key={sc.id}>
              <h5>{sc.word || sc.id}</h5>
              <ul>
                {said.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
