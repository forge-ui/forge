"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  DataTable,
  FullWidthTable,
  TableCell,
  Label,
  StatusBadge,
  ProgressBadge,
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
  Button,
  Avatar,
  AvatarGroup,
  CircleIcon,
  ToolbarDatepicker,
  ToolbarFilterButton,
} from "@forge-ui/react";
import type {
  ColumnDef,
  StatusBadgeColor,
  StatusDotColor,
  ProgressBadgeColor,
  ProgressBarColor,
  AvatarInitialColor,
} from "@forge-ui/react";
import { AddCircleLinear, StarLinear, CheckCircleLinear, CardBold } from "solar-icon-set";
import { PageHeading, Section, SubSection, SubSectionGrid } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

type OrderRow = {
  invoice: string;
  product: string;
  productSubtitle: string;
  image: string;
  customer: string;
  email: string;
  initials: string;
  avatarColor: AvatarInitialColor;
  date: string;
  status: string;
  statusColor: StatusBadgeColor;
  amount: string;
  trend: string;
  trendColor: ProgressBadgeColor;
};

const orderRows: OrderRow[] = [
  {
    invoice: "#302012",
    product: "Handmade Pouch",
    productSubtitle: "+3 other products",
    image: "/images/stat-card.png",
    customer: "Jane Cooper",
    email: "jane@example.com",
    initials: "JC",
    avatarColor: "purple",
    date: "1 min ago",
    status: "Pending",
    statusColor: "yellow",
    amount: "$121.00",
    trend: "+10%",
    trendColor: "green",
  },
  {
    invoice: "#302011",
    product: "Smartwatch E2",
    productSubtitle: "+1 other products",
    image: "/images/stat-card.png",
    customer: "Wade Warren",
    email: "wade@example.com",
    initials: "WW",
    avatarColor: "blue",
    date: "1 min ago",
    status: "Processing",
    statusColor: "cyan",
    amount: "$590.00",
    trend: "-5%",
    trendColor: "red",
  },
  {
    invoice: "#302002",
    product: "Smartwatch E1",
    productSubtitle: "",
    image: "/images/stat-card.png",
    customer: "Esther Howard",
    email: "esther@example.com",
    initials: "EH",
    avatarColor: "green",
    date: "5 hour ago",
    status: "Completed",
    statusColor: "green",
    amount: "$125.00",
    trend: "+12%",
    trendColor: "green",
  },
];

const orderColumns: ColumnDef<OrderRow>[] = [
  { key: "invoice", header: "Invoice", sortable: true, width: "w-28", render: (row) => <CellText>{row.invoice}</CellText> },
  {
    key: "product",
    header: "Product",
    sortable: true,
    flex: true,
    render: (row) => <CellImageText src={row.image} title={row.product} subtitle={row.productSubtitle || undefined} />,
  },
  { key: "date", header: "Date", sortable: true, width: "w-32", render: (row) => <CellMuted>{row.date}</CellMuted> },
  {
    key: "customer",
    header: "Customer",
    flex: true,
    render: (row) => (
      <div className="flex-1 flex items-center gap-2">
        <Avatar initials={row.initials} color={row.avatarColor} size="md" />
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <span className="text-fg-black text-sm font-semibold leading-5 tracking-fg line-clamp-1">{row.customer}</span>
          <span className="text-fg-grey-700 text-xs font-normal leading-4 tracking-fg line-clamp-1">{row.email}</span>
        </div>
      </div>
    ),
  },
  { key: "status", header: "Status", width: "w-32", render: (row) => <StatusBadge label={row.status} color={row.statusColor} /> },
  {
    key: "amount",
    header: "Amount",
    sortable: true,
    width: "w-40",
    render: (row) => <CellProgressValue value={row.amount} badge={row.trend} badgeColor={row.trendColor} />,
  },
  { key: "actions", header: "", width: "w-16", render: () => <CellKebabMenu /> },
];

const CODE_IMPORT = `import {
  DataTable, FullWidthTable, TableCell,
  StatusBadge, ProgressBadge,
  CellText, CellMuted, CellTextSubtitle,
  CellImageText, CellFile,
  CellNumber, CellProgressValue, CellProgressBar,
  CellStatusDot, CellCode, CellRating,
  CellActions, CellLink, CellKebabMenu,
  type ColumnDef,
} from "@forge-ui/react";`;

const CODE_STATUS_USAGE = `<StatusBadge label="Pending" color="yellow" />
<StatusBadge label="Processing" color="cyan" />
<StatusBadge label="Completed" color="green" />
<StatusBadge label="Refund" color="red" />
<StatusBadge label="Premium" color="purple" />
<StatusBadge label="Info" color="blue" />
<StatusBadge label="Draft" color="grey" />`;

const CODE_PROGRESS_USAGE = `<ProgressBadge label="+12%" color="green" />
<ProgressBadge label="-5%" color="red" />
<ProgressBadge label="0%" color="grey" />`;

const CODE_HEADER_CELL = `// 最完整组合：checkbox + icon + 文字 + 排序。
// 通过 props 自由裁剪：去掉 checkbox / leadIcon / sortable / children 即得其他变体。
<TableCell
  variant="header"
  checkbox
  leadIcon={<CardBold size={20} />}
  sortable
>
  Product
</TableCell>`;

const CODE_REG_TEXT = `<CellText>Title Here</CellText>
<CellMuted>Subtext here</CellMuted>
<CellTextSubtitle title="Title Here" subtitle="Subtext here" />`;

const CODE_SQUARE_IMG = `<CellImageText src="/img.png" title="Title Here" subtitle="Subtext here" />`;

const CODE_CIRCLE_IMG = `<CellImageText
  src="/flag-au.png"
  title="Australia"
  subtitle="ilahmbudi@mail.co..."
  rounded="full"
/>`;

const CODE_USER = `<div className="flex items-center gap-2">
  <Avatar initials="IB" color="purple" size="md" />
  <div className="flex flex-col">
    <span className="text-fg-black text-sm font-semibold">Ilham Budi</span>
    <span className="text-fg-grey-700 text-xs">ilahmbudi@mail.co...</span>
  </div>
</div>`;

const CODE_USER_GROUP = `<AvatarGroup overflowCount={24}>
  <Avatar initials="IB" color="purple" size="sm" />
  <Avatar initials="WW" color="blue" size="sm" />
  <Avatar initials="EH" color="green" size="sm" />
</AvatarGroup>`;

const CODE_BADGE = `<div className="flex items-center gap-2">
  <CircleIcon color="purple" size="sm"><StarLinear size={14} /></CircleIcon>
  <div className="flex flex-col">
    <span className="text-fg-black text-sm font-semibold">Project Name</span>
    <span className="text-fg-grey-700 text-xs">ilahmbudi@mail.co...</span>
  </div>
</div>`;

const CODE_FILES = `<CellFile name="report.xls" size="400 kb" />
<CellFile name="slides.pptx" size="400 kb" />
<CellFile name="cover.png" />`;

const CODE_NUMBERS = `// 方向箭头变体（trend 为 'up' | 'down'）
<CellNumber value="$400" trend="up" />

// 涨跌徽章变体（badge + badgeColor）
<CellNumber value="$400" badge="+10%" badgeColor="green" />`;

const CODE_LABEL_BADGE = `<StatusBadge label="Text Here" color="purple" />
<StatusBadge label="Text Here" color="blue" />
<StatusBadge label="Text Here" color="yellow" />
<StatusBadge label="Text Here" color="red" />
<StatusBadge label="Text Here" color="cyan" />
<StatusBadge label="Text Here" color="green" />
<StatusBadge label="Text Here" color="grey" />`;

const CODE_STATUS_DOT = `<CellStatusDot label="Text" color="purple" />`;

const CODE_PROGRESS_BAR = `<CellProgressBar value="$400" percent={0} color="gray" />
<CellProgressBar value="$400" percent={45} color="purple" />
<CellProgressBar value="$400" percent={100} color="blue" />
<CellProgressBar value="$400" percent={45} color="red" />
<CellProgressBar value="$400" percent={45} color="yellow" />
<CellProgressBar value="$400" percent={45} color="cyan" />
<CellProgressBar value="$400" percent={100} color="green" />`;

const CODE_CODE_CELL = `<CellCode code="#302012" />`;

const CODE_ACTION = `// 图标组（mail/phone/chat/eye/pen/trash + kebab）
<CellActions actions={["mail", "phone", "chat", "eye", "pen", "trash"]} />

// 只 kebab
<CellKebabMenu />

// 行内链接动作（5 色）
<CellLink label="Link" color="green" />
<CellLink label="Link" color="red" />`;

const CODE_RATING = `<CellRating score="5.0" />`;

const CODE_COLUMNS = `const columns: ColumnDef<OrderRow>[] = [
  { key: "invoice", header: "Invoice", sortable: true, width: "w-28",
    render: (row) => <CellText>{row.invoice}</CellText> },
  { key: "product", header: "Product", flex: true,
    render: (row) => <CellImageText src={row.image} title={row.product} /> },
  { key: "status", header: "Status", width: "w-32",
    render: (row) => <StatusBadge label={row.status} color={row.statusColor} /> },
  { key: "actions", header: "", width: "w-16",
    render: () => <CellKebabMenu /> },
];`;

const CODE_DATATABLE_USAGE = `<DataTable<OrderRow>
  title="Recent Orders"
  subtitle="Last 30 days"
  color="blue"
  columns={orderColumns}
  rows={orderRows}
  showPagination
  currentPage={1}
  totalPages={16}
  paginationLabel="Showing 1-3 from 156"
/>`;

const CODE_DATATABLE_COLORS = `<DataTable color="purple" ... />
<DataTable color="blue" ... />
<DataTable color="black" ... />`;

const CODE_FULLWIDTH_USAGE = `<FullWidthTable<OrderRow>
  title="Recent Orders"
  color="black"
  showCheckbox
  showRowCount
  currentRowCount={10}
  rowCountOptions={[10, 25, 50]}
  showPagination
  columns={orderColumns}
  rows={orderRows}
/>`;

const HEADER_CELL_PROPS: ApiTableRow[] = [
  { attr: "variant", type: "'header' | 'body'", defaultValue: "'body'", description: "表头还是表体单元格。" },
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "标题文字。可省略以得到 icon-only header。" },
  { attr: "leadIcon", type: "ReactNode", defaultValue: "—", description: "标题前的 20px icon（与 checkbox 等高，建议用 Bold 实心样式）。" },
  { attr: "sortable", type: "boolean", defaultValue: "false", description: "是否显示右侧排序 ▾ 按钮。" },
  { attr: "onSort", type: "() => void", defaultValue: "—", description: "点击排序按钮回调。" },
  { attr: "checkbox", type: "boolean", defaultValue: "false", description: "是否显示左侧勾选框。" },
  { attr: "checked", type: "boolean", defaultValue: "false", description: "勾选状态。" },
  { attr: "onCheckedChange", type: "(checked) => void", defaultValue: "—", description: "勾选回调。" },
  { attr: "checkboxColor", type: "'purple' | 'blue' | 'green' | 'red' | 'orange' | 'black'", defaultValue: "'purple'", description: "勾选框语义色（CheckboxColor）。" },
];

const STATUS_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "—", description: "徽章文字。" },
  { attr: "color", type: "'purple' | 'blue' | 'yellow' | 'cyan' | 'green' | 'red' | 'grey'", defaultValue: "'green'", description: "语义色，7 色对应 Figma Label Badge 分类。" },
];

const STATUS_DOT_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "—", description: "状态文字。" },
  { attr: "color", type: "'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'cyan' | 'grey' | 'black'", defaultValue: "'purple'", description: "圆点语义色，8 色。" },
  { attr: "emphasis", type: "'strong' | 'subtle'", defaultValue: "'strong'", description: "文字权重：strong = fg-black semibold，subtle = fg-grey-900 medium。" },
];

const PROGRESS_BAR_PROPS: ApiTableRow[] = [
  { attr: "value", type: "string", defaultValue: "—", description: "左侧主数值（如 $400）。" },
  { attr: "percent", type: "number", defaultValue: "0", description: "0-100 的进度百分比，自动 clamp。" },
  { attr: "color", type: "ProgressBarColor", defaultValue: "'purple'", description: "填充色，7 色。" },
];

const NUMBER_PROPS: ApiTableRow[] = [
  { attr: "value", type: "string", defaultValue: "—", description: "主数值。" },
  { attr: "trend", type: "'up' | 'down'", defaultValue: "—", description: "方向箭头（不带百分比时使用）。" },
  { attr: "badge", type: "string", defaultValue: "—", description: "涨跌徽章文字，与 badgeColor 搭配。" },
  { attr: "badgeColor", type: "'green' | 'red' | 'grey'", defaultValue: "'green'", description: "徽章颜色。" },
  { attr: "subdued", type: "boolean", defaultValue: "false", description: "弱化主数值（fg-grey-900 medium）。" },
];

const FILE_PROPS: ApiTableRow[] = [
  { attr: "name", type: "string", defaultValue: "—", description: "文件名（含扩展名，决定 icon）。" },
  { attr: "size", type: "string", defaultValue: "—", description: "副标题文件大小，如 '400 kb'。" },
  { attr: "icon", type: "ReactNode", defaultValue: "—", description: "自定义 icon，替代 FileTypeIcon。" },
];

const ACTIONS_PROPS: ApiTableRow[] = [
  { attr: "actions", type: "CellActionKey[]", defaultValue: "[]", description: "'mail' | 'phone' | 'chat' | 'eye' | 'pen' | 'trash' 的任意组合。" },
  { attr: "showKebab", type: "boolean", defaultValue: "true", description: "是否追加 kebab menu。" },
  { attr: "iconColor", type: "string", defaultValue: "'var(--fg-grey-700)'", description: "所有 icon 颜色（solar-icon-set 需用 color prop）。" },
  { attr: "onAction / onKebab", type: "(key) => void", defaultValue: "—", description: "点击回调。" },
];

const PROGRESS_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "—", description: "百分比或增量文字。" },
  { attr: "color", type: "'green' | 'red' | 'grey'", defaultValue: "'green'", description: "涨跌色。" },
];

const REGTEXT_PROPS: ApiTableRow[] = [
  { attr: "CellText.children", type: "ReactNode", defaultValue: "—", description: "主文本（fg-black / 14px / semibold）。" },
  { attr: "CellMuted.children", type: "ReactNode", defaultValue: "—", description: "辅助文本（fg-grey-900 / 14px / medium）。" },
  { attr: "CellTextSubtitle.title", type: "string", defaultValue: "—", description: "主文本。" },
  { attr: "CellTextSubtitle.subtitle", type: "string", defaultValue: "—", description: "副标题（fg-grey-700 / 12px）。" },
];

const IMAGETEXT_PROPS: ApiTableRow[] = [
  { attr: "src", type: "string", defaultValue: "—", description: "缩略图 URL。" },
  { attr: "title", type: "string", defaultValue: "—", description: "右侧主文本。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "右侧副标题。" },
  { attr: "rounded", type: "'lg' | 'full'", defaultValue: "'lg'", description: "圆角形态：lg = 方形圆角缩略图；full = 圆形（用于头像 / 国旗）。" },
];

const USERGROUP_PROPS: ApiTableRow[] = [
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "嵌套 Avatar 组件，自动 -space-x-2 重叠。" },
  { attr: "overflowCount", type: "number", defaultValue: "—", description: "超出徽章数值，> 0 时尾部追加 +N 圆。" },
];

const CODE_CELL_PROPS: ApiTableRow[] = [
  { attr: "code", type: "string", defaultValue: "—", description: "编号文本，如 #302012。fg-black / 14px / semibold。" },
];

const RATING_PROPS: ApiTableRow[] = [
  { attr: "score", type: "string | number", defaultValue: "—", description: "右侧分值，自由格式。" },
  { attr: "color", type: "string", defaultValue: "'var(--fg-yellow)'", description: "星形图标颜色（CSS 颜色值）。" },
];

const DATATABLE_PROPS: ApiTableRow[] = [
  { attr: "columns", type: "ColumnDef<Row>[]", defaultValue: "—", description: "列定义数组，每列带 render 函数。" },
  { attr: "rows", type: "Row[]", defaultValue: "—", description: "数据数组。" },
  { attr: "title", type: "string", defaultValue: "—", description: "表头标题。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "表头副标题。" },
  { attr: "badge", type: "ReactNode", defaultValue: "—", description: "title 右侧的 Label / 计数徽章。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "强调色，影响 checkbox / action 按钮。" },
  { attr: "showCheckbox", type: "boolean", defaultValue: "false", description: "是否显示首列勾选框。" },
  { attr: "selectedRows", type: "Set<number>", defaultValue: "—", description: "已选中行的索引集合。" },
  { attr: "headerActions", type: "ReactNode", defaultValue: "—", description: "表头右侧操作区，常放 Datepicker + Button。" },
  { attr: "showPagination", type: "boolean", defaultValue: "false", description: "底部是否显示翻页。" },
  { attr: "currentPage / totalPages", type: "number", defaultValue: "—", description: "当前页与总页数。" },
  { attr: "paginationLabel", type: "string", defaultValue: "—", description: "左下角范围说明文字。" },
];

const FULLWIDTH_PROPS: ApiTableRow[] = [
  { attr: "columns / rows", type: "ColumnDef<Row>[] / Row[]", defaultValue: "—", description: "列定义与数据，签名同 DataTable。" },
  { attr: "showRowCount", type: "boolean", defaultValue: "false", description: "是否显示 Show N 选择器。" },
  { attr: "currentRowCount", type: "number", defaultValue: "10", description: "每页行数当前值。" },
  { attr: "rowCountOptions", type: "number[]", defaultValue: "[10, 25, 50]", description: "每页行数选项。" },
  { attr: "showCheckbox / selectedRows", type: "同 DataTable", defaultValue: "—", description: "勾选逻辑。" },
  { attr: "showPagination / currentPage / totalPages", type: "同 DataTable", defaultValue: "—", description: "翻页控制。" },
];

function CellPreviewRow({ children }: { children: ReactNode }) {
  return (
    <div className="self-stretch px-6 py-4 bg-white border border-fg-grey-200 rounded-lg flex justify-start items-center gap-2">
      {children}
    </div>
  );
}

export default function TableCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Table"
        hint="数据表家族：1 类 Header Cell + 14 类 Body Cell（对齐 Figma 全量）· DataTable 标准表 · FullWidthTable 宽版。"
      />

      <Section
        title="Import"
        description="从 @forge-ui/react 统一导入表格相关组件。"
      >
        <CodeBlock code={CODE_IMPORT} />
      </Section>

      <Section
        title="Header Cell"
        description="表头单元格。通过 TableCell variant='header' + checkbox / leadIcon / sortable / children 自由裁剪出 Figma 全部形态。下方展示最完整组合 1 个，其余形态去掉对应 prop 即可。"
      >
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_HEADER_CELL} minHeight={120}>
            <div className="w-56">
              <TableCell
                variant="header"
                checkbox
                leadIcon={<CardBold size={20} color="var(--fg-grey-500)" />}
                sortable
              >
                Product
              </TableCell>
            </div>
          </PreviewBlock>
          <ApiTable rows={HEADER_CELL_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="Body Cell"
        description="表体单元格的 14 个内容分类（Figma Cell 页全量），每类列出代表变体。直接塞进 ColumnDef.render。"
      >
        <SubSectionGrid cols={2}>
        <SubSection title="1 · Reg Text" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            纯文本系。CellText（主） / CellMuted（辅） / CellTextSubtitle（可带副标题）。
          </p>
          <PreviewBlock code={CODE_REG_TEXT} minHeight={220}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow><CellText>Title Here</CellText></CellPreviewRow>
              <CellPreviewRow><CellMuted>Subtext here</CellMuted></CellPreviewRow>
              <CellPreviewRow><CellTextSubtitle title="Title Here" subtitle="Subtext here" /></CellPreviewRow>
            </div>
          </PreviewBlock>
          <ApiTable rows={REGTEXT_PROPS} />
        </SubSection>

        <SubSection title="2 · Square Img" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            方形缩略图 + 文字。常用于商品、封面列。
          </p>
          <PreviewBlock code={CODE_SQUARE_IMG} minHeight={140}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow>
                <CellImageText src="/images/stat-card.png" title="Handmade Pouch" subtitle="+3 other products" />
              </CellPreviewRow>
            </div>
          </PreviewBlock>
          <ApiTable rows={IMAGETEXT_PROPS} />
        </SubSection>

        <SubSection title="3 · Circle Img" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            圆形缩略图 + 文字。CellImageText 的 <InlineCode>rounded=&quot;full&quot;</InlineCode> 变体，常用于国旗、头像。
          </p>
          <PreviewBlock code={CODE_CIRCLE_IMG} minHeight={140}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow>
                <CellImageText src="/images/stat-card.png" title="Australia" subtitle="ilahmbudi@mail.co..." rounded="full" />
              </CellPreviewRow>
            </div>
          </PreviewBlock>
          <ApiTable rows={IMAGETEXT_PROPS} />
        </SubSection>

        <SubSection title="4 · User" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            头像 + 姓名（可选邮箱）。直接用 Avatar 组合，不需要专用 Cell —— Avatar 的 API 见 <InlineCode>/cases/avatar</InlineCode>。
          </p>
          <PreviewBlock code={CODE_USER} minHeight={140}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow>
                <div className="flex items-center gap-2">
                  <Avatar initials="IB" color="purple" size="md" />
                  <div className="flex flex-col">
                    <span className="text-fg-black text-sm font-semibold">Ilham Budi</span>
                    <span className="text-fg-grey-700 text-xs">ilahmbudi@mail.co...</span>
                  </div>
                </div>
              </CellPreviewRow>
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="5 · User Group" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            重叠头像组。<InlineCode>overflowCount</InlineCode> 控制超出徽章数值。
          </p>
          <PreviewBlock code={CODE_USER_GROUP} minHeight={140}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow>
                <AvatarGroup overflowCount={24}>
                  <Avatar initials="IB" color="purple" size="sm" />
                  <Avatar initials="WW" color="blue" size="sm" />
                  <Avatar initials="EH" color="green" size="sm" />
                </AvatarGroup>
              </CellPreviewRow>
            </div>
          </PreviewBlock>
          <ApiTable rows={USERGROUP_PROPS} />
        </SubSection>

        <SubSection title="6 · Badge (Circle Icon + Text)" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            小圆 icon 徽章 + 文字。多用于项目、分类列 —— 底层是 <InlineCode>CircleIcon</InlineCode> + 普通文本，API 见 <InlineCode>/cases/badge</InlineCode>。
          </p>
          <PreviewBlock code={CODE_BADGE} minHeight={140}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow>
                <div className="flex items-center gap-2">
                  <CircleIcon color="green" size="sm"><CheckCircleLinear size={14} color="var(--fg-green-500)" /></CircleIcon>
                  <div className="flex flex-col">
                    <span className="text-fg-black text-sm font-semibold">Project Name</span>
                    <span className="text-fg-grey-700 text-xs">ilahmbudi@mail.co...</span>
                  </div>
                </div>
              </CellPreviewRow>
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="7 · Files" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            文件类型 icon + 文件名 + 大小。走 <InlineCode>FileTypeIcon</InlineCode>，按扩展名自动配图。
          </p>
          <PreviewBlock code={CODE_FILES} minHeight={220}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow><CellFile name="annual-report.xlsx" size="400 kb" /></CellPreviewRow>
              <CellPreviewRow><CellFile name="deck.pptx" size="400 kb" /></CellPreviewRow>
              <CellPreviewRow><CellFile name="cover.png" /></CellPreviewRow>
            </div>
          </PreviewBlock>
          <ApiTable rows={FILE_PROPS} />
        </SubSection>

        <SubSection title="8 · Numbers" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            数字列，两种主视觉：<InlineCode>trend</InlineCode> 箭头 或 <InlineCode>badge</InlineCode> 涨跌徽章；<InlineCode>subdued</InlineCode> 可弱化主数值。
          </p>
          <PreviewBlock code={CODE_NUMBERS} minHeight={140}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow><CellNumber value="$400" trend="up" /></CellPreviewRow>
              <CellPreviewRow><CellNumber value="$400" badge="+10%" badgeColor="green" /></CellPreviewRow>
            </div>
          </PreviewBlock>
          <ApiTable rows={NUMBER_PROPS} />
          <p className="text-xs leading-[1.7] text-fg-grey-700 mt-2">
            底层涨跌徽章 <InlineCode>ProgressBadge</InlineCode> 可独立使用（用在 StatCard / Header 标题旁）：
          </p>
          <PreviewBlock code={CODE_PROGRESS_USAGE} minHeight={100}>
            <ProgressBadge label="+12%" color="green" />
            <ProgressBadge label="-5%" color="red" />
            <ProgressBadge label="0%" color="grey" />
          </PreviewBlock>
          <ApiTable rows={PROGRESS_PROPS} />
        </SubSection>

        <SubSection title="9 · Label Badge" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            实心胶囊徽章，底层 <InlineCode>StatusBadge</InlineCode>，也可在 Status 列 pill 形式复用。完整 7 色见 API 表 <InlineCode>color</InlineCode>。
          </p>
          <PreviewBlock code={CODE_LABEL_BADGE} minHeight={120}>
            <StatusBadge label="Text Here" color="purple" />
          </PreviewBlock>
          <ApiTable rows={STATUS_PROPS} />
        </SubSection>

        <SubSection title="10 · Status Dot" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            左圆点（带浅色 ring）+ 文字。对应 Figma Status 分类，常用于在线/审核等状态。<InlineCode>emphasis</InlineCode> 控强弱、<InlineCode>color</InlineCode> 切 8 色，见 API 表。
          </p>
          <PreviewBlock code={CODE_STATUS_DOT} minHeight={120}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow><CellStatusDot label="Text" color="purple" /></CellPreviewRow>
            </div>
          </PreviewBlock>
          <ApiTable rows={STATUS_DOT_PROPS} />
        </SubSection>

        <SubSection title="11 · Progress Bar" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            数值 + 轨道 + 百分比。常用于 Savings、达成率列。完整 7 色见 API 表 <InlineCode>color</InlineCode>。
          </p>
          <PreviewBlock code={CODE_PROGRESS_BAR} minHeight={120}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-sm">
              <CellPreviewRow><CellProgressBar value="$400" percent={45} color="purple" /></CellPreviewRow>
            </div>
          </PreviewBlock>
          <ApiTable rows={PROGRESS_BAR_PROPS} />
        </SubSection>

        <SubSection title="12 · Code" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            单色编号码文本，如 <InlineCode>#302012</InlineCode>。
          </p>
          <PreviewBlock code={CODE_CODE_CELL} minHeight={120}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow><CellCode code="#302012" /></CellPreviewRow>
            </div>
          </PreviewBlock>
          <ApiTable rows={CODE_CELL_PROPS} />
        </SubSection>

        <SubSection title="13 · Action" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 变体：icon 组（mail/phone/chat/eye/pen/trash + kebab） / 纯 kebab / 行内 CellLink。
          </p>
          <PreviewBlock code={CODE_ACTION} minHeight={260}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-lg">
              <CellPreviewRow>
                <CellActions actions={["mail", "phone", "chat", "eye", "pen", "trash"]} />
              </CellPreviewRow>
              <CellPreviewRow><CellKebabMenu /></CellPreviewRow>
              <CellPreviewRow>
                <div className="flex items-center gap-3">
                  <CellLink label="Link" color="green" />
                  <CellLink label="Link" color="red" />
                </div>
              </CellPreviewRow>
            </div>
          </PreviewBlock>
          <ApiTable rows={ACTIONS_PROPS} />
        </SubSection>

        <SubSection title="14 · Rating" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            星 + 分值。<InlineCode>score</InlineCode> 接受字符串或数字。
          </p>
          <PreviewBlock code={CODE_RATING} minHeight={120}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow><CellRating score="5.0" /></CellPreviewRow>
            </div>
          </PreviewBlock>
          <ApiTable rows={RATING_PROPS} />
        </SubSection>
        </SubSectionGrid>
      </Section>

      <Section
        title="DataTable"
        description="标准表，支持 title / subtitle / badge / checkbox / 翻页，适合中等宽度面板。"
      >
        <SubSection title="Column Definition" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            用 <InlineCode>ColumnDef&lt;Row&gt;[]</InlineCode> 声明列，render 里返回任意 JSX（推荐 Cell* 预设）。
          </p>
          <CodeBlock code={CODE_COLUMNS} />
        </SubSection>

        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            下方示例为蓝色主题 + 选中 2 行 + 底部翻页的典型订单表。
          </p>
          <PreviewBlock code={CODE_DATATABLE_USAGE} minHeight={480}>
            <div className="w-full overflow-x-auto">
              <DataTable<OrderRow>
                title="Recent Orders"
                subtitle="Last 30 days"
                badge={<Label color="blue" size="sm" variant="solid">156</Label>}
                color="blue"
                showCheckbox
                checkboxColor="blue"
                selectedRows={new Set([0, 2])}
                headerActions={
                  <Button color="blue" size="md" iconLeft={<AddCircleLinear size={20} color="white" />}>
                    Add Order
                  </Button>
                }
                columns={orderColumns}
                rows={orderRows}
                showPagination
                currentPage={1}
                totalPages={16}
                paginationLabel="Showing 1-3 from 156"
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Colors" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 种主色：<InlineCode>purple</InlineCode>（默认）/ <InlineCode>blue</InlineCode> / <InlineCode>black</InlineCode>，影响 checkbox 与按钮。
          </p>
          <CodeBlock code={CODE_DATATABLE_COLORS} />
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={DATATABLE_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="FullWidthTable"
        description="宽版表格，额外提供 Show N 每页行数选择器，适合全屏数据管理页。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            继承 DataTable 全部能力，新增 <InlineCode>showRowCount</InlineCode> / <InlineCode>rowCountOptions</InlineCode>。
          </p>
          <PreviewBlock code={CODE_FULLWIDTH_USAGE} minHeight={520}>
            <div className="w-full overflow-x-auto">
              <FullWidthTable<OrderRow>
                title="Recent Orders"
                subtitle="Text Here"
                badge={<Label color="green" size="sm" variant="outline">Badge</Label>}
                color="black"
                showCheckbox
                checkboxColor="purple"
                selectedRows={new Set([1])}
                headerActions={
                  <div className="flex items-center gap-3">
                    <ToolbarDatepicker label="Select Dates" />
                    <ToolbarFilterButton label="Filters" />
                    <Button color="black" size="md" iconLeft={<AddCircleLinear size={20} color="white" />}>
                      Button
                    </Button>
                  </div>
                }
                showRowCount
                currentRowCount={10}
                rowCountOptions={[10, 25, 50]}
                showPagination
                currentPage={1}
                totalPages={32}
                paginationLabel="Showing 1-3 from 156"
                columns={orderColumns}
                rows={orderRows}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={FULLWIDTH_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/table" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
