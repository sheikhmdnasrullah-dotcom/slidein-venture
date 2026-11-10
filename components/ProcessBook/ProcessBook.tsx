'use client';

/**
 * PROCESS BOOK — the eight steps as the pages of one bound book.
 * ---------------------------------------------------------------------------
 * Scrolling turns a page, one step at a time. No crossfade, no light sweep, no
 * scrubbed opacity: a leaf rotates about the spine on one CSS transition and
 * lands on the left, showing the next step's text on its back while the next
 * record is already waiting on the right. Under 900px (or reduced motion) it is
 * a plain list of the same eight spreads.
 *
 * Every word comes from how-it-works-video/data (the approved captions and the
 * sample records the home page already uses). Nothing is written here.
 */

import '@/app/styles/processbook.css';
import { Check } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { SCENES } from '@/how-it-works-video/data/scenes.config';
import { useSettledStill } from '@/lib/useSettledStill';
import {
  business,
  checks,
  criteria,
  email,
  findings,
  held,
  ledger,
  match,
  rawRecords,
  replies,
} from '@/how-it-works-video/data/fixtures';

export const N = SCENES.length;
const two = (n: number) => String(n).padStart(2, '0');

/* which ledger lines each step writes (the ledger step lists them all) */
const WRITES: number[][] = [[0], [1], [2], [3], [4], [5], [6, 7], []];

function Caption({ i }: { i: number }) {
  const s = SCENES[i];
  const parts = s.emphasis.length
    ? s.caption.split(new RegExp(`(${s.emphasis.map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`))
    : [s.caption];
  return (
    <p className="pbk-cap">
      {parts.map((p, k) => (s.emphasis.includes(p) ? <mark key={k}>{p}</mark> : <span key={k}>{p}</span>))}
    </p>
  );
}

/* the left page: the step, in words */
export function Words({ i, bare = false }: { i: number; bare?: boolean }) {
  const s = SCENES[i];
  return (
    <div className="pbk-words">
      <p className="pbk-no">
        <b>{two(i + 1)}</b> / {two(N)}
      </p>
      <h2 className="pbk-h font-display-sm">{s.railLabel}</h2>
      <Caption i={i} />
      {!bare && WRITES[i].length ? (
        <ul className="pbk-wrote">
          {WRITES[i].map((k) => (
            <li key={k}>
              <time>{ledger[k][0]}</time>
              <span>{ledger[k][1]}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

const Row = ({ children, tone }: { children: ReactNode; tone?: 'off' }) => (
  <li className="pbk-row" data-tone={tone}>
    {children}
  </li>
);

/* the right page: the record that step produces */
export function Record({ i }: { i: number }) {
  switch (i) {
    case 0:
      return (
        <div className="pbk-rec">
          <p className="pbk-k">Business</p>
          <p className="pbk-big">{business.name}</p>
          <p className="pbk-sub">{business.line}</p>
          <p className="pbk-k">Offers</p>
          <ul className="pbk-list">{business.offers.map((o) => <Row key={o}>{o}</Row>)}</ul>
          <p className="pbk-k">Ideal customer</p>
          <ul className="pbk-list">{business.icp.map((o) => <Row key={o}>{o}</Row>)}</ul>
          <p className="pbk-stamp">{business.profile}</p>
        </div>
      );
    case 1:
      return (
        <div className="pbk-rec">
          <p className="pbk-k">Prospects</p>
          <ul className="pbk-list">
            {rawRecords.map((r, k) => (
              <Row key={r.name} tone={k === 1 ? 'off' : undefined}>
                <span className="pbk-main">
                  <b>{r.name}</b>
                  <em>{r.title}, {r.org}</em>
                </span>
                <code>{r.source}</code>
              </Row>
            ))}
          </ul>
          <p className="pbk-note">{ledger[1][1]}</p>
        </div>
      );
    case 2:
      return (
        <div className="pbk-rec">
          <p className="pbk-k">Findings</p>
          <ul className="pbk-list">
            {findings.map((f) => (
              <Row key={f.id} tone={f.sourced ? undefined : 'off'}>
                <span className="pbk-main">
                  <b>{f.text}</b>
                  <em>{f.source ?? '—'}</em>
                </span>
                <code>{f.id}</code>
              </Row>
            ))}
          </ul>
        </div>
      );
    case 3:
      return (
        <div className="pbk-rec">
          <p className="pbk-k">Criteria</p>
          <ul className="pbk-list">
            {criteria.map((c) => (
              <Row key={c.label}>
                <span className="pbk-main"><b>{c.label}</b></span>
                <code>{c.value}</code>
                <span className="pbk-mark" data-pass={String(c.pass)} aria-hidden="true">
                  {c.pass ? <Check size={13} strokeWidth={2.4} /> : '—'}
                </span>
              </Row>
            ))}
          </ul>
          <p className="pbk-k">Matched offer</p>
          <p className="pbk-big">{match.offer}</p>
          <ul className="pbk-list">{match.reasons.map((r) => <Row key={r}>{r}</Row>)}</ul>
        </div>
      );
    case 4: {
      const body = email.lines[1];
      const marked = email.personalized.reduce<ReactNode[]>(
        (acc, p, k) => {
          const last = acc.pop() as string;
          const at = last.indexOf(p.span);
          if (at < 0) return [...acc, last];
          return [
            ...acc,
            last.slice(0, at),
            <span key={p.finding} className="pbk-pers">{p.span}<sup>{k + 1}</sup></span>,
            last.slice(at + p.span.length),
          ];
        },
        [body],
      );
      return (
        <div className="pbk-rec">
          <p className="pbk-k">To</p>
          <p className="pbk-sub">{email.to}</p>
          <p className="pbk-k">Subject</p>
          <p className="pbk-sub">{email.subject}</p>
          <div className="pbk-mail">
            <p>{email.lines[0]}</p>
            <p>{marked.map((m, k) => <span key={k}>{m}</span>)}</p>
            <p>{email.lines[2]}</p>
            <p>{email.lines[3]}</p>
            <p>{email.lines[4]}</p>
          </div>
          <ol className="pbk-foot">
            {email.personalized.map((p) => {
              const f = findings.find((x) => x.id === p.finding);
              return <li key={p.finding}>{f?.text}<code>{f?.source}</code></li>;
            })}
          </ol>
        </div>
      );
    }
    case 5:
      return (
        <div className="pbk-rec">
          <p className="pbk-k">Checks</p>
          <ul className="pbk-list">
            {checks.map((c) => (
              <Row key={c}>
                <span className="pbk-main"><b>{c}</b></span>
                <span className="pbk-mark" data-pass="true" aria-hidden="true"><Check size={13} strokeWidth={2.4} /></span>
              </Row>
            ))}
          </ul>
          <p className="pbk-k">Held</p>
          <ul className="pbk-list">
            <Row tone="off">
              <span className="pbk-main">
                <b>{held.who}</b>
                <em>{held.reason}</em>
              </span>
            </Row>
          </ul>
        </div>
      );
    case 6:
      return (
        <div className="pbk-rec">
          <p className="pbk-k">Replies</p>
          <ul className="pbk-list">
            {replies.map((r) => (
              <Row key={r.from}>
                <span className="pbk-main">
                  <b>{r.from}</b>
                  <em>{r.text}</em>
                </span>
                <code>{r.intent}</code>
              </Row>
            ))}
          </ul>
        </div>
      );
    default:
      return (
        <div className="pbk-rec">
          <p className="pbk-k">Ledger</p>
          <ul className="pbk-list pbk-ledger">
            {ledger.map(([t, what]) => (
              <Row key={t + what}>
                <time>{t}</time>
                <span className="pbk-main">{what}</span>
              </Row>
            ))}
          </ul>
        </div>
      );
  }
}

export default function ProcessBook() {
  const still = useSettledStill();
  const trackRef = useRef<HTMLElement>(null);
  const [page, setPage] = useState(0);

  /* the page follows the scroll position inside the pinned range */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(0.9999, Math.max(0, -r.top / span));
      setPage((cur) => {
        const next = Math.floor(p * N);
        return cur === next ? cur : next;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / N) * span;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  const leaves = Array.from({ length: N - 1 }, (_, i) => i);

  return (
    <>
      {/* desktop: the book */}
      <section
        ref={trackRef}
        id="process"
        data-testid="process-book"
        aria-label="How it works"
        className="pbk"
        data-still={still ? 'true' : 'false'}
        style={{ '--pbk-n': N } as CSSProperties}
      >
        <div className="pbk-pin">
          <header className="pbk-head">
            <h1 className="pbk-title font-display-sm">How it works</h1>
            <nav className="pbk-nav" aria-label="Steps">
              {SCENES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className="pbk-tab"
                  aria-current={i === page ? 'step' : undefined}
                  onClick={() => go(i)}
                >
                  <b>{two(i + 1)}</b>
                  <span>{s.railLabel}</span>
                </button>
              ))}
            </nav>
          </header>

          <div className="pbk-book">
            {/* left page underneath: step one's words */}
            <div className="pbk-page pbk-page--l" aria-hidden={page !== 0}>
              <Words i={0} />
            </div>
            {/* right page underneath: the last record */}
            <div className="pbk-page pbk-page--r" aria-hidden={page !== N - 1}>
              <Record i={N - 1} />
            </div>

            {leaves.map((i) => {
              const flipped = page > i;
              return (
                <div
                  key={i}
                  className="pbk-leaf"
                  data-flipped={flipped}
                  style={{ zIndex: flipped ? i + 2 : N - i + 10 } as CSSProperties}
                >
                  <div className="pbk-face pbk-face--front" aria-hidden={flipped || page !== i}>
                    <Record i={i} />
                  </div>
                  <div className="pbk-face pbk-face--back" aria-hidden={!flipped || page !== i + 1}>
                    <Words i={i + 1} />
                  </div>
                </div>
              );
            })}
            <i className="pbk-spine" aria-hidden="true" />
          </div>

          <p className="pbk-hint" aria-hidden="true">Scroll to turn the page</p>
        </div>
      </section>

      {/* mobile and reduced motion: the same eight spreads, plain */}
      <section className="pbk-list-view" aria-label="How it works, as a list">
        <h1 className="pbk-title font-display-sm">How it works</h1>
        {SCENES.map((s, i) => (
          <article key={s.id} className="pbk-spread">
            <Words i={i} />
            <Record i={i} />
          </article>
        ))}
      </section>
    </>
  );
}
