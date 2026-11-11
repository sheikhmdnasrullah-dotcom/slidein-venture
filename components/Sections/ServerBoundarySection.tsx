'use client';

/**
 * SERVER BOUNDARY: a diagram you can read in one look.
 * Inside the box (your server): your customers and SlideIn running next to them,
 * with data moving between the two. On the box's edge: a lock. Outside: the
 * SlideIn team, held at the edge, with no access. Words are the site's own; the
 * line under the title is the first of the send rules in content/useCases.ts.
 */

import '@/app/styles/home-sections.css';
import SplitTitle from '@/components/Sections/SplitTitle';
import { Lock } from 'lucide-react';
import { Band } from '@/components/Sections/primitives';
import { LogoWordmark } from '@/components/Brand/Logo';
import { useLive } from '@/components/Sections/TraceSection';
import { SEND_RULES } from '@/content/useCases';

const PEOPLE = [
  ['EF', 'Emily Foster'],
  ['DR', 'Daniel Reyes'],
  ['MW', 'Marcus Webb'],
  ['AL', 'Ana Lopez'],
] as const;

function Scene() {
  return (
    <div className="sb-card" aria-hidden="true">
      <div className="sb-server">
        <span className="sb-tag">Your server</span>

        <div className="sb-db">
          <p className="sb-cap">Customers</p>
          <ul>
            {PEOPLE.map(([av, name]) => (
              <li key={name}>
                <span className="sb-av">{av}</span>
                {name}
              </li>
            ))}
          </ul>
        </div>

        <div className="sb-flow">
          <i />
          <i />
          <i />
        </div>

        <div className="sb-app">
          <LogoWordmark size="28px" />
          <span className="sb-run">
            <i /> Running
          </span>
        </div>

        <span className="sb-lock">
          <Lock size={20} strokeWidth={1.8} />
        </span>
      </div>

      <div className="sb-wall">
        <i />
      </div>

      <div className="sb-out">
        <b>SlideIn team</b>
        <span className="sb-no">No access</span>
      </div>
    </div>
  );
}

export default function ServerBoundarySection() {
  const ref = useLive<HTMLDivElement>();
  return (
    <Band id="server" tone="flat">
      <div ref={ref} className="sb mx-auto max-w-[1272px]">
        <div className="sb-head">
          <SplitTitle className="sb-h" parts={['We ', { mark: 'never' }, ' see your database.']} />
          <p className="sb-lead">{SEND_RULES[0]}</p>
        </div>
        <Scene />
      </div>
    </Band>
  );
}
