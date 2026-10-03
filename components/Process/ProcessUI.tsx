import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CornerBrackets, MonoLabel } from '@/components/System/System';
import type { CardSpec, CalloutCopy, RichPoint } from '@/content/process';

/**
 * PROCESS UI — the shared surface vocabulary for /process
 * ---------------------------------------------------------------------------
 * One panel, one list, one callout. Everything on the page is cut from these,
 * so the mortgage system reads as part of the site rather than a themed
 * insert: the panel is the same gloss-over-glass card the homepage's seven
 * layer cards use, the labels are the same MonoLabel, and every colour name
 * comes from the tone contract (app/styles/tone.css).
 *
 * Nothing here names a colour and nothing here says `dark:`. A card in the
 * anchor band and a card in the base band are the same component reading a
 * different band.
 */

/* The panel body. Border stays a class rather than part of this shorthand:
   an inline `border:` would set border-color inline, and an inline style
   outranks any hover: class — the card could never light its edge. */
const PANEL_BODY: CSSProperties = {
  background: 'linear-gradient(180deg, var(--gloss), transparent 34%), var(--surface-glass)',
  boxShadow: 'var(--shadow-inset-top), var(--shadow-raised)',
  backdropFilter: 'blur(22px) saturate(1.25)',
  WebkitBackdropFilter: 'blur(22px) saturate(1.25)',
};

const HOVER =
  'transition-[border-color,box-shadow,transform] duration-[var(--dur-base)] ease-[var(--ease-expo)] hover:-translate-y-0.5 hover:border-[var(--accent-ring)] hover:shadow-[var(--shadow-float)]';

/* ── Panel ───────────────────────────────────────────────────────────────── */

export function ProcessCard({
  label,
  title,
  children,
  className,
  brackets = true,
}: {
  label?: string;
  title?: string;
  children?: ReactNode;
  className?: string;
  brackets?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--rule)] p-6',
        HOVER,
        className
      )}
      style={PANEL_BODY}
    >
      {brackets && (
        <>
          <CornerBrackets size={10} className="left-3 top-3" />
          <CornerBrackets size={10} className="right-3 top-3" />
          <CornerBrackets size={10} className="bottom-3 left-3" />
          <CornerBrackets size={10} className="bottom-3 right-3" />
        </>
      )}

      {label && <MonoLabel className="block text-[var(--accent)]">{label}</MonoLabel>}
      {title && (
        <h4
          className={cn(
            'font-display-sm text-[clamp(1.05rem,1.5vw,1.25rem)] text-[var(--on-surface)]',
            label ? 'mt-2.5' : 'mt-0'
          )}
        >
          {title}
        </h4>
      )}

      {children}
    </div>
  );
}

/* ── Lists ───────────────────────────────────────────────────────────────── */

function Dot() {
  return (
    <span
      aria-hidden
      className="mt-[0.62em] h-[5px] w-[5px] shrink-0 rounded-full bg-[var(--accent-vivid)]"
    />
  );
}

function isRich(point: string | RichPoint): point is RichPoint {
  return typeof point !== 'string';
}

export function PointList({
  items,
  className,
  dense,
}: {
  items: (string | RichPoint)[];
  className?: string;
  dense?: boolean;
}) {
  return (
    <ul className={cn('mt-4 flex flex-col gap-2.5', dense && 'gap-2', className)}>
      {items.map((item, i) => (
        <li
          key={i}
          className={cn(
            'flex items-start gap-3 text-[15px] leading-[1.62] text-[var(--muted)]',
            dense && 'gap-2.5 text-[14px] leading-[1.5]'
          )}
        >
          <Dot />
          <span>
            {isRich(item) && item.lead && (
              <span className="font-[600] text-[var(--on-surface)]">{item.lead}{' '}</span>
            )}
            {isRich(item) ? item.text : item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function NumberedList({
  items,
  className,
  dense,
}: {
  items: { num: string; text: string }[];
  className?: string;
  dense?: boolean;
}) {
  return (
    <ol className={cn('mt-4 flex flex-col', dense && 'gap-0', className)}>
      {items.map((item) => (
        <li
          key={item.num}
          className={cn(
            'flex items-baseline gap-4 border-b border-[var(--rule)] py-2.5 last:border-b-0',
            dense && 'gap-3 py-1.5'
          )}
        >
          <span className="font-label text-[var(--accent)]">{item.num}</span>
          <span
            className={cn(
              'text-[15px] leading-[1.55] text-[var(--muted)]',
              dense && 'text-[14px] leading-[1.45]'
            )}
          >
            {item.text}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Numbered prose: a step that reads as a sentence, not a table row. */
export function StepList({
  items,
  className,
  dense,
}: {
  items: string[];
  className?: string;
  dense?: boolean;
}) {
  return (
    <ol className={cn('mt-4 flex flex-col gap-3', dense && 'gap-2', className)}>
      {items.map((item, i) => (
        <li
          key={i}
          className={cn(
            'flex items-start gap-3 text-[15px] leading-[1.62] text-[var(--muted)]',
            dense && 'gap-2.5 text-[14px] leading-[1.5]'
          )}
        >
          <span className="font-label mt-[0.3em] text-[var(--accent)]">{`0${i + 1}`}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

/** A technical line: terminal tag on the left, plain language on the right. */
export function TagLines({ items, className }: { items: { tag: string; text: string }[]; className?: string }) {
  return (
    <ul className={cn('mt-4 flex flex-col gap-2.5', className)}>
      {items.map((item) => (
        <li key={item.tag} className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-3">
          <TechTag>{item.tag}</TechTag>
          <span className="text-[14px] leading-[1.55] text-[var(--muted)]">{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

export function TechTag({ children }: { children: ReactNode }) {
  /* font-label and font-label-wide are concatenated on purpose — twMerge
     treats both as the font-family group and would drop the first. */
  return (
    <span className="font-label font-label-wide w-fit shrink-0 rounded-[var(--radius-sm)] border border-[var(--rule)] bg-[var(--surface-2)] px-2 py-1 text-[var(--accent)]">
      {children}
    </span>
  );
}

export function TagRow({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn('mt-5 flex flex-wrap items-center gap-2', className)}>
      {items.map((item) => (
        <TechTag key={item}>{item}</TechTag>
      ))}
    </div>
  );
}

/* ── Metric ──────────────────────────────────────────────────────────────── */

export function Metric({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface-2)] px-5 py-6 text-center">
      <p className="font-display-md tnum text-[clamp(2.4rem,4vw,3.2rem)] leading-none text-[var(--accent)]">
        {value}
      </p>
      <p className="mt-3 text-[15px] font-[600] text-[var(--on-surface)]">{label}</p>
      <span className="font-label mt-2 block text-[var(--muted)]">{sub}</span>
    </div>
  );
}

/* ── Callout ─────────────────────────────────────────────────────────────── */

export function Callout({ lead, body, className }: CalloutCopy & { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--accent-ring)] bg-[var(--accent-wash)] px-5 py-4',
        className
      )}
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-[var(--accent-vivid)]" />
      <p className="text-[15px] leading-[1.65] text-[var(--on-surface)]">
        <span className="font-[600] text-[var(--accent)]">{lead}</span> {body}
      </p>
    </div>
  );
}

/* ── The card that reads a spec ──────────────────────────────────────────── */

/**
 * One renderer for every CardSpec in content/process.ts. The problem grid, the
 * six phases, the division of work and the launch sequence all arrive as the
 * same shape, so a change to the card language changes it everywhere at once.
 */
export function SpecCard({ spec, className }: { spec: CardSpec; className?: string }) {
  return (
    <ProcessCard label={spec.label} title={spec.title} className={className}>
      {spec.metric && (
        <div className={cn(spec.note || spec.points ? 'mb-4' : undefined)}>
          <Metric {...spec.metric} />
        </div>
      )}
      {spec.points && <PointList items={spec.points} />}
      {spec.numbered && <NumberedList items={spec.numbered} />}
      {spec.steps && <StepList items={spec.steps} />}
      {spec.tagLines && <TagLines items={spec.tagLines} />}
      {spec.tags && <TagRow items={spec.tags} />}
      {spec.note && (
        <p className="mt-4 text-[14px] leading-[1.6] text-[var(--muted)]">{spec.note}</p>
      )}
      {spec.footer && (
        <p className="mt-5 rounded-[var(--radius-sm)] border border-[var(--rule)] bg-[var(--surface-2)] px-4 py-3 text-[14px] leading-[1.5] font-[600] text-[var(--on-surface)]">
          {spec.footer}
        </p>
      )}
    </ProcessCard>
  );
}

export function CardGrid({
  cards,
  cols = 2,
  className,
}: {
  cards: CardSpec[];
  cols?: 2 | 3;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4',
        cols === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2',
        className
      )}
    >
      {cards.map((card, i) => (
        <SpecCard key={`${card.label ?? card.title ?? i}`} spec={card} />
      ))}
    </div>
  );
}
