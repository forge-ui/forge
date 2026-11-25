"use client";

import { useState, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  CellImageText,
  DataTable,
  Grid,
  GridItem,
  Panel,
  SmoothLineChart,
  StatusBadge,
  TabBar,
  TextArea,
  ToastProvider,
  useToast,
  type ColumnDef,
} from "@aideui/core";
import { CalendarMinimalisticLinear, ChatRoundLineLinear, LetterLinear, PhoneLinear, WalletMoneyLinear } from "@aideui/core/icons";
import { BASE, BusinessShell } from "../../_chrome";
import { ACTIVITIES, CONTRACTS, CUSTOMERS, SALES, TICKETS, contractStatusColor, stageColor, wan, yuan, type Contract } from "../../_data";

const TABS = ["概况", "合同", "工单", "跟进记录"];

const HEALTH_PARTS = [
  { label: "使用活跃度", value: 94, note: "近 30 天 86 人登录" },
  { label: "回款准时率", value: 100, note: "6 笔全部按期" },
  { label: "工单满意度", value: 78, note: "1 个工单处理超时" },
  { label: "功能覆盖", value: 81, note: "使用了 9 / 11 个模块" },
];

const activityIcon = {
  meeting: <CalendarMinimalisticLinear size={16} />,
  payment: <WalletMoneyLinear size={16} />,
  ticket: <ChatRoundLineLinear size={16} />,
  call: <PhoneLinear size={16} />,
};

export default function CustomerDetailPage() {
  return (
    <ToastProvider>
      <CustomerDetail />
    </ToastProvider>
  );
}

function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const customer = CUSTOMERS.find((item) => item.id === id) ?? CUSTOMERS[1];
  const [tab, setTab] = useState(0);
  const [note, setNote] = useState("");
  const [activities, setActivities] = useState(ACTIVITIES.map((item) => ({ ...item, customerId: customer.id })));
  const contracts = CONTRACTS.filter((item) => item.customerId === customer.id);
  const tickets = TICKETS.filter((item) => item.customerId === customer.id);

  const contractColumns: ColumnDef<Contract>[] = [
    { key: "id", header: "合同编号", valueKind: "identifier", width: "w-[140px]", render: (row) => <span className="text-fg-grey-700">{row.id}</span> },
    { key: "title", header: "内容", minWidth: 200, render: (row) => <span className="font-medium text-fg-black">{row.title}</span> },
    { key: "signed", header: "签订日期", valueKind: "identifier", render: (row) => row.signedAt },
    { key: "amount", header: "金额", valueKind: "number", render: (row) => yuan(row.amount) },
    { key: "received", header: "已回款", valueKind: "number", render: (row) => yuan(row.received) },
    { key: "status", header: "状态", width: "w-[110px]", render: (row) => <StatusBadge label={row.status} color={contractStatusColor[row.status]} /> },
  ];

  const addNote = () => {
    if (!note.trim()) return;
    setActivities((previous) => [{ id: `n-${Date.now()}`, customerId: customer.id, who: SALES.lin, title: "添加跟进记录", detail: note.trim(), time: "刚刚", kind: "call" }, ...previous]);
    setNote("");
    toast({ title: "跟进记录已保存", status: "success" });
  };

  return (
    <BusinessShell title={customer.name} back={`${BASE}/customers`} secondaryAction={{ label: "编辑" }} primaryAction={{ label: "新建合同", onClick: () => router.push(`${BASE}/contracts?new=1`) }}>
      <div className="flex flex-col gap-5">
        <Panel variant="dashboard">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-fg-blue-50 text-xl font-semibold text-fg-blue-500">{customer.name.slice(0, 1)}</div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-fg-black">{customer.name}</h2>
                <StatusBadge label={customer.stage} color={stageColor[customer.stage]} />
              </div>
              <span className="text-sm text-fg-grey-700">
                {customer.industry} · {customer.region} · {customer.plan}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="tertiary" iconLeft={<PhoneLinear size={16} />}>
                致电
              </Button>
              <Button size="sm" variant="tertiary" iconLeft={<LetterLinear size={16} />}>
                发邮件
              </Button>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-fg-grey-100 pt-4 md:grid-cols-3 xl:grid-cols-6">
            <Fact label="年费" value={wan(customer.annualFee)} />
            <Fact label="健康度" value={<span className={customer.health < 60 ? "text-fg-red" : undefined}>{customer.health} / 100</span>} />
            <Fact label="合作开始" value={customer.since} />
            <Fact label="下次续约" value={customer.renewalDate} />
            <Fact label="负责人" value={<span className="flex items-center gap-2"><Avatar src={customer.owner.avatar} alt={customer.owner.name} size="xs" />{customer.owner.name}</span>} />
            <Fact label="主要联系人" value={`${customer.contact.name} · ${customer.contact.title}`} />
          </dl>
        </Panel>

        <TabBar tabs={TABS.map((label, index) => ({ label, active: index === tab, badge: label === "工单" ? tickets.filter((item) => item.status !== "已关闭").length || undefined : undefined }))} color="blue" onChange={setTab} />

        {tab === 0 && (
          <Grid>
            <GridItem span={{ base: "full", lg: 7 }}>
              <Panel title="健康度构成" subtitle="每周一自动计算">
                <div className="flex flex-col gap-4">
                  {HEALTH_PARTS.map((part) => (
                    <div key={part.label} className="flex flex-col gap-2">
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="font-medium text-fg-black">{part.label}</span>
                        <span className="text-fg-grey-700">
                          {part.note} · <span className="tabular-nums text-fg-black">{part.value}</span>
                        </span>
                      </div>
                      <span className="h-2 overflow-hidden rounded-full bg-fg-grey-100">
                        <span className={`block h-full rounded-full ${part.value < 80 ? "bg-fg-yellow" : "bg-fg-blue-500"}`} style={{ width: `${part.value}%` }} />
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            </GridItem>
            <GridItem span={{ base: "full", lg: 5 }}>
              <Panel title="月活跃用户" subtitle="近 12 个月">
                <SmoothLineChart series={[{ data: [42, 48, 51, 55, 60, 58, 66, 71, 74, 79, 83, 86], color: "bg-fg-violet", fillArea: true }]} height="h-40" yDomain={[30, 95]} showYAxis yAxisLabels={["90", "60", "30"]} xAxisLabels={["12月", "", "", "3月", "", "", "6月", "", "", "9月", "", "11月"]} />
              </Panel>
            </GridItem>
            <GridItem span="full">
              <Panel title="联系人">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {[customer.contact, CUSTOMERS[(CUSTOMERS.indexOf(customer) + 2) % CUSTOMERS.length].contact].map((contact, index) => (
                    <div key={contact.email} className="flex items-center gap-3 rounded-2xl border border-fg-grey-200 p-4">
                      <Avatar src={contact.avatar} alt={contact.name} size="md" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="text-sm font-medium text-fg-black">
                          {contact.name}
                          {index === 0 && <span className="ml-2 text-xs font-normal text-fg-blue-500">主要联系人</span>}
                        </span>
                        <span className="truncate text-xs text-fg-grey-700">{index === 0 ? contact.title : "采购经理"}</span>
                        <span className="truncate text-xs text-fg-grey-700">
                          {contact.phone} · {contact.email}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </GridItem>
          </Grid>
        )}

        {tab === 1 && <DataTable<Contract> title="合同" subtitle={`${contracts.length} 份`} columns={contractColumns} rows={contracts} getRowKey={(row) => row.id} color="blue" emptyState={<p className="py-10 text-center text-sm text-fg-grey-700">还没有合同</p>} />}

        {tab === 2 && (
          <Panel title="工单" subtitle={`${tickets.length} 个`}>
            {tickets.length === 0 ? (
              <p className="py-10 text-center text-sm text-fg-grey-700">这个客户没有提过工单</p>
            ) : (
              <div className="flex flex-col">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center gap-4 border-b border-fg-grey-100 py-3 last:border-b-0">
                    <span className="w-20 text-sm text-fg-grey-700">{ticket.id}</span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-fg-black">{ticket.title}</span>
                    <CellImageText src={ticket.assignee.avatar} title={ticket.assignee.name} rounded="full" />
                    <span className="w-28 text-sm text-fg-grey-700">{ticket.status}</span>
                    {ticket.overdue && <StatusBadge label="已超时" color="red" />}
                  </div>
                ))}
              </div>
            )}
          </Panel>
        )}

        {tab === 3 && (
          <Panel title="跟进记录">
            <div className="flex flex-col gap-3 rounded-2xl border border-fg-grey-200 p-4">
              <TextArea placeholder="记录这次沟通的要点…" value={note} onChange={setNote} rows={3} />
              <div className="flex justify-end">
                <Button size="sm" onClick={addNote} disabled={!note.trim()}>
                  保存记录
                </Button>
              </div>
            </div>
            <ol className="flex flex-col">
              {activities.map((activity) => (
                <li key={activity.id} className="relative flex gap-4 pb-6 pl-1 last:pb-0">
                  <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-fg-blue-50 text-fg-blue-500">{activityIcon[activity.kind]}</span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="text-sm font-medium text-fg-black">{activity.title}</span>
                      <span className="text-xs text-fg-grey-700">
                        {activity.who.name} · {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-fg-grey-900">{activity.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        )}
      </div>
    </BusinessShell>
  );
}

function Fact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-xs text-fg-grey-700">{label}</dt>
      <dd className="truncate text-sm font-medium text-fg-black">{value}</dd>
    </div>
  );
}

