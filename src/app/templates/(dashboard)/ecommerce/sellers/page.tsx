"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  DataTable,
  CellImageText,
  CellText,
  CellMuted,
  StatusBadge,
  Button,
  IconButton,
  Breadcrumbs,
  TextField,
  TextArea,
  ConfirmationDialog,
  Avatar,
} from "@forge-ui/react";
import type { ColumnDef } from "@forge-ui/react";
import {
  LetterLinear,
  ChatRoundLinear,
  EyeLinear,
  TrashBinMinimalisticLinear,
  DownloadMinimalisticLinear,
  StarBold,
} from "solar-icon-set";
import { PlusIcon } from "@forge-ui/react";
import { Modal } from "@/app/templates/_shared";

interface SellerItem {
  id: string;
  storeName: string;
  ownerLabel: string;
  avatarUrl: string;
  rating: number;
  productCount: number;
  earning: string;
  balance: string;
  added: string;
}

interface AddSellerFormValue {
  ownerName: string;
  storeName: string;
  email: string;
  phone: string;
  address: string;
}

const initialSellerList: SellerItem[] = [
  {
    id: "1",
    storeName: "John Store",
    ownerLabel: "John Bushmill",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    rating: 4.8,
    productCount: 124,
    earning: "$1,200",
    balance: "$1,200",
    added: "$400",
  },
  {
    id: "2",
    storeName: "Laura Stuff",
    ownerLabel: "Laura Prichet",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    rating: 5.0,
    productCount: 145,
    earning: "$2,100",
    balance: "$2,100",
    added: "$400",
  },
  {
    id: "3",
    storeName: "Susan William",
    ownerLabel: "susanwil@mail.com",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    rating: 3.9,
    productCount: 766,
    earning: "$700",
    balance: "$700",
    added: "$400",
  },
  {
    id: "4",
    storeName: "JB.co",
    ownerLabel: "Josh Bill",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    rating: 4.4,
    productCount: 99,
    earning: "$920",
    balance: "$920",
    added: "$400",
  },
  {
    id: "5",
    storeName: "Timeless",
    ownerLabel: "Josh Adam",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    rating: 4.6,
    productCount: 451,
    earning: "$1,750",
    balance: "$1,750",
    added: "$400",
  },
  {
    id: "6",
    storeName: "Jennifer Patricia",
    ownerLabel: "jennpat@mail.com",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
    rating: 4.0,
    productCount: 12,
    earning: "$2,040",
    balance: "$2,040",
    added: "$400",
  },
  {
    id: "7",
    storeName: "Luv.co",
    ownerLabel: "Rajesh Masvidal",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
    rating: 4.1,
    productCount: 46,
    earning: "$1,223",
    balance: "$1,223",
    added: "$400",
  },
  {
    id: "8",
    storeName: "Sunrise",
    ownerLabel: "Fajar Surya",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face",
    rating: 3.8,
    productCount: 72,
    earning: "$567",
    balance: "$567",
    added: "$400",
  },
  {
    id: "9",
    storeName: "Northtime",
    ownerLabel: "Lisa Greg",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    rating: 5.0,
    productCount: 44,
    earning: "$1,907",
    balance: "$1,907",
    added: "$400",
  },
  {
    id: "10",
    storeName: "LB Store",
    ownerLabel: "Linda Blair",
    avatarUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&h=80&fit=crop&crop=face",
    rating: 4.7,
    productCount: 109,
    earning: "$1,300",
    balance: "$723.00",
    added: "$400",
  },
];

export default function SellersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sellerList, setSellerList] = useState<SellerItem[]>(initialSellerList);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SellerItem | null>(null);
  const [uploadedProfileImageUrl, setUploadedProfileImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addSellerFormValue, setAddSellerFormValue] =
    useState<AddSellerFormValue>({
      ownerName: "",
      storeName: "",
      email: "",
      phone: "",
      address: "",
    });

  const updateFormField = useCallback(
    (field: keyof AddSellerFormValue, value: string) => {
      setAddSellerFormValue((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleOpenDeleteModal = useCallback((record: SellerItem) => {
    setDeleteTarget(record);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteTarget(null);
    setIsDeleteModalOpen(false);
  }, []);

  const handleDeleteSeller = useCallback((sellerId: string) => {
    setSellerList((prev) => prev.filter((item) => item.id !== sellerId));
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
    if (uploadedProfileImageUrl) URL.revokeObjectURL(uploadedProfileImageUrl);
    setUploadedProfileImageUrl("");
    setAddSellerFormValue({
      ownerName: "",
      storeName: "",
      email: "",
      phone: "",
      address: "",
    });
  }, [uploadedProfileImageUrl]);

  const handleSubmitAddSeller = useCallback(() => {
    const ownerDisplay =
      addSellerFormValue.ownerName.trim() ||
      addSellerFormValue.email.trim() ||
      "—";
    const nextStoreName = addSellerFormValue.storeName.trim() || "New store";
    const newItem: SellerItem = {
      id: String(Date.now()),
      storeName: nextStoreName,
      ownerLabel: ownerDisplay,
      avatarUrl: uploadedProfileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      rating: 0,
      productCount: 0,
      earning: "$0",
      balance: "$0",
      added: "$0",
    };
    setSellerList((prev) => [newItem, ...prev]);
    handleCloseAddModal();
  }, [addSellerFormValue, uploadedProfileImageUrl, handleCloseAddModal]);

  const handleUploadProfileImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      const objectUrl = URL.createObjectURL(file);
      setUploadedProfileImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return objectUrl;
      });
    },
    []
  );

  const columns = useMemo<ColumnDef<SellerItem>[]>(
    () => [
      {
        key: "storeName",
        header: "Store Name",
        sortable: true,
        width: "w-60",
        render: (row) => (
          <CellImageText
            src={row.avatarUrl}
            title={row.storeName}
            subtitle={row.ownerLabel}
            rounded="full"
          />
        ),
      },
      {
        key: "rating",
        header: "Ratings",
        sortable: true,
        width: "w-28",
        render: (row) => (
          <div className="flex items-center gap-1 h-10">
            <StarBold size={16} color="#EAB308" />
            <span className="text-sm font-medium text-fg-grey-700">
              {row.rating.toFixed(1)}
            </span>
          </div>
        ),
      },
      {
        key: "productCount",
        header: "Product",
        sortable: true,
        width: "w-24",
        render: (row) => <CellText>{row.productCount.toLocaleString()}</CellText>,
      },
      {
        key: "earning",
        header: "Earning",
        sortable: true,
        width: "w-28",
        render: (row) => <CellText>{row.earning}</CellText>,
      },
      {
        key: "balance",
        header: "Balance",
        sortable: true,
        width: "w-28",
        render: (row) => <CellText>{row.balance}</CellText>,
      },
      {
        key: "added",
        header: "Added",
        sortable: true,
        width: "w-24",
        render: (row) => <CellText>{row.added}</CellText>,
      },
      {
        key: "actions",
        header: "",
        width: "w-36",
        render: (row) => (
          <div className="flex items-center justify-end gap-2 h-10">
            <IconButton variant="ghost" shape="square" size="sm">
              <LetterLinear size={16} />
            </IconButton>
            <IconButton variant="ghost" shape="square" size="sm">
              <ChatRoundLinear size={16} />
            </IconButton>
            <IconButton
              variant="ghost"
              shape="square"
              size="sm"
              onClick={() => router.push(`/templates/ecommerce/sellers/${row.id}`)}
            >
              <EyeLinear size={16} />
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
    [handleOpenDeleteModal, router]
  );

  const totalPages = Math.ceil(100 / 10);

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <ConfirmationDialog
            title="Delete Seller?"
            description="Do you want to delete this seller? This action can't be undone"
            color="red"
            icon={<TrashBinMinimalisticLinear size={32} color="#EA580C" />}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onCancel={handleCloseDeleteModal}
            onConfirm={() => {
              if (!deleteTarget) return;
              handleDeleteSeller(deleteTarget.id);
              handleCloseDeleteModal();
            }}
          />
        </div>
      )}

      {/* Add Seller Modal */}
      <Modal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Add Seller"
        width="w-[640px]"
      >
        <div className="px-6 py-6">
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-sm font-medium text-fg-grey-700">
                Profile Image
              </p>
              <div className="flex items-center gap-3">
                <Avatar
                  src={uploadedProfileImageUrl || undefined}
                  initials="N"
                  size="lg"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadProfileImage}
                />
                <Button
                  variant="tertiary"
                  size="sm"
                  iconLeft={<PlusIcon size={16} />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload
                </Button>
              </div>
            </div>
            <TextField
              label="Owner Name"
              placeholder="Type name here..."
              value={addSellerFormValue.ownerName}
              shape="pill"
              onChange={(val) => updateFormField("ownerName", val)}
            />
            <TextField
              label="Store Name"
              placeholder="Type name here..."
              value={addSellerFormValue.storeName}
              shape="pill"
              onChange={(val) => updateFormField("storeName", val)}
            />
            <TextField
              label="Email"
              placeholder="Type email here..."
              value={addSellerFormValue.email}
              shape="pill"
              onChange={(val) => updateFormField("email", val)}
            />
            <TextField
              label="Phone"
              placeholder="Type phone here..."
              value={addSellerFormValue.phone}
              shape="pill"
              onChange={(val) => updateFormField("phone", val)}
            />
            <TextArea
              label="Address"
              placeholder="Type address here..."
              value={addSellerFormValue.address}
              rows={4}
              onChange={(val) => updateFormField("address", val)}
            />
          </div>
        </div>
        <div className="px-6 pb-6 flex items-center justify-between">
          <Button variant="tertiary" onClick={handleCloseAddModal}>
            Cancel
          </Button>
          <Button onClick={handleSubmitAddSeller}>Submit</Button>
        </div>
      </Modal>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold text-fg-black leading-9 tracking-fg">Seller</h1>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/templates/ecommerce" },
              { label: "Seller" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="tertiary"
            iconLeft={<DownloadMinimalisticLinear size={16} />}
          >
            Export
          </Button>
          <Button
            iconLeft={<PlusIcon size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        rows={sellerList}
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
            setSelectedRows(new Set(sellerList.map((_, i) => i)));
          } else {
            setSelectedRows(new Set());
          }
        }}
        showPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        paginationLabel="Showing 1-10 from 100"
      />
    </div>
  );
}
