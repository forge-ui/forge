"use client";

import { Suspense, type ReactNode } from "react";
import { ToastProvider } from "@aideui/core";
import { AiChatShell } from "./_shell";

export default function AiChatLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <Suspense fallback={null}>
        <AiChatShell>{children}</AiChatShell>
      </Suspense>
    </ToastProvider>
  );
}
