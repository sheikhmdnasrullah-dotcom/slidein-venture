'use client';

/**
 * PROCESS TIMELINE — the eight steps down one spine, in the order the ledger
 * wrote them. The spine's times (08:02 to 09:12) are the sample ledger's own.
 * Words on one side, the record that step produced on the other, switching
 * sides each step. The spine fills as you read; nothing else moves on scroll.
 * Words and records come from how-it-works-video/data; nothing is written here.
 */

import '@/app/styles/processbook.css';
import '@/app/styles/processtimeline.css';
import { useEffect, useRef, type CSSProperties } from 'react';
import { SCENES } from '@/how-it-works-video/data/scenes.config';
import { ledger } from '@/how-it-works-video/data/fixtures';
import { Record, Words } from './ProcessBook';

/* the ledger line that opens each step */
const AT = [0, 1, 2, 3, 4, 5, 6, 7];

export default function ProcessTimeline() {
  const ref = useRef<HTMLElement>(null);

  /* the spine fills to the middle of the screen */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - r.top) / r.height));
      el.style.setProperty('--tl', String(p));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} className="ptl" aria-label="How it works" data-testid="process-timeline">
      <h1 className="ptl-title font-display-sm">How it works</h1>
      <ol className="ptl-list">
        <li className="ptl-spine" aria-hidden="true">
          <i />
        </li>
        {SCENES.map((s, i) => (
          <li key={s.id} className="ptl-row" data-side={i % 2 ? 'r' : 'l'} style={{ '--i': i } as CSSProperties}>
            <div className="ptl-words">
              <Words i={i} bare />
            </div>
            <div className="ptl-time">
              <i aria-hidden="true" />
              <time>{ledger[AT[i]][0]}</time>
            </div>
            <div className="ptl-rec">
              <Record i={i} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
