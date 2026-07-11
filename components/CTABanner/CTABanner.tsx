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
    <section className="relative bg-[#191919] py-24 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute w-[400px] h-[400px] rounded-full -top-24 -left-20 opacity-[0.12] blur-[80px]"
        style={{ background: 'radial-gradient(circle, #2383E2, transparent)' }} aria-hidden />
      <div className="absolute w-[320px] h-[320px] rounded-full -bottom-16 -right-10 opacity-[0.10] blur-[80px]"
        style={{ background: 'radial-gradient(circle, #9065B0, transparent)' }} aria-hidden />

      <div className="relative z-10 max-w-[800px] mx-auto px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {eyebrow && (
            <p className="text-[11.5px] font-[700] tracking-[0.08em] uppercase text-white/40 mb-4">
              {eyebrow}
            </p>
          )}

          <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-[700] leading-[1.06] tracking-[-0.03em] text-white mb-5">
            {headline}
          </h2>

          {subtext && (
            <p className="text-[16.5px] text-white/55 leading-[1.65] max-w-[460px] mx-auto mb-10">
              {subtext}
            </p>
          )}

          <div className="flex items-center justify-center gap-3 flex-wrap">
            {/* White filled button — shadcn-style */}
            <Link
              href={primaryHref}
              className="inline-flex items-center gap-2 px-6 py-3 text-[15px] font-[600] text-[#191919] bg-white rounded-[7px] hover:bg-[#F7F6F3] transition-all duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:-translate-y-px tracking-[-0.01em]"
            >
              {primaryLabel}
            </Link>

            {/* Ghost link */}
            <Link
              href={secondaryHref}
              className="inline-flex items-center gap-1.5 py-3 text-[15px] font-[500] text-white/60 hover:text-white/90 transition-colors duration-150 tracking-[-0.01em]"
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
