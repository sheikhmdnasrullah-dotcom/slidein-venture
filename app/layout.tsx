import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";


import { displayFace, bodyFace, monoFace } from "./fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "SlideIn Venture",
  description: "Helping Creators with Content Production, Outreach, and Backend Tasks.",
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
