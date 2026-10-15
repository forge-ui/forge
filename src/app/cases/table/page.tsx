"use client";

import {
  DataTable,
  FullWidthTable,
  StatusBadge,
  TableCell,
  CellText,
  CellTextSubtitle,
  CellMuted,
  CellImageText,
  CellProgressValue,
  CellKebabMenu,
  CellStatusDot,
  CellNumber,
  CellProgressBar,
  CellCode,
  CellRating,
  CellFile,
  CellActions,
  CellLink,
  Avatar,
  AvatarGroup,
  Label,
  Checkbox,
  RatingStars,
  FileTypeIcon,
  type ColumnDef,
  type StatusBadgeColor,
  type ProgressBadgeColor,
  type DataTableColor,
  type LabelColor,
  type ProgressBarColor,
  type StatusDotColor,
  type CheckboxColor,
  type CellActionKey,
  type CellLinkColor,
} from "@forge-ui-official/core";
import { CardBold } from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

// ── Mock data for composite tables ─────────────────────────
type Order = {
  id: string;
  product: string;
  extra: string;
  date: string;
  customer: string;
  email: string;
  total: string;
  payment: string;
  status: "processing" | "shipped" | "delivered" | "canceled";
  progress: { value: string; badge: string; color: ProgressBadgeColor };
  imageUrl: string;
};

// 真实图片：picsum.photos 按 seed 稳定取图，避免 placehold.co 色块
const orders: Order[] = [
  { id: "#302012", product: "手工收纳包", extra: "另有 3 件", date: "1 分钟前", customer: "张明", email: "Johnb@mail.com", total: "$121.00", payment: "Mastercard", status: "processing", progress: { value: "65%", badge: "+12%", color: "green" }, imageUrl: "https://picsum.photos/seed/pouch/80/80" },
  { id: "#302011", product: "智能手表 E2", extra: "另有 1 件", date: "1 分钟前", customer: "Ilham Budi A", email: "ilahmbudi@mail.com", total: "$590.00", payment: "Visa", status: "processing", progress: { value: "40%", badge: "-3%", color: "red" }, imageUrl: "https://picsum.photos/seed/watch2/80/80" },
  { id: "#302002", product: "Smartwatch E1", extra: "", date: "5 小时前", customer: "陈明", email: "m_karim@mail.com", total: "$125.00", payment: "Transfer", status: "shipped", progress: { value: "82%", badge: "+5%", color: "green" }, imageUrl: "https://picsum.photos/seed/watch1/80/80" },
  { id: "#301901", product: "无线耳机 G1", extra: "另有 1 件", date: "1 天前", customer: "林晓", email: "lindablair@mail.com", total: "$348.00", payment: "Paypal", status: "delivered", progress: { value: "100%", badge: "+0%", color: "grey" }, imageUrl: "https://picsum.photos/seed/headphone/80/80" },
  { id: "#301900", product: "iPhone X", extra: "", date: "2 天前", customer: "陈晨", email: "josh_adam@mail.com", total: "$607.00", payment: "Visa", status: "canceled", progress: { value: "12%", badge: "-8%", color: "red" }, imageUrl: "https://picsum.photos/seed/iphone/80/80" },
];

function statusColor(s: Order["status"]): StatusBadgeColor {
  return ({ processing: "yellow", shipped: "cyan", delivered: "green", canceled: "red" } as const)[s];
}

const sixColumns: ColumnDef<Order>[] = [
  { key: "id", header: "ID", width: "w-[110px]", render: (r) => <CellText>{r.id}</CellText> },
  { key: "product", header: "商品", sortable: true, width: "w-60", render: (r) => <CellImageText src={r.imageUrl} title={r.product} subtitle={r.extra || undefined} /> },
  { key: "customer", header: "客户", width: "w-[170px]", render: (r) => <CellTextSubtitle title={r.customer} subtitle={r.email} /> },
  { key: "total", header: "Total", width: "w-[110px]", render: (r) => <CellText>{r.total}</CellText> },
  { key: "progress", header: "进度", sortable: true, width: "w-[140px]", render: (r) => <CellProgressValue value={r.progress.value} badge={r.progress.badge} badgeColor={r.progress.color} /> },
  { key: "actions", header: "", width: "w-[60px]", render: () => <CellKebabMenu /> },
];

const eightColumns: ColumnDef<Order>[] = [
  { key: "id", header: "ID", width: "w-[110px]", render: (r) => <CellText>{r.id}</CellText> },
  { key: "product", header: "商品", sortable: true, width: "w-60", render: (r) => <CellImageText src={r.imageUrl} title={r.product} subtitle={r.extra || undefined} /> },
  { key: "date", header: "日期", sortable: true, width: "w-[120px]", render: (r) => <CellMuted>{r.date}</CellMuted> },
  { key: "customer", header: "客户", width: "w-[170px]", render: (r) => <CellTextSubtitle title={r.customer} subtitle={r.email} /> },
  { key: "total", header: "Total", width: "w-[110px]", render: (r) => <CellText>{r.total}</CellText> },
  { key: "payment", header: "Payment", width: "w-[120px]", render: (r) => <CellMuted>{r.payment}</CellMuted> },
  { key: "status", header: "状态", sortable: true, width: "w-[120px]", render: (r) => <StatusBadge label={r.status[0].toUpperCase() + r.status.slice(1)} color={statusColor(r.status)} /> },
  { key: "actions", header: "", width: "w-[60px]", render: () => <CellKebabMenu /> },
];

const fullWidthColumns: ColumnDef<Order>[] = [
  ...eightColumns.slice(0, -1),
  { key: "progress", header: "进度", sortable: true, width: "w-[140px]", render: (r: Order) => <CellProgressValue value={r.progress.value} badge={r.progress.badge} badgeColor={r.progress.color} /> },
  { key: "actions", header: "", width: "w-[60px]", render: () => <CellKebabMenu /> },
];

// ── Header variants ────────────────────────────────────────
type HeaderCol = { checkbox: boolean; color: CheckboxColor; sort: boolean; label: string };
type HeaderRow = { kind: "text" | "text-icon" | "icon-only"; title: string };

const headerCols: HeaderCol[] = [
  { checkbox: false, color: "purple", sort: true, label: "sort" },
  { checkbox: false, color: "purple", sort: false, label: "default" },
  { checkbox: true, color: "purple", sort: true, label: "purple + sort" },
  { checkbox: true, color: "purple", sort: false, label: "purple" },
  { checkbox: true, color: "blue", sort: true, label: "blue + sort" },
  { checkbox: true, color: "blue", sort: false, label: "blue" },
  { checkbox: true, color: "black", sort: true, label: "black + sort" },
  { checkbox: true, color: "black", sort: false, label: "black" },
];

const headerRows: HeaderRow[] = [
  { kind: "text", title: "仅文字" },
  { kind: "text-icon", title: "文字与图标" },
  { kind: "icon-only", title: "仅图标" },
];

function HeaderCellContent({ kind }: { kind: HeaderRow["kind"] }) {
  if (kind === "text") return <>商品</>;
  if (kind === "text-icon")
    return (
      <span className="inline-flex items-center gap-1">
        <CardBold size={20} color="#A1A1AA" />
        商品
      </span>
    );
  return <CardBold size={20} color="#A1A1AA" />;
}

// ── CellWrapper — 每个独立 cell 外层圆角 border 包装 ──────
function CellWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex rounded-lg border border-fg-grey-200 overflow-hidden bg-white min-w-44">
      {children}
    </div>
  );
}

// ── Body cell demo atom ────────────────────────────────────
function BodyRow({ showCheckbox = false, children }: { showCheckbox?: boolean; children: React.ReactNode }) {
  return (
    <CellWrapper>
      <TableCell variant="body" checkbox={showCheckbox}>
        {children}
      </TableCell>
    </CellWrapper>
  );
}

const labelColors: LabelColor[] = ["purple", "blue", "gray"];
const progressColors: ProgressBarColor[] = ["purple", "blue", "gray"];
const statusDotColors: StatusDotColor[] = ["purple", "blue", "black"];
const dataTableColors: DataTableColor[] = ["purple", "blue", "black"];
const allActionKeys: CellActionKey[] = ["mail", "phone", "chat", "eye", "pen", "trash"];
const cellLinkColors: CellLinkColor[] = ["purple", "blue", "black"];

export default function TableCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="数据表格"
        hint="按行列展示数据，支持选择、排序、分页和自定义单元格。"
      />

      {/* ============ Header Cell ============ */}
      <Section
        title="表头单元格"
        description="表头支持文字、图标、多选和排序。"
      >
        {headerRows.map((row) => (
          <SubSection key={row.kind} title={row.title}>
            {headerCols.map((col, i) => (
              <Labeled key={i} label={col.label}>
                <CellWrapper>
                  <TableCell
                    variant="header"
                    checkbox={col.checkbox}
                    checkboxColor={col.color}
                    sortable={col.sort}
                  >
                    <HeaderCellContent kind={row.kind} />
                  </TableCell>
                </CellWrapper>
              </Labeled>
            ))}
          </SubSection>
        ))}
      </Section>

      {/* ============ Body Cell — 14 种 ============ */}
      <Section
        title="数据单元格"
        description="14 种 cell 类型，对应 Figma Cell.png 的 Body Cell 区，全部走 Kit Cell* 组件。"
      >
        <SubSection title="Square Img (CellImageText)">
          <BodyRow showCheckbox><CellImageText src="https://picsum.photos/seed/product1/80/80" title="手工收纳包" subtitle="另有 3 件" /></BodyRow>
          <BodyRow><CellImageText src="https://picsum.photos/seed/product2/80/80" title="智能手表 E2" subtitle="另有 1 件" /></BodyRow>
          <BodyRow showCheckbox><CellImageText src="https://picsum.photos/seed/product3/80/80" title="无线耳机 G1" /></BodyRow>
          <BodyRow><CellImageText src="https://picsum.photos/seed/product4/80/80" title="iPhone X" /></BodyRow>
        </SubSection>

        <SubSection title="User (CellImageText rounded=full)">
          <BodyRow showCheckbox><CellImageText src="https://i.pravatar.cc/80?u=ilham" title="李文" subtitle="ilahmbudi@mail.co…" rounded="full" /></BodyRow>
          <BodyRow><CellImageText src="https://i.pravatar.cc/80?u=john" title="张明" subtitle="johnb@mail.com" rounded="full" /></BodyRow>
          <BodyRow showCheckbox><CellImageText src="https://i.pravatar.cc/80?u=linda" title="林晓" rounded="full" /></BodyRow>
          <BodyRow><CellImageText src="https://i.pravatar.cc/80?u=josh" title="陈晨" rounded="full" /></BodyRow>
        </SubSection>

        <SubSection title="User Group (AvatarGroup)">
          {[2, 3, 4, 5, 6].map((n) => (
            <BodyRow key={n}>
              <AvatarGroup>
                {Array.from({ length: n }).map((_, i) => (
                  <Avatar key={i} src={`https://i.pravatar.cc/64?u=group${i}`} size="sm" />
                ))}
              </AvatarGroup>
            </BodyRow>
          ))}
          {[2, 3, 4, 5, 6].map((n) => (
            <BodyRow key={`ov-${n}`}>
              <AvatarGroup overflowCount={24}>
                {Array.from({ length: n }).map((_, i) => (
                  <Avatar key={i} src={`https://i.pravatar.cc/64?u=group${i}`} size="sm" />
                ))}
              </AvatarGroup>
            </BodyRow>
          ))}
        </SubSection>

        <SubSection title="Circle Img (country flags)">
          <BodyRow showCheckbox><CellImageText src="https://flagcdn.com/w80/au.png" title="澳大利亚" subtitle="悉尼办公室" rounded="full" /></BodyRow>
          <BodyRow><CellImageText src="https://flagcdn.com/w80/de.png" title="德国" subtitle="柏林办公室" rounded="full" /></BodyRow>
          <BodyRow showCheckbox><CellImageText src="https://flagcdn.com/w80/fr.png" title="法国" rounded="full" /></BodyRow>
          <BodyRow><CellImageText src="https://flagcdn.com/w80/jp.png" title="日本" rounded="full" /></BodyRow>
        </SubSection>

        <SubSection title="Files (CellFile)">
          {(["pdf", "doc", "xls", "zip"] as const).map((ext) => (
            <BodyRow key={ext} showCheckbox>
              <CellFile name={`sample.${ext}`} size="400 kb" />
            </BodyRow>
          ))}
        </SubSection>

        <SubSection title="Reg Text (CellText / CellTextSubtitle / CellMuted)">
          <BodyRow showCheckbox><CellTextSubtitle title="项目概览" subtitle="补充说明" /></BodyRow>
          <BodyRow><CellTextSubtitle title="项目概览" subtitle="补充说明" /></BodyRow>
          <BodyRow showCheckbox><CellText>项目概览</CellText></BodyRow>
          <BodyRow><CellText>项目概览</CellText></BodyRow>
          <BodyRow showCheckbox><CellMuted>项目概览</CellMuted></BodyRow>
          <BodyRow><CellMuted>项目概览</CellMuted></BodyRow>
        </SubSection>

        <SubSection title="Numbers (CellNumber)">
          <BodyRow><CellNumber value="$400" /></BodyRow>
          <BodyRow><CellNumber value="$400" trend="up" /></BodyRow>
          <BodyRow><CellNumber value="$400" trend="down" /></BodyRow>
          <BodyRow><CellNumber value="$400" badge="+10%" badgeColor="green" /></BodyRow>
          <BodyRow><CellNumber value="$400" badge="-10%" badgeColor="red" /></BodyRow>
          <BodyRow><CellNumber value="$400" badge="+0%" badgeColor="grey" /></BodyRow>
        </SubSection>

        <SubSection title="Label Badge">
          {labelColors.map((c) => (
            <BodyRow key={c}><Label color={c} variant="solid">示例文本</Label></BodyRow>
          ))}
          {labelColors.map((c) => (
            <BodyRow key={`o-${c}`}><Label color={c} variant="outline">示例文本</Label></BodyRow>
          ))}
        </SubSection>

        <SubSection title="Status (CellStatusDot)">
          {statusDotColors.map((c) => (
            <BodyRow key={c}><CellStatusDot label="Text" color={c} /></BodyRow>
          ))}
          {statusDotColors.map((c) => (
            <BodyRow key={`s-${c}`}><CellStatusDot label="Text" color={c} emphasis="subtle" /></BodyRow>
          ))}
        </SubSection>

        <SubSection title="Progress (CellProgressBar)">
          {progressColors.map((c, i) => (
            <BodyRow key={c}>
              <CellProgressBar value="$400" percent={[10, 30, 45, 60, 45, 75, 55, 100][i]} color={c} />
            </BodyRow>
          ))}
        </SubSection>

        <SubSection title="Code (CellCode)">
          <BodyRow showCheckbox><CellCode code="#302012" /></BodyRow>
          <BodyRow><CellCode code="#302012" /></BodyRow>
          <BodyRow><CellCode code="ORD-2024-0042" /></BodyRow>
        </SubSection>

        <SubSection title="Action (CellActions / CellKebabMenu / CellLink)">
          <BodyRow><CellActions actions={allActionKeys} /></BodyRow>
          <BodyRow><CellActions actions={["eye", "pen", "trash"]} /></BodyRow>
          <BodyRow><CellKebabMenu /></BodyRow>
          {cellLinkColors.map((c) => (
            <BodyRow key={c}><CellLink label={`Link (${c})`} color={c} /></BodyRow>
          ))}
        </SubSection>

        <SubSection title="Rating (CellRating / RatingStars)">
          <BodyRow><CellRating score="5.0" /></BodyRow>
          <BodyRow><CellRating score="4.2" /></BodyRow>
          <BodyRow><RatingStars value={4} size="sm" showValue={false} /></BodyRow>
          <BodyRow><RatingStars value={3.5} size="sm" /></BodyRow>
        </SubSection>

        <SubSection title="仅复选框">
          <BodyRow><Checkbox color="purple" /></BodyRow>
          <BodyRow><Checkbox color="purple" checked /></BodyRow>
          <BodyRow><Checkbox color="blue" checked /></BodyRow>
          <BodyRow><Checkbox color="black" checked /></BodyRow>
        </SubSection>
      </Section>

      {/* ============ DataTable - 6 columns ============ */}
      <Section title="6 Column Table" description="紧凑视图：id / product / customer / total / progress / actions。">
        <DataTable<Order>
          title="近期订单"
          subtitle="近期动态摘要"
          columns={sixColumns}
          rows={orders}
          showCheckbox
          getRowKey={(row) => row.id}
          selectedRowKeys={new Set(["#302011"])}
          showPagination
          currentPage={2}
          totalPages={5}
          paginationLabel="Showing 1-5 from 25"
        />
      </Section>

      {/* ============ DataTable - 8 columns × 3 colors ============ */}
      <Section title="8 Column Table" description="扩展视图：加入 date / payment / status。3 色主题铺开。">
        <div className="flex flex-col gap-6">
          {dataTableColors.map((c) => (
            <DataTable<Order>
              key={c}
              title={`Order History (color="${c}")`}
              subtitle="最近 30 天的全部订单"
              columns={eightColumns}
              rows={orders}
              color={c}
              checkboxColor={c === "black" ? "purple" : c}
              showCheckbox
              getRowKey={(row) => row.id}
              selectedRowKeys={new Set(["#302012", "#302002"])}
              showPagination
              currentPage={1}
              totalPages={5}
              paginationLabel="Showing 1-5 from 25"
            />
          ))}
        </div>
      </Section>

      {/* ============ 6-Column Colors ============ */}
      <Section title="6 Column - Colors" description="purple / blue / black 3 色主题在 6 列模式下的对比。">
        <div className="flex flex-col gap-6">
          {dataTableColors.map((c) => (
            <DataTable<Order>
              key={c}
              title={`color="${c}"`}
              columns={sixColumns}
              rows={orders.slice(0, 3)}
              color={c}
              checkboxColor={c === "black" ? "purple" : c}
              showCheckbox
              getRowKey={(row) => row.id}
              selectedRowKeys={new Set(["#302012"])}
              showPagination
              currentPage={2}
              totalPages={5}
              paginationLabel="Showing 1-3 from 25"
            />
          ))}
        </div>
      </Section>

      {/* ============ FullWidthTable × 3 colors ============ */}
      <Section title="Full Width Table" description="整页 table，自带 row count 选择和分页。3 色全铺。">
        <div className="flex flex-col gap-6">
          {dataTableColors.map((c) => (
            <FullWidthTable<Order>
              key={c}
              title={`All Orders (color="${c}")`}
              subtitle="完整订单列表与明细"
              columns={fullWidthColumns}
              rows={orders}
              color={c}
              checkboxColor={c === "black" ? "purple" : c}
              getRowKey={(row) => row.id}
              selectedRowKeys={new Set(["#302011", "#301901"])}
              showPagination
              currentPage={1}
              totalPages={5}
              showRowCount
              rowCountOptions={[5, 10, 25, 50]}
              currentRowCount={5}
              totalRows={25}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
