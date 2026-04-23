"use client";

import { useState } from "react";
import {
  MenuItem,
  DropdownPanel,
  DropdownDivider,
  IconTrigger,
  ProfileCard,
  NotificationItem,
  KebabMenu,
  SidebarMenu,
  SmallCalendar,
  ContactItem,
  Avatar,
  type AccentColor,
  type MenuItemState,
  type ProfileCardState,
  type SidebarMenuBgMode,
  type SidebarMenuMode,
} from "@forge-ui/react";
import {
  HomeBoldDuotone,
  ChartBoldDuotone,
  SettingsBoldDuotone,
  UserBoldDuotone,
  FolderBoldDuotone,
  StarBoldDuotone,
  BellBoldDuotone,
  LetterBoldDuotone,
  CalendarBoldDuotone,
  PenNewSquareBoldDuotone,
  CopyBoldDuotone,
  TrashBinTrashBoldDuotone,
  AddCircleBoldDuotone,
  UsersGroupRoundedBoldDuotone,
  Logout3BoldDuotone,
} from "solar-icon-set";
import { PageHeading, Section, SubSection } from "../_shared";

const accentColors = ["purple", "blue", "black"] as const satisfies readonly AccentColor[];

const flagSvg = (inner: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">${inner}</svg>`
  );

const avatarImg = (initials: string, bg = "#EDE9FE", fg = "#7C3AED") =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" rx="20" fill="${bg}"/><text x="20" y="25" font-family="Manrope,sans-serif" font-size="14" font-weight="700" fill="${fg}" text-anchor="middle">${initials}</text></svg>`
  );

// US: red/white stripes + blue canton, clipped to circle
const flagEn = flagSvg(
  `<defs><clipPath id="us"><circle cx="10" cy="10" r="10"/></clipPath></defs><g clip-path="url(#us)"><rect width="20" height="20" fill="#FFFFFF"/><rect y="1.7" width="20" height="1.5" fill="#B22234"/><rect y="4.7" width="20" height="1.5" fill="#B22234"/><rect y="7.7" width="20" height="1.5" fill="#B22234"/><rect y="10.7" width="20" height="1.5" fill="#B22234"/><rect y="13.7" width="20" height="1.5" fill="#B22234"/><rect y="16.7" width="20" height="1.5" fill="#B22234"/><rect width="9" height="9" fill="#3C3B6E"/></g>`
);

// UK: Union Jack, clipped to circle
const flagUk = flagSvg(
  `<defs><clipPath id="uk"><circle cx="10" cy="10" r="10"/></clipPath></defs><g clip-path="url(#uk)"><rect width="20" height="20" fill="#012169"/><path d="M0,0 L20,20 M20,0 L0,20" stroke="#FFFFFF" stroke-width="3"/><path d="M0,0 L20,20 M20,0 L0,20" stroke="#C8102E" stroke-width="1.2"/><rect x="8" width="4" height="20" fill="#FFFFFF"/><rect y="8" width="20" height="4" fill="#FFFFFF"/><rect x="9" width="2" height="20" fill="#C8102E"/><rect y="9" width="20" height="2" fill="#C8102E"/></g>`
);

// France: 3 vertical bands, clipped to circle
const flagFr = flagSvg(
  `<defs><clipPath id="fr"><circle cx="10" cy="10" r="10"/></clipPath></defs><g clip-path="url(#fr)"><rect width="6.67" height="20" fill="#002654"/><rect x="6.67" width="6.67" height="20" fill="#FFFFFF"/><rect x="13.33" width="6.67" height="20" fill="#ED2939"/></g>`
);

// Japan: white circle + red sun
const flagJp = flagSvg(
  `<circle cx="10" cy="10" r="10" fill="#FFFFFF"/><circle cx="10" cy="10" r="6" fill="#BC002D"/>`
);

const kebabItems = [
  { icon: <PenNewSquareBoldDuotone size={20} />, label: "Edit" },
  { icon: <CopyBoldDuotone size={20} />, label: "Duplicate" },
  { icon: <TrashBinTrashBoldDuotone size={20} />, label: "Delete", danger: true },
];

const states = ["idle", "hover", "active", "disabled"] as const satisfies readonly MenuItemState[];

export default function MenuCasePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="Menu"
        hint="MenuItem · DropdownPanel · IconTrigger · ProfileCard · NotificationItem · KebabMenu · SidebarMenu"
      />

      <MenuItemSection />
      <SecondaryMenuSection />
      <SidebarMenuSection />
      <KebabMenuSection />
    </div>
  );
}

// ============================================================
// Page 1: Menu — MenuItem × states × kinds × surfaces × intent
// ============================================================

function MenuItemSection() {
  return (
    <Section
      title="MenuItem"
      description="Figma: Single (5色) / Submenu (4色) / Dropdown (4色) · 4 正交轴 accent/surface/intent/kind"
    >
      <SubSection title="Single · accent × state (3 colors × 4 states)">
        <div className="grid grid-cols-4 gap-x-6 gap-y-3 w-[720px]">
          {accentColors.map((accent) =>
            states.map((state) => (
              <div key={`${accent}-${state}`} className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-fg-grey-500">
                  {accent} · {state}
                </span>
                <MenuItem
                  lead={{ kind: "icon", icon: <HomeBoldDuotone size={20} /> }}
                  label="Text Menu"
                  badge={99}
                  accent={accent}
                  state={state}
                />
              </div>
            ))
          )}
        </div>
      </SubSection>

      <SubSection title="Single · content variants (purple, idle)">
        <div className="w-64 pl-4 flex flex-col gap-2">
          <MenuItem
            lead={{ kind: "icon", icon: <HomeBoldDuotone size={20} /> }}
            label="Icon + Text + Badge"
            badge={99}
          />
          <MenuItem lead={{ kind: "icon", icon: <ChartBoldDuotone size={20} /> }} label="Icon + Text" />
          <MenuItem label="Text only" badge={99} />
          <MenuItem label="Text only (no badge)" />
          <div className="inline-flex gap-2">
            <MenuItem lead={{ kind: "icon", icon: <BellBoldDuotone size={20} /> }} badge={99} />
            <MenuItem lead={{ kind: "icon", icon: <UserBoldDuotone size={20} /> }} />
          </div>
          <MenuItem
            lead={{ kind: "image", src: avatarImg("JD") }}
            label="Image + Text"
            badge={99}
          />
          <MenuItem lead={{ kind: "image", src: avatarImg("JD") }} label="Image + Text" />
          <div className="inline-flex gap-2">
            <MenuItem lead={{ kind: "image", src: avatarImg("JD") }} badge={99} />
            <MenuItem lead={{ kind: "image", src: avatarImg("JD") }} />
          </div>
        </div>
      </SubSection>

      <SubSection title="Single · onColoredBg (Figma 'White' variant)">
        <div className="flex items-start gap-6">
          {accentColors.map((accent) => (
            <div
              key={accent}
              className={`w-72 p-4 rounded-xl ${accent === "purple" ? "bg-fg-violet" : accent === "blue" ? "bg-blue-600" : "bg-fg-black"}`}
            >
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-wider text-white/60">
                  {accent} · surface=onColoredBg
                </span>
                {states.map((state) => (
                  <MenuItem
                    key={state}
                    lead={{ kind: "icon", icon: <HomeBoldDuotone size={20} /> }}
                    label={`Text Menu · ${state}`}
                    badge={99}
                    accent={accent}
                    surface="onColoredBg"
                    state={state}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Single · intent=danger (Figma 'Red' variant)">
        <div className="w-64 pl-4 flex flex-col gap-2">
          <MenuItem
            lead={{ kind: "icon", icon: <TrashBinTrashBoldDuotone size={20} /> }}
            label="Delete"
            intent="danger"
            state="idle"
            badge={99}
          />
          <MenuItem
            lead={{ kind: "icon", icon: <TrashBinTrashBoldDuotone size={20} /> }}
            label="Delete"
            intent="danger"
            state="hover"
          />
          <MenuItem
            lead={{ kind: "icon", icon: <Logout3BoldDuotone size={20} /> }}
            label="Sign Out"
            intent="danger"
          />
        </div>
      </SubSection>

      <SubSection title="Submenu · indented child rows (4 colors)">
        <div className="flex items-start gap-6">
          {accentColors.map((accent) => (
            <div key={accent} className="w-56 pl-4 flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-fg-grey-500">
                {accent}
              </span>
              <MenuItem accent={accent} kind="submenu" label="Idle" badge={99} />
              <MenuItem accent={accent} kind="submenu" label="Hover" state="hover" />
              <MenuItem accent={accent} kind="submenu" label="Active" active />
              <MenuItem accent={accent} kind="submenu" label="No badge" />
            </div>
          ))}
          <div className="w-56 p-4 rounded-xl bg-fg-violet flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-white/60">
              onColoredBg
            </span>
            <MenuItem accent="purple" kind="submenu" surface="onColoredBg" label="Idle" />
            <MenuItem
              accent="purple"
              kind="submenu"
              surface="onColoredBg"
              label="Active"
              active
            />
          </div>
        </div>
      </SubSection>

      <SubSection title="Dropdown · parent row with right chevron (4 colors)">
        <div className="flex items-start gap-6 flex-wrap">
          {accentColors.map((accent) => (
            <DropdownPanel key={accent}>
              <MenuItem
                accent={accent}
                kind="dropdown"
                lead={{ kind: "icon", icon: <HomeBoldDuotone size={20} /> }}
                label="Dashboard"
                active
                badge={5}
              />
              <MenuItem
                accent={accent}
                kind="dropdown"
                lead={{ kind: "icon", icon: <ChartBoldDuotone size={20} /> }}
                label="Analytics"
              />
              <MenuItem
                accent={accent}
                kind="dropdown"
                lead={{ kind: "icon", icon: <FolderBoldDuotone size={20} /> }}
                label="Projects"
                badge={99}
              />
              <MenuItem
                accent={accent}
                kind="dropdown"
                lead={{ kind: "icon", icon: <SettingsBoldDuotone size={20} /> }}
                label="Settings"
              />
            </DropdownPanel>
          ))}

          <div className="w-64 p-4 rounded-xl bg-fg-violet flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-white/60 pb-2">
              onColoredBg (sidebar context)
            </span>
            <MenuItem
              accent="purple"
              kind="dropdown"
              surface="onColoredBg"
              lead={{ kind: "icon", icon: <HomeBoldDuotone size={20} /> }}
              label="Dashboard"
            />
            <MenuItem
              accent="purple"
              kind="dropdown"
              surface="onColoredBg"
              lead={{ kind: "icon", icon: <ChartBoldDuotone size={20} /> }}
              label="Analytics"
              active
            />
            <MenuItem
              accent="purple"
              kind="dropdown"
              surface="onColoredBg"
              lead={{ kind: "icon", icon: <FolderBoldDuotone size={20} /> }}
              label="Projects"
              badge={5}
            />
          </div>
        </div>
      </SubSection>
    </Section>
  );
}

// ============================================================
// Page 2: Secondary Menu — Profile / Team / Notification / Language / Message / Calendar
// ============================================================

function SecondaryMenuSection() {
  return (
    <Section
      title="Secondary Menu"
      description="Figma: Profile / Team / Notification / Language / Message / Calendar — 侧栏卡片式下拉"
    >
      <SubSection title="Profile · 4 colors × 3 states">
        <div className="flex flex-col gap-3">
          {accentColors.map((accent) => (
            <div key={accent} className="flex items-start gap-4">
              <span className="w-16 text-fg-grey-700 text-sm font-medium capitalize">
                {accent}
              </span>
              {(["idle", "hover", "selected"] as const satisfies readonly ProfileCardState[]).map(
                (state) => (
                  <div key={state} className="w-60">
                    <ProfileCard
                      avatar={avatarImg("JH")}
                      name="John Hoegan"
                      subtitle="Manager"
                      state={state}
                      accent={accent}
                    />
                  </div>
                )
              )}
            </div>
          ))}

          <div className="flex items-start gap-4">
            <span className="w-16 text-fg-grey-700 text-sm font-medium capitalize">
              onColoredBg
            </span>
            {(["idle", "hover", "selected"] as const satisfies readonly ProfileCardState[]).map(
              (state) => (
                <div key={state} className="w-60 p-3 rounded-2xl bg-fg-violet">
                  <ProfileCard
                    avatar={avatarImg("JH")}
                    name="John Hoegan"
                    subtitle="Manager"
                    accent="purple"
                    surface="onColoredBg"
                    state={state}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </SubSection>

      <SubSection title="Team Switcher · ProfileCard + DropdownPanel">
        <div className="flex items-start gap-8 flex-wrap">
          <div className="w-60 flex flex-col gap-3">
            <ProfileCard
              avatar={avatarImg("ST")}
              name="Sugab's Team"
              subtitle="24 Members"
              state="selected"
              accent="purple"
            />
            <span className="text-fg-grey-700 text-xs font-bold uppercase">Dropdown ↓</span>
          </div>
          <DropdownPanel width="w-64" padding="p-3">
            <div className="self-stretch pt-2 flex flex-col items-center gap-3">
              <img src={avatarImg("ST")} alt="Team" className="w-16 h-16 rounded-full" />
              <div className="self-stretch flex flex-col items-center gap-1">
                <span className="text-fg-black text-sm font-semibold">Sugab&apos;s Team</span>
                <span className="text-fg-grey-700 text-xs font-medium">24 Members</span>
              </div>
            </div>
            <div className="self-stretch flex flex-col">
              <MenuItem
                lead={{ kind: "icon", icon: <UsersGroupRoundedBoldDuotone size={20} /> }}
                label="Invite People"
              />
              <MenuItem
                lead={{ kind: "icon", icon: <SettingsBoldDuotone size={20} /> }}
                label="Setting"
              />
            </div>
            <DropdownDivider />
            <div className="self-stretch flex flex-col">
              <TeamRow initials="ST" name="Sugab's Team" selected />
              <TeamRow initials="JT" name="John's Team" />
              <TeamRow initials="MT" name="Marketing's Team" />
            </div>
            <DropdownDivider />
            <MenuItem
              lead={{ kind: "icon", icon: <AddCircleBoldDuotone size={20} /> }}
              label="Create New"
            />
            <MenuItem
              lead={{ kind: "icon", icon: <Logout3BoldDuotone size={20} /> }}
              label="Sign Out"
              intent="danger"
            />
          </DropdownPanel>
        </div>
      </SubSection>

      <SubSection title="Notification · Bell trigger + NotificationItem list">
        <div className="flex items-start gap-8 flex-wrap">
          <div className="flex flex-col gap-2">
            <span className="text-fg-grey-700 text-xs font-bold uppercase">Triggers</span>
            {accentColors.map((accent) => (
              <div key={accent} className="flex items-center gap-4">
                <IconTrigger
                  icon={<BellBoldDuotone size={20} />}
                  accent={accent}
                  state="idle"
                  badge={99}
                />
                <IconTrigger
                  icon={<BellBoldDuotone size={20} />}
                  accent={accent}
                  state="hover"
                  badge={99}
                  tooltip="Notification"
                  tooltipPosition="right"
                />
                <IconTrigger
                  icon={<BellBoldDuotone size={20} />}
                  accent={accent}
                  state="open"
                  badge={99}
                />
              </div>
            ))}
          </div>

          <div className="w-[480px] p-4 rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex flex-col">
            <div className="pb-3 flex items-center justify-between border-b border-fg-grey-200">
              <span className="text-fg-black text-xl font-semibold leading-8 tracking-fg">
                Notification
              </span>
            </div>
            <div className="flex flex-col">
              <NotificationItem
                tag="Bug"
                time="2h ago"
                title="New issue reported"
                body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus finibus vestibulum hendrerit."
                unread
                color="purple"
                onMarkRead={() => void 0}
              />
              <NotificationItem
                tag="Release"
                time="4h ago"
                title="v1.2 shipped"
                body="Nulla est diam, efficitur eu ullamcorper quis."
                unread
                color="blue"
                onMarkRead={() => void 0}
              />
              <NotificationItem
                tag="Info"
                time="2d ago"
                title="Older notification (read)"
                body="Lorem ipsum dolor sit amet."
              />
            </div>
          </div>
        </div>
      </SubSection>

      <SubSection title="Language · Flag trigger + DropdownPanel (4 colors)">
        <div className="flex flex-col gap-4">
          {accentColors.map((accent) => (
            <LanguageMenuDemo key={accent} accent={accent} />
          ))}
          <div className="p-6 rounded-xl bg-fg-violet">
            <LanguageMenuDemo accent="purple" onColoredBg />
          </div>
        </div>
      </SubSection>

      <SubSection title="Message · Letter trigger + ContactItem list">
        <div className="flex items-start gap-8 flex-wrap">
          <div className="flex flex-col gap-2">
            <span className="text-fg-grey-700 text-xs font-bold uppercase">Triggers</span>
            {accentColors.map((accent) => (
              <div key={accent} className="flex items-center gap-4">
                <IconTrigger
                  icon={<LetterBoldDuotone size={20} />}
                  accent={accent}
                  state="idle"
                  badge={99}
                />
                <IconTrigger
                  icon={<LetterBoldDuotone size={20} />}
                  accent={accent}
                  state="open"
                />
              </div>
            ))}
          </div>

          <DropdownPanel width="w-80" padding="p-2">
            <ContactItem
              initials="JH"
              name="Jay Hargudson"
              message="Hey, are you free tonight?"
              time="2m"
              unreadCount={3}
            />
            <ContactItem
              initials="AT"
              name="Anna Tsiuk"
              message="Shared a file · design.pdf"
              time="1h"
            />
            <ContactItem
              initials="DC"
              name="Daniel Cross"
              message="Got it, thanks!"
              time="3h"
            />
          </DropdownPanel>
        </div>
      </SubSection>

      <SubSection title="Calendar · Calendar trigger + SmallCalendar">
        <div className="flex items-start gap-8 flex-wrap">
          <div className="flex flex-col gap-2">
            <span className="text-fg-grey-700 text-xs font-bold uppercase">Triggers</span>
            {accentColors.map((accent) => (
              <div key={accent} className="flex items-center gap-4">
                <IconTrigger
                  icon={<CalendarBoldDuotone size={20} />}
                  accent={accent}
                  state="idle"
                />
                <IconTrigger
                  icon={<CalendarBoldDuotone size={20} />}
                  accent={accent}
                  state="hover"
                  tooltip="Calendar"
                  tooltipPosition="right"
                />
                <IconTrigger
                  icon={<CalendarBoldDuotone size={20} />}
                  accent={accent}
                  state="open"
                />
              </div>
            ))}
          </div>
          <SmallCalendar />
        </div>
      </SubSection>
    </Section>
  );
}

function TeamRow({
  initials,
  name,
  selected,
}: {
  initials: string;
  name: string;
  selected?: boolean;
}) {
  return (
    <div className="self-stretch px-2.5 py-3 inline-flex items-center gap-2">
      <img src={avatarImg(initials)} alt={name} className="w-5 h-5 rounded-full" />
      <span
        className={`flex-1 text-sm leading-5 tracking-fg line-clamp-1 ${
          selected ? "text-fg-violet font-bold" : "text-fg-grey-700 font-semibold"
        }`}
      >
        {name}
      </span>
      {selected && (
        <svg
          className="w-5 h-5 text-fg-violet"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polyline points="5 10 9 14 15 7" />
        </svg>
      )}
    </div>
  );
}

function LanguageMenuDemo({
  accent,
  onColoredBg = false,
}: {
  accent: AccentColor;
  onColoredBg?: boolean;
}) {
  const [selected, setSelected] = useState("en-us");
  const langs = [
    { value: "en-us", label: "English US", flag: flagEn },
    { value: "en-uk", label: "English UK", flag: flagUk },
    { value: "fr", label: "France", flag: flagFr },
    { value: "jp", label: "Japan", flag: flagJp },
  ];

  return (
    <div className="flex items-start gap-4">
      <span
        className={`w-16 text-sm font-medium capitalize ${onColoredBg ? "text-white/75" : "text-fg-grey-700"}`}
      >
        {onColoredBg ? "colored" : accent}
      </span>
      <IconTrigger
        icon={<img src={flagEn} alt="EN" className="w-5 h-5 rounded-full" />}
        accent={accent}
        state="idle"
        surface={onColoredBg ? "onColoredBg" : "default"}
      />
      <IconTrigger
        icon={<img src={flagEn} alt="EN" className="w-5 h-5 rounded-full" />}
        accent={accent}
        state="open"
        surface={onColoredBg ? "onColoredBg" : "default"}
      />
      <DropdownPanel padding="p-3">
        {langs.map((lang) => (
          <MenuItem
            key={lang.value}
            lead={{ kind: "image", src: lang.flag }}
            label={lang.label}
            active={selected === lang.value}
            accent={accent}
            onClick={() => setSelected(lang.value)}
          />
        ))}
      </DropdownPanel>
    </div>
  );
}

// ============================================================
// Page 3: Sidebar Menu — 3 color × 2 bgMode × 2 mode
// ============================================================

function SidebarMenuSection() {
  const mainMenu = [
    { icon: <HomeBoldDuotone size={20} />, label: "Dashboard", active: true },
    { icon: <ChartBoldDuotone size={20} />, label: "Analytics", badge: 5 },
    {
      icon: <FolderBoldDuotone size={20} />,
      label: "Projects",
      expanded: true,
      children: [{ label: "All Projects" }, { label: "Archived" }],
    },
    { icon: <SettingsBoldDuotone size={20} />, label: "Settings" },
  ];

  const favorites = [{ icon: <StarBoldDuotone size={20} />, label: "Design System" }];

  const profile = {
    avatar: avatarImg("JC"),
    name: "Jane Cooper",
    role: "Admin",
  };

  const teamAvatar = avatarImg("ST");

  const renderGrid = (mode: SidebarMenuMode) =>
    ["white", "colored"].map((bg) => (
      <div key={bg} className="flex flex-col gap-3">
        <span className="text-fg-grey-700 text-xs font-bold uppercase">
          {mode} · {bg} BG
        </span>
        <div className="flex items-start gap-4 flex-wrap">
          {accentColors.map((accent) => (
            <div
              key={`${accent}-${bg}-${mode}`}
              className="rounded-2xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 overflow-hidden flex h-[640px]"
            >
              <SidebarMenu
                accent={accent}
                bgMode={bg as SidebarMenuBgMode}
                mode={mode}
                teamName={mode === "full" ? "Sugab's Team" : undefined}
                teamAvatar={mode === "full" ? teamAvatar : undefined}
                teamMemberCount={mode === "full" ? 24 : undefined}
                mainMenuItems={mainMenu}
                favoriteItems={favorites}
                profile={profile}
              />
            </div>
          ))}
        </div>
      </div>
    ));

  return (
    <Section
      title="Sidebar Menu"
      description="3 accent × 2 bgMode × 2 mode (Figma 全矩阵)"
    >
      <SubSection title="Full mode">
        <div className="flex flex-col gap-6 w-full">{renderGrid("full")}</div>
      </SubSection>

      <SubSection title="Minimized mode">
        <div className="flex flex-col gap-6 w-full">{renderGrid("minimized")}</div>
      </SubSection>
    </Section>
  );
}

// ============================================================
// Page 4: Kebab Menu — 4 colors × open state
// ============================================================

function KebabMenuSection() {
  return (
    <Section
      title="Kebab Menu"
      description="IconTrigger(MenuDots) + DropdownPanel + MenuItem — 组合示例（4 色含 onColoredBg）"
    >
      <SubSection title="Triggers + panels on default surface">
        <div className="inline-flex items-start gap-16">
          {accentColors.map((accent) => (
            <div key={accent} className="flex flex-col gap-3 items-center">
              <span className="text-fg-grey-700 text-sm font-medium capitalize">{accent}</span>
              <KebabMenu items={kebabItems} accent={accent} />
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Kebab on colored background (surface=onColoredBg)">
        <div className="p-6 rounded-xl bg-fg-violet inline-flex items-start gap-16">
          {accentColors.map((accent) => (
            <div key={accent} className="flex flex-col gap-3 items-center">
              <span className="text-white/75 text-sm font-medium capitalize">{accent}</span>
              <KebabMenu items={kebabItems} accent={accent} surface="onColoredBg" />
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Used inside a list row">
        <div className="w-80 p-4 rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex items-center gap-3">
          <Avatar initials="JC" size="md" />
          <div className="flex-1 flex flex-col">
            <span className="text-fg-black text-sm font-semibold">Jane Cooper</span>
            <span className="text-fg-grey-700 text-xs font-medium">Admin</span>
          </div>
          <KebabMenu items={kebabItems} accent="purple" />
        </div>
      </SubSection>

      <SubSection title="Interactive · IconTrigger with custom panel (click to open)">
        <div className="inline-flex items-start gap-6">
          <IconTrigger
            icon={<BellBoldDuotone size={20} />}
            accent="purple"
            badge={5}
            panelPlacement="bottom"
            panel={(close) => (
              <DropdownPanel width="w-56" padding="p-2">
                {kebabItems.map((item, i) => (
                  <MenuItem
                    key={i}
                    lead={{ kind: "icon", icon: item.icon }}
                    label={item.label}
                    accent="purple"
                    onClick={close}
                  />
                ))}
              </DropdownPanel>
            )}
          />
        </div>
      </SubSection>
    </Section>
  );
}
