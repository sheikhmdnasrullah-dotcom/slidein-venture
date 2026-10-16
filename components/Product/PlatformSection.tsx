'use client';

import { useState, useRef } from 'react';
import { Section } from '@/components/Section';
import { cn } from '@/lib/utils';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { Heading, Text, Eyebrow } from '@/components/Type/Type';
import { PLATFORM } from '@/content/product';

/**
 * THE PLATFORM — the workspace, as an information map
 * ---------------------------------------------------------------------------
 * No fake dashboard. There is no live product surface to screenshot, so this
 * section shows the SHAPE of the software instead: the five areas where the
 * work happens, as a working tab rail over a detail pane. Every word in the
 * pane is real product content — what the area holds — and the access note
 * under it says plainly what is open today. An interactive map of the
 * workspace is honest in a way a mockup with invented numbers is not.
 *
 * Tabs are real tabs: arrow keys move between them, one stop in the tab order,
 * and the pane is a labelled tabpanel.
 */
export default function PlatformSection() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = PLATFORM.areas.length - 1;
    let next = active;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const area = PLATFORM.areas[active];

  return (
    <Section tone="base" pad="none" className="py-[clamp(4.5rem,9vw,8rem)]">
      <div className="mx-auto w-full max-w-[1040px] px-6 md:px-10">
        <SectionHead
          label={PLATFORM.eyebrow}
          heading={PLATFORM.heading}
          body={PLATFORM.body}
        />

        <Reveal delay={0.08}>
          <div
            className="mt-8 overflow-hidden rounded-[calc(var(--radius-md)*1.6)]"
            style={{
              background: 'linear-gradient(180deg, var(--gloss), transparent 26%), var(--surface-glass)',
              border: '1px solid var(--rule)',
              boxShadow: 'var(--shadow-inset-top), var(--shadow-raised)',
              backdropFilter: 'blur(22px) saturate(1.25)',
              WebkitBackdropFilter: 'blur(22px) saturate(1.25)',
            }}
          >
            {/* Panel header — the workspace's own chrome, no fake window dots */}
            <div className="flex items-center gap-3 border-b border-[var(--rule)] px-6 py-4 md:px-8">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-[var(--accent-vivid)]"
              />
              <Eyebrow as="span" text="Workspace" />
              <span className="ml-auto">
                <Eyebrow as="span" text="SlideIn Venture" />
              </span>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Area rail */}
              <div
                role="tablist"
                aria-label="Platform areas"
                aria-orientation="vertical"
                onKeyDown={onKeyDown}
                className="flex shrink-0 flex-col border-b border-[var(--rule)] md:w-[260px] md:border-b-0 md:border-r"
              >
                {PLATFORM.areas.map((a, i) => (
                  <button
                    key={a.name}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    role="tab"
                    id={`area-tab-${i}`}
                    aria-selected={i === active}
                    aria-controls="area-panel"
                    tabIndex={i === active ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={cn(
                      'group relative cursor-pointer px-6 py-4 text-left transition-colors duration-300 md:px-8',
                      i > 0 && 'border-t border-[var(--rule)] md:border-t'
                    )}
                    style={i === active ? { background: 'var(--accent-wash)' } : undefined}
                  >
                    {/* The selected rail — a 2px accent bar down the left edge */}
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                      style={{
                        background: 'var(--accent-vivid)',
                        transform: i === active ? 'scaleY(1)' : undefined,
                      }}
                    />
                    <Text
                      as="span"
                      variant="small"
                      text={a.name}
                      className={cn(
                        'block transition-colors duration-300',
                        i === active ? 'text-[var(--scaffold-ink)]' : 'group-hover:text-[var(--scaffold-ink)]'
                      )}
                    />
                  </button>
                ))}
              </div>

              {/* Area pane */}
              <div
                role="tabpanel"
                id="area-panel"
                aria-labelledby={`area-tab-${active}`}
                className="flex flex-1 flex-col justify-center px-6 py-10 md:px-10 md:py-14"
              >
                <Eyebrow
                  text={`Area ${String(active + 1).padStart(2, '0')} / ${String(PLATFORM.areas.length).padStart(2, '0')}`}
                />
                <Heading variant="h3" text={area.name} className="mt-4" />
                <Text variant="body" text={area.detail} className="mt-4 max-w-[52ch]" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* The honest state of access */}
        <Reveal delay={0.14}>
          <Text variant="small" text={PLATFORM.accessNote} className="mt-8 max-w-[70ch]" />
        </Reveal>
      </div>
    </Section>
  );
}
