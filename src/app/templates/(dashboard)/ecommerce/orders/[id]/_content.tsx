"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Breadcrumbs,
  Button,
  IconButton,
  SelectOption,
  Checkbox,
  HistoryItem,
  Label,
  type LabelColor,
} from "@forge-ui/react";
import {
  FileTextBoldDuotone,
  TrashBinTrashLinear,
  EyeBoldDuotone,
  UserBoldDuotone,
  LetterBoldDuotone,
  PhoneBoldDuotone,
  CardBoldDuotone,
  BoxBoldDuotone,
  MapPointBoldDuotone,
  DocumentBoldDuotone,
  MenuDotsLinear,
} from "solar-icon-set";
import { Panel, Modal, InfoRow } from "@/app/templates/_shared";

interface OrderLineItem {
  key: string;
  name: string;
  tags: string[];
  sku: string;
  priceLine: string;
  total: string;
  imageUrl: string;
}

interface SummaryLine {
  label: string;
  value: string;
}

const defaultLineItems: OrderLineItem[] = [
  { key: "1", name: "Smartwatch E2", tags: ["Black"], sku: "#302012", priceLine: "1 x $590.00", total: "$590.00", imageUrl: "https://placehold.co/64x64/f8f8f8/333" },
  { key: "2", name: "Headphone G1 Pro", tags: ["Black", "Wired"], sku: "#302012", priceLine: "1 x $348.00", total: "$348.00", imageUrl: "https://placehold.co/64x64/f8f8f8/333" },
  { key: "3", name: "Smartwatch E1", tags: ["Black"], sku: "#302012", priceLine: "1 x $125.00", total: "$125.00", imageUrl: "https://placehold.co/64x64/f8f8f8/333" },
];

const defaultSummaryLines: SummaryLine[] = [
  { label: "Subtotal", value: "$1,063.00" },
  { label: "Discount Black Friday", value: "-$63.00" },
  { label: "Shipping (Regular)", value: "$25.00" },
  { label: "Insurance", value: "$00.00" },
  { label: "Tax (5%)", value: "$51.25" },
];

const orderStatusOptions = [
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Canceled", value: "canceled" },
];

type OrderStatus = "processing" | "shipped" | "delivered" | "canceled";

const statusLabelColor: Record<OrderStatus, LabelColor> = {
  processing: "yellow",
  shipped: "purple",
  delivered: "green",
  canceled: "red",
};

type TrackingStep = { title: string; color: "green" | "purple" | "gray" };

const trackingSteps: TrackingStep[] = [
  { title: "Order Placed", color: "green" },
  { title: "Payment Succeeded", color: "green" },
  { title: "Confirmed", color: "green" },
  { title: "Processing", color: "green" },
  { title: "Waiting the Courier", color: "purple" },
  { title: "Shipping", color: "gray" },
  { title: "Delivered", color: "gray" },
];

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("processing");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  const lineItems = defaultLineItems;
  const displayCustomerName = "Jay Enderson";
  const displayEmail = "jay.hadgunson@mail.com";
  const displayPhone = "050 414 8788";
  const displayDate = "12 Jan 2024, 10:00";

  const addressLines = [
    "Jay Hadgunson",
    "1833 Bel Meadow Drive, Fontana, California 92335, USA",
  ];

  return (
    <>
      <Modal
        open={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        title="Tracking"
      >
        <div className="p-6 flex flex-col gap-1">
          {trackingSteps.map((step, i) => (
            <HistoryItem
              key={i}
              variant="regular"
              color={step.color}
              title={step.title}
              showConnector={i < trackingSteps.length - 1}
            />
          ))}
        </div>
      </Modal>

      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold text-fg-black leading-10 tracking-fg">Orders</h1>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/templates/ecommerce" },
              { label: "Orders", href: "/templates/ecommerce/orders" },
              { label: "Order Details" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <IconButton variant="tertiary">
            <MenuDotsLinear size={20} />
          </IconButton>
          <Link href={`/templates/ecommerce/orders/${id}/invoice`}>
            <Button iconLeft={<FileTextBoldDuotone size={16} />}>Invoice</Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 flex gap-4 items-start">
        {/* Left column */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Order meta */}
          <Panel>
            <div className="flex gap-6 flex-wrap">
              <div className="flex-1 min-w-[140px]">
                <p className="text-sm font-medium text-fg-grey-700">Status</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Label color={statusLabelColor[orderStatus]} variant="outline" size="sm">
                    {orderStatus[0].toUpperCase() + orderStatus.slice(1)}
                  </Label>
                  <button
                    type="button"
                    onClick={() => setIsTrackingModalOpen(true)}
                    className="p-2 cursor-pointer text-fg-grey-700"
                  >
                    <EyeBoldDuotone size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 min-w-[140px]">
                <p className="text-sm font-medium text-fg-grey-700">Date</p>
                <p className="mt-1.5 text-sm font-medium text-fg-black">{displayDate}</p>
              </div>
              <div className="flex-1 min-w-[140px]">
                <p className="text-sm font-medium text-fg-grey-700">Invoice</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-sm font-medium text-fg-black">INV302012</span>
                  <button type="button" className="p-2 cursor-pointer text-fg-grey-700">
                    <EyeBoldDuotone size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 min-w-[140px]">
                <p className="text-sm font-medium text-fg-grey-700">Items</p>
                <p className="mt-1.5 text-sm font-medium text-fg-black">{lineItems.length} Items</p>
              </div>
            </div>
          </Panel>

          {/* Order items */}
          <Panel title="Order Items">
            <div className="flex flex-col">
              {lineItems.map((item, index) => (
                <div key={item.key}>
                  {index > 0 && <div className="h-px bg-fg-grey-200 my-4" />}
                  <div className="flex gap-4 items-center w-full">
                    <Checkbox
                      checked={selectedKeys.includes(item.key)}
                      onChange={(checked) => {
                        setSelectedKeys((prev) =>
                          checked ? [...prev, item.key] : prev.filter((k) => k !== item.key)
                        );
                      }}
                    />
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-fg-grey-100"
                    />
                    <div className="flex-1 min-w-[180px]">
                      <p className="text-sm font-medium text-fg-black truncate">{item.name}</p>
                      {item.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <Label key={tag} color="gray" variant="outline" size="sm">
                              {tag}
                            </Label>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-[80px]">
                      <p className="text-xs text-fg-grey-700">SKU</p>
                      <p className="text-sm font-medium text-fg-grey-900 mt-2">{item.sku}</p>
                    </div>
                    <div className="flex-1 min-w-[80px]">
                      <p className="text-xs text-fg-grey-700">Price</p>
                      <p className="text-sm font-medium text-fg-grey-900 mt-2">{item.priceLine}</p>
                    </div>
                    <div className="flex-1 min-w-[80px] text-right">
                      <p className="text-xs text-fg-grey-700">Total</p>
                      <p className="text-sm font-semibold text-fg-black mt-2">{item.total}</p>
                    </div>
                    <button
                      type="button"
                      className="p-2 cursor-pointer text-fg-grey-700 hover:text-fg-red"
                    >
                      <TrashBinTrashLinear size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Order summary */}
          <Panel title="Order Summary">
            <div className="flex flex-col gap-4">
              {defaultSummaryLines.map((row) => (
                <div key={row.label} className="flex items-center gap-2 text-sm">
                  <span className="flex-1 text-fg-grey-700 font-medium">{row.label}</span>
                  <span className="font-semibold text-fg-black whitespace-nowrap">{row.value}</span>
                </div>
              ))}
              <div className="h-px bg-fg-grey-200" />
              <div className="flex items-center gap-2 text-base font-semibold text-fg-black">
                <span className="flex-1">Total</span>
                <span className="whitespace-nowrap">$1,076.25</span>
              </div>
            </div>
          </Panel>
        </div>

        {/* Right sidebar */}
        <div className="w-[324px] flex flex-col gap-4">
          {/* General Information */}
          <Panel title="General Information">
            <div className="flex flex-col gap-5">
              <InfoRow icon={<BoxBoldDuotone size={20} />} label="Order Status">
                <SelectOption
                  options={orderStatusOptions}
                  value={orderStatus}
                  onChange={(v) => setOrderStatus(v as OrderStatus)}
                  shape="pill"
                />
              </InfoRow>
              <InfoRow icon={<UserBoldDuotone size={20} />} label="Customer">
                {displayCustomerName}
              </InfoRow>
              <InfoRow icon={<LetterBoldDuotone size={20} />} label="Email">
                <span className="break-all">{displayEmail}</span>
              </InfoRow>
              <InfoRow icon={<PhoneBoldDuotone size={20} />} label="Phone Number">
                {displayPhone}
              </InfoRow>
              <InfoRow icon={<CardBoldDuotone size={20} />} label="Payment Method">
                Bank Transfer - TF109283013123
              </InfoRow>
              <InfoRow icon={<BoxBoldDuotone size={20} />} label="Shipping Method">
                Regular - SHP1092311
              </InfoRow>
            </div>
          </Panel>

          {/* Address */}
          <Panel title="Address">
            <div className="flex flex-col gap-5">
              <InfoRow icon={<MapPointBoldDuotone size={20} />} label="Shipping Address">
                {addressLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </InfoRow>
              <InfoRow icon={<DocumentBoldDuotone size={20} />} label="Billing Address">
                {addressLines.map((line) => (
                  <p key={`bill-${line}`}>{line}</p>
                ))}
              </InfoRow>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
