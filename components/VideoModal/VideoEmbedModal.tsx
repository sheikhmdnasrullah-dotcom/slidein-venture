'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface VideoEmbedModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
}

function getEmbedUrl(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be')
      ? url.split('/').pop()?.split('?')[0]
      : new URL(url).searchParams.get('v');
    return `https://www.youtube.com/embed/${videoId || ''}?autoplay=1&rel=0`;
  }
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return `https://player.vimeo.com/video/${videoId || ''}?autoplay=1`;
  }
  return url;
}

export default function VideoEmbedModal({ open, onClose, url }: VideoEmbedModalProps) {
  const embedUrl = getEmbedUrl(url);

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
          <motion.div
            className="absolute inset-0 bg-[var(--scrim)] backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 bg-[var(--letterbox)] rounded-[var(--radius-md)] shadow-[0_40px_100px_color-mix(in oklch, var(--on-surface) 80%, transparent)] max-w-[960px] w-full overflow-hidden border border-[var(--rule)]"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[var(--rule-strong)] border border-[var(--rule)] flex items-center justify-center text-[var(--on-accent)] hover:bg-[var(--rule-strong)] hover:border-[var(--rule)] transition-all duration-150 z-20 cursor-pointer"
              aria-label="Close video"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <div className="aspect-video w-full">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
                title="Embedded video"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
