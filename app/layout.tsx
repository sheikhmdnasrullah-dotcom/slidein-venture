import type { Metadata } from "next";
import { Inter, Geist, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import AmbientEnvironment from "@/components/AmbientEnvironment/AmbientEnvironment";
import Footer from "@/components/Footer/Footer";

import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

/* Editorial display face — 400 only, drawn for large optical sizes. */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: "400",
});

/* Architectural micro-labels. globals.css already points --font-mono here. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

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
      className={cn("font-sans", geist.variable, instrumentSerif.variable, jetbrainsMono.variable)}
    >
      <body className={`${inter.className} antialiased`}>
        <AmbientEnvironment />
        <Navbar />
        <main>{children}</main>
        <Footer />

      </body>
    </html>
  );
}
