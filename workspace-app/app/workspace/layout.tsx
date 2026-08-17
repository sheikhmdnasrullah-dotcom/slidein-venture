"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar labels={{ title: "Assistant" }}>
        {children}
      </CopilotSidebar>
    </CopilotKit>
  );
}
