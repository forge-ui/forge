"use client";

import { useEffect, useState } from "react";
import {
  AppLayout,
  Button,
  DataTable,
  CellText,
  CellTextSubtitle,
  CellNumber,
  CellMuted,
  TextField,
  TextArea,
  Modal,
  DescriptionItem,
  Toolbar,
  ToolbarSearchInput,
  ToolbarPillTabs,
  ConfirmationDialog,
  type ColumnDef,
} from "@forge-ui-official/core";
import { BagBoldDuotone } from "@forge-ui-official/core/icons";

type Order = {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  price: number;
  date: string;
  status: string;
  note: string;
};
const storageKey = "forge-light-orders-v1";
const stages = ["待处理", "待发货", "已发货", "已完成"];
const initial: Order[] = [
  {
    id: "DD20261103001",
    customer: "青禾设计工作室",
    product: "桌面收纳套装",
    quantity: 12,
    price: 12900,
    date: "2026-11-03",
    status: "待处理",
    note: "工作日上午送达，请提前联系。",
  },
  {
    id: "DD20261103002",
    customer: "山海科技",
    product: "无线键盘",
    quantity: 8,
    price: 29900,
    date: "2026-11-03",
    status: "待发货",
    note: "",
  },
  {
    id: "DD20261102003",
    customer: "木白文化",
    product: "办公笔记本",
    quantity: 30,
    price: 3900,
    date: "2026-11-02",
    status: "已发货",
    note: "",
  },
  {
    id: "DD20261101004",
    customer: "知行咨询",
    product: "桌面收纳套装",
    quantity: 5,
    price: 12900,
    date: "2026-11-01",
    status: "已完成",
    note: "",
  },
];
const empty = { customer: "", product: "", quantity: "1", price: "", note: "" };
const money = (cents: number) =>
  new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(
    cents / 100,
  );

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initial);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("全部");
  const [view, setView] = useState<"list" | "new">("list");
  const [draft, setDraft] = useState(empty);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [discardOpen, setDiscardOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"customer" | "product" | "quantity" | "price", string>>
  >({});
  const dirty = JSON.stringify(draft) !== JSON.stringify(empty);

  useEffect(() => {
    if (view !== "new" || !dirty) return;
    const warnOnLeave = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warnOnLeave);
    return () => window.removeEventListener("beforeunload", warnOnLeave);
  }, [view, dirty]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
        if (
          Array.isArray(saved) &&
          saved.every(
            (o) =>
              typeof o.id === "string" &&
              typeof o.customer === "string" &&
              typeof o.product === "string" &&
              Number.isSafeInteger(o.quantity) &&
              o.quantity > 0 &&
              Number.isSafeInteger(o.price) &&
              o.price >= 0 &&
              typeof o.date === "string" &&
              stages.includes(o.status) &&
              typeof o.note === "string",
          )
        )
          setOrders(saved);
      } catch {
        setNotice("本地记录暂时无法读取，当前显示示例订单。");
      }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  function save(next: Order[], message: string) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setError("浏览器未能保存记录，请检查存储空间后重试。");
      return false;
    }
    setOrders(next);
    setNotice(message);
    setError("");
    return true;
  }
  function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const quantity = Number(draft.quantity);
    const price = Math.round(Number(draft.price) * 100);
    const errors: typeof fieldErrors = {};
    if (!draft.customer.trim()) errors.customer = "请填写客户名称。";
    if (!draft.product.trim()) errors.product = "请填写商品名称。";
    if (!Number.isSafeInteger(quantity) || quantity < 1)
      errors.quantity = "数量须为正整数。";
    if (
      !/^\d+(\.\d{1,2})?$/.test(draft.price) ||
      !Number.isSafeInteger(price) ||
      price < 0
    )
      errors.price = "请输入有效单价，最多保留两位小数。";
    if (
      !errors.quantity &&
      !errors.price &&
      !Number.isSafeInteger(price * quantity)
    )
      errors.price = "订单金额过大，请调整数量或单价。";
    setFieldErrors(errors);
    const firstField = Object.keys(errors)[0];
    if (firstField) {
      setError("请检查标出的字段，已填写的内容会保留。");
      const form = event.currentTarget;
      requestAnimationFrame(() =>
        form.querySelector<HTMLInputElement>(`[name="${firstField}"]`)?.focus(),
      );
      return;
    }
    const order: Order = {
      id: `DD${Date.now()}`,
      customer: draft.customer.trim(),
      product: draft.product.trim(),
      quantity,
      price,
      date: new Intl.DateTimeFormat("sv-SE").format(new Date()),
      status: stages[0],
      note: draft.note.trim(),
    };
    if (save([order, ...orders], "订单已创建，可在列表中查看。")) {
      setView("list");
      setDraft(empty);
      setQuery("");
      setFilter("全部");
    }
  }
  function openNew() {
    setView("new");
    setNotice("");
    setError("");
    setFieldErrors({});
  }
  function discard() {
    setDiscardOpen(false);
    setView("list");
    setDraft(empty);
    setError("");
    setFieldErrors({});
  }
  function cancel() {
    if (dirty) setDiscardOpen(true);
    else discard();
  }
  const current = orders.find((o) => o.id === selected);
  const rows = orders.filter(
    (o) =>
      (filter === "全部" || o.status === filter) &&
      `${o.id} ${o.customer} ${o.product}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const columns: ColumnDef<Order>[] = [
    {
      key: "id",
      header: "订单号",
      valueKind: "identifier",
      render: (o) => (
        <CellText>
          <button
            className="cursor-pointer text-left hover:underline focus-visible:outline-2 focus-visible:outline-fg-black"
            onClick={() => {
              setSelected(o.id);
              setError("");
            }}
          >
            {o.id}
          </button>
        </CellText>
      ),
    },
    {
      key: "customer",
      header: "客户",
      render: (o) => <CellText>{o.customer}</CellText>,
    },
    {
      key: "product",
      header: "商品",
      render: (o) => (
        <CellTextSubtitle title={o.product} subtitle={`数量 ${o.quantity}`} />
      ),
    },
    {
      key: "total",
      header: "订单金额",
      valueKind: "number",
      render: (o) => <CellNumber value={money(o.price * o.quantity)} />,
    },
    {
      key: "status",
      header: "状态",
      render: (o) => <CellText>{o.status}</CellText>,
    },
    {
      key: "date",
      header: "下单日期",
      valueKind: "identifier",
      render: (o) => <CellMuted>{o.date}</CellMuted>,
    },
  ];
  return (
    <AppLayout
      mode="light"
      accent="black"
      profilePosition="sidebar"
      logoText="日常订单"
      hideSidebarWidgets
      pageTitle={view === "new" ? "新建订单" : "订单管理"}
      pageHeaderVariant={view === "new" ? "detail" : "home"}
      onBack={cancel}
      showDatePicker={false}
      showKebab={false}
      showFavorite={false}
      primaryAction={
        view === "list" && ready
          ? { label: "新建订单", onClick: openNew }
          : undefined
      }
      menuItems={[
        {
          label: "订单管理",
          href: "/prototype/orders",
          icon: <BagBoldDuotone size={20} color="currentColor" />,
        },
      ]}
    >
      <main className="@container mx-auto w-full min-w-0 max-w-7xl space-y-6 text-fg-black">
        <h1 className="sr-only">{view === "new" ? "新建订单" : "订单管理"}</h1>
        <p className="text-sm text-fg-grey-700">
          {view === "new"
            ? "填写客户和商品信息，确认金额后创建订单。"
            : "集中查看订单，跟进每一次交付。数据保存在当前浏览器。"}
        </p>
        {notice && (
          <p role="status" className="text-sm text-fg-grey-700">
            {notice}
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-fg-red">
            {error}
          </p>
        )}
        {view === "list" ? (
          <>
            <Toolbar
              className="@max-[744px]:flex-col @max-[744px]:items-stretch"
              left={
                <ToolbarSearchInput
                  className="@max-[744px]:w-full @max-[744px]:max-w-none"
                  ariaLabel="搜索订单"
                  placeholder="搜索订单号、客户或商品"
                  value={query}
                  onChange={setQuery}
                />
              }
              right={
                <ToolbarPillTabs
                  color="black"
                  tabs={["全部", ...stages].map((status) => ({
                    label: `${status} ${orders.filter((o) => status === "全部" || o.status === status).length}`,
                    active: filter === status,
                  }))}
                  onChange={(index) => setFilter(["全部", ...stages][index])}
                />
              }
            />
            <p className="text-sm text-fg-grey-700">共 {rows.length} 笔订单</p>
            <div
              className="min-w-0 overflow-x-auto"
              role="region"
              aria-label="订单表格，可横向滚动查看完整信息"
              tabIndex={0}
            >
              <DataTable
                columns={columns}
                rows={rows}
                emptyState=""
                getRowKey={(o) => o.id}
                showCheckbox={false}
              />
            </div>
            {rows.length === 0 && (
              <div className="py-12 text-center">
                <h2 className="font-medium">
                  {orders.length ? "没有符合条件的订单" : "还没有订单"}
                </h2>
                <p className="mt-2 text-sm text-fg-grey-500">
                  {orders.length
                    ? "调整关键词或状态后再试。"
                    : "创建第一笔订单，开始跟进交付。"}
                </p>
                <Button
                  color="black"
                  variant="secondary"
                  onClick={() => {
                    if (!orders.length) openNew();
                    else {
                      setQuery("");
                      setFilter("全部");
                    }
                  }}
                >
                  {orders.length ? "清空筛选" : "新建订单"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <form
            noValidate
            onSubmit={create}
            className="max-w-[640px] space-y-6"
          >
            <section className="space-y-4">
              <h2 className="text-lg font-medium">客户信息</h2>
              <TextField
                color="black"
                label="客户名称（必填）"
                name="customer"
                state={fieldErrors.customer ? "error" : undefined}
                errorMessage={fieldErrors.customer}
                required
                value={draft.customer}
                onChange={(customer) => {
                  setDraft({ ...draft, customer });
                  setFieldErrors((previous) => ({
                    ...previous,
                    customer: undefined,
                  }));
                }}
              />
            </section>
            <section className="space-y-4">
              <h2 className="text-lg font-medium">商品信息</h2>
              <TextField
                color="black"
                label="商品名称（必填）"
                name="product"
                state={fieldErrors.product ? "error" : undefined}
                errorMessage={fieldErrors.product}
                required
                value={draft.product}
                onChange={(product) => {
                  setDraft({ ...draft, product });
                  setFieldErrors((previous) => ({
                    ...previous,
                    product: undefined,
                  }));
                }}
              />
              <TextField
                color="black"
                label="数量（必填）"
                name="quantity"
                state={fieldErrors.quantity ? "error" : undefined}
                errorMessage={fieldErrors.quantity}
                type="number"
                min="1"
                step="1"
                required
                value={draft.quantity}
                onChange={(quantity) => {
                  setDraft({ ...draft, quantity });
                  setFieldErrors((previous) => ({
                    ...previous,
                    quantity: undefined,
                  }));
                }}
              />
              <TextField
                color="black"
                label="单价（元，必填）"
                name="price"
                state={fieldErrors.price ? "error" : undefined}
                errorMessage={fieldErrors.price}
                type="number"
                min="0"
                step="0.01"
                required
                value={draft.price}
                onChange={(price) => {
                  setDraft({ ...draft, price });
                  setFieldErrors((previous) => ({
                    ...previous,
                    price: undefined,
                  }));
                }}
              />
              <p className="font-medium">
                订单金额{" "}
                {money(
                  (Number(draft.price) || 0) *
                    100 *
                    (Number(draft.quantity) || 0),
                )}
              </p>
              <TextArea
                color="black"
                label="备注（选填）"
                value={draft.note}
                onChange={(note) => setDraft({ ...draft, note })}
              />
            </section>
            <div className="flex gap-3">
              <Button
                color="black"
                type="button"
                variant="secondary"
                onClick={cancel}
              >
                取消
              </Button>
              <Button color="black" type="submit">
                创建订单
              </Button>
            </div>
          </form>
        )}
        <Modal
          open={!!current}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
          title="订单详情"
          footer={
            current && (
              <>
                <Button
                  color="black"
                  variant="secondary"
                  onClick={() => setSelected(null)}
                >
                  关闭
                </Button>
                {stages.indexOf(current.status) < stages.length - 1 && (
                  <Button
                    color="black"
                    onClick={() =>
                      save(
                        orders.map((o) =>
                          o.id === current.id
                            ? {
                                ...o,
                                status: stages[stages.indexOf(o.status) + 1],
                              }
                            : o,
                        ),
                        "订单状态已更新。",
                      )
                    }
                  >
                    {current.status === "待处理"
                      ? "确认订单"
                      : current.status === "待发货"
                        ? "确认发货"
                        : "确认完成"}
                  </Button>
                )}
              </>
            )
          }
        >
          {current && (
            <div className="space-y-6">
              {error && (
                <p role="alert" className="text-sm text-fg-red">
                  {error}
                </p>
              )}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-fg-grey-700">订单总额</p>
                  <p className="mt-2 text-3xl font-semibold tabular-nums">
                    {money(current.price * current.quantity)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-fg-grey-700">订单状态</p>
                  <p className="mt-2 text-sm font-semibold">{current.status}</p>
                </div>
              </div>
              <section className="space-y-4 border-t border-fg-grey-200 pt-6">
                <h3 className="text-sm font-semibold">订单信息</h3>
                <DescriptionItem
                  label="客户"
                  content={
                    <span className="break-words text-sm font-medium">
                      {current.customer}
                    </span>
                  }
                />
                <DescriptionItem
                  label="订单号"
                  content={
                    <span className="break-all text-sm font-medium">
                      {current.id}
                    </span>
                  }
                />
                <DescriptionItem label="下单日期" content={current.date} />
              </section>
              <section className="space-y-3 border-t border-fg-grey-200 pt-6">
                <h3 className="text-sm font-semibold">商品明细</h3>
                <p className="break-words text-sm font-medium">
                  {current.product}
                </p>
                <p className="text-sm text-fg-grey-700">
                  单价 {money(current.price)} × {current.quantity} 件
                </p>
              </section>
              <section className="space-y-3 border-t border-fg-grey-200 pt-6">
                <h3 className="text-sm font-semibold">订单备注</h3>
                <p className="whitespace-pre-wrap break-words text-sm text-fg-grey-700">
                  {current.note || "未填写备注"}
                </p>
              </section>
            </div>
          )}
        </Modal>
        <ConfirmationDialog
          open={discardOpen}
          onOpenChange={setDiscardOpen}
          title="放弃未保存的订单？"
          description="已填写的内容将丢失。选择继续编辑可保留当前填写内容。"
          cancelLabel="继续编辑"
          confirmLabel="放弃更改"
          color="red"
          onCancel={() => setDiscardOpen(false)}
          onConfirm={discard}
        />
      </main>
    </AppLayout>
  );
}
