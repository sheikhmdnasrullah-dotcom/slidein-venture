'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Video Data ─────────────────────────────────────────────────────────────

const PODCAST_VIDEOS = [
  { id: 'pd-1', src: 'https://www.youtube.com/embed/kWw5P7IqfKU?si=Eedy9yg2mkxSuTfB' },
  { id: 'pd-2', src: 'https://www.youtube.com/embed/Jq--0pSIiwk?si=wXUNRbJ9vq6kCW2J' },
  { id: 'pd-3', src: 'https://www.youtube.com/embed/JmpK396sDoY?si=syUvX2IsUdVPnAAZ' },
  { id: 'pd-4', src: 'https://www.youtube.com/embed/_qUNzwRWdDc?si=6mqeFdn1Hrl1s6eg' },
  { id: 'pd-5', src: 'https://www.youtube.com/embed/mpf8zpSkbxg?si=v-fqa_H_K4J6TiK_' },
  { id: 'pd-6', src: 'https://www.youtube.com/embed/HhNAsraWyvA?si=A4-bWt81Kj-uqUT5' },
];

const REEL_VIDEOS = [
  { id: 'rl-1', src: 'https://www.youtube.com/embed/YIOb6yP-Vqg' },
  { id: 'rl-2', src: 'https://www.youtube.com/embed/Q04ktHx09sY' },
  { id: 'rl-3', src: 'https://www.youtube.com/embed/NdlODkhmZQI' },
  { id: 'rl-4', src: 'https://www.youtube.com/embed/6_-dpyy9NPc' },
  { id: 'rl-5', src: 'https://www.youtube.com/embed/RuQZjz2qgoI' },
  { id: 'rl-6', src: 'https://www.youtube.com/embed/_KvU5e1Y3Mk' },
  { id: 'rl-7', src: 'https://www.youtube.com/embed/QfKsH8sp1RI' },
  { id: 'rl-8', src: 'https://www.youtube.com/embed/y78HsXO4MOM' },
  { id: 'rl-9', src: 'https://www.youtube.com/embed/uviaSTc5bAo' },
  { id: 'rl-10', src: 'https://www.youtube.com/embed/R8cuivdgUFk' },
  { id: 'rl-11', src: 'https://www.youtube.com/embed/ZtdZl419cys' },
  { id: 'rl-12', src: 'https://www.youtube.com/embed/lRVlu8G-3Vo' },
  { id: 'rl-13', src: 'https://www.youtube.com/embed/u-lQqR65Ox0' },
  { id: 'rl-14', src: 'https://www.youtube.com/embed/vgvHQRCwPq0' },
  { id: 'rl-15', src: 'https://www.youtube.com/embed/_zX8pe1S96g' },
  { id: 'rl-16', src: 'https://www.youtube.com/embed/g_D2BvQIAkw' },
];

type Tab = 'podcast' | 'reel';

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<Tab>('podcast');

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-16 overflow-hidden" style={{ background: '#FAFAF8' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 blur-[120px]"
            style={{ background: 'radial-gradient(ellipse, rgba(220,38,38,0.15) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative max-w-[760px] mx-auto px-6 md:px-10 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11.5px] font-[700] tracking-[0.06em] uppercase mb-6"
            style={{ background: '#F5F5F5', color: '#0A0A0A', border: '1px solid #E5E5E5' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
            Our work
          </div>

          <h1
            className="text-[clamp(2.5rem,5vw,4rem)] font-[900] leading-[1.0] tracking-[-0.04em] mb-5"
            style={{ color: '#0A0A0A' }}
          >
            Portfolio
          </h1>

          <p className="text-[17px] text-[#78716C] max-w-[560px] mx-auto leading-[1.7]">
            Real edits, real results. Browse through our podcast and reel edits to see the quality we deliver for our clients.
          </p>
        </div>
      </section>

      {/* ── Gallery ────────────────────────────────────────────────── */}
      <section className="pb-40" style={{ background: '#FAFAF8' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          {/* ── Tabs ──────────────────────────────────────────────── */}
          <div
            className="inline-flex items-center rounded-xl p-1 mb-10"
            style={{ background: '#EDEDEB', border: '1px solid #E5E5E5' }}
          >
            {[
              { key: 'podcast' as Tab, label: 'Podcast Edits', count: PODCAST_VIDEOS.length },
              { key: 'reel' as Tab, label: 'Reel Edits', count: REEL_VIDEOS.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative px-5 py-2 rounded-lg text-[13px] font-[700] tracking-[0.02em] transition-all duration-200"
                style={{
                  color: activeTab === tab.key ? '#FFF' : '#787774',
                }}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="portfolio-tab-bg"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: '#DC2626' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10">
                  {tab.label}{' '}
                  <span style={{ opacity: 0.6 }}>({tab.count})</span>
                </span>
              </button>
            ))}
          </div>

          {/* ── Podcast Grid ──────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {activeTab === 'podcast' && (
              <motion.div
                key="podcast"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {PODCAST_VIDEOS.map((video) => (
                  <div
                    key={video.id}
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E5E5',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                      <iframe
                        src={video.src}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ── Reel Grid ──────────────────────────────────────────── */}
            {activeTab === 'reel' && (
              <motion.div
                key="reel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              >
                {REEL_VIDEOS.map((video) => (
                  <div
                    key={video.id}
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E5E5',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div className="relative w-full" style={{ paddingTop: '177.78%' }}>
                      <iframe
                        src={video.src}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Empty state ────────────────────────────────────────── */}
          {activeTab === 'podcast' && PODCAST_VIDEOS.length === 0 && (
            <div
              className="text-center mt-10 py-8 rounded-2xl"
              style={{ background: '#F5F4F1', border: '1px dashed #D6D3CD' }}
            >
              <p className="text-[15px] font-[600] text-[#9B9A97]">No podcast edits yet</p>
            </div>
          )}
          {activeTab === 'reel' && REEL_VIDEOS.length === 0 && (
            <div
              className="text-center mt-10 py-8 rounded-2xl"
              style={{ background: '#F5F4F1', border: '1px dashed #D6D3CD' }}
            >
              <p className="text-[15px] font-[600] text-[#9B9A97]">No reel edits yet</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}