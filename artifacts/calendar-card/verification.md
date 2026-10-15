# CalendarCard 外观参数与日期面板 hover 验证

日期：2026-10-13。源 checkout：/Users/hesong/Documents/gihub_space/forge，基线 HEAD：b6e9a9cc14780aadb3db2d9760e99923d47344b6。

## 最终 API

- `size?: "default" | "compact"`，默认 `default`。
- `variant?: "card" | "plain"`，默认 `card`。
- `color?: ButtonColor`，默认 `red`；支持 purple、dark、blue、red、green、yellow、grey、black、blue-dark。
- 保留 value、defaultDate、onChange、locale、labels、disabled、motion、className。

```tsx
<CalendarCard value={date} onChange={setDate} />
<CalendarCard size="compact" variant="plain" color="blue" value={date} onChange={setDate} />
```

默认模式保留原 300×427px 双层卡片及字形尺度，原有特殊字号/行高/450 字重收敛为组件兼容 token。compact 日期、星期、年月全部使用 core 14px 字号，20/24px 行高，大日期为 24px/32px 标题，日期点击区域高 32px。字体由应用继承。plain 内外表面、边框、阴影、padding/margin 均移除，保留可交互反馈与装饰日历。

选中日期/月、今天文字、焦点、进度条、日历顶部/点/撕页及选中阴影统一使用主题 token；不存在硬编码红色阴影。yellow 使用深色选中文字，black 采用随明暗主题变化的 foreground/background。

## Hover 根因和修复

复用已有稳定 Chrome 会话，在业务自定义日期弹层检查了真实鼠标悬停与 DOM；业务当前菜单指示层有局部样式抑制，不能仅凭截图归因。在未添加内部类覆盖的纯 core DropdownPanel + Button 组合中，鼠标悬停“取消”后确实出现 49×36px、8px 圆角的灰色背景。它来自 MotionMenu 共享高亮层，Button 自身背景仍是 transparent，半径仍是 rounded-full，appearance 在悬停前后也没有变化。

修复 MotionMenu 不再将嵌入的 core Button、CalendarCard 和嵌套菜单当作自己的菜单行；同步收窄菜单 hover 清背景 CSS。Button 自身不需要增加 appearance reset。真实鼠标回归确认：取消按钮 hover 时父指示层 hidden，菜单行 hover 时 visible，日期 hover 由日历自身处理，实色“确定”按钮保留蓝色。

同时修复月份选择器打开后初始焦点优先落在当前月份（旧组合选择器实际会先匹配“上一年”按钮）。

## 浏览器验证

验证路径：本仓独立 localhost:3001/cases/motion，复用已运行系统 Chrome；没有启动新浏览器进程或 profile。

- 默认 before/after 计算样式对比一致：shell 300×427、card 283×410；padding、radius、字号、字重和行高一致。截图与指标存档。选中阴影改为 token 推导，符合去除硬编码颜色要求。
- 320px DropdownPanel 内内容宽 304px、高 313px；scrollWidth=clientWidth，scrollHeight=clientHeight。六行月份（2027 年 5 月）36 个占位/日期格，高 192px，未溢出。
- 日期 14px/20px，星期 14px/20px，年月 14px/24px，大日期 24px/32px；September 文本完整，scrollWidth=clientWidth=70px，未裁切。
- 月份/年份切换、方向键、PageUp、Home、End、跨月及 Escape 焦点恢复通过；键盘焦点为蓝色 2px outline。
- 蓝色今天文字、选中高亮和阴影、进度条、图标顶部及撕页叶片均确认取到 --fg-blue；日期 hover 保留中性背景。
- 深色英文年月选择器文字清晰、蓝色选中完整；plain 表面透明，外层示例使用 semantic surface。
- CDP 模拟系统 reduced-motion 后：撕页 leaf 不存在，数字和日期网格 transform=none，CSS transitionDuration=0s。验证后已清除临时媒体模拟。
- 字体与应用父节点一致；无组件专用 Manrope/PingFang 字体声明。
- 业务测试弹层已关闭，未保存或创建业务数据。业务仓库未升级依赖或移除 CSS，需在消费此变更后迁移。

## 工程验证

- `pnpm core:check`：许可检查、core 类型检查、测试类型检查、lint、166 个运行测试、17 个脚本测试通过。
- component audit：0 error，1 条既有 fixed-width-review 警告（ask-ai-history.tsx:114）。
- 本仓 `pnpm exec tsc --noEmit` 通过。
- `pnpm core:build` 通过。
- `pnpm core:check-package` 通过；API 快照仅更新 CalendarCard/CalendarCardProps 及对应入口。CSS raw 为约 76.2KB，因新增外观 CSS 将单独的样式预算从 72KB 调为 77KB；JS 和其他包预算未放宽。
- `pnpm core:check-consumer`：真实 tarball 安装后，Next 15.5.24 与 Next 16.3.5 生产构建及 CSS 验证通过。fixture 同时编译默认和 compact/plain/blue 参数。
- `git diff --check` 通过。

## 修改文件

- [core/src/components/ui/calendar-card.tsx](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/calendar-card.tsx)
- [core/src/styles/tokens.css](/Users/hesong/Documents/gihub_space/forge/core/src/styles/tokens.css)
- [core/src/internal/motion.tsx](/Users/hesong/Documents/gihub_space/forge/core/src/internal/motion.tsx)
- [core/README.md](/Users/hesong/Documents/gihub_space/forge/core/README.md)
- [src/app/_components/animated-widget-demos.tsx](/Users/hesong/Documents/gihub_space/forge/src/app/_components/animated-widget-demos.tsx)
- [src/app/components/motion/page.tsx](/Users/hesong/Documents/gihub_space/forge/src/app/components/motion/page.tsx)
- [core/test/animated-widgets.test.tsx](/Users/hesong/Documents/gihub_space/forge/core/test/animated-widgets.test.tsx)
- [core/test/motion.test.tsx](/Users/hesong/Documents/gihub_space/forge/core/test/motion.test.tsx)
- [core/fixtures/next-consumer/app/page.tsx](/Users/hesong/Documents/gihub_space/forge/core/fixtures/next-consumer/app/page.tsx)
- [core/scripts/package-api-snapshot.mjs](/Users/hesong/Documents/gihub_space/forge/core/scripts/package-api-snapshot.mjs)
- [core/scripts/check-package.mjs](/Users/hesong/Documents/gihub_space/forge/core/scripts/check-package.mjs)

## 发布状态

仅本地实现与验证。core/package.json 版本保持 0.4.3；未 commit、push、npm publish。

## 证据

- [默认指标前后对比](default-metrics.json)
- [默认修改前截图](default-before.png)
- [默认修改后截图](default-after.png)
- [取消按钮修复前 hover 截图](button-hover-before.png)
- [紧凑日历修复后截图](compact-after.png)
- [深色英文年月选择器](dark-picker.png)
- [core 检查日志](core-check.log)
- [构建日志](core-build.log)
- [打包检查日志](package-check.log)
- [Next 15/16 tarball 消费检查日志](consumer-check.log)
