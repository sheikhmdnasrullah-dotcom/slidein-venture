'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import PostProductionModal from './PostProductionModal';
import DistributionModal from './DistributionModal';
import OutreachSlideModal from './OutreachSlideModal';

const EASE = [0.16, 1, 0.3, 1] as const;

type BranchId = 'content' | 'outreach';

interface BranchNode {
  id: string;
  label: string;
  description?: string;
  number?: string;
  children?: BranchNode[];
}

interface Branch {
  id: BranchId;
  title: string;
  accent: string;
  accentHover: string;
  nodes: BranchNode[];
}

const BRANCHES: Branch[] = [
  {
    id: 'content',
    title: 'Content Production',
    accent: 'var(--color-brand)',
    accentHover: 'var(--color-brand-hi)',
    nodes: [
      {
        id: 'planning',
        label: 'Planning',
        children: [
          { id: 'content-ideation', label: 'Content Ideation', number: '01' },
          { id: 'guest-topic-research', label: 'Guest and Topic Research', number: '02' },
          { id: 'script-runsheet', label: 'Script and Runsheet', number: '03' },
        ],
      },
      { id: 'execution', label: 'Execution', children: [
          { id: 'you-record', label: '04 You Record', number: '04' },
        ] },
      { id: 'post', label: 'Post-production', children: [
          { id: 'sound-design', label: 'Sound Design', number: '05' },
          { id: 'highlight-cut', label: 'Highlight Cut', number: '06' },
          { id: 'full-episode-edit', label: 'Full Episode Edit', number: '07', children: [
            { id: 'transcripts', label: 'Transcripts and show notes', number: '08' },
            { id: 'reels', label: '3-4 vertical reels', number: '09' },
            { id: 'thumbnails', label: 'Thumbnail and Cover Arts', number: '10' },
            { id: 'articles', label: 'Three long-form articles', number: '11' },
            { id: 'linkedin-posts', label: 'LinkedIn posts', number: '12' },
          ]},
        ] },
      { id: 'distribution', label: 'Distribution' },
    ],
  },
  {
    id: 'outreach',
    title: 'Manual Outreach',
    accent: 'var(--color-brand-hi)',
    accentHover: 'var(--color-brand)',
    nodes: [
      { id: 'infrastructure', label: 'The Infrastructure' },
      { id: 'fuel', label: 'The Fuel' },
      { id: 'script', label: 'The Script' },
      { id: 'launch', label: 'The Launch' },
    ],
  },
];

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function ProcessFlowChart({ className }: { className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [activeBranch, setActiveBranch] = useState<BranchId | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
const [planningOpen, setPlanningOpen] = useState(false);
  const [executionOpen, setExecutionOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
const [distributionOpen, setDistributionOpen] = useState(false);
  const [outreachPhaseId, setOutreachPhaseId] = useState<string | null>(null);

const openOutreach = (id: string) => {
    /* The infrastructure node maps to the steps "fortress" phase; the rest
       share their ids directly. */
    const phaseId = id === 'infrastructure' ? 'fortress' : id;
    setOutreachPhaseId(phaseId);
  };
  const closeOutreach = () => setOutreachPhaseId(null);

  const toggleExpand = () => setExpanded((prev) => !prev);
  const togglePlanning = () => setPlanningOpen((prev) => !prev);
  const toggleExecution = () => setExecutionOpen((prev) => !prev);
  const togglePost = () => setPostOpen((prev) => !prev);

  return (
    <>
    <div className={cn('mx-auto max-w-[1200px] px-6 md:px-10', className)}>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-10 text-center"
      >
        <h2 className="font-display-xl max-w-[20ch] mx-auto text-[clamp(1.75rem,3.5vw,2.75rem)] text-[var(--on-surface)]">
          The Complete Step by Step Process
        </h2>
      </motion.div>

      {/* Flowchart */}
      <div className="relative">
        {/* Origin node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex justify-center mb-8"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <span className="block h-4 w-4 rounded-full bg-[var(--accent-vivid)]" />
              <span className="absolute inset-0 h-4 w-4 rounded-full bg-[var(--accent-vivid)] opacity-40 animate-ping" />
            </div>
          </div>
        </motion.div>

        {/* Connecting lines from origin to branch headers */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <svg className="h-8 w-full max-w-[800px]" preserveAspectRatio="none">
              <motion.line
                x1="25%"
                y1="0"
                x2="25%"
                y2="100%"
                stroke="var(--rule-strong)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
              <motion.line
                x1="75%"
                y1="0"
                x2="75%"
                y2="100%"
                stroke="var(--rule-strong)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              />
            </svg>
          </motion.div>
        )}

        {/* Branch headers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {BRANCHES.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
            >
              <button
                onClick={toggleExpand}
                className="group w-full flex items-center justify-between rounded-xl border border-[var(--rule-strong)] px-6 py-4 text-left transition-all duration-300 hover:shadow-[0_8px_30px_color-mix(in_oklch,var(--on-surface)_8%,transparent)]"
                style={{
                  background: expanded && activeBranch === branch.id ? 'var(--accent-wash)' : 'var(--surface)',
                  borderColor: expanded && activeBranch === branch.id ? 'var(--accent-ring)' : 'var(--rule-strong)',
                }}
                onMouseEnter={() => setActiveBranch(branch.id)}
                onMouseLeave={() => setActiveBranch(null)}
              >
                <span
                  className="font-display-sm text-[clamp(1rem,1.5vw,1.25rem)] transition-colors duration-300"
                  style={{ color: expanded && activeBranch === branch.id ? branch.accent : 'var(--on-surface)' }}
                >
                  {branch.title}
                </span>
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    background: expanded && activeBranch === branch.id ? branch.accent : 'var(--rule)',
                    color: expanded && activeBranch === branch.id ? 'var(--on-accent)' : 'var(--muted)',
                  }}
                >
                  <PlusIcon />
                </span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Expanded nodes */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {BRANCHES.map((branch, branchIndex) => (
                <div key={branch.id} className="flex flex-col gap-3">
                  {branch.nodes.map((node, nodeIndex) => {
const isPlanning = node.id === 'planning';
                    const isExecution = node.id === 'execution';
                    const isPost = node.id === 'post';
                    const isDistribution = node.id === 'distribution';
                    const showChildren = (isPlanning && planningOpen) || (isExecution && executionOpen) || (isPost && postOpen);

                    return (
                      <div key={node.id}>
                        <motion.div
                          initial={{ opacity: 0, x: branchIndex === 0 ? -10 : 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: nodeIndex * 0.05, ease: EASE }}
                          onMouseEnter={() => setHoveredNode(node.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                          className="group relative"
                        >
                          <div
                            className="flex items-center gap-4 rounded-xl border px-5 py-4 transition-all duration-300"
                            style={{
                              background: 'var(--surface-2)',
                              borderColor: hoveredNode === node.id ? branch.accent : 'var(--rule)',
                              transform: hoveredNode === node.id ? 'translateX(4px)' : 'none',
                            }}
                          >
                            {/* Accent dot */}
                            <span className="relative flex h-2.5 w-2.5 shrink-0">
                              <span
                                className="absolute inset-0 rounded-full opacity-40"
                                style={{ backgroundColor: branch.accent }}
                              />
                              <span
                                className="absolute inset-[-2px] rounded-full opacity-0 transition-opacity duration-300"
                                style={{
                                  backgroundColor: branch.accent,
                                  opacity: hoveredNode === node.id ? 0.3 : 0,
                                }}
                              />
                            </span>

<button
onClick={(isPlanning || isExecution || isPost || isDistribution || branch.id === 'outreach') ? () => {
                                if (isPlanning) togglePlanning();
                                if (isExecution) toggleExecution();
                                if (isPost) togglePost();
                                if (isDistribution) setDistributionOpen(true);
                                if (branch.id === 'outreach') openOutreach(node.id);
                              } : undefined}
                              className="flex-1 font-body text-left text-[15px] text-[var(--on-surface)] transition-colors duration-300"
                            >
                              {node.label}
                            </button>

                            <span
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300"
                              style={{
                                background: hoveredNode === node.id ? branch.accent : 'var(--rule)',
                                color: hoveredNode === node.id ? 'var(--on-accent)' : 'var(--muted)',
                              }}
                            >
                              {(isPlanning || isExecution || isPost) ? (
                                <motion.svg
                                  animate={{ rotate: (isPlanning && planningOpen) || (isExecution && executionOpen) || (isPost && postOpen) ? 45 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                >
                                  <path d="M12 5v14M5 12h14" />
                                </motion.svg>
                              ) : (
                                <PlusIcon />
                              )}
                            </span>
                          </div>
                        </motion.div>

                        {(isPlanning && planningOpen && node.children) && (
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: EASE }}
                              className="ml-8 mt-2 flex flex-col gap-2 border-l-2 border-[var(--rule-strong)] pl-4"
                            >
                              {node.children.map((child, i) => (
                                <motion.div
                                  key={child.id}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.25, delay: i * 0.06, ease: EASE }}
                                  className="flex items-center gap-3 rounded-lg border border-[var(--rule)] bg-[var(--surface)] px-4 py-3"
                                >
                                  <span className="font-label text-[10px] tracking-[0.15em] text-[var(--muted)]">
                                    {child.number || `0${i + 1}`}
                                  </span>
                                  <span className="font-body text-[13px] text-[var(--on-surface)]">
                                    {child.label}
                                  </span>
                                </motion.div>
                              ))}
                            </motion.div>
                          </AnimatePresence>
                        )}

                        {isExecution && executionOpen && node.children && (
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: EASE }}
                              className="ml-8 mt-2 flex flex-col gap-2 border-l-2 border-[var(--rule-strong)] pl-4"
                            >
                              {node.children.map((child, i) => (
                                <motion.div
                                  key={child.id}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.25, delay: i * 0.06, ease: EASE }}
                                  className="flex items-center gap-3 rounded-lg border border-[var(--rule)] bg-[var(--surface)] px-4 py-3"
                                >
                                  <span className="font-body text-[13px] text-[var(--on-surface)]">
                                    {child.label}
                                  </span>
                                </motion.div>
                              ))}
                            </motion.div>
                          </AnimatePresence>
                        )}

                        {isPost && postOpen && node.children && (
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: EASE }}
                              className="ml-8 mt-2 flex flex-col gap-2 border-l-2 border-[var(--rule-strong)] pl-4"
                            >
                              {node.children.map((child, i) => (
                                <motion.div
                                  key={child.id}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.25, delay: i * 0.06, ease: EASE }}
                                  className="flex items-center gap-3 rounded-lg border border-[var(--rule)] bg-[var(--surface)] px-4 py-3"
                                >
                                  <span className="font-label text-[10px] tracking-[0.15em] text-[var(--muted)]">
                                    {child.number || `0${i + 1}`}
                                  </span>
                                  <span className="font-body text-[13px] text-[var(--on-surface)]">
                                    {child.label}
                                  </span>
                                </motion.div>
                              ))}
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
<PostProductionModal open={postOpen} onClose={() => setPostOpen(false)} />
    <DistributionModal open={distributionOpen} onClose={() => setDistributionOpen(false)} />
    <OutreachSlideModal open={outreachPhaseId !== null} phaseId={outreachPhaseId} onClose={closeOutreach} />
    </>
  );
}

