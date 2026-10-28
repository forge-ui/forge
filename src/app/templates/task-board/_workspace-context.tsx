"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { Board, Task } from "./_data";
export const WORKSPACE_BASE = "/templates/task-board";
export const projectHref = (name: string) => `${WORKSPACE_BASE}/projects/${encodeURIComponent(name)}`;
export type WorkspaceContextValue = {
  board: Board; ready: boolean; workspace: string; workspaceName: string;
  openTask: (task: Task) => void; openProject: (name: string) => void;
  createProject: () => void; createTask: () => void;
  changeBoard: (board: Board, message: string) => void;
  registerExitGuard: (guard: ((proceed:()=>void)=>void) | null) => void;
  navigate: (href: string) => void; taskView: ReactNode;
};
export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);
export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("Workspace module must be mounted inside the workspace layout");
  return value;
}
