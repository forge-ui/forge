"use client";
import { useWorkspace } from "../_workspace-context";
export default function TasksPage() { return useWorkspace().taskView; }
