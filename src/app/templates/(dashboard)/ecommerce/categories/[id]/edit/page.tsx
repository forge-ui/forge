"use client";

import { Panel } from "@forge-ui-official/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftLinear } from "@forge-ui-official/core/icons";
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

export default function EditCategoryPage() {
  const router = useRouter();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [name, setName] = useState("Watch");
  const [description, setDescription] = useState(
    "Our range of watches are perfect whether you're looking to upgrade."
  );

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
              router.push("/templates/ecommerce/categories");
            }}
            onCancel={() => setIsSaveDialogOpen(false)}
          />
        </div>
      )}

      <div className="flex items-start justify-between max-sm:flex-col max-sm:items-stretch max-sm:gap-3 max-sm:[&>div]:min-w-0 max-sm:[&>div]:max-w-full max-sm:[&>div]:flex-wrap">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <IconButton
              variant="tertiary"
              color="blue"
              shape="circle"
              onClick={() => router.push("/templates/ecommerce/categories")}
            >
              <ArrowLeftLinear size={16} />
            </IconButton>
            <h1 className="text-display-l font-semibold text-fg-black leading-9 tracking-fg">
              Edit Category
            </h1>
          </div>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/templates/ecommerce" },
              { label: "Categories", href: "/templates/ecommerce/categories" },
              { label: "Edit Category" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="tertiary"
            iconLeft={<CloseIcon size={16} />}
            onClick={() => router.push("/templates/ecommerce/categories")}
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

      <div className="flex items-start gap-4">
        <Panel variant="custom" className="flex-1 bg-background rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
          <h3 className="text-lg font-semibold text-fg-black mb-5">
            General Information
          </h3>
          <TextField
            label="Product Name"
            value={name}
            onChange={setName}
            shape="pill"
          />
          <div className="mt-4">
            <TextArea
              label="Description"
              value={description}
              onChange={setDescription}
              rows={6}
            />
          </div>
        </Panel>

        <Panel variant="custom" className="w-[266px] bg-background rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6">
          <h3 className="text-lg font-semibold text-fg-black mb-5">Category</h3>
          <p className="text-sm text-fg-grey-700 mb-1.5">Photo</p>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=200&fit=crop"
                alt="category-preview"
                className="w-[100px] h-[100px] rounded-xl object-cover"
              />
              <span className="absolute top-1 right-1 w-6 h-6 rounded-full bg-fg-green-500 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3.5 7L6 9.5L10.5 4.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <p className="text-sm text-center text-fg-grey-700 leading-5">
              Drag and drop image here,
              <br />
              or click add image
            </p>
            <Button variant="primary">Change Image</Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
