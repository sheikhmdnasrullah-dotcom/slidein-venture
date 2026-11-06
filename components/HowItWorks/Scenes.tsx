import { Fragment, type CSSProperties, type ReactNode } from 'react';
import {
  BellOff, Check, Clapperboard, Lock, Mail, Pause, Podcast, Radio, Rocket, Send, ShieldCheck, Target, Zap,
} from 'lucide-react';
import {
  business, checks, criteria, email, findings, held, intents, ledger, match, overview, rawRecords, replies,
} from '@/how-it-works-video/data/fixtures';

/** Absolute placement on the 1280 x 720 artboard. */
const P = (x: number, y: number, w?: number, h?: number): CSSProperties => ({
  left: x,
  top: y,
  ...(w !== undefined ? { width: w } : null),
  ...(h !== undefined ? { height: h } : null),
});

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          {i > 0 ? ' ' : null}
          <span className="hw-wd">{w}</span>
        </Fragment>
      ))}
    </>
  );
}

const Thr = () => <svg className="hw-thr" viewBox="0 0 1280 720" aria-hidden="true" />;
const initials = (n: string) => n.split(' ').map((p) => p[0]).join('').slice(0, 2);
const Avatar = ({ n, big }: { n: string; big?: boolean }) => (
  <span className={`hw-av${big ? ' hw-av--big' : ''}`}>{initials(n)}</span>
);

const GLYPH = [Clapperboard, Podcast, Rocket];
const NODE = [ShieldCheck, Send, Target, Zap, BellOff, Radio, Mail];
const T3 = rawRecords[0];

/* ── 1 · Setup ─────────────────────────────────────────────────────────── */
function S1() {
  return (
    <div className="hw-s" data-s="1">
      <div className="hw-card s1-sheet" style={P(160, 160, 960, 400)}>
        <svg className="s1-border" viewBox="0 0 960 400" aria-hidden="true">
          <rect x="0.5" y="0.5" width="959" height="399" rx="16" pathLength={1} />
        </svg>
        <div className="s1-col" style={P(32, 32, 288)}>
          <p className="hw-lab">Business</p>
          <p className="s1-name">{business.name}</p>
          <p className="s1-line">{business.line}</p>
        </div>
        <div className="s1-col" style={P(336, 32, 288)}>
          <p className="hw-lab">Offers</p>
          {business.offers.map((o, i) => {
            const G = GLYPH[i];
            return (
              <div key={o} className="hw-row s1-offer">
                <G size={16} strokeWidth={1.5} /> {o}
              </div>
            );
          })}
        </div>
        <div className="s1-col" style={P(640, 32, 288)}>
          <p className="hw-lab">Ideal customer</p>
          {business.icp.map((c) => (
            <span key={c} className="hw-chip s1-chip">{c}</span>
          ))}
        </div>
        <div className="s1-foot" style={{ left: 32, right: 32, bottom: 28 }}>
          <span className="hw-tag hw-tag--ink s1-ver" data-m="s1-ver">{business.profile}</span>
          <button type="button" tabIndex={-1} className="hw-btn s1-save" data-m="s1-save">
            <span className="s1-save-a">Save setup</span>
            <span className="s1-save-b"><Check size={15} strokeWidth={2.2} /> Saved</span>
          </button>
          <i className="s1-ripple" aria-hidden="true" />
        </div>
      </div>
      <Thr />
    </div>
  );
}

/* ── 2 · Sources ───────────────────────────────────────────────────────── */
function S2() {
  const [r1, r2, r3] = rawRecords;
  const row = (r: typeof r1, cls: string, y: number) => (
    <div className={`hw-card hw-rowcard ${cls}`} style={P(280, y, 936, 64)}>
      <Avatar n={r.name} />
      <span className="hw-rc-name">{r.name}</span>
      <span className="hw-rc-sub">{r.title} · {r.org}</span>
    </div>
  );
  return (
    <div className="hw-s" data-s="2">
      {[176, 256, 336].map((y, i) => (
        <div key={i} className="s2-inlet" style={P(64, y, 136, 64)} data-m={`s2-in${i}`}>
          <span className="hw-mono">{rawRecords[i].source === 'csv' ? 'CSV IMPORT' : rawRecords[i].source === 'directory' ? 'DIRECTORY' : 'CONFERENCE'}</span>
        </div>
      ))}
      <div className="s2-br" style={P(268, 168, 960, 160)} />
      <span className="hw-tag s2-same" style={P(280, 134)}>Same person</span>
      <span className="hw-mono s2-why" style={P(404, 140)}>name + domain match</span>
      {row(r2, 's2-row2', 256)}
      {row(r3, 's2-row3', 336)}
      <div className="s2-prov hw-mono" style={P(296, 244, 700)}>
        <p>{r1.source} · {r1.meta}</p>
        <p>{r2.source} · {r2.meta}</p>
      </div>
      <p className="s2-count" style={P(280, 600)}>
        <b data-c="rec">3</b> records, <b data-c="pro">2</b> prospects
      </p>
      <Thr />
    </div>
  );
}

/* ── 3 · Research ──────────────────────────────────────────────────────── */
function S3() {
  const [f1, f2, f3, x1] = findings;
  const chip = (f: typeof f1, y: number, cls: string, m: string) => (
    <div className={`hw-card s3-chip ${cls}`} style={P(928, y, 288, 76)} data-m={m}>
      <span className="s3-id hw-mono">{f.id}</span>
      <span className="s3-tx">{f.text}</span>
      <span className="s3-dom hw-mono">{f.source}</span>
    </div>
  );
  return (
    <div className="hw-s" data-s="3">
      <div className="hw-card s3-win" style={P(400, 112, 480, 488)}>
        <div className="s3-bar">
          <i /><i /><i />
          <span className="s3-url hw-mono">calloway.io/podcast/41</span>
        </div>
        <div className="s3-page">
          <p className="s3-h"><mark className="hw-hl" data-m="hl2">Episode 41: Moving off spreadsheets</mark></p>
          <p className="s3-by">Host: {T3.name}</p>
          <p className="s3-p">
            A <mark className="hw-hl" data-m="hl1">weekly podcast</mark> for operations teams on replacing shared
            spreadsheets with systems that keep their own history.
          </p>
          <div className="s3-about">
            <p className="hw-lab">About</p>
            <p className="s3-p">Calloway Systems is a <mark className="hw-hl" data-m="hl3">team of 38</mark>.</p>
          </div>
          <i className="s3-scan" />
        </div>
        <i className="s3-g s3-g1" /><i className="s3-g s3-g2" /><i className="s3-g s3-g3" />
      </div>
      <p className="hw-lab s3-flab" style={P(928, 116)}>Findings</p>
      {chip(f1, 148, 's3-c1', 'c1')}
      {chip(f2, 236, 's3-c2', 'c2')}
      {chip(f3, 324, 's3-c3', 'c3')}
      <div className="hw-card s3-chip s3-x1" style={P(928, 412, 288, 64)} data-m="x1">
        <span className="s3-id hw-mono">{x1.id}</span>
        <span className="s3-tx">{x1.text}</span>
        <span className="hw-tag hw-tag--hatch s3-ns">No source</span>
      </div>
      <Thr />
    </div>
  );
}

/* ── 4 · Matching ──────────────────────────────────────────────────────── */
function S4() {
  const offers = business.offers;
  return (
    <div className="hw-s" data-s="4">
      <div className="s4-crit" style={P(64, 296, 336)}>
        {criteria.map((c, i) => (
          <div key={c.label} className="hw-row s4-row" data-m={`crit${i}`}>
            <span className="s4-name">{c.label}</span>
            <svg className="s4-tick" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8.5 6.5 12 13 4.5" pathLength={1} />
            </svg>
            <span className="s4-dash">–</span>
            <span className="hw-mono s4-val">{c.value}</span>
          </div>
        ))}
      </div>
      <div className="hw-card s4-why" style={P(440, 316, 300, 168)} data-m="why">
        <p className="hw-lab">Reasons</p>
        {match.reasons.map((r, i) => (
          <p key={r} className="s4-reason" data-m={`rs${i}`}>{r}</p>
        ))}
      </div>
      {[0, 2].map((i) => (
        <div key={i} className={`hw-card s4-offer s4-o${i}`} style={P(760, i === 0 ? 96 : 336, 456, 108)}>
          <span className="s4-oname">{offers[i]}</span>
          <i className="s4-bar"><b /></i>
        </div>
      ))}
      <Thr />
    </div>
  );
}

/* ── 5 · Drafting ──────────────────────────────────────────────────────── */
function S5() {
  const L = email.lines;
  return (
    <div className="hw-s" data-s="5">
      <p className="hw-lab" style={P(64, 112)}>Evidence</p>
      {findings.slice(0, 3).map((f, i) => (
        <div key={f.id} className={`hw-card s3-chip s5-ev s5-e${i}`} style={P(64, 144 + i * 76, 320, 60)} data-m={`ev${i}`}>
          <span className="s3-id hw-mono">{f.id}</span>
          <span className="s3-tx">{f.text}</span>
          <span className="s3-dom hw-mono">{f.source}</span>
        </div>
      ))}
      <div className="hw-card s5-comp" style={P(448, 96, 768, 528)}>
        <div className="s5-field"><span className="hw-mono">To</span><b className="s5-to">{email.to}</b></div>
        <div className="s5-field"><span className="hw-mono">Subject</span><b className="s5-sub">{email.subject}</b></div>
        <div className="s5-body">
          <p className="s5-l"><Words text={L[0]} /></p>
          <p className="s5-l s5-l2" data-m="para">
            <Words text="I've been listening to your" />{' '}
            <span className="hw-ps" data-m="ps1"><Words text="weekly podcast" /></span>
            {', '}<Words text="and" />{' '}
            <span className="hw-ps" data-m="ps2"><Words text="episode 41 on moving off spreadsheets" /></span>{' '}
            <Words text="stayed with me." />
          </p>
          <p className="s5-l"><Words text={L[2]} /></p>
          <p className="s5-l"><Words text={L[3]} /></p>
          <p className="s5-l s5-sig"><Words text={L[4]} /></p>
        </div>
        <span className="hw-tag s5-draft">Draft</span>
        <i className="s5-gut s5-g1" data-m="g1" />
        <i className="s5-gut s5-g2" data-m="g2" />
      </div>
      <div className="hw-card s5-env" style={P(96, 276, 64, 44)}><Mail size={20} strokeWidth={1.5} /></div>
      <Thr />
    </div>
  );
}

/* ── 6 · Safeguards ────────────────────────────────────────────────────── */
export const NODE_X = (i: number) => 176 + i * 160;
function S6() {
  return (
    <div className="hw-s" data-s="6">
      <svg className="s6-line" viewBox="0 0 1280 720" aria-hidden="true">
        <path className="s6-base" d={`M${NODE_X(0)} 340H${NODE_X(6)}`} pathLength={1} />
        <path className="s6-dash" d={`M${NODE_X(0)} 340H${NODE_X(6)}`} />
      </svg>
      {checks.map((c, i) => {
        const Ic = NODE[i];
        return (
          <div key={c} className={`hw-card s6-node s6-n${i}`} style={P(NODE_X(i) - 28, 312, 56, 56)}>
            <Ic size={20} strokeWidth={1.5} />
            <svg className="s6-pass" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5" pathLength={1} /></svg>
            <Pause className="s6-pause" size={18} strokeWidth={2} />
            <span className="hw-mono s6-lab" style={{ left: -28, width: 112 }}>{c}</span>
          </div>
        );
      })}
      <span className="hw-tag hw-tag--hatch s6-req" style={P(NODE_X(0) - 40, 262)}>Required</span>
      <div className="s6-warm" style={P(NODE_X(2), 452, 300)}>
        <span className="hw-mono">Warmup</span>
        <i><b /></i>
      </div>
      <div className="s6-tray" style={P(40, 484, 372, 128)}>
        <span className="hw-lab">Held</span>
        <span className="hw-chip s6-reason">{held.reason}</span>
      </div>
      <div className="hw-card s6-tok s6-ta" style={P(0, 0)}><Mail size={14} strokeWidth={1.6} /> <span>{replies[0].from}</span></div>
      <div className="hw-card s6-tok s6-tb" style={P(0, 0)}><Mail size={14} strokeWidth={1.6} /> <span>{held.who}</span></div>
      <span className="hw-tag hw-tag--pass s6-sent" style={P(NODE_X(6) - 24, 262)}>Sent</span>
      <p className="s6-count" style={P(900, 600, 316)}><b data-c="s">0</b> sent · <b data-c="h">0</b> held</p>
      <div className="hw-card s6-reply" style={P(NODE_X(6) - 120, 412, 240, 56)}>
        <span className="hw-mono">Reply</span>
        <span>{replies[0].text}</span>
      </div>
      <Thr />
    </div>
  );
}

/* ── 7 · Replies ───────────────────────────────────────────────────────── */
function S7() {
  return (
    <div className="hw-s" data-s="7">
      {replies.map((r, i) => (
        <div key={r.from} className={`hw-card s7-conv s7-c${i}`} style={P(64, 128 + i * 160, 496, 144)} data-m={`cv${i}`}>
          <div className="s7-top"><Avatar n={r.from} /><b>{r.from}</b></div>
          <p className="s7-sent hw-mono" data-m={`sent${i}`}>Sent · {email.subject}</p>
          <p className="s7-reply" data-m={`rep${i}`}>{r.text}</p>
        </div>
      ))}
      <div className="s7-cls" style={P(600, 128, 280)}>
        <p className="hw-lab">Intent</p>
      </div>
      {intents.map((n, i) => (
        <div key={n} className={`hw-card s7-lane s7-l${i}`} style={P(600, 156 + i * 64, 280, 52)} data-m={`ln${i}`}>
          {n}
        </div>
      ))}
 <i className="s7-ev s7-ev0" /><i className="s7-ev s7-ev1" />
      <div className="hw-card s7-sup" style={P(920, 424, 296, 200)} data-m="sup">
        <p className="hw-lab">Suppression</p>
        <div className="s7-sr">
          <b>daniel@fernhill.ai</b>
          <span className="hw-tag hw-tag--hatch">Opt-out</span>
          <span className="hw-mono">09:12</span>
        </div>
      </div>
      <Thr />
    </div>
  );
}

/* ── 8 · Ledger ────────────────────────────────────────────────────────── */
function S8() {
  const maxI = Math.max(...Object.values(overview.intents));
  return (
    <div className="hw-s" data-s="8">
      <div className="hw-card s8-led" style={P(64, 96, 576, 528)}>
        <p className="hw-lab s8-hd">Ledger</p>
        {ledger.map(([t, x], i) => (
          <div key={t} className={`s8-r s8-r${i}`} data-m={`lr${i}`}>
            <span className="hw-mono">{t}</span>
            <i />
            <span>{x}</span>
          </div>
        ))}
      </div>
      <div className="hw-card s8-ov" style={P(688, 96, 528, 528)} data-m="ov">
        <div className="s8-ovh">
          <p className="hw-lab">Overview</p>
          <span className="hw-tag hw-tag--ink s8-ro"><Lock size={12} strokeWidth={2} /> Read only</span>
        </div>
        <p className="hw-mono s8-win">{overview.window}</p>
        <div className="s8-sec">
          <p className="s8-t">Sent vs held</p>
          <div className="s8-stack"><b style={{ flex: overview.sentVsHeld.sent }} /><i style={{ flex: overview.sentVsHeld.held }} /></div>
          <p className="hw-mono s8-leg"><span data-c="sent">{overview.sentVsHeld.sent}</span> sent · <span data-c="held">{overview.sentVsHeld.held}</span> held</p>
        </div>
        <div className="s8-sec">
          <p className="s8-t">Replies by intent</p>
          {Object.entries(overview.intents).map(([k, v]) => (
            <div key={k} className="s8-bar"><span>{k}</span><i><b style={{ width: `${(v / maxI) * 100}%` }} /></i><em className="hw-mono" data-v={v}>{v}</em></div>
          ))}
        </div>
        <div className="s8-sec">
          <p className="s8-t">Sources used</p>
          {Object.entries(overview.sources).map(([k, v]) => (
            <div key={k} className="s8-bar"><span>{k}</span><i><b style={{ width: `${v}%` }} /></i><em className="hw-mono" data-v={v}>{v}%</em></div>
          ))}
        </div>
      </div>
      <Thr />
    </div>
  );
}

export function Scenes(): ReactNode {
  return (
    <>
      <S1 /><S2 /><S3 /><S4 /><S5 /><S6 /><S7 /><S8 />
    </>
  );
}

/* ── Persistent objects: they travel across scenes ─────────────────────── */
export function Persist() {
  return (
    <>
      <div className="hw-hud" style={P(64, 40)} data-m="hud" aria-hidden="true">
        <i className="hw-hud-bead" />
        <b>{business.profile}</b>
        <span className="hw-tag hw-tag--ink">Saved</span>
        <span className="hw-tag hw-tag--next" data-m="hud-next">Next run</span>
      </div>
      <div className="hw-card hw-pc">
        <div className="pc-row">
          <Avatar n={T3.name} />
          <span className="hw-rc-name">{T3.name}</span>
          <span className="hw-rc-sub">{T3.title} · {T3.org}</span>
          <span className="pc-src">
            <span className="hw-chip">csv</span><span className="hw-chip">directory</span><span className="hw-tag">2 sources</span>
          </span>
        </div>
        <div className="pc-card">
          <Avatar n={T3.name} big />
          <b className="pc-name">{T3.name}</b>
          <span className="pc-sub">{T3.title}</span>
          <span className="pc-sub">{T3.org}</span>
          <span className="hw-chip pc-a">3 findings, 3 sources</span>
          <span className="pc-b" data-m="pips">
            {[0, 1, 2, 3, 4].map((i) => <i key={i} />)}
          </span>
        </div>
      </div>
      <div className="hw-card hw-oc">
        <div className="oc-card">
          <span className="s4-oname">{match.offer}</span>
          <i className="s4-bar"><b /></i>
          <span className="hw-tag hw-tag--ink oc-match">Match</span>
        </div>
        <div className="oc-chip">Offer: {match.offer}</div>
      </div>
      <svg className="hw-cursor" width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <path d="M3 2 18 9.5 11 11.5 9 18.5Z" />
      </svg>
    </>
  );
}
