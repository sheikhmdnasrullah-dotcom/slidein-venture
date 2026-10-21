'use client';
/** CLIENT WORK, AUDIENCES, NUMBERS, GUARDRAILS, CLOSE — hairlines, no cards. */
import { CLIENT_WORK, WHO_FOR } from '@/content/process-sections-c';
import { CLOSE, GUARDRAILS, NUMBERS } from '@/content/process-sections-d';
import { Reveal, SectionHead, SectionShell } from './primitives';

export function ClientWork() {
  return (
    <SectionShell id="client-work">
      <SectionHead eyebrow={CLIENT_WORK.eyebrow} title={CLIENT_WORK.title} lead={CLIENT_WORK.lead} />
      <ol className="mt-8">
        {CLIENT_WORK.moments.map((m, i) => (
          <Reveal key={m.no} delay={Math.min(i * 0.06, 0.2)}>
            <li className="grid gap-1 border-t border-[var(--rule)] py-5 last:border-b md:grid-cols-[56px_220px_1fr] md:gap-6">
              <span className="font-mono text-[13px] font-medium tabular-nums text-[var(--accent)]">{m.no}</span>
              <span className="font-body text-[15px] font-semibold text-[var(--on-surface)]">{m.name}</span>
              <span className="font-body text-[15px] text-[var(--muted)]">{m.detail}</span>
            </li>
          </Reveal>
        ))}
      </ol>
      <Reveal delay={0.1}>
        <p className="font-body mt-6 text-[var(--muted)]">{CLIENT_WORK.slideinNote}</p>
      </Reveal>
    </SectionShell>
  );
}

export function WhoFor() {
  return (
    <SectionShell id="who-for">
      <SectionHead eyebrow={WHO_FOR.eyebrow} title={WHO_FOR.title} />
      <ol className="mt-8">
        {WHO_FOR.audiences.map((a, i) => (
          <Reveal key={a.no} delay={Math.min(i * 0.06, 0.2)}>
            <li className="grid gap-1 border-t border-[var(--rule)] py-5 last:border-b md:grid-cols-[56px_260px_1fr] md:gap-6">
              <span className="font-mono text-[13px] font-medium tabular-nums text-[var(--accent)]">{a.no}</span>
              <span className="font-body text-[15px] font-semibold text-[var(--on-surface)]">{a.name}</span>
              <span className="font-body text-[15px] text-[var(--muted)]">{a.detail}</span>
            </li>
          </Reveal>
        ))}
      </ol>
      <Reveal delay={0.1}>
        <h3 className="font-display-sm mt-12 text-[var(--on-surface)]">{WHO_FOR.icpTitle}</h3>
      </Reveal>
      <Reveal delay={0.14}>
        <p className="font-body mt-3 max-w-3xl text-[var(--muted)]">{WHO_FOR.icpLead}</p>
      </Reveal>
      <Reveal delay={0.16}>
        <ul className="mt-6 grid gap-0 sm:grid-cols-2">
          {WHO_FOR.icpCriteria.map((c) => (
            <li key={c} className="font-body border-t border-[var(--rule)] py-3 pr-6 text-[15px] text-[var(--on-surface)]">
              {c}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.18}>
        <p className="font-mono mt-4 text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
          {WHO_FOR.icpThreshold}
        </p>
      </Reveal>
    </SectionShell>
  );
}

export function Numbers() {
  return (
    <SectionShell id="numbers">
      <SectionHead eyebrow={NUMBERS.eyebrow} title={NUMBERS.title} lead={NUMBERS.lead} />
      <div className="mt-8">
        {NUMBERS.benchmarks.map((b, i) => (
          <Reveal key={b.metric} delay={Math.min(i * 0.05, 0.25)}>
            <div className="grid gap-1 border-t border-[var(--rule)] py-5 last:border-b md:grid-cols-[1fr_auto] md:items-baseline md:gap-6">
              <span className="font-body text-[15px] text-[var(--on-surface)]">{b.metric}</span>
              <span className="flex flex-wrap items-baseline gap-3">
                <span className="font-display-sm text-[var(--on-surface)]">{b.value}</span>
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
                  {b.provenance}
                </span>
              </span>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <p className="font-body mt-6 max-w-3xl text-[var(--muted)]">{NUMBERS.policyNote}</p>
      </Reveal>
    </SectionShell>
  );
}

export function Guardrails() {
  return (
    <SectionShell id="guardrails">
      <SectionHead eyebrow={GUARDRAILS.eyebrow} title={GUARDRAILS.title} />
      <Reveal delay={0.1}>
        <p className="font-display-sm mt-6 max-w-3xl text-balance text-[var(--on-surface)]">
          {GUARDRAILS.rule}
        </p>
      </Reveal>
      <ul className="mt-6">
        {GUARDRAILS.points.map((p, i) => (
          <Reveal key={p} delay={Math.min(i * 0.06, 0.2)}>
            <li className="font-body border-t border-[var(--rule)] py-4 text-[15px] text-[var(--muted)] last:border-b">
              {p}
            </li>
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  );
}
