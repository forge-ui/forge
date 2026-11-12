"use client";

import { useState } from "react";
import { CopyLinear } from "@forge-ui-official/core/icons";

const PROMPT = [
  "在当前项目里用 Forge UI（@forge-ui-official/core）实现界面。",
  "1. 先读 https://www.forgeui.org/llms.txt 和 https://www.forgeui.org/DESIGN.md。",
  "2. 安装 Forge Skill：curl -fsSL https://www.forgeui.org/install-skill.sh | bash",
  "3. 接入只读 MCP 服务查询组件参数、页面组件和模板，地址是 https://www.forgeui.org/api/mcp",
  "4. 组件一律从 @forge-ui-official/core 引入，颜色、字号、间距走 Forge token，不要手写库里已有的组件。",
].join("\n");

export function HomeCopyPrompt() {
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(PROMPT);
      setState("done");
    } catch {
      setState("error");
    }
    window.setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button type="button" onClick={copy} className="home-cta home-cta-dark home-copy-prompt" aria-live="polite">
      <CopyLinear size={16} color="currentColor" aria-hidden="true" />
      {state === "done" ? "已复制，贴进编码助手即可" : state === "error" ? "复制失败" : "复制接入提示词"}
    </button>
  );
}
