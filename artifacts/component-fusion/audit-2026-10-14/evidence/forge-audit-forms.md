# Forms / existing migration audit

Commit: 1795b1bacf055684f2cc4e666ac8c65d4cbec20a

只读审计 41 项；7条确认源码/DOM问题。无产品修改。

## Findings

### [P2] FORM-01 内联日期点击起止标签会清空尚未应用的区间

- core/src/components/ui/forms/datepicker.tsx:254；相关ID 030；迁移新增

- 证据：inline=true时日历已显示但open初值false；选择14–17后点击End，before=[StartOct14,EndOct17]，after=[StartSelect date,EndSelect date]且Apply disabled=true。

- 验证：/tmp/forge-audit-forms-runtime.log INLINE_END_TRIGGER_RESETS_DRAFT

- 建议：inline内切换端点不得重新初始化草稿；仅由真正关闭到打开时同步已提交值。

### [P2] FORM-02 受控日期外部更新不会同步确认草稿

- core/src/components/ui/forms/datepicker.tsx:98；相关ID 030；迁移新增

- 证据：rangeStart/end由2026-10-14/17改成11-10/12，inline confirmSelection仍显示10月并Apply回调旧值。

- 验证：/tmp/forge-audit-forms-runtime.log CONTROLLED_RESET

- 建议：定义并实现外部值变化与正在编辑draft的同步/取消策略，覆盖异步加载和重置。

### [P2] FORM-03 禁用焦点日期后没有键盘可进入的日期

- core/src/components/ui/forms/datepicker.tsx:390；相关ID 030；迁移新增

- 证据：value=Oct1,minDate=Oct15,inline：31个day中enabledTabStops=0，唯一tabIndex0是disabled Oct1。

- 验证：/tmp/forge-audit-forms-runtime.log MIN_DATE_FOCUS

- 建议：聚焦项先clamp到合法范围/首个可选日，月份导航后维持至少一个可用tab stop。

### [P2] FORM-04 月末PageDown跳过整个月

- core/src/components/ui/forms/datepicker.tsx:164；相关ID 030；迁移新增

- 证据：2026-01-31按PageDown得到Mar3,2026，无法按预期跳到Feb28。

- 验证：/tmp/forge-audit-forms-runtime.log PAGE_DOWN_FROM_JAN31

- 建议：先设置目标年月，再将日clamp到该月最后一天。

### [P2] FORM-05 禁用TextField仍允许删除标签

- core/src/components/ui/forms/text-field.tsx:107；相关ID 029；基线已有/此次case暴露

- 证据：disabled=true且传onRemoveTag：input.disabled=true但点移除Forge会调用onRemoveTag一次。54598df8同样存在。

- 验证：/tmp/forge-audit-forms-runtime.log DISABLED_TAG_REMOVAL

- 建议：禁用状态不渲染可操作移除按钮或禁用按钮并阻止回调；覆盖state=disabled与disabled两入口。

### [P2] FORM-06 搜索展开动效在空容器初次挂载时就已播放

- src/app/components/_fusion/forms-navigation-menus.tsx:72；相关ID 027；迁移新增

- 证据：forge-fn-search容器始终挂载，只有内部CommandSearch随open挂载；CSS33行animation无条件声明，data-open未参与任何动画选择器。点击展开只加入内容，无法重启动画。

- 验证：源码确认；实际浏览器动画轨迹待root验证

- 建议：让动画随open进入/退出触发，或用保留退出的MotionPresence；覆盖第二次展开。

### [P2] FORM-07 英语case仍暴露内置中文菜单和可访问名称

- core/src/components/layouts/sidebar-popovers.tsx:199；相关ID 040, 037, 074；基线已有/此次case暴露

- 证据：040切英语后ProfileDropdown硬编码编辑资料/修改密码/系统设置/退出登录，无locale可传；导航/折叠aria中文。037 menu aria-label应用切换固定；074未传ButtonGroup ariaLabel默认选项组。

- 验证：源码确认；root可点击040英语头像验证可见文本

- 建议：将内置菜单与导航标签纳入本地化，并在正式case传入locale/可访问label。

## Per-item coverage

全部41项已读正式case、对应core关键实现、原型快照文本和事件入口。未逐项进行浏览器验证；无发现表示未发现额外可确认问题，不等于视觉验收通过。

| ID | 名称 | 检查 | 结果 |

|---|---|---|---|

| 014 | 待办清单 | 稳定task id映射；完成延迟排序与反选；完成计数；locale状态播报；计时器清理 | 无新增确认问题；浏览器待验 |

| 015 | 套餐选择卡 | radiogroup方向键和循环；选中受控；价格与计划一致；三色token | 无新增确认问题；浏览器待验 |

| 016 | 星级评价 | 只读默认；键盘0/End/方向键；hover预览与真实值分离；disabled；SSR和DOM测试 | 无新增确认问题；浏览器待验 |

| 019 | 兴趣多选 | 5项上限；重复取消；第6项不改变选择；警告status；可访问名称 | 无新增确认问题；浏览器待验 |

| 021 | 日夜切换 | 昼夜状态和Solar图标；可访问switch；CSS减少动效与三色景色 | 无新增确认问题；浏览器待验 |

| 023 | 通知设置展开 | email内容关闭inert/aria-hidden；频率保留；全部关闭；toggle键盘与计数 | 无新增确认问题；浏览器待验 |

| 025 | 浮动标签输入 | 真实label绑定；required/email原生约束；浮动标签CSS；修改后清除成功状态 | 无新增确认问题；浏览器待验 |

| 026 | 验证码输入 | 外部Promise验证；pending只读；请求generation和卸载失效；数字清洗；重发计时清理；中英文默认 | 无新增确认问题；浏览器待验 |

| 028 | 自动伸展评论框 | maxLength500；空白禁发；发布追加+清空+focus；autoGrow受控value重新测量 | 无新增确认问题；浏览器待验 |

| 029 | 标签输入 | 标签数量6上限/大小写去重；中文IME跳过快捷键；两次Backspace；删除按钮；disabled边界 | FORM-05 |

| 030 | 日期区间日历 | 区间draft/Apply；倒序归一；hover；min/max；键盘跨月；外部reset；标签重新定位，5项DOM探针中4项日历缺陷 | FORM-01, FORM-02, FORM-03, FORM-04 |

| 032 | 拖拽上传 | 本地FileReader真实进度；50MB筛选；唯一id；abort/remove/retry；卸载清理；上传状态与外部数值clamp | 无新增确认问题；浏览器待验 |

| 033 | 标题内联编辑 | 编辑聚焦/select；Enter保存/Escape撤销；空值错误；onBlur提交；与原型保存/取消按钮对照（移动取消路径需设计确认） | 无新增确认问题；浏览器待验 |

| 036 | 密码强度 | 4项格式条件；可见密码toggle；aria-pressed；提示未误称安全评级；Solar状态图标 | 无新增确认问题；浏览器待验 |

| 056 | 月年计费切换 | 月/年倍率10；plan和席位约束；键盘radio/ButtonGroup；确认状态随选择重置 | 无新增确认问题；浏览器待验 |

| 062 | 登录反馈 | email/required/minLength原生校验；CapsLock键盘检测；autocomplete；明确区分输入校验和认证结果 | 无新增确认问题；浏览器待验 |

| 063 | 逐题注册 | 3步状态边界；后退保留输入；required/email/password约束；末页和重新填写；输入焦点effect | 无新增确认问题；浏览器待验 |

| 075 | 上传进度面板 | 复用上传队列+Accordion；折叠隐藏不可聚焦；进度外部驱动；remove/abort/retry生命周期 | 无新增确认问题；浏览器待验 |

| 093 | 完成庆祝 | 4/4庆祝条件；重新开始重置；CSS动画关闭；checklist延迟归位期间状态映射 | 无新增确认问题；浏览器待验 |

| 010 | 组合操作按钮 | 选择/执行分离；menuitemradio；初始选中focus；方向键/Home/End；选择后close恢复trigger | 无新增确认问题；浏览器待验 |

| 011 | 扇形快捷操作 | 封闭菜单inert+visibility:hidden；方向键roving；Escape/选择恢复trigger；外部pointer关闭；小屏媒体规则 | 无新增确认问题；浏览器待验 |

| 027 | 顶栏搜索展开 | 展开受控；选择结果；Escape/外部点击关闭；搜索筛选/键盘；检查CSS入场触发时机 | FORM-06 |

| 037 | 账号切换 | 应用受控选中；open后focus选中；切换恢复trigger；Escape/外部点击；英语内部aria缺口 | FORM-07 |

| 041 | 底部导航凹槽 | dock样式；tab-panel关联；方向键/Home/End；badge；滑动panel出口inert | 无新增确认问题；浏览器待验 |

| 042 | 分步向导 | 4步form；required/email校验；角色；后退状态保留；出口单一子树和焦点；动效中下一步输入焦点需浏览器验证 | 无新增确认问题；浏览器待验 |

| 045 | 菜单由按钮展开 | revealOrigin视口换算；dialog/native cancel；关闭按钮；子菜单选择关闭；reduced时无WAAPI | 无新增确认问题；浏览器待验 |

| 047 | 时间区间切换 | 4组数据与收入求和；周期键盘切换；图表固定yDomain；三主题 | 无新增确认问题；浏览器待验 |

| 048 | 滑动联动标签 | scroll fractional progress；active controlled反馈；mouse drag/cancel/skipClick；resize回位；非active panel inert；触摸惯性需浏览器 | 无新增确认问题；浏览器待验 |

| 074 | 通知铃菜单 | 未读去重；全部已读；mentions过滤；首次focus；关闭Escape；弹层max宽度；英文ButtonGroup默认aria标签待完善 | FORM-07 |

| 003 | 长按删除 | 1200ms长按；提前松开/blur/escape取消；disabled和卸载timer；controlled confirmed；undo焦点；减少动效保留长按时序 | 无新增确认问题；浏览器待验 |

| 013 | 弹性开关 | 拖动阈值/scale修正；pointer cancel；受控更新取消拖动；skipClick；键盘；禁用逻辑 | 无新增确认问题；浏览器待验 |

| 031 | 自定义选择器 | selected/disabled受控；全部选项滚动；方向键/typeahead/Enter/Escape/Tab；关闭inert；新增description兼容普通选项 | 无新增确认问题；浏览器待验 |

| 039 | 滑动选中标签 | 切换动画单个业务子树；快速反向中断；焦点/inert；任务状态在上层保留；tab id关联 | 无新增确认问题；浏览器待验 |

| 040 | AppLayout 侧栏动效 | 嵌入真实AppLayout；postMessage origin/source校验；菜单最长路径匹配；折叠保持DOM；手机inert和菜单关闭；英语内置个人菜单缺口 | FORM-07 |

| 043 | 分页伸缩 | 自适应数字窗口；parent ResizeObserver；page受控；缩总页数case同步clamp；first/last按钮；中文ARIA | 无新增确认问题；浏览器待验 |

| 044 | 问答折叠 | 单项受控/非受控；动态内容高度；关闭focus回标题；嵌套heading过滤；键盘；减少动效 | 无新增确认问题；浏览器待验 |

| 046 | 命令面板 | 按group展现顺序导航；IME保护；空态；新建文档/静音状态；native dialog和Escape；root报告真实Chrome Escape异常 | 无新增确认问题；浏览器待验 |

| 088 | 资料夹空态 | 创建5上限/序号；删除focus；模拟重试/空搜索恢复；定时器/WAAPI清理；关动效立即完成；退场按钮可达性需浏览器 | 无新增确认问题；浏览器待验 |

| 098 | 实时数字滚动 | Intl parts；位数key；负号/小数/币种；sr-only一次完整读数；减少动效；图表跟随收入 | 无新增确认问题；浏览器待验 |

| 178 | 批量选择操作台 | 受控选择/全选；归档与撤销；隐藏toolbar inert；焦点恢复；退出row inert；count非法输入归一 | 无新增确认问题；浏览器待验 |

| F03 | 列表批量操作 | 复用178同一正式组合；选择/清空/归档/撤销；原型非HTML依赖；批量行为非新公共组件 | 无新增确认问题；浏览器待验 |

## Additional review notes

- 033: 原型支持点击标题进入编辑，含显式保存/取消按钮；正式case只有铅笔入口、Enter/blur保存和Escape撤销。手机用户没有明显撤销入口。非必然功能bug，但属于迁移简化，应由设计确认。

- 042: useEffect(step)聚焦执行时slide仍显示退出子树，新输入在140ms后才装载。下一步最终焦点可能停在tabpanel而不是输入，需真实浏览器确认。

- 046: root本轮真实Chrome报告Escape后input失焦至BODY，但dialog仍open=true/state=open；关闭按钮正常。不是本子agent独立复现，不将JSDOM结果覆盖该异常。

## Root browser confirmation
- 030：Chrome选择14–17显示3晚，点结束日期后两项清空且应用禁用，确认FORM-01。
- 027：Chrome开关前后容器animationName均forge-fn-search-in/.35s，支持FORM-06源码判断，未逐帧采样。
- 本子agent未重跑41项SSR。仅现有8测试+5新增DOM探针。
