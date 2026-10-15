# 智能体与消息输入 API 核查结论

本轮对照本地 main、当前未提交源码和 99 项有效迁移清单。可复现命令：`node scripts/audit-public-api-comparison.mjs`。完整参数明细见 `public-api-comparison.md`，逐项迁移关系见 `migration-api-crosswalk.md`。

## 已确认的问题与修复

- ChatInputBar 的文档把 62 个实际参数压成了 7 行；智能体页仅写了其中 4 项。onSend 被错误简化成单参数回调，遗漏快捷操作、提及和回复上下文。本轮恢复完整签名、62 项中文说明，以及相关数据结构。
- 智能体页的参数表普遍不完整；ToolChips、ContextCards、RecommendationCard 没有参数表。本轮补上全部 13 个组件的完整类型、必填性、解构默认值和关联对象字段；原有重点说明继续保留。
- 以前的人工表容易忽略受控状态及回调。本轮直接从根入口解析类型，补充参数覆盖测试，避免只核对组件名称。

## main 与当前的接口关系

- 本脚本识别到 180 个有参数且返回 React 内容的公开组件；不把类型、常量、工具函数计作组件。
- 没有发现 main 根入口导出被删除，也没有发现已识别组件的参数名称被删除。这是接口层结论，不是行为兼容性证明。
- ChatInputBar 从 51 项增至 62 项：新增 locale、motion、replyTo、onCancelReply、attachments、hasAttachments、voiceState、voiceLevel、onVoiceStart、onVoiceEnd、onVoiceCancel。发送上下文另外新增 replyTo 字段。
- 7 处顶层参数类型文字变化分别涉及：ProgressBar、EventTag、CellProgressBar 增加 black；StatCard、LineChartStatCard、StatCardShell 的 value 从 string 扩展为 ReactNode；Stepper 的 total 改为可选。未发现这些变化收窄旧调用的输入类型。
- AskAi 的 25 项参数保留，包括替换消息与输入区的槽位、全屏受控状态、会话列表和搜索。PageTitleToolbar 按联合类型的各变体合并核查，不能只列公共参数。各变体仍需遵守自身的必填条件。

## 迁移清单的边界

99 项目录的目标名称均可在根入口找到。目录目标是组件及组合关系，不能据此认为每个案例都变成独立导出组件。F03 与 178 的重复展示合并也不应理解为删除底层能力。目录中的 accepted 字段保留原值，未擅自改成通过。

## 接入时必须区分的职责

- attachments 是渲染槽位，hasAttachments 决定能否只发附件；文件上传、失败重试和附件实体仍由调用方管理，不随 onSend 自动上传。
- voiceState 与相关回调展示录音流程，不自行申请麦克风权限或执行转写。
- onStop 是取消请求，调用方负责取消任务并确认 stopping / idle 状态。
- permissions 只提供选择界面，不执行权限校验。
- sources 中带 kind 的对象显示为可移除标签；智能体用 avatarSrc 与 label 显示头像和名称。未指定 kind 的来源继续保留文本插入方式。

本轮完成静态接口对照和相关文档补全；不将此结论扩展成 99 项案例的全流程浏览器验收，也未核验智能体工场消费项目是否额外封装了私有参数。
