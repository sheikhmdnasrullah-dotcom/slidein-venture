'use client';

/**
 * POST-PRODUCTION
 * ---------------------------------------------------------------------------
 * Same twelve items, same order, same labels. What changed is the reading:
 * the chain runs into a hub and the hub fans out, so the picture states the
 * one thing the section is about — one edit becomes many assets — instead of
 * making it a nine-rung ladder.
 *
 *   05 Sound Design ─┐
 *                    ├─▶ 07 FULL EPISODE EDIT ═╪═▶ 08 … 12
 *   06 Highlight Cut ┘        (the hub)
 *
 * Everything is authored inside slideChrome's fixed canvas, so the whole slide
 * is always fully visible in the modal with no scrolling at any width.
 *
 * The Highlight Cut node's eye badge dissolves this diagram out and
 * HighlightCutSlide in, in the same slide area; the back button that slide
 * renders reverses it. One slide, two states, no second popup.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HighlightCutSlide from './HighlightCutSlide';
import {
  EASE,
  FlowPath,
  MobileNode,
  MobileRail,
  PulseDot,
  SlideCanvas,
  SlideDefs,
  SPACE_H,
  SPACE_W,
} from './slideChrome';

interface PostItem {
  id: string;
  label: string;
  number: string;
}

const POST_ITEMS: PostItem[] = [
  { id: 'sound-design', number: '05', label: 'Sound Design' },
  { id: 'highlight-cut', number: '06', label: 'Highlight Cut' },
  { id: 'full-episode-edit', number: '07', label: 'Full Episode Edit' },
];

const OUTPUT_ITEMS: PostItem[] = [
  { id: 'transcripts', number: '08', label: 'Transcripts and show notes' },
  { id: 'reels', number: '09', label: '3-4 vertical reels' },
  { id: 'thumbnails', number: '10', label: 'Thumbnail and Cover Arts' },
  { id: 'articles', number: '11', label: 'Three long-form articles' },
  { id: 'linkedin-posts', number: '12', label: 'LinkedIn posts' },
];

/* ── geometry ─────────────────────────────────────────────────────────────
   Three zones, left to right: the chain, the hub, the deliverables. */
const CHAIN_X = 24;
const CHAIN_W = 196;
const CHAIN_H = 88;
const CHAIN_CY = [200, 344]; // 05, 06 — straddling the hub's centre line

const HUB_X = 268;
const HUB_W = 300;
const HUB_H = 156;
const HUB_CY = 275;

const OUT_X = 736;
const OUT_W = 244;
const OUT_H = 66;
/* Centred on the hub's y so the fan opens symmetrically, and stopping short of
   the canvas corner ticks. */
const OUT_CY = [123, 199, 275, 351, 427];

const chainToChain = `M${CHAIN_X + CHAIN_W / 2},${CHAIN_CY[0] + CHAIN_H / 2} L${CHAIN_X + CHAIN_W / 2},${CHAIN_CY[1] - CHAIN_H / 2}`;
const chainToHub = `M${CHAIN_X + CHAIN_W},${CHAIN_CY[1]} C${CHAIN_X + CHAIN_W + 24},${CHAIN_CY[1]} ${HUB_X - 24},${HUB_CY} ${HUB_X},${HUB_CY}`;
const hubToOut = (cy: number) =>
  `M${HUB_X + HUB_W},${HUB_CY} C${HUB_X + HUB_W + 72},${HUB_CY} ${OUT_X - 72},${cy} ${OUT_X},${cy}`;

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const LIFTED =
  'inset 0 1px 0 var(--gloss), 0 26px 50px -26px color-mix(in oklch, var(--color-ember) 55%, transparent), 0 3px 10px -4px color-mix(in oklch, var(--color-ink) 14%, transparent)';
const RESTING =
  'inset 0 1px 0 var(--gloss), 0 12px 28px -22px color-mix(in oklch, var(--color-ember) 40%, transparent), 0 1px 2px -1px color-mix(in oklch, var(--color-ink) 12%, transparent)';

/* ── chain node (05, 06) ──────────────────────────────────────────────────── */

function ChainNode({
  item,
  i,
  hovered,
  onHover,
  onClick,
}: {
  item: PostItem;
  i: number;
  hovered: boolean;
  onHover: (v: boolean) => void;
  onClick?: () => void;
}) {
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: CHAIN_X, top: CHAIN_CY[i] - CHAIN_H / 2, width: CHAIN_W, height: CHAIN_H }}
      initial={{ opacity: 0, x: -18, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.15 + i * 0.14, ease: EASE }}
      whileHover={{ y: -6 }}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      onClick={onClick}
    >
      <div
        className="relative flex h-full flex-col justify-center gap-2 overflow-hidden rounded-[18px] border bg-[var(--surface)] px-5 transition-[border-color,box-shadow] duration-500"
        style={{
          borderColor: hovered ? 'var(--accent-ring)' : 'var(--rule)',
          boxShadow: hovered ? LIFTED : RESTING,
        }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="font-label tnum text-[11px] tracking-[0.2em] transition-colors duration-500"
            style={{ color: hovered ? 'var(--accent)' : 'var(--muted)' }}
          >
            {item.number}
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            {onClick && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-wash)] text-[var(--accent)]">
                <EyeIcon />
              </span>
            )}
            <PulseDot size={7} delay={i * 0.4} />
          </span>
        </div>
        <p className="font-display-sm text-[17px] leading-[1.15] text-[var(--on-surface)]">{item.label}</p>
      </div>
    </motion.div>
  );
}

/* ── the hub (07) ─────────────────────────────────────────────────────────── */

function Hub({ item, hovered, onHover }: { item: PostItem; hovered: boolean; onHover: (v: boolean) => void }) {
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: HUB_X, top: HUB_CY - HUB_H / 2, width: HUB_W, height: HUB_H }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
      whileHover={{ y: -8 }}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
    >
      {/* the hub breathes — two rings pushing outward on a loop */}
      {[0, 1].map((k) => (
        <motion.span
          key={k}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[24px] border border-[var(--color-brand)]"
          animate={{ opacity: [0, 0.45, 0], scale: [1, 1.06, 1.11] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.4 + k * 1.5, ease: EASE }}
        />
      ))}

      <div
        className="relative flex h-full flex-col justify-center gap-3 overflow-hidden rounded-[24px] border px-8 transition-[border-color,box-shadow] duration-500"
        style={{
          borderColor: hovered ? 'var(--color-brand)' : 'var(--accent-ring)',
          background:
            'linear-gradient(158deg, color-mix(in oklch, var(--color-brand) 7%, var(--surface)) 0%, var(--surface) 58%)',
          boxShadow: hovered ? LIFTED : RESTING,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px"
          style={{
            background:
              'radial-gradient(90% 120% at 100% 50%, color-mix(in oklch, var(--color-brand) 14%, transparent) 0%, transparent 62%)',
          }}
        />
        <div className="relative flex items-center gap-3">
          <PulseDot size={9} />
          <span className="font-label tnum text-[11px] tracking-[0.24em] text-[var(--accent)]">{item.number}</span>
        </div>
        <p className="font-display-md relative text-[30px] leading-[1.06] text-[var(--on-surface)]">{item.label}</p>
      </div>
    </motion.div>
  );
}

/* ── a deliverable ────────────────────────────────────────────────────────── */

function OutputCard({
  item,
  i,
  hovered,
  onHover,
}: {
  item: PostItem;
  i: number;
  hovered: boolean;
  onHover: (v: boolean) => void;
}) {
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: OUT_X, top: OUT_CY[i] - OUT_H / 2, width: OUT_W, height: OUT_H }}
      initial={{ opacity: 0, x: 22, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.65, delay: 1 + i * 0.11, ease: EASE }}
      whileHover={{ y: -5, scale: 1.035 }}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
    >
      {/* the row drifts, each on its own phase, so the column is never frozen */}
      <motion.div
        className="h-full w-full"
        animate={{ y: [0, -3.5, 0] }}
        transition={{ duration: 5.5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
      >
        <div
          className="relative flex h-full items-center gap-3.5 overflow-hidden rounded-[16px] border bg-[var(--surface)] px-4 transition-[border-color,box-shadow] duration-500"
          style={{
            borderColor: hovered ? 'var(--accent-ring)' : 'var(--rule)',
            boxShadow: hovered ? LIFTED : RESTING,
          }}
        >
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-px"
            style={{
              background:
                'radial-gradient(110% 140% at 0% 50%, color-mix(in oklch, var(--color-brand) 14%, transparent) 0%, transparent 62%)',
            }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          />
          <span className="font-label tnum relative text-[11px] tracking-[0.2em] text-[var(--accent)]">
            {item.number}
          </span>
          <span className="relative h-7 w-px shrink-0 bg-[var(--rule)]" aria-hidden />
          <span className="font-body relative flex-1 text-[14px] leading-[1.25] text-[var(--on-surface)]">
            {item.label}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── the pipeline ─────────────────────────────────────────────────────────── */

function Pipeline({ onOpenHighlight }: { onOpenHighlight: () => void }) {
  const [chainHover, setChainHover] = useState<number | null>(null);
  const [hubHover, setHubHover] = useState(false);
  const [outHover, setOutHover] = useState<number | null>(null);

  return (
    <div className="relative w-full">
      <SlideCanvas glow={{ x: 430, y: 285, r: 460 }}>
        {/* hero */}
        <motion.h2
          className="font-display-xl absolute inset-x-0 top-[28px] text-center text-[42px] leading-none text-[var(--on-surface)]"
          style={{ letterSpacing: '0.02em' }}
          initial={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          POST-PRODUCTION
        </motion.h2>

        {/* connectors */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${SPACE_W} ${SPACE_H}`}
          fill="none"
          aria-hidden
        >
          <SlideDefs />
          <FlowPath d={chainToChain} delay={0.5} travel={1.5} active={chainHover !== null} />
          <FlowPath d={chainToHub} delay={0.7} travel={1.8} active={chainHover === 1 || hubHover} />
          {OUT_CY.map((cy, i) => (
            <FlowPath
              key={cy}
              d={hubToOut(cy)}
              delay={0.95 + i * 0.1}
              travel={2.6 + i * 0.15}
              active={hubHover || outHover === i}
            />
          ))}
          {/* ports */}
          <circle cx={HUB_X + HUB_W} cy={HUB_CY} r={5} fill="var(--accent-vivid)" />
          <circle cx={HUB_X + HUB_W} cy={HUB_CY} r={9} fill="none" stroke="var(--accent-vivid)" strokeOpacity={0.3} />
          <circle cx={HUB_X} cy={HUB_CY} r={4} fill="var(--accent-vivid)" />
          {OUT_CY.map((cy) => (
            <circle key={cy} cx={OUT_X} cy={cy} r={3.4} fill="var(--accent-vivid)" />
          ))}
        </svg>

        {POST_ITEMS.slice(0, 2).map((item, i) => (
          <ChainNode
            key={item.id}
            item={item}
            i={i}
            hovered={chainHover === i}
            onHover={(v) => setChainHover(v ? i : null)}
            onClick={item.id === 'highlight-cut' ? onOpenHighlight : undefined}
          />
        ))}

        <Hub item={POST_ITEMS[2]} hovered={hubHover} onHover={setHubHover} />

        {OUTPUT_ITEMS.map((item, i) => (
          <OutputCard
            key={item.id}
            item={item}
            i={i}
            hovered={outHover === i}
            onHover={(v) => setOutHover(v ? i : null)}
          />
        ))}
      </SlideCanvas>

      {/* Mobile */}
      <div className="md:hidden">
        <motion.h2
          className="font-display-xl mb-5 text-center text-[30px] leading-none text-[var(--on-surface)]"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          POST-PRODUCTION
        </motion.h2>

        <MobileRail>
          {POST_ITEMS.map((item, i) => (
            <MobileNode
              key={item.id}
              index={item.number}
              label={item.label}
              i={i}
              onClick={item.id === 'highlight-cut' ? onOpenHighlight : undefined}
              trailing={
                item.id === 'highlight-cut' ? (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-wash)] text-[var(--accent)]">
                    <EyeIcon />
                  </span>
                ) : undefined
              }
            />
          ))}
        </MobileRail>

        <div className="my-4 flex items-center gap-3 pl-2">
          <div className="h-px flex-1 bg-[var(--rule)]" />
          <span className="font-label text-[9px] tracking-[0.25em] text-[var(--muted)] uppercase">Branches into</span>
          <div className="h-px flex-1 bg-[var(--rule)]" />
        </div>

        <div className="flex flex-col gap-2.5">
          {OUTPUT_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -14, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.5 + i * 0.08, ease: EASE }}
              className="flex items-center gap-3 rounded-xl border border-[var(--rule)] bg-[var(--surface-2)] px-4 py-3"
            >
              <span className="font-label tnum text-[10px] tracking-[0.18em] text-[var(--accent)]">{item.number}</span>
              <span className="font-body text-[13px] text-[var(--on-surface)]">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PostProductionSlide() {
  const [showHighlight, setShowHighlight] = useState(false);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {showHighlight ? (
        <motion.div
          key="highlight"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <HighlightCutSlide onExit={() => setShowHighlight(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="pipeline"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <Pipeline onOpenHighlight={() => setShowHighlight(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
