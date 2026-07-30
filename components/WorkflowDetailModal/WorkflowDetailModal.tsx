'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cancel01Icon as X, ArrowLeft01Icon as ChevronLeft, ArrowRight01Icon as ChevronRight } from 'hugeicons-react';

interface WorkflowSlide {
  id: string;
  headline: string;
  description: string;
  eyebrow?: string;
}

const slides: WorkflowSlide[] = [
  {
    id: 'content-detail',
    headline: 'Content Production Workflow',
    description: 'Step-by-step: Ideation → AI drafting → Review → Schedule → Publish. Customize each stage to match your team\'s process.',
    eyebrow: 'How it works',
  },
  {
    id: 'outreach-detail',
    headline: 'Outreach Systems Workflow',
    description: 'Step-by-step: Lead research → Personalization → Send sequence → Track replies → Follow-up automation. Tailor every touchpoint.',
    eyebrow: 'How it works',
  },
  {
    id: 'backend-detail',
    headline: 'Backend Tasks Workflow',
    description: 'Step-by-step: Task definition → API integration → Automation rules → Monitoring → Reporting. Configure complex pipelines visually.',
    eyebrow: 'How it works',
  },
];

interface WorkflowDetailModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WorkflowDetailModal({ open, onClose }: WorkflowDetailModalProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Refined frosted backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Premium slide panel */}
          <motion.div
            className="relative w-full max-w-[920px] rounded-3xl overflow-hidden border border-black/[0.06] bg-white/95 shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Restrained top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-black/50 hover:text-black transition-all duration-300"
              aria-label="Close"
            >
              <X size={16} strokeWidth={2} />
            </button>

            <div className="p-8 sm:p-12 md:p-14">
              {/* Carousel stage — clean, no generic backgrounds */}
              <div className="relative rounded-2xl overflow-hidden border border-black/[0.04] bg-[#FAFAF8]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide.id}
                    className="relative px-8 py-10 sm:px-12 sm:py-14"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#FF6200] mb-3 block">
                      {slide.eyebrow}
                    </span>
                    <h3 className="text-[clamp(1.25rem,2vw,1.75rem)] font-semibold tracking-[-0.02em] text-[#0A0A0A] mb-3 leading-[1.2]">
                      {slide.headline}
                    </h3>
                    <p className="text-[13.5px] sm:text-sm text-[#6B6B6B] leading-[1.7] max-w-[520px]">
                      {slide.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls — minimal, intentional */}
              <div className="flex items-center justify-between mt-5">
                <div className="flex items-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        i === current
                          ? 'w-6 h-1 bg-black/80'
                          : 'w-1 h-1 bg-black/20 hover:bg-black/40'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={prev}
                    aria-label="Previous"
                    className="w-8 h-8 rounded-full border border-black/[0.08] bg-white hover:bg-black/[0.03] flex items-center justify-center text-black/60 hover:text-black transition-all duration-200"
                  >
                    <ChevronLeft size={14} strokeWidth={2} />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next"
                    className="w-8 h-8 rounded-full border border-black/[0.08] bg-white hover:bg-black/[0.03] flex items-center justify-center text-black/60 hover:text-black transition-all duration-200"
                  >
                    <ChevronRight size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
