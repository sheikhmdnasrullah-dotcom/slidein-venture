/**
 * LIVING PLAYBOOK — the last slide's picture: persistent knowledge that
 * evolves every time you interact with it.
 *
 * The same Master Playbook book from the slide before, now closed and at the
 * centre. Around it, the four things that happen in the work (a reply, a
 * booked slot, an outreach, a person) travel the orbit; each one sends a
 * bead of light into the book, the book answers with a ripple and another
 * page joins the stack behind it. Nothing is written: the picture is the
 * story. Idle motion is CSS (playbook.css); the entrance is driven by the
 * scroll timeline through the .lp-* / .brain-pulse-ring hooks.
 */

import React from 'react';
import { cn } from '@/lib/utils';

const R = 128; // orbit radius, design px

const GLYPHS = [
  // a reply
  <path key="r" d="M4 5.5h16v10H11l-4.5 4v-4H4z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />,
  // a booked slot
  <g key="b" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="5.5" width="16" height="14" rx="3" />
    <path d="M4 10h16M9 14.5l2.2 2.2L15.5 12.5" />
  </g>,
  // an outreach
  <path key="o" d="M3 11.5 21 4l-6.6 16-3-6.6z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />,
  // a person
  <g key="p" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
    <circle cx="12" cy="8.5" r="3.6" />
    <path d="M5 20c.8-4 3.7-6 7-6s6.2 2 7 6" />
  </g>,
];

interface Props {
  className?: string;
  isPortrait?: boolean;
}

export function LivingPlaybook({ className, isPortrait = false }: Props) {
  return (
    <div
      data-testid="playbook-brain"
      className={cn('relative select-none pointer-events-auto', className)}
      style={{ width: 400, height: 320, transform: isPortrait ? 'scale(0.78)' : undefined }}
      aria-hidden="true"
    >
      {/* knowledge aura: three rings that breathe outward */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
        <span className="brain-pulse-ring absolute h-[300px] w-[300px] rounded-full border border-[rgba(255,98,0,0.16)]" />
        <span className="brain-pulse-ring absolute h-[350px] w-[350px] rounded-full border border-[rgba(10,10,10,0.07)]" />
        <span className="brain-pulse-ring absolute h-[400px] w-[400px] rounded-full border border-[rgba(10,10,10,0.04)]" />
      </div>

      {/* warm paper disc under everything */}
      <span
        className="lp-disc absolute left-1/2 top-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, var(--pb-sand) 0%, rgb(250 245 238 / 0%) 72%)' }}
      />

      {/* the orbit: a dashed ring that draws, and the four travellers on it */}
      <svg className="absolute inset-0" width="400" height="320" viewBox="0 0 400 320" fill="none">
        <circle
          className="lp-orbit"
          cx="200"
          cy="160"
          r={R}
          pathLength={1}
          stroke="rgb(10 10 10 / 0.2)"
          strokeWidth="1.2"
          strokeDasharray="1.5 7"
          strokeLinecap="round"
        />
      </svg>

      <div className="lp-ring absolute left-1/2 top-1/2 h-0 w-0">
        {GLYPHS.map((g, i) => {
          const deg = i * 90 - 45;
          return (
            <div key={i} className="absolute left-0 top-0 h-0 w-0" style={{ transform: `rotate(${deg}deg)` }}>
              {/* the bead that runs from the traveller into the book */}
              <span className="lp-bead absolute -left-[4px] -top-[4px] h-2 w-2 rounded-full bg-[var(--color-brand)]" style={{ animationDelay: `${i * 0.7}s` }} />
              <div className="absolute left-0 top-0" style={{ transform: `translateX(${R}px)` }}>
                <div style={{ transform: `rotate(${-deg}deg)` }}>
                  <div className="lp-unspin">
                    <span className="lp-sat -translate-x-1/2 -translate-y-1/2 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[rgba(10,10,10,0.1)] bg-white text-[rgba(10,10,10,0.82)]"
                      style={{ boxShadow: '0 8px 18px -8px rgba(10,10,10,0.25), inset 0 1px 0 rgb(255 255 255)' }}>
                      <svg viewBox="0 0 24 24" width="20" height="20" focusable="false" style={i === 1 || i === 2 ? { color: 'var(--color-brand)' } : undefined}>{g}</svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* the Master Playbook, closed: pages stack behind it as it learns */}
      <div className="absolute left-1/2 top-1/2 h-[156px] w-[118px] -translate-x-1/2 -translate-y-1/2">
        {[3, 2, 1].map((n) => (
          <span
            key={n}
            className="lp-page absolute inset-0 rounded-[12px] border border-[rgba(10,10,10,0.1)] bg-white"
            style={{ ['--n' as string]: n, animationDelay: `${n * -0.9}s` }}
          />
        ))}
        <div
          className="lp-book absolute inset-0 overflow-hidden rounded-[12px]"
          style={{
            background: 'linear-gradient(160deg, rgb(32 32 34) 0%, rgb(10 10 10) 70%)',
            boxShadow: '0 22px 40px -16px rgba(10,10,10,0.55), inset 0 1px 0 rgb(255 255 255 / 14%)',
          }}
        >
          {/* spine */}
          <span className="absolute inset-y-0 left-0 w-[10px]" style={{ background: 'linear-gradient(90deg, rgb(255 255 255 / 14%), rgb(255 255 255 / 0%))' }} />
          {/* ribbon */}
          <span
            className="absolute -top-px right-[22px] h-[44px] w-[12px] bg-[var(--color-brand)]"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)' }}
          />
          {/* the protagonist: a target and its orange core, the ICP motif */}
          <div className="absolute left-1/2 top-[58px] flex h-[46px] w-[46px] -translate-x-1/2 items-center justify-center">
            <span className="lp-core-ring absolute inset-0 rounded-full border border-[rgb(255_255_255/0.28)]" />
            <span className="absolute inset-[9px] rounded-full border border-[rgb(255_255_255/0.4)]" />
            <span className="lp-core relative h-[10px] w-[10px] rounded-full bg-[var(--color-brand)]" />
          </div>
          {/* the three chapters, as marks */}
          <div className="absolute inset-x-[22px] bottom-[18px] flex items-center justify-between">
            <span className="h-[7px] w-[7px] rounded-full bg-white/85" />
            <span className="h-[7px] w-[7px] rounded-[1.5px] bg-[var(--color-brand)]" />
            <span className="h-[7px] w-[7px] rotate-45 rounded-[1px] bg-[var(--color-brand)]" />
          </div>
        </div>
        <span className="lp-ripple pointer-events-none absolute -inset-[6px] rounded-[16px] border border-[var(--color-brand)]" />
      </div>
    </div>
  );
}
