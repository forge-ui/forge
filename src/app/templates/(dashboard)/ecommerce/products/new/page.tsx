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

export default function AddProductPage() {
  const router = useRouter();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Save confirmation dialog overlay */}
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
            <IconButton variant="tertiary" color="purple" shape="circle" onClick={() => router.push("/templates/ecommerce/products")}>
              <ArrowLeftLinear size={16} />
            </IconButton>
            <h1 className="text-display-l font-semibold text-fg-black leading-9 tracking-fg">Add Product</h1>
          </div>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/templates/ecommerce" },
              { label: "Product", href: "/templates/ecommerce/products" },
              { label: "Add Product" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="tertiary" iconLeft={<CloseIcon size={16} />} onClick={() => router.push("/templates/ecommerce/products")}>
            Cancel
          </Button>
          <Button iconLeft={<CheckIcon size={16} />} onClick={() => setIsSaveDialogOpen(true)}>
            Save
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex gap-3 items-start">
        {/* Main Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* General Information */}
          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-3">General Information</h3>
            <TextField
              label="Product Name"
              placeholder="Type product name here..."
              shape="pill"
            />
            <div className="mt-3">
              <TextArea
                label="Description"
                placeholder="Type product description here..."
                rows={6}
              />
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-3">Media</h3>
            <p className="text-sm text-fg-grey-700 mb-2">Photo</p>
            <MediaUpload />
            <p className="text-sm text-fg-grey-700 mt-3 mb-2">Video</p>
            <MediaUpload />
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-3">Pricing</h3>
            <TextField
              label="Base Price"
              placeholder="Type base price..."
              shape="pill"
            />
            <div className="grid grid-cols-2 gap-2 mt-3">
              <SelectOption
                label="Discount Type"
                options={[{ label: "Select...", value: "default" }]}
                placeholder="Select..."
                shape="pill"
              />
              <TextField
                label="Discount Percentage (%)"
                placeholder="Type discount percentage..."
                shape="pill"
              />
              <SelectOption
                label="Tax Class"
                options={[{ label: "Select...", value: "default" }]}
                placeholder="Select..."
                shape="pill"
              />
              <TextField
                label="VAT Amount (%)"
                placeholder="Type VAT amount..."
                shape="pill"
              />
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-3">Inventory</h3>
            <div className="grid grid-cols-3 gap-2">
              <TextField
                label="SKU"
                placeholder="Type product SKU here..."
                shape="pill"
              />
              <TextField
                label="Barcode"
                placeholder="Product barcode..."
                shape="pill"
              />
              <TextField
                label="Quantity"
                placeholder="Type product quantity here..."
                shape="pill"
              />
            </div>
          </div>

          {/* Variation */}
          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-3">Variation</h3>
            {[0, 1].map((rowIndex) => (
              <div key={rowIndex} className={`grid grid-cols-[1fr_1fr_1fr_auto] gap-2 ${rowIndex > 0 ? "mt-2" : ""}`}>
                <SelectOption
                  label={rowIndex === 0 ? "Variation Type" : undefined}
                  options={[
                    { label: "Select...", value: "default" },
                    { label: "Size", value: "size" },
                    { label: "Color", value: "color" },
                  ]}
                  placeholder="Select..."
                  shape="pill"
                />
                <TextField
                  label={rowIndex === 0 ? "Variation" : undefined}
                  placeholder="Variation..."
                  shape="pill"
                />
                <TextField
                  label={rowIndex === 0 ? "Quantity" : undefined}
                  placeholder="Variation..."
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
              <Button
                variant="primary"
                iconLeft={<PlusIcon size={16} />}
              >
                Add Variant
              </Button>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-3">Shipping</h3>
            <div className="mb-3 flex items-center gap-2">
              <Checkbox checked color="purple" />
              <span className="text-sm text-fg-violet">This is a physical product</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <TextField label="Weight" placeholder="Product weight..." shape="pill" />
              <TextField label="Height" placeholder="Height (cm)..." shape="pill" />
              <TextField label="Length" placeholder="Length (cm)..." shape="pill" />
              <TextField label="Width" placeholder="Width (cm)..." shape="pill" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[280px] flex-shrink-0 flex flex-col gap-2">
          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-3">Category</h3>
            <SelectOption
              label="Product Category"
              options={[{ label: "Select...", value: "default" }]}
              placeholder="Select..."
              shape="pill"
            />
            <div className="mt-3">
              <SelectOption
                label="Product Tags"
                options={[{ label: "Select...", value: "default" }]}
                placeholder="Select..."
                shape="pill"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-fg-black">Status</h3>
              <span className="inline-flex h-6 px-2.5 rounded-full bg-fg-grey-500 text-white text-xs font-semibold items-center">
                Draft
              </span>
            </div>
            <SelectOption
              label="Product Status"
              options={[{ label: "Draft", value: "draft" }]}
              value="draft"
              shape="pill"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
