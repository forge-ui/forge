"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Breadcrumbs,
  Button,
  IconButton,
} from "@forge-ui/react";
import {
  PlainLinear,
  DownloadMinimalisticLinear,
  PrinterLinear,
  PenLinear,
  ArrowLeftLinear,
} from "solar-icon-set";

interface InvoiceLineItem {
  key: string;
  name: string;
  tags: string[];
  sku: string;
  priceLine: string;
  total: string;
  imageUrl: string;
}

interface SummaryRow {
  label: string;
  value: string;
}

const defaultLineItems: InvoiceLineItem[] = [
  {
    key: "1",
    name: "Smartwatch E2",
    tags: ["Black"],
    sku: "#302012",
    priceLine: "1 x $590.00",
    total: "$590.00",
    imageUrl: "https://placehold.co/64x64/f8f8f8/333",
  },
  {
    key: "2",
    name: "Headphone G1 Pro",
    tags: ["Black", "Wired"],
    sku: "#302012",
    priceLine: "1 x $348.00",
    total: "$348.00",
    imageUrl: "https://placehold.co/64x64/f8f8f8/333",
  },
  {
    key: "3",
    name: "Smartwatch E1",
    tags: ["Black"],
    sku: "#302012",
    priceLine: "1 x $125.00",
    total: "$125.00",
    imageUrl: "https://placehold.co/64x64/f8f8f8/333",
  },
];

const summaryRows: SummaryRow[] = [
  { label: "Subtotal", value: "$1,063.00" },
  { label: "Discount Black Friday", value: "-$63.00" },
  { label: "Shipping (Regular)", value: "$25.00" },
  { label: "Insurance", value: "$00.00" },
  { label: "Tax (5%)", value: "$51.25" },
];

const invoiceId = "INV093182";
const customerName = "Josh Adam";
const addressLine = "1833 Bel Meadow Drive, Fontana, California 92335, USA";

export default function OrderInvoicePage() {
  const params = useParams();
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <IconButton variant="tertiary" color="purple" shape="circle" onClick={() => window.history.back()}>
              <ArrowLeftLinear size={16} />
            </IconButton>
            <h1 className="text-display-l font-semibold text-fg-black leading-9 tracking-fg">{invoiceId}</h1>
          </div>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/templates/ecommerce" },
              { label: "Orders", href: "/templates/ecommerce/orders" },
              { label: "Order Details", href: `/templates/ecommerce/orders/${params.id}` },
              { label: `Invoice ${invoiceId}` },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-4 items-stretch">
        {/* Invoice content */}
        <div className="flex-1 min-w-0 rounded-card outline outline-1 outline-fg-grey-200 bg-white overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between pt-10 px-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 h-[34px]">
                <div className="w-[34px] h-[34px] flex items-center justify-center bg-fg-violet rounded-lg">
                  <span className="text-white font-bold text-sm">Z</span>
                </div>
                <span className="text-2xl font-semibold text-fg-black">
                  Zello
                </span>
              </div>
              <div className="text-base text-fg-grey-700 max-w-[232px]">
                <p className="mb-0">
                  4350 Whitetail Lane, Dallas, Texas, 75202 USA
                </p>
                <p className="mb-0">+1 (469) 227 9044</p>
              </div>
            </div>
            <p className="text-2xl font-semibold text-fg-black">
              Invoice
            </p>
          </div>

          {/* Body */}
          <div className="p-10 flex flex-col gap-10">
            {/* Bill to / Ship to / IDs */}
            <div className="flex gap-8 flex-wrap items-start">
              <div className="flex-1 min-w-[200px] flex flex-col gap-1.5 text-sm font-medium">
                <p className="text-fg-grey-700 mb-0">Bill to</p>
                <p className="text-fg-black mb-0">{customerName}</p>
                <p className="text-fg-black mb-0">{addressLine}</p>
              </div>
              <div className="flex-1 min-w-[200px] flex flex-col gap-1.5 text-sm font-medium">
                <p className="text-fg-grey-700 mb-0">Ship to</p>
                <p className="text-fg-black mb-0">{customerName}</p>
                <p className="text-fg-black mb-0">{addressLine}</p>
              </div>
              <div className="flex-1 min-w-[200px] flex flex-col gap-2.5">
                <div className="flex gap-2 items-start w-full">
                  <span className="flex-1 text-sm font-medium text-fg-grey-700">
                    Invoice ID
                  </span>
                  <span className="w-[116px] text-sm font-medium text-fg-black">
                    {invoiceId}
                  </span>
                </div>
                <div className="flex gap-2 items-start w-full">
                  <span className="flex-1 text-sm font-medium text-fg-grey-700">
                    Shipment ID
                  </span>
                  <span className="w-[116px] text-sm font-medium text-fg-black">
                    SHP-2011REG
                  </span>
                </div>
                <div className="flex gap-2 items-start w-full">
                  <span className="flex-1 text-sm font-medium text-fg-grey-700">
                    Date
                  </span>
                  <span className="w-[116px] text-sm font-medium text-fg-black">
                    2022-12-12
                  </span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="w-full overflow-hidden rounded-2xl outline outline-1 outline-fg-grey-200 bg-white">
              <div className="flex items-center bg-white px-6 py-4 border-b border-fg-grey-200">
                <h2 className="text-lg font-semibold text-fg-black m-0">
                  Items
                </h2>
              </div>
              <div className="flex flex-col gap-6 px-6 py-4">
                {defaultLineItems.map((item, index) => (
                  <div key={item.key}>
                    {index > 0 && (
                      <div className="h-px w-full bg-fg-grey-200 mb-6" />
                    )}
                    <div className="flex gap-4 items-center w-full flex-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-fg-grey-100"
                      />
                      <div className="flex-1 min-w-[180px]">
                        <p className="text-sm font-medium text-fg-black truncate m-0">
                          {item.name}
                        </p>
                        {item.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 rounded-full outline outline-1 outline-fg-grey-200 bg-gray-50 text-xs font-semibold text-fg-grey-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-[80px]">
                        <p className="text-xs text-fg-grey-700 m-0">SKU</p>
                        <p className="text-sm font-medium text-fg-grey-900 mt-2 m-0">
                          {item.sku}
                        </p>
                      </div>
                      <div className="flex-1 min-w-[80px]">
                        <p className="text-xs text-fg-grey-700 m-0">Price</p>
                        <p className="text-sm font-medium text-fg-grey-900 mt-2 m-0">
                          {item.priceLine}
                        </p>
                      </div>
                      <div className="flex-1 min-w-[80px] max-w-[100px] text-right">
                        <p className="text-xs text-fg-grey-700 m-0">Total</p>
                        <p className="text-sm font-semibold text-fg-black mt-2 m-0">
                          {item.total}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="w-full flex justify-end">
              <div className="w-full max-w-[400px] flex flex-col gap-5">
                {summaryRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex gap-2 items-center text-sm"
                  >
                    <span className="flex-1 text-fg-grey-700 font-medium">
                      {row.label}
                    </span>
                    <span className="font-semibold text-fg-black whitespace-nowrap">
                      {row.value}
                    </span>
                  </div>
                ))}
                <div className="h-px bg-fg-grey-200 w-full" />
                <div className="flex gap-2 items-center text-base font-semibold text-fg-black">
                  <span className="flex-1">Total</span>
                  <span className="whitespace-nowrap">$1,076.25</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-fg-grey-200 px-10 py-8">
            <p className="text-sm text-fg-grey-700 text-center m-0">
              Should you have inquiries concerning this invoice, please contact
              Martha on +1 (469) 227 9044
            </p>
          </div>
        </div>

        {/* Right sidebar buttons */}
        <div className="w-[266px] rounded-card outline outline-1 outline-fg-grey-200 bg-white p-6 flex flex-col gap-4">
          <Button
            iconLeft={<PlainLinear size={20} color="#fff" />}
            className="w-full"
          >
            Send Invoice
          </Button>
          <Button
            variant="tertiary"
            iconLeft={<DownloadMinimalisticLinear size={20} />}
            className="w-full"
          >
            Download Invoice
          </Button>
          <Button
            variant="tertiary"
            iconLeft={<PrinterLinear size={20} />}
            className="w-full"
            onClick={handlePrint}
          >
            Print Invoice
          </Button>
          <Button
            variant="tertiary"
            iconLeft={<PenLinear size={20} />}
            className="w-full"
          >
            Edit Invoice
          </Button>
        </div>
      </div>
    </>
  );
}
