"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useMemo } from "react";
import {
  DataTable,
  CellImageText,
  StatusBadge,
  StatCard,
  Button,
  IconButton,
  Breadcrumbs,
  TabBar,
  ReviewItem,
  ChartCard,
  SmoothLineChart,
  ToolbarDatepicker,
  ToolbarFilterButton,
} from "@forge-ui-official/core";
import type { ColumnDef } from "@forge-ui-official/core";
import { MockFilterPanel } from "@/app/templates/_shared";
import {
  PhoneCallingLinear,
  ChatRoundLinear,
  PenLinear,
  MenuDotsBold,
  EyeLinear,
  TrashBinMinimalisticLinear,
  CopyLinear,
  CalendarLinear,
} from "solar-icon-set";

interface OrderHistoryItem {
  id: string;
  productName: string;
  subText: string;
  imageUrl: string;
  grandTotal: string;
  status: "processing" | "canceled" | "shipped" | "delivered";
}

interface CustomerReview {
  id: string;
  reviewerName: string;
  reviewedAt: string;
  avatarUrl: string;
  rating: number;
  comment: string;
}

interface RecentOrderItem {
  name: string;
  countLabel: string;
  total: string;
  imageUrl: string;
}

interface ActivityItem {
  title: string;
  description: string;
  pills?: { label: string; color: "purple" | "green" | "yellow" }[];
  datetime: string;
  avatarUrl: string;
  rating?: number;
}

const statusColorMap: Record<OrderHistoryItem["status"], "yellow" | "red" | "cyan" | "green"> = {
  processing: "yellow",
  canceled: "red",
  shipped: "cyan",
  delivered: "green",
};

const statusLabelMap: Record<OrderHistoryItem["status"], string> = {
  processing: "Processing",
  canceled: "Canceled",
  shipped: "Shipped",
  delivered: "Delivered",
};

const customerAvatar =
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&crop=face";

const reviewerAvatars = [
  "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
];

const orderHistoryList: OrderHistoryItem[] = [
  { id: "1", productName: "Handmade Pouch", subText: "+3 other products", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=64&h=64&fit=crop", grandTotal: "$121.00", status: "processing" },
  { id: "2", productName: "Smartwatch E2", subText: "+1 other products", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=64&h=64&fit=crop", grandTotal: "$590.00", status: "processing" },
  { id: "3", productName: "Smartwatch E1", subText: "", imageUrl: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=64&h=64&fit=crop", grandTotal: "$125.00", status: "canceled" },
  { id: "4", productName: "Headphone G1 Pro", subText: "+1 other products", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=64&h=64&fit=crop", grandTotal: "$348.00", status: "shipped" },
  { id: "5", productName: "Iphone X", subText: "", imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=64&h=64&fit=crop", grandTotal: "$607.00", status: "delivered" },
];

const recentOrders: RecentOrderItem[] = [
  { name: "Logic Mouse", countLabel: "+2 product", total: "$17.678", imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=80&h=80&fit=crop" },
  { name: "PS Controller", countLabel: "", total: "$5,500", imageUrl: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=80&h=80&fit=crop" },
  { name: "Ximi Keyboard", countLabel: "+2 product", total: "$2,500", imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=80&h=80&fit=crop" },
  { name: "Audia Earphone", countLabel: "+1 product", total: "$7,456", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop" },
  { name: "Sams S14 Pro", countLabel: "", total: "$24,189", imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=80&h=80&fit=crop" },
  { name: "Sams A13 5G", countLabel: "+1 product", total: "$8,790", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop" },
];

const activityItems: ActivityItem[] = [
  {
    title: "Order Delivered",
    description: "Order #456091 has been delivered",
    pills: [
      { label: "Shiped", color: "purple" },
      { label: "Delivered", color: "green" },
    ],
    datetime: "04/10/25, 12:45",
    avatarUrl: customerAvatar,
  },
  {
    title: "Review",
    description: "Order #456090 has been reviewed",
    datetime: "02/10/25, 06:15",
    avatarUrl: customerAvatar,
    rating: 4,
  },
  {
    title: "Order Placed",
    description: "Order #456089 has been placed",
    pills: [{ label: "Processing", color: "yellow" }],
    datetime: "30/09/25, 09:00",
    avatarUrl: customerAvatar,
  },
];

const buyStatisticData = [
  620, 600, 660, 580, 590, 700, 750, 820, 700, 660, 640, 620,
];
const buyStatisticMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const customerReviews: CustomerReview[] = [
  { id: "r1", reviewerName: "Sin Tae", reviewedAt: "20 Des 2022, 08:00", avatarUrl: reviewerAvatars[0], rating: 5, comment: "Excellent communication and very fast delivery. Quality of the product matches the description." },
  { id: "r2", reviewerName: "Peg Legge", reviewedAt: "18 Des 2022, 11:30", avatarUrl: reviewerAvatars[1], rating: 4, comment: "Product is good but packaging could be better. Overall satisfied with the purchase." },
  { id: "r3", reviewerName: "Jack Thompson", reviewedAt: "12 Des 2022, 14:20", avatarUrl: reviewerAvatars[2], rating: 5, comment: "Highly recommend this seller. Great quality and price." },
];

const statisticCards = [
  { title: "Total Order", value: "1,296", trend: "10%", subtitle: "+$150 today" },
  { title: "Completed", value: "872", trend: "10%", subtitle: "+$150 today" },
  { title: "Canceled", value: "64", trend: "10%", subtitle: "+$150 today" },
];

const customerTabs = ["Overview", "Orders", "Reviews", "Attachment"];

function ActivityPill({ label, color }: { label: string; color: "purple" | "green" | "yellow" }) {
  const map: Record<typeof color, string> = {
    purple: "bg-fg-violet-50 text-fg-violet",
    green: "bg-fg-green-50 text-fg-green",
    yellow: "bg-fg-yellow-50 text-fg-yellow-600",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${map[color]}`}>
      {label}
    </span>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? "text-fg-yellow-500" : "text-fg-grey-200"}>
          ★
        </span>
      ))}
      <span className="ml-1 text-xs font-medium text-fg-grey-700">{rating.toFixed(1)}/5</span>
    </div>
  );
}

function CustomerSidebar() {
  return (
    <aside className="w-[336px] shrink-0 rounded-card border border-fg-grey-200 bg-white p-6 self-start">
      {/* Gradient header */}
      <div className="relative -mx-6 -mt-6 h-[120px] rounded-t-card bg-gradient-to-r from-fg-violet via-purple-300 to-fg-yellow-100" />

      {/* Avatar (overlapping) */}
      <div className="-mt-12 flex flex-col items-center gap-3">
        <img
          src={customerAvatar}
          alt="Linda Blair"
          className="h-[100px] w-[100px] rounded-full border-4 border-white object-cover"
        />
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-fg-black">Linda Blair</h3>
            <span className="rounded-md bg-fg-violet px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Pro
            </span>
          </div>
          <p className="text-sm text-fg-grey-700">@linda_blair321</p>
        </div>
      </div>

      {/* Call / Message */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button variant="tertiary" iconLeft={<PhoneCallingLinear size={16} />}>Call</Button>
        <Button iconLeft={<ChatRoundLinear size={16} />}>Message</Button>
      </div>

      {/* Contact info */}
      <div className="mt-5 space-y-4 border-t border-fg-grey-200 pt-5">
        {[
          { label: "Email", value: "lindablair@mail.com", copy: true },
          { label: "Phone Number", value: "050 414 8788", copy: true },
          { label: "Address", value: "1833 Bel Meadow Drive, Fontana, California 92335, USA" },
        ].map((field) => (
          <div key={field.label}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-fg-grey-700">{field.label}</p>
              {field.copy && (
                <IconButton variant="ghost" shape="square" size="sm">
                  <CopyLinear size={14} />
                </IconButton>
              )}
            </div>
            <p className="mt-1 text-sm font-medium leading-relaxed text-fg-black">{field.value}</p>
          </div>
        ))}
      </div>

      {/* Activity timeline */}
      <div className="mt-5 space-y-5 border-t border-fg-grey-200 pt-5">
        {activityItems.map((item, idx) => (
          <div key={idx} className="flex gap-3">
            <img
              src={item.avatarUrl}
              alt=""
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-sm font-semibold text-fg-black">{item.title}</p>
              <p className="text-xs leading-relaxed text-fg-grey-700">{item.description}</p>
              {item.pills && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {item.pills.map((pill, i) => (
                    <span key={i} className="contents">
                      <ActivityPill label={pill.label} color={pill.color} />
                      {i < item.pills!.length - 1 && (
                        <span className="text-fg-grey-700">→</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
              {item.rating && (
                <div className="rounded-lg border border-fg-grey-200 bg-fg-grey-50 px-3 py-1.5 w-fit">
                  <StarRow rating={item.rating} />
                </div>
              )}
              <p className="text-xs text-fg-grey-700">{item.datetime}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function CustomerDetailPage() {
  const [page, setPage] = useState(1);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = customerTabs[activeTabIndex];

  const tableColumns = useMemo<ColumnDef<OrderHistoryItem>[]>(
    () => [
      {
        key: "product",
        header: "Product",
        sortable: true,
        width: "w-60",
        render: (row) => (
          <CellImageText src={row.imageUrl} title={row.productName} subtitle={row.subText || undefined} />
        ),
      },
      {
        key: "grandTotal",
        header: "Grand Total",
        sortable: true,
        width: "w-40",
        render: (row) => (
          <div className="flex h-10 items-center">
            <span className="text-xl font-semibold text-fg-black">{row.grandTotal}</span>
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        width: "w-32",
        render: (row) => <StatusBadge label={statusLabelMap[row.status]} color={statusColorMap[row.status]} />,
      },
      {
        key: "actions",
        header: "",
        width: "w-24",
        render: () => (
          <div className="flex h-10 items-center justify-end gap-3">
            <IconButton variant="ghost" shape="square" size="sm">
              <EyeLinear size={16} />
            </IconButton>
            <IconButton variant="ghost" shape="square" size="sm">
              <TrashBinMinimalisticLinear size={16} />
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex items-start gap-6">
      {/* Main content */}
      <div className="min-w-0 flex-1 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
              Customer Details
            </h1>
            <Breadcrumbs
              items={[
                { label: "Dashboard", href: "/templates/ecommerce" },
                { label: "Customers", href: "/templates/ecommerce/customers" },
                { label: "Customer Details" },
              ]}
            />
          </div>
          <div className="flex items-center gap-3">
            <IconButton variant="tertiary">
              <MenuDotsBold size={20} />
            </IconButton>
            <Button iconLeft={<PenLinear size={16} />}>Edit</Button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          {statisticCards.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              trend={card.trend}
              trendDirection="up"
              subtitle={card.subtitle}
              theme="white"
            />
          ))}
        </div>

        {/* TabBar */}
        <div className="border-b border-fg-grey-200">
          <TabBar
            tabs={customerTabs.map((tab, i) => ({
              label: tab,
              active: i === activeTabIndex,
            }))}
            onChange={setActiveTabIndex}
          />
        </div>

        {/* Overview tab */}
        {activeTab === "Overview" && (
          <div className="grid grid-cols-[336px_1fr] gap-4">
            {/* History card */}
            <div className="rounded-card border border-fg-grey-200 bg-white p-5">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-fg-black">History</h3>
                <p className="text-xs text-fg-grey-700">Recent orders</p>
              </div>
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {recentOrders.map((order, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={order.imageUrl}
                      alt={order.name}
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-fg-black">{order.name}</p>
                      {order.countLabel && (
                        <p className="text-xs text-fg-grey-700">{order.countLabel}</p>
                      )}
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-fg-black">{order.total}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Buy Statistic chart */}
            <ChartCard
              title="Buy Statistic"
              subtitle="Income and Expenses"
              size="full"
              minHeight="min-h-[520px]"
              action={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-fg-grey-200 bg-white px-3 py-2 text-sm font-medium text-fg-black"
                >
                  <CalendarLinear size={16} />
                  Month
                </button>
              }
            >
              <div className="px-6 pb-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-fg-violet-50">
                    <span className="h-3 w-3 rounded-full bg-fg-violet" />
                  </span>
                  <div>
                    <p className="text-xs text-fg-grey-700">Total</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-semibold text-fg-black">$26,201</span>
                      <span className="text-xs font-semibold text-fg-green">10% ▲</span>
                    </div>
                  </div>
                </div>
                <SmoothLineChart
                  series={[{ data: buyStatisticData, color: "purple" }]}
                  accent="purple"
                  activeIndex={6}
                  showTooltip
                  tooltipItems={[{ label: "Label", value: "$680", color: "bg-fg-violet", trend: "up" }]}
                  showYAxis
                  yAxisLabels={["$200", "$400", "$600", "$800", "$1k", "$1.2k"]}
                  xAxisLabels={buyStatisticMonths}
                  height="h-72"
                />
              </div>
            </ChartCard>
          </div>
        )}

        {/* Orders tab */}
        {activeTab === "Orders" && (
          <DataTable
            title="Order History"
            headerActions={
              <div className="flex items-center gap-3">
                <ToolbarDatepicker enablePopover />
                <ToolbarFilterButton panel={(close) => <MockFilterPanel close={close} />} />
              </div>
            }
            columns={tableColumns}
            rows={orderHistoryList}
            showPagination
            currentPage={page}
            totalPages={Math.ceil(1296 / 5)}
            onPageChange={setPage}
            paginationLabel="Showing 1-5 from 1,296"
          />
        )}

        {/* Reviews tab */}
        {activeTab === "Reviews" && (
          <div className="space-y-3 rounded-card border border-fg-grey-200 bg-white p-5">
            {customerReviews.map((review) => (
              <ReviewItem
                key={review.id}
                name={review.reviewerName}
                date={review.reviewedAt}
                avatar={review.avatarUrl}
                rating={review.rating}
                content={review.comment}
              />
            ))}
          </div>
        )}

        {/* Attachment tab */}
        {activeTab === "Attachment" && (
          <div className="rounded-card border border-fg-grey-200 bg-white p-8 text-center text-sm text-fg-grey-700">
            No attachments yet.
          </div>
        )}
      </div>

      {/* Right sidebar */}
      <CustomerSidebar />
    </div>
  );
}
