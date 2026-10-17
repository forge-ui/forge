"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Avatar,
  AvatarGroup,
  BarChart,
  BarChartStatCard,
  Button,
  ButtonGroup,
  CalendarCard,
  ChartCard,
  Checklist,
  ChatBubble,
  ChatInputBar,
  type ChatInputBarQuickAction,
  CommandSearch,
  DataTable,
  DropdownPanel,
  FilterGroup,
  Label,
  LiquidTabs,
  MenuItem,
  NotificationBadge,
  OtpInput,
  Pagination,
  ProgressBar,
  ProjectCard,
  RatingStars,
  SelectOption,
  StatusBadge,
  CellText,
  Stepper,
  TabBar,
  TaskCard,
  ThinkingTrace,
  ToastProvider,
  Toggle,
  useToast,
  type ColumnDef,
} from "@forge-ui-official/core";
import { AltArrowRightLinear } from "@forge-ui-official/core/icons";

const arrow = <AltArrowRightLinear size={16} color="currentColor" />;

type TableRow = {
  id: string;
  name: string;
  status: string;
  tone: "blue" | "cyan" | "grey";
};

const tableRows: TableRow[] = [
  { id: "1", name: "周报统计", status: "已完成", tone: "blue" },
  { id: "2", name: "排期看板", status: "进行中", tone: "cyan" },
  { id: "3", name: "客户跟进", status: "待开始", tone: "grey" },
];

const tableColumns: ColumnDef<TableRow>[] = [
  {
    key: "name",
    header: "事项",
    flex: true,
    render: (row) => <CellText>{row.name}</CellText>,
  },
  {
    key: "status",
    header: "状态",
    width: "w-24",
    render: (row) => <StatusBadge label={row.status} color={row.tone} />,
  },
];

const commandItems = [
  { id: "board", label: "打开看板", hint: "项目", group: "跳转" },
  { id: "chat", label: "打开对话", hint: "消息", group: "跳转" },
  { id: "stats", label: "打开统计", hint: "本周", group: "跳转" },
];

function Panel({ title, flush = false, children }: { title?: string; flush?: boolean; children: ReactNode }) {
  return (
    <section className={flush ? "home-panel is-flush" : "home-panel"}>
      {title ? <p className="home-panel-title">{title}</p> : null}
      <div className="home-panel-body">{children}</div>
    </section>
  );
}

function BrickWall({ columns }: { columns: ReactNode[] }) {
  return (
    <div className="home-wall">
      {columns.map((column, index) => (
        <div className="home-col" key={index}>
          {column}
        </div>
      ))}
    </div>
  );
}

function Segmented() {
  const [index, setIndex] = useState(0);
  return (
    <ButtonGroup
      className="home-segment"
      color="blue"
      shape="pill"
      motion="auto"
      ariaLabel="分段"
      activeIndex={index}
      onChange={setIndex}
      items={[{ label: "统计" }, { label: "日程" }, { label: "对话" }]}
    />
  );
}

function Badges() {
  return (
    <div className="home-badges">
      <Label color="blue" size="sm">设计</Label>
      <Label color="cyan" size="sm" variant="solid">进行中</Label>
      <Label color="gray" size="sm">待排期</Label>
      <NotificationBadge color="blue">3</NotificationBadge>
      <NotificationBadge color="black">12</NotificationBadge>
    </div>
  );
}

function People() {
  return (
    <div className="home-people">
      <AvatarGroup>
        <Avatar initials="林" size="md" color="blue" />
        <Avatar initials="周" size="md" color="cyan" />
        <Avatar initials="陈" size="md" color="blue" />
      </AvatarGroup>
    </div>
  );
}

const quickCards: ChatInputBarQuickAction[] = [
  { id: "image", label: "创建图片", kind: "image", placeholder: "描述你想创建的图片…" },
  { id: "note", label: "写笔记", kind: "note", placeholder: "写下想记录的内容…" },
  { id: "event", label: "安排日程", kind: "event", placeholder: "什么活动，什么时候？" },
  { id: "voice", label: "语音输入", kind: "voice", placeholder: "输入要转写的内容…" },
  { id: "docs", label: "分析文档", kind: "docs", placeholder: "上传文档，或者提一个问题…" },
];

function Thread() {
  const [shown, setShown] = useState(1);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(3);
      return;
    }
    const timers = [650, 1400].map((delay, index) => window.setTimeout(() => setShown(index + 2), delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <ChatInputBar
        className="w-full max-w-full"
        locale="zh"
        motion="auto"
        color="blue"
        placeholder="写一条消息"
        quickActions={quickCards}
        quickActionsLabel="快捷卡片"
        defaultQuickActionsOpen
        hasMessages={false}
        showAttachment={false}
      />
      <ChatBubble type="received" color="blue" motion="auto" senderName="Forge" content="统计、日程和看板都可以直接拿来用。" />
      {shown > 1 ? (
        <ChatBubble type="sent" color="blue" variant="file" motion="auto" fileName="本周统计.pdf" fileSize="240 KB" />
      ) : null}
      {shown > 2 ? <ChatBubble type="sent" color="black" motion="auto" content="输入栏可以打字。" /> : null}
    </div>
  );
}

function ScoreRing() {
  const [score, setScore] = useState(4);
  return (
    <div className="home-split">
      <ProgressBar variant="ring" value={score * 20} color="blue" motion="auto" showPercentage label="完成进度" />
      <RatingStars value={score} onChange={setScore} motion="auto" locale="zh" size="sm" ariaLabel="完成度" />
    </div>
  );
}

function EffectButtons() {
  const { toast } = useToast();
  return (
    <div className="home-actions">
      <div className="home-glass-bar">
        <Button effect="glass" color="black" size="sm" motion="auto">记下一条</Button>
      </div>
      <Button
        className="home-wide"
        effect="ripple"
        color="blue"
        size="sm"
        motion="auto"
        onClick={() => toast({ title: "已记下", description: "可以划掉这条通知。", status: "success" })}
      >
        弹出通知
      </Button>
      <Button className="home-wide" data-home-magnetic effect="magnetic" color="blue" size="sm" motion="auto" iconRight={arrow}>
        打开看板
      </Button>
      <Button className="home-wide" effect="roll" color="black" size="sm" motion="auto">
        切换视图
      </Button>
    </div>
  );
}

function MessageTabs() {
  return (
    <LiquidTabs
      className="w-full max-w-full"
      motion="auto"
      rows={1}
      label="消息分类"
      tabs={[
        { id: "today", label: "今天", items: [{ id: "review", title: "评审首页", subtitle: "10:00" }] },
        { id: "todo", label: "待办", items: [{ id: "report", title: "整理周报", subtitle: "待排期" }] },
        { id: "done", label: "完成", items: [{ id: "ship", title: "上线统计", subtitle: "已完成" }] },
      ]}
    />
  );
}

function JumpMenu() {
  const [current, setCurrent] = useState("board");
  const items = [
    { id: "board", label: "打开看板" },
    { id: "chat", label: "打开对话" },
    { id: "stats", label: "打开统计" },
  ];
  return (
    <DropdownPanel motion="auto" width="w-full" className="home-menu max-w-full">
      {items.map((item) => (
        <MenuItem
          key={item.id}
          accent="blue"
          label={item.label}
          active={current === item.id}
          motion="auto"
          onClick={() => setCurrent(item.id)}
        />
      ))}
    </DropdownPanel>
  );
}

function Picker() {
  const [value, setValue] = useState("board");
  return (
    <SelectOption
      label="打开"
      color="blue"
      motion="auto"
      type="single"
      value={value}
      onChange={setValue}
      width="100%"
      options={[
        { value: "board", label: "看板" },
        { value: "chat", label: "对话" },
        { value: "stats", label: "统计" },
      ]}
    />
  );
}

function Metric() {
  return (
    <div className="home-metric min-w-0">
      <BarChartStatCard
        title="本周完成"
        value="128"
        trend="+12%"
        subtitle="较上周"
        theme="blue"
        size="sm"
        density="compact"
        barColor="blue"
        bars={[12, 28, 16, 36, 22]}
        width="full"
      />
    </div>
  );
}

function CommandMenu() {
  const [picked, setPicked] = useState("打开看板");
  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <CommandSearch
        className="w-full"
        color="blue"
        locale="zh"
        motion="auto"
        items={commandItems}
        onSelect={(item) => setPicked(item.label)}
      />
      <span className="text-sm text-fg-grey-700">当前：{picked}</span>
    </div>
  );
}

function WeekBars() {
  const [index, setIndex] = useState(3);
  const days = [
    { value: 18, label: "一" },
    { value: 24, label: "二" },
    { value: 16, label: "三" },
    { value: 32, label: "四" },
    { value: 22, label: "五" },
    { value: 12, label: "六" },
    { value: 8, label: "日" },
  ];
  return (
    <ChartCard title="本周完成" subtitle="点一根柱子" width="full" minHeight="min-h-0" action={<></>}>
      <BarChart
        data={days}
        accent="blue"
        color="bg-fg-blue"
        inactiveColor="bg-fg-blue-100"
        motion="auto"
        height="h-16"
        showLabels
        barWidth="wide"
        activeIndex={index}
        onSelect={setIndex}
        ariaLabel="本周完成"
      />
    </ChartCard>
  );
}

function DatePicker() {
  return <CalendarCard color="blue" size="compact" variant="plain" motion="auto" className="max-w-full" />;
}

function TaskTable() {
  const [keys, setKeys] = useState<ReadonlySet<string>>(() => new Set(["1"]));
  return (
    <DataTable
      title="事项"
      subtitle="勾选要跟进的"
      color="blue"
      showCheckbox
      checkboxColor="blue"
      rows={tableRows}
      columns={tableColumns}
      selectedRowKeys={keys}
      onSelectedRowKeysChange={(next) => setKeys(new Set([...next].map(String)))}
      getRowKey={(row) => row.id}
      tableMinWidth={220}
    />
  );
}

function Steps() {
  const [step, setStep] = useState(2);
  return (
    <Stepper
      color="blue"
      motion="auto"
      locale="zh"
      current={step}
      onStepChange={setStep}
      items={[
        { id: "pick", label: "挑选" },
        { id: "place", label: "排进" },
        { id: "check", label: "核对" },
      ]}
    />
  );
}

function Pages() {
  const [page, setPage] = useState(1);
  return <Pagination totalPages={4} currentPage={page} onPageChange={setPage} color="blue" motion="auto" locale="zh" />;
}

function UnderlineTabs() {
  const [index, setIndex] = useState(0);
  const labels = ["统计", "日程", "对话"];
  return (
    <TabBar
      color="blue"
      motion="auto"
      ariaLabel="视图"
      tabs={labels.map((label, item) => ({ label, active: item === index }))}
      onChange={setIndex}
    />
  );
}

function TodoList() {
  return (
    <Checklist
      motion="auto"
      color="blue"
      size="sm"
      defaultTasks={[
        { id: "stats", label: "核对统计", done: true },
        { id: "board", label: "排进看板" },
        { id: "chat", label: "看对话记录" },
      ]}
    />
  );
}

function Filters() {
  const [checked, setChecked] = useState<Record<string, boolean>>({ stats: true, calendar: false, chat: false });
  return (
    <FilterGroup
      title="视图"
      color="blue"
      content={{
        type: "checkbox",
        onToggle: (value, next) => setChecked((current) => ({ ...current, [value]: next })),
        options: [
          { value: "stats", label: "统计", checked: checked.stats, colorDot: "bg-fg-blue" },
          { value: "calendar", label: "日程", checked: checked.calendar, colorDot: "bg-fg-cyan-500" },
          { value: "chat", label: "对话", checked: checked.chat, colorDot: "bg-fg-black" },
        ],
      }}
    />
  );
}

function Passcode() {
  const [value, setValue] = useState("");
  return <OtpInput length={4} locale="zh" value={value} onChange={setValue} motion="auto" inputLabel="验证码" />;
}

function Trace() {
  return (
    <ThinkingTrace
      variant="steps"
      locale="zh"
      motion="auto"
      settled
      doneLabel="已对照 AGENTS.md"
      rows={[{ primary: "读取 AGENTS.md" }, { primary: "对照组件写法" }, { primary: "排进这一页" }]}
    />
  );
}

function ProjectOne() {
  return (
    <ProjectCard
      title="首页改版"
      description="统计、日程和看板放在同一面墙上。"
      labelText="进行中"
      labelColor="blue"
      progress={68}
      progressColor="blue"
      date="10月17日"
      width="full"
      className="w-full max-w-full"
      onMenuClick={() => undefined}
    />
  );
}

function TaskOne() {
  return (
    <TaskCard
      title="排期看板"
      description="任务卡可以点开菜单。"
      labelText="进行中"
      labelColor="blue"
      progress={68}
      progressColor="cyan"
      date="10月17日"
      locale="zh"
      width="full"
      className="w-full max-w-full"
      onMenuClick={() => undefined}
    />
  );
}

function ViewPanel() {
  return (
    <Panel title="视图">
      <Segmented />
      <UnderlineTabs />
    </Panel>
  );
}

function TeamPanel() {
  const [on, setOn] = useState(true);
  return (
    <Panel title="团队成员">
      <People />
      <Badges />
      <div className="home-split">
        <span className="text-sm text-fg-grey-700">显示在线</span>
        <Toggle checked={on} onChange={setOn} color="blue" motion="auto" draggable ariaLabel="显示在线" />
      </div>
    </Panel>
  );
}

function ChatPanel() {
  return (
    <Panel title="对话">
      <Thread />
    </Panel>
  );
}

function ReleasePanel() {
  return (
    <Panel title="发布进度">
      <ScoreRing />
      <Steps />
    </Panel>
  );
}

function ActionPanel() {
  return (
    <Panel title="操作">
      <EffectButtons />
    </Panel>
  );
}

function PagePanel() {
  return (
    <Panel title="页码">
      <Pages />
    </Panel>
  );
}

function MessagePanel() {
  return (
    <Panel title="消息">
      <MessageTabs />
    </Panel>
  );
}

function TodoPanel() {
  return (
    <Panel title="待办">
      <TodoList />
      <Filters />
    </Panel>
  );
}

function CommandPanel() {
  return (
    <Panel title="快捷命令">
      <CommandMenu />
    </Panel>
  );
}

function JumpPanel() {
  return (
    <Panel title="跳转">
      <Picker />
      <JumpMenu />
    </Panel>
  );
}

function PasscodePanel() {
  return (
    <Panel title="验证码">
      <Passcode />
    </Panel>
  );
}

function TracePanel() {
  return (
    <Panel title="思考">
      <Trace />
    </Panel>
  );
}

function CalendarPanel() {
  return (
    <Panel title="日历">
      <DatePicker />
    </Panel>
  );
}

function Wall() {
  return (
    <div className="home-wall">
      <div className="home-span">
        <div className="home-span-cols">
          <div className="home-col">
            <ViewPanel />
            <ActionPanel />
            <PagePanel />
          </div>
          <div className="home-col">
            <CalendarPanel />
            <Panel flush><WeekBars /></Panel>
          </div>
        </div>
        <ChatPanel />
      </div>
      <div className="home-col">
        <Panel flush><Metric /></Panel>
        <TeamPanel />
        <Panel flush><TaskOne /></Panel>
        <CommandPanel />
      </div>
    </div>
  );
}

export function HomeHero({ children }: { children: ReactNode }) {
  return (
    <ToastProvider motion="auto" locale="zh">
      <div className="home-hero-copy">{children}</div>
      <div className="home-hero-stage" id="home-hero-wall" data-home-wall>
        <Wall />
      </div>
    </ToastProvider>
  );
}
