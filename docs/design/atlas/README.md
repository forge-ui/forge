# 线稿图集

Forge 组件与页面的结构尺寸线稿（dimensional drawing），站点入口 `/docs/design-atlas`，成品 `public/design/forge-design-atlas.html`。

| 文件 | 内容 |
|---|---|
| `sheets.json` | 每张图的名称、范围、变量表、使用规则、待决策、源码依据与验证记录 |
| `drawing-kit.js` / `draw-sheets.js` | SVG 画法与每张图的结构绘制；坐标只是示意，规范值在 `sheets.json` |
| `drawing.css` | 图集页面样式 |
| `components.json` | 组件到图的索引，以及不属于视觉组件的导出 |

修改后运行 `pnpm design:atlas` 重新生成 HTML，并一起提交。

版本口径：0.2 适用 core 0.10.1。组件图基于 core 0.4.7（c0605f16）绘制，之后尺寸有变化的在 `vars` 里标「0.10 现状」；`status: "outdated"` 的图对应组件已重构，待重画。页面图（列表、表单、设置、详情）的推荐值与 `skills/forge-skill/references/page-recommended-standard.md` 保持一致，改一处须同步另一处。
