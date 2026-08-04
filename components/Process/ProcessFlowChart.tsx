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
  description?: string;
  details?: string;
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
        description: 'Research, outline, and script your episode before you record.',
        details: 'We research the topic, write a script, and create a runsheet that guides the conversation. Every episode has a clear structure: intro, main content, and call to action.',
        children: [
          { id: 'content-ideation', label: 'Content Ideation', number: '01', description: 'Find topics that resonate with your audience.' },
          { id: 'guest-topic-research', label: 'Guest and Topic Research', number: '02', description: 'Research guests and topics that align with your brand.' },
          { id: 'script-runsheet', label: 'Script and Runsheet', number: '03', description: 'Create a script and runsheet for the episode.' },
        ],
      },
      {
        id: 'execution',
        label: 'Execution',
        description: 'You record one long-form session. We handle the rest.',
        details: 'A 45-minute recording session that becomes the raw material for everything else. We set up the audio, video, and environment so you can focus on the conversation.',
        children: [{ id: 'you-record', label: '04 You Record', number: '04', description: 'One long-form session, 45 minutes.' }],
      },
      {
        id: 'post',
        label: 'Post-production',
        description: 'Editing, sound design, and asset creation.',
        details: 'We turn your raw recording into a polished episode, then create the assets that promote it. This is where the work becomes content.',
        children: [
          { id: 'sound-design', label: 'Sound Design', number: '05', description: 'Audio cleanup, noise reduction, and mixing.' },
          { id: 'highlight-cut', label: 'Highlight Cut', number: '06', description: 'Extract the best moments for social clips.' },
          {
            id: 'full-episode-edit',
            label: 'Full Episode Edit',
            number: '07',
            description: 'Full edit with graphics, transitions, and color grade.',
            details: 'The complete episode is edited for pacing, clarity, and engagement. We add graphics, transitions, and color grading to make it visually compelling.',
            children: [
              { id: 'transcripts', label: 'Transcripts and show notes', number: '08', description: 'Full transcript and detailed show notes.' },
              { id: 'reels', label: '3-4 vertical reels', number: '09', description: 'Vertical video clips optimized for social.' },
              { id: 'thumbnails', label: 'Thumbnail and Cover Arts', number: '10', description: 'Eye-catching thumbnails and cover art.' },
              { id: 'articles', label: 'Three long-form articles', number: '11', description: 'SEO-optimized articles from episode content.' },
              { id: 'linkedin-posts', label: 'LinkedIn posts', number: '12', description: 'Engaging LinkedIn posts to drive discussion.' },
            ],
          },
        ],
      },
      { id: 'distribution', label: 'Distribution', description: 'Publish everywhere from one recording.' },
    ],
  },
  {
    id: 'outreach',
    title: 'Manual Outreach',
    nodes: [
      {
        id: 'infrastructure',
        label: 'The Infrastructure',
        description: 'Separate domains, correct authentication, and a slow ramp.',
        details: 'We buy domains for sending only. Your primary domain never sends a cold email. Reputation is attached to the sending domain. If a campaign goes badly on a dedicated domain you retire the domain. If it goes badly on your main one, your invoices and your password resets go to spam with it. Close variants of your brand, registered separately, each redirecting to your real site so a curious prospect lands somewhere real. Typically three to five domains, with a small number of mailboxes on each.',
      },
      {
        id: 'fuel',
        label: 'The Fuel',
        description: 'A verified list with intelligence attached to each lead.',
        details: 'A list built against stated criteria, verified by a person, with the intelligence that makes an email worth reading attached to each lead. Company size, revenue band, industry, role, geography, tooling in use, hiring signals, funding stage, content activity and buying trigger.',
      },
      {
        id: 'script',
        label: 'The Script',
        description: 'Copy written per lead, not a template with the name swapped.',
        details: 'Each email is written from that lead intelligence record. Not a template with the name swapped. The first two sentences come from the fields gathered in research and reference a source we can point at. Two emails from the same campaign do not share an opening.',
      },
      {
        id: 'launch',
        label: 'The Launch',
        description: 'Staged sending, human replies, and iteration.',
        details: 'Volume is spread across mailboxes and hours, and the first batch is deliberately small. Sends are distributed across mailboxes with randomised gaps inside working hours in the recipient timezone. The opening batch is held to a fraction of the list and reviewed before the rest goes.',
      },
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
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const openOutreach = (id: string) => {
    const phaseId = id === 'infrastructure' ? 'fortress' : id;
    setOutreachPhaseId(phaseId);
  };
  const closeOutreach = () => setOutreachPhaseId(null);

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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
              const isExpanded = expandedNodes.has(node.id);

              return (
                <div key={node.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: nodeIndex * 0.06, ease: EASE }}
                    className="flex items-start gap-3 rounded-2xl border border-[var(--rule)] bg-[#F5F2ED] px-5 py-4 transition-all duration-300 hover:border-[var(--rule-strong)]"
                  >
                    {/* Orange dot */}
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand)]" />

                    <div className="flex-1">
                      <button
                        onClick={() => {
                          if (isPlanning) toggleNode('planning');
                          if (isExecution) toggleNode('execution');
                          if (isPost) toggleNode('post');
                          if (isDistribution) setDistributionOpen(true);
                          if (isOutreach) openOutreach(node.id);
                        }}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <div className="flex-1">
                          <span className="block text-[15px] text-[var(--on-surface)]">{node.label}</span>
                          {node.description && (
                            <span className="mt-1 block text-[13px] text-[var(--muted)]">{node.description}</span>
                          )}
                        </div>
                        <span className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--rule)] text-[var(--muted)] transition-all duration-200">
                          {(isPlanning || isExecution || isPost || isOutreach) ? (
                            <motion.svg
                              animate={{ rotate: isExpanded ? 45 : 0 }}
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
                      </button>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {isExpanded && node.details && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            className="mt-3 pt-3 border-t border-[var(--rule)]"
                          >
                            <p className="text-[12px] leading-relaxed text-[var(--muted)] uppercase tracking-wide">
                              {node.details}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Children */}
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
