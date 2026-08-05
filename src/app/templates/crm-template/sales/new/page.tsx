"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
import { CrmSurface } from "../../_components";
import { CrmPageHeader, CrmTemplateShell } from "../../_chrome";

const stageOptions = [
  { value: "completed", label: "Completed" },
  { value: "negotiation", label: "Negotiation" },
  { value: "draft", label: "Draft" },
  { value: "lost", label: "Lost" },
];

export default function CrmSalesFormPage() {
  return (
    <Suspense fallback={null}>
      <CrmSalesFormContent />
    </Suspense>
  );
}

function CrmSalesFormContent() {
  const searchParams = useSearchParams();
  const isFilled = searchParams.get("mode") === "filled" || searchParams.get("state") === "filled";

  return (
    <CrmTemplateShell>
      <div className="flex flex-col gap-5">
        <CrmPageHeader title="Add Sales" current="Add Sales" actions={<Button>Save Sales</Button>} />
        <CrmSurface>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <TextField label="Customer" value={isFilled ? "John Bushmill" : ""} />
            <TextField label="Product" value={isFilled ? "Protask Enterprise" : ""} />
            <TextField label="Amount" value={isFilled ? "$12,500.00" : ""} />
            <TextField label="Close Date" value={isFilled ? "24 Jan 2025" : ""} />
            <TextField label="Owner" value={isFilled ? "Jay Parker" : ""} />
            <SelectOption label="Stage" value={isFilled ? "negotiation" : ""} width="100%" options={stageOptions} />
          </div>
          <TextArea className="mt-5" label="Deal Notes" value={isFilled ? "Enterprise rollout with CRM and finance modules. Procurement review is the next blocker." : ""} rows={4} />
          <div className="mt-6 flex justify-end gap-3">
            <Button color="grey" variant="tertiary">Cancel</Button>
            <Button>Save Sales</Button>
          </div>
        </CrmSurface>
      </div>
    </CrmTemplateShell>
  );
}
