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

   `colorScheme: "light"` renders the <meta name="color-scheme" content="light">
   tag the CSS `color-scheme: light` in globals.css (html selector) already
   sets at the stylesheet level — belt and suspenders. Mobile Chrome/Samsung
   Internet's "Auto Dark Theme" algorithmically re-colours any page that does
   not explicitly declare a supported scheme, which is what reads as "the
   homepage switches to dark mode on mobile": nothing in this codebase asked
   for that, the OS-level dark-mode heuristic did it TO the page. This tag is
   the documented opt-out, independent of any `dark:` class or media query. */
export const viewport = {
  themeColor: "#f6f4f0",
  colorScheme: "light",
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
