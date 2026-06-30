"use client";

import type { ReactNode } from "react";
import {
  BarChart,
  Button,
  ConfirmationDialog,
  FilterGroup,
  FilterPanel,
  FilterTrigger,
  SelectOption,
  TextArea,
  TextField,
  type AccentColor,
} from "@forge-ui-official/core";
import { CalendarMinimalisticLinear, CloudUploadLinear, Pen2Linear, TrashBinMinimalisticLinear } from "solar-icon-set";
import { Modal } from "./modal";

export function normalizeProtaskActivityDialogId(dialogId?: string | null) {
  const raw = (dialogId ?? "").replace(/^leads-/, "").toLowerCase();
  const aliases: Record<string, string> = {
    "add-call": "add-call-schedule",
    call: "add-call-schedule",
    "call-schedule": "add-call-schedule",
    "add-meet": "add-meet-schedule",
    meet: "add-meet-schedule",
    "meet-schedule": "add-meet-schedule",
    notes: "add-notes",
  };

  return aliases[raw] ?? raw;
}

export function ProtaskDeleteDialog({
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
        onCancel={onClose}
        onConfirm={onClose}
      />
    </Modal>
  );
}

export function ProtaskEditDialog({
  open,
  title,
  description,
  fields,
  onClose,
  onConfirm,
  confirmLabel = "Save Changes",
}: {
  open: boolean;
  title: string;
  description: string;
  fields: Array<{ label: string; value: string; placeholder?: string }>;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="w-[620px]">
      <div className="flex flex-col gap-5 p-6">
        <p className="text-sm font-normal leading-5 tracking-fg text-fg-grey-700">
          {description}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <TextField
              key={field.label}
              label={field.label}
              value={field.value}
              placeholder={field.placeholder}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t border-fg-grey-200 p-6">
        <Button color="grey" variant="tertiary" onClick={onClose}>
          Cancel
        </Button>
        <Button iconLeft={<Pen2Linear size={18} />} onClick={onConfirm ?? onClose}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export function ProtaskViewDialog({
  open,
  title,
  fields,
  onClose,
}: {
  open: boolean;
  title: string;
  fields: Array<{ label: string; value: string }>;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="w-[520px]">
      <div className="flex flex-col gap-0 p-6">
        {fields.map((field) => (
          <div key={field.label} className="flex items-start justify-between gap-5 border-b border-fg-grey-200 py-4 first:pt-0 last:border-b-0 last:pb-0">
            <span className="text-sm font-medium leading-5 tracking-fg text-fg-grey-700">{field.label}</span>
            <span className="max-w-72 text-right text-sm font-semibold leading-5 tracking-fg text-fg-black">{field.value}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-end border-t border-fg-grey-200 p-6">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}

export function ProtaskSaveChangesDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} width="w-[480px]">
      <ConfirmationDialog
        color="yellow"
        title="Save Changes?"
        description="Do you want to save changes? This action can't be undone"
        confirmLabel="Yes, Save"
        cancelLabel="Don't Save"
        icon={<span className="text-3xl font-semibold leading-none text-fg-yellow">!</span>}
        layout="spread"
        onCancel={onClose}
        onConfirm={onClose}
      />
    </Modal>
  );
}

export function ProtaskFormDialog({
  open,
  title,
  fields,
  submitLabel,
  onClose,
}: {
  open: boolean;
  title: string;
  fields: Array<{ label: string; value?: string; placeholder?: string }>;
  submitLabel: string;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="w-[620px]">
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        {fields.map((field) => (
          <TextField
            key={field.label}
            label={field.label}
            value={field.value}
            placeholder={field.placeholder}
          />
        ))}
      </div>
      <div className="flex justify-end gap-3 border-t border-fg-grey-200 p-6">
        <Button color="grey" variant="tertiary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>{submitLabel}</Button>
      </div>
    </Modal>
  );
}

export function ProtaskActivityDialog({
  open,
  dialogId,
  onClose,
}: {
  open: boolean;
  dialogId: string;
  onClose: () => void;
}) {
  const isCall = dialogId.includes("call");
  const isMeet = dialogId.includes("meet");
  const isNotes = dialogId.includes("notes");
  const isLog = dialogId.includes("log");
  const title = isNotes ? "Add Notes" : isMeet ? "Add Meet" : "Add Call";
  const submitLabel = isNotes ? "Add Notes" : isMeet ? "Add Meet" : isLog ? "Add Log" : "Add Schedule";

  return (
    <Modal open={open} onClose={onClose} title={title} width="w-[720px]">
      <div className="flex flex-col gap-5 p-6">
        {!isNotes ? (
          <div className="grid grid-cols-2 border-b border-fg-grey-200">
            <ActivityDialogTab active={!isLog}>Schedule</ActivityDialogTab>
            <ActivityDialogTab active={isLog}>Log</ActivityDialogTab>
          </div>
        ) : null}
        <TextField label="Title" placeholder="Type name. . ." />
        <TextArea label="Description" placeholder="Type description. . ." rows={6} autoGrow={false} />
        {isNotes ? <NotesUploadBlock /> : isLog ? <LogFields isMeet={isMeet} /> : <ScheduleFields />}
      </div>
      <div className="flex justify-between gap-3 border-t border-fg-grey-200 p-6">
        <Button color="grey" variant="tertiary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>{submitLabel}</Button>
      </div>
    </Modal>
  );
}

function ActivityDialogTab({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <div className={`flex flex-col items-center gap-4 text-sm leading-5 tracking-fg ${active ? "font-bold text-fg-violet" : "font-semibold text-fg-grey-700"}`}>
      <span>{children}</span>
      <span className={`h-0.5 w-full ${active ? "bg-fg-violet" : "bg-transparent"}`} />
    </div>
  );
}

function ScheduleFields() {
  return (
    <>
      <TextField label="Purpose" placeholder="Type purpose. . ." />
      <SelectOption
        label="Reminder"
        width="100%"
        options={[
          { value: "10", label: "10 min before" },
          { value: "25", label: "25 min before" },
          { value: "60", label: "1 hour before" },
        ]}
      />
      <TextField label="Date" placeholder="Select Dates" iconLeft={<CalendarMinimalisticLinear size={18} />} />
    </>
  );
}

function LogFields({ isMeet }: { isMeet: boolean }) {
  return (
    <>
      <TextField label="Result" placeholder="Type result. . ." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UploadButton label="Record" />
        {isMeet ? <UploadButton label="Attachment" /> : null}
      </div>
    </>
  );
}

function NotesUploadBlock() {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold leading-5 tracking-fg text-fg-grey-700">Image</p>
      <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-fg-grey-200 bg-white p-6 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-fg-violet-100 text-fg-violet">
          <CloudUploadLinear size={24} />
        </span>
        <p className="mt-4 text-sm font-medium leading-5 tracking-fg text-fg-grey-700">
          Drag and drop image here, or click add image
        </p>
        <Button className="mt-5">Upload Image</Button>
      </div>
    </div>
  );
}

function UploadButton({ label }: { label: string }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold leading-5 tracking-fg text-fg-grey-700">{label}</p>
      <Button>Add File</Button>
    </div>
  );
}

export function ProtaskFilterTrigger({
  color = "purple",
  count = 3,
  groups,
}: {
  color?: AccentColor;
  count?: number;
  groups?: ReactNode;
}) {
  return (
    <FilterTrigger
      color={color}
      count={count}
      panel={(close) => (
        <FilterPanel color={color} onReset={() => {}} onCancel={close} onApply={close}>
          {groups ?? <DefaultFilterGroups color={color} />}
        </FilterPanel>
      )}
    />
  );
}

export function ProtaskFilterDialog({
  open,
  onClose,
  color = "purple",
}: {
  open: boolean;
  onClose: () => void;
  color?: AccentColor;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Filters" width="w-[420px]">
      <div className="p-6">
        <DefaultFilterGroups color={color} />
      </div>
      <div className="flex justify-between gap-3 border-t border-fg-grey-200 p-6">
        <Button color="grey" variant="tertiary" onClick={onClose}>
          Reset
        </Button>
        <Button color={color} onClick={onClose}>
          Apply Filters
        </Button>
      </div>
    </Modal>
  );
}

export function DefaultFilterGroups({ color = "purple" }: { color?: AccentColor }) {
  return (
    <>
      <FilterGroup
        color={color}
        title="Status"
        defaultOpen
        content={{
          type: "checkbox",
          options: [
            { label: "Paid", value: "paid", checked: true },
            { label: "Pending", value: "pending", checked: true },
            { label: "Overdue", value: "overdue" },
            { label: "Idle", value: "idle" },
          ],
          onToggle: () => {},
        }}
      />
      <FilterGroup
        color={color}
        title="Date range"
        content={{
          type: "radio",
          options: [
            { label: "Today", value: "today" },
            { label: "This week", value: "week", checked: true },
            { label: "This month", value: "month" },
          ],
          onSelect: () => {},
        }}
      />
      <FilterGroup
        color={color}
        title="Amount"
        content={{
          type: "range",
          minLabel: "Min",
          maxLabel: "Max",
          minValue: "100",
          maxValue: "5,000",
          onMinChange: () => {},
          onMaxChange: () => {},
        }}
      />
    </>
  );
}

export function ProtaskBarStatistic({
  data,
  color = "blue",
}: {
  data: Array<{ value: number; label: string }>;
  color?: AccentColor;
}) {
  return (
    <div className="rounded-[20px] bg-fg-grey-50 p-5">
      <BarChart
        data={data}
        accent={color}
        barWidth="wide"
        height="h-56"
        activeIndex={5}
        showLabels
        showTooltip
        tooltipValue="$12,201"
        tooltipTrend="up"
        color={color === "blue" ? "bg-fg-blue-500" : "bg-fg-violet"}
        inactiveColor={color === "blue" ? "bg-fg-blue-500" : "bg-fg-violet"}
      />
    </div>
  );
}
