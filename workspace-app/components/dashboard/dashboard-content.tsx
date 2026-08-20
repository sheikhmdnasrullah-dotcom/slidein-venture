"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SiteHeader } from "@/components/dashboard/site-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { OutreachChart } from "@/components/dashboard/outreach-chart";
import { ActivityTable } from "@/components/dashboard/activity-table";
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
      <Skeleton className="h-72" />
    </>
  );
}
