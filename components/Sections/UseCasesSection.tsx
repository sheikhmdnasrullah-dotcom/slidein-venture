'use client';

/**
 * USE CASES: every industry as one tile in a hairline grid. Tapping a tile
 * opens a pop-up holding a five-slide article on a fixed 16:9 stage:
 *   1 Why it fits   2 It reads, then researches   3 It matches need to offer
 *   4 It writes the email (a full mailbox view; every personalized line is
 *     numbered and traced to where it came from)   5 It sends it, safely
 * The stage keeps 16:9 and scales as one piece (all sizes are in container
 * units). On phones the slides stack as readable cards instead.
 *
 * The pop-up is a native <dialog>: focus is trapped, Esc closes it, the
 * backdrop closes it, focus returns to the tile. Arrow keys move between
 * slides. Lenis leaves its scroll alone (data-lenis-prevent).
 */

import { ArrowLeft, ArrowRight, ArrowUpRight, Archive, Check, Forward, Reply, Star, X } from 'lucide-react';
import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import { Band, SectionHeader } from '@/components/Sections/primitives';
import { IndustryGlyph } from '@/components/Sections/IndustryGlyph';
import { BAND_DISORDER } from '@/content/stages';
import {
  SEND_RULES,
  SLIDE_TITLES,
  USE_CASES,
  USE_CASES_TITLE,
  type UseCase,
} from '@/content/useCases';
import { EMAILS, SOURCE_LABELS, emailFooter, type SourceKind } from '@/content/useCaseEmails';

const MUTED = 'var(--dx-muted-foreground)';

/* ── the four slides ─────────────────────────────────────────────────────── */

const v = (n: number) => ({ '--i': n }) as CSSProperties;
const STAT = /^([^\d]*)(\d+(?:\.\d+)?)([^\d]*)$/;

/* The figure counts up when its slide opens. Years and ranges stay as written. */
function CountUp({ stat, active }: { stat: string; active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const m = stat.match(STAT);
    if (!el || !m || !active) return;
    const target = parseFloat(m[2]);
    if (Number.isInteger(target) && target >= 1900 && target <= 2100) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const dec = (m[2].split('.')[1] ?? '').length;
    const t0 = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      el.textContent = `${m[1]}${(target * e).toFixed(dec)}${m[3]}`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = stat;
    };
  }, [active, stat]);
  return <span ref={ref}>{stat}</span>;
}

function SlideWhy({ uc, active = false }: { uc: UseCase; active?: boolean }) {
  return (
    <div className="uc-s uc-s--why">
      <div className="uc-s__main">
        <h3 id="uc-title" className="uc-h1">
          <span style={{ color: MUTED }}>SlideIn for </span>
          {uc.name}
        </h3>
        <p className="uc-lead">{uc.situation}</p>
      </div>
      {uc.fact ? (
        <aside className="uc-fact">
          <p className="uc-fact__stat">
            <CountUp stat={uc.fact.stat} active={active} />
          </p>
          <p className="uc-fact__text">{uc.fact.text}</p>
          <a className="uc-fact__src" href={uc.fact.url} target="_blank" rel="noreferrer">
            {uc.fact.source}
          </a>
        </aside>
      ) : (
        <aside className="uc-fact uc-fact--plain" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none" className="uc-fact__mark">
            <circle cx="60" cy="60" r="46" stroke="oklch(20.5% 0 0 / 0.14)" strokeWidth="1.5" strokeDasharray="3 6" />
            <circle cx="60" cy="60" r="28" stroke="oklch(20.5% 0 0 / 0.5)" strokeWidth="1.5" />
            <circle cx="60" cy="60" r="6" fill="var(--color-brand)" />
          </svg>
        </aside>
      )}
    </div>
  );
}

function SlideRead({ uc }: { uc: UseCase }) {
  return (
    <div className="uc-s uc-s--two">
      <div className="uc-col">
        <p className="uc-k">What you already have</p>
        <ul className="uc-rows">
          {uc.data.map((d, i) => (
            <li key={d} className="uc-row" style={v(i)}>
              <span className="uc-row__dot" aria-hidden="true" />
              {d}
            </li>
          ))}
        </ul>
        <p className="uc-note">Read inside your own server.</p>
      </div>
      <div className="uc-col uc-col--accent">
        <p className="uc-k">Then it researches one person</p>
        <p className="uc-body">{uc.research}</p>
      </div>
    </div>
  );
}

function SlideMatch({ uc }: { uc: UseCase }) {
  return (
    <div className="uc-s uc-s--match">
      <div className="uc-card">
        <p className="uc-k">{uc.person.who}</p>
        <ul className="uc-signals">
          {uc.person.signals.map((s, i) => (
            <li key={s} style={v(i)}>
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div className="uc-arrow" aria-hidden="true">
        <ArrowRight strokeWidth={1.6} />
      </div>
      <div className="uc-card uc-card--offer">
        <p className="uc-k" style={{ color: 'oklch(100% 0 0 / 0.75)' }}>
          Matched offer
        </p>
        <p className="uc-offer">{uc.person.offer}</p>
        <p className="uc-note" style={{ color: 'oklch(100% 0 0 / 0.7)' }}>
          People who don&apos;t fit get nothing.
        </p>
      </div>
    </div>
  );
}

/* [[n|text]] -> a numbered highlight that points at the source list */
function Marked({ text }: { text: string }) {
  const parts = text.split(/(\[\[\d\|[^\]]+\]\])/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[\[(\d)\|([^\]]+)\]\]$/);
        if (!m) return <Fragment key={i}>{p}</Fragment>;
        return (
          <mark key={i} className="uc-hl" data-n={m[1]} style={v(Number(m[1]))}>
            {m[2]}
            <sup className="uc-hl__n">{m[1]}</sup>
          </mark>
        );
      })}
    </>
  );
}

const KIND_CLASS: Record<SourceKind, string> = {
  record: 'uc-src--record',
  research: 'uc-src--research',
  offer: 'uc-src--offer',
  ask: 'uc-src--ask',
};

function SlideEmail({ uc }: { uc: UseCase }) {
  const e = EMAILS[uc.slug];
  if (!e) return null;
  const initials = e.from.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);
  return (
    <div className="uc-s uc-s--email">
      {/* the mailbox */}
      <div className="uc-mbox" role="img" aria-label={`Example email: ${e.subject}`}>
        <div className="uc-mbox__bar" aria-hidden="true">
          <span className="uc-mbox__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="uc-mbox__folder">Inbox</span>
          <span className="uc-mbox__tools">
            <Archive strokeWidth={1.6} />
            <Star strokeWidth={1.6} />
          </span>
        </div>
        <div className="uc-mbox__head">
          <p className="uc-mbox__subj">{e.subject}</p>
          <div className="uc-mbox__meta">
            <span className="uc-mbox__av" aria-hidden="true">
              {initials}
            </span>
            <div className="uc-mbox__who">
              <p>
                <b>{e.from.name}</b> <span>&lt;{e.from.address}&gt;</span>
              </p>
              <p>
                to {e.to.name} <span>&lt;{e.to.address}&gt;</span>
              </p>
            </div>
            <span className="uc-mbox__date">{e.date}</span>
          </div>
        </div>
        <div className="uc-mbox__body">
          {e.paragraphs.map((p, i) => (
            <p key={i}>
              <Marked text={p} />
            </p>
          ))}
          <div className="uc-mbox__sig">
            {e.signature.map((s, i) => (
              <p key={i} className={i === 0 ? 'uc-mbox__sig-name' : undefined}>
                {s}
              </p>
            ))}
          </div>
          <p className="uc-mbox__foot">
            {emailFooter(e.from.company)} <u>Unsubscribe</u>
          </p>
        </div>
        <div className="uc-mbox__actions" aria-hidden="true">
          <span>
            <Reply strokeWidth={1.6} /> Reply
          </span>
          <span>
            <Forward strokeWidth={1.6} /> Forward
          </span>
        </div>
      </div>

      {/* why each line is there */}
      <div className="uc-why">
        <p className="uc-k">Why each line is there</p>
        <ol className="uc-srcs">
          {e.sources.map((s, i) => (
            <li key={i} className={`uc-src ${KIND_CLASS[s.kind]}`} data-n={i + 1} style={v(i + 1)}>
              <span className="uc-src__n">{i + 1}</span>
              <span className="uc-src__txt">
                <b>{SOURCE_LABELS[s.kind]}</b>
                {s.note}
              </span>
            </li>
          ))}
        </ol>
        <p className="uc-note">An illustrative email. Names and details are made up.</p>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SlideSend(_props: { uc: UseCase }) {
  return (
    <div className="uc-s uc-s--send">
      <ul className="uc-rules">
        {SEND_RULES.map((r, i) => (
          <li key={r} style={v(i)}>
            <span className="uc-rules__tick" aria-hidden="true">
              <Check strokeWidth={2.4} />
            </span>
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

const SLIDES: ReadonlyArray<(p: { uc: UseCase; active?: boolean }) => ReactNode> = [SlideWhy, SlideRead, SlideMatch, SlideEmail, SlideSend];

/* ── the 16:9 deck ───────────────────────────────────────────────────────── */

function Deck({ uc, index, go }: { uc: UseCase; index: number; go: (i: number) => void }) {
  /* slides enter from the side you are moving toward */
  const prev = useRef(index);
  const [dir, setDir] = useState(1);
  useEffect(() => {
    if (index !== prev.current) setDir(index > prev.current ? 1 : -1);
    prev.current = index;
  }, [index]);
  return (
    <div className="uc-deck">
      {/* progress rail */}
      <ol className="uc-rail" aria-label="Slides">
        {SLIDE_TITLES.map((t, i) => (
          <li key={t}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-current={i === index ? 'step' : undefined}
              className="uc-rail__btn"
              data-done={i < index ? '' : undefined}
            >
              <span className="uc-rail__bar" />
              <span className="uc-rail__label">{t}</span>
            </button>
          </li>
        ))}
      </ol>

      {/* desktop and tablet: one fixed 16:9 stage */}
      <div className="uc-stage" aria-live="polite" style={{ '--dir': dir } as CSSProperties}>
        {SLIDES.map((S, i) => (
          <section
            key={i}
            className="uc-slide"
            data-active={i === index ? '' : undefined}
            aria-hidden={i !== index}
            aria-label={`${i + 1} of ${SLIDES.length}: ${SLIDE_TITLES[i]}`}
          >
            <p className="uc-slide__title">{SLIDE_TITLES[i]}</p>
            <S uc={uc} active={i === index} />
          </section>
        ))}
      </div>

      {/* phones: the same slides, stacked */}
      <div className="uc-stack">
        {SLIDES.map((S, i) => (
          <section key={i} className="uc-stack__card">
            <p className="uc-slide__title">{SLIDE_TITLES[i]}</p>
            <S uc={uc} />
          </section>
        ))}
      </div>

      <div className="uc-ctrl">
        <button type="button" className="uc-ctrl__btn" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide">
          <ArrowLeft size={16} strokeWidth={1.7} />
        </button>
        <span className="uc-ctrl__count" style={{ color: MUTED }}>
          {index + 1} / {SLIDES.length}
        </span>
        <button
          type="button"
          className="uc-ctrl__btn"
          onClick={() => go(index + 1)}
          disabled={index === SLIDES.length - 1}
          aria-label="Next slide"
        >
          <ArrowRight size={16} strokeWidth={1.7} />
        </button>
      </div>
    </div>
  );
}

/* ── section ─────────────────────────────────────────────────────────────── */

export default function UseCasesSection() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<UseCase | null>(null);
  const [index, setIndex] = useState(0);

  const go = useCallback((i: number) => setIndex(Math.max(0, Math.min(SLIDES.length - 1, i))), []);

  const show = (uc: UseCase, from?: HTMLElement) => {
    setOpen(uc);
    setIndex(0);
    const d = dialogRef.current;
    /* the pop-up grows out of the tile that opened it, and shrinks back into it */
    if (d && from) {
      const r = from.getBoundingClientRect();
      d.style.setProperty('--ox', `${Math.round(r.left + r.width / 2 - window.innerWidth / 2)}px`);
      d.style.setProperty('--oy', `${Math.round(r.top + r.height / 2 - window.innerHeight / 2)}px`);
    }
    if (d && !d.open) d.showModal();
  };
  const close = () => dialogRef.current?.close();

  /* one light follows the pointer across the grid and lights the hairlines near it */
  const onGridMove = (e: RPointerEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => {
      document.documentElement.style.overflow = '';
      setOpen(null);
    };
    d.addEventListener('close', onClose);
    return () => d.removeEventListener('close', onClose);
  }, []);

  /* while open: lock the page, and let the arrow keys move between slides */
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(SLIDES.length - 1, i + 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <Band tone="flat" id="use-cases" disorder={BAND_DISORDER['use-cases']}>
      <SectionHeader section={{ eyebrow: '', title: USE_CASES_TITLE, lead: '' }} align="center" as="h1" />

      <div className="uc-frame mx-auto mt-14 max-w-[1080px]">
        {/* registration marks at the four corners of the grid */}
        <i className="uc-reg uc-reg--tl" aria-hidden="true" />
        <i className="uc-reg uc-reg--tr" aria-hidden="true" />
        <i className="uc-reg uc-reg--bl" aria-hidden="true" />
        <i className="uc-reg uc-reg--br" aria-hidden="true" />
        <ul className="uc-grid" onPointerMove={onGridMove}>
          {USE_CASES.map((uc, i) => (
            <li key={uc.slug} className="uc-cell" style={{ '--d': (i % 4) + Math.floor(i / 4) } as CSSProperties}>
              <button type="button" onClick={(e) => show(uc, e.currentTarget)} aria-haspopup="dialog" className="uc-tile">
                <span className="uc-tile__corners" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span className="uc-tile__top">
                  <IndustryGlyph slug={uc.slug} className="uc-tile__glyph" />
                  <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" className="uc-tile__go" />
                </span>
                <span className="uc-tile__name">{uc.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="uc-title"
        className="uc-pop"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="uc-pop__inner" data-lenis-prevent>
          <button type="button" onClick={close} aria-label="Close" className="uc-close">
            <X size={18} strokeWidth={1.7} />
          </button>
          {open ? <Deck uc={open} index={index} go={go} /> : null}
        </div>
      </dialog>
    </Band>
  );
}
