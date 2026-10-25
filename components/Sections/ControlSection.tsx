'use client';

/**
 * S6 · CONTROL — archetype J: the ledger accordion, on the page's ONE
 * inverted dark band (#0F0F0F)
 * ---------------------------------------------------------------------------
 * "What we can and cannot promise" — five commitments you can inspect. The
 * band re-points the scaffold tokens (see .band-dark in sections.css), so
 * skeleton bars render white at 12% and the type primitives pick up light
 * inks with no component changes.
 *
 * Desktop: left column holds a sticky glossy chat-bubble tile that floats
 * slowly; right column holds the accordion — five rows separated by white
 * hairlines, each with a title slot and a round 36px icon button whose
 * plus rotates to a cross when open. Opening animates height smoothly and
 * fades the body slot in. Fully keyboard accessible (native button,
 * aria-expanded / aria-controls; Enter and Space toggle). First row open
 * at rest. Mobile: no sticky tile, accordion full width.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useId, useState } from 'react';
import { HOME_CONTENT } from '@/content/home';
import { BAND_DISORDER } from '@/content/stages';
import {
  Band,
  EASE,
  GlossTile,
  Reveal,
  Scene,
  SectionHeader,
} from '@/components/Sections/primitives';
import { ChatIcon } from '@/components/Sections/icons';
import { Bar, TextSlot } from '@/components/Hero/Skeleton';

/* The 36px round toggle: plus → cross. */
function Toggle({ open }: { open: boolean }) {
  return (
    <span
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300"
      style={{
        borderColor: open ? 'var(--scaffold-rule)' : 'var(--scaffold-hairline)',
        background: open ? 'var(--scaffold-accent-row)' : 'transparent',
      }}
    >
      <motion.span
        className="absolute block h-[1.5px] w-3.5 rounded-full"
        style={{ background: 'var(--scaffold-ink)' }}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
      />
      <motion.span
        className="absolute block h-[1.5px] w-3.5 rounded-full"
        style={{ background: 'var(--scaffold-ink)' }}
        animate={{ rotate: open ? 135 : 90 }}
        transition={{ duration: 0.3, ease: EASE }}
      />
    </span>
  );
}

function Row({
  item,
  open,
  onToggle,
}: {
  item: { title: string; body: string };
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  return (
    <div className="border-b border-[var(--scaffold-hairline)] first:border-t">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-6 rounded-[6px] px-3 py-6 text-left transition-colors duration-300 hover:bg-[color-mix(in_oklch,var(--color-paper-25)_4%,transparent)]"
      >
        {/* title slot — h3 scale */}
        <span className="min-w-0">
          <TextSlot
            text={item.title}
            barWidth="11em"
            textClassName="block font-semibold text-[1.375rem] leading-snug tracking-[-0.02em] text-[var(--scaffold-ink)]"
          />
        </span>
        <Toggle open={open} />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="body"
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            {/* body slot — two stacked bars, body scale */}
            <div className="flex flex-col gap-3 pb-7 pr-14">
              <Bar
                width="min(52ch, 100%)"
                className="text-[17px] leading-normal"
              />
              <Bar
                width="min(38ch, 88%)"
                className="text-[17px] leading-normal"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* The sticky glossy chat-bubble tile, resting at -4 (desktop only). Static
   by story rule; -4 sits exactly on this band's tilt budget. */
function StickyTile() {
  return (
    <div className="sticky top-40 hidden self-start md:block">
      <Scene>
        <GlossTile size={120} icon={<ChatIcon size="52%" />} rotate={-4} />
      </Scene>
    </div>
  );
}

export default function ControlSection() {
  const section = HOME_CONTENT.sections[5];
  const [open, setOpen] = useState<number>(0);

  return (
    <Band tone="dark" id={section.id} disorder={BAND_DISORDER.control}>
      <SectionHeader section={section} align="center" />
      <Reveal className="section-visual" y={16}>
        <div className="mx-auto flex max-w-[1080px] items-start gap-16">
          <StickyTile />
          <div className="min-w-0 flex-1">
            {section.items.map((item, i) => (
              <Row
                key={i}
                item={item}
                open={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </Reveal>
    </Band>
  );
}
