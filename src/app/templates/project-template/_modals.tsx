"use client";

import type { ReactNode } from "react";
import { Button, ConfirmationDialog, TextField } from "@forge-ui-official/core";
import { TrashBinMinimalisticLinear } from "solar-icon-set";
import { Modal } from "../_shared/modal";

export type TemplateFormField = {
  label: string;
  placeholder?: string;
  value?: string;
};

export function TemplateFormModal({
  title,
  open,
  fields,
  submitLabel = "Save",
  submitIcon,
  onClose,
}: {
  title: string;
  open: boolean;
  fields: TemplateFormField[];
  submitLabel?: string;
  submitIcon?: ReactNode;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="w-[620px]">
      <div className="grid grid-cols-2 gap-5 p-6">
        {fields.map((field) => (
          <TextField key={field.label} label={field.label} placeholder={field.placeholder} value={field.value} />
        ))}
      </div>
      <div className="flex justify-end gap-3 border-t border-fg-grey-200 p-6">
        <Button color="grey" variant="tertiary" onClick={onClose}>
          Cancel
        </Button>
        <Button iconLeft={submitIcon} onClick={onClose}>
          {submitLabel}
        </Button>
      </div>
    </Modal>
  );
}

export function TemplateDeleteDialog({
  open,
  title,
  description,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} width="w-[520px]">
      <ConfirmationDialog
        color="red"
        title={title}
        description={description}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        icon={<TrashBinMinimalisticLinear size={32} color="currentColor" />}
        layout="spread"
      />
    </Modal>
  );
}
