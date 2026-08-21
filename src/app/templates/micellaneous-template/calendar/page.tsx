"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AddCircleLinear, CloudDownloadLinear } from "solar-icon-set";
import { Avatar, Button, CellActions, FullCalendar, SurfaceCard } from "@forge-ui-official/core";
import { MicellaneousPageHeader, MicellaneousTemplateShell } from "../_chrome";
import { calendarEvents, contacts } from "../_data";

export default function MicellaneousCalendarPage() {
  return (
    <Suspense fallback={null}>
      <MicellaneousCalendarContent />
    </Suspense>
  );
}

function MicellaneousCalendarContent() {
  const searchParams = useSearchParams();
  const rawView = searchParams.get("view") ?? "week";
  const view = rawView === "month" || rawView === "day" ? rawView : "week";
  const showDetails = searchParams.get("details") === "1" || rawView.endsWith("-details");

  return (
    <MicellaneousTemplateShell>
      <div className="flex flex-col gap-5">
        <MicellaneousPageHeader
          variant="collection"
          title="Calendar"
          current={`Calendar ${view[0].toUpperCase()}${view.slice(1)}`}
          secondaryAction={{ label: "Export", icon: <CloudDownloadLinear size={18} /> }}
          primaryAction={{ label: "Add Event", icon: <AddCircleLinear size={18} /> }}
        />
        <FullCalendar
          view={view}
          color="purple"
          year={2025}
          month={4}
          day={13}
          events={calendarEvents}
          detailPanel={showDetails ? (
            <SurfaceCard className="max-h-[520px] w-[420px] overflow-hidden shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="size-4 rounded bg-fg-violet" />
                  <div>
                    <p className="text-2xl font-semibold text-fg-black">Weekly Meeting</p>
                    <p className="mt-2 text-sm font-medium text-fg-grey-500">Monday, 28 May | 08:00 - 09:00 AM</p>
                  </div>
                </div>
                <CellActions actions={[]} />
              </div>
              <p className="mt-6 text-sm font-semibold text-fg-black">About</p>
              <p className="mt-2 text-sm font-medium leading-6 text-fg-grey-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut pulvinar lacus, tempor dictum augue.
              </p>
              <Button className="mt-5">Join Meeting</Button>
              <p className="mt-6 text-sm font-semibold text-fg-black">5 guest</p>
              <div className="mt-3 flex flex-col gap-3">
                {contacts.slice(0, 5).map((contact) => (
                  <div key={contact.id} className="flex items-center gap-3">
                    <Avatar src={contact.avatar} size="sm" />
                    <span className="text-sm font-medium text-fg-grey-700">{contact.name}</span>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          ) : undefined}
        />
      </div>
    </MicellaneousTemplateShell>
  );
}
