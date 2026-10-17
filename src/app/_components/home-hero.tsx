"use client";

import { useState, type ReactNode } from "react";
import {
  BarChart,
  BarChartStatCard,
  Button,
  CalendarCard,
  ChartCard,
  Checklist,
  ChatBubble,
  ChatInputBar,
  DataTable,
  DonutChart,
  ChartLegendItem,
  LiquidTabs,
  ProjectCard,
  RatingStars,
  SmallCalendar,
  SmoothLineChart,
  StatusBadge,
  CellText,
  SurfaceCard,
  TaskCard,
  ThinkingTrace,
  WheelChartStatCard,
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

function Metrics() {
  return (
    <div className="home-metrics grid grid-cols-2 gap-4">
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
      <BarChartStatCard
        title="进行中"
        value="36"
        subtitle="个任务"
        theme="black"
        size="sm"
        density="compact"
        barColor="cyan"
        bars={[14, 22, 18, 28, 24]}
        width="full"
      />
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
    <ChartCard
      title="本周完成"
      subtitle="点一根柱子"
      width="full"
      minHeight="min-h-0"
      action={<></>}
    >
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

function Trend() {
  const [active, setActive] = useState<number | undefined>(4);
  return (
    <ChartCard title="近七天" subtitle="指针停在线上" width="full" minHeight="min-h-0" action={<></>}>
      <SmoothLineChart
        accent="blue"
        motion="auto"
        height="h-24"
        ariaLabel="近七天趋势"
        activeIndex={active}
        onActiveIndexChange={setActive}
        xAxisLabels={["一", "二", "三", "四", "五", "六", "日"]}
        series={[{ data: [12, 18, 15, 24, 22, 28, 26], fillArea: true, label: "完成" }]}
      />
    </ChartCard>
  );
}

function Mix() {
  const [active, setActive] = useState<number | undefined>();
  return (
    <ChartCard title="任务分布" subtitle="点一段环形" width="full" minHeight="min-h-0" action={<></>}>
      <DonutChart
        size="sm"
        accent="blue"
        motion="auto"
        interactive
        activeIndex={active}
        onSegmentToggle={(index) => setActive((current) => (current === index ? undefined : index))}
        centerValue="182"
        ariaLabel="任务分布"
        segments={[
          { value: 128, label: "已完成", color: "bg-fg-blue" },
          { value: 36, label: "进行中", color: "bg-fg-cyan-500" },
          { value: 18, label: "待办", color: "bg-fg-black" },
        ]}
      />
      <div className="flex w-full min-w-0 flex-col gap-2">
        <ChartLegendItem accent="blue" label="已完成" value="128" />
        <ChartLegendItem color="bg-fg-cyan-500" label="进行中" value="36" />
        <ChartLegendItem accent="black" label="待办" value="18" />
      </div>
    </ChartCard>
  );
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

function Agenda() {
  const day = new Date().getDate();
  return (
    <SmallCalendar
      title="日程"
      subtitle="今天的安排"
      color="blue"
      width="full"
      events={[
        { day, title: "评审首页", timeRange: "10:00 – 10:30", color: "blue" },
        { day, title: "对齐看板", timeRange: "14:00 – 14:45", color: "cyan" },
        { day, title: "看对话记录", timeRange: "16:30 – 17:00", color: "black" },
      ]}
    />
  );
}

function DatePicker() {
  return <CalendarCard color="blue" size="compact" motion="auto" className="max-w-full" />;
}

function BoardCard({
  title,
  description,
  label,
  labelColor,
  progress,
  progressColor,
  date,
}: {
  title: string;
  description: string;
  label: string;
  labelColor: "blue" | "cyan" | "gray";
  progress: number;
  progressColor: "blue" | "cyan" | "gray";
  date: string;
}) {
  return (
    <TaskCard
      title={title}
      description={description}
      labelText={label}
      labelColor={labelColor}
      progress={progress}
      progressColor={progressColor}
      date={date}
      locale="zh"
      width="full"
      className="w-full max-w-full"
      onMenuClick={() => undefined}
    />
  );
}

function ChatStack() {
  return (
    <SurfaceCard title="对话" subtitle="和后台用的是同一套组件" padding="sm" className="w-full max-w-full">
      <div className="flex flex-col gap-3">
        <ChatBubble type="received" color="blue" motion="auto" senderName="Forge" content="统计、日程和看板都可以直接拿来用。" />
        <ThinkingTrace
          variant="steps"
          locale="zh"
          motion="auto"
          settled
          doneLabel="已对照 AGENTS.md"
          rows={[{ primary: "读取 AGENTS.md" }, { primary: "对照组件写法" }, { primary: "排进这一页" }]}
        />
        <ChatBubble type="sent" color="black" motion="auto" content="输入栏可以打字。" />
        <ChatInputBar locale="zh" motion="auto" color="blue" placeholder="写一条消息" />
      </div>
    </SurfaceCard>
  );
}

function MessageTabs() {
  return (
    <LiquidTabs
      motion="auto"
      label="消息分类"
      tabs={[
        {
          id: "today",
          label: "今天",
          items: [
            { id: "review", title: "评审首页", subtitle: "10:00" },
            { id: "board", title: "对齐看板", subtitle: "14:00" },
          ],
        },
        {
          id: "todo",
          label: "待办",
          items: [{ id: "report", title: "整理周报", subtitle: "待排期" }],
        },
        {
          id: "done",
          label: "完成",
          items: [{ id: "ship", title: "上线统计卡", subtitle: "已完成" }],
        },
      ]}
    />
  );
}

function TodoList() {
  return (
    <SurfaceCard title="待办" subtitle="点一下会划掉" padding="sm" className="w-full max-w-full">
      <Checklist
        motion="auto"
        color="blue"
        size="sm"
        defaultTasks={[
          { id: "stats", label: "核对统计卡", done: true },
          { id: "board", label: "排进看板" },
          { id: "chat", label: "看对话记录" },
        ]}
      />
    </SurfaceCard>
  );
}

function Score() {
  const [value, setValue] = useState(4);
  return (
    <SurfaceCard title="这周的完成度" padding="sm" className="w-full max-w-full">
      <RatingStars value={value} onChange={setValue} motion="auto" locale="zh" ariaLabel="这周的完成度" />
    </SurfaceCard>
  );
}

function RateWheel() {
  return (
    <WheelChartStatCard
      title="完成率"
      value="68%"
      subtitle="本周"
      theme="white"
      size="sm"
      density="compact"
      wheelColor="cyan"
      wheelPercent={68}
      width="full"
    />
  );
}

function Wall({ scene }: { scene: Scene }) {
  if (scene === "对话") {
    return (
      <div className="home-wall">
        <div className="home-col home-col-wide">
          <ChatStack />
        </div>
        <div className="home-col">
          <ChatBubble type="received" color="blue" motion="auto" senderName="林夏" content="看板那一列也可以点进模板。" />
          <ChatBubble type="sent" color="black" motion="auto" content="我先看趋势。" />
          <ChatInputBar locale="zh" motion="auto" color="blue" placeholder="再写一条" />
        </div>
        <div className="home-col">
          <MessageTabs />
          <ThinkingTrace
            variant="steps"
            locale="zh"
            motion="auto"
            settled
            doneLabel="已对照 AGENTS.md"
            rows={[{ primary: "读取 AGENTS.md" }, { primary: "排进对话" }]}
          />
        </div>
      </div>
    );
  }

  if (scene === "项目") {
    return (
      <div className="home-wall">
        <div className="home-col home-col-wide">
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
          <BoardCard title="整理周报" description="把本周数字收进统计卡。" label="待办" labelColor="gray" progress={8} progressColor="cyan" date="10月18日" />
          <div className="flex justify-start px-1 py-2">
            <Button data-home-magnetic effect="magnetic" color="blue" size="md" motion="auto" iconRight={arrow}>打开看板</Button>
          </div>
        </div>
        <div className="home-col">
          <BoardCard title="客户跟进" description="对照对话里的记录。" label="进行中" labelColor="cyan" progress={46} progressColor="blue" date="10月17日" />
          <BoardCard title="排期看板" description="三列都用任务卡。" label="进行中" labelColor="blue" progress={68} progressColor="cyan" date="10月20日" />
        </div>
        <div className="home-col">
          <BoardCard title="上线统计卡" description="折线和柱形都已放上。" label="完成" labelColor="gray" progress={100} progressColor="blue" date="10月16日" />
          <Button effect="ripple" color="blue" size="md" motion="auto">记下一条</Button>
        </div>
      </div>
    );
  }

  if (scene === "设置") {
    return (
      <div className="home-wall">
        <div className="home-col home-col-wide">
          <MessageTabs />
          <TodoList />
        </div>
        <div className="home-col">
          <Score />
          <RateWheel />
          <Button effect="ripple" color="black" size="md" motion="auto">保存这组</Button>
        </div>
        <div className="home-col">
          <DatePicker />
        </div>
      </div>
    );
  }

  return (
    <div className="home-wall">
      <div className="home-col home-col-wide">
        <Metrics />
        <WeekBars />
        <DatePicker />
        <Mix />
        <Trend />
        <Agenda />
        <TaskTable />
      </div>
      <div className="home-col">
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
        <BoardCard title="排期看板" description="任务卡可以点开菜单。" label="进行中" labelColor="blue" progress={68} progressColor="cyan" date="10月17日" />
        <div className="flex justify-start px-1 py-2">
          <Button data-home-magnetic effect="magnetic" color="blue" size="md" motion="auto" iconRight={arrow}>打开看板</Button>
        </div>
      </div>
      <div className="home-col">
        <ChatStack />
        <TodoList />
      </div>
    </div>
  );
}

export function HomeHero({ children }: { children: ReactNode }) {
  const [scene, setScene] = useState<Scene>("后台");

  return (
    <>
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
    </>
  );
}
