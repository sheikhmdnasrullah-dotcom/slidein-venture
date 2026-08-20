import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { CopilotShell } from "@/components/dashboard/copilot-shell";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { requireUser } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: LayoutProps<"/">) {
  const user = await requireUser();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar userEmail={user.email ?? "unknown"} />
        <CopilotShell>{children}</CopilotShell>
        <Toaster />
      </SidebarProvider>
    </TooltipProvider>
  );
}
