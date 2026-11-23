"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Cascader,
  CopyButton,
  DateTimePicker,
  PeriodPicker,
  TreeSelect,
  Descriptions,
  EmptyState,
  Kbd,
  LoadingOverlay,
  Popconfirm,
  Result,
  Separator,
  Skeleton,
  Spinner,
  Splitter,
  Tag,
  TagInput,
  TimePicker,
  Timeline,
  Transfer,
  Tree,
  type TreeNode,
} from "@forge-ui-official/core";
import { FolderLinear, UsersGroupRoundedLinear } from "@forge-ui-official/core/icons";
import { Section } from "./_shared";
import { ApiBlock, DocExample, ExampleGrid } from "./_doc-blocks";
import type { ApiTableRow } from "./_api-table";

// Admin kit examples, shared by the feedback, other-widget, menu and input-field pages.

const row = (attr: string, type: string, defaultValue: string, description: string): ApiTableRow => ({ attr, type, defaultValue, description });

// ── Feedback ────────────────────────────────────────────────

const CODE_ALERT = `<Alert tone="warning" title="套餐即将到期" action={<Button size="sm" variant="secondary">续费</Button>} closable>
  还剩 3 天，到期后成员将无法上传文件。
</Alert>
<Alert tone="success">已保存</Alert>
<Alert tone="error" title="导入失败">第 12 行缺少手机号。</Alert>`;
const CODE_LOADING = `<Spinner label="正在加载" />
<Skeleton shape="circle" />
<Skeleton lines={3} />
<LoadingOverlay loading={refreshing} label="刷新中">{table}</LoadingOverlay>`;
const CODE_EMPTY = `<EmptyState
  title="还没有客户"
  description="导入表格或手动新建第一位客户。"
  action={<Button size="sm">新建客户</Button>}
/>`;
const CODE_RESULT = `<Result
  status="success"
  title="提交成功"
  description="审批单已发给财务，预计 1 个工作日内处理。"
  actions={<><Button size="sm">查看审批单</Button><Button size="sm" variant="secondary">返回列表</Button></>}
/>`;

export function FeedbackKitExamples() {
  const [refreshing, setRefreshing] = useState(false);
  return (
    <>
      <Section title="页面反馈" description="提示条、加载、空状态和结果页。">
        <ExampleGrid>
          <DocExample id="alert" title="Alert" summary="页面或区块内的提示：说明、成功、警告、错误。可带操作和关闭。" code={CODE_ALERT} minHeight={260}>
            <div className="flex w-full flex-col gap-3">
              <Alert tone="warning" title="套餐即将到期" action={<Button size="sm" variant="secondary" color="grey">续费</Button>} closable>还剩 3 天，到期后成员将无法上传文件。</Alert>
              <Alert tone="success">已保存</Alert>
              <Alert tone="error" title="导入失败">第 12 行缺少手机号。</Alert>
            </div>
          </DocExample>
          <DocExample id="spinner" title="Spinner · Skeleton · LoadingOverlay" summary="加载中：转圈、占位骨架，或盖在已有内容上。" code={CODE_LOADING} minHeight={260}>
            <div className="flex w-full flex-col gap-4">
              <div className="flex items-center gap-4"><Spinner size="sm" /><Spinner /><Spinner size="lg" /><Spinner label="正在加载" /></div>
              <div className="flex items-center gap-3"><Skeleton shape="circle" /><Skeleton lines={2} /></div>
              <LoadingOverlay loading={refreshing} label="刷新中" className="rounded-2xl">
                <div className="flex items-center justify-between rounded-2xl bg-fg-grey-50 p-4 text-sm text-fg-grey-900">
                  本月订单 128 笔
                  <Button size="sm" variant="secondary" color="grey" onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1500); }}>刷新</Button>
                </div>
              </LoadingOverlay>
            </div>
          </DocExample>
          <DocExample id="emptystate" title="EmptyState" summary="列表为空时说明原因并给出下一步。" code={CODE_EMPTY} minHeight={260}>
            <EmptyState title="还没有客户" description="导入表格或手动新建第一位客户。" action={<Button size="sm">新建客户</Button>} />
          </DocExample>
          <DocExample id="result" title="Result" summary="流程结束或整页状态：成功、失败、无权限、找不到。" code={CODE_RESULT} minHeight={260}>
            <Result status="success" title="提交成功" description="审批单已发给财务，预计 1 个工作日内处理。" actions={<><Button size="sm">查看审批单</Button><Button size="sm" variant="secondary" color="grey">返回列表</Button></>} className="py-6" />
          </DocExample>
        </ExampleGrid>
      </Section>
      <Section title="页面反馈 API">
        <ApiBlock id="alert" title="Alert" rows={[
          row("tone", "'info' | 'success' | 'warning' | 'error'", "'info'", "语气和颜色；警告和错误会被读屏立即播报。"),
          row("title / children", "ReactNode", "—", "标题和正文。"),
          row("action", "ReactNode", "—", "右侧操作，窄屏换到下方。"),
          row("closable / onClose", "boolean / () => void", "false", "显示关闭按钮；不传 onClose 时自己隐藏。"),
          row("banner", "boolean", "false", "去掉圆角，贴在页面或卡片顶部。"),
          row("icon", "ReactNode | null", "按语气", "换图标；null 不显示。"),
        ]} />
        <ApiBlock id="spinner" title="Spinner" rows={[
          row("size", "'sm' | 'md' | 'lg'", "'md'", "尺寸。"),
          row("label", "string", "—", "旁边的文字，同时让读屏播报。"),
        ]} />
        <ApiBlock id="skeleton" title="Skeleton" rows={[
          row("shape", "'text' | 'circle' | 'rect'", "'text'", "文字行、头像圆形或矩形块。"),
          row("lines", "number", "1", "文字行数，最后一行较短。"),
          row("width / height", "number | string", "—", "尺寸。"),
        ]} />
        <ApiBlock id="loadingoverlay" title="LoadingOverlay" rows={[
          row("loading", "boolean", "—", "是否盖上加载层，内容保持可见。"),
          row("label", "string", "—", "加载文字。"),
        ]} />
        <ApiBlock id="emptystate" title="EmptyState" rows={[
          row("title / description", "ReactNode", "—", "为什么是空的。"),
          row("action", "ReactNode", "—", "下一步操作。"),
          row("icon", "ReactNode", "收件箱", "换插图。"),
          row("size", "'default' | 'compact'", "'default'", "compact 用在表格和卡片里。"),
        ]} />
        <ApiBlock id="result" title="Result" rows={[
          row("status", "'success' | 'error' | 'warning' | 'info' | '403' | '404'", "—", "结果类型。"),
          row("title / description", "ReactNode", "—", "结果和说明。"),
          row("actions", "ReactNode", "—", "按钮。"),
          row("children", "ReactNode", "—", "补充信息，例如错误明细。"),
        ]} />
      </Section>
    </>
  );
}

// ── Data display ────────────────────────────────────────────

const org: TreeNode[] = [
  { id: "hq", label: "总部", icon: <FolderLinear size={16} />, meta: 42, children: [
    { id: "rd", label: "研发中心", icon: <UsersGroupRoundedLinear size={16} />, meta: 24, children: [
      { id: "fe", label: "前端组", meta: 8 },
      { id: "be", label: "后端组", meta: 12 },
      { id: "qa", label: "测试组", meta: 4 },
    ] },
    { id: "ops", label: "运营部", icon: <UsersGroupRoundedLinear size={16} />, meta: 10 },
    { id: "fin", label: "财务部", icon: <UsersGroupRoundedLinear size={16} />, meta: 8, disabled: true },
  ] },
];

const CODE_DESCRIPTIONS = `<Descriptions title="订单信息" variant="bordered" columns={2} items={[
  { label: "订单号", value: <>SO-20261123-0042 <CopyButton value="SO-20261123-0042" /></> },
  { label: "状态", value: <StatusBadge label="待发货" color="yellow" /> },
  { label: "客户", value: "杭州云栖科技" },
  { label: "金额", value: "¥ 12,800.00" },
  { label: "备注", value: "周五前发货", span: 2 },
]} />`;
const CODE_TIMELINE = `<Timeline
  items={[
    { title: "提交申请", time: "11-20 09:12", description: "张三", tone: "success" },
    { title: "部门审批通过", time: "11-20 14:30", description: "李四", tone: "success" },
    { title: "财务退回", time: "11-21 10:05", description: "发票抬头有误", tone: "error" },
  ]}
  pending="等待重新提交"
/>`;
const CODE_TREE = `<Tree ariaLabel="组织架构" nodes={org} defaultExpandedIds={["hq", "rd"]} selectedId={selected} onSelect={setSelected} />
<Tree ariaLabel="可见范围" nodes={org} checkable checkedIds={checked} onCheckedChange={setChecked} />`;
const CODE_TAGS = `<Tag color="blue">华东区</Tag>
<Tag color="green" onRemove={remove}>已签约</Tag>
<Kbd keys={["⌘", "K"]} />
<Separator label="或" />`;
const CODE_SPLITTER = `<Splitter defaultSize={40} min={25} max={70}>
  {[<CustomerList key="list" />, <CustomerDetail key="detail" />]}
</Splitter>`;

export function DataDisplayKitExamples() {
  const [selected, setSelected] = useState<string | null>("fe");
  const [checked, setChecked] = useState<string[]>(["fe", "be"]);
  const [tags, setTags] = useState(["华东区", "重点客户", "已签约"]);
  return (
    <>
      <Section title="详情与结构" description="详情字段、时间线、树、标签、快捷键、分割线和可拖拽分栏。">
        <ExampleGrid>
          <DocExample id="descriptions" title="Descriptions" summary="一条记录的字段：订单、客户、成员。" code={CODE_DESCRIPTIONS} minHeight={280}>
            <Descriptions title="订单信息" variant="bordered" columns={2} items={[
              { label: "订单号", value: <span className="inline-flex items-center gap-1">SO-20261123-0042<CopyButton value="SO-20261123-0042" /></span> },
              { label: "状态", value: "待发货" },
              { label: "客户", value: "杭州云栖科技" },
              { label: "金额", value: "¥ 12,800.00" },
              { label: "备注", value: "周五前发货", span: 2 },
            ]} />
          </DocExample>
          <DocExample id="timeline" title="Timeline" summary="审批流、订单进度、操作日志。" code={CODE_TIMELINE} minHeight={280}>
            <Timeline items={[
              { title: "提交申请", time: "11-20 09:12", description: "张三", tone: "success" },
              { title: "部门审批通过", time: "11-20 14:30", description: "李四", tone: "success" },
              { title: "财务退回", time: "11-21 10:05", description: "发票抬头有误", tone: "error" },
            ]} pending="等待重新提交" />
          </DocExample>
          <DocExample id="tree" title="Tree" summary="部门、分类、权限。方向键展开收起，可勾选，父级显示部分选中。" code={CODE_TREE} minHeight={320}>
            <div className="flex w-full flex-col gap-4">
              <Tree ariaLabel="组织架构" nodes={org} defaultExpandedIds={["hq", "rd"]} selectedId={selected} onSelect={id => setSelected(id)} />
              <Tree ariaLabel="可见范围" nodes={org} checkable defaultExpandedIds={["hq", "rd"]} checkedIds={checked} onCheckedChange={setChecked} />
            </div>
          </DocExample>
          <DocExample id="tag" title="Tag · Kbd · Separator · CopyButton" summary="分类标签、可移除的筛选条件、快捷键提示、分割线、复制。" code={CODE_TAGS} minHeight={280}>
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Tag color="blue">华东区</Tag><Tag color="violet">VIP</Tag><Tag color="yellow">待跟进</Tag><Tag color="red">逾期</Tag><Tag>草稿</Tag>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => <Tag key={tag} color="green" onRemove={() => setTags(tags.filter(item => item !== tag))}>{tag}</Tag>)}
              </div>
              <Separator label="或" />
              <div className="flex items-center justify-between text-sm text-fg-grey-700">
                <span className="inline-flex items-center gap-2">搜索 <Kbd keys={["⌘", "K"]} /></span>
                <CopyButton value="sk-forge-demo-key" label="复制密钥" />
              </div>
            </div>
          </DocExample>
          <DocExample id="splitter" title="Splitter" summary="左右或上下两栏，拖动或用方向键调整，双击还原。" code={CODE_SPLITTER} minHeight={240}>
            <div className="h-48 w-full overflow-hidden rounded-2xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
              <Splitter defaultSize={45} min={30} max={70}>
                {[
                  <ul key="list" className="flex flex-col gap-1 p-3 text-sm">{["杭州云栖科技", "宁波海纳贸易", "苏州青禾医疗"].map((name, index) => <li key={name} className={index === 0 ? "truncate rounded-lg bg-fg-grey-100 px-3 py-2 font-medium" : "truncate px-3 py-2 text-fg-grey-700"}>{name}</li>)}</ul>,
                  <div key="detail" className="flex flex-col gap-1 p-4 text-sm"><span className="font-semibold text-fg-black">杭州云栖科技</span><span className="text-fg-grey-700">年度合同 · 12 个席位</span></div>,
                ]}
              </Splitter>
            </div>
          </DocExample>
        </ExampleGrid>
      </Section>
      <Section title="详情与结构 API">
        <ApiBlock id="descriptions" title="Descriptions" rows={[
          row("items", "{ label, value, span? }[]", "—", "字段；空值显示「—」。"),
          row("title / extra", "ReactNode", "—", "标题和右侧操作。"),
          row("columns", "1 | 2 | 3 | 4", "3", "宽屏列数，手机上一列。"),
          row("variant", "'plain' | 'bordered'", "'plain'", "bordered 是带底色标签的表格样式。"),
          row("layout", "'vertical' | 'horizontal'", "'vertical'", "标签在上或在左。"),
        ]} />
        <ApiBlock id="timeline" title="Timeline" rows={[
          row("items", "{ title, time?, description?, tone?, icon? }[]", "—", "事件；tone 为 default / accent / success / warning / error。"),
          row("pending", "ReactNode", "—", "最后一个还没发生的步骤。"),
        ]} />
        <ApiBlock id="tree" title="Tree" rows={[
          row("nodes", "TreeNode[]", "—", "{ id, label, icon?, meta?, children?, disabled? }。"),
          row("ariaLabel", "string", "—", "树的名称。"),
          row("expandedIds / defaultExpandedIds / onExpandedChange", "string[]", "[]", "展开的节点。"),
          row("selectedId / onSelect", "string / (id, node) => void", "—", "单选。"),
          row("checkable / checkedIds / onCheckedChange", "boolean / string[]", "false", "勾选；勾父级会勾上所有可用子级，返回的 id 包含全选的父级。"),
        ]} />
        <ApiBlock id="tag" title="Tag" rows={[
          row("color", "'grey' | 'blue' | 'green' | 'yellow' | 'red' | 'violet'", "'grey'", "颜色。记录状态请用 StatusBadge。"),
          row("onRemove", "() => void", "—", "显示移除按钮。"),
          row("icon / size", "ReactNode / 'sm' | 'md'", "— / 'md'", "图标和尺寸。"),
        ]} />
        <ApiBlock id="kbd" title="Kbd" rows={[row("keys", "string[]", "—", "按键，每个一格。")]} />
        <ApiBlock id="separator" title="Separator" rows={[
          row("orientation", "'horizontal' | 'vertical'", "'horizontal'", "方向。"),
          row("label", "ReactNode", "—", "居中的分段文字。"),
        ]} />
        <ApiBlock id="copybutton" title="CopyButton" rows={[
          row("value", "string", "—", "要复制的内容。"),
          row("label / copiedLabel", "string", "— / '已复制'", "按钮文字；不传 label 时只显示图标。"),
          row("onCopy", "(value) => void", "—", "复制后回调。"),
        ]} />
        <ApiBlock id="splitter" title="Splitter" rows={[
          row("children", "[ReactNode, ReactNode]", "—", "两个面板。"),
          row("orientation", "'horizontal' | 'vertical'", "'horizontal'", "左右或上下。"),
          row("size / defaultSize / onSizeChange", "number", "50", "第一栏占比（%）。"),
          row("min / max", "number", "15 / 85", "占比范围。"),
        ]} />
      </Section>
    </>
  );
}

// ── Popconfirm ──────────────────────────────────────────────

const CODE_POPCONFIRM = `<Popconfirm
  tone="danger"
  title="删除这位成员？"
  description="TA 的待办会转给你。"
  confirmLabel="删除"
  onConfirm={() => api.removeMember(id)}
  trigger={<Button size="sm" variant="secondary" color="red">删除</Button>}
/>`;

export function PopconfirmExample() {
  const [log, setLog] = useState("还没有操作");
  return (
    <DocExample id="popconfirm" title="Popconfirm" summary="行内的轻量确认，例如删除一行。焦点先落在「取消」；异步确认时按钮转圈，完成后关闭。" code={CODE_POPCONFIRM} minHeight={220}>
      <div className="flex flex-col items-start gap-3">
        <Popconfirm
          tone="danger"
          title="删除这位成员？"
          description="TA 的待办会转给你。"
          confirmLabel="删除"
          onConfirm={() => new Promise(resolve => setTimeout(resolve, 800)).then(() => setLog("已删除"))}
          onCancel={() => setLog("已取消")}
          trigger={<Button size="sm" variant="secondary" color="red">删除</Button>}
        />
        <span className="text-sm text-fg-grey-700">{log}</span>
      </div>
    </DocExample>
  );
}

export const POPCONFIRM_PROPS: ApiTableRow[] = [
  row("trigger", "ReactElement", "—", "触发按钮。"),
  row("title / description", "ReactNode", "—", "问题和后果。"),
  row("onConfirm", "() => void | Promise", "—", "确认；返回 Promise 时等待完成再关闭。"),
  row("onCancel", "() => void", "—", "取消或点外面关闭。"),
  row("tone", "'default' | 'danger'", "'default'", "danger 用红色确认按钮。"),
  row("confirmLabel / cancelLabel", "string", "'确定' / '取消'", "按钮文字。"),
  row("side / align", "string", "'top' / 'center'", "弹出位置。"),
];

// ── Form inputs ─────────────────────────────────────────────

const regions = [
  { value: "zj", label: "浙江", children: [
    { value: "hz", label: "杭州", children: [{ value: "xh", label: "西湖区" }, { value: "bj", label: "滨江区" }, { value: "yh", label: "余杭区" }] },
    { value: "nb", label: "宁波", children: [{ value: "hs", label: "海曙区" }, { value: "yz", label: "鄞州区" }] },
  ] },
  { value: "js", label: "江苏", children: [
    { value: "nj", label: "南京", children: [{ value: "xw", label: "玄武区" }, { value: "gl", label: "鼓楼区" }] },
    { value: "sz", label: "苏州", children: [{ value: "gs", label: "姑苏区" }, { value: "wz", label: "吴中区" }] },
  ] },
  { value: "sh", label: "上海", children: [{ value: "pd", label: "浦东新区" }, { value: "xh2", label: "徐汇区" }] },
];

const permissions = [
  { value: "order.read", label: "查看订单", description: "订单列表和详情" },
  { value: "order.edit", label: "编辑订单" },
  { value: "order.refund", label: "发起退款", description: "需要财务复核" },
  { value: "customer.read", label: "查看客户" },
  { value: "customer.export", label: "导出客户" },
  { value: "billing.manage", label: "管理账单", disabled: true },
];

const CODE_CASCADER = `<Cascader label="所在地区" options={regions} value={region} onChange={setRegion} />`;
const CODE_TIMEPICKER = `<TimePicker label="每日提醒" value={time} onChange={setTime} step={5} />`;
const CODE_TAGINPUT = `<TagInput
  label="抄送"
  value={emails}
  onChange={setEmails}
  validate={value => /@/.test(value) ? null : "请输入邮箱地址"}
/>`;
const CODE_TRANSFER = `<Transfer items={permissions} value={granted} onChange={setGranted} titles={["可分配权限", "已分配"]} />`;

const departments: TreeNode[] = [
  { id: "hq", label: "总部", children: [
    { id: "rd", label: "研发中心", children: [{ id: "fe", label: "前端组" }, { id: "be", label: "后端组" }, { id: "qa", label: "测试组" }] },
    { id: "ops", label: "运营部" },
    { id: "fin", label: "财务部" },
  ] },
  { id: "east", label: "华东分公司", children: [{ id: "hz-sales", label: "杭州销售部" }, { id: "nb-sales", label: "宁波销售部" }] },
];

const CODE_DATETIME = `<DateTimePicker label="上线时间" value={launch} onChange={setLaunch} step={5} />`;
const CODE_PERIOD = `<PeriodPicker label="账期" granularity="month" value={month} onChange={setMonth} />
<PeriodPicker label="考核季度" granularity="quarter" value={quarter} onChange={setQuarter} />
<PeriodPicker label="预算年度" granularity="year" value={year} onChange={setYear} />`;
const CODE_TREESELECT = `<TreeSelect label="所属部门" nodes={departments} value={dept} onChange={setDept} />
<TreeSelect label="可见范围" multiple nodes={departments} value={scope} onChange={setScope} />`;

export function FormKitExamples() {
  const [launch, setLaunch] = useState<Date | null>(new Date(2026, 10, 28, 20, 0));
  const [month, setMonth] = useState<Date | null>(new Date(2026, 10, 1));
  const [quarter, setQuarter] = useState<Date | null>(new Date(2026, 9, 1));
  const [year, setYear] = useState<Date | null>(new Date(2026, 0, 1));
  const [dept, setDept] = useState<string | null>("fe");
  const [scope, setScope] = useState<string[]>(["rd", "fe", "be", "qa", "ops"]);
  const [region, setRegion] = useState(["zj", "hz", "xh"]);
  const [time, setTime] = useState("09:30");
  const [emails, setEmails] = useState(["ops@forge.dev"]);
  const [granted, setGranted] = useState(["order.read", "customer.read"]);
  return (
    <>
      <Section title="更多选择" description="级联、时间、日期时间、期间、树形选择、多值输入和穿梭框。">
        <ExampleGrid>
          <DocExample id="cascader" title="Cascader" summary="逐级选择：省市区、类目。" code={CODE_CASCADER} minHeight={200}>
            <Cascader label="所在地区" options={regions} value={region} onChange={setRegion} />
          </DocExample>
          <DocExample id="timepicker" title="TimePicker" summary="时、分（可选秒）分列滚动选择，支持步长。" code={CODE_TIMEPICKER} minHeight={200}>
            <TimePicker label="每日提醒" value={time} onChange={setTime} step={5} />
          </DocExample>
          <DocExample id="taginput" title="TagInput" summary="自由输入多个值，回车或逗号确认，可粘贴一串。" code={CODE_TAGINPUT} minHeight={200}>
            <TagInput label="抄送" value={emails} onChange={setEmails} validate={value => (/@/.test(value) ? null : "请输入邮箱地址")} />
          </DocExample>
          <DocExample id="datetimepicker" title="DateTimePicker" summary="日期和时间一次选完。" code={CODE_DATETIME} minHeight={200}>
            <DateTimePicker label="上线时间" value={launch} onChange={setLaunch} step={5} />
          </DocExample>
          <DocExample id="periodpicker" title="PeriodPicker" summary="按月、季度或年份选择，适合账期、考核和预算。" code={CODE_PERIOD} minHeight={300}>
            <div className="flex w-full flex-col gap-4">
              <PeriodPicker label="账期" granularity="month" value={month} onChange={setMonth} />
              <PeriodPicker label="考核季度" granularity="quarter" value={quarter} onChange={setQuarter} />
              <PeriodPicker label="预算年度" granularity="year" value={year} onChange={setYear} />
            </div>
          </DocExample>
          <DocExample id="treeselect" title="TreeSelect" summary="在下拉里选树上的节点；多选时勾父级等于整枝。" code={CODE_TREESELECT} minHeight={240}>
            <div className="flex w-full flex-col gap-4">
              <TreeSelect label="所属部门" nodes={departments} value={dept} onChange={setDept} />
              <TreeSelect label="可见范围" multiple nodes={departments} value={scope} onChange={setScope} />
            </div>
          </DocExample>
          <div style={{ gridColumn: "1 / -1" }}>
          <DocExample id="transfer" title="Transfer" summary="在两列之间移动，例如分配权限。" code={CODE_TRANSFER} minHeight={360}>
            <Transfer items={permissions} value={granted} onChange={setGranted} titles={["可分配权限", "已分配"]} />
          </DocExample>
          </div>
        </ExampleGrid>
      </Section>
      <Section title="更多选择 API">
        <ApiBlock id="cascader" title="Cascader" rows={[
          row("options", "{ value, label, children?, disabled? }[]", "—", "层级选项。"),
          row("value / defaultValue / onChange", "string[] / (path, options) => void", "[]", "从顶层到所选项的值路径。"),
          row("changeOnSelect", "boolean", "false", "允许选中中间层级。"),
          row("label / placeholder / separator", "string", "— / '请选择' / ' / '", "文字。"),
          row("clearable / disabled / errorMessage / name", "—", "true / false / — / —", "与其它输入框一致。"),
        ]} />
        <ApiBlock id="timepicker" title="TimePicker" rows={[
          row("value / defaultValue / onChange", "string", "—", "'HH:mm' 或 'HH:mm:ss'。"),
          row("withSeconds", "boolean", "false", "显示秒。"),
          row("step", "number", "1", "分、秒的步长。"),
          row("label / placeholder / clearable / disabled / errorMessage / name", "—", "—", "与其它输入框一致。"),
        ]} />
        <ApiBlock id="taginput" title="TagInput" rows={[
          row("value / defaultValue / onChange", "string[]", "[]", "已添加的值。"),
          row("validate", "(tag) => string | null", "—", "返回错误文字时拒绝添加。"),
          row("max", "number", "—", "最多个数。"),
          row("separators", "string[]", "[',', '，']", "除回车外确认输入的按键。"),
          row("label / placeholder / disabled / errorMessage / name", "—", "—", "与其它输入框一致；name 为每个值提交一项。"),
        ]} />
        <ApiBlock id="datetimepicker" title="DateTimePicker" rows={[
          row("value / defaultValue / onChange", "Date | null", "null", "日期时间。"),
          row("withSeconds / step", "boolean / number", "false / 1", "是否选秒、分秒步长。"),
          row("minDate / maxDate", "Date", "—", "可选范围。"),
          row("label / placeholder / clearable / disabled / errorMessage / name", "—", "—", "与其它输入框一致；name 提交 YYYY-MM-DDTHH:mm。"),
        ]} />
        <ApiBlock id="periodpicker" title="PeriodPicker" rows={[
          row("granularity", "'month' | 'quarter' | 'year'", "—", "按月、季度或年。"),
          row("value / defaultValue / onChange", "Date | null", "null", "所选期间的第一天，例如第 4 季度是 10 月 1 日。"),
          row("minDate / maxDate", "Date", "—", "超出范围的格子不可选。"),
          row("label / placeholder / clearable / disabled / errorMessage / name", "—", "—", "与其它输入框一致；name 提交 YYYY-MM、YYYY-Qn 或 YYYY。"),
        ]} />
        <ApiBlock id="treeselect" title="TreeSelect" rows={[
          row("nodes", "TreeNode[]", "—", "与 Tree 相同的节点结构。"),
          row("multiple", "boolean", "false", "多选：勾父级等于选中整枝，已选显示为标签。"),
          row("value / defaultValue / onChange", "string | null 或 string[]", "—", "单选是节点 id，多选是 id 数组（包含整枝勾选的父级）。"),
          row("searchable", "boolean", "true", "顶部搜索，匹配项的上级自动展开。"),
          row("label / placeholder / clearable / disabled / errorMessage / name", "—", "—", "与其它输入框一致。"),
        ]} />
        <ApiBlock id="transfer" title="Transfer" rows={[
          row("items", "{ value, label, description?, disabled? }[]", "—", "全部条目。"),
          row("value / defaultValue / onChange", "string[]", "[]", "右侧已选的值。"),
          row("titles", "[ReactNode, ReactNode]", "['可选', '已选']", "两列标题。"),
          row("searchable", "boolean", "true", "每列带搜索。"),
        ]} />
      </Section>
    </>
  );
}
