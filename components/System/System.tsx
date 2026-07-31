/**
 * SYSTEM — SlideIn Venture design language primitives
 * ---------------------------------------------------------------------------
 * The shared vocabulary every section is composed from. Import these instead of
 * hand-rolling labels and rules, so the blueprint language stays identical
 * across the site.
 *
 *   MonoLabel      — technical metadata / micro caption
 *   SectionRule    — section index + hairline + right-hand coordinate
 *   CornerBrackets — interface framing for a relatively-positioned parent
 *   Ticks          — measurement marks along an edge
 */

import { cn } from '@/lib/utils';

/* ─── Technical metadata label ────────────────────────────────────────────── */
export function MonoLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    /* Size, case and tracking come from the .font-label role in
       app/styles/type.css — never restate them here. */
    <span className={cn('font-label font-label-wide text-slate-500', className)}>
      {children}
    </span>
  );
}

/* ─── Section index rule ──────────────────────────────────────────────────── */
export function SectionRule({
  index,
  label,
  coordinate,
  className,
}: {
  index: string;
  label: string;
  coordinate?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <MonoLabel className="text-slate-600">
        {index} — {label}
      </MonoLabel>
      <span className="h-px flex-1 bg-black/[0.07]" aria-hidden />
      {coordinate && <MonoLabel>{coordinate}</MonoLabel>}
    </div>
  );
}

/* ─── Interface framing ───────────────────────────────────────────────────── */
export function CornerBrackets({
  size = 10,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const base = 'absolute border-black/[0.14]';
  const s = { width: size, height: size };
  return (
    <span aria-hidden className={cn('pointer-events-none', className)}>
      <span className={cn(base, 'left-0 top-0 border-l border-t')} style={s} />
      <span className={cn(base, 'right-0 top-0 border-r border-t')} style={s} />
      <span className={cn(base, 'bottom-0 left-0 border-b border-l')} style={s} />
      <span className={cn(base, 'bottom-0 right-0 border-b border-r')} style={s} />
    </span>
  );
}

/* ─── Measurement ticks ───────────────────────────────────────────────────── */
export function Ticks({ count = 12, className }: { count?: number; className?: string }) {
  return (
    <span aria-hidden className={cn('pointer-events-none absolute inset-y-0 w-1.5', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute h-px w-full bg-black/[0.08]"
          style={{ top: `${((i + 1) / (count + 1)) * 100}%` }}
        />
      ))}
    </span>
  );
}
