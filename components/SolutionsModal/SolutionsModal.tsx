'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

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
            className="relative bg-[#F7F6F3] rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.25)] max-w-[900px] w-[92vw] max-h-[85vh] overflow-auto border border-[#E3E2E0]"
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

              {/* Stage / Carousel */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.14),0_8px_20px_rgba(0,0,0,0.08)] mb-6"
                style={{
                  background: slide.bg || '#F1F1EF',
                  minHeight: 300,
                  aspectRatio: '16/9',
                  maxHeight: 500,
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
                    <SlideDefault slide={slide} />
                  </motion.div>
                </AnimatePresence>

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9 bg-gradient-to-t from-black/75 via-black/30 to-transparent">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slide.id + '-txt'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {slide.eyebrow && (
                        <span className="block text-[11px] font-[700] tracking-[0.08em] uppercase text-white/60 mb-2">
                          {slide.eyebrow}
                        </span>
                      )}
                      <h3 className="text-[clamp(1.125rem,2.5vw,1.875rem)] font-[700] leading-[1.2] tracking-[-0.02em] text-white mb-2">
                        {slide.headline}
                      </h3>
                      <p className="text-[14.5px] text-white/75 leading-[1.55] max-w-[480px]">
                        {slide.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="w-9 h-9 rounded-full border border-[#E3E2E0] bg-white flex items-center justify-center text-[#37352F] hover:border-[#9B9A97] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-150 shadow-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
                          ? 'w-5 h-[6px] bg-[#191919]'
                          : 'w-[6px] h-[6px] bg-[#E3E2E0] hover:bg-[#9B9A97]'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  aria-label="Next"
                  className="w-9 h-9 rounded-full border border-[#E3E2E0] bg-white flex items-center justify-center text-[#37352F] hover:border-[#9B9A97] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-150 shadow-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2.5L9.5 7L5 11.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SlideDefault({ slide }: { slide: SolutionSlide }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-10">
      <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-8 max-w-[520px] w-full">
        <div className="flex flex-col gap-3">
          {[80, 55, 0, 100, 88, 70, 48].map((w, i) =>
            w === 0 ? <div key={i} className="h-2" /> : (
              <div
                key={i}
                className="rounded-full"
                style={{
                  height: i === 0 ? 18 : 10,
                  width: `${w}%`,
                  background: 'rgba(255,255,255,0.18)',
                }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}