"use client";

/**
 * TERMS DOCUMENT — the bilingual reader for /terms.
 * ---------------------------------------------------------------------------
 * One structure, two languages. The toggle swaps the text from
 * content/terms.ts and nothing else: same sections, same order, same anchors,
 * so a link to /terms#fees lands on the same clause in either language.
 *
 * English is the server-rendered default (and what a crawler sees). The
 * chosen language is remembered in the browser, restored after hydration, and
 * can be forced with /terms?lang=bn so the Bengali version can be linked
 * directly. The content wrapper carries lang="bn" when Bengali is showing, so
 * screen readers pick the right voice and the browser picks a Bengali font.
 */

import { useSyncExternalStore } from "react";
import { Section } from "@/components/Section";
import { TERMS, type TermsLang } from "@/content/terms";

const LANGS: TermsLang[] = ["en", "bn"];
const STORAGE_KEY = "sv-terms-lang";
const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function pad(n: number, lang: TermsLang) {
  const s = String(n).padStart(2, "0");
  return lang === "bn" ? s.replace(/\d/g, (d) => BN_DIGITS[Number(d)]) : s;
}

function isLang(v: unknown): v is TermsLang {
  return v === "en" || v === "bn";
}

/* A tiny external store: the language lives in the URL (?lang=) or in
   localStorage, never in React state, so it can be read after hydration without
   an effect. The server snapshot is always English, so the first client render
   matches the server HTML. */
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function readLang(): TermsLang {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (isLang(q)) return q;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* storage can be blocked; English is a fine default */
  }
  return "en";
}

let chosen: TermsLang | null = null;
const getSnapshot = (): TermsLang => chosen ?? readLang();
const getServerSnapshot = (): TermsLang => "en";

function choose(next: TermsLang) {
  chosen = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export default function TermsDocument() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const t = TERMS[lang];

  return (
    <Section
      tone="base"
      pad="none"
      className="pt-[calc(96px+clamp(2.5rem,5vw,4.5rem))] pb-24 md:pb-32"
    >
      <div className="mx-auto max-w-[68rem] px-6 md:px-10">
        <div className="terms-doc" lang={t.lang}>
          <header>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="terms-meta text-[0.875rem] text-[var(--muted)]">
                {t.updatedLabel}: <time>{t.updated}</time>
              </p>

              <div
                role="group"
                aria-label={`${TERMS.en.toggleLabel} / ${TERMS.bn.toggleLabel}`}
                className="inline-flex rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] p-1"
              >
                {LANGS.map((code) => {
                  const active = code === lang;
                  return (
                    <button
                      key={code}
                      type="button"
                      lang={TERMS[code].lang}
                      aria-pressed={active}
                      onClick={() => choose(code)}
                      className={
                        "min-h-[40px] min-w-[88px] rounded-full px-4 text-[0.9375rem] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] " +
                        (active
                          ? "bg-[var(--on-surface)] text-[var(--surface)]"
                          : "text-[var(--muted)] hover:text-[var(--on-surface)]")
                      }
                    >
                      {TERMS[code].label}
                    </button>
                  );
                })}
              </div>
            </div>

            <h1 className="font-display-xl mt-10 text-[clamp(2.5rem,6.5vw,5rem)] leading-[1.08] tracking-tight text-[var(--on-surface)]">
              {t.title}
            </h1>
            <p className="mt-6 max-w-[44rem] text-[1.0625rem] leading-[1.75] text-[var(--muted)] md:text-[1.125rem]">
              {t.intro}
            </p>
            <div
              aria-hidden="true"
              className="mt-12 h-px w-full"
              style={{ background: "var(--rule)" }}
            />
          </header>

          <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-16">
            <nav aria-label={t.tocLabel} className="md:sticky md:top-28 md:self-start">
              <p className="text-[0.8125rem] uppercase tracking-[0.06em] text-[var(--muted)]">
                {t.tocLabel}
              </p>
              <ol className="mt-4 flex flex-col gap-2.5">
                {t.sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="group flex gap-3 text-[0.9375rem] leading-snug text-[var(--muted)] underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:text-[var(--on-surface)] hover:decoration-current focus-visible:text-[var(--on-surface)] focus-visible:decoration-current"
                    >
                      <span className="tabular-nums text-[var(--faint)] group-hover:text-[var(--accent)]">
                        {pad(i + 1, lang)}
                      </span>
                      <span>{s.heading}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className="min-w-0">
              {t.sections.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  aria-labelledby={`${s.id}-h`}
                  className="scroll-mt-28 border-t border-[var(--rule)] py-10 first:border-t-0 first:pt-0 md:py-12"
                >
                  <h2
                    id={`${s.id}-h`}
                    className="font-display-md flex items-baseline gap-4 text-[clamp(1.4rem,2.4vw,1.9rem)] leading-tight text-[var(--on-surface)]"
                  >
                    <span className="tabular-nums text-[var(--accent)] text-[0.7em]">
                      {pad(i + 1, lang)}
                    </span>
                    <span>{s.heading}</span>
                  </h2>

                  <div className="mt-5 max-w-[42rem] space-y-4 text-[1.0625rem] leading-[1.8] text-[var(--on-surface)]">
                    {s.body?.map((p, j) => (
                      <p key={`b${j}`}>{p}</p>
                    ))}
                    {s.items && (
                      <ul className="space-y-3 pl-5 [list-style:disc] marker:text-[var(--accent-vivid)]">
                        {s.items.map((item, j) => (
                          <li key={j} className="pl-1">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {s.after?.map((p, j) => (
                      <p key={`a${j}`}>{p}</p>
                    ))}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </div>
      </div>
    </Section>
  );
}
