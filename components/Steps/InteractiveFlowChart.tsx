'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import type { FrameworkTrack, FrameworkNode } from '@/content/framework';

const EASE = [0.16, 1, 0.3, 1] as const;

type TrackId = 'content' | 'outreach';

interface FlowNode {
  id: string;
  label: string;
  owner: 'slidein' | 'client';
  description?: string;
}

interface FlowTrack {
  id: TrackId;
  label: string;
  cadence: string;
  color: string;
  nodes: FlowNode[];
}

const TRACKS: FlowTrack[] = [
  {
    id: 'content',
    label: 'Content Production',
    cadence: 'Every week · 72 hour turnaround',
    color: 'var(--color-brand)',
    nodes: [
      { id: 'ideation', label: 'Ideation & Script', owner: 'slidein', description: 'Research, outline, and script your episode' },
      { id: 'record', label: 'You Record', owner: 'client', description: 'One long-form session, 45 minutes' },
      { id: 'editing', label: 'Editing & Polish', owner: 'slidein', description: 'Audio cleanup, video cut, color grade' },
      { id: 'assets', label: 'Assets & Thumbnails', owner: 'slidein', description: 'Show notes, thumbnails, clips' },
      { id: 'distribution', label: 'Distribution', owner: 'slidein', description: 'YouTube, Spotify, podcast platforms' },
    ],
  },
  {
    id: 'outreach',
    label: 'Researched Outreach',
    cadence: 'Continuous · first sends day 17',
    color: 'var(--color-brand-hi)',
    nodes: [
      { id: 'icp', label: 'Ideal Client Profile', owner: 'slidein', description: 'Define who you want to work with' },
      { id: 'lists', label: 'Hand-Built Lists', owner: 'slidein', description: 'Real people, real companies, real research' },
      { id: 'infrastructure', label: 'Sending Infrastructure', owner: 'slidein', description: 'Verified inboxes, domains, warm-up' },
      { id: 'copy', label: 'Personalised Copy', owner: 'slidein', description: 'Every email written by a human, for a human' },
      { id: 'sending', label: 'Sending & Follow-Ups', owner: 'slidein', description: 'Qualified conversations on autopilot' },
    ],
  },
];

function ConnectionLine({ from, to, color, delay }: { from: { x: number; y: number }; to: { x: number; y: number }; color: string; delay: number }) {
  const midY = (from.y + to.y) / 2;
  const path = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;

  return (
    <motion.path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeDasharray="4 4"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.4 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className="drop-shadow-sm"
    />
  );
}

function TrackColumn({ track, expanded, onToggle, index }: { track: FlowTrack; expanded: boolean; onToggle: () => void; index: number }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
      className="flex flex-1 flex-col gap-3"
    >
      {/* Track header */}
      <button
        onClick={onToggle}
        className="group relative flex items-center justify-between rounded-2xl border border-[var(--rule-strong)] bg-[var(--surface)] px-5 py-4 text-left transition-all duration-300 hover:border-[var(--accent-ring)] hover:shadow-[0_8px_30px_color-mix(in_oklch,var(--on-surface)_8%,transparent)]"
      >
        <div className="flex flex-col gap-1">
          <span className="font-label text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
            Track {index + 1}
          </span>
          <span className="font-display-sm text-[clamp(1rem,1.5vw,1.25rem)] text-[var(--on-surface)]">
            {track.label}
          </span>
          <span className="font-body text-xs text-[var(--muted)]">{track.cadence}</span>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-wash)] text-[var(--accent)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </motion.span>
      </button>

      {/* Nodes */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex flex-col gap-2 overflow-hidden"
          >
            {track.nodes.map((node, i) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05, ease: EASE }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="group relative"
              >
                <div
                  className={cn(
                    'relative flex items-center gap-4 rounded-xl border px-4 py-3 transition-all duration-300 cursor-default',
                    node.owner === 'client'
                      ? 'border-[var(--accent-ring)] bg-[var(--accent-wash)]'
                      : 'border-[var(--rule)] bg-[var(--surface-2)] hover:border-[var(--rule-strong)] hover:translate-x-1'
                  )}
                >
                  {/* Connector dot */}
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span
                      className="absolute inset-0 rounded-full opacity-40"
                      style={{ backgroundColor: track.color }}
                    />
                    <span
                      className="absolute inset-[-2px] rounded-full opacity-0 transition-opacity duration-300"
                      style={{
                        backgroundColor: track.color,
                        opacity: hoveredNode === node.id ? 0.3 : 0,
                      }}
                    />
                  </span>

                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <span
                      className={cn(
                        'font-body text-sm truncate transition-colors duration-300',
                        node.owner === 'client' ? 'text-[var(--accent)] font-semibold' : 'text-[var(--on-surface)]'
                      )}
                    >
                      {node.label}
                    </span>
                    {node.description && (
                      <span className="font-body text-xs text-[var(--muted)] truncate opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {node.description}
                      </span>
                    )}
                  </div>

                  {node.owner === 'client' && (
                    <span className="font-label text-[9px] tracking-[0.15em] text-[var(--accent)] uppercase shrink-0">
                      YOU
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function InteractiveFlowChart({ className }: { className?: string }) {
  const [expandedTracks, setExpandedTracks] = useState<Set<TrackId>>(new Set(['content']));
  const [mounted, setMounted] = useState(false);

  const toggleTrack = useCallback((id: TrackId) => {
    setExpandedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <div className={cn('mx-auto max-w-[1400px] px-6 md:px-10', className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-10 flex flex-col items-center text-center"
      >
        <span className="font-label mb-3 block text-[var(--accent)]">The Complete Framework</span>
        <h2 className="font-display-xl max-w-[16ch] text-[clamp(1.75rem,3.5vw,2.75rem)] text-[var(--on-surface)]">
          Step by step process
        </h2>
        <p className="mt-3 max-w-[52ch] font-body text-[var(--muted)]">
          Two parallel tracks. Content ships every week while outreach builds in the background. Click a track to explore.
        </p>
      </motion.div>

      {/* Flowchart */}
      <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
        {TRACKS.map((track, i) => (
          <TrackColumn
            key={track.id}
            track={track}
            index={i}
            expanded={expandedTracks.has(track.id)}
            onToggle={() => toggleTrack(track.id)}
          />
        ))}
      </div>

      {/* Footer metrics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
        className="mt-10 flex flex-wrap items-center justify-center gap-8 border-t border-[var(--rule)] pt-8"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="font-display-md text-2xl text-[var(--on-surface)]">28</span>
          <span className="font-label text-[10px] tracking-[0.15em] text-[var(--muted)] uppercase">Total Steps</span>
        </div>
        <div className="h-8 w-px bg-[var(--rule)]" />
        <div className="flex flex-col items-center gap-1">
          <span className="font-display-md text-2xl text-[var(--on-surface)]">2</span>
          <span className="font-label text-[10px] tracking-[0.15em] text-[var(--muted)] uppercase">Parallel Tracks</span>
        </div>
        <div className="h-8 w-px bg-[var(--rule)]" />
        <div className="flex flex-col items-center gap-1">
          <span className="font-display-md text-2xl text-[var(--on-surface)]">72h</span>
          <span className="font-label text-[10px] tracking-[0.15em] text-[var(--muted)] uppercase">Turnaround</span>
        </div>
        <div className="h-8 w-px bg-[var(--rule)]" />
        <div className="flex flex-col items-center gap-1">
          <span className="font-display-md text-2xl text-[var(--on-surface)]">D17</span>
          <span className="font-label text-[10px] tracking-[0.15em] text-[var(--muted)] uppercase">First Sends</span>
        </div>
      </motion.div>
    </div>
  );
}
