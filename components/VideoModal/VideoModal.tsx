'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Video from 'next-video';
import getStartedVideo from '../../videos/get-started.mp4';

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
}

export default function VideoModal({ open, onClose }: VideoModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Backdrop with heavy blur and dark overlay */}
          <motion.div
            className="absolute inset-0 bg-[var(--scrim)] backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="relative z-10 bg-[var(--letterbox)] rounded-[var(--radius-md)] shadow-[0_40px_100px_color-mix(in oklch, var(--on-surface) 80%, transparent)] max-w-[960px] w-full overflow-hidden border border-[var(--rule)]"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[var(--rule-strong)] border border-[var(--rule)] flex items-center justify-center text-[var(--on-accent)] hover:bg-[var(--rule-strong)] hover:border-[var(--rule)] transition-all duration-150 z-20 cursor-pointer"
              aria-label="Close video"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Video Player */}
            <div className="aspect-video w-full">
              <Video
                src={getStartedVideo}
                className="w-full h-full"
                controls
                autoPlay
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}