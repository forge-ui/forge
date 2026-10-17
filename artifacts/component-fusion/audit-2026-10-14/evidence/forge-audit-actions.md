# Action 26 项只读审计

提交 1795b1ba。未改产品源码、未commit/push/npm。

## 确定发现

### P2 A1 章节导航重复扣除滚动容器偏移

/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-feedback.tsx:15

触发：点击阅读卡片“精简/验证”或滚动切换当前章节
影响：章节跳转位置提前约132px，当前章节高亮提前切换
证据：root Chrome: article.offsetTop=132, section.offsetTop=223, clicked scrollTop=91; 标题距可视区域顶部132.49px。section.offsetTop已相对position:relative article。
修复建议：滚动及current判定使用section.offsetTop，同一坐标系并处理最后一节。

### P2 A2 滑动删除接受右键和不匹配的pointerup

/Users/hesong/Documents/gihub_space/forge/core/src/internal/swipe-row.tsx:10

触发：右键按下并左拖超过100px；或pointer1拖动后pointer2抬起
影响：非主操作/其他手指能够调用不可逆业务onAction
证据：独立JSDOM /tmp/forge-audit-actions-swipe.mjs: RIGHT_DRAG_DELETE_COUNT 1; UNRELATED_POINTER_UP_DELETE_COUNT 2。原型071明确拒绝e.button!==0。
修复建议：down过滤主按钮/isPrimary，up和cancel匹配pointerId，释放capture。

### P2 A3 键盘删除邮件后焦点掉回body

/Users/hesong/Documents/gihub_space/forge/src/app/components/_fusion/actions-feedback.tsx:31

触发：Tab聚焦任一删除按钮并按Enter/Space
影响：按钮随行卸载，键盘用户失去列表位置；撤销也未恢复该行焦点
证据：/tmp/forge-audit-actions-flows.log: 071_AFTER_DELETE_ACTIVE_ELEMENT BODY；原型071会聚焦下一行及撤销后的首行。
修复建议：删除前记录邻项/按钮ref，删除后移至下项、上项或空态/撤销；undo聚焦恢复行。

### P3 A4 倾斜卡片光斑写死蓝色

/Users/hesong/Documents/gihub_space/forge/core/src/styles/tokens.css:1231

触发：050切换紫色或黑色并悬停卡片
影响：主体主题已切换，光斑仍为blue，不符合主题一致性
证据：forge-surface-card[data-effect="tilt"]:before radial-gradient直接使用--color-fg-blue；SurfaceCard无color/token override，case只设置--fusion-accent。静态确定，浏览器截图未采集。
修复建议：使用可覆盖的主题CSS变量并让case传当前主题。

## 逐项覆盖

每项均额外阅读原型、core、CSS和默认API父提交差异，并独立运行双语三主题SSR。无发现不等于全部浏览器验收。

- 001 液态玻璃按钮：Button glass/loading/result; background remains case-owned; cancel clears staged timers; reduced CSS decorations disabled。结论：运行取消通过；静态未发现功能缺陷。

- 002 磁吸箭头按钮：Button magnetic mouse move/leave, disabled/reduced guards, pointer direction, theme and onclick state。结论：未发现确定功能缺陷；真实指针物理效果留浏览器。

- 004 下载进度按钮：download progress finite/clamped, loading duplicate click blocking, cancellation before completion and reset。结论：运行取消通过。

- 005 纸飞机发送：send→loading→success state; cancel invalidates delayed loading; icon result public API。结论：运行取消通过。

- 006 墨水涟漪按钮：subscribe/unsubscribe, aria-pressed, count +1/-1, ripple reduced guard。结论：运行双向toggle通过。

- 007 播放暂停变形：play/pause interval cleanup, range input accessible name/keyboard, 100% restart and icon progress。结论：静态未发现确定功能缺陷；连续path morph已改为Solar替换与旋转。

- 008 复制完成反馈：clipboard rejected/resolved, unmount guard, reset timer, Tooltip keyboard label。结论：运行拒绝分支通过；多包管理器切换未保留，视融合取舍。

- 009 文字滚动按钮：roll label accessible DOM, hover/focus CSS, reduce removes transitions, toggle content。结论：静态未发现确定功能缺陷；屏幕阅读器对CSS伪元素发音尚未实机验证。

- 012 书签丝带：bookmark state/count symmetry; accessible label and pressed state。结论：运行双向toggle通过。

- 018 滚动数量步进：1–10 seat limits, disabled bounds, quantity output/total。结论：运行越界重复点击通过；原逐位滚数变成整体淡入位移。

- 022 点赞心形绽放：like/count symmetry, Solar outline/duotone, pressed accessibility。结论：运行双向toggle通过。

- 066 社交登录按钮：provider collapse inert, connecting lock, cancel timer, reset focus, email required/type validation, brand assets exception。结论：运行连接中取消/Apple焦点恢复通过；原核心交互已保留。

- 067 锁定倒计时：countdown timer cleanup, sign-in disabled before zero, password email one-shot。结论：静态未发现确定功能缺陷；12秒完整解锁未额外运行。

- 081 环形完成反馈：payment progress/step/receipt state, loading lock, cancel/replay。结论：运行取消通过。

- 049 层叠内容卡：SurfaceCard layered effect, hover/focus preview, bookmark, expand button, original versus official reveal。结论：静态检查；失焦后不自动收起与原版不同，非阻断取舍。

- 050 光照倾斜卡：SurfaceCard tilt reduced/touch guards, read/unread button, theme variables。结论：A4主题光斑固定蓝色。

- 054 关注个人卡：follow count, recommendation state, lang switching identity, prior prototype odometer。结论：直接props切语言复现推荐关注状态丢失；正式wrapper整体重挂载掩盖，记录观察。

- 058 阅读进度卡：scroll offset, current section, progress ring and time estimate, keyboard focus container。结论：A1浏览器确认重复减坐标。

- 070 堆叠通知：toast provider update identity, loading indefinite→success timeout, stacked CSS, action callbacks, pointer cancellation, focus/hover pause。结论：静态未发现确定功能缺陷；多条堆叠视觉和dialog内toast层级未实机覆盖。

- 071 滑动删除与撤销：swipe threshold/direction/cancel, multi-pointer identity, secondary mouse, delete/undo focus flow。结论：A2右键/跨pointer错误删除，A3删除丢键盘焦点；运行undo通过。

- 076 跟随工具提示：TooltipGroup warm delay, keyboard immediate show/Escape, viewport clamping, portal/dialog ownership and cleanup。结论：静态检查未发现本轮新确定问题；真实边缘/弹层交叉仍由root覆盖。

- 080 轨道同步指示：sync tick cleanup, pause/resume/done restart, orbit animation reduced rules。结论：静态未发现确定功能缺陷；到90%显示all up to date较早，文案观察非阻断。

- 083 队列进度转换：queued→building→done and queued/building cancel cleanup, indeterminate aria and logs。结论：运行队列取消后1.7秒不重启通过。

- 087 配送步骤：Stepper item current single marker, moving indicator, chronological logs, replay, legacy dots compatibility。结论：运行4步及回放通过。

- 089 404 纠错：correction frame timers, choosing during typing disabled, corrected/reset state, compass mouse/reduce handling。结论：运行纠正/回放通过；系统reduce打字timer未加速，装饰差异观察。

- 090 可重试错误卡：countdown immediate retry cancel, first retry failure second success, disable duplicates, unmount cleanup/error details。结论：运行失败→重试→成功通过。

## 验证边界

156 SSR组合通过；17真实JSDOM状态流程通过；对抗pointer用例确认缺陷。058有root Chrome布局证据。其余完整视觉、触屏和屏幕阅读器需要root实机复核。

## 原有API回归检查

- Button default variants/sizes/classes retained; native callbacks forwarded once; added spans and use-client boundary inspected, no demonstrated functional default break

- IconButton original disabled/type/classes and callback retained; active/loading additive

- ListItem without onSwipeAction returns original content unchanged

- ProgressBar linear rendering retains legacy colors/sizes and adds finite-value clamp; ring/indeterminate additive

- Stepper without items retains original total/current dots; items branch additive

- SurfaceCard previous class/slots preserved; new use-client and section attrs inspected

- Tooltip portal migration is broad; viewport/dialog cleanup inspected; browser regression scope remains root-owned

- Toast new update/status/actions preserve id; old toast/dismiss signatures unchanged; timer reset order inspected

## 非阻断观察

- Localized recommendation names are state keys: direct props rerender zh→en loses pressed state; official wrapper key=id-locale remounts whole case, so not presented as unique official runtime defect.

- 原型保真取舍：path morph→Solar替换旋转；逐位odometer→整体淡入；包管理器切换移除。可做产品复核，非擅自认定bug。