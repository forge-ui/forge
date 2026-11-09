# 搭建业务列表页

## 需要什么

先确定管理对象、查询条件、排序、分页和批量操作权限。选择最接近的列表案例，而不是把列表包装成看板。

## 选择配方

recent-records；DataTable、StatusBadge。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { StatusBadge } from "@forge-ui-official/core";

export function OrderStatus() {
  return <StatusBadge variant="soft" color="green" label="已完成" />;
}
```

## 常见错误与验收

实体名称提供真实详情入口；筛选、排序与分页保持可恢复状态。空结果区分无数据与筛选无匹配；批量动作仅对已选对象生效。不要把分类、角色都画成彩色胶囊。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-patterns.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)
