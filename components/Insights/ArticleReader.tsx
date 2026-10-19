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
import type { InsightArticle } from "@/content/insights";

interface ArticleReaderProps {
  article: InsightArticle;
}

/** One paragraph entry: either plain copy or an authored pull-quote. */
type Para = string | { pull: true; text: string };

const isPull = (p: Para): p is { pull: true; text: string } =>
  typeof p !== "string" && p.pull === true;
const textOf = (p: Para) => (typeof p === "string" ? p : p.text);

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ArticleReader({ article }: ArticleReaderProps) {
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
          <div className="mx-auto max-w-[840px] px-6 md:px-10">
            <motion.div variants={block} initial="hidden" animate="show">
              <Link
                href="/insights"
                className="group inline-flex items-center gap-2 text-[var(--muted)] transition-colors hover:text-[var(--on-surface)]"
              >
                <span
                  className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
                  style={{ color: "var(--accent)" }}
                  aria-hidden="true"
                >
                  ←
                </span>
                <MonoLabel className="transition-colors group-hover:text-[var(--on-surface)]">
                  Back to Insights
                </MonoLabel>
              </Link>

              {/* The tagline only. No date line: the owner asked for the
                  tagline and the article, and a date is neither. The
                  formattedDate field stays in the content file — it is the
                  article's to publish when it wants to be published. */}
              <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
                <span style={{ color: "var(--accent)" }}>{article.topic}</span>
              </div>

              <h1 className="font-display-xl mt-6 text-[clamp(2.1rem,4.5vw,3.6rem)] leading-[1.12] tracking-tight text-[var(--on-surface)]">
                {article.title}
              </h1>
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
          <div className="mx-auto max-w-[760px] px-6 md:px-8">
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
