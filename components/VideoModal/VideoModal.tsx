'use client';

import { motion, AnimatePresence } from 'framer-motion';

/* ─── Replace this URL with your real Vimeo embed URL ──────────────────────
   Format: https://player.vimeo.com/video/YOUR_VIDEO_ID
   Optional params: ?autoplay=1&loop=0&title=0&byline=0&portrait=0
   ────────────────────────────────────────────────────────────────────────── */
const VIDEO_EMBED_URL = 'https://player.vimeo.com/video/1218751456?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1';

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
              <iframe
                src={VIDEO_EMBED_URL}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                title="Watch this"
                style={{ border: 'none' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}