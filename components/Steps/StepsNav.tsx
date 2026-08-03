'use client';

/**
 * THE SEGMENTED CONTROL
 * ---------------------------------------------------------------------------
 * /steps is two services on one page and the reader arrives wanting one of
 * them. This is the switch, stuck under the nav pill, with the current half
 * lit as you scroll through it.
 *
 * THE LINKS ARE PLAIN ANCHORS, DELIBERATELY.
 * ChapterRun learned this the expensive way (see its header): a click handler
 * that scrolls imperatively has to fight `html { scroll-behavior: smooth }`,
 * any pinned section, and its own re measurement, and the failure mode is a
 * click that moves the page nowhere. A plain `href` gets native hash history,
 * the smooth scroll the site already declares, back button support and
 * keyboard behaviour for free. The only thing this component does in script is
 * decide which of the two is lit, which is a read, not a write.
 *
 * `scroll-mt` on the section elements is what keeps the target clear of the
 * floating nav pill, whose bottom edge is at 96px.
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { SEGMENTS } from '@/content/steps';

export default function StepsNav() {
  const [active, setActive] = useState<string>(SEGMENTS[0].id);

  useEffect(() => {
    const targets = SEGMENTS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!targets.length) return;

    /* A band across the middle of the viewport rather than any intersection,
       so exactly one segment is ever current even while two sections are
       partly on screen. Same rule the deck's index rail uses. */
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    targets.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="pointer-events-none sticky top-[112px] z-40 flex justify-center">
      <nav
        aria-label="Sections"
        className="pointer-events-auto flex items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--rule)] p-1"
        style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(24px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
          boxShadow: 'var(--shadow-raised)',
        }}
      >
        {SEGMENTS.map((segment) => {
          const on = active === segment.id;
          return (
            <a
              key={segment.id}
              href={segment.hash}
              aria-current={on ? 'true' : undefined}
              className={cn(
                'font-label cursor-pointer rounded-[var(--radius-pill)] px-4 py-2 transition-colors duration-300',
                on
                  ? 'bg-[var(--accent-wash)] text-[var(--accent)]'
                  : 'text-[var(--muted)] hover:text-[var(--on-surface)]',
              )}
            >
              {segment.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
