"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AddCircleLinear,
  CalendarMinimalisticLinear,
  CloudDownloadLinear,
  DocumentTextLinear,
  UsersGroupRoundedLinear,
  VideocameraRecordLinear,
} from "solar-icon-set";
import {
  Avatar,
  Button,
  Checkbox,
  TabBar,
  Toolbar,
  ToolbarActions,
  ToolbarSearchInput,
  ToolbarShowSelect,
} from "@forge-ui-official/core";
import { ProtaskActivityDialog, ProtaskFilterTrigger, normalizeProtaskActivityDialogId } from "../../_shared/protask-actions";
import { CrmPageHeader, CrmTemplateShell } from "../_chrome";
import { avatar } from "../_data";

const members = [
  { name: "Mary William", role: "Salesman", checked: true },
  { name: "James Matthew", role: "Salesman", checked: false },
  { name: "Eric Chan", role: "Salesman", checked: true },
  { name: "Paul Carter", role: "Salesman", checked: true },
  { name: "Roberto Davis", role: "Salesman", checked: true },
  { name: "Lisa Wang", role: "Salesman", checked: false },
  { name: "Lisa Zachary", role: "Salesman", checked: false },
  { name: "John Sandler", role: "Salesman", checked: true },
  { name: "Evelyn Walter", role: "Salesman", checked: true },
  { name: "James Lawrence", role: "Salesman", checked: false },
  { name: "Patricia Kim", role: "Salesman", checked: false },
  { name: "Alan Patrick", role: "Salesman", checked: false },
  { name: "Vincent Bradley", role: "Salesman", checked: false },
];

const logs = [
  {
    type: "meet",
    color: "purple",
    icon: <UsersGroupRoundedLinear size={18} />,
    actor: "Logged meet by John Doe Hoegan",
    title: "Meeting with Linda Blair",
    meta: "Result",
    value: "Cost Agreement",
    details: ["Record", "Attachment"],
  },
  {
    type: "call",
    color: "yellow",
    icon: <VideocameraRecordLinear size={18} />,
    actor: "Call schedule created Lisa Williams",
    title: "Call with Linda Blair",
    meta: "Date",
    value: "14 Feb 2025, 14:00",
    details: ["Purpose", "Reminder"],
  },
  {
    type: "notes",
    color: "green",
    icon: <DocumentTextLinear size={18} />,
    actor: "Notes created John Doe Hoegan",
    title: "Meeting Notes",
    meta: "Attachment",
    value: "+4",
    details: ["Image", "Gallery"],
  },
  {
    type: "meet",
    color: "purple",
    icon: <UsersGroupRoundedLinear size={18} />,
    actor: "Logged meet by John Doe Hoegan",
    title: "Meeting with Linda Blair",
    meta: "Result",
    value: "Cost Agreement",
    details: ["Record", "Attachment"],
  },
] as const;

const activityTabs = ["Activity", "Call", "Meet", "Notes"] as const;
type ActivityTab = (typeof activityTabs)[number];

const tabAliases: Record<string, ActivityTab> = {
  activity: "Activity",
  call: "Call",
  meet: "Meet",
  notes: "Notes",
};

const dialogFields: Record<string, { title: string; submitLabel: string; fields: Array<{ label: string; value?: string; placeholder?: string }> }> = {
  "add-call-schedule": {
    title: "Add Call Schedule",
    submitLabel: "Add Schedule",
    fields: [
      { label: "Call With", value: "Linda Blair" },
      { label: "Date", value: "14 Feb 2025" },
      { label: "Time", value: "14:00" },
      { label: "Reminder", value: "25 min before" },
    ],
  },
  "add-call-log": {
    title: "Add Call Log",
    submitLabel: "Add Log",
    fields: [
      { label: "Call With", value: "Linda Blair" },
      { label: "Result", value: "Follow Up" },
      { label: "Duration", value: "25 min" },
      { label: "Record", value: "File Name.mp3" },
    ],
  },
  "add-meet-schedule": {
    title: "Add Meet Schedule",
    submitLabel: "Add Schedule",
    fields: [
      { label: "Meet With", value: "Linda Blair" },
      { label: "Date", value: "14 Feb 2025" },
      { label: "Time", value: "14:00" },
      { label: "Purpose", value: "Cost Agreement" },
    ],
  },
  "add-meet-log": {
    title: "Add Meet",
    submitLabel: "Add Meet",
    fields: [
      { label: "Meet With", value: "Linda Blair" },
      { label: "Result", value: "Cost Agreement" },
      { label: "Record", value: "File Name.mp4" },
      { label: "Attachment", value: "File Name.mp4" },
    ],
  },
  "add-notes": {
    title: "Add Notes",
    submitLabel: "Add Notes",
    fields: [
      { label: "Title", value: "Meeting Notes" },
      { label: "Owner", value: "John Doe Hoegan" },
      { label: "Attachment", value: "+4" },
      { label: "Note", value: "Follow up activity result." },
    ],
  },
};

export default function CrmActivityPage() {
  return (
    <Suspense fallback={null}>
      <CrmActivityContent />
    </Suspense>
  );
}

function CrmActivityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [manualTab, setManualTab] = useState<ActivityTab | null>(null);
  const queryTab = tabAliases[(searchParams.get("tab") ?? "activity").toLowerCase()] ?? "Activity";
  const activeTab = manualTab ?? queryTab;
  const dialog = searchParams.get("dialog");
  const normalizedDialog = normalizeProtaskActivityDialogId(dialog);
  const activeDialog = normalizedDialog ? dialogFields[normalizedDialog] : undefined;
  const visibleLogs = activeTab === "Activity" ? logs : logs.filter((log) => log.type === activeTab.toLowerCase());

  return (
    <CrmTemplateShell>
      <div className="flex flex-col gap-5">
        <CrmPageHeader
          title="Activity"
          current="Activity"
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button color="grey" variant="tertiary" iconLeft={<CloudDownloadLinear size={18} />}>Export</Button>
              <Button iconLeft={<AddCircleLinear size={18} />} onClick={() => router.push("/templates/crm-template/activity?dialog=add-call-schedule")}>Add New</Button>
            </div>
          }
        />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="flex min-h-[680px] flex-col gap-5 rounded-[20px] bg-white p-4 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
            <div className="flex items-center gap-3">
              <h2 className="flex-1 text-xl font-semibold leading-8 tracking-fg text-fg-black">Member</h2>
              <button type="button" className="inline-flex items-center gap-1 text-sm font-bold leading-5 tracking-fg text-fg-violet">
                <UsersGroupRoundedLinear size={18} />
                Select All
              </button>
            </div>
            <div className="h-px bg-fg-grey-200" />
            <ToolbarSearchInput placeholder="Search. . ." className="w-full" />
            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden">
              {members.map((member) => (
                <div key={member.name} className="flex items-center gap-2.5">
                  <Checkbox checked={member.checked} />
                  <Avatar src={avatar(`activity-${member.name.toLowerCase().replaceAll(" ", "-")}`)} alt={member.name} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold leading-5 tracking-fg text-fg-black">{member.name}</p>
                    <p className="truncate text-xs font-medium leading-4 tracking-fg text-fg-grey-700">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
          <main className="flex min-w-0 flex-col gap-6">
            <TabBar
              tabs={activityTabs.map((label) => ({ label, active: label === activeTab }))}
              color="purple"
              onChange={(index) => setManualTab(activityTabs[index])}
            />
            <Toolbar
              className="flex-col gap-4 lg:flex-row lg:items-center"
              left={<ToolbarSearchInput placeholder="Search. . ." />}
              right={<ToolbarActions><ProtaskFilterTrigger color="purple" count={0} /><ToolbarShowSelect value="5" /></ToolbarActions>}
            />
            <div className="flex flex-col gap-4">
              {visibleLogs.map((log, index) => (
                <ActivityLogCard key={`${log.type}-${index}`} log={log} index={index} />
              ))}
            </div>
          </main>
        </div>
        <ProtaskActivityDialog
          open={!!activeDialog}
          dialogId={normalizedDialog}
          onClose={() => router.replace("/templates/crm-template/activity")}
        />
      </div>
    </CrmTemplateShell>
  );
}

function ActivityLogCard({ log, index }: { log: (typeof logs)[number]; index: number }) {
  const iconClassName =
    log.color === "yellow"
      ? "bg-fg-yellow-50 text-fg-yellow"
      : log.color === "green"
        ? "bg-fg-green-50 text-fg-green-500"
        : "bg-fg-violet-100 text-fg-violet";

  return (
    <article className="overflow-hidden rounded-[20px] bg-white outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
      <header className="flex flex-col gap-4 border-b border-fg-grey-200 p-5 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className={`grid size-9 shrink-0 place-items-center rounded-full ${iconClassName}`}>{log.icon}</span>
          <p className="truncate text-sm font-medium leading-5 tracking-fg text-fg-grey-700">{log.actor}</p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-medium leading-4 tracking-fg text-fg-grey-700">
          <CalendarMinimalisticLinear size={18} />
          14 Jan 2025, 10:00
        </div>
      </header>
      <div className="flex gap-3 p-5">
        <Avatar src={avatar(`activity-log-${index}`)} alt="" size="sm" />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-6 tracking-fg text-fg-black">{log.title}</h3>
          <p className="mt-2 text-sm font-normal leading-5 tracking-fg text-fg-grey-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut ex nunc. In porta velit at nunc blandit, ac interdum sapien accumsan.
          </p>
          {log.type === "notes" ? (
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-24 rounded-lg bg-fg-grey-100" />
              ))}
              <div className="grid h-24 place-items-center rounded-lg bg-fg-black/50 text-base font-semibold text-white">{log.value}</div>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl bg-fg-grey-50 p-4 outline outline-1 outline-offset-[-1px] outline-fg-grey-200 md:grid-cols-3">
              <ActivityMeta label={log.meta} value={log.value} />
              <ActivityMeta label={log.details[0]} value={log.type === "call" ? "Follow Up" : "File Name.mp4"} linked={log.type !== "call"} />
              <ActivityMeta label={log.details[1]} value={log.type === "call" ? "25 min before" : "File Name.mp4"} linked={log.type !== "call"} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function ActivityMeta({ label, value, linked = false }: { label: string; value: string; linked?: boolean }) {
  return (
    <div className="min-w-0 border-fg-grey-200 md:border-r md:pr-4 md:last:border-r-0">
      <p className="text-xs font-medium leading-4 tracking-fg text-fg-grey-700">{label}</p>
      <p className={`mt-2 truncate text-sm font-medium leading-5 tracking-fg text-fg-black ${linked ? "underline" : ""}`}>{value}</p>
    </div>
  );
}
