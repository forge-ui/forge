# 123 项组件分类与迁移对照

> 2026-10-14 更新：本文保留为历史分类讨论。最新 123 项融合决策以 [组件融合审查](./component-fusion-audit.md) 和 [审查 JSON](./component-fusion-audit.json) 为准；下文旧的独立组件建议已被覆盖，不代表当前实现、用户验收或发布。

状态：源码复核后的提案，未应用到官网导航。与旧迁移表存在冲突时，以本表及汇总 JSON 的建议为本轮审查结论；不覆盖已运行的实验室计划。

本轮不增加侧栏入口：“提示与反馈”整合原进度与提示气泡，具体能力做页内小节。“内容与编辑”“协作与流程”仅为实验室/cases 标签；暂缓和排除是审核状态，均不是组件导航。

主入口回答用户到哪里找；底层能力回答如何复用；完整示例回答如何组合。它们不必相同。候选名称和复用清单不代表已经实现。

总计 117 个保留原型 + 6 个 Forge 示例 = 123 项；ID 无缺失或重复，引用文件均存在。未将静态复核当作逐项浏览器验收。

| 处理建议 | 数量 |
| --- | --- |
| 扩展现有组件 | 44 |
| 独立能力候选 | 23 |
| 组合示例 | 38 |
| 暂缓评估 | 17 |
| 排除 | 1 |

“扩展现有组件”仍需补足状态与回调；“独立能力候选”不等于新建分类或已批准新增导出；“暂缓评估”保留在实验室；“排除”不进入生产迁移。

## 主入口与完整示例

| 编号 | 名称 / 实际任务 | 展示入口 / 页内小节 | 完整示例归属 | 接入建议 / 复用 |
| --- | --- | --- | --- | --- |
| 001 | 液态玻璃按钮：触发操作并确认提交完成 | 按钮与链接 | 按钮与链接 | 扩展现有组件；Button |
| 002 | 磁吸箭头按钮：触发主操作或进入目标页面 | 按钮与链接 | 按钮与链接 | 扩展现有组件；Button / StyledLink |
| 003 | 长按删除：持续按住以确认删除，并支持撤销 | 按钮与链接 | 按钮与链接 | 扩展现有组件；Button |
| 004 | 下载进度按钮：启动、取消下载并查看结果 | 按钮与链接 | 按钮与链接 | 扩展现有组件；Button |
| 005 | 纸飞机发送：发送内容并确认发送结果 | 按钮与链接 | 按钮与链接 | 扩展现有组件；IconButton / Button |
| 006 | 墨水涟漪按钮：订阅或取消订阅 | 按钮与链接 | 按钮与链接 | 扩展现有组件；Button |
| 007 | 播放暂停变形：切换播放暂停并调整播放位置 | 按钮与链接 | 按钮与链接 | 扩展现有组件；IconButton |
| 008 | 复制完成反馈：将安装命令复制到剪贴板 | 按钮与链接 | 按钮与链接 | 扩展现有组件；IconButton / Button |
| 009 | 文字滚动按钮：打开作品或执行主要链接操作 | 按钮与链接 | 按钮与链接 | 扩展现有组件；Button / StyledLink |
| 010 | 组合操作按钮：选择一种执行方式并执行当前方式 | 按钮与链接 | 按钮与链接 | 独立能力候选；Button / DropdownPanel / MenuItem |
| 011 | 扇形快捷操作：展开一组快捷创建操作 | 菜单与导航 | 菜单与导航 | 独立能力候选；IconButton / MenuItem |
| 012 | 书签丝带：收藏或取消收藏当前内容 | 按钮与链接 | 按钮与链接 | 扩展现有组件；IconButton |
| 013 | 弹性开关：开启或关闭勿扰选项 | 表单与输入 | 表单与输入 | 扩展现有组件；Toggle |
| 014 | 待办清单：勾选待办并查看完成数量 | 待办清单 | 待办清单 | 扩展现有组件；Checklist |
| 015 | 套餐选择卡：比较并选择一个套餐 | 表单与输入 | 表单与输入 | 组合示例；RadioButton / RadioWithLabel / SurfaceCard |
| 016 | 星级评价：为订单给出星级评价 | 评论与评价 | 评论与评价 | 扩展现有组件；RatingStars |
| 018 | 滚动数量步进：增减商品数量并查看合计 | 表单与输入 | 表单与输入 | 独立能力候选；TextField / IconButton |
| 019 | 兴趣多选：从有限兴趣选项中多选至上限 | 表单与输入 | 表单与输入 | 组合示例；CheckboxControl / CheckboxWithLabel |
| 021 | 日夜切换：在日间与夜间外观之间切换 | 表单与输入 | 表单与输入 | 扩展现有组件；Toggle |
| 022 | 点赞心形绽放：点赞或取消点赞内容 | 按钮与链接 | 按钮与链接 | 扩展现有组件；IconButton |
| 023 | 通知设置展开：配置通知开关及邮件频率 | 表单与输入 | 表单与输入 | 组合示例；Toggle / ButtonGroup |
| 024 | 价格分布筛选：拖动价格范围以缩小商品结果 | 筛选 | 筛选 | 独立能力候选；FilterPanel |
| 025 | 浮动标签输入：填写姓名邮箱并提交邀请 | 表单与输入 | 表单与输入 | 扩展现有组件；TextField |
| 026 | 验证码输入：输入一次性验证码并验证 | 表单与输入 | 表单与输入 | 扩展现有组件；OtpInput |
| 027 | 顶栏搜索展开：从页面顶栏搜索并打开结果 | 页面顶栏 | 页面顶栏 | 组合示例；ToolbarSearchInput / CommandSearch |
| 028 | 自动伸展评论框：撰写并提交一条回复 | 评论与评价 | 评论与评价 | 组合示例；TextArea / CommentItem / Button |
| 029 | 标签输入：输入、移除和挑选项目标签 | 表单与输入 | 表单与输入 | 扩展现有组件；TextField / FieldTag |
| 030 | 日期区间日历：选择入住和退房日期区间 | 表单与输入 | 表单与输入 | 扩展现有组件；Datepicker |
| 031 | 自定义选择器：选择显示语言并保存设置 | 表单与输入 | 表单与输入 | 扩展现有组件；SelectOption |
| 032 | 拖拽上传：拖入文件、查看逐个上传结果并重试 | 表单与输入 | 表单与输入 | 扩展现有组件；FileUpload / FileCard / MediaUpload |
| 033 | 标题内联编辑：就地修改标题并保存或取消 | 表单与输入 | 页面顶栏 | 独立能力候选；TextField / IconButton |
| 036 | 密码强度：输入密码、切换可见性并查看要求 | 表单与输入 | 表单与输入 | 组合示例；TextField / Checklist |
| 037 | 账号切换：切换工作区并进入账号操作 | 菜单与导航 | 菜单与导航 | 组合示例；AppLayout / ProfileCard / DropdownPanel / MenuItem |
| 038 | 右键菜单：针对文件打开上下文操作并处理子菜单 | 菜单与导航 | 列表 | 独立能力候选；DropdownPanel / MenuItem / KebabMenu |
| 039 | 滑动选中标签：在内容种类间切换浏览 | 页签与切换 | 页签与切换 | 扩展现有组件；LiquidTabs / TabBar |
| 040 | 侧栏伸缩：收窄或展开侧栏并进入页面 | 菜单与导航 | 菜单与导航 | 扩展现有组件；SidebarMenu / AppLayout |
| 041 | 底部导航凹槽：从底部入口切换主要目的地 | 菜单与导航 | 菜单与导航 | 独立能力候选；MenuItem / IconButton |
| 042 | 分步向导：按步骤完成账号、工作区及成员设置 | 分页与步骤 | 表单与输入 | 组合示例；Stepper / TextField / SelectOption / Button |
| 043 | 分页伸缩：跳转分页并浏览该页内容 | 分页与步骤 | 分页与步骤 | 扩展现有组件；Pagination |
| 044 | 问答折叠：展开问题以阅读答案 | 布局与容器 | 布局与容器 / 折叠问答 | 扩展现有组件；Accordion |
| 045 | 菜单由按钮展开：打开网站导航并切换栏目 | 菜单与导航 | 菜单与导航 | 组合示例；IconTrigger / MenuItem |
| 046 | 命令面板：搜索文件或命令并执行 | 菜单与导航 | 菜单与导航 | 扩展现有组件；CommandSearch |
| 047 | 时间区间切换：切换指标统计的时间粒度 | 页签与切换 | 图表 | 扩展现有组件；ButtonGroup |
| 048 | 滑动联动标签：点击页签或滑动内容切换栏目 | 页签与切换 | 页签与切换 | 扩展现有组件；TabBar / LiquidTabs |
| 049 | 层叠内容卡：预览文章信息并收藏或打开 | 卡片 | 卡片 | 扩展现有组件；SurfaceCard / IconButton |
| 050 | 光照倾斜卡：浏览文章摘要并标记已读 | 卡片 | 卡片 | 扩展现有组件；SurfaceCard / IconButton |
| 053 | 可拖拽卡片堆：逐个浏览推荐内容、保存或跳过并撤销 | 卡片 | 卡片 | 独立能力候选；SurfaceCard / IconButton |
| 054 | 关注个人卡：查看个人资料、关注及推荐成员 | 卡片 | 卡片 | 组合示例；Avatar / Button / StatCard / SurfaceCard |
| 056 | 月年计费切换：选择计费周期与套餐并确认订阅 | 表单与输入 | 表单与输入 | 组合示例；ButtonGroup / RadioButton / TextField / Button |
| 057 | 头像评价轮播：浏览多位客户的评价并切换条目 | 评论与评价 | 评论与评价 | 组合示例；ReviewItem / Avatar / IconButton |
| 058 | 阅读进度卡：阅读长文并按目录定位、查看阅读进度 | 提示与反馈 → 加载与进度 | 内容展示 | 组合示例；ProgressBar / ButtonGroup / SurfaceCard |
| 059 | 活动报名卡：查看活动、选择参加状态并加入日历 | 日历与日程 | 日历与日程 | 组合示例；EventCard / ButtonGroup / AvatarGroup / Button |
| 061 | 缩略图展开：展开图片、切换浏览并缩放 | 文件展示 | 文件展示 / 图片浏览（暂缓） | 暂缓评估；ImageGrid |
| 062 | 登录反馈：输入账号密码、查看校验错误并完成登录 | 表单与输入 | 表单与输入 | 组合示例；TextField / Button |
| 063 | 逐题注册：逐步填写注册资料、返回修改已答项 | 表单与输入 | 表单与输入 | 组合示例；TextField / Button / Stepper |
| 066 | 社交登录按钮：选择第三方账号登录，并切换登录方式 | 按钮与链接 | 表单与输入 | 组合示例；Button |
| 067 | 锁定倒计时：账号暂时锁定时查看剩余等待并重试登录 | 提示与反馈 → 空态与结果 | 表单与输入 | 组合示例；Button / AnimatedNumber |
| 069 | 头像裁剪：缩放、移动和旋转头像后保存裁剪结果 | 表单与输入 | 表单与输入 | 暂缓评估；MediaUpload / Avatar |
| 070 | 堆叠通知：查看短暂操作结果，展开叠放通知并关闭或重试 | 提示与反馈 → 通知消息 | 提示与反馈 | 扩展现有组件；ToastProvider / useToast |
| 071 | 滑动删除与撤销：在收件列表中滑动删除条目并撤销 | 列表 | 列表 | 扩展现有组件；ListItem / ToastProvider |
| 072 | 内联提示收拢：查看常驻系统告警、展开详情并逐条消除 | 提示与反馈 → 行内提示与公告 | 提示与反馈 | 独立能力候选；尚无直接对应 |
| 073 | 公告滚动：阅读可轮播、可关闭的站内公告 | 提示与反馈 → 行内提示与公告 | 提示与反馈 | 独立能力候选；Button |
| 074 | 通知铃菜单：浏览通知、按提及筛选、标记已读 | 列表 | 列表 | 组合示例；NotificationItem / NotificationBadge / TabBar / DropdownPanel |
| 075 | 上传进度面板：查看多文件上传进度和失败项并重试 | 表单与输入 | 表单与输入 | 组合示例；FileUpload / FileCard / ProgressBar |
| 076 | 跟随工具提示：在工具栏中连续查看按钮含义和快捷键 | 提示与反馈 → 提示气泡 | 工具栏 | 扩展现有组件；Tooltip / TooltipGroup |
| 077 | 表情反应面板：给消息添加或取消表情反应并查看人数 | 聊天 | 聊天 | 独立能力候选；ChatBubble |
| 078 | 滑动回复：选中一条消息引用回复并发送 | 聊天 | 聊天 | 扩展现有组件；ChatBubble / ChatInputBar |
| 079 | 骨架内容显现：等待内容加载时看到结构占位，完成后平滑显现 | 提示与反馈 → 加载与进度 | 提示与反馈 | 独立能力候选；尚无直接对应 |
| 080 | 轨道同步指示：了解同步进行到哪一步，并取消或重试 | 提示与反馈 → 加载与进度 | 提示与反馈 | 组合示例；ProgressBar |
| 081 | 环形完成反馈：提交支付后查看处理中、成功与回执 | 按钮与链接 | 提示与反馈 | 组合示例；Button / ProgressBar |
| 083 | 队列进度转换：跟踪排队中的部署及后续有明确比例的构建进度 | 提示与反馈 → 加载与进度 | 提示与反馈 / 加载与进度 | 扩展现有组件；ProgressBar |
| 084 | 语音响应圆点：按住说话，了解正在聆听、识别或思考 | 聊天 | 聊天 | 独立能力候选；ChatInputBar |
| 085 | 下拉刷新：在列表顶部拉动或点击刷新以获取新内容 | 列表 | 列表 | 独立能力候选；ListGroup / ListItem |
| 086 | AI 流式回答：读取智能体流式回答、停止生成或重试 | 智能体 | 智能体 | 扩展现有组件；StreamingAnswer / ChatInputBar |
| 087 | 配送步骤：查看订单当前配送阶段及历史节点 | 分页与步骤 | 分页与步骤 | 组合示例；Stepper / HistoryGrouped |
| 088 | 资料夹空态：首次无项目时选模板创建，然后进入项目列表 | 提示与反馈 → 空态与结果 | 列表 | 扩展现有组件；EmptyState / ListItem / Button |
| 089 | 404 纠错：地址不存在时识别原因并找到正确页面 | 提示与反馈 → 空态与结果 | 提示与反馈 | 组合示例；EmptyState / Button |
| 090 | 可重试错误卡：数据加载失败时查看错误并重试，成功后查看图表 | 提示与反馈 → 空态与结果 | 卡片 | 组合示例；EmptyState / BarChart / StatCard |
| 091 | 离线消息队列：离线仍可拟发消息，并在恢复后了解发送状态 | 聊天 | 聊天 | 组合示例；ChatBubble / ChatInputBar |
| 092 | 筛选空态恢复：搜索无结果时通过移除条件或纠错恢复结果 | 筛选 | 筛选 | 组合示例；FilterPanel / EmptyState |
| 093 | 完成庆祝：完成今日全部待办后获得完成反馈 | 待办清单 | 待办清单 | 扩展现有组件；Checklist / ProgressBar |
| 095 | 形态切换柱图：切换统计周期、检查某根柱和对比差异 | 图表 | 图表 | 扩展现有组件；BarChart / ChartTooltip / TabBar |
| 096 | 滑动股票折线：沿时间序列查看价格与事件，并切换时间范围 | 图表 | 图表 | 扩展现有组件；SmoothLineChart / ChartTooltip |
| 097 | 重排环图：比较分类占比，并排除某分类重新计算比例 | 图表 | 图表 | 扩展现有组件；DonutChart |
| 098 | 实时数字滚动：监控实时关键指标、切换指标并暂停更新 | 卡片 | 卡片 | 扩展现有组件；StatCard / LineChartStatCard / AnimatedNumber |
| 099 | 活动环：比较多个独立目标的达成程度并查看每日变化 | 图表 | 图表 | 暂缓评估；尚无直接对应 |
| 100 | 翻页计时器：设置时长、开始暂停延长计时并查看结束 | 审核状态：实验室待评估 | 实验室 / 计时演示 | 暂缓评估；AnimatedNumber / Button |
| 101 | 分栏工作区：拖动分隔条调整编辑区与预览区比例 | 布局与容器 | 布局与容器 | 独立能力候选；Grid |
| 102 | 嵌套文件树：展开文件夹层级并选择文件 | 列表 | 列表 | 独立能力候选；尚无直接对应 |
| 108 | 时区交集：跨时区找共同工作时间 | 日历与日程 | 日历与日程 | 组合示例；尚无直接对应 |
| 109 | 可用时间涂选：在一周时间网格中涂选可用时段 | 日历与日程 | 日历与日程 | 独立能力候选；FullCalendar |
| 110 | 日程冲突修复：发现日程冲突并选择建议的新时间 | 日历与日程 | 日历与日程 | 组合示例；FullCalendar / EventTag |
| 111 | 任务时长编辑：移动任务开始日期并拖拽调整跨天时长 | 日历与日程 | 日历与日程 | 暂缓评估；FullCalendar |
| 126 | Markdown 编辑与预览：编辑 Markdown 并切换查看排版结果 | 实验室/cases 标签：内容与编辑 | 内容与编辑 / 文档预览 | 组合示例；StreamingAnswer / TextField |
| 127 | 变更片段审核：逐段接受或保留代码变更 | 实验室/cases 标签：内容与编辑 | 内容与编辑 / 代码审核 | 暂缓评估；AgentCodeBlock |
| 128 | 查找替换：在文档中查找并批量替换文字 | 实验室/cases 标签：内容与编辑 | 内容与编辑 / 文档编辑 | 暂缓评估；TextField / Button |
| 129 | 代码折叠：折叠代码区块以缩短阅读长度 | 实验室/cases 标签：内容与编辑 | 内容与编辑 / 代码阅读 | 扩展现有组件；AgentCodeBlock |
| 140 | 选中文字格式：为选中的文本设置粗体斜体或对齐 | 实验室/cases 标签：内容与编辑 | 内容与编辑 / 富文本编辑 | 暂缓评估；Toolbar / IconButton |
| 146 | JSON 树编辑：展开 JSON 对象并编辑有类型的字段 | 实验室/cases 标签：内容与编辑 | 内容与编辑 / JSON 编辑 | 暂缓评估；TextField / Toggle |
| 149 | 冲突文本合并：在两份冲突文本中逐块选择保留内容 | 实验室/cases 标签：内容与编辑 | 内容与编辑 / 合并冲突 | 暂缓评估；AgentCodeBlock |
| 151 | 贡献热力格：按日期查看活动强度和贡献量 | 图表 | 图表 / 活动热力图 | 独立能力候选；ChartCard / ChartTooltip |
| 154 | 能力雷达：比较多项能力在不同对象间的差异 | 图表 | 图表 / 能力比较 | 独立能力候选；ChartCard / ChartTooltip |
| 157 | 层叠用量面积：查看不同用量序列的累计占比并聚焦单项 | 图表 | 图表 / 用量分析 | 暂缓评估；SmoothLineChart / ChartCard / ChartTooltip |
| 160 | 转化漏斗：查看转化阶段及相邻阶段流失 | 图表 | 图表 / 转化分析 | 独立能力候选；ChartCard / ChartTooltip |
| 161 | 留存队列：比较不同队列在后续周期的留存 | 图表 | 图表 / 留存队列 | 独立能力候选；ChartCard / ChartTooltip |
| 163 | 目标刻度：比较实际值与目标阈值 | 图表 | 图表 / 目标达成分析 | 独立能力候选；ChartCard / ChartTooltip |
| 165 | 预测置信带：查看预测曲线并切换置信区间 | 图表 | 图表 / 预测分析 | 暂缓评估；SmoothLineChart / ChartCard / ChartTooltip |
| 176 | 版本胶片：预览历史版本并恢复其中一个 | 历史记录 | 历史记录 / 版本回溯 | 组合示例；HistoryGrouped / Button |
| 177 | 撤销重做历史：撤销和重做当前编辑操作 | 历史记录 | 历史记录 / 编辑撤销重做 | 组合示例；Toolbar / IconButton |
| 178 | 批量选择操作台：选择多个文件并批量归档与撤销 | 列表 | 列表 / 文件集合批量操作 | 组合示例；SelectionActionBar / FileCard / FileTypeIcon |
| 179 | 文字片段拼接：选择多个文字片段并按选择顺序拼接 | 实验室/cases 标签：内容与编辑 | 内容与编辑 / 常用片段拼接 | 暂缓评估；Button / SurfaceCard |
| 180 | 审批签署：逐步完成多人审核并展示审核状态 | 实验室/cases 标签：协作与流程 | 协作与流程 / 多人审核 | 组合示例；Avatar / Button / SurfaceCard |
| 181 | 工作分派：根据成员剩余容量分派任务 | 实验室/cases 标签：协作与流程 | 协作与流程 / 团队负载分配 | 组合示例；TaskCard / Avatar / ProgressBar |
| 184 | 角色权限矩阵：调整角色对资源的操作权限 | 数据表格 | 数据表格 / 角色权限配置 | 组合示例；DataTable / Checkbox |
| 186 | 设备配对：发现设备并选择连接或断开 | 审核状态：不纳入迁移 | 设备与系统 / 配对 | 排除；尚无直接对应 |
| 188 | 灰度发布：分阶段扩大部署覆盖率并回滚 | 实验室/cases 标签：协作与流程 | 协作与流程 / 灰度发布 | 暂缓评估；ProgressBar / Button / StatCard |
| 189 | 环境晋级：校验后把版本从开发推进到预发和生产 | 实验室/cases 标签：协作与流程 | 协作与流程 / 发布流程 | 暂缓评估；Stepper / SurfaceCard / Button |
| F01 | 附件队列：为消息添加多个附件并处理上传进度、失败和移除 | 聊天 | 聊天 / 带附件的消息输入 | 扩展现有组件；FileUpload / FileCard / ChatInputBar |
| F02 | 工具运行卡：查看工具调用的参数、步骤、结果并停止或重试 | 智能体 | 智能体 / 工具运行过程 | 暂缓评估；ThinkingTrace / ToolChips |
| F03 | 列表批量操作：选中文档后执行批量操作并撤销 | 列表 | 列表 / 文档批量归档 | 独立能力候选；SelectionActionBar / Toolbar / ListItem / ListGroup |
| F04 | 生成内容审核：逐项接受、保留或撤销文本变更 | 智能体 | 智能体 / 生成内容审核 | 暂缓评估；AgentCodeBlock / Button |
| F05 | 协作席位：增减协作成员并切换当前负责人 | 智能体 | 智能体 / 协作席位 | 组合示例；AddMember / Avatar / AvatarGroup |
| F06 | 搜索无结果恢复：移除限制条件并恢复搜索结果 | 筛选 | 筛选 / 无结果恢复 | 组合示例；EmptyState / FilterPanel / ToolbarSearchInput |

## 逐项依据与迁移边界

### 001 液态玻璃按钮

- 现行映射：按钮与链接 → Button。
- 建议展示入口：按钮与链接；能力归属：按钮与链接；完整示例：按钮与链接。
- 判断依据：按钮的加载、完成反馈与指针响应，属于原 Button 的可选状态和效果。
- 接入边界：扩展现有组件
- 待解决：成功必须由真实结果驱动，不能把演示定时器视作业务成功。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/001.html)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 002 磁吸箭头按钮

- 现行映射：按钮与链接 → Button。
- 建议展示入口：按钮与链接；能力归属：按钮与链接；完整示例：按钮与链接。
- 判断依据：箭头和磁吸服务于同一个主操作；保留按钮或链接语义，按实际是否导航选择入口。
- 接入边界：扩展现有组件
- 待解决：不得因为有动效而另造功能重复的按钮组件。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/002.html)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)；[StyledLink](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/link.tsx)。

### 003 长按删除

- 现行映射：按钮与链接 → Button。
- 建议展示入口：按钮与链接；能力归属：按钮与链接；完整示例：按钮与链接。
- 判断依据：可复用能力是长按确认按钮；文件条目退场和删除恢复属于完整案例。现有 hold 变体方向正确。
- 接入边界：扩展现有组件
- 关联入口：列表、弹窗与抽屉。
- 待解决：撤销是否成功由业务回调控制；保留松手回退和键盘按住行为。
- 本地状态：已有部分本地实现；本轮不等于验收、完成或发布。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/003.html)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 004 下载进度按钮

- 现行映射：按钮与链接 → Button。
- 建议展示入口：按钮与链接；能力归属：按钮与链接；完整示例：按钮与链接。
- 判断依据：按钮自身在下载、进度、完成之间变形，主能力是带进度的异步操作按钮。
- 接入边界：扩展现有组件
- 关联入口：提示与反馈 / 加载与进度、文件展示。
- 待解决：百分比、剩余时间、取消和完成必须受控；文件下载流程不内置。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/004.html)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 005 纸飞机发送

- 现行映射：按钮与链接 → Button。
- 建议展示入口：按钮与链接；能力归属：按钮与链接；完整示例：按钮与链接。
- 判断依据：发送是操作；飞出和完成反馈为按钮效果，可在聊天输入框复用。
- 接入边界：扩展现有组件
- 关联入口：聊天。
- 待解决：不能点击即声明发送成功；输入框业务状态独立。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/005.html)；[IconButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-button.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 006 墨水涟漪按钮

- 现行映射：按钮与链接 → Button。
- 建议展示入口：按钮与链接；能力归属：按钮与链接；完整示例：按钮与链接。
- 判断依据：涟漪属于可按下切换按钮反馈；订阅人数和服务端状态属于案例。
- 接入边界：扩展现有组件
- 关联入口：评论与评价。
- 待解决：通用 Button 不应内置订阅计数、品牌数据。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/006.html)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 007 播放暂停变形

- 现行映射：按钮与链接 → Button。
- 建议展示入口：按钮与链接；能力归属：按钮与链接；完整示例：按钮与链接。
- 判断依据：可迁移入口是受控图标切换按钮；进度波形与音轨是配套案例。
- 接入边界：扩展现有组件
- 关联入口：提示与反馈 / 加载与进度。
- 待解决：用户已移除媒体与系统分类；不能顺势恢复一整套媒体播放器。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/007.html)；[IconButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-button.tsx)。

### 008 复制完成反馈

- 现行映射：按钮与链接 → Button。
- 建议展示入口：按钮与链接；能力归属：按钮与链接；完整示例：按钮与链接。
- 判断依据：复制结果属于按钮状态；包管理器切换、命令展示是案例组合。
- 接入边界：扩展现有组件
- 关联入口：智能体、页签与切换。
- 待解决：原型吞掉剪贴板失败仍显示已复制，正式组件须按 Promise 成功或失败反馈。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/008.html)；[IconButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-button.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 009 文字滚动按钮

- 现行映射：按钮与链接 → Button。
- 建议展示入口：按钮与链接；能力归属：按钮与链接；完整示例：按钮与链接。
- 判断依据：文字滚动是原有操作入口的视觉变体，保持实际的链接/按钮语义。
- 接入边界：扩展现有组件
- 待解决：不能将文字效果独立成第二套 CTA API。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/009.html)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)；[StyledLink](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/link.tsx)。

### 010 组合操作按钮

- 现行映射：按钮与链接 → Button。
- 建议展示入口：按钮与链接；能力归属：按钮与链接；完整示例：按钮与链接。
- 判断依据：主操作加相邻下拉菜单是 SplitButton 模式；有双焦点与菜单状态，比普通 Button 装饰变体多一层结构。
- 接入边界：独立能力候选；候选 SplitButton
- 关联入口：菜单与导航。
- 待解决：先复用既有菜单键盘和定位；部署只是演示。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/010.html)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)；[DropdownPanel](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/dropdown-panel.tsx)；[MenuItem](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/menu-item.tsx)。

### 011 扇形快捷操作

- 现行映射：菜单 → DropdownPanel。
- 建议展示入口：菜单与导航；能力归属：菜单与导航；完整示例：菜单与导航。
- 判断依据：扇形只是菜单布局，功能是一组可选命令；同归菜单，有独立的展开和焦点协议。
- 接入边界：独立能力候选；候选 RadialMenu
- 关联入口：按钮与链接。
- 待解决：先验证小屏、键盘和边界可达性，不因好看默认用于常规后台。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/011.html)；[IconButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-button.tsx)；[MenuItem](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/menu-item.tsx)。

### 012 书签丝带

- 现行映射：按钮与链接 → IconButton。
- 建议展示入口：按钮与链接；能力归属：按钮与链接；完整示例：按钮与链接。
- 判断依据：收藏按钮为受控 pressed 状态，丝带与计数动画不改变入口类别。
- 接入边界：扩展现有组件
- 关联入口：卡片。
- 待解决：收藏数量由业务提供；状态不得仅靠颜色表达。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/012.html)；[IconButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-button.tsx)。

### 013 弹性开关

- 现行映射：表单与输入 → Toggle。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：二值设置输入，弹性拖拽是 Toggle 可选交互。
- 接入边界：扩展现有组件
- 待解决：拖拽、点击、键盘必须落入同一 checked 状态。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/013.html)；[Toggle](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/selection-control.tsx)。

### 014 待办清单

- 现行映射：待办清单 → Checklist。
- 建议展示入口：待办清单；能力归属：待办清单；完整示例：待办清单。
- 判断依据：主要对象是待办项集合及完成状态；正确归待办清单。
- 接入边界：扩展现有组件
- 关联入口：提示与反馈 / 加载与进度。
- 待解决：划线、退场与计数不能导致焦点丢失。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/014.html)；[Checklist](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/checklist.tsx)。

### 015 套餐选择卡

- 现行映射：卡片 → SurfaceCard。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：实际是互斥单选组，非通用卡片能力；套餐卡样式可做选择控件的组合示例。
- 接入边界：组合示例
- 关联入口：卡片。
- 待解决：不要因边框呈卡片形状归入卡片，也不要为一套套餐造业务 API。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/015.html)；[RadioButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/selection-control.tsx)；[RadioWithLabel](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/selection-control.tsx)；[SurfaceCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/surface-card.tsx)。

### 016 星级评价

- 现行映射：实用组件 → RatingStars。
- 建议展示入口：评论与评价；能力归属：评论与评价；完整示例：评论与评价。
- 判断依据：应与 ReviewItem 一起归评论与评价；现有实用组件入口是历史分类欠账。
- 接入边界：扩展现有组件
- 关联入口：表单与输入。
- 待解决：评分可编辑态与只读展示态分开；保留键盘及清晰可访问名称。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/016.html)；[RatingStars](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/rating-stars.tsx)。

### 018 滚动数量步进

- 现行映射：表单与输入 → TextField。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：核心是有上下限和步长的数值输入，不是数字动画或普通 TextField 装饰。
- 接入边界：独立能力候选；候选 NumberStepper
- 关联入口：卡片。
- 待解决：需明确受控值、非法输入、边界和禁用；价格计算只留案例。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/018.html)；[TextField](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/text-field.tsx)；[IconButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-button.tsx)。

### 019 兴趣多选

- 现行映射：表单与输入 → TextField。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：原型没有自由文本输入或搜索，是多选选项组；不应仅因多选就并列造 MultiSelect 文本框。
- 接入边界：组合示例
- 关联入口：徽章与标签。
- 待解决：多选上限和提示属于组级规则；chip 样式可作为复用变体。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/019.html)；[CheckboxControl](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/checkbox.tsx)；[CheckboxWithLabel](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/selection-control.tsx)。

### 021 日夜切换

- 现行映射：表单与输入 → Toggle。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：二值设置控件的主题切换示例；太阳月亮动画可作 Toggle 变体。
- 接入边界：扩展现有组件
- 待解决：主题存储和全局应用由宿主处理，不能绑死到 core。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/021.html)；[Toggle](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/selection-control.tsx)。

### 022 点赞心形绽放

- 现行映射：按钮与链接 → IconButton。
- 建议展示入口：按钮与链接；能力归属：按钮与链接；完整示例：按钮与链接。
- 判断依据：点赞是可切换操作，心形和数字反馈可复用原图标按钮。
- 接入边界：扩展现有组件
- 关联入口：评论与评价。
- 待解决：计数仍由业务控制，避免装饰粒子变成必要依赖。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/022.html)；[IconButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-button.tsx)。

### 023 通知设置展开

- 现行映射：表单与输入 → Toggle。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：这是设置表单，组合二值开关和互斥频率选项；不需新增通知设置组件。
- 接入边界：组合示例
- 关联入口：页签与切换。
- 待解决：展开区域需正确焦点顺序；全关操作不能复制成 Toggle 默认行为。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/023.html)；[Toggle](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/selection-control.tsx)；[ButtonGroup](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button-group.tsx)。

### 024 价格分布筛选

- 现行映射：筛选 → FilterPanel。
- 建议展示入口：筛选；能力归属：筛选；完整示例：筛选。
- 判断依据：完整能力是数值范围筛选加分布提示；图表是辅助，主类是筛选。
- 接入边界：独立能力候选；候选 RangeFilter
- 关联入口：表单与输入、图表。
- 待解决：受控区间与直方图分布契约分开；基础双柄滑块可另作表单交叉索引。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/024.html)；[FilterPanel](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/filter-panel.tsx)。

### 025 浮动标签输入

- 现行映射：表单与输入 → TextField。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：浮动标签是输入框标签布局变体；邀请校验与提交是演示流程。
- 接入边界：扩展现有组件
- 待解决：不能把邮箱规则或发送动作硬编码进所有 TextField。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/025.html)；[TextField](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/text-field.tsx)。

### 026 验证码输入

- 现行映射：表单与输入 → OtpInput。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：已有验证码输入入口，补充所需状态和转场即可。
- 接入边界：扩展现有组件
- 待解决：正式实现不得迁入原型固定验证码、假验证和固定倒计时。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/026.html)；[OtpInput](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/otp-input.tsx)。

### 027 顶栏搜索展开

- 现行映射：工具栏 → ToolbarSearchInput。
- 建议展示入口：页面顶栏；能力归属：菜单与导航；完整示例：页面顶栏。
- 判断依据：搜索控件与结果导航构成组合；完整案例属于顶栏搜索，不由 ToolbarSearchInput 所在文件决定全部归类。
- 接入边界：组合示例
- 关联入口：表单与输入、工具栏、筛选。
- 待解决：现有菜单建议扩展为菜单与导航；文档页标签变更待统一确认。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/027.html)；[ToolbarSearchInput](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/toolbar.tsx)；[CommandSearch](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/agent/command-search.tsx)。

### 028 自动伸展评论框

- 现行映射：评论与评价 → CommentItem。
- 建议展示入口：评论与评价；能力归属：表单与输入；完整示例：评论与评价。
- 判断依据：可复用输入能力应指向 TextArea（已有 autoGrow）；评论线程和发帖结果留评论案例。
- 接入边界：组合示例
- 关联入口：聊天。
- 待解决：CommentItem 是评论展示，不能承担输入 API；避免重复实现自动高度。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/028.html)；[TextArea](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/text-area.tsx)；[CommentItem](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/comment-item.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 029 标签输入

- 现行映射：表单与输入 → TextField。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：TextField 已支持 tags/onRemoveTag，优先补齐标签提交与键盘约定；标签建议和业务上限留案例。
- 接入边界：扩展现有组件
- 关联入口：徽章与标签。
- 待解决：另造 TagInput 前需证明现有 API 无法表达；重复、退格选中和输入法行为需验收。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/029.html)；[TextField](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/text-field.tsx)；[FieldTag](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/field-utils.tsx)。

### 030 日期区间日历

- 现行映射：日历与日程 → Datepicker。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：这是一个返回日期区间的表单输入；Datepicker 已有 mode=range 且已在表单文档，不因弹出的月历移到日程类。
- 接入边界：扩展现有组件
- 关联入口：日历与日程。
- 待解决：日历比例和范围反馈需复核；不能用只接受单日期的 CalendarCard 替代。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/030.html)；[Datepicker](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/datepicker.tsx)。

### 031 自定义选择器

- 现行映射：表单与输入 → SelectOption。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：受控单选输入，选项附加图标和说明可由现有 SelectOption 扩展。
- 接入边界：扩展现有组件
- 待解决：国家语言和时区映射不内置；保留键盘搜索与可访问名称。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/031.html)；[SelectOption](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/select-option.tsx)。

### 032 拖拽上传

- 现行映射：表单与输入 → MediaUpload。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：是文件选择及上传队列；FileUpload/FileCard 已有上传、错误和重试语义，不能只因拖拽区映射 MediaUpload。
- 接入边界：扩展现有组件
- 关联入口：文件展示、提示与反馈 / 加载与进度。
- 待解决：上传进度与网络请求归宿主；原型假进度、假失败留演示。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/032.html)；[FileUpload](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/file-upload.tsx)；[FileCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/file-upload.tsx)；[MediaUpload](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/media-upload.tsx)。

### 033 标题内联编辑

- 现行映射：表单与输入 → TextField。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：页面顶栏。
- 判断依据：内联编辑涉及阅读态/编辑态及提交取消，不等于普通 TextField 的视觉变体；标题场景放页头案例。
- 接入边界：独立能力候选；候选 InlineEdit
- 关联入口：列表、数据表格。
- 待解决：先抽受控值、草稿、提交和取消边界，再决定独立入口；不得提交空标题。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/033.html)；[TextField](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/text-field.tsx)；[IconButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-button.tsx)。

### 036 密码强度

- 现行映射：表单与输入 → TextField。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：密码输入和可见按钮可由 TextField 组合；强度规则及逐条反馈留示例，不能内置成通用输入框。
- 接入边界：组合示例
- 关联入口：提示与反馈 / 加载与进度。
- 待解决：原型长度/字符组合只是演示规则，不应宣称安全强度结论。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/036.html)；[TextField](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/text-field.tsx)；[Checklist](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/checklist.tsx)。

### 037 账号切换

- 现行映射：菜单 → DropdownPanel。
- 建议展示入口：菜单与导航；能力归属：菜单与导航；完整示例：菜单与导航。
- 判断依据：菜单对象是工作区和账号，保留通用菜单入口；与 AppLayout 已有工作区切换能力先去重。
- 接入边界：组合示例
- 关联入口：列表、页面顶栏。
- 待解决：不能只看 DropdownPanel 容器签名就宣称覆盖身份切换与权限。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/037.html)；[AppLayout](/Users/hesong/Documents/gihub_space/forge/core/src/components/layouts/app-layout.tsx)；[ProfileCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/profile-card.tsx)；[DropdownPanel](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/dropdown-panel.tsx)；[MenuItem](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/menu-item.tsx)。

### 038 右键菜单

- 现行映射：菜单 → DropdownPanel。
- 建议展示入口：菜单与导航；能力归属：菜单与导航；完整示例：列表。
- 判断依据：独立能力是上下文菜单定位、子菜单和键盘；完整演示以文件列表操作为主。
- 接入边界：独立能力候选；候选 ContextMenu
- 关联入口：文件展示。
- 待解决：右键、长按和三点触发一致，边界定位及焦点返回必验。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/038.html)；[DropdownPanel](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/dropdown-panel.tsx)；[MenuItem](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/menu-item.tsx)；[KebabMenu](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/kebab-menu.tsx)。

### 039 滑动选中标签

- 现行映射：页签与切换 → LiquidTabs。
- 建议展示入口：页签与切换；能力归属：页签与切换；完整示例：页签与切换。
- 判断依据：互斥页签控制内容面板，与现有页签能力一致。
- 接入边界：扩展现有组件
- 关联入口：列表。
- 待解决：音乐列表只是数据；区分 tabpanel 切换与过滤结果。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/039.html)；[LiquidTabs](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/liquid-tabs.tsx)；[TabBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/tab-bar.tsx)。

### 040 侧栏伸缩

- 现行映射：菜单 → SidebarMenu。
- 建议展示入口：菜单与导航；能力归属：菜单与导航；完整示例：菜单与导航。
- 判断依据：主能力是侧栏导航及收窄模式；既有 SidebarMenu 与 AppLayout 都要检查，避免只扩其中一个。
- 接入边界：扩展现有组件
- 关联入口：布局与容器、页面顶栏。
- 待解决：真实路由和当前页判定由既有规则承接；演示标题替换不是导航验收。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/040.html)；[SidebarMenu](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/sidebar-menu.tsx)；[AppLayout](/Users/hesong/Documents/gihub_space/forge/core/src/components/layouts/app-layout.tsx)。

### 041 底部导航凹槽

- 现行映射：菜单 → SidebarMenu。
- 建议展示入口：菜单与导航；能力归属：菜单与导航；完整示例：菜单与导航。
- 判断依据：这是移动端主导航，不能当 SidebarMenu 的造型变体；与菜单同属导航。
- 接入边界：独立能力候选；候选 BottomNavigation
- 关联入口：页签与切换。
- 待解决：如果实际切页面需链接和 aria-current，原型 tab 语义不能照搬。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/041.html)；[MenuItem](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/menu-item.tsx)；[IconButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-button.tsx)。

### 042 分步向导

- 现行映射：分页与步骤 → Stepper。
- 建议展示入口：分页与步骤；能力归属：分页与步骤；完整示例：表单与输入。
- 判断依据：进度指示能力归步骤；完整原型是跨步骤表单，不应把表单内容和流程状态塞入 Stepper。
- 接入边界：组合示例
- 关联入口：分页与步骤。
- 待解决：Stepper 当前展示能力与步骤校验/返回/异步提交分开；业务发邀请不内置。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/042.html)；[Stepper](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/stepper.tsx)；[TextField](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/text-field.tsx)；[SelectOption](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/select-option.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 043 分页伸缩

- 现行映射：分页与步骤 → Pagination。
- 建议展示入口：分页与步骤；能力归属：分页与步骤；完整示例：分页与步骤。
- 判断依据：分页是导航；指示器形变归现有 Pagination 的可选表现。
- 接入边界：扩展现有组件
- 关联入口：列表、数据表格。
- 待解决：页码受控、首尾禁用和加载内容由宿主处理。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/043.html)；[Pagination](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/pagination.tsx)。

### 044 问答折叠

- 现行映射：确认弹窗 → Accordion。
- 建议展示入口：布局与容器；能力归属：布局与容器 / Accordion；完整示例：布局与容器 / 折叠问答。
- 判断依据：核心是原位披露内容，不是弹层，更不是确认。当前放确认弹窗是明确错误；需要给 Accordion 正式内容展示入口。
- 接入边界：扩展现有组件
- 汇总校准：将内容展示缺口收敛到扩展后的布局与容器，避免额外建立内容展示类。
- 关联入口：列表。
- 待解决：已有 Accordion 目前主要藏在交互动效页；建议归类提案而非强行塞入卡片。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/044.html)；[Accordion](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/accordion.tsx)。

### 045 菜单由按钮展开

- 现行映射：菜单 → DropdownPanel。
- 建议展示入口：菜单与导航；能力归属：菜单与导航；完整示例：菜单与导航。
- 判断依据：完整原型是覆盖式站点导航，打开源动画可复用菜单机制；不是 DropdownPanel 自身高度改变那么简单。
- 接入边界：组合示例
- 关联入口：页面顶栏。
- 待解决：站点内容、品牌和路由留案例；先解决展开后焦点与 Escape 返回。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/045.html)；[IconTrigger](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-trigger.tsx)；[MenuItem](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/menu-item.tsx)。

### 046 命令面板

- 现行映射：智能体 → CommandSearch。
- 建议展示入口：菜单与导航；能力归属：菜单与导航；完整示例：菜单与导航。
- 判断依据：数据含最近文件、主题切换和邀请命令，是通用命令面板，不具备专属智能体任务语义。
- 接入边界：扩展现有组件
- 关联入口：智能体、筛选、工具栏。
- 待解决：建议菜单类扩为菜单与导航；保留智能体交叉示例，避免复制 CommandSearch。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/046.html)；[CommandSearch](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/agent/command-search.tsx)。

### 047 时间区间切换

- 现行映射：页签与切换 → TabBar。
- 建议展示入口：页签与切换；能力归属：页签与切换；完整示例：图表。
- 判断依据：原型是 radiogroup 式分段控制器，已有 ButtonGroup 比 TabBar 更贴切；完整指标与曲线案例归图表。
- 接入边界：扩展现有组件
- 关联入口：筛选、卡片。
- 待解决：按钮组只处理选项和值，收入指标和曲线重算留案例。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/047.html)；[ButtonGroup](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button-group.tsx)。

### 048 滑动联动标签

- 现行映射：页签与切换 → TabBar。
- 建议展示入口：页签与切换；能力归属：页签与切换；完整示例：页签与切换。
- 判断依据：核心是页签与内容位置双向同步；优先现有页签内容组合，不新增滑动标签 API 家族。
- 接入边界：扩展现有组件
- 关联入口：列表。
- 待解决：仅可见面板可聚焦；滑动与点击状态不得分叉。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/048.html)；[TabBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/tab-bar.tsx)；[LiquidTabs](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/liquid-tabs.tsx)。

### 049 层叠内容卡

- 现行映射：卡片 → SurfaceCard。
- 建议展示入口：卡片；能力归属：卡片；完整示例：卡片。
- 判断依据：有明确的内容摘要容器，分层展开可作为内容卡表现或案例；没有证明需独立 StackedCards 数据结构。
- 接入边界：扩展现有组件
- 关联入口：按钮与链接。
- 待解决：收藏与阅读由回调承接；视觉层数不应成为新公共组件的理由。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/049.html)；[SurfaceCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/surface-card.tsx)；[IconButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-button.tsx)。

### 050 光照倾斜卡

- 现行映射：卡片 → SurfaceCard。
- 建议展示入口：卡片；能力归属：卡片；完整示例：卡片。
- 判断依据：光照和倾斜只改变现有内容卡响应，优先复用卡片变体或内部动效。
- 接入边界：扩展现有组件
- 关联入口：按钮与链接。
- 待解决：不要新增只包一层 SurfaceCard 的 TiltCard；标记已读数据属于宿主。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/050.html)；[SurfaceCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/surface-card.tsx)；[IconButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-button.tsx)。

### 053 可拖拽卡片堆

- 现行映射：卡片 → SurfaceCard。
- 建议展示入口：卡片；能力归属：卡片；完整示例：卡片。
- 判断依据：卡片堆含顺序、手势判定和撤销历史，超出装饰变体，可评估独立堆栈交互容器。
- 接入边界：独立能力候选；候选 CardStack
- 关联入口：列表。
- 待解决：须有按钮替代拖拽；业务保存与撤销结果由宿主控制。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/053.html)；[SurfaceCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/surface-card.tsx)；[IconButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-button.tsx)。

### 054 关注个人卡

- 现行映射：卡片 → SurfaceCard。
- 建议展示入口：卡片；能力归属：卡片；完整示例：卡片。
- 判断依据：用户任务是资料摘要与关注，适合完整资料卡案例；不是仅靠 SurfaceCard 就等于能力覆盖。
- 接入边界：组合示例
- 关联入口：列表、评论与评价。
- 待解决：现有 ProfileCard 是紧凑身份入口，不能不核对 API 就扩大为公共个人主页。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/054.html)；[Avatar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/avatar.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)；[StatCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/stat-card.tsx)；[SurfaceCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/surface-card.tsx)。

### 056 月年计费切换

- 现行映射：表单与输入 → Toggle。
- 建议展示入口：表单与输入；能力归属：页签与切换；完整示例：表单与输入。
- 判断依据：可复用周期选择属于分段控制器，完整套餐选择属于表单；原型有两个明确选项，不能因二选一直接当 Toggle。
- 接入边界：组合示例
- 关联入口：卡片。
- 待解决：价格、优惠和订阅动作留案例；底层数字动画不决定归属。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/056.html)；[ButtonGroup](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button-group.tsx)；[RadioButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/selection-control.tsx)；[TextField](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/text-field.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 057 头像评价轮播

- 现行映射：卡片 → AvatarGroup。
- 建议展示入口：评论与评价；能力归属：评论与评价；完整示例：评论与评价。
- 判断依据：核心内容是评价，头像是轮播控制；既非 AvatarGroup 扩展，也不能因外框为卡片放卡片分类。
- 接入边界：组合示例
- 关联入口：卡片。
- 待解决：自动轮播暂停、键盘与手势需完整保留；若提炼 Carousel，应先跨内容验证复用需求。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/057.html)；[ReviewItem](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/review-item.tsx)；[Avatar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/avatar.tsx)；[IconButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-button.tsx)。

### 058 阅读进度卡

- 现行映射：进度 → ProgressBar。
- 建议展示入口：提示与反馈 → 加载与进度；能力归属：提示与反馈 / 加载与进度；完整示例：内容展示。
- 判断依据：可复用滚动进度归进度；完整 demo 是文章阅读，不应误当成进度条产品 API。
- 接入边界：组合示例
- 关联入口：菜单与导航、卡片。
- 待解决：目录跟随是导航能力；内容展示入口是待确认分类提案。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/058.html)；[ProgressBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/progress-bar.tsx)；[ButtonGroup](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button-group.tsx)；[SurfaceCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/surface-card.tsx)。

### 059 活动报名卡

- 现行映射：卡片 → EventCard。
- 建议展示入口：日历与日程；能力归属：日历与日程；完整示例：日历与日程。
- 判断依据：活动时间、参与和日历是主语义；EventCard 已在日历与日程文档，原映射卡片需改。
- 接入边界：组合示例
- 关联入口：卡片、表单与输入。
- 待解决：RSVP 容量、报名及日历写入由宿主执行；不把模拟成功等同真实报名。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/059.html)；[EventCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/event-card.tsx)；[ButtonGroup](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button-group.tsx)；[AvatarGroup](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/avatar.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 061 缩略图展开

- 现行映射：实用组件 → SurfaceCard。
- 建议展示入口：文件展示；能力归属：文件展示 / 图片预览；完整示例：文件展示 / 图片浏览（暂缓）。
- 判断依据：这是媒体内容浏览；源映射 SurfaceCard 完全不包含缩略图集合和预览行为，现有 ImageGrid 才应先对照。
- 接入边界：暂缓评估；候选 ImagePreview
- 汇总校准：图片预览按文件内容查找；是否符合此前媒体删减范围仍待确认，暂不迁移。
- 关联入口：实用组件、文件展示。
- 待解决：用户删除的是媒体与系统整类，保留的 061 是否仍要迁移应显式登记；弹层焦点、缩放和边界尚需审核。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/061.html)；[ImageGrid](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/image-grid.tsx)。

### 062 登录反馈

- 现行映射：表单与输入 → TextField。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：核心任务是身份表单提交，成功欢迎页和抖动仅是该任务的状态；不是通用 TextField 的整个新变体。
- 接入边界：保留密码显隐、Caps Lock 提示、提交中/失败/成功转场；登录结果由外部回调控制。
- 关联入口：提示与反馈、按钮与链接。
- 待解决：原型硬编码密码 lumen2026 和重试次数；不得作为 core 认证逻辑。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/062.html)；[TextField](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/text-field.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 063 逐题注册

- 现行映射：表单与输入 → TextField。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：完整注册是表单流程；页码点不能替代全部流程，也不为三个硬编码问题新增业务组件。
- 接入边界：分步表单示例拥有步骤与校验；字段和进度分别复用现有组件。
- 关联入口：分页与步骤、提示与反馈。
- 待解决：密码评分和账号规则为示例；不得假装已发送验证邮件。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/063.html)；[TextField](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/text-field.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)；[Stepper](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/stepper.tsx)。

### 066 社交登录按钮

- 现行映射：按钮与链接 → Button。
- 建议展示入口：按钮与链接；能力归属：按钮与链接；完整示例：表单与输入。
- 判断依据：用户找单个登录触发器会看按钮，完整登录方式选择示例应在表单。不能因成功后变为账号行而转入列表。
- 接入边界：第三方按钮的 pending/success 反馈融入通用按钮状态；供应商列表与账号文字留在案例。
- 关联入口：提示与反馈。
- 待解决：品牌标识应保留真实品牌；定时器模拟 OAuth 不属于 core。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/066.html)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 067 锁定倒计时

- 现行映射：表单与输入 → TextField。
- 建议展示入口：提示与反馈 → 空态与结果；能力归属：提示与反馈；完整示例：表单与输入。
- 判断依据：这是访问受限的恢复状态，不是 TextField，也不是表单控件自己的安全逻辑。
- 接入边界：倒计时显示可复用通用 Countdown 候选；锁定状态与解锁条件由业务传入。
- 关联入口：提示与反馈。
- 待解决：时间到只允许 UI 更新，真实解锁必须来自服务端；原型锁定 15 秒为演示。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/067.html)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)；[AnimatedNumber](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/animated-number.tsx)。

### 069 头像裁剪

- 现行映射：表单与输入 → MediaUpload / Avatar。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：用户修改头像会从上传/表单寻找；裁剪算法与文件输出不能塞进只负责展示的 Avatar。
- 接入边界：头像裁剪作为上传后的图像编辑子能力；可独立受控 Cropper，再由头像上传组合调用。
- 关联入口：文件展示。
- 待解决：仅对 SVG 假头像应用 transform，尚无真实图像坐标裁剪、文件输出、EXIF 校正。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/069.html)；[MediaUpload](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/media-upload.tsx)；[Avatar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/avatar.tsx)。

### 070 堆叠通知

- 现行映射：确认弹窗 → ToastProvider。
- 建议展示入口：提示与反馈 → 通知消息；能力归属：提示与反馈；完整示例：提示与反馈。
- 判断依据：Toast 是非模态反馈，不需要用户先确认操作；不能归确认弹窗。
- 接入边界：为 Toast 扩充堆叠/展开、状态、操作、滑动关闭；保留一个通知服务入口。
- 关联入口：列表。
- 待解决：现 core ToastOptions 仅 title/description/duration，缺状态、操作、更新。；叠放背景项不可聚焦，展开/暂停计时和屏幕阅读播报需保留。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/070.html)；[ToastProvider](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/toast.tsx)；[useToast](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/toast.tsx)。

### 071 滑动删除与撤销

- 现行映射：列表 → ListItem。
- 建议展示入口：列表；能力归属：列表；完整示例：列表。
- 判断依据：被操作对象是列表项；底部撤销提示是配套反馈。
- 接入边界：条目滑动操作可做 ListItem 可选交互/包装；删除队列与撤销事务在案例控制。
- 关联入口：提示与反馈、按钮与链接。
- 待解决：现 ListItem 为展示行；保持触摸纵向滚动、键盘等价删除及撤销后焦点；删除事务不能由装饰动画决定。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/071.html)；[ListItem](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/list-item.tsx)；[ToastProvider](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/toast.tsx)。

### 072 内联提示收拢

- 现行映射：提示气泡 → Tooltip。
- 建议展示入口：提示与反馈 → 行内提示与公告；能力归属：提示与反馈；完整示例：提示与反馈。
- 判断依据：它始终在页面文档流里呈现，有交互详情及关闭；Tooltip 依附触发器且短暂出现，语义不同。
- 接入边界：新增通用 Alert/InlineNotice，支持 tone、description、details、dismiss；告警中心列表留案例。
- 关联入口：列表、提示与反馈 / 提示气泡。
- 待解决：不可沿用 Tooltip 的 hover 生命周期；alert/status 的播报强度要按严重度确定。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/072.html)。

### 073 公告滚动

- 现行映射：列表 → ListGroup。
- 建议展示入口：提示与反馈 → 行内提示与公告；能力归属：提示与反馈；完整示例：提示与反馈。
- 判断依据：呈现多条数据不等于列表，用户任务是接收全局公告，位置和生命周期均不同。
- 接入边界：公告条可复用 Banner/InlineNotice；自动轮播是可选行为，不进入 ListGroup。
- 关联入口：页面顶栏。
- 待解决：自动轮播须可暂停并尊重 reduced motion；当前广告样式品牌与页面骨架不进入组件。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/073.html)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 074 通知铃菜单

- 现行映射：菜单 → NotificationItem。
- 建议展示入口：列表；能力归属：列表；完整示例：列表。
- 判断依据：核心对象是通知列表，铃铛是打开方式。菜单应该服务于命令选择，通知读取是信息浏览。
- 接入边界：通知中心示例复用通知条目、页签与弹层；不把通知数据管理塞进菜单。
- 关联入口：提示与反馈、菜单与导航、页面顶栏。
- 待解决：聚焦/外部点击/逃逸关闭、未读计数与已读回调需真实受控；不能把定时新增视为消息订阅。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/074.html)；[NotificationItem](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/notification-item.tsx)；[NotificationBadge](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/badge.tsx)；[TabBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/tab-bar.tsx)；[DropdownPanel](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/dropdown-panel.tsx)。

### 075 上传进度面板

- 现行映射：表单与输入 → MediaUpload。
- 建议展示入口：表单与输入；能力归属：表单与输入；完整示例：表单与输入。
- 判断依据：主要任务是上传文件，不能看到 progressbar 就归进度；进度仅是每个上传任务的状态。
- 接入边界：优先扩展 FileUpload/FileCard 的受控进度、取消、重试；与 032/F01 共用文件状态模型，完整上传流程留案例。
- 汇总校准：补全已存在的 FileUpload/FileCard；不因原计划只列 MediaUpload 又新增平行队列。
- 关联入口：文件展示、提示与反馈 / 加载与进度、提示与反馈。
- 待解决：现 MediaUpload 以图片 src 为模型，无法承载文件名、大小、重试；原型使用固定速率模拟任务。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/075.html)；[MediaUpload](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/media-upload.tsx)；[ProgressBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/progress-bar.tsx)；[FileUpload](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/file-upload.tsx)；[FileCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/file-upload.tsx)。

### 076 跟随工具提示

- 现行映射：提示气泡 → Tooltip。
- 建议展示入口：提示与反馈 → 提示气泡；能力归属：提示与反馈 / 提示气泡；完整示例：工具栏。
- 判断依据：基础能力是工具提示，完整编辑器工具栏是使用场景；分开文档归属即可。
- 接入边界：TooltipGroup 保持共享延迟；补定位滑动与快捷键内容能力。
- 关联入口：按钮与链接。
- 待解决：现 TooltipGroup 已有 warmWindow；避免重复 Provider。动态内容测量、视口边界、focus 和 Escape 必须保留。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/076.html)；[Tooltip](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/tooltip.tsx)；[TooltipGroup](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/tooltip.tsx)。

### 077 表情反应面板

- 现行映射：聊天 → ChatBubble。
- 建议展示入口：聊天；能力归属：聊天；完整示例：聊天。
- 判断依据：用户找消息回应会在聊天；表情弹层只是选择方式，不应按菜单或图标分类。
- 接入边界：ReactionPicker/ReactionList 是消息附属能力，保持可被 CommentItem 复用。
- 关联入口：评论与评价、菜单与导航。
- 待解决：默认表情可由业务传入；emoji 是内容不需要全部替 Solar；服务端计数与本人的 selected 需分开。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/077.html)；[ChatBubble](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/chat-bubble.tsx)。

### 078 滑动回复

- 现行映射：聊天 → ChatBubble。
- 建议展示入口：聊天；能力归属：聊天；完整示例：聊天。
- 判断依据：属于消息交互变体，无需另外一套聊天输入框和 SwipeToReply 业务实体。
- 接入边界：ChatBubble 增强可选 reply 触发；ChatInputBar 复用引用区域插槽或受控 reply context。
- 关联入口：按钮与链接。
- 待解决：手势不应抢文本选择/滚动；pointercancel 不能确认回复；IME 回车行为必须保留。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/078.html)；[ChatBubble](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/chat-bubble.tsx)；[ChatInputBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/chat-input-bar.tsx)。

### 079 骨架内容显现

- 现行映射：进度 → ProgressBar。
- 建议展示入口：提示与反馈 → 加载与进度；能力归属：提示与反馈；完整示例：提示与反馈。
- 判断依据：骨架屏不展示任务完成比例，也不属于 ProgressBar。
- 接入边界：Skeleton/LoadingContent 为内容占位能力，支持形状与加载态；社交帖子只作示例。
- 关联入口：卡片、列表。
- 待解决：占位尺寸必须匹配最终内容，aria-busy 与内容隐藏正确，避免循环动画破坏 reduced motion。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/079.html)。

### 080 轨道同步指示

- 现行映射：进度 → ProgressBar。
- 建议展示入口：提示与反馈 → 加载与进度；能力归属：提示与反馈；完整示例：提示与反馈。
- 判断依据：轨道是等待/同步状态插画，主要不是数值进度控件；不同阶段和取消动作属于任务状态。
- 接入边界：LoadingState/TaskStatus 的可选视觉可复用；轨道插画仅示例，实际数值进度另用 ProgressBar。
- 关联入口：提示与反馈 / 加载与进度、智能体。
- 待解决：模拟 340 个文件和固定 5.2 秒过程不得进入组件业务逻辑；循环必须卸载停止。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/080.html)；[ProgressBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/progress-bar.tsx)。

### 081 环形完成反馈

- 现行映射：进度 → ProgressBar。
- 建议展示入口：按钮与链接；能力归属：按钮与链接；完整示例：提示与反馈。
- 判断依据：完整 demo 实际是支付流程，不能仅按环形归 ProgressBar，也不能把回执结构硬塞按钮。
- 接入边界：按钮 loading/success 转场可复用；环形进度为基础能力候选；支付回执留案例。
- 关联入口：提示与反馈 / 加载与进度、卡片。
- 待解决：付款成功必须来自受控结果；定时动画不得断言支付成功；需要错误/超时/重复提交保护。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/081.html)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)；[ProgressBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/progress-bar.tsx)。

### 083 队列进度转换

- 现行映射：进度 → ProgressBar。
- 建议展示入口：提示与反馈 → 加载与进度；能力归属：提示与反馈 / 加载与进度；完整示例：提示与反馈 / 加载与进度。
- 判断依据：同一进度指示器从未知到已知工作量切换是通用进度能力；部署是演示业务。
- 接入边界：ProgressBar 可扩 determinate/indeterminate；部署日志和重试按钮留例。
- 关联入口：历史记录、提示与反馈、智能体。
- 待解决：未知进度不设 aria-valuenow；百分比需真实工作量，日志不应由进度条产生。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/083.html)；[ProgressBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/progress-bar.tsx)。

### 084 语音响应圆点

- 现行映射：进度 → ProgressBar。
- 建议展示入口：聊天；能力归属：聊天；完整示例：聊天。
- 判断依据：圆点变化表示语音状态和音量，不表示完成百分比，不能归进度。
- 接入边界：VoiceActivity 受控显示音量与会话状态；录音触发器复用按钮/输入框插槽。
- 关联入口：智能体、提示与反馈。
- 待解决：原型音量是正弦波且文本预设；不得宣称真实录音；必须处理取消、权限、静音。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/084.html)；[ChatInputBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/chat-input-bar.tsx)。

### 085 下拉刷新

- 现行映射：进度 → ProgressBar。
- 建议展示入口：列表；能力归属：列表；完整示例：列表。
- 判断依据：用户目标是刷新列表，转圈只是该动作反馈。
- 接入边界：PullToRefresh 是滚动容器交互包装，刷新中指示复用状态反馈；不并入 ProgressBar。
- 关联入口：提示与反馈。
- 待解决：仅在 scrollTop=0 开始手势，方向阈值和原生滚动互斥；保留刷新按钮/键盘入口。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/085.html)；[ListGroup](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/list-group.tsx)；[ListItem](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/list-item.tsx)。

### 086 AI 流式回答

- 现行映射：智能体 → StreamingAnswer。
- 建议展示入口：智能体；能力归属：智能体；完整示例：智能体。
- 判断依据：流式 AI 输出是已有智能体专用能力；应保留回答结构与停止控制，而非只抽取打字动画。
- 接入边界：渲染增量内容并平滑出现可并 StreamingAnswer；发送/停止状态复用 ChatInputBar。
- 关联入口：聊天、提示与反馈。
- 待解决：文本/Markdown 安全渲染、真实增量流、停止幂等、阅读器播报分块；样例定时 token 不属传输层。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/086.html)；[StreamingAnswer](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/agent/streaming-answer.tsx)；[ChatInputBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/chat-input-bar.tsx)。

### 087 配送步骤

- 现行映射：进度 → Stepper。
- 建议展示入口：分页与步骤；能力归属：分页与步骤；完整示例：分页与步骤。
- 判断依据：离散有语义的阶段属于步骤；连续比例才属于 ProgressBar。现 Stepper 只是无标签圆点，不能称直接复用完成。
- 接入边界：步骤条/Steps 应有节点标签和状态；先核对是否扩展 Stepper 或并列步骤条，物流图标与日志留例。
- 关联入口：历史记录、提示与反馈 / 加载与进度。
- 待解决：避免打破现圆点样式；物流状态由业务传入；若展示重点转为详细时间线，则交叉历史记录。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/087.html)；[Stepper](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/stepper.tsx)；[HistoryGrouped](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/history-grouped.tsx)。

### 088 资料夹空态

- 现行映射：卡片 → SurfaceCard。
- 建议展示入口：提示与反馈 → 空态与结果；能力归属：提示与反馈；完整示例：列表。
- 判断依据：空态能力属于反馈与状态；完整 demo 是项目列表的首次使用流程。卡片只是容器，不能因有边框而归卡片。
- 接入边界：EmptyState 提供空内容说明/动作与 folder illustration 变体；模板业务、列表和转换流程留项目列表案例。
- 关联入口：卡片、表单与输入。
- 待解决：已有本地 EmptyState 接口把可恢复错误也混入默认语义，需明确 empty 与 error；原版纸张飞入列表动效不得简化掉。
- 本地状态：已有部分本地实现；本轮不等于验收、完成或发布。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/088.html)；[EmptyState](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/empty-state.tsx)；[ListItem](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/list-item.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 089 404 纠错

- 现行映射：卡片 → SurfaceCard。
- 建议展示入口：提示与反馈 → 空态与结果；能力归属：提示与反馈；完整示例：提示与反馈。
- 判断依据：404 不属于无数据 EmptyState 的数据语义；不能仅因大圆角容器就归卡片。
- 接入边界：404 是页面结果/异常状态，可共享标题/动作排版；纠错匹配与真实路由留案例/业务。
- 关联入口：菜单与导航。
- 待解决：原型没有真实导航，改数字到 200 不能代表页面已找到；匹配结果由业务提供。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/089.html)；[EmptyState](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/empty-state.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 090 可重试错误卡

- 现行映射：卡片 → SurfaceCard。
- 建议展示入口：提示与反馈 → 空态与结果；能力归属：提示与反馈；完整示例：卡片。
- 判断依据：主要组件是错误结果反馈；完整场景在统计卡内恢复数据。不能把网络重试策略塞进 EmptyState。
- 接入边界：Result/ErrorState 与 EmptyState 共用必要基础排版；重试状态受控，示例演示统计卡错误恢复。
- 关联入口：图表、提示与反馈 / 加载与进度。
- 待解决：自动退避、次数、真实错误由业务控制；原型第三次固定成功，不能作为通用组件规则。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/090.html)；[EmptyState](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/empty-state.tsx)；[BarChart](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/bar-chart.tsx)；[StatCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/stat-card.tsx)。

### 091 离线消息队列

- 现行映射：聊天 → ChatInputBar。
- 建议展示入口：聊天；能力归属：聊天；完整示例：聊天。
- 判断依据：操作对象是消息流，不是输入框独立能力；ChatInputBar 不应负责离线持久化和消息传输。
- 接入边界：离线横幅复用反馈组件，消息 pending/queued/delivered 为 ChatBubble 展示状态；实际队列交业务。
- 关联入口：提示与反馈。
- 待解决：navigator.onLine 不能代表服务器可达；原型没有持久化/去重/确认，不可宣称可靠离线发送。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/091.html)；[ChatBubble](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/chat-bubble.tsx)；[ChatInputBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/chat-input-bar.tsx)。

### 092 筛选空态恢复

- 现行映射：筛选 → FilterPanel。
- 建议展示入口：筛选；能力归属：筛选；完整示例：筛选。
- 判断依据：用户任务是恢复搜索结果，因此主场景在筛选；底层空态跨页复用，不需要移动整个场景到反馈。
- 接入边界：无结果呈现复用 EmptyState；已选筛选与恢复建议数据由 FilterPanel/业务组合，不新增第四个 EmptyState。
- 关联入口：提示与反馈、列表。
- 待解决：实际搜索/纠错/去条件计数由调用方计算；不得把固定商品或启发式拼写逻辑放入 UI。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/092.html)；[FilterPanel](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/filter-panel.tsx)；[EmptyState](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/empty-state.tsx)。

### 093 完成庆祝

- 现行映射：确认弹窗 → ToastProvider。
- 建议展示入口：待办清单；能力归属：待办清单；完整示例：待办清单。
- 判断依据：触发任务是勾选清单，庆祝只是完成后结果；原版无 Toast，不应放确认弹窗。
- 接入边界：Checklist 完成状态及 celebration 可选效果复用；连续天数业务留案例。
- 关联入口：提示与反馈。
- 待解决：彩纸应默认适度、可关闭且 reduced motion 禁用；不能把完成天数写死。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/093.html)；[Checklist](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/checklist.tsx)；[ProgressBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/progress-bar.tsx)。

### 095 形态切换柱图

- 现行映射：图表 → BarChart。
- 建议展示入口：图表；能力归属：图表；完整示例：图表。
- 判断依据：图形及数据点探索是主任务，卡片仅载体；属于图表而不是所有带数据的卡片。
- 接入边界：柱图更新形态、active item/selection/键盘查看并 BarChart；周期及汇总头留图表示例。
- 关联入口：卡片。
- 待解决：现 BarChart 受 activeIndex 输入但无交互回调；需要稳定 key、数据长度改变、空数据/负数与真实轴刻度。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/095.html)；[BarChart](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/bar-chart.tsx)；[ChartTooltip](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-tooltip.tsx)；[TabBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/tab-bar.tsx)。

### 096 滑动股票折线

- 现行映射：图表 → SmoothLineChart。
- 建议展示入口：图表；能力归属：图表；完整示例：图表。
- 判断依据：核心是连续数据点检查，不能因金融标题或卡片外形独立为股票卡组件。
- 接入边界：折线 scrubbing、activeIndex 回调、关键事件与数据更新过渡并现图表；股票文案留案例。
- 关联入口：卡片。
- 待解决：现 SmoothLineChart 仅 activeIndex 输入；原型是假数据，触摸/键盘与不等长数据域必须处理。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/096.html)；[SmoothLineChart](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/smooth-line-chart.tsx)；[ChartTooltip](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-tooltip.tsx)。

### 097 重排环图

- 现行映射：图表 → DonutChart。
- 建议展示入口：图表；能力归属：图表；完整示例：图表。
- 判断依据：分段表示同一整体的组成，是标准环形图；不是目标完成进度环。
- 接入边界：交互图例、选中分段与重分配过渡并 DonutChart；消费业务留例。
- 关联入口：卡片。
- 待解决：现 DonutChart 为 conic-gradient 无独立可交互片段；须保留静态兼容，处理合计零/全隐藏，语义说明分母已变。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/097.html)；[DonutChart](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/donut-chart.tsx)。

### 098 实时数字滚动

- 现行映射：卡片 → StatCard。
- 建议展示入口：卡片；能力归属：卡片；完整示例：卡片。
- 判断依据：原版是数字、涨跌、迷你趋势线、指标切换、暂停组成的指标卡；不能把它等同于孤立 AnimatedNumber，也不属于进度。
- 接入边界：主文档称实时指标卡；数字列滚动为共享 AnimatedNumber，趋势线与卡片复用 LineChartStatCard/StatCard。
- 关联入口：图表。
- 待解决：当前本地仅 StatCard 值滚动的预览未覆盖原版趋势线、切换及暂停；LineChartStatCard value 目前 string，扩展需保留默认。
- 本地状态：已有部分本地实现；本轮不等于验收、完成或发布。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/098.html)；[StatCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/stat-card.tsx)；[LineChartStatCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/line-chart-stat-card.tsx)；[AnimatedNumber](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/animated-number.tsx)。

### 099 活动环

- 现行映射：图表 → 无直接对象。
- 建议展示入口：图表；能力归属：图表；完整示例：图表。
- 判断依据：三个同心环分别有独立分母，能超过 100%；与环形占比图、单任务进度都不同。
- 接入边界：目标环图/ActivityRing 接收多个 value/target，图例和日期选择组合。
- 关联入口：提示与反馈 / 加载与进度、卡片。
- 待解决：运动业务对 Forge 常见场景价值需复核，优先改通用多目标；不要为了原型新增过窄 API。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/099.html)。

### 100 翻页计时器

- 现行映射：实用组件 → 无直接对象。
- 建议展示入口：审核状态：实验室待评估；能力归属：计时与倒计时（家族待定）；完整示例：实验室 / 计时演示。
- 判断依据：它控制倒计时，既不选择日期也不表达任务完成比例，现有实用组件是可接受的具体入口。
- 接入边界：Countdown 是时间显示和控制能力；翻页动效为可选呈现；专注次数业务留案例。
- 汇总校准：计时器的常用性与正式家族未定，不延续实用组件兜底。
- 关联入口：日历与日程、提示与反馈。
- 待解决：相对 performance.now 适合单次专注，业务截止时间须受控；后台漂移、恢复、归零和 reduced motion。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/100.html)；[AnimatedNumber](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/animated-number.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 101 分栏工作区

- 现行映射：布局栅格 → Grid。
- 建议展示入口：布局与容器；能力归属：布局与容器；完整示例：布局与容器。
- 判断依据：这是空间分配交互；原版文档和海报是两个插槽示例，不是编辑器组件。
- 接入边界：SplitPane/ResizablePanel 作为布局容器并列，Grid 保持静态栅格。
- 关联入口：表单与输入。
- 待解决：当前 Grid 不具拖拽；需要最小宽度、响应式、RTL、键盘和 separator aria。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/101.html)；[Grid](/Users/hesong/Documents/gihub_space/forge/core/src/components/layouts/grid.tsx)。

### 102 嵌套文件树

- 现行映射：菜单 → 无直接对象。
- 建议展示入口：列表；能力归属：列表；完整示例：列表。
- 判断依据：原版选择的是数据实体文件，不发出命令也无路由导航，归层级列表更可找；在侧栏用时给菜单交叉索引。
- 接入边界：Tree/TreeView 是层级数据展示与选择；文件类型作为条目渲染器。
- 关联入口：文件展示、菜单与导航。
- 待解决：静态 id 会多实例冲突；缺标准 tree 键盘方向/roving tabindex，不能仅复制 button 嵌套。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/102.html)。

### 108 时区交集

- 现行映射：日历与日程 → FullCalendar。
- 建议展示入口：日历与日程；能力归属：日历与日程；完整示例：日历与日程。
- 判断依据：安排会议的时间选择任务；FullCalendar 月周日格并无跨时区带状比较能力，不应标记直接复用。
- 接入边界：时区时间轴只在出现复用需求时抽取；日期时区参数和工作时间规则由业务给定。
- 关联入口：筛选。
- 待解决：固定日期隐藏夏令时问题；地区名、工作时段和跨日必须真实按时区计算。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/108.html)。

### 109 可用时间涂选

- 现行映射：日历与日程 → FullCalendar。
- 建议展示入口：日历与日程；能力归属：日历与日程；完整示例：日历与日程。
- 判断依据：用户选的是日程可用区间，核心交互是批量时格选择；是日历的一种输入能力。
- 接入边界：AvailabilityPicker 专注受控时间段选择；可复用日历样式/token，避免硬扩 FullCalendar 的展示模型。
- 关联入口：表单与输入。
- 待解决：应传真实 dates/timezone/granularity 而非仅周几字符串；触摸涂抹与滚动、键盘成批选择和 clear。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/109.html)；[FullCalendar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/full-calendar.tsx)。

### 110 日程冲突修复

- 现行映射：日历与日程 → FullCalendar。
- 建议展示入口：日历与日程；能力归属：日历与日程；完整示例：日历与日程。
- 判断依据：用户任务是重排日程；突出重叠区是日历状态，不是独立通用错误卡。
- 接入边界：冲突/建议时间受控呈现；事件可移动时段能力与日历规划共同确定，不新增固定 ConflictRepair。
- 关联入口：提示与反馈。
- 待解决：现 CalendarEvent 仅 day/hour 没有 duration/start/end/变更回调，原版只在两个预设位置切换；真实冲突计算交业务。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/110.html)；[FullCalendar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/full-calendar.tsx)；[EventTag](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/event-tag.tsx)。

### 111 任务时长编辑

- 现行映射：日历与日程 → FullCalendar。
- 建议展示入口：日历与日程；能力归属：日历与日程；完整示例：日历与日程。
- 判断依据：原版是多行跨天排期，不是一个时长输入框；保留日程入口并与任务工作流交叉。
- 接入边界：任务时间轴/Timeline 或 Gantt 能力候选；任务条移动和 resize 是同一数据模型，不能只抽 DurationEditor。
- 关联入口：智能体、历史记录。
- 待解决：FullCalendar 当前事件模型无法表示跨天长度；需真实日期、约束、重排回调、依赖关系边界，避免不完整甘特组件。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/111.html)；[FullCalendar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/full-calendar.tsx)。

### 126 Markdown 编辑与预览

- 现行映射：智能体 → StreamingAnswer。
- 建议展示入口：实验室/cases 标签：内容与编辑；能力归属：内容与编辑 / Markdown 编辑预览；完整示例：内容与编辑 / 文档预览。
- 判断依据：实际只有 article 与 textarea 互斥切换，并不是双栏。StreamingAnswer 是只读 Markdown 渲染能力，不能据此把完整编辑器归入智能体。
- 接入边界：仅组合示例；渲染复用，编辑状态在案例层
- 关联入口：智能体回答、聊天。
- 待解决：名称与实际布局不符，应改为 Markdown 编辑预览；简易 Markdown 解析器不得迁入生产；复用受控渲染器；保留预览切换动效，不复制 DOM innerHTML 编辑状态
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/126.html)；[StreamingAnswer](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/agent/streaming-answer.tsx)；[TextField](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/text-field.tsx)。

### 127 变更片段审核

- 现行映射：智能体 → AgentDiffTable。
- 建议展示入口：实验室/cases 标签：内容与编辑；能力归属：内容与编辑 / 变更审核；完整示例：内容与编辑 / 代码审核。
- 判断依据：AgentDiffTable 的输入是 columns+cells 的表格行增删，不支持代码 hunk 决策。AgentCodeBlock 已支持 diff 行展示，决策层需要新增可选审核能力或组合层。
- 接入边界：与 F04 合并为变更审核能力；代码展示复用 AgentCodeBlock
- 关联入口：智能体生成结果、历史记录。
- 待解决：需定义受控 accepted/rejected/pending 与撤销；代码 diff 与普通文本 diff 共享决策，不强行共享渲染；当前 AgentCodeBlock 没有接受拒绝 API
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/127.html)；[AgentCodeBlock](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/agent/agent-code-block.tsx)。

### 128 查找替换

- 现行映射：智能体 → AgentCodeBlock。
- 建议展示入口：实验室/cases 标签：内容与编辑；能力归属：内容与编辑 / 查找替换；完整示例：内容与编辑 / 文档编辑。
- 判断依据：原型编辑的是普通段落字符串；AgentCodeBlock 是只读代码展示，没有编辑文档能力，名称相似不能作为合并证据。
- 接入边界：暂缓；优先做编辑器组合示例
- 关联入口：工具栏。
- 待解决：需要替换范围、大小写、撤销和输入法契约；当前仅 split/join 全量替换，不是通用文本编辑器
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/128.html)；[TextField](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/text-field.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 129 代码折叠

- 现行映射：智能体 → AgentCodeBlock。
- 建议展示入口：实验室/cases 标签：内容与编辑；能力归属：内容与编辑 / 代码展示；完整示例：内容与编辑 / 代码阅读。
- 判断依据：用户操作对象是代码块；AgentCodeBlock 已有行号、代码/diff 切换与复制。折叠是同一阅读能力的增强；组件目录叫 agent 不决定官网主分类。
- 接入边界：可选折叠能力合入现有代码展示组件
- 关联入口：智能体代码结果。
- 待解决：需要真实可折叠区间数据，不能迁移写死的两函数 DOM；明确折叠后复制、行号与 diff 的行为
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/129.html)；[AgentCodeBlock](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/agent/agent-code-block.tsx)。

### 140 选中文字格式

- 现行映射：实用组件 → 无直接对象。
- 建议展示入口：实验室/cases 标签：内容与编辑；能力归属：工具栏 / 文本格式工具栏；完整示例：内容与编辑 / 富文本编辑。
- 判断依据：控件本体是一组格式动作，主分类是工具栏；完整示例包含 contenteditable 选区与编辑状态，属于文档编辑。
- 接入边界：暂缓；工具栏外观可组合，编辑器集成单独评估
- 关联入口：表单与输入。
- 待解决：原型使用 document.execCommand，不能原样作为核心编辑引擎；选区保留、撤销、键盘与粘贴策略需定义
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/140.html)；[Toolbar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/toolbar.tsx)；[IconButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-button.tsx)。

### 146 JSON 树编辑

- 现行映射：实用组件 → AgentCodeBlock。
- 建议展示入口：实验室/cases 标签：内容与编辑；能力归属：内容与编辑 / 结构化数据编辑；完整示例：内容与编辑 / JSON 编辑。
- 判断依据：AgentCodeBlock 仅渲染字符串行，不管理 JSON 树和类型校验；原型是三个固定字段，尚不足以代表通用 JSON 编辑器。
- 接入边界：暂缓独立能力；不并入只读代码组件
- 关联入口：表单与输入。
- 待解决：递归数组/对象、null、错误值、键编辑与校验未实现；不以当前固定字段原型承诺 JsonTreeEditor API
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/146.html)；[TextField](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/text-field.tsx)；[Toggle](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/selection-control.tsx)。

### 149 冲突文本合并

- 现行映射：实用组件 → AgentDiffTable。
- 建议展示入口：实验室/cases 标签：内容与编辑；能力归属：内容与编辑 / 冲突解决；完整示例：内容与编辑 / 合并冲突。
- 判断依据：原型有多块二选一决策及取消选择，AgentDiffTable 的 include/exclude 表格行模型无法表达冲突组。
- 接入边界：暂缓；可与变更审核共享展示基础，但保留冲突语义
- 关联入口：历史记录、智能体变更审核。
- 待解决：冲突组必须先完整决策才能提交；文本二选一不等于三方合并算法；不能把未选择块过滤后当作已完成合并
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/149.html)；[AgentCodeBlock](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/agent/agent-code-block.tsx)。

### 151 贡献热力格

- 现行映射：图表 → ChartCard / ChartTooltip。
- 建议展示入口：图表；能力归属：图表 / 日历热力图；完整示例：图表 / 活动热力图。
- 判断依据：以颜色强度编码数值并按日期排列，是图表，日期只构成坐标；可和 161 共享热力绘制基础。
- 接入边界：独立图表类型，共享图表容器与提示
- 关联入口：日历与日程。
- 待解决：日期必须使用真实日历而非每月固定 28 天；补全键盘和屏幕阅读器数据访问
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/151.html)；[ChartCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-card.tsx)；[ChartTooltip](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-tooltip.tsx)。

### 154 能力雷达

- 现行映射：图表 → ChartCard / ChartTooltip。
- 建议展示入口：图表；能力归属：图表 / 雷达图；完整示例：图表 / 能力比较。
- 判断依据：核心是多维数值坐标和多序列比较，卡片只提供容器。
- 接入边界：独立图表类型
- 关联入口：卡片。
- 待解决：维度、数值域和序列需数据化；几何过渡与缺失值处理需验证
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/154.html)；[ChartCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-card.tsx)；[ChartTooltip](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-tooltip.tsx)。

### 157 层叠用量面积

- 现行映射：图表 → ChartCard / ChartTooltip。
- 建议展示入口：图表；能力归属：图表 / 堆叠面积图；完整示例：图表 / 用量分析。
- 判断依据：SmoothLineChart 已有 fillArea，但其填充均回到同一基线，不是堆叠计算；应先补堆叠域和基线计算再决定变体。
- 接入边界：在折线/面积图体系内评估堆叠变体，避免重复独立图表入口
- 关联入口：卡片。
- 待解决：不能直接把 fillArea 误认为已覆盖堆叠面积；原型路径和文案写死，需要真实序列与单位；隔离单序列时数值与总量关系应一致
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/157.html)；[SmoothLineChart](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/smooth-line-chart.tsx)；[ChartCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-card.tsx)；[ChartTooltip](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-tooltip.tsx)。

### 160 转化漏斗

- 现行映射：图表 → ChartCard / ChartTooltip。
- 建议展示入口：图表；能力归属：图表 / 漏斗图；完整示例：图表 / 转化分析。
- 判断依据：阶段宽度编码数量，交互解释流失，是图表而非步骤进度。
- 接入边界：独立图表类型
- 关联入口：卡片。
- 待解决：原型宽度为手工比例，必须改为可说明的数据缩放；区分相邻转化率与最终转化率
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/160.html)；[ChartCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-card.tsx)；[ChartTooltip](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-tooltip.tsx)。

### 161 留存队列

- 现行映射：图表 → ChartCard / ChartTooltip。
- 建议展示入口：图表；能力归属：图表 / 矩阵热力图；完整示例：图表 / 留存队列。
- 判断依据：外观看似表格，但主要任务是读二维数值强度与队列趋势；空白未到期单元格不是 0。
- 接入边界：热力图的矩阵变体；与 151 共享基础能力
- 关联入口：数据表格。
- 待解决：需要数值域、缺失值与不可达周期语义；补全可访问的行列标题与键盘定位
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/161.html)；[ChartCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-card.tsx)；[ChartTooltip](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-tooltip.tsx)。

### 163 目标刻度

- 现行映射：图表 → ChartCard / ChartTooltip。
- 建议展示入口：图表；能力归属：图表 / 目标对比图；完整示例：图表 / 目标达成分析。
- 判断依据：显示量纲刻度、实际量和可移动目标线，属于量化对比；不是任务完成状态。
- 接入边界：独立目标刻度变体，归入图表体系
- 关联入口：卡片、提示与反馈 / 加载与进度。
- 待解决：目标为零和超域值需定义；原型把数值直接当百分比，通用组件需显式 domain
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/163.html)；[ChartCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-card.tsx)；[ChartTooltip](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-tooltip.tsx)。

### 165 预测置信带

- 现行映射：图表 → ChartCard / ChartTooltip。
- 建议展示入口：图表；能力归属：图表 / 带区间的折线图；完整示例：图表 / 预测分析。
- 判断依据：同一时间序列包含实际、预测与上下界，折线图已经是近邻能力；需要新增带区间的数据表达。
- 接入边界：评估 SmoothLineChart 区间带扩展；不重复新增普通折线入口
- 关联入口：卡片。
- 待解决：置信区间由调用方传入，组件不推算统计可信度；上下界交叉、缺失、负值和预测分界要处理
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/165.html)；[SmoothLineChart](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/smooth-line-chart.tsx)；[ChartCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-card.tsx)；[ChartTooltip](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/chart-tooltip.tsx)。

### 176 版本胶片

- 现行映射：历史记录 → HistoryGrouped。
- 建议展示入口：历史记录；能力归属：历史记录 / 版本选择与恢复；完整示例：历史记录 / 版本回溯。
- 判断依据：历史记录为正确主类，但现有 HistoryGrouped 是静态时间线样式；它没有版本选择、当前版本和恢复状态。
- 接入边界：先做组合示例；重复场景成立再抽 VersionHistory
- 关联入口：内容与编辑、卡片。
- 待解决：不能为保留映射把胶片选择器硬改成时间线；恢复需要异步确认、失败回退与当前版本受控
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/176.html)；[HistoryGrouped](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/history-grouped.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### 177 撤销重做历史

- 现行映射：历史记录 → HistoryGrouped。
- 建议展示入口：历史记录；能力归属：工具栏 / 撤销重做操作组；完整示例：历史记录 / 编辑撤销重做。
- 判断依据：可复用视觉单元是双操作按钮及可用状态，完整行为是编辑历史栈；HistoryGrouped 不管理历史栈。
- 接入边界：仅组合示例；不并入 HistoryGrouped
- 关联入口：内容与编辑。
- 待解决：外部编辑器拥有历史，不应把任意业务 state 存入 UI 组件；分支编辑后清理 redo 与异步操作语义需验证
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/177.html)；[Toolbar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/toolbar.tsx)；[IconButton](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/icon-button.tsx)。

### 178 批量选择操作台

- 现行映射：数据表格 → DataTable。
- 建议展示入口：列表；能力归属：工具栏 / 批量选择操作栏；完整示例：列表 / 文件集合批量操作。
- 判断依据：原型是三个文件卡片的多选，没有行列数据模型；操作栏依赖选中数量与动作，独立于列表和表格容器。
- 接入边界：与 F03 共用 SelectionActionBar；完整示例保留文件集合布局
- 关联入口：工具栏、数据表格、智能体任务列表、文件展示。
- 待解决：归档及撤销属于业务示例状态，不放进操作栏；多次归档应有明确撤销批次；原型一次恢复全部；能力分类不等于主展示分类；不要因工具栏抽象而把完整列表交互搬走
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/178.html)；[SelectionActionBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/selection-action-bar.tsx)；[FileCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/file-upload.tsx)；[FileTypeIcon](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/file-upload.tsx)。

### 179 文字片段拼接

- 现行映射：实用组件 → 无直接对象。
- 建议展示入口：实验室/cases 标签：内容与编辑；能力归属：内容与编辑 / 文字片段组合；完整示例：内容与编辑 / 常用片段拼接。
- 判断依据：源码没有读写系统剪贴板，只是文本卡片选择和 joined 文本；ClipboardShelf 名称会夸大能力。
- 接入边界：仅示例；暂缓独立 ClipboardShelf
- 关联入口：列表、聊天。
- 待解决：建议更名为文字片段拼接；若产品不需要这一常用场景，优先暂缓，避免实用组件杂项膨胀
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/179.html)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)；[SurfaceCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/surface-card.tsx)。

### 180 审批签署

- 现行映射：智能体 → ApprovalCard。
- 建议展示入口：实验室/cases 标签：协作与流程；能力归属：协作与流程 / 审批进程；完整示例：协作与流程 / 多人审核。
- 判断依据：ApprovalCard 的真实 API 是 questions/options/onSubmitted 问答，与多角色审批毫无状态契约重合；不能因 approval 同名强行映射。
- 接入边界：仅业务组合示例；不并入 ApprovalCard
- 关联入口：历史记录、分页与步骤。
- 待解决：原型只有顺序加章，不含驳回、权限、待审人、失败；完成动画不能替代审批业务结果
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/180.html)；[Avatar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/avatar.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)；[SurfaceCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/surface-card.tsx)。

### 181 工作分派

- 现行映射：智能体 → AgentTaskRows。
- 建议展示入口：实验室/cases 标签：协作与流程；能力归属：协作与流程 / 任务分派；完整示例：协作与流程 / 团队负载分配。
- 判断依据：AgentTaskRows 仅显示任务状态和子项，没有成员、容量、分派动作；原型是通用团队任务分配，并非智能体专属。
- 接入边界：仅业务组合示例；保留任务和容量展示组合
- 关联入口：卡片、列表。
- 待解决：原型只累加本地计数，不代表真实分派成功；容量上限、受控数据和异步失败回退应由业务提供
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/181.html)；[TaskCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/task-card.tsx)；[Avatar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/avatar.tsx)；[ProgressBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/progress-bar.tsx)。

### 184 角色权限矩阵

- 现行映射：数据表格 → DataTable。
- 建议展示入口：数据表格；能力归属：数据表格 / 权限矩阵；完整示例：数据表格 / 角色权限配置。
- 判断依据：行资源、列角色、单元格布尔值的二维矩阵，表格主类合理；权限语义是业务层。
- 接入边界：组合示例；复用 DataTable 单元格和选择控件
- 关联入口：表单与输入、协作与流程。
- 待解决：继承、禁用与读写依赖不能只由 aria-pressed 模拟；权限执行在业务后端，不能以单元格状态作为授权
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/184.html)；[DataTable](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/data-table.tsx)；[Checkbox](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/checkbox.tsx)。

### 186 设备配对

- 现行映射：表单与输入 → OtpInput。
- 建议展示入口：审核状态：不纳入迁移；能力归属：设备与系统 / 设备发现；完整示例：设备与系统 / 配对。
- 判断依据：原型是雷达扫描与设备按钮选择，没有验证码输入；与 OtpInput 完全不对应，且属于用户已希望删减的系统类冷门示例。
- 接入边界：从生产迁移候选中排除；本轮保留审计记录，不删除原型文件。
- 汇总校准：此前已要求删去媒体与系统；设备发现没有 OTP，不通过重命名重新纳入。
- 待解决：扫描由定时器模拟，不含发现/连接 API；不要把它改名或硬塞表单与输入来绕过范围删减
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/186.html)。

### 188 灰度发布

- 现行映射：表单与输入 → Toggle。
- 建议展示入口：实验室/cases 标签：协作与流程；能力归属：协作与流程 / 发布进程；完整示例：协作与流程 / 灰度发布。
- 判断依据：原型按 0/5/25/100 阶段推进并回滚，没有 Toggle；进度/数值是显示单元，完整任务是发布工作流。
- 接入边界：仅业务组合示例；视常用性暂缓
- 汇总校准：通用运维示例保留在实验室评估，不通过协作与流程分类恢复系统类。
- 关联入口：卡片、提示与反馈 / 加载与进度。
- 待解决：生产发布确认和结果由业务负责；系统运维场景应结合用户删繁要求审视是否保留
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/188.html)；[ProgressBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/progress-bar.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)；[StatCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/stat-card.tsx)。

### 189 环境晋级

- 现行映射：智能体 → ApprovalCard。
- 建议展示入口：实验室/cases 标签：协作与流程；能力归属：协作与流程 / 环境晋级；完整示例：协作与流程 / 发布流程。
- 判断依据：原型是阶段推进与检查状态，没有问答、审批人或审批决策；ApprovalCard 同名联想不能成立。
- 接入边界：仅业务组合示例；不并入 ApprovalCard
- 汇总校准：通用运维示例保留在实验室评估，不通过协作与流程分类恢复系统类。
- 关联入口：分页与步骤、历史记录。
- 待解决：原型 550ms 定时器自动通过，不能迁为真实业务控制；环境晋级需要外部结果、失败状态和可重试语义
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/public/components/189.html)；[Stepper](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/stepper.tsx)；[SurfaceCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/surface-card.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### F01 附件队列

- 现行映射：聊天 → ChatInputBar。
- 建议展示入口：聊天；能力归属：表单与输入 / 文件上传队列；完整示例：聊天 / 带附件的消息输入。
- 判断依据：FileCard 已有文件名、状态、重试/移除，FileUpload 已有队列；ChatInputBar 目前只有 onAttach 事件，不应把文件传输能力重复做成聊天专属。
- 接入边界：优先扩展 FileUpload/FileCard；ChatInputBar 提供内容插槽或附件区域集成
- 关联入口：文件展示、提示与反馈 / 加载与进度。
- 待解决：需要进度、文件对象和重试受控契约；上传实际执行属于调用方；发送依赖上传完成的条件在组合案例中明确
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/src/features.tsx)；[FileUpload](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/file-upload.tsx)；[FileCard](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/forms/file-upload.tsx)；[ChatInputBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/chat-input-bar.tsx)。

### F02 工具运行卡

- 现行映射：智能体 → ThinkingTrace / ToolChips。
- 建议展示入口：智能体；能力归属：智能体 / 工具执行卡；完整示例：智能体 / 工具运行过程。
- 判断依据：工具身份、参数和执行状态是此组件的核心语义，智能体主类成立；现有 ThinkingTrace 自动展示行和 ToolChips 折叠详情仅覆盖一部分。
- 接入边界：复用 ThinkingTrace/ToolChips 展示基础，评估单一工具执行变体
- 关联入口：提示与反馈 / 加载与进度、历史记录。
- 待解决：新增真实 status/step/onStop/onRetry 受控契约；不把演示推进按钮作为生产 API；停止请求与已停止结果分离
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/src/features.tsx)；[ThinkingTrace](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/agent/thinking-trace.tsx)；[ToolChips](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/agent/tool-chips.tsx)。

### F03 列表批量操作

- 现行映射：列表 → ListItem / ListGroup。
- 建议展示入口：列表；能力归属：工具栏 / 批量选择操作栏；完整示例：列表 / 文档批量归档。
- 判断依据：原型 BulkSelectionDock 的公共 API 只有 count/onArchive/onClear，与文档、表格、智能体类型无关。选中集合来自容器，操作栏负责显示数量及动作，因此能力主类为工具栏。
- 接入边界：SelectionActionBar 复用为上下文工具栏；主展示留在列表，工具栏/表格按需交叉引用
- 关联入口：工具栏、数据表格、智能体任务列表。
- 待解决：勿因可作用于智能体而放入 agent；异步批量操作、权限和撤销仍由调用方掌握；能力分类不等于主展示分类；不要因工具栏抽象而把完整列表交互搬走
- 本地状态：已有部分本地实现；本轮不等于验收、完成或发布。
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/src/features.tsx)；[SelectionActionBar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/selection-action-bar.tsx)；[Toolbar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/toolbar.tsx)；[ListItem](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/list-item.tsx)；[ListGroup](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/list-group.tsx)。

### F04 生成内容审核

- 现行映射：智能体 → AgentDiffTable / ApprovalCard。
- 建议展示入口：智能体；能力归属：内容与编辑 / 变更审核；完整示例：智能体 / 生成内容审核。
- 判断依据：标题中的 Agent 只是产生变更的来源；核心能力是 before/after/decision 的通用文本审核。AgentDiffTable 的 cells 模型和 ApprovalCard 的 questions 模型都不匹配。
- 接入边界：与 127 共用决策模型；普通文本与代码渲染分别实现
- 关联入口：历史记录、协作与流程。
- 待解决：保留已验收两段内容的退场动效；受控决定、撤销和保存失败契约需明确；cases 可保留智能体来源场景，但 API 主分类应独立于来源
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/src/features.tsx)；[AgentCodeBlock](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/agent/agent-code-block.tsx)；[Button](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/button.tsx)。

### F05 协作席位

- 现行映射：智能体 → AddMember / AvatarGroup。
- 建议展示入口：智能体；能力归属：协作与流程 / 成员选择与负责对象；完整示例：智能体 / 协作席位。
- 判断依据：角色名为智能体不改变通用成员管理语义；AddMember 已有选择和添加，active owner 是另一状态，不能把它混进 selectedIds。
- 接入边界：优先成员选择组合示例；AddMember 负责添加，Avatar 负责身份展示
- 关联入口：卡片、表单与输入。
- 待解决：当前负责人移除后的回退需可配置并受控；用户要求头像+名字；原型手绘机器头像不能当通用身份资源；选择负责对象不等于授权或真实任务移交
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/src/features.tsx)；[AddMember](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/add-member.tsx)；[Avatar](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/avatar.tsx)；[AvatarGroup](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/avatar.tsx)。

### F06 搜索无结果恢复

- 现行映射：筛选 → FilterPanel / CommandSearch。
- 建议展示入口：筛选；能力归属：反馈与状态 / 可恢复空态；完整示例：筛选 / 无结果恢复。
- 判断依据：没有结果是反馈状态；清除哪个筛选由筛选器负责。CommandSearch 是命令面板，不代表任意搜索结果。
- 接入边界：复用 EmptyState，筛选与结果切换留在组合示例
- 关联入口：列表、智能体命令搜索。
- 待解决：原型 filters.length 非零就空，不能迁为真实查询逻辑；状态与插图统一复用，不能新增重复 SearchRecovery 核心入口
- 依据文件：[原型源码](/Users/hesong/Documents/gihub_space/forge-interaction-lab/src/features.tsx)；[EmptyState](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/empty-state.tsx)；[FilterPanel](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/filter-panel.tsx)；[ToolbarSearchInput](/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/toolbar.tsx)。
