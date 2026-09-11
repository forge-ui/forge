# Forge 栅格首轮改造验证报告

状态：实现完成，待用户审阅；用户未验收。存在下述既有基线阻塞，不能据此宣称整仓检查全绿或已具备发布条件。未 commit、push 或发布 npm。

## 交付内容

- Core 新增 `Grid`、`GridItem` 及公共类型，默认 12 列、16px 间距；支持 1–24 列、响应式跨度/起始列/横纵间距、标准 div 属性与 ref。
- 使用静态 CSS Grid 和 CSS 变量；不依赖客户端窗口测量。`full` 占满一行，`auto` 重置起始位置，嵌套栅格重置自身变量。`AppLayout` 边距和默认外壳行为未改变。
- 迁移 analytics 仪表盘、商品新增页、卖家详情页。商品与卖家详情在 xl 开始主次分栏；仪表盘主区在 lg 使用 8∶4。窄屏操作区换行、表单堆叠、表格保留内部滚动。
- 复用卡片的 `width="full"`；仪表盘 Campaign 的 `ListGroup` 通过现有 className 填满 GridItem。不增加业务组件参数，不修改现有业务组件实现。
- 新增 `/components/grid`、`/cases/grid`、导航、组件清单、公共 API 快照及消费方样例；更新仓库内 forge-react skill、页面模式和统一布局审计规则。
- 文档生成器在缺少可选外部 registry 时保留已有生成目录内容，仅合入本地栅格条目；已验证重复生成结果一致。

规范：[layout-grid.md](../../skills/forge-react/references/layout-grid.md)。当前本地查看：[组件文档](http://localhost:3100/components/grid)、[矩阵案例](http://localhost:3100/cases/grid)。这些 API 尚未发布至 npm。

## 检查结果

| 检查 | 结果 |
| --- | --- |
| Core 类型、测试类型、lint | 通过 |
| Grid 单测 | 5 项通过：SSR、响应式继承与轴间距、full/start、嵌套隔离、ref/事件/DOM 顺序 |
| Core 全量测试 | 70 通过、1 失败；改造前为 65 通过、相同 1 失败 |
| 审计脚本测试 | 17 通过 |
| Core 组件审计 | 112 文件，0 错误、0 警告 |
| Core 构建与包检查 | 通过，348 文件，520,078B 压缩包；API 快照只新增栅格相关签名 |
| tarball 消费方 | Next 15.0.8 与 16.0.11 均构建通过；验证 SSR 栅格标记及生产 CSS |
| 站点类型检查 | 原命令失败：760 条错误全部位于已有 tmp-audit；使用临时配置排除该目录后通过，未修改仓库 tsconfig |
| 站点生产构建 | 编译成功；TypeScript 阶段被 tmp-audit 内既有缺失模块阻塞 |
| 新组件、测试、文档与 case 的 ESLint | 通过 |
| Skill | quick_validate 通过；list/get-component 能从本地发现 grid |
| 文档生成与差异 | 重复生成一致；git diff --check 通过 |
| 原有修改保留 | 对改造前补丁执行 git apply --reverse --check 成功；DataTable、原文档与 skill 改动均保留 |

新增模块与六档静态 CSS 使原包预算略超限，按实测增量将 packed 上限 520,000→525,000B、sourcemap 1,150,000→1,165,000B、CSS raw 15,000→18,000B；其他预算不变。当前 sourcemap 1,154,105B、CSS raw 16,839B。未通过删除资源或关闭检查绕过预算。

## 浏览器验证

复用用户当前 Chrome 扩展会话，未启动新浏览器或创建独立配置。验证后已重置临时 viewport。

- Grid case：375、639/640、767/768、1023/1024、1279/1280、1440、1535/1536px 共 12 档。实际 computed styles 验证列数、12/24 列跨度、起始列重置、间距继承和嵌套隔离。
- 三个模板及 case：375、768、1024、1440px 共 16 组截图；所有 `.forge-grid` 的 scrollWidth 均未超过其 clientWidth。
- 三个模板 768px 侧栏收起：侧栏宽 80px，页面宽恢复至 768px，栅格随可用宽度扩展。另验证手机侧栏覆盖层开合。
- 商品页：长名称输入；Save 弹窗打开、取消和确认；确认后跳转商品列表。变体选项可展开、点击。原模板不持久化表单数据，选项也没有状态更新，未将其描述成真实保存能力。
- 卖家页：Orders/Attachment 页签切换、筛选面板开关、排序控制可点击；窄屏表格局部滚动。Edit/Call/Message 等原有占位行为未改造。
- 仪表盘：Campaign 菜单展开、Refresh 选择后关闭；保持原有 mock 回调。
- 长内容 case：长标识可换行；640px 宽表格在 311px 容器内，聚焦后按 ArrowRight，scrollLeft 变为 40px。

### 既有问题与边界

1. **语言测试**：`Sidebar popover 公共导出与语言别名保持兼容` 期待 `zh-TW`，当前实现输出 `zh-CN`。改造前后均失败，未修改语言组件或其测试。
2. **整仓类型范围**：`tmp-audit` 的独立 React/Vue 演示被现有 tsconfig 扫入，产生缺失依赖与别名错误。保留该目录；正式整仓构建仍受阻。
3. **公共顶栏**：768px 展开侧栏时 analytics 文档宽 868px、商品/卖家页 848px，改造前后一致；溢出来源为公共顶栏操作组/个人菜单。case 公共站点导航在 375px 也宽 868px，在未修改的 `/cases/progress` 复现。未修改公共外壳或用全页隐藏溢出来掩盖问题。本次栅格内容区没有新增溢出，但公共窄屏顶栏仍需另行修复。

## 本地证据与后续同步

- [四档页面截图总览](../../tmp/grid-audit/after/contact-sheet.png)
- [商品页改造前后](../../tmp/grid-audit/product-before-after.png)
- [改造前指标](../../tmp/grid-audit/before/metrics.json)、[改造后指标](../../tmp/grid-audit/after/metrics.json)、[断点指标](../../tmp/grid-audit/after/grid-metrics.json)、[侧栏指标](../../tmp/grid-audit/after/sidebar.json)
- [交互记录](../../tmp/grid-audit/interaction-results.json)、[Core 检查日志](../../tmp/grid-audit/final-core-check.log)、[消费方日志](../../tmp/grid-audit/consumer.log)、[构建日志](../../tmp/grid-audit/site-build.log)

证据保存在被 git 忽略的 `tmp/grid-audit/`，供本地审阅，不随包发布。

仓库本地旧入口 `.agents/skills/forge/SKILL.md` 已更新包名、Core 路径和布局规范链接；该目录原本被 git 忽略，此改动只在当前机器生效。可分发的规范与规则以已纳入仓库的 `skills/forge-react` 为准。全局 skill 安装目录、插件缓存、外部 Forge Design 均未写入；未来发布后再通过现有 skill 安装入口更新消费者，外部 Forge Design 需要在其自身仓库同步组件映射。

## 2026-09-11 Case 展示修订

用户指出旧 case 看不出栅格且示例过于简单，旧 case 视觉交付未获认可。本轮仅重做栅格案例页：12 列标尺与可关闭参考线、六种跨度对照、比例及间距实时切换和代码联动、起始列、24 列、嵌套、横纵间距，以及真实指标/表单组件的响应式组合。旧版 case 的截图与断点数据仅作为历史证据，不代表新版 case。

验证：ESLint 与排除既有 tmp-audit 的站点类型检查通过；Chrome 实际点击 3:6:3 与 32px 后，computed style 为 span 3/6/3、gap 32px，代码同步；参考线开关 aria-checked 正确变化。375px 下真实指标区域单列、clientWidth/scrollWidth 均为 311px；几何对照板有意保留固定最小宽度并在板内滚动。Core API 与三个业务模板本轮未修改。新版待用户审阅。

### Case 最终收敛

用户认可栅格对照方向，指出底部业务组件组合不符合 Forge UI 风格。已移除“响应式与业务组件”整节及无用导入，修正关联提示文案；保留列标尺、比例/间距交互、偏移、24 列和嵌套矩阵。上一节业务组合验证记录仅对应移除前版本。
