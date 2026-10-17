"use client";

import { useState, type ReactNode } from "react";
import {
  Avatar,
  Button,
  ChartCard,
  ChartLegendItem,
  ChatBubble,
  ChatInputBar,
  DonutChart,
  ListItem,
  ProgressBar,
  SmallCalendar,
  StatCard,
  SurfaceCard,
  TextField,
  ThinkingTrace,
  Toggle,
} from "@forge-ui-official/core";
import { AltArrowRightLinear } from "@forge-ui-official/core/icons";

const scenes = ["后台", "对话", "项目", "设置"] as const;
type Scene = (typeof scenes)[number];

const arrow = <AltArrowRightLinear size={16} color="currentColor" />;

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <SurfaceCard title={title} subtitle={subtitle} padding="sm" className="w-full max-w-full">
      {children}
    </SurfaceCard>
  );
}

function Stats() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard title="本周完成" value="128" trend="+12%" subtitle="较上周" theme="blue" size="sm" density="compact" width="full" motion="auto" />
      <StatCard title="进行中" value="36" subtitle="个任务" theme="black" size="sm" density="compact" width="full" motion="auto" />
    </div>
  );
}

function TaskChart() {
  return (
    <div className="relative min-w-0">
      <ChartCard title="任务分布" subtitle="按状态" width="full" minHeight="min-h-0" action={<></>}>
        <DonutChart
          size="sm"
          accent="blue"
          motion="auto"
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
      <div className="pointer-events-none absolute right-4 top-16">
        <Button data-home-glass effect="glass" color="blue" size="sm" motion="auto" className="pointer-events-auto">
          导出本周
        </Button>
      </div>
    </div>
  );
}

function TeamList() {
  const people = [
    { name: "林夏", role: "设计", email: "lin.xia@example.com", initials: "林" },
    { name: "周衡", role: "研发", email: "zhou.heng@example.com", initials: "周" },
    { name: "陈可", role: "产品", email: "chen.ke@example.com", initials: "陈" },
    { name: "吴宁", role: "运营", email: "wu.ning@example.com", initials: "吴" },
  ];
  return (
    <Panel title="团队" subtitle="管理成员">
      <div className="flex flex-col gap-3">
        {people.map((person) => (
          <ListItem
            key={person.name}
            lead={{ kind: "avatar", initials: person.initials, alt: person.name, size: "sm" }}
            title={person.name}
            subtitle={`${person.role} · ${person.email}`}
          />
        ))}
      </div>
    </Panel>
  );
}

function NotifySettings() {
  const rows = [
    { label: "评论", ariaLabel: "评论通知", color: "blue" as const, defaultChecked: true },
    { label: "邮件", ariaLabel: "邮件通知", color: "blue" as const, defaultChecked: true },
    { label: "站内信", ariaLabel: "站内信通知", color: "black" as const, defaultChecked: false },
  ];
  return (
    <Panel title="通知" subtitle="选择要接收的提醒">
      <div className="grid grid-cols-3 gap-3">
        {rows.map((row) => (
          <div key={row.ariaLabel} className="flex items-center justify-between gap-2">
            <span className="text-sm text-fg-black">{row.label}</span>
            <Toggle defaultChecked={row.defaultChecked} color={row.color} ariaLabel={row.ariaLabel} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function LoginForm() {
  return (
    <Panel title="登录" subtitle="已有账号直接进入">
      <div className="grid grid-cols-2 gap-3" data-home-login>
        <TextField label="邮箱" placeholder="name@example.com" color="blue" autoComplete="email" />
        <TextField label="密码" type="password" placeholder="输入密码" color="blue" autoComplete="current-password" />
      </div>
      <div className="mt-3">
        <Button color="black" size="md" motion="auto">登录</Button>
      </div>
    </Panel>
  );
}

function CalendarCard() {
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

function ChatStack() {
  return (
    <Panel title="对话" subtitle="和后台用的是同一套组件">
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
      </div>
    </Panel>
  );
}

function Composer() {
  return (
    <Panel title="消息" subtitle="写一条再发送">
      <ChatInputBar locale="zh" motion="auto" color="blue" placeholder="写一条消息" />
    </Panel>
  );
}

function TaskCard({ name, status, progress, bar, who }: { name: string; status: string; progress: number; bar: "blue" | "cyan" | "black"; who: string }) {
  return (
    <SurfaceCard title={name} subtitle={status} padding="sm" className="w-full">
      <ProgressBar value={progress} color={bar} showPercentage motion="auto" />
      <div className="mt-3">
        <Avatar initials={who} size="sm" color={bar === "black" ? "blue" : bar} alt="" />
      </div>
    </SurfaceCard>
  );
}

function Wall({ scene }: { scene: Scene }) {
  if (scene === "对话") {
    return (
      <div className="home-wall">
        <div className="home-col home-col-wide"><ChatStack /><Composer /></div>
        <div className="home-col">
          <ChatBubble type="received" color="blue" motion="auto" senderName="林夏" content="看板那一列也可以点进模板。" />
          <ChatBubble type="sent" color="black" motion="auto" content="我先看统计卡。" />
          <Composer />
        </div>
        <div className="home-col"><NotifySettings /><TeamList /></div>
      </div>
    );
  }

  if (scene === "项目") {
    return (
      <div className="home-wall">
        <div className="home-col home-col-wide">
          <p className="px-1 text-sm font-semibold text-fg-black">待办</p>
          <TaskCard name="整理周报" status="待排期" progress={8} bar="black" who="林" />
          <TaskCard name="核对发票" status="待开始" progress={12} bar="blue" who="吴" />
          <div className="flex justify-center px-8 py-6">
            <Button effect="magnetic" color="blue" size="md" motion="auto" iconRight={arrow}>打开看板</Button>
          </div>
        </div>
        <div className="home-col">
          <p className="px-1 text-sm font-semibold text-fg-black">进行中</p>
          <TaskCard name="客户跟进" status="进行中" progress={46} bar="cyan" who="陈" />
          <TaskCard name="排期看板" status="进行中" progress={68} bar="blue" who="周" />
        </div>
        <div className="home-col">
          <p className="px-1 text-sm font-semibold text-fg-black">已完成</p>
          <TaskCard name="上线统计卡" status="完成" progress={100} bar="black" who="何" />
        </div>
      </div>
    );
  }

  if (scene === "设置") {
    return (
      <div className="home-wall">
        <div className="home-col home-col-wide"><TeamList /><NotifySettings /></div>
        <div className="home-col"><LoginForm /></div>
        <div className="home-col"><Stats /></div>
      </div>
    );
  }

  return (
    <div className="home-wall">
      <div className="home-col home-col-wide">
        <Stats />
        <NotifySettings />
        <LoginForm />
        <TaskChart />
      </div>
      <div className="home-col">
        <TeamList />
        <div className="flex justify-start px-1 py-2">
          <Button data-home-magnetic effect="magnetic" color="blue" size="md" motion="auto" iconRight={arrow}>打开看板</Button>
        </div>
        <CalendarCard />
      </div>
      <div className="home-col">
        <ChatStack />
        <TaskCard name="排期看板" status="进行中" progress={68} bar="blue" who="周" />
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
