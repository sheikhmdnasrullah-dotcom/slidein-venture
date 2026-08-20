import { requireUser } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { CopilotShell } from "@/components/dashboard/copilot-shell";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <SidebarProvider>
      <AppSidebar userEmail={user.email ?? "unknown"} />
      <SidebarInset>
        <CopilotShell>{children}</CopilotShell>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
