"use server";

import { requireUser } from "@/lib/supabase/server";
import { execSync } from "node:child_process";

export async function syncKnowledgeBase() {
  await requireUser();

  try {
    const output = execSync("npm run sync", {
      cwd: process.cwd(),
      encoding: "utf-8",
      stdio: "pipe",
      timeout: 120000,
    });

    return { success: true, output: output.slice(-5000) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    return { success: false, error: message };
  }
}
