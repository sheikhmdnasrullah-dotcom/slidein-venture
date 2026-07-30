'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoModal from '@/components/VideoModal/VideoModal';

export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="pt-16 pb-8 overflow-hidden relative">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col items-center text-center relative z-10">

        <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />

        {/* Headline */}
        <motion.h1
          className="text-[clamp(2rem,5.5vw,4rem)] font-[700] leading-[1.04] tracking-[-0.03em] text-[#1A1A1A] max-w-[820px] mb-12 drop-shadow-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          Helping Founders with{' '}
          <AnimatedWordSwap />
        </motion.h1>

        {/* Watch This Button */}
        <motion.button
          onClick={() => setVideoOpen(true)}
          className="relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold text-black rounded-full shadow-lg transition-all duration-300 hover:scale-105 bg-white/60 backdrop-blur-md border border-white/40 hover:bg-white/80 cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <img src="/logos/play.png" alt="Play" className="w-full h-full object-contain" />
          </div>
          Watch This
        </motion.button>

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
    <span className="inline-block text-[#FF6200]">
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

