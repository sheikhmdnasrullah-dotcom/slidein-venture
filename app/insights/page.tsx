import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/Section';
import { MonoLabel, SectionRule, CornerBrackets } from '@/components/System/System';
import AmbientEnvironment from '@/components/AmbientEnvironment/AmbientEnvironment';
import Footer from '@/components/Footer/Footer';
import { ARTICLES } from '@/content/insights';

export const metadata: Metadata = {
  title: 'Insights · SlideIn Venture',
  description:
    'Architectural analysis, pipeline diagnostics, and strategic playbooks on content production and outreach systems.',
};

export default function InsightsPage() {
  return (
    <div>
      {/* ── Hero Band ─────────────────────────────────────────────────── */}
      <Section
        tone="hero"
        pad="none"
        className="relative flex flex-col justify-center pb-[clamp(3.5rem,7vw,5.5rem)] pt-[calc(96px+clamp(3rem,6vw,5.5rem))]"
      >
        <AmbientEnvironment />
        <div className="relative z-10 mx-auto w-full max-w-[1040px] px-6 md:px-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-vivid)]" aria-hidden />
            <MonoLabel className="text-[var(--accent)]">
              DISPATCHES & SYSTEM STRATEGY
            </MonoLabel>
          </div>

          <h1 className="font-display-xl text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1.08] text-[var(--on-surface)] tracking-tight">
            Insights.
          </h1>

          <p className="font-body-lead mt-6 max-w-[58ch] text-[clamp(1.1rem,2vw,1.3rem)] leading-[1.65] text-[var(--muted)]">
            Architectural diagnostics, pipeline engineering, and systematic playbooks for high-value
            advisors and founders who refuse to rely on streaks.
          </p>
        </div>
      </Section>

      {/* ── Articles Directory ────────────────────────────────────────── */}
      <Section tone="base" pad="none" className="py-14 md:py-24" seam>
        <div className="mx-auto w-full max-w-[1040px] px-6 md:px-10">
          <SectionRule
            index="01"
            label="Field Dispatches"
            coordinate={`${ARTICLES.length.toString().padStart(2, '0')} PUBLISHED`}
            className="mb-12"
          />

          <div className="space-y-8">
            {ARTICLES.map((article) => (
              <article
                key={article.slug}
                className="group relative rounded-xl border border-[var(--rule-strong)] bg-[var(--surface)] p-8 md:p-12 transition-all duration-300 hover:border-[var(--accent-ring)] hover:shadow-sm"
              >
                <CornerBrackets size={10} />

                {/* Article Header Meta */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)] pb-6 mb-8">
                  <MonoLabel>{article.formattedDate}</MonoLabel>

                  <MonoLabel className="text-[var(--accent)] font-medium">
                    {article.topic}
                  </MonoLabel>
                </div>

                {/* Title */}
                <h2 className="font-display-md text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.2] text-[var(--on-surface)] transition-colors group-hover:text-[var(--accent)] mb-5">
                  <Link href={`/insights/${article.slug}`} className="focus:outline-none">
                    {article.title}
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="text-[1.05rem] md:text-[1.125rem] leading-[1.75] text-[var(--muted)] max-w-[70ch] mb-8">
                  {article.excerpt}
                </p>

                {/* Read Link */}
                <div className="flex items-center pt-4">
                  <Link
                    href={`/insights/${article.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--on-surface)] transition-all group-hover:text-[var(--accent)]"
                  >
                    Read Insight
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
