'use client';

interface VideoEmbedProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  className?: string;
  title?: string;
}

function getEmbedType(src: string): 'youtube' | 'vimeo' | 'framer' | 'mp4' | 'iframe' {
  if (src.includes('youtube.com') || src.includes('youtu.be')) return 'youtube';
  if (src.includes('vimeo.com')) return 'vimeo';
  if (src.includes('framer.com') || src.includes('framerusercontent')) return 'framer';
  if (/\.(mp4|webm|mov)($|\?)/.test(src)) return 'mp4';
  return 'iframe';
}

function getYouTubeId(src: string): string {
  const match = src.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : '';
}

function getVimeoId(src: string): string {
  const match = src.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : '';
}

/**
 * VideoEmbed — Universal video component for any page.
 * Supports: MP4/WebM files, YouTube, Vimeo, Framer embeds, iframes.
 *
 * Usage:
 *   <VideoEmbed src="https://youtu.be/dQw4w9WgXcQ" />
 *   <VideoEmbed src="/video.mp4" autoplay />
 *   <VideoEmbed src="https://framer.com/embed/your-video" title="Demo" />
 */
export default function VideoEmbed({ src, poster, autoplay = false, className, title = 'Video' }: VideoEmbedProps) {
  const type = getEmbedType(src);

  const wrapClass = `relative w-full h-full overflow-hidden rounded-[inherit] bg-black ${className || ''}`;

  if (type === 'mp4') {
    return (
      <div className={wrapClass}>
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={src}
          poster={poster}
          autoPlay={autoplay}
          loop={autoplay}
          muted={autoplay}
          playsInline
          controls={!autoplay}
        />
      </div>
    );
  }

  let embedSrc = src;
  if (type === 'youtube') {
    const id = getYouTubeId(src);
    embedSrc = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1${autoplay ? '&autoplay=1&mute=1' : ''}`;
  }
  if (type === 'vimeo') {
    const id = getVimeoId(src);
    embedSrc = `https://player.vimeo.com/video/${id}?${autoplay ? 'autoplay=1&muted=1&' : ''}dnt=1`;
  }

  return (
    <div className={wrapClass}>
      <iframe
        className="absolute inset-0 w-full h-full border-0"
        src={embedSrc}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

/**
 * VideoEmbedPlaceholder — Swap for VideoEmbed when ready to add real video.
 *
 * Usage:
 *   <VideoEmbedPlaceholder label="Your video description" aspectRatio="16/9" />
 */
export function VideoEmbedPlaceholder({
  label = 'Video coming soon',
  aspectRatio = '16/9',
}: {
  label?: string;
  aspectRatio?: string;
}) {
  return (
    <div
      className="w-full bg-[#F1F1EF] border-2 border-dashed border-[#E3E2E0] rounded-2xl overflow-hidden flex items-center justify-center"
      style={{ aspectRatio }}
    >
      <div className="flex flex-col items-center gap-3 px-8 text-center">
        <div className="w-14 h-14 rounded-full bg-[#E3E2E0] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#9B9A97" strokeWidth="1.5" opacity="0.5"/>
            <path d="M9.5 8.5L16.5 12L9.5 15.5V8.5Z" fill="#9B9A97" opacity="0.6"/>
          </svg>
        </div>
        <p className="text-[14.5px] font-[600] text-[#787774]">{label}</p>
        <code className="text-[11.5px] text-[#9B9A97] bg-[#E3E2E0] px-2.5 py-1 rounded-md font-mono">
          {'<VideoEmbed src="..." />'}
        </code>
      </div>
    </div>
  );
}
