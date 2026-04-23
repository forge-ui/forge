"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  DownloadMinimalisticLinear,
  PenLinear,
  TrashBinMinimalisticLinear,
} from "solar-icon-set";
import {
  Breadcrumbs,
  Button,
  IconButton,
  DataTable,
  CellText,
  CellImageText,
  CellMuted,
  ConfirmationDialog,
  PlusIcon,
} from "@forge-ui/react";
import type { ColumnDef } from "@forge-ui/react";

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  sales: string;
  stock: string;
  added: string;
  imageUrl: string;
}

const initialCategoryList: CategoryItem[] = [
  { id: "1", name: "Bag & Pouch", description: "Category description here lorem ipsum dolor sit a...", sales: "15,020", stock: "901", added: "29 Dec 2022", imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=C" },
  { id: "2", name: "Watch", description: "Category description here lorem ipsum dolor sit a...", sales: "4,901", stock: "451", added: "24 Dec 2022", imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=C" },
  { id: "3", name: "Audio", description: "Category description here lorem ipsum dolor sit a...", sales: "10,405", stock: "400", added: "12 Dec 2022", imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=C" },
  { id: "4", name: "Smartphone", description: "Category description here lorem ipsum dolor sit a...", sales: "3,245", stock: "132", added: "21 Oct 2022", imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=C" },
  { id: "5", name: "Shoes", description: "Category description here lorem ipsum dolor sit a...", sales: "11,902", stock: "1,201", added: "21 Oct 2022", imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=C" },
  { id: "6", name: "PC Desktop", description: "Category description here lorem ipsum dolor sit a...", sales: "1,100", stock: "98", added: "21 Oct 2022", imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=C" },
  { id: "7", name: "Toys", description: "Category description here lorem ipsum dolor sit a...", sales: "900", stock: "234", added: "19 Sep 2022", imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=C" },
  { id: "8", name: "Beauty", description: "Category description here lorem ipsum dolor sit a...", sales: "1,200", stock: "2,403", added: "19 Sep 2022", imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=C" },
  { id: "9", name: "Hat", description: "Category description here lorem ipsum dolor sit a...", sales: "720", stock: "720", added: "19 Sep 2022", imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=C" },
  { id: "10", name: "Camera", description: "Category description here lorem ipsum dolor sit a...", sales: "329", stock: "199", added: "10 Aug 2022", imageUrl: "https://placehold.co/36x36/e2e8f0/64748b?text=C" },
];

export default function CategoriesPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [categoryList, setCategoryList] = useState<CategoryItem[]>(initialCategoryList);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);

  const handleDeleteCategory = useCallback((categoryId: string) => {
    setCategoryList((prev) => prev.filter((item) => item.id !== categoryId));
    setSelectedRows(new Set());
  }, []);

  const handleOpenDeleteModal = useCallback((record: CategoryItem) => {
    setDeleteTarget(record);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  }, []);

  const columns: ColumnDef<CategoryItem>[] = useMemo(
    () => [
      {
        key: "category",
        header: "Category",
        sortable: true,
        width: "w-60",
        render: (row) => (
          <div
            className="cursor-pointer"
            onClick={() => router.push(`/examples/ecommerce/categories/${row.id}`)}
          >
            <CellImageText src={row.imageUrl} title={row.name} subtitle={row.description} />
          </div>
        ),
      },
      {
        key: "sales",
        header: "Sales",
        sortable: true,
        width: "w-[180px]",
        render: (row) => <CellText>{row.sales}</CellText>,
      },
      {
        key: "stock",
        header: "Stock",
        sortable: true,
        width: "w-[180px]",
        render: (row) => <CellText>{row.stock}</CellText>,
      },
      {
        key: "added",
        header: "Added",
        sortable: true,
        width: "w-[180px]",
        render: (row) => <CellMuted>{row.added}</CellMuted>,
      },
      {
        key: "actions",
        header: "",
        width: "w-[88px]",
        render: (row) => (
          <div className="flex items-center gap-3">
            <IconButton
              variant="ghost"
              shape="square"
              size="sm"
              onClick={() => router.push(`/examples/ecommerce/categories/${row.id}`)}
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

  const totalPages = Math.max(1, Math.ceil(categoryList.length / 10));

  return (
    <div className="flex flex-col gap-6">
      {/* Delete confirmation dialog overlay */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ConfirmationDialog
            title={deleteTarget ? `Delete ${deleteTarget.name}?` : "Delete Category?"}
            description={
              deleteTarget
                ? `Do you want to delete "${deleteTarget.name}"? This action can't be undone`
                : "Do you want to delete this category? This action can't be undone"
            }
            confirmLabel="Delete"
            cancelLabel="Cancel"
            color="red"
            onConfirm={() => {
              if (deleteTarget) {
                handleDeleteCategory(deleteTarget.id);
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
          <h1 className="text-display-l font-semibold text-fg-black leading-9 tracking-fg">Categories</h1>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/templates/ecommerce" },
              { label: "Categories" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="tertiary" iconLeft={<DownloadMinimalisticLinear size={16} />} onClick={() => {}}>
            Export
          </Button>
          <Button iconLeft={<PlusIcon size={16} />} onClick={() => router.push("/templates/ecommerce/categories/new")}>
            Add New
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable<CategoryItem>
        columns={columns}
        rows={categoryList}
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
            setSelectedRows(new Set(categoryList.map((_, i) => i)));
          } else {
            setSelectedRows(new Set());
          }
        }}
        showPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        paginationLabel={`Showing 1-${categoryList.length} from ${categoryList.length}`}
      />
    </div>
  );
}
