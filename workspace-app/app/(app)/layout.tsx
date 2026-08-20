import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { KnowledgeChatWidget } from "@/components/knowledge/knowledge-chat-widget";
import { requireUser } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: LayoutProps<"/">) {
  const user = await requireUser();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar userEmail={user.email ?? "unknown"} />
        {children}
        <Toaster />
        <KnowledgeChatWidget />
      </SidebarProvider>
    </TooltipProvider>
  );
}
