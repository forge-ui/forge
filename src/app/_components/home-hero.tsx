"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart,
  ButtonGroup,
  CalendarCard,
  ChartCard,
  ChatBubble,
  ChatInputBar,
  CommandSearch,
  CommentItem,
  ContactItem,
  type ChatInputBarQuickAction,
  type CommandSearchItem,
  FileUpload,
  ProgressBar,
  Stepper,
  TabBar,
  Toggle,
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

function PrefPanel() {
  const [flags, setFlags] = useState({ mail: true, save: true, focus: false });
  const rows = [
    { id: "mail" as const, label: "邮件摘要" },
    { id: "save" as const, label: "自动保存" },
    { id: "focus" as const, label: "专注模式" },
  ];
  return (
    <Panel title="偏好">
      <div className="home-prefs">
        {rows.map((row) => (
          <div key={row.id} className="home-pref-row">
            <span>{row.label}</span>
            <Toggle
              size="sm"
              color="blue"
              motion="auto"
              checked={flags[row.id]}
              ariaLabel={row.label}
              onChange={(checked) => setFlags((current) => ({ ...current, [row.id]: checked }))}
            />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ScopePanel() {
  const [index, setIndex] = useState(1);
  return (
    <Panel title="范围">
      <ButtonGroup
        color="blue"
        motion="auto"
        shape="pill"
        ariaLabel="统计范围"
        activeIndex={index}
        onChange={setIndex}
        items={[{ label: "今日" }, { label: "本周" }, { label: "本月" }]}
      />
    </Panel>
  );
}

function ViewPanel() {
  const views = [
    { label: "概览", rows: [["进行中", "12"], ["已完成", "4"], ["今日到期", "3"]] },
    { label: "风险", rows: [["未确认", "2"], ["阻塞", "1"], ["逾期", "0"]] },
    { label: "协作", rows: [["在线", "3"], ["评审", "1"], ["待回复", "2"]] },
  ];
  const [tab, setTab] = useState(0);
  const current = views[tab];
  return (
    <Panel title="视图">
      <TabBar
        color="blue"
        motion="auto"
        ariaLabel="视图"
        onChange={setTab}
        tabs={views.map((view, index) => ({ label: view.label, active: index === tab }))}
      />
      <dl className="home-view-rows" key={current.label}>
        {current.rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
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
        <PrefPanel />
      </div>
      <div className="home-col home-col-more home-col-more-2">
        <ScopePanel />
        <ViewPanel />
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
