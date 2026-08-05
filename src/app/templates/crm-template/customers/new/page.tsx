"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
import { CrmSurface } from "../../_components";
import { CrmPageHeader, CrmTemplateShell } from "../../_chrome";

export default function CrmCustomerFormPage() {
  return (
    <Suspense fallback={null}>
      <CrmCustomerFormContent />
    </Suspense>
  );
}

function CrmCustomerFormContent() {
  const searchParams = useSearchParams();
  const isFilled = searchParams.get("mode") === "filled" || searchParams.get("state") === "filled";
  const isVariant2 = searchParams.get("variant") === "2";

  return (
    <CrmTemplateShell>
      <div className="flex flex-col gap-5">
        <CrmPageHeader title={isVariant2 ? "Add Customer ver 2" : "Add Customer"} current={isVariant2 ? "Add Customer ver 2" : "Add Customer"} actions={<Button>Save Customer</Button>} />
        <CrmSurface>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <TextField label="Full Name" value={isFilled ? "John Bushmill" : ""} />
            <TextField label="Email" value={isFilled ? "johnb@mail.com" : ""} type="email" />
            <TextField label="Phone" value={isFilled ? "078 5054 8877" : ""} />
            <TextField label="Company" value={isFilled ? "Oksy.co" : ""} />
            <TextField label="Location" value={isFilled ? "CA, USA" : ""} />
            <SelectOption label="Status" value={isFilled ? "paid" : ""} width="100%" options={[{ value: "paid", label: "Paid" }, { value: "pending", label: "Pending" }, { value: "overdue", label: "Overdue" }]} />
          </div>
          <TextArea className="mt-5" label="Notes" value={isFilled ? "High-value customer with renewal opportunity next quarter." : ""} rows={4} />
          <div className="mt-6 flex justify-end gap-3">
            <Button color="grey" variant="tertiary">Cancel</Button>
            <Button>Save Customer</Button>
          </div>
        </CrmSurface>
      </div>
    </CrmTemplateShell>
  );
}
