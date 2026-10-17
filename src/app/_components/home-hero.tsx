"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Avatar,
  BarChart,
  CalendarCard,
  CellText,
  ChartCard,
  ChatBubble,
  ChatInputBar,
  type ChatInputBarQuickAction,
  DataTable,
  FileUpload,
  NotificationItem,
  ProgressBar,
  StatusBadge,
  Stepper,
  type ColumnDef,
} from "@forge-ui-official/core";

const quickCards: ChatInputBarQuickAction[] = [
  { id: "image", label: "创建图片", kind: "image", placeholder: "描述你想创建的图片…" },
  { id: "note", label: "写笔记", kind: "note", placeholder: "写下想记录的内容…" },
  { id: "event", label: "安排日程", kind: "event", placeholder: "什么活动，什么时候？" },
  { id: "voice", label: "语音输入", kind: "voice", placeholder: "输入要转写的内容…" },
  { id: "docs", label: "分析文档", kind: "docs", placeholder: "上传文档，或者提一个问题…" },
];

function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="home-panel">
      {title ? <p className="home-panel-title">{title}</p> : null}
      <div className="home-panel-body">{children}</div>
    </section>
  );
}

function useTicker(step: number, max: number, every: number) {
  const [value, setValue] = useState(step * 4);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setInterval(() => {
      setValue((current) => (current >= max ? step : current + step));
    }, every);
    return () => window.clearInterval(timer);
  }, [every, max, step]);
  return value;
}

type MatterRow = {
  id: string;
  name: string;
  who: string;
  status: string;
  tone: "blue" | "cyan" | "grey";
  avatar: "blue" | "cyan";
};

const matterRows: MatterRow[] = [
  { id: "1", name: "周报", who: "林", status: "已完成", tone: "blue", avatar: "blue" },
  { id: "2", name: "排期", who: "周", status: "进行中", tone: "cyan", avatar: "cyan" },
  { id: "3", name: "跟进", who: "陈", status: "待开始", tone: "grey", avatar: "blue" },
];

const matterColumns: ColumnDef<MatterRow>[] = [
  {
    key: "name",
    header: "事项",
    flex: true,
    render: (row) => (
      <span className="flex min-w-0 items-center gap-2">
        <Avatar initials={row.who} size="xs" color={row.avatar} />
        <CellText>{row.name}</CellText>
      </span>
    ),
  },
  {
    key: "status",
    header: "状态",
    width: "w-16",
    render: (row) => <StatusBadge label={row.status} color={row.tone} />,
  },
];

function WeekStat() {
  const [index, setIndex] = useState(3);
  const days = [
    { value: 18, label: "一" },
    { value: 24, label: "二" },
    { value: 16, label: "三" },
    { value: 32, label: "四" },
    { value: 22, label: "五" },
  ];
  return (
    <ChartCard className="home-stat" title="本周完成" subtitle="较上周 +12%" width="full" minHeight="min-h-0" action={<></>}>
      <BarChart
        data={days}
        accent="blue"
        color="bg-fg-blue"
        inactiveColor="bg-fg-blue-100"
        motion="auto"
        height="h-12"
        showLabels
        barWidth="wide"
        activeIndex={index}
        onSelect={setIndex}
        ariaLabel="本周完成"
      />
    </ChartCard>
  );
}

function MatterTable() {
  const [keys, setKeys] = useState<ReadonlySet<string>>(() => new Set(["1"]));
  return (
    <DataTable
      className="home-table"
      color="blue"
      rows={matterRows}
      columns={matterColumns}
      selectedRowKeys={keys}
      onSelectedRowKeysChange={(next) => setKeys(new Set([...next].map(String)))}
      getRowKey={(row) => row.id}
      tableMinWidth={200}
    />
  );
}

function RingPanel() {
  const value = useTicker(4, 100, 160);
  return (
    <Panel title="进度">
      <ProgressBar variant="ring" value={value} color="blue" motion="auto" showPercentage label="完成进度" />
    </Panel>
  );
}

function StepPanel() {
  const [step, setStep] = useState(2);
  return (
    <Panel title="步骤">
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
    </Panel>
  );
}

function UploadPanel() {
  const progress = useTicker(6, 100, 180);
  return (
    <Panel title="上传">
      <FileUpload
        className="home-upload"
        color="blue"
        locale="zh"
        files={[{ id: "week", name: "本周统计.pdf", size: "240 KB", state: "uploading", progress }]}
      />
    </Panel>
  );
}

function NoticePanel() {
  const [unread, setUnread] = useState(true);
  return (
    <Panel title="通知">
      <NotificationItem
        tag="评审"
        time="10:00"
        title="首页可以看了"
        body="统计和日程已经排进这一面墙。"
        unread={unread}
        color="blue"
        onMarkRead={() => setUnread(false)}
      />
    </Panel>
  );
}

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
    <div className="home-thread">
      <ChatBubble type="received" color="blue" motion="auto" senderName="Forge" content="统计、日程和看板都可以直接拿来用。" />
      {shown > 1 ? (
        <ChatBubble type="sent" color="blue" variant="file" motion="auto" fileName="本周统计.pdf" fileSize="240 KB" />
      ) : null}
      {shown > 2 ? <ChatBubble type="sent" color="black" motion="auto" content="输入栏可以打字。" /> : null}
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
    </div>
  );
}

function CalendarPanel() {
  return (
    <Panel title="日历">
      <CalendarCard color="blue" size="compact" variant="plain" motion="auto" className="max-w-full" />
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

function Wall() {
  return (
    <div className="home-wall">
      <div className="home-span">
        <div className="home-span-cols">
          <div className="home-col">
            <WeekStat />
            <MatterTable />
          </div>
          <div className="home-col">
            <CalendarPanel />
          </div>
        </div>
        <ChatPanel />
      </div>
      <div className="home-col">
        <RingPanel />
        <StepPanel />
        <UploadPanel />
        <NoticePanel />
      </div>
    </div>
  );
}

export function HomeHero({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="home-hero-copy">{children}</div>
      <div className="home-hero-stage" id="home-hero-wall" data-home-wall>
        <Wall />
      </div>
    </>
  );
}
