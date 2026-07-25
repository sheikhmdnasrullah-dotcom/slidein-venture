'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoModal from '@/components/VideoModal/VideoModal';



export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="bg-[#F7F6F3] pt-[calc(56px+32px)] md:pt-[calc(56px+40px)] pb-0 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col items-center text-center">

        <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />

        {/* Headline */}
        <motion.h1
          className="text-[clamp(2rem,5.5vw,4rem)] font-[700] leading-[1.04] tracking-[-0.03em] text-[#191919] max-w-[820px] mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          Helping Founders with{' '}
          <AnimatedWordSwap />
        </motion.h1>

        {/* CTAs */}
        <motion.div
          className="flex items-center gap-3 flex-wrap justify-center mb-14 mt-1"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={() => setVideoOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 text-[15px] font-[500] text-[#37352F] bg-white border border-[#E3E2E0] rounded-[7px] hover:bg-[#F7F6F3] hover:border-[#C7C5C3] transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] tracking-[-0.01em] cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" opacity="0.5"/>
              <path d="M5 4.5L10 7L5 9.5V4.5Z" fill="currentColor" opacity="0.7"/>
            </svg>
            Watch This
          </button>
        </motion.div>


      </div>
    </section>
  );
}

function AnimatedWordSwap() {
  const words = ['Content Production.', 'Outreach System.', 'Complex Backend Tasks.'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % words.length),
      2000
    );
    return () => clearTimeout(timer);
  }, [index, words.length]);

  return (
    <span className="inline-block text-[#37352F]">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(4px)', transition: { duration: 0.25 } }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

