# 组件融合审查（迁移前记录）

> 当前进展：全部 99 项已落入迁移分支的正式 React 实现。下面保留的是迁移前接口缺口审查；以 [实施对照表](./component-fusion-implementation.md) 和 [API 用法](./component-fusion-api-guide.md) 为当前实现依据。

本次覆盖 **123 项**（117 个 HTML 原型、6 个 React 案例）：**54 项增强现有组件、45 项组合示例、23 项暂缓、1 项排除**。默认不新增公共组件。

这些是源码审查后的融合方向，不代表接口已经支持或迁移已经完成。完整理由、接口缺口和逐项源码路径见 [审查 JSON](./component-fusion-audit.json)。040 侧栏动效已通过用户验收。上一轮收到「可以，看到的这三个没问题，然后呢」的反馈，认可数量为 3，但未点名编号，不扩算为上一轮四项全部验收；013、043、044 后续已获用户「OK，过」明确验收；031、039、046 也于 2026-10-14 经用户「OK，过，其他的也都放到这里吧，我一次性看完」验收。已验收编号为 040、013、043、044、031、039、046；其他条目按各自状态推进，均未发布。

- **040 AppLayout 侧栏动效**：唯一目标为 `AppLayout`，本地已融入；[集成预览](/prototype/sidebar-motion) 已于 2026-10-14 通过用户验收，保留原有 Solar 菜单图标。`SidebarMenu` 无需同步扩展。
- **031 / 039 / 046**：第三批本地融合到 SelectOption、TabBar / TabsContent、CommandSearch / Modal；现并入 `/prototype/component-fusion` 对应家族集中展示。官网仍归 input-field、tab、agent 原页面，不增加分类或公共组件。第三批已通过用户验收，验证结果及技术限制见第三批记录，未提交、未发布。
- **013 / 043 / 044**：已分别融合到 Toggle、Pagination、Accordion，于 2026-10-14 经用户「OK，过」验收。集中预览按原有家族归位；官网 input-field、pagination-stepper、motion 原页面继续保留。
- **018 数量步进**：`IconButton` + 本地计数展示，数字动效可共享内部实现。
- **098 / F03 / 178**：已在本地收敛到指标卡和 `Toolbar.selection`；集中预览 `/prototype/component-fusion`，待用户体验。独立数字、批量栏和空态公共入口已移除。
- **本轮集中审阅**：`/prototype/component-fusion` 已展示 99 项常规交互，另有 23 项暂缓可切换查看；186 不纳入。12 个编号展示既有融合版本（11 种示例），090 / 092 / F06 默认展示原型并可切换局部示例。全部 122 项使用本仓独立快照（116 个 HTML 原型、6 个 React 案例），无需运行 4317 实验室服务。集中展示不表示 99 项已融合或通过验收。
- **目录**：保留原有 20 族定义，当前显示 19 个既有家族及组合案例；“文件展示”无非暂缓条目，继续隐藏。集中页提供搜索、分类与评审状态筛选，全局语言、主题和动效设置。通过/需调整/待看及备注仅保存在浏览器，可导出 JSON；不改 core 迁移状态，不新增官网正式分类。

| ID | 原型 / 示例 | 处理 | 既有融合目标 | 状态或关键缺口 |
| --- | --- | --- | --- | --- |
| 001 | 液态玻璃按钮 | 扩展现有组件 | Button | Button 支持原生事件、disabled、aria-busy、children 和 motion；尚无统一 loading/success 或玻璃形变 API，真实完成由宿主驱动。 |
| 002 | 磁吸箭头按钮 | 扩展现有组件 | Button、StyledLink | Button 可接 pointer 事件；StyledLink 仅固定参数且未透传原生事件，磁吸不能直接宣称两者均支持，需补最小交互透传或内部效果。 |
| 003 | 长按删除 | 扩展现有组件 | Button | 文件条目退场是示例；真实删除和撤销结果由宿主决定，不将原型定时完成视为业务成功。 |
| 004 | 下载进度按钮 | 扩展现有组件 | Button、ProgressBar | Button 当前无 progress/status 契约；需要受控进度、取消和完成状态，不能迁入原型按时间伪造下载。 |
| 005 | 纸飞机发送 | 扩展现有组件 | IconButton、Button | 现有 children/图标插槽可换状态，但暂无发送动画状态协议；由真实发送结果切换。 |
| 006 | 墨水涟漪按钮 | 扩展现有组件 | Button + 本地计数展示 | 原生 aria-pressed 可传；涟漪插层/坐标反馈尚未内置，订阅关系和人数不进入 Button API。 |
| 007 | 播放暂停变形 | 扩展现有组件 | IconButton | IconButton 可传 aria-pressed、aria-label 和点击；SVG morph 未内置，音轨、波形拖拽和媒体时钟不在本次融合范围。 |
| 008 | 复制完成反馈 | 组合示例 | IconButton、Button、ButtonGroup | 剪贴板写入 Promise 成功后才显示完成；原型 catch 吞错不能迁移。 |
| 009 | 文字滚动按钮 | 扩展现有组件 | Button、StyledLink | 现有 children 可装文字层；逐字动画和 reduced motion 需融合，不能生成第二套 CTA API。 |
| 010 | 组合操作按钮 | 组合示例 | Button、IconTrigger、DropdownPanel、MenuItem | IconTrigger/DropdownPanel 尚不提供完整 menuitemradio、方向键游标和选中项聚焦；示例壳须补受控选择、焦点恢复与业务提交，不假称容器自带菜单协议。 |
| 011 | 扇形快捷操作 | 组合示例 | IconButton、IconTrigger | 径向布局、展开状态和方向键遍历由局部示例控制；隐藏项不可聚焦、视口边界与小屏可达性需验证，菜单容器并未内置这些。 |
| 012 | 书签丝带 | 扩展现有组件 | IconButton + 本地计数展示 | IconButton 已透传 aria-pressed；丝带与爆发动画未内置，收藏数据与计数仍由宿主提供。 |
| 013 | 弹性开关 | 扩展现有组件 | Toggle | 本地已融合弹性手柄和可选 draggable（默认 false）；拖动越过中点后提交，取消、丢失捕获、Escape 和禁用均回退；已通过用户验收。 |
| 014 | 待办清单 | 扩展现有组件 | Checklist | 日期、紧急标签与完成汇总是可选展示；追加动效需保留焦点与受控任务状态。 |
| 015 | 套餐选择卡 | 组合示例 | RadioWithLabel、RadioButton、SurfaceCard | Radio 控件只有 checked/onChange，不自带组级 roving tabindex；分组方向键、卡片外框移动与价格计算由示例负责。 |
| 016 | 星级评价 | 扩展现有组件 | RatingStars | RatingStars 当前只读，只有 value/total/showValue；需可选 onChange、disabled/readOnly、预览值和键盘评分语义后才能承载原型。 |
| 018 | 滚动数量步进 | 组合示例 | IconButton + 本地计数展示 | 上下限、步长、方向键及总价由宿主状态控制；数字列转场保留在本地展示或共享内部渲染器。 |
| 019 | 兴趣多选 | 组合示例 | CheckboxControl、CheckboxWithLabel | 组级最多五项、提示和 chip 布局由示例维护；不可把未选项全禁用导致无法理解限制，不新增 MultiSelect。 |
| 021 | 日夜切换 | 扩展现有组件 | Toggle | Toggle 当前没有图标插槽/日夜视觉变体；全局主题持久化与 DOM 主题切换由宿主负责。 |
| 022 | 点赞心形绽放 | 扩展现有组件 | IconButton + 本地计数展示 | Button 原生属性可表达 pressed；粒子动画未内置且必须可减弱，服务器计数由宿主驱动。 |
| 023 | 通知设置展开 | 组合示例 | Toggle、ButtonGroup、Accordion | Toggle/ButtonGroup 已有受控值；整组启停、隐藏频率的焦点安排和业务保存不应加入通用控件。 |
| 024 | 价格分布筛选 | 暂缓评估 | — | core 无公开双柄 slider/range 控件，FilterPanel 仅 children 和应用/重置回调；需先定义区间输入契约并验收指针/键盘，当前暂缓而非新增公共组件。 |
| 025 | 浮动标签输入 | 扩展现有组件 | TextField | 当前标签由 FieldFrame 外置渲染；须将浮动标签融合现有布局并保持 label-for，邮箱校验和邀请提交留给宿主。 |
| 026 | 验证码输入 | 扩展现有组件 | OtpInput | 重发倒计时与验证服务属于示例；不得内置原型固定验证码或伪造验证成功。 |
| 027 | 顶栏搜索展开 | 组合示例 | ToolbarSearchInput、CommandSearch、IconButton | ToolbarSearchInput 不渲染结果；CommandSearch 自带另一个输入，需选择一个查询源而非叠两个搜索框。 |
| 028 | 自动伸展评论框 | 组合示例 | TextArea、CommentItem、Button | 评论发布、计数和线程插入由宿主；CommentItem 不是输入 API，不能重复实现 autoGrow。 |
| 029 | 标签输入 | 扩展现有组件 | TextField | 新增标签、去重和上限可由宿主键盘处理；退格预选视觉尚缺。 |
| 030 | 日期区间日历 | 扩展现有组件 | Datepicker | 原型双触发器、悬停预览和确认暂存不等于现 API 已全覆盖；需要先增强这些选项，CalendarCard 单值模式不能替代区间。 |
| 031 | 自定义选择器 | 扩展现有组件 | SelectOption | 本地新增 item.icon / description，菜单和单选触发器展示说明，选中反馈使用 Solar；原 width、单多选与受控契约保留。已通过用户验收，技术检查及浏览器限制保留在第三批记录。 |
| 032 | 拖拽上传 | 扩展现有组件 | FileUpload、FileCard | FileItem 只有 id/name/size/state，没有数值进度；细进度/已传字节需扩展 FileCard。 |
| 033 | 标题内联编辑 | 组合示例 | TextField、IconButton | TextField 已 forwardRef 并透传键盘/blur，可实现选择文本、Enter/Escape/IME。 |
| 036 | 密码强度 | 组合示例 | TextField、IconButton、ProgressBar | TextField type 与 iconRight 可组合可见按钮；Checklist 是可交互待办，不宜假装只读安全规则。 |
| 037 | 账号切换 | 组合示例 | AppLayout、AppSwitcherDropdown、ProfileCard、MenuItem | 当前切换回调只描述 UI 选中，并不执行身份、权限或会话切换；这些由宿主完成，账号菜单动效可加在既有弹层。 |
| 038 | 右键菜单 | 暂缓评估 | — | KebabMenu 固定自身三点触发且只接平铺 items，无 openAt、任意 trigger 或 children 子菜单；先评估将触发协议融入现有菜单内部，本轮暂缓。 |
| 039 | 滑动选中标签 | 扩展现有组件 | TabBar、TabsContent | 本地新增可选 slide 转场和 direction；先退场再进入，只挂载一份业务内容，退出立即 inert、减弱动效即时切换；默认 fade 不变。已通过用户验收，技术检查及浏览器限制保留在第三批记录。 |
| 040 | AppLayout 侧栏动效 | 扩展现有组件 | AppLayout | 已在 AppLayout 本地融合；2026-10-14 用户验收通过，尚未提交或发布。 |
| 041 | 底部导航凹槽 | 扩展现有组件 | TabBar | TabItem 当前只有 label/active/badge，无 icon；需增加图标插槽和可选外观。 |
| 042 | 分步向导 | 组合示例 | Stepper、TextField、SelectOption、Button | Stepper 只有 total/current，不含步骤标签/点击回退；回退、校验和步骤面板转场由宿主实现，不能声称它已有完整向导能力。 |
| 043 | 分页伸缩 | 扩展现有组件 | Pagination | 本地新增 locale、motion 与测量型选中背景；窄容器减少可见页码，保留原窗口规则、40px 点击区和首尾禁用；内容切换留官网案例，已通过用户验收。 |
| 044 | 问答折叠 | 扩展现有组件 | Accordion | 本地复用 MotionCollapse 融合高度、正文和 Solar 箭头过渡；关闭立即 inert 并恢复内部焦点，本级键盘导航不进入嵌套面板；API 与原样式不变，已通过用户验收。 |
| 045 | 菜单由按钮展开 | 组合示例 | IconTrigger、Drawer、MenuItem | Drawer 已接 open/onOpenChange 并经 DialogSurface；从触发点扩散的 clip-path 仍需增强原覆盖层，不能复制一套焦点锁。 |
| 046 | 命令面板 | 扩展现有组件 | CommandSearch、Modal | 本地加入键盘游标、滚动可见、active-descendant、图标与快捷键展示；默认中文支持英文。Modal 组合真实本地操作，局部 Cmd/Ctrl+K 由示例负责。已通过用户验收，技术检查及浏览器限制保留在第三批记录。 |
| 047 | 时间区间切换 | 扩展现有组件 | ButtonGroup + 本地计数展示 | 按钮组不获取时间序列；曲线插值与数据请求属于图表示例，不能用随机数据替代实际结果。 |
| 048 | 滑动联动标签 | 扩展现有组件 | TabBar、TabsContent | 当前 TabBar 仅离散 active、TabsContent 仅单内容重挂载；scroll-snap、连续指示器、鼠标拖动与非当前面板 inert 尚未支持，需明确受控联动接口。 |
| 049 | 层叠内容卡 | 扩展现有组件 | SurfaceCard、IconButton、Button | SurfaceCard 当前仅结构/样式类，没有 motion、pointer/focus 透传或展开状态；须扩展最小行为插槽，不能声称 className 已涵盖全部交互。 |
| 050 | 光照倾斜卡 | 扩展现有组件 | SurfaceCard、Button | SurfaceCard 无指针事件/motion 属性；需内部效果或透传后实现，禁用动效时内容仍稳定，不能新增 TiltCard 公共组件。 |
| 053 | 可拖拽卡片堆 | 暂缓评估 | — | core 没有受控 deck/撤销历史/手势事务契约；原型 pointercancel 还会触发接受或跳过。 |
| 054 | 关注个人卡 | 组合示例 | Avatar、Button、SurfaceCard + 本地计数展示 | UserCard 虽有资料和 stats，但没有关注动作/footer 插槽；现阶段组合 SurfaceCard，不将计数/关注服务写入 StatCard 或新 FollowCard。 |
| 056 | 月年计费切换 | 组合示例 | ButtonGroup、RadioButton、TextField、Button + 本地计数展示 | 折扣、席位范围和购买状态是业务规则；不新增 PricingCard/BillingToggle。 |
| 057 | 头像评价轮播 | 组合示例 | ReviewItem、Avatar、IconButton | ReviewItem 当前 content:string，无法原样表达逐词强调；自动轮播、暂停和拖拽并未由这些组件提供，示例实现并验证后才能宣称完成，暂不新增 Carousel。 |
| 058 | 阅读进度卡 | 组合示例 | ProgressBar、Button、SurfaceCard | ButtonGroup 是互斥选项语义，不等同 aria-current 目录锚点；目录使用普通按钮/链接。 |
| 059 | 活动报名卡 | 组合示例 | EventCard、ButtonGroup、AvatarGroup、Button + 本地计数展示 | EventCard 只有 title/timeRange/avatars，无任意 footer/容量或 RSVP API；外层组合即可，不假装其自带报名和真实日历写入。 |
| 061 | 缩略图展开 | 暂缓评估 | — | ImageGrid 没有 onOpen、焦点锁、缩放与键盘浏览；媒体范围是否保留也待核实，不能标成 SurfaceCard 或 ImageGrid 已完成。 |
| 062 | 登录反馈 | 组合示例 | TextField、Button | 认证结果和重试限制由宿主；不得迁入固定密码或按次数制造成功。 |
| 063 | 逐题注册 | 组合示例 | TextField、Button、Stepper | Stepper 为展示而非步骤导航；逐题回退/焦点、校验和账号创建需本地示例或宿主控制，不把演示完成视作邮件已发送。 |
| 066 | 社交登录按钮 | 组合示例 | Button、Avatar | 品牌图标保留真实标识；OAuth、busy、成功与恢复由真实业务回调驱动，不能复制定时器假登录。 |
| 067 | 锁定倒计时 | 组合示例 | Button + 本地计数展示 | 倒计时仅反映服务端截止时间；当前组件不执行解锁或重置邮件，不能内置原型 15 秒后自动授权。 |
| 069 | 头像裁剪 | 暂缓评估 | — | 原型仅 transform SVG，core 也无像素裁剪、旋转坐标或导出文件；暂缓，避免将展示与上传组件假映射成 Cropper。 |
| 070 | 堆叠通知 | 扩展现有组件 | ToastProvider、useToast | ToastOptions 仅 title/description/duration，ToastApi 仅 toast/dismiss；缺 severity、action、update 和 stack 模式。 |
| 071 | 滑动删除与撤销 | 扩展现有组件 | ListItem、ToastProvider、useToast | ListItem 当前只有展示/trailing，无 swipe/onDelete；Toast 缺 action。 |
| 072 | 内联提示收拢 | 暂缓评估 | — | core 无公开 inline alert/status 契约；NotificationItem 不含关闭/详情，Accordion 仅展开内容。 |
| 073 | 公告滚动 | 暂缓评估 | — | 当前无公开公告条或公告序列状态；先确认跨场景需求和无障碍播报，不将整个原型变成公共 Banner，也不假称普通 Button 能承接。 |
| 074 | 通知铃菜单 | 组合示例 | IconTrigger、NotificationItem、NotificationBadge、TabBar、DropdownPanel | IconTrigger 有 Escape/外部点击，但缺复杂通知面板初始焦点策略与视口碰撞；未读总数/标记已读由宿主，DropdownPanel 仅视觉容器。 |
| 075 | 上传进度面板 | 组合示例 | FileUpload、FileCard、ProgressBar、Accordion | FileCard 支持状态和重试但无百分比；逐文件细进度需先增强，整体按字节加权由宿主计算。 |
| 076 | 跟随工具提示 | 扩展现有组件 | Tooltip、TooltipGroup | TooltipBubble 目前 CSS 方位定位，各 Tooltip 独立实例；连续滑移、动态测量和视口碰撞不是现有 warmWindow 自动具备的能力，需内部实现。 |
| 077 | 表情反应面板 | 扩展现有组件 | ChatBubble、IconTrigger、IconButton | ChatBubble 当前没有 children/actions/reactions 插槽，也无 selected/count 回调；需要受控反应模型或附件插槽。 |
| 078 | 滑动回复 | 扩展现有组件 | ChatBubble、ChatInputBar | ChatBubble 无回复手势/quote 插槽，ChatInputBar 无 replyTo/cancelReply 契约；需最小受控扩展，pointercancel 回退、文本选择和 IME 行为必须保留。 |
| 079 | 骨架内容显现 | 暂缓评估 | — | core 没有 Skeleton 或通用内容占位尺寸契约；各内容的占位几何、aria-busy 与 reduced motion 需单独设计，当前暂缓公共组件而非硬映射。 |
| 080 | 轨道同步指示 | 组合示例 | SurfaceCard、Button、ProgressBar | ProgressBar 仅能显示已知数值；未知阶段与插画不是百分比 API。 |
| 081 | 环形完成反馈 | 扩展现有组件 | Button、ProgressBar | Button 当前没有 loading/result 契约；ProgressBar 仅水平条，无环形几何。 |
| 083 | 队列进度转换 | 扩展现有组件 | ProgressBar | 当前 value 默认 0、只渲染 determinate 填充；需 indeterminate 状态及不输出 aria-valuenow 的分支。 |
| 084 | 语音响应圆点 | 扩展现有组件 | ChatInputBar | 现 onDictate 只是点击回调，无按住开始/结束/取消、会话状态或 level 契约。 |
| 085 | 下拉刷新 | 暂缓评估 | — | 需要 scrollTop=0 判定、方向锁、滚动互斥、pointercancel、受控 refreshing/错误和键盘替代入口。 |
| 086 | AI 流式回答 | 扩展现有组件 | StreamingAnswer、ChatInputBar | 当前 StreamingAnswer 已有 text/status/plain\|markdown/animation 和停止冻结，ChatInputBar 有 onStop/status；只需核验原型的分块显现和真实流衔接，不能重复添加传输层或模拟 token 定时器。 |
| 087 | 配送步骤 | 扩展现有组件 | Stepper、HistoryGrouped | Stepper 当前只有 total/current 圆点，无 items 标签、状态、图标/指示器或步骤语义；需向后兼容的可选节点模型。 |
| 088 | 资料夹空态 | 组合示例 | ListGroup、ListItem、Button | 已实现实际按钮到文件夹的坐标轨迹与列表交接；真实创建请求、错误和数据持久化由调用方提供。 |
| 089 | 404 纠错 | 组合示例 | SurfaceCard、Button | SurfaceCard 只提供排版；真实路由匹配与导航由业务提供。 |
| 090 | 可重试错误卡 | 组合示例 | SurfaceCard、Button、BarChart、StatCard | 既有组件不执行网络重试；退避/次数/错误结果归调用方。本轮只有列表中的失败重试组合示例，未覆盖原型全部业务状态。 |
| 091 | 离线消息队列 | 扩展现有组件 | ChatBubble、ChatInputBar | ChatBubble 当前仅 sent/received 与内容类型，无 delivery 状态/状态槽。 |
| 092 | 筛选空态恢复 | 组合示例 | FilterPanel、ToolbarSearchInput、ListGroup、Button | FilterPanel 只有 children 与 apply/reset/cancel，不能计算条件计数和纠错；原型本地商品数据算法应留案例。本轮只有列表中的关键词搜索恢复组合示例，未覆盖原型全部业务状态。 |
| 093 | 完成庆祝 | 组合示例 | Checklist、ProgressBar、Button | 现 Checklist 无整组完成视图切换；可用内部过渡包装组合。 |
| 095 | 形态切换柱图 | 扩展现有组件 | BarChart、ChartTooltip、TabBar | BarChart 只有 activeIndex 输入，无 onActiveIndexChange、selection、键盘入口、稳定数据键或参考线。 |
| 096 | 滑动股票折线 | 扩展现有组件 | SmoothLineChart、ChartTooltip、TabBar | 仅有 activeIndex 输入，缺 scrubbing/keyboard 回调、事件注记及数据插值过渡；当前 SmoothLineChart 不处理鼠标/触摸追踪。 |
| 097 | 重排环图 | 扩展现有组件 | DonutChart、ChartLegendItem | 当前 segments 无稳定 id/选中事件，静态 conic gradient 无可单独交互的分段图元。 |
| 098 | 实时数字滚动 | 扩展现有组件 | StatCard、LineChartStatCard | 两类指标卡已统一可选数字动效与格式；原数字/字符串默认展示不变。series 仍仅 wide 生效，数据来源与更新由场景控制。 |
| 099 | 活动环 | 扩展现有组件 | MultilayerDonutChart | 现组件固定 270° 且 value clamp 至 100%，无多圈超目标、高亮回调或数据过渡。 |
| 100 | 翻页计时器 | 暂缓评估 | — | AnimatedNumber 仅 Intl 格式化数字及列位移，不支持 mm:ss、翻页前后半片或时钟状态。 |
| 101 | 分栏工作区 | 暂缓评估 | — | 需受控尺寸、min/max、方向、pointer capture 与键盘 separator 协议。 |
| 102 | 嵌套文件树 | 暂缓评估 | — | 需稳定 node id、嵌套 children、展开/选中控制、roving focus 和左右方向键。 |
| 108 | 时区交集 | 组合示例 | SurfaceCard、Button | core 无时区交集算法或时间轴；原型日期固定 2026-10-12、工作时段固定 9–18。 |
| 109 | 可用时间涂选 | 暂缓评估 | — | FullCalendar.CalendarEvent 只有 day/hour/label，无 time range、selected slots、onSelectionChange；需要时区、粒度、禁选、拖动增删和键盘网格。 |
| 110 | 日程冲突修复 | 组合示例 | EventTag、SurfaceCard、Button | FullCalendar 仅 day/hour，缺 start/end/duration 与冲突模型，不能直接还原 14:30–15:30 的重叠条。 |
| 111 | 任务时长编辑 | 暂缓评估 | — | 缺 task id、start/end、row、drag/resize 回调与边界/时区规范。 |
| 126 | Markdown 编辑与预览 | 组合示例 | TextArea、StreamingAnswer、Button | StreamingAnswer 是渲染器，编辑值和预览状态由调用方持有；原型极简正则 Markdown 不替代现有渲染器，也不代表富文本编辑能力。 |
| 127 | 变更片段审核 | 组合示例 | AgentCodeBlock、Button | AgentCodeBlock 无 hunk 决策协议；需在组合层维护 pending/accepted/rejected、保存错误及动效。 |
| 128 | 查找替换 | 组合示例 | TextField、TextArea、Button | 文本匹配/replaceAll/撤销归调用方，输入控件不自带编辑器搜索；原型只是固定字符串 split/join，未覆盖 selection/regex/IME。 |
| 129 | 代码折叠 | 扩展现有组件 | AgentCodeBlock | 当前仅 lines/diff/view，无 foldRanges、collapsedIds、onFoldChange；需明确行号保留、嵌套区间和 aria-expanded，不能凭文本大括号猜完整语法树。 |
| 140 | 选中文字格式 | 暂缓评估 | — | 原型依赖 saved Range 和 document.execCommand。 |
| 146 | JSON 树编辑 | 暂缓评估 | — | 当前原型只编辑 name/stars/live 三个固定字段；需要任意对象/数组、类型转换、错误路径、受控数据和键盘树模型。 |
| 149 | 冲突文本合并 | 暂缓评估 | — | 需 conflict id、分支/基线、未解决状态、合并输出和保存失败。 |
| 151 | 贡献热力格 | 暂缓评估 | — | 需要日期格定位、色域、缺失值、跨月边界、选择/键盘和 tooltip 数据；原型是 84 个合成值加 range，不是真日历布局。 |
| 154 | 能力雷达 | 暂缓评估 | — | 需各维 domain/缺失值、轴标签、多个 series、选中与缩放协议；原型固定五维两 profile 的 polygon 插值。 |
| 157 | 层叠用量面积 | 扩展现有组件 | SmoothLineChart、ChartCard、ChartLegendItem | 当前每条 fillArea 都从基线填充，并无 cumulative stack/normalize、受控 series 显隐及过渡；需真正实现堆叠域和面积边界，不能仅传多序列称堆叠完成。 |
| 160 | 转化漏斗 | 暂缓评估 | — | 需要有序阶段量、分母口径、转化/流失计算、零值/逆增校验及梯形几何。 |
| 161 | 留存队列 | 暂缓评估 | — | 需要 cohort/period 键、不可观测空单元与零值区分、色域、选择和键盘；DataTable 能排单元格但不自带热力图比例与缺失语义。 |
| 163 | 目标刻度 | 扩展现有组件 | BarHorizontalChart、ChartCard | 当前只按本批最大值归一且无 domain/目标线/区间带/刻度，单条值会填满。 |
| 165 | 预测置信带 | 扩展现有组件 | SmoothLineChart、ChartCard、ButtonGroup | 目前 series 只有 data/color/fillArea，缺 lower/upper 区间带、虚线分段与带状插值；需从同一 x/domain 计算上下界，fillArea 到基线不能冒充置信带。 |
| 176 | 版本胶片 | 组合示例 | HistoryGrouped、SurfaceCard、Button | HistoryGrouped.items 是历史记录显示，未提供版本选择/恢复回调；需由调用方持有 selected/live 与失败状态，并给版本项外部交互，不能冒称现成胶片组件。 |
| 177 | 撤销重做历史 | 组合示例 | Toolbar、IconButton | Toolbar 无历史堆栈且不应添加业务堆栈；调用方控制 canUndo/canRedo、分支截断及快捷键，原型最多 12 条为示例规则。 |
| 178 | 批量选择操作台 | 扩展现有组件 | Toolbar、Button、Checkbox、FileTypeIcon | Toolbar.selection 已实现显示、数字动效、清选和隐藏层语义；持续传配置对象并以 count=0 退出。选择集合、异步操作与撤销由调用方控制。 |
| 179 | 文字片段拼接 | 组合示例 | SurfaceCard、Button | 原型没有系统剪贴板读写；picked 顺序、清空和拼接由调用方管理，不把例子命名当真实剪贴板集成功能。 |
| 180 | 审批签署 | 组合示例 | Avatar、Button、SurfaceCard | Avatar/SurfaceCard 只展示，审批步骤/审核人/权限/结果由外部控制；原型 n++ 即完成不是实际签署。 |
| 181 | 工作分派 | 组合示例 | TaskCard、Avatar、ProgressBar、Button | TaskCard 不执行任务分派，ProgressBar 不计算容量；原型 loads 上限 5 和循环任务数组只是示例。 |
| 184 | 角色权限矩阵 | 组合示例 | DataTable、Checkbox | 表格行选择不等于角色权限。 |
| 186 | 设备配对 | 排除 | — | 原型 550ms 后显现固定设备、点击即标连接，无设备发现/授权/连接协议；仅保留实验室原型。 |
| 188 | 灰度发布 | 暂缓评估 | — | 现有基础组件不具备发布协议。 |
| 189 | 环境晋级 | 暂缓评估 | — | Stepper 当前无环境检查模型；原型定时 550ms 自动通过不代表校验。 |
| F01 | 附件队列 | 扩展现有组件 | FileUpload、FileCard、ChatInputBar | FileItem 当前只有 id/name/size/state，无 progress；FileUpload 的 FileList 回调已保留真实文件，上传执行归调用方。 |
| F02 | 工具运行卡 | 扩展现有组件 | ThinkingTrace、ToolChips | ThinkingTrace 目前只按时间显行，play=false 会全显，无逐行状态/activeStep/失败/停止，ToolChips 只显示静态 detail。 |
| F03 | 列表批量操作 | 扩展现有组件 | Toolbar、Button、ListGroup、ListItem | Toolbar.selection 已实现显示、数字动效、清选和隐藏层语义；持续传配置对象并以 count=0 退出。选择集合、异步操作与撤销由调用方控制。 |
| F04 | 生成内容审核 | 组合示例 | SurfaceCard、Button | AgentDiffTable 的 cells 和 ApprovalCard 的 questions 都不匹配；AgentCodeBlock 只适合代码显示，普通文本不要强塞代码 API。 |
| F05 | 协作席位 | 组合示例 | AddMember、Avatar、AvatarGroup、Button | AddMember 的待添加选择不等于 activeOwner，AvatarGroup 也不管理负责人。 |
| F06 | 搜索无结果恢复 | 组合示例 | FilterPanel、ToolbarSearchInput、ListGroup、Button | FilterPanel 不产生搜索结果，原型 filters.length>0 即零结果仅为示例。本轮只有列表中的关键词搜索恢复组合示例，未覆盖原型全部业务状态。 |

本轮集中展示已通过官网 TypeScript、定向 ESLint 与差异检查；目录断言确认 99 + 23 项无重复遗漏、186 排除、已认可 7 项及原型快照完整。Chrome 已验证原型保存交互、语言/主题/动效同步、评审及备注持久化、分类/状态筛选、040 侧栏折叠跨路由保留、090 局部示例标识、首次加载旧 hash 与暂缓项 hash、390px 窄屏无横向溢出及真实 JSON 导出。定向本地审阅检查完成，未对 122 项逐一完成功能 QA。详见 [集中评审验证记录](../../artifacts/component-fusion/verification-consolidated.json)。本轮只整理展示，不新增公共组件，不提交、不发布。

第三批 031 / 039 / 046 已通过 core:check（235 项组件测试、17 项审计测试）、core:build、官网 TypeScript 与相关 ESLint。Chrome 已检查连续切换、搜索执行、选择、语言主题、窄屏与减弱动效。命令弹窗搜索框聚焦时 Escape 的当前浏览器验证未通过，组件模拟验证通过，原因未定；包检查仅体积/文件数预算失败。见 [第三批验证记录](../../artifacts/component-fusion/verification-batch-3.json)。第三批已通过用户验收，Escape 浏览器限制及包预算问题仍未解决，未提交、未发布。

第二批（013 / 043 / 044）验证：pnpm core:check（220 项组件测试、17 项审计测试）、pnpm core:build、官网 TypeScript、相关 ESLint 和差异检查已通过。Chrome 已检查拖动、键盘导航、分页边界、窄屏、语言主题与关闭动效；运行时系统减弱动效问题已修复并复验。包体积与文件数预算仍超限，阈值未改。详见 [第二批验证记录](../../artifacts/component-fusion/verification-batch-2.json)。第二批已有明确用户验收记录，发布仍需单独完成包预算等检查。

证据边界：公共导出与来源路径已核验；原型中的定时器、随机进度、伪登录和自动成功仅是演示。真正的业务结果、权限和数据状态仍由宿主控制。
