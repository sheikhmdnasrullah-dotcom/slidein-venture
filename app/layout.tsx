import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

import { displayFace, bodyFace, monoFace } from "./fonts";
import { cn } from "@/lib/utils";
import { THEME_BOOTSTRAP } from "@/components/Theme/theme";

export const metadata: Metadata = {
  title: "SlideIn Venture — The AI workspace that works for you",
  description: "Build custom agents, search across all your apps, and automate busywork. The AI workspace where teams get more done, faster.",
};

/* Both themes are real, so the browser is told about both rather than being
   left to guess a form-control and scrollbar palette. The pre-paint script
   narrows this to the resolved one on <html>. */
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4f0" },
    { media: "(prefers-color-scheme: dark)", color: "#16120d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      /* data-theme is intentionally NOT set here. A server-rendered value would
         be wrong for half the visitors and would have to be corrected after
         hydration — a visible flash. The script below sets it before first
         paint instead, and suppressHydrationWarning covers React noticing that
         the attribute it did not render is present. */
      suppressHydrationWarning
      className={cn(
        "font-sans",
        displayFace.variable,
        bodyFace.variable,
        monoFace.variable
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
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
        <Footer />
      </body>
    </html>
  );
}
