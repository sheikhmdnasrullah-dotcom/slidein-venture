'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SLIDES_DATA } from './deckData';
import SlideContent from './SlideContent';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ProcessDeck() {
  const searchParams = useSearchParams();
  const rawCompany = searchParams?.get('company');
  const companyName = rawCompany ? decodeURIComponent(rawCompany) : 'Finaya Home Loans';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showOverview, setShowOverview] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; caption: string } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);

  const total = SLIDES_DATA.length;
  const currentSlide = SLIDES_DATA[currentIndex];

  const goToSlide = useCallback((newIndex: number) => {
    if (newIndex === currentIndex) return;
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const next = useCallback(() => {
    if (currentIndex < total - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, total]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      deckRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prev();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (e.shiftKey) prev();
        else next();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(total - 1);
      } else if (e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setShowOverview((o) => !o);
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setShowNotes((n) => !n);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        setShowOverview(false);
        setShowNotes(false);
        setLightboxImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev, goToSlide, total, toggleFullscreen]);

  // Touch Swipe Handler
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 360, damping: 32 },
        opacity: { duration: 0.22, ease: EASE },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      transition: {
        x: { duration: 0.2, ease: EASE },
        opacity: { duration: 0.18 },
      },
    }),
  };

  return (
    <div
      ref={deckRef}
      className="relative w-full min-h-screen bg-[#f3f4f6] text-[#0a0a0a] flex flex-col items-center justify-between pt-24 pb-6 px-3 sm:px-6 select-none overflow-hidden"
    >
      {/* ── Top Deck Chrome ────────────────────────────────────────── */}
      <div className="w-full max-w-[1380px] flex items-center justify-between gap-3 mb-3 px-2 py-1.5 rounded-lg bg-white/80 backdrop-blur-md border border-[#e5e5e5] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-heading font-bold text-[13px] tracking-tight text-[#0a0a0a]">
            <span>SLIDEIN VENTURE</span>
            <span className="text-[#ea580c]">/</span>
            <span className="text-[#525252] hidden sm:inline">MORTGAGE GROWTH ENGINE</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fff7ed] border border-[#fed7aa] font-mono text-[10px] font-bold text-[#ea580c]">
            <span>Client: {companyName}</span>
          </div>
        </div>

        {/* Slide Counter & Action Controls */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded bg-[#fafafa] border border-[#e5e5e5] font-mono text-[12px] font-bold text-[#0a0a0a]">
            <span className="text-[#ea580c]">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="text-[#a3a3a3] mx-1">/</span>
            <span>{String(total).padStart(2, '0')}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowOverview((o) => !o)}
            title="Slide Navigator (O)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[12px] font-semibold border transition-colors ${
              showOverview ? 'bg-[#171717] text-white border-[#171717]' : 'bg-white text-[#171717] border-[#e5e5e5] hover:bg-[#fafafa]'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            <span className="hidden sm:inline">Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNotes((n) => !n)}
            title="Speaker Notes (N)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[12px] font-semibold border transition-colors ${
              showNotes ? 'bg-[#ea580c] text-white border-[#ea580c]' : 'bg-white text-[#171717] border-[#e5e5e5] hover:bg-[#fafafa]'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="hidden sm:inline">Notes</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            title="Fullscreen (F)"
            className="hidden sm:flex items-center justify-center p-1.5 rounded text-[12px] font-semibold border border-[#e5e5e5] bg-white text-[#171717] hover:bg-[#fafafa]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isFullscreen ? (
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              ) : (
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Main 16:9 Viewport Stage ───────────────────────────────── */}
      <div className="relative w-full max-w-[1380px] aspect-[16/9] max-h-[calc(100vh-170px)] bg-white border-2 border-[#171717] rounded-xl shadow-[0_20px_48px_rgba(0,0,0,0.09)] overflow-hidden flex flex-col">
        {/* Animated Slide Canvas */}
        <div
          className="relative flex-1 w-full h-full overflow-hidden p-6 sm:p-8 md:p-10"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 p-6 sm:p-8 md:p-10 flex flex-col overflow-y-auto"
            >
              <SlideContent
                slide={currentSlide}
                companyName={companyName}
                onOpenImage={(src, caption) => setLightboxImage({ src, caption })}
                onNext={next}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Quick Navigation Chevrons inside Stage */}
        <button
          type="button"
          onClick={prev}
          disabled={currentIndex === 0}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border border-[#e5e5e5] shadow-md flex items-center justify-center text-[#171717] disabled:opacity-0 disabled:pointer-events-none hover:bg-white hover:scale-105 active:scale-95 transition-all z-20"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={next}
          disabled={currentIndex === total - 1}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border border-[#e5e5e5] shadow-md flex items-center justify-center text-[#171717] disabled:opacity-0 disabled:pointer-events-none hover:bg-white hover:scale-105 active:scale-95 transition-all z-20"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Bottom Orange Progress Rail */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-[#e5e5e5] z-30">
          <motion.div
            className="h-full bg-[#ea580c]"
            initial={false}
            animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            transition={{ duration: 0.25, ease: EASE }}
          />
        </div>
      </div>

      {/* ── Bottom Deck Controls ───────────────────────────────────── */}
      <div className="w-full max-w-[1380px] flex items-center justify-between gap-4 mt-3 px-3 text-[12px] font-medium text-[#737373]">
        <div className="hidden md:flex items-center gap-2">
          <span>Use <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#d4d4d4] font-mono text-[10px]">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#d4d4d4] font-mono text-[10px]">→</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#d4d4d4] font-mono text-[10px]">Space</kbd> to slide</span>
          <span>•</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#d4d4d4] font-mono text-[10px]">O</kbd> for Overview</span>
          <span>•</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#d4d4d4] font-mono text-[10px]">N</kbd> for Notes</span>
        </div>

        {/* Step Indicator Dots */}
        <div className="hidden lg:flex items-center gap-1.5">
          {SLIDES_DATA.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToSlide(i)}
              title={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === currentIndex ? 'w-6 bg-[#ea580c]' : 'w-2 bg-[#d4d4d4] hover:bg-[#a3a3a3]'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <button
            type="button"
            onClick={prev}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-md bg-white border border-[#171717] text-[#0a0a0a] font-semibold text-[13px] hover:bg-[#fafafa] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={next}
            disabled={currentIndex === total - 1}
            className="px-5 py-2 rounded-md bg-[#ea580c] border border-[#ea580c] text-white font-semibold text-[13px] hover:bg-[#c2410c] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
          >
            {currentIndex === total - 1 ? 'End of Presentation' : 'Next Slide'}
          </button>
        </div>
      </div>

      {/* ── Slide Overview Grid Modal ───────────────────────────────── */}
      <AnimatePresence>
        {showOverview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center"
            onClick={() => setShowOverview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[1180px] max-h-[85vh] bg-[#f9fafb] border border-[#171717] rounded-xl shadow-2xl p-6 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e5] mb-5">
                <div>
                  <h3 className="font-heading font-bold text-[18px] text-[#0a0a0a]">Slide Navigator</h3>
                  <p className="text-[12px] text-[#525252]">Click any slide to jump directly</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOverview(false)}
                  className="px-3 py-1.5 rounded-md bg-white border border-[#e5e5e5] text-[12px] font-bold text-[#171717] hover:bg-[#fafafa]"
                >
                  ✕ Close (Esc)
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 overflow-y-auto pr-1">
                {SLIDES_DATA.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      goToSlide(idx);
                      setShowOverview(false);
                    }}
                    className={`text-left p-3 rounded-lg border transition-all flex flex-col justify-between h-[120px] ${
                      idx === currentIndex
                        ? 'border-[#ea580c] bg-[#fff7ed] shadow-sm ring-2 ring-[#ea580c]/20'
                        : 'border-[#e5e5e5] bg-white hover:border-[#171717] hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1 font-mono text-[10px] font-bold">
                        <span className={idx === currentIndex ? 'text-[#ea580c]' : 'text-[#737373]'}>
                          Slide {String(s.id).padStart(2, '0')}
                        </span>
                        {idx === currentIndex && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#ea580c]" />
                        )}
                      </div>
                      <h4 className="font-heading font-bold text-[11px] text-[#0a0a0a] line-clamp-2 leading-tight">
                        {s.title} {s.titleHighlight}
                      </h4>
                    </div>
                    <span className="font-mono text-[9px] text-[#8a8a8a] uppercase truncate">
                      {s.phaseLabel}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Speaker Notes Drawer ───────────────────────────────────── */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="fixed bottom-6 right-6 z-[1100] w-[min(92vw,440px)] rounded-xl border-2 border-[#171717] bg-white shadow-2xl p-4 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e5e5e5]">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#ea580c] uppercase">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                Speaker Walkthrough Script · Slide {currentSlide.id}
              </div>
              <button
                type="button"
                onClick={() => setShowNotes(false)}
                className="text-[12px] text-[#737373] hover:text-[#0a0a0a]"
              >
                ✕ Close
              </button>
            </div>
            <p className="text-[13px] leading-relaxed text-[#262626] font-medium bg-[#fafafa] p-3 rounded border border-[#e5e5e5]">
              &ldquo;{currentSlide.speakerNotes}&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Lightbox Image Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1300] bg-black/85 backdrop-blur-md p-4 sm:p-10 flex flex-col items-center justify-center cursor-zoom-out"
            onClick={() => setLightboxImage(null)}
          >
            <div className="relative max-w-[1200px] w-full max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <div className="relative w-full aspect-[16/10] max-h-[75vh] rounded-lg overflow-hidden border border-white/20 shadow-2xl">
                <Image
                  src={lightboxImage.src}
                  alt={lightboxImage.caption}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="mt-4 flex items-center justify-between w-full text-white text-[13px]">
                <p className="font-mono text-[#a3a3a3]">{lightboxImage.caption}</p>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="px-3 py-1.5 rounded bg-white/20 hover:bg-white/30 text-white font-mono text-[11px] uppercase tracking-wider"
                >
                  Close (Esc)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
