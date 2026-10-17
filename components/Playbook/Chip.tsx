/**
 * PLAYBOOK CHIP
 * ---------------------------------------------------------------------------
 * A 96 x 28 pill (80 x 28 on mobile):
 * - White surface, 1px hairline, soft shadow.
 * - 6px lead shape: circle (profile), square (offers), diamond (icps).
 * - ICP criteria: lead shape sits beside a 14px row icon.
 * - ICP skip: dash icon and dashed border.
 * - Skeleton bar for text slot (zero digits or synthetic words).
 */

import React from 'react';
import { cn } from '@/lib/utils';
import type { ChipDef } from './poses';
import {
  PersonRowIcon,
  BuildingRowIcon,
  SizeBarsRowIcon,
  GlobePinRowIcon,
  BoltRowIcon,
  StopCircleRowIcon,
  DashRowIcon,
} from './icons';

interface ChipProps {
  chip: ChipDef;
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
}

export function Chip({ chip, className, style, compact }: ChipProps) {
  const { type, leadShape, criteriaIndex, isSkip } = chip;

  return (
    <div
      data-chip-id={chip.id}
      data-chip-type={type}
      className={cn(
        'absolute flex items-center gap-1.5 rounded-full bg-gradient-to-b from-white via-[#FCFCFD] to-[#F5F5F7] select-none pointer-events-auto transition-transform duration-200',
        isSkip
          ? 'border border-dashed border-[rgba(10,10,10,0.22)]'
          : 'border border-[rgba(10,10,10,0.09)]',
        compact ? 'h-[28px] w-[80px] px-2' : 'h-[28px] w-[96px] px-2.5',
        className,
      )}
      style={{
        boxShadow:
          '0 3px 8px -2px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,1)',
        ...style,
      }}
    >
      {/* 6px Lead Shape */}
      <span className="flex shrink-0 items-center justify-center">
        {leadShape === 'circle' && (
          <span className="h-[6px] w-[6px] rounded-full bg-[rgba(10,10,10,0.78)] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.4)]" />
        )}
        {leadShape === 'square' && (
          <span className="h-[6px] w-[6px] rounded-[1.5px] bg-[rgba(10,10,10,0.78)] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.4)]" />
        )}
        {leadShape === 'diamond' && (
          <span className="h-[6px] w-[6px] rotate-45 rounded-[0.5px] bg-[rgba(10,10,10,0.78)] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.4)]" />
        )}
      </span>

      {/* ICP 14px Criteria Row Icon or Skip Dash */}
      {criteriaIndex === 0 && <PersonRowIcon id={`${chip.id}-icon-person`} />}
      {criteriaIndex === 1 && <BuildingRowIcon id={`${chip.id}-icon-building`} />}
      {criteriaIndex === 2 && <SizeBarsRowIcon id={`${chip.id}-icon-size`} />}
      {criteriaIndex === 3 && <GlobePinRowIcon id={`${chip.id}-icon-globe`} />}
      {criteriaIndex === 4 && <BoltRowIcon id={`${chip.id}-icon-bolt`} />}
      {criteriaIndex === 5 && <StopCircleRowIcon id={`${chip.id}-icon-stop`} />}
      {isSkip && <DashRowIcon id={`${chip.id}-icon-dash`} />}

      {/* Two-tone skeleton bar */}
      <span
        className={cn(
          'h-[5px] rounded-full bg-gradient-to-r from-[rgba(10,10,10,0.14)] to-[rgba(10,10,10,0.07)]',
          compact
            ? criteriaIndex !== undefined || isSkip
              ? 'w-[28px]'
              : 'w-[40px]'
            : criteriaIndex !== undefined || isSkip
            ? 'w-[36px]'
            : 'w-[48px]',
        )}
      />
    </div>
  );
}
