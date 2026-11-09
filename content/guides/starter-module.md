# 在 Forge Starter 加业务模块

## 需要什么

先在 Starter 仓库读取其 new-module/new-page/audit skills，确认对象生命周期、数据权限、菜单与路由。这里不复制 Starter 的后端规则。

## 选择配方

模块 manifest、Ask AI 宿主；列表、详情和编辑界面。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { Panel } from "@forge-ui-official/core";

export function ModuleOverview() {
  return <Panel><h2>客户模块</h2><p>先完成模块声明、权限与数据接口，再接列表。</p></Panel>;
}
```

## 常见错误与验收

先确认 Starter 版本具备模块 manifest 和 `module:new`。在不支持该契约的旧版本中停止并升级或询问，不猜测 manifest 字段，也不把新版本接入方式套进旧宿主。

接入时逐项核对：模块标识唯一；页面路由与菜单一致；读写能力声明与 RBAC 守卫一致；Ask AI 的知识与工具来自同一份模块声明；新模块对话能识别对象且写操作经确认。生成文件只是起点，还要验证实际接口、页面保存、权限拒绝和同一会话续办。

在 Starter 中先用 corepack pnpm run 查看脚本，再按该仓 module:new 的帮助创建模块；参数以已安装版本为准，不猜命令。manifest 声明与菜单、路由、RBAC 一起核对；Ask AI 自动知识由宿主注册链接入，不另造第二份知识库。不要仅交静态 CRUD 即声称模块完成。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/admin-module-playbook.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)
