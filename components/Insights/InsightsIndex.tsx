"use client";

/**
 * INSIGHTS INDEX — an editorial masthead, not a card grid.
 * ---------------------------------------------------------------------------
 * WHY NOT A CARD GRID
 * A one-item directory rendered as a rounded box with a shadow, an arrow and
 * a hover lift is the shape every content list defaults to, and it is the
 * shape that reads as filler: the box says "item" without saying anything
 * about what the item IS. So there is no box.
 *
 * What is here instead is the article's own front page, built from the
 * article's own words: the topic line as a masthead eyebrow, the headline
 * set as a masthead, the opening paragraph as a standfirst, and the
 * article's own section headings as the contents. Every string is read out
 * of the article object — the headings are the article's headings, not a
 * navigation menu written for the page.
 *
 * ── NOTHING INVENTED ────────────────────────────────────────────────────────
 * There is no page heading, no date, no "read more", no category label, no
 * byline, no reading time, no count of anything. None of those strings exist
 * in content/insights.ts, so writing them here would put words on the site
 * that nobody approved. The arrow is a glyph for the same reason.
 *
 * ── HYDRATION ───────────────────────────────────────────────────────────────
 * The reduced-motion preference reaches MotionConfig and the transition
 * duration only. It never reaches the rendered tree or an initial style:
 * both are serialised into the SSR HTML, so branching either on
 * useReducedMotion makes the first client render disagree with the server.
 */

import Link from "next/link";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Section } from "@/components/Section";
import { cn } from "@/lib/utils";
import type { InsightArticle } from "@/content/insights";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function InsightsIndex({
  articles,
}: {
  articles: InsightArticle[];
}) {
  const still = !!useReducedMotion();

  const rise: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: still ? { duration: 0 } : { duration: 0.6, ease: EASE },
    },
  };

  return (
    <MotionConfig reducedMotion="user">
      {articles.map((article, ai) => (
        <Section
          key={article.slug}
          tone={ai === 0 ? "hero" : "base"}
          pad="none"
          className="insights-paper"
        >
          <EditorialEntry
            article={article}
            variants={rise}
            first={ai === 0}
            last={ai === articles.length - 1}
          />
        </Section>
      ))}
    </MotionConfig>
  );
}

/**
 * One article as a front page. With a single article the masthead, the
 * standfirst and the contents all sit in one column; the contents link
 * straight into the article, so the index is a way in rather than a summary.
 */
function EditorialEntry({
  article,
  variants,
  first,
  last,
}: {
  article: InsightArticle;
  variants: Variants;
  first: boolean;
  last: boolean;
}) {
  const href = `/insights/${article.slug}`;

  return (
    <div
      /* Top clearance belongs to the FIRST entry; bottom room to the LAST.
         Driving both off `last` meant that with a single article — which is
         first AND last — the masthead got no top padding at all and ran
         straight under the fixed nav. */
      className={cn(
        "mx-auto max-w-[840px] px-6 md:px-10",
        first && "pt-[calc(96px+clamp(2.5rem,5vw,4.5rem))]",
        last ? "pb-28" : "pb-20",
      )}
    >
      {/* Masthead eyebrow — the article's own topic line. */}
      <motion.p
        variants={variants}
        initial="hidden"
        animate="show"
        style={{
          color: "var(--accent)",
          fontSize: "0.8125rem",
          letterSpacing: "0.08em",
        }}
      >
        {article.topic}
      </motion.p>

      {/* Masthead — the headline, unedited, at display scale. */}
      <motion.h1
        variants={variants}
        initial="hidden"
        animate="show"
        transition={undefined}
        className="font-display-xl mt-6 text-[clamp(2.1rem,5.2vw,4rem)] leading-[1.06] tracking-tight text-[var(--on-surface)]"
      >
        {article.title}
      </motion.h1>

      {/* The accent rule: one hairline that opens out to the full measure. */}
      <motion.div
        variants={variants}
        initial="hidden"
        animate="show"
        aria-hidden="true"
        className="mt-10 h-px w-full origin-left"
        style={{ background: "var(--rule)" }}
      />

      <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
        {/* Standfirst — the article's own opening words. */}
        <motion.div
          variants={variants}
          initial="hidden"
          animate="show"
          className="min-w-0 space-y-5 text-[1.0625rem] leading-[1.75] text-[var(--on-surface)] md:text-[1.125rem]"
        >
          {article.intro.slice(0, 3).map((p, i) => (
            <p
              key={i}
              className={
                i === 0 ? "text-[var(--on-surface)]" : "text-[var(--muted)]"
              }
            >
              {typeof p === "string" ? p : p.text}
            </p>
          ))}
        </motion.div>

        {/* Contents — the article's OWN section headings and indices. */}
        <motion.nav
          variants={variants}
          initial="hidden"
          animate="show"
          aria-hidden="true"
          className="md:w-[248px] md:shrink-0"
        >
          <ol className="flex flex-col gap-3.5">
            {article.sections.map((section) => (
              <li key={section.index}>
                <Link
                  href={`${href}#${section.index}`}
                  tabIndex={-1}
                  data-testid="insight-toc"
                  className="group flex items-baseline gap-3 outline-none"
                >
                  <span
                    className="font-mono text-[0.6875rem] tabular-nums"
                    style={{ color: "var(--accent)" }}
                  >
                    {section.index}
                  </span>
                  <span className="text-[0.9375rem] leading-snug text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--on-surface)]">
                    {section.heading}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </motion.nav>
      </div>

      {/* The single affordance: an arrow glyph, not a label. */}
      <motion.div
        variants={variants}
        initial="hidden"
        animate="show"
        className="mt-12"
      >
        <Link
          href={href}
          data-testid="insight-card"
          className="group inline-flex items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-[color-mix(in_oklch,var(--color-brand)_60%,transparent)] focus-visible:ring-offset-[var(--scaffold-bg)]"
          aria-label={article.title}
        >
          <span
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 group-hover:border-[var(--scaffold-rule)]"
            style={{
              borderColor: "var(--scaffold-hairline)",
              background: "var(--scaffold-accent-row)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3.5 12.5 L12.5 3.5 M12.5 3.5 H6.5 M12.5 3.5 V9.5"
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </svg>
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
