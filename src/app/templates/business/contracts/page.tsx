"use client";

import { Suspense, useMemo, useState, type Key } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  CellActions,
  CellImageText,
  DataTable,
  Grid,
  Modal,
  StatCard,
  StatusBadge,
  TextField,
  ToastProvider,
  Toolbar,
  ToolbarActions,
  ToolbarPillTabs,
  ToolbarSearchInput,
  useToast,
  type ColumnDef,
} from "@forge-ui-official/core";
import { BillCheckBoldDuotone, ClockCircleBoldDuotone, DocumentBoldDuotone, WalletMoneyBoldDuotone } from "@forge-ui-official/core/icons";
import { BASE, BusinessShell } from "../_chrome";
import { CONTRACTS, SALES, contractStatusColor, customerById, wan, yuan, type Contract, type ContractStatus } from "../_data";

const FILTERS: Array<ContractStatus | "全部"> = ["全部", "审批中", "执行中", "待回款", "已完成", "已退回"];

export default function ContractsPage() {
  return (
    <ToastProvider>
      <Suspense fallback={null}>
        <ContractsContent />
      </Suspense>
    </ToastProvider>
  );
}

function ContractsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const [rows, setRows] = useState(CONTRACTS);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("全部");
  const [selected, setSelected] = useState<Set<Key>>(new Set());
  const [creating, setCreating] = useState(params.get("new") === "1");
  const [draft, setDraft] = useState({ customer: "", title: "", amount: "" });

  const filtered = useMemo(
    () => rows.filter((row) => (filter === "全部" || row.status === filter) && (!query || `${row.id}${row.title}${customerById(row.customerId)?.name ?? ""}`.includes(query))),
    [rows, filter, query],
  );
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const received = rows.reduce((sum, row) => sum + row.received, 0);

  const columns: ColumnDef<Contract>[] = [
    { key: "id", header: "合同编号", valueKind: "identifier", width: "w-[140px]", render: (row) => <span className="text-fg-grey-700">{row.id}</span> },
    { key: "title", header: "合同", minWidth: 240, render: (row) => <div className="flex flex-col"><span className="font-medium text-fg-black">{row.title}</span><span className="text-xs text-fg-grey-700">{customerById(row.customerId)?.name}</span></div> },
    { key: "owner", header: "负责人", minWidth: 120, render: (row) => <CellImageText src={row.owner.avatar} title={row.owner.name} rounded="full" /> },
    { key: "signed", header: "签订日期", valueKind: "identifier", render: (row) => row.signedAt },
    { key: "amount", header: "金额", valueKind: "number", render: (row) => yuan(row.amount) },
    {
      key: "progress",
      header: "回款进度",
      minWidth: 160,
      render: (row) => {
        const percent = Math.round((row.received / row.amount) * 100);
        return (
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-24 overflow-hidden rounded-full bg-fg-grey-100">
              <span className="block h-full rounded-full bg-fg-blue-500" style={{ width: `${percent}%` }} />
            </span>
            <span className="text-xs tabular-nums text-fg-grey-700">{percent}%</span>
          </div>
        );
      },
    },
    { key: "status", header: "状态", width: "w-[110px]", render: (row) => <StatusBadge label={row.status} color={contractStatusColor[row.status]} /> },
    { key: "actions", header: "", width: "w-[72px]", hideable: false, render: (row) => <CellActions actions={["eye"]} onAction={() => router.push(`${BASE}/contracts/${row.id}`)} /> },
  ];

  const create = () => {
    const amount = Number(draft.amount);
    if (!draft.title.trim() || !amount) return;
    const contract: Contract = {
      ...CONTRACTS[4],
      id: `HT-2611-0${30 + rows.length}`,
      title: draft.title.trim(),
      amount,
      received: 0,
      status: "审批中",
      signedAt: "2026-11-25",
      owner: SALES.lin,
      lines: [{ name: draft.title.trim(), spec: "—", quantity: 1, price: amount }],
      milestones: [{ title: "全款", date: "2026-12-25", amount, done: false }],
    };
    setRows((previous) => [contract, ...previous]);
    setCreating(false);
    setDraft({ customer: "", title: "", amount: "" });
    toast({ title: `合同 ${contract.id} 已提交审批`, status: "success" });
  };

  return (
    <BusinessShell title="合同" secondaryAction={{ label: "导出" }} primaryAction={{ label: "新建合同", onClick: () => setCreating(true) }}>
      <div className="flex flex-col gap-5">
        <Grid columns={{ base: 1, sm: 2, lg: 4 }}>
          <StatCard width="full" density="compact" theme="white" size="wide" title="合同总额" value={wan(total)} trend="24.5%" subtitle={`${rows.length} 份合同`} icon={<DocumentBoldDuotone size={18} />} />
          <StatCard width="full" density="compact" theme="white" size="wide" title="已回款" value={wan(received)} trend="18.1%" subtitle={`回款率 ${Math.round((received / total) * 100)}%`} icon={<WalletMoneyBoldDuotone size={18} />} />
          <StatCard width="full" density="compact" theme="white" size="wide" title="审批中" value={String(rows.filter((row) => row.status === "审批中").length)} subtitle="平均审批 1.6 天" icon={<ClockCircleBoldDuotone size={18} />} />
          <StatCard width="full" density="compact" theme="white" size="wide" title="本月完成" value="2" subtitle="合计 ¥42 万" icon={<BillCheckBoldDuotone size={18} />} />
        </Grid>
        <Toolbar
          className="flex-col gap-4 lg:flex-row lg:items-center"
          left={<ToolbarSearchInput placeholder="搜索合同编号、名称或客户" value={query} onChange={setQuery} />}
          right={
            <ToolbarActions>
              <ToolbarPillTabs color="blue" tabs={FILTERS.map((item) => ({ label: item, active: item === filter }))} onChange={(index) => setFilter(FILTERS[index])} />
            </ToolbarActions>
          }
        />
        {selected.size > 0 && (
          <div className="flex items-center justify-between rounded-2xl bg-fg-blue-50 px-4 py-3 text-sm">
            <span className="text-fg-black">已选 {selected.size} 份合同（当前页）</span>
            <div className="flex gap-2">
              <Button size="sm" variant="tertiary" onClick={() => setSelected(new Set())}>
                取消选择
              </Button>
              <Button size="sm" onClick={() => { toast({ title: `已发送 ${selected.size} 份回款提醒`, status: "success" }); setSelected(new Set()); }}>
                发送回款提醒
              </Button>
            </div>
          </div>
        )}
        <DataTable<Contract>
          columns={columns}
          rows={filtered}
          getRowKey={(row) => row.id}
          showCheckbox
          selectedRowKeys={selected}
          onSelectedRowKeysChange={setSelected}
          color="blue"
          showPagination
          currentPage={1}
          totalPages={1}
          paginationLabel={`共 ${filtered.length} 份`}
        />
      </div>
      <Modal
        open={creating}
        onOpenChange={setCreating}
        title="新建合同"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="tertiary" onClick={() => setCreating(false)}>
              取消
            </Button>
            <Button onClick={create} disabled={!draft.title.trim() || !Number(draft.amount)}>
              提交审批
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <TextField label="客户" placeholder="输入客户名称" value={draft.customer} onChange={(value) => setDraft((previous) => ({ ...previous, customer: value }))} />
          <TextField label="合同名称" placeholder="例如：数据集开发平台四期" value={draft.title} onChange={(value) => setDraft((previous) => ({ ...previous, title: value }))} />
          <TextField label="合同金额（元）" placeholder="0" value={draft.amount} onChange={(value) => setDraft((previous) => ({ ...previous, amount: value.replace(/[^\d]/g, "") }))} />
        </div>
      </Modal>
    </BusinessShell>
  );
}
