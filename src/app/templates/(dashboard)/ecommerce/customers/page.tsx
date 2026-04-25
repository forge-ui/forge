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
  Pagination,
  Avatar,
} from "@forge-ui/react";
import type { ColumnDef } from "@forge-ui/react";
import {
  LetterLinear,
  PhoneCallingLinear,
  ChatRoundLinear,
  TrashBinMinimalisticLinear,
  DownloadMinimalisticLinear,
} from "solar-icon-set";
import { PlusIcon } from "@forge-ui/react";
import { Modal } from "@/app/templates/_shared";

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  phone: string;
  orders: number;
  balance: string;
  status: "online" | "offline";
  created: string;
}

interface AddCustomerFormValue {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const initialCustomerList: CustomerItem[] = [
  {
    id: "1",
    name: "John Bushmill",
    email: "johnb@mail.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    phone: "078 5054 8877",
    orders: 124,
    balance: "$121.00",
    status: "offline",
    created: "29 Dec 2022",
  },
  {
    id: "2",
    name: "Laura Prichet",
    email: "laura_prichet@mail.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    phone: "215 302 3376",
    orders: 45,
    balance: "$590.00",
    status: "online",
    created: "24 Dec 2022",
  },
  {
    id: "3",
    name: "Susan William",
    email: "susanwil@mail.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    phone: "050 414 8778",
    orders: 984,
    balance: "$125.00",
    status: "offline",
    created: "12 Dec 2022",
  },
  {
    id: "4",
    name: "Josh Bill",
    email: "josh_bill@mail.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    phone: "216 75 612 706",
    orders: 99,
    balance: "$348.00",
    status: "online",
    created: "21 Oct 2022",
  },
  {
    id: "5",
    name: "Josh Adam",
    email: "josh_adam@mail.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    phone: "02 75 150 655",
    orders: 1540,
    balance: "$607.00",
    status: "online",
    created: "21 Oct 2022",
  },
  {
    id: "6",
    name: "Jennifer Patricia",
    email: "jennpat@mail.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
    phone: "078 6013 3854",
    orders: 431,
    balance: "$234.00",
    status: "online",
    created: "21 Oct 2022",
  },
  {
    id: "7",
    name: "Rajesh Masvidal",
    email: "rajesh_m@mail.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
    phone: "828 216 2190",
    orders: 36,
    balance: "$760.00",
    status: "offline",
    created: "19 Sep 2022",
  },
  {
    id: "8",
    name: "Fajar Surya",
    email: "fsurya@mail.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face",
    phone: "078 7173 9261",
    orders: 77,
    balance: "$400.00",
    status: "online",
    created: "19 Sep 2022",
  },
  {
    id: "9",
    name: "Lisa Greg",
    email: "lisag@mail.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    phone: "077 6157 4248",
    orders: 89,
    balance: "$812.00",
    status: "online",
    created: "19 Sep 2022",
  },
  {
    id: "10",
    name: "Linda Blair",
    email: "lindablair@mail.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&h=80&fit=crop&crop=face",
    phone: "050 414 8778",
    orders: 1296,
    balance: "$723.00",
    status: "offline",
    created: "10 Aug 2022",
  },
];

export default function CustomersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [customerList, setCustomerList] =
    useState<CustomerItem[]>(initialCustomerList);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CustomerItem | null>(null);
  const [uploadedProfileImageUrl, setUploadedProfileImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addCustomerFormValue, setAddCustomerFormValue] =
    useState<AddCustomerFormValue>({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

  const updateFormField = useCallback(
    (field: keyof AddCustomerFormValue, value: string) => {
      setAddCustomerFormValue((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleOpenDeleteModal = useCallback((record: CustomerItem) => {
    setDeleteTarget(record);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteTarget(null);
    setIsDeleteModalOpen(false);
  }, []);

  const handleDeleteCustomer = useCallback((customerId: string) => {
    setCustomerList((prev) => prev.filter((item) => item.id !== customerId));
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
    if (uploadedProfileImageUrl) {
      URL.revokeObjectURL(uploadedProfileImageUrl);
    }
    setUploadedProfileImageUrl("");
    setAddCustomerFormValue({ name: "", email: "", phone: "", address: "" });
  }, [uploadedProfileImageUrl]);

  const handleSubmitAddCustomer = useCallback(() => {
    handleCloseAddModal();
  }, [handleCloseAddModal]);

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

  const columns = useMemo<ColumnDef<CustomerItem>[]>(
    () => [
      {
        key: "name",
        header: "Customer Name",
        sortable: true,
        width: "w-60",
        render: (row) => (
          <div
            className="cursor-pointer"
            onClick={() => router.push(`/templates/ecommerce/customers/${row.id}`)}
          >
            <CellImageText
              src={row.avatarUrl}
              title={row.name}
              subtitle={row.email}
              rounded="full"
            />
          </div>
        ),
      },
      {
        key: "phone",
        header: "Phone",
        sortable: false,
        width: "w-40",
        render: (row) => <CellMuted>{row.phone}</CellMuted>,
      },
      {
        key: "orders",
        header: "Orders",
        sortable: true,
        width: "w-28",
        render: (row) => <CellText>{row.orders.toLocaleString()}</CellText>,
      },
      {
        key: "balance",
        header: "Balance",
        sortable: true,
        width: "w-28",
        render: (row) => <CellText>{row.balance}</CellText>,
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        width: "w-28",
        render: (row) => (
          <StatusBadge
            label={row.status === "online" ? "Online" : "Offline"}
            color={row.status === "online" ? "green" : "red"}
          />
        ),
      },
      {
        key: "created",
        header: "Created",
        sortable: false,
        width: "w-32",
        render: (row) => <CellMuted>{row.created}</CellMuted>,
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
              <PhoneCallingLinear size={16} />
            </IconButton>
            <IconButton variant="ghost" shape="square" size="sm">
              <ChatRoundLinear size={16} />
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
    [handleOpenDeleteModal]
  );

  const totalPages = Math.ceil(100 / 10);

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <ConfirmationDialog
            title="Delete Customer?"
            description="Do you want to delete this customer? This action can't be undone"
            color="red"
            icon={<TrashBinMinimalisticLinear size={32} color="#EA580C" />}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onCancel={handleCloseDeleteModal}
            onConfirm={() => {
              if (!deleteTarget) return;
              handleDeleteCustomer(deleteTarget.id);
              handleCloseDeleteModal();
            }}
          />
        </div>
      )}

      {/* Add Customer Modal */}
      <Modal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Add Customer"
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
              label="Name"
              placeholder="Type name here..."
              value={addCustomerFormValue.name}
              shape="pill"
              onChange={(val) => updateFormField("name", val)}
            />
            <TextField
              label="Email"
              placeholder="Type email here..."
              value={addCustomerFormValue.email}
              shape="pill"
              onChange={(val) => updateFormField("email", val)}
            />
            <TextField
              label="Phone"
              placeholder="Type phone here..."
              value={addCustomerFormValue.phone}
              shape="pill"
              onChange={(val) => updateFormField("phone", val)}
            />
            <TextArea
              label="Address"
              placeholder="Type address here..."
              value={addCustomerFormValue.address}
              rows={4}
              onChange={(val) => updateFormField("address", val)}
            />
          </div>
        </div>
        <div className="px-6 pb-6 flex items-center justify-between">
          <Button variant="tertiary" onClick={handleCloseAddModal}>
            Cancel
          </Button>
          <Button onClick={handleSubmitAddCustomer}>Submit</Button>
        </div>
      </Modal>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold text-fg-black leading-9 tracking-fg">Customers</h1>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/templates/ecommerce" },
              { label: "Customers" },
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
        rows={customerList}
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
            setSelectedRows(new Set(customerList.map((_, i) => i)));
          } else {
            setSelectedRows(new Set());
          }
        }}
        showPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        paginationLabel={`Showing 1-10 from 100`}
      />
    </div>
  );
}
