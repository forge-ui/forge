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
import { CardBold } from "solar-icon-set";
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
  { id: "#302012", product: "Handmade Pouch", extra: "+3 other", date: "1 min ago", customer: "John Bushmill", email: "Johnb@mail.com", total: "$121.00", payment: "Mastercard", status: "processing", progress: { value: "65%", badge: "+12%", color: "green" }, imageUrl: "https://picsum.photos/seed/pouch/80/80" },
  { id: "#302011", product: "Smartwatch E2", extra: "+1 other", date: "1 min ago", customer: "Ilham Budi A", email: "ilahmbudi@mail.com", total: "$590.00", payment: "Visa", status: "processing", progress: { value: "40%", badge: "-3%", color: "red" }, imageUrl: "https://picsum.photos/seed/watch2/80/80" },
  { id: "#302002", product: "Smartwatch E1", extra: "", date: "5 hour ago", customer: "Mohammad Karim", email: "m_karim@mail.com", total: "$125.00", payment: "Transfer", status: "shipped", progress: { value: "82%", badge: "+5%", color: "green" }, imageUrl: "https://picsum.photos/seed/watch1/80/80" },
  { id: "#301901", product: "Headphone G1", extra: "+1 other", date: "1 day ago", customer: "Linda Blair", email: "lindablair@mail.com", total: "$348.00", payment: "Paypal", status: "delivered", progress: { value: "100%", badge: "+0%", color: "grey" }, imageUrl: "https://picsum.photos/seed/headphone/80/80" },
  { id: "#301900", product: "iPhone X", extra: "", date: "2 day ago", customer: "Josh Adam", email: "josh_adam@mail.com", total: "$607.00", payment: "Visa", status: "canceled", progress: { value: "12%", badge: "-8%", color: "red" }, imageUrl: "https://picsum.photos/seed/iphone/80/80" },
];

function statusColor(s: Order["status"]): StatusBadgeColor {
  return ({ processing: "yellow", shipped: "cyan", delivered: "green", canceled: "red" } as const)[s];
}

const sixColumns: ColumnDef<Order>[] = [
  { key: "id", header: "ID", width: "w-[110px]", render: (r) => <CellText>{r.id}</CellText> },
  { key: "product", header: "Product", sortable: true, width: "w-60", render: (r) => <CellImageText src={r.imageUrl} title={r.product} subtitle={r.extra || undefined} /> },
  { key: "customer", header: "Customer", width: "w-[170px]", render: (r) => <CellTextSubtitle title={r.customer} subtitle={r.email} /> },
  { key: "total", header: "Total", width: "w-[110px]", render: (r) => <CellText>{r.total}</CellText> },
  { key: "progress", header: "Progress", sortable: true, width: "w-[140px]", render: (r) => <CellProgressValue value={r.progress.value} badge={r.progress.badge} badgeColor={r.progress.color} /> },
  { key: "actions", header: "", width: "w-[60px]", render: () => <CellKebabMenu /> },
];

const eightColumns: ColumnDef<Order>[] = [
  { key: "id", header: "ID", width: "w-[110px]", render: (r) => <CellText>{r.id}</CellText> },
  { key: "product", header: "Product", sortable: true, width: "w-60", render: (r) => <CellImageText src={r.imageUrl} title={r.product} subtitle={r.extra || undefined} /> },
  { key: "date", header: "Date", sortable: true, width: "w-[120px]", render: (r) => <CellMuted>{r.date}</CellMuted> },
  { key: "customer", header: "Customer", width: "w-[170px]", render: (r) => <CellTextSubtitle title={r.customer} subtitle={r.email} /> },
  { key: "total", header: "Total", width: "w-[110px]", render: (r) => <CellText>{r.total}</CellText> },
  { key: "payment", header: "Payment", width: "w-[120px]", render: (r) => <CellMuted>{r.payment}</CellMuted> },
  { key: "status", header: "Status", sortable: true, width: "w-[120px]", render: (r) => <StatusBadge label={r.status[0].toUpperCase() + r.status.slice(1)} color={statusColor(r.status)} /> },
  { key: "actions", header: "", width: "w-[60px]", render: () => <CellKebabMenu /> },
];

const fullWidthColumns: ColumnDef<Order>[] = [
  ...eightColumns.slice(0, -1),
  { key: "progress", header: "Progress", sortable: true, width: "w-[140px]", render: (r: Order) => <CellProgressValue value={r.progress.value} badge={r.progress.badge} badgeColor={r.progress.color} /> },
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
  { kind: "text", title: "Text only" },
  { kind: "text-icon", title: "Text + icon" },
  { kind: "icon-only", title: "Icon only" },
];

function HeaderCellContent({ kind }: { kind: HeaderRow["kind"] }) {
  if (kind === "text") return <>Product</>;
  if (kind === "text-icon")
    return (
      <span className="inline-flex items-center gap-1">
        <CardBold size={20} color="#A1A1AA" />
        Product
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

const labelColors: LabelColor[] = ["purple", "blue", "yellow", "red", "cyan", "green", "gray"];
const progressColors: ProgressBarColor[] = ["purple", "blue", "green", "red", "orange", "yellow", "cyan", "gray"];
const statusDotColors: StatusDotColor[] = ["purple", "blue", "green", "red", "yellow", "cyan", "grey", "black"];
const dataTableColors: DataTableColor[] = ["purple", "blue", "black"];
const allActionKeys: CellActionKey[] = ["mail", "phone", "chat", "eye", "pen", "trash"];
const cellLinkColors: CellLinkColor[] = ["green", "red", "purple", "blue", "black"];

export default function TableCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Table"
        hint="Header / Body Cell 全变体 + DataTable (6/8 列) + FullWidthTable。"
      />

      {/* ============ Header Cell ============ */}
      <Section
        title="Header Cell"
        description="content (text / text+icon / icon-only) × checkbox (none / purple / blue / black) × sort (有/无) = 24 variants。"
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
        title="Body Cell"
        description="14 种 cell 类型，对应 Figma Cell.png 的 Body Cell 区，全部走 Kit Cell* 组件。"
      >
        <SubSection title="Square Img (CellImageText)">
          <BodyRow showCheckbox><CellImageText src="https://picsum.photos/seed/product1/80/80" title="Handmade Pouch" subtitle="+3 other" /></BodyRow>
          <BodyRow><CellImageText src="https://picsum.photos/seed/product2/80/80" title="Smartwatch E2" subtitle="+1 other" /></BodyRow>
          <BodyRow showCheckbox><CellImageText src="https://picsum.photos/seed/product3/80/80" title="Headphone G1" /></BodyRow>
          <BodyRow><CellImageText src="https://picsum.photos/seed/product4/80/80" title="iPhone X" /></BodyRow>
        </SubSection>

        <SubSection title="User (CellImageText rounded=full)">
          <BodyRow showCheckbox><CellImageText src="https://i.pravatar.cc/80?u=ilham" title="Ilham Budi" subtitle="ilahmbudi@mail.co…" rounded="full" /></BodyRow>
          <BodyRow><CellImageText src="https://i.pravatar.cc/80?u=john" title="John Bushmill" subtitle="johnb@mail.com" rounded="full" /></BodyRow>
          <BodyRow showCheckbox><CellImageText src="https://i.pravatar.cc/80?u=linda" title="Linda Blair" rounded="full" /></BodyRow>
          <BodyRow><CellImageText src="https://i.pravatar.cc/80?u=josh" title="Josh Adam" rounded="full" /></BodyRow>
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
          <BodyRow showCheckbox><CellImageText src="https://flagcdn.com/w80/au.png" title="Australia" subtitle="Sydney office" rounded="full" /></BodyRow>
          <BodyRow><CellImageText src="https://flagcdn.com/w80/de.png" title="Germany" subtitle="Berlin office" rounded="full" /></BodyRow>
          <BodyRow showCheckbox><CellImageText src="https://flagcdn.com/w80/fr.png" title="France" rounded="full" /></BodyRow>
          <BodyRow><CellImageText src="https://flagcdn.com/w80/jp.png" title="Japan" rounded="full" /></BodyRow>
        </SubSection>

        <SubSection title="Files (CellFile)">
          {(["pdf", "doc", "xls", "zip"] as const).map((ext) => (
            <BodyRow key={ext} showCheckbox>
              <CellFile name={`sample.${ext}`} size="400 kb" />
            </BodyRow>
          ))}
        </SubSection>

        <SubSection title="Reg Text (CellText / CellTextSubtitle / CellMuted)">
          <BodyRow showCheckbox><CellTextSubtitle title="Title Here" subtitle="Subtext here" /></BodyRow>
          <BodyRow><CellTextSubtitle title="Title Here" subtitle="Subtext here" /></BodyRow>
          <BodyRow showCheckbox><CellText>Title Here</CellText></BodyRow>
          <BodyRow><CellText>Title Here</CellText></BodyRow>
          <BodyRow showCheckbox><CellMuted>Title Here</CellMuted></BodyRow>
          <BodyRow><CellMuted>Title Here</CellMuted></BodyRow>
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
            <BodyRow key={c}><Label color={c} variant="solid">Text Here</Label></BodyRow>
          ))}
          {labelColors.map((c) => (
            <BodyRow key={`o-${c}`}><Label color={c} variant="outline">Text Here</Label></BodyRow>
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

        <SubSection title="Checkbox only">
          <BodyRow><Checkbox color="purple" /></BodyRow>
          <BodyRow><Checkbox color="purple" checked /></BodyRow>
          <BodyRow><Checkbox color="blue" checked /></BodyRow>
          <BodyRow><Checkbox color="black" checked /></BodyRow>
        </SubSection>
      </Section>

      {/* ============ DataTable - 6 columns ============ */}
      <Section title="6 Column Table" description="紧凑视图：id / product / customer / total / progress / actions。">
        <DataTable<Order>
          title="Recent Orders"
          subtitle="A summary of your most recent activity"
          columns={sixColumns}
          rows={orders}
          showCheckbox
          selectedRows={new Set([1])}
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
              subtitle="All orders across the last 30 days"
              columns={eightColumns}
              rows={orders}
              color={c}
              checkboxColor={c === "black" ? "purple" : c}
              showCheckbox
              selectedRows={new Set([0, 2])}
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
              selectedRows={new Set([0])}
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
              subtitle="Complete order list with full data"
              columns={fullWidthColumns}
              rows={orders}
              color={c}
              checkboxColor={c === "black" ? "purple" : c}
              selectedRows={new Set([1, 3])}
              showPagination
              currentPage={1}
              totalPages={5}
              paginationLabel="Showing 1-5 from 25"
              showRowCount
              rowCountOptions={[5, 10, 25, 50]}
              currentRowCount={5}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
