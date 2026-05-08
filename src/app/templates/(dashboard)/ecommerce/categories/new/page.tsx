"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftLinear,
} from "solar-icon-set";
import {
  Breadcrumbs,
  Button,
  IconButton,
  TextField,
  TextArea,
  ConfirmationDialog,
  CloseIcon,
  CheckIcon,
} from "@forge-ui-official/core";

export default function AddCategoryPage() {
  const router = useRouter();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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
              router.push("/templates/ecommerce/categories");
            }}
            onCancel={() => setIsSaveDialogOpen(false)}
          />
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <IconButton variant="tertiary" color="purple" shape="circle" onClick={() => router.push("/templates/ecommerce/categories")}>
              <ArrowLeftLinear size={16} />
            </IconButton>
            <h1 className="text-display-l font-semibold text-fg-black leading-9 tracking-fg">Add Category</h1>
          </div>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/templates/ecommerce" },
              { label: "Categories", href: "/templates/ecommerce/categories" },
              { label: "Add Category" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="tertiary" iconLeft={<CloseIcon size={16} />} onClick={() => router.push("/templates/ecommerce/categories")}>
            Cancel
          </Button>
          <Button iconLeft={<CheckIcon size={16} />} onClick={() => setIsSaveDialogOpen(true)}>
            Save
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex items-start gap-4">
        {/* Left: General Information */}
        <div className="flex-1 bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
          <h3 className="text-lg font-semibold text-fg-black mb-5">General Information</h3>
          <TextField
            label="Product Name"
            placeholder="Type product name here..."
            value={name}
            onChange={setName}
            shape="pill"
          />
          <div className="mt-4">
            <TextArea
              label="Description"
              placeholder="Type product description here..."
              value={description}
              onChange={setDescription}
              rows={6}
            />
          </div>
        </div>

        {/* Right: Category Photo */}
        <div className="w-[266px] bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
          <h3 className="text-lg font-semibold text-fg-black mb-5">Category</h3>
          <p className="text-sm text-fg-grey-700 mb-1.5">Photo</p>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-[100px] h-[100px] rounded-xl bg-fg-violet-50 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M21 15.4998V5.5C21 4.11929 19.8807 3 18.5 3H5.5C4.11929 3 3 4.11929 3 5.5V18.4998C3 19.8805 4.11929 20.9998 5.5 20.9998H18.5C19.0667 20.9998 19.5896 20.8113 20.0094 20.4937" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-fg-violet" />
                <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" className="text-fg-violet" />
                <path d="M3 16L7 12.5C8 11.5 9 11.5 10 12.5L17 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-fg-violet" />
              </svg>
            </div>
            <p className="text-sm text-center text-fg-grey-700 leading-5">
              Drag and drop image here,<br />or click add image
            </p>
            <Button variant="primary">
              Add Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
