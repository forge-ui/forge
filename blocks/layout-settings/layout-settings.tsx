"use client";

import { useState, type ReactNode } from "react";
import { AppLayout, Avatar, Breadcrumbs, Button, PageTitleToolbar, SelectOption, TextArea, TextField, Toggle, type AppLayoutMenuItem } from "@forge-ui-official/core";
import { BellBoldDuotone, CardBoldDuotone, ShieldKeyholeBoldDuotone, UserBoldDuotone, UsersGroupRoundedBoldDuotone, WidgetBoldDuotone, SettingsBoldDuotone } from "@forge-ui-official/core/icons";

export const defaultSettingsMenu: AppLayoutMenuItem[] = [
  { label: "工作台", icon: <WidgetBoldDuotone size={20} />, href: "#overview" },
  { label: "团队", icon: <UsersGroupRoundedBoldDuotone size={20} />, href: "#team" },
  { label: "设置", icon: <SettingsBoldDuotone size={20} />, href: "#settings" },
];

const sections = [
  { id: "profile", label: "个人资料", icon: <UserBoldDuotone size={18} /> },
  { id: "security", label: "账号安全", icon: <ShieldKeyholeBoldDuotone size={18} /> },
  { id: "notifications", label: "通知", icon: <BellBoldDuotone size={18} /> },
  { id: "billing", label: "账单", icon: <CardBoldDuotone size={18} /> },
];

function SettingCard({ title, description, children, footer }: { title: string; description: string; children: ReactNode; footer?: ReactNode }) {
  return <section className="overflow-hidden rounded-2xl border border-fg-grey-200 bg-background">
    <div className="flex flex-col gap-5 p-5 sm:p-6">
      <div><h2 className="text-base font-semibold text-fg-black">{title}</h2><p className="mt-1 text-sm text-fg-grey-600">{description}</p></div>
      {children}
    </div>
    {footer ? <div className="flex flex-wrap items-center justify-between gap-3 border-t border-fg-grey-100 bg-fg-grey-50 px-5 py-3 sm:px-6">{footer}</div> : null}
  </section>;
}

function SamplePage() {
  const [active, setActive] = useState("profile");
  const [name, setName] = useState("张宁");
  const [title, setTitle] = useState("运营负责人");
  const [bio, setBio] = useState("负责华东大区的电商运营与客户成功。");
  const [language, setLanguage] = useState("zh-CN");
  const [timezone, setTimezone] = useState("Asia/Shanghai");
  const [saved, setSaved] = useState<string | null>(null);
  const [mail, setMail] = useState(true);
  const [mention, setMention] = useState(true);
  const [digest, setDigest] = useState(false);
  const save = (section: string) => () => setSaved(section);

  return <div className="flex flex-col gap-5">
    <PageTitleToolbar title="设置" subtitle="管理你的资料、安全与通知偏好。" breadcrumbs={<Breadcrumbs color="blue" items={[{ label: "工作台", href: "#overview" }, { label: "设置" }]} />} />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
      <nav aria-label="设置分类" className="flex gap-1 overflow-x-auto lg:sticky lg:top-4 lg:flex-col lg:self-start">
        {sections.map(section => <button key={section.id} type="button" aria-current={active === section.id ? "page" : undefined} onClick={() => { setActive(section.id); setSaved(null); }} className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors ${active === section.id ? "bg-background font-semibold text-fg-black shadow-[0_1px_2px_rgba(0,0,0,0.05)]" : "text-fg-grey-700 hover:bg-background/70"}`}>
          <span className={active === section.id ? "text-fg-blue" : "text-fg-grey-500"}>{section.icon}</span>{section.label}
        </button>)}
      </nav>
      <div className="flex max-w-3xl flex-col gap-5">
        {active === "profile" ? <>
          <SettingCard title="基本资料" description="这些信息会显示在团队成员列表和评论里。" footer={<><span className="text-xs text-fg-grey-500">{saved === "profile" ? "已保存" : "修改后记得保存"}</span><Button color="blue" size="sm" onClick={save("profile")}>保存</Button></>}>
            <div className="flex items-center gap-4"><Avatar src="/images/team/edward-allen.png" initials="张" alt="张宁" size="lg" /><div className="flex gap-2"><Button color="blue" variant="secondary" size="sm">更换头像</Button><Button color="grey" variant="tertiary" size="sm">移除</Button></div></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField color="blue" label="姓名" value={name} onChange={setName} />
              <TextField color="blue" label="职位" value={title} onChange={setTitle} />
            </div>
            <div className="flex flex-col gap-1.5"><TextArea color="blue" label="个人简介" value={bio} onChange={setBio} rows={3} /><p className="text-xs text-fg-grey-500">最多 120 字，会显示在你的个人主页。</p></div>
          </SettingCard>
          <SettingCard title="语言与时区" description="影响日期显示和通知发送时间。" footer={<><span className="text-xs text-fg-grey-500">{saved === "locale" ? "已保存" : "当前：北京时间"}</span><Button color="blue" size="sm" onClick={save("locale")}>保存</Button></>}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectOption color="blue" label="界面语言" width="100%" className="w-full" value={language} onChange={setLanguage} options={[{ value: "zh-CN", label: "简体中文" }, { value: "en-US", label: "English" }]} />
              <SelectOption color="blue" label="时区" width="100%" className="w-full" value={timezone} onChange={setTimezone} options={[{ value: "Asia/Shanghai", label: "北京时间（UTC+8）" }, { value: "Asia/Tokyo", label: "东京时间（UTC+9）" }, { value: "Europe/London", label: "伦敦时间（UTC+0）" }]} />
            </div>
          </SettingCard>
        </> : active === "notifications" ? <SettingCard title="通知方式" description="选择哪些事情需要提醒你。" footer={<><span className="text-xs text-fg-grey-500">{saved === "notify" ? "已保存" : "邮件发送到 zhangning@zhixing.cn"}</span><Button color="blue" size="sm" onClick={save("notify")}>保存</Button></>}>
          {[{ label: "邮件通知", hint: "订单异常、退款申请发送邮件", value: mail, set: setMail }, { label: "被提及时提醒", hint: "有人在评论里 @ 你时推送", value: mention, set: setMention }, { label: "每周摘要", hint: "每周一上午发送上周经营摘要", value: digest, set: setDigest }].map(item => <div key={item.label} className="flex items-start justify-between gap-4 border-t border-fg-grey-100 pt-4 first:border-0 first:pt-0"><div><p className="text-sm font-medium text-fg-black">{item.label}</p><p className="mt-1 text-xs text-fg-grey-600">{item.hint}</p></div><Toggle color="blue" checked={item.value} ariaLabel={item.label} onChange={item.set} /></div>)}
        </SettingCard> : <SettingCard title={sections.find(section => section.id === active)!.label} description="这一部分的配置按同样的卡片结构展开：说明在上，字段居中，保存在卡片底部。">
          <p className="text-sm text-fg-grey-600">把你的业务字段放进这张卡片即可。</p>
        </SettingCard>}
      </div>
    </div>
  </div>;
}

export interface LayoutSettingsProps {
  menuItems?: AppLayoutMenuItem[];
  children?: ReactNode;
}

/** 设置类页面：左侧二级导航，右侧按主题分卡，每张卡自己保存 */
export function LayoutSettings({ menuItems = defaultSettingsMenu, children = <SamplePage /> }: LayoutSettingsProps) {
  return <AppLayout
    accent="blue"
    logoText="知行科技"
    appName="电商运营中心"
    appSubtitle="华东大区"
    menuItems={menuItems}
    profilePosition="topbar"
    profile={{ name: "张宁", role: "运营负责人", avatar: "/images/team/edward-allen.png" }}
    topbarLeftMode="search"
    searchPlaceholder="搜索设置项"
    notifications={1}
  >
    {children}
  </AppLayout>;
}
