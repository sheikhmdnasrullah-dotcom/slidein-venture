'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SolutionTab {
  id: string;
  label: string;
  headline: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  imageBg?: string;
}

const tabs: SolutionTab[] = [
  {
    id: 'content',
    label: 'Content',
    headline: 'AI-powered content creation',
    description: 'Generate blog posts, social media content, and marketing copy in seconds. Let AI handle the first draft while you focus on strategy.',
    badge: 'Write',
    badgeColor: '#0F8A8A',
    imageBg: 'linear-gradient(135deg, #D3EAE8 0%, #E8F5F4 100%)',
  },
  {
    id: 'outreach',
    label: 'Outreach',
    headline: 'Automated outreach campaigns',
    description: 'Send personalized cold emails and follow-ups at scale. Track opens, replies, and conversions — all from one dashboard.',
    badge: 'Automate',
    badgeColor: '#2383E2',
    imageBg: 'linear-gradient(135deg, #EBF4FD 0%, #F0F8FF 100%)',
  },
  {
    id: 'backend',
    label: 'Backend Tasks',
    headline: 'Complex backend automation',
    description: 'Automate data pipelines, API integrations, and backend workflows. Reduce manual work and eliminate errors.',
    badge: 'Build',
    badgeColor: '#9065B0',
    imageBg: 'linear-gradient(135deg, #F4EEFC 0%, #F9F5FE 100%)',
  },
];

interface SolutionsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SolutionsModal({ open, onClose }: SolutionsModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const current = tabs[activeTab];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-[#F7F6F3] rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.25)] max-w-[1000px] w-[92vw] max-h-[85vh] overflow-auto border border-[#E3E2E0]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-[#E3E2E0] flex items-center justify-center text-[#787774] hover:text-[#191919] hover:border-[#9B9A97] transition-all duration-150 z-10"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Content */}
            <div className="p-8 md:p-10">
              <div className="mb-8">
                <p className="text-[11.5px] font-[700] tracking-[0.08em] uppercase text-[#0F8A8A] mb-2">
                  Solutions
                </p>
                <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-[700] leading-[1.1] tracking-[-0.025em] text-[#191919]">
                  Everything you need to scale
                </h2>
              </div>

              {/* Carousel Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-8 items-start">
                {/* Left: Tab List */}
                <div className="flex flex-row lg:flex-col gap-0 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
                  {tabs.map((tab, i) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(i)}
                      className={`
                        flex-shrink-0 text-left w-full transition-all duration-150 rounded-lg
                        ${i === activeTab ? 'bg-black/[0.04]' : 'hover:bg-black/[0.03]'}
                      `}
                    >
                      <div className="flex gap-0 items-stretch">
                        <div className="w-[3px] rounded-full my-1 flex-shrink-0 overflow-hidden bg-[#E3E2E0]">
                          {i === activeTab && (
                            <motion.div
                              className="w-full rounded-full"
                              style={{ background: '#0F8A8A', height: '100%' }}
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ duration: 0.28, ease: 'easeOut' }}
                            />
                          )}
                        </div>
                        <div className="px-3.5 py-3">
                          <span className="block text-[14.5px] font-[600] leading-tight tracking-[-0.01em] text-[#191919]">
                            {tab.label}
                          </span>
                          {i === activeTab && (
                            <motion.p
                              className="text-[13px] leading-[1.6] mt-1.5 overflow-hidden text-[#787774]"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.22 }}
                            >
                              {tab.description}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right: Media Panel */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-[0_24px_60px_rgba(0,0,0,0.14),0_8px_20px_rgba(0,0,0,0.08)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      className="absolute inset-0 flex items-center justify-center p-6"
                      style={{ background: current.imageBg || '#F1F1EF' }}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -14 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {current.badge && (
                        <div
                          className="absolute top-4 left-4 text-[10.5px] font-[700] tracking-[0.05em] uppercase px-2.5 py-1 rounded-full"
                          style={{ color: current.badgeColor, background: `${current.badgeColor}18` }}
                        >
                          {current.badge}
                        </div>
                      )}

                      <div className="w-full max-w-[420px] bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden">
                        <div className="bg-[#F7F6F3] px-4 py-3 flex items-center gap-3 border-b border-[#E3E2E0]">
                          <div className="flex gap-1.5">
                            {['#FF5F57','#FEBC2E','#28C840'].map(c => (
                              <span key={c} className="w-[11px] h-[11px] rounded-full block" style={{ background: c }} />
                            ))}
                          </div>
                          <span className="text-[12px] text-[#9B9A97] font-[500]">{current.headline}</span>
                        </div>
                        <div className="p-5 flex flex-col gap-2">
                          {[85, 60, 0, 100, 92, 78, 55].map((w, i) =>
                            w === 0 ? <div key={i} className="h-2" /> : (
                              <div key={i} className="h-[9px] rounded-full bg-black/[0.08]" style={{ width: `${w}%` }} />
                            )
                          )}
                          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-[#FBF3DB] border border-[#F5E4B2] rounded-lg">
                            <span className="text-sm">✨</span>
                            <span className="text-[12px] font-[500] text-[#64473A]">AI: Suggest improvements…</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Navigation dots */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {tabs.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`rounded-full transition-all duration-250 ${
                      i === activeTab
                        ? 'w-5 h-[6px] bg-[#191919]'
                        : 'w-[6px] h-[6px] bg-[#E3E2E0] hover:bg-[#9B9A97]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}