# Changelog

## 0.8.1

- AgentParts 支持 AI SDK 6 起的工具确认：`approval-requested` 时显示允许、拒绝（`onToolApproval` 直接传 `useChat` 的 `addToolApprovalResponse`），自动确认和已答复的调用按进行中显示，被拒绝的调用（`output-denied`）在工具组里标为已停止并显示原因。之前这几种状态没有对应显示。
- Button 的 `effect="glass"` 改成液态玻璃：更通透的底、左上和右下的高光边、内部厚度感；Chromium 下按钮边缘会折射背后的内容，其他浏览器保留磨砂玻璃效果。
- AppLayout 新增 `profileMenuItems`：头像菜单的条目可以自己配置并绑定操作（编辑资料、外观、退出登录等），点击后菜单自动关闭。不传时仍显示原来的占位条目。

## 0.8.0

- 新增深色模式：在 `<html>`（或任意容器）上加 `data-theme="dark"` 即可。深色下重新定义灰阶、黑色和六个色族，现有的 `bg-fg-grey-*`、`text-fg-black`、`text-fg-grey-*` 不用改；彩色浅底变为深色浅底，彩色文字自动换浅一档；黑色填充（深色按钮、提示、黑卡）保持深色。局部 `data-theme="light"` 可在深色页面里恢复浅色。
- 组件里的卡片、面板、输入框和浮层背景从 `bg-white` 改为 `bg-background`，浅色下像素级不变；只在彩色底上的开关圆点、选中圆点等保留白色。
- 深色色板由脚本从浅色色阶生成，改浅色色阶时深色自动跟随。
- 已知限制：深色下黑色填充和彩色文字的 hover 变色不生效；灰色和白色本身暂不支持自定义。
- 修复弹窗里的 KebabMenu 菜单被原生弹窗压在下面、看不见也点不了：菜单挂进所在弹窗；按一次 Esc 只关菜单，再按才关弹窗；选完菜单项焦点交回弹窗；嵌套弹窗只有最上层响应 Esc，父层关闭时一并收起子层。
- Modal 内容过长时整体滚动或只滚正文，自动按标题和页脚高度选择。
- 侧栏的团队切换、通知、个人信息弹层在矮屏和窄屏下限制在窗口内并内部滚动，页面滚动时跟随入口重新定位。

## 0.7.0

- 新增智能体对话组件：Conversation（新内容自动跟随、上翻后出现“回到最新”）、AgentMessage（用户气泡与助手整宽回复）、MessageActions（复制、重新生成、有帮助/没帮助）、PromptSuggestions（推荐提问）、ArtifactCard（生成的文档、代码、表格、图片和文件）。
- 新增 AgentParts：直接渲染 AI SDK `useChat` 消息的 parts——文本按 Markdown 流式显示，思考过程可折叠，连续工具调用合成一组并显示状态，来源挂在回答下，文件显示为产物卡片；`renderTool` 可按工具名换成自己的组件（生成式界面）。不依赖 `ai` 包。
- 图标新增 LikeLinear、DislikeLinear、ArrowDownLinear、GalleryLinear。

## 0.6.0

- 新增 FileInput、InfoRow 及对应类型导出，统一模板附件选择与裸图标信息行。
- Button 新增 unstyled 变体，保留模板原有类名与原生按钮结构，不隐式添加图标或内容包装。
- Panel 新增 custom、as 与受限 asChild 组合，支持保留既有卡壳、语义元素和路由链接根节点。
- Modal 新增 template 变体与宽度、无标题可访问名称配置；保留原模板标题、分割线和内容间距，并由共享 dialog 管理焦点、Escape 和遮罩关闭。默认变体不变。

## 0.4.7

- 智能体控件和银行卡片内置标签默认中文并支持英文；审批改为显式继续，跳过清除当前答案，最后一步明确跳过并提交，成功反馈承接键盘焦点。
- 精简按钮和卡片案例的参数矩阵，完善预览、邮箱重试、附件发送、工作分派与存储统计的真实操作反馈。

- 修复验证码失败清空被父组件更新不断延后、裂开动画尚未结束就清空，以及清空时抢焦点；补齐减少动效时装饰伪元素的覆盖。
- ChatInputBar 增加 `hasAttachments`，支持业务确认附件就绪后仅发送附件，上传锁定和生成状态限制保持有效。

- 修复滑动页签在快速连续选择时被中途滚动状态覆盖，以及滚动文字按钮/链接的无障碍名称重复。
- TaskCard 支持 `locale` / `progressLabel`，百分比统一整数与有效范围；OtpInput 支持失败后自动清空及 `clearOnError` 关闭开关。
- 补齐发送、下载、组合操作和登录案例的状态链，通知批量关闭错峰执行；完善反应粒子、成员添加成功反馈与液态页签菜单退出动效。

- 修复融合审计发现的日期草稿同步、月末键盘导航、禁用标签移除、滑动删除指针校验与反应面板键盘边界。
- 修复柱图窄屏布局与参考线坐标，完善正式案例的章节定位、删除/撤销焦点、代码视图切换与搜索展开动效。
- AddMember 增加可选 `accent`；ReviewItem 仅在提供菜单操作时显示按钮，并支持 `menuLabel`；应用/个人菜单支持英文，倾斜卡片光斑支持主题色。

- 将 99 项交互融合为 54 项既有组件增强与 45 项正式组合案例，官网沿用原组件分类，默认中文并支持英文、蓝/紫/黑主题及减少动效。
- 增强 Button/IconButton 的可选效果和异步反馈、SurfaceCard、Toast、Tooltip、ListItem、Stepper；增加拖动开关、日期区间确认、浮动标签、真实上传进度、可编辑评分和滑动页签。
- 增强 ChatBubble/ChatInputBar 的反应、引用回复、语音与发送状态；工具步骤支持受控状态；图表支持动画数据、累计面积、置信带、目标线和独立目标环。
- AgentCodeBlock 支持嵌套折叠与复制失败重试；指标卡支持可选数字过渡；Toolbar 支持列表选择操作；AppLayout 融合已验收的侧栏连续伸缩。
- 提供正式交互总览、逐项迁移对照和 API 用法。23 项暂缓与 1 项排除保持原决策；不新增平行公共组件。

## 0.4.6

- 可选开启 Ask AI 响应式会话面板：1440px 及以上为非模态并排停靠，宽 460px；更窄时改为模态抽屉。顶栏以当前会话为主，欢迎标题和说明可配置。
- 回调身份变化时 `onDockedChange` 保持稳定，卸载时释放宿主预留。历史菜单随容器收缩。

## 0.4.3

- 智能体、技能和工具提及显示为可移除的输入芯片，并带上结构化的发送上下文。
- 提及选项和已选芯片在名称旁显示智能体头像；支持多条去重提及、移除，以及随上下文变化的占位文案。

## 0.4.2

- 增加 OtpInput、CalendarCard、LiquidTabs 和 AddMember，带蛋壳裂开、日期数字滚动和撕页、液态页签，以及成员头像飞入。
- 提供真实数据和回调、受控状态、继承的 Forge 主题、可改的中英文文案、键盘导航和减少动效。
- 四个组件演示接入 Motion，共用 auto/none；关闭动效时保留交互状态。

## 0.4.1

- ChatInputBar 增加可配置的快捷操作：插画、输入框后方的弹簧扇形卡片、相邻让位、折角，并支持减少动效。选中项变成可移除芯片，占位文案带动效切换，交给 `onSend`，不改动草稿。模型和权限在右侧，加号菜单在左侧。
- 仅空会话（`hasMessages`）自动展开快捷卡片，发送后收起，也可从加号菜单再打开。点击输入区内空白处聚焦输入框。
- 保留按光标插入和输入法组字保护，用事件时间戳区分确认候选的 Enter。

## 0.4.0

- 输入栏收拢为 ChatInputBar，移除 PromptBar，以及 PromptSource、PromptCommand、PromptModel、PromptBarStatus。调用方改用 ChatInputBar，以及 ComposerSource、ComposerCommand、ComposerModel、ComposerStatus。
- 增加模型选择、受控的权限选择、斜杠命令、听写、已连接来源文案，以及停止和停止中状态。各布局都把附件、@ 提及和命令放进加号菜单。

## 0.3.11

- ChatInputBar 增加紧凑密度、附件回调、可选的按 Enter 发送、仅禁用发送，以及异步发送期间由调用方持有草稿。提及按光标插入，支持键盘选择、输入法和可翻译的空状态文案。
- FileCard 补上附件重试和移除的无障碍名称。保留原有输入默认值，并修正提及弹层的 ARIA 语义。

## 0.3.10

- PageTitleToolbar 增加可选的 `askAi`，四个预设和旧版 actions API 都用 `AskAiProps`。Ask AI 可以单独出现，不必带上其他工具栏操作。

## 0.3.9

- 调整 AskAi 全屏记录的滚动：靠近底部时跟随新回复，否则保持阅读位置，并可跳回最新一条。为浮动输入栏留出空间，会话栏适配窄屏。
- AskAi 输入槽里的紧凑 PromptBar 支持工具与选择器的键盘导航，文本框自动增高，`toolsMenuLabel` 可翻译。初始打开的全屏浮层等到客户端就绪后再渲染。
- 紧凑的交互回复限制在可读宽度内，较宽的代码和表格回复保持原宽。补充全屏插槽的布局约定。

## 0.3.8

- 默认的团队菜单改为应用切换：当前应用、可选应用和选中态。团队管理操作默认隐藏。
- 增加 AppSwitcherDropdown、AppSwitcherItem，以及 AppLayout 的 appName、appIcon、appSubtitle、apps、onAppChange。选中后关闭布局菜单并调用业务回调；当前应用由调用方控制。
- 保留旧的 Team 属性和显式开启的 `showTeamActions`，包括成员数副标题。

## 0.3.7

- AgentTaskRows 的状态、代码操作、工作流类型、上下文标签、命令分组、建议置信度、PromptBar 控件和导航无障碍名称可以覆盖翻译。
- AgentDiffTable 增加数量格式化和可翻译的开关提示。原有默认值不变，文案随参数更新。

## 0.3.6

- PromptBar 增加 `sourcesLabel` 和 `commandsLabel`，用来翻译工具栏按钮、选择器标题和无障碍名称。应用语言变化时文案跟着更新，英文默认值仍然可用。

## 0.3.4

- `StreamingAnswer` 增加平滑的缓冲播放和 500ms 线性淡入，并明确 `streaming`、`complete`、`stopped` 三种状态。原有的全文重放接口保留。
- 可通过 Streamdown 渲染 Markdown，按 Unicode 字形簇切分，支持减少动效和服务端水合。
- 导出 `StreamingAnswerProps` 和 `StreamingAnswerStatus`。完成态会等到最后一次淡入结束；停止时保留已经显示的回答。
- 智能体案例增加可操作的中英文示例，并补上流式回归测试和 Next.js 15/16 的包消费检查。
- 让生成的 `TextField` 声明保持稳定，包接口检查不再依赖推断出的联合类型顺序；参数和行为不变。

## 0.3.3

- AppLayout 增加 `menuSections`，并导出 `AppLayoutMenuSection`，侧栏可按顺序放任意多个分组。选中项、嵌套菜单、收起和窄屏行为在各分组中一致。
- 不传 `menuSections` 时仍是原来的两组布局。空标签不再渲染空的标题容器，空的新分组直接跳过。

## 0.3.2

- 全部 187 个 Forge 图标恢复 Solar 原图，包括侧栏的日历和邮件按钮，使用 `@solar-icons/react` 2.3.2。
- 用 `@solar-icons/react` ^2.3.2 替换原来的 Phosphor peer。引入路径和图标名不变；图标参数改跟 Solar，不再跟 Phosphor。
- 注明 Solar 图形来自 480 Design（CC BY 4.0），React 实现为 MIT。

## 0.3.1

- PromptBar 的模型菜单定位在模型按钮上方，右对齐，处理视口碰撞，宽高有上限。隐藏滚动条，滚动和键盘操作仍可用。
- 选中的模型末尾显示勾选，支持键盘导航、点击外部关闭、Escape 和焦点还原。可用 `modelMenuLabel` 指定无障碍名称。
- 用原生 Popover 顶层渲染，避开祖先裁剪，同时保留宿主主题和焦点范围。要完整避开裁剪，需要 Popover API。
- 嵌套菜单先于 AskAi 全屏宿主处理 Escape。Sources 和 Commands 仍是输入建议面板。
- 增加回归测试和一个案例，覆盖普通页面、AskAi 抽屉与全屏、窄视口和较长的模型列表。

## 0.3.0

- 增加 Modal 和 Drawer：原生模态语义、键盘焦点循环、Escape 与点击背景关闭，以及进入和退出动效。
- 增加可受控或非受控的单段 Accordion，支持键盘导航。
- TabsContent 增加进入过渡；ToastProvider 和 useToast 支持关闭、暂停计时和堆叠动效。
- ConfirmationDialog 保留行内卡片接口；传入 `open` / `onOpenChange` 后可作为模态。
- 按钮、菜单、选择控件、侧栏、页签、提示、开关和复选框使用同一套交互动效。组件支持 `motion="none"`，也跟随系统的减少动效设置。
- 增加 TooltipGroup，相邻触发器共享悬停延迟。
- Agent 和 Ask AI 完成 MIT Phosphor 图标迁移，图标名不变。
- 仓库案例补充 Motion 说明和交互示例。

TabsContent 在 activeKey 变化时会重新挂载子节点，要保留的表单状态放在父级。Toast 计时器在悬停或聚焦时暂停；`duration=0` 必须显式关闭。
