# 组件参考文案审计

审计日期：2026-10-15。范围：`src/app/components/**/page.tsx` 全部 30 页，其中 27 页为组件正文，3 页为入口或兼容跳转。仅检查公开标题、说明、参数解释和展示代码中的文案；不评估导出覆盖率、变体完整性或运行时交互。采用源码逐页阅读和默认值交叉核实，未据此声称完成浏览器视觉验收。本轮未修改页面。

审阅时已对照 `_shared.tsx` 与 `_labels.ts`：Section/SubSection 中映射后的中文标题视为已处理，不把源码中的组件英文名一概当作未翻译。组件名、属性名、类型、枚举、导入路径属于代码标识，应保留；面向读者的解释和样例数据应使用自然中文。

参考 [HeroUI Button 文档](https://heroui.com/en/docs/react/components/button)：先解释用途，再提供用法和按场景组织的示例，参数表单列。保留尺寸、变体等开发参考是合理的，不能仅因出现技术词就删掉；问题在于错误说明、内部设计来源和未解释的术语进入公开正文。

## 优先修正的事实错误

|位置|现有问题|建议与核实依据|
|---|---|---|
|`src/app/components/toolbar/page.tsx:159`|搜索框被写成“纯展示态，无 onChange”，默认值写成英文|改为“未输入时的提示文字；通过 value 和 onChange 管理查询内容。”默认值改为“搜索...”。`core/src/components/ui/toolbar.tsx:74` 起实际支持受控输入。|
|`src/app/components/toolbar/page.tsx:163`|选择器默认提示仍为英文|改成“请选择...”，与 `core/src/components/ui/toolbar.tsx:148` 保持一致。|
|`src/app/components/calendar/page.tsx:75`|默认标题写成 Calendar / Text Here|改成“日历 / 本月日程”；实际默认值见 `core/src/components/ui/small-calendar.tsx:31`。|
|`src/app/components/chat/page.tsx:40`|默认提示仍为 Type a message|改成“输入消息...”；实际默认值见 `core/src/components/ui/chat-input-bar.tsx:59`。|
|`src/app/components/filter/page.tsx:46`、`:54`、`:64`|默认标题仍为 Filter Group / Filters|分别改成“筛选分组”“筛选”“筛选”；分别与 filter-group.tsx:51、filter-trigger.tsx:10、filter-panel.tsx:8 对齐。|
|`src/app/components/other-widget/page.tsx:34`|汇率卡默认标题仍为 Title Here / Text here|改成“汇率换算 / 实时估算仅供参考”；实际值见 currency-converter.tsx:93。|
|`src/app/components/list/page.tsx:134`|通知操作默认文案仍为 Mark as Read|改成“标为已读”；实际值见通知组件的 actionLabel 默认值。|
|`src/app/components/badge/page.tsx:221`、`:255`|同一图标容器先说图标尺寸自动协调，后说需手动协调|统一为“size 控制容器尺寸；通过 children 传入图标并设置合适的图标尺寸。”`core/src/components/ui/badge.tsx:146` 直接渲染 children，不自动修改图标尺寸。|
|`src/app/components/badge/page.tsx:300`|说明使用不存在的 body 参数|改成“通过 children 传入图标”。|
|`src/app/components/button-link/page.tsx:62`|variant 类型含 hold，说明却只说三种样式|补充“长按确认样式用于需要防误触的操作”。|
|`src/app/components/calendar/page.tsx:60`|今日、选中、非本月被统称互斥态|改成“分别标记今天、选中日期和其他月份；今天的日期圆点样式优先。”非本月斜纹仍可与日期标记叠加，见 calendar-day-cell.tsx:45、:59。|
|`src/app/components/table/page.tsx:517`|头像 API 指向 /cases/avatar，仓库中无对应页面|改为实际存在的头像参数说明地址；先定位正确章节，再提供链接，不能继续保留失效路径。|

## 逐页结论与替换建议

“需改”表示存在具体可修正文案，不表示整页不可用；“通过，轻微润色”表示未发现阻碍理解的正文错误，后续可统一措辞。所有路径均相对于仓库根目录。

|页面|结论|证据与建议|
|---|---|---|
|`src/app/components/agent/page.tsx`|需改|`:41`“痕迹类型”→“处理过程的展示类型”；`:62`“HITL 问题栈”→“需要用户逐项确认的问题列表”；`:73`“@ 来源”→“可提及的数据、智能体或其他来源”；`:81` keep/remove/add 行→“未变化、删除和新增的数据行”；`:106` trigger/action/condition 的解释改成“触发、操作和条件节点”。类型值保留英文。`:139`“一律”改为中性的导入说明。|
|`src/app/components/badge/page.tsx`|需改|先修图标尺寸和 children 说明矛盾（见上表）。`:163`“三维控制”改成“用颜色区分语义，用实底或描边突出状态；尺寸适配所在区域”。|
|`src/app/components/button-link/page.tsx`|需改|先补 hold 说明。`:19` 可复制代码中的 Button 文案改成“保存修改”；`:144`“表格 actions”→“表格操作区”；`:156`“actions 列”→“操作列”；`:196`“内部走 next/link”→“点击后前往的页面或资源地址”；`:309`“宿主控制”→“应用控制完成状态”。实现依赖可放进高级说明。|
|`src/app/components/calendar/page.tsx`|需改|修默认文案和状态关系。`:62`“+N More”→“超出上限时显示剩余事件数量”；`:83`“today/header”→“今天和标题区域”；`:206`“其余见 cases”→“完整交互示例见日历案例”，并保留可点击链接。|
|`src/app/components/card/page.tsx`|需改|`:84`、`:124`、`:136`、`:148`、`:168`“原始 Figma 尺寸”统一改为“full 适应容器，fixed 使用固定展示宽度”；`:171`、`:233`、`:247`、`:267`、`:299` kebab 回调→“点击右上角更多操作按钮时触发”；`:473`“自动叠圈”→“重叠显示参与成员头像”；`:500` Transfer/Request→“转账/收款”；`:593` initials→“姓名缩写”。|
|`src/app/components/chart/page.tsx`|需改|`:101` 删除原始 Figma 宽度来源，说明适应容器和固定宽度的使用差异。`:292`“legend 行”“不实例化”→“显示图标和系列名称。icon 传入图标组件，例如 StarLinear，而不是 JSX 元素。”保留必要代码示例。|
|`src/app/components/chat/page.tsx`|需改|修默认提示。`:76`“21 条波形柱”→“显示播放入口、语音波形和时长”；固定实现数量不是用户使用判断的依据。`:96` sent/received 枚举解释补中文“发出/收到的消息”。|
|`src/app/components/checklist/page.tsx`|需改|`:16`“无 orange 别名”删去，改成“勾选标记的主题色”；`:59`“几何”“CSS”“不加 Motion”属实现备忘，改为“勾选后显示完成状态；再次点击可恢复为待办”。`:40` 导入语气不使用“一律”。|
|`src/app/components/comment/page.tsx`|需改|`:26` Thanks!→“谢谢反馈！”；`:36` Excellent product quality!→“质量不错，使用体验很稳定。”；`:45` Best purchase this year.→“这次购买很满意。”；`:57` Reply→“回复”；`:64` Verified Buyer→“已购用户”。代码中的 CommentReply 类型保留。|
|`src/app/components/file-type/page.tsx`|需改|`:63`“自己取 ext 查表、回落 txt”→“根据扩展名选择图标；不支持的类型使用默认文本文件图标”；`:124`“success 绿勾”→“上传成功时显示完成标记，失败时提供重试”。枚举值在 API 类型中保留。|
|`src/app/components/filter/page.tsx`|需改|修默认值。`:48`“内容判别联合”→“筛选内容类型：空内容、多选、单选或数值区间”；`:50`、`:93` accent 条→“强调标记”；`:65` Apply 按钮→“应用筛选按钮”。面板和触发器的状态管理说明可保留，先写中文含义再提属性名。|
|`src/app/components/grid/page.tsx`|通过，轻微润色|用途清楚。`:33`“完整栅格矩阵”→“响应式布局示例”。`:36`—`:39` 可按断点、跨度、嵌套拆成短段，保留具体技术约束。|
|`src/app/components/history/page.tsx`|通过，轻微润色|时间线用途和数据结构可理解。`:44` dot/badge→“圆点/徽章”；`:61`“progress 柱”→“分组进度指示条”。组件名和字段名继续保留。|
|`src/app/components/input-field/page.tsx`|需改|`:67`、`:77` Filled text→中文输入样例；`:68`、`:78`、`:291`、`:319` Error message→“请输入有效内容”（邮箱示例用“请输入有效邮箱地址”）；`:284` 不宜只鼓励传 placeholder，改为“用 label 说明字段用途，placeholder 补充格式提示”；`:449`“父层管 value”→“由应用保存当前选项，同组只能选中一项”；`:476` leading→“左侧内容”；`:554` popover→“图标搜索面板”。|
|`src/app/components/list/page.tsx`|需改|修通知默认操作文案。`:85` line-clamp-1→“单行显示，超出部分省略”；`:87` tail 文案→“右侧主要信息，例如金额”；`:108` WithTab 模式→“提供后在分组顶部显示页签”；`:111`—`:112` close 的人话说明使用“关闭”。|
|`src/app/components/map/page.tsx`|通过，轻微润色|位置、搜索和展示用途明确。`:90` kebab→“更多操作按钮”。参数中的地图 API 名称无需翻译。|
|`src/app/components/menu/page.tsx`|需改|`:61`“色底 sidebar”→“带主题背景的侧栏”；`:65`“快捷 prop”→“设置为 true 时使用选中样式”；`:67`“图标纯模式”→“仅显示图标；请提供可访问名称”。状态枚举可保留，解释用空闲、悬停、展开等中文。|
|`src/app/components/modal/page.tsx`|通过，轻微润色|弹窗用途、关闭和确认回调说明清楚。`:42` icon 可统一为“图标”。`:128` 不建议仅以颜色绑定“推广”业务；可改为“主题操作”，避免暗示紫色只能用于推广。|
|`src/app/components/other-widget/page.tsx`|需改|修默认标题。`:35` Convert→“换算”；`:37`“controlled 模式、不传用 placeholder”→“传值时由应用管理金额，未传值时显示输入提示”；`:39` 三种交互回调建议分行解释“点击换算/修改来源金额/修改目标金额”；`:52`“+N 占位”→“剩余图片数量”。|
|`src/app/components/page-header/page.tsx`|需改|`:93`“对应 Figma Search & Widget”整句改为“用于应用级导航，组合搜索、日历、通知和个人入口”；`:115`“对应 Figma Page Title”改成“用于单页标题，可按需加入返回、日期、筛选和主次操作”；`:145` Ask AI 长段拆成用途、使用、上下文三段，“对话不带当前页面”改成“默认不会自动把当前页面内容发送给智能体，如需上下文请由应用提供”；`:146`“不是把 dialog 拉成 100vw”→“全屏模式使用独立视图，关闭后返回抽屉”；`:165`“只吃 props”等改成“会话数据、持久化和搜索由应用管理，组件通过参数接收状态”。|
|`src/app/components/pagination-stepper/page.tsx`|通过，轻微润色|`:29` 1-based→“页码从 1 开始”；`:38`—`:39` capsule 的解释改成“步骤标记”；`:77`“其余见 cases”→“完整交互示例见组件案例”。用途与参数组织整体清楚。|
|`src/app/components/progress/page.tsx`|需改|`:39` clamp→“超出范围时限制到 0–100”；`:57` Progress / $400 等可复制样例改成“完成进度 / ¥400”；`:63` medium/semibold 的正文解释改成“描述文字使用灰色，数值使用黑色并加粗”，样式标识可在代码中保留；`:168` dashboard→“仪表盘”。|
|`src/app/components/style-guide/page.tsx`|通过，轻微润色|主题色、文字和使用规范清楚。`:54`“pill 大写去号”→“色值标签显示不含 # 的大写十六进制值”；`:60`、`:63` swatch→“色卡”。色值与变量名保留。|
|`src/app/components/tab/page.tsx`|通过，轻微润色|页签用途、选中和关闭说明可理解。`:163` 人话中的 tab 统一成“页签”。枚举类型中的颜色和形状保留英文；不要求重复翻译每个枚举。|
|`src/app/components/table/page.tsx`|需改|`:474`—`:675` 十四个编号小节没有 _labels 映射，仍显示 Reg Text / Square Img / User Group 等英文。依次改为“文本与辅助说明、方形缩略图、圆形缩略图、成员信息、成员头像组、图标分类、文件信息、数值与趋势、状态标签、状态圆点、完成进度、记录编号、行内操作、星级评分”；`:620` 删除“对应 Figma Status 分类”；`:355` kebab menu→“更多操作菜单”；`:417` Show N→“每页显示数量”；`:631` Savings→“储蓄目标或完成率”；`:656` 图标缩写列表改成“联系、查看、编辑、删除等操作，也可收进更多菜单”。修复头像引用地址；`:554` CircleIcon 参数也应链接组件参考章节而非案例页。|
|`src/app/components/toolbar/page.tsx`|需改|修搜索行为和默认提示。`:138`“业务页必须选择一个预设”→“选择页面标题布局：概览、列表、详情或编辑操作”；`:167`、`:174`、`:181`、`:188`“外接 click handler”→“自定义点击处理，提供后使用该回调”；`:175`“今日高亮 bg class”→“今天日期的背景样式类”；`:294`“底层 props”→“参数与工具栏容器一致，子控件参数见工具栏控件”；`:352` Cancel/Save→“取消和保存”。源文件中 Figma 的纯代码注释不算可见正文。|
|`src/app/components/tooltip/page.tsx`|需改|`:55`、`:150` w-44 等实现细节改为“sm 用于单行说明；lg 支持多行换行”；`:194`“便于截图、真实用法走 hover”→“本例保持气泡展开，便于观察。默认在悬停或聚焦时显示；需要控制显隐时设置 open”。|
|`src/app/components/page.tsx`|不适用|跳转到 `/components/badge`，无本页正文。|
|`src/app/components/motion/page.tsx`|不适用|渲染兼容路由跳转组件，无本页组件正文。共享跳转文案不在本报告的页面正文范围。|
|`src/app/components/interactions/page.tsx`|不适用|跳转到 `/cases`，无本页正文。|

## 收口原则

1. 先修默认值和行为事实，再统一措辞。中文不是唯一目标，文案必须与当前实现一致。
2. 标题写“是什么”，首句写“什么时候用”；尺寸、颜色、属性和实现细节留在示例或参数说明。
3. Figma 来源、迁移过程、截图需要、内部代号不进入公开用途说明。CSS 类和受控状态等必要开发信息可保留在专门章节。
4. 把“一律、只吃、宿主、叠圈、外接”等工作笔记语气换成正式而简短的说明。避免把普通英文词散落在中文句子里；代码标识保持准确。
5. 样例正文、按钮文案、占位和错误提示默认中文；解释性代码也应使用同一套样例。币种、文件扩展名和程序标识无需强行翻译。
6. 不以此次文案审计替代 API 完整性审计或真实交互验收；尤其不据此断言全部变体已覆盖。

## 附录：core 内置文案与语言切换补充审计

本节对 `core/src/components/ui`（含 forms/charts）和 `layouts` 做字符串静态扫描，并核对以下典型家族实现。覆盖的是默认文字、空态及可访问名称；不是每个导出组件逐个切换语言的浏览器验收。没有把键盘 Escape/Home、CSS、SVG 属性、品牌 Forge、货币代码或调用方传入的业务内容判为英文遗漏。也不把“没有 locale”直接等同“不能翻译”：有独立 label 参数的组件可由应用自行翻译，需与完全硬编码区别处理。

### 不能仅靠切换 locale 完成的确定遗漏

|家族及位置|现状与用户影响|建议|
|---|---|---|
|`core/src/components/ui/data-table.tsx:715`—`:718`、`:790`、`:821`、`:842`|分页范围固定“显示…共…条”；全选、排序、单行选择名称均硬编码中文。emptyState 可覆盖（`:754`、`:960`、`:1079`），但不能因此认为整张表支持语言切换。|统一 locale/labels，并覆盖动态计数和读屏说明，而不仅是空态。|
|`core/src/components/layouts/sidebar-popovers.tsx:72`—`:100`、`:134`—`:146`、`:171`|MessageMenu、NotificationPanel 没有 locale；消息菜单、通知标题、关闭、标为已读、全部已读、查看更多和语言菜单读屏名称固定中文。AppLayout 虽支持 locale，`:686`、`:691`、`:758`、`:763` 仍调用这些固定文案面板。|将 AppLayout 当前语言传入面板；静态演示通知内容与真实业务数据分开。语言选项保留各语言自称合理，但“语言”菜单名称也需翻译。|
|`core/src/components/ui/forms/icon-selector.tsx:60`、`:109`、`:234`、`:264`|ColorPicker 的“颜色 N”无覆盖入口；IconPicker 可用 labels 替换图标名称，但不传时回到中文；IconSelector 可覆盖搜索提示和 label，内部 ColorPicker 名称仍中文。|为颜色名称提供 labels/locale；尽量使用“蓝色”等具体名称而非只报序号。|
|`core/src/components/ui/sidebar-menu.tsx:159`、`:253`|独立侧栏的展开/收起读屏名称固定中文，不等于 AppLayout 已处理的对应按钮。|复用一致的语言字典，分别验证两个侧栏入口。|
|`core/src/components/ui/menu-item.tsx:148`|徽标读屏描述固定“ N 条未读”。菜单文字可由应用传入，但读屏仍混用语言。|提供 unreadLabel 格式化函数或统一 locale。|
|`core/src/components/ui/kebab-menu.tsx:205`|更多操作触发器固定“更多操作”。|暴露 ariaLabel 或 locale。|
|`core/src/components/ui/list-group.tsx:66`|关闭分组按钮名称固定“关闭”。|提供 closeLabel 或 locale。|
|`core/src/components/ui/map-card.tsx:204`|地图卡搜索框固定“搜索...”，无 locale；即使标题由应用翻译，输入提示也不变。|提供 searchPlaceholder，并纳入统一 locale 默认值。|
|`core/src/components/ui/project-card.tsx:76`|更多操作按钮读屏名称固定中文。TaskCard 已按 locale 处理，两个卡片不一致。|与 task-card.tsx:79 的处理保持一致。|
|`core/src/components/ui/charts/bar-horizontal-chart.tsx:79`|目标线默认名称“目标 N”固定中文；可通过 targetLabel 翻译，未传时不随其他语言变化。|明确其为可覆盖文案；若采用统一 locale，应使默认值跟随。|

### 默认中文、可手动覆盖，但没有自动 locale 的家族

以下不是“默认英文”问题，也不必给每个无文字容器强加 locale；需要确定项目是否承诺语言切换自动覆盖它们。

|位置|已有覆盖能力与边界|
|---|---|
|`core/src/components/ui/confirmation-dialog.tsx:44`—`:45`|确认/取消默认中文，可通过 confirmLabel/cancelLabel 手动翻译。|
|`core/src/components/ui/filter-panel.tsx:8`、`:14`—`:16`；`filter-group.tsx:51`、`:122`—`:129`；`filter-trigger.tsx:10`|标题、应用、取消、重置及区间输入提示默认中文，大多已有对应参数；应用需自行传翻译值，不会由全局语言自动传播。|
|`core/src/components/ui/currency-converter.tsx:29`、`:93`—`:103`|标题、副标题、金额提示、换算按钮可覆盖，默认中文；货币代码 USD/EUR 不属于应翻译的文案。|
|`core/src/components/ui/comment-item.tsx:26`、`:90`；`review-item.tsx:86`、`:149`；`notification-item.tsx:20`|回复、评分、更多操作、标为已读均默认中文，已有独立 label 参数，但无 locale。|
|`core/src/components/ui/liquid-tabs.tsx:30`|消息分类、更多分类、暂无内容默认中文，可分别覆盖 label/moreLabel/emptyLabel；没有 locale，应用需传翻译。|
|`core/src/components/ui/checkbox.tsx:66`；`forms/selection-control.tsx:58`、`:205`|复选框、开关、单选项默认中文，可覆盖可访问名称。真实表单应优先传字段语义，如“接收通知”，而不是只有控件类型。|
|`core/src/components/ui/breadcrumbs.tsx:26`；`button-group.tsx:36`；`tab-bar.tsx:49`；`tabs-content.tsx:30`、`:48`|导航/选项组/页签/内容名称默认中文，可通过 ariaLabel 覆盖；调用方关联 labelledBy 时也应保留正确优先级。|
|`core/src/components/ui/forms/select-option.tsx:129`；`forms/media-upload.tsx:63`、`:193`|选择提示、添加图片和上传文案默认中文，可手动覆盖。与 FileUpload 已提供 locale 的方式不一致，尚非统一体验。|
|`core/src/components/ui/charts/bar-chart.tsx:41`；`smooth-line-chart.tsx:69`；`donut-chart.tsx:46`；`multilayer-donut-chart.tsx:55`|图表读屏名称默认中文，有 ariaLabel；系列名由业务数据提供，不能由组件盲目翻译。|

### 已观察到的正确动态处理

- `OtpInput`：`core/src/components/ui/otp-input.tsx:44`—`:45` 按 locale 生成验证码、验证中、成功与错误提示，也允许单项覆盖。
- `CalendarCard`：`core/src/components/ui/calendar-card.tsx:43`、`:81`—`:83` 使用 locale 和 Intl 处理日期/月/星期，并通过文字字典提供操作名称。应与旧日历家族区别评价。
- `DatePicker`：`core/src/components/ui/forms/datepicker.tsx:55`—`:56`、`:115`—`:116`、`:295`、`:323`、`:435` 按语言处理提示、月份、导航和日期区间说明；不是看到中文常量就能判遗漏。
- `AppLayout`：`core/src/components/layouts/app-layout.tsx:440`、`:455`、`:485`、`:585`—`:643` 的主导航及底栏触发器按语言切换；问题集中在部分弹出内容未接入。
- `ProfileMenu`、`AppSwitcher`：`core/src/components/layouts/sidebar-popovers.tsx:201`—`:208`、`:259`—`:266` 已对菜单文字及成员数量按 locale 生成。
- `Pagination`、`Stepper`、`Toast`、`FileUpload`：分别可见 pagination.tsx:86、stepper.tsx:40、toast.tsx:53、forms/file-upload.tsx:135—:185 的语言分支；本次只核对典型内置文字，未声称每个分支已运行验证。

父审计已另行确认的 ChatInputBar、AskAi 与 FullCalendar/SmallCalendar/SmallDailyCalendar 不在本附录重复定级：ChatInputBar 的 Model 默认英文与部分中文固定标签确实存在；Ask AI 可作为功能品牌单独判断，但周边辅助文字仍需语言能力。旧日历无 locale，与 CalendarCard、DatePicker 的能力不应混为一谈。

建议最终验收至少用同一页面动态从中文切换英文，检查可见文案、空态、计数、错误提示和读屏名称；“可传 label”与“切换 locale 后自动更新”应在文档中分别说明。
