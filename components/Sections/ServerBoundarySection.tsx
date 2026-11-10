'use client';

/**
 * SERVER BOUNDARY: one scene, split by a line. Inside: your server, your
 * customer table, SlideIn running beside it. On the line: a lock. Outside: the
 * SlideIn team, with no access. Little packets of data travel toward the line
 * and stop there. Plain product UI, no illustration.
 */

import '@/app/styles/home-sections.css';
import { Lock } from 'lucide-react';
import { Band } from '@/components/Sections/primitives';
import { LogoWordmark } from '@/components/Brand/Logo';
import { useLive } from '@/components/Sections/TraceSection';

const PEOPLE = [
  ['PR', 'Priya Raman'],
  ['DR', 'Daniel Reyes'],
  ['MW', 'Marcus Webb'],
  ['AL', 'Ana Lopez'],
] as const;

function Scene() {
  return (
    <div className="sb-card" aria-hidden="true">
      <div className="sb-in">
        <div className="sv-win">
          <div className="sv-bar">
            <span className="tr-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="sv-title">Your server</span>
          </div>
          <div className="sv-body">
            <div className="sv-pane">
              <p className="sv-lab">Customers</p>
              <ul className="sv-table">
                {PEOPLE.map(([av, name]) => (
                  <li key={name}>
                    <span className="sg-av">{av}</span>
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sv-pane sv-pane--app">
              <div className="sv-mark">
                <LogoWordmark size="26px" />
              </div>
              <span className="sv-run">
                <i /> Running
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="sb-mid">
        <i className="sb-pkt" />
        <i className="sb-pkt" />
        <i className="sb-pkt" />
        <span className="sb-line" />
        <span className="sb-lock">
          <Lock size={18} strokeWidth={1.8} />
        </span>
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
        <h2 className="sb-h">
          We <mark>never</mark> see your database.
        </h2>
        <Scene />
      </div>
    </Band>
  );
}
