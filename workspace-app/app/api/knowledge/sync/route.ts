import { verifyInternalSecret } from "@/lib/auth/verify-internal-secret";

export async function POST(request: Request) {
  if (!verifyInternalSecret(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { execSync } = await import("node:child_process");
    const output = execSync("npm run sync", {
      cwd: process.cwd(),
      encoding: "utf-8",
      stdio: "pipe",
      timeout: 120000,
    });

    return Response.json({
      status: "completed",
      output: output.slice(-5000),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
