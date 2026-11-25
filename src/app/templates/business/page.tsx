"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Avatar,
  FullCalendar,
  IconButton,
  KebabMenu,
  LineChartStatCard,
  PieChart,
  ProgressStatCard,
  ProjectCard,
  SmoothLineChart,
  WheelChartStatCard,
  type CalendarEvent,
} from "@aideui/core";
import { ArrowRightDownLinear, ArrowRightUpLinear, DocumentBoldDuotone, LetterLinear, PhoneCallingLinear, UsersGroupTwoRoundedBoldDuotone, WalletMoneyBoldDuotone } from "@aideui/core/icons";
import { TrendChart } from "@/blocks/trend-chart/trend-chart";
import { CompositionCard } from "@/blocks/composition-card/composition-card";
import { RankingList } from "@/blocks/ranking-list/ranking-list";
import { MemberList } from "@/app/templates/_shared/member-list";
import { ScheduleCard } from "@/app/templates/_shared/schedule-card";
import { BASE, BusinessShell } from "./_chrome";
import { CONTRACTS, MONTHS, SALES, customerById, type ContractStatus } from "./_data";

const SERIES = [
  { label: "签约", value: "¥1,042 万", trend: "24%", up: true, color: "var(--fg-blue-500)", data: [62, 68, 71, 69, 78, 84, 88, 86, 95, 101, 112, 128] },
  { label: "回款", value: "¥883 万", trend: "18%", up: true, color: "var(--fg-yellow-500)", data: [48, 55, 60, 58, 66, 70, 75, 79, 82, 90, 97, 103] },
  { label: "毛利", value: "¥656 万", trend: "12%", up: true, color: "var(--fg-green-500)", data: [34, 46, 41, 43, 54, 53, 61, 61, 66, 68, 82, 92] },
];
const TABS = ["全部", ...SERIES.map((item) => item.label)];

const STATUS_SLICES: Array<{ status: ContractStatus; color: string }> = [
  { status: "执行中", color: "var(--fg-blue-500)" },
  { status: "待回款", color: "var(--fg-yellow-500)" },
  { status: "已完成", color: "var(--fg-green-500)" },
  { status: "已退回", color: "var(--fg-red-500)" },
];

const CARD_COLOR: Record<ContractStatus, "blue" | "yellow" | "green" | "red" | "gray"> = { 执行中: "blue", 待回款: "yellow", 已完成: "green", 已退回: "red", 审批中: "gray" };
const LOGO_TINTS = [
  ["#dbeafe", "#2563eb"],
  ["#fed7aa", "#ea580c"],
  ["#ede9fe", "#7c3aed"],
];
const logo = (text: string, [background, foreground]: string[]) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="${background}"/><text x="20" y="26" font-size="16" font-family="sans-serif" font-weight="600" text-anchor="middle" fill="${foreground}">${text}</text></svg>`)}`;

const TEAM = [
  { ...SALES.lin, role: "大客户销售", online: true },
  { ...SALES.chen, role: "行业销售", online: true },
  { ...SALES.zhou, role: "客户成功", online: false },
  { ...SALES.jiang, role: "渠道销售", online: true },
  { name: "苏晚晴", avatar: "/images/blocks/people/su-wanqing.jpg", role: "售前顾问", online: true },
  { name: "宋知意", avatar: "/images/blocks/people/song-zhiyi.jpg", role: "实施交付", online: false },
  { name: "唐可欣", avatar: "/images/blocks/people/tang-kexin.jpg", role: "商务助理", online: true },
  { name: "沈清禾", avatar: "/images/blocks/people/shen-qinghe.jpg", role: "财务", online: true },
];

const EVENTS: CalendarEvent[] = [
  { day: 25, label: "今天", color: "blue" },
  { day: 27, label: "评审", color: "purple" },
  { day: 28, label: "回款", color: "red" },
  { day: 30, label: "拜访", color: "yellow" },
  { day: 12, label: "签约", color: "green" },
  { day: 18, label: "回款", color: "red" },
];

export default function BusinessOverviewPage() {
  const router = useRouter();
  const [tab, setTab] = useState(TABS[0]);
  const visible = tab === "全部" ? SERIES : SERIES.filter((item) => item.label === tab);
  const counts = STATUS_SLICES.map((slice) => ({ ...slice, count: CONTRACTS.filter((contract) => contract.status === slice.status).length }));
  const total = counts.reduce((sum, item) => sum + item.count, 0);

  return (
    <BusinessShell title="概览" primaryAction={{ label: "新建合同", onClick: () => router.push(`${BASE}/contracts?new=1`) }}>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3 [&>*]:!w-full">
          <ProgressStatCard density="compact" title="本年签约" subtitle="年度目标 87%" value="¥1,042 万" trend="24%" trendDirection="up" theme="blue" progressValue={87} progressColor="yellow" icon={<DocumentBoldDuotone size={20} />} size="wide" />
          <LineChartStatCard density="compact" title="活跃客户" subtitle="本月 +48" value="1,642" trend="3%" trendDirection="up" chartColor="green" size="wide" icon={<UsersGroupTwoRoundedBoldDuotone size={20} />} />
          <WheelChartStatCard density="compact" title="回款率" subtitle="待回款 ¥154 万" value="85%" trend="6%" trendDirection="up" wheelColor="red" wheelPercent={85} size="wide" icon={<WalletMoneyBoldDuotone size={20} />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <TrendChart className="lg:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-fg-black">经营数据</h3>
                <p className="text-sm text-fg-grey-500">按月统计，单位：万元</p>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full bg-fg-grey-100 p-1 text-xs">
                {TABS.map((item) => (
                  <Button variant="unstyled" key={item} type="button" onClick={() => setTab(item)} className={item === tab ? "rounded-full bg-background px-3 py-1.5 text-fg-black shadow-sm" : "px-3 py-1.5 text-fg-grey-500"}>
                    {item}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {visible.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-full text-white" style={{ backgroundColor: item.color }}>
                    {item.up ? <ArrowRightUpLinear size={16} /> : <ArrowRightDownLinear size={16} />}
                  </div>
                  <div>
                    <div className="text-xs text-fg-grey-500">{item.label}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-fg-black">{item.value}</span>
                      <span className={`text-xs font-medium ${item.up ? "text-fg-green-500" : "text-fg-red"}`}>
                        {item.up ? "▲" : "▼"} {item.trend}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <SmoothLineChart
              key={tab}
              series={visible.map((item) => ({ data: item.data, color: item.color }))}
              accent="blue"
              activeIndex={9}
              showTooltip
              tooltipItems={visible.map((item) => ({ label: item.label, value: `¥${item.data[9]} 万`, trend: item.up ? "up" : "down", color: item.color }))}
              yDomain={[0, 140]}
              showYAxis
              yAxisLabels={["140万", "105万", "70万", "35万", "0"]}
              xAxisLabels={MONTHS}
              height="h-56"
            />
          </TrendChart>

          <CompositionCard>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-fg-black">全部合同</h3>
                <p className="text-sm text-fg-grey-500">按状态</p>
              </div>
              <KebabMenu items={[{ label: "查看合同", onSelect: () => router.push(`${BASE}/contracts`) }]} />
            </div>
            <div className="flex justify-center">
              <PieChart segments={counts.map((item) => ({ value: (item.count / total) * 100, color: item.color }))} size="md" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {counts.map((item) => (
                <span key={item.status} className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} /> {item.status} {item.count}
                </span>
              ))}
            </div>
          </CompositionCard>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <RankingList
            density="compact"
            title="最近合同"
            subtitle="正在跟进的合同"
            action={<KebabMenu items={[{ label: "查看全部", onSelect: () => router.push(`${BASE}/contracts`) }]} />}
            items={
              <div className="flex flex-col gap-3">
                {CONTRACTS.slice(0, 3).map((contract, index) => {
                  const customer = customerById(contract.customerId);
                  return (
                    <div key={contract.id} className="cursor-pointer" onClick={() => router.push(`${BASE}/contracts/${contract.id}`)}>
                      <ProjectCard
                        logo={logo(customer?.name.slice(0, 1) ?? "", LOGO_TINTS[index % LOGO_TINTS.length])}
                        title={contract.title}
                        labelText={contract.status}
                        labelColor={CARD_COLOR[contract.status]}
                        progress={Math.round((contract.received / contract.amount) * 100)}
                        progressColor={CARD_COLOR[contract.status]}
                        date={contract.signedAt}
                        avatars={[contract.owner.avatar, customer?.contact.avatar ?? ""]}
                      />
                    </div>
                  );
                })}
              </div>
            }
          />

          <MemberList
            density="compact"
            title="团队成员"
            subtitle="全部成员"
            action={<KebabMenu items={[{ label: "管理成员", onSelect: () => router.push(`${BASE}/settings`) }]} />}
            items={
              <div className="flex flex-col">
                {TEAM.map((member) => (
                  <div key={member.name} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <Avatar src={member.avatar} alt={member.name} online={member.online} size="md" />
                      <div>
                        <div className="text-sm font-medium text-fg-black">{member.name}</div>
                        <div className="text-xs text-fg-grey-500">{member.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconButton variant="ghost" shape="square" size="sm" aria-label={`给${member.name}打电话`}><PhoneCallingLinear size={14} /></IconButton>
                      <IconButton variant="ghost" shape="square" size="sm" aria-label={`给${member.name}发消息`}><LetterLinear size={14} /></IconButton>
                    </div>
                  </div>
                ))}
              </div>
            }
          />

          <ScheduleCard gap="sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-fg-black">日程</h3>
                <p className="text-sm text-fg-grey-500">本月安排</p>
              </div>
              <KebabMenu items={[{ label: "查看全部", onSelect: () => undefined }]} />
            </div>
            <FullCalendar view="month" color="blue" year={2026} month={10} day={25} events={EVENTS} />
          </ScheduleCard>
        </div>
      </div>
    </BusinessShell>
  );
}
