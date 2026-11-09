"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, type FormEvent, type ReactNode } from "react";
import { Button, SelectOption, TextArea, TextField, cn } from "@forge-ui-official/core";
import { CloudUploadLinear } from "@forge-ui-official/core/icons";

export interface ProfileValue {
  name: string;
  title: string;
  email: string;
  phone: string;
  timezone: string;
  language: string;
  bio: string;
}

export const defaultProfileValue: ProfileValue = {
  name: "张宁",
  title: "运营负责人",
  email: "zhangning@zhixing.tech",
  phone: "138 0013 2026",
  timezone: "Asia/Shanghai",
  language: "zh-CN",
  bio: "负责知行科技客户运营与交付流程，日常关注续约、回款与客户满意度。",
};

export interface SettingsProfileProps {
  value?: ProfileValue;
  avatar?: string;
  onSave?: (value: ProfileValue) => void;
  className?: string;
}

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <section className="grid grid-cols-1 gap-5 border-t border-fg-grey-100 px-5 py-6 first:border-t-0 sm:px-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-10">
    <div><h2 className="text-base font-semibold text-fg-black">{title}</h2><p className="mt-1 text-sm leading-6 text-fg-grey-600">{description}</p></div>
    <div className="flex min-w-0 flex-col gap-4">{children}</div>
  </section>;
}

export function SettingsProfile({ value = defaultProfileValue, avatar = "/images/team/edward-allen.png", onSave, className }: SettingsProfileProps) {
  const [form, setForm] = useState(value);
  const [saved, setSaved] = useState(form);
  const [photo, setPhoto] = useState(avatar);
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const emailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const update = (key: keyof ProfileValue) => (next: string) => setForm(current => ({ ...current, [key]: next }));

  function submit(event: FormEvent) {
    event.preventDefault();
    if (emailInvalid || !form.name.trim()) return;
    setSaved(form);
    onSave?.(form);
  }

  return <form className={cn("flex w-full min-w-0 flex-col overflow-hidden rounded-card border border-fg-grey-200 bg-white", className)} onSubmit={submit} noValidate>
    <Section title="头像" description="建议使用 400×400 以上的正方形图片，会显示在评论、任务和成员列表里。">
      <div className="flex flex-wrap items-center gap-4">
        {photo ? <img src={photo} alt={form.name} className="size-20 rounded-full object-cover" /> : <span className="flex size-20 items-center justify-center rounded-full bg-fg-grey-100 text-2xl font-semibold text-fg-grey-600">{form.name.slice(0, 1)}</span>}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-fg-blue-300 px-4 py-2 text-sm font-semibold text-fg-blue hover:bg-fg-blue-50"><CloudUploadLinear size={16} />上传新头像<input type="file" accept="image/*" className="sr-only" onChange={event => { const file = event.target.files?.[0]; if (file) setPhoto(URL.createObjectURL(file)); }} /></label>
        <Button type="button" variant="unstyled" className="text-sm text-fg-grey-700 hover:text-fg-red" onClick={() => setPhoto("")}>移除</Button>
      </div>
    </Section>
    <Section title="基本信息" description="同事在工作区里看到的信息。邮箱用于登录和接收通知，修改后需要重新验证。">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="姓名" shape="pill" inputClassName="h-6" value={form.name} onChange={update("name")} {...(!form.name.trim() ? { state: "error" as const, errorMessage: "姓名不能为空" } : {})} />
        <TextField label="职位" shape="pill" inputClassName="h-6" value={form.title} onChange={update("title")} />
        <TextField label="工作邮箱" type="email" shape="pill" inputClassName="h-6" value={form.email} onChange={update("email")} {...(emailInvalid ? { state: "error" as const, errorMessage: "请输入有效邮箱" } : {})} />
        <TextField label="手机号" type="tel" shape="pill" inputClassName="h-6" value={form.phone} onChange={update("phone")} />
      </div>
      <TextArea label="个人简介" rows={3} value={form.bio} onChange={update("bio")} />
    </Section>
    <Section title="地区与语言" description="决定日期、时间的显示方式，以及界面使用的语言。">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectOption label="时区" shape="pill" width="100%" className="w-full" options={[{ value: "Asia/Shanghai", label: "北京时间（UTC+8）" }, { value: "Asia/Tokyo", label: "东京时间（UTC+9）" }, { value: "Europe/London", label: "伦敦时间（UTC+0）" }]} value={form.timezone} onChange={update("timezone")} />
        <SelectOption label="界面语言" shape="pill" width="100%" className="w-full" options={[{ value: "zh-CN", label: "简体中文" }, { value: "en-US", label: "English" }]} value={form.language} onChange={update("language")} />
      </div>
    </Section>
    <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-fg-grey-200 bg-white/95 px-5 py-3 backdrop-blur sm:px-6">
      <p role="status" className="text-sm text-fg-grey-700">{dirty ? "有未保存的修改" : "所有修改已保存"}</p>
      <div className="flex gap-3"><Button type="button" variant="tertiary" disabled={!dirty} onClick={() => setForm(saved)}>撤销</Button><Button type="submit" disabled={!dirty || emailInvalid || !form.name.trim()}>保存</Button></div>
    </div>
  </form>;
}
