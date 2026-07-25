'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Card } from '@/components/ui/card';

const RED = '#7A0A0E';
const BLACK = '#191919';
const BORDER = 'rgba(25,25,25,0.12)';

const startingPoints = [
  'You Record Video Once',
  'You Tell Us Who to Reach, Once',
] as const;

const contentProduction = [
  'Audio & Video Editing',
  'Show Notes',
  'Transcripts',
  'Short Form Clips',
  'Thumbnails & Cover Art',
  'Blog Articles',
  'LinkedIn & Social Posts',
  'Publishing & Scheduling',
] as const;

const manualOutreach = [
  'Ideal Client Research',
  'Hand-Built Prospect Lists',
  'Email Verification',
  'Email Writing',
  'Sending & Follow-Ups',
  'Reply Sorting & Handoff',
] as const;

const outcomes = [
  'Consistent Multi-Platform Presence',
  'Qualified Conversations with the Right People',
] as const;

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function CompleteFramework() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="complete-framework-title"
      className="bg-white py-20 md:py-24"
    >
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <motion.h2
          id="complete-framework-title"
          className="mx-auto max-w-[760px] text-center text-[clamp(2rem,4.8vw,3.7rem)] font-[700] leading-[1.04] tracking-[-0.03em] text-[#191919]"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.65 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          A complete framework built to accelerate your revenue
        </motion.h2>

        <div className="relative mt-14 md:mt-16">
          <DesktopFrameworkLines />

          <div className="relative z-10 flex flex-col gap-9 md:gap-12">
            <motion.div
              className="flex flex-col items-center"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                aria-hidden="true"
                className="mb-8 hidden h-3.5 w-3.5 rounded-full md:block"
                style={{ backgroundColor: BLACK }}
              />

              <div className="grid w-full max-w-[980px] gap-5 md:grid-cols-2 md:gap-12">
                {startingPoints.map((item, index) => (
                  <StartCard key={item} label={item} accent={index === 0 ? RED : BLACK} />
                ))}
              </div>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <TrackCard
                id="content-production"
                accent={RED}
                title="Content Production"
                items={contentProduction}
              />
              <TrackCard
                id="manual-outreach"
                accent={BLACK}
                title="Manual Outreach"
                items={manualOutreach}
              />
            </div>

            <motion.div
              className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <OutcomeCard accent={RED} label={outcomes[0]} />

              <div className="mx-auto flex w-full max-w-[240px] flex-col items-center gap-2 lg:max-w-none">
                <div
                  aria-hidden="true"
                  className="hidden h-px w-16 lg:block"
                  style={{ backgroundColor: 'rgba(25,25,25,0.18)' }}
                />
                <div className="flex items-center gap-3 text-center text-[12px] font-[600] tracking-[-0.01em] text-[#191919] lg:flex-col lg:gap-2">
                  <span className="rounded-full border px-3 py-1" style={{ borderColor: BORDER }}>
                    Builds Trust
                  </span>
                  <span className="rounded-full border px-3 py-1" style={{ borderColor: BORDER }}>
                    Expands Reach
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="hidden h-px w-16 lg:block"
                  style={{ backgroundColor: 'rgba(25,25,25,0.18)' }}
                />
              </div>

              <OutcomeCard accent={BLACK} label={outcomes[1]} />
            </motion.div>

            <motion.div
              className="flex justify-center pt-1"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative w-full max-w-[540px]">
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-[-26px] h-[26px] w-px -translate-x-1/2 bg-black/15"
                />
                <motion.div
                  whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="rounded-[28px] px-8 py-6 text-center shadow-[0_10px_30px_rgba(122,10,14,0.14)]"
                  style={{ backgroundColor: RED }}
                >
                  <p className="text-[clamp(1.375rem,2.7vw,1.875rem)] font-[700] tracking-[-0.025em] text-white">
                    More Clients, Faster
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StartCard({ label, accent }: { label: string; accent: string }) {
  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.65 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="relative"
    >
      <div aria-hidden="true" className="mx-auto mb-5 h-8 w-px bg-black/15 md:hidden" />
      <Card
        className="rounded-[26px] border bg-white px-6 py-5 text-center shadow-[0_12px_32px_rgba(25,25,25,0.06)]"
        style={{ borderColor: accent }}
      >
        <p className="text-[1rem] font-[650] tracking-[-0.02em] text-[#191919] md:text-[1.05rem]">
          {label}
        </p>
      </Card>
      <div aria-hidden="true" className="mx-auto mt-5 h-8 w-px bg-black/15" />
    </motion.div>
  );
}

function TrackCard({
  id,
  accent,
  title,
  items,
}: {
  id: string;
  accent: string;
  title: string;
  items: readonly string[];
}) {
  return (
    <motion.article
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="relative rounded-[32px] border bg-white p-5 shadow-[0_16px_40px_rgba(25,25,25,0.06)] md:p-6"
      style={{ borderColor: BORDER }}
      aria-labelledby={`${id}-heading`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-5 top-0 h-1 rounded-full md:inset-x-6"
        style={{ backgroundColor: accent }}
      />

      <header className="px-1 pb-5 pt-3 md:pb-6">
        <h3
          id={`${id}-heading`}
          className="text-[1.15rem] font-[700] tracking-[-0.02em]"
          style={{ color: accent }}
        >
          {title}
        </h3>
      </header>

      <ol className="space-y-3" aria-label={title}>
        {items.map((item, index) => (
          <motion.li
            key={item}
            whileHover={{ x: 2 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            className="group"
          >
            <Card
              className="flex items-center gap-4 rounded-[22px] border bg-white px-4 py-4 shadow-none transition-shadow duration-200 group-hover:shadow-[0_10px_24px_rgba(25,25,25,0.06)] md:px-5"
              style={{ borderColor: accent }}
            >
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[12px] font-[700] tracking-[-0.01em]"
                style={{ borderColor: accent, color: accent }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-[14.5px] font-[600] leading-[1.45] tracking-[-0.01em] text-[#191919] md:text-[15px]">
                {item}
              </span>
            </Card>
          </motion.li>
        ))}
      </ol>
    </motion.article>
  );
}

function OutcomeCard({ accent, label }: { accent: string; label: string }) {
  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.55 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="relative"
    >
      <div aria-hidden="true" className="mx-auto mb-4 h-7 w-px bg-black/15 lg:hidden" />
      <Card
        className="rounded-[26px] border bg-white px-5 py-5 text-center shadow-[0_12px_32px_rgba(25,25,25,0.06)] md:px-7"
        style={{ borderColor: accent }}
      >
        <p className="text-[1rem] font-[650] leading-[1.35] tracking-[-0.02em] text-[#191919] md:text-[1.05rem]">
          {label}
        </p>
      </Card>
    </motion.div>
  );
}

function DesktopFrameworkLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
      <svg
        className="absolute left-0 top-0 h-[300px] w-full"
        viewBox="0 0 1200 300"
        fill="none"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M600 20 L330 150"
          stroke="rgba(25,25,25,0.28)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.9 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M600 20 L870 150"
          stroke="rgba(25,25,25,0.28)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.9 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      <svg
        className="absolute bottom-[84px] left-0 h-[170px] w-full"
        viewBox="0 0 1200 170"
        fill="none"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M305 0 L305 70"
          stroke="rgba(25,25,25,0.22)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M895 0 L895 70"
          stroke="rgba(25,25,25,0.22)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M305 70 C305 120 455 120 522 120"
          stroke="rgba(25,25,25,0.22)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M895 70 C895 120 745 120 678 120"
          stroke="rgba(25,25,25,0.22)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M600 120 L600 170"
          stroke="rgba(25,25,25,0.22)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </div>
  );
}
