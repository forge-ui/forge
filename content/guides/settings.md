# 搭建设置页

## 需要什么

先区分个人偏好、组织设置、权限范围与危险操作。明确即时保存还是显式保存，同一分组不要混用。

## 选择配方

Panel、Button；设置类 Screen 或案例。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { Button, Panel } from "@forge-ui-official/core";

export function Settings() {
  return <Panel><h2>通知偏好</h2><label><input type="checkbox" name="email" />邮件通知</label><Button type="button">保存设置</Button></Panel>;
}
```

## 常见错误与验收

示例按钮需接真实持久化后才可交付。分组说明影响范围，未保存离开时提示；重置需说明恢复值。危险区域与普通配置分开，不要让开关只改变视觉而不保存。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-patterns.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)

