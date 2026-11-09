# 搭建详情页：全页与弹窗

## 需要什么

先确认阅读深度、可分享 URL、编辑权限和返回上下文。复杂详情用全页；轻量查看或局部编辑用 Modal 或 Drawer。

## 选择配方

Panel、Modal、Drawer；activity-feed。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { Panel } from "@forge-ui-official/core";

export function Details() {
  return <Panel><h2>订单详情</h2><p>订单编号：SO-128</p></Panel>;
}
```

## 常见错误与验收

轻量详情由宿主控制打开状态，并保持可恢复的对象标识。以下组件接收宿主状态，不另造全局弹窗宿主：

```tsx
"use client";

import { Modal } from "@forge-ui-official/core";

export function DetailDialog({ open, onOpenChange }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return <Modal open={open} onOpenChange={onOpenChange} title="订单详情">
    <p>订单编号：SO-128</p>
  </Modal>;
}
```

全页详情保留返回路径；弹窗关闭后恢复触发点焦点。不要用同一弹窗承载无限嵌套详情；删除必须确认并处理失败。未找到、无权限与加载失败分别反馈。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-patterns.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)
