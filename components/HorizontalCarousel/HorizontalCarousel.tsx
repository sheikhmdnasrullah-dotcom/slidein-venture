'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoEmbed from '@/components/VideoEmbed/VideoEmbed';

export interface HSlide {
  id: string;
  headline: string;
  description: string;
  eyebrow?: string;
  bg?: string;
  videoSrc?: string;
  imageContent?: React.ReactNode;
}

interface HorizontalCarouselProps {
  slides: HSlide[];
  eyebrow?: string;
  title?: string;
}

export default function HorizontalCarousel({ slides, eyebrow, title }: HorizontalCarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {eyebrow && (
          <p className="text-center text-[11.5px] font-[700] tracking-[0.08em] uppercase text-[#0F8A8A] mb-3">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="text-center text-[clamp(1.875rem,3.5vw,3rem)] font-[700] leading-[1.1] tracking-[-0.025em] text-[#191919] mb-10">
            {title}
          </h2>
        )}

        {/* Stage */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.14),0_8px_20px_rgba(0,0,0,0.08)] mb-6"
          style={{
            background: slide.bg || '#F1F1EF',
            minHeight: 340,
            aspectRatio: '16/9',
            maxHeight: 560,
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
              {slide.videoSrc ? (
                <VideoEmbed src={slide.videoSrc} className="absolute inset-0 w-full h-full" />
              ) : slide.imageContent ? (
                slide.imageContent
              ) : (
                <SlideDefault slide={slide} />
              )}
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
    </section>
  );
}

function SlideDefault({ slide }: { slide: HSlide }) {
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
