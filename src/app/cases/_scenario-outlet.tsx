"use client";

import { createContext, useContext, type ReactNode } from "react";

const ScenarioContext = createContext<ReactNode>(null);

export function ScenarioProvider({
  scenarios,
  children,
}: {
  scenarios: ReactNode;
  children: ReactNode;
}) {
  return <ScenarioContext.Provider value={scenarios}>{children}</ScenarioContext.Provider>;
}

export function ScenarioOutlet() {
  const scenarios = useContext(ScenarioContext);
  if (!scenarios) return null;
  return <div className="flex min-w-0 flex-col gap-10">{scenarios}</div>;
}
