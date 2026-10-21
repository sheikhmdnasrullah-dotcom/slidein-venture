'use client';
/**
 * MACHINE DIAGRAM — Phase 1 fans out to three parallel branches, then
 * converges on Phase 6. Paths draw in on scroll. Static when reduced
 * motion is on. Phase 2 is paused and not shown.
 */
import { motion, useReducedMotion } from 'framer-motion';
import { MACHINE } from '@/content/process-delivery-a';
import { Eyebrow, Reveal, SectionShell } from './primitives';

function Node({
  phase,
  name,
  note,
  accent,
}: {
  phase: string;
  name: string;
  note: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? 'border border-[var(--accent-ring)] bg-[var(--accent-wash)] px-5 py-4 text-center'
          : 'border-t border-[var(--rule-strong)] px-5 py-4 text-center'
      }
    >
      <p className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
        {phase}
      </p>
      <p className="font-display-sm mt-1 text-[var(--on-surface)]">{name}</p>
      <p className="font-body mt-1 text-sm text-[var(--muted)]">{note}</p>
    </div>
  );
}

export default function MachineDiagram() {
  const still = useReducedMotion();
  return (
    <SectionShell id="machine">
      <Reveal>
        <Eyebrow text={MACHINE.eyebrow} />
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="font-display-md mt-4 max-w-3xl text-balance text-[var(--on-surface)]">
          {MACHINE.title}
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="font-body mt-4 max-w-3xl text-[var(--muted)]">{MACHINE.lead}</p>
      </Reveal>

      <motion.div
        className="mt-12"
        initial={still ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-md">
          <Node
            phase={MACHINE.foundation.phase}
            name={MACHINE.foundation.name}
            note={MACHINE.foundation.note}
            accent
          />
        </div>

        <div className="mx-auto max-w-4xl" aria-hidden={still ? undefined : true}>
          <svg viewBox="0 0 640 90" className="block h-20 w-full md:h-24" role="presentation">
            <motion.g
              stroke="var(--accent-vivid)"
              strokeWidth={1.5}
              fill="none"
              initial={still ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            >
              <motion.path d="M320 4 V34" />
              <motion.path d="M120 34 H520" />
              <motion.path d="M120 34 V62" />
              <motion.path d="M320 34 V62" />
              <motion.path d="M520 34 V62" />
            </motion.g>
            <g fill="var(--accent-vivid)">
              <circle cx="120" cy="70" r="3" />
              <circle cx="320" cy="70" r="3" />
              <circle cx="520" cy="70" r="3" />
            </g>
          </svg>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3 md:gap-6">
          {MACHINE.branches.map((b, i) => (
            <motion.div
              key={b.id}
              initial={still ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
            >
              <Node phase={b.phase} name={b.name} note={b.note} />
            </motion.div>
          ))}
        </div>

        <div className="mx-auto max-w-4xl" aria-hidden={still ? undefined : true}>
          <svg viewBox="0 0 640 90" className="block h-20 w-full md:h-24" role="presentation">
            <motion.g
              stroke="var(--accent-vivid)"
              strokeWidth={1.5}
              fill="none"
              initial={still ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            >
              <motion.path d="M120 8 V36" />
              <motion.path d="M320 8 V36" />
              <motion.path d="M520 8 V36" />
              <motion.path d="M120 36 H520" />
              <motion.path d="M320 36 V66" />
            </motion.g>
            <circle cx="320" cy="74" r="3" fill="var(--accent-vivid)" />
          </svg>
        </div>

        <div className="mx-auto max-w-md">
          <Node
            phase={MACHINE.converge.phase}
            name={MACHINE.converge.name}
            note={MACHINE.converge.note}
            accent
          />
        </div>

        <p className="font-body mx-auto mt-8 max-w-2xl text-center text-sm text-[var(--muted)]">
          {MACHINE.pausedBranchNote}
        </p>
      </motion.div>
    </SectionShell>
  );
}
