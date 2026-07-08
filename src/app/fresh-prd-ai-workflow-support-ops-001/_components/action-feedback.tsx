"use client";

import { useState } from "react";
import { Button, SurfaceCard } from "@forge-ui-official/core";

export function ActionFeedbackPanel() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("No pending changes");
  const [pending, setPending] = useState(3);
  const [dirty, setDirty] = useState(false);

  const handleRefreshEvidence = () => {
    setSaving(true);
    setDirty(false);
    setSaved("Evidence refreshed");
    setPending(2);
    window.setTimeout(() => setSaving(false), 300);
  };

  const handleAdvanceRun = () => {
    setSaving(true);
    setDirty(true);
    setSaved("Advance queued");
    window.setTimeout(() => setSaving(false), 300);
  };

  const handleOpenTicket = () => {
    setSaved("Ticket context opened");
    setPending((value) => Math.max(0, value - 1));
  };

  const handleSaveRecovery = () => {
    setSaving(true);
    setDirty(false);
    setSaved("Saved recovery draft");
    window.setTimeout(() => setSaving(false), 300);
  };

  return (
    <SurfaceCard title="Live activity" subtitle={`${pending} pending next action items`}>
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium leading-5 tracking-fg text-fg-grey-900">
          {saving ? "Saving guarded action feedback..." : saved}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button color="blue" variant="secondary" size="sm" onClick={handleRefreshEvidence}>
            Refresh evidence
          </Button>
          <Button color="purple" variant="secondary" size="sm" onClick={handleAdvanceRun}>
            Advance run
          </Button>
          <Button color="grey" variant="tertiary" size="sm" onClick={handleOpenTicket}>
            Open ticket
          </Button>
          <Button color={dirty ? "green" : "grey"} variant="tertiary" size="sm" onClick={handleSaveRecovery}>
            Save recovery
          </Button>
        </div>
      </div>
    </SurfaceCard>
  );
}
