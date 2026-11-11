'use client';

/**
 * CLOSING LOOP: seven stages on one perfectly even ring, the Master Playbook as a disc at
 * its centre. Geometry first: seven nodes 360/7 degrees apart, a dial of fine ticks, three
 * concentric rings, and seven orange arcs that each run from one stage to the next, brightening
 * clockwise so the direction reads without an arrow. The last arc returns to the first.
 * The last stage, Converse, hands its result straight back to the centre.
 * Words: the stage names, the playbook caption and the booking label are the site's own;
 * only the headline and the one plain line under it are new.
 */

import '@/app/styles/home-sections.css';
import SplitTitle from '@/components/Sections/SplitTitle';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Band } from '@/components/Sections/primitives';
import { useLive } from '@/components/Sections/TraceSection';
import { HOME } from '@/content/home';
import { BOOK_LABEL, CALENDAR_URL } from '@/content/contact';

const STAGES = ['Configure', 'Discover', 'Research', 'Qualify', 'Personalize', 'Outreach', 'Converse'];
const C = 320; // centre of a 640 box
const R = 206; // the stage ring
const N = STAGES.length;
const STEP = 360 / N;
const rad = (d: number) => (d * Math.PI) / 180;
const pt = (deg: number, r: number) => [C + r * Math.cos(rad(deg)), C + r * Math.sin(rad(deg))] as const;
const ang = (i: number) => -90 + i * STEP;
const f = (n: number) => n.toFixed(2);

/* an arc along the stage ring from stage i to stage i+1, stopping short of both nodes */
function arc(i: number) {
  const pad = 5.2; // degrees of clear air around each node
  const [x1, y1] = pt(ang(i) + pad, R);
  const [x2, y2] = pt(ang(i + 1) - pad, R);
  return `M ${f(x1)} ${f(y1)} A ${R} ${R} 0 0 1 ${f(x2)} ${f(y2)}`;
}

const TICKS = Array.from({ length: 84 }, (_, k) => k);

function Dial() {
  const [cx, cy] = pt(ang(N - 1), R);
  const [ix, iy] = pt(ang(N - 1), 104);
  return (
    <svg viewBox="0 0 640 640" className="cl-ring" role="img" aria-label="The seven stages in a ring around the Master Playbook, each feeding the next and the last returning to the centre">
      {/* dial ticks */}
      {TICKS.map((k) => {
        const a = -90 + (k / TICKS.length) * 360;
        const major = k % 12 === 0;
        const [x1, y1] = pt(a, major ? 150 : 154);
        const [x2, y2] = pt(a, 162);
        return <line key={k} x1={f(x1)} y1={f(y1)} x2={f(x2)} y2={f(y2)} stroke="#1d1d1f" strokeOpacity={major ? 0.28 : 0.12} strokeWidth={major ? 1.4 : 1} />;
      })}

      {/* three concentric rings */}
      <circle cx={C} cy={C} r={R} fill="none" stroke="#1d1d1f" strokeOpacity="0.1" />
      <circle cx={C} cy={C} r="132" fill="none" stroke="#1d1d1f" strokeOpacity="0.07" strokeDasharray="2 6" />
      <circle cx={C} cy={C} r="96" fill="none" stroke="var(--color-brand)" strokeOpacity="0.35" />

      {/* seven arcs, each a little stronger than the last */}
      {STAGES.map((_, i) => (
        <path key={i} d={arc(i)} fill="none" stroke="var(--color-brand)" strokeOpacity={0.28 + (i / (N - 1)) * 0.72} strokeWidth="2.2" strokeLinecap="round" />
      ))}

      {/* the last stage hands straight back to the centre */}
      <line x1={f(cx + (ix - cx) * 0.06)} y1={f(cy + (iy - cy) * 0.06)} x2={f(ix)} y2={f(iy)} stroke="var(--color-brand)" strokeWidth="1.6" strokeDasharray="1 6" strokeLinecap="round" />

      {STAGES.map((name, i) => {
        const [x, y] = pt(ang(i), R);
        const [lx, ly] = pt(ang(i), R + 30);
        const c = Math.cos(rad(ang(i)));
        const anchor = Math.abs(c) < 0.2 ? 'middle' : c > 0 ? 'start' : 'end';
        return (
          <g key={name}>
            <circle cx={f(x)} cy={f(y)} r="9" fill="#fff" stroke="#1d1d1f" strokeWidth="1.5" />
            <circle cx={f(x)} cy={f(y)} r="3.4" fill={i === 0 ? 'var(--color-brand)' : '#1d1d1f'} />
            <text x={f(lx)} y={f(ly + 4.5)} textAnchor={anchor} className="cl-label">
              {name}
            </text>
          </g>
        );
      })}

      {/* one point keeps circling, only while the section is on screen */}
      <g className="cl-orbit">
        <circle cx={C} cy={C - R} r="5" fill="var(--color-brand)" />
      </g>
    </svg>
  );
}

export default function ClosingLoop() {
  const ref = useLive<HTMLDivElement>();
  return (
    <Band id="loop" tone="flat">
      <div ref={ref} className="cl mx-auto max-w-[1272px]">
        <div className="cl-copy">
          <SplitTitle className="cl-h" parts={['Every run ', { mark: 'feeds the next' }, '.']} />
          <p className="cl-lead">Everything it does is saved, so your next run starts from what you already learned.</p>
          <div className="cl-cta">
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="cl-btn">
              {BOOK_LABEL}
              <span aria-hidden="true">
                <ArrowRight size={15} strokeWidth={2} />
              </span>
            </a>
            <Link href="/pricing" className="cl-link">
              See pricing
            </Link>
          </div>
        </div>
        <div className="cl-stage">
          <Dial />
          <div className="cl-core">
            <b>Master Playbook</b>
            <span>{HOME.playbookCaptions.scene4}</span>
          </div>
        </div>
      </div>
    </Band>
  );
}
