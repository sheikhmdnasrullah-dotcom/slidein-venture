"use client";

/**
 * ARTICLE READER — long-form, read properly.
 * ---------------------------------------------------------------------------
 * Presentation only. Every word on this page comes from content/insights.ts;
 * nothing is written, summarised or generated here.
 *
 * Three things this reader does that a plain <article> does not, all of them
 * presentation rather than content:
 *
 *  1. PULL-QUOTES FROM DATA, NOT FROM STRING MATCHING. A paragraph renders
 *     in accent when its entry carries `pull: true`. The previous version
 *     compared the paragraph against three hard-coded literals, so one word
 *     of copy edits would silently drop the emphasis. Copy stays copy.
 *
 *  2. THE SECTION INDEX IS THE OWNER'S DATA. `section.index` ("01".."05") is
 *     authored in the content file and the reader was dropping it on the
 *     floor. It is now rendered as a quiet mono marker beside each heading.
 *
 *  3. READING PROGRESS + A QUIET REVEAL. A 6000px article with no sense of
 *     how far in you are is hard to navigate. The progress rule is one fixed
 *     hairline under the nav, driven by one scroll listener, and it adds no
 *     words. Blocks rise 12px as they enter, matching the entrance language
 *     already used across the site.
 *
 * Under prefers-reduced-motion the progress bar still tracks scroll (it is
 * information, not decoration) and every reveal resolves to its end state.
 */

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion";
import { Section } from "@/components/Section";
import { MonoLabel } from "@/components/System/System";
import {
  getAuthor,
  getReadingTime,
  type InsightArticle,
} from "@/content/insights";

interface ArticleReaderProps {
  article: InsightArticle;
  /**
   * The next article to point to at the foot of the page. Wired but empty
   * on purpose: the page passes the newest published article that is not
   * this one, and when none exists (today) nothing is rendered — no fake
   * forward link.
   */
  nextArticle?: InsightArticle;
}

/** One paragraph entry: either plain copy or an authored pull-quote. */
type Para = string | { pull: true; text: string };

const isPull = (p: Para): p is { pull: true; text: string } =>
  typeof p !== "string" && p.pull === true;
const textOf = (p: Para) => (typeof p === "string" ? p : p.text);

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ArticleReader({
  article,
  nextArticle,
}: ArticleReaderProps) {
  const still = !!useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  /* One scroll listener for the whole article. */
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
  });

  /* HYDRATION: the reduced-motion preference must not reach the TREE or the
     INITIAL state. Both are serialised into the SSR HTML; only transitions
     are not. Branching either one on `useReducedMotion()` means the server
     can emit markup the first client render disagrees with — which is
     exactly the mismatch this produced. So `hidden` is one fixed value and
     the preference only ever reaches `transition`. */
  const block: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: still ? { duration: 0 } : { duration: 0.55, ease: EASE },
    },
  };

  return (
    <div ref={rootRef}>
      {/* ── Reading progress: one hairline, no words ──────────────────────────
          Rendered UNCONDITIONALLY. A reduced-motion reader still gets it,
          because it carries information rather than decorating anything —
          and because branching on the preference here is what forked the
          markup between server and client. */}
      <motion.div
        aria-hidden="true"
        className="fixed left-0 top-[72px] z-[1001] h-[2px] w-full origin-left"
        style={{
          scaleX: progress,
          background: "var(--accent)",
        }}
      />

      <article className="w-full">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <Section
          tone="hero"
          pad="none"
          className="insights-paper pt-[calc(96px+clamp(2.5rem,5vw,4.5rem))] pb-12 md:pb-16"
        >
          <div className="mx-auto max-w-[42rem] px-6 md:px-10">
            <motion.div variants={block} initial="hidden" animate="show">
              <Link
                href="/insights"
                className="group inline-flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--scaffold-bg)]"
              >
                <span
                  className="inline-block text-[var(--muted)] transition-transform duration-200 group-hover:-translate-x-1"
                  aria-hidden="true"
                >
                  ←
                </span>
                <MonoLabel className="transition-colors group-hover:text-[var(--on-surface)]">
                  All insights
                </MonoLabel>
              </Link>

              {/* Publication metadata: category, dates, reading time, byline.
                  Every value is derived in the content file; the "Updated"
                  line renders only when the article carries an updatedAt. */}
              <p className="mt-12 flex flex-wrap items-baseline gap-x-4 gap-y-1.5 font-label text-[var(--muted)]">
                <span style={{ color: "var(--accent)" }}>
                  {article.category}
                </span>
                <span aria-hidden="true" className="text-[var(--faint)]">
                  /
                </span>
                <span>
                  By {getAuthor(article)}
                </span>
                <span aria-hidden="true" className="text-[var(--faint)]">
                  /
                </span>
                <time dateTime={article.date}>{article.formattedDate}</time>
                {article.updatedAt && (
                  <>
                    <span aria-hidden="true" className="text-[var(--faint)]">
                      /
                    </span>
                    <time dateTime={article.updatedAt}>
                      Updated {article.updatedAt}
                    </time>
                  </>
                )}
                <span aria-hidden="true" className="text-[var(--faint)]">
                  /
                </span>
                <span>{getReadingTime(article)} min read</span>
              </p>

              <h1 className="font-display-xl mt-8 text-[clamp(2.1rem,4.5vw,3.4rem)] leading-[1.12] tracking-tight text-[var(--on-surface)]">
                {article.title}
              </h1>

              {/* The article's own topic line, set as a quiet standfirst. */}
              <p className="mt-8 text-[1.0625rem] leading-[1.7] text-[var(--muted)] md:text-[1.125rem]">
                {article.topic}
              </p>
            </motion.div>
          </div>
        </Section>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <Section
          tone="base"
          pad="none"
          className="insights-paper py-12 md:py-20"
          seam
        >
          <div className="mx-auto max-w-[42rem] px-6 md:px-10">
            <div className="space-y-6 text-[1.0625rem] leading-[1.8] text-[var(--on-surface)] md:text-[1.125rem]">
              {article.intro.map((p, i) => {
                if (i === 0) {
                  return (
                    <Reveal key={i} variants={block}>
                      <p className="font-body-lead text-[1.2rem] font-medium leading-[1.7] text-[var(--on-surface)] md:text-[1.28rem]">
                        {textOf(p)}
                      </p>
                    </Reveal>
                  );
                }
                if (isPull(p)) {
                  return (
                    <Reveal key={i} variants={block}>
                      <p
                        className="font-display-sm py-1 text-[1.35rem] font-semibold leading-tight"
                        style={{ color: "var(--accent)" }}
                      >
                        {p.text}
                      </p>
                    </Reveal>
                  );
                }
                return (
                  <Reveal key={i} variants={block}>
                    <p>{textOf(p)}</p>
                  </Reveal>
                );
              })}
            </div>

            <div className="mt-16 space-y-20">
              {article.sections.map((section, si) => (
                <motion.section
                  key={section.index}
                  id={section.index}
                  className="scroll-mt-28"
                  variants={block}
                  initial="hidden"
                  whileInView="show"
                  viewport={{
                    once: true,
                    amount: 0.12,
                    margin: "0px 0px -12% 0px",
                  }}
                >
                  {/* The owner's section index, rendered as a quiet marker. */}
                  <div className="mb-4 flex items-baseline gap-4">
                    <span
                      aria-hidden="true"
                      className="font-mono text-[0.75rem] tabular-nums"
                      style={{ color: "var(--accent)" }}
                    >
                      {section.index}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1"
                      style={{ background: "var(--rule)" }}
                    />
                  </div>

                  <h2 className="font-display-md mb-8 text-[clamp(1.65rem,3.2vw,2.3rem)] leading-[1.2] text-[var(--on-surface)]">
                    {section.heading}
                  </h2>

                  <div className="space-y-6 text-[1.0625rem] leading-[1.8] text-[var(--on-surface)] md:text-[1.125rem]">
                    {section.paragraphs.map((p, pIdx) => {
                      if (isPull(p)) {
                        return (
                          <p
                            key={pIdx}
                            className="font-display-sm py-1 text-[1.3rem] font-semibold leading-snug"
                            style={{ color: "var(--accent)" }}
                          >
                            {p.text}
                          </p>
                        );
                      }
                      return <p key={pIdx}>{textOf(p)}</p>;
                    })}
                  </div>

                  {section.components && section.components.length > 0 && (
                    <div className="mt-10 space-y-10">
                      {section.components.map((comp, cIdx) => (
                        <div key={cIdx}>
                          <p className="font-display-sm mb-4 text-[1.2rem] font-semibold leading-snug text-[var(--on-surface)]">
                            {comp.leadBold}
                          </p>
                          <div className="space-y-4 text-[1rem] leading-[1.75] text-[var(--on-surface)]/90 md:text-[1.0625rem]">
                            {comp.body.map((bText, bIdx) => (
                              <p key={bIdx}>{bText}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Spacing so the last block is not flush with the seam. */}
                  {si === article.sections.length - 1 && (
                    <div aria-hidden className="h-px" />
                  )}
                </motion.section>
              ))}

              {/* ── End of article ─────────────────────────────────────────
                  The return link is always there. The forward link is not:
                  nextArticle is wired, but with a single published article
                  it is undefined and this block renders nothing rather than
                  a fake "next" suggestion. */}
              <footer className="mt-16 border-t pt-10 md:mt-20" style={{ borderColor: "var(--rule)" }}>
                <nav aria-label="Article navigation">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-baseline sm:justify-between">
                    <Link
                      href="/insights"
                      className="group inline-flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--scaffold-bg)]"
                    >
                      <span
                        aria-hidden="true"
                        className="inline-block text-[var(--muted)] transition-transform duration-200 group-hover:-translate-x-1"
                      >
                        ←
                      </span>
                      <MonoLabel className="transition-colors group-hover:text-[var(--on-surface)]">
                        All insights
                      </MonoLabel>
                    </Link>

                    {nextArticle && (
                      <Link
                        href={`/insights/${nextArticle.slug}`}
                        className="group inline-flex items-baseline gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--scaffold-bg)]"
                      >
                        <MonoLabel className="transition-colors group-hover:text-[var(--on-surface)]">
                          Next: {nextArticle.title}
                        </MonoLabel>
                        <span
                          aria-hidden="true"
                          className="inline-block text-[var(--muted)] transition-transform duration-200 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </Link>
                    )}
                  </div>
                </nav>
              </footer>
            </div>
          </div>
        </Section>
      </article>
    </div>
  );
}

/** One reveal wrapper. Kept separate so the variant object is shared. */
function Reveal({
  children,
  variants,
}: {
  children: React.ReactNode;
  variants: Variants;
}) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35, margin: "0px 0px -8% 0px" }}
    >
      {children}
    </motion.div>
  );
}
