import Link from 'next/link';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import { MonoLabel } from '@/components/System/System';
import { HERO } from '@/content/steps';

/**
 * /steps — the opening band.
 *
 * One line and two doors. No subhead: the tiles say which half of the service
 * you are about to read, and a paragraph under a sentence this plain reads as
 * an apology for it.
 *
 * The tiles are real links to the two section anchors, so the reader who knows
 * which service they came for can skip the other one entirely. That is not a
 * shortcut around the page, it is the page admitting that a 28 step document
 * has two audiences.
 */
export default function StepsHero() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10">
      <Rise>
        <h1 className="font-display-xl max-w-[16ch] text-[clamp(2.5rem,6vw,4.75rem)] text-[var(--on-surface)]">
          {HERO.headline}
        </h1>
      </Rise>

      <div className="mt-[clamp(3rem,6vw,5rem)] grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-2">
        {HERO.tiles.map((tile, i) => (
          <Rise key={tile.id} delay={0.08 + i * 0.06} className="h-full">
            <Link
              href={tile.href}
              className="group flex h-full cursor-pointer flex-col justify-between gap-8 bg-[var(--surface)] p-8 transition-colors duration-300 hover:bg-[var(--surface-2)] md:p-10"
            >
              <div className="flex items-baseline gap-4">
                <MonoLabel className="text-[var(--accent)]">{tile.index}</MonoLabel>
                <MonoLabel className="text-[var(--on-surface)]">{tile.label}</MonoLabel>
              </div>
              <p className="font-body-lead text-[clamp(1.125rem,1.8vw,1.5rem)] text-[var(--on-surface)]">
                {tile.line}
              </p>
            </Link>
          </Rise>
        ))}
      </div>
    </div>
  );
}
