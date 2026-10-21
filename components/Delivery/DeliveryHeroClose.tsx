'use client';
/** HERO + CLOSE for the delivery blueprint page. */
import { CALENDAR_URL, HERO } from '@/content/process-delivery-a';
import { CLOSE } from '@/content/process-sections-d';
import { Reveal, SectionShell } from './primitives';
import { Eyebrow } from './primitives';

export function DeliveryHero() {
  return (
    <SectionShell className="pt-24 md:pt-32">
      <Reveal>
        <Eyebrow text={HERO.eyebrow} />
      </Reveal>
      <Reveal delay={0.06}>
        <h1 className="font-display-xl mt-4 text-balance text-[var(--on-surface)]">{HERO.title}</h1>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="font-body-lead mt-6 max-w-3xl text-[var(--on-surface)]">{HERO.story}</p>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="font-body mt-6 max-w-3xl text-[var(--muted)]">{HERO.positioning}</p>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="font-body mt-4 max-w-3xl border-l-2 border-[var(--accent-ring)] pl-4 text-sm text-[var(--muted)]">
          {HERO.pauseNote} {HERO.positioningNote}
        </p>
      </Reveal>
    </SectionShell>
  );
}

export function DeliveryClose() {
  return (
    <SectionShell id="engage">
      <Reveal>
        <Eyebrow text={CLOSE.eyebrow} />
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="font-display-md mt-4 max-w-3xl text-balance text-[var(--on-surface)]">
          {CLOSE.title}
        </h2>
      </Reveal>
      <ol className="mt-8">
        {CLOSE.options.map((o, i) => (
          <Reveal key={o.no} delay={Math.min(i * 0.06, 0.2)}>
            <li className="grid gap-1 border-t border-[var(--rule)] py-5 last:border-b md:grid-cols-[56px_280px_1fr] md:gap-6">
              <span className="font-mono text-[13px] font-medium tabular-nums text-[var(--accent)]">{o.no}</span>
              <span className="font-body text-[15px] font-semibold text-[var(--on-surface)]">{o.name}</span>
              <span className="font-body text-[15px] text-[var(--muted)]">{o.detail}</span>
            </li>
          </Reveal>
        ))}
      </ol>
      <Reveal delay={0.15}>
        <div className="mt-10">
          <a
            href={CALENDAR_URL}
            className="btn-premium inline-block bg-[var(--accent-vivid)] px-8 py-4 font-sans text-[15px] font-semibold text-[var(--on-accent)]"
          >
            {CLOSE.ctaLabel}
          </a>
          <p className="font-body mt-3 text-sm text-[var(--muted)]">{CLOSE.ctaNote}</p>
        </div>
      </Reveal>
    </SectionShell>
  );
}
