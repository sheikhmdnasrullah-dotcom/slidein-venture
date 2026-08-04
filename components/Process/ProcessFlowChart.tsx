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
  number?: string;
  children?: BranchNode[];
}

interface Branch {
  id: BranchId;
  title: string;
  nodes: BranchNode[];
}

const BRANCHES: Branch[] = [
  {
    id: 'content',
    title: 'Content Production',
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
      { id: 'execution', label: 'Execution', children: [{ id: 'you-record', label: '04 You Record', number: '04' }] },
      {
        id: 'post',
        label: 'Post-production',
        children: [
          { id: 'sound-design', label: 'Sound Design', number: '05' },
          { id: 'highlight-cut', label: 'Highlight Cut', number: '06' },
          {
            id: 'full-episode-edit',
            label: 'Full Episode Edit',
            number: '07',
            children: [
              { id: 'transcripts', label: 'Transcripts and show notes', number: '08' },
              { id: 'reels', label: '3-4 vertical reels', number: '09' },
              { id: 'thumbnails', label: 'Thumbnail and Cover Arts', number: '10' },
              { id: 'articles', label: 'Three long-form articles', number: '11' },
              { id: 'linkedin-posts', label: 'LinkedIn posts', number: '12' },
            ],
          },
        ],
      },
      { id: 'distribution', label: 'Distribution' },
    ],
  },
  {
    id: 'outreach',
    title: 'Manual Outreach',
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
  const [planningOpen, setPlanningOpen] = useState(false);
  const [executionOpen, setExecutionOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [distributionOpen, setDistributionOpen] = useState(false);
  const [outreachPhaseId, setOutreachPhaseId] = useState<string | null>(null);

  const openOutreach = (id: string) => {
    const phaseId = id === 'infrastructure' ? 'fortress' : id;
    setOutreachPhaseId(phaseId);
  };
  const closeOutreach = () => setOutreachPhaseId(null);

  const togglePlanning = () => setPlanningOpen((prev) => !prev);
  const toggleExecution = () => setExecutionOpen((prev) => !prev);
  const togglePost = () => setPostOpen((prev) => !prev);

  return (
    <div className={cn('mx-auto max-w-[1200px] px-6 md:px-10', className)}>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-10 text-center"
      >
        <h2
          className="mx-auto max-w-[20ch] text-[clamp(1.75rem,3.5vw,2.75rem)] text-[var(--on-surface)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          The Complete Step by Step Process
        </h2>
      </motion.div>

      {/* Two-column flowchart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BRANCHES.map((branch, branchIndex) => (
          <div key={branch.id} className="flex flex-col gap-3">
            {branch.nodes.map((node, nodeIndex) => {
              const isPlanning = node.id === 'planning';
              const isExecution = node.id === 'execution';
              const isPost = node.id === 'post';
              const isDistribution = node.id === 'distribution';
              const isOutreach = branch.id === 'outreach';
              const showChildren =
                (isPlanning && planningOpen) ||
                (isExecution && executionOpen) ||
                (isPost && postOpen);

              return (
                <div key={node.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: nodeIndex * 0.06, ease: EASE }}
                    className="flex items-center gap-3 rounded-2xl border border-[var(--rule)] bg-[#F5F2ED] px-5 py-4 transition-all duration-300 hover:border-[var(--rule-strong)]"
                  >
                    {/* Orange dot */}
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand)]" />

                    <button
                      onClick={() => {
                        if (isPlanning) togglePlanning();
                        if (isExecution) toggleExecution();
                        if (isPost) togglePost();
                        if (isDistribution) setDistributionOpen(true);
                        if (isOutreach) openOutreach(node.id);
                      }}
                      className="flex-1 text-left text-[15px] text-[var(--on-surface)] transition-colors"
                    >
                      {node.label}
                    </button>

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--rule)] text-[var(--muted)] transition-all duration-200">
                      {(isPlanning || isExecution || isPost) ? (
                        <motion.svg
                          animate={{
                            rotate:
                              (isPlanning && planningOpen) ||
                              (isExecution && executionOpen) ||
                              (isPost && postOpen)
                                ? 45
                                : 0,
                          }}
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
                  </motion.div>

                  {(isPlanning && planningOpen && node.children) && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="ml-10 mt-2 flex flex-col gap-2 border-l-2 border-[var(--rule-strong)] pl-4"
                      >
                        {node.children.map((child, i) => (
                          <motion.div
                            key={child.id}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.05, ease: EASE }}
                            className="flex items-center gap-3 rounded-lg border border-[var(--rule)] bg-[var(--surface)] px-4 py-2.5"
                          >
                            <span className="font-label text-[10px] tracking-[0.15em] text-[var(--muted)]">
                              {child.number || `0${i + 1}`}
                            </span>
                            <span className="font-body text-[13px] text-[var(--on-surface)]">{child.label}</span>
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
                        className="ml-10 mt-2 flex flex-col gap-2 border-l-2 border-[var(--rule-strong)] pl-4"
                      >
                        {node.children.map((child, i) => (
                          <motion.div
                            key={child.id}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.05, ease: EASE }}
                            className="flex items-center gap-3 rounded-lg border border-[var(--rule)] bg-[var(--surface)] px-4 py-2.5"
                          >
                            <span className="font-body text-[13px] text-[var(--on-surface)]">{child.label}</span>
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
                        className="ml-10 mt-2 flex flex-col gap-2 border-l-2 border-[var(--rule-strong)] pl-4"
                      >
                        {node.children.map((child, i) => (
                          <motion.div
                            key={child.id}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.05, ease: EASE }}
                            className="flex items-center gap-3 rounded-lg border border-[var(--rule)] bg-[var(--surface)] px-4 py-2.5"
                          >
                            <span className="font-label text-[10px] tracking-[0.15em] text-[var(--muted)]">
                              {child.number || `0${i + 1}`}
                            </span>
                            <span className="font-body text-[13px] text-[var(--on-surface)]">{child.label}</span>
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
      </div>

      {/* Modals */}
      <PostProductionModal open={postOpen} onClose={() => setPostOpen(false)} />
      <DistributionModal open={distributionOpen} onClose={() => setDistributionOpen(false)} />
      <OutreachSlideModal open={outreachPhaseId !== null} phaseId={outreachPhaseId} onClose={closeOutreach} />
    </div>
  );
}
