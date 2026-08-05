"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
import { CrmSurface } from "../../_components";
import { CrmPageHeader, CrmTemplateShell } from "../../_chrome";

const sourceOptions = [
  { value: "website", label: "Website" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "referral", label: "Referral" },
  { value: "campaign", label: "Campaign" },
];

const statusOptions = [
  { value: "new", label: "New" },
  { value: "hot", label: "Hot" },
  { value: "warm", label: "Warm" },
  { value: "cold", label: "Cold" },
];

export default function CrmLeadFormPage() {
  return (
    <Suspense fallback={null}>
      <CrmLeadFormContent />
    </Suspense>
  );
}

function CrmLeadFormContent() {
  const searchParams = useSearchParams();
  const isFilled = searchParams.get("mode") === "filled" || searchParams.get("state") === "filled";
  const isVariant2 = searchParams.get("variant") === "2";

  return (
    <CrmTemplateShell>
      <div className="flex flex-col gap-5">
        <CrmPageHeader title={isVariant2 ? "Add Leads ver 2" : "Add Leads"} current={isVariant2 ? "Add Leads ver 2" : "Add Leads"} actions={<Button>Save Lead</Button>} />
        <CrmSurface>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <TextField label="Full Name" value={isFilled ? "Lisa Greg" : ""} />
            <TextField label="Email" value={isFilled ? "lisagreg@mail.com" : ""} type="email" />
            <TextField label="Phone" value={isFilled ? "+1 987 555 909" : ""} />
            <TextField label="Company" value={isFilled ? "Shieldfy" : ""} />
            <SelectOption label="Source" value={isFilled ? "website" : ""} width="100%" options={sourceOptions} />
            <SelectOption label="Status" value={isFilled ? "new" : ""} width="100%" options={statusOptions} />
          </div>
          <TextArea className="mt-5" label="Qualification Notes" value={isFilled ? "Requested a CRM walkthrough and asked for pricing by team size." : ""} rows={4} />
          <div className="mt-6 flex justify-end gap-3">
            <Button color="grey" variant="tertiary">Cancel</Button>
            <Button>Save Lead</Button>
          </div>
        </CrmSurface>
      </div>
    </CrmTemplateShell>
  );
}
