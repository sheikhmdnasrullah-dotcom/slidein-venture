"use client";

import { motion } from "framer-motion";
import { CalendarRange, RefreshCw } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader({
  title,
  onSync,
  syncing = false,
}: {
  title: string;
  onSync?: () => void;
  syncing?: boolean;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/60">
      <div className="flex flex-1 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-foreground">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2 px-4">
        <span className="hidden items-center gap-1.5 rounded-md border border-border/60 px-2.5 py-1.5 font-mono text-xs text-muted-foreground sm:flex">
          <CalendarRange className="size-3.5" />
          Aug 1 – Aug 18, 2026
        </span>
        {onSync && (
          <Button size="sm" variant="outline" onClick={onSync} disabled={syncing}>
            <motion.span
              className="flex items-center"
              animate={syncing ? { rotate: 360 } : { rotate: 0 }}
              transition={syncing ? { repeat: Infinity, duration: 0.8, ease: "linear" } : {}}
            >
              <RefreshCw className="size-3.5" />
            </motion.span>
            Sync now
          </Button>
        )}
      </div>
    </header>
  );
}
