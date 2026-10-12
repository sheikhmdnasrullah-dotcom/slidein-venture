'use client';

import Link from 'next/link';
import { Section } from '@/components/Section';
import { MonoLabel, SectionRule, CornerBrackets } from '@/components/System/System';
import type { InsightArticle } from '@/content/insights';

interface ArticleReaderProps {
  article: InsightArticle;
}

export default function ArticleReader({ article }: ArticleReaderProps) {
  return (
    <article className="w-full">
      {/* ── Top Hero & Metadata ────────────────────────────────────────── */}
      <Section
        tone="hero"
        pad="none"
        className="pt-[calc(96px+clamp(2.5rem,5vw,4.5rem))] pb-12 md:pb-16"
      >
        <div className="mx-auto max-w-[840px] px-6 md:px-10">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between gap-4 pb-8 border-b border-[var(--rule)]">
            <Link
              href="/insights"
              className="group inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--on-surface)] transition-colors"
            >
              <span className="text-[var(--accent)] transition-transform group-hover:-translate-x-1">
                ←
              </span>
              <MonoLabel className="group-hover:text-[var(--on-surface)]">
                Back to Insights
              </MonoLabel>
            </Link>

            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-vivid)]" aria-hidden />
              <MonoLabel className="text-[var(--accent)]">
                Day {article.day} · {article.status}
              </MonoLabel>
            </div>
          </div>

          {/* Metadata Specs Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-[var(--muted)]">
            <MonoLabel>{article.formattedDate}</MonoLabel>
            <span className="h-3 w-px bg-[var(--rule-strong)]" aria-hidden />
            <MonoLabel>{article.wordCount} words</MonoLabel>
            <span className="h-3 w-px bg-[var(--rule-strong)]" aria-hidden />
            <MonoLabel>{article.readTime}</MonoLabel>
            <span className="h-3 w-px bg-[var(--rule-strong)]" aria-hidden />
            <MonoLabel className="text-[var(--accent)]">{article.topic}</MonoLabel>
          </div>

          {/* Headline */}
          <h1 className="font-display-xl mt-6 text-[clamp(2.1rem,4.5vw,3.6rem)] leading-[1.12] text-[var(--on-surface)] tracking-tight">
            {article.title}
          </h1>
        </div>
      </Section>

      {/* ── Main Editorial Body ───────────────────────────────────────── */}
      <Section tone="base" pad="none" className="py-12 md:py-20" seam>
        <div className="mx-auto max-w-[760px] px-6 md:px-8">
          {/* Introductory Narrative */}
          <div className="space-y-6 text-[1.0625rem] md:text-[1.125rem] leading-[1.8] text-[var(--on-surface)] font-normal">
            {article.intro.map((p, idx) => {
              if (idx === 0) {
                return (
                  <p
                    key={idx}
                    className="font-body-lead text-[1.2rem] md:text-[1.28rem] leading-[1.7] text-[var(--on-surface)] font-medium"
                  >
                    {p}
                  </p>
                );
              }
              if (p === 'This quarter has been different.' || p === 'They do not.') {
                return (
                  <p
                    key={idx}
                    className="font-display-sm text-[1.35rem] leading-tight text-[var(--accent)] py-1 font-semibold"
                  >
                    {p}
                  </p>
                );
              }
              return <p key={idx}>{p}</p>;
            })}
          </div>

          {/* Sections */}
          <div className="mt-16 space-y-20">
            {article.sections.map((section) => (
              <section key={section.index} className="scroll-mt-28">
                {/* Section Index Rule */}
                <SectionRule
                  index={section.index}
                  label={section.heading}
                  coordinate="SIV · DISPATCH"
                  className="mb-8"
                />

                <h2 className="font-display-md text-[clamp(1.65rem,3.2vw,2.3rem)] leading-[1.2] text-[var(--on-surface)] mb-8">
                  {section.heading}
                </h2>

                {/* Section paragraphs */}
                <div className="space-y-6 text-[1.0625rem] md:text-[1.125rem] leading-[1.8] text-[var(--on-surface)]">
                  {section.paragraphs.map((p, pIdx) => {
                    if (p === 'The framing is almost always wrong.') {
                      return (
                        <p
                          key={pIdx}
                          className="font-display-sm text-[1.3rem] leading-snug text-[var(--accent)] py-1 font-semibold"
                        >
                          {p}
                        </p>
                      );
                    }
                    return <p key={pIdx}>{p}</p>;
                  })}
                </div>

                {/* Component Architecture Blocks if present (Section 02) */}
                {section.components && section.components.length > 0 && (
                  <div className="mt-10 space-y-6">
                    {section.components.map((comp, cIdx) => (
                      <div
                        key={cIdx}
                        className="relative rounded-lg border border-[var(--rule-strong)] bg-[var(--surface)] p-6 md:p-8 transition-colors hover:border-[var(--accent-ring)]"
                      >
                        <CornerBrackets size={8} />
                        <div className="flex items-center gap-3 mb-4">
                          <span className="font-label text-[11px] text-[var(--accent)]">
                            LAYER 0{cIdx + 1}
                          </span>
                          <span className="h-px flex-1 bg-[var(--rule)]" aria-hidden />
                        </div>
                        <h3 className="font-display-sm text-[1.25rem] text-[var(--on-surface)] mb-4 font-semibold">
                          {comp.leadBold}
                        </h3>
                        <div className="space-y-4 text-[1rem] md:text-[1.0625rem] leading-[1.75] text-[var(--on-surface)]/90">
                          {comp.body.map((bText, bIdx) => (
                            <p key={bIdx}>{bText}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Diagnostic Callout Card if Section 05 */}
                {section.index === '05' && (
                  <div className="mt-10 rounded-lg border-l-4 border-[var(--accent)] bg-[var(--surface-2)] p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-label text-xs tracking-wider text-[var(--accent)] font-semibold">
                        ACTIONABLE TAKEAWAY
                      </span>
                    </div>
                    <p className="font-display-sm text-[1.15rem] leading-relaxed text-[var(--on-surface)]">
                      Streaks end. Systems do not have to.
                    </p>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Canonical note and publication source */}
          <div className="mt-20 pt-8 border-t border-[var(--rule)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="font-label text-xs text-[var(--muted)]">
              {article.footerNote}
            </p>
            <MonoLabel className="text-[var(--accent)]">
              CANONICAL · {article.slug}
            </MonoLabel>
          </div>

          {/* Next Steps CTA Band */}
          <div className="mt-12 rounded-xl border border-[var(--rule-strong)] bg-[var(--surface)] p-8 md:p-10 relative overflow-hidden">
            <CornerBrackets size={10} />
            <MonoLabel className="text-[var(--accent)]">Next Step</MonoLabel>
            <h3 className="font-display-md text-[1.6rem] md:text-[2rem] text-[var(--on-surface)] mt-3 mb-4">
              Ready to replace streak-dependency with a scalable pipeline?
            </h3>
            <p className="text-[1.05rem] leading-relaxed text-[var(--muted)] max-w-[54ch] mb-8">
              Explore the framework architecture or book a consultation to map the exact content
              and outreach system for your firm.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-[var(--accent-vivid)] px-6 py-3 text-sm font-medium text-[var(--on-accent)] transition-opacity hover:opacity-90"
              >
                Book a Consultation →
              </Link>
              <Link
                href="/#framework"
                className="inline-flex items-center justify-center rounded-lg border border-[var(--rule-strong)] bg-[var(--surface-2)] px-6 py-3 text-sm font-medium text-[var(--on-surface)] transition-colors hover:bg-[var(--surface)]"
              >
                Explore The Framework
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </article>
  );
}
