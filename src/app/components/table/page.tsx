"use client";

import type { ReactNode } from "react";
import { asset } from "@/lib/asset";
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
} from "@forge-ui-official/core";
import type {
  ColumnDef,
  StatusBadgeColor,
  ProgressBadgeColor,
  AvatarInitialColor,
} from "@forge-ui-official/core";
import { AddCircleLinear, CheckCircleLinear, CardBold } from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection } from "../_shared";
import { AnatomyLinks } from "../_anatomy-links";
import { ApiBlock, DocExample, ExampleGrid } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";

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
    product: "手工收纳包",
    productSubtitle: "另有 3 件商品",
    image: asset("/images/stat-card.png"),
    customer: "林晓",
    email: "jane@example.com",
    initials: "JC",
    avatarColor: "purple",
    date: "1 分钟前",
    status: "待处理",
    statusColor: "yellow",
    amount: "$121.00",
    trend: "+10%",
    trendColor: "green",
  },
  {
    invoice: "#302011",
    product: "智能手表 E2",
    productSubtitle: "+1 other products",
    image: asset("/images/stat-card.png"),
    customer: "Wade Warren",
    email: "wade@example.com",
    initials: "WW",
    avatarColor: "blue",
    date: "1 分钟前",
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
    image: asset("/images/stat-card.png"),
    customer: "Esther Howard",
    email: "esther@example.com",
    initials: "EH",
    avatarColor: "green",
    date: "5 小时前",
    status: "已完成",
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
    header: "商品",
    sortable: true,
    flex: true,
    render: (row) => <CellImageText src={row.image} title={row.product} subtitle={row.productSubtitle || undefined} />,
  },
  { key: "date", header: "日期", sortable: true, width: "w-32", render: (row) => <CellMuted>{row.date}</CellMuted> },
  {
    key: "customer",
    header: "客户",
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
  { key: "status", header: "状态", width: "w-32", render: (row) => <StatusBadge label={row.status} color={row.statusColor} /> },
  {
    key: "amount",
    header: "金额",
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
} from "@forge-ui-official/core";`;

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

const CODE_REG_TEXT = `<CellText>项目概览</CellText>
<CellMuted>补充说明</CellMuted>
<CellTextSubtitle title="项目概览" subtitle="补充说明" />`;

const CODE_SQUARE_IMG = `<CellImageText src="/img.png" title="项目概览" subtitle="补充说明" />`;

const CODE_CIRCLE_IMG = `<CellImageText
  src="/flag-au.png"
  title="澳大利亚"
  subtitle="ilahmbudi@mail.co..."
  rounded="full"
/>`;

const CODE_USER = `<div className="flex items-center gap-2">
  <Avatar initials="IB" color="blue" size="md" />
  <div className="flex flex-col">
    <span className="text-fg-black text-sm font-semibold">李文</span>
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
    <span className="text-fg-black text-sm font-semibold">项目名称</span>
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

const CODE_LABEL_BADGE = `<StatusBadge label="示例文本" color="purple" />
<StatusBadge label="示例文本" color="blue" />
<StatusBadge label="示例文本" color="yellow" />
<StatusBadge label="示例文本" color="red" />
<StatusBadge label="示例文本" color="cyan" />
<StatusBadge label="示例文本" color="green" />
<StatusBadge label="示例文本" color="grey" />`;

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
<CellLink label="链接" color="green" />
<CellLink label="链接" color="red" />`;

const CODE_RATING = `<CellRating score="5.0" />`;

const CODE_DATATABLE_USAGE = `const [selectedRowKeys, setSelectedRowKeys] = useState<Set<Key>>(new Set());

<DataTable<OrderRow>
  title="近期订单"
  subtitle="最近 30 天"
  color="blue"
  columns={orderColumns}
  rows={orderRows}
  showCheckbox
  getRowKey={(row) => row.invoice}
  selectedRowKeys={selectedRowKeys}
  onSelectedRowKeysChange={setSelectedRowKeys}
  showPagination
  currentPage={1}
  totalPages={16}
  paginationLabel="Showing 1-3 from 156"
/>`;

const CODE_FULLWIDTH_USAGE = `<FullWidthTable<OrderRow>
  title="近期订单"
  color="black"
  showCheckbox
  getRowKey={(row) => row.invoice}
  selectedRowKeys={new Set(["#302011"])}
  showRowCount
  currentRowCount={10}
  totalRows={156}
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
  { attr: "checkboxColor", type: "'purple' | 'blue' | 'green' | 'red' | 'orange' | 'black'", defaultValue: "'black'", description: "勾选框语义色（CheckboxColor）。" },
];

const STATUS_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "—", description: "徽章文字。" },
  { attr: "color", type: "'purple' | 'blue' | 'yellow' | 'cyan' | 'green' | 'red' | 'grey'", defaultValue: "'grey'", description: "语义色。表格里优先用 green / yellow / red / grey。" },
  { attr: "variant", type: "'soft' | 'solid'", defaultValue: "'soft'", description: "soft 是浅底描边，solid 是实心白字胶囊。" },
];

const STATUS_DOT_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "—", description: "状态文字。" },
  { attr: "color", type: "'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'cyan' | 'grey' | 'black'", defaultValue: "'grey'", description: "圆点语义色，8 色。" },
  { attr: "emphasis", type: "'strong' | 'subtle'", defaultValue: "'strong'", description: "文字权重：strong = fg-black semibold，subtle = fg-grey-900 medium。" },
];

const PROGRESS_BAR_PROPS: ApiTableRow[] = [
  { attr: "value", type: "string", defaultValue: "—", description: "左侧主数值（如 $400）。" },
  { attr: "percent", type: "number", defaultValue: "0", description: "0-100 的进度百分比，自动 clamp。" },
  { attr: "color", type: "ProgressBarColor", defaultValue: "'blue'", description: "填充色，7 色。" },
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
  { attr: "iconColor", type: "string", defaultValue: "'var(--fg-grey-700)'", description: "所有 icon 颜色（@forge-ui-official/core/icons 需用 color prop）。" },
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
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'black'", description: "强调色，影响分页当前页。" },
  { attr: "showCheckbox", type: "boolean", defaultValue: "false", description: "是否显示首列勾选框。" },
  { attr: "checkboxColor", type: "CheckboxColor", defaultValue: "'black'", description: "勾选框颜色，默认跟随克制表体，不另开一套强调色。" },
  { attr: "selectedRowKeys", type: "ReadonlySet<Key>", defaultValue: "—", description: "推荐：按稳定业务 key 控制选中状态，排序、过滤和分页后仍对应同一记录。" },
  { attr: "onSelectedRowKeysChange", type: "(keys: Set<Key>) => void", defaultValue: "—", description: "key 模式选择回调；始终返回新 Set，不修改传入集合。" },
  { attr: "selectedRows", type: "Set<number>", defaultValue: "—", description: "兼容旧版的索引集合；新代码优先使用 selectedRowKeys。" },
  { attr: "getRowKey", type: "(row, index) => Key", defaultValue: "index", description: "返回稳定业务 key，同时用于 React 行节点与 key 模式选择。" },
  { attr: "emptyState", type: "ReactNode", defaultValue: "'暂无数据'", description: "rows 为空时的跨列表格内容。" },
  { attr: "sortColumnKey / sortDirection", type: "string / 'asc' | 'desc'", defaultValue: "—", description: "受控排序状态，同时驱动 aria-sort 与箭头方向。" },
  { attr: "headerActions", type: "ReactNode", defaultValue: "—", description: "表头右侧操作区，常放 Datepicker + Button。" },
  { attr: "showPagination", type: "boolean", defaultValue: "false", description: "底部是否显示翻页。" },
  { attr: "currentPage / totalPages", type: "number", defaultValue: "—", description: "当前页与总页数。" },
  { attr: "paginationLabel", type: "string", defaultValue: "—", description: "左下角范围说明文字。" },
  { attr: "tableMinWidth", type: "CSSProperties['minWidth']", defaultValue: "按列数估算", description: "表格内容最小宽度；不传时按列角色估算，超出只在组件内部横向滚动。" },
];

const FULLWIDTH_PROPS: ApiTableRow[] = [
  { attr: "columns / rows", type: "ColumnDef<Row>[] / Row[]", defaultValue: "—", description: "列定义与数据，签名同 DataTable。" },
  { attr: "showRowCount", type: "boolean", defaultValue: "false", description: "是否显示每页数量选择器。" },
  { attr: "currentRowCount", type: "number", defaultValue: "10", description: "每页行数当前值。" },
  { attr: "rowCountOptions", type: "number[]", defaultValue: "[10, 25, 50]", description: "每页行数选项。" },
  { attr: "totalRows", type: "number", defaultValue: "—", description: "精确总记录数；未提供时摘要只显示当前范围，不再猜测总数。" },
  { attr: "showCheckbox / selectedRowKeys", type: "同 DataTable", defaultValue: "—", description: "勾选逻辑；推荐使用稳定 key 模式。" },
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
        title="数据表格"
        hint="按行列展示数据，支持选择、排序、分页和自定义单元格。"
      />

      <AnatomyLinks />

      <Section title="用法" description="从一张带勾选和分页的订单表开始。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <SubSection title="最小示例" stack>
          <DocExample
            id="datatable"
            title="DataTable"
            summary="蓝色订单表，带行选择、表头按钮和底部分页。"
            code={CODE_DATATABLE_USAGE}
            minHeight={480}
          >
            <div className="w-full overflow-x-auto">
              <DataTable<OrderRow>
                title="近期订单"
                subtitle="最近 30 天"
                badge={<Label color="blue" size="sm" variant="solid">156</Label>}
                color="blue"
                showCheckbox
                checkboxColor="blue"
                getRowKey={(row) => row.invoice}
                selectedRowKeys={new Set(["#302012", "#302002"])}
                headerActions={
                  <Button color="blue" size="md" iconLeft={<AddCircleLinear size={20} color="white" />}>
                    新增订单
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
          </DocExample>
        </SubSection>
      </Section>

      <Section title="例子" description="表头、十四种单元格和宽表各留一个。">
        <ExampleGrid>
          <DocExample id="headercell" title="Header Cell" summary="表头同时放勾选框、前置图标、列名和排序。" code={CODE_HEADER_CELL} minHeight={120}>
            <div className="w-56">
              <TableCell
                variant="header"
                checkbox
                leadIcon={<CardBold size={20} color="var(--fg-grey-500)" />}
                sortable
              >
                商品
              </TableCell>
            </div>
          </DocExample>

          <DocExample id="regtext" title="1 · Reg Text" summary="主文本、辅助说明和带副标题的两行文字。" code={CODE_REG_TEXT} minHeight={220}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow><CellText>项目概览</CellText></CellPreviewRow>
              <CellPreviewRow><CellMuted>补充说明</CellMuted></CellPreviewRow>
              <CellPreviewRow><CellTextSubtitle title="项目概览" subtitle="补充说明" /></CellPreviewRow>
            </div>
          </DocExample>

          <DocExample id="squareimg" title="2 · Square Img" summary="方形缩略图配标题和副标题，适合商品和封面。" code={CODE_SQUARE_IMG} minHeight={140}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow>
                <CellImageText src={asset("/images/stat-card.png")} title="手工收纳包" subtitle="另有 3 件商品" />
              </CellPreviewRow>
            </div>
          </DocExample>

          <DocExample id="circleimg" apiId="squareimg" title="3 · Circle Img" summary="圆形缩略图配标题和副标题，适合国旗和头像。" code={CODE_CIRCLE_IMG} minHeight={140}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow>
                <CellImageText src={asset("/images/stat-card.png")} title="澳大利亚" subtitle="ilahmbudi@mail.co..." rounded="full" />
              </CellPreviewRow>
            </div>
          </DocExample>

          <DocExample id="user" apiId="datatable" title="4 · User" summary="头像、姓名和邮箱排成成员列。" code={CODE_USER} minHeight={140}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow>
                <div className="flex items-center gap-2">
                  <Avatar initials="IB" color="blue" size="md" />
                  <div className="flex flex-col">
                    <span className="text-fg-black text-sm font-semibold">李文</span>
                    <span className="text-fg-grey-700 text-xs">ilahmbudi@mail.co...</span>
                  </div>
                </div>
              </CellPreviewRow>
            </div>
          </DocExample>

          <DocExample id="usergroup" title="5 · User Group" summary="重叠头像，末尾用数字标出其余人数。" code={CODE_USER_GROUP} minHeight={140}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow>
                <AvatarGroup overflowCount={24}>
                  <Avatar initials="IB" color="purple" size="sm" />
                  <Avatar initials="WW" color="blue" size="sm" />
                  <Avatar initials="EH" color="green" size="sm" />
                </AvatarGroup>
              </CellPreviewRow>
            </div>
          </DocExample>

          <DocExample id="badge" apiId="datatable" title="6 · Badge (Circle Icon + Text)" summary="圆形图标配分类名称和说明。" code={CODE_BADGE} minHeight={140}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow>
                <div className="flex items-center gap-2">
                  <CircleIcon color="green" size="sm"><CheckCircleLinear size={14} color="var(--fg-green-500)" /></CircleIcon>
                  <div className="flex flex-col">
                    <span className="text-fg-black text-sm font-semibold">项目名称</span>
                    <span className="text-fg-grey-700 text-xs">ilahmbudi@mail.co...</span>
                  </div>
                </div>
              </CellPreviewRow>
            </div>
          </DocExample>

          <DocExample id="files" title="7 · Files" summary="按扩展名显示文件图标、文件名和大小。" code={CODE_FILES} minHeight={220}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow><CellFile name="annual-report.xlsx" size="400 kb" /></CellPreviewRow>
              <CellPreviewRow><CellFile name="deck.pptx" size="400 kb" /></CellPreviewRow>
              <CellPreviewRow><CellFile name="cover.png" /></CellPreviewRow>
            </div>
          </DocExample>

          <DocExample
            id="numbers"
            title="8 · Numbers"
            summary="数值可以带方向箭头或涨跌徽章。"
            code={`${CODE_NUMBERS}\n\n${CODE_PROGRESS_USAGE}`}
            minHeight={260}
          >
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow><CellNumber value="$400" trend="up" /></CellPreviewRow>
              <CellPreviewRow><CellNumber value="$400" badge="+10%" badgeColor="green" /></CellPreviewRow>
              <div className="flex flex-wrap items-center gap-2">
                <ProgressBadge label="+12%" color="green" />
                <ProgressBadge label="-5%" color="red" />
                <ProgressBadge label="0%" color="grey" />
              </div>
            </div>
          </DocExample>

          <DocExample id="label" title="9 · Label Badge" summary="浅底描边的状态标签，实心样式用白字胶囊。" code={CODE_LABEL_BADGE} minHeight={120}>
            <StatusBadge label="示例文本" color="blue" />
          </DocExample>

          <DocExample id="statusdot" title="10 · Status Dot" summary="圆点和文字表示在线、审核这类状态。" code={CODE_STATUS_DOT} minHeight={120}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow><CellStatusDot label="Text" color="blue" /></CellPreviewRow>
            </div>
          </DocExample>

          <DocExample id="progressbar" title="11 · Progress Bar" summary="数值、进度条和百分比放在同一格。" code={CODE_PROGRESS_BAR} minHeight={120}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-sm">
              <CellPreviewRow><CellProgressBar value="$400" percent={45} color="blue" /></CellPreviewRow>
            </div>
          </DocExample>

          <DocExample id="codecell" title="12 · Code" summary="用单行编号显示订单或记录号。" code={CODE_CODE_CELL} minHeight={120}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow><CellCode code="#302012" /></CellPreviewRow>
            </div>
          </DocExample>

          <DocExample id="action" title="13 · Action" summary="图标按钮、更多菜单和行内链接都能放进行末。" code={CODE_ACTION} minHeight={260}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-lg">
              <CellPreviewRow>
                <CellActions actions={["mail", "phone", "chat", "eye", "pen", "trash"]} />
              </CellPreviewRow>
              <CellPreviewRow><CellKebabMenu /></CellPreviewRow>
              <CellPreviewRow>
                <div className="flex items-center gap-3">
                  <CellLink label="链接" color="green" />
                  <CellLink label="链接" color="red" />
                </div>
              </CellPreviewRow>
            </div>
          </DocExample>

          <DocExample id="rating" title="14 · Rating" summary="星星和分值组成评分列。" code={CODE_RATING} minHeight={120}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <CellPreviewRow><CellRating score="5.0" /></CellPreviewRow>
            </div>
          </DocExample>
        </ExampleGrid>

        <DocExample
          id="fullwidthtable"
          title="FullWidthTable"
          summary="宽表在分页旁提供每页行数切换。"
          code={CODE_FULLWIDTH_USAGE}
          minHeight={520}
        >
          <div className="w-full overflow-x-auto">
            <FullWidthTable<OrderRow>
              title="近期订单"
              subtitle="示例文本"
              badge={<Label color="green" size="sm" variant="outline">徽章</Label>}
              color="black"
              showCheckbox
              checkboxColor="purple"
              getRowKey={(row) => row.invoice}
              selectedRowKeys={new Set(["#302011"])}
              headerActions={
                <div className="flex items-center gap-3">
                  <ToolbarDatepicker label="选择日期" />
                  <ToolbarFilterButton label="筛选条件" />
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
              totalRows={156}
              columns={orderColumns}
              rows={orderRows}
            />
          </div>
        </DocExample>
      </Section>

      <Section title="API" description="有独立字段的单元格单独列表。">
        <ApiBlock id="datatable" title="DataTable" rows={DATATABLE_PROPS} />
        <ApiBlock id="fullwidthtable" title="FullWidthTable" rows={FULLWIDTH_PROPS} />
        <ApiBlock id="headercell" title="Header Cell" rows={HEADER_CELL_PROPS} />
        <ApiBlock id="regtext" title="1 · Reg Text" rows={REGTEXT_PROPS} />
        <ApiBlock id="squareimg" title="方形与圆形缩略图" rows={IMAGETEXT_PROPS} />
        <ApiBlock id="usergroup" title="5 · User Group" rows={USERGROUP_PROPS} />
        <ApiBlock id="files" title="7 · Files" rows={FILE_PROPS} />
        <ApiBlock id="numbers" title="8 · Numbers" rows={NUMBER_PROPS} />
        <ApiBlock id="progressbadge" title="涨跌徽章（ProgressBadge）" rows={PROGRESS_PROPS} />
        <ApiBlock id="label" title="9 · Label Badge" rows={STATUS_PROPS} />
        <ApiBlock id="statusdot" title="10 · Status Dot" rows={STATUS_DOT_PROPS} />
        <ApiBlock id="progressbar" title="11 · Progress Bar" rows={PROGRESS_BAR_PROPS} />
        <ApiBlock id="codecell" title="12 · Code" rows={CODE_CELL_PROPS} />
        <ApiBlock id="action" title="13 · Action" rows={ACTIONS_PROPS} />
        <ApiBlock id="rating" title="14 · Rating" rows={RATING_PROPS} />
      </Section>
    </div>
  );
}
