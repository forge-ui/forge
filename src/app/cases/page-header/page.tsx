"use client";

import {
  Breadcrumbs,
  TopBar,
  PageHeader,
  type PageHeaderColor,
} from "@forge-ui-official/core";
import { Logout3Linear } from "solar-icon-set";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

const HEADER_COLORS = ["purple", "blue", "black"] as const;

const PROFILE = {
  name: "John Doe Hoegan",
  role: "Manager",
  avatar: "https://i.pravatar.cc/100?img=12",
};

const FLAG = (
  <img
    className="w-5 h-5 rounded-full object-cover"
    src="https://flagcdn.com/w40/us.png"
    alt="lang"
  />
);

// 8-row matrix: leftMode × showAddButton × showProfile (matches Figma "Search & Widget")
const SEARCH_ROWS: {
  leftMode: "search" | "hamburger";
  showAddButton: boolean;
  showProfile: boolean;
}[] = [
  { leftMode: "search", showAddButton: true, showProfile: true },
  { leftMode: "search", showAddButton: false, showProfile: true },
  { leftMode: "search", showAddButton: true, showProfile: false },
  { leftMode: "search", showAddButton: false, showProfile: false },
  { leftMode: "hamburger", showAddButton: true, showProfile: true },
  { leftMode: "hamburger", showAddButton: false, showProfile: true },
  { leftMode: "hamburger", showAddButton: true, showProfile: false },
  { leftMode: "hamburger", showAddButton: false, showProfile: false },
];

// 3-layout matrix: showBackButton × titleAvatar (matches Figma "Page Title")
const TITLE_ROWS: {
  showBackButton: boolean;
  titleAvatar?: string;
}[] = [
  { showBackButton: true },
  { showBackButton: false },
  { showBackButton: true, titleAvatar: PROFILE.avatar },
];

export default function PageHeaderCasePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="Page Header"
        hint="Breadcrumbs · TopBar · PageHeader (Search & Widget · Page Title)"
      />

      <Section title="Breadcrumbs" description="Colors: purple, blue, black">
        <SubSection title="All colors">
          {HEADER_COLORS.map((c) => (
            <Labeled key={c} label={c}>
              <Breadcrumbs
                color={c}
                items={[
                  { label: "Home", href: "#" },
                  { label: "Projects", href: "#" },
                  { label: "Current Page" },
                ]}
              />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      <Section title="TopBar" description="Colors: purple, blue, green">
        <SubSection title="All colors">
          {(["purple", "blue", "green"] as const).map((c) => (
            <div key={c} className="w-full">
              <Labeled label={c}>
                <div className="w-full">
                  <TopBar value={60} color={c} />
                </div>
              </Labeled>
            </div>
          ))}
        </SubSection>
      </Section>

      <Section
        title="PageHeader · Search & Widget"
        description="3 colors × 8 layouts (search/hamburger × +button on/off × profile on/off)"
      >
        {HEADER_COLORS.map((color) => (
          <SubSection key={color} title={color}>
            <div className="w-full flex flex-col gap-3">
              {SEARCH_ROWS.map((row, i) => (
                <div
                  key={i}
                  className="w-full bg-white rounded-xl border border-fg-grey-200 overflow-hidden"
                >
                  <PageHeader
                    variant="search"
                    color={color as PageHeaderColor}
                    leftMode={row.leftMode}
                    showCalendar
                    notifications={99}
                    messages={99}
                    languageFlag={FLAG}
                    showAddButton={row.showAddButton}
                    showProfile={row.showProfile}
                    profile={PROFILE}
                  />
                </div>
              ))}
            </div>
          </SubSection>
        ))}
      </Section>

      <Section
        title="PageHeader · Page Title"
        description="3 colors × 3 layouts (back+title · title only · back+avatar+title)"
      >
        {HEADER_COLORS.map((color) => (
          <SubSection key={color} title={color}>
            <div className="w-full flex flex-col gap-3">
              {TITLE_ROWS.map((row, i) => (
                <div
                  key={i}
                  className="w-full bg-white rounded-xl border border-fg-grey-200 overflow-hidden"
                >
                  <PageHeader
                    variant="title"
                    color={color as PageHeaderColor}
                    title="Page Title"
                    showBackButton={row.showBackButton}
                    titleAvatar={row.titleAvatar}
                    showDatePicker
                    datePickerLabel="Select Dates"
                    showFilters
                    filtersLabel="Filters"
                    showKebab
                    showFavorite
                    secondaryAction={{
                      label: "Tertiary",
                      icon: <Logout3Linear size={16} color="currentColor" />,
                    }}
                    primaryAction={{ label: "Primary" }}
                  />
                </div>
              ))}
            </div>
          </SubSection>
        ))}
      </Section>
    </div>
  );
}
