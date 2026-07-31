import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import AmbientEnvironment from "@/components/AmbientEnvironment/AmbientEnvironment";

import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.className} antialiased`}>
        <AmbientEnvironment />
        <Navbar />
        <main>{children}</main>

      </body>
    </html>
  );
}
