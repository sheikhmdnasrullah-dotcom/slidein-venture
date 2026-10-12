'use client';

import Link from 'next/link';
import { Section } from '@/components/Section';
import { MonoLabel } from '@/components/System/System';
import type { InsightArticle } from '@/content/insights';

interface ArticleReaderProps {
  article: InsightArticle;
}

export default function ArticleReader({ article }: ArticleReaderProps) {
  return (
    <article className="w-full">
      {/* ── Article Header ─────────────────────────────────────────────── */}
      <Section
        tone="hero"
        pad="none"
        className="pt-[calc(96px+clamp(2.5rem,5vw,4.5rem))] pb-12 md:pb-16"
      >
        <div className="mx-auto max-w-[840px] px-6 md:px-10">
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

          {/* Date & Topic */}
          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
            <span>{article.formattedDate}</span>
            <span aria-hidden>·</span>
            <span className="text-[var(--accent)]">{article.topic}</span>
          </div>

          {/* Headline */}
          <h1 className="font-display-xl mt-6 text-[clamp(2.1rem,4.5vw,3.6rem)] leading-[1.12] text-[var(--on-surface)] tracking-tight">
            {article.title}
          </h1>
        </div>
      </Section>

      {/* ── Article Body ───────────────────────────────────────────────── */}
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

                {/* Component Architecture Blocks if present */}
                {section.components && section.components.length > 0 && (
                  <div className="mt-10 space-y-10">
                    {section.components.map((comp, cIdx) => (
                      <div key={cIdx}>
                        <p className="font-display-sm text-[1.2rem] leading-snug text-[var(--on-surface)] mb-4 font-semibold">
                          {comp.leadBold}
                        </p>
                        <div className="space-y-4 text-[1rem] md:text-[1.0625rem] leading-[1.75] text-[var(--on-surface)]/90">
                          {comp.body.map((bText, bIdx) => (
                            <p key={bIdx}>{bText}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </Section>
    </article>
  );
}
