import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { SmoothScroll } from "@/components/SmoothScroll";
import BackgroundWallpaper from "@/components/BackgroundWallpaper/BackgroundWallpaper";

import { displayFace, bodyFace, monoFace } from "./fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "SlideIn",
  description:
    "Software to research prospects, prepare personalized email, send with a controlled workflow, and monitor delivery — with a managed service for teams that would rather we run it.",
  /* Brand icons live in /public (source + build: brand/favicon). Declared here, once, so
     there is no second favicon source: app/icon.svg was removed on purpose.
     ?v= busts browser favicon caches that still hold the old wordmark chip. */
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/favicon-96x96.png?v=2", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico?v=2", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest?v=2",
  appleWebApp: { title: "SlideIn" },
};

/* One theme, so one colour. This is the paper the page is made of — it tells
   the browser what to tint form controls, the scrollbar and mobile chrome
   with, and it must track --color-paper-50 in app/styles/tokens.css.

   "only light", NOT "light" — and the difference is the whole fix.

   Mobile Chrome and Samsung Internet ship an "Auto Dark Theme" that
   algorithmically re-colours any page it decides is a light page. That is what
   reads as "the site goes dark on mobile": nothing in this codebase asked for
   it, no `dark:` class and no media query is involved, and it does not
   reproduce in a desktop browser at a phone width — the OS-level heuristic
   does it TO the page after CSS has finished.

   `color-scheme: light` only says "this page prefers light", which the
   auto-darkener is free to override; it reads that as a page that has simply
   never thought about dark mode, which is exactly its trigger condition. The
   documented opt-out is the `only` keyword: it declares light as the sole
   supported scheme and switches the algorithm off. Set here as the meta tag
   and again in globals.css on <html>, because the two are honoured by
   different engines. */
export const viewport = {
  themeColor: "#f6f4f0",
  colorScheme: "only light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "font-sans",
        displayFace.variable,
        bodyFace.variable,
        monoFace.variable
      )}
    >
      {/* Roles come from the CSS layer (body { font-family: var(--font-sans) }),
          not from a face className here — that is what keeps a single place
          responsible for which face plays which part.

          The hero's video card — and the /imagethumb.jpg it preloaded — is
          gone, and nothing else on the site references that asset. */}
      {/* AmbientEnvironment used to be mounted here, fixed behind the whole
          document. Stage 3 moved it into the hero band. A single wash running
          the full height of the page is the texture equivalent of one value
          from top to bottom — it flattened every band it crossed. Ambient
          light now belongs to the section that is the light source. */}
      <body className="antialiased">
        <BackgroundWallpaper />
        <SmoothScroll />
        <Navbar />
        <main className="relative z-[1]">{children}</main>
        {/* No footer. The terminal band — wordmark, link columns, the consent
            line and the copyright bar — was unmounted by decision, not
            deleted: components/Footer/Footer.tsx stays in the codebase and
            mounting it again here restores it on every route. Every page now
            ends where its own content ends. */}
      </body>
    </html>
  );
}
