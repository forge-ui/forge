"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarGroup,
  Button,
  CellActions,
  CellImageText,
  DataTable,
  DonutChart,
  Grid,
  Modal,
  SmoothLineChart,
  StatusBadge,
  TextField,
  Toolbar,
  ToolbarActions,
  ToolbarPillTabs,
  ToolbarSearchInput,
  useToast,
  ToastProvider,
  type ColumnDef,
} from "@aideui/core";
import { CheckCircleBoldDuotone, UserBoldDuotone, WalletMoneyBoldDuotone } from "@aideui/core/icons";
import { CrmMetricCard } from "@/blocks/crm-summary/crm-summary";
import { BASE, BusinessShell } from "../_chrome";
import { CUSTOMERS, stageColor, wan, type Customer, type CustomerStage } from "../_data";

const STAGES: Array<CustomerStage | "全部"> = ["全部", "签约", "续约中", "试用", "流失风险"];

export default function CustomersPage() {
  return (
    <ToastProvider>
      <CustomersContent />
    </ToastProvider>
  );
}

function CustomersContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [rows, setRows] = useState(CUSTOMERS);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<(typeof STAGES)[number]>("全部");
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ name: "", contact: "", phone: "" });

  const filtered = useMemo(
    () => rows.filter((row) => (stage === "全部" || row.stage === stage) && (!query || `${row.name}${row.contact.name}${row.industry}`.includes(query))),
    [rows, stage, query],
  );

  const columns: ColumnDef<Customer>[] = [
    { key: "name", header: "客户", minWidth: 220, render: (row) => <div className="flex flex-col"><span className="font-medium text-fg-black">{row.name}</span><span className="text-xs text-fg-grey-700">{row.industry} · {row.region}</span></div> },
    { key: "contact", header: "联系人", minWidth: 200, render: (row) => <CellImageText src={row.contact.avatar} title={row.contact.name} subtitle={row.contact.title} rounded="full" /> },
    { key: "plan", header: "方案", minWidth: 160, render: (row) => row.plan },
    { key: "fee", header: "年费", valueKind: "number", render: (row) => wan(row.annualFee) },
    {
      key: "health",
      header: "健康度",
      valueKind: "number",
      render: (row) => <span className={row.health < 60 ? "font-medium text-fg-red" : "text-fg-black"}>{row.health}</span>,
    },
    { key: "owner", header: "负责人", minWidth: 120, render: (row) => <CellImageText src={row.owner.avatar} title={row.owner.name} rounded="full" /> },
    { key: "stage", header: "阶段", width: "w-[110px]", render: (row) => <StatusBadge label={row.stage} color={stageColor[row.stage]} /> },
    {
      key: "actions",
      header: "",
      width: "w-[96px]",
      hideable: false,
      render: (row) => (
        <CellActions
          actions={["eye", "trash"]}
          onAction={(action) => {
            if (action === "eye") router.push(`${BASE}/customers/${row.id}`);
            if (action === "trash") {
              setRows((previous) => previous.filter((item) => item.id !== row.id));
              toast({ title: `已删除 ${row.name}`, status: "success" });
            }
          }}
        />
      ),
    },
  ];

  const create = () => {
    if (!draft.name.trim()) return;
    const id = `c-${Date.now()}`;
    setRows((previous) => [
      { ...CUSTOMERS[3], id, name: draft.name.trim(), contact: { ...CUSTOMERS[3].contact, name: draft.contact || "待补充", phone: draft.phone }, stage: "试用", health: 70, since: "2026-11-25" },
      ...previous,
    ]);
    setCreating(false);
    setDraft({ name: "", contact: "", phone: "" });
    toast({ title: "客户已创建", status: "success" });
  };

  return (
    <BusinessShell title="客户" secondaryAction={{ label: "导出" }} primaryAction={{ label: "新建客户", onClick: () => setCreating(true) }}>
      <div className="flex flex-col gap-5">
        <Grid columns={{ base: 1, lg: 3 }}>
          <CrmMetricCard
            title="客户总数"
            date="截至今天"
            value={String(rows.length + 1634)}
            trend="3.1%"
            note="本月新增 48 家"
            icon={<UserBoldDuotone size={20} />}
            iconClassName="bg-fg-blue-100 text-fg-blue-500"
            footer={
              <AvatarGroup>
                {CUSTOMERS.slice(0, 4).map((customer) => (
                  <Avatar key={customer.id} src={customer.contact.avatar} alt={customer.contact.name} size="md" />
                ))}
              </AvatarGroup>
            }
          />
          <CrmMetricCard
            title="年度合同额"
            date="2026 年"
            value="¥1,042 万"
            trend="24.5%"
            note="较去年同期"
            icon={<WalletMoneyBoldDuotone size={20} />}
            iconClassName="bg-fg-green-100 text-fg-green-500"
            footer={<SmoothLineChart series={[{ data: [62, 68, 71, 69, 78, 84, 88, 86, 95, 101, 112, 128], color: "var(--fg-green-500)", fillArea: true }]} height="h-16" yDomain={[50, 135]} />}
          />
          <CrmMetricCard
            title="续约率"
            date="近 12 个月"
            value="94.6%"
            trend="0.4%"
            trendDirection="down"
            note="3 家待续约"
            icon={<CheckCircleBoldDuotone size={20} />}
            iconClassName="bg-fg-yellow-50 text-fg-yellow-700"
            footer={
              <div className="w-20">
                <DonutChart segments={[{ value: 94.6, color: "var(--fg-blue-500)" }]} trackColor="var(--fg-grey-200)" size="sm" />
              </div>
            }
          />
        </Grid>
        <Toolbar
          className="flex-col gap-4 lg:flex-row lg:items-center"
          left={<ToolbarSearchInput placeholder="搜索客户、联系人或行业" value={query} onChange={setQuery} />}
          right={
            <ToolbarActions>
              <ToolbarPillTabs color="blue" tabs={STAGES.map((item) => ({ label: item, active: item === stage }))} onChange={(index) => setStage(STAGES[index])} />
            </ToolbarActions>
          }
        />
        <DataTable<Customer>
          columns={columns}
          rows={filtered}
          getRowKey={(row) => row.id}
          showCheckbox
          color="blue"
          showPagination
          currentPage={1}
          totalPages={1}
          paginationLabel={`共 ${filtered.length} 家客户`}
          emptyState={
            <div className="flex flex-col items-center gap-3 py-10 text-sm text-fg-grey-700">
              没有符合条件的客户
              <Button size="sm" variant="tertiary" onClick={() => { setQuery(""); setStage("全部"); }}>
                清空条件
              </Button>
            </div>
          }
        />
      </div>
      <Modal
        open={creating}
        onOpenChange={setCreating}
        title="新建客户"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="tertiary" onClick={() => setCreating(false)}>
              取消
            </Button>
            <Button onClick={create} disabled={!draft.name.trim()}>
              创建
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <TextField label="客户名称" placeholder="例如：华东电网研究院" value={draft.name} onChange={(value) => setDraft((previous) => ({ ...previous, name: value }))} />
          <TextField label="联系人" placeholder="姓名" value={draft.contact} onChange={(value) => setDraft((previous) => ({ ...previous, contact: value }))} />
          <TextField label="联系电话" placeholder="手机号" value={draft.phone} onChange={(value) => setDraft((previous) => ({ ...previous, phone: value }))} />
        </div>
      </Modal>
    </BusinessShell>
  );
}
