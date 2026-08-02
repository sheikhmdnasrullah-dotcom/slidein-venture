import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";


import { displayFace, bodyFace, monoFace } from "./fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "SlideIn Venture — The AI workspace that works for you",
  description: "Build custom agents, search across all your apps, and automate busywork. The AI workspace where teams get more done, faster.",
};

/* One theme, so one colour. This is the paper the page is made of — it tells
   the browser what to tint form controls, the scrollbar and mobile chrome
   with, and it must track --color-paper-50 in app/styles/tokens.css. */
export const viewport = {
  themeColor: "#f6f4f0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      /* Hero.tsx sets data-thread-departed on this element once the hero's
         thread dot leaves its hairline, and that happens after hydration —
         hence suppressHydrationWarning. There is no theme attribute and no
         pre-paint script any more: the site has one theme, so nothing about
         <html> depends on what the visitor prefers. */
      suppressHydrationWarning
      className={cn(
        "font-sans",
        displayFace.variable,
        bodyFace.variable,
        monoFace.variable
      )}
    >
      <head>
      </head>
      {/* Roles come from the CSS layer (body { font-family: var(--font-sans) }),
          not from a face className here — that is what keeps a single place
          responsible for which face plays which part. */}
      {/* AmbientEnvironment used to be mounted here, fixed behind the whole
          document. Stage 3 moved it into the hero band. A single wash running
          the full height of the page is the texture equivalent of one value
          from top to bottom — it flattened every band it crossed. Ambient
          light now belongs to the section that is the light source. */}
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>

      </body>
    </html>
  );
}
