# 动效角色融合

Animate UI 只借两件事：角色怎么划分，以及每个角色用哪一组属性。不把 `motion` 加进 ForgeUI 或 forge-starter 的默认依赖。Dialog 这条链路只用 CSS 和现有 token。

## 角色 → token

| 角色 | Token | 时长 | Recipe |
| --- | --- | --- | --- |
| enter | `--forge-motion-enter-duration` | 180ms | 透明度，加 4px / scale .98 |
| exit | `--forge-motion-exit-duration` | 120ms | 回到同一落点，时长短于进入 |
| layout | `--forge-motion-layout-duration` | 200ms | 位移或尺寸 |
| press | `--forge-motion-press-duration` | 80ms | scale .97 |
| overlay | 与 enter / exit 同一对时长 | 180ms / 120ms | 遮罩只改透明度 |

主曲线是 `--forge-motion-feedback-ease`：`cubic-bezier(0.2, 0.8, 0.2, 1)`。控制点不越过 1，所以没有回弹。不要照搬 Animate UI 的遮罩约 400ms，也不要 `cubic-bezier` 里的 1.2，或 spring stiffness 200、damping 20。B 端高频界面不要 overshoot。

`exit` 短于 `enter`。`prefers-reduced-motion: reduce` 时 Dialog 只淡入淡出，不位移。`motion="none"` 仍然瞬时关闭。

打断（连点关闭、Esc、点遮罩）用过渡从当前帧折返，而不是把上一段关键帧播完。关闭计时在重新打开时取消，避免动画结束后又把弹窗收起。

时长若要整体变速，可以在这些 token 上乘无单位倍率，默认 1。不要另起一套 duration，也不要为此默认装 `motion`。

## 建议先迁

1. Dialog / Modal / ConfirmationDialog 的遮罩层（本页 demo）
2. Drawer：进入用 layout 200ms，离开用 exit 120ms。从触发点展开的 reveal 不要做成默认 400ms 以上
3. 下拉、菜单、Tooltip：已走 `forge-motion-surface` 的 enter / exit
4. Toast 的离开
5. Accordion、Tabs 指示器、Sidebar：layout
6. Button 按压：已是 press 80ms

先不要迁仍然依赖 `motion/react` 弹簧的 LiquidTabs、Calendar、Chat composer。它们保持可选，不进 starter 的默认依赖。

## Starter

forge-starter 只消费 `@forge-ui-official/core` 和 `styles.css`。它不自带 `motion`。业务页不要为了 Dialog 再装动画库。

## 预览

```bash
pnpm dev
```

打开 `/cases/modal`，点「打开弹窗」。再按 Esc、点遮罩，或在离开过程中再次打开。
