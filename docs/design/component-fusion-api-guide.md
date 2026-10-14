# 组件融合 API 用法

本指南对应 `codex/component-fusion-migration` 分支的正式实现。增强能力继续放在原有组件里；注册向导、扇形快捷菜单、通知面板等业务组合位于 `src/app/components/_fusion/`，不增加同名平行组件。编号与归属见 [融合实现对照](./component-fusion-implementation.md)。

以下片段均使用 `@forge-ui-official/core` 的公开入口；交互示例放在客户端组件文件中。项目仍需按 [core README](../../core/README.md) 接入样式。示例中的异步函数、上传任务和消息状态由业务方提供。

## 共同约定

- `motion="auto"` 跟随系统减少动态效果偏好，`motion="none"` 关闭动效，不关闭操作能力。只向声明该参数的组件传递。
- 提供 `locale` 的交互组件默认中文，切换英文用 `locale="en"`。业务标题、菜单项、`ariaLabel` 等外部内容由业务方翻译。`StatCard.locale` 用于数字格式，使用 `zh-CN`、`en-US` 等语言标记。
- 主题沿用各组件现有的 `color`、`accent` 或 `theme` 参数，常用主题为蓝、紫、黑；图标从 `@forge-ui-official/core/icons` 选择 Solar 图标。
- `onChange`、`onSelect`、`onStop` 等回调表达用户意图。调用接口、保存数据、撤销、鉴权、真正中止请求由业务代码完成。

## 按钮、链接与操作反馈

| 组件 | 新增或增强参数 | 默认行为 |
| --- | --- | --- |
| `Button` | `effect="glass\|magnetic\|ripple\|roll"`；`loading`；`result="idle\|success\|error"`；`progress` 0–100；`loadingLabel`、`resultLabel` | 不传 `effect` 保留原样；结果由外部提供 |
| `Button` 长按变体 | `variant="hold"`、`holdDuration` 毫秒、`onConfirm`、`confirmed`、`onUndo`、`holdLabels` | 普通按钮不启用长按；长按结束只触发回调 |
| `IconButton` | `effect="send\|morph\|bookmark\|burst"`、`active`、`loading`、`result`、`progress` | `active` 表示选中状态，不会自动修改业务数据 |
| `StyledLink` | `effect="magnetic\|roll"`、`motion` | 仍使用 `href` 导航 |

液态玻璃按钮只包含按钮本身。预览中的彩色场景、图片和大面积背景不属于按钮参数，也不会随按钮一起渲染。

```tsx
"use client";
import { useState } from "react";
import { Button } from "@forge-ui-official/core";

export function SaveButton({ save }: { save: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  async function submit() {
    setLoading(true);
    setResult("idle");
    try { await save(); setResult("success"); }
    catch { setResult("error"); }
    finally { setLoading(false); }
  }
  return <Button color="blue" effect="ripple" loading={loading}
    result={result} onClick={submit}>保存更改</Button>;
}
```

`loading` 会禁用普通按钮，避免重复触发。`progress` 只展示外部进度，不会模拟请求完成。长按确认示例：

```tsx
"use client";
import { Button } from "@forge-ui-official/core";

export function DeleteButton({ confirmed, remove, undo }: {
  confirmed: boolean; remove: () => void; undo: () => void;
}) {
  return <Button variant="hold" color="red" holdDuration={1200}
    confirmed={confirmed} onConfirm={remove} onUndo={undo}
    holdLabels={{ idle: "长按删除", done: "已删除", undo: "撤销" }} />;
}
```

## 卡片、进度与列表

`SurfaceCard.effect="tilt" | "layered"` 为原有内容卡片增加倾斜或层叠反馈。`StatCard` 和 `LineChartStatCard` 的 `animateValue` 只对数字值生效；字符串和自定义内容保留原样。不要把统计数字为了显示逗号提前转换成字符串，使用 `numberFormat`。

```tsx
import { SurfaceCard, StatCard, ProgressBar, ListItem } from "@forge-ui-official/core";

export function ProjectSummary({ count, progress, remove }: {
  count: number; progress: number; remove: () => void;
}) {
  return <SurfaceCard title="项目概况" effect="tilt">
    <StatCard title="已处理任务" value={count} animateValue
      locale="zh-CN" numberFormat={{ maximumFractionDigits: 0 }} />
    <ProgressBar variant="ring" value={progress}>{progress}%</ProgressBar>
    <ListItem title="待归档项目" onSwipeAction={remove} swipeActionLabel="归档" />
  </SurfaceCard>;
}
```

`ProgressBar` 默认仍是线形；未知进度传 `indeterminate`，不要提供伪百分比。`ListItem` 只有传 `onSwipeAction` 才增加滑动操作入口，回调是否删除或归档由业务方决定，英文场景自行传 `swipeActionLabel`。

多选操作继续使用 `Toolbar.selection`，不新增“批量操作栏”组件。保持 `selection` 对象存在，只把 `count` 改为 0，可保留普通工具栏内的输入状态。

```tsx
import { Button, Toolbar } from "@forge-ui-official/core";

export function SelectionToolbar({ count, clear, archive }: {
  count: number; clear: () => void; archive: () => void;
}) {
  return <Toolbar left={<span>项目列表</span>} selection={{ count, onClear: clear,
    actions: <Button size="sm" onClick={archive}>归档</Button> }} />;
}
```

## 通知与提示

`useToast()` 必须位于 `ToastProvider` 内。`toast()` 返回通知 ID；`update(id, …)` 原位更新内容和状态，`dismiss(id)` 关闭。`duration: 0` 保持展示直到业务方更新或关闭；`stacked` 在 Provider 上启用折叠堆叠。

```tsx
"use client";
import { Button, ToastProvider, useToast } from "@forge-ui-official/core";

function SaveAction({ save }: { save: () => Promise<void> }) {
  const { toast, update } = useToast();
  async function submit() {
    const id = toast({ title: "正在保存", status: "loading", duration: 0 });
    try { await save(); update(id, { title: "保存成功", status: "success", duration: 3000 }); }
    catch { update(id, { title: "保存失败", status: "error", duration: 0 }); }
  }
  return <Button onClick={submit}>保存</Button>;
}
export function SaveWithNotice({ save }: { save: () => Promise<void> }) {
  return <ToastProvider stacked locale="zh"><SaveAction save={save} /></ToastProvider>;
}
```

`action: { label, onClick }` 可提供撤销或重试入口；业务方需要实现实际动作。`Tooltip` 新增 `delay`（毫秒）与 `followCursor`，键盘聚焦仍直接显示并定位到触发器。把同一工具栏的 Tooltip 放进 `TooltipGroup` 可共享首次悬停延迟，参数为 `delay`、`warmWindow`；默认单个 Tooltip 用法不变。

## 表单、评分与文件

| 组件 | 用法 | 边界 |
| --- | --- | --- |
| `TextField` | `labelPlacement="floating"`；`activeTag` 高亮指定 tag 的 `value` | 默认外置标题；同时有 tags 时保留标签布局；添加、重复校验、二次退格删除由业务控制 |
| `Toggle` | `draggable`；`thumbIcon`；`checked` / `onChange` 或 `defaultChecked` | 默认普通点击开关；图标不改变业务开关含义 |
| `SelectOption` | `options[].icon`、`description` | 复用单选、多选、图片选项及原有键盘导航 |
| `RatingStars` | `onChange`、`readOnly`、`disabled`、`locale`、`ariaLabel` | 不传 `onChange` 仍是只读评分；传入后支持鼠标预览和键盘调节 |
| `OtpInput` | `locale`；`verify(code): boolean \| Promise<boolean>` | 无内置验证码；校验、发送短信和重发频控由业务实现 |
| `FileUpload` / `FileCard` | `locale`；`FileItem.progress`、`uploadedBytes`、`totalBytes` | 选择文件与展示受控状态，不自动上传 |
| `Checklist` | `locale`；现有条目受控状态 | 完成计数来自条目数据，不代替任务保存 |

```tsx
"use client";
import { useState } from "react";
import { TextField, Toggle, RatingStars, OtpInput } from "@forge-ui-official/core";
import { SunLinear } from "@forge-ui-official/core/icons";

export function ProfileForm({ verify }: { verify: (code: string) => Promise<boolean> }) {
  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [rating, setRating] = useState(0);
  return <div className="flex flex-col gap-4">
    <TextField label="姓名" labelPlacement="floating" value={name} onChange={setName} />
    <Toggle checked={enabled} onChange={setEnabled} draggable
      ariaLabel="开启通知" thumbIcon={<SunLinear size={14} />} />
    <RatingStars value={rating} onChange={setRating} ariaLabel="使用体验评分" />
    <OtpInput length={6} verify={verify} />
  </div>;
}
```

文件进度的 `progress` 是 0–100，字节字段是原始字节数。收到上传服务状态后更新 `file`；本地读取完成不代表服务器上传完成。

```tsx
import { FileCard, type FileItem } from "@forge-ui-official/core";

export function UploadRow({ file, cancel, retry }: {
  file: FileItem; cancel: (id: string) => void; retry: (id: string) => void;
}) {
  return <FileCard color="blue" locale="zh" file={file}
    onRemove={cancel} onRetry={retry} />;
}
// file 示例：{ id: "report", name: "报告.pdf", size: "10 MB",
//   state: "uploading", progress: 35, uploadedBytes: 3500000, totalBytes: 10000000 }
```

## 日期选择

`Datepicker` 继续支持单日与日期范围。`inline` 直接显示日历；`rangeLabels` 显示两个日期入口；`minDate`、`maxDate` 限制可选日期。日历支持方向键、Home/End、PageUp/PageDown 和跨月焦点。

`confirmSelection` 默认 `false`，保留原来的即时回调。设为 `true` 时，范围选择先存为草稿，点击“应用”后才触发 `onRangeChange`，不会提前覆盖业务值。

```tsx
"use client";
import { useState } from "react";
import { Datepicker } from "@forge-ui-official/core";

export function DateRange() {
  const [range, setRange] = useState<{ start?: Date; end?: Date }>({});
  return <Datepicker mode="range" color="blue" locale="zh" confirmSelection
    rangeLabels={["开始日期", "结束日期"]}
    rangeStart={range.start} rangeEnd={range.end}
    onRangeChange={(start, end) => setRange({ start, end: end ?? undefined })} />;
}
```

## 标签页、步骤与导航

`TabBar.appearance="dock"` 复用原标签页行为，`tabs[].icon` 为各项添加图标。默认 `underline` 不变。`TabsContent.transition="slide"` 提供内容出入与高度过渡；默认仍为 `fade`。这两种单面板模式会随 `activeKey` 切换重新挂载内容，表单草稿应放在外层。

完整传入 `TabsContent.panels` 时启用原生横向滚动吸附与鼠标拖动，各面板保留挂载，未选面板设置 `inert`。将 `onProgressChange` 接到 `TabBar.progress`，指示器会跟随实际滚动位置。

```tsx
"use client";
import { useId, useState } from "react";
import { TabBar, TabsContent } from "@forge-ui-official/core";

export function SwipeTabs() {
  const prefix = useId();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const labels = ["概览", "成员", "设置"];
  return <>
    <TabBar tabs={labels.map((label, i) => ({ label, active: i === active,
      id: `${prefix}-tab-${i}`, controls: `${prefix}-panel-${i}` }))}
      progress={progress} onChange={setActive} />
    <TabsContent activeKey={active} onActiveKeyChange={key => setActive(Number(key))}
      onProgressChange={setProgress}
      panels={labels.map((label, i) => ({ key: i, id: `${prefix}-panel-${i}`,
        labelledBy: `${prefix}-tab-${i}`, content: <div className="p-6">{label}内容</div> }))} />
  </>;
}
```

其他导航增强：

- `ButtonGroup` 保持受控 `activeIndex` / `onChange(index)`，索引从 0 开始，支持方向键与 Home/End。
- `Stepper.items` 接收 `{ id, label, description?, icon? }[]`，`current` 和 `onStepChange` **从 1 开始**；`indicator` 是可选的移动标记。不传 `items` 继续展示原进度点。
- `IconTrigger` 新增 `initialFocus="first" | "selected" | false` 和 `panelAlign="start" | "center" | "end"`。默认不自动抢焦点；`panel={(close) => ...}` 中调用 `close()` 会关闭并回到触发器。传 `onClick` 会接管点击，不能同时依赖内置弹层。
- `Drawer.transition="reveal"` 在原抽屉内启用圆形展开，`revealOrigin: { x, y }` 使用触发器中心的**视口坐标**。默认 `slide` 保留原抽屉行为与焦点管理。
- AppLayout 侧栏伸缩、Accordion 展开和 Pagination 翻页继续融合在原组件中；无需引入专用“侧栏动效”或“动效分页”组件。

## 聊天回复、反应与语音

`ChatInputBar` 新增 `replyTo`、`onCancelReply`、`attachments`、`voiceState`、`voiceLevel` 与语音回调。语音状态为 `idle | recording | processing`，音量为 0–1。组件不会申请麦克风权限或进行转写；业务方启动录音后再更新状态。

```tsx
"use client";
import { useState } from "react";
import { ChatBubble, ChatInputBar, type ComposerReply,
  type ComposerStatus, type ComposerVoiceState } from "@forge-ui-official/core";

export function Conversation({ send, stop, status, voice }: {
  send: (text: string, reply?: ComposerReply) => void;
  stop: () => void;
  status: ComposerStatus;
  voice: { state: ComposerVoiceState; level: number; start: () => void;
    end: () => void; cancel: () => void };
}) {
  const [text, setText] = useState("");
  const [reply, setReply] = useState<ComposerReply>();
  const message = { id: "m1", name: "设计助手", content: "请确认本次修改。" };
  return <>
    <ChatBubble type="received" senderName={message.name} content={message.content}
      onReply={() => setReply(message)} />
    <ChatInputBar value={text} onChange={setText} replyTo={reply}
      onCancelReply={() => setReply(undefined)} status={status} onStop={stop}
      onSend={(value, _action, context) => send(value, context?.replyTo)}
      voiceState={voice.state} voiceLevel={voice.level} onVoiceStart={voice.start}
      onVoiceEnd={voice.end} onVoiceCancel={voice.cancel} />
  </>;
}
```

正式接入时把 `status` 从业务状态传入：开始生成为 `running`，发出中止请求为 `stopping`，确认结束后回到 `idle`。`onSend` 的第三个参数还包含 `sources`；需要保存提及对象时一并提交。

`ChatBubble.reactions` 接收 `{ id, label, content, count, selected? }[]`；`reactionOptions` 接收 `{ id, label, content }[]`；`onReaction(id)` 由业务方更新计数。`onReply` 启用回复入口与滑动回复。`delivery="queued" | "sending" | "sent" | "delivered" | "failed"` 只展示发送状态，不提供离线队列或自动重发。

## 工具执行、生成回答与代码折叠

`ToolChips` 行状态为 `pending | running | complete | error | cancelled`，整体 `state` 为 `idle | running | success | error | cancelled`。注意行完成是 `complete`，整体成功是 `success`。`result`、`actions` 是业务内容插槽，可放置真实结果与停止、重试等操作。

```tsx
import { Button, ToolChips, StreamingAnswer } from "@forge-ui-official/core";

export function RunningTask({ text, stop }: { text: string; stop: () => void }) {
  return <>
    <ToolChips state="running" items={[
      { id: "read", kind: "read", label: "读取资料", chip: "需求.md", status: "complete" },
      { id: "write", kind: "write", label: "生成方案", chip: "方案.md", status: "running" },
    ]} actions={<Button size="sm" onClick={stop}>停止</Button>} />
    <StreamingAnswer text={text} status="streaming" format="markdown" />
  </>;
}
```

实时回答持续更新 `text` 和 `status="streaming"`；收到完成信号后设 `complete`，收到停止信号后设 `stopped`。`onDone` 表示完整回答的显示动画结束，不能代替服务端完成信号。默认 `format="plain"` 保留文字；Markdown 需主动开启。`ThinkingTrace` 的 `locale`、`motion` 控制文字和动效，仍使用原有 `rows`、`play`、`settled` 接口，不承担真实工具执行状态。

```tsx
"use client";
import { useState } from "react";
import { AgentCodeBlock } from "@forge-ui-official/core";

export function FoldedCode() {
  const [collapsed, setCollapsed] = useState(["load"]);
  return <AgentCodeBlock filename="load.ts"
    lines={["async function load() {", "  return await fetch('/api/items');", "}"]}
    foldRanges={[{ id: "load", startLine: 1, endLine: 3, label: "load" }]}
    collapsedRangeIds={collapsed} onCollapsedRangeIdsChange={setCollapsed} />;
}
```

折叠范围从 **1 行开始计数**，`startLine` 标题行保留，隐藏到包含 `endLine` 的行。范围可嵌套、不可交叉。不需外部控制时用 `defaultCollapsedRangeIds`；不传折叠范围保持完整代码展示。复制仍复制原始内容，折叠不删除代码。

## 图表

图表变化继续使用现有五类组件。数据、聚合计算和预测算法由业务提供，组件只绘制传入结果。

| 组件 | 新能力 | 数值规则 |
| --- | --- | --- |
| `BarChart` | `domain`、`referenceValue` / `referenceLabel`、`pinnedIndex`、`onSelect`、`onActiveIndexChange`、`motion`、`ariaLabel` | `data: { value, label? }[]`；索引从 0 开始 |
| `SmoothLineChart` | `stacked`、`bands`、`series[].forecastFrom`、`interpolation`、`markers`、`highlightToActive`、`onActiveIndexChange`、`motion` | 各系列按同一索引对齐；`yDomain` 固定纵轴；预测线由提供的索引开始 |
| `DonutChart` | `interactive`、`segments[].disabled`、`onSegmentToggle`、`onActiveIndexChange`、`motion`、`ariaLabel` | 默认仍是原静态展示；被禁用的项不参与总和，业务方提供图例切换入口 |
| `MultilayerDonutChart` | `sweep={360}`、`activeIndex`、`motion`、`ariaLabel` | 默认 270°；360° 时可显示超过 100 的额外圈数 |
| `BarHorizontalChart` | `domain`、`target` / `targetLabel`、`ranges`、`motion` | `ranges[].to` 与 `target` 使用数据单位，不是 CSS 百分比 |

```tsx
"use client";
import { useState } from "react";
import { BarChart, SmoothLineChart, DonutChart,
  MultilayerDonutChart, BarHorizontalChart } from "@forge-ui-official/core";

export function Metrics() {
  const [pinned, setPinned] = useState<number>();
  const [segments, setSegments] = useState([
    { label: "已完成", value: 72, disabled: false },
    { label: "待处理", value: 28, disabled: false },
  ]);
  return <div className="grid gap-6">
    <BarChart data={[{ label: "周一", value: 40 }, { label: "周二", value: 62 }]}
      domain={[0, 100]} referenceValue={60} referenceLabel="目标"
      pinnedIndex={pinned} onSelect={setPinned} ariaLabel="每日任务完成量" />
    <SmoothLineChart series={[{ label: "需求量", data: [20, 32, 29, 38], forecastFrom: 2 }]}
      bands={[{ lower: [18, 29, 25, 30], upper: [22, 35, 33, 46] }]}
      xAxisLabels={["周一", "周二", "周三", "周四"]} yDomain={[0, 60]}
      ariaLabel="需求趋势与预测区间" />
    <DonutChart interactive segments={segments} ariaLabel="任务占比"
      onSegmentToggle={index => setSegments(items => items.map((item, i) =>
        i === index ? { ...item, disabled: !item.disabled } : item))} />
    <div>{segments.map((item, i) => <label key={item.label}>
      <input type="checkbox" checked={!item.disabled} onChange={() => setSegments(items =>
        items.map((entry, j) => j === i ? { ...entry, disabled: !entry.disabled } : entry))} />
      {item.label}
    </label>)}</div>
    <MultilayerDonutChart sweep={360} layers={[{ value: 128 }, { value: 85 }]}
      centerValue="128%" ariaLabel="任务目标达成率" />
    <BarHorizontalChart data={[{ label: "本月", value: 72 }]} domain={[0, 100]}
      target={80} targetLabel="目标 80" ranges={[{ to: 60 }, { to: 100 }]} />
  </div>;
}
```

`bands` 的每项是 `{ lower: number[], upper: number[], color? }`，不是服务端自动推导的置信区间。`markers` 是 `{ index, label }[]`。环图选中、隐藏和固定柱索引均需按新的数据集合调整；不要把过期索引映射到另一条业务记录。

## 组合案例的使用边界

正式案例通过现有 core 组件组合：注册/登录表单、密码规则、兴趣选择、主题切换、通知中心、扇形菜单、账户切换、附件列表、协作成员、审批步骤、日历排班、仪表盘等。接入时复用其中的 React 结构，把演示数据与回调替换为业务接口。

这些案例不意味着 core 自带注册、计费、录音、上传、智能体执行或审批后端。官网保留了可操作的本地状态反馈，并明确区分本地读取、提交意图和真实服务端成功。
