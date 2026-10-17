/**
 * HERO BOOT SCRIPT — the entrance starts before first paint.
 * ---------------------------------------------------------------------------
 * Rendered first inside <Hero>, so the parser executes it before the hero
 * section exists: it arms the CSS entrance (data-hero-boot="play" on <html>,
 * with the boot timestamp) when JavaScript runs and motion is allowed. No
 * JavaScript or reduced motion means no attribute, and the hero renders in
 * its final visible state. React accepts the client-only attributes via the
 * suppressHydrationWarning pair (here and on <html>).
 *
 * Follows the documented inline-script pattern (type text/javascript on the
 * server so it runs during parse, text/plain on the client so soft
 * navigations ignore it — the layout effect re-arms the timeline there).
 */

export function HeroBootScript() {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `{try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var r=document.documentElement;r.setAttribute('data-hero-boot','play');r.setAttribute('data-hero-boot-t',String(Math.round(performance.now())))}}catch(e){}}`,
      }}
    />
  );
}
