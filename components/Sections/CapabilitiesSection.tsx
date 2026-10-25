'use client';

/**
 * S4 · CAPABILITIES — archetype C: the bento grid of micro-scenes
 * ---------------------------------------------------------------------------
 * Four white radius-28 cells in an asymmetric 12-col grid (7/5/5/7), one per
 * stage: qualify, personalize, outreach, converse. Each cell: the stage's
 * registry glyph in a small glossy tile + title/body slots up top, a tag
 * strip with the stage's equation words, and below a STATIC micro-scene —
 * the settled final frame of the act-out, frozen mid-gesture:
 *
 *   1. SCAN      five skeleton rows, each with its earned check chip; the
 *                accent scan line rests mid-well. Input: the card-chips
 *                handoff artifact from research.
 *   2. COMPOSE   a document with all bars drawn and the accent caret set,
 *                over two faint version layers.
 *   3. SEND      three pills queued on the hairline track behind the policy
 *                arch, the paper plane waiting past it.
 *   4. REPLY     the activity line with its accent dot on the spike and the
 *                notification bubble settled in.
 *
 * Static by story rule: the page allows 2 loops and the hero owns 1, so the
 * cells keep their design but not their loops (entrance-only Reveal). The
 * only motion since is hover-driven: a one-shot scan sweep, version layers
 * drifting apart, the plane nudging toward the gate, the bubble settling
 * in — none of it loops, all of it collapses under reduced motion.
 * Mobile: cells stack full-width.
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { HOME_CONTENT } from '@/content/home';
import { BAND_DISORDER, type EquationWord } from '@/content/stages';
import { HandoffArtifact } from '@/components/StorySpine/artifacts';
import {
  ChatGlyph,
  CheckGlyph,
  EnvelopeGlyph,
  PlaneGlyph,
} from '@/components/StorySpine/icons';
import {
  Band,
  GlossTile,
  ItemSlot,
  Reveal,
  Scene,
  SectionHeader,
  WordTag,
} from '@/components/Sections/primitives';

/* The inner stage every micro-scene plays on. `cap-well` scopes the
   hover gestures defined in sections.css. */
function Well({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'cap-well group relative h-[220px] overflow-hidden rounded-[20px] border border-[var(--scaffold-hairline)] bg-[var(--scaffold-panel)] p-5',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* The 14px check chip a scanned row earns. */
function ScanChip() {
  return (
    <span
      className="flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full border"
      style={{
        borderColor: 'rgba(10,10,10,0.14)',
        background: 'linear-gradient(145deg, rgba(255,255,255,1), rgba(244,244,245,1))',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,1)',
      }}
    >
      <svg width="7" height="7" viewBox="0 0 9 9" aria-hidden="true">
        <path
          d="M1.5 4.8 L3.6 6.8 L7.6 2.4"
          stroke="rgba(10,10,10,0.55)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
}

const SCAN_ROWS = [88, 70, 78, 58, 82];

/* Rows judged, chips earned, the scan line resting mid-well. Static. */
function ScanScene() {
  return (
    <Well>
      <div className="relative flex h-full flex-col justify-between">
        <span
          aria-hidden="true"
          className="cap-scan absolute bottom-[-90px] left-[26px] top-[-90px] w-[2px] rounded-full"
          style={{ background: 'var(--scaffold-accent)', opacity: 0.55 }}
        />
        {SCAN_ROWS.map((w, i) => (
          <div key={i} className="cap-row -mx-1 flex items-center gap-3 px-1">
            <ScanChip />
            <span
              className="block h-[8px] rounded-full"
              style={{ width: `${w}%`, background: 'var(--scaffold-skeleton)' }}
            />
          </div>
        ))}
      </div>
    </Well>
  );
}

const COMPOSE_BARS = [86, 64, 72];

/* The draft fully written, caret set, over two faint saved versions. Static. */
function ComposeScene() {
  return (
    <Well className="flex items-center justify-center">
      <div className="relative w-full max-w-[280px]">
        {/* saved versions: 6px and 12px down, ink 4% and 2% */}
        <span
          aria-hidden="true"
          className="cap-version-b absolute inset-0 translate-y-[12px] rounded-[12px] border border-[var(--scaffold-hairline)]"
          style={{ background: 'rgba(10,10,10,0.02)' }}
        />
        <span
          aria-hidden="true"
          className="cap-version-a absolute inset-0 translate-y-[6px] rounded-[12px] border border-[var(--scaffold-hairline)]"
          style={{ background: 'rgba(10,10,10,0.04)' }}
        />
        <div
          className="relative rounded-[12px] border border-[var(--scaffold-hairline)] bg-white p-5"
          style={{ boxShadow: 'var(--scaffold-shadow-soft)' }}
        >
          <div className="flex flex-col gap-3">
            {COMPOSE_BARS.map((w, i) => (
              <span
                key={i}
                className="block h-[8px] rounded-full"
                style={{ width: `${w}%`, background: 'var(--scaffold-skeleton)' }}
              />
            ))}
            <div className="flex items-center gap-2.5">
              <span
                className="block h-[8px] rounded-full"
                style={{ width: '44%', background: 'var(--scaffold-skeleton)' }}
              />
              <span
                className="cap-caret block h-[16px] w-[8px] rounded-[3px]"
                style={{ background: 'var(--scaffold-accent)' }}
              />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-7 right-0">
          <WordTag w="versioned" />
        </div>
      </div>
    </Well>
  );
}

/* Pills queued as static lefts; the gate sits right-anchored clear of the plane. */
const QUEUE_LEFTS = ['8%', '22%', '36%'];

function QueuePill() {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full border border-[var(--scaffold-hairline)] bg-white py-2 pl-3 pr-3.5"
      style={{ boxShadow: 'var(--scaffold-shadow-soft)' }}
    >
      <span
        className="block h-[5px] w-[18px] rounded-full"
        style={{ background: 'var(--scaffold-skeleton)' }}
      />
      <span
        className="block h-[5px] w-[11px] rounded-full"
        style={{ background: 'var(--scaffold-skeleton)' }}
      />
    </div>
  );
}

/* The policy arch: a rounded threshold straddling the track. Mail queued
   left of it, the plane past it. Static. */
function PolicyArch() {
  return (
    <svg width="28" height="40" viewBox="0 0 28 40" aria-hidden="true">
      <path
        d="M5 36 V11 Q5 5 11 5 H17 Q23 5 23 11 V36"
        fill="none"
        stroke="rgba(10,10,10,0.25)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function QueueScene() {
  return (
    <Well>
      {/* the hairline track */}
      <div className="absolute inset-x-5 top-1/2 h-px bg-[var(--scaffold-hairline)]" />
      {QUEUE_LEFTS.map((left, i) => (
        <div key={i} className="absolute top-1/2 -translate-y-1/2" style={{ left }}>
          <QueuePill />
        </div>
      ))}
      {/* the policy arch, right-anchored so it never meets pills or plane */}
      <div className="absolute right-[78px] top-1/2 -translate-y-1/2">
        <PolicyArch />
      </div>
      <div className="absolute right-[70px] top-[calc(50%+30px)]">
        <WordTag w="policy" />
      </div>
      {/* the plane waiting past the gate at the right end */}
      <div className="cap-plane absolute right-4 top-1/2 -translate-y-1/2">
        <GlossTile size={44} rotate={0} icon={<PlaneGlyph id="cap-outreach-plane" size={22} />} />
      </div>
    </Well>
  );
}

function ReplyBubble() {
  return (
    <div
      className="w-[148px] rounded-[12px] border border-[var(--scaffold-hairline)] bg-white p-3.5"
      style={{ boxShadow: 'var(--scaffold-shadow-soft)' }}
    >
      <div className="flex flex-col gap-2">
        <span
          className="block h-[6px] w-[72%] rounded-full"
          style={{ background: 'var(--scaffold-skeleton)' }}
        />
        <span
          className="block h-[6px] w-[46%] rounded-full"
          style={{ background: 'var(--scaffold-skeleton)' }}
        />
      </div>
    </div>
  );
}

/* The line read, the spike dotted, the bubble settled in. Static. */
function ReplyScene() {
  return (
    <Well>
      {/* the activity line */}
      <svg
        className="absolute inset-x-5 top-1/2 -translate-y-1/2"
        width="100%"
        height="60"
        viewBox="0 0 320 60"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 34 H56 L74 12 L96 48 L114 24 H138 L150 38 H196 L210 20 L230 44 H316"
          stroke="rgba(10,10,10,0.8)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* the accent dot on the tallest spike */}
      <span
        className="cap-dot absolute left-[28%] top-[58%] h-[7px] w-[7px] rounded-full"
        style={{ background: 'var(--scaffold-accent-dot)' }}
      />
      {/* the notification bubble */}
      <div className="absolute right-5 top-5">
        <div className="cap-bubble">
          <ReplyBubble />
        </div>
      </div>
      {/* the read intent, under the line at the dotted spike */}
      <div className="absolute left-[28%] top-[74%] -translate-x-1/2">
        <WordTag w="intent" />
      </div>
    </Well>
  );
}

/* One bento cell: tile + slots up top, tag strip, micro-scene below. */
function Cell({
  item,
  icon,
  span,
  node,
  tags,
  artifact,
  children,
}: {
  item: { title: string; body: string };
  icon: ReactNode;
  span: string;
  node?: string;
  tags?: EquationWord[];
  artifact?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      data-story-node={node}
      className={cn('rounded-[28px] border border-[var(--scaffold-hairline)] bg-white p-6 md:p-7', span)}
      style={{ boxShadow: 'var(--scaffold-shadow-object)' }}
    >
      <div className="flex items-start gap-4">
        <GlossTile size={40} rotate={0} icon={icon} />
        <ItemSlot item={item} titleBar="7em" bodyBar="min(24ch, 100%)" />
      </div>
      {tags || artifact ? (
        <div className="mt-6 flex min-h-[32px] flex-wrap items-center gap-x-5 gap-y-2">
          {artifact}
          {tags?.map((t) => <WordTag key={t} w={t} />)}
        </div>
      ) : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function CapabilitiesSection() {
  const section = HOME_CONTENT.sections[3];
  const [scan, compose, queue, reply] = section.items;

  return (
    <Band tone="soft" id={section.id} disorder={BAND_DISORDER.capabilities}>
      <SectionHeader section={section} align="center" />

      <Reveal className="section-visual" y={16}>
        <Scene>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
            <Cell
              item={scan}
              span="md:col-span-7"
              icon={<CheckGlyph id="cap-qualify" size={20} />}
              node="qualify"
              tags={['offer match', 'qualification']}
              artifact={
                <span data-handoff-input="card-chips" className="block">
                  <HandoffArtifact kind="card-chips" />
                </span>
              }
            >
              <ScanScene />
            </Cell>
            <Cell
              item={compose}
              span="md:col-span-5"
              icon={<EnvelopeGlyph id="cap-personalize" size={20} />}
              node="personalize"
              tags={['drafts']}
            >
              <ComposeScene />
            </Cell>
            <Cell
              item={queue}
              span="md:col-span-5"
              icon={<PlaneGlyph id="cap-outreach" size={20} />}
              node="outreach"
              tags={['sent mails']}
            >
              <QueueScene />
            </Cell>
            <Cell
              item={reply}
              span="md:col-span-7"
              icon={<ChatGlyph id="cap-converse" size={20} />}
              node="converse"
              tags={['replies']}
            >
              <ReplyScene />
            </Cell>
          </div>
        </Scene>
      </Reveal>
    </Band>
  );
}
