"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Send,
  GitBranch,
  Newspaper,
  BookOpen,
  Cable,
  Settings2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/dashboard/nav-user";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/workspace", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    items: [
      { title: "Cold Outreach", url: "/workspace/cold-outreach", icon: Send },
      { title: "Content Pipeline", url: "/workspace/content-pipeline", icon: GitBranch },
      { title: "SRI360 Articles", url: "/workspace/sri360", icon: Newspaper },
      { title: "Knowledge Base", url: "/workspace/knowledge", icon: BookOpen },
    ],
  },
  {
    label: "Workspace",
    items: [
      { title: "Automations (n8n)", url: "/workspace/automations", icon: Cable },
      { title: "Settings", url: "/workspace/settings", icon: Settings2 },
    ],
  },
];

export function AppSidebar({
  userEmail,
  ...props
}: React.ComponentProps<typeof Sidebar> & { userEmail: string }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/workspace" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-brand font-mono text-xs font-semibold text-white">
                SV
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-medium">SlideIn Venture</span>
                <span className="truncate text-xs text-sidebar-foreground/60">Ops console</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={pathname === item.url}
                      render={<Link href={item.url} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser userEmail={userEmail} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
