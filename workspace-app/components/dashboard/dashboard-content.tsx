"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SiteHeader } from "@/components/dashboard/site-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { OutreachChart } from "@/components/dashboard/outreach-chart";
import { ActivityTable } from "@/components/dashboard/activity-table";
import { ExecutionPanel } from "@/components/dashboard/execution-panel";
import { ResearchPanel } from "@/components/dashboard/research-panel";
import { ColdEmailPanel } from "@/components/dashboard/cold-email-panel";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardResponse } from "@/lib/dashboard/types";

export function DashboardContent() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async (isSync: boolean) => {
    if (isSync) setSyncing(true);
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      const json: DashboardResponse = await res.json();
      setData(json);
      if (isSync) toast.success("Dashboard synced");
    } catch {
      if (isSync) toast.error("Sync failed");
    } finally {
      if (isSync) setSyncing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
    const interval = setInterval(() => load(false), 10000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <>
      <SiteHeader title="Dashboard" onSync={() => load(true)} syncing={syncing} />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {!data ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {data.kpis.map((kpi, i) => (
                <motion.div
                  key={kpi.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                >
                  <KpiCard data={kpi} />
                </motion.div>
              ))}
            </div>
            <OutreachChart data={data.chart} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ResearchPanel />
              <ColdEmailPanel />
            </div>
            <ExecutionPanel />
            <ActivityTable data={data.activity} />
          </>
        )}
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
      <Skeleton className="h-80" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-48" />
      <Skeleton className="h-72" />
    </>
  );
}
