"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Button,
  ChatBubble,
  Checkbox,
  ColorPicker,
  Label,
  ProgressBar,
  SmallCalendar,
  StatCard,
  TextField,
  ThinkingTrace,
  Toggle,
  UserCard,
  type ButtonColor,
  type ProgressColor,
} from "@forge-ui-official/core";
import type { CardTheme } from "@forge-ui-official/core";
import { asset } from "@/lib/asset";

const tones: {
  dot: string;
  name: string;
  button: ButtonColor;
  card: CardTheme;
  bar: ProgressColor;
  check: "blue" | "green" | "red" | "black";
}[] = [
  { dot: "bg-fg-blue", name: "蓝", button: "blue", card: "blue", bar: "blue", check: "blue" },
  { dot: "bg-fg-cyan-500", name: "青", button: "blue", card: "cyan", bar: "cyan", check: "blue" },
  { dot: "bg-fg-green-500", name: "绿", button: "green", card: "green", bar: "green", check: "green" },
  { dot: "bg-fg-yellow", name: "黄", button: "yellow", card: "white", bar: "yellow", check: "blue" },
  { dot: "bg-fg-red", name: "红", button: "red", card: "red", bar: "red", check: "red" },
  { dot: "bg-fg-black", name: "黑", button: "black", card: "black", bar: "black", check: "black" },
];

const scenes = [
  { id: "components", label: "组件" },
  { id: "dashboard", label: "后台" },
  { id: "chat", label: "对话" },
  { id: "motion", label: "动效" },
  { id: "templates", label: "模板" },
] as const;

type SceneId = (typeof scenes)[number]["id"];

const templates = [
  {
    href: "/templates/project-template",
    title: "项目管理",
    text: "项目、客户、任务和发票。",
    image: asset("/images/showcase/project-template.png"),
  },
  {
    href: "/templates/finance-template",
    title: "财务",
    text: "概览、交易、钱包和发票。",
    image: asset("/images/showcase/templates/finance-template-home.png"),
  },
  {
    href: "/templates/crm-template",
    title: "客户关系",
    text: "客户、线索、销售和活动。",
    image: asset("/images/showcase/templates/crm-template-home.png"),
  },
];

export function HomeStage({ version }: { version: string }) {
  const [scene, setScene] = useState<SceneId>("components");
  const [toneIndex, setToneIndex] = useState(0);
  const tone = tones[toneIndex] ?? tones[0];
  const day = new Date().getDate();

  return (
    <div className="mt-2 flex w-full max-w-[1200px] flex-col py-6 text-left lg:py-10">
      <div className="mb-4 flex w-full min-w-0 flex-col gap-4 px-1 lg:flex-row lg:items-center lg:justify-between">
        <div className="home-tabs max-w-full overflow-x-auto p-1">
          <div className="flex w-max gap-1" role="tablist" aria-label="首页示例">
            {scenes.map((item) => {
              const selected = scene === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`home-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`home-panel-${item.id}`}
                  onClick={() => setScene(item.id)}
                  className={
                    selected
                      ? "rounded-full bg-white px-3 py-1.5 text-sm font-medium text-fg-black shadow-sm"
                      : "rounded-full px-3 py-1.5 text-sm font-medium text-fg-grey-800 hover:text-fg-black"
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-3 lg:justify-end">
          <span className="text-[13px] font-medium text-fg-grey-800">版本 {version}</span>
          <ColorPicker
            colors={tones.map((item) => item.dot)}
            selectedIndex={toneIndex}
            onChange={setToneIndex}
          />
        </div>
      </div>

      <div className="home-panel flex min-h-[36rem] w-full min-w-0 items-center justify-center overflow-x-hidden px-4 py-10 sm:px-8">
        <div
          role="tabpanel"
          id={`home-panel-${scene}`}
          aria-labelledby={`home-tab-${scene}`}
        >
          {scene === "components" ? <ComponentsScene tone={tone} /> : null}
          {scene === "dashboard" ? <DashboardScene tone={tone} day={day} /> : null}
          {scene === "chat" ? <ChatScene /> : null}
          {scene === "motion" ? <MotionScene /> : null}
          {scene === "templates" ? <TemplatesScene /> : null}
        </div>
      </div>
    </div>
  );
}

function ComponentsScene({ tone }: { tone: (typeof tones)[number] }) {
  const [checked, setChecked] = useState(true);
  const [on, setOn] = useState(true);

  return (
    <div className="mx-auto grid w-fit max-w-full grid-cols-1 justify-center gap-8 md:grid-cols-2 xl:grid-cols-3">
      <div className="flex w-full max-w-[320px] flex-col items-center gap-8">
        <div className="w-full max-w-[256px]">
          <TextField label="单号" placeholder="例如 3021" />
        </div>
        <div className="flex items-center justify-center gap-6">
          <Checkbox checked={checked} onChange={setChecked} color={tone.check} aria-label="已核对" motion="auto" />
          <Toggle checked={on} onChange={setOn} color="blue" ariaLabel="接收通知" motion="auto" />
          <Label color="blue" size="sm">进行中</Label>
        </div>
        <div className="w-full max-w-[256px]">
          <ProgressBar value={on ? 72 : 36} color={tone.bar} label="同步" showPercentage motion="auto" />
        </div>
        <div className="home-card w-full max-w-[256px] p-3 text-left">
          <p className="px-2 py-1 text-xs font-medium text-fg-grey-800">采购单</p>
          {["3021 收纳包", "3020 耳机", "3019 手表"].map((row) => (
            <p key={row} className="rounded-xl px-2 py-2 text-sm text-fg-black">{row}</p>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-[360px] flex-col items-center gap-8">
        <div className="grid grid-cols-3 gap-2">
          <Button color={tone.button} size="sm">提交</Button>
          <Button color="black" variant="secondary" size="sm">暂存</Button>
          <Button color="black" variant="tertiary" size="sm">取消</Button>
          <Button color="green" size="sm">通过</Button>
          <Button color="red" variant="secondary" size="sm">退回</Button>
          <Button color="grey" variant="tertiary" size="sm">更多</Button>
        </div>
        <UserCard
          initials="林"
          initialsColor="blue"
          name="林可"
          subtitle={<span className="text-xs text-fg-grey-800">采购</span>}
          badge={<Label color="blue" size="sm">在岗</Label>}
          stats={[{ label: "待办", value: "6" }, { label: "完成", value: "18" }]}
          width="full"
          className="home-card max-w-[280px] outline-none"
        />
        <div className="home-card flex w-full items-center justify-between gap-3 p-4 text-left">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-fg-black">有 3 张发票待核对</p>
            <p className="text-xs leading-5 text-fg-grey-800">打开采购单继续处理。</p>
          </div>
          <Button color={tone.button} size="sm">去处理</Button>
        </div>
      </div>

      <div className="flex w-full max-w-[340px] flex-col items-center gap-5 md:col-span-2 xl:col-span-1">
        <StatCard
          title="本月回款"
          value="128,400"
          trend="12%"
          trendDirection="up"
          subtitle="较上月"
          theme={tone.card}
          size="sm"
          density="compact"
          width="full"
          motion="auto"
          className="home-card max-w-[320px]"
        />
        <div className="flex flex-wrap justify-center gap-2">
          <Label color="blue" size="sm" variant="solid">蓝</Label>
          <Label color="green" size="sm">已核对</Label>
          <Label color="red" size="sm">待发货</Label>
          <Label color="gray" size="sm">草稿</Label>
        </div>
      </div>
    </div>
  );
}

function DashboardScene({ tone, day }: { tone: (typeof tones)[number]; day: number }) {
  return (
    <div className="mx-auto grid w-fit max-w-full grid-cols-1 items-start justify-center gap-8 md:grid-cols-2 xl:grid-cols-3">
      <StatCard
        title="本月回款"
        value="128,400"
        trend="12%"
        subtitle="较上月"
        theme={tone.card}
        size="sm"
        density="compact"
        width="full"
        motion="auto"
        className="home-card w-full max-w-[320px]"
      />
      <UserCard
        initials="周"
        initialsColor="green"
        name="周宁"
        subtitle={<span className="text-xs text-fg-grey-800">财务</span>}
        stats={[{ label: "发票", value: "14" }, { label: "待付", value: "3" }]}
        width="full"
        className="home-card w-full max-w-[280px] outline-none"
      />
      <div className="w-full max-w-[340px] md:col-span-2 xl:col-span-1">
        <SmallCalendar
          title="本周日程"
          subtitle="采购与对账"
          color="blue"
          width="full"
          className="home-card"
          events={[{ day, title: "核对发票", timeRange: "10:00 – 10:30", color: "blue" }]}
        />
      </div>
    </div>
  );
}

function ChatScene() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 text-left">
      <ChatBubble type="sent" color="blue" content="用表格和状态标签列一页采购单。" motion="auto" />
      <ThinkingTrace
        variant="steps"
        settled
        motion="auto"
        doneLabel="想了 4 秒"
        rows={[
          { primary: "查表格和状态标签" },
          { primary: "按 token 选颜色" },
          { primary: "写出采购单页面" },
        ]}
      />
      <ChatBubble type="received" content="采购单页面已按现有表格和标签排好。" motion="auto" />
    </div>
  );
}

function MotionScene() {
  return (
    <div className="relative mx-auto flex min-h-64 w-full max-w-3xl flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-[#eef3ff] px-4 py-10">
      <div className="pointer-events-none absolute -left-8 top-0 size-40 rounded-full bg-[#d5defc] blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-6 bottom-0 size-40 rounded-full bg-[#d7f6f4] blur-3xl" aria-hidden />
      <p className="relative text-sm text-fg-grey-800">悬停看玻璃和跟随，点击看涟漪。减弱动效开启后，动画会停。</p>
      <div className="relative flex max-w-full flex-wrap justify-center gap-3">
        <Button effect="glass" color="black" variant="secondary" size="md" motion="auto">玻璃</Button>
        <Button effect="magnetic" color="black" size="md" motion="auto">跟随</Button>
        <Button effect="ripple" color="blue" size="md" motion="auto">涟漪</Button>
      </div>
    </div>
  );
}

function TemplatesScene() {
  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
      {templates.map((item) => (
        <article key={item.href} className="home-card relative min-w-0 overflow-hidden text-left">
          <div className="relative aspect-video bg-fg-grey-100">
            <Image src={item.image} alt="" fill sizes="320px" className="object-cover object-top" unoptimized />
          </div>
          <div className="px-4 py-3">
            <h3 id={`home-template-${item.title}`} className="text-sm font-semibold text-fg-black">{item.title}</h3>
            <p className="mt-1 text-sm leading-6 text-fg-grey-800">{item.text}</p>
          </div>
          <Link
            href={item.href}
            aria-labelledby={`home-template-${item.title}`}
            className="absolute inset-0 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-fg-blue"
          />
        </article>
      ))}
    </div>
  );
}

export function HomePromo() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <aside className="home-card z-50 mt-10 w-full max-w-[288px] self-start overflow-hidden text-left lg:fixed lg:bottom-6 lg:left-6 lg:mt-0">
      <div className="home-promo-head relative flex h-36 flex-col items-center justify-end px-4 pb-4">
        <button
          type="button"
          aria-label="关闭"
          onClick={() => setOpen(false)}
          className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white"
        >
          ×
        </button>
        <p className="text-sm font-semibold text-white">交给编码助手</p>
        <p className="text-xs text-white/80">AGENTS.md</p>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <p className="text-sm font-semibold text-fg-black">助手按这份规则写页面</p>
        <p className="text-xs leading-5 text-fg-grey-800">把 AGENTS.md 放到项目根目录，组件名和颜色 token 就有了着落。</p>
        <Link
          href="/docs/agents-md"
          className="inline-flex h-9 items-center justify-center rounded-full bg-[#ececee] px-3 text-sm font-medium text-fg-black hover:bg-fg-grey-200"
        >
          查看 AGENTS.md
        </Link>
      </div>
    </aside>
  );
}
