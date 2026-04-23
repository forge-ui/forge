"use client";

import { useState, useMemo } from "react";
import {
  DataTable,
  CellImageText,
  CellText,
  StatusBadge,
  StatCard,
  Button,
  IconButton,
  Breadcrumbs,
  Avatar,
  ToolbarDatepicker,
  ToolbarFilterButton,
} from "@forge-ui/react";
import type { ColumnDef } from "@forge-ui/react";
import { MockFilterPanel } from "@/app/templates/_shared";
import {
  PhoneCallingLinear,
  ChatRoundLinear,
  PenLinear,
  MenuDotsBold,
  EyeLinear,
  TrashBinMinimalisticLinear,
} from "solar-icon-set";

interface OrderHistoryItem {
  id: string;
  productName: string;
  subText: string;
  imageUrl: string;
  grandTotal: string;
  status: "processing" | "canceled" | "shipped" | "delivered";
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

const orderHistoryList: OrderHistoryItem[] = [
  {
    id: "1",
    productName: "Handmade Pouch",
    subText: "+3 other products",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=64&h=64&fit=crop",
    grandTotal: "$121.00",
    status: "processing",
  },
  {
    id: "2",
    productName: "Smartwatch E2",
    subText: "+1 other products",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=64&h=64&fit=crop",
    grandTotal: "$590.00",
    status: "processing",
  },
  {
    id: "3",
    productName: "Smartwatch E1",
    subText: "",
    imageUrl: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=64&h=64&fit=crop",
    grandTotal: "$125.00",
    status: "canceled",
  },
  {
    id: "4",
    productName: "Headphone G1 Pro",
    subText: "+1 other products",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=64&h=64&fit=crop",
    grandTotal: "$348.00",
    status: "shipped",
  },
  {
    id: "5",
    productName: "Iphone X",
    subText: "",
    imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=64&h=64&fit=crop",
    grandTotal: "$607.00",
    status: "delivered",
  },
];

const statisticCards = [
  { title: "Total Order", value: "1,296", trend: "10%", subtitle: "+$150 today", theme: "white" as const },
  { title: "Completed", value: "$1,200", trend: "10%", subtitle: "+$150 today", theme: "white" as const },
  { title: "Canceled", value: "$1,200", trend: "10%", subtitle: "+$150 today", theme: "white" as const },
];

export default function CustomerDetailPage() {
  const [page, setPage] = useState(1);

  const displayCustomer = {
    name: "Linda Blair",
    email: "lindablair@mail.com",
    avatarUrl: customerAvatar,
    phone: "050 414 8788",
    orders: 1296,
    created: "12 December 2022",
    id: "ID011221",
  };

  const tableColumns = useMemo<ColumnDef<OrderHistoryItem>[]>(
    () => [
      {
        key: "product",
        header: "Product",
        sortable: true,
        width: "w-60",
        render: (row) => (
          <CellImageText
            src={row.imageUrl}
            title={row.productName}
            subtitle={row.subText || undefined}
          />
        ),
      },
      {
        key: "grandTotal",
        header: "Grand Total",
        sortable: true,
        width: "w-40",
        render: (row) => (
          <div className="flex items-center h-10">
            <span className="text-xl font-semibold text-fg-black">{row.grandTotal}</span>
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        width: "w-32",
        render: (row) => (
          <StatusBadge
            label={statusLabelMap[row.status]}
            color={statusColorMap[row.status]}
          />
        ),
      },
      {
        key: "actions",
        header: "",
        width: "w-24",
        render: () => (
          <div className="flex items-center justify-end gap-3 h-10">
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

  const totalPages = Math.ceil(displayCustomer.orders / 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold text-fg-black leading-9 tracking-fg">
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

      {/* Content */}
      <div className="flex items-start gap-4">
        {/* Left Panel */}
        <div className="w-[336px] rounded-card border border-fg-grey-200 bg-white p-6 overflow-hidden relative">
          {/* Gradient header */}
          <div className="absolute left-[7px] top-[7px] h-[109px] w-[320px] rounded-xl bg-gradient-to-r from-fg-violet via-purple-300 to-fg-yellow-100" />

          {/* Avatar + Name */}
          <div className="relative z-10 flex flex-col items-center gap-3 pt-10">
            <img
              src={displayCustomer.avatarUrl}
              alt={displayCustomer.name}
              className="w-[100px] h-[100px] rounded-full object-cover bg-fg-grey-200 border-4 border-white"
            />
            <div className="text-center">
              <h3 className="text-xl font-semibold text-fg-black">
                {displayCustomer.name}
              </h3>
              <p className="text-sm text-fg-grey-700">
                <span className="text-fg-black">ID:</span> @
                {displayCustomer.email.split("@")[0]}
              </p>
            </div>
          </div>

          {/* Call / Message Buttons */}
          <div className="relative z-10 mt-6 grid grid-cols-2 gap-3">
            <Button variant="tertiary" iconLeft={<PhoneCallingLinear size={16} />}>
              Call
            </Button>
            <Button iconLeft={<ChatRoundLinear size={16} />}>Message</Button>
          </div>

          {/* User Details */}
          <div className="relative z-10 mt-5 border-t border-fg-grey-200 pt-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-fg-grey-700">User ID</p>
              <p className="text-sm font-medium text-fg-black mt-1">
                {displayCustomer.id}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-fg-grey-700">User Type</p>
              <span className="inline-flex h-7 px-2.5 mt-1 items-center rounded-full border border-yellow-200 bg-fg-yellow-50 text-sm font-semibold text-fg-yellow-600">
                Premium
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-fg-grey-700">Email</p>
              <p className="text-sm font-medium text-fg-black mt-1">
                {displayCustomer.email}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-fg-grey-700">
                Phone Number
              </p>
              <p className="text-sm font-medium text-fg-black mt-1">
                {displayCustomer.phone}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-fg-grey-700">Address</p>
              <p className="text-sm font-medium text-fg-black mt-1">
                1833 Bel Meadow Drive, Fontana, California 92335, USA
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-fg-grey-700">
                Last Transaction
              </p>
              <p className="text-sm font-medium text-fg-black mt-1">
                {displayCustomer.created}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 min-w-0">
          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            {statisticCards.map((card) => (
              <StatCard
                key={card.title}
                title={card.title}
                value={card.value}
                trend={card.trend}
                trendDirection="up"
                subtitle={card.subtitle}
                theme={card.theme}
                className="flex-1"
              />
            ))}
          </div>

          {/* Order History Table */}
          <div className="mt-4">
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
              totalPages={totalPages}
              onPageChange={setPage}
              paginationLabel={`Showing 1-5 from ${displayCustomer.orders.toLocaleString()}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
