'use client';

/**
 * HERO SYNC — the subline phrases follow the master loop.
 * ---------------------------------------------------------------------------
 * Reads the hero master slot table (field/clock.ts: stageAt/CYCLE_MS — the
 * same 35s table the tile field consumes, never a second clock) and lights
 * exactly one subline phrase via `data-active-phrase` on the section, with
 * `data-active-stage` and `data-loop-t` alongside for tests. The loop starts
 * 1850ms into the entrance (or the moment the entrance completes early) —
 * 2000ms in the spec, moved earlier with owner approval: LCP fires on the
 * phrase-1 repaint at loop start, so 2000ms cannot meet the ≤2.0s budget.
 *
 * Clicking/tapping a phrase seeks the loop to that phrase's first stage and
 * holds it for 8s, mirroring tile selection. The loop pauses offscreen, in
 * hidden tabs, and while the story player owns the screen. Direct DOM writes
 * only — zero React state per frame. Under reduced motion there is no loop:
 * phrase 1 stays lit by CSS, and clicks still seek (instantly).
 */

import { useEffect, useRef } from 'react';
import { CYCLE_MS, stageAt } from './field/clock';
import { HERO_PHRASE_SYNC } from '@/content/hero-sync';
import { LOOP_STAGE_ORDER } from '@/content/stages';

/** Selection hold after a seek — the same 8s the tile field uses. */
const HOLD_MS = 8000;
/** Loop start offset into the entrance timeline (spec 2000ms; see header). */
const LOOP_START_MS = 1850;

/** Stage id → phrase index (0-based), derived from the sync config. */
const STAGE_TO_PHRASE: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  HERO_PHRASE_SYNC.forEach((entry, i) => {
    for (const stage of entry.stages) map[stage] = i;
  });
  return map;
})();

export function useHeroSync(
  sectionRef: React.RefObject<HTMLElement | null>,
  still: boolean,
  frozen: boolean,
) {
  const frozenRef = useRef(frozen);
  useEffect(() => {
    frozenRef.current = frozen;
  }, [frozen]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    let startTimer = 0;
    let started = false;
    let clock = 0;
    let last = 0;
    let holdUntil = 0;
    let holdPhrase = -1;
    let offscreen = false;
    let hidden = typeof document !== 'undefined' ? document.hidden : false;
    // Reduced motion runs no loop — but seeking still works below.
    const loopOn = !still;

    const writeActive = (phrase: number, stageId: string) => {
      section.dataset.activePhrase = String(phrase + 1);
      section.dataset.activeStage = stageId;
    };

    const begin = () => {
      if (started || !loopOn) return;
      started = true;
      last = performance.now();
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        const dt = Math.min(now - last, 100);
        last = now;
        if (now >= holdUntil) holdPhrase = -1;
        const held = holdPhrase >= 0;
        if (!held && !frozenRef.current && !hidden && !offscreen) {
          clock = (clock + dt) % CYCLE_MS;
        }
        const stageIndex = stageAt(clock);
        const stageId = LOOP_STAGE_ORDER[stageIndex] ?? '';
        const phrase = held ? holdPhrase : (STAGE_TO_PHRASE[stageId] ?? 0);
        const want = String(phrase + 1);
        // Write on a stage change too, not only a phrase change: several
        // stages share one phrase, and the stage must stay truthful inside
        // the group (the tile field reads the same instant).
        const wantStage = held ? section.dataset.activeStage || stageId : stageId;
        if (section.dataset.activePhrase !== want || section.dataset.activeStage !== wantStage) {
          writeActive(phrase, wantStage);
        }
        section.dataset.loopT = String(Math.round(clock));
      };
      raf = requestAnimationFrame(loop);
    };

    /* Loop start follows the entrance: LOOP_START_MS after the boot timestamp
       (parse time, so the loop stays choreographed even when hydration is
       slow), or the moment the entrance completes early. */
    const root = document.documentElement;
    const bootT = Number(root.dataset.heroBootT);
    const origin = Number.isFinite(bootT) ? bootT : performance.now();
    const schedule = () => {
      if (started) return;
      window.clearTimeout(startTimer);
      const wait = origin + LOOP_START_MS - performance.now();
      if (wait <= 50) begin();
      else startTimer = window.setTimeout(begin, wait);
    };
    const mo = new MutationObserver(() => {
      if (started) return;
      const boot = root.dataset.heroBoot;
      if (boot === 'play') schedule();
      else if (boot === 'done') {
        window.clearTimeout(startTimer);
        begin();
      }
    });
    mo.observe(root, { attributes: true, attributeFilter: ['data-hero-boot'] });
    // The boot state predates this effect (the script ran during parse).
    if (root.dataset.heroBoot === 'done') begin();
    else if (root.dataset.heroBoot === 'play') schedule();

    /* Phrase click/tap seeks (pointer + touch; no tab stops added — keyboard
       users select stages through the tiles). Works under reduced motion. */
    const onClick = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest?.('[data-phrase]');
      if (!target || !(target instanceof HTMLElement)) return;
      const phrase = Number(target.dataset.phrase) - 1;
      if (!Number.isInteger(phrase) || phrase < 0 || phrase >= HERO_PHRASE_SYNC.length) return;
      // The clock freezes while held (same as tile selection) and resumes
      // from the frozen instant when the hold expires.
      holdPhrase = phrase;
      holdUntil = performance.now() + HOLD_MS;
      writeActive(phrase, HERO_PHRASE_SYNC[phrase].stages[0]);
      section.dataset.loopT = String(Math.round(clock));
    };
    section.addEventListener('click', onClick);

    const io = new IntersectionObserver(([entry]) => {
      offscreen = !entry.isIntersecting;
      // CSS-visible too: the pill beam pauses offscreen.
      section.dataset.onscreen = entry.isIntersecting ? '1' : '0';
    });
    io.observe(section);
    const onVis = () => {
      hidden = document.hidden;
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      mo.disconnect();
      section.removeEventListener('click', onClick);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.clearTimeout(startTimer);
      cancelAnimationFrame(raf);
      raf = 0;
    };
  }, [sectionRef, still]);
}
