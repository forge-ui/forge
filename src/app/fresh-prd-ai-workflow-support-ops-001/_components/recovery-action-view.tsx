"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, SurfaceCard, TextArea, TextField } from "@forge-ui-official/core";
import { basePath } from "./data";
import { RouteHeader } from "./route-header";

export function RecoveryActionView() {
  const [saving, setSaving] = useState(false);

  const handleSubmitRecovery = () => {
    setSaving(true);
    window.setTimeout(() => setSaving(false), 300);
  };

  return (
    <main className="flex flex-col gap-5 p-5 lg:p-6">
      <RouteHeader eyebrow="Guarded action" title="Create recovery action" primaryLabel="Save recovery" />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <SurfaceCard title="Recovery fields" subtitle="Fallback, owner, SOP, and audit note">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Incident" value="INC-2407" />
            <TextField label="Owner" value="Mina Chen" />
            <TextField label="Fallback provider" value="secondary-route/provider-b" />
            <TextField label="Related ticket" value="SUP-1048" />
            <div className="md:col-span-2">
              <TextArea label="Recovery SOP" value="Refresh datasource evidence, retry workflow with fallback provider, then notify support owner with export packet." />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`${basePath}/operations`}>
              <Button color="grey" variant="tertiary" size="md">Cancel</Button>
            </Link>
            <Button color="blue" size="md" disabled={saving} onClick={handleSubmitRecovery}>
              {saving ? "Saving recovery" : "Save recovery"}
            </Button>
          </div>
        </SurfaceCard>
        <SurfaceCard title="Preflight impact" subtitle="Confirmation, audit, rollback">
          <ul className="space-y-3 text-sm font-medium leading-5 tracking-fg text-fg-grey-900">
            <li>Impact scope: 18 tickets and 4 enterprise accounts.</li>
            <li>Confirmation: fallback provider has capacity and policy approval.</li>
            <li>Audit: append recovery note to run history and linked ticket.</li>
            <li>Rollback: return to primary provider after datasource freshness is ready.</li>
          </ul>
        </SurfaceCard>
      </div>
    </main>
  );
}
