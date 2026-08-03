'use client';

/**
 * PROGRESSIVE DISCLOSURE — the mechanism the whole page depends on
 * ---------------------------------------------------------------------------
 * /steps is 28 steps, each with a what, a why and a technical detail. Rendered
 * flat that is over eighty paragraphs, and nobody reads eighty paragraphs on a
 * services page. The content is not the problem; a document pretending to be an
 * interface is. Three tiers fix it:
 *
 *   tier 1  act or phase header          always visible
 *   tier 2  index, title, one sentence   on act or phase expand
 *   tier 3  why it matters + technical   on step click
 *
 * ONE OPEN AT A TIME, PAGE WIDE
 * Not one per section. The rule is enforced by a single provider wrapped around
 * the entire page, because the failure it prevents is a reader opening six
 * details and then scrolling through a wall they did not mean to build. The
 * open id lives in one place, so opening anything closes everything else for
 * free and there is no cross section bookkeeping to get wrong.
 *
 * HEIGHT, NOT OPACITY
 * The disclosure animates height. Fading a block in while it already occupies
 * its full height means the text below it jumps on the first frame and then the
 * words arrive into a gap that opened before them. Animating height moves the
 * page exactly as fast as the reader can follow.
 *
 * `height: auto` is the target rather than a measured pixel value: Framer
 * resolves auto by measuring, so the panel is correct at any width without a
 * ResizeObserver, and it stays correct when the copy reflows on a narrow
 * screen.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';

const EASE = [0.16, 1, 0.3, 1] as const;
/* 320ms. Long enough to read as a panel opening, short enough that a reader
   clicking through four steps in a row is never waiting for it. */
const DURATION = 0.32;

type DisclosureState = {
  openId: string | null;
  toggle: (id: string) => void;
};

const Ctx = createContext<DisclosureState>({ openId: null, toggle: () => {} });

export function DisclosureProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = useCallback(
    (id: string) => setOpenId((current) => (current === id ? null : id)),
    [],
  );
  const value = useMemo(() => ({ openId, toggle }), [openId, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDisclosure(id: string) {
  const { openId, toggle } = useContext(Ctx);
  return {
    isOpen: openId === id,
    toggle: useCallback(() => toggle(id), [toggle, id]),
  };
}

/**
 * Tier 3. Why it matters as prose, then the technical detail in mono,
 * smaller and indented — two registers, because they answer two different
 * questions and a reader skimming for one should be able to skip the other.
 */
export function Tier3({
  id,
  whyItMatters,
  technicalDetail,
  className,
}: {
  id: string;
  whyItMatters: string;
  /* Optional: a figure's tier 3 is one paragraph, and a second register under
     it with nothing to say in it reads as a missing value. */
  technicalDetail?: string;
  className?: string;
}) {
  const { isOpen } = useDisclosure(id);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id={`${id}-detail`}
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: DURATION, ease: EASE }}
        >
          <div className={cn('flex flex-col gap-4 pb-6 pt-5', className)}>
            <p className="font-body max-w-[62ch] text-[var(--muted)]">
              {whyItMatters}
            </p>
            {technicalDetail && (
              <p className="font-label max-w-[70ch] border-l border-[var(--rule)] pl-4 leading-relaxed text-[var(--muted)] normal-case">
                {technicalDetail}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * The clickable head of a tier 3 panel. A real <button> with aria-expanded and
 * aria-controls, because the whole page is operable from the keyboard and a div
 * with an onClick is not.
 */
export function DisclosureTrigger({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const { isOpen, toggle } = useDisclosure(id);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={isOpen}
      aria-controls={`${id}-detail`}
      className={cn(
        'group flex w-full cursor-pointer items-start gap-5 text-left',
        className,
      )}
    >
      {children}
    </button>
  );
}

/** The open/closed affordance. A cross that rotates into a minus. */
export function DisclosureMark({ id }: { id: string }) {
  const { isOpen } = useDisclosure(id);
  return (
    <span
      aria-hidden
      className="relative mt-1 block h-3 w-3 shrink-0 text-[var(--faint)] transition-colors duration-300 group-hover:text-[var(--accent)]"
    >
      <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
      <motion.span
        className="absolute left-1/2 top-0 h-3 w-px bg-current"
        animate={{ scaleY: isOpen ? 0 : 1 }}
        transition={{ duration: DURATION, ease: EASE }}
      />
    </span>
  );
}

/** Shared by both halves of the page: the mono index beside a step title. */
export function StepIndex({
  children,
  accent = false,
}: {
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <MonoLabel
      className={cn(
        'tnum shrink-0',
        /* --muted, not --faint. `--faint` reaches 1.76:1 on paper and the
           design system is explicit that it is not a text tier: it is for
           icons, ticks and disabled affordances held to the 3:1 bar. A step
           index is text a reader is meant to read. */
        accent ? 'text-[var(--accent)]' : 'text-[var(--muted)]',
      )}
    >
      {children}
    </MonoLabel>
  );
}
