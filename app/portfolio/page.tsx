'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft01Icon as ArrowLeft, PlayIcon as Play } from 'hugeicons-react';
import VideoEmbedModal from '@/components/VideoModal/VideoEmbedModal';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const RED_TEXT = 'var(--accent)';

const podcastEdits = [
  { id: 'p1', title: 'Podcast Edit 01', url: 'https://youtu.be/kWw5P7IqfKU?si=GvFfWS5c8fgqwFpW', youtubeId: 'kWw5P7IqfKU' },
  { id: 'p2', title: 'Podcast Edit 02', url: 'https://youtu.be/Jq--0pSIiwk?si=Fe-keX8eS1d8GqZb', youtubeId: 'Jq--0pSIiwk' },
  { id: 'p3', title: 'Podcast Edit 03', url: 'https://youtu.be/JmpK396sDoY?si=ehxI2cy-dVvfFfAx', youtubeId: 'JmpK396sDoY' },
  { id: 'p4', title: 'Podcast Edit 04', url: 'https://youtu.be/_qUNzwRWdDc?si=B8d7blWbyecCblCk', youtubeId: '_qUNzwRWdDc' },
  { id: 'p5', title: 'Podcast Edit 05', url: 'https://youtu.be/mpf8zpSkbxg?si=peC0xlrKymj_3--d', youtubeId: 'mpf8zpSkbxg' },
  { id: 'p6', title: 'Podcast Edit 06', url: 'https://youtu.be/HhNAsraWyvA?si=AZw1TtK8G9GnRYSC', youtubeId: 'HhNAsraWyvA' },
];

const guestAppearances = [
  { name: 'Callum', url: 'https://vimeo.com/1167002467?fl=ip&fe=ec', platform: 'Vimeo' as const, guest: 'Jono Carrol', youtubeId: undefined },
  { name: 'Jeff', url: 'https://vimeo.com/1167000278?fl=ip&fe=ec', platform: 'Vimeo' as const, guest: 'Pilot', youtubeId: undefined },
  { name: 'Callum', url: 'https://vimeo.com/1167001646?fl=ip&fe=ec', platform: 'Vimeo' as const, guest: 'Raja Zahoor', youtubeId: undefined },
  { name: 'Callum', url: 'https://youtube.com/shorts/QfKsH8sp1RI', platform: 'YouTube' as const, guest: 'Kelly Marie', youtubeId: 'QfKsH8sp1RI' },
  { name: 'Callum', url: 'https://youtube.com/shorts/g_D2BvQIAkw?feature=share', platform: 'YouTube' as const, guest: 'Harry Sharpe', youtubeId: 'g_D2BvQIAkw' },
];

const reelEdits = [
  { id: 'r1', title: 'Reel Edit 01', url: 'https://youtube.com/shorts/YIOb6yP-Vqg?feature=share', youtubeId: 'YIOb6yP-Vqg' },
  { id: 'r2', title: 'Reel Edit 02', url: 'https://youtube.com/shorts/YIOb6yP-Vqg', youtubeId: 'YIOb6yP-Vqg' },
  { id: 'r3', title: 'Reel Edit 03', url: 'https://youtube.com/shorts/Q04ktHx09sY?feature=share', youtubeId: 'Q04ktHx09sY' },
  { id: 'r4', title: 'Reel Edit 04', url: 'https://youtube.com/shorts/NdlODkhmZQI?feature=share', youtubeId: 'NdlODkhmZQI' },
  { id: 'r5', title: 'Reel Edit 05', url: 'https://youtube.com/shorts/6_-dpyy9NPc?feature=share', youtubeId: '6_-dpyy9NPc' },
  { id: 'r6', title: 'Reel Edit 06', url: 'https://youtube.com/shorts/RuQZjz2qgoI?feature=share', youtubeId: 'RuQZjz2qgoI' },
  { id: 'r7', title: 'Reel Edit 07', url: 'https://youtube.com/shorts/_KvU5e1Y3Mk?feature=share', youtubeId: '_KvU5e1Y3Mk' },
  { id: 'r8', title: 'Reel Edit 08', url: 'https://youtube.com/shorts/QfKsH8sp1RI?feature=share', youtubeId: 'QfKsH8sp1RI' },
  { id: 'r9', title: 'Reel Edit 09', url: 'https://youtube.com/shorts/y78HsXO4MOM?feature=share', youtubeId: 'y78HsXO4MOM' },
  { id: 'r10', title: 'Reel Edit 10', url: 'https://youtube.com/shorts/uviaSTc5bAo?feature=share', youtubeId: 'uviaSTc5bAo' },
  { id: 'r11', title: 'Reel Edit 11', url: 'https://youtube.com/shorts/R8cuivdgUFk?feature=share', youtubeId: 'R8cuivdgUFk' },
  { id: 'r12', title: 'Reel Edit 12', url: 'https://youtube.com/shorts/ZtdZl419cys?feature=share', youtubeId: 'ZtdZl419cys' },
  { id: 'r13', title: 'Reel Edit 13', url: 'https://youtube.com/shorts/lRVlu8G-3Vo?feature=share', youtubeId: 'lRVlu8G-3Vo' },
  { id: 'r14', title: 'Reel Edit 14', url: 'https://youtube.com/shorts/u-lQqR65Ox0?feature=share', youtubeId: 'u-lQqR65Ox0' },
  { id: 'r15', title: 'Reel Edit 15', url: 'https://youtube.com/shorts/vgvHQRCwPq0?feature=share', youtubeId: 'vgvHQRCwPq0' },
  { id: 'r16', title: 'Reel Edit 16', url: 'https://youtube.com/shorts/_zX8pe1S96g?feature=share', youtubeId: '_zX8pe1S96g' },
  { id: 'r17', title: 'Reel Edit 17', url: 'https://youtube.com/shorts/YIOb6yP-Vqg?feature=share', youtubeId: 'YIOb6yP-Vqg' },
  { id: 'r18', title: 'Reel Edit 18', url: 'https://youtube.com/shorts/g_D2BvQIAkw?feature=share', youtubeId: 'g_D2BvQIAkw' },
];

function getYouTubeThumbnail(youtubeId?: string) {
  if (!youtubeId) return undefined;
  return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
}

/* Vimeo has no predictable thumbnail URL pattern the way YouTube does — the
   image has to come from the oEmbed response. Fetched client-side, once per
   card, and only when no static thumbnail was already supplied. */
function useVimeoThumbnail(url: string, enabled: boolean) {
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.thumbnail_url) setThumbnail(data.thumbnail_url);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [url, enabled]);

  return thumbnail;
}

function VideoCard({
  title,
  subtitle,
  url,
  thumbnail,
  aspect = 'wide',
  onClick,
}: {
  title: string;
  subtitle?: string;
  url: string;
  thumbnail?: string;
  aspect?: 'wide' | 'portrait';
  onClick: () => void;
}) {
  const vimeoThumbnail = useVimeoThumbnail(url, !thumbnail && url.includes('vimeo.com'));
  const resolvedThumbnail = thumbnail ?? vimeoThumbnail;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Play ${title}`}
      className={cn(
        'group relative w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)] cursor-pointer text-left',
        'shadow-[var(--shadow-raised)] transition-all duration-[var(--dur-slow)] ease-[var(--ease-expo)]',
        'hover:-translate-y-1.5 hover:border-[var(--accent-vivid)]/45 hover:shadow-[var(--shadow-float)]',
        aspect === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'
      )}
    >
      {resolvedThumbnail ? (
        <img
          src={resolvedThumbnail}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-all duration-[var(--dur-slow)] ease-[var(--ease-expo)] group-hover:scale-[1.06] group-hover:opacity-100"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[var(--on-surface)]/75 via-[var(--on-surface)]/5 to-transparent transition-colors duration-[var(--dur-base)] ease-[var(--ease-std)] group-hover:from-[var(--on-surface)]/85 group-hover:via-[var(--on-surface)]/15" />

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border border-[var(--surface)]/50 bg-[var(--surface-glass)] text-[var(--on-surface)] backdrop-blur-md shadow-[0_8px_24px_color-mix(in_oklch,var(--on-surface)_30%,transparent)] transition-all duration-[var(--dur-base)] ease-[var(--ease-expo)] group-hover:scale-110 group-hover:border-[var(--accent-vivid)] group-hover:bg-[var(--accent-vivid)] group-hover:text-[var(--on-accent)]">
          <Play size={20} strokeWidth={2} className="ml-0.5" />
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-[12px] font-[700] leading-snug text-[var(--surface)]">{title}</p>
        {subtitle && <p className="mt-1 text-[9px] font-[600] uppercase tracking-[0.14em] text-[var(--surface)]/75">{subtitle}</p>}
      </div>
    </button>
  );
}

export default function PortfolioPage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <section className="pt-[calc(56px+88px)] pb-20 md:pb-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/solutions" className="inline-flex items-center gap-2 text-[13px] font-[500] text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-10">
              <ArrowLeft size={16} strokeWidth={2} />
              Back to Solutions
            </Link>

            <h1 className="section-headline text-[clamp(2.5rem,6vw,4.5rem)] text-[var(--on-surface)] mb-5">
              Our work
            </h1>
            <p className="body-copy text-base text-[var(--muted)] max-w-[600px]">
              Podcast edits, guest appearances, and reel cuts — the same polish we bring to every client project.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Podcast Edits */}
      <section className="pb-24 md:pb-28">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <Rise>
            <span className="font-label mb-3 block text-[var(--accent)]">Podcast Edits</span>
            <h2 className="font-display-md text-[clamp(1.75rem,3vw,2.5rem)] text-[var(--on-surface)] mb-10 md:mb-12">
              Full podcast productions
            </h2>
          </Rise>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {podcastEdits.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <VideoCard
                  title={video.title}
                  url={video.url}
                  thumbnail={getYouTubeThumbnail(video.youtubeId)}
                  onClick={() => setVideoUrl(video.url)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guest Appearances */}
      <section className="py-20 md:py-24 bg-[var(--surface-2)] border-y border-[var(--rule)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <Rise>
            <span className="font-label mb-3 block text-[var(--accent)]">Guest Appearances</span>
            <h2 className="font-display-md text-[clamp(1.75rem,3vw,2.5rem)] text-[var(--on-surface)] mb-10 md:mb-12">
              Conversations worth watching
            </h2>
          </Rise>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {guestAppearances.map((item, index) => (
              <motion.div
                key={`${item.name}-${item.guest}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <VideoCard
                  title={`${item.name} — ${item.guest}`}
                  subtitle={item.platform}
                  url={item.url}
                  thumbnail={item.platform === 'YouTube' && item.youtubeId ? getYouTubeThumbnail(item.youtubeId) : undefined}
                  onClick={() => setVideoUrl(item.url)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reel Edits */}
      <section className="pt-20 md:pt-24 pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <Rise>
            <span className="font-label mb-3 block text-[var(--accent)]">Reel Edits</span>
            <h2 className="font-display-md text-[clamp(1.75rem,3vw,2.5rem)] text-[var(--on-surface)] mb-10 md:mb-12">
              Short-form cuts
            </h2>
          </Rise>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {reelEdits.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
              >
                <VideoCard
                  title={video.title}
                  url={video.url}
                  thumbnail={getYouTubeThumbnail(video.youtubeId)}
                  aspect="portrait"
                  onClick={() => setVideoUrl(video.url)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <VideoEmbedModal open={!!videoUrl} onClose={() => setVideoUrl(null)} url={videoUrl || ''} />
    </div>
  );
}
