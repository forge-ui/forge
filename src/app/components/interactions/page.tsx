import type { Metadata } from "next";
import { InteractionDirectory } from "../_fusion/directory";

export const metadata: Metadata = { title: "交互示例 · Forge" };
export default function InteractionsPage() { return <InteractionDirectory />; }
