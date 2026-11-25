"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar, Button, ConfirmationDialog, DataTable, Panel, StatusBadge, ToastProvider, useToast } from "@aideui/core";
import { CheckCircleBoldDuotone, ClockCircleLinear, FileTextLinear } from "@aideui/core/icons";
import { BASE, BusinessShell } from "../../_chrome";
import { CONTRACTS, contractStatusColor, customerById, yuan, type Contract } from "../../_data";

const FILES = [
  { name: "合同正本（双方盖章）.pdf", size: "2.4 MB", time: "11-24 18:20" },
  { name: "技术服务附件.docx", size: "860 KB", time: "11-22 10:05" },
  { name: "报价单 v3.xlsx", size: "128 KB", time: "11-18 15:41" },
];

export default function ContractDetailPage() {
  return (
    <ToastProvider>
      <ContractDetail />
    </ToastProvider>
  );
}

function ContractDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const contract = CONTRACTS.find((item) => item.id === id) ?? CONTRACTS[0];
  const customer = customerById(contract.customerId);
  const [milestones, setMilestones] = useState(contract.milestones);
  const [confirming, setConfirming] = useState<number | null>(null);
  const received = milestones.filter((item) => item.done).reduce((sum, item) => sum + item.amount, 0);
  const percent = Math.round((received / contract.amount) * 100);

  return (
    <BusinessShell title={contract.title} back={`${BASE}/contracts`} secondaryAction={{ label: "下载 PDF" }} primaryAction={{ label: "发起变更" }}>
      <div className="flex flex-col gap-5">
        <Panel variant="dashboard">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-fg-grey-700">{contract.id}</span>
                <StatusBadge label={contract.status} color={contractStatusColor[contract.status]} />
              </div>
              <h2 className="text-lg font-semibold text-fg-black">{contract.title}</h2>
              {customer && (
                <Link href={`${BASE}/customers/${customer.id}`} className="text-sm text-fg-blue-500 hover:underline">
                  {customer.name}
                </Link>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-fg-grey-700">合同金额</span>
              <span className="text-2xl font-semibold tabular-nums text-fg-black">{yuan(contract.amount)}</span>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-fg-grey-100 pt-4 md:grid-cols-4">
            <Fact label="签订日期" value={contract.signedAt} />
            <Fact label="产品" value={contract.product} />
            <Fact label="负责人" value={<span className="flex items-center gap-2"><Avatar src={contract.owner.avatar} alt={contract.owner.name} size="xs" />{contract.owner.name}</span>} />
            <Fact label="客户联系人" value={customer ? `${customer.contact.name} · ${customer.contact.phone}` : "—"} />
          </dl>
        </Panel>

        <Panel title="合同明细" subtitle={`${contract.lines.length} 项`}>
          <DataTable<Contract["lines"][number]>
            columns={[
              { key: "name", header: "项目", minWidth: 200, render: (line) => <span className="font-medium text-fg-black">{line.name}</span> },
              { key: "spec", header: "规格", minWidth: 160, render: (line) => <span className="text-fg-grey-700">{line.spec}</span> },
              { key: "quantity", header: "数量", valueKind: "number", render: (line) => line.quantity },
              { key: "total", header: "金额", valueKind: "number", render: (line) => yuan(line.price * line.quantity) },
            ]}
            rows={contract.lines}
            getRowKey={(line) => line.name}
          />
          <div className="flex items-baseline justify-end gap-4 pt-2 text-sm">
            <span className="text-fg-grey-700">合计</span>
            <span className="text-base font-semibold tabular-nums text-fg-black">{yuan(contract.amount)}</span>
          </div>
        </Panel>

        <Panel
          title="回款计划"
          subtitle={`已回款 ${yuan(received)}，占 ${percent}%`}
          action={<span className="h-2 w-40 overflow-hidden rounded-full bg-fg-grey-100"><span className="block h-full rounded-full bg-fg-blue-500" style={{ width: `${percent}%` }} /></span>}
        >
          <ol className="flex flex-col">
            {milestones.map((milestone, index) => (
              <li key={milestone.title} className="flex items-center gap-4 border-b border-fg-grey-100 py-3.5 last:border-b-0">
                <span className={milestone.done ? "text-fg-green-500" : "text-fg-grey-400"}>{milestone.done ? <CheckCircleBoldDuotone size={22} /> : <ClockCircleLinear size={22} />}</span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-medium text-fg-black">{milestone.title}</span>
                  <span className="text-xs text-fg-grey-700">
                    {milestone.done ? "已到账" : "计划"} {milestone.date}
                  </span>
                </div>
                <span className="text-sm tabular-nums text-fg-black">{yuan(milestone.amount)}</span>
                <div className="w-24 text-right">
                  {!milestone.done && (
                    <Button size="sm" variant="tertiary" onClick={() => setConfirming(index)}>
                      确认到账
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="附件" subtitle={`${FILES.length} 个文件`}>
          <div className="grid gap-3 md:grid-cols-3">
            {FILES.map((file) => (
              <div key={file.name} className="flex items-center gap-3 rounded-2xl border border-fg-grey-200 p-4">
                <span className="flex size-10 items-center justify-center rounded-xl bg-fg-blue-50 text-fg-blue-500">
                  <FileTextLinear size={20} />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-fg-black">{file.name}</span>
                  <span className="text-xs text-fg-grey-700">
                    {file.size} · {file.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <ConfirmationDialog
        open={confirming !== null}
        onOpenChange={(open) => !open && setConfirming(null)}
        title="确认这笔回款已到账？"
        description={confirming !== null ? `${milestones[confirming].title} ${yuan(milestones[confirming].amount)}，确认后会通知财务开票。` : ""}
        confirmLabel="确认到账"
        color="blue"
        onCancel={() => setConfirming(null)}
        onConfirm={() => {
          if (confirming === null) return;
          setMilestones((previous) => previous.map((item, index) => (index === confirming ? { ...item, done: true, date: "2026-11-25" } : item)));
          toast({ title: "回款已确认", status: "success" });
          setConfirming(null);
        }}
      />
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
