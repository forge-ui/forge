"use client";

import { useState, useCallback } from "react";
import {
  Breadcrumbs,
  Button,
  IconButton,
  TextField,
  TextArea,
  SelectOption,
  MediaUpload,
  ConfirmationDialog,
  CloseIcon,
  CheckIcon,
} from "@forge-ui/react";
import {
  DangerTriangleLinear,
  ArrowLeftLinear,
} from "solar-icon-set";

const categoryOptions = [
  { label: "Electronics", value: "electronics" },
  { label: "Clothing", value: "clothing" },
  { label: "Accessories", value: "accessories" },
  { label: "Home & Garden", value: "home" },
];

const paymentOptions = [
  { label: "Bank Transfer", value: "transfer" },
  { label: "Visa", value: "visa" },
  { label: "Mastercard", value: "mastercard" },
  { label: "Paypal", value: "paypal" },
];

const shippingOptions = [
  { label: "Regular", value: "regular" },
  { label: "Express", value: "express" },
  { label: "Same Day", value: "sameday" },
];

export default function AddOrderPage() {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");

  const handleOpenSaveModal = useCallback(() => {
    setIsSaveModalOpen(true);
  }, []);

  const handleCloseSaveModal = useCallback(() => {
    setIsSaveModalOpen(false);
  }, []);

  return (
    <>
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <ConfirmationDialog
            title="Save Changes?"
            description="Do you want to save this order? This action can't be undone"
            color="purple"
            icon={<DangerTriangleLinear size={24} color="#7c3aed" />}
            confirmLabel="Yes, Save"
            cancelLabel="Don't Save"
            onConfirm={handleCloseSaveModal}
            onCancel={handleCloseSaveModal}
          />
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <IconButton variant="tertiary" color="purple" shape="circle" onClick={() => window.history.back()}>
              <ArrowLeftLinear size={16} />
            </IconButton>
            <h1 className="text-display-l font-semibold text-fg-black leading-9 tracking-fg">Add Order</h1>
          </div>
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/templates/ecommerce" },
              { label: "Orders", href: "/templates/ecommerce/orders" },
              { label: "Add Order" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="tertiary" iconLeft={<CloseIcon size={16} />} onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button iconLeft={<CheckIcon size={16} />} onClick={handleOpenSaveModal}>
            Save
          </Button>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-4">
        {/* Left - main form */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Product Information */}
          <div className="rounded-card outline outline-1 outline-fg-grey-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-5">
              Product Information
            </h3>

            <div className="flex flex-col gap-4">
              <TextField
                label="Product Name"
                placeholder="Enter product name"
                value={productName}
                onChange={setProductName}
              />
              <TextArea
                label="Description"
                placeholder="Enter product description"
                value={description}
                onChange={setDescription}
                rows={4}
              />
              <div className="grid grid-cols-2 gap-4">
                <SelectOption
                  label="Category"
                  options={categoryOptions}
                  value={category}
                  placeholder="Select category"
                  onChange={setCategory}
                />
                <TextField
                  label="Price"
                  placeholder="$0.00"
                  value={price}
                  onChange={setPrice}
                />
              </div>
              <TextField
                label="Quantity"
                placeholder="1"
                value={quantity}
                onChange={setQuantity}
              />
            </div>
          </div>

          {/* Customer Information */}
          <div className="rounded-card outline outline-1 outline-fg-grey-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-5">
              Customer Information
            </h3>

            <div className="flex flex-col gap-4">
              <TextField
                label="Customer Name"
                placeholder="Enter customer name"
                value={customerName}
                onChange={setCustomerName}
              />
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Email"
                  placeholder="customer@email.com"
                  value={customerEmail}
                  onChange={setCustomerEmail}
                />
                <TextField
                  label="Phone Number"
                  placeholder="+1 000 000 0000"
                  value={customerPhone}
                  onChange={setCustomerPhone}
                />
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="rounded-card outline outline-1 outline-fg-grey-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-fg-black mb-5">
              Shipping Details
            </h3>

            <div className="flex flex-col gap-4">
              <TextArea
                label="Shipping Address"
                placeholder="Enter full shipping address"
                value={shippingAddress}
                onChange={setShippingAddress}
                rows={3}
              />
              <div className="grid grid-cols-2 gap-4">
                <SelectOption
                  label="Payment Method"
                  options={paymentOptions}
                  value={paymentMethod}
                  placeholder="Select payment"
                  onChange={setPaymentMethod}
                />
                <SelectOption
                  label="Shipping Method"
                  options={shippingOptions}
                  value={shippingMethod}
                  placeholder="Select shipping"
                  onChange={setShippingMethod}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar - Product Image */}
        <div className="w-[266px] rounded-card outline outline-1 outline-fg-grey-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-fg-black mb-5">
            Product Image
          </h3>
          <MediaUpload />
        </div>
      </div>
    </>
  );
}
