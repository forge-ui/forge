---
version: alpha
name: Forge UI
description: 面向中文后台的 React 组件库 @forge-ui-official/core 的默认视觉语言（浅色主题，蓝色主色）。
colors:
  primary: "#3553FF"
  on-primary: "#FFFFFF"
  primary-soft: "#C0CAFF"
  primary-hover: "#304CE8"
  background: "#FFFFFF"
  surface: "#FAFAFA"
  on-surface: "#000A19"
  text-primary: "#000A19"
  text-secondary: "#4F4F4F"
  text-muted: "#868686"
  text-disabled: "#BDBDBD"
  icon-muted: "#71717A"
  border: "#E1E1E1"
  border-muted: "#EBEBEB"
  overlay: "rgba(0, 10, 25, 0.40)"
  error: "#FE4A23"
  on-error: "#FFFFFF"
  warning: "#F6C002"
  on-warning: "#000A19"
  success: "#09B96D"
  info: "#43CED7"
  violet: "#7239EA"
typography:
  headline-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.25
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.25
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
  headline-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: 700
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: 0.5px
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: 700
    lineHeight: 20px
    letterSpacing: 0.5px
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: 0.5px
rounded:
  xs: 4px
  md: 12px
  card: 20px
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  card-padding: 24px
  gutter: 24px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
  text-field:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    height: 44px
  card:
    backgroundColor: "{colors.background}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding}"
  page:
    backgroundColor: "{colors.surface}"
  status-badge-success:
    backgroundColor: "#E6F8F0"
    textColor: "{colors.success}"
    rounded: "{rounded.full}"
    typography: "{typography.label-sm}"
  status-badge-error:
    backgroundColor: "#FFEDE9"
    textColor: "{colors.error}"
    rounded: "{rounded.full}"
    typography: "{typography.label-sm}"
---

## Overview

Forge 用来做中文后台：列表、详情、表单、设置、看板和智能体页面。整体是安静的浅色界面，浅灰页面底上放白色圆角卡片，主色只用在真正需要用户行动的地方。信息靠层级、间距和字色区分，不靠装饰色块和渐变。

实现时组件一律从 `@forge-ui-official/core` 引入，图标从 `@forge-ui-official/core/icons` 引入。本文件的数值用于设计对照和视觉验收，代码里用语义 token（`var(--accent)`、`text-fg-grey-700` 等），不要把这里的 hex 抄进业务代码。组件 API 见 https://www.forgeui.org/llms-components.md 。

## Colors

- 主色（primary，#3553FF，`--accent` / `fg-blue`）：主要按钮、选中态、链接、焦点环。紫色、黑色是可选主题，不是默认。组件 color prop 写 `"purple"`，对应 CSS token `fg-violet`，不要写 `color="violet"`。
- 页面底（surface，#FAFAFA）和卡片（background，白色）：内容放在白卡里，卡片之间靠浅灰底分开。
- 文字分四级：正文和标题用 text-primary（#000A19，冷调近黑，不是纯黑）；次要信息 text-secondary（#4F4F4F）；辅助说明 text-muted（#868686）；只有真正不可操作的内容才用 text-disabled（#BDBDBD）。
- 边框和分割线用 border（#E1E1E1），更轻的分隔用 border-muted（#EBEBEB）。
- 状态色：成功绿（#09B96D）、危险红（#FE4A23）、警告黄（#F6C002，黄底上用深色字）、提示青（#43CED7）。七个色族（violet、blue、green、red、yellow、cyan、black）加 grey 都有 50–900 十档，500 是基准，Tailwind 写法 `bg-fg-blue-500`、`text-fg-grey-700`。深色模式在 `<html>` 上加 `data-theme="dark"`，灰阶、文字和彩色浅底自动切换；卡片、面板、输入框背景用 `bg-background`，不要写 `bg-white`。

## Typography

标题用 Plus Jakarta Sans，正文用 Manrope，中文回落到系统字体。标准字距 0.5px（`tracking-fg`）。正文 14px 是后台默认字号，说明文字 12–14px；页面主标题 30–36px，卡片标题 16–18px。一个视图里字重控制在三档以内：常规或中等写正文，半粗写标签，粗体写标题和按钮。

## Layout

页面壳由 AppLayout 负责，页面 padding 只算一次，内容区跟随父容器宽度。以 4px 为基本单位，常用 8、16、24、32px。卡片内边距 24px（紧凑卡 20px），卡片之间 24px。比例分栏用 Grid / GridItem；固定 280px 或 336px 的业务侧栏可以直接用 Grid 或 Flex。搜索、筛选和批量操作放在同一条工具带里。表格列宽按内容分配，数字右对齐，操作列按内容收缩，宽表在卡内横向滚动。

## Elevation & Depth

以描边为主、阴影为辅：卡片用 1px 浅灰描边加极淡的阴影（`--shadow-card`：0 4px 30px rgba(77,84,100,0.05)）。浮层、下拉和弹窗用 `--shadow-elevated`（0 4px 30px rgba(77,84,100,0.20)），弹窗下方加半透明深色遮罩。不要用多层投影或彩色阴影制造层次。

## Shapes

卡片和弹窗圆角 20px；输入框和选择框 12px，也可以用全圆角；按钮、徽章、标签、分段切换都是全圆角胶囊。同一视图里不要混用直角和圆角卡片。

## Components

- 按钮：主要按钮蓝底白字胶囊；次要按钮浅蓝底蓝字；轻量按钮描边。一个区域只放一个主要按钮。长按确认、加载中、完成态由 Button 自带，不要自己拼。
- 输入框：高 44px，标签在上，帮助文字和错误提示在下。
- 卡片：白底、20px 圆角、24px 内边距；标题行放标题、副标题和右侧操作。
- 状态：默认用 soft 风格的 StatusBadge（浅底深字胶囊）；分类、角色用普通文字；一张表通常最多一个状态胶囊列。
- 表格：DataTable 优先，表头和内容同向对齐，行操作放最后一列。
- 弹窗：受控打开；破坏性操作用 ConfirmationDialog 确认一次。

## Do's and Don'ts

- Do 先从同类的模板页面或页面组件起步，再换数据和文案。
- Do 每个按钮都有真实结果，或者有理由地禁用；异步操作要有加载态和防重复提交。
- Do 指标写清统计口径；图表颜色、图例和文字含义一致，不只靠颜色区分。
- Don't 在业务代码里写 hex 颜色和裸 px，也不要手写库里已有的按钮、表格、弹窗。
- Don't 默认用紫色主题，也不要用渐变色块、装饰插画填空白。
- Don't 把标题和正文做成灰色；弱化信息用 text-secondary 或 text-muted，不要用 disabled 色。
- Don't 写 `href="#"`、空的 onClick 或假装成功的操作。
- Don't 让页脚、固定工具条盖住内容。
