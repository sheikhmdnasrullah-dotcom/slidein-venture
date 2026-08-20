"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export function CopilotShell({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" showDevConsole={false}>
      <CopilotSidebar labels={{ title: "Assistant" }}>{children}</CopilotSidebar>
    </CopilotKit>
  );
}
