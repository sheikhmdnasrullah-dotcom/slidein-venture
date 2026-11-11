'use client';

/**
 * DASHBOARD: the operating view of one run. Five screens, each its own idea:
 *   Overview   what needs you, and the last things that happened
 *   Prospects  one table, a status for each person
 *   Approvals  the draft, its sources, and the checks, with the one button that sends
 *   Replies    a list and the thread beside it
 *   Activity   the ledger, in order
 * Everything on screen is the sample run from how-it-works-video/data/fixtures.ts
 * (the same people and the same morning the rest of the site uses). No stage
 * wizard, no icons, no placeholder bars: a plain, quiet workspace.
 */

import '@/app/styles/dashboard.css';
import { Check } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import {
  business,
  checks,
  email,
  findings,
  held,
  ledger,
  match,
  rawRecords,
  replies,
} from '@/how-it-works-video/data/fixtures';

type View = 'overview' | 'prospects' | 'approvals' | 'replies' | 'activity';

const NAV: { id: View; label: string; count?: number }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'prospects', label: 'Prospects', count: 3 },
  { id: 'approvals', label: 'Approvals', count: 1 },
  { id: 'replies', label: 'Replies', count: replies.length },
  { id: 'activity', label: 'Activity', count: ledger.length },
];

const initials = (n: string) =>
  n
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

const person = rawRecords[0]; // Emily Foster, the prospect this run follows
const other = rawRecords[2]; // Daniel Reyes

/* the draft with its personalized lines marked, each pointing at a source */
function Draft() {
  const body = email.lines[1];
  const out: ReactNode[] = [];
  let rest = body;
  email.personalized.forEach((p, k) => {
    const at = rest.indexOf(p.span);
    if (at < 0) return;
    out.push(rest.slice(0, at));
    out.push(
      <span key={p.finding} className="dbx-pers">
        {p.span}
        <sup>{k + 1}</sup>
      </span>,
    );
    rest = rest.slice(at + p.span.length);
  });
  out.push(rest);
  return (
    <div className="dbx-mail">
      <p>{email.lines[0]}</p>
      <p>{out.map((n, i) => <span key={i}>{n}</span>)}</p>
      <p>{email.lines[2]}</p>
      <p>{email.lines[3]}</p>
      <p className="dbx-sig">{email.lines[4]}</p>
    </div>
  );
}

function Overview({ go }: { go: (v: View) => void }) {
  const rows = [
    { tone: 'now', who: person.name, what: `Draft ready: ${email.subject}`, to: 'approvals' as View, cta: 'Review' },
    { tone: 'hold', who: held.who, what: `Held: ${held.reason.toLowerCase()}`, to: 'prospects' as View, cta: 'Open' },
    { tone: 'done', who: replies[1].from, what: `Replied: ${replies[1].intent.toLowerCase()}, suppressed`, to: 'replies' as View, cta: 'Read' },
  ];
  return (
    <div className="dbx-pane">
      <section>
        <h3 className="dbx-h">Needs you</h3>
        <ul className="dbx-list">
          {rows.map((r) => (
            <li key={r.who} className="dbx-row" data-tone={r.tone}>
              <i className="dbx-dot" aria-hidden="true" />
              <span className="dbx-grow">
                <b>{r.who}</b>
                <em>{r.what}</em>
              </span>
              <button type="button" className="dbx-link" onClick={() => go(r.to)}>
                {r.cta}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="dbx-h">Latest</h3>
        <ul className="dbx-feed">
          {ledger.slice(-3).map(([t, what]) => (
            <li key={t + what}>
              <time>{t}</time>
              <span>{what}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Prospects() {
  const rows = [
    { n: person.name, t: person.title, o: person.org, s: 'CSV, directory', st: `Matched: ${match.offer}`, tone: 'now' },
    { n: other.name, t: other.title, o: other.org, s: other.source, st: 'Suppressed', tone: 'done' },
    { n: held.who, t: '—', o: '—', s: '—', st: 'Held', tone: 'hold' },
  ];
  return (
    <div className="dbx-pane dbx-pane--wide">
      <table className="dbx-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Source</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.n}>
              <td>
                <span className="dbx-av">{initials(r.n)}</span>
                <span className="dbx-name">
                  <b>{r.n}</b>
                  <em>{r.t}</em>
                </span>
              </td>
              <td>{r.o}</td>
              <td className="dbx-mute">{r.s}</td>
              <td>
                <span className="dbx-tag" data-tone={r.tone}>
                  {r.st}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Approvals() {
  const [approved, setApproved] = useState(false);
  return (
    <div className="dbx-pane dbx-pane--split">
      <article className="dbx-doc">
        <header>
          <p className="dbx-k">To</p>
          <p>{email.to}</p>
          <h3 className="dbx-subject">{email.subject}</h3>
        </header>
        <Draft />
        <ol className="dbx-src">
          {email.personalized.map((p) => {
            const f = findings.find((x) => x.id === p.finding);
            return (
              <li key={p.finding}>
                {f?.text}
                <code>{f?.source}</code>
              </li>
            );
          })}
        </ol>
      </article>
      <aside className="dbx-side">
        <h3 className="dbx-h">Checks</h3>
        <ul className="dbx-checks">
          {checks.map((c) => (
            <li key={c}>
              <Check size={13} strokeWidth={2.4} aria-hidden="true" />
              {c}
            </li>
          ))}
        </ul>
        <button type="button" className="dbx-btn" data-done={approved} onClick={() => setApproved(true)} disabled={approved}>
          {approved ? (
            <>
              <Check size={14} strokeWidth={2.4} aria-hidden="true" /> Approved
            </>
          ) : (
            'Approve'
          )}
        </button>
      </aside>
    </div>
  );
}

function Replies() {
  const [sel, setSel] = useState(0);
  const r = replies[sel];
  const optOut = r.intent === 'Opt-out';
  return (
    <div className="dbx-pane dbx-pane--split dbx-pane--replies">
      <ul className="dbx-inbox">
        {replies.map((x, i) => (
          <li key={x.from}>
            <button type="button" className="dbx-msg" aria-pressed={sel === i} onClick={() => setSel(i)}>
              <span className="dbx-av">{initials(x.from)}</span>
              <span className="dbx-grow">
                <b>{x.from}</b>
                <em>{x.text}</em>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <article className="dbx-thread" key={sel}>
        <header>
          <h3 className="dbx-subject">{r.from}</h3>
          <span className="dbx-tag" data-tone={optOut ? 'done' : 'now'}>
            {r.intent}
          </span>
        </header>
        <p className="dbx-quote">{r.text}</p>
        <p className="dbx-note">{optOut ? ledger[ledger.length - 1][1] : `Reply to: ${email.subject}`}</p>
      </article>
    </div>
  );
}

function Activity() {
  return (
    <div className="dbx-pane dbx-pane--wide">
      <ol className="dbx-timeline">
        {ledger.map(([t, what], i) => (
          <li key={t + what} data-last={i === ledger.length - 1}>
            <time>{t}</time>
            <i aria-hidden="true" />
            <span>{what}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Dashboard() {
  const [view, setView] = useState<View>('overview');
  return (
    <div className="dbx" data-testid="dashboard">
      <div className="dbx-bar">
        <span className="dbx-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <b>{business.name}</b>
        <span className="dbx-profile">{business.profile}</span>
      </div>
      <div className="dbx-body">
        <nav className="dbx-nav" aria-label="Dashboard">
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              className="dbx-item"
              aria-current={view === n.id ? 'page' : undefined}
              onClick={() => setView(n.id)}
            >
              <span>{n.label}</span>
              {n.count ? <em>{n.count}</em> : null}
            </button>
          ))}
        </nav>
        <div className="dbx-main" key={view}>
          {view === 'overview' && <Overview go={setView} />}
          {view === 'prospects' && <Prospects />}
          {view === 'approvals' && <Approvals />}
          {view === 'replies' && <Replies />}
          {view === 'activity' && <Activity />}
        </div>
      </div>
    </div>
  );
}
