"use client";

import { Checklist, ChecklistItem } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";

const ONBOARDING = [
  { id: "vendor", label: "Review vendor contacts", done: true },
  { id: "certs", label: "Confirm cold-chain certificates" },
  { id: "windows", label: "Publish weekend freezer windows" },
  { id: "reorder", label: "Send Cone King reorder" },
];

const SETUP = [
  { id: "profile", label: "Add a shop display name" },
  { id: "hours", label: "Set weekend opening hours" },
  { id: "pos", label: "Connect the POS export" },
];

export default function ChecklistCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Checklist"
        hint="Checklist · ChecklistItem · md/sm · purple/blue"
      />

      <Section title="Complete to bottom" description="点未完成行，等划线结束后沉底。">
        <SubSection title="Onboarding" stack>
          <Checklist defaultTasks={ONBOARDING} />
        </SubSection>
      </Section>

      <Section title="Sizes" description="sm 更紧，适合设置页侧栏。">
        <SubSection title="sm" stack>
          <Checklist size="sm" defaultTasks={SETUP} />
        </SubSection>
      </Section>

      <Section title="Color" description="勾选色与 Checkbox 对齐。">
        <SubSection title="blue" stack>
          <Checklist color="blue" defaultTasks={SETUP} />
        </SubSection>
      </Section>

      <Section title="ChecklistItem" description="单独一行，不重排。">
        <SubSection title="Standalone" stack>
          <div className="flex flex-col gap-2">
            <ChecklistItem label="Draft the pistachio weekend note" />
            <ChecklistItem label="Already sent" defaultChecked />
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
