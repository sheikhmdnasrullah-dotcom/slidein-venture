'use client';

/**
 * THE PROGRESS RAIL — where am I in twenty eight steps
 * ---------------------------------------------------------------------------
 * Eight ticks pinned to the left edge for the whole scroll, one per phase,
 * grouped by track. The current phase's tick fills. Clicking a tick jumps to
 * that phase, and on the outreach side it opens it as well, because PhaseRail
 * listens for the same `#phase-<id>` hash.
 *
 * WHAT IT REPLACES
 * The source canvas had three unlabelled curved feedback arrows returning to
 * three different nodes. Three unlabelled loops on one drawing is three
 * unanswered questions, and none of them were the question a reader actually
 * has, which is "how much of this is left". A canvas answers that by letting
 * you zoom out. A web page has to answer it with a rail.
 *
 * WHY IT IS A LIST OF NAMES AND NOT EIGHT BARE TICKS
 * Eight anonymous marks tell a reader how far through they are and nothing
 * else. The same eight marks with their phase names attached are also the
 * table of contents for a page that is otherwise eight screens of scroll, and
 * the cost is 140px of gutter that is empty on every viewport wide enough to
 * show it.
 *
 * WHY IT CARRIES ITS OWN SURFACE
 * It is `fixed`, so it sits outside every `<Section>` and cannot inherit a
 * band's tone. Section 03 is an ink band and the rail would otherwise be paper
 * coloured type on it. Giving it a surface and a hairline of its own makes it a
 * floating panel that reads correctly over every band it crosses, in both
 * themes, without knowing which one it is over.
 *
 * BELOW 1024px IT IS NOT THERE
 * There is no gutter to put it in, and a horizontal version of the same control
 * is a second sticky bar under the one StepsNav already pins.
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import { TRACKS } from '@/content/steps';

export default function StepsProgressRail() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  /**
   * The current phase is the LAST one whose head has passed the reading line,
   * a third of the way down the viewport. Every element that declares itself a
   * phase anchor takes part: the content phases declare it on their band head
   * and the outreach phases on their card, so the rail needs no knowledge of
   * how either half is laid out.
   *
   * WHY THIS IS A SCROLL HANDLER AND NOT AN INTERSECTION OBSERVER
   * An observer answers "is this element inside a band right now", which leaves
   * a dead zone: a phase whose steps are three screens tall has its head far
   * above any band you can define, so nothing is current and every tick goes
   * dark in the middle of the section the rail exists to track. A threshold
   * comparison has no dead zone — some phase is always the last one passed —
   * and it costs one `getBoundingClientRect` per anchor per frame, on eight
   * elements, inside a rAF.
   */
  useEffect(() => {
    const anchors = Array.from(
      document.querySelectorAll<HTMLElement>('[data-phase-anchor]'),
    );
    if (!anchors.length) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.34;

      const passed = anchors
        .map((el) => ({ el, top: el.getBoundingClientRect().top }))
        .filter((a) => a.top <= line);

      if (!passed.length) {
        setActiveId(null);
        return;
      }

      /* THE TWO HALVES OF THE PAGE ARE LAID OUT DIFFERENTLY AND THIS IS WHERE
         IT SHOWS. The four content phases are stacked bands, so "the last one
         whose head is above the line" is exactly right. The four outreach
         phases are a ROW of cards at the same height, so the same rule always
         reports the rightmost one, and the rail claimed the reader was on The
         Launch the moment the rail scrolled into view.

         So: take everything at the same height as the last one passed, and
         within that group prefer the phase that is actually open — PhaseRail
         opens from `#phase-<id>` — falling back to the first in document
         order. One rule, correct for a column of one and for a row of four. */
      const lastTop = passed[passed.length - 1].top;
      const row = passed.filter((a) => Math.abs(a.top - lastTop) < 24);

      const openId = window.location.hash.replace('#phase-', '');
      const open = row.find(
        (a) => a.el.getAttribute('data-phase-anchor') === openId,
      );

      setActiveId((open ?? row[0]).el.getAttribute('data-phase-anchor'));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', onScroll);
    };
  }, []);

  /* The rail is only useful while the reader is inside the twenty eight steps.
     It appears when the body of the page arrives and leaves with it, rather
     than floating over the hero and the CTA where it points at nothing. */
  useEffect(() => {
    const body = document.getElementById('steps-body');
    if (!body) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '-25% 0px -25% 0px', threshold: 0 },
    );
    observer.observe(body);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Phase progress"
      className={cn(
        /* Positioned against the CONTENT edge, not the viewport edge: the page
           is a centred 1400px measure, so the gutter is
           `(100vw - 1400px) / 2`. The rail is 9.5rem wide and wants 1.5rem of
           air, which means it only fits once that gutter clears 11rem — a
           1752px viewport. Below that it is not displayed at all rather than
           squeezed, because the failure mode of squeezing it is a floating
           panel sitting on top of the section headline. */
        'fixed left-[calc((100vw-1400px)/2-11rem)] top-1/2 z-40 hidden w-[9.5rem] -translate-y-1/2',
        'rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)] p-4',
        'transition-opacity duration-500 [transition-timing-function:var(--ease-expo)]',
        '[@media(min-width:1760px)]:block',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      {TRACKS.map((track, t) => (
        <div key={track.id} className={t ? 'mt-5' : undefined}>
          <MonoLabel className="block text-[var(--on-surface)]">
            {track.id.toUpperCase()}
          </MonoLabel>

          <ul className="mt-2.5 flex flex-col gap-1">
            {track.phases.map((phase) => {
              const on = activeId === phase.id;
              return (
                <li key={phase.id}>
                  <a
                    href={phase.anchor}
                    aria-current={on ? 'true' : undefined}
                    className="group flex items-start gap-2 py-0.5"
                  >
                    {/* The tick is the state. It grows and inks rather than
                        changing colour alone, so the rail still reads in
                        greyscale and at a glance. */}
                    <span
                      aria-hidden
                      className={cn(
                        'mt-[0.55em] block h-px shrink-0 self-start transition-all duration-300 [transition-timing-function:var(--ease-expo)]',
                        on
                          ? 'w-4 bg-[var(--accent-vivid)]'
                          : 'w-2 bg-[var(--rule-strong)] group-hover:w-3',
                      )}
                    />
                    {/* Wraps rather than truncates. "POST-PRODU…" and
                        "THE FORTRE…" are not names, and a table of contents
                        whose entries you cannot read is a decoration. */}
                    <MonoLabel
                      className={cn(
                        'leading-tight transition-colors duration-300',
                        on
                          ? 'text-[var(--on-surface)]'
                          : 'group-hover:text-[var(--on-surface)]',
                      )}
                    >
                      {phase.name}
                    </MonoLabel>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
