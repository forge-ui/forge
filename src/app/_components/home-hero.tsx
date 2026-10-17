"use client";

import { useState, type ReactNode } from "react";
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

const scenes = ["后台", "对话", "项目", "设置"] as const;
type Scene = (typeof scenes)[number];

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

function Segmented() {
  const [index, setIndex] = useState(0);
  return (
    <ButtonGroup
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
    <div className="home-cluster">
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
    <AvatarGroup>
      <Avatar initials="林" size="md" color="blue" />
      <Avatar initials="周" size="md" color="cyan" />
      <Avatar initials="陈" size="md" color="blue" />
    </AvatarGroup>
  );
}

function Thread({ extra = false }: { extra?: boolean }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <ChatBubble type="received" color="blue" motion="auto" senderName="Forge" content="统计、日程和看板都可以直接拿来用。" />
      {extra ? <ChatBubble type="received" color="blue" motion="auto" senderName="林夏" content="看板那一列也可以点进模板。" /> : null}
      <ChatBubble type="sent" color="black" motion="auto" content="输入栏可以打字。" />
      <ChatInputBar className="w-full max-w-full" locale="zh" motion="auto" color="blue" placeholder="写一条消息" />
    </div>
  );
}

function ScoreRing() {
  const [score, setScore] = useState(4);
  const [on, setOn] = useState(true);
  return (
    <div className="home-cluster">
      <ProgressBar variant="ring" value={on ? score * 20 : 0} color="blue" motion="auto" showPercentage label="完成进度" />
      <RatingStars value={score} onChange={setScore} motion="auto" locale="zh" ariaLabel="完成度" />
      <Toggle checked={on} onChange={setOn} color="blue" motion="auto" draggable ariaLabel="计入完成度" />
    </div>
  );
}

function EffectButtons() {
  const { toast } = useToast();
  return (
    <div className="home-cluster">
      <div className="flex items-center rounded-full bg-fg-grey-100 px-3 py-2">
        <Button effect="glass" color="black" size="sm" motion="auto">记下一条</Button>
      </div>
      <Button
        effect="ripple"
        color="blue"
        size="md"
        motion="auto"
        onClick={() => toast({ title: "已记下", description: "可以划掉这条通知。", status: "success" })}
      >
        弹出通知
      </Button>
      <Button data-home-magnetic effect="magnetic" color="blue" size="md" motion="auto" iconRight={arrow}>
        打开看板
      </Button>
    </div>
  );
}

function MessageTabs() {
  return (
    <LiquidTabs
      className="w-full max-w-full"
      motion="auto"
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
    <DropdownPanel motion="auto" width="w-full" className="max-w-full">
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
      width="200px"
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
        height="h-28"
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
  return <CalendarCard color="blue" size="compact" motion="auto" className="max-w-full" />;
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
      tableMinWidth={420}
    />
  );
}

function Steps() {
  const [step, setStep] = useState(2);
  const [page, setPage] = useState(1);
  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
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
      <Pagination totalPages={5} currentPage={page} onPageChange={setPage} color="blue" motion="auto" locale="zh" />
    </div>
  );
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

function Wall({ scene }: { scene: Scene }) {
  if (scene === "对话") {
    return (
      <div className="home-wall">
        <div className="home-col home-col-wide">
          <Thread extra />
          <MessageTabs />
          <Trace />
        </div>
        <div className="home-col">
          <CommandMenu />
          <People />
          <Badges />
          <EffectButtons />
        </div>
        <div className="home-col">
          <Segmented />
          <ScoreRing />
          <Picker />
        </div>
      </div>
    );
  }

  if (scene === "项目") {
    return (
      <div className="home-wall">
        <div className="home-col home-col-wide">
          <Segmented />
          <People />
          <EffectButtons />
          <Steps />
          <ProjectOne />
        </div>
        <div className="home-col">
          <UnderlineTabs />
          <TodoList />
          <ScoreRing />
          <TaskOne />
        </div>
        <div className="home-col">
          <Badges />
          <Filters />
          <JumpMenu />
        </div>
      </div>
    );
  }

  if (scene === "设置") {
    return (
      <div className="home-wall">
        <div className="home-col home-col-wide">
          <MessageTabs />
          <ScoreRing />
          <Passcode />
          <Filters />
          <DatePicker />
        </div>
        <div className="home-col">
          <Picker />
          <JumpMenu />
          <EffectButtons />
          <Steps />
        </div>
        <div className="home-col">
          <Segmented />
          <UnderlineTabs />
          <Badges />
        </div>
      </div>
    );
  }

  return (
    <div className="home-wall">
      <div className="home-col home-col-wide">
        <div className="home-cluster">
          <Segmented />
          <Badges />
        </div>
        <div className="home-cluster">
          <People />
          <ScoreRing />
        </div>
        <Thread />
        <EffectButtons />
        <div className="home-mosaic">
          <MessageTabs />
          <JumpMenu />
        </div>
        <Metric />
        <CommandMenu />
        <WeekBars />
        <DatePicker />
        <TaskTable />
        <Steps />
      </div>
      <div className="home-col">
        <Picker />
        <UnderlineTabs />
        <ProjectOne />
        <TaskOne />
        <TodoList />
      </div>
      <div className="home-col">
        <Filters />
        <Passcode />
        <Trace />
      </div>
    </div>
  );
}

export function HomeHero({ children }: { children: ReactNode }) {
  const [scene, setScene] = useState<Scene>("后台");

  return (
    <ToastProvider motion="auto" locale="zh">
      <div className="home-hero-copy">{children}</div>
      <div className="home-hero-stage" id="home-hero-wall" data-home-wall data-scene={scene}>
        <Wall scene={scene} />
      </div>
      <div className="home-live">
        <span className="home-live-label">实时示例</span>
        <div role="tablist" aria-label="实时示例" className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {scenes.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              id={`home-scene-${item}`}
              aria-selected={scene === item}
              aria-controls="home-hero-wall"
              className={scene === item ? "home-live-tab is-on" : "home-live-tab"}
              onClick={() => setScene(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </ToastProvider>
  );
}
