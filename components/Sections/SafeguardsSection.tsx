'use client';

/**
 * SAFEGUARDS: three cards in the reference site's card-row style. Each card
 * has a title, one short line, and a real-looking product panel cropped at the
 * bottom over a soft gradient. The panels act out what they claim, on a loop
 * while visible: the fit score fills to its threshold, the checks pass one by
 * one, the replies arrive and sort themselves.
 */

import type { CSSProperties } from 'react';
import { Check } from 'lucide-react';
import { Band, SectionHeader } from '@/components/Sections/primitives';
import { criteria, replies } from '@/how-it-works-video/data/fixtures';
import { useLive } from '@/components/Sections/TraceSection';

const v = (i: number) => ({ '--i': i }) as CSSProperties;

export function QualifyPanel() {
  return (
    <div className="sg-panel" aria-hidden="true">
      <div className="sg-head">
        <b>Qualification</b>
      </div>
      <ul className="sg-rows">
        {criteria.slice(0, 3).map((c, i) => (
          <li key={c.label} style={v(i)}>
            <span>{c.label}</span>
            <i className="sg-tick">
              <Check size={10} strokeWidth={2.8} />
            </i>
            <code>{c.value}</code>
          </li>
        ))}
      </ul>
      <div className="sg-score">
        <span className="sg-meter">
          {Array.from({ length: 10 }, (_, i) => (
            <i key={i} data-on={i < 8 ? '' : undefined} style={v(i)} />
          ))}
          <em className="sg-bar" aria-hidden="true" />
        </span>
        <b>8 / 10</b>
      </div>
      <div className="sg-foot">
        <span className="sg-state sg-state--teal">Qualified</span>
      </div>
    </div>
  );
}

const CHECKS = [
  ['Address', 'valid'],
  ['Spam signals', 'clean'],
  ['Suppression', 'clear'],
  ['Opt-out link', 'present'],
] as const;

export function ChecksPanel() {
  return (
    <div className="sg-panel" aria-hidden="true">
      <div className="sg-head">
        <b>Pre-send checks</b>
      </div>
      <ul className="sg-rows sg-rows--checks">
        {CHECKS.map(([k, val], i) => (
          <li key={k} style={v(i)}>
            <span>{k}</span>
            <i className="sg-run">
              <Check size={10} strokeWidth={2.8} />
            </i>
            <code>{val}</code>
          </li>
        ))}
      </ul>
      <div className="sg-foot">
        <span className="sg-state sg-state--go">Ready to send</span>
      </div>
    </div>
  );
}

export function RepliesPanel() {
  const [a, b] = replies;
  const rows = [
    { av: 'PR', who: a.from, tag: a.intent, tone: 'sg-tag--yes' },
    { av: 'MW', who: 'Marcus Webb', tag: 'Away', tone: '' },
    { av: 'DR', who: b.from, tag: 'Suppressed', tone: 'sg-tag--out' },
  ];
  return (
    <div className="sg-panel" aria-hidden="true">
      <div className="sg-head">
        <b>Replies</b>
      </div>
      <ul className="sg-mail">
        {rows.map((r, i) => (
          <li key={r.who} style={v(i)}>
            <span className="sg-av">{r.av}</span>
            <span className="sg-msg">
              <b>{r.who}</b>
            </span>
            <span className={`sg-tag ${r.tone}`} style={v(i)}>{r.tag}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const CARDS = [
  { title: 'Only strong fits', Panel: QualifyPanel },
  { title: 'Checked before sending', Panel: ChecksPanel },
  { title: 'Replies, sorted', Panel: RepliesPanel },
] as const;

export default function SafeguardsSection() {
  const ref = useLive<HTMLDivElement>();
  return (
    <Band id="safeguards" tone="flat">
      <SectionHeader
        align="center"
        section={{ eyebrow: '', title: 'Careful at every step.', emphasis: 'every step', lead: '' }}
      />
      <div ref={ref} className="sg-grid mx-auto mt-14 max-w-[1272px]">
        {CARDS.map(({ title, Panel }) => (
          <article key={title} className="sg-card">
            <h3>{title}</h3>
            <Panel />
          </article>
        ))}
      </div>
    </Band>
  );
}
