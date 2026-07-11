'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import SolutionsModal from '@/components/SolutionsModal/SolutionsModal';
import VideoModal from '@/components/VideoModal/VideoModal';

const companies = [
  { name: 'OpenAI', icon: '⊙' }, { name: 'Figma', icon: '◈' },
  { name: 'Ramp', icon: '⬡' }, { name: 'Cursor', icon: '▷' },
  { name: 'Vercel', icon: '△' }, { name: 'NVIDIA', icon: '▣' },
  { name: 'Volvo', icon: '◎' }, { name: "L'Oréal", icon: '✦' },
  { name: 'Discord', icon: '◉' }, { name: 'Toyota', icon: '◇' },
  { name: '1Password', icon: '◆' }, { name: 'Riot Games', icon: '⚔' },
];

const cardData = [
  { title: 'Product Roadmap Q3', tag: 'Engineering', tagColor: '#2383E2', tagBg: '#EBF4FD', cardBg: '#F0F7FF', emoji: '🗺️', rotate: -3, x: -72, y: 18 },
  { title: 'Brand Guidelines 2024', tag: 'Design', tagColor: '#9065B0', tagBg: '#F0EAFA', cardBg: '#F8F4FD', emoji: '🎨', rotate: 1, x: 0, y: -6 },
  { title: 'Q3 Sales Playbook', tag: 'Marketing', tagColor: '#D9730D', tagBg: '#FFF0DF', cardBg: '#FFFBF5', emoji: '📈', rotate: 3.5, x: 72, y: 14 },
];

export default function Hero() {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="bg-[#F7F6F3] pt-[calc(56px+72px)] pb-0 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col items-center text-center">

        <SolutionsModal open={solutionsOpen} onClose={() => setSolutionsOpen(false)} />
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

        {/* Subtext */}
        <motion.p
          className="text-[clamp(1.125rem,2.2vw,1.375rem)] leading-[1.6] text-[#37352F] max-w-[560px] mb-9 font-[500] tracking-[-0.01em]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          A complete framework built to accelerate your revenue
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex items-center gap-3 flex-wrap justify-center mb-16"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={() => setSolutionsOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 text-[15px] font-[600] text-white bg-[#191919] rounded-[7px] hover:bg-[#2d2d2d] transition-all duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.22),0_1px_1px_rgba(0,0,0,0.10)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:-translate-y-[1px] tracking-[-0.01em] cursor-pointer"
          >
            Solutions
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 6.5H12M7 1.5L12 6.5L7 11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
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

        {/* Pile Visual */}
        <motion.div
          className="w-full max-w-[860px] relative h-[320px] mb-16"
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroPile />
        </motion.div>

        {/* Logo Strip */}
        <motion.div
          className="w-full max-w-[900px] mb-20 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <p className="text-[12.5px] text-[#9B9A97] mb-5 font-[450] tracking-[0.01em]">
            Trusted by teams at
          </p>
          <div className="flex items-center gap-10 logo-scroll w-max">
            {[...companies, ...companies].map((c, i) => (
              <span
                key={i}
                className="flex items-center gap-2 opacity-[0.42] hover:opacity-70 transition-opacity duration-200 whitespace-nowrap flex-shrink-0 cursor-default"
              >
                <span className="text-[1.1rem]">{c.icon}</span>
                <span className="text-[15px] font-[600] text-[#191919] tracking-[-0.01em]">{c.name}</span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedWordSwap() {
  const words = ['Content.', 'Outreach.', 'complex backend tasks.'];
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

function HeroPile() {
  return (
    <div className="relative h-full flex items-center justify-center">
      {cardData.map((card, i) => (
        <motion.div
          key={card.title}
          className="absolute w-[clamp(200px,26vw,290px)] rounded-xl border border-black/[0.07] shadow-[0_4px_20px_rgba(0,0,0,0.09),0_1px_4px_rgba(0,0,0,0.05)] flex flex-col gap-3 p-5 cursor-pointer select-none"
          style={{
            background: card.cardBg,
            zIndex: i + 1,
          }}
          animate={{ rotate: card.rotate, x: card.x, y: card.y }}
          whileHover={{
            y: card.y - 10,
            rotate: 0,
            zIndex: 10,
            boxShadow: '0 20px 50px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.06)',
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-xl">{card.emoji}</span>
            <span
              className="text-[10.5px] font-[650] tracking-[0.04em] uppercase px-2 py-0.5 rounded-full"
              style={{ color: card.tagColor, background: card.tagBg }}
            >
              {card.tag}
            </span>
          </div>
          {/* Title */}
          <p className="text-[14.5px] font-[600] text-[#191919] leading-tight tracking-[-0.01em]">
            {card.title}
          </p>
          {/* Content lines */}
          <div className="flex flex-col gap-1.5">
            {[100, 78, 90, 62].map((w, j) => (
              <div key={j} className="h-[8px] rounded-full bg-black/[0.08]" style={{ width: `${w}%` }} />
            ))}
          </div>
          {/* Avatars */}
          <div className="flex items-center gap-0">
            {['A', 'B', 'C'].map((a, j) => (
              <div
                key={j}
                className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-[700] text-white"
                style={{ background: card.tagColor, marginLeft: j > 0 ? '-6px' : 0 }}
              >
                {a}
              </div>
            ))}
            <span className="text-[11.5px] text-[#9B9A97] ml-2.5">3 collaborators</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
