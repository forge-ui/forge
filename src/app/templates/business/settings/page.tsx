"use client";

import { useState } from "react";
import { TabBar, ToastProvider, useToast } from "@forge-ui-official/core";
import { SettingsProfile, defaultProfileValue } from "@/blocks/settings-profile/settings-profile";
import { SettingsMembers } from "@/blocks/settings-members/settings-members";
import { SettingsNotifications } from "@/blocks/settings-notifications/settings-notifications";
import { SettingsSecurity } from "@/blocks/settings-security/settings-security";
import { BusinessShell } from "../_chrome";

const TABS = ["个人资料", "团队成员", "通知", "安全"];

export default function SettingsPage() {
  return (
    <ToastProvider>
      <SettingsContent />
    </ToastProvider>
  );
}

function SettingsContent() {
  const { toast } = useToast();
  const [tab, setTab] = useState(0);
  const saved = () => toast({ title: "设置已保存", status: "success" });

  return (
    <BusinessShell title="设置">
      <div className="flex flex-col gap-5">
        <TabBar tabs={TABS.map((label, index) => ({ label, active: index === tab }))} color="blue" onChange={setTab} />
        {tab === 0 && <SettingsProfile value={{ ...defaultProfileValue, name: "林晓", title: "销售运营", email: "linxiao@bitilinks.cn", bio: "负责比特林克的客户运营和回款跟进，日常关注续约和工单处理时效。" }} avatar="/images/protask/crm/john-hoegan-avatar.png" onSave={saved} />}
        {tab === 1 && <SettingsMembers seats={30} onInvite={(email) => toast({ title: `已邀请 ${email}`, status: "success" })} />}
        {tab === 2 && <SettingsNotifications onSave={saved} />}
        {tab === 3 && <SettingsSecurity />}
      </div>
    </BusinessShell>
  );
}
