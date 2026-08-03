'use client';

/**
 * THE CLOSE
 * ---------------------------------------------------------------------------
 * One sentence, one button, one way back to the top.
 *
 * The primary link goes to the Notion scheduling page rather than to a
 * `/contact` route, because `/contact` does not exist yet and the rule in
 * docs/site-architecture.md is that a link ships only when its route does. A
 * dead CTA at the bottom of the longest page on the site is the most expensive
 * possible 404.
 *
 * `CTA.availability` is null. The brief asked for a line reading
 * "NEXT INTAKE · Q4 · 3 SLOTS", wired to real data or deleted. There is no real
 * data, and a fabricated scarcity line on a page whose entire argument is
 * provenance would be the single most expensive sentence on it. It renders
 * nothing until something real is behind it.
 */

import Link from 'next/link';
import { ArrowUp01Icon, ArrowRight02Icon } from 'hugeicons-react';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import { CTA } from '@/content/steps';

export default function StepsCta({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mx-auto flex max-w-[1400px] flex-col items-center gap-10 px-6 text-center md:px-10',
        className,
      )}
    >
      <Rise>
        <h2 className="font-display-md max-w-[18ch] text-[clamp(1.75rem,4vw,3rem)] text-[var(--on-surface)]">
          {CTA.headline}
        </h2>
      </Rise>

      <Rise delay={0.08}>
        <div className="flex flex-col items-center gap-6">
          <a
            href={CTA.primary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--accent-vivid)] px-8 py-4 text-[var(--on-accent)]"
          >
            <span className="font-body-lead">{CTA.primary.label}</span>
            <ArrowRight02Icon size={18} strokeWidth={2} />
          </a>

          <Link
            href={CTA.secondary.href}
            className="group inline-flex cursor-pointer items-center gap-2 text-[var(--muted)] transition-colors duration-300 hover:text-[var(--on-surface)]"
          >
            <ArrowUp01Icon size={14} strokeWidth={2} />
            <MonoLabel className="text-current">{CTA.secondary.label}</MonoLabel>
          </Link>
        </div>
      </Rise>

      {CTA.availability && <MonoLabel>{CTA.availability}</MonoLabel>}
    </div>
  );
}
