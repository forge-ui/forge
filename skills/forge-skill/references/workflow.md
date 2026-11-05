> 适用边界：本文件仅供授权实施时参考；范围与新页面方法以SKILL.md为先。仅设计不要求拼业务页或运行构建。单页不强制系统模块；状态以主skill统一规则为准。文中其他skill的注册表/precedent仅在可用且适用时查阅，缺失时使用当前Forge组件类型、源码和案例，不作为设计交付阻碍。

# 工作流

Forge 的"AI + Kit + Template"工作方式：**AI 读 PRD → 拼页面 → 人确认效果和组件选型**。AI 不手搓组件，不自己画卡片，不凭想象写 props。

## PRD → 页面（5 步详细版）

### Step 1：读 PRD，拆业务

- **页面清单**：每个路由 + 页面目的
- **每页操作**：按钮、表单、列表行动作、跳转
- **数据字段**：列表列 / 详情字段 / 表单项
- **业务状态**：订单状态 / 权限等级 / 流程阶段
- **权限边界**：谁能看谁能改
- **不清楚的**：列出来问人，别自己假设

### Step 2：挑骨架

先读 `references/official-assets.md`，再选骨架。

按场景选：

| 场景 | 骨架 |
|---|---|
| 登录 / 注册 / 找回密码 | 读 `references/templates/auth.md`，用 `TextField` / `Checkbox` / `Button` / `StyledLink` 组合 |
| 后台业务（列表 / 详情 / 新建） | 参考 `src/app/templates/(dashboard)/ecommerce/*` 或 `src/app/templates/project-template/*`，再按业务改字段 |
| 自定义页面 | `<AppLayout>` 起架子，主体按 `component-registry.json` 和 `forge-showcase-*` precedent 选组件 |
| 空白起步 | 从 `<AppLayout>` 的最小例子开始 |

### Step 3：拆页面 → 拼组件

**流程**：

1. 搭 Layout 骨架：`<AppLayout ... menuItems=...>` 确定导航
2. PageHeader 变体：`home` / `detail`，定 title + action
3. 主内容区按"区块"拆：
   - 顶部工具条 → `Toolbar` + 子组件
   - 列表展示 → `DataTable` / `ListItem` / 卡片家族
   - 表单 → `forms` 下组件组合
   - 图表 → `charts` 下对应
   - 状态 / 标签 → `Label` / `StatusBadge` / `NotificationBadge`
4. 每拼一个组件前：
   - 去 `references/components/<name>.md` 快速确认 Props
   - 去 `../forge-app-design/references/component-registry.json` 确认推荐/禁用场景
   - 表格/筛选/布局壳/模板先读 `../forge-app-design/precedents/forge-showcase-*/metadata.json`
   - 如果 md 信息不够，再读 `core/src/components/ui/<name>.tsx` 或 `core/src/components/layouts/<name>.tsx` 源文件
   - **不要凭印象写 props**，拼写错误 TS 会报，语义错误看不出来

### Step 4：缺组件停下问

Kit 里**真的**没有合适的组件（不是变体缺 / 不是 prop 缺），**停下问人**，不要自己：
- 手搓 `<div className="bg-white rounded-lg p-4 shadow">` 复刻卡片
- 用 Tailwind 默认色 `bg-blue-500` 替代 `fg-*` token
- 从外部复制一段 shadcn / antd 代码粘进来

**问人模板**：

> 这个需求我看 Kit 里没有 [X]，想到几种方案：
> A. 用 [Y] 改一改（限制：...）
> B. 在 [Z] 上扩个 prop（风险：...）
> C. 新建一个 [名字] 组件
>
> 你希望走哪个？

### Step 5：自检

- `pnpm tsc --noEmit` 过
- Dev server（常驻 `pnpm dev --port 3456 --hostname 0.0.0.0`）打开页面肉眼看
- 截图对照原 PRD / 设计稿
- 表单 submit 逻辑 / 列表加载态 / 空态都测过
- 响应式：移动端 / 中等屏幕 / 大屏各看一眼

## 常见 Anti-Pattern（**不要做**）

| 错误 | 原因 | 正确做法 |
|---|---|---|
| `className="text-blue-500"` | 不是 `fg-*` token | `text-fg-blue-500` |
| `<Icon className="text-red-500" />` | solar icon className 颜色无效 | `<Icon color="var(--fg-red)" />` |
| 手写 `<div>` 卡片复刻 Figma | 违反铁律 | 去 `@forge-ui-official/core` 找 `StatCard` / `HighlightCard` / `ProjectCard` |
| 表格里写 `Avatar + div + p + Label` | 破坏 Forge 表格密度和行高 | 用 `CellImageText` / `CellTextSubtitle` / `CellStatusDot` / `CellActions` |
| 筛选区手写一排 input/select/button | 丢失 Forge toolbar 间距和响应式 | 用 `Toolbar` / `ToolbarSearchInput` / `ToolbarSelectDropdown` / `ToolbarDatepicker` |
| 自己拼 sidebar + topbar | 违反铁律 | 用 `<AppLayout>` |
| 把 `<Button>` 的 className 加一堆自定义色 | 绕过 token 系统 | 扩 `ButtonColor` 或用现有色 |
| `// @ts-ignore` 跳过类型错误 | 欠技术债 | 修根因 |
| `size="xxs"`（不存在的尺寸） | 凭想象写 | 看 md 里的实际 `size` 取值 |

## 提交前自检清单

- [ ] 没有手搓 div 复刻 Kit 已有组件
- [ ] 表格列 render 优先使用 `Cell*` primitive
- [ ] 筛选区优先使用 `Toolbar*` primitive
- [ ] 颜色全走 `fg-*` token，无 `text-blue-500` / `bg-gray-100` 这类裸色
- [ ] Icon 全 `@forge-ui-official/core/icons` + `color="..."` prop（不用 className）
- [ ] 布局用 `<AppLayout>` 或继承自模板
- [ ] `pnpm tsc --noEmit` 通过
- [ ] 截图和设计稿 / PRD 对照过
- [ ] 空态 / 加载态 / 错误态都实现了
- [ ] 不确定的地方已问人，没自己发挥
- [ ] 无 `// @ts-ignore` / `any` 绕过

## 版本管理建议

- 每个 PR 一个业务模块（不要混）
- commit message：`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- 分支命名：`feat/订单列表页` / `fix/登录表单校验`
- 不要擅自 git push，等人 review
