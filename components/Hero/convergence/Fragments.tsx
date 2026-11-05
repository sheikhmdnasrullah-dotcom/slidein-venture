/**
 * Fragment faces for the convergence visual. Pure markup, no state.
 * Raw fragments are paper-grey and structurally different from one another;
 * outputs share one crisp family (glyph · label · chip · evidence bars).
 * Text is limited to the content/stages.ts vocabulary; everything else is a
 * skeleton bar, per the site's Rule 0.
 */

import type { OutKind, RawKind } from './layout';

const Bar = ({ w, dark = false }: { w: number | string; dark?: boolean }) => (
  <i className={dark ? 'cv-bar cv-bar--dark' : 'cv-bar'} style={{ width: typeof w === 'number' ? `${w}%` : w }} />
);

export function RawFace({ kind, label }: { kind: RawKind; label: string }) {
  const lab = <span className="cv-lab">{label}</span>;
  switch (kind) {
    case 'doc':
      return (
        <div className="cv-doc">
          {lab}
          <Bar w={82} />
          <Bar w={54} />
        </div>
      );
    case 'card':
      return (
        <>
          <span className="cv-avatar" />
          <div className="cv-col">
            {lab}
            <Bar w={78} />
            <Bar w={46} />
          </div>
        </>
      );
    case 'snippet':
      return (
        <>
          <span className="cv-quote" />
          <div className="cv-col">
            {lab}
            <Bar w={92} />
            <Bar w={64} />
          </div>
        </>
      );
    case 'rows':
      return (
        <div className="cv-col">
          {lab}
          <div className="cv-line">
            <b className="cv-sq" />
            <Bar w={52} />
            <Bar w={22} />
          </div>
          <div className="cv-line">
            <b className="cv-sq" />
            <Bar w={38} />
            <Bar w={30} />
          </div>
        </div>
      );
    case 'chips':
      return (
        <div className="cv-col">
          {lab}
          <div className="cv-line">
            <span className="cv-chip cv-chip--a" />
            <span className="cv-chip cv-chip--b" />
          </div>
        </div>
      );
    case 'marker':
      return (
        <div className="cv-col">
          {lab}
          <div className="cv-line cv-flow">
            <b className="cv-dia" />
            <i className="cv-run" />
            <b className="cv-sq" />
          </div>
        </div>
      );
    case 'message':
      return (
        <>
          <span className="cv-avatar cv-avatar--sm" />
          <div className="cv-col">
            {lab}
            <Bar w={88} />
            <Bar w={58} />
          </div>
        </>
      );
  }
}

const Glyph = ({ kind }: { kind: OutKind }) => {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (kind) {
    case 'evidence':
      return (
        <svg {...common}>
          <path d="M4 4.5v11" />
          <path d="M8 6h8M8 10h8M8 14h5" />
        </svg>
      );
    case 'qualification':
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="13" height="13" rx="3" />
          <path d="M7 10.2l2.2 2.2L13.2 8" />
        </svg>
      );
    case 'drafts':
      return (
        <svg {...common}>
          <rect x="6.5" y="3" width="10" height="12" rx="2" />
          <path d="M4 6.5v8a2 2 0 002 2h7" />
          <path d="M9.5 7.5h4M9.5 10.5h4" />
        </svg>
      );
    case 'sent':
      return (
        <svg {...common}>
          <rect x="2.8" y="4.5" width="14.4" height="11" rx="2.2" />
          <path d="M3.4 5.6L10 10.6l6.6-5" />
        </svg>
      );
    case 'replies':
      return (
        <svg {...common}>
          <path d="M4 5.5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H9l-3.5 3v-3H6a2 2 0 01-2-2z" />
        </svg>
      );
  }
};

export function OutFace({ kind, label, chip }: { kind: OutKind; label: string; chip: string }) {
  return (
    <>
      <span className="cv-glyph cv-hide-n">
        <Glyph kind={kind} />
      </span>
      <div className="cv-col cv-col--out">
        <div className="cv-toprow">
          <span className="cv-lab cv-lab--out">{label}</span>
          <span className="cv-tag cv-hide-n">{chip}</span>
        </div>
        <div className="cv-line">
          <Bar w={kind === 'drafts' ? 70 : 62} dark />
          <Bar w={kind === 'sent' ? 18 : 26} />
        </div>
      </div>
    </>
  );
}
