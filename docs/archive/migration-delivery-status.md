# 迁移交付对账表

基准：本地 main（54598df83bfa）与当前工作区。范围为原迁移目录中保留的 99 项；23 项 defer 不计入本轮。

## 数量汇总

| 口径 | 数量 | 含义 |
|---|---:|---|
| 融合增强条目 | 54 | 目录标记 enhance；扩展或复用已有组件能力，不是新增同等数量的导出组件。其中 F03 是 178 的别名，实际独立增强 Demo 为 53 项。 |
| 组合案例条目 | 45 | 目录标记 compose；用已有组件实现完整场景，状态逻辑通常在案例中。 |
| 新增独立导出 React 组件 | 0 | 相对本地 main；新增类型不算组件。 |
| 实际独立迁移 Demo | 98 | 99 条记录中 F03 与 178 共用一个 Demo。 |
| 涉及的公开组件 / hook | 71 / 1 | 同一组件用于多项，只计一次。 |
| 有匹配且与磁盘一致的示例源码 | 99 / 99 | 已接 ExampleCode；源码可能包含辅助文件，不等于精简的单文件复制示例。 |
| 目标组件顶层参数未检出缺项 | 5 / 99 | 仅核对参数名被列出，不代表说明质量、嵌套字段和回调描述已验收。 |
| 目标组件参数仍有缺项候选 | 94 / 99 | 下表及附表列明；一项依赖多个组件，任一目标缺参数即计入。 |

“54 / 45”是迁移条目数，不能回答为“新增了 45 个组件”。也不能把存在 Demo 和源码说成“参数、演示、代码全部齐全”。

## 此前已集成的四个组件

这四个组件在本次比较基准 main 中已经存在，不能再次算成本轮新增。验证码也被 026 条目复用，不能与 99 项直接相加计算独立功能数量。

| 组件 | 本轮归属 | 参数核对 |
|---|---|---|
| OtpInput | main 已存在 | 待补：value、defaultValue、onChange、onComplete、onSuccess、disabled、autoFocus、name、inputLabel、hint、verifyingLabel、successLabel、errorLabel、clearOnError、className |
| CalendarCard | main 已存在 | 顶层名称已列齐；说明质量仍需核对 |
| LiquidTabs | main 已存在 | 待补：visibleCount、rows、corner、label、moreLabel、emptyLabel、disabled、className |
| AddMember | main 已存在 | 待补：accent、selectedIds、defaultSelectedIds、onSelectionChange、clearOnAdd、open、defaultOpen、onOpenChange、search、disabled、className |

## 99 项逐项对账

参数列检查该条目所有目标组件的完整顶层 API，不只检查 Demo 中用到的参数。数字为缺项候选数；具体参数名见下一张表。组合案例没有单独的 npm 参数接口，业务状态与回调在示例源码中。

| 编号 | 条目 | 归属 | 目标组件 | 参数说明 | Demo | 代码 |
|---|---|---|---|---|---|---|
| 001 | 液态玻璃按钮 | 融合增强 | Button | Button 缺 7 | [已接入](http://localhost:3001/components/button-link#interaction-001) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-buttons.tsx) |
| 002 | 磁吸箭头按钮 | 融合增强 | Button、StyledLink | Button 缺 7；StyledLink 缺 2 | [已接入](http://localhost:3001/components/button-link#interaction-002) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-buttons.tsx) |
| 003 | 长按删除 | 融合增强 | Button | Button 缺 7 | [已接入](http://localhost:3001/components/button-link#interaction-003) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_migration-previews.tsx) |
| 004 | 下载进度按钮 | 融合增强 | Button、ProgressBar | Button 缺 7；ProgressBar 缺 6 | [已接入](http://localhost:3001/components/button-link#interaction-004) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-buttons.tsx) |
| 005 | 纸飞机发送 | 融合增强 | IconButton、Button | IconButton 缺 5；Button 缺 7 | [已接入](http://localhost:3001/components/button-link#interaction-005) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-buttons.tsx) |
| 006 | 墨水涟漪按钮 | 融合增强 | Button | Button 缺 7 | [已接入](http://localhost:3001/components/button-link#interaction-006) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-buttons.tsx) |
| 007 | 播放暂停变形 | 融合增强 | IconButton | IconButton 缺 5 | [已接入](http://localhost:3001/components/button-link#interaction-007) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-buttons.tsx) |
| 008 | 复制完成反馈 | 组合案例 | IconButton、Button、ButtonGroup | IconButton 缺 5；Button 缺 7；ButtonGroup 缺 2 | [已接入](http://localhost:3001/components/button-link#interaction-008) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-buttons.tsx) |
| 009 | 文字滚动按钮 | 融合增强 | Button、StyledLink | Button 缺 7；StyledLink 缺 2 | [已接入](http://localhost:3001/components/button-link#interaction-009) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-buttons.tsx) |
| 010 | 组合操作按钮 | 组合案例 | Button、IconTrigger、DropdownPanel、MenuItem | Button 缺 7；IconTrigger 缺 7；DropdownPanel 缺 2；MenuItem 缺 5 | [已接入](http://localhost:3001/components/button-link#interaction-010) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 011 | 扇形快捷操作 | 组合案例 | IconButton、IconTrigger | IconButton 缺 5；IconTrigger 缺 7 | [已接入](http://localhost:3001/components/menu#interaction-011) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 012 | 书签丝带 | 融合增强 | IconButton | IconButton 缺 5 | [已接入](http://localhost:3001/components/button-link#interaction-012) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-buttons.tsx) |
| 013 | 弹性开关 | 融合增强 | Toggle | Toggle 缺 10 | [已接入](http://localhost:3001/components/input-field#interaction-013) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_migration-toggle-preview.tsx) |
| 014 | 待办清单 | 融合增强 | Checklist | Checklist 缺 3 | [已接入](http://localhost:3001/components/checklist#interaction-014) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 015 | 套餐选择卡 | 组合案例 | RadioWithLabel、RadioButton、SurfaceCard | RadioWithLabel 缺 9；RadioButton 缺 1；SurfaceCard 缺 12 | [已接入](http://localhost:3001/components/input-field#interaction-015) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 016 | 星级评价 | 融合增强 | RatingStars | RatingStars 缺 7 | [已接入](http://localhost:3001/components/comment#interaction-016) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 018 | 滚动数量步进 | 组合案例 | IconButton | IconButton 缺 5 | [已接入](http://localhost:3001/components/input-field#interaction-018) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-buttons.tsx) |
| 019 | 兴趣多选 | 组合案例 | CheckboxControl、CheckboxWithLabel | CheckboxControl 缺 1；CheckboxWithLabel 缺 2 | [已接入](http://localhost:3001/components/input-field#interaction-019) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 021 | 日夜切换 | 融合增强 | Toggle | Toggle 缺 10 | [已接入](http://localhost:3001/components/input-field#interaction-021) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 022 | 点赞心形绽放 | 融合增强 | IconButton | IconButton 缺 5 | [已接入](http://localhost:3001/components/button-link#interaction-022) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-buttons.tsx) |
| 023 | 通知设置展开 | 组合案例 | Toggle、ButtonGroup、Accordion | Toggle 缺 10；ButtonGroup 缺 2；Accordion 缺 1 | [已接入](http://localhost:3001/components/input-field#interaction-023) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 025 | 浮动标签输入 | 融合增强 | TextField | TextField 缺 10 | [已接入](http://localhost:3001/components/input-field#interaction-025) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 026 | 验证码输入 | 融合增强 | OtpInput | OtpInput 缺 15 | [已接入](http://localhost:3001/components/input-field#interaction-026) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 027 | 顶栏搜索展开 | 组合案例 | ToolbarSearchInput、CommandSearch、IconButton | ToolbarSearchInput 缺 6；IconButton 缺 5 | [已接入](http://localhost:3001/components/page-header#interaction-027) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 028 | 自动伸展评论框 | 组合案例 | TextArea、CommentItem、Button | TextArea 缺 5；CommentItem 缺 1；Button 缺 7 | [已接入](http://localhost:3001/components/comment#interaction-028) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 029 | 标签输入 | 融合增强 | TextField | TextField 缺 10 | [已接入](http://localhost:3001/components/input-field#interaction-029) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 030 | 日期区间日历 | 融合增强 | Datepicker | Datepicker 缺 10 | [已接入](http://localhost:3001/components/input-field#interaction-030) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 031 | 自定义选择器 | 融合增强 | SelectOption | SelectOption 缺 8 | [已接入](http://localhost:3001/components/input-field#interaction-031) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_migration-select-preview.tsx) |
| 032 | 拖拽上传 | 融合增强 | FileUpload、FileCard | FileUpload 缺 2；FileCard 缺 2 | [已接入](http://localhost:3001/components/input-field#interaction-032) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 033 | 标题内联编辑 | 组合案例 | TextField、IconButton | TextField 缺 10；IconButton 缺 5 | [已接入](http://localhost:3001/components/input-field#interaction-033) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 036 | 密码强度 | 组合案例 | TextField、IconButton、ProgressBar | TextField 缺 10；IconButton 缺 5；ProgressBar 缺 6 | [已接入](http://localhost:3001/components/input-field#interaction-036) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 037 | 账号切换 | 组合案例 | AppLayout、AppSwitcherDropdown、ProfileCard、MenuItem | AppLayout 缺 46；AppSwitcherDropdown 缺 6；ProfileCard 缺 2；MenuItem 缺 5 | [已接入](http://localhost:3001/components/menu#interaction-037) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 039 | 滑动选中标签 | 融合增强 | TabBar、TabsContent | TabBar 缺 5；TabsContent 缺 7 | [已接入](http://localhost:3001/components/tab#interaction-039) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_migration-tabs-preview.tsx) |
| 040 | AppLayout 侧栏动效 | 融合增强 | AppLayout | AppLayout 缺 46 | [已接入](http://localhost:3001/components/menu#interaction-040) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/prototype/component-fusion/_sidebar-preview.tsx) |
| 041 | 底部导航凹槽 | 融合增强 | TabBar | TabBar 缺 5 | [已接入](http://localhost:3001/components/menu#interaction-041) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 042 | 分步向导 | 组合案例 | Stepper、TextField、SelectOption、Button | Stepper 缺 5；TextField 缺 10；SelectOption 缺 8；Button 缺 7 | [已接入](http://localhost:3001/components/pagination-stepper#interaction-042) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 043 | 分页伸缩 | 融合增强 | Pagination | 顶层名称已列齐 | [已接入](http://localhost:3001/components/pagination-stepper#interaction-043) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_migration-pagination-preview.tsx) |
| 044 | 问答折叠 | 融合增强 | Accordion | Accordion 缺 1 | [已接入](http://localhost:3001/components/grid#interaction-044) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_migration-accordion-preview.tsx) |
| 045 | 菜单由按钮展开 | 组合案例 | IconTrigger、Drawer、MenuItem | IconTrigger 缺 7；Drawer 缺 8；MenuItem 缺 5 | [已接入](http://localhost:3001/components/menu#interaction-045) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 046 | 命令面板 | 融合增强 | CommandSearch、Modal | Modal 缺 9 | [已接入](http://localhost:3001/components/menu#interaction-046) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_migration-command-preview.tsx) |
| 047 | 时间区间切换 | 融合增强 | ButtonGroup | ButtonGroup 缺 2 | [已接入](http://localhost:3001/components/tab#interaction-047) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 048 | 滑动联动标签 | 融合增强 | TabBar、TabsContent | TabBar 缺 5；TabsContent 缺 7 | [已接入](http://localhost:3001/components/tab#interaction-048) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 049 | 层叠内容卡 | 融合增强 | SurfaceCard、IconButton、Button | SurfaceCard 缺 12；IconButton 缺 5；Button 缺 7 | [已接入](http://localhost:3001/components/card#interaction-049) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-cards.tsx) |
| 050 | 光照倾斜卡 | 融合增强 | SurfaceCard、Button | SurfaceCard 缺 12；Button 缺 7 | [已接入](http://localhost:3001/components/card#interaction-050) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-cards.tsx) |
| 054 | 关注个人卡 | 组合案例 | Avatar、Button、SurfaceCard | Avatar 缺 6；Button 缺 7；SurfaceCard 缺 12 | [已接入](http://localhost:3001/components/card#interaction-054) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-cards.tsx) |
| 056 | 月年计费切换 | 组合案例 | ButtonGroup、RadioButton、TextField、Button | ButtonGroup 缺 2；RadioButton 缺 1；TextField 缺 10；Button 缺 7 | [已接入](http://localhost:3001/components/input-field#interaction-056) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 057 | 头像评价轮播 | 组合案例 | ReviewItem、Avatar、IconButton | ReviewItem 缺 5；Avatar 缺 6；IconButton 缺 5 | [已接入](http://localhost:3001/components/comment#interaction-057) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| 058 | 阅读进度卡 | 组合案例 | ProgressBar、Button、SurfaceCard | ProgressBar 缺 6；Button 缺 7；SurfaceCard 缺 12 | [已接入](http://localhost:3001/components/progress#interaction-058) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-feedback.tsx) |
| 059 | 活动报名卡 | 组合案例 | EventCard、ButtonGroup、AvatarGroup、Button | EventCard 缺 2；ButtonGroup 缺 2；Button 缺 7 | [已接入](http://localhost:3001/components/calendar#interaction-059) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| 062 | 登录反馈 | 组合案例 | TextField、Button | TextField 缺 10；Button 缺 7 | [已接入](http://localhost:3001/components/input-field#interaction-062) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 063 | 逐题注册 | 组合案例 | TextField、Button、Stepper | TextField 缺 10；Button 缺 7；Stepper 缺 5 | [已接入](http://localhost:3001/components/input-field#interaction-063) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 066 | 社交登录按钮 | 组合案例 | Button、Avatar | Button 缺 7；Avatar 缺 6 | [已接入](http://localhost:3001/components/button-link#interaction-066) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-buttons.tsx) |
| 067 | 锁定倒计时 | 组合案例 | Button | Button 缺 7 | [已接入](http://localhost:3001/components/button-link#interaction-067) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-buttons.tsx) |
| 070 | 堆叠通知 | 融合增强 | ToastProvider、useToast | ToastProvider 缺 1 | [已接入](http://localhost:3001/components/modal#interaction-070) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-feedback.tsx) |
| 071 | 滑动删除与撤销 | 融合增强 | ListItem、ToastProvider、useToast | ListItem 缺 4；ToastProvider 缺 1 | [已接入](http://localhost:3001/components/list#interaction-071) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-feedback.tsx) |
| 074 | 通知铃菜单 | 组合案例 | IconTrigger、NotificationItem、NotificationBadge、TabBar、DropdownPanel | IconTrigger 缺 7；NotificationItem 缺 3；TabBar 缺 5；DropdownPanel 缺 2 | [已接入](http://localhost:3001/components/list#interaction-074) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 075 | 上传进度面板 | 组合案例 | FileUpload、FileCard、ProgressBar、Accordion | FileUpload 缺 2；FileCard 缺 2；ProgressBar 缺 6；Accordion 缺 1 | [已接入](http://localhost:3001/components/input-field#interaction-075) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 076 | 跟随工具提示 | 融合增强 | Tooltip、TooltipGroup | Tooltip 缺 3 | [已接入](http://localhost:3001/components/tooltip#interaction-076) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-feedback.tsx) |
| 077 | 表情反应面板 | 融合增强 | ChatBubble、IconTrigger、IconButton | ChatBubble 缺 10；IconTrigger 缺 7；IconButton 缺 5 | [已接入](http://localhost:3001/components/chat#interaction-077) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/agent-charts.tsx) |
| 078 | 滑动回复 | 融合增强 | ChatBubble、ChatInputBar | ChatBubble 缺 10 | [已接入](http://localhost:3001/components/chat#interaction-078) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/agent-charts.tsx) |
| 080 | 轨道同步指示 | 组合案例 | SurfaceCard、Button、ProgressBar | SurfaceCard 缺 12；Button 缺 7；ProgressBar 缺 6 | [已接入](http://localhost:3001/components/progress#interaction-080) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-feedback.tsx) |
| 081 | 环形完成反馈 | 融合增强 | Button、ProgressBar | Button 缺 7；ProgressBar 缺 6 | [已接入](http://localhost:3001/components/button-link#interaction-081) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-buttons.tsx) |
| 083 | 队列进度转换 | 融合增强 | ProgressBar | ProgressBar 缺 6 | [已接入](http://localhost:3001/components/progress#interaction-083) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-feedback.tsx) |
| 084 | 语音响应圆点 | 融合增强 | ChatInputBar | 顶层名称已列齐 | [已接入](http://localhost:3001/components/chat#interaction-084) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/agent-charts.tsx) |
| 086 | AI 流式回答 | 融合增强 | StreamingAnswer、ChatInputBar | 顶层名称已列齐 | [已接入](http://localhost:3001/components/agent#interaction-086) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/agent-charts.tsx) |
| 087 | 配送步骤 | 融合增强 | Stepper、HistoryGrouped | Stepper 缺 5；HistoryGrouped 缺 1 | [已接入](http://localhost:3001/components/pagination-stepper#interaction-087) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-feedback.tsx) |
| 088 | 资料夹空态 | 组合案例 | ListGroup、ListItem、Button | ListGroup 缺 1；ListItem 缺 4；Button 缺 7 | [已接入](http://localhost:3001/components/list#interaction-088) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_migration-empty-preview.tsx) |
| 089 | 404 纠错 | 组合案例 | SurfaceCard、Button | SurfaceCard 缺 12；Button 缺 7 | [已接入](http://localhost:3001/components/modal#interaction-089) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-feedback.tsx) |
| 090 | 可重试错误卡 | 组合案例 | SurfaceCard、Button、BarChart、StatCard | SurfaceCard 缺 12；Button 缺 7；BarChart 缺 8；StatCard 缺 3 | [已接入](http://localhost:3001/components/card#interaction-090) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-feedback.tsx) |
| 091 | 离线消息队列 | 融合增强 | ChatBubble、ChatInputBar | ChatBubble 缺 10 | [已接入](http://localhost:3001/components/chat#interaction-091) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/agent-charts.tsx) |
| 092 | 筛选空态恢复 | 组合案例 | FilterPanel、ToolbarSearchInput、ListGroup、Button | FilterPanel 缺 1；ToolbarSearchInput 缺 6；ListGroup 缺 1；Button 缺 7 | [已接入](http://localhost:3001/components/filter#interaction-092) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| 093 | 完成庆祝 | 组合案例 | Checklist、ProgressBar、Button | Checklist 缺 3；ProgressBar 缺 6；Button 缺 7 | [已接入](http://localhost:3001/components/checklist#interaction-093) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/forms-navigation.tsx) |
| 095 | 形态切换柱图 | 融合增强 | BarChart、ChartTooltip、TabBar | BarChart 缺 8；ChartTooltip 缺 1；TabBar 缺 5 | [已接入](http://localhost:3001/components/chart#interaction-095) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/agent-charts.tsx) |
| 096 | 滑动股票折线 | 融合增强 | SmoothLineChart、ChartTooltip、TabBar | SmoothLineChart 缺 8；ChartTooltip 缺 1；TabBar 缺 5 | [已接入](http://localhost:3001/components/chart#interaction-096) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/agent-charts.tsx) |
| 097 | 重排环图 | 融合增强 | DonutChart、ChartLegendItem | DonutChart 缺 6 | [已接入](http://localhost:3001/components/chart#interaction-097) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/agent-charts.tsx) |
| 098 | 实时数字滚动 | 融合增强 | StatCard、LineChartStatCard | StatCard 缺 3；LineChartStatCard 缺 3 | [已接入](http://localhost:3001/components/card#interaction-098) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_migration-number-preview.tsx) |
| 099 | 活动环 | 融合增强 | MultilayerDonutChart | MultilayerDonutChart 缺 4 | [已接入](http://localhost:3001/components/chart#interaction-099) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/agent-charts.tsx) |
| 108 | 时区交集 | 组合案例 | SurfaceCard、Button | SurfaceCard 缺 12；Button 缺 7 | [已接入](http://localhost:3001/components/calendar#interaction-108) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| 110 | 日程冲突修复 | 组合案例 | EventTag、SurfaceCard、Button | EventTag 缺 1；SurfaceCard 缺 12；Button 缺 7 | [已接入](http://localhost:3001/components/calendar#interaction-110) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| 126 | Markdown 编辑与预览 | 组合案例 | TextArea、StreamingAnswer、Button | TextArea 缺 5；Button 缺 7 | [已接入](http://localhost:3001/components/agent#interaction-126) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| 127 | 变更片段审核 | 组合案例 | AgentCodeBlock、Button | Button 缺 7 | [已接入](http://localhost:3001/components/agent#interaction-127) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| 128 | 查找替换 | 组合案例 | TextField、TextArea、Button | TextField 缺 10；TextArea 缺 5；Button 缺 7 | [已接入](http://localhost:3001/components/agent#interaction-128) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| 129 | 代码折叠 | 融合增强 | AgentCodeBlock | 顶层名称已列齐 | [已接入](http://localhost:3001/components/agent#interaction-129) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| 157 | 层叠用量面积 | 融合增强 | SmoothLineChart、ChartCard、ChartLegendItem | SmoothLineChart 缺 8；ChartCard 缺 3 | [已接入](http://localhost:3001/components/chart#interaction-157) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/agent-charts.tsx) |
| 163 | 目标刻度 | 融合增强 | BarHorizontalChart、ChartCard | BarHorizontalChart 缺 5；ChartCard 缺 3 | [已接入](http://localhost:3001/components/chart#interaction-163) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/agent-charts.tsx) |
| 165 | 预测置信带 | 融合增强 | SmoothLineChart、ChartCard、ButtonGroup | SmoothLineChart 缺 8；ChartCard 缺 3；ButtonGroup 缺 2 | [已接入](http://localhost:3001/components/chart#interaction-165) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/agent-charts.tsx) |
| 176 | 版本胶片 | 组合案例 | HistoryGrouped、SurfaceCard、Button | HistoryGrouped 缺 1；SurfaceCard 缺 12；Button 缺 7 | [已接入](http://localhost:3001/components/history#interaction-176) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| 177 | 撤销重做历史 | 组合案例 | Toolbar、IconButton | IconButton 缺 5 | [已接入](http://localhost:3001/components/history#interaction-177) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| 178 | 批量选择操作台 | 融合增强 | Toolbar、Button、Checkbox、FileTypeIcon | Button 缺 7；Checkbox 缺 4 | [已接入](http://localhost:3001/components/list#interaction-178) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_migration-selection-preview.tsx) |
| 179 | 文字片段拼接 | 组合案例 | SurfaceCard、Button | SurfaceCard 缺 12；Button 缺 7 | [已接入](http://localhost:3001/components/agent#interaction-179) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| 180 | 审批签署 | 组合案例 | Avatar、Button、SurfaceCard | Avatar 缺 6；Button 缺 7；SurfaceCard 缺 12 | [已接入](http://localhost:3001/components/card#interaction-180) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| 181 | 工作分派 | 组合案例 | SurfaceCard、Avatar、ProgressBar、Button | SurfaceCard 缺 12；Avatar 缺 6；ProgressBar 缺 6；Button 缺 7 | [已接入](http://localhost:3001/components/card#interaction-181) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| 184 | 角色权限矩阵 | 组合案例 | DataTable、Checkbox | DataTable 缺 7；Checkbox 缺 4 | [已接入](http://localhost:3001/components/table#interaction-184) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| F01 | 附件队列 | 融合增强 | FileUpload、FileCard、ChatInputBar | FileUpload 缺 2；FileCard 缺 2 | [已接入](http://localhost:3001/components/chat#interaction-F01) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/agent-charts.tsx) |
| F02 | 工具运行卡 | 融合增强 | ThinkingTrace、ToolChips | 顶层名称已列齐 | [已接入](http://localhost:3001/components/agent#interaction-F02) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/agent-charts.tsx) |
| F03 | 列表批量操作 | 融合增强 | Toolbar、Button、ListGroup、ListItem | Button 缺 7；ListGroup 缺 1；ListItem 缺 4 | [共用 178](http://localhost:3001/components/list#interaction-178) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_migration-selection-preview.tsx) |
| F04 | 生成内容审核 | 组合案例 | SurfaceCard、Button | SurfaceCard 缺 12；Button 缺 7 | [已接入](http://localhost:3001/components/agent#interaction-F04) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| F05 | 协作席位 | 组合案例 | AddMember、Avatar、AvatarGroup、Button | AddMember 缺 11；Avatar 缺 6；Button 缺 7 | [已接入](http://localhost:3001/components/agent#interaction-F05) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |
| F06 | 搜索无结果恢复 | 组合案例 | FilterPanel、ToolbarSearchInput、ListGroup、Button | FilterPanel 缺 1；ToolbarSearchInput 缺 6；ListGroup 缺 1；Button 缺 7 | [已接入](http://localhost:3001/components/filter#interaction-F06) | [已归档源码](/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/compositions.tsx) |

## 涉及组件的参数缺项与改动

只列定义在 core/src 的参数；不重复统计 React 原生透传属性。自动扫描可能漏掉特殊组织方式的说明，故保留“候选”措辞。上轮手工确认的 Button、OtpInput、AddMember、LiquidTabs 等缺项可参照 documentation-audit-confirmed-findings.md。以下逐项列出，避免把同一个 Button 缺项重复算成多个独立问题。

| 组件 | 本轮新增自定义参数 | 其中未覆盖的新增参数 | 全部未覆盖参数候选 |
|---|---|---|---|
| Accordion | — | — | className |
| AddMember | accent | accent | accent、selectedIds、defaultSelectedIds、onSelectionChange、clearOnAdd、open、defaultOpen、onOpenChange、search、disabled、className |
| AgentCodeBlock | locale、foldRanges、collapsedRangeIds、defaultCollapsedRangeIds、onCollapsedRangeIdsChange | — | 顶层参数名已列齐 |
| AppLayout | — | — | motion、mode、profilePosition、accent、children、logo、logoText、appName、appIcon、appSubtitle、apps、onAppChange、teamName、teamAvatar、teamMemberCount、teamSubtitle、menuSectionLabel、favoriteSectionLabel、teams、menuItems、favoriteItems、profile、notifications、messages、language、defaultLanguage、onLanguageChange、pageHeaderVariant、askAi、onBack、primaryAction、secondaryAction、searchPlaceholder、topbarLeftMode、topbarAccent、pageTitle、breadcrumbs、showDatePicker、showKebab、showFavorite、hideHeader、sidebarWidth、collapsedSidebarWidth、hideSidebarWidgets、teamLabels、showTeamActions |
| AppSwitcherDropdown | locale | locale | locale、appName、appIcon、appSubtitle、apps、onAppChange |
| Avatar | — | — | src、initials、size、color、alt、online |
| AvatarGroup | — | — | 顶层参数名已列齐 |
| BarChart | onActiveIndexChange、onSelect、pinnedIndex、domain、referenceValue、referenceLabel、motion、ariaLabel | onActiveIndexChange、onSelect、pinnedIndex、domain、referenceValue、referenceLabel、motion、ariaLabel | onActiveIndexChange、onSelect、pinnedIndex、domain、referenceValue、referenceLabel、motion、ariaLabel |
| BarHorizontalChart | domain、target、targetLabel、ranges、motion | domain、target、targetLabel、ranges、motion | domain、target、targetLabel、ranges、motion |
| Button | holdDuration、onConfirm、onUndo、confirmed、locale、holdLabels、effect、loading、result、progress、loadingLabel、resultLabel | confirmed、locale、holdLabels、progress、loadingLabel、resultLabel | motion、confirmed、locale、holdLabels、progress、loadingLabel、resultLabel |
| ButtonGroup | — | — | motion、ariaLabel |
| ChartCard | — | — | action、minHeight、className |
| ChartLegendItem | — | — | 顶层参数名已列齐 |
| ChartTooltip | — | — | className |
| ChatBubble | locale、motion、reactions、reactionOptions、onReaction、onReply、replyTo、delivery | locale、motion、reactions、reactionOptions、onReaction、onReply、replyTo、delivery | locale、motion、reactions、reactionOptions、onReaction、onReply、replyTo、delivery、onFileDownload、className |
| ChatInputBar | locale、motion、replyTo、onCancelReply、attachments、hasAttachments、voiceState、voiceLevel、onVoiceStart、onVoiceEnd、onVoiceCancel | — | 顶层参数名已列齐 |
| Checkbox | — | — | checked、color、onChange、motion |
| CheckboxControl | — | — | motion |
| CheckboxWithLabel | — | — | motion、className |
| Checklist | locale | locale | locale、className、motion |
| CommandSearch | locale、color、motion、autoFocus | — | 顶层参数名已列齐 |
| CommentItem | replyLabel | replyLabel | replyLabel |
| DataTable | — | — | onSelectRow、onSelectAll、onSort、footerLeft、footerRight、onPageChange、className |
| Datepicker | locale、confirmSelection、rangeLabels、inline、minDate、maxDate | locale、confirmSelection、rangeLabels、inline、minDate、maxDate | locale、confirmSelection、rangeLabels、inline、minDate、maxDate、placeholder、state、shape、className |
| DonutChart | interactive、activeIndex、onActiveIndexChange、onSegmentToggle、motion、ariaLabel | interactive、activeIndex、onActiveIndexChange、onSegmentToggle、motion、ariaLabel | interactive、activeIndex、onActiveIndexChange、onSegmentToggle、motion、ariaLabel |
| Drawer | transition、revealOrigin、locale、closeLabel | transition、revealOrigin、locale、closeLabel | side、transition、revealOrigin、title、footer、locale、closeLabel、className |
| DropdownPanel | — | — | className、motion |
| EventCard | — | — | width、className |
| EventTag | — | — | className |
| FileCard | locale、color | locale、color | locale、color |
| FileTypeIcon | — | — | 顶层参数名已列齐 |
| FileUpload | locale | locale | locale、className |
| FilterPanel | — | — | className |
| HistoryGrouped | — | — | className |
| IconButton | effect、active、loading、result、progress | loading、result、progress | motion、className、loading、result、progress |
| IconTrigger | initialFocus、panelAlign | initialFocus、panelAlign | onClick、ariaLabel、className、motion、panelPlacement、initialFocus、panelAlign |
| LineChartStatCard | animateValue、locale、numberFormat、motion | — | series、icon、className |
| ListGroup | — | — | className |
| ListItem | onSwipeAction、swipeActionLabel、motion | onSwipeAction、swipeActionLabel、motion | className、onSwipeAction、swipeActionLabel、motion |
| MenuItem | — | — | href、ariaLabel、expanded、className、motion |
| Modal | locale、closeLabel | locale、closeLabel | open、onOpenChange、title、children、footer、motion、locale、closeLabel、className |
| MultilayerDonutChart | sweep、motion、activeIndex、ariaLabel | sweep、motion、activeIndex、ariaLabel | sweep、motion、activeIndex、ariaLabel |
| NotificationBadge | — | — | 顶层参数名已列齐 |
| NotificationItem | — | — | color、className、leadIcon |
| OtpInput | locale、clearOnError | clearOnError | value、defaultValue、onChange、onComplete、onSuccess、disabled、autoFocus、name、inputLabel、hint、verifyingLabel、successLabel、errorLabel、clearOnError、className |
| Pagination | locale、motion | — | 顶层参数名已列齐 |
| ProfileCard | — | — | className、onClick |
| ProgressBar | variant、indeterminate、motion、locale、children、className | variant、indeterminate、motion、locale、children、className | variant、indeterminate、motion、locale、children、className |
| RadioButton | — | — | ariaLabel |
| RadioWithLabel | tabIndex | tabIndex | checked、onChange、label、color、radioPosition、dotColor、disabled、className、tabIndex |
| RatingStars | onChange、readOnly、disabled、locale、ariaLabel、motion | onChange、readOnly、disabled、locale、ariaLabel、motion | className、onChange、readOnly、disabled、locale、ariaLabel、motion |
| ReviewItem | ratingLabel、menuLabel | ratingLabel、menuLabel | ratingLabel、className、onMenuClick、menuLabel、width |
| SelectOption | — | — | motion、placeholder、label、errorMessage、width、className、headerAction、onChange |
| SmoothLineChart | stacked、bands、motion、onActiveIndexChange、ariaLabel、interpolation、highlightToActive、markers | stacked、bands、motion、onActiveIndexChange、ariaLabel、interpolation、highlightToActive、markers | stacked、bands、motion、onActiveIndexChange、ariaLabel、interpolation、highlightToActive、markers |
| StatCard | animateValue、locale、numberFormat、motion | — | trendDirection、action、className |
| Stepper | items、onStepChange、motion、locale、indicator | items、onStepChange、motion、locale、indicator | items、onStepChange、motion、locale、indicator |
| StreamingAnswer | locale | — | 顶层参数名已列齐 |
| StyledLink | effect、motion | effect、motion | effect、motion |
| SurfaceCard | effect、motion | effect、motion | title、subtitle、action、children、footer、padding、className、headerClassName、contentClassName、footerClassName、effect、motion |
| TabBar | appearance、progress | appearance、progress | surface、appearance、progress、motion、ariaLabel |
| TabsContent | panels、onActiveKeyChange、onProgressChange、transition、direction | onProgressChange、direction | children、onProgressChange、direction、id、labelledBy、ariaLabel、className |
| TextArea | — | — | shape、autoGrow、onChange、className、textareaClassName |
| TextField | labelPlacement、locale、activeTag | labelPlacement、locale、activeTag | label、labelPlacement、locale、activeTag、headerAction、tags、onRemoveTag、onChange、className、inputClassName |
| ThinkingTrace | locale、motion | — | 顶层参数名已列齐 |
| ToastProvider | locale、stacked | — | children |
| Toggle | defaultChecked、draggable、thumbIcon | defaultChecked、draggable、thumbIcon | checked、defaultChecked、motion、onChange、color、disabled、size、ariaLabel、draggable、thumbIcon |
| ToolChips | locale、motion、state、result、actions | — | 顶层参数名已列齐 |
| Toolbar | selection、locale、motion | — | 顶层参数名已列齐 |
| ToolbarSearchInput | — | — | value、defaultValue、onChange、onSubmit、ariaLabel、className |
| Tooltip | followCursor | followCursor | motion、delay、followCursor |
| TooltipGroup | — | — | 顶层参数名已列齐 |
| useToast | — | — | hook 方法须单独核对，未计入组件参数覆盖 |

## 验证边界

- Demo 状态依据分类页分派器、99 项渲染测试与源码路由，未在本轮重新逐一点击 99 项。
- 示例代码状态按实际 exampleSourceFiles 解析，并逐文件与磁盘内容比较；复制出来仍可能需要调整项目导入路径。
- 先前浏览器操作记录见 component-fusion-browser-test.md，原版差异见 component-fusion-parity-audit.md；这些记录存在不等于全部状态通过。
- 目录 accepted 保留原值，不以测试通过替用户验收。
- 本表为交付盘点，不补写缺失参数，也不表示已经可以直接发布。

复查：先更新 public-api-comparison.json、documentation-props-audit.json 和示例源码归档，再执行 `node scripts/audit-migration-delivery.mjs`。
