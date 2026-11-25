"use client";

import { useMemo, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Button,
  CellActions,
  Drawer,
  ProgressBar,
  StatusBadge,
  TextArea,
  ToastProvider,
  Toolbar,
  ToolbarActions,
  ToolbarPillTabs,
  ToolbarSearchInput,
  useToast,
} from "@aideui/core";
import { AddCircleLinear } from "@aideui/core/icons";
import { BusinessShell } from "../_chrome";
import { TICKETS, customerById, ticketStatusOrder, type Ticket, type TicketPriority, type TicketStatus } from "../_data";

const PRIORITY_FILTERS: Array<TicketPriority | "全部"> = ["全部", "紧急", "高", "普通"];

const PROGRESS: Record<TicketStatus, number> = { 待处理: 10, 处理中: 50, 待确认: 85, 已关闭: 100 };

const PRIORITY_COLOR = { 紧急: "red", 高: "yellow", 普通: "green" } as const;

const SUMMARY: Record<string, string> = {
  "GD-3108": "开启单点登录后，部分账号登录成功却跳到空白页，需要排查回调地址。",
  "GD-3107": "导出 CSV 时缺少标注人和审核时间两列，影响客户月底对账。",
  "GD-3105": "新增的两个科室没有套用脱敏规则，病历号直接显示了出来。",
  "GD-3102": "客户希望按部门查看调用量和费用，用于内部分摊。",
  "GD-3099": "每天 8 点的定时任务偶尔不触发，日志里没有报错记录。",
  "GD-3094": "团队版追加 10 个席位，已开通并同步到账单。",
  "GD-3090": "扫描版 PDF 上传到知识库后，解析出来的文字是乱码。",
  "GD-3086": "试用期将满，客户申请再延长 14 天完成内部评估。",
};

export default function TicketsPage() {
  return (
    <ToastProvider>
      <TicketsBoard />
    </ToastProvider>
  );
}

function TicketsBoard() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState(TICKETS);
  const [priority, setPriority] = useState<(typeof PRIORITY_FILTERS)[number]>("全部");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [dragging, setDragging] = useState<string | null>(null);
  const visible = useMemo(() => tickets.filter((ticket) => (priority === "全部" || ticket.priority === priority) && (!query || `${ticket.id}${ticket.title}${customerById(ticket.customerId)?.name}`.includes(query))), [tickets, priority, query]);
  const open = tickets.find((ticket) => ticket.id === openId);

  const move = (id: string, status: TicketStatus) => {
    setTickets((previous) => previous.map((ticket) => (ticket.id === id ? { ...ticket, status, overdue: status === "已关闭" ? false : ticket.overdue } : ticket)));
  };

  return (
    <BusinessShell title="工单" primaryAction={{ label: "新建工单" }}>
      <div className="flex flex-col gap-5">
        <Toolbar
          className="flex-col gap-4 lg:flex-row lg:items-center"
          left={<ToolbarSearchInput placeholder="搜索工单号、标题或客户" value={query} onChange={setQuery} />}
          right={
            <ToolbarActions>
              <ToolbarPillTabs color="blue" tabs={PRIORITY_FILTERS.map((item) => ({ label: item, active: item === priority }))} onChange={(index) => setPriority(PRIORITY_FILTERS[index])} />
            </ToolbarActions>
          }
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {ticketStatusOrder.map((status) => {
            const items = visible.filter((ticket) => ticket.status === status);
            return (
              <section
                key={status}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (dragging) move(dragging, status);
                  setDragging(null);
                }}
                className="flex min-h-[420px] flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-fg-black">
                    {status} ({items.length})
                  </h3>
                  <Button variant="tertiary" aria-label={`在${status}里新建工单`}>
                    <AddCircleLinear size={18} />
                  </Button>
                </div>
                {items.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} onOpen={() => setOpenId(ticket.id)} onDragStart={() => setDragging(ticket.id)} />
                ))}
                {items.length === 0 && <p className="rounded-[20px] border border-dashed border-fg-grey-300 py-8 text-center text-sm text-fg-grey-500">拖动工单到这里</p>}
              </section>
            );
          })}
        </div>
      </div>
      <Drawer
        open={!!open}
        onOpenChange={(value) => !value && setOpenId(null)}
        title={open ? `${open.id} ${open.title}` : ""}
        footer={
          open && open.status !== "已关闭" ? (
            <div className="flex justify-end gap-3">
              <Button variant="tertiary" onClick={() => { move(open.id, "已关闭"); toast({ title: "工单已关闭", status: "success" }); setOpenId(null); }}>
                关闭工单
              </Button>
              <Button disabled={!reply.trim()} onClick={() => { move(open.id, "待确认"); setReply(""); toast({ title: "已回复客户，等待确认", status: "success" }); }}>
                回复并等待确认
              </Button>
            </div>
          ) : undefined
        }
      >
        {open && (
          <div className="flex flex-col gap-5">
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col gap-1"><dt className="text-xs text-fg-grey-700">客户</dt><dd className="font-medium">{customerById(open.customerId)?.name}</dd></div>
              <div className="flex flex-col gap-1"><dt className="text-xs text-fg-grey-700">状态</dt><dd className="font-medium">{open.status}</dd></div>
              <div className="flex flex-col gap-1"><dt className="text-xs text-fg-grey-700">优先级</dt><dd className="font-medium">{open.priority}</dd></div>
              <div className="flex flex-col gap-1"><dt className="text-xs text-fg-grey-700">提交时间</dt><dd className="font-medium">{open.createdAt}</dd></div>
            </dl>
            <div className="flex flex-col gap-3 rounded-2xl bg-fg-grey-50 p-4 text-sm">
              <div className="flex items-center gap-2">
                <Avatar src={customerById(open.customerId)?.contact.avatar} alt="" size="xs" />
                <span className="font-medium">{customerById(open.customerId)?.contact.name}</span>
                <span className="text-xs text-fg-grey-700">{open.createdAt}</span>
              </div>
              <p className="text-fg-grey-900">{open.title}。麻烦尽快看一下，影响到我们部门的日常使用。</p>
            </div>
            {open.status !== "已关闭" && <TextArea label="回复客户" placeholder="说明原因和处理进展…" value={reply} onChange={setReply} rows={4} />}
          </div>
        )}
      </Drawer>
    </BusinessShell>
  );
}

function TicketCard({ ticket, onOpen, onDragStart }: { ticket: Ticket; onOpen: () => void; onDragStart: () => void }) {
  const customer = customerById(ticket.customerId);
  const progress = PROGRESS[ticket.status];
  const color = ticket.overdue ? "red" : ticket.status === "已关闭" ? "green" : ticket.status === "待确认" ? "blue" : "yellow";
  return (
    <article draggable onDragStart={onDragStart} className="cursor-grab rounded-[20px] border border-fg-grey-200 bg-background p-4 active:cursor-grabbing">
      <div className="flex items-start justify-between">
        <StatusBadge label={ticket.priority} color={PRIORITY_COLOR[ticket.priority]} />
        <CellActions actions={["pen"]} onAction={onOpen} />
      </div>
      <Button variant="unstyled" type="button" className="mt-3 text-left" onClick={onOpen}>
        <span className="text-xs text-fg-grey-500">{ticket.id}</span>
        <h4 className="text-lg font-semibold leading-6 text-fg-black">{ticket.title}</h4>
        <p className="mt-1 text-sm leading-5 text-fg-grey-500">{SUMMARY[ticket.id]}</p>
      </Button>
      <div className="mt-3">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-fg-grey-500">处理进度</span>
          <span className={`font-semibold ${ticket.overdue ? "text-fg-red" : ticket.status === "已关闭" ? "text-fg-green-500" : "text-fg-yellow-700"}`}>{ticket.overdue ? "已超时" : `${progress}%`}</span>
        </div>
        <ProgressBar value={progress} color={color} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <AvatarGroup>
          <Avatar src={ticket.assignee.avatar} alt={ticket.assignee.name} size="sm" />
          {customer && <Avatar src={customer.contact.avatar} alt={customer.contact.name} size="sm" />}
        </AvatarGroup>
        <span className="truncate pl-3 text-sm text-fg-grey-500">
          {customer?.name} · {ticket.createdAt}
        </span>
      </div>
    </article>
  );
}
