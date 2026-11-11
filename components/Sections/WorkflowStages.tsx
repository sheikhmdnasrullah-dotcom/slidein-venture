'use client';

/**
 * WORKFLOW: the seven stages, one row each, read top to bottom.
 * A connected rail of all seven sticks under the nav while you read and lights
 * the stage in view. Each row: the step and a two-tone headline on the left,
 * a product window doing that stage on the right. Windows rest on their
 * finished state; small loops run only while a row is on screen.
 */

import Link from 'next/link';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  MessagesSquare,
  PenLine,
  Radar,
  Search,
  Send,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';
import '@/app/styles/workflow-layouts.css';
import { Band } from '@/components/Sections/primitives';
import { Window as EmailWindow } from '@/components/Sections/TraceSection';
import { ChecksPanel, QualifyPanel, RepliesPanel } from '@/components/Sections/SafeguardsSection';
import { business, findings, rawRecords } from '@/how-it-works-video/data/fixtures';

const v = (i: number) => ({ '--i': i }) as CSSProperties;

function Bar({ title }: { title?: string }) {
  return (
    <div className="tr-bar">
      <span className="tr-dots">
        <i />
        <i />
        <i />
      </span>
      {title ? <span className="sv-title">{title}</span> : null}
    </div>
  );
}

/* 1 · Configure: the setup, saved as a version */
function ConfigureVisual() {
  return (
    <div className="tr-win wf-win" aria-hidden="true">
      <Bar title="Setup" />
      <div className="wf-pad">
        <p className="sv-lab">Business</p>
        <p className="wf-big">{business.name}</p>
        <p className="sv-lab">Offers</p>
        <div className="wf-chips">
          {business.offers.map((o, i) => (
            <span key={o} className="wf-chip" style={v(i)}>
              {o}
            </span>
          ))}
        </div>
        <p className="sv-lab">Ideal customer</p>
        <div className="wf-chips">
          {business.icp.slice(0, 3).map((o, i) => (
            <span key={o} className="wf-chip wf-chip--soft" style={v(i + 3)}>
              {o}
            </span>
          ))}
        </div>
        <div className="wf-foot">
          <span className="sg-pill">{business.profile}</span>
          <span className="wf-saved">
            <Check size={12} strokeWidth={2.6} /> Saved
          </span>
        </div>
      </div>
    </div>
  );
}

/* 2 · Discover: two records of one person merge into one prospect */
function DiscoverVisual() {
  const [a, b, c] = rawRecords;
  return (
    <div className="tr-win wf-win" aria-hidden="true">
      <Bar title="Prospects" />
      <ul className="wf-list">
        <li className="wf-rec">
          <span className="sg-av">EF</span>
          <b>{a.name}</b>
          <span className="wf-src">
            <span className="wf-chip wf-chip--soft">CSV</span>
            <span className="wf-chip wf-chip--soft wf-merged">directory</span>
          </span>
        </li>
        <li className="wf-rec wf-rec--dup">
          <span className="sg-av">EF</span>
          <b>{b.name}</b>
          <span className="wf-src">
            <span className="wf-chip wf-chip--soft">directory</span>
          </span>
        </li>
        <li className="wf-rec">
          <span className="sg-av">DR</span>
          <b>{c.name}</b>
          <span className="wf-src">
            <span className="wf-chip wf-chip--soft">conference</span>
          </span>
        </li>
      </ul>
    </div>
  );
}

/* 3 · Research: the page is read, each finding keeps its source */
function ResearchVisual() {
  const [f1, f2] = findings;
  return (
    <div className="tr-win wf-win" aria-hidden="true">
      <div className="tr-bar">
        <span className="tr-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="wf-url">calloway.io/podcast/41</span>
      </div>
      <div className="wf-research">
        <div className="wf-page">
          <p className="wf-h">
            <mark className="wf-hl" style={v(0)}>
              Episode 41: Moving off spreadsheets
            </mark>
          </p>
          <p>
            A <mark className="wf-hl" style={v(1)}>weekly podcast</mark> for operations teams.
          </p>
          <i className="wf-scan" />
        </div>
        <ul className="wf-finds">
          {[f2, f1].map((f, i) => (
            <li key={f.id} style={v(i)}>
              <b>{f.text}</b>
              <code>{f.source}</code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* 6 · Outreach: your approval first, then the checks */
function OutreachVisual() {
  return (
    <div className="wf-stack">
      <div className="wf-approve">
        <span className="wf-approve__tick">
          <Check size={13} strokeWidth={2.6} />
        </span>
        <b>Campaign approved by you</b>
      </div>
      <ChecksPanel />
    </div>
  );
}

type Stage = {
  id: string;
  name: string;
  line: string;
  Icon: LucideIcon;
  Visual: () => ReactNode;
  link?: boolean;
  /** how this step is composed: where the words sit against the picture */
  layout: 'split' | 'top' | 'flip' | 'below' | 'dark' | 'stagger' | 'center';
};

const STAGES: Stage[] = [
  { id: 'configure', name: 'Configure', line: 'Your offers, ideal customers and rules, set once.', Icon: SlidersHorizontal, Visual: ConfigureVisual, layout: 'split' },
  { id: 'discover', name: 'Discover', line: 'It finds the people who fit.', Icon: Radar, Visual: DiscoverVisual, layout: 'top' },
  { id: 'research', name: 'Research', line: 'It learns what each person cares about.', Icon: Search, Visual: ResearchVisual, layout: 'flip' },
  { id: 'qualify', name: 'Qualify', line: 'Only strong fits move on.', Icon: BadgeCheck, Visual: QualifyPanel, layout: 'below' },
  { id: 'personalize', name: 'Personalize', line: 'One email for one person.', Icon: PenLine, Visual: EmailWindow, link: true, layout: 'dark' },
  { id: 'outreach', name: 'Outreach', line: 'You approve. It checks, then sends.', Icon: Send, Visual: OutreachVisual, layout: 'stagger' },
  { id: 'converse', name: 'Converse', line: 'Every reply, sorted by intent.', Icon: MessagesSquare, Visual: RepliesPanel, layout: 'center' },
];

/* one row: watches itself for the loops, reports itself to the rail */
function Row({ s, i }: { s: Stage; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const live = new IntersectionObserver(
      ([e]) => {
        el.toggleAttribute('data-live', e.isIntersecting);
        if (e.isIntersecting) el.setAttribute('data-seen', '');
      },
      { threshold: 0.3 },
    );
    live.observe(el);
    return () => live.disconnect();
  }, []);
  const { Visual } = s;
  return (
    <div ref={ref} id={`step-${s.id}`} className="wf-row tr-row" data-layout={s.layout} data-tint={i % 3}>
      <div className="wf-copy">
        <h3 className="dx-split-h">
          <span>{s.name}.</span> {s.line}
        </h3>
        {s.link ? (
          <Link href="/use-cases" className="dx-textlink">
            See use cases <ArrowRight size={15} strokeWidth={1.8} />
          </Link>
        ) : null}
      </div>
      <div className="wf-stage">
        <Visual />
      </div>
    </div>
  );
}

export default function WorkflowStages() {
  return (
    <Band id="workflow" tone="flat">
      <div className="wf-rows mx-auto max-w-[1272px]">
        {STAGES.map((s, i) => (
          <Row key={s.id} s={s} i={i} />
        ))}
      </div>
    </Band>
  );
}
