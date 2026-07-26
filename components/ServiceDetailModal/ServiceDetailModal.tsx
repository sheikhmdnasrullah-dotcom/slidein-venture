'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ENGINES } from '@/components/CompleteFramework/framework.data';

interface ServiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  serviceId?: string;
}

export default function ServiceDetailModal({ open, onClose, serviceId }: ServiceDetailModalProps) {
  // Find the requested item in the ENGINES data
  let selectedItem = null;
  for (const engine of ENGINES) {
    const found = engine.items.find((item) => item.id === serviceId);
    if (found) {
      selectedItem = found;
      break;
    }
  }

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
          {/* Futuristic Frosted Backdrop */}
          <motion.div
            className="absolute inset-0 bg-white/60 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 16:9 Futuristic White Professional Page Tag */}
          <motion.div
            className="relative bg-white w-full max-w-[1200px] aspect-video rounded-[2rem] overflow-hidden flex flex-col justify-center shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-black/[0.04]"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Subtle background glow/gradient to make it "futuristic white" */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(122,10,14,0.05) 0%, transparent 60%)'
            }} />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60 hover:text-black transition-all duration-300 backdrop-blur-md"
              aria-label="Close"
            >
              <X size={20} strokeWidth={2} />
            </button>

            {/* Content Container */}
            <div className="relative z-10 px-8 sm:px-16 md:px-24 max-w-4xl">
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 bg-black/5 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[#7A0A0E] animate-pulse" />
                  <span className="text-xs font-bold tracking-widest uppercase text-black/70">
                    SlideIn Venture
                  </span>
                </div>
                
                <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0A0A0A] mb-8 leading-tight">
                  {selectedItem.label}
                </h3>
                
                <p className="text-lg sm:text-xl text-[#404040] leading-relaxed font-medium">
                  {selectedItem.description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}