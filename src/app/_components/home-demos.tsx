"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Avatar,
  BarChart,
  Button,
  ChartCard,
  ChartLegendItem,
  ChatBubble,
  ChatInputBar,
  DataTable,
  ProgressBar,
  SmallCalendar,
  StatusBadge,
  CellText,
  SurfaceCard,
  ThinkingTrace,
  type ColumnDef,
} from "@forge-ui-official/core";
import { AltArrowRightLinear } from "@forge-ui-official/core/icons";

const arrow = <AltArrowRightLinear size={16} color="currentColor" />;

type TableRow = {
  id: string;
  name: string;
  status: string;
  tone: "blue" | "cyan" | "grey";
  owner: string;
  progress: number;
};

const tableRows: TableRow[] = [
  { id: "1", name: "周报统计", status: "已完成", tone: "blue", owner: "林夏", progress: 100 },
  { id: "2", name: "排期看板", status: "进行中", tone: "cyan", owner: "周衡", progress: 68 },
  { id: "3", name: "客户跟进", status: "进行中", tone: "blue", owner: "陈可", progress: 46 },
  { id: "4", name: "发票核对", status: "待开始", tone: "grey", owner: "吴宁", progress: 12 },
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
    render: (row) => <StatusBadge label={row.status} color={row.tone} />,
  },
  {
    key: "owner",
    header: "负责人",
    render: (row) => <CellText>{row.owner}</CellText>,
  },
  {
    key: "progress",
    header: "进度",
    render: (row) => (
      <div className="w-28 max-w-full">
        <ProgressBar
          value={row.progress}
          color={row.tone === "cyan" ? "cyan" : row.tone === "grey" ? "black" : "blue"}
          motion="auto"
        />
      </div>
    ),
  },
];

const board = [
  {
    title: "待办",
    tasks: [
      { name: "整理周报", status: "待排期", progress: 8, bar: "black" as const, who: "林", color: "blue" as const },
      { name: "核对发票", status: "待开始", progress: 12, bar: "blue" as const, who: "吴", color: "cyan" as const },
    ],
  },
  {
    title: "进行中",
    tasks: [
      { name: "客户跟进", status: "进行中", progress: 46, bar: "cyan" as const, who: "陈", color: "blue" as const },
      { name: "排期看板", status: "进行中", progress: 68, bar: "blue" as const, who: "周", color: "cyan" as const },
    ],
  },
  {
    title: "已完成",
    tasks: [
      { name: "上线统计卡", status: "完成", progress: 100, bar: "black" as const, who: "何", color: "blue" as const },
    ],
  },
];

const templates = [
  { href: "/templates/finance-template", title: "财务", text: "概览、交易、钱包和发票。" },
  { href: "/templates/crm-template", title: "客户关系", text: "客户、线索、销售和活动。" },
  { href: "/templates/micellaneous-template", title: "杂项", text: "日历、聊天、文件和表格放在同一套侧栏里。" },
  { href: "/templates/ecommerce/products", title: "电商后台", text: "商品、订单、客户和分类。" },
  { href: "/templates/dashboards", title: "仪表盘", text: "项目、分析和财务的控制台。" },
  { href: "/templates/agent", title: "智能体", text: "思考过程、工具调用和输入栏。" },
];

function SectionHeading({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: string;
}) {
  return (
    <div className="mb-5 max-w-2xl">
      <h2 id={id} className="font-display text-2xl font-bold tracking-tight text-fg-black sm:text-3xl">{title}</h2>
      <p className="mt-2 text-base leading-7 text-fg-grey-900">{children}</p>
    </div>
  );
}

export function HomeBelow() {
  const day = new Date().getDate();
  const [drafts, setDrafts] = useState<string[]>([]);

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[1200px] flex-col gap-16 px-4 pt-12 lg:gap-24 lg:pt-16">
      <section className="min-w-0" aria-labelledby="home-motion">
        <SectionHeading id="home-motion" title="动效">玻璃、跟随、涟漪、文字切换，再加一张光照倾斜卡。都放在有内容的底板上。</SectionHeading>
        <div className="home-board home-clip p-4 sm:p-6">
          <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="min-w-0">
              <p className="mb-3 text-xs font-medium text-fg-grey-900">玻璃</p>
              <div className="relative min-w-0 overflow-clip rounded-2xl bg-fg-grey-100 p-4 sm:p-5">
                <div className="flex max-w-[16rem] flex-col gap-3">
                  <ChartLegendItem accent="blue" label="已完成" value="128" />
                  <ChartLegendItem color="bg-fg-cyan-500" label="进行中" value="36" />
                  <ChartLegendItem accent="black" label="待办" value="18" />
                </div>
                <p className="mt-4 max-w-xs text-sm leading-6 text-fg-grey-900">导出按钮盖在这些数字旁边，底下的字还能看见。</p>
                <div className="pointer-events-none absolute bottom-4 right-4">
                  <Button data-home-glass-band effect="glass" color="blue" size="sm" motion="auto" className="pointer-events-auto">
                    导出本周
                  </Button>
                </div>
              </div>
            </div>
            <div className="home-clip min-w-0">
              <p className="mb-3 text-xs font-medium text-fg-grey-900">光照倾斜</p>
              <SurfaceCard
                data-home-tilt
                effect="tilt"
                motion="auto"
                title="本周进展"
                subtitle="今天"
                className="w-full max-w-full"
              >
                <p className="text-sm leading-6 text-fg-grey-900">
                  指针移到卡片上，光会跟着走。系统要求减弱动效时，这张卡保持平的。
                </p>
              </SurfaceCard>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-end justify-center gap-x-10 gap-y-6 px-6 py-8">
            <div className="flex flex-col items-center">
              <p className="mb-3 text-xs font-medium text-fg-grey-900">跟随</p>
              <Button data-home-magnetic-band effect="magnetic" color="blue" size="md" motion="auto" iconRight={arrow}>
                打开看板
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <p className="mb-3 text-xs font-medium text-fg-grey-900">涟漪</p>
              <Button data-home-ripple effect="ripple" color="blue" size="md" motion="auto">
                记一笔
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <p className="mb-3 text-xs font-medium text-fg-grey-900">文字切换</p>
              <Button data-home-roll effect="roll" color="blue" size="md" motion="auto">
                切换视图
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="min-w-0" aria-labelledby="home-data">
        <SectionHeading id="home-data" title="数据">图表、小日历和表格按后台页面排在一起。</SectionHeading>
        <div className="home-board grid min-w-0 gap-4 p-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <div data-home-calendar className="min-w-0">
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
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <div data-home-bars className="min-w-0">
              <ChartCard title="本周处理量" subtitle="按天" width="full" minHeight="min-h-0" action={<></>}>
                <BarChart
                  accent="blue"
                  color="bg-fg-blue"
                  motion="auto"
                  barWidth="wide"
                  height="h-40"
                  showLabels
                  ariaLabel="本周处理量"
                  data={[
                    { label: "一", value: 18 },
                    { label: "二", value: 24 },
                    { label: "三", value: 21 },
                    { label: "四", value: 32 },
                    { label: "五", value: 28 },
                  ]}
                />
              </ChartCard>
            </div>
            <div data-home-table className="min-w-0">
              <DataTable
                title="进行中的事项"
                subtitle="和左侧日程是同一周"
                color="blue"
                columns={tableColumns}
                rows={tableRows}
                getRowKey={(row) => row.id}
                footerLeft="显示 1-4，共 4 条"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="min-w-0" aria-labelledby="home-chat">
        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-10">
          <div>
            <h2 id="home-chat" className="font-display text-2xl font-bold tracking-tight text-fg-black sm:text-3xl">
              人和编码助手，用的是同一套组件
            </h2>
            <p className="mt-3 text-base leading-7 text-fg-grey-900">
              写后台的人看到的气泡、思考步骤和输入栏，编码助手也按同一份规则来用。规则放在项目根的 AGENTS.md。
            </p>
            <Link href="/docs/agents-md" className="mt-4 inline-flex text-sm font-medium text-fg-blue hover:underline">
              查看 AGENTS.md
            </Link>
          </div>
          <div data-home-chat className="home-board flex min-w-0 flex-col gap-4 p-4 sm:p-5">
            <ChatBubble
              type="received"
              color="blue"
              motion="auto"
              senderName="Forge"
              content="统计卡、日历、看板和这栏输入，都是组件库里的。"
            />
            <ThinkingTrace
              variant="steps"
              locale="zh"
              motion="auto"
              settled
              doneLabel="已对照 AGENTS.md"
              rows={[
                { primary: "读取 AGENTS.md" },
                { primary: "对照按钮、表格和对话的写法" },
                { primary: "按同一套组件往下排" },
              ]}
            />
            <ChatBubble type="sent" color="black" motion="auto" content="输入栏可以直接打字。" />
            {drafts.map((text, index) => (
              <ChatBubble key={`${index}-${text}`} type="sent" color="blue" motion="auto" content={text} />
            ))}
            <ChatInputBar
              locale="zh"
              motion="auto"
              color="blue"
              multiline={false}
              placeholder="写一条消息"
              onSend={(message) => setDrafts((current) => [...current, message])}
            />
          </div>
        </div>
      </section>

      <section className="min-w-0" aria-labelledby="home-templates">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-2xl">
            <h2 id="home-templates" className="font-display text-2xl font-bold tracking-tight text-fg-black sm:text-3xl">模板</h2>
            <p className="mt-2 text-base leading-7 text-fg-grey-900">
              项目管理里的看板可以点进去。下面几套用的是同一张卡片，只是小一号。
            </p>
          </div>
          <Link href="/templates/project-template" className="text-sm font-medium text-fg-blue hover:underline">
            进入项目管理模板
          </Link>
        </div>
        <div className="relative min-w-0" data-home-kanban>
          <div className="pointer-events-none grid gap-4 sm:grid-cols-3">
            {board.map((column) => (
              <div key={column.title} className="flex min-w-0 flex-col gap-3">
                <h3 className="text-sm font-semibold text-fg-black">
                  {column.title}
                  <span className="ml-2 font-medium text-fg-grey-900">{column.tasks.length}</span>
                </h3>
                {column.tasks.map((task) => (
                  <SurfaceCard key={task.name} title={task.name} subtitle={task.status} padding="sm" className="w-full max-w-full">
                    <ProgressBar value={task.progress} color={task.bar} showPercentage motion="auto" />
                    <div className="mt-3">
                      <Avatar initials={task.who} size="sm" color={task.color} alt="" />
                    </div>
                  </SurfaceCard>
                ))}
              </div>
            ))}
          </div>
          <Link
            href="/templates/project-template"
            aria-label="进入项目管理模板"
            className="absolute inset-0 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-blue"
          />
        </div>
        <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((item) => (
            <div key={item.href} className="relative min-w-0">
              <div className="pointer-events-none">
                <SurfaceCard title={item.title} padding="sm" className="w-full max-w-full">
                  <p className="text-sm leading-6 text-fg-grey-900">{item.text}</p>
                </SurfaceCard>
              </div>
              <Link
                href={item.href}
                aria-label={`打开${item.title}模板`}
                className="absolute inset-0 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-blue"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
