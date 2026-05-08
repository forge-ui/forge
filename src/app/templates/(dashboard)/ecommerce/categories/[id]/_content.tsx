"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PenNewSquareLinear,
  MenuDotsBold,
  ArrowLeftLinear,
} from "solar-icon-set";
import {
  Breadcrumbs,
  Button,
  DataTable,
  StatusBadge,
  CellText,
  CellImageText,
  CellKebabMenu,
  ToolbarSearchInput,
  ToolbarFilterButton,
  ToolbarShowSelect,
} from "@forge-ui-official/core";
import type { ColumnDef, StatusBadgeColor } from "@forge-ui-official/core";
import { MockFilterPanel } from "@/app/templates/_shared";

const SHOW_PER_PAGE_OPTIONS = [
  { label: "5", value: "5" },
  { label: "10", value: "10" },
  { label: "25", value: "25" },
];

interface CategoryProductItem {
  id: string;
  name: string;
  sales: string;
  stock: number;
  status: "low" | "ok" | "draft";
  imageUrl: string;
}

const categoryProductList: CategoryProductItem[] = [
  { id: "1", name: "Watch", sales: "141 Sales", stock: 10, status: "low", imageUrl: "https://placehold.co/32x32/e2e8f0/64748b?text=W" },
  { id: "2", name: "Watch", sales: "141 Sales", stock: 204, status: "ok", imageUrl: "https://placehold.co/32x32/e2e8f0/64748b?text=W" },
  { id: "3", name: "Watch", sales: "0 Sales", stock: 48, status: "draft", imageUrl: "https://placehold.co/32x32/e2e8f0/64748b?text=W" },
  { id: "4", name: "Watch", sales: "141 Sales", stock: 401, status: "ok", imageUrl: "https://placehold.co/32x32/e2e8f0/64748b?text=W" },
  { id: "5", name: "Watch", sales: "141 Sales", stock: 120, status: "ok", imageUrl: "https://placehold.co/32x32/e2e8f0/64748b?text=W" },
  { id: "6", name: "Watch", sales: "141 Sales", stock: 432, status: "ok", imageUrl: "https://placehold.co/32x32/e2e8f0/64748b?text=W" },
  { id: "7", name: "Watch", sales: "1/1 Sales", stock: 0, status: "low", imageUrl: "https://placehold.co/32x32/e2e8f0/64748b?text=W" },
  { id: "8", name: "Watch", sales: "141 Sales", stock: 347, status: "ok", imageUrl: "https://placehold.co/32x32/e2e8f0/64748b?text=W" },
  { id: "9", name: "Watch", sales: "141 Sales", stock: 299, status: "ok", imageUrl: "https://placehold.co/32x32/e2e8f0/64748b?text=W" },
  { id: "10", name: "Watch", sales: "0 Sales", stock: 38, status: "draft", imageUrl: "https://placehold.co/32x32/e2e8f0/64748b?text=W" },
];

const statusMap: Record<CategoryProductItem["status"], { label: string; color: StatusBadgeColor }> = {
  ok: { label: "Published", color: "green" },
  low: { label: "Low Stock", color: "red" },
  draft: { label: "Draft", color: "grey" },
};

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const categoryId = params?.id ?? "1";
  const [page, setPage] = useState(1);
  const [showPerPage, setShowPerPage] = useState("5");

  const columns: ColumnDef<CategoryProductItem>[] = useMemo(
    () => [
      {
        key: "product",
        header: "Product",
        width: "w-60",
        render: (row) => <CellImageText src={row.imageUrl} title={row.name} subtitle={row.sales} />,
      },
      {
        key: "stock",
        header: "Stock",
        width: "w-[140px]",
        render: (row) => <CellText>{String(row.stock)}</CellText>,
      },
      {
        key: "status",
        header: "Status",
        width: "w-[160px]",
        render: (row) => {
          const meta = statusMap[row.status];
          return <StatusBadge label={meta.label} color={meta.color} />;
        },
      },
      {
        key: "actions",
        header: "",
        width: "w-[80px]",
        render: () => <CellKebabMenu />,
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold text-fg-black leading-9 tracking-fg">Category Details</h1>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/templates/ecommerce" },
              { label: "Categories", href: "/templates/ecommerce/categories" },
              { label: "Watch" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            iconLeft={<PenNewSquareLinear size={16} />}
            onClick={() => router.push(`/templates/ecommerce/categories/${categoryId}/edit`)}
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-start gap-4">
        {/* Left: Category Info */}
        <div className="w-[320px] bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-5">
          <img
            src="https://placehold.co/280x280/e2e8f0/64748b?text=Watch"
            alt="watch"
            className="w-full h-[280px] rounded-xl object-cover"
          />
          <h3 className="text-display-l font-semibold text-fg-black mt-5">Watch</h3>
          <p className="text-sm text-fg-grey-700 mt-2 leading-5">
            Our range of watches are perfect whether you&apos;re looking to upgrade.
          </p>
          <div className="h-px bg-fg-grey-200 my-4" />
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm text-fg-grey-700">Sales</p>
              <p className="text-sm font-semibold text-fg-black mt-0.5">Google</p>
            </div>
            <div>
              <p className="text-sm text-fg-grey-700">Stock</p>
              <p className="text-sm font-semibold text-fg-black mt-0.5">204</p>
            </div>
            <div>
              <p className="text-sm text-fg-grey-700">Added</p>
              <p className="text-sm font-semibold text-fg-black mt-0.5">12 December 2022</p>
            </div>
          </div>
        </div>

        {/* Right: Products in Category */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <ToolbarSearchInput placeholder="Search..." />
            <div className="flex items-center gap-3">
              <ToolbarFilterButton panel={(close) => <MockFilterPanel close={close} />} />
              <ToolbarShowSelect
                value={showPerPage}
                options={SHOW_PER_PAGE_OPTIONS}
                onChange={setShowPerPage}
              />
            </div>
          </div>

          <DataTable<CategoryProductItem>
            columns={columns}
            rows={categoryProductList}
            showPagination
            currentPage={page}
            totalPages={10}
            onPageChange={setPage}
            paginationLabel={`Showing 1-${categoryProductList.length} from 100`}
          />
        </div>
      </div>
    </div>
  );
}
