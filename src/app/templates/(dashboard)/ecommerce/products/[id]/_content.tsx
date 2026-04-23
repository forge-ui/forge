"use client";

import { useState } from "react";
import {
  PenNewSquareLinear,
  MenuDotsBold,
  MagniferLinear,
  StarBold,
  ArrowLeftLinear,
} from "solar-icon-set";
import {
  Breadcrumbs,
  Button,
  IconButton,
  TabBar,
  DataTable,
  StatusBadge,
  CellText,
  CellTextSubtitle,
  CellMuted,
  CellKebabMenu,
  CellImageText,
} from "@forge-ui/react";
import type { ColumnDef, StatusBadgeColor } from "@forge-ui/react";

// --- Data types ---

interface ProductOrderItem {
  id: string;
  date: string;
  customer: string;
  email: string;
  total: string;
  payment: string;
  status: "Processing" | "Shiped" | "Canceled" | "Delivered";
}

interface ProductReview {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductMessage {
  id: string;
  customer: string;
  message: string;
  date: string;
}

// --- Mock data ---

const orderList: ProductOrderItem[] = [
  { id: "#302012", date: "1 min ago", customer: "John Bushmill", email: "Johnb@mail.com", total: "$121.00", payment: "Mastercard", status: "Processing" },
  { id: "#302011", date: "1 min ago", customer: "Ilham Budi A", email: "ilahmbudi@mail.com", total: "$590.00", payment: "Visa", status: "Processing" },
  { id: "#302002", date: "5 hour ago", customer: "Mohammad Karim", email: "m_karim@mail.com", total: "$125.00", payment: "Transfer", status: "Shiped" },
  { id: "#301901", date: "1 day ago", customer: "Linda Blair", email: "lindablair@mail.com", total: "$348.00", payment: "Paypal", status: "Canceled" },
  { id: "#301900", date: "2 day ago", customer: "Josh Adam", email: "josh_adam@mail.com", total: "$607.00", payment: "Visa", status: "Delivered" },
  { id: "#301881", date: "5 Jan 2023", customer: "Sin Tae", email: "sin_tae@mail.com", total: "$234.00", payment: "Visa", status: "Canceled" },
  { id: "#301643", date: "1 Jan 2023", customer: "Rajesh Masvidal", email: "rajesh_m@mail.com", total: "$760.00", payment: "Transfer", status: "Shiped" },
  { id: "#301600", date: "24 Dec 2022", customer: "Fajar Surya", email: "fsurya@mail.com", total: "$400.00", payment: "Mastercard", status: "Delivered" },
  { id: "#301555", date: "2 Dec 2022", customer: "Francis Greg", email: "francisg@mail.com", total: "$812.00", payment: "Paypal", status: "Delivered" },
  { id: "#301002", date: "2 Dec 2022", customer: "Linda Blair", email: "lindablair@mail.com", total: "$123.00", payment: "Paypal", status: "Canceled" },
];

const reviewList: ProductReview[] = [
  { id: "1", customer: "John Bushmill", rating: 5, comment: "Great smartwatch, love the design and battery life.", date: "2 Jan 2023" },
  { id: "2", customer: "Ilham Budi A", rating: 4, comment: "Good product, notifications work well.", date: "28 Dec 2022" },
  { id: "3", customer: "Mohammad Karim", rating: 3, comment: "Decent watch, could improve the screen brightness.", date: "20 Dec 2022" },
];

const messageList: ProductMessage[] = [
  { id: "1", customer: "John Bushmill", message: "Is this watch waterproof?", date: "5 min ago" },
  { id: "2", customer: "Linda Blair", message: "When will the red variant be back in stock?", date: "1 hour ago" },
  { id: "3", customer: "Josh Adam", message: "Can I get a discount for buying 5 units?", date: "3 hours ago" },
  { id: "4", customer: "Sin Tae", message: "Does it come with a warranty?", date: "1 day ago" },
];

const imageList = [
  "https://placehold.co/312x312/e2e8f0/64748b?text=Watch+1",
  "https://placehold.co/312x312/e2e8f0/64748b?text=Watch+2",
  "https://placehold.co/312x312/e2e8f0/64748b?text=Watch+3",
  "https://placehold.co/312x312/e2e8f0/64748b?text=Watch+4",
];

const orderStatusMap: Record<ProductOrderItem["status"], { label: string; color: StatusBadgeColor }> = {
  Processing: { label: "Processing", color: "yellow" },
  Shiped: { label: "Shipped", color: "green" },
  Canceled: { label: "Canceled", color: "red" },
  Delivered: { label: "Delivered", color: "green" },
};

const tabItems = [
  { label: "Details", active: true },
  { label: "Orders", active: false },
  { label: "Reviews", active: false },
  { label: "Messages", active: false },
];

export default function ProductDetailPage() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [orderPage, setOrderPage] = useState(1);

  const tabs = tabItems.map((tab, i) => ({
    ...tab,
    active: i === activeTabIndex,
  }));

  const activeTabValue = ["details", "orders", "reviews", "messages"][activeTabIndex];

  const orderColumns: ColumnDef<ProductOrderItem>[] = [
    {
      key: "id",
      header: "Order ID",
      sortable: true,
      width: "w-[120px]",
      render: (row) => <CellText>{row.id}</CellText>,
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
      width: "w-[120px]",
      render: (row) => <CellMuted>{row.date}</CellMuted>,
    },
    {
      key: "customer",
      header: "Customer",
      sortable: true,
      width: "w-60",
      render: (row) => <CellTextSubtitle title={row.customer} subtitle={row.email} />,
    },
    {
      key: "total",
      header: "Total",
      sortable: true,
      width: "w-[100px]",
      render: (row) => <CellText>{row.total}</CellText>,
    },
    {
      key: "payment",
      header: "Payment",
      sortable: true,
      width: "w-[120px]",
      render: (row) => <CellMuted>{row.payment}</CellMuted>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "w-[130px]",
      render: (row) => {
        const meta = orderStatusMap[row.status];
        return <StatusBadge label={meta.label} color={meta.color} />;
      },
    },
    {
      key: "actions",
      header: "",
      width: "w-[60px]",
      render: () => <CellKebabMenu />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold text-fg-black leading-9 tracking-fg">Product Details</h1>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/templates/ecommerce" },
              { label: "Product", href: "/templates/ecommerce/products" },
              { label: "Smartwatch E2" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button iconLeft={<PenNewSquareLinear size={16} />} onClick={() => {}}>
            Edit
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <TabBar tabs={tabs} onChange={setActiveTabIndex} />

      {/* Details Tab */}
      {activeTabValue === "details" && (
        <div className="flex items-start gap-4">
          {/* Image Gallery */}
          <div className="w-[360px] p-6 bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex flex-col gap-6">
            <div className="relative">
              <img
                src={imageList[activeImageIndex]}
                alt="product-preview"
                className="w-full aspect-square rounded-3xl object-cover"
              />
              <button
                type="button"
                className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white outline outline-1 outline-fg-grey-200 flex items-center justify-center cursor-pointer"
              >
                <MagniferLinear size={20} className="text-fg-grey-700" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              {imageList.map((imgUrl, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 cursor-pointer ${
                    index === activeImageIndex ? "border-fg-violet" : "border-transparent"
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img src={imgUrl} alt={`thumb-${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex items-center justify-center gap-1.5">
              {imageList.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 rounded-full ${
                    index === activeImageIndex ? "w-5 bg-fg-violet" : "w-2 bg-fg-grey-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 p-6 bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex flex-col gap-6">
            <div className="relative">
              <h2 className="text-display-l font-semibold text-fg-black mb-4">Smartwatch E2</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-fg-grey-700">Sold:</span>
                <span className="text-fg-black font-medium">1,316</span>
                <span className="text-gray-200">|</span>
                <span className="text-fg-grey-700">Rating:</span>
                <StarBold size={14} color="#F9C80E" />
                <span className="text-fg-black font-medium">4.5/5</span>
                <span className="text-gray-200">|</span>
                <span className="text-fg-grey-700">Stock:</span>
                <span className="text-fg-black font-medium">140</span>
                <span className="text-gray-200">|</span>
                <span className="text-fg-grey-700">Message:</span>
                <span className="text-fg-black font-medium">25</span>
              </div>
              <span className="absolute top-0 right-0">
                <StatusBadge label="Published" color="green" />
              </span>
            </div>

            <p className="text-display-l font-semibold text-fg-black">$400.00</p>
            <div className="h-px bg-fg-grey-200" />

            <div className="flex flex-col gap-3">
              <p className="text-base font-medium text-fg-black">Color Variant:</p>
              <div className="flex items-center gap-2">
                {[
                  { name: "Black", color: "bg-fg-black" },
                  { name: "Gray", color: "bg-fg-grey-500" },
                  { name: "Red", color: "bg-fg-red" },
                ].map((variant) => (
                  <div
                    key={variant.name}
                    className="h-10 px-3 pr-3.5 rounded-lg outline outline-1 outline-fg-grey-200 inline-flex items-center gap-1"
                  >
                    <span className={`w-5 h-5 rounded-full ${variant.color}`} />
                    <span className="text-sm font-semibold text-fg-grey-700">{variant.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-base font-medium text-fg-black">Description:</p>
              <p className="text-base text-fg-grey-700 leading-6">
                Smartwatch for men women notify you incoming calls, SMS
                notifications. when you connect the smartphone with fitness
                tracker. Connect fitness tracker with your phone, you will never
                miss a call and a message. The smart watches for android phones
                will vibrate to alert you if your phone receives any
                notifications. You can reject calls and view message directly
                from your watch. A best gift for family and friends
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-base font-medium text-fg-black">Weight & Dimension:</p>
              <p className="text-base text-fg-grey-700">0.25kg / 10 CM,10 CM,7 CM (H,L,W)</p>
            </div>

            <div className="h-px bg-fg-grey-200" />
            <div className="flex items-center justify-between text-sm font-medium">
              <div className="flex items-center gap-1">
                <span className="text-fg-grey-700">SKU:</span>
                <span className="text-fg-black">#302012</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-fg-grey-700">Created:</span>
                <span className="text-fg-black">14 January 2022</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTabValue === "orders" && (
        <DataTable<ProductOrderItem>
          columns={orderColumns}
          rows={orderList}
          showPagination
          currentPage={orderPage}
          totalPages={5}
          onPageChange={setOrderPage}
          paginationLabel={`Showing 1-${orderList.length} from 1,400`}
        />
      )}

      {/* Reviews Tab */}
      {activeTabValue === "reviews" && (
        <div className="bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6 flex flex-col gap-6">
          <h3 className="text-xl font-semibold text-fg-black">Customer Reviews</h3>
          <div className="flex flex-col gap-4">
            {reviewList.map((review) => (
              <div key={review.id} className="p-4 rounded-xl outline outline-1 outline-fg-grey-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-fg-black">{review.customer}</span>
                  <span className="text-xs text-fg-grey-700">{review.date}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarBold key={i} size={14} color={i < review.rating ? "#F9C80E" : "#E5E5E5"} />
                  ))}
                </div>
                <p className="text-sm text-fg-grey-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTabValue === "messages" && (
        <div className="bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6 flex flex-col gap-6">
          <h3 className="text-xl font-semibold text-fg-black">Messages</h3>
          <div className="flex flex-col gap-4">
            {messageList.map((msg) => (
              <div key={msg.id} className="p-4 rounded-xl outline outline-1 outline-fg-grey-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-fg-black">{msg.customer}</span>
                  <span className="text-xs text-fg-grey-700">{msg.date}</span>
                </div>
                <p className="text-sm text-fg-grey-700">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
