'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorkflowDetailModal from '@/components/WorkflowDetailModal/WorkflowDetailModal';

interface SolutionSlide {
  id: string;
  headline: string;
  description: string;
  eyebrow?: string;
  bg?: string;
}

const slides: SolutionSlide[] = [
  {
    id: 'content',
    headline: 'Create content at the speed of thought',
    description: 'Generate blog posts, social media content, and marketing copy in seconds. Let AI handle the first draft while you focus on strategy.',
    eyebrow: 'Content',
    bg: 'linear-gradient(135deg, #0f1923 0%, #182842 50%, #1e3a5f 100%)',
  },
  {
    id: 'outreach',
    headline: 'Outreach that actually converts',
    description: 'Send personalized cold emails and follow-ups at scale. Track opens, replies, and conversions — all from one dashboard.',
    eyebrow: 'Outreach',
    bg: 'linear-gradient(135deg, #1a0533 0%, #2d0b6e 50%, #3a0d8a 100%)',
  },
  {
    id: 'backend',
    headline: 'Automate the complex stuff',
    description: 'Automate data pipelines, API integrations, and backend workflows. Reduce manual work and eliminate errors.',
    eyebrow: 'Backend Tasks',
    bg: 'linear-gradient(135deg, #0a1628 0%, #1a2e4a 50%, #243654 100%)',
  },
];

interface SolutionsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SolutionsModal({ open, onClose }: SolutionsModalProps) {
  const [current, setCurrent] = useState(0);
  const [workflowOpen, setWorkflowOpen] = useState(false);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <>
      <WorkflowDetailModal open={workflowOpen} onClose={() => setWorkflowOpen(false)} />

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
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

            {/* Modal - fits within screen, no scroll */}
            <motion.div
              className="relative bg-[#F7F6F3] rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.25)] max-w-[900px] w-full border border-[#E3E2E0]"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white border border-[#E3E2E0] flex items-center justify-center text-[#787774] hover:text-[#191919] hover:border-[#9B9A97] transition-all duration-150 z-10"
                aria-label="Close"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Content - compact padding */}
              <div className="p-5 md:p-6">
                {/* Stage / Carousel */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.14),0_8px_20px_rgba(0,0,0,0.08)]"
                  style={{
                    background: slide.bg || '#F1F1EF',
                    aspectRatio: '16/9',
                    maxHeight: 420,
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slide.id}
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="w-full h-full flex items-center justify-center p-8">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 max-w-[480px] w-full">
                          <div className="flex flex-col gap-2">
                            {[80, 55, 0, 100, 88, 70, 48].map((w, i) =>
                              w === 0 ? <div key={i} className="h-1.5" /> : (
                                <div
                                  key={i}
                                  className="rounded-full"
                                  style={{
                                    height: i === 0 ? 14 : 8,
                                    width: `${w}%`,
                                    background: 'rgba(255,255,255,0.18)',
                                  }}
                                />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Text overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 bg-gradient-to-t from-black/75 via-black/30 to-transparent">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={slide.id + '-txt'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {slide.eyebrow && (
                          <span className="block text-[10px] font-[700] tracking-[0.08em] uppercase text-white/60 mb-1">
                            {slide.eyebrow}
                          </span>
                        )}
                        <h3 className="text-[clamp(0.875rem,1.8vw,1.25rem)] font-[700] leading-[1.2] tracking-[-0.02em] text-white mb-1">
                          {slide.headline}
                        </h3>
                        <p className="text-[12px] md:text-[13px] text-white/75 leading-[1.5] max-w-[440px]">
                          {slide.description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-3 mb-3">
                  <button
                    onClick={prev}
                    aria-label="Previous"
                    className="w-8 h-8 rounded-full border border-[#E3E2E0] bg-white flex items-center justify-center text-[#37352F] hover:border-[#9B9A97] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-150 shadow-sm"
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M9 2.5L4.5 7L9 11.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`rounded-full transition-all duration-250 ${
                          i === current
                            ? 'w-4 h-[5px] bg-[#191919]'
                            : 'w-[5px] h-[5px] bg-[#E3E2E0] hover:bg-[#9B9A97]'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={next}
                    aria-label="Next"
                    className="w-8 h-8 rounded-full border border-[#E3E2E0] bg-white flex items-center justify-center text-[#37352F] hover:border-[#9B9A97] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-150 shadow-sm"
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M5 2.5L9.5 7L5 11.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {/* Orange CTA Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setWorkflowOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-[14px] font-[600] text-white rounded-[8px] transition-all duration-150 shadow-[0_4px_14px_rgba(255,165,0,0.35)] hover:shadow-[0_6px_20px_rgba(255,165,0,0.5)] hover:-translate-y-[1px] tracking-[-0.01em]"
                    style={{ background: '#FFA500' }}
                  >
                    See the full workflow
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7H11M8 3.5L11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}