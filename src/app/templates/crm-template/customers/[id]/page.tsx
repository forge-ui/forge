"use client";

import { Suspense, useMemo, useState, type ReactNode } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  AddCircleLinear,
  AltArrowDownLinear,
  CalendarMinimalisticLinear,
  ChatRoundLineLinear,
  DocumentTextLinear,
  FileTextLinear,
  MenuDotsLinear,
  Pen2Linear,
  PhoneLinear,
  PlayCircleBold,
  VideocameraRecordLinear,
} from "solar-icon-set";
import {
  Avatar,
  Button,
  Checkbox,
  FileTypeIcon,
  Pagination,
  StatusBadge,
  TabBar,
  Toolbar,
  ToolbarActions,
  ToolbarSearchInput,
  ToolbarShowSelect,
} from "@forge-ui-official/core";
import { ProtaskActivityDialog, ProtaskFilterTrigger, normalizeProtaskActivityDialogId } from "../../../_shared/protask-actions";
import { CrmPageHeader, CrmTemplateShell, saleStatusColor } from "../../_chrome";
import { crmAsset, customers, mainProfile, type Customer, type SaleStatus } from "../../_data";

const detailTabs = ["Activity", "Transactions", "Call", "Meet", "Attachment", "Notes"] as const;
type DetailTab = (typeof detailTabs)[number];
type ProfileTab = "Details" | "Address";

const lindaBlairAvatar = crmAsset("linda-blair-avatar.png");
const noteImageSrcs = [
  crmAsset("note-interior-1.png"),
  crmAsset("note-interior-2.png"),
  crmAsset("note-interior-3.png"),
  crmAsset("note-interior-4.png"),
] as const;

const tabAliases: Record<string, DetailTab> = {
  activity: "Activity",
  transactions: "Transactions",
  transaction: "Transactions",
  call: "Call",
  meet: "Meet",
  attachment: "Attachment",
  attachments: "Attachment",
  notes: "Notes",
};

const dialogFields: Record<
  string,
  { title: string; submitLabel: string; fields: Array<{ label: string; value?: string; placeholder?: string }> }
> = {
  "add-transaction": {
    title: "Add Transaction",
    submitLabel: "Add Transaction",
    fields: [
      { label: "Transaction Name", value: "Website Redesign" },
      { label: "Amount", value: "$2,121.00" },
      { label: "Invoice ID", value: "INV23064" },
      { label: "Status", value: "Paid" },
    ],
  },
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
      { label: "Customer", value: "Linda Blair" },
      { label: "Attachment", value: "+4" },
      { label: "Note", value: "Follow up approval and next milestone." },
    ],
  },
};

const transactions: Array<{
  name: string;
  invoice: string;
  date: string;
  time: string;
  total: string;
  status: SaleStatus;
}> = [
  { name: "Marketing Project", invoice: "INV-49082", date: "14 Jan 2025", time: "15:00", total: "$121.00", status: "Pending" },
  { name: "Internal CRM Phase 2", invoice: "INV-49082", date: "14 Jan 2025", time: "12:00", total: "$590.00", status: "Pending" },
  { name: "Internal CRM Phase 1", invoice: "INV-49082", date: "14 Jan 2025", time: "10:15", total: "$125.00", status: "Overdue" },
  { name: "Redesign Landing Page", invoice: "INV-49082", date: "14 Jan 2025", time: "08:01", total: "$348.00", status: "Paid" },
  { name: "CRM Brainstorming", invoice: "INV-49082", date: "14 Jan 2025", time: "07:44", total: "$607.00", status: "Paid" },
];

const files = [
  { name: "3rd Meeting MOM.doc" },
  { name: "New Requirement.pdf" },
  { name: "CTA Promo.gif" },
  { name: "Project Presentation.ppt" },
  { name: "Brainstorming.pdf" },
  { name: "Marketing Material.ppt" },
  { name: "New Logo.png" },
  { name: "Project Alpha.pdf" },
  { name: "Banner.svg" },
  { name: "Photo Material.jpg" },
] as const;

export default function CrmCustomerDetailPage() {
  return (
    <Suspense fallback={null}>
      <CrmCustomerDetailContent />
    </Suspense>
  );
}

function CrmCustomerDetailContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [manualTab, setManualTab] = useState<DetailTab | null>(null);
  const [profileTab, setProfileTab] = useState<ProfileTab>("Details");
  const customer = useMemo(
    () => customers.find((item) => item.id === params.id) ?? customers.find((item) => item.id === "linda-blair") ?? customers[0],
    [params.id],
  );
  const queryTab = tabAliases[(searchParams.get("tab") ?? "activity").toLowerCase()] ?? "Activity";
  const activeTab = manualTab ?? queryTab;
  const dialog = searchParams.get("dialog");
  const normalizedDialog = normalizeProtaskActivityDialogId(dialog);
  const activeDialog = normalizedDialog ? dialogFields[normalizedDialog] : undefined;
  const basePath = `/templates/crm-template/customers/${customer.id}`;
  const variant = (searchParams.get("variant") ?? searchParams.get("view") ?? "").toLowerCase();
  const isVer2 = variant === "ver2" || variant === "ver-2" || variant === "customer-details-ver-2";

  const openAddDialog = () => {
    const target =
      activeTab === "Transactions"
        ? "add-transaction"
        : activeTab === "Call"
          ? "add-call-schedule"
          : activeTab === "Meet"
            ? "add-meet-log"
            : activeTab === "Notes"
              ? "add-notes"
              : "add-meet-log";
    router.push(`${basePath}?dialog=${target}`);
  };

  const profileCard = (
    <CustomerProfileCard
      customer={customer}
      activeTab={profileTab}
      onTabChange={setProfileTab}
    />
  );
  const detailSection = (
    <section className="min-w-0">
      <div className="flex min-w-0 flex-col gap-6">
        <div className="min-w-0 overflow-x-auto">
          <TabBar
            color="purple"
            tabs={detailTabs.map((label) => ({ label, active: label === activeTab }))}
            onChange={(index) => setManualTab(detailTabs[index])}
            className="min-w-max"
          />
        </div>
        <DetailToolbar />
        <DetailContent activeTab={activeTab} />
      </div>
    </section>
  );

  return (
    <CrmTemplateShell>
      <div className="flex flex-col gap-5">
        <CrmPageHeader
          variant="detail"
          title="Customer Details"
          current="Customer Details"
          parents={[{ label: "Customer", href: "/templates/crm-template/customers" }]}
          menuAction={{ ariaLabel: "More customer actions" }}
          secondaryAction={{ label: "Edit", icon: <Pen2Linear size={18} />, onClick: () => router.push("/templates/crm-template/customers?dialog=edit-customer") }}
          primaryAction={{ label: "Add", icon: <AddCircleLinear size={18} />, onClick: openAddDialog }}
        />

        <div className={isVer2 ? "grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]" : "grid grid-cols-1 items-start gap-4 xl:grid-cols-[300px_minmax(0,1fr)]"}>
          {isVer2 ? (
            <>
              {detailSection}
              {profileCard}
            </>
          ) : (
            <>
              {profileCard}
              {detailSection}
            </>
          )}
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

function CustomerProfileCard({
  customer,
  activeTab,
  onTabChange,
}: {
  customer: Customer;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}) {
  const displayCustomer = {
    ...customer,
    avatar: lindaBlairAvatar,
    name: "Linda Blair",
    email: "lindablair@mail.com",
    company: "Target",
    spent: "$14,250.00",
  };

  return (
    <aside className="overflow-hidden rounded-[20px] border border-fg-grey-200 bg-white">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden p-6">
        <div className="absolute left-2 right-2 top-2 h-28 rounded-xl bg-gradient-to-br from-fg-violet via-fg-red-100 to-fg-yellow-50" />
        <div className="relative z-10 flex flex-col items-center gap-3 pt-10 text-center">
          <Avatar src={displayCustomer.avatar} alt={displayCustomer.name} size="2xl" />
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold leading-8 tracking-fg text-fg-black">{displayCustomer.name}</h2>
            <p className="text-sm font-medium leading-5 tracking-fg text-fg-grey-700">
              <span className="text-fg-black">ID:</span> @linda_blair321
            </p>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <Button color="grey" variant="tertiary" iconLeft={<PhoneLinear size={18} />}>
            Call
          </Button>
          <Button iconLeft={<ChatRoundLineLinear size={18} />}>
            Message
          </Button>
        </div>
      </div>

      <div className="border-t border-fg-grey-200 px-6 pt-4">
        <TabBar
          color="purple"
          tabs={(["Details", "Address"] as const).map((label) => ({ label, active: activeTab === label }))}
          onChange={(index) => onTabChange((["Details", "Address"] as const)[index])}
          className="w-full [&>button]:flex-1 [&>button]:justify-center"
        />
      </div>

      <div className="p-6">
        {activeTab === "Details" ? (
          <div className="flex flex-col gap-4">
            <ProfileField label="Client ID" value="ID011221" />
            <ProfileField label="Company" value={displayCustomer.company} />
            <ProfileField label="Total Project" value="43" />
            <ProfileField label="Spent" value={displayCustomer.spent} />
            <ProfileField
              label="Email"
              action
              value={
                <div className="flex flex-col items-start gap-2">
                  <PillValue>{displayCustomer.email}</PillValue>
                  <PillValue>lindablair@targetco.com</PillValue>
                </div>
              }
            />
            <ProfileField
              label="Phone Number"
              action
              value={<PillValue>+1 234 241 567</PillValue>}
            />
            <ProfileField label="Added" value="12 December 2022" />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <ProfileField
              label="Address"
              value="1833 Bel Meadow Drive, Fontana, California 92335, USA"
            />
            <ProfileField
              label="Company Address"
              value="1833 Bel Meadow Drive, Fontana, California 92335, USA"
            />
          </div>
        )}
      </div>
    </aside>
  );
}

function ProfileField({
  label,
  value,
  action = false,
}: {
  label: string;
  value: ReactNode;
  action?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-5 tracking-fg text-fg-grey-700">{label}</p>
        <div className="mt-1 text-sm font-medium leading-5 tracking-fg text-fg-black">{value}</div>
      </div>
      {action ? (
        <button
          type="button"
          className="grid size-5 place-items-center text-sm font-medium text-fg-grey-700"
          aria-label={`Add ${label}`}
        >
          +
        </button>
      ) : null}
    </div>
  );
}

function PillValue({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-fg-grey-200 px-3 py-1.5 text-sm font-medium leading-5 tracking-fg text-fg-violet">
      {children}
    </span>
  );
}

function DetailToolbar() {
  return (
    <Toolbar
      className="flex-col gap-3 lg:flex-row lg:items-start"
      left={<ToolbarSearchInput placeholder="Search. . ." />}
      right={
        <ToolbarActions>
          <ProtaskFilterTrigger color="purple" count={0} />
          <ToolbarShowSelect value="5" />
        </ToolbarActions>
      }
    />
  );
}

function DetailContent({ activeTab }: { activeTab: DetailTab }) {
  if (activeTab === "Transactions") return <TransactionsPanel />;
  if (activeTab === "Call") return <ScheduleLogPanel kind="call" />;
  if (activeTab === "Meet") return <ScheduleLogPanel kind="meet" />;
  if (activeTab === "Attachment") return <AttachmentPanel />;
  if (activeTab === "Notes") return <NotesPanel />;

  const entries = ["meet-log", "call-schedule", "notes", "meet-log-2"];

  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry, index) => (
        <ActivityEntry key={`${entry}-${index}`} type={entry} />
      ))}
    </div>
  );
}

function ScheduleLogPanel({ kind }: { kind: "call" | "meet" }) {
  return (
    <div className="flex flex-col gap-5">
      <TimelineSectionTitle>Schedule</TimelineSectionTitle>
      <ActivityEntry type={`${kind}-schedule`} />
      <TimelineSectionTitle>Log</TimelineSectionTitle>
      <ActivityEntry type={`${kind}-log`} />
      <ActivityEntry type={`${kind}-log-2`} />
    </div>
  );
}

function TimelineSectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-2xl font-semibold leading-8 tracking-fg text-fg-black">{children}</h2>
      <span className="h-px flex-1 bg-fg-grey-200" />
    </div>
  );
}

function ActivityEntry({ type }: { type: string }) {
  const isCall = type.includes("call");
  const isNotes = type.includes("notes");
  const isMeet = type.includes("meet");
  const isLog = type.includes("log");
  const config = isNotes
    ? {
        icon: <DocumentTextLinear size={16} color="#09B96D" />,
        iconClassName: "bg-fg-green-50",
        meta: "Notes created John Doe Hoegan",
        title: "Meeting Notes",
        avatar: mainProfile.avatar,
      }
    : isCall
      ? {
          icon: <PhoneLinear size={16} color="#F6C002" />,
          iconClassName: "bg-fg-yellow-50",
          meta: isLog ? "Call schedule created Lisa Williams" : "Call schedule created John Doe Hoegan",
          title: "Call with Linda Blair",
          avatar: isLog ? lindaBlairAvatar : mainProfile.avatar,
        }
      : {
          icon: <VideocameraRecordLinear size={16} color="#7239EA" />,
          iconClassName: "bg-fg-violet-50",
          meta: isLog ? "Call schedule created John Doe Hoegan" : "Call schedule created Lisa Williams",
          title: "Meeting with Linda Blair",
          avatar: isLog ? mainProfile.avatar : lindaBlairAvatar,
        };

  return (
    <article className="overflow-hidden rounded-[20px] border border-fg-grey-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-fg-grey-200 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`grid size-9 shrink-0 place-items-center rounded-full ${config.iconClassName}`}>
            {config.icon}
          </div>
          <p className="truncate text-sm font-medium leading-5 tracking-fg text-fg-grey-700">{config.meta}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium leading-4 tracking-fg text-fg-grey-700">
          <CalendarMinimalisticLinear size={18} color="#868686" />
          <span>14 Jan 2025, 10:00</span>
          <MenuDotsLinear size={18} color="#868686" />
        </div>
      </div>
      <div className="flex items-start gap-3 p-5">
        <Avatar src={config.avatar} size="sm" />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-6 tracking-fg text-fg-black">{config.title}</h3>
          <p className="mt-2 text-sm font-normal leading-5 tracking-fg text-fg-grey-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut ex nunc. In porta velit at nunc blandit, ac interdum sapien accumsan.
          </p>
          {isNotes ? <NoteImages /> : isCall && isLog ? <CallLogDetailGrid /> : isCall || (isMeet && !isLog) ? <CallDetailGrid /> : <MeetDetailGrid />}
        </div>
      </div>
    </article>
  );
}

function MeetDetailGrid() {
  return (
    <div className="mt-5 grid gap-4 rounded-xl border border-fg-grey-200 bg-fg-grey-50 p-4 md:grid-cols-3">
      <InfoBlock label="Result" icon={<FileTextLinear size={18} color="#868686" />} value="Cost Agreement" />
      <InfoBlock label="Record" fileName="File Name.mp4" value="File Name.mp4" />
      <InfoBlock label="Attachment" fileName="File Name.doc" value="File Name.mp4" />
    </div>
  );
}

function CallDetailGrid() {
  return (
    <div className="mt-5 grid gap-4 rounded-xl border border-fg-grey-200 bg-fg-grey-50 p-4 md:grid-cols-3">
      <InfoBlock label="Date" icon={<CalendarMinimalisticLinear size={18} color="#868686" />} value="14 Feb 2025, 14:00" />
      <InfoBlock label="Purpose" value="Follow Up" />
      <InfoBlock label="Reminder" icon={<CalendarMinimalisticLinear size={18} color="#868686" />} value="25 min before" />
    </div>
  );
}

function CallLogDetailGrid() {
  return (
    <div className="mt-5 grid gap-4 rounded-xl border border-fg-grey-200 bg-fg-grey-50 p-4 md:grid-cols-3">
      <InfoBlock label="Result" icon={<FileTextLinear size={18} color="#868686" />} value="Cost Agreement" />
      <div className="min-w-0 border-fg-grey-200 md:border-r md:pr-4">
        <p className="text-xs font-medium leading-4 tracking-fg text-fg-grey-700">Record</p>
        <div className="mt-2 flex min-w-0 items-center gap-2">
          <PlayCircleBold size={24} color="#8E42FF" />
          <Waveform />
        </div>
      </div>
      <InfoBlock label="Attachment" fileName="File Name.doc" value="File Name.mp4" />
    </div>
  );
}

function Waveform() {
  const bars = [12, 18, 8, 22, 28, 14, 24, 30, 20, 26, 12, 18, 24, 10, 16, 22];

  return (
    <div className="flex min-w-0 items-center gap-1">
      {bars.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className={index < 10 ? "w-0.5 rounded-full bg-fg-violet" : "w-0.5 rounded-full bg-fg-grey-200"}
          style={{ height }}
        />
      ))}
    </div>
  );
}

function InfoBlock({
  label,
  value,
  icon,
  fileName,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  fileName?: string;
}) {
  return (
    <div className="min-w-0 border-fg-grey-200 md:border-r md:pr-4 md:last:border-r-0">
      <p className="text-xs font-medium leading-4 tracking-fg text-fg-grey-700">{label}</p>
      <div className="mt-2 flex min-w-0 items-center gap-1.5 text-sm font-medium leading-5 tracking-fg text-fg-black">
        {fileName ? <FileTypeIcon fileName={fileName} className="size-8" /> : icon}
        <span className={fileName ? "truncate underline" : "truncate"}>{value}</span>
        {fileName ? <MenuDotsLinear size={16} color="#868686" /> : null}
      </div>
    </div>
  );
}

function TransactionsPanel() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-fg-grey-200 bg-white">
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[minmax(260px,1fr)_176px_148px_160px_52px] border-b border-fg-grey-200">
            <TableHeader sortable>Transactions</TableHeader>
            <TableHeader>Added</TableHeader>
            <TableHeader sortable>Total</TableHeader>
            <TableHeader sortable>Status</TableHeader>
            <div className="bg-white px-6 py-4" />
          </div>
          {transactions.map((row) => (
            <div
              key={row.name}
              className="grid grid-cols-[minmax(260px,1fr)_176px_148px_160px_52px] border-b border-fg-grey-200 last:border-b-0"
            >
              <div className="flex items-center gap-2 bg-white px-6 py-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-fg-violet-50">
                  <DocumentTextLinear size={18} color="#7239EA" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-5 tracking-fg text-fg-black">{row.name}</p>
                  <p className="truncate text-xs font-normal leading-4 tracking-fg text-fg-grey-700">{row.invoice}</p>
                </div>
              </div>
              <div className="flex flex-col justify-center bg-white px-6 py-4">
                <span className="text-sm font-semibold leading-5 tracking-fg text-fg-black">{row.date}</span>
                <span className="text-xs font-normal leading-4 tracking-fg text-fg-grey-700">{row.time}</span>
              </div>
              <div className="flex items-center bg-white px-6 py-4 text-sm font-semibold leading-5 tracking-fg text-fg-black">
                {row.total}
              </div>
              <div className="flex items-center bg-white px-6 py-4">
                <StatusBadge label={row.status} color={saleStatusColor[row.status]} />
              </div>
              <div className="flex items-center bg-white px-4 py-4">
                <MenuDotsLinear size={18} color="#868686" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <PaginationSummary label="Showing 1-5 from 100" />
    </div>
  );
}

function TableHeader({ children, sortable = false }: { children?: ReactNode; sortable?: boolean }) {
  return (
    <div className="flex items-center gap-2 bg-white px-6 py-4 text-sm font-semibold leading-5 tracking-fg text-fg-grey-700">
      <span>{children}</span>
      {sortable ? <AltArrowDownLinear size={14} color="#ACACAC" /> : null}
    </div>
  );
}

function AttachmentPanel() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {files.map((file) => (
          <article key={file.name} className="flex items-center gap-5 rounded-[20px] border border-fg-grey-200 bg-white p-5">
            <Checkbox />
            <FileTypeIcon fileName={file.name} className="size-14" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold leading-6 tracking-fg text-fg-black">{file.name}</h3>
              <p className="text-sm font-medium leading-5 tracking-fg text-fg-grey-700">100 KB</p>
            </div>
            <MenuDotsLinear size={18} color="#868686" />
          </article>
        ))}
      </div>
      <PaginationSummary label="Showing 1-12 from 100" plain />
    </div>
  );
}

function NotesPanel() {
  return (
    <div className="flex flex-col gap-4">
      <NoteEntry title="Image Reference" meta="Call schedule created Lisa Williams" images={2} />
      <NoteEntry title="Adjustment for Phase 2" meta="Call schedule created John Doe Hoegan" images={0} />
      <NoteEntry title="Meeting Notes" meta="Notes created John Doe Hoegan" images={4} />
    </div>
  );
}

function NoteEntry({ title, meta, images }: { title: string; meta: string; images: number }) {
  return (
    <article className="overflow-hidden rounded-[20px] border border-fg-grey-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-fg-grey-200 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-fg-green-50">
            <DocumentTextLinear size={16} color="#09B96D" />
          </div>
          <p className="truncate text-sm font-medium leading-5 tracking-fg text-fg-grey-700">{meta}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium leading-4 tracking-fg text-fg-grey-700">
          <CalendarMinimalisticLinear size={18} color="#868686" />
          <span>14 Jan 2025, 10:00</span>
          <MenuDotsLinear size={18} color="#868686" />
        </div>
      </div>
      <div className="flex items-start gap-3 p-5">
        <Avatar src={lindaBlairAvatar} size="sm" />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-6 tracking-fg text-fg-black">{title}</h3>
          <p className="mt-2 text-sm font-normal leading-5 tracking-fg text-fg-grey-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut ex nunc. In porta velit at nunc blandit, ac interdum sapien accumsan.
          </p>
          {images > 0 ? <NoteImages count={images} /> : null}
        </div>
      </div>
    </article>
  );
}

function NoteImages({ count = 4 }: { count?: number }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="relative h-24 min-w-0 overflow-hidden rounded-lg bg-fg-grey-100"
        >
          <img
            src={noteImageSrcs[index % noteImageSrcs.length]}
            alt=""
            className="h-full w-full object-cover"
          />
          {index === count - 1 && count > 3 ? (
            <div className="absolute inset-0 grid place-items-center bg-fg-black/50 text-base font-semibold leading-6 tracking-fg text-white">
              +4
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function PaginationSummary({ label, plain = false }: { label: string; plain?: boolean }) {
  return (
    <div className={`flex flex-col gap-4 ${plain ? "" : "border-t border-fg-grey-200"} p-5 md:flex-row md:items-center md:justify-between`}>
      <p className="text-sm font-medium leading-5 tracking-fg text-fg-grey-700">{label}</p>
      <Pagination totalPages={5} currentPage={1} color="purple" />
    </div>
  );
}
