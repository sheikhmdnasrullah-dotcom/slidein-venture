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
   * One observer over every element that declares itself a phase anchor. The
   * content phases declare it on their band head and the outreach phases on
   * their card, so the rail needs no knowledge of how either half is laid out.
   *
   * The band is `-18%` from the top and `-72%` from the bottom, which leaves a
   * 10% strip just under the sticky nav. A phase is "current" when its head
   * crosses that strip. A full height root would report four phases at once on
   * a tall viewport and the tick would flicker between them on every frame.
   */
  useEffect(() => {
    const anchors = Array.from(
      document.querySelectorAll<HTMLElement>('[data-phase-anchor]'),
    );
    if (!anchors.length) return;

    const seen = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute('data-phase-anchor');
          if (id) seen.set(id, entry.isIntersecting);
        }
        /* Document order, not observer callback order: the callback reports
           only what changed, so the last entry in the batch is not necessarily
           the lowest phase on the page. */
        const current = anchors
          .map((el) => el.getAttribute('data-phase-anchor'))
          .filter((id): id is string => !!id && seen.get(id) === true);
        if (current.length) setActiveId(current[current.length - 1]);
      },
      { rootMargin: '-18% 0px -72% 0px', threshold: 0 },
    );

    for (const el of anchors) observer.observe(el);
    return () => observer.disconnect();
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
        'fixed left-[max(1rem,calc((100vw-1400px)/2-9rem))] top-1/2 z-40 hidden w-[9.5rem] -translate-y-1/2',
        'rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)] p-4',
        'transition-opacity duration-500 [transition-timing-function:var(--ease-expo)] xl:block',
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
                    className="group flex items-center gap-2 py-0.5"
                  >
                    {/* The tick is the state. It grows and inks rather than
                        changing colour alone, so the rail still reads in
                        greyscale and at a glance. */}
                    <span
                      aria-hidden
                      className={cn(
                        'block h-px shrink-0 transition-all duration-300 [transition-timing-function:var(--ease-expo)]',
                        on
                          ? 'w-4 bg-[var(--accent-vivid)]'
                          : 'w-2 bg-[var(--rule-strong)] group-hover:w-3',
                      )}
                    />
                    <MonoLabel
                      className={cn(
                        'truncate transition-colors duration-300',
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
