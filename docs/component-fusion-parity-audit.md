# 新增交互与原版对照审计

日期：2026-10-15。范围：迁移目录中非 defer 的全部 99 项（93 个原版条目、6 个新增组合）。

## 结论与验收边界

当前不能标记为“全部与原版一致”。以下为源码对照审计：核对原版 HTML/CSS/JS 与迁移示例、引用的 core 能力。渲染测试只证明可渲染，不证明动画一致。未完成所有条目的并排录屏和逐帧比对，因此“需动态核验”不是通过结论。

Forge 的主题色、字体字号、Solar 图标、中文默认及语言切换属于已要求的设计适配，不要求复制原版品牌外观；缺失状态、触发方式变化、动画时间线丢失则属于迁移差异。侧栏 040 按用户已验收结果保留。

源码审计分类：明确差异 49 项；需动态核验 43 项；用户已验收 1 项；新增组合 6 项。

## 修复优先级

1. 先补丢失的状态链与触发行为：010、023、025、033、062、063、074、075、081。
2. 再补核心效果：002 分层磁吸、004 下载收圆、007 图标形变、012 丝带、027 顶栏展开、057 轮播、059 参与者反馈。
3. 对其他明确差异逐项决定保留 Forge 结构还是补齐原版反馈；不能把原版名称下的简化版本当成完整迁移。
4. 对“需动态核验”项，录制原版与 Forge 的静止、触发、中间态、完成、反向/中断、快速重复操作；另查减少动态效果与键盘操作。

## 逐项清单

| 条目 | 审计状态 | 当前实现与原版的差异 / 待核验点 | 源码定位 |
| --- | --- | --- | --- |
| 001 液态玻璃按钮 | 明确差异 | 玻璃分层与收缩已补强；仍缺原版外层浮动和磁吸跟随，完成后的自动复位不同。 | [原版](../../forge-interaction-lab/public/components/001.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx)、[actions-buttons.tsx](../src/app/components/_fusion/actions-buttons.tsx) |
| 002 磁吸箭头按钮 | 明确差异 | 磁吸位移与箭头移动存在；缺文字、背景圆形的独立分层跟随。 | [原版](../../forge-interaction-lab/public/components/002.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 003 长按删除 | 需动态核验 | 长按确认与删除退场保留；退场方式采用 Forge 方案，不是原版纸张揉皱效果。 | [原版](../../forge-interaction-lab/public/components/003.html)；[_migration-previews.tsx](../src/app/components/_migration-previews.tsx) |
| 004 下载进度按钮 | 明确差异 | 进度更新存在；缺箭头落下、按钮收圆、完成勾再展开的完整时间线。 | [原版](../../forge-interaction-lab/public/components/004.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx)、[actions-buttons.tsx](../src/app/components/_fusion/actions-buttons.tsx) |
| 005 纸飞机发送 | 需动态核验 | 纸飞机发送动画存在；原版弧线路径、中心完成反馈和新飞机复位需要补齐对照。 | [原版](../../forge-interaction-lab/public/components/005.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx)、[actions-buttons.tsx](../src/app/components/_fusion/actions-buttons.tsx) |
| 006 墨水涟漪按钮 | 明确差异 | 涟漪存在；铃铛摇动与计数逐位滚动未还原。 | [原版](../../forge-interaction-lab/public/components/006.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx)、[actions-buttons.tsx](../src/app/components/_fusion/actions-buttons.tsx) |
| 007 播放暂停变形 | 明确差异 | 播放、暂停图标直接切换，缺三角形分裂成双竖线的形变。 | [原版](../../forge-interaction-lab/public/components/007.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 008 复制完成反馈 | 需动态核验 | 真实剪贴板、成功及失败反馈保留；反馈图标使用 Solar 替换，描绘节奏待逐帧核验。 | [原版](../../forge-interaction-lab/public/components/008.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 009 文字滚动按钮 | 需动态核验 | 文字逐字滚动保留；背景注色和悬停进出节奏待逐帧核验。 | [原版](../../forge-interaction-lab/public/components/009.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 010 组合操作按钮 | 明确差异 | 菜单选择保留；主操作仅显示已选项，缺原版执行进度与完成状态。 | [原版](../../forge-interaction-lab/public/components/010.html)；[forms-navigation-menus.tsx](../src/app/components/_fusion/forms-navigation-menus.tsx)、[forms-navigation.tsx](../src/app/components/_fusion/forms-navigation.tsx) |
| 011 扇形快捷操作 | 明确差异 | 扇形展开、错峰和加号旋转存在；结果反馈改为常驻文字。 | [原版](../../forge-interaction-lab/public/components/011.html)；[forms-navigation-menus.tsx](../src/app/components/_fusion/forms-navigation-menus.tsx)、[forms-navigation.tsx](../src/app/components/_fusion/forms-navigation.tsx) |
| 012 书签丝带 | 明确差异 | 收藏切换与弹跳存在；缺丝带注色、碎屑和计数滚动。 | [原版](../../forge-interaction-lab/public/components/012.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx)、[actions-buttons.tsx](../src/app/components/_fusion/actions-buttons.tsx) |
| 013 弹性开关 | 需动态核验 | 拖动过中点切换、点击及键盘操作保留；弹性轨迹需并排录屏核验。 | [原版](../../forge-interaction-lab/public/components/013.html)；[_migration-previews.tsx](../src/app/components/_migration-previews.tsx) |
| 014 待办清单 | 明确差异 | 勾选及完成反馈保留；原版环形汇总进度改成线性进度。 | [原版](../../forge-interaction-lab/public/components/014.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 015 套餐选择卡 | 明确差异 | 套餐选择保留；各卡片独立换边框，缺同一个选中框滑移。 | [原版](../../forge-interaction-lab/public/components/015.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 016 星级评价 | 需动态核验 | 评分悬停、选中反馈保留；星形的弹性节奏待逐帧核验。 | [原版](../../forge-interaction-lab/public/components/016.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 018 滚动数量步进 | 明确差异 | 数量上下限保留；缺边界摇动，总价直接更新而非滚动。 | [原版](../../forge-interaction-lab/public/components/018.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 019 兴趣多选 | 明确差异 | 最多五项限制保留；超限仅文字提示，缺选项摇动和计数闪动。 | [原版](../../forge-interaction-lab/public/components/019.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 021 日夜切换 | 需动态核验 | 日夜主题状态保留；太阳月亮使用图标切换，原版月面形变细节未对应。 | [原版](../../forge-interaction-lab/public/components/021.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 022 点赞心形绽放 | 明确差异 | 心形弹跳和扩散圈存在；缺独立粒子绽放。 | [原版](../../forge-interaction-lab/public/components/022.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 023 通知设置展开 | 明确差异 | 总开关同时关闭所有子项；原版逐项收起节奏及每项详情未保留。 | [原版](../../forge-interaction-lab/public/components/023.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 025 浮动标签输入 | 明确差异 | 浮动标签保留；缺无效邮箱摇动、错误提示及成功描勾。 | [原版](../../forge-interaction-lab/public/components/025.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 026 验证码输入 | 明确差异 | 输入、粘贴和验证状态接口保留；示例验证由手动控制，原版自动演示时间线不同。 | [原版](../../forge-interaction-lab/public/components/026.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 027 顶栏搜索展开 | 明确差异 | 展开为独立搜索面板；原版顶栏横向伸展的结构未还原。 | [原版](../../forge-interaction-lab/public/components/027.html)；[forms-navigation-menus.tsx](../src/app/components/_fusion/forms-navigation-menus.tsx)、[forms-navigation.tsx](../src/app/components/_fusion/forms-navigation.tsx) |
| 028 自动伸展评论框 | 明确差异 | 自动增高和字数限制保留；环形字数计数改成纯文字，无超限红色状态。 | [原版](../../forge-interaction-lab/public/components/028.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 029 标签输入 | 明确差异 | 回车添加、退格删除保留；缺候选建议飞入。 | [原版](../../forge-interaction-lab/public/components/029.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 030 日期区间日历 | 需动态核验 | 区间日期选择使用 Forge Datepicker；悬停范围及跨月切换需浏览器单独对照。 | [原版](../../forge-interaction-lab/public/components/030.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 031 自定义选择器 | 需动态核验 | 选择与键盘操作保留；移动高亮的轨迹及快速切换需录屏核验。 | [原版](../../forge-interaction-lab/public/components/031.html)；[_migration-previews.tsx](../src/app/components/_migration-previews.tsx) |
| 032 拖拽上传 | 需动态核验 | 拖拽、本地读取和文件状态保留；本地读取不能覆盖原版慢上传、失败重试的全部演示节奏。 | [原版](../../forge-interaction-lab/public/components/032.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 033 标题内联编辑 | 明确差异 | 只点击编辑图标进入编辑；原版标题整体可编辑及保存闪动未保留。 | [原版](../../forge-interaction-lab/public/components/033.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 036 密码强度 | 需动态核验 | 密码显示和强度反馈存在；四段强度及规则逐项过渡被简化。 | [原版](../../forge-interaction-lab/public/components/036.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 037 账号切换 | 明确差异 | 使用向下展开的账号菜单；原版底部账号入口向上展开与悬停错峰不同。 | [原版](../../forge-interaction-lab/public/components/037.html)；[forms-navigation-menus.tsx](../src/app/components/_fusion/forms-navigation-menus.tsx)、[forms-navigation.tsx](../src/app/components/_fusion/forms-navigation.tsx) |
| 039 滑动选中标签 | 需动态核验 | 移动选中层存在；伸缩速度与快速反向切换仍需逐帧核验。 | [原版](../../forge-interaction-lab/public/components/039.html)；[_migration-previews.tsx](../src/app/components/_migration-previews.tsx) |
| 040 AppLayout 侧栏动效 | 用户已验收 | 侧栏已由用户验收；保持当前 Forge 选中样式、图标和伸缩方案。 | [原版](../../forge-interaction-lab/public/components/040.html)；[example.tsx](../src/app/components/_fusion/example.tsx) |
| 041 底部导航凹槽 | 需动态核验 | 凹槽导航存在；凹槽跟随与图标升降的同步性需录屏核验。 | [原版](../../forge-interaction-lab/public/components/041.html)；[forms-navigation-menus.tsx](../src/app/components/_fusion/forms-navigation-menus.tsx)、[forms-navigation.tsx](../src/app/components/_fusion/forms-navigation.tsx) |
| 042 分步向导 | 需动态核验 | 步骤校验与前后切换保留；进度与内容切换方向需浏览器连续操作核验。 | [原版](../../forge-interaction-lab/public/components/042.html)；[forms-navigation-menus.tsx](../src/app/components/_fusion/forms-navigation-menus.tsx)、[forms-navigation.tsx](../src/app/components/_fusion/forms-navigation.tsx) |
| 043 分页伸缩 | 明确差异 | 分页移动指示层存在；结果改为列表示例，原版大号数字画面不再使用。 | [原版](../../forge-interaction-lab/public/components/043.html)；[_migration-previews.tsx](../src/app/components/_migration-previews.tsx) |
| 044 问答折叠 | 需动态核验 | 手风琴高度和内容过渡存在；图标使用 Forge 规范，展开节奏待逐帧核验。 | [原版](../../forge-interaction-lab/public/components/044.html)；[_migration-previews.tsx](../src/app/components/_migration-previews.tsx) |
| 045 菜单由按钮展开 | 需动态核验 | 圆形揭露面板存在；入口图标未随展开变成关闭形态。 | [原版](../../forge-interaction-lab/public/components/045.html)；[forms-navigation-menus.tsx](../src/app/components/_fusion/forms-navigation-menus.tsx)、[forms-navigation.tsx](../src/app/components/_fusion/forms-navigation.tsx) |
| 046 命令面板 | 需动态核验 | 筛选及键盘选项保留；应对照面板开启、收起和高亮迁移，不能凭 SSR 判定一致。 | [原版](../../forge-interaction-lab/public/components/046.html)；[_migration-previews.tsx](../src/app/components/_migration-previews.tsx) |
| 047 时间区间切换 | 明确差异 | 时间范围和图表数据切换保留；汇总数字整体更新，缺逐位计数。 | [原版](../../forge-interaction-lab/public/components/047.html)；[forms-navigation-menus.tsx](../src/app/components/_fusion/forms-navigation-menus.tsx)、[forms-navigation.tsx](../src/app/components/_fusion/forms-navigation.tsx) |
| 048 滑动联动标签 | 需动态核验 | 内容滑动联动页签已接入；边缘渐隐与拖动回弹需触摸操作核验。 | [原版](../../forge-interaction-lab/public/components/048.html)；[forms-navigation-menus.tsx](../src/app/components/_fusion/forms-navigation-menus.tsx)、[forms-navigation.tsx](../src/app/components/_fusion/forms-navigation.tsx) |
| 049 层叠内容卡 | 明确差异 | 固定层叠位移替代指针视差；键盘失焦未复位预览，整卡触摸交互也不同。 | [原版](../../forge-interaction-lab/public/components/049.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 050 光照倾斜卡 | 明确差异 | 倾斜与高光保留；已读反馈有状态，原版未读圆点未保留。 | [原版](../../forge-interaction-lab/public/components/050.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 054 关注个人卡 | 需动态核验 | 关注及推荐面板保留；计数整体弹入而非仅变化数字滚动。 | [原版](../../forge-interaction-lab/public/components/054.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 056 月年计费切换 | 明确差异 | 月年和席位计算保留；缺价格逐位滚动、特性列表切换及共享选中框。 | [原版](../../forge-interaction-lab/public/components/056.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 057 头像评价轮播 | 明确差异 | 定时轮播与暂停保留；缺头像倒计时环、引文逐词入场与拖动切换。 | [原版](../../forge-interaction-lab/public/components/057.html)；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| 058 阅读进度卡 | 明确差异 | 阅读进度和完成状态保留；按钮背景直接切换，原版跟随选中层不同。 | [原版](../../forge-interaction-lab/public/components/058.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 059 活动报名卡 | 明确差异 | 报名数量保留；参与者头像不会增减，缺报名庆祝，日历入口呈现方式不同。 | [原版](../../forge-interaction-lab/public/components/059.html)；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| 062 登录反馈 | 明确差异 | 仅基础表单校验和文字反馈；缺异步加载、错误摇动、成功欢迎切换。 | [原版](../../forge-interaction-lab/public/components/062.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 063 逐题注册 | 明确差异 | 逐步注册及返回保留；缺已答题摘要标签及点击摘要回到对应题。 | [原版](../../forge-interaction-lab/public/components/063.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 066 社交登录按钮 | 需动态核验 | 收起其他登录方式、连接及账号确认已实现；尚需并排核验高度与错峰时间。 | [原版](../../forge-interaction-lab/public/components/066.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 067 锁定倒计时 | 需动态核验 | 倒计时与禁用解锁保留；数字及解锁图形节奏待逐帧核验。 | [原版](../../forge-interaction-lab/public/components/067.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 070 堆叠通知 | 需动态核验 | 复用堆叠 Toast；展开、暂停、滑动关闭需与原版并排检查。 | [原版](../../forge-interaction-lab/public/components/070.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 071 滑动删除与撤销 | 需动态核验 | 滑动删除与撤销保留；行高度收缩与连续删除的时间线待浏览器核验。 | [原版](../../forge-interaction-lab/public/components/071.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 074 通知铃菜单 | 明确差异 | 固定通知数据和全部已读存在；缺新通知到达触发、铃铛摇动和徽章弹入。 | [原版](../../forge-interaction-lab/public/components/074.html)；[forms-navigation-menus.tsx](../src/app/components/_fusion/forms-navigation-menus.tsx)、[forms-navigation.tsx](../src/app/components/_fusion/forms-navigation.tsx) |
| 075 上传进度面板 | 明确差异 | 文件队列及折叠保留；缺整体进度环和剩余时间，读取完成过快使状态覆盖不足。 | [原版](../../forge-interaction-lab/public/components/075.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 076 跟随工具提示 | 需动态核验 | 复用 TooltipGroup；连续悬停暖启动及上下翻转边界需浏览器核验。 | [原版](../../forge-interaction-lab/public/components/076.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 077 表情反应面板 | 需动态核验 | 反应面板、增减计数保留；表情使用业务内容，选择后的飞入与计数变化待逐帧核验。 | [原版](../../forge-interaction-lab/public/components/077.html)；[agent-charts.tsx](../src/app/components/_fusion/agent-charts.tsx) |
| 078 滑动回复 | 需动态核验 | 引用、发送与模拟回复保留；滑动阈值、回弹及引用条收起需触摸核验。 | [原版](../../forge-interaction-lab/public/components/078.html)；[agent-charts.tsx](../src/app/components/_fusion/agent-charts.tsx) |
| 080 轨道同步指示 | 需动态核验 | 轨道运动存在；轨道半径、相位和完成收束待逐帧对照。 | [原版](../../forge-interaction-lab/public/components/080.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 081 环形完成反馈 | 明确差异 | 环形进度放在普通按钮之外；原版按钮自身收圆的完成时间线未还原。 | [原版](../../forge-interaction-lab/public/components/081.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx)、[actions-buttons.tsx](../src/app/components/_fusion/actions-buttons.tsx) |
| 083 队列进度转换 | 需动态核验 | 排队、运行与完成状态保留；不定进度转确定进度的衔接待录屏核验。 | [原版](../../forge-interaction-lab/public/components/083.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 084 语音响应圆点 | 明确差异 | 语音状态、模拟音量与识别保留；视觉载体融合到 ChatInputBar，非原版独立响应圆点。 | [原版](../../forge-interaction-lab/public/components/084.html)；[agent-charts.tsx](../src/app/components/_fusion/agent-charts.tsx) |
| 086 AI 流式回答 | 需动态核验 | 流式回答、停止与重生成保留；分块模糊入场的批次和速度待逐帧核验。 | [原版](../../forge-interaction-lab/public/components/086.html)；[agent-charts.tsx](../src/app/components/_fusion/agent-charts.tsx) |
| 087 配送步骤 | 需动态核验 | 配送步骤状态保留；车辆位置与步骤切换同步性待录屏核验。 | [原版](../../forge-interaction-lab/public/components/087.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 088 资料夹空态 | 需动态核验 | 文件夹开合与创建纸张动画存在；折叠、纸张飞行和新增列表联动需录屏核验。 | [原版](../../forge-interaction-lab/public/components/088.html)；[_migration-previews.tsx](../src/app/components/_migration-previews.tsx) |
| 089 404 纠错 | 明确差异 | 输入纠错和路径打字存在；罗盘整体旋转，缺独立指针及 404 数字滚动。 | [原版](../../forge-interaction-lab/public/components/089.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 090 可重试错误卡 | 明确差异 | 错误、重试和成功状态保留；插头改成 Solar 图标，原版连接实体动画不同。 | [原版](../../forge-interaction-lab/public/components/090.html)；[actions.tsx](../src/app/components/_fusion/actions.tsx) |
| 091 离线消息队列 | 需动态核验 | 离线队列与逐条补发保留；示例手动连接，非真实浏览器网络事件驱动。 | [原版](../../forge-interaction-lab/public/components/091.html)；[agent-charts.tsx](../src/app/components/_fusion/agent-charts.tsx) |
| 092 筛选空态恢复 | 明确差异 | 筛选恢复功能保留；缺原版放大镜与货架组成的空态动画。 | [原版](../../forge-interaction-lab/public/components/092.html)；[composition-recovery.tsx](../src/app/components/_fusion/composition-recovery.tsx)、[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| 093 完成庆祝 | 明确差异 | 全部完成的庆祝存在；缺每次勾选的粒子和徽章数字滚动。 | [原版](../../forge-interaction-lab/public/components/093.html)；[forms-navigation-forms.tsx](../src/app/components/_fusion/forms-navigation-forms.tsx) |
| 095 形态切换柱图 | 明确差异 | 周期切换、柱数变化及选择保留；不同柱数间的插值与退出需录屏核验。 | [原版](../../forge-interaction-lab/public/components/095.html)；[agent-charts-plots.tsx](../src/app/components/_fusion/agent-charts-plots.tsx) |
| 096 滑动股票折线 | 明确差异 | 游标与数值联动保留；缺低于起点时整条折线切成下跌色。 | [原版](../../forge-interaction-lab/public/components/096.html)；[agent-charts-plots.tsx](../src/app/components/_fusion/agent-charts-plots.tsx) |
| 097 重排环图 | 明确差异 | 排除分类后的比例重排保留；中心金额直接更新而非数字滚动。 | [原版](../../forge-interaction-lab/public/components/097.html)；[agent-charts-plots.tsx](../src/app/components/_fusion/agent-charts-plots.tsx) |
| 098 实时数字滚动 | 明确差异 | 逐位 AnimatedNumber 已接入；示例拆为独立数字卡，原版指标切换和自动实时更新不同。 | [原版](../../forge-interaction-lab/public/components/098.html)；[_migration-previews.tsx](../src/app/components/_migration-previews.tsx) |
| 099 活动环 | 明确差异 | 三环、超目标与日期选择保留；数值直接更新，完成闪光需进一步核验。 | [原版](../../forge-interaction-lab/public/components/099.html)；[agent-charts-plots.tsx](../src/app/components/_fusion/agent-charts-plots.tsx) |
| 108 时区交集 | 需动态核验 | 日期、时区及工作时间交集保留；城市和本地化按 Forge 调整，滑块移动节奏待核验。 | [原版](../../forge-interaction-lab/public/components/108.html)；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| 110 日程冲突修复 | 需动态核验 | 冲突定位、移动和撤销保留；移动卡片的路径和重排节奏需录屏核验。 | [原版](../../forge-interaction-lab/public/components/110.html)；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| 126 Markdown 编辑与预览 | 明确差异 | 编辑和 Markdown 预览保留；原版翻页结构改为面板切换。 | [原版](../../forge-interaction-lab/public/components/126.html)；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| 127 变更片段审核 | 需动态核验 | 逐块接受、拒绝及结果保留；差异块消失与周边收缩节奏需核验。 | [原版](../../forge-interaction-lab/public/components/127.html)；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| 128 查找替换 | 需动态核验 | 查找、替换、高亮及撤销保留；匹配项转移与替换反馈需录屏核验。 | [原版](../../forge-interaction-lab/public/components/128.html)；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| 129 代码折叠 | 需动态核验 | 代码范围折叠保留；行高收缩、折叠标记切换需核验。 | [原版](../../forge-interaction-lab/public/components/129.html)；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| 157 层叠用量面积 | 需动态核验 | 堆叠面积与隔离系列保留；边界曲线形变与图例切换节奏需核验。 | [原版](../../forge-interaction-lab/public/components/157.html)；[agent-charts-plots.tsx](../src/app/components/_fusion/agent-charts-plots.tsx) |
| 163 目标刻度 | 需动态核验 | 目标滑块与刻度反馈保留；跨目标时的反馈与缓动需核验。 | [原版](../../forge-interaction-lab/public/components/163.html)；[agent-charts-plots.tsx](../src/app/components/_fusion/agent-charts-plots.tsx) |
| 165 预测置信带 | 需动态核验 | 置信区间保留；范围更新与线条、面积同步性需核验。 | [原版](../../forge-interaction-lab/public/components/165.html)；[agent-charts-plots.tsx](../src/app/components/_fusion/agent-charts-plots.tsx) |
| 176 版本胶片 | 明确差异 | 版本恢复功能保留；胶片改成文字按钮和形状预览，原版视觉结构不同。 | [原版](../../forge-interaction-lab/public/components/176.html)；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| 177 撤销重做历史 | 需动态核验 | 有界撤销、重做保留；历史游标和状态回放的时间线需浏览器核验。 | [原版](../../forge-interaction-lab/public/components/177.html)；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| 178 批量选择操作台 | 明确差异 | 批量选择、归档及撤销保留；融合 Toolbar，浮动位置与原版不同。 | [原版](../../forge-interaction-lab/public/components/178.html)；[_migration-previews.tsx](../src/app/components/_migration-previews.tsx) |
| 179 文字片段拼接 | 明确差异 | 按顺序拼接与清空保留；片段改成按钮，原版剪贴板视觉结构不同。 | [原版](../../forge-interaction-lab/public/components/179.html)；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| 180 审批签署 | 明确差异 | 审批步骤保留；签章改成 Solar 勾选，初始从首个已完成状态开始。 | [原版](../../forge-interaction-lab/public/components/180.html)；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| 181 工作分派 | 需动态核验 | 成员容量、分派限制保留；拖动或点击分配的视觉反馈需对照原版核验。 | [原版](../../forge-interaction-lab/public/components/181.html)；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| 184 角色权限矩阵 | 需动态核验 | 角色权限及所有者锁定保留；权限格切换的反馈时序需核验。 | [原版](../../forge-interaction-lab/public/components/184.html)；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| F01 附件队列 | 新增组合 | 自行设计的附件队列组合；需验收添加、上传中、失败、重试、移除及发送禁用。 | 无对应原版；[_migration-previews.tsx](../src/app/components/_migration-previews.tsx) |
| F02 工具运行卡 | 新增组合 | 自行设计的工具调用组合；需验收运行、停止、保留已完成步骤及失败重试。 | 无对应原版；[_migration-previews.tsx](../src/app/components/_migration-previews.tsx) |
| F03 列表批量操作 | 新增组合 | 自行设计的批量操作组合；需验收多选、全选、归档和撤销。 | 无对应原版；[_migration-previews.tsx](../src/app/components/_migration-previews.tsx) |
| F04 生成内容审核 | 新增组合 | 自行设计的生成内容审核；需验收接受、拒绝和恢复。 | 无对应原版；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| F05 协作席位 | 新增组合 | 自行设计的协作席位；需验收容量、分派及撤销。 | 无对应原版；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |
| F06 搜索无结果恢复 | 新增组合 | 自行设计的搜索恢复；需验收清空条件、重新搜索及结果反馈。 | 无对应原版；[compositions.tsx](../src/app/components/_fusion/compositions.tsx) |

## 更早引入的四个基础组件

本次也与保存在 `/tmp/forge-pinui-four/` 下的初次参考源码逐项对照。该临时目录可用作本机证据，但不作为仓库的持久依赖。以下同样属于源码结论，不能替代并排动态验收。

| 组件 | 保留能力 | 明确差异 |
| --- | --- | --- |
| [OtpInput](../core/src/components/ui/otp-input.tsx) | 数字交错滚入、错误摇动、裂纹、半壳分开、成功波浪 | 原版包含裂纹加宽和壳体蓄力后抛落的多阶段过程，现实现合并为一条关键帧；成功/失败后原版自动清空复位，现实现保留输入；不内置演示通过码是业务 API 适配。 |
| [CalendarCard](../core/src/components/ui/calendar-card.tsx) | 共享日期高亮、悬停层、数字滚动、月份年份选择、撕页、键盘操作 | 默认中文与主题色属于规范适配；原版在仍选中昨天时跨午夜跟随今天，现实现只在未产生内部选中值时跟随。撕页与过渡虽都有实现，轨迹尚需动态核验。 |
| [LiquidTabs](../core/src/components/ui/liquid-tabs.tsx) | 液态背景融合、选项移动、方向切换、更多分类和行选择 | 原版内容使用 popLayout 同步出入，现实现 mode=wait 先出后进；更多菜单没有 AnimatePresence 退出过程，替换第三个页签时也缺原版标签退出滚动。 |
| [AddMember](../core/src/components/ui/add-member.tsx) | 搜索分页、展开、液态加减、头像飞入及叠放 | 原版确认时按钮、勾与头像错峰弹跳，然后再收起复位；现实现等待业务 Promise 后立即清空，缺确认庆祝时间线。分页保留入场、缺离场错峰；异步失败重试是新增能力。 |

四项均不应标记为与参考实现完全一致。其中 CalendarCard、LiquidTabs 的基本动效结构保留较多，但仍有上述具体差异。
