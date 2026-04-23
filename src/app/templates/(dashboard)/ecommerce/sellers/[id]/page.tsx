"use client";

import { useState, useMemo } from "react";
import {
  DataTable,
  CellImageText,
  CellText,
  CellMuted,
  StatusBadge,
  StatCard,
  Button,
  IconButton,
  Breadcrumbs,
  TabBar,
  ReviewItem,
  ToolbarSearchInput,
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
  CopyLinear,
  StarBold,
} from "solar-icon-set";

// --- Types ---

interface OrderRowItem {
  id: string;
  productName: string;
  subText: string;
  imageUrl: string;
  grandTotal: string;
  status: "processing" | "canceled" | "shipped" | "delivered";
}

interface SellerProductRowItem {
  id: string;
  productName: string;
  variantLabel: string;
  imageUrl: string;
  stock: number;
  price: string;
  status: "low_stock" | "published" | "draft" | "sold_out";
}

interface SellerReviewItem {
  id: string;
  reviewerName: string;
  reviewedAt: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  attachments?: string[];
  moreCount?: number;
}

type AttachmentKind = "image" | "wav" | "zip" | "pdf" | "mp4";

interface SellerAttachmentItem {
  id: string;
  fileName: string;
  fileSize: string;
  kind: AttachmentKind;
  previewUrl?: string;
}

// --- Status maps ---

const orderStatusColorMap: Record<OrderRowItem["status"], "yellow" | "red" | "cyan" | "green"> = {
  processing: "yellow",
  canceled: "red",
  shipped: "cyan",
  delivered: "green",
};

const orderStatusLabelMap: Record<OrderRowItem["status"], string> = {
  processing: "Processing",
  canceled: "Canceled",
  shipped: "Shipped",
  delivered: "Delivered",
};

const productStatusColorMap: Record<SellerProductRowItem["status"], "yellow" | "green" | "grey" | "red"> = {
  low_stock: "yellow",
  published: "green",
  draft: "grey",
  sold_out: "red",
};

const productStatusLabelMap: Record<SellerProductRowItem["status"], string> = {
  low_stock: "Low Stock",
  published: "Published",
  draft: "Draft",
  sold_out: "Sold Out",
};

// --- Mock Data ---

const productImages = [
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=64&h=64&fit=crop",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=64&h=64&fit=crop",
  "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=64&h=64&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=64&h=64&fit=crop",
  "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=64&h=64&fit=crop",
];

const orderRowsSource: OrderRowItem[] = [
  { id: "1", productName: "Handmade Pouch", subText: "+3 other products", imageUrl: productImages[0], grandTotal: "$121.00", status: "processing" },
  { id: "2", productName: "Smartwatch E2", subText: "+1 other products", imageUrl: productImages[1], grandTotal: "$590.00", status: "processing" },
  { id: "3", productName: "Smartwatch E1", subText: "", imageUrl: productImages[2], grandTotal: "$125.00", status: "canceled" },
  { id: "4", productName: "Headphone G1 Pro", subText: "+1 other products", imageUrl: productImages[3], grandTotal: "$348.00", status: "shipped" },
  { id: "5", productName: "Iphone X", subText: "", imageUrl: productImages[4], grandTotal: "$607.00", status: "delivered" },
];

const sellerProductRows: SellerProductRowItem[] = [
  { id: "p1", productName: "Handmade Pouch", variantLabel: "3 Variants", imageUrl: productImages[0], stock: 10, price: "$121.00", status: "low_stock" },
  { id: "p2", productName: "Smartwatch E2", variantLabel: "2 Variants", imageUrl: productImages[1], stock: 204, price: "$590.00", status: "published" },
  { id: "p3", productName: "Smartwatch E1", variantLabel: "3 Variants", imageUrl: productImages[2], stock: 48, price: "$125.00", status: "draft" },
  { id: "p4", productName: "Headphone G1 Pro", variantLabel: "1 Variants", imageUrl: productImages[3], stock: 401, price: "$348.00", status: "published" },
  { id: "p5", productName: "Iphone X", variantLabel: "4 Variants", imageUrl: productImages[4], stock: 0, price: "$607.00", status: "sold_out" },
];

const reviewComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl dui, fringilla ac venenatis ut, varius at arcu. Duis non mollis nisl.";

const reviewAvatars = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
];

const sellerReviews: SellerReviewItem[] = [
  { id: "r1", reviewerName: "Sin Tae", reviewedAt: "20 Des 2022, 08:00", avatarUrl: reviewAvatars[0], rating: 5, comment: reviewComment, attachments: [productImages[0], productImages[1], productImages[2]], moreCount: 3 },
  { id: "r2", reviewerName: "Peg Legge", reviewedAt: "20 Des 2022, 08:00", avatarUrl: reviewAvatars[1], rating: 2, comment: reviewComment },
  { id: "r3", reviewerName: "Jack Thompson", reviewedAt: "20 Des 2022, 08:00", avatarUrl: reviewAvatars[2], rating: 4, comment: reviewComment, attachments: [productImages[0], productImages[1], productImages[2]], moreCount: 3 },
  { id: "r4", reviewerName: "Rita Book", reviewedAt: "20 Des 2022, 08:00", avatarUrl: reviewAvatars[3], rating: 5, comment: reviewComment, attachments: [productImages[0], productImages[1], productImages[2]], moreCount: 3 },
];

const attachmentBadgeStyles: Record<Exclude<AttachmentKind, "image">, { wrapper: string; label: string }> = {
  wav: { wrapper: "bg-indigo-100", label: "bg-indigo-500 text-white" },
  zip: { wrapper: "bg-amber-100", label: "bg-amber-500 text-white" },
  pdf: { wrapper: "bg-rose-100", label: "bg-fg-red text-white" },
  mp4: { wrapper: "bg-purple-100", label: "bg-fg-violet text-white" },
};

const sellerAttachments: SellerAttachmentItem[] = [
  { id: "a1", fileName: "File Name", fileSize: "100 KB", kind: "image", previewUrl: productImages[0] },
  { id: "a2", fileName: "File Name", fileSize: "100 KB", kind: "wav" },
  { id: "a3", fileName: "File Name", fileSize: "100 KB", kind: "image", previewUrl: productImages[3] },
  { id: "a4", fileName: "File Name", fileSize: "100 KB", kind: "zip" },
  { id: "a5", fileName: "File Name", fileSize: "100 KB", kind: "image", previewUrl: productImages[4] },
  { id: "a6", fileName: "File Name", fileSize: "100 KB", kind: "pdf" },
  { id: "a7", fileName: "File Name", fileSize: "100 KB", kind: "image", previewUrl: productImages[2] },
  { id: "a8", fileName: "File Name", fileSize: "100 KB", kind: "mp4" },
  { id: "a9", fileName: "File Name", fileSize: "100 KB", kind: "zip" },
];

const sellerTabs = ["Orders", "Product", "Reviews", "Attachment"] as const;
type SellerTabKey = (typeof sellerTabs)[number];

// --- Component ---

export default function SellerDetailPage() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = sellerTabs[activeTabIndex];
  const [orderPage, setOrderPage] = useState(1);
  const [productPage, setProductPage] = useState(1);

  const display = {
    storeName: "Linda Store",
    avatarUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&crop=face",
    userId: "ID011221",
    ownerName: "Laura Adams",
    email: "lindablair@mail.com",
    phone: "050 414 8788",
    address: "1833 Bel Meadow Drive, Fontana, California 92335, USA",
    lastOrder: "1 min ago",
    added: "12 January 2023",
    storeHandle: "linda_store",
  };

  const statCards = [
    { title: "Total Order", value: "1,296", theme: "white" as const },
    { title: "Earned", value: "$1,200", theme: "white" as const },
    { title: "Canceled", value: "$1,200", theme: "white" as const },
  ];

  const orderColumns = useMemo<ColumnDef<OrderRowItem>[]>(
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
            label={orderStatusLabelMap[row.status]}
            color={orderStatusColorMap[row.status]}
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

  const productColumns = useMemo<ColumnDef<SellerProductRowItem>[]>(
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
            subtitle={row.variantLabel}
          />
        ),
      },
      {
        key: "stock",
        header: "Stock",
        sortable: true,
        width: "w-28",
        render: (row) => <CellText>{row.stock}</CellText>,
      },
      {
        key: "price",
        header: "Price",
        sortable: true,
        width: "w-28",
        render: (row) => <CellText>{row.price}</CellText>,
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        width: "w-28",
        render: (row) => (
          <StatusBadge
            label={productStatusLabelMap[row.status]}
            color={productStatusColorMap[row.status]}
          />
        ),
      },
      {
        key: "actions",
        header: "",
        width: "w-16",
        render: () => (
          <div className="flex items-center justify-center h-10">
            <IconButton variant="ghost" shape="square" size="sm" className="rotate-90">
              <MenuDotsBold size={16} />
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // silently fail
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold text-fg-black leading-9 tracking-fg">
            Seller Details
          </h1>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/templates/ecommerce" },
              { label: "Seller", href: "/templates/ecommerce/sellers" },
              { label: "Seller Details" },
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
        {/* Left Sidebar */}
        <div className="w-[336px] rounded-card border border-fg-grey-200 bg-white p-6 overflow-hidden relative">
          <div className="absolute left-[7px] top-[7px] h-[109px] w-[320px] rounded-xl bg-gradient-to-r from-fg-violet via-purple-300 to-fg-yellow-100" />

          <div className="relative z-10 flex flex-col items-center gap-3 pt-10">
            <div className="relative">
              <img
                src={display.avatarUrl}
                alt=""
                className="w-[100px] h-[100px] rounded-full object-cover bg-fg-grey-200 border-4 border-white"
              />
              <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center">
                <StarBold size={16} color="#EAB308" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-fg-black">
                {display.storeName}
              </h3>
              <p className="text-sm text-fg-grey-700">
                <span className="text-fg-black">ID:</span>{" "}
                @{display.storeHandle}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-6 grid grid-cols-2 gap-3">
            <Button variant="tertiary" iconLeft={<PhoneCallingLinear size={16} />}>
              Call
            </Button>
            <Button iconLeft={<ChatRoundLinear size={16} />}>Message</Button>
          </div>

          <div className="relative z-10 mt-5 space-y-4 border-t border-fg-grey-200 pt-5">
            <div>
              <p className="text-sm font-semibold text-fg-grey-700">User ID</p>
              <p className="mt-1 text-sm font-medium text-fg-black">{display.userId}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-fg-grey-700">Owner</p>
              <p className="mt-1 text-sm font-medium text-fg-black">{display.ownerName}</p>
            </div>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-fg-grey-700">Email</p>
                <p className="mt-1 text-sm font-medium text-fg-black">{display.email}</p>
              </div>
              <button
                type="button"
                className="mt-6 cursor-pointer border-none bg-transparent p-0 text-fg-grey-500 hover:text-fg-violet transition-colors"
                onClick={() => void copyToClipboard(display.email)}
              >
                <CopyLinear size={18} />
              </button>
            </div>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-fg-grey-700">Phone Number</p>
                <p className="mt-1 text-sm font-medium text-fg-black">{display.phone}</p>
              </div>
              <button
                type="button"
                className="mt-6 cursor-pointer border-none bg-transparent p-0 text-fg-grey-500 hover:text-fg-violet transition-colors"
                onClick={() => void copyToClipboard(display.phone)}
              >
                <CopyLinear size={18} />
              </button>
            </div>
            <div>
              <p className="text-sm font-semibold text-fg-grey-700">Address</p>
              <p className="mt-1 text-sm font-medium text-fg-black">{display.address}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-fg-grey-700">Last Order</p>
              <p className="mt-1 text-sm font-medium text-fg-black">{display.lastOrder}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-fg-grey-700">Added</p>
              <p className="mt-1 text-sm font-medium text-fg-black">{display.added}</p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 min-w-0">
          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            {statCards.map((card) => (
              <StatCard
                key={card.title}
                title={card.title}
                value={card.value}
                trend="10%"
                trendDirection="up"
                subtitle="+$150 today"
                theme={card.theme}
                className="flex-1"
              />
            ))}
          </div>

          {/* Tabbed Content */}
          <div className="mt-4 rounded-card border border-fg-grey-200 bg-white overflow-hidden">
            <TabBar
              tabs={sellerTabs.map((tab, i) => ({
                label: tab,
                active: i === activeTabIndex,
              }))}
              onChange={setActiveTabIndex}
              className="px-5 w-full"
            />

            {/* Orders Tab */}
            {activeTab === "Orders" && (
              <div>
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <ToolbarSearchInput placeholder="Search..." />
                  <div className="flex items-center gap-3">
                    <ToolbarDatepicker enablePopover />
                    <ToolbarFilterButton panel={(close) => <MockFilterPanel close={close} />} />
                  </div>
                </div>
                <DataTable
                  columns={orderColumns}
                  rows={orderRowsSource}
                  showPagination
                  currentPage={orderPage}
                  totalPages={Math.ceil(1296 / 5)}
                  onPageChange={setOrderPage}
                  paginationLabel="Showing 1-5 from 1,296"
                />
              </div>
            )}

            {/* Product Tab */}
            {activeTab === "Product" && (
              <div>
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <ToolbarSearchInput placeholder="Search..." />
                  <div className="flex items-center gap-3">
                    <ToolbarDatepicker enablePopover />
                    <ToolbarFilterButton panel={(close) => <MockFilterPanel close={close} />} />
                  </div>
                </div>
                <DataTable
                  columns={productColumns}
                  rows={sellerProductRows}
                  showPagination
                  currentPage={productPage}
                  totalPages={Math.ceil(100 / 5)}
                  onPageChange={setProductPage}
                  paginationLabel="Showing 1-5 from 100"
                />
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "Reviews" && (
              <div>
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <ToolbarSearchInput placeholder="Search..." />
                  <div className="flex items-center gap-3">
                    <ToolbarFilterButton panel={(close) => <MockFilterPanel close={close} />} />
                  </div>
                </div>
                <div className="flex flex-col gap-4 px-5 pb-5">
                  {sellerReviews.map((review) => (
                    <ReviewItem
                      key={review.id}
                      avatar={review.avatarUrl}
                      name={review.reviewerName}
                      date={review.reviewedAt}
                      rating={review.rating}
                      content={review.comment}
                      images={review.attachments}
                      overflowImageCount={review.moreCount}
                      variant="card"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Attachment Tab */}
            {activeTab === "Attachment" && (
              <div>
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <ToolbarSearchInput placeholder="Search..." />
                  <div className="flex items-center gap-3">
                    <ToolbarFilterButton panel={(close) => <MockFilterPanel close={close} />} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 px-5 pb-5">
                  {sellerAttachments.map((item) => (
                    <div
                      key={item.id}
                      className="relative rounded-2xl border border-fg-grey-200 bg-white p-1 pb-5"
                    >
                      {/* Checkbox placeholder */}
                      <div className="absolute left-4 top-4 h-5 w-5 rounded-md border-2 border-gray-300 bg-white" />
                      {/* Kebab */}
                      <button
                        type="button"
                        className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center text-fg-grey-500 cursor-pointer rotate-90"
                      >
                        <MenuDotsBold size={16} />
                      </button>
                      {/* Preview */}
                      <div className="h-44 w-full overflow-hidden rounded-t-xl bg-fg-grey-100">
                        {item.kind === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.previewUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div
                            className={`flex h-full items-center justify-center ${attachmentBadgeStyles[item.kind].wrapper}`}
                          >
                            <div
                              className={`rounded-lg px-2.5 py-1 text-2xl font-bold ${attachmentBadgeStyles[item.kind].label}`}
                            >
                              {item.kind.toUpperCase()}
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="mt-4 px-5 text-center">
                        <p className="truncate text-base font-semibold text-fg-black">
                          {item.fileName}
                        </p>
                        <p className="mt-1 text-sm text-fg-grey-700">
                          {item.fileSize}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
