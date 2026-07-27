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
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 lg:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Refined frosted backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Premium slide panel — balanced proportions, not oversized */}
          <motion.div
            className="relative w-full max-w-[980px] rounded-3xl overflow-hidden border border-black/[0.06] bg-white/95 shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Subtle top accent line — restrained, not flashy */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7A0A0E]/40 to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-black/50 hover:text-black transition-all duration-300"
              aria-label="Close"
            >
              <X size={16} strokeWidth={2} />
            </button>

            {/* Content — generous but intentional whitespace */}
            <div className="px-8 sm:px-12 md:px-16 pt-10 pb-10 md:pt-14 md:pb-14 max-w-2xl">
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Restrained label — no pulsing dot */}
                <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#7A0A0E] mb-4 block">
                  Service
                </span>

                {/* Crisp typography — refined scale, not oversized */}
                <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.02em] text-[#0A0A0A] mb-5 leading-[1.15]">
                  {selectedItem.label}
                </h3>

                {/* Subtle divider */}
                <div className="w-8 h-px bg-black/10 mb-6" />

                {/* Body copy with tight, readable measure */}
                <p className="text-[15px] sm:text-base text-[#404040] leading-[1.7] font-normal">
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
