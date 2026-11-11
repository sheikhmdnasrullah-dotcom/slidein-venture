'use client';

/**
 * WHO IT'S FOR: the answer to "is this for me" right after "how does it run".
 * A typographic wall of industry names (from content/useCases.ts), each one a
 * door to the use-cases page. Only the first eight, the ones that read the same
 * in any market; the full list lives on /use-cases.
 */

import '@/app/styles/home-sections.css';
import SplitTitle from '@/components/Sections/SplitTitle';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Band } from '@/components/Sections/primitives';
import { USE_CASES } from '@/content/useCases';

const SHOWN = USE_CASES.slice(0, 8);

export default function UseCasesTeaser() {
  return (
    <Band id="who" tone="flat">
      <div className="uw mx-auto max-w-[1272px]">
        <SplitTitle className="sb-h" parts={['For every team that ', { mark: 'writes to its customers' }, '.']} />
        <ul className="uw-wall">
          {SHOWN.map((u, i) => (
            <li key={u.slug} style={{ ['--i' as string]: i }}>
              <Link href="/use-cases" className="uw-name">
                {u.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/use-cases" className="uw-all">
          See all use cases
          <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
    </Band>
  );
}
