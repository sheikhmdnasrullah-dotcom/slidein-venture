'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoModal from '@/components/VideoModal/VideoModal';

export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="pt-[calc(56px+14px)] md:pt-[calc(56px+18px)] pb-16 overflow-hidden relative">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col items-center text-center relative z-10">

        <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />

        {/* Headline */}
        <motion.h1
          className="text-[clamp(2rem,5.5vw,4rem)] font-[700] leading-[1.04] tracking-[-0.03em] text-[#0A0A0A] max-w-[820px] mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          Helping Founders with{' '}
          <AnimatedWordSwap />
        </motion.h1>

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
    <span className="inline-block text-[#7A0A0E]">
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

