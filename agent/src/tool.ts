import type { z } from "zod";

/** A function the agent may call in the browser, with the signed-in user's session. */
export type AgentTool<Input = unknown> = {
  name: string;
  /** Short name shown to the user, e.g. "预览主色". Defaults to name. */
  label?: string;
  description: string;
  input: z.ZodType<Input>;
  /** Show Allow / Deny before running. */
  needsApproval?: boolean;
  // Method syntax keeps AgentTool<{ path: string }> assignable to AgentTool[].
  execute(input: Input): unknown;
  /** Label for one call, e.g. 点击「保存」; overrides `label`. */
  labelFor?(input: Input): string;
  /** Decide per call whether to ask first, e.g. only for clicks on 删除. */
  needsApprovalFor?(input: Input): boolean;
};

export function defineTool<Input>(tool: AgentTool<Input>): AgentTool<Input> {
  return tool;
}
