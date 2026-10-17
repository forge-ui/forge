# 本地组件融合预览

当前实现：**99 项正式融合已落入主仓分支 `codex/component-fusion-migration`**，其中 54 项增强既有组件、45 项为真实 React/core 组合案例。另有 23 项暂缓评估；186 设备配对不纳入。本轮变更保存在该迁移分支，未合并 main、未发布，core 版本仍为 0.4.5。

正式实现完成、技术检查、用户验收与 npm 发布是不同状态。用户明确验收的编号仍只有 **040、013、043、044、031、039、046**；没有将其余实现自动标记为已验收。上一轮「可以，看到的这三个没问题」未指明编号，不据此扩算验收数量。

## 查看入口

- [正式交互总览](http://localhost:3001/components/interactions)：浏览全部 99 项，可搜索、切换分类、语言、主题和动效，进入对应组件页或组合案例页。
- [集中评审页](http://localhost:3001/prototype/component-fusion)：使用同一份正式 React 实现，保留“通过 / 需调整 / 待看”、备注、筛选及评审导出；“暂缓评估”单独展示 23 项。
- 原组件与案例页：54 项增强归入 `/components/<分类>#interaction-<编号>`，45 项组合归入 `/cases/<分类>#interaction-<编号>`，不另建一套平行组件分类。
- [AppLayout 侧栏独立预览](http://localhost:3001/prototype/sidebar-motion)：040 直接使用已有 AppLayout；总览中嵌入此实际页面。

其余 98 项在页面直接挂载 React。正式条目不再用 HTML 快照代替实现，原型快照仅保留在暂缓评估区及历史材料中；无需启动实验室 4317 服务。

## 融合范围与风格

默认中文并支持英文切换；99 项英文描述已改为与中文对应的简短业务用途。保留 Forge 既有中文分类，统一蓝、紫、黑主题、字体、字号、粗细和颜色。界面图标优先使用公开 Solar 图标入口；第三方登录品牌保留其真实品牌标识。动效支持主动关闭和系统减少动态效果偏好。

可复用能力优先融入原组件，例如 Button 变体与反馈、SurfaceCard 效果、日期范围、交互评分、滑动标签、聊天回复与语音状态、工具调用状态、图表交互和代码折叠。注册流程、通知中心、协作分派、审批、搜索恢复等保留为组合案例。未恢复 AnimatedNumber、SelectionActionBar、EmptyState 等平行公共入口。

- [99 项融合实现对照](./component-fusion-implementation.md)：逐项编号、归属、正式页面和实现文件。
- [组件融合 API 用法](./component-fusion-api-guide.md)：可复制示例、默认兼容、语言/动效参数及 UI 与业务责任边界。
- [原融合审查记录](./component-fusion-audit.md)与[审查数据](./component-fusion-audit.json)：保留迁移前的分析依据；其中旧批次进度及接口缺口是历史记录，当前实现以正式对照表和源码为准。

066 社交登录组合已补齐 Kakao、Google、Apple 品牌入口、上次使用提示、选中后收拢其他方式、连接中/已连接展示、邮箱入口和返回其他方式；隐藏项同时退出可访问与键盘交互范围，返回时恢复触发器焦点。它是本地交互演示，没有真实 OAuth 或邮件发送。业务接入须以真实认证结果驱动状态，不能把演示定时器视为登录成功依据。见[社交登录预览](../../artifacts/component-fusion/screenshot-social-integrated.png)与[窄屏记录](../../artifacts/component-fusion/c-official-mobile-header-verified.png)。

同样，上传、语音、支付、工具运行、审批等案例展示可操作状态与回调边界，不提供相应业务后端。文件本地读取完成不等于服务器上传成功。

## 评审与验收边界

评审标记和备注保存在当前浏览器，刷新后可恢复，也可导出 JSON。写入失败时保留页面中的最新修改并提示导出备份，不让旧的跨标签记录覆盖新内容。本地评审不改变 core 实现状态，不代表发布，也不解除暂缓项的限制。

未添加新用户验收记录时，默认仍为正式条目 99 项、已通过 7 项、待看 92 项、需调整 0 项，另有暂缓 23 项。用户后续自行标记后，界面数量以其本地记录为准。

已验收的七项保留原结论：040 为 AppLayout 侧栏；013、043、044 为开关、分页、折叠面板；031、039、046 为选择器、页签、命令搜索。其他 92 项完成正式实现，不表示已经逐项获得用户验收。

## 验证状态与保留问题

本轮最终检查、包体积预算、浏览器覆盖及未覆盖项统一记录在[正式迁移验证记录](../../artifacts/component-fusion/verification-formal-migration.json)。该记录由本轮汇总验证更新；不在本文复述尚未汇总的通过数量，也不把第二、三批历史包预算失败延续为当前结论。

**保留问题：**命令弹窗的搜索框聚焦时，Escape 在此前的真实 Chrome 检查中未能确认关闭，原因未定。模拟测试的连续 Escape、焦点恢复与 IME 保护通过，不能替代这一真实浏览器结果。此前关闭按钮、按钮聚焦时的 Escape、Tab 焦点循环和局部 Ctrl/Cmd+K 可用；除非本轮取得新的明确浏览器证据，该项仍不记为通过。详见 [Escape 诊断记录](../../artifacts/component-fusion/command-escape-diagnosis.json)。

正式融合不等于已发布。提交、合并与发布仍需依据本轮验证结论及当前授权分别完成，版本号没有因本地迁移自动变化。

## 历史证据

以下文件保留各批次的测试数量、浏览器步骤、截图与当时的包预算，不作为本轮当前状态：

- [第一批验证](../../artifacts/component-fusion/verification.json)、[第二批验证](../../artifacts/component-fusion/verification-batch-2.json)、[第三批验证](../../artifacts/component-fusion/verification-batch-3.json)。
- [集中评审验证](../../artifacts/component-fusion/verification-consolidated.json)、[审计修复验证](../../artifacts/component-fusion/verification-audit-fixes.json)、[评审导出验证](../../artifacts/component-fusion/review-export-verification.json)。
- [集中评审截图](../../artifacts/component-fusion/screenshot-consolidated.png)、[第二批截图](../../artifacts/component-fusion/batch-2.png)、[第三批截图](../../artifacts/component-fusion/batch-3.png)。
