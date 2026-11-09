# 搭建表单页：基础、分组与分步

## 需要什么

先列字段、默认值、校验、保存动作和取消后的去向。短表单单页；长表单按业务分组；有先后依赖时再分步。

## 选择配方

Panel、Button；参考真实表单案例。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { Button, Panel } from "@forge-ui-official/core";

export function BasicForm() {
  return <Panel><form><label>名称<input name="name" required /></label><Button type="submit">保存</Button></form></Panel>;
}
```

## 常见错误与验收

示例只展示结构；接业务前需实现提交、服务端校验与错误关联。提交中防重复，失败保留输入；分步切换保留草稿。不要以 toast 代替字段错误，也不要为了视觉平均随意分列。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-recommended-standard.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)

