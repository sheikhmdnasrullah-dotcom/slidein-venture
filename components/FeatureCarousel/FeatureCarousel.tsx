'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoEmbed from '@/components/VideoEmbed/VideoEmbed';

export interface CarouselTab {
  id: string;
  label: string;
  headline: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  videoSrc?: string;
  imageBg?: string;
  imageContent?: React.ReactNode;
}

interface FeatureCarouselProps {
  tabs: CarouselTab[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  dark?: boolean;
}

export default function FeatureCarousel({ tabs, eyebrow, title, subtitle, dark }: FeatureCarouselProps) {
  const [activeTab, setActiveTab] = useState(0);
  const current = tabs[activeTab];

  return (
    <section className={`py-24 ${dark ? 'bg-[#191919]' : 'bg-[#F7F6F3]'}`}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">

        {/* Header */}
        {(eyebrow || title || subtitle) && (
          <div className="text-center mb-14">
            {eyebrow && (
              <p className="text-[11.5px] font-[700] tracking-[0.08em] uppercase text-[#0F8A8A] mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className={`text-[clamp(1.875rem,3.5vw,3rem)] font-[700] leading-[1.1] tracking-[-0.025em] mb-4 ${dark ? 'text-white' : 'text-[#191919]'}`}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`text-[16.5px] max-w-[500px] mx-auto leading-[1.65] ${dark ? 'text-white/55' : 'text-[#787774]'}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Carousel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-8 items-start">

          {/* ── Left: Tab List ── */}
          <div className="flex flex-row lg:flex-col gap-0 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(i)}
                className={`
                  flex-shrink-0 text-left w-full transition-all duration-150 rounded-lg
                  ${i === activeTab
                    ? dark ? 'bg-white/[0.06]' : 'bg-black/[0.04]'
                    : dark ? 'hover:bg-white/[0.04]' : 'hover:bg-black/[0.03]'
                  }
                `}
              >
                <div className="flex gap-0 items-stretch">
                  {/* Active indicator bar */}
                  <div className="w-[3px] rounded-full my-1 flex-shrink-0 overflow-hidden" style={{ background: dark ? 'rgba(255,255,255,0.10)' : '#E3E2E0' }}>
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
                    <span className={`block text-[14.5px] font-[600] leading-tight tracking-[-0.01em] ${dark ? 'text-white' : 'text-[#191919]'}`}>
                      {tab.label}
                    </span>
                    {i === activeTab && (
                      <motion.p
                        className={`text-[13px] leading-[1.6] mt-1.5 overflow-hidden ${dark ? 'text-white/55' : 'text-[#787774]'}`}
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

          {/* ── Right: Media Panel ── */}
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

                {current.videoSrc ? (
                  <VideoEmbed src={current.videoSrc} className="absolute inset-0 w-full h-full" />
                ) : current.imageContent ? (
                  current.imageContent
                ) : (
                  <DocPlaceholder tab={current} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function DocPlaceholder({ tab }: { tab: CarouselTab }) {
  return (
    <div className="w-full max-w-[420px] bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden">
      {/* Window chrome */}
      <div className="bg-[#F7F6F3] px-4 py-3 flex items-center gap-3 border-b border-[#E3E2E0]">
        <div className="flex gap-1.5">
          {['#FF5F57','#FEBC2E','#28C840'].map(c => (
            <span key={c} className="w-[11px] h-[11px] rounded-full block" style={{ background: c }} />
          ))}
        </div>
        <span className="text-[12px] text-[#9B9A97] font-[500]">{tab.headline}</span>
      </div>
      {/* Body */}
      <div className="p-5 flex flex-col gap-2">
        {[85, 60, 0, 100, 92, 78, 55].map((w, i) =>
          w === 0 ? <div key={i} className="h-2" /> : (
            <div key={i} className="h-[9px] rounded-full bg-black/[0.08]" style={{ width: `${w}%` }} />
          )
        )}
        {/* Simulated AI suggestion */}
        <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-[#FBF3DB] border border-[#F5E4B2] rounded-lg">
          <span className="text-sm">✨</span>
          <span className="text-[12px] font-[500] text-[#64473A]">AI: Continue writing…</span>
        </div>
      </div>
    </div>
  );
}
