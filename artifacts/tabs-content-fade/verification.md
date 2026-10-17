# TabsContent 纯淡入验证

- Core 使用独立 `forge-tabs-content-in`，关键帧仅 opacity 0 → 1；基础 transform: none。
- 保留 180ms、cubic-bezier(0.2, 0.8, 0.2, 1)、activeKey 重挂载与 motion 属性。
- 共享 forge-surface-in 保持原样；Modal 和 MotionPresence（KebabMenu、Tooltip、Toolbar、Toast、TextFieldSelect、SelectOption、IconTrigger）仍使用原动效。
- 复用运行中的 Chrome，在 /cases/tab 验证鼠标、ArrowRight、Home、End 和快速连续键盘切换，最终内容与选中标签一致。
- 正常动画逐帧 opacity 从 0 到 1，transform 始终 none。面板与卡片均 736 × 117，文字 14px，下方参照线 y=595.390625，采样期间不变。
- motion="none"：animation-name none、opacity 1、transform none。
- 模拟 prefers-reduced-motion: reduce，motion="auto"：animation-name none、opacity 1、transform none。验证后已恢复媒体设置并移除临时采样观察器。
- 浏览器无 error/warn；浏览器加载的共享关键帧仍包含 translateY(4px) scale(.98)，独立关键帧仅 opacity。
- core:check 通过（166 组件测试 + 17 脚本测试，审计 0 errors）；core:build、项目 tsc --noEmit、core:check-package、Tab case ESLint、git diff --check 通过。
- 既有审计提示：ask-ai-history.tsx:114 的 w-72 fixed-width-review，与本次修改无关。

原始采样：browser-samples.json；加载后 CSS：css-evidence.json；页面截图：tab-case.png。
