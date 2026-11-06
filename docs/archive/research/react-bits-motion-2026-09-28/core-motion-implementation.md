# Core 第一批交互动效

实现使用 Forge tokens、CSS 和 React；没有复制 React Bits 源码或新增动画库依赖。既有 Checklist 的 Web Animations 排序保留，并接入统一动效偏好。

## 使用

本批组件默认 `motion="auto"`，按系统 `prefers-reduced-motion` 自动降级。单个组件可传 `motion="none"`。

```tsx
<Button>保存</Button>
<SelectOption options={options} motion="none" />
<TooltipGroup delay={200} warmWindow={500}>
  <Tooltip content="保存"><Button>保存</Button></Tooltip>
  <Tooltip content="共享"><Button>共享</Button></Tooltip>
</TooltipGroup>
```

`TooltipGroup` 可选：第一次悬停等待 200ms，连续跨按钮时复用 500ms 热窗口；键盘聚焦立即显示。`Tooltip` 可单独传 `delay`。

## 覆盖

| 组件 | 本批行为 |
| --- | --- |
| Button / IconButton / IconTrigger | 按压缩放与颜色反馈；原生焦点和 disabled 保留 |
| SelectOption / TextFieldSelectSuffix / ToolbarSelectDropdown / KebabMenu / IconTrigger panel | 入场与退场；关闭立即 inert；快速重开取消卸载 |
| DropdownPanel 及上述下拉内行 | 共享鼠标/焦点高亮层 |
| SidebarMenu / AppLayout 导航 | 子菜单高度展开、箭头旋转；隐藏分支 inert |
| TabBar / ButtonGroup / ToolbarPillTabs | 按实际项目宽度移动指示器，尺寸变化重新测量 |
| Tooltip | 渐入退场、可选分组延迟、描述关联 |
| Toggle / Checkbox / CheckboxWithLabel | 滑块、填充和勾选路径过渡 |
| Checklist / ChecklistItem | 既有完成与排序动画接入统一偏好，偏好改变取消排序动画 |

AppLayout 的 motion 只管理内置导航区域，不会向任意 children 或其它组件隐式传递。
DropdownPanel 负责内部高亮；面板显隐由拥有 open 状态的上层组件负责。

## 参数

全局 CSS tokens：按压 80ms、普通反馈 140ms、入场 180ms、退场 120ms、布局 200ms；按压比例 0.97。

## 验证记录

- 90 项组件回归测试通过，含新加入的退场生命周期、快速重开、两种关闭动效模式、Tooltip 延迟与描述关联、Select 关闭焦点、Kebab 退场可见性测试。
- 本批代码 ESLint 和隔离源代码 TypeScript 检查通过。
- 复用现有 Chrome，验证下拉选择、菜单回调与焦点恢复、侧栏展开、标签和选择控件；实测 motion=none / reduced-motion 的动画为 none、过渡为 0s，控制台无告警或错误。
- 仓库已有未解决合并冲突（包括 core/package.json、ask-ai.tsx 等），因此没有宣称整仓构建通过。验证在 /tmp/forge-motion-validation 源码镜像运行；仅该镜像的 ask-ai.tsx 使用 index stage 2 版本，未修改工作区冲突。测试使用现有依赖并单独补齐临时 Phosphor 包，通过 esbuild 打包；Node 22.11 使用 --experimental-require-module 运行现有 jsdom 依赖。
- 未提交、推送或发布。

## Showcase

示例已迁入主仓库 `/components/motion`（属性与代码）和 `/cases/motion`（交互矩阵）。临时预览页已停用。

## 0.3.0 第二批与发布验证

新增 Modal、Drawer、Accordion、TabsContent、ToastProvider/useToast；ConfirmationDialog 通过可选 open/onOpenChange 使用原生 dialog 弹层，省略 open 保持原有卡片形式。第二批示例已放入相同的两条 showcase 路由。

发布前已完成合并冲突处理及 Agent/Ask AI 遗留图标迁移，直接在主仓库验证：94 项组件测试、17 项脚本审计测试通过；Core 类型检查、lint、生产依赖许可检查通过；整仓生产构建通过；实际 tarball 在 Next 15.5.24 和 Next 16.3.5 消费项目构建通过。第二批 Chrome 验证包含焦点循环与恢复、确认回调、折叠展开、内容替换和多条通知关闭。
