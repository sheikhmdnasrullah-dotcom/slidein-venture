'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface ServiceSlide {
  id: string;
  title?: string;
  body: string;
}

export interface ServiceDetail {
  id: string;
  label: string;
  slides: ServiceSlide[];
}

const CONTENT_SLIDES: ServiceDetail[] = [
  {
    id: 'c-audio',
    label: 'Audio & Video Editing',
    slides: [
      {
        id: 'c-audio-1',
        title: 'Audio & Video Editing',
        body: `You send the raw file, I send back a finished episode.\n\nThe stumbles, the dead air, all of that gets trimmed. The audio gets balanced and cleaned. Then the video gets edited properly. Cuts, visuals, references, captions, whatever the moment calls for to keep the audience engaged.`,
      },
    ],
  },
  {
    id: 'c-notes',
    label: 'Show Notes',
    slides: [
      {
        id: 'c-notes-1',
        title: 'Show Notes',
        body: `Show notes pulled straight from the episode, broken down by topic with timestamps. Makes it easy to jump to the exact part you want in a long episode. Works for YouTube, podcast apps, and your website.`,
      },
    ],
  },
  {
    id: 'c-transcripts',
    label: 'Transcripts',
    slides: [
      {
        id: 'c-transcripts-1',
        title: 'Transcripts',
        body: `Clean, timestamped transcript of the finished episode, every speaker labeled, every name spelled right. Easy to read, easy to search, and ready to pull articles and posts from later.`,
      },
    ],
  },
  {
    id: 'c-clips',
    label: 'Short Form Clips',
    slides: [
      {
        id: 'c-clips-1',
        title: 'Short Form Clips',
        body: `The best 30 to 60 second clips from every episode, captioned so they play fine with the sound off. B-roll, text overlays, whatever it takes to stop the scroll. Sized right for LinkedIn, YouTube Shorts, and Instagram Reels.`,
      },
    ],
  },
  {
    id: 'c-thumbnails',
    label: 'Thumbnails & Cover Art',
    slides: [
      {
        id: 'c-thumbnails-1',
        title: 'Thumbnails & Cover Art',
        body: `Custom thumbnail designed for every episode according to your brand's tone. If you don't have a visual style yet, I build one and keep it consistent going forward.`,
      },
    ],
  },
  {
    id: 'c-blog',
    label: 'Blog Articles',
    slides: [
      {
        id: 'c-blog-1',
        title: 'Blog Articles',
        body: `The conversations throughout the whole video turned into written articles that perfectly imitate and reflect your voice, with proper research, real structure, and real opinions in them. Perfect for dropping into blogs or newsletters.`,
      },
    ],
  },
  {
    id: 'c-social',
    label: 'LinkedIn & Social Posts',
    slides: [
      {
        id: 'c-social-1',
        title: 'LinkedIn & Social Posts',
        body: `Every episode becomes several LinkedIn posts, pulled from what you actually said, in the way you actually talk.`,
      },
    ],
  },
  {
    id: 'c-publish',
    label: 'Publishing & Scheduling',
    slides: [
      {
        id: 'c-publish-1',
        title: 'Publishing & Scheduling',
        body: `Everything goes out on a real schedule after getting your final approval. Titles, descriptions, and tags get filled in properly without your continuous supervision.`,
      },
    ],
  },
];

const OUTREACH_SLIDES: ServiceDetail[] = [
  {
    id: 'o-research',
    label: 'Ideal Client Research',
    slides: [
      {
        id: 'o-research-1',
        title: 'Ideal Client Research',
        body: `Before a single email goes out, we sit down and define exactly who's worth reaching out to. We build a real filter based on industry, company size, role, and whether they actually have the budget and the need. Everything after this step is judged against it.`,
      },
    ],
  },
  {
    id: 'o-lists',
    label: 'Hand-Built Prospect Lists',
    slides: [
      {
        id: 'o-lists-1',
        title: 'Hand-Built Prospect Lists',
        body: `Every person on your list is found and verified by hand using LinkedIn, YouTube, and their own website. We avoid relying on generic lead databases, then read what they've actually said publicly first, so every email copy gets a real context for personalization.`,
      },
    ],
  },
  {
    id: 'o-verify',
    label: 'Email Verification',
    slides: [
      {
        id: 'o-verify-1',
        title: 'Email Verification',
        body: `Every address gets checked before it's ever used to make sure it won't bounce, so dead or fake emails never hurt your sender reputation.`,
      },
    ],
  },
  {
    id: 'o-write',
    label: 'Email Writing',
    slides: [
      {
        id: 'o-write-1',
        title: 'Email Writing',
        body: `We'll make sure every email references something real about that person, or a problem they've talked about publicly, then naturally position your service/product as a solution without sounding like a marketing pitch or a generic sales email. The writing will follow a strict humanizer pass. Also, no two email topics will be the same.`,
      },
    ],
  },
  {
    id: 'o-send',
    label: 'Sending & Follow-Ups',
    slides: [
      {
        id: 'o-send-1',
        title: 'Sending & Follow-Ups',
        body: `Emails will go out in a real sequence, spaced and timed the way a person would send them, aligned with each prospect's local working hours.`,
      },
    ],
  },
  {
    id: 'o-sort',
    label: 'Reply Sorting & Handoff',
    slides: [
      {
        id: 'o-sort-1',
        title: 'Reply Sorting & Handoff',
        body: `You don't have to dig through your inbox looking for the ten people who actually said yes. Every reply gets read and sorted, and the ones worth your time land in front of you with the context already attached.`,
      },
    ],
  },
];

interface ServiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  serviceId?: string;
}

export default function ServiceDetailModal({ open, onClose, serviceId }: ServiceDetailModalProps) {
  const [current, setCurrent] = useState(0);

  const allSlides = [...CONTENT_SLIDES, ...OUTREACH_SLIDES];
  const service = allSlides.find((s) => s.id === serviceId);
  const slides = service?.slides ?? [];

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Slide viewer */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.25)] max-w-[860px] w-full border border-black/[0.06] overflow-hidden"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/[0.04] border border-black/[0.08] flex items-center justify-center text-[#787774] hover:text-[#191919] hover:border-[#9B9A97] transition-all duration-150"
              aria-label="Close"
            >
              <X size={14} strokeWidth={2} />
            </button>

            {/* Plain white slide */}
            <div className="p-8 md:p-12 min-h-[320px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide?.id ?? current}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  {slide?.title && (
                    <h3 className="text-[22px] font-[700] tracking-[-0.02em] text-[#0A0A0A] mb-5">
                      {slide.title}
                    </h3>
                  )}
                  <p className="text-[15px] leading-[1.8] text-[#404040] whitespace-pre-line">
                    {slide?.body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            {slides.length > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-black/[0.06] bg-white">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="w-9 h-9 rounded-full border border-black/[0.08] bg-white flex items-center justify-center text-[#37352F] hover:border-[#9B9A97] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-150"
                >
                  <ChevronLeft size={16} strokeWidth={2} />
                </button>

                <div className="flex items-center gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`rounded-full transition-all duration-250 ${
                        i === current ? 'w-4 h-[5px] bg-[#191919]' : 'w-[5px] h-[5px] bg-black/15 hover:bg-black/25'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  aria-label="Next"
                  className="w-9 h-9 rounded-full border border-black/[0.08] bg-white flex items-center justify-center text-[#37352F] hover:border-[#9B9A97] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-150"
                >
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}