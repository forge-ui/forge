# Agent/chart 与组合案例只读审计

基线：`1795b1bacf055684f2cc4e666ac8c65d4cbec20a`。32项逐项读源码、核心能力与原型逻辑；独立SSR192次通过。

## 确认问题

### AC-01 [P2] 少于六项的反应面板向上导航会产生负索引
- 位置：`/Users/hesong/Documents/gihub_space/forge/core/src/internal/chat-interactions.tsx:32`
- 触发：给ChatBubble提供5个reactionOptions，打开面板，首项按ArrowUp。
- 影响：cursor=-1，焦点留首项且全部按钮tabIndex=-1，roving focus失效。
- 证据：独立/tmp/forge-audit-c/run.mjs：before=0 after=0 tabs=[-1,-1,-1,-1,-1]。默认12项掩盖边界。
- 建议：使用双取模归一化或按实际行列夹取；增加1/3/5项键盘测试。

### AC-02 [P2] 年度柱图固定柱宽撑破窄屏页面
- 位置：`/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/bar-chart.tsx:95`
- 触发：390px视口打开095，切年。
- 影响：12根固定w-8柱加标签最小宽度大于绘图区，整页横向溢出，末月份超屏。
- 证据：root Chrome：document.scrollWidth458/client375；case.clientWidth311/scrollWidth426；10/11/12月右缘394/426/458；/tmp/forge-audit-chart-095.png。
- 建议：柱列min-w-0，并按可用槽位限制柱宽或明确局部横向滚动，避免页面溢出。

### AC-03 [P2] 柱图参考线与柱形不共用数值坐标
- 位置：`/Users/hesong/Documents/gihub_space/forge/core/src/components/ui/charts/bar-chart.tsx:63`
- 触发：095显示标签及均值参考线，比较参考线位置与柱形绘图区比例。
- 影响：参考值用含标签整高定位，border位于有文本高度span顶部；参考值位置不等于数据值对应y，误导均值比较。
- 证据：root Chrome年度：外容器192px、柱区168px、参考比例62.9808%、span高17px；实测lineTop=-2568.8047，按柱区应=-2560.6905，偏8.114px。无标签时仍有span高度偏移。
- 建议：将reference放入与柱相同绘图区，线用零高层定位、文字独立放置。

### AC-04 [P2] 变更审核中的代码/差异切换没有接入状态
- 位置：`/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/composition-editing.tsx:44`
- 触发：打开127待审核状态，点击代码（Code）。
- 影响：可点击tab无反应，无法查看代码视图；示例传递错误的受控组件用法。
- 证据：/tmp/forge-audit-c/interaction.mjs：点击Code前后pre完全一样，同时显示return7删除行和return3新增行。
- 建议：用独立view state和onViewChange，或在固定diff展示时不显示不可用切换控件。

### AC-05 [P2] 协作席位的添加成员面板没有跟随三主题
- 位置：`/Users/hesong/Documents/gihub_space/forge/core/src/styles/tokens.css:1016`
- 触发：F05将主题由蓝切到紫或黑。
- 影响：席位切主题但添加成员面板持续青蓝，与本轮蓝/紫/黑约束及主题选择器不一致。
- 证据：root Chrome：--accent=#7239ea，.forge-member__shell background=rgb(105,216,223)，--forge-member-panel=#69d8df。既有AddMember默认CSS被新case直接带入。
- 建议：为AddMember公开/透传accent或在正式组合中明确接入theme变量；保持原生结构动效。

### AC-06 [P3] 目标刻度的可视金额与朗读单位相差十倍
- 位置：`/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/agent-charts-plots.tsx:81`
- 触发：163读滑杆无障碍名称，对比可见Target ¥70K。
- 影响：可见值单位千元，aria-label中英文写万元/10K，辅助技术给出错误金额尺度。
- 证据：源码和SSR：visible ¥74K / ¥70K，aria-label 季度目标（万元）/Quarterly target (10K)；原型$K一致。
- 建议：统一为千元/K，或者整体数值与可见单位都用万元。

### AC-07 [P3] 评价轮播带有未命名且无效的更多按钮
- 位置：`/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/composition-workflow.tsx:28`
- 触发：057评价卡右上更多按钮，鼠标点击或键盘聚焦。
- 影响：按钮无可访问名称且无handler；给用户和读屏提供无效操作。
- 证据：192次SSR仅057出现无名button；JSDOM读取React props确认onClick为undefined；源core review-item.tsx176–185总渲染该按钮。
- 建议：不传onMenuClick时隐藏原生菜单按钮，或case提供真正菜单和本地化名称。

## 逐项覆盖

| ID | 名称 | 读查结果 | 问题 |
|---|---|---|---|
| 077 | 表情反应面板 | 核对计数增减、选中态、选项加入/移除、受控回调、Esc/点击外侧、焦点恢复；原型12项键盘网格迁入ChatReactions。5项复用发现负索引。 SSR6/6。 | AC-01 |
| 078 | 滑动回复 | 核对60px滑动阈值、pointercancel/lostcapture不重复回复、引用上下文随消息发送、回复清空、typing定时器unmount清理。原型自动聚焦输入未保留，列体验核对，不夸大为功能阻断。 SSR6/6。 | 无确定缺陷 |
| 084 | 语音响应圆点 | 核对按住/松开/取消/blur/unmount回调守卫、录音音量RAF清理、识别计时器清理、系统reduced与none；本地模拟音量/文字有明确说明。 SSR6/6。 | 无确定缺陷 |
| 086 | AI 流式回答 | 核对streaming/stopped/complete、停止保留、重新生成key、新问题重置、35ms更新清理；StreamingAnswer保留grapheme、流状态与减少动效。 SSR6/6。 | 无确定缺陷 |
| 091 | 离线消息队列 | 核对offline→connecting→online、连接中再次断开、按序发送queued、重新断开取消计时器、unmount清理；不把未接真实网络当缺陷。 SSR6/6。 | 无确定缺陷 |
| F01 | 附件队列 | 核对多文件唯一ID、重选同文件input复位、失败仅一个uploading项、retry重置0、删除/发送清空、未完成禁止发送；与原型同样需要正文。 SSR6/6。 | 无确定缺陷 |
| F02 | 工具运行卡 | 核对idle/running/error/cancelled/success、失败保留完成步骤、重试当前步骤、停止/重置、展开明细保留状态，Solar状态图标。 SSR6/6。 | 无确定缺陷 |
| 095 | 形态切换柱图 | 核对周/月/年总额/均值/较前项、切周期清pin/active、受控键盘首尾/左右/Enter固定；Chrome发现年度窄屏溢出及均值线坐标错位。 SSR6/6。 | AC-02, AC-03 |
| 096 | 滑动股票折线 | 核对61点种子固定、首尾值、今日时间映射、事件index提示、切周期active复位、键盘边界、曲线分段高亮；插值RAF取消与数据变更。 SSR6/6。 | 无确定缺陷 |
| 097 | 重排环图 | 核对排除分类后分母重算、至少保留一类、hover/focus中心值及占比、独立环段键盘Enter/空格；动画中值非数据真值不误报。 SSR6/6。 | 无确定缺陷 |
| 099 | 活动环 | 核对7日×3指标、目标500/30/12、>100额外环、天数计数、日期roving tabindex、Home/End、聚焦指标高亮。 SSR6/6。 | 无确定缺陷 |
| 157 | 层叠用量面积 | 核对逐层累计上下界、隔离时回到原始序列/固定0–180domain、周总和与占比实时计算、再次选择恢复全部。 SSR6/6。 | 无确定缺陷 |
| 163 | 目标刻度 | 核对固定0–100横轴、目标40–100步长2、阈值50/75/100、差额/达成率；发现可见K与无障碍万元单位不一致。 SSR6/6。 | AC-06 |
| 165 | 预测置信带 | 核对forecastFrom=4实/虚线边界、历史区间零宽、末端80%±14/95%±26、固定0–160domain及带闭合几何。 SSR6/6。 | 无确定缺陷 |
| 057 | 头像评价轮播 | 核对头像/前后切换、5.2s轮播、hover/focus/reduced暂停、cleanup；现用ReviewItem多渲染无名无handler菜单按钮。原型拖动切换/计时视觉没有保留，仅列保真核对。 SSR6/6。 | AC-07 |
| 059 | 活动报名卡 | 核对RSVP 3态、参加人数/剩余名额一致、calendar切换和aria-pressed、ButtonGroup键盘；本地日程状态演示不要求真实日历服务。 SSR6/6。 | 无确定缺陷 |
| 092 | 筛选空态恢复 | 核对错词纠正、3条件真实过滤、每项放宽计数、草稿筛选应用/取消/重置、清空聚焦、显示结果；范围由原型逻辑扩充。 SSR6/6。 | 无确定缺陷 |
| 108 | 时区交集 | 核对UTC小时0–23、日期、Intl跨日/DST本地时间、9≤hour<18工作窗；浏览器原生date约束，暂无确定失败。 SSR6/6。 | 无确定缺陷 |
| 110 | 日程冲突修复 | 核对14:30–15:30与14:00–15:00重叠30分钟，移动15点及撤销；颜色语义和reduced。 SSR6/6。 | 无确定缺陷 |
| 126 | Markdown 编辑与预览 | 核对编辑/预览切换、Markdown保留/安全skipHtml、autoFocus/Esc、动画mode wait与none；未把简化编辑器当缺陷。 SSR6/6。 | 无确定缺陷 |
| 127 | 变更片段审核 | 核对接受/保留/撤销正文变化；发现代码/差异控件因固定受控view且缺少onViewChange无效，JSDOM确定复现。 SSR6/6。 | AC-04 |
| 128 | 查找替换 | 核对字面split而非regex、0匹配禁用、全部替换、单步撤销，转义由React处理。 SSR6/6。 | 无确定缺陷 |
| 129 | 代码折叠 | 核对1-based折叠区间、首行保留、全折/全开、嵌套允许交叉拒绝/重复过滤、controlled回调、复制完整代码及失败状态和timer清理。 SSR6/6。 | 无确定缺陷 |
| 176 | 版本胶片 | 核对选中预览独立live版本、恢复/当前禁用、切换后标记、radius/angle在none与system reduced时duration0。 SSR6/6。 | 无确定缺陷 |
| 177 | 撤销重做历史 | 核对最多12历史、undo/redo边界、分支编辑抛弃redo、edits计数不因截断停滞、三种形状操作、减少动效。 SSR6/6。 | 无确定缺陷 |
| 179 | 文字片段拼接 | 核对选择顺序拼接、再次选择删除、清空禁用/恢复、中文无空格英文空格、Solar清空图标及状态。 SSR6/6。 | 无确定缺陷 |
| 180 | 审批签署 | 核对起草→复核→批准、通过/重置状态、三人完成标记及Solar箭头，减少动效。 SSR6/6。 | 无确定缺陷 |
| 181 | 工作分派 | 核对初始负载2/1/3、上限5、共9次可分派、全部满载提示、任务进度和reset、真实TaskCard/ProgressBar组合。 SSR6/6。 | 无确定缺陷 |
| 184 | 角色权限矩阵 | 核对3×3受控权限、所有者锁定、可操作项aria-label明确、table横向滚动边界、全状态无业务权限副作用。 SSR6/6。 | 无确定缺陷 |
| F04 | 生成内容审核 | 核对两项独立接受/保留/撤销、删除新增内容显隐、已审核计数、移除动画保留原内容状态，减少动效。 SSR6/6。 | 无确定缺陷 |
| F05 | 协作席位 | 核对移除负责人后切下一人、移除全部后添加恢复负责人、候选人不重复、AddMember异步状态/清空选择；Chrome确认面板主题未接入。 SSR6/6。 | AC-05 |
| F06 | 搜索无结果恢复 | 核对设计错词纠正、PDF/最近/团队真实数据过滤、放宽恢复数、草稿应用与取消。原型空态插画动效未保留，列保真核对。 SSR6/6。 | 无确定缺陷 |

## 边界

- 192 SSR renders do not prove visual theme correctness; browser findings attributed to root Chrome verification.
- No product code, tests, git commits, push or npm changed.
- No claim every gesture was browser exercised. Source review inspected each case, core capability, original prototype logic; user acceptance remains separate.

## 设计核对（不算确定缺陷）

- F05 native AddMember typography 17px/800 title and15.5px/700 names differs from nearby case typography; needs design comparison, not filed as definite bug.
- 057 original swipe/progress timing decoration and F06 animated empty illustration omitted. Functional catalog promises retained; visual fidelity should be reviewed if original motion is acceptance baseline.
