"use client";

import { Suspense, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  AddCircleLinear,
  CalendarMinimalisticLinear,
  DocumentTextLinear,
  Pen2Linear,
  UsersGroupRoundedLinear,
  VideocameraRecordLinear,
} from "solar-icon-set";
import { Avatar, Button, FileTypeIcon, HistoryItem, StatusBadge, TabBar } from "@forge-ui-official/core";
import { ProtaskActivityDialog, normalizeProtaskActivityDialogId } from "../../../_shared/protask-actions";
import { CrmSurface, DetailLine } from "../../_components";
import { CrmPageHeader, CrmTemplateShell, leadStatusColor } from "../../_chrome";
import { activities, leads } from "../../_data";

const leadTabs = ["Activity", "Call", "Meet", "Attachment", "Notes"] as const;
type LeadTab = (typeof leadTabs)[number];

const tabAliases: Record<string, LeadTab> = {
  activity: "Activity",
  call: "Call",
  meet: "Meet",
  attachment: "Attachment",
  attachments: "Attachment",
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
    title: "Add Meet Log",
    submitLabel: "Add Meet Log",
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
      { label: "Lead", value: "Linda Blair" },
      { label: "Attachment", value: "+4" },
      { label: "Note", value: "Follow up lead qualification." },
    ],
  },
};

export default function CrmLeadDetailPage() {
  return (
    <Suspense fallback={null}>
      <CrmLeadDetailContent />
    </Suspense>
  );
}

function CrmLeadDetailContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [manualTab, setManualTab] = useState<LeadTab | null>(null);
  const lead = useMemo(() => leads.find((item) => item.id === params.id) ?? leads[0], [params.id]);
  const queryTab = tabAliases[(searchParams.get("tab") ?? "activity").toLowerCase()] ?? "Activity";
  const activeTab = manualTab ?? queryTab;
  const dialog = searchParams.get("dialog");
  const normalizedDialog = normalizeProtaskActivityDialogId(dialog);
  const activeDialog = normalizedDialog ? dialogFields[normalizedDialog] : undefined;
  const basePath = `/templates/crm-template/leads/${lead.id}`;

  return (
    <CrmTemplateShell>
      <div className="flex flex-col gap-6">
        <CrmPageHeader
          title="Leads Details"
          current="Leads Details"
          actions={
            <div className="flex flex-wrap gap-3">
              <Button color="grey" variant="tertiary" iconLeft={<Pen2Linear size={18} />} onClick={() => router.push("/templates/crm-template/leads?dialog=edit-leads")}>Edit Leads</Button>
              <Button iconLeft={<AddCircleLinear size={18} />} onClick={() => router.push(`${basePath}?dialog=add-call-schedule`)}>Add Activity</Button>
            </div>
          }
        />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-5">
            <CrmSurface>
              <div className="flex flex-col items-center text-center">
                <Avatar src={lead.avatar} size="lg" />
                <h2 className="mt-4 text-xl font-semibold text-fg-black">{lead.name}</h2>
                <p className="mt-1 text-sm font-medium text-fg-grey-500">{lead.email}</p>
                <div className="mt-4">
                  <StatusBadge label={lead.status} color={leadStatusColor[lead.status]} />
                </div>
              </div>
            </CrmSurface>
            <CrmSurface title="Lead Information">
              <DetailLine label="Phone" value={lead.phone} />
              <DetailLine label="Company" value={lead.company} />
              <DetailLine label="Source" value={lead.source} />
              <DetailLine label="Added" value={lead.added} />
            </CrmSurface>
          </aside>
          <main className="min-w-0">
            <CrmSurface className="p-0">
              <TabBar
                color="purple"
                surface="page"
                tabs={leadTabs.map((label) => ({ label, active: label === activeTab }))}
                onChange={(index) => setManualTab(leadTabs[index])}
              />
              <div className="p-5">
                <LeadTabContent tab={activeTab} />
              </div>
            </CrmSurface>
          </main>
        </div>
        <ProtaskActivityDialog
          open={!!activeDialog}
          dialogId={normalizedDialog}
          onClose={() => router.replace(`${basePath}?tab=${activeTab.toLowerCase()}`)}
        />
      </div>
    </CrmTemplateShell>
  );
}

function LeadTabContent({ tab }: { tab: LeadTab }) {
  if (tab === "Attachment") {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {["Lead Brief.pdf", "File Name.mp4", "Contract Draft.doc"].map((file, index) => (
          <div key={file} className="rounded-[20px] border border-fg-grey-200 bg-white p-5">
            <FileTypeIcon fileName={file} className="size-12" />
            <p className="mt-5 text-sm font-semibold text-fg-black">{file}</p>
            <p className="mt-1 text-xs font-medium text-fg-grey-500">{index + 1}.1 MB</p>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "Notes") {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="rounded-[20px] border border-fg-grey-200 bg-white p-5">
            <HistoryItem
              variant="badge"
              color="purple"
              icon={<DocumentTextLinear size={18} />}
              title="Meeting Notes"
              description={<span className="text-fg-grey-700">Qualification note, expected budget and follow-up plan.</span>}
              datetime="14 Jan 2025, 10:00"
              showConnector={false}
            />
          </div>
        ))}
      </div>
    );
  }

  const filtered = tab === "Activity" ? activities : activities.filter((activity) => activity.type === tab);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {filtered.concat(filtered).slice(0, 4).map((activity, index) => (
        <HistoryItem
          key={`${activity.id}-${index}`}
          variant="badge"
          color="purple"
          icon={activity.type === "Call" ? <VideocameraRecordLinear size={18} /> : activity.type === "Meet" ? <UsersGroupRoundedLinear size={18} /> : <CalendarMinimalisticLinear size={18} />}
          title={activity.type === "Call" ? "Call with Linda Blair" : activity.type === "Meet" ? "Meet With Linda Blair" : activity.title}
          description={<span className="text-fg-grey-700">{activity.note}</span>}
          datetime={`${activity.date}, ${activity.time}`}
          showConnector={false}
        />
      ))}
    </div>
  );
}
