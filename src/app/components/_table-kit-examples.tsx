"use client";

import { useMemo, useState, type Key } from "react";
import { Button, DataTable, StatusBadge, type ColumnDef } from "@aideui/core";
import { Section } from "./_shared";
import { ApiBlock, DocExample } from "./_doc-blocks";
import type { ApiTableRow } from "./_api-table";

type Order = { id: string; customer: string; region: string; owner: string; amount: number; status: "paid" | "pending" | "refund"; items?: Order[] };

const regions = ["华东", "华南", "华北", "西南"];
const owners = ["陈思远", "许知夏", "林墨", "周一鸣"];
const statuses: Order["status"][] = ["paid", "pending", "refund"];
const makeOrders = (count: number): Order[] => Array.from({ length: count }, (_, index) => ({
  id: `SO-${String(2026110000 + index)}`,
  customer: ["杭州云栖科技", "宁波海纳贸易", "苏州青禾医疗", "成都远山物流", "深圳星河电子"][index % 5],
  region: regions[index % 4],
  owner: owners[index % 4],
  amount: 1200 + ((index * 7919) % 48000),
  status: statuses[index % 3],
  items: index % 4 === 0 ? [
    { id: `SO-${2026110000 + index}-1`, customer: "子单 · 设备", region: regions[index % 4], owner: owners[index % 4], amount: 800, status: "paid" },
    { id: `SO-${2026110000 + index}-2`, customer: "子单 · 服务", region: regions[index % 4], owner: owners[index % 4], amount: 400, status: "pending" },
  ] : undefined,
}));
const statusBadge = { paid: <StatusBadge label="已付款" color="green" />, pending: <StatusBadge label="待付款" color="yellow" />, refund: <StatusBadge label="已退款" color="grey" /> };

const CODE_TABLE = `<DataTable
  title="订单"
  columns={columns}          // 列上可加 pinned / resizable / edit / hideable
  rows={pageRows}
  getRowKey={row => row.id}
  getRowChildren={row => row.items}       // 树形行
  showCheckbox selectedRowKeys={selected} onSelectedRowKeysChange={setSelected}
  bulkActions={keys => <Button size="sm">导出 {keys.size} 条</Button>}
  columnSettings
  loading={loading}
  maxHeight={420}                         // 表头固定
  showPagination currentPage={page} totalPages={pages} onPageChange={setPage}
  pageSize={size} pageSizeOptions={[10, 20, 50]} onPageSizeChange={setSize}
  showQuickJumper
/>`;

const CODE_VIRTUAL = `<DataTable columns={columns} rows={tenThousandRows} getRowKey={row => row.id}
  maxHeight={360} virtualized={{ rowHeight: 53 }} />`;

const row = (attr: string, type: string, defaultValue: string, description: string): ApiTableRow => ({ attr, type, defaultValue, description });

export function TableKitExamples() {
  const [orders, setOrders] = useState(() => makeOrders(57));
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [selected, setSelected] = useState<Set<Key>>(new Set());
  const [loading, setLoading] = useState(false);
  const big = useMemo(() => makeOrders(10000), []);
  const pages = Math.max(1, Math.ceil(orders.length / size));
  const pageRows = orders.slice((page - 1) * size, page * size);

  const columns: ColumnDef<Order>[] = [
    { key: "id", header: "订单号", pinned: "left", hideable: false, minWidth: 200, width: "w-[200px]", render: order => <span className="whitespace-nowrap font-medium text-fg-black">{order.id}</span> },
    { key: "customer", header: "客户", minWidth: 180, resizable: true, render: order => order.customer },
    { key: "region", header: "区域", render: order => order.region },
    { key: "owner", header: "负责人", render: order => order.owner },
    { key: "amount", header: "金额（元）", valueKind: "number", resizable: true, render: order => order.amount.toLocaleString("zh-CN"),
      edit: { value: order => order.amount, type: "number", validate: value => (Number(value) > 0 ? null : "金额要大于 0"), onSave: (order, value) => setOrders(list => list.map(item => item.id === order.id ? { ...item, amount: Number(value) } : item)) } },
    { key: "status", header: "状态", render: order => statusBadge[order.status] },
    { key: "actions", header: "", pinned: "right", hideable: false, render: () => <Button size="sm" variant="tertiary" color="grey">查看</Button> },
  ];

  return (
    <>
      <Section title="后台表格能力" description="加载、固定表头和列、列宽拖拽、树形行、展开行、列设置、批量操作、每页条数、跳页、行内编辑和大数据量虚拟滚动，都在 DataTable 上按需打开。">
        <DocExample id="datatable-admin" apiId="datatable-admin" title="DataTable · 完整后台列表" summary="勾选几行会出现批量操作条；点金额可直接改；首列和操作列在横向滚动时固定；有子单的订单可展开。" code={CODE_TABLE} minHeight={560}>
          <div className="flex w-full flex-col gap-3">
            <div className="flex justify-end"><Button size="sm" variant="secondary" color="grey" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1200); }}>模拟刷新</Button></div>
            <DataTable
              title="订单"
              subtitle={`共 ${orders.length} 笔`}
              columns={columns}
              rows={pageRows}
              getRowKey={order => order.id}
              getRowChildren={order => order.items}
              showCheckbox
              selectedRowKeys={selected}
              onSelectedRowKeysChange={setSelected}
              bulkActions={keys => <><Button size="sm" variant="secondary" color="grey">导出 {keys.size} 条</Button><Button size="sm" variant="secondary" color="red">批量作废</Button></>}
              columnSettings
              loading={loading}
              maxHeight={420}
              tableMinWidth={1100}
              showPagination
              currentPage={page}
              totalPages={pages}
              onPageChange={setPage}
              pageSize={size}
              pageSizeOptions={[10, 20, 50]}
              onPageSizeChange={next => { setSize(next); setPage(1); }}
              showQuickJumper
              paginationLabel={`第 ${(page - 1) * size + 1}-${Math.min(page * size, orders.length)} 条，共 ${orders.length} 条`}
            />
          </div>
        </DocExample>
        <DocExample id="datatable-virtual" apiId="datatable-admin" title="DataTable · 一万行虚拟滚动" summary="只渲染可见的几十行，滚动依然顺滑。需要 maxHeight 和固定行高。" code={CODE_VIRTUAL} minHeight={420}>
          <DataTable columns={columns.filter(column => !column.edit && column.key !== "actions")} rows={big} getRowKey={order => order.id} maxHeight={360} virtualized={{ rowHeight: 53 }} tableMinWidth={900} />
        </DocExample>
      </Section>
      <Section title="后台表格 API">
        <ApiBlock id="datatable-admin" title="DataTable" rows={[
          row("loading", "boolean", "false", "没有数据时显示骨架行，有数据时在上面盖加载层。"),
          row("maxHeight", "number | string", "—", "表体最大高度，超出后滚动，表头固定。"),
          row("columns[].pinned", "'left' | 'right'", "—", "横向滚动时固定在左侧或右侧。"),
          row("columns[].resizable", "boolean", "false", "拖动表头右边缘调列宽，双击还原；也可聚焦后用左右方向键。"),
          row("columns[].hideable", "boolean", "true", "设为 false 不出现在列设置里。"),
          row("columns[].edit", "{ value, onSave, type?, validate? }", "—", "行内编辑：点击或回车进入，回车或失焦保存，Esc 取消；onSave 可返回 Promise。"),
          row("expandable", "{ render, rowExpandable? }", "—", "行下方的展开内容，左侧多一列展开按钮。"),
          row("getRowChildren", "(row) => T[] | undefined", "—", "树形行，第一列带缩进和展开按钮。"),
          row("expandedRowKeys / defaultExpandedRowKeys / onExpandedRowKeysChange", "Set<Key>", "—", "展开的行（展开行和树形行共用）。"),
          row("columnSettings", "boolean", "false", "表头右侧显示列设置菜单。"),
          row("hiddenColumnKeys / onHiddenColumnKeysChange", "Set<string>", "—", "隐藏的列，受控时使用。"),
          row("bulkActions", "(selectedKeys) => ReactNode", "—", "有勾选时在表格上方显示批量操作条。需要 selectedRowKeys。"),
          row("pageSize / pageSizeOptions / onPageSizeChange", "number / number[]", "—", "分页条上的每页条数。"),
          row("showQuickJumper", "boolean", "false", "分页条上的「跳至第几页」。"),
          row("virtualized", "{ rowHeight, overscan? }", "—", "只渲染可见行，用于上千行数据；需要 maxHeight，不能和展开行、树形行同用。"),
        ]} />
      </Section>
    </>
  );
}
