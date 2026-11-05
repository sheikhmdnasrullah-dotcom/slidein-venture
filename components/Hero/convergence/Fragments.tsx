/**
 * Fragment faces for the convergence visual. Pure markup, no state.
 * Raw fragments are paper-grey and structurally different from one another;
 * outputs share one crisp family (glyph · label · chip · evidence bars).
 * Text is limited to the content/stages.ts vocabulary; everything else is a
 * skeleton bar, per the site's Rule 0.
 */

import type { RawKind } from './layout';

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
