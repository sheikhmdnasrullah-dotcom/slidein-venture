'use client';

/**
 * LET'S TALK — the nav's contact affordance
 * ---------------------------------------------------------------------------
 * This used to open a centred, portalled dialog on HOVER. It is now a link to
 * /contact, and the panel is gone with it. Three reasons, all of which the
 * panel's own header comments were already working around rather than solving:
 *
 *   · Hover-open needed a 340ms grace timer, because a centred panel has no
 *     contiguous hover path from a nav button at the top of the screen. That is
 *     a workaround for opening something nobody asked to open.
 *   · It dismissed on scroll — the panel could appear unbidden, so scrolling had
 *     to kill it. The contact moment on the site should not be something a
 *     visitor gets rid of by scrolling.
 *   · It had no URL. Nobody could link to it, bookmark it, or land on it from
 *     an email signature.
 *
 * What survives is the button itself: the arrow rotates to -45° on hover the
 * way it rotated on open, and the same premium shadow/lift language applies.
 * `aria-expanded` / `aria-haspopup` are gone — this is a link now, and
 * announcing a dialog that does not exist is worse than announcing nothing.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const SPRING_FAST = { type: 'spring', bounce: 0.1, duration: 0.55 } as const;

/* --accent, not --accent-vivid: this is TEXT. Vivid orange as type reaches
   2.73:1 on paper. Same hue, different lightness — see the tone contract. */
const RED_TEXT = 'var(--accent)';

export default function LetsTalkButton({ isMobile = false }: { isMobile?: boolean }) {
  /* /contact is not in `navLinks`, so the nav's own active marker can never
     land on it. The CTA carries its own: on the contact page it fills solid
     orange instead of sitting as paper with orange type, which is the same
     "you are here" signal the nav items get, in the CTA's vocabulary. */
  const pathname = usePathname() || '/';
  const isHere = pathname === '/contact' || pathname.startsWith('/contact/');

  return (
    <motion.div
      whileHover="hover"
      whileTap={{ scale: 0.985 }}
      initial="rest"
      animate="rest"
      className={isMobile ? 'w-full' : 'inline-block'}
    >
      <Link
        href="/contact"
        aria-current={isHere ? 'page' : undefined}
        className={`btn-premium group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-[14px] font-[600] whitespace-nowrap outline-none ${
          isMobile ? 'w-full justify-center py-3.5' : ''
        }`}
        style={{
          background: isHere
            ? 'linear-gradient(160deg, var(--color-brand-lift), var(--color-brand))'
            : 'var(--surface)',
          color: isHere ? 'var(--on-accent)' : RED_TEXT,
          boxShadow: isHere ? 'var(--shadow-raised)' : 'var(--shadow-contact)',
          letterSpacing: '-0.01em',
        }}
      >
        {/* Orange wash wipes across on hover — the same gesture the contact
            page's own cards use, so the button previews its destination. Off
            when the button is already the current page: there is nothing left
            to preview, and a wash over a solid fill just muddies it. */}
        {!isHere && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            style={{ background: 'var(--accent-wash)' }}
          />
        )}
        <motion.span
          variants={{ rest: { rotate: 0 }, hover: { rotate: -45 } }}
          transition={SPRING_FAST}
          className="relative inline-flex items-center justify-center"
          aria-hidden="true"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 11L11 2M11 2H4M11 2v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
        <span className="relative">Let&apos;s Talk</span>
      </Link>
    </motion.div>
  );
}
