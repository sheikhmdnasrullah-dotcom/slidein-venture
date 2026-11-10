'use client';

/**
 * TRACE: one product window, in the split-row style of the reference site.
 * Left, the research SlideIn holds on one prospect. Right, the email it wrote.
 * Each personal line lights up together with the finding it came from, one at
 * a time, on a loop while the window is on screen. The unsourced finding is
 * shown struck and unused. Example data comes from the shared fixtures.
 */

import Link from 'next/link';
import { useEffect, useRef, type CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { Band } from '@/components/Sections/primitives';
import { email, findings, match, rawRecords } from '@/how-it-works-video/data/fixtures';

/** Sets data-live on the element while it is on screen, so loops only run when seen. */
export function useLive<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      el.toggleAttribute('data-live', e.isIntersecting);
      if (e.isIntersecting) el.setAttribute('data-seen', '');
    }, {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

const n = (k: number) => ({ '--n': k }) as CSSProperties;

function Mark({ k, children }: { k: number; children: string }) {
  return (
    <mark className="tr-mark" data-n={k} style={n(k)}>
      {children}
      <sup>{k}</sup>
    </mark>
  );
}

export function Window() {
  const p = rawRecords[0];
  const [f1, f2] = findings;
  return (
    <div className="tr-win" aria-hidden="true">
      <div className="tr-bar">
        <span className="tr-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="tr-pill">Draft</span>
      </div>

      <div className="tr-body">
        <aside className="tr-side">
          <div className="tr-who">
            <span className="tr-av">PR</span>
            <span>
              <b>{p.name}</b>
              <em>{p.org}</em>
            </span>
          </div>
          <ul className="tr-finds">
            {[f1, f2].map((f, i) => (
              <li key={f.id} className="tr-find" data-n={i + 1} style={n(i + 1)}>
                <span className="tr-num">{i + 1}</span>
                <span>
                  {f.text}
                  <code>{f.source}</code>
                </span>
              </li>
            ))}
            <li className="tr-find" data-n={3} style={n(3)}>
              <span className="tr-num">3</span>
              <span>
                {match.offer}
                <code>your offer</code>
              </span>
            </li>
          </ul>
        </aside>

        <div className="tr-mail">
          <div className="tr-field">
            <span>To</span>
            <b>{email.to}</b>
          </div>
          <div className="tr-text">
            <p>{email.lines[0]}</p>
            <p>
              I&apos;ve been listening to your <Mark k={1}>weekly podcast</Mark>, and{' '}
              <Mark k={2}>episode 41 on moving off spreadsheets</Mark> stayed with me.
            </p>
            <p>
              We turn podcast episodes into <Mark k={3}>short clips your team can post the same week</Mark>.
            </p>
            <p>{email.lines[3]}</p>
          </div>
          <div className="tr-foot">
            <span className="tr-btn">Send for approval</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TraceSection() {
  const ref = useLive<HTMLDivElement>();
  return (
    <Band id="trace" tone="flat">
      <div ref={ref} className="tr-row mx-auto max-w-[1272px]">
        <div className="tr-copy">
          <h2 className="dx-split-h">
            <span>One email for one person.</span> Every line keeps its source.
          </h2>
          <Link href="/use-cases" className="dx-textlink">
            See Use Cases <ArrowRight size={15} strokeWidth={1.8} />
          </Link>
        </div>
        <div className="tr-stage">
          <i className="tr-glow" aria-hidden="true" />
          <Window />
        </div>
      </div>
    </Band>
  );
}
