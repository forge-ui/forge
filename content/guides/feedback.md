# 状态与反馈

## 需要什么

区分持久业务状态、一次动作反馈以及页面空、错、加载状态。颜色只辅助语义，文字必须清楚。

## 选择配方

StatusBadge soft、ToastProvider/useToast；现有空态与加载组件。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { StatusBadge } from "@forge-ui-official/core";

export function PendingStatus() {
  return <StatusBadge variant="soft" color="yellow" label="待处理" />;
}
```

## 常见错误与验收

成功 green、失败 red、警示 yellow、信息 blue、中性 grey。toast 由宿主统一提供，避免重复 Provider；空态给下一步，错误给重试，加载避免布局跳变。不要用 solid 或手写 pill 替代 soft 默认，也不要把徽章当按钮。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/status-presentation.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)
