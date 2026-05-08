/* eslint-disable @next/next/no-img-element */
"use client";

import {
  ContactItem,
  ChatBubble,
  ChatInputBar,
  Button,
} from "@forge-ui-official/core";
import {
  MagniferLinear,
  AddSquareLinear,
  BellLinear,
  PhoneLinear,
  LetterLinear,
  MenuDotsBold,
  CloseSquareLinear,
  UserLinear,
} from "solar-icon-set";

const COLORS = ["purple", "blue", "black"] as const;
const AVATAR = "https://i.pravatar.cc/100?img=10";
const AVATAR_LG = "https://i.pravatar.cc/100?img=11";
const SHORT_TEXT = "Lorem ipsum dolor si amet";
const LONG_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac augue eu odio tempor commodo. Nullam ut mattis eros. Cras ut orci nisi.";

const profileFields = [
  { label: "Email", value: "jayharrdgudson@mail.com" },
  { label: "Phone Number", value: "050 414 8778" },
  { label: "Location", value: "New York, USA" },
  { label: "Birthday", value: "12 May 1992" },
  { label: "Join Date", value: "12 December 2023" },
];

const teamFields = [
  { label: "About", value: "Project name team development lorem ipsum dolor si amet" },
  { label: "Location", value: "New York, USA" },
  { label: "Created", value: "12 December 2023" },
];

const teamMembers = [
  { name: "Jay Hargudson", role: "Manager", avatar: "https://i.pravatar.cc/100?img=12", online: true },
  { name: "Jay Hargudson", role: "Manager", avatar: "https://i.pravatar.cc/100?img=13" },
  { name: "Jay Hargudson", role: "Manager", avatar: "https://i.pravatar.cc/100?img=14" },
  { name: "Jay Hargudson", role: "Manager", avatar: "https://i.pravatar.cc/100?img=15" },
  { name: "Jay Hargudson", role: "Manager", avatar: "https://i.pravatar.cc/100?img=16" },
];

const modalCandidates = [
  { name: "Jay Hargudson", role: "Project Manager", avatar: "https://i.pravatar.cc/100?img=20" },
  { name: "Mohammad Karim", role: "Project Manager", avatar: "https://i.pravatar.cc/100?img=21" },
  { name: "John Bushmill", role: "Project Manager", avatar: "https://i.pravatar.cc/100?img=22" },
  { name: "Josh Adam", role: "UI/UX Designer", avatar: "https://i.pravatar.cc/100?img=23" },
  { name: "Linda Blair", role: "Mobile Developer", avatar: "https://i.pravatar.cc/100?img=24" },
  { name: "Sin Tae", role: "Front End Developer", avatar: "https://i.pravatar.cc/100?img=25" },
  { name: "Laura Prichet", role: "Back End Developer", avatar: "https://i.pravatar.cc/100?img=26" },
  { name: "Lisa Greg", role: "Tech Lead", avatar: "https://i.pravatar.cc/100?img=27" },
];

const fullPageContacts = [
  { type: "team" as const, name: "Team Name", message: SHORT_TEXT, initials: "TM", unreadCount: 99 },
  { type: "team" as const, name: "Team Name", message: SHORT_TEXT, initials: "TM" },
  { type: "person" as const, name: "Jay Hargudson", message: SHORT_TEXT, avatar: AVATAR },
  { type: "person" as const, name: "Jay Hargudson", message: SHORT_TEXT, avatar: AVATAR, online: true, unreadCount: 2 },
  { type: "person" as const, name: "Jay Hargudson", message: SHORT_TEXT, avatar: AVATAR },
  { type: "person" as const, name: "Jay Hargudson", message: SHORT_TEXT, avatar: AVATAR, unreadCount: 10 },
  { type: "person" as const, name: "Jay Hargudson", message: SHORT_TEXT, avatar: AVATAR, online: true },
  { type: "person" as const, name: "Jay Hargudson", message: SHORT_TEXT, avatar: AVATAR, unreadCount: 18 },
];

// ============================================================
// Helpers
// ============================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="self-stretch flex flex-col gap-6">
      <div className="self-start px-6 py-3 bg-gray-200 rounded-lg">
        <h2 className="text-xl font-bold text-fg-black">{title}</h2>
      </div>
      <div className="pl-2 flex flex-col gap-8">{children}</div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-fg-grey-700 uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

function ColorRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-6 py-3">
      <div className="w-16 shrink-0 text-base font-medium text-fg-grey-700 mt-2 capitalize">{label}</div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// ============================================================
// SECTION 1: 基础组件 (figma "Chat Items")
// ============================================================

function BaseComponentsSection() {
  return (
    <Section title="基础组件 (Chat Items)">
      <SubSection title="Contact (3 状态 × 2 类型)">
        {COLORS.map((color) => (
          <ColorRow key={color} label={color}>
            <div className="grid grid-cols-3 gap-4 max-w-4xl">
              <div className="bg-white rounded-xl p-2 flex flex-col gap-1 outline outline-1 outline-fg-grey-200">
                <ContactItem color={color} type="person" avatar={AVATAR} name="Jay Hargudson" message={SHORT_TEXT} online />
                <ContactItem color={color} type="team" name="Team Name" message={SHORT_TEXT} online />
              </div>
              <div className="bg-white rounded-xl p-2 flex flex-col gap-1 outline outline-1 outline-fg-grey-200">
                <ContactItem color={color} type="person" avatar={AVATAR} name="Jay Hargudson" message={SHORT_TEXT} unreadCount={120} />
                <ContactItem color={color} type="team" name="Team Name" message={SHORT_TEXT} unreadCount={3} />
              </div>
              <div className="bg-white rounded-xl p-2 flex flex-col gap-1 outline outline-1 outline-fg-grey-200">
                <ContactItem color={color} type="person" avatar={AVATAR} name="Jay Hargudson" message={SHORT_TEXT} online active unreadCount={120} />
                <ContactItem color={color} type="team" name="Team Name" message={SHORT_TEXT} online active unreadCount={2} />
              </div>
            </div>
          </ColorRow>
        ))}
      </SubSection>

      <SubSection title="Bubble Chat — Text">
        <div className="bg-stone-50 rounded-xl p-6 max-w-2xl flex flex-col gap-3 outline outline-1 outline-fg-grey-200">
          <ChatBubble type="received" variant="text" content={SHORT_TEXT} />
          <ChatBubble type="received" variant="text" content={LONG_TEXT} />
          {COLORS.map((c) => (
            <ChatBubble key={`l-${c}`} type="sent" color={c} variant="text" content={LONG_TEXT} />
          ))}
          {COLORS.map((c) => (
            <ChatBubble key={`s-${c}`} type="sent" color={c} variant="text" content={SHORT_TEXT} />
          ))}
        </div>
      </SubSection>

      <SubSection title="Bubble Chat — Voice (3 色 × received/sent)">
        <div className="bg-stone-50 rounded-xl p-6 max-w-2xl flex flex-col gap-3 outline outline-1 outline-fg-grey-200">
          {COLORS.map((c) => (
            <ChatBubble key={`r-${c}`} type="received" color={c} variant="voice" voiceDuration="0:42" />
          ))}
          {COLORS.map((c) => (
            <ChatBubble key={`s-${c}`} type="sent" color={c} variant="voice" voiceDuration="0:42" />
          ))}
        </div>
      </SubSection>

      <SubSection title="Bubble Chat — File">
        <div className="bg-stone-50 rounded-xl p-6 max-w-2xl flex flex-col gap-3 outline outline-1 outline-fg-grey-200">
          <ChatBubble type="received" variant="file" fileName="File Name.ai" fileSize="300kb" />
          {COLORS.map((c) => (
            <ChatBubble key={c} type="sent" color={c} variant="file" fileName="File Name.ai" fileSize="300kb" />
          ))}
        </div>
      </SubSection>

      <SubSection title="Bubble Chat — Image (+N 计数)">
        <div className="bg-stone-50 rounded-xl p-6 max-w-2xl flex flex-col gap-4 outline outline-1 outline-fg-grey-200">
          {COLORS.map((c) => (
            <ChatBubble
              key={c}
              type="received"
              color={c}
              variant="image"
              images={[
                "https://i.pravatar.cc/100?img=13",
                "https://i.pravatar.cc/100?img=14",
                "https://i.pravatar.cc/100?img=15",
              ]}
              extraImageCount={3}
            />
          ))}
        </div>
      </SubSection>

      <SubSection title="ChatInputBar">
        <div className="max-w-xl">
          <ChatInputBar placeholder="Type a message..." />
        </div>
      </SubSection>
    </Section>
  );
}

// ============================================================
// SECTION 2: 全页面 5 种变体
// ============================================================

function ChatLeftSidebar() {
  return (
    <aside className="w-80 shrink-0 border-r border-fg-grey-200 flex flex-col bg-white">
      <div className="h-20 px-6 py-5 border-b border-fg-grey-200 flex items-center gap-4 shrink-0">
        <h2 className="flex-1 text-2xl font-semibold text-fg-black">Chat</h2>
        <button className="w-5 h-5 flex items-center justify-center text-fg-grey-700">
          <MagniferLinear size={20} color="currentColor" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-1.5 flex flex-col">
        {fullPageContacts.map((c, i) => (
          <div key={i} className="px-2 py-1">
            <ContactItem color="purple" {...c} />
          </div>
        ))}
      </div>
      <div className="p-4 shrink-0 border-t border-fg-grey-200">
        <Button
          color="purple"
          variant="primary"
          size="md"
          iconLeft={<AddSquareLinear size={18} color="currentColor" />}
          className="w-full justify-center"
        >
          New Message
        </Button>
      </div>
    </aside>
  );
}

function MiddleHeaderActions() {
  return (
    <>
      <button className="w-6 h-6 flex items-center justify-center text-fg-grey-700">
        <BellLinear size={18} color="currentColor" />
      </button>
      <button className="w-6 h-6 flex items-center justify-center text-fg-grey-700">
        <MagniferLinear size={18} color="currentColor" />
      </button>
      <button className="w-6 h-6 flex items-center justify-center text-fg-grey-700">
        <span className="rotate-90 inline-flex">
          <MenuDotsBold size={18} color="currentColor" />
        </span>
      </button>
    </>
  );
}

function PersonHeader() {
  return (
    <div className="px-5 py-4 border-b border-fg-grey-200 flex items-center gap-3 shrink-0 bg-white">
      <div className="relative shrink-0">
        <img src={AVATAR} alt="Jay" className="w-10 h-10 rounded-full object-cover" />
        <span className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-emerald-500 rounded-full outline outline-2 outline-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-fg-black">Jay Hargudson</p>
        <p className="text-xs text-fg-grey-700">Online 3 minutes ago</p>
      </div>
      <MiddleHeaderActions />
    </div>
  );
}

function TeamHeader() {
  return (
    <div className="px-5 py-4 border-b border-fg-grey-200 flex items-center gap-3 shrink-0 bg-white">
      <div className="w-10 h-10 bg-rose-100 rounded-full inline-flex justify-center items-center shrink-0">
        <span className="text-orange-600 text-sm font-bold">TM</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-fg-black">Team Name</p>
        <p className="text-xs text-fg-grey-700">Project name development team</p>
      </div>
      <div className="flex items-center gap-1 text-fg-grey-700 px-1">
        <UserLinear size={16} color="currentColor" />
        <span className="text-xs font-semibold">13</span>
      </div>
      <MiddleHeaderActions />
    </div>
  );
}

function ChatMessages({ msgs }: { msgs: "personA" | "personB" | "team" }) {
  if (msgs === "personA") {
    return (
      <>
        <ChatBubble type="received" variant="voice" color="purple" avatar={AVATAR} voiceDuration="0:42" time="1 day ago" />
        <ChatBubble type="sent" color="purple" variant="text" content={LONG_TEXT} time="1 day ago" />
        <ChatBubble type="received" variant="text" color="purple" avatar={AVATAR} content={SHORT_TEXT} />
        <ChatBubble
          type="received"
          color="purple"
          variant="image"
          avatar={AVATAR}
          images={[
            "https://i.pravatar.cc/100?img=30",
            "https://i.pravatar.cc/100?img=31",
            "https://i.pravatar.cc/100?img=32",
          ]}
          extraImageCount={3}
          time="1 day ago"
        />
        <ChatBubble type="received" variant="text" color="purple" avatar={AVATAR} content={LONG_TEXT} time="1 day ago" />
        <ChatBubble type="sent" color="purple" variant="file" fileName="File Name.ai" fileSize="300kb" time="1 day ago" />
        <ChatBubble type="sent" color="purple" variant="text" content={SHORT_TEXT} time="1 day ago" />
      </>
    );
  }
  if (msgs === "personB") {
    return (
      <>
        <ChatBubble type="received" variant="text" color="purple" avatar={AVATAR} content={LONG_TEXT} time="1 day ago" />
        <ChatBubble
          type="received"
          color="purple"
          variant="image"
          avatar={AVATAR}
          images={[
            "https://i.pravatar.cc/100?img=33",
            "https://i.pravatar.cc/100?img=34",
            "https://i.pravatar.cc/100?img=35",
          ]}
          extraImageCount={3}
        />
        <ChatBubble type="sent" color="purple" variant="text" content={LONG_TEXT} time="1 day ago" />
        <ChatBubble type="received" variant="text" color="purple" avatar={AVATAR} content={LONG_TEXT} />
        <ChatBubble type="sent" color="purple" variant="file" fileName="File Name.ai" fileSize="300kb" time="1 day ago" />
        <ChatBubble type="sent" color="purple" variant="text" content={SHORT_TEXT} time="1 day ago" />
      </>
    );
  }
  return (
    <>
      <ChatBubble type="received" variant="voice" color="purple" avatar={AVATAR} voiceDuration="0:42" time="1 day ago" />
      <ChatBubble type="sent" color="purple" variant="text" content={LONG_TEXT} time="1 day ago" />
      <ChatBubble type="received" variant="text" color="purple" avatar={AVATAR} content={SHORT_TEXT} />
      <ChatBubble
        type="received"
        color="purple"
        variant="image"
        avatar={AVATAR}
        images={[
          "https://i.pravatar.cc/100?img=36",
          "https://i.pravatar.cc/100?img=37",
          "https://i.pravatar.cc/100?img=38",
        ]}
        extraImageCount={3}
      />
      <ChatBubble type="sent" color="purple" variant="file" fileName="File Name.ai" fileSize="300kb" time="1 day ago" />
      <ChatBubble type="sent" color="purple" variant="text" content={SHORT_TEXT} time="1 day ago" />
    </>
  );
}

function MiddlePanel({ kind, msgs }: { kind: "person" | "team"; msgs: "personA" | "personB" | "team" }) {
  return (
    <main className="flex-1 min-w-0 flex flex-col bg-white">
      {kind === "person" ? <PersonHeader /> : <TeamHeader />}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 bg-stone-50 flex flex-col gap-4">
        <ChatMessages msgs={msgs} />
      </div>
      <div className="px-4 py-4 border-t border-fg-grey-200 shrink-0 bg-white">
        <ChatInputBar placeholder="Type your message..." />
      </div>
    </main>
  );
}

function ProfileCover({ children }: { children?: React.ReactNode }) {
  return (
    <div className="absolute left-2 right-2 top-2 h-28 rounded-xl bg-gradient-to-br from-violet-300 via-pink-200 to-orange-200 overflow-hidden">
      {children}
    </div>
  );
}

function ProfileImagesGrid() {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm font-semibold text-fg-grey-700">Images</div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <img
            key={i}
            src={`https://i.pravatar.cc/100?img=${40 + i}`}
            alt={`${i + 1}`}
            className="w-14 h-14 rounded-xl object-cover"
          />
        ))}
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100">
          <span className="text-sm font-semibold text-fg-violet">+3</span>
        </div>
      </div>
    </div>
  );
}

function PersonProfile() {
  return (
    <aside className="w-80 shrink-0 border-l border-fg-grey-200 relative bg-white px-6 pt-16 pb-6 overflow-y-auto">
      <ProfileCover />
      <button className="absolute right-4 top-4 z-10 text-white">
        <CloseSquareLinear size={20} color="currentColor" />
      </button>
      <div className="z-10 relative mb-3 flex justify-center">
        <img src={AVATAR_LG} alt="Jay" className="w-28 h-28 rounded-full border-4 border-white object-cover" />
      </div>
      <h3 className="text-center text-base font-semibold text-fg-black">Jay Hardgudson</h3>
      <div className="mt-2 flex justify-center">
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 outline outline-1 outline-emerald-200">
          Online
        </span>
      </div>
      <div className="my-5 border-t border-fg-grey-200" />
      <div className="flex flex-col gap-4">
        {profileFields.map((f) => (
          <div key={f.label} className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-fg-grey-700">{f.label}</span>
            <span className="text-sm font-medium text-fg-black">{f.value}</span>
          </div>
        ))}
      </div>
      <div className="my-5 border-t border-fg-grey-200" />
      <ProfileImagesGrid />
    </aside>
  );
}

function TeamProfile({ withMembers }: { withMembers?: boolean }) {
  return (
    <aside className="w-80 shrink-0 border-l border-fg-grey-200 relative bg-white px-6 pt-16 pb-6 overflow-y-auto">
      <ProfileCover />
      <button className="absolute right-4 top-4 z-10 text-white">
        <CloseSquareLinear size={20} color="currentColor" />
      </button>
      <div className="z-10 relative mb-3 flex justify-center">
        <div className="w-28 h-28 rounded-full bg-rose-100 border-4 border-white flex items-center justify-center">
          <span className="text-orange-600 text-2xl font-bold">TM</span>
        </div>
      </div>
      <h3 className="text-center text-base font-semibold text-fg-black">Team Name</h3>

      <div className="my-5 border-t border-fg-grey-200" />
      <div className="flex flex-col gap-4">
        {teamFields.map((f) => (
          <div key={f.label} className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-fg-grey-700">{f.label}</span>
            <span className="text-sm font-medium text-fg-black">{f.value}</span>
          </div>
        ))}
      </div>

      <div className="my-5 border-t border-fg-grey-200" />
      <ProfileImagesGrid />

      {withMembers && (
        <>
          <div className="my-5 border-t border-fg-grey-200" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 text-sm font-semibold text-fg-black">Member (21)</div>
              <button className="flex items-center gap-1">
                <AddSquareLinear size={16} color="#7C3AED" />
                <span className="text-sm font-bold text-fg-violet">Add Member</span>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {teamMembers.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img src={m.avatar} alt={m.name} className="w-11 h-11 rounded-full object-cover" />
                    {m.online && (
                      <span className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-emerald-500 rounded-full outline outline-2 outline-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-fg-black truncate">{m.name}</p>
                    <p className="text-xs text-fg-grey-700 truncate">{m.role}</p>
                  </div>
                  <button className="w-4 h-4 flex items-center justify-center text-fg-grey-700">
                    <PhoneLinear size={16} color="currentColor" />
                  </button>
                  <button className="w-4 h-4 flex items-center justify-center text-fg-grey-700">
                    <LetterLinear size={16} color="currentColor" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

function AddMembersModal() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-950/25" />
      <div className="relative w-[480px] max-h-[660px] bg-white rounded-2xl flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-6 pt-6 flex items-center gap-4">
          <h3 className="flex-1 text-xl font-semibold text-fg-black">Add Members</h3>
          <button className="w-6 h-6 flex items-center justify-center text-fg-grey-700">
            <CloseSquareLinear size={20} color="currentColor" />
          </button>
        </div>
        <div className="px-6 mt-6">
          <div className="border-t border-fg-grey-200" />
        </div>
        {/* Body */}
        <div className="flex-1 min-h-0 px-6 py-6 flex flex-col gap-6 overflow-hidden">
          <div className="px-4 py-3 bg-white rounded-full outline outline-1 outline-fg-grey-200 flex items-center gap-2 shrink-0">
            <MagniferLinear size={18} color="#71717A" />
            <span className="flex-1 text-sm text-fg-grey-700">Search team member...</span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-5 pr-1">
            {modalCandidates.map((m, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-3">
                  <img src={m.avatar} alt={m.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-fg-black truncate">{m.name}</p>
                    <p className="text-xs text-fg-grey-700 truncate">{m.role}</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-md border-2 border-stone-300 bg-white shrink-0" />
              </div>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between gap-4 shrink-0">
          <button className="w-24 px-4 py-3.5 rounded-full outline outline-1 outline-fg-grey-200 text-sm font-bold text-fg-grey-700">
            Cancel
          </button>
          <button className="w-24 px-4 py-3.5 rounded-full bg-violet-600 text-sm font-bold text-white">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

function FullChatPanel({
  variant,
}: {
  variant: "person-1" | "team-1" | "person-2" | "team-members" | "team-modal";
}) {
  return (
    <div className="relative w-[1128px] h-[820px] bg-white rounded-2xl outline outline-1 outline-fg-grey-200 flex overflow-hidden shrink-0">
      <ChatLeftSidebar />
      {variant === "person-1" && (
        <>
          <MiddlePanel kind="person" msgs="personA" />
          <PersonProfile />
        </>
      )}
      {variant === "team-1" && (
        <>
          <MiddlePanel kind="team" msgs="team" />
          <TeamProfile />
        </>
      )}
      {variant === "person-2" && (
        <>
          <MiddlePanel kind="person" msgs="personB" />
          <PersonProfile />
        </>
      )}
      {variant === "team-members" && (
        <>
          <MiddlePanel kind="team" msgs="team" />
          <TeamProfile withMembers />
        </>
      )}
      {variant === "team-modal" && (
        <>
          <MiddlePanel kind="team" msgs="team" />
          <TeamProfile withMembers />
          <AddMembersModal />
        </>
      )}
    </div>
  );
}

function FullPageSection() {
  return (
    <Section title="全页面 (Full Chat — 5 种变体)">
      <p className="text-sm text-fg-grey-700">
        对照 figma <code className="px-1 bg-gray-200 rounded text-xs">chat.md</code> Purple 一行 5 种 panel：
        Person+Profile / Team+Profile / Person+Profile (B) / Team+Members / Team+Add Members Modal
      </p>

      <SubSection title="Variant 1 — Person + Profile">
        <div className="overflow-x-auto pb-4">
          <FullChatPanel variant="person-1" />
        </div>
      </SubSection>

      <SubSection title="Variant 2 — Team + Profile">
        <div className="overflow-x-auto pb-4">
          <FullChatPanel variant="team-1" />
        </div>
      </SubSection>

      <SubSection title="Variant 3 — Person + Profile (另一段消息)">
        <div className="overflow-x-auto pb-4">
          <FullChatPanel variant="person-2" />
        </div>
      </SubSection>

      <SubSection title="Variant 4 — Team + Members 列表">
        <div className="overflow-x-auto pb-4">
          <FullChatPanel variant="team-members" />
        </div>
      </SubSection>

      <SubSection title="Variant 5 — Team + Add Members Modal">
        <div className="overflow-x-auto pb-4">
          <FullChatPanel variant="team-modal" />
        </div>
      </SubSection>
    </Section>
  );
}

// ============================================================
// SECTION 3: 小页面 (figma "Small Chat" 紧凑卡片)
// ============================================================

function SmallChatCard({ type, color = "purple" }: { type: "person" | "team"; color?: typeof COLORS[number] }) {
  const isTeam = type === "team";
  const headerAvatar = isTeam ? (
    <div className="w-10 h-10 bg-rose-100 rounded-full inline-flex justify-center items-center shrink-0">
      <span className="text-orange-600 text-sm font-bold">TM</span>
    </div>
  ) : (
    <div className="relative shrink-0">
      <img src={AVATAR} alt="" className="w-10 h-10 rounded-full object-cover" />
      <span className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-emerald-500 rounded-full outline outline-2 outline-white" />
    </div>
  );
  return (
    <div className="w-[588px] h-[760px] rounded-2xl outline outline-1 outline-fg-grey-200 flex flex-col overflow-hidden bg-white">
      <div className="px-5 py-4 border-b border-fg-grey-200 flex items-center gap-3 shrink-0">
        {headerAvatar}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-fg-black">{isTeam ? "Team Name" : "Jay Hargudson"}</p>
          <p className="text-xs text-fg-grey-700">{isTeam ? "Project name development team" : "Online 3 minutes ago"}</p>
        </div>
        {isTeam && (
          <div className="flex items-center gap-1 text-fg-grey-700">
            <UserLinear size={16} color="currentColor" />
            <span className="text-xs font-semibold">13</span>
          </div>
        )}
        <button className="w-6 h-6 flex items-center justify-center text-fg-grey-700">
          <BellLinear size={16} color="currentColor" />
        </button>
        <button className="w-6 h-6 flex items-center justify-center text-fg-grey-700">
          <MagniferLinear size={16} color="currentColor" />
        </button>
        <button className="w-6 h-6 flex items-center justify-center text-fg-grey-700">
          <span className="rotate-90 inline-flex">
            <MenuDotsBold size={16} color="currentColor" />
          </span>
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 bg-stone-50 flex flex-col gap-4">
        <ChatBubble type="received" variant="voice" color={color} avatar={AVATAR} voiceDuration="0:42" time="1 day ago" />
        <ChatBubble type="sent" color={color} variant="text" content={LONG_TEXT} time="1 day ago" />
        <ChatBubble
          type="received"
          variant="image"
          color={color}
          avatar={AVATAR}
          images={["https://i.pravatar.cc/100?img=50", "https://i.pravatar.cc/100?img=51", "https://i.pravatar.cc/100?img=52"]}
          extraImageCount={3}
          time="1 day ago"
        />
        <ChatBubble type="sent" color={color} variant="file" fileName="File Name.ai" fileSize="300kb" time="1 day ago" />
        <ChatBubble type="received" variant="text" color={color} avatar={AVATAR} content={LONG_TEXT} time="1 day ago" />
        <ChatBubble type="sent" color={color} variant="text" content={SHORT_TEXT} time="1 day ago" />
      </div>
      <div className="px-4 py-4 border-t border-fg-grey-200 shrink-0">
        <ChatInputBar placeholder="Type your message..." />
      </div>
    </div>
  );
}

function SmallChatSection() {
  return (
    <Section title="小页面 (Small Chat — 紧凑 588px 卡片)">
      <p className="text-sm text-fg-grey-700">
        每色 2 类型（个人 / 团队），可嵌入 Dashboard widget 或独立窗口。3 色 × 2 = 6 卡片，先展示 Purple 2 个 sample。
      </p>
      <div className="flex flex-wrap gap-6">
        <SmallChatCard type="person" color="purple" />
        <SmallChatCard type="team" color="purple" />
      </div>
    </Section>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function ChatCasePage() {
  return (
    <div className="flex flex-col gap-12">
      <header>
        <h1 className="text-3xl font-bold text-fg-black">Chat 复核 Case</h1>
        <p className="text-sm text-fg-grey-700 mt-1">
          按 figma <code className="px-1 bg-gray-200 rounded text-xs">chat.md</code> 三段式：基础组件 → 全页面 5 种变体 → 小页面
        </p>
      </header>
      <BaseComponentsSection />
      <FullPageSection />
      <SmallChatSection />
    </div>
  );
}
