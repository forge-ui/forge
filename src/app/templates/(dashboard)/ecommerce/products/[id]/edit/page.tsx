"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrashBinMinimalisticLinear,
  ArrowLeftLinear,
} from "solar-icon-set";
import {
  Breadcrumbs,
  Button,
  IconButton,
  TextField,
  TextArea,
  SelectOption,
  MediaUpload,
  Checkbox,
  ConfirmationDialog,
  PlusIcon,
  CloseIcon,
  CheckIcon,
} from "@forge-ui-official/core";

const DEFAULT_DESCRIPTION =
  "Smartwatch for men women notify you incoming calls, SMS notifications. when you connect the smartphone with fitness tracker. Connect fitness tracker with your phone, you will never miss a call and a message. The smart watches for android phones will vibrate to alert you if your phone receives any notifications. You can reject calls and view message directly from your watch. A best gift for family and friends.";

const VARIATIONS = [
  { type: "color", label: "Black", quantity: "90" },
  { type: "color", label: "Grey", quantity: "44" },
  { type: "color", label: "Green", quantity: "40" },
  { type: "color", label: "Red", quantity: "24" },
];

export default function EditProductPage() {
  const router = useRouter();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const [name, setName] = useState("Smartwatch E2");
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [basePrice, setBasePrice] = useState("400.00");
  const [discountPercent, setDiscountPercent] = useState("0%");
  const [vat, setVat] = useState("0%");
  const [sku, setSku] = useState("302002");
  const [barcode, setBarcode] = useState("0984939101123");
  const [quantity, setQuantity] = useState("164");
  const [weight, setWeight] = useState("0.25 kg");
  const [height, setHeight] = useState("10 cm");
  const [length, setLength] = useState("10 cm");
  const [width, setWidth] = useState("7 cm");

  return (
    <div className="flex flex-col gap-6">
      {isSaveDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ConfirmationDialog
            title="Save Changes?"
            description="Do you want to save changes? This action can't be undone"
            confirmLabel="Yes, Save"
            cancelLabel="Don't Save"
            color="green"
            onConfirm={() => {
              setIsSaveDialogOpen(false);
              router.push("/templates/ecommerce/products");
            }}
            onCancel={() => setIsSaveDialogOpen(false)}
          />
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <IconButton
              variant="tertiary"
              color="purple"
              shape="circle"
              onClick={() => router.push("/templates/ecommerce/products")}
            >
              <ArrowLeftLinear size={16} />
            </IconButton>
            <h1 className="text-display-l font-semibold text-fg-black leading-9 tracking-fg">
              Edit Product
            </h1>
          </div>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/templates/ecommerce" },
              { label: "Product", href: "/templates/ecommerce/products" },
              { label: "Edit Product" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="tertiary"
            iconLeft={<CloseIcon size={16} />}
            onClick={() => router.push("/templates/ecommerce/products")}
          >
            Cancel
          </Button>
          <Button
            iconLeft={<CheckIcon size={16} />}
            onClick={() => setIsSaveDialogOpen(true)}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="flex gap-3 items-start">
        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-3">
              General Information
            </h3>
            <TextField
              label="Product Name"
              value={name}
              onChange={setName}
              shape="pill"
            />
            <div className="mt-3">
              <TextArea
                label="Description"
                value={description}
                onChange={setDescription}
                rows={6}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-3">Media</h3>
            <p className="text-sm text-fg-grey-700 mb-2">Photo</p>
            <MediaUpload />
            <p className="text-sm text-fg-grey-700 mt-3 mb-2">Video</p>
            <MediaUpload />
          </div>

          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-3">Pricing</h3>
            <TextField
              label="Base Price"
              value={basePrice}
              onChange={setBasePrice}
              shape="pill"
            />
            <div className="grid grid-cols-2 gap-2 mt-3">
              <SelectOption
                label="Discount Type"
                options={[
                  { label: "No Discount", value: "none" },
                  { label: "Percentage", value: "pct" },
                ]}
                value="none"
                shape="pill"
              />
              <TextField
                label="Discount Percentage (%)"
                value={discountPercent}
                onChange={setDiscountPercent}
                shape="pill"
              />
              <SelectOption
                label="Tax Class"
                options={[
                  { label: "Tax Free", value: "free" },
                  { label: "Standard", value: "std" },
                ]}
                value="free"
                shape="pill"
              />
              <TextField
                label="VAT Amount (%)"
                value={vat}
                onChange={setVat}
                shape="pill"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-3">Inventory</h3>
            <div className="grid grid-cols-3 gap-2">
              <TextField
                label="SKU"
                value={sku}
                onChange={setSku}
                shape="pill"
              />
              <TextField
                label="Barcode"
                value={barcode}
                onChange={setBarcode}
                shape="pill"
              />
              <TextField
                label="Quantity"
                value={quantity}
                onChange={setQuantity}
                shape="pill"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-3">Variation</h3>
            {VARIATIONS.map((v, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid grid-cols-[1fr_1fr_1fr_auto] gap-2 ${
                  rowIndex > 0 ? "mt-2" : ""
                }`}
              >
                <SelectOption
                  label={rowIndex === 0 ? "Variation Type" : undefined}
                  options={[
                    { label: "Color", value: "color" },
                    { label: "Size", value: "size" },
                  ]}
                  value={v.type}
                  shape="pill"
                />
                <TextField
                  label={rowIndex === 0 ? "Variation" : undefined}
                  value={v.label}
                  shape="pill"
                />
                <TextField
                  label={rowIndex === 0 ? "Quantity" : undefined}
                  value={v.quantity}
                  shape="pill"
                />
                <div className={`flex items-end ${rowIndex === 0 ? "pb-0" : ""}`}>
                  <IconButton variant="tertiary" size="md">
                    <TrashBinMinimalisticLinear size={16} />
                  </IconButton>
                </div>
              </div>
            ))}
            <div className="mt-3">
              <Button variant="primary" iconLeft={<PlusIcon size={16} />}>
                Add Variant
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-3">Shiping</h3>
            <div className="mb-3 flex items-center gap-2">
              <Checkbox checked color="purple" />
              <span className="text-sm text-fg-violet">This is a physical product</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <TextField
                label="Weight"
                value={weight}
                onChange={setWeight}
                shape="pill"
              />
              <TextField
                label="Height"
                value={height}
                onChange={setHeight}
                shape="pill"
              />
              <TextField
                label="Length"
                value={length}
                onChange={setLength}
                shape="pill"
              />
              <TextField
                label="Width"
                value={width}
                onChange={setWidth}
                shape="pill"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[280px] flex-shrink-0 flex flex-col gap-2">
          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-3">Category</h3>
            <SelectOption
              label="Product Category"
              options={[
                { label: "Watch", value: "watch" },
                { label: "Phone", value: "phone" },
              ]}
              value="watch"
              shape="pill"
            />
            <div className="mt-3">
              <SelectOption
                label="Product Tags"
                options={[
                  { label: "Smart, Watch", value: "smart-watch" },
                ]}
                value="smart-watch"
                shape="pill"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-fg-black">Status</h3>
              <span className="inline-flex h-6 px-2.5 rounded-full bg-fg-green text-white text-xs font-semibold items-center">
                Published
              </span>
            </div>
            <SelectOption
              label="Product Status"
              options={[
                { label: "Published", value: "published" },
                { label: "Draft", value: "draft" },
              ]}
              value="published"
              shape="pill"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
