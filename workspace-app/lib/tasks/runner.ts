import { spawn } from "node:child_process";
import { startTaskRun, completeTaskRun, failTaskRun } from "./logger";

export async function runCommand(command: string, args: string[] = [], options: { task_type?: string; cwd?: string } = {}) {
  const runId = await startTaskRun({
    task_type: options.task_type ?? "script",
    command: `${command} ${args.join(" ")}`,
  });

  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { cwd: options.cwd, shell: true });
    const stdout: string[] = [];
    const stderr: string[] = [];

    child.stdout.on("data", (data) => stdout.push(data.toString()));
    child.stderr.on("data", (data) => stderr.push(data.toString()));

    child.on("close", async (code) => {
      const output = [
        ...stdout,
        ...(stderr.length > 0 ? ["STDERR:", ...stderr] : []),
      ]
        .join("")
        .slice(0, 50000);

      try {
        await completeTaskRun(runId, output, code ?? 0);
        resolve();
      } catch (err) {
        reject(err);
      }
    });

    child.on("error", async (err) => {
      try {
        await failTaskRun(runId, err.message);
        reject(err);
      } catch (rejectErr) {
        reject(rejectErr);
      }
    });
  });
}
