import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import AmbientEnvironment from "@/components/AmbientEnvironment/AmbientEnvironment";
import Footer from "@/components/Footer/Footer";

import { displayFace, bodyFace, monoFace } from "./fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "SlideIn Venture — The AI workspace that works for you",
  description: "Build custom agents, search across all your apps, and automate busywork. The AI workspace where teams get more done, faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "font-sans",
        displayFace.variable,
        bodyFace.variable,
        monoFace.variable
      )}
    >
      {/* Roles come from the CSS layer (body { font-family: var(--font-sans) }),
          not from a face className here — that is what keeps a single place
          responsible for which face plays which part. */}
      <body className="antialiased">
        <AmbientEnvironment />
        <Navbar />
        <main>{children}</main>
        <Footer />

      </body>
    </html>
  );
}
