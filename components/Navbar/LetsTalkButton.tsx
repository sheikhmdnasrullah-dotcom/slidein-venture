'use client';

/**
 * LET'S TALK — the contact panel
 * ---------------------------------------------------------------------------
 * Hovering the nav button opens a large centred panel with the page blurred
 * behind it. It was a 310px card tucked under the button; at that size the two
 * email addresses set at 13px and the whole thing read as a tooltip you had to
 * lean in to use. This is the contact moment on the site — it gets the screen.
 *
 * THREE THINGS THAT ARE NOT OBVIOUS
 *
 * 1. IT MUST BE PORTALLED. The nav is `fixed ... -translate-x-1/2`, and a
 *    transform on an ancestor makes it the containing block for `position:
 *    fixed` descendants. Rendered in place, this panel would centre itself on
 *    the NAV PILL rather than on the viewport, and the backdrop would cover the
 *    pill instead of the page. It goes to document.body.
 *
 * 2. HOVER-OPEN NEEDS A GRACE PERIOD, NOT A HOVER BRIDGE. The panel is centred
 *    and the button is at the top of the screen, so the pointer crosses the
 *    scrim to reach it — there is no contiguous hover path to keep. Leaving the
 *    button therefore schedules a close rather than doing one, and entering the
 *    panel cancels it. A brush past the button self-dismisses; a deliberate
 *    move to the panel does not.
 *
 * 3. IT IS A DIALOG, SO IT CLOSES LIKE ONE. Escape, a scrim click and any
 *    scroll all dismiss it. Scroll matters most: the panel opens from a hover,
 *    which means it can open when the reader did not ask for it, and the first
 *    thing someone does to get rid of something unwanted is scroll.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/* ─── Spring config mirrors the Framer component's transition1/2/7 ─────── */
const SPRING_FAST   = { type: 'spring', bounce: 0.1, duration: 0.55 } as const;
const SPRING_PANEL  = { type: 'spring', bounce: 0.16, duration: 0.62 } as const;
const SPRING_AVATAR = { type: 'spring', bounce: 0.2, duration: 0.8 } as const;

/* ─── Brand colours ─────────────────────────────────────────────────────── */
/* Two names for one orange, and the split is load-bearing:
   --accent       the instance that clears 4.5:1 as TEXT on the current band
   --accent-vivid the full-chroma instance, for FILLS, strokes and icons
   Setting type in --accent-vivid reaches only 2.73:1 on paper. Same hue, same
   Rule 1 — different lightness, because text and a filled chip are not the
   same contrast problem. */
const RED = 'var(--accent-vivid)';
const RED_TEXT = 'var(--accent)';

const CALENDAR_URL = 'https://calendar.notion.so/meet/nasrullah_tanim/schedule';

/* ─── Verified badge SVG (blue checkmark, same path as the Framer source) ─ */
function VerifiedBadge({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 29 29" fill="none" aria-hidden="true">
      <path
        d="M18.38 0l2.37 3.666 4.364.214.221 4.364L29 10.613l-1.989 3.887L29 18.38l-3.666 2.369-.214 4.364-4.364.221L18.387 29 14.5 27.011 10.62 29l-2.369-3.666-4.364-.214-.221-4.364L0 18.387l1.989-3.887L0 10.62l3.666-2.369.214-4.363 4.364-.221L10.613 0 14.5 1.989z"
        fill="#42A5F5"
      />
      <path
        d="M12.7 19.994L8.22 15.512l1.464-1.463 3.045 3.038 6.601-6.401 1.443 1.484z"
        fill="var(--color-paper-25)"
      />
    </svg>
  );
}

/* ─── Email row ───────────────────────────────────────────────────────────
   A row, not a card: the address is the thing being read, so it gets the size
   and the surface stays quiet. Whole row is the link — a 13px "Send" chip as
   the only target was a small hit area for the panel's primary action. */
function EmailRow({ email, label }: { email: string; label: string }) {
  return (
    <Link
      href={`mailto:${email}`}
      className="group flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5 transition-colors duration-200 hover:bg-[var(--surface-2)] sm:px-5 sm:py-4"
      style={{ border: '1px solid var(--rule)' }}
    >
      <span className="flex min-w-0 flex-col gap-1">
        <span className="font-label text-[var(--muted)]">{label}</span>
        <span
          className="truncate text-[15px] font-semibold sm:text-[17px]"
          style={{ color: 'var(--on-surface)', letterSpacing: '-0.01em' }}
        >
          {email}
        </span>
      </span>
      <span
        className="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-all duration-200 group-hover:bg-[var(--on-surface)] group-hover:text-[var(--surface)] sm:text-[13px]"
        style={{ background: 'var(--surface-2)', color: 'var(--on-surface)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        Send
      </span>
    </Link>
  );
}

/* ─── The panel ─────────────────────────────────────────────────────────── */
function ContactPanel({
  onClose,
  onPointerEnter,
  onPointerLeave,
}: {
  onClose: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[990] flex items-center justify-center p-4 sm:p-6">
      {/* ── Scrim ─────────────────────────────────────────────────────────
          The blur is the point: it is what turns a popup into a focus. --scrim
          rather than a literal, so the wash is the same veil every modal on the
          site uses. */}
      <motion.button
        type="button"
        aria-label="Close contact panel"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 cursor-default"
        style={{
          background: 'var(--scrim)',
          backdropFilter: 'blur(18px) saturate(1.1)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.1)',
        }}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Contact Nasrullah Tanim"
        onMouseEnter={onPointerEnter}
        onMouseLeave={onPointerLeave}
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={SPRING_PANEL}
        /* min-h so the panel holds its share of the screen on a laptop instead
           of collapsing to the height of its content. Capped at 88vh so it
           never needs the page to scroll. */
        className="relative flex w-[min(96vw,960px)] flex-col justify-center overflow-y-auto sm:min-h-[min(56vh,520px)]"
        style={{
          maxHeight: '88vh',
          background: 'var(--surface)',
          border: '1px solid var(--rule)',
          borderRadius: 28,
          boxShadow: 'var(--shadow-float)',
        }}
      >
        {/* Close — a real control, not just "click the scrim". */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--muted)] transition-colors duration-200 hover:bg-[var(--surface-2)] hover:text-[var(--on-surface)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="grid gap-8 p-6 sm:p-9 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-10 md:p-11">
          {/* ── Who ───────────────────────────────────────────────────── */}
          <div className="flex flex-col">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={SPRING_AVATAR}
              className="relative w-fit"
            >
              <div
                className="h-[104px] w-[104px] overflow-hidden rounded-3xl sm:h-[124px] sm:w-[124px]"
                style={{ border: '1.5px solid var(--rule)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/profile.png" alt="Nasrullah Tanim" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2">
                <VerifiedBadge size={26} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_FAST, delay: 0.06 }}
              className="mt-6 flex flex-col gap-2"
            >
              <span className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full"
                    style={{ backgroundColor: 'var(--status-live)', opacity: 0.7 }}
                  />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--status-live)' }} />
                </span>
                <span className="font-label text-[var(--status-live)]">Available for work</span>
              </span>

              <h2 className="font-display-sm text-[clamp(1.5rem,3vw,2.1rem)] text-[var(--on-surface)]">
                Nasrullah Tanim
              </h2>
              <p className="font-body text-[15px] text-[var(--muted)]">Founder, SlideIn Venture</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_FAST, delay: 0.14 }}
              className="mt-7"
            >
              <Link
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-bold transition-opacity duration-200 hover:opacity-95"
                style={{ background: RED, color: 'var(--on-accent)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="3" />
                  <path d="M3 9h18M8 2v4M16 2v4" />
                </svg>
                Book a call
              </Link>
            </motion.div>
          </div>

          {/* ── How to reach him ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_FAST, delay: 0.2 }}
            className="flex flex-col justify-center gap-3"
          >
            <p className="font-body mb-1 text-[15px] leading-relaxed text-[var(--muted)]">
              Book a call, or just email — whichever is easier. Replies land the
              same day, most days.
            </p>
            <EmailRow label="Direct email" email="nasrullahtanim@gmail.com" />
            <EmailRow label="Social email" email="hello@tanim.social" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── The main exported button ──────────────────────────────────────────── */
export default function LetsTalkButton({ isMobile = false }: { isMobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const close = useCallback(() => {
    cancelClose();
    setOpen(false);
  }, [cancelClose]);

  /* Leaving schedules; entering the panel cancels. See note 2 in the header —
     there is no hover path between the button and a centred panel, so a bridge
     element cannot do this job. 340ms is long enough to cross the scrim
     deliberately and short enough that a brush past does not linger. */
  const scheduleClose = useCallback((delay: number) => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), delay);
  }, [cancelClose]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  /* Escape and scroll both dismiss. Scroll especially: this opens on hover, so
     it can appear unbidden, and scrolling is what people do to dismiss things. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close);
    };
  }, [open, close]);

  const handleEnter = () => {
    if (isMobile) return;
    cancelClose();
    setOpen(true);
  };

  const handleLeave = () => {
    if (isMobile) return;
    scheduleClose(340);
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        animate={
          open
            ? { background: 'var(--on-surface)', color: 'var(--surface)', scale: 1.03 }
            : { background: 'var(--surface)', color: RED_TEXT, scale: 1 }
        }
        transition={SPRING_FAST}
        className={`btn-premium relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-[14px] font-[600] whitespace-nowrap outline-none cursor-pointer ${
          isMobile ? 'w-full justify-center py-3' : ''
        }`}
        style={{
          background: 'var(--surface)',
          color: RED_TEXT,
          boxShadow: open ? 'var(--shadow-raised)' : 'var(--shadow-contact)',
          letterSpacing: '-0.01em',
          transition: 'box-shadow 200ms',
        }}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <motion.span
          animate={{ rotate: open ? -45 : 0 }}
          transition={SPRING_FAST}
          className="inline-flex items-center justify-center"
          aria-hidden="true"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 11L11 2M11 2H4M11 2v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
        <span>Let&apos;s Talk</span>
      </motion.button>

      {/* Portalled to body — see note 1 in the header.
          The `document` guard is enough on its own; no mounted flag is needed,
          because `open` is false through SSR and hydration and only a client
          interaction can flip it. Nothing is portalled on the first render, so
          there is nothing for the server and client trees to disagree about. */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <ContactPanel
                onClose={close}
                onPointerEnter={cancelClose}
                onPointerLeave={() => !isMobile && scheduleClose(200)}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
