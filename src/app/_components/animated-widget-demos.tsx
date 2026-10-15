"use client";

import { useState } from "react";
import { AddMember, Button, CalendarCard, DropdownPanel, MenuItem, LiquidTabs, OtpInput, type MotionPreference, type AddMemberItem, type LiquidTabsTab } from "@forge-ui-official/core";
import { BellLinear, ChatRoundLinear, SettingsBold } from "@forge-ui-official/core/icons";
import { AdditionalComponentApi } from "../components/_additional-component-api";
import { Section } from "../cases/_shared";

const people: AddMemberItem[] = [
  { id: "lin", name: "林晓", role: "产品设计师", status: "online" },
  { id: "chen", name: "陈晨", role: "前端工程师", status: "idle" },
  { id: "zhou", name: "周宁", role: "交互设计师", status: "dnd" },
  { id: "xu", name: "许安", role: "项目经理", status: "offline" },
  { id: "wang", name: "王可", role: "研发工程师", status: "online" },
  { id: "li", name: "李文", role: "质量工程师", status: "online" },
];
export function AnimatedWidgetDemos({ motion, only }: { motion: MotionPreference; only?: "otp" | "calendar" | "tabs" | "members" }) {
  const [dark, setDark] = useState(false), [english, setEnglish] = useState(false);
  const [date, setDate] = useState(new Date(2026, 9, 12));
  const [notification, setNotification] = useState("");
  const [added, setAdded] = useState<string[]>([]);
  const [fail, setFail] = useState(false);
  const tabs: LiquidTabsTab[] = [
    { id: "all", label: english ? "All" : "全部", items: [{ id: "review", title: english ? "Design review" : "设计评审", subtitle: english ? "A new comment" : "收到一条新评论", time: "12:10", icon: <BellLinear size={18} color="currentColor" /> }, { id: "mention", title: english ? "Mention" : "有人提及你", subtitle: english ? "Workspace discussion" : "工作区讨论", time: "13:00", icon: <ChatRoundLinear size={18} color="currentColor" /> }] },
    { id: "mentions", label: english ? "Mentions" : "提及", items: [{ id: "discussion", title: "林晓", subtitle: english ? "Please review the design" : "请查看更新后的设计", time: "09:42", icon: <ChatRoundLinear size={18} color="currentColor" /> }] },
    { id: "system", label: english ? "System" : "系统", items: [{ id: "update", title: english ? "Update ready" : "更新已就绪", subtitle: english ? "Workspace settings" : "工作区设置", time: "08:00", icon: <SettingsBold size={18} color="currentColor" /> }] },
    { id: "archive", label: english ? "Archived" : "归档", items: [] },
    { id: "requests", label: english ? "Requests" : "请求", items: [{ id: "access", title: english ? "Access request" : "访问申请", subtitle: english ? "Design workspace" : "设计工作区", time: "10:20" }] },
  ];
  return <div className="flex flex-col gap-8">
    <div className="flex flex-wrap gap-3"><Button motion={motion} onClick={() => setDark(value => !value)}>{dark ? "浅色主题" : "暗色主题"}</Button><Button motion={motion} onClick={() => setEnglish(value => !value)}>{english ? "中文文案" : "English"}</Button></div>
    <div data-theme={dark ? "dark" : "light"} className="flex flex-col gap-12 rounded-2xl bg-background p-6 text-foreground [&_section>div>h2]:text-foreground [&_section>div>p]:text-text-secondary">
      {(!only || only === "otp") && <Section title="OtpInput" description="输入 123456 演示成功，其他六位数字演示蛋壳裂开。可粘贴验证码，验证由业务回调完成。">
        <div className="w-full max-w-md"><OtpInput motion={motion} verify={async code => { await new Promise(resolve => setTimeout(resolve, 350)); return code === "123456"; }} hint={english ? "Enter 123456 to verify" : "输入 123456 验证"} inputLabel={english ? "One-time passcode" : "验证码"} verifyingLabel={english ? "Verifying…" : "正在验证…"} successLabel={english ? "Verified" : "验证成功"} errorLabel={english ? "Wrong code. Try again." : "验证码不正确，请重试"} /></div>
      <AdditionalComponentApi family="input-field" name="OtpInput" />
      </Section>}
      {(!only || only === "calendar") && <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-6"><Section title="CalendarCard" description="点击日期滑动高亮；点击右上角日历撕页翻月，点击月份选择年月。支持方向键和 Page Up / Down。">
        <CalendarCard color="blue" motion={motion} value={date} onChange={setDate} locale={english ? "en-US" : "zh-CN"} labels={english ? { changeMonth: "Change month and year", previousMonth: "Previous month", nextMonth: "Next month", previousYear: "Previous year", nextYear: "Next year" } : undefined} />
        <p role="status" className="text-sm text-text-secondary">{date.toLocaleDateString(english ? "en-US" : "zh-CN")}</p>
      </Section>
      <Section title="CalendarCard 表单弹层" description="紧凑日历与日期操作组合，适合表单弹层。">
        <DropdownPanel width="w-80" className="!items-stretch !bg-surface !outline-border">
          <MenuItem label="选择日期" />
          <CalendarCard size="compact" variant="plain" color="blue" motion={motion} value={date} onChange={setDate} locale={english ? "en-US" : "zh-CN"} />
          <div className="flex justify-end gap-2 border-t border-border pt-2">
            <Button size="sm" variant="tertiary" color="blue" motion={motion}>取消</Button>
            <Button size="sm" color="blue" motion={motion}>确定</Button>
          </div>
        </DropdownPanel>
      </Section></div>}
      {(!only || only === "tabs") && <Section title="LiquidTabs" description="液态标签与卡片融为一体，内容随切换方向滑入；更多分类支持键盘操作。">
        <LiquidTabs motion={motion} tabs={tabs} rows={3} label={english ? "Notifications" : "消息分类"} moreLabel={english ? "More tabs" : "更多分类"} emptyLabel={english ? "No notifications" : "暂无内容"} onSelect={item => setNotification(item.title)} />
        <p role="status" className="text-sm text-text-secondary">{english ? "Selected:" : "已选择："}{notification || "—"}</p>
      <AdditionalComponentApi family="tab" name="LiquidTabs" />
      </Section>}
      {(!only || only === "members") && <Section title="AddMember" description="展开、搜索、分页和跨页多选；头像飞入已选区。此处为本地演示，不发送邀请。">
        <AddMember accent="blue" motion={motion} members={people} defaultOpen rows={3} onAdd={async ids => { await new Promise(resolve => setTimeout(resolve, 600)); if (fail) throw new Error("Demo failure"); setAdded(ids); }} labels={english ? { title: "Project members", search: "Search members", empty: "No matching members", add: "Add to project", adding: "Adding…", added: "Members added", error: "Failed. Try again.", select: "Select", remove: "Remove", selected: "Selected", viewAll: "View all members", previous: "Previous members", next: "Next members" } : undefined} />
        <div><Button motion={motion} onClick={() => setFail(value => !value)}>{fail ? "关闭失败演示" : "模拟添加失败"}</Button></div>
        <p role="status" className="text-sm text-text-secondary">{english ? "Added:" : "已添加："}{added.map(id => people.find(person => person.id === id)?.name).join("、") || "—"}</p>
      <AdditionalComponentApi family="agent" name="AddMember" />
      </Section>}
    </div>
  </div>;
}
