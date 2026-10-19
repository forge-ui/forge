"use client";

import { useEffect, useMemo, useState, type Key, type ReactNode } from "react";
import {
  BarChart,
  CalendarCard,
  CellText,
  ChartCard,
  ChatBubble,
  ChatInputBar,
  CommandSearch,
  CommentItem,
  ContactItem,
  DataTable,
  type ChatInputBarQuickAction,
  type CommandSearchItem,
  FileUpload,
  ProgressBar,
  StatusBadge,
  Stepper,
} from "@forge-ui-official/core";
import { CalendarLinear, ChartSquareLinear, ChatRoundLinear } from "@forge-ui-official/core/icons";
import { FormsNavigationExamples } from "../components/_fusion/forms-navigation";

const quickCards: ChatInputBarQuickAction[] = [
  { id: "image", label: "创建图片", kind: "image", placeholder: "描述你想创建的图片…" },
  { id: "note", label: "写笔记", kind: "note", placeholder: "写下想记录的内容…" },
  { id: "event", label: "安排日程", kind: "event", placeholder: "什么活动，什么时候？" },
  { id: "voice", label: "语音输入", kind: "voice", placeholder: "输入要转写的内容…" },
  { id: "docs", label: "分析文档", kind: "docs", placeholder: "上传文档，或者提一个问题…" },
];

function Panel({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`home-panel${className ? ` ${className}` : ""}`}>
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

const commandItems: CommandSearchItem[] = [
  { id: "stats", label: "打开统计", hint: "本周", shortcut: "1", icon: <ChartSquareLinear size={16} /> },
  { id: "calendar", label: "打开日程", hint: "十月", shortcut: "2", icon: <CalendarLinear size={16} /> },
  { id: "chat", label: "打开对话", shortcut: "3", icon: <ChatRoundLinear size={16} /> },
];

function WeekStat() {
  const [index, setIndex] = useState(3);
  const days = [
    { value: 20, label: "一" },
    { value: 36, label: "二" },
    { value: 14, label: "三" },
    { value: 48, label: "四" },
    { value: 28, label: "五" },
  ];
  return (
    <ChartCard className="home-stat" title="本周完成" subtitle="共 146 · 较上周 +12%" width="full" minHeight="min-h-0" action={<></>}>
      <BarChart
        data={days}
        accent="blue"
        color="bg-fg-blue"
        inactiveColor="bg-fg-blue-100"
        motion="auto"
        height="h-20"
        showLabels
        barWidth="wide"
        activeIndex={index}
        onSelect={setIndex}
        ariaLabel="本周完成"
      />
    </ChartCard>
  );
}

function CommandMenu() {
  return (
    <CommandSearch
      className="home-command"
      items={commandItems}
      locale="zh"
      color="blue"
      motion="auto"
      autoFocus={false}
      placeholder="搜索命令…"
      groupLabel="命令"
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

function CelebratePanel() {
  return (
    <section className="home-panel home-celebrate" aria-label="完成庆祝">
      <FormsNavigationExamples id="093" locale="zh" color="blue" motion="auto" />
    </section>
  );
}

const people = [
  { id: "lin", name: "林晓", initials: "林", message: "评审纪要已更新", time: "10:24", online: true },
  { id: "zhou", name: "周宁", initials: "周", message: "上传了本周统计", time: "09:10", online: true },
  { id: "chen", name: "陈可", initials: "陈", message: "等待设计确认", time: "昨天", online: false },
];

function PeoplePanel() {
  const [active, setActive] = useState(people[0].id);
  return (
    <Panel title="成员">
      <div className="home-people">
        {people.map((person) => (
          <button
            key={person.id}
            type="button"
            className="home-people-hit"
            aria-pressed={active === person.id}
            onClick={() => setActive(person.id)}
          >
            <ContactItem
              type="team"
              color="blue"
              name={person.name}
              initials={person.initials}
              message={person.message}
              time={person.time}
              online={person.online}
              active={active === person.id}
            />
          </button>
        ))}
      </div>
    </Panel>
  );
}

function NotePanel() {
  const [replied, setReplied] = useState(false);
  return (
    <Panel title="讨论">
      <CommentItem
        className="home-note"
        avatar="/images/protask/crm/linda-blair-avatar.png"
        name="林晓"
        date="刚刚"
        content={replied ? "收到，我按这个版本收口。" : "第三版的过渡有点快，发布前再看一眼？"}
        replyLabel={replied ? "已回复" : "回复"}
        onReply={() => setReplied(true)}
      />
    </Panel>
  );
}

const orders = [
  { id: "copy", name: "引导文案", status: "进行中" },
  { id: "notes", name: "版本说明", status: "待评审" },
  { id: "list", name: "发布清单", status: "已完成" },
];

function OrdersPanel() {
  const [selected, setSelected] = useState<Set<Key>>(() => new Set(["list"]));
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const rows = useMemo(() => {
    if (!sortKey) return orders;
    return [...orders].sort((a, b) => {
      const left = sortKey === "status" ? a.status : a.name;
      const right = sortKey === "status" ? b.status : b.name;
      const cmp = left.localeCompare(right, "zh");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [sortDir, sortKey]);
  return (
    <Panel title="工单">
      <DataTable
        className="home-table"
        color="blue"
        showCheckbox
        checkboxColor="blue"
        tableMinWidth="100%"
        rows={rows}
        getRowKey={(row) => row.id}
        selectedRowKeys={selected}
        onSelectedRowKeysChange={setSelected}
        sortColumnKey={sortKey ?? undefined}
        sortDirection={sortDir}
        onSort={(key) => {
          setSortDir((current) => (sortKey === key && current === "asc" ? "desc" : "asc"));
          setSortKey(key);
        }}
        columns={[
          { key: "name", header: "事项", sortable: true, render: (row) => <CellText>{row.name}</CellText> },
          {
            key: "status",
            header: "状态",
            sortable: true,
            width: "w-[4.5rem]",
            render: (row) => (
              <StatusBadge
                label={row.status}
                variant="soft"
                color={row.status === "已完成" ? "green" : row.status === "待评审" ? "yellow" : "blue"}
              />
            ),
          },
        ]}
      />
    </Panel>
  );
}

function Thread() {
  const [file, setFile] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setFile(true);
      return;
    }
    const timer = window.setTimeout(() => setFile(true), 650);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <div className="home-thread">
      <ChatBubble type="received" color="blue" motion="auto" senderName="Forge" content="统计、日程和看板都可以直接拿来用。" />
      {file ? (
        <ChatBubble type="sent" color="blue" variant="file" motion="auto" fileName="本周统计.pdf" fileSize="240 KB" />
      ) : null}
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
            <CommandMenu />
          </div>
          <div className="home-col">
            <CalendarPanel />
          </div>
        </div>
        <ChatPanel />
      </div>
      <div className="home-col">
        <div className="home-pair">
          <RingPanel />
          <StepPanel />
        </div>
        <UploadPanel />
        <CelebratePanel />
      </div>
      <div className="home-col home-col-more home-col-more-1">
        <PeoplePanel />
        <NotePanel />
        <OrdersPanel />
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
