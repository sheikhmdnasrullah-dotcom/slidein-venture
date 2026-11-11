/**
 * SPLIT TITLE: a heading whose words each sit in their own mask, so on scroll they
 * can rise one by one (see app/styles/scroll-motion.css, .sw). Plain words in, plain
 * heading out; `mark` parts take the orange underline. No client code needed.
 */

import type { ElementType } from 'react';

type Part = string | { mark: string };

export default function SplitTitle({
  parts,
  className,
  as: Tag = 'h2',
}: {
  parts: Part[];
  className?: string;
  as?: ElementType;
}) {
  let n = 0;
  const words = (text: string) =>
    text
      .split(/(\s+)/)
      .filter((w) => w !== '')
      .map((w, k) =>
        /^\s+$/.test(w) ? (
          <span key={`s${k}`}> </span>
        ) : (
          <span key={`w${k}`} className="sw">
            <span className="sw__in" style={{ ['--i' as string]: n++ }}>
              {w}
            </span>
          </span>
        ),
      );
  return (
    <Tag className={className}>
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <span key={i}>{words(p)}</span>
        ) : (
          <mark key={i}>{words(p.mark)}</mark>
        ),
      )}
    </Tag>
  );
}
