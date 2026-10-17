# 组件文档复核：已证实的遗漏与错项

## 结论

其他组件仍有遗漏。上一轮的“没有删除 main 导出或参数”只证明静态接口名称仍在，不能证明文档、参数解释、示例或运行行为完整。不能据此宣布迁移完成。

本轮重新检查 182 个公开 React 组件的展示引用，并对其中 180 个有参数组件进行文档参数对照。DropdownDivider、MastercardLogo 没有参数，单独作为组合或渲染辅助件处理。参数审计排除 React 原生透传属性，但保留 core 自己声明的字段，包括继承的 core 字段。

## 已逐项回读源码确认

| 优先级 | 组件 | 问题 | 核对位置 |
|---|---|---|---|
| 高 | AddMember | 16 个参数，补充表只覆盖 5 个；遗漏 selectedIds、defaultSelectedIds、onSelectionChange、open、defaultOpen、onOpenChange、clearOnAdd、search、disabled、accent、className | core/src/components/ui/add-member.tsx:17；src/app/components/_additional-component-api.tsx:18 |
| 高 | OtpInput | 19 个参数，表中只覆盖 length、verify、locale、motion；遗漏受控输入、完成及成功回调、禁用、焦点、表单名称、错误清空和提示文案 | core/src/components/ui/otp-input.tsx:10；src/app/components/_additional-component-api.tsx:25 |
| 高 | Drawer | 12 个参数，表中只覆盖 open、onOpenChange、children、motion；遗漏 side、transition、revealOrigin、title、footer、locale、closeLabel、className | core/src/components/ui/drawer.tsx:10；src/app/components/_additional-component-api.tsx:45 |
| 高 | LiquidTabs | 14 个参数，表中覆盖 6 个；遗漏 visibleCount、rows、corner、label、moreLabel、emptyLabel、disabled、className | core/src/components/ui/liquid-tabs.tsx；src/app/components/_additional-component-api.tsx:36 |
| 高 | ToolbarSearchInput | 文档写“纯展示态，无 onChange”，实际支持 value、defaultValue、onChange、onSubmit；同时默认提示已为中文，表格仍写英文 | core/src/components/ui/toolbar.tsx:74；src/app/components/toolbar/page.tsx:158 |
| 高 | Avatar | 表格页面声称头像 API 在本页，实际没有 Avatar 自身的参数表；组合中使用头像不能替代头像参数说明 | src/app/components/table/page.tsx:517；core/src/components/ui/avatar.tsx |
| 中 | Button | 参数表遗漏 confirmed、holdLabels、progress、loadingLabel、resultLabel、locale、motion，影响长按确认和异步进度的接入 | core/src/components/ui/button.tsx；src/app/components/button-link/page.tsx |
| 中 | DataTable | 参数表遗漏 onSelectRow、onSelectAll、onSort、footerLeft、footerRight、onPageChange、className | core/src/components/ui/data-table.tsx；src/app/components/table/page.tsx |
| 中 | Label / NotificationBadge | 参数表列了源码不接受的 className；用户照表传参会遇到类型错误 | core/src/components/ui/badge.tsx:17、79；src/app/components/badge/page.tsx:31、59 |

## 全量候选清单

`documentation-props-audit.md` 按组件列出参数名和未覆盖项；对应 JSON 同时保留参数表来源、行号、组件角色和展示引用证据。

自动结果为 123 个组件、601 个自定义参数存在未覆盖候选，其中 105 个为面向用户的组件。此数字不是 601 个已人工确认的缺陷：少量样式透传字段可通过统一说明覆盖，渲染辅助件可随主组件说明；一个参数被表格提及，也不代表类型、默认值和职责解释正确。候选必须按这些边界处理，不能机械增加 601 行表格。

本轮已重新运行展示覆盖脚本。IconButton.effect=send 和 StyledLink.effect=magnetic/roll 等仍缺少组件页直接展示证据；同类组合案例中的自定义 CSS 不能替代这些公开参数的展示。共享注入和动态分派仍须结合 registry 条件人工判定。没有把这批候选重新标为通过。

## 修复顺序与验收

1. 先修接入阻断项：不存在的参数、错误的能力描述、漏掉的受控值和事件回调。
2. 再补主组件与数据结构说明：输入、选择、任务、附件、抽屉、布局和 AskAi 配置均应有明确入口。
3. 把区别行为的变体放进原组件示例，用控件切换；不恢复重复的尺寸和颜色矩阵。
4. 最后核对中文文案、默认值、对应代码以及实际点击后的结果。类型检查、参数名称覆盖和浏览器验收分别记录。

本轮输出的是审计结果，并未把上述其他组件全部补齐。不存在“其他组件都没有漏”的结论。
