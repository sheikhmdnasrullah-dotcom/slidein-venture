'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface CTABannerProps {
  eyebrow?: string;
  headline: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CTABanner({
  eyebrow = 'Get started today',
  headline = 'Start with SlideIn Venture, free',
  subtext = 'Join millions of teams who use SlideIn Venture to do their best work.',
  primaryLabel = 'Get SlideIn Venture free',
  primaryHref = '/signup',
  secondaryLabel = 'Request a demo',
  secondaryHref = '/demo',
}: CTABannerProps) {
  return (
     <section className="relative py-24 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute w-[400px] h-[400px] rounded-full -top-24 -left-20 opacity-[0.15] blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(122,10,14,0.15), transparent)' }} aria-hidden />
      <div className="absolute w-[320px] h-[320px] rounded-full -bottom-16 -right-10 opacity-[0.10] blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(122,10,14,0.12), transparent)' }} aria-hidden />

      <div className="relative z-10 max-w-[800px] mx-auto px-6 md:px-10 text-center">
        <motion.div
          className="relative bg-white/80 backdrop-blur-2xl rounded-[2rem] p-10 md:p-16 border border-black/[0.04] shadow-[0_20px_80px_rgba(0,0,0,0.04)]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {eyebrow && (
            <p className="text-[11.5px] font-[700] tracking-[0.08em] uppercase text-black/40 mb-4">
              {eyebrow}
            </p>
          )}

          <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-[700] leading-[1.06] tracking-[-0.03em] text-black mb-5">
            {headline}
          </h2>

          {subtext && (
            <p className="text-[16.5px] text-black/55 leading-[1.65] max-w-[460px] mx-auto mb-10">
              {subtext}
            </p>
          )}

          <div className="flex items-center justify-center gap-3 flex-wrap">
            {/* White filled button — shadcn-style */}
            <Link
              href={primaryHref}
              className="inline-flex items-center gap-2 px-6 py-3 text-[15px] font-[600] text-white bg-[var(--color-brand)] rounded-[7px] hover:bg-[var(--color-ember)] transition-all duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:-translate-y-px tracking-[-0.01em]"
            >
              {primaryLabel}
            </Link>

            {/* Ghost link */}
            <Link
              href={secondaryHref}
              className="inline-flex items-center gap-1.5 py-3 text-[15px] font-[500] text-black/60 hover:text-black/90 transition-colors duration-150 tracking-[-0.01em]"
            >
              {secondaryLabel}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 6.5H12M7 1.5L12 6.5L7 11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
