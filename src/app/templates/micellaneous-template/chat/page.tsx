"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddCircleLinear, PhoneCallingRoundedLinear, VideocameraRecordLinear } from "solar-icon-set";
import { Avatar, Button, ChatBubble, ChatInputBar, Checkbox, ContactItem, ToolbarSearchInput } from "@forge-ui-official/core";
import { Modal } from "../../_shared/modal";
import { MicellaneousPageHeader, MicellaneousTemplateShell, MiscSurface } from "../_chrome";
import { contacts } from "../_data";

export default function MicellaneousChatPage() {
  return (
    <Suspense fallback={null}>
      <MicellaneousChatContent />
    </Suspense>
  );
}

function MicellaneousChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const chat = searchParams.get("chat") === "team" ? "team" : "person";
  const showDetails = searchParams.get("details") === "1";
  const queryAddMemberOpen = searchParams.get("dialog") === "add-member";
  const active = chat === "team" ? contacts.find((contact) => contact.id === "team") ?? contacts[0] : contacts[0];
  const closeAddMember = () => {
    setAddMemberOpen(false);
    if (queryAddMemberOpen) router.replace("/templates/micellaneous-template/chat?chat=team&details=1");
  };

  return (
    <MicellaneousTemplateShell>
      <div className="flex flex-col gap-6">
        <MicellaneousPageHeader
          title="Chat"
          current={chat === "team" ? "Chat Team" : "Chat Person"}
          actions={<Button iconLeft={<AddCircleLinear size={18} />} onClick={() => router.push("/templates/micellaneous-template/chat?chat=team&details=1&dialog=add-member")}>Add Member</Button>}
        />
        <div className={showDetails ? "grid min-h-[720px] grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)_300px]" : "grid min-h-[720px] grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]"}>
          <MiscSurface className="p-0">
            <div className="border-b border-fg-grey-200 p-4">
              <ToolbarSearchInput placeholder="Search contacts..." className="max-w-none" />
            </div>
            <div className="flex flex-col gap-1 p-3">
              {contacts.map((contact) => (
                <ContactItem
                  key={contact.id}
                  type={contact.id === "team" ? "team" : "person"}
                  avatar={contact.avatar}
                  name={contact.name}
                  message={contact.role}
                  online={contact.online}
                  unreadCount={contact.unread}
                  active={contact.id === active.id}
                  time={contact.id === active.id ? "09:35" : "09:12"}
                />
              ))}
            </div>
          </MiscSurface>

          <MiscSurface className="flex min-w-0 flex-col p-0">
            <div className="flex items-center justify-between gap-4 border-b border-fg-grey-200 p-4">
              <div className="flex items-center gap-3">
                <Avatar src={active.avatar} size="md" />
                <div>
                  <p className="text-sm font-semibold text-fg-black">{active.name}</p>
              <p className="text-xs font-medium text-fg-green-500">{chat === "team" ? "12 members online" : "Online"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button color="grey" variant="tertiary"><PhoneCallingRoundedLinear size={18} /></Button>
                <Button color="grey" variant="tertiary"><VideocameraRecordLinear size={18} /></Button>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 bg-fg-grey-50 p-5">
              <ChatBubble type="received" avatar={active.avatar} senderName={active.name} content="Can you check the latest CRM customer table spacing?" time="09:30" />
              <ChatBubble type="sent" color="purple" content="Yes. I will compare it against the Protask screenshot and Forge DataTable." time="09:31" />
              <ChatBubble type="received" avatar={active.avatar} senderName={active.name} variant="file" fileName="Customer_Filter.png" fileSize="1.2 MB" time="09:32" />
              <ChatBubble type="sent" color="purple" variant="voice" voiceDuration="0:18" time="09:35" />
            </div>
            <div className="border-t border-fg-grey-200 p-4">
              <ChatInputBar placeholder="Type a message..." />
            </div>
          </MiscSurface>

          {showDetails && (
            <MiscSurface title={chat === "team" ? "Team Details" : "Profile Details"} subtitle={chat === "team" ? "Chat team details" : "Chat person details"}>
              <div className="flex flex-col items-center text-center">
                <Avatar src={active.avatar} size="lg" />
                <p className="mt-4 text-xl font-semibold text-fg-black">{active.name}</p>
                <p className="mt-1 text-sm font-medium text-fg-grey-500">{active.role}</p>
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <Info label={chat === "team" ? "Members" : "Phone"} value={chat === "team" ? "24 Members" : "+1 987 555 909"} />
                <Info label="Email" value={chat === "team" ? "team@protask.com" : "jane@protask.com"} />
                <Info label="Shared Files" value="28 Files" />
              </div>
            </MiscSurface>
          )}
        </div>
        <Modal open={addMemberOpen || queryAddMemberOpen} onClose={closeAddMember} title="Add Members" width="w-[680px]">
          <div className="flex flex-col gap-5 p-6">
            <ToolbarSearchInput placeholder="Search team member..." className="max-w-none" />
            <div className="max-h-[520px] overflow-hidden">
              {contacts.concat(contacts).slice(0, 8).map((contact, index) => (
                <div key={`${contact.id}-${index}`} className="flex items-center justify-between gap-4 border-b border-fg-grey-100 py-3 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Avatar src={contact.avatar} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-fg-black">{index === 0 ? "Jay Hargudson" : contact.name}</p>
                      <p className="text-xs font-medium text-fg-grey-500">{index === 3 ? "UI/UX Designer" : "Project Manager"}</p>
                    </div>
                  </div>
                  <Checkbox />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between gap-3 border-t border-fg-grey-200 p-6">
            <Button color="grey" variant="tertiary" onClick={closeAddMember}>Cancel</Button>
            <Button onClick={closeAddMember}>Submit</Button>
          </div>
        </Modal>
      </div>
    </MicellaneousTemplateShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-fg-grey-100 pb-3">
      <span className="font-medium text-fg-grey-500">{label}</span>
      <span className="text-right font-semibold text-fg-grey-900">{value}</span>
    </div>
  );
}
