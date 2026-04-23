"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  DownloadMinimalisticLinear,
  PenLinear,
  TrashBinMinimalisticLinear,
} from "solar-icon-set";
import { PlusIcon } from "@forge-ui/react";
import {
  PageHeader,
  Breadcrumbs,
  Button,
  IconButton,
  ButtonGroup,
  DataTable,
  StatusBadge,
  CellText,
  CellImageText,
  CellTextSubtitle,
  CellMuted,
  CellKebabMenu,
  ConfirmationDialog,
  ToolbarDatepicker,
  ToolbarFilterButton,
} from "@forge-ui/react";
import type { ColumnDef, StatusBadgeColor } from "@forge-ui/react";
import { MockFilterPanel } from "@/app/templates/_shared";

interface ProductInventoryItem {
  id: string;
  sku: string;
  name: string;
  variants: string;
  category: string;
  stock: number;
  price: string;
  status: "low-stock" | "published" | "draft" | "sold-out";
  addedDate: string;
  addedTime: string;
  imageUrl: string;
}

const filterTabs = [
  { label: "All Product" },
  { label: "Published" },
  { label: "Low Stock" },
  { label: "Sold Out" },
  { label: "Draft" },
];

const filterValues = ["all-product", "published", "low-stock", "sold-out", "draft"];

const mockProductList: ProductInventoryItem[] = [
  {
    id: "1",
    sku: "302012",
    name: "Handmade Pouch",
    variants: "3 Variants",
    category: "Bag & Pouch",
    stock: 10,
    price: "$121.00",
    status: "low-stock",
    addedDate: "29 Dec 2022",
    addedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=P",
  },
  {
    id: "2",
    sku: "302011",
    name: "Smartwatch E2",
    variants: "2 Variants",
    category: "Watch",
    stock: 204,
    price: "$590.00",
    status: "published",
    addedDate: "24 Dec 2022",
    addedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=P",
  },
  {
    id: "3",
    sku: "302002",
    name: "Smartwatch E1",
    variants: "3 Variants",
    category: "Watch",
    stock: 48,
    price: "$125.00",
    status: "draft",
    addedDate: "12 Dec 2022",
    addedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=P",
  },
  {
    id: "4",
    sku: "301901",
    name: "Headphone G1 Pro",
    variants: "1 Variants",
    category: "Audio",
    stock: 401,
    price: "$348.00",
    status: "published",
    addedDate: "21 Oct 2022",
    addedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=P",
  },
  {
    id: "5",
    sku: "301900",
    name: "iPhone X",
    variants: "4 Variants",
    category: "Smartphone",
    stock: 120,
    price: "$607.00",
    status: "low-stock",
    addedDate: "21 Oct 2022",
    addedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=P",
  },
  {
    id: "6",
    sku: "301881",
    name: "Puma Shoes",
    variants: "3 Variants",
    category: "Shoes",
    stock: 432,
    price: "$234.00",
    status: "published",
    addedDate: "21 Oct 2022",
    addedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=P",
  },
  {
    id: "7",
    sku: "301643",
    name: "Imac 2021",
    variants: "1 Variants",
    category: "PC Desktop",
    stock: 0,
    price: "$760.00",
    status: "sold-out",
    addedDate: "19 Sep 2022",
    addedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=P",
  },
  {
    id: "8",
    sku: "301600",
    name: "Nike Shoes",
    variants: "3 Variants",
    category: "Shoes",
    stock: 347,
    price: "$400.00",
    status: "published",
    addedDate: "19 Sep 2022",
    addedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=P",
  },
  {
    id: "9",
    sku: "301555",
    name: "Lego Car",
    variants: "2 Variants",
    category: "Toys",
    stock: 299,
    price: "$812.00",
    status: "sold-out",
    addedDate: "19 Sep 2022",
    addedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=P",
  },
  {
    id: "10",
    sku: "301002",
    name: "Skincare Alia 1",
    variants: "3 Variants",
    category: "Beauty",
    stock: 38,
    price: "$123.00",
    status: "draft",
    addedDate: "10 Aug 2022",
    addedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=P",
  },
];

const statusMap: Record<ProductInventoryItem["status"], { label: string; color: StatusBadgeColor }> = {
  "low-stock": { label: "Low Stock", color: "yellow" },
  published: { label: "Published", color: "green" },
  draft: { label: "Draft", color: "grey" },
  "sold-out": { label: "Sold Out", color: "red" },
};

export default function ProductsPage() {
  const router = useRouter();
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [productList, setProductList] = useState<ProductInventoryItem[]>(mockProductList);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProductInventoryItem | null>(null);

  const handleDeleteProduct = useCallback((productId: string) => {
    setProductList((prev) => prev.filter((item) => item.id !== productId));
    setSelectedRows(new Set());
  }, []);

  const handleOpenDeleteModal = useCallback((record: ProductInventoryItem) => {
    setDeleteTarget(record);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  }, []);

  const filteredList = useMemo(() => {
    const filterValue = filterValues[activeFilterIndex];
    if (filterValue === "all-product") return productList;
    return productList.filter((item) => item.status === filterValue);
  }, [productList, activeFilterIndex]);

  const totalPages = Math.ceil(filteredList.length / pageSize);

  const columns: ColumnDef<ProductInventoryItem>[] = useMemo(
    () => [
      {
        key: "sku",
        header: "SKU",
        sortable: true,
        width: "w-24",
        render: (row) => <CellText>{row.sku}</CellText>,
      },
      {
        key: "product",
        header: "Product",
        sortable: true,
        width: "w-60",
        render: (row) => (
          <div
            className="cursor-pointer"
            onClick={() => router.push(`/examples/ecommerce/products/${row.id}`)}
          >
            <CellImageText src={row.imageUrl} title={row.name} subtitle={row.variants} />
          </div>
        ),
      },
      {
        key: "category",
        header: "Category",
        sortable: true,
        width: "w-28",
        render: (row) => <CellMuted>{row.category}</CellMuted>,
      },
      {
        key: "stock",
        header: "Stock",
        sortable: true,
        width: "w-20",
        render: (row) => <CellText>{String(row.stock)}</CellText>,
      },
      {
        key: "price",
        header: "Price",
        sortable: true,
        width: "w-24",
        render: (row) => <CellText>{row.price}</CellText>,
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        width: "w-28",
        render: (row) => {
          const meta = statusMap[row.status];
          return <StatusBadge label={meta.label} color={meta.color} />;
        },
      },
      {
        key: "added",
        header: "Added",
        sortable: true,
        width: "w-28",
        render: (row) => <CellTextSubtitle title={row.addedDate} subtitle={row.addedTime} />,
      },
      {
        key: "actions",
        header: "",
        width: "w-16",
        render: (row) => (
          <div className="flex items-center gap-2">
            <IconButton
              variant="ghost"
              shape="square"
              size="sm"
              onClick={() => router.push("/templates/ecommerce/products/new")}
            >
              <PenLinear size={16} />
            </IconButton>
            <IconButton
              variant="ghost"
              shape="square"
              size="sm"
              onClick={() => handleOpenDeleteModal(row)}
            >
              <TrashBinMinimalisticLinear size={16} />
            </IconButton>
          </div>
        ),
      },
    ],
    [router, handleOpenDeleteModal]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Delete confirmation dialog overlay */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ConfirmationDialog
            title={deleteTarget ? `Delete ${deleteTarget.name}?` : "Delete Product?"}
            description={
              deleteTarget
                ? `Do you want to delete "${deleteTarget.name}"? This action can't be undone`
                : "Do you want to delete this product? This action can't be undone"
            }
            confirmLabel="Delete"
            cancelLabel="Cancel"
            color="red"
            onConfirm={() => {
              if (deleteTarget) {
                handleDeleteProduct(deleteTarget.id);
              }
              handleCloseDeleteModal();
            }}
            onCancel={handleCloseDeleteModal}
          />
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold text-fg-black leading-9 tracking-fg">Product</h1>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/templates/ecommerce" },
              { label: "Product" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="tertiary" iconLeft={<DownloadMinimalisticLinear size={16} />} onClick={() => {}}>
            Export
          </Button>
          <Button iconLeft={<PlusIcon size={16} />} onClick={() => router.push("/templates/ecommerce/products/new")}>
            Add New
          </Button>
        </div>
      </div>

      {/* Filter Tabs + Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <ButtonGroup
          items={filterTabs}
          activeIndex={activeFilterIndex}
          shape="pill"
          onChange={(index) => {
            setActiveFilterIndex(index);
            setCurrentPage(1);
          }}
        />
        <div className="flex items-center gap-3">
          <ToolbarDatepicker enablePopover />
          <ToolbarFilterButton panel={(close) => <MockFilterPanel close={close} />} />
        </div>
      </div>

      {/* Data Table */}
      <DataTable<ProductInventoryItem>
        columns={columns}
        rows={filteredList}
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
            setSelectedRows(new Set(filteredList.map((_, i) => i)));
          } else {
            setSelectedRows(new Set());
          }
        }}
        showPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        paginationLabel={`Showing 1-${Math.min(pageSize, filteredList.length)} from ${filteredList.length}`}
      />
    </div>
  );
}
