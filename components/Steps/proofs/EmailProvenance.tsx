'use client';

/**
 * PROOF · PHASE 3, ONE EMAIL AND WHERE EVERY LINE OF IT CAME FROM
 * ---------------------------------------------------------------------------
 * The best available answer to "is this AI slop", and it works because it does
 * not answer the question. It shows provenance instead: four fragments of the
 * email, each traced by a hairline back to the specific research field that
 * produced it. A claim about quality is a claim. A trace is checkable.
 *
 * It is rendered as an email — sender, subject, body — rather than as a card,
 * because the thing being shown is the artifact the prospect receives.
 *
 * ONE DEVIATION FROM THE BRIEF, ON PURPOSE
 * The brief traces each fragment back to the lead card in phase 2. Only one
 * phase is open at a time, so that card is not on screen when this one is, and
 * a hairline pointing at a collapsed section is a hairline pointing at nothing.
 * The four fields therefore appear beside the email, from the same content
 * record the lead card reads, so the two can never disagree.
 *
 * THE CONNECTORS ARE MEASURED, AND THAT IS THE RISKY PART
 * Fragment positions depend on where the text wraps, which depends on the
 * container width and on which font has loaded. There is no arithmetic that
 * predicts them, so they are measured. The mitigations are all in `measure()`:
 * a ResizeObserver on the container rather than a window listener, a recompute
 * when webfonts finish loading, and a null render until the first measurement
 * lands so nothing is ever drawn against a stale layout.
 *
 * Below the large breakpoint the connectors are dropped entirely and the
 * relationship is carried by matching index badges. A diagonal line across a
 * stacked mobile layout communicates nothing and costs a measurement pass on
 * every reflow.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import { LEAD_INTELLIGENCE, SAMPLE_EMAIL } from '@/content/steps';

type Line = { id: string; x1: number; y1: number; x2: number; y2: number };

/* The fields, in the order the email uses them, so the badge numbers count
   down the page rather than following the order they were researched in. */
const TRACED = SAMPLE_EMAIL.segments
  .map((s) => s.source)
  .filter((s): s is string => Boolean(s));

const badgeOf = (source: string) => TRACED.indexOf(source) + 1;

export default function EmailProvenance({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const fragments = useRef<Record<string, HTMLElement | null>>({});
  const fields = useRef<Record<string, HTMLElement | null>>({});
  const [lines, setLines] = useState<Line[] | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const container = wrap.current;
    if (!container) return;
    const base = container.getBoundingClientRect();

    const next: Line[] = [];
    for (const source of TRACED) {
      const from = fragments.current[source];
      const to = fields.current[source];
      if (!from || !to) continue;
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      next.push({
        id: source,
        x1: a.right - base.left,
        y1: a.top + a.height / 2 - base.top,
        x2: b.left - base.left,
        y2: b.top + b.height / 2 - base.top,
      });
    }

    setBox({ w: base.width, h: base.height });
    setLines(next);
  }, []);

  useLayoutEffect(() => {
    measure();
    const container = wrap.current;
    if (!container) return;
    const obs = new ResizeObserver(measure);
    obs.observe(container);
    return () => obs.disconnect();
  }, [measure]);

  useEffect(() => {
    /* Fraunces and the mono face change the wrap points when they land. */
    if (typeof document === 'undefined' || !document.fonts) return;
    document.fonts.ready.then(measure).catch(() => {});
  }, [measure]);

  return (
    <div
      ref={wrap}
      className={cn('relative grid gap-8 lg:grid-cols-[1fr_280px] lg:gap-16', className)}
    >
      {/* ── The email ─────────────────────────────────────────────────── */}
      <div className="rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)]">
        <div className="flex flex-col gap-1.5 border-b border-[var(--rule)] px-6 py-4">
          <MonoLabel>FROM · {SAMPLE_EMAIL.from}</MonoLabel>
          <MonoLabel>TO · {SAMPLE_EMAIL.to}</MonoLabel>
        </div>
        <div className="border-b border-[var(--rule)] px-6 py-4">
          <span className="font-body-lead text-[var(--on-surface)]">
            {SAMPLE_EMAIL.subject}
          </span>
        </div>
        <p className="font-body whitespace-pre-line px-6 py-6 text-[var(--on-surface)]">
          {SAMPLE_EMAIL.segments.map((segment, i) =>
            segment.source ? (
              <span
                key={i}
                ref={(el) => {
                  if (segment.source) fragments.current[segment.source] = el;
                }}
                className="rounded-[var(--radius-sm)] bg-[var(--accent-wash)] px-1 text-[var(--accent)]"
              >
                {segment.text}
                <sup className="font-label ml-0.5 align-super">
                  {badgeOf(segment.source)}
                </sup>
              </span>
            ) : (
              <span key={i}>{segment.text}</span>
            ),
          )}
        </p>
      </div>

      {/* ── Where each fragment came from ─────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {LEAD_INTELLIGENCE.map((field) => (
          <div
            key={field.id}
            ref={(el) => {
              fields.current[field.id] = el;
            }}
            className="flex flex-col gap-1.5 rounded-[var(--radius-sm)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-3"
          >
            <span className="flex items-center gap-2">
              <span className="font-label flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent-wash)] text-[var(--accent)]">
                {badgeOf(field.id)}
              </span>
              <MonoLabel>{field.field}</MonoLabel>
            </span>
            <span className="font-body text-[var(--muted)]">{field.value}</span>
          </div>
        ))}
      </div>

      {/* ── The traces ────────────────────────────────────────────────── */}
      {lines && box.w > 0 && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          viewBox={`0 0 ${box.w} ${box.h}`}
          fill="none"
        >
          {lines.map((line) => (
            <path
              key={line.id}
              d={`M${line.x1},${line.y1} C${(line.x1 + line.x2) / 2},${line.y1} ${(line.x1 + line.x2) / 2},${line.y2} ${line.x2},${line.y2}`}
              stroke="var(--accent-ring)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      )}
    </div>
  );
}
