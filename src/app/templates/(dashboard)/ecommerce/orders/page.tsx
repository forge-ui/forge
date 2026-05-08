"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  StatCard,
  DataTable,
  CellText,
  CellImageText,
  CellMuted,
  CellTextSubtitle,
  StatusBadge,
  CellKebabMenu,
  Button,
  IconButton,
  ButtonGroup,
  Breadcrumbs,
  ConfirmationDialog,
  Toolbar,
  ToolbarDatepicker,
  ToolbarFilterButton,
  ToolbarShowSelect,
} from "@forge-ui-official/core";
import { MockFilterPanel } from "@/app/templates/_shared";

const SHOW_PER_PAGE_OPTIONS = [
  { label: "10", value: "10" },
  { label: "25", value: "25" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];
import type { ColumnDef, StatusBadgeColor } from "@forge-ui-official/core";
import {
  DownloadMinimalisticLinear,
  TrashBinTrashLinear,
} from "solar-icon-set";
import { PlusIcon } from "@forge-ui-official/core";

interface OrderItem {
  id: string;
  product: string;
  extra: string;
  date: string;
  customer: string;
  email: string;
  total: string;
  payment: string;
  status: "processing" | "shipped" | "delivered" | "canceled";
  imageUrl: string;
}

const initialOrderList: OrderItem[] = [
  {
    id: "#302012",
    product: "Handmade Pouch",
    extra: "+3 other products",
    date: "1 min ago",
    customer: "John Bushm...",
    email: "Johnb@mail.c...",
    total: "$121.00",
    payment: "Masterca...",
    status: "processing",
    imageUrl: "https://placehold.co/40x40/f8f8f8/333",
  },
  {
    id: "#302011",
    product: "Smartwatch E2",
    extra: "+1 other products",
    date: "1 min ago",
    customer: "Ilham Budi A",
    email: "ilahmbudi@ma...",
    total: "$590.00",
    payment: "Visa",
    status: "processing",
    imageUrl: "https://placehold.co/40x40/f8f8f8/333",
  },
  {
    id: "#302002",
    product: "Smartwatch E1",
    extra: "",
    date: "5 hour ago",
    customer: "Mohammad...",
    email: "m_karim@mail...",
    total: "$125.00",
    payment: "Transfer",
    status: "shipped",
    imageUrl: "https://placehold.co/40x40/f8f8f8/333",
  },
  {
    id: "#301901",
    product: "Headphone G1 Pro",
    extra: "+1 other products",
    date: "1 day ago",
    customer: "Linda Blair",
    email: "lindablair@mail...",
    total: "$348.00",
    payment: "Paypal",
    status: "delivered",
    imageUrl: "https://placehold.co/40x40/f8f8f8/333",
  },
  {
    id: "#301900",
    product: "iPhone X",
    extra: "",
    date: "2 day ago",
    customer: "Josh Adam",
    email: "josh_adam@m...",
    total: "$607.00",
    payment: "Visa",
    status: "canceled",
    imageUrl: "https://placehold.co/40x40/f8f8f8/333",
  },
  {
    id: "#301881",
    product: "Puma Shoes",
    extra: "+1 other products",
    date: "5 Jan 2023",
    customer: "Sin Tae",
    email: "sin_tae@mail...",
    total: "$234.00",
    payment: "Visa",
    status: "delivered",
    imageUrl: "https://placehold.co/40x40/f8f8f8/333",
  },
  {
    id: "#301643",
    product: "Imac 2021",
    extra: "",
    date: "1 Jan 2023",
    customer: "Rajesh Mas...",
    email: "rajesh_m@mai...",
    total: "$760.00",
    payment: "Transfer",
    status: "processing",
    imageUrl: "https://placehold.co/40x40/f8f8f8/333",
  },
  {
    id: "#301600",
    product: "Nike Shoes",
    extra: "+1 other products",
    date: "24 Dec 2022",
    customer: "Fajar Surya",
    email: "fsurya@mail...",
    total: "$400.00",
    payment: "Masterca...",
    status: "delivered",
    imageUrl: "https://placehold.co/40x40/f8f8f8/333",
  },
  {
    id: "#301555",
    product: "Lego Car",
    extra: "+4 other products",
    date: "2 Dec 2022",
    customer: "Francis Greg",
    email: "francisg@...",
    total: "$812.00",
    payment: "Paypal",
    status: "canceled",
    imageUrl: "https://placehold.co/40x40/f8f8f8/333",
  },
  {
    id: "#301002",
    product: "Skincare Alia 1",
    extra: "",
    date: "2 Dec 2022",
    customer: "Linda Blair",
    email: "lindablair@mail...",
    total: "$123.00",
    payment: "Paypal",
    status: "delivered",
    imageUrl: "https://placehold.co/40x40/f8f8f8/333",
  },
];

const filterTabs = [
  { label: "All Orders" },
  { label: "Processing" },
  { label: "Shipped" },
  { label: "Delivered" },
  { label: "Canceled" },
];

const filterValues = ["all", "processing", "shipped", "delivered", "canceled"];

const statusColorMap: Record<OrderItem["status"], StatusBadgeColor> = {
  processing: "yellow",
  shipped: "cyan",
  delivered: "green",
  canceled: "red",
};

export default function OrdersPage() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [showPerPage, setShowPerPage] = useState("10");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [orderList, setOrderList] = useState<OrderItem[]>(initialOrderList);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<OrderItem | null>(null);

  const activeFilter = filterValues[activeTabIndex];

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orderList;
    return orderList.filter((o) => o.status === activeFilter);
  }, [orderList, activeFilter]);

  const handleDeleteOrder = useCallback((orderId: string) => {
    setOrderList((prev) => prev.filter((item) => item.id !== orderId));
    setSelectedRows(new Set());
  }, []);

  const handleOpenDeleteModal = useCallback((record: OrderItem) => {
    setDeleteTarget(record);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  }, []);

  const columns: ColumnDef<OrderItem>[] = useMemo(
    () => [
      {
        key: "id",
        header: "ID",
        width: "w-[120px]",
        render: (row) => (
          <Link
            href={`/templates/ecommerce/orders/${row.id.replace("#", "")}`}
            className="text-sm font-bold text-fg-black hover:text-fg-violet no-underline"
          >
            {row.id}
          </Link>
        ),
      },
      {
        key: "product",
        header: "Product",
        sortable: true,
        width: "w-60",
        render: (row) => (
          <CellImageText
            src={row.imageUrl}
            title={row.product}
            subtitle={row.extra || undefined}
          />
        ),
      },
      {
        key: "date",
        header: "Date",
        sortable: true,
        width: "w-[140px]",
        render: (row) => <CellMuted>{row.date}</CellMuted>,
      },
      {
        key: "customer",
        header: "Customer",
        width: "w-[170px]",
        render: (row) => (
          <CellTextSubtitle title={row.customer} subtitle={row.email} />
        ),
      },
      {
        key: "total",
        header: "Total",
        width: "w-[110px]",
        render: (row) => <CellText>{row.total}</CellText>,
      },
      {
        key: "payment",
        header: "Payment",
        width: "w-[120px]",
        render: (row) => <CellMuted>{row.payment}</CellMuted>,
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        width: "w-[120px]",
        render: (row) => (
          <StatusBadge
            label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
            color={statusColorMap[row.status]}
          />
        ),
      },
      {
        key: "actions",
        header: "",
        width: "w-[60px]",
        render: (row) => (
          <IconButton
            variant="ghost"
            shape="square"
            size="sm"
            onClick={() => handleOpenDeleteModal(row)}
          >
            <TrashBinTrashLinear size={16} />
          </IconButton>
        ),
      },
    ],
    [handleOpenDeleteModal]
  );

  return (
    <>
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <ConfirmationDialog
            title={
              deleteTarget
                ? `Delete Order ${deleteTarget.id}?`
                : "Delete Order?"
            }
            description={
              deleteTarget
                ? `Do you want to delete order "${deleteTarget.id}"? This action can't be undone`
                : "Do you want to delete this order? This action can't be undone"
            }
            color="red"
            icon={<TrashBinTrashLinear size={24} color="#ea580c" />}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={() => {
              if (deleteTarget) handleDeleteOrder(deleteTarget.id);
              handleCloseDeleteModal();
            }}
            onCancel={handleCloseDeleteModal}
          />
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold text-fg-black leading-9 tracking-fg">Orders</h1>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/templates/ecommerce" },
              { label: "Orders" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="tertiary" iconLeft={<DownloadMinimalisticLinear size={16} />} onClick={() => {}}>
            Export
          </Button>
          <Link href="/templates/ecommerce/orders/new">
            <Button iconLeft={<PlusIcon size={16} />}>
              Add New
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-3">
        <StatCard
          title="Total Order"
          value="1,201"
          trend="4%"
          trendDirection="up"
          subtitle="+150 today"
        />
        <StatCard
          title="Delivered"
          value="1,821"
          trend="2%"
          trendDirection="down"
          subtitle="+150 today"
        />
        <StatCard
          title="Processing"
          value="9,102"
          trend="4%"
          trendDirection="up"
          subtitle="+150 today"
        />
        <StatCard
          title="Canceled"
          value="140"
          trend="4%"
          trendDirection="up"
          subtitle="+150 today"
        />
      </div>

      <div className="mt-6">
        <Toolbar
          left={
            <ButtonGroup
              items={filterTabs}
              activeIndex={activeTabIndex}
              onChange={setActiveTabIndex}
              shape="pill"
            />
          }
          right={
            <div className="flex items-center gap-3">
              <ToolbarDatepicker enablePopover />
              <ToolbarFilterButton panel={(close) => <MockFilterPanel close={close} />} />
              <ToolbarShowSelect
                value={showPerPage}
                options={SHOW_PER_PAGE_OPTIONS}
                onChange={setShowPerPage}
              />
            </div>
          }
        />
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          rows={filteredOrders}
          showCheckbox
          selectedRows={selectedRows}
          onSelectRow={(index, checked) => {
            setSelectedRows((prev) => {
              const next = new Set(prev);
              if (checked) next.add(index);
              else next.delete(index);
              return next;
            });
          }}
          onSelectAll={(checked) => {
            if (checked) {
              setSelectedRows(
                new Set(filteredOrders.map((_, i) => i))
              );
            } else {
              setSelectedRows(new Set());
            }
          }}
          showPagination
          currentPage={page}
          totalPages={Math.ceil(filteredOrders.length / 10) || 1}
          onPageChange={setPage}
          paginationLabel={`Showing 1-${filteredOrders.length} from ${filteredOrders.length}`}
        />
      </div>
    </>
  );
}
