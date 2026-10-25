"use client";

/**
 * INSIGHTS INDEX — the article directory.
 * ---------------------------------------------------------------------------
 * A quiet journal: a publication header, one featured article set as an
 * editorial spread, and a hairline archive beneath it. The articles are the
 * product; this page exists for discovery. If every animation were removed
 * the page would still hold together — the composition is type, hierarchy
 * and spacing, not motion.
 *
 * ── RULES THAT HOLD HERE ────────────────────────────────────────────────────
 *
 *  NO CARDS. No rounded rectangles, shadows, hover lifts or glass. An entry
 *  is a headline, a date and a hairline — the box is what filler looks like.
 *
 *  THE FEATURED ARTICLE IS ALSO IN THE ARCHIVE. The featured spread is a
 *  lens on the newest (or pinned) piece; the archive below is the complete
 *  directory. One must not silently hide the other.
 *
 *  THE FILTER RENDERS ONLY WHEN IT FILTERS. The topic filter is built from
 *  the real categories in the collection and activates automatically the
 *  moment a second category exists. With one category it would be a control
 *  that controls nothing, so it is not rendered.
 *
 *  NOTHING INVENTED. Headlines, excerpts, dates, categories and reading
 *  times all come out of content/insights.ts (reading time derived from
 *  word count there). The only strings authored here are the sanctioned
 *  interface labels: the "Insights" masthead, the owner-approved index
 *  description passed in as a prop, "All articles", "Read article" and the
 *  "min read" unit.
 *
 * ── HYDRATION ───────────────────────────────────────────────────────────────
 * The reduced-motion preference reaches the transition duration only. It
 * never reaches the rendered tree or an initial style: both are serialised
 * into the SSR HTML, so branching either on useReducedMotion makes the first
 * client render disagree with the server.
 */

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Section } from "@/components/Section";
import {
  getCategories,
  getFeaturedArticle,
  getReadingTime,
  type InsightArticle,
} from "@/content/insights";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Long headlines stack; short ones may sit beside a measure of metadata. */
const STACKED_HEADLINE = 64;

export default function InsightsIndex({
  articles,
  description,
}: {
  articles: InsightArticle[];
  description: string;
}) {
  const still = !!useReducedMotion();

  const rise: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: still ? { duration: 0 } : { duration: 0.55, ease: EASE },
    },
  };

  const featured = getFeaturedArticle();
  const categories = getCategories(articles);

  /* Topic-filter plumbing. `active` stays null (All) until the reader picks
     a category; the control itself renders only when there is more than one
     category to choose between. */
  const [active, setActive] = useState<string | null>(null);
  const visible = active
    ? articles.filter((article) => article.category === active)
    : articles;

  return (
    <MotionConfig reducedMotion="user">
      <Section
        tone="base"
        pad="none"
        className="insights-paper pt-[calc(96px+clamp(2.5rem,5vw,4.5rem))] pb-24 md:pb-32"
      >
        <div className="mx-auto max-w-[68rem] px-6 md:px-10">
          {/* ── Publication header ─────────────────────────────────────── */}
          <motion.header variants={rise} initial="hidden" animate="show">
            <h1 className="font-display-xl text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02] tracking-tight text-[var(--on-surface)]">
              Insights
            </h1>
            <p className="mt-6 max-w-[42rem] text-[1.0625rem] leading-[1.7] text-[var(--muted)] md:text-[1.125rem]">
              {description}
            </p>
            <div
              aria-hidden="true"
              className="mt-12 h-px w-full"
              style={{ background: "var(--rule)" }}
            />
          </motion.header>

          {/* ── Featured article ───────────────────────────────────────── */}
          {featured && (
            <FeaturedSpread article={featured} variants={rise} />
          )}

          {/* ── Archive ────────────────────────────────────────────────── */}
          <motion.section
            aria-labelledby="insights-archive"
            className="mt-20 md:mt-28"
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2
                id="insights-archive"
                className="font-display-md text-[clamp(1.4rem,2.4vw,1.9rem)] leading-tight text-[var(--on-surface)]"
              >
                All articles
              </h2>

              {/* The topic filter — only when there is a real choice. */}
              {categories.length >= 2 && (
                <nav aria-label="Filter articles by topic">
                  <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                    <li>
                      <FilterButton
                        label="All"
                        current={active === null}
                        onSelect={() => setActive(null)}
                      />
                    </li>
                    {categories.map((category) => (
                      <li key={category}>
                        <FilterButton
                          label={category}
                          current={active === category}
                          onSelect={() => setActive(category)}
                        />
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>

            {/* The featured article appears here too: the spread above is a
                lens on one piece, this list is the whole directory. */}
            <ul
              className="mt-8 border-t md:mt-10"
              style={{ borderColor: "var(--rule)" }}
            >
              {visible.map((article) => (
                <ArchiveEntry
                  key={article.slug}
                  article={article}
                  variants={rise}
                />
              ))}
            </ul>
          </motion.section>
        </div>
      </Section>
    </MotionConfig>
  );
}

/* ─── The featured spread ─────────────────────────────────────────────────── */
function FeaturedSpread({
  article,
  variants,
}: {
  article: InsightArticle;
  variants: Variants;
}) {
  const href = `/insights/${article.slug}`;
  const stacked = article.title.length > STACKED_HEADLINE;

  return (
    <motion.article
      aria-label={article.title}
      className="pt-16 md:pt-24"
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <ArticleMeta article={article} />

      <div
        className={
          stacked
            ? "mt-8"
            : "mt-8 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:gap-16"
        }
      >
        <h2 className="font-display-xl text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.08] tracking-tight text-[var(--on-surface)]">
          <Link
            href={href}
            className="outline-none transition-colors duration-300 hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--scaffold-bg)]"
          >
            {article.title}
          </Link>
        </h2>

        <div className={stacked ? "mt-8 max-w-[42rem]" : "self-end"}>
          <p className="text-[1.0625rem] leading-[1.75] text-[var(--muted)] md:text-[1.125rem]">
            {article.excerpt}
          </p>
          <div className="mt-8">
            <ReadArticleLink href={href} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── One archive entry ───────────────────────────────────────────────────── */
function ArchiveEntry({
  article,
  variants,
}: {
  article: InsightArticle;
  variants: Variants;
}) {
  const href = `/insights/${article.slug}`;

  return (
    <motion.li
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="border-b"
      style={{ borderColor: "var(--rule)" }}
    >
      <article className="grid gap-3 py-8 md:grid-cols-[11rem_minmax(0,1fr)_auto] md:gap-10 md:py-10">
        {/* Left column — date and category, mono, muted. */}
        <div className="flex items-baseline gap-3 md:flex-col md:gap-1.5">
          <time
            dateTime={article.date}
            className="font-label text-[var(--muted)]"
          >
            {article.formattedDate}
          </time>
          <span className="font-label text-[var(--muted)]">
            <span
              aria-hidden="true"
              className="mr-1.5 inline-block h-[0.45em] w-[0.45em] rounded-full align-baseline"
              style={{ background: "var(--accent)" }}
            />
            {article.category}
          </span>
        </div>

        {/* Main column — the headline is the dominant element. */}
        <div className="min-w-0">
          <h3 className="font-display-md text-[clamp(1.35rem,2.6vw,1.85rem)] leading-[1.15] tracking-tight text-[var(--on-surface)]">
            <Link
              href={href}
              className="outline-none transition-colors duration-300 hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--scaffold-bg)]"
            >
              {article.title}
            </Link>
          </h3>
          <p className="mt-3 max-w-[46rem] text-[0.9375rem] leading-[1.65] text-[var(--muted)]">
            {article.excerpt}
          </p>
        </div>

        {/* Right column — reading time and a quiet directional mark. */}
        <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-1.5">
          <span className="font-label text-[var(--muted)]">
            {getReadingTime(article)} min read
          </span>
          <span
            aria-hidden="true"
            className="font-label text-[var(--faint)] md:mt-2"
          >
            →
          </span>
        </div>
      </article>
    </motion.li>
  );
}

/* ─── Shared small parts ──────────────────────────────────────────────────── */

/** Category · date · reading time, in one muted mono line. */
function ArticleMeta({ article }: { article: InsightArticle }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 font-label text-[var(--muted)]">
      <span style={{ color: "var(--accent)" }}>{article.category}</span>
      <span aria-hidden="true" className="text-[var(--faint)]">
        /
      </span>
      <time dateTime={article.date}>{article.formattedDate}</time>
      <span aria-hidden="true" className="text-[var(--faint)]">
        /
      </span>
      <span>{getReadingTime(article)} min read</span>
    </p>
  );
}

/** The one sanctioned call to action: text, a small arrow, a quiet hover. */
function ReadArticleLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      data-testid="insight-card"
      className="group inline-flex items-baseline gap-2 font-label text-[var(--on-surface)] outline-none transition-colors duration-300 hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--scaffold-bg)]"
    >
      Read article
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
        style={{ color: "var(--accent)" }}
      >
        →
      </span>
    </Link>
  );
}

function FilterButton({
  label,
  current,
  onSelect,
}: {
  label: string;
  current: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={current}
      className="font-label outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--scaffold-bg)]"
      style={{ color: current ? "var(--accent)" : "var(--muted)" }}
    >
      {label}
    </button>
  );
}
