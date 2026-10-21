'use client';
/** LEAD FLOW DIAGRAM — two funnel paths converging into outreach. */
import { motion, useReducedMotion } from 'framer-motion';
import { LEAD_FLOW } from '@/content/process-sections-c';
import { Reveal, SectionHead, SectionShell } from './primitives';

export default function LeadFlow() {
  const still = useReducedMotion();
  return (
    <SectionShell id="lead-flow">
      <SectionHead eyebrow={LEAD_FLOW.eyebrow} title={LEAD_FLOW.title} lead={LEAD_FLOW.lead} />
      <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-8">
        {[
          { key: 'free', path: LEAD_FLOW.freeToolPath },
          { key: 'web', path: LEAD_FLOW.websitePath },
        ].map((col, ci) => (
          <motion.div
            key={col.key}
            initial={still ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: ci * 0.12 }}
          >
            <p className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
              {col.path.label}
            </p>
            <ol className="mt-4">
              {col.path.steps.map((s) => (
                <li key={col.key + s.no} className="flex gap-4 border-t border-[var(--rule)] py-4 last:border-b">
                  <span className="font-mono text-[13px] font-medium tabular-nums text-[var(--accent)]">
                    {s.no}
                  </span>
                  <span className="font-body text-[15px] text-[var(--on-surface)]">{s.text}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        ))}
      </div>
      <Reveal delay={0.1}>
        <p className="font-body mt-8 border-t border-[var(--rule-strong)] pt-6 text-[var(--muted)]">
          {LEAD_FLOW.convergeNote}
        </p>
      </Reveal>
    </SectionShell>
  );
}
