"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, type FormEvent } from "react";
import { Button, Panel, SelectOption, TextArea, TextField, cn } from "@forge-ui-official/core";
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

  return <form className={cn("mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-4", className)} onSubmit={submit} noValidate>
    <Panel variant="template" title="头像" subtitle="建议使用 400×400 以上的正方形图片">
      <div className="flex flex-wrap items-center gap-4">
        <img src={photo} alt={form.name} className="size-20 rounded-full object-cover" />
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-fg-blue-300 px-4 py-2 text-sm font-semibold text-fg-blue hover:bg-fg-blue-50"><CloudUploadLinear size={16} />上传新头像<input type="file" accept="image/*" className="sr-only" onChange={event => { const file = event.target.files?.[0]; if (file) setPhoto(URL.createObjectURL(file)); }} /></label>
        <Button type="button" variant="unstyled" className="text-sm text-fg-grey-700 hover:text-fg-red" onClick={() => setPhoto("")}>移除</Button>
      </div>
    </Panel>
    <Panel variant="template" title="基本信息" subtitle="同事在工作区里看到的信息">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="姓名" shape="pill" value={form.name} onChange={update("name")} {...(!form.name.trim() ? { state: "error" as const, errorMessage: "姓名不能为空" } : {})} />
        <TextField label="职位" shape="pill" value={form.title} onChange={update("title")} />
        <TextField label="工作邮箱" type="email" shape="pill" value={form.email} onChange={update("email")} {...(emailInvalid ? { state: "error" as const, errorMessage: "请输入有效邮箱" } : {})} />
        <TextField label="手机号" type="tel" shape="pill" value={form.phone} onChange={update("phone")} />
      </div>
      <TextArea label="个人简介" rows={3} value={form.bio} onChange={update("bio")} />
    </Panel>
    <Panel variant="template" title="地区与语言">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectOption label="时区" shape="pill" options={[{ value: "Asia/Shanghai", label: "北京时间（UTC+8）" }, { value: "Asia/Tokyo", label: "东京时间（UTC+9）" }, { value: "Europe/London", label: "伦敦时间（UTC+0）" }]} value={form.timezone} onChange={update("timezone")} />
        <SelectOption label="界面语言" shape="pill" options={[{ value: "zh-CN", label: "简体中文" }, { value: "en-US", label: "English" }]} value={form.language} onChange={update("language")} />
      </div>
    </Panel>
    <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-card border border-fg-grey-200 bg-white px-5 py-3 shadow-sm">
      <p role="status" className="text-sm text-fg-grey-700">{dirty ? "有未保存的修改" : "所有修改已保存"}</p>
      <div className="flex gap-3"><Button type="button" variant="tertiary" disabled={!dirty} onClick={() => setForm(saved)}>撤销</Button><Button type="submit" disabled={!dirty || emailInvalid || !form.name.trim()}>保存</Button></div>
    </div>
  </form>;
}
