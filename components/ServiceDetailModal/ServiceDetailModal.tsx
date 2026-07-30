'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Cancel01Icon as X, ArrowLeft01Icon as ChevronLeft, ArrowRight01Icon as ChevronRight } from 'hugeicons-react';
import { ENGINES } from '@/components/CompleteFramework/framework.data';

interface ServiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  serviceId?: string;
  onChange?: (id: string | undefined) => void;
}

export default function ServiceDetailModal({ open, onClose, serviceId, onChange }: ServiceDetailModalProps) {
  const allItems = ENGINES.flatMap(e => e.items);
  const currentIndex = allItems.findIndex(item => item.id === serviceId);
  const selectedItem = currentIndex !== -1 ? allItems[currentIndex] : null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange && selectedItem) {
      const nextIndex = (currentIndex + 1) % allItems.length;
      onChange(allItems[nextIndex].id);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange && selectedItem) {
      const prevIndex = (currentIndex - 1 + allItems.length) % allItems.length;
      onChange(allItems[prevIndex].id);
    }
  };

  return (
    <AnimatePresence>
      {open && selectedItem && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 lg:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Refined frosted backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Navigation Controls (Outside Modal Frame for Desktop) */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hidden md:flex"
            aria-label="Previous service"
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hidden md:flex"
            aria-label="Next service"
          >
            <ChevronRight size={24} strokeWidth={2} />
          </button>

          {/* Premium slide panel — 16:9 Aspect Ratio */}
          <motion.div
            className="relative w-full max-w-[1100px] aspect-video rounded-[2rem] overflow-hidden border border-white/20 bg-[#FAFAF9] shadow-2xl flex flex-col justify-center"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Ambient Background Gradient (Elite Presentation Feel) */}
            <div 
              className="absolute inset-0 opacity-50 pointer-events-none" 
              style={{ background: 'radial-gradient(circle at 100% 0%, rgba(139,0,0,0.06) 0%, transparent 60%)' }} 
            />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/50 hover:text-black transition-all duration-300"
              aria-label="Close"
            >
              <X size={16} strokeWidth={2} />
            </button>

            {/* Mobile Navigation Controls (Inside Modal Frame) */}
            <div className="absolute bottom-6 right-6 z-20 flex gap-2 md:hidden">
              <button onClick={handlePrev} className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/70"><ChevronLeft size={16} /></button>
              <button onClick={handleNext} className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/70"><ChevronRight size={16} /></button>
            </div>

            {/* Slide Content */}
            <div className="px-8 sm:px-16 md:px-24 flex flex-col justify-center w-full max-w-4xl relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedItem.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="text-[11px] md:text-sm font-bold tracking-[0.2em] uppercase text-[#FF6200] mb-6 block">
                    Step {currentIndex + 1} of {allItems.length}
                  </span>

                  <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0A0A0A] mb-8 leading-[1.1]">
                    {selectedItem.label}
                  </h3>

                  <div className="w-16 h-1 bg-[#FF6200] mb-8 rounded-full" />

                  <p className="text-lg md:text-[22px] text-[#4A4A4A] leading-relaxed font-normal">
                    {selectedItem.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
