import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { CopilotShell } from "@/components/dashboard/copilot-shell";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { requireUser } from "@/lib/supabase/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SlideIn Venture — Ops Console",
  description: "SlideIn Venture operations dashboard",
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const user = await requireUser();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`day ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar userEmail={user.email ?? "unknown"} />
            <CopilotShell>{children}</CopilotShell>
            <Toaster />
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
