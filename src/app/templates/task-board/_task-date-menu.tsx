"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button, Datepicker, DropdownPanel, MenuItem, SelectOption, TextField } from "@forge-ui-official/core";
import { CalendarLinear } from "@forge-ui-official/core/icons";
import { day, type Task } from "./_data";

export type SchedulePatch = Pick<Task, "date" | "time" | "repeat" | "repeatAnchor" | "repeatRule">;
export function TaskDateMenu({ value, onChange, time, repeat, repeatRule, onScheduleChange, label = "安排日期" }: {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  time?: string;
  repeat?: Task["repeat"];
  repeatRule?: Task["repeatRule"];
  onScheduleChange?: (patch: SchedulePatch) => void;
}) {
  const id = useId();
  const anchor = useRef<HTMLDivElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [draftTime, setDraftTime] = useState("");
  const [draftRepeat, setDraftRepeat] = useState("none");
  const [interval, setInterval] = useState("1");
  const [basis, setBasis] = useState("scheduled");
  const [ending, setEnding] = useState("never");
  const [until, setUntil] = useState("");
  const [count, setCount] = useState("2");
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<"time" | "interval" | "count" | "until" | null>(null);
  const invalid = (field: NonNullable<typeof errorField>, message: string) => { setErrorField(field); setError(message); };
  const fieldError = (field: NonNullable<typeof errorField>) => ({ state: errorField === field ? "error" as const : undefined, errorMessage: errorField === field ? error : undefined });
  const clearError = (field: NonNullable<typeof errorField>) => { if (errorField === field) { setErrorField(null); setError(""); } };
  const [position, setPosition] = useState({ left: 0, top: 0, maxHeight: 540 });
  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event.target instanceof Node && popup.current?.contains(event.target)) return;
      popup.current?.hidePopover();
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => { window.removeEventListener("scroll", close, true); window.removeEventListener("resize", close); };
  }, [open]);
  const choose = (date: string) => {
    if (onScheduleChange) onScheduleChange({ date, time: date ? time : undefined, repeat: date ? repeat : undefined, repeatAnchor: date && repeat ? Number(date.slice(8)) : undefined, repeatRule: date ? repeatRule : undefined });
    else onChange(date);
    popup.current?.hidePopover();
    anchor.current?.querySelector("button")?.focus();
  };
  const weekend = (() => {
    const weekday = new Date().getDay();
    return day(weekday === 0 ? 0 : Math.max(0, 6 - weekday));
  })();
  const nextWeek = day(8 - (new Date().getDay() || 7));
  const dateDisplay = value === day() ? "今天" : value === day(1) ? "明天" : value ? `${Number(value.slice(5, 7))}月${Number(value.slice(8))}日` : label;
  const repeatLabel = repeat ? `每${repeatRule?.interval ?? 1}${({ daily: "天", weekdays: "个工作日", weekly: "周", monthly: "个月", yearly: "年" })[repeat]}` : "";
  const display = `${dateDisplay}${time ? ` ${time}` : ""}${repeatLabel ? ` · ${repeatLabel}` : ""}`;
  return <div ref={anchor} className="task-date-anchor" data-no-drag>
    <Button color="blue" size="sm" variant="tertiary" aria-haspopup="dialog" aria-expanded={open} aria-controls={id} aria-label={`${label}：${display}`} iconLeft={<CalendarLinear size={14} />} onClick={() => {
      if (open) { popup.current?.hidePopover(); return; }
      setAdvanced(false); setDraftTime(time ?? ""); setDraftRepeat(repeat ?? "none"); setError(""); setErrorField(null);
      setInterval(String(repeatRule?.interval ?? 1)); setBasis(repeatRule?.basis ?? "scheduled");
      setEnding(repeatRule?.until ? "until" : repeatRule?.remaining ? "count" : "never"); setUntil(repeatRule?.until ?? ""); setCount(String(repeatRule?.remaining ?? 2));
      const rect = anchor.current!.getBoundingClientRect();
      const height = Math.min(540, window.innerHeight - 24);
      const top = Math.max(12, Math.min(rect.bottom + 6, window.innerHeight - height - 12));
      setPosition({ maxHeight: window.innerHeight - top - 12, left: Math.max(12, Math.min(rect.left, window.innerWidth - 324)), top });
      popup.current?.showPopover();
    }}>{display}</Button>
    <div id={id} ref={popup} popover="auto" role="dialog" aria-label="安排任务日期" className="task-date-menu" style={position} onToggle={(event) => setOpen((event.nativeEvent as ToggleEvent).newState === "open")}>
      <DropdownPanel width="w-full" className="task-date-panel">
        {advanced ? <div className="flex flex-col gap-4 p-3">
          <MenuItem label="返回日期" accent="blue" onClick={() => setAdvanced(false)} />
          <TextField color="blue" label="时间（24 小时制）" placeholder="例如 09:30，留空则不限时间" value={draftTime} {...fieldError("time")} onChange={(value) => { setDraftTime(value); clearError("time"); }} />
          <SelectOption color="blue" width="100%" label="重复规则" value={draftRepeat} onChange={value => { setDraftRepeat(value); setErrorField(null); setError(""); }} options={[
            { value: "none", label: "不重复" }, { value: "daily", label: "每天" }, { value: "weekdays", label: "每个工作日" }, { value: "weekly", label: "每周" }, { value: "monthly", label: "每月" }, { value: "yearly", label: "每年" },
          ]} />
          {draftRepeat !== "none" && <>
            <TextField color="blue" label="重复间隔" placeholder="1–999" value={interval} {...fieldError("interval")} onChange={value => { setInterval(value); clearError("interval"); }} />
            <SelectOption color="blue" width="100%" label="下一次日期依据" value={basis} onChange={setBasis} options={[{value:"scheduled",label:"按计划日期"},{value:"completed",label:"按完成日期"}]} />
            <SelectOption color="blue" width="100%" label="结束重复" value={ending} onChange={value => { setEnding(value); clearError("until"); clearError("count"); }} options={[{value:"never",label:"永不结束"},{value:"until",label:"在指定日期结束"},{value:"count",label:"完成指定次数后结束"}]} />
            {ending === "until" && <TextField color="blue" label="结束日期" placeholder="YYYY-MM-DD" value={until} {...fieldError("until")} onChange={value => { setUntil(value); clearError("until"); }} />}
            {ending === "count" && <TextField color="blue" label="剩余次数（含本次）" placeholder="1–999" value={count} {...fieldError("count")} onChange={value => { setCount(value); clearError("count"); }} />}
          </>}
          <p className="text-xs leading-5 text-fg-grey-700">间隔按所选规则计算，例如每 2 周、每 3 个工作日。完成后保留记录并安排下一次；超过结束条件则完成任务。未选日期时从今天开始。</p>
          <Button color="blue" size="sm" onClick={() => {
            const nextTime = draftTime.trim();
            if (nextTime && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(nextTime)) { invalid("time", "请输入有效时间，例如 09:30"); return; }
            const date = value || day();
            if (draftRepeat !== "none") {
              if (!/^\d+$/.test(interval) || Number(interval) < 1 || Number(interval) > 999) { invalid("interval", "重复间隔须为 1–999 的整数"); return; }
              if (ending === "count" && (!/^\d+$/.test(count) || Number(count) < 1 || Number(count) > 999)) { invalid("count", "剩余次数须为 1–999 的整数"); return; }
              if (ending === "until" && (!/^\d{4}-\d{2}-\d{2}$/.test(until) || !Number.isFinite(Date.parse(`${until}T12:00:00`)) || new Date(`${until}T12:00:00`).toLocaleDateString("sv-SE") !== until || until < date)) { invalid("until", "结束日期须为有效日期，且不早于本次安排日期"); return; }
            }
            onScheduleChange?.({ date, time: nextTime || undefined, repeat: draftRepeat === "none" ? undefined : draftRepeat as Task["repeat"], repeatAnchor: draftRepeat === "none" ? undefined : Number(date.slice(8)), repeatRule: draftRepeat === "none" ? undefined : { interval: Number(interval), basis: basis as "scheduled" | "completed", until: ending === "until" ? until : undefined, remaining: ending === "count" ? Number(count) : undefined } });
            popup.current?.hidePopover(); anchor.current?.querySelector("button")?.focus();
          }}>保存安排</Button>
        </div> : <>
        <p className="px-3 py-2 text-sm font-semibold text-fg-black">安排日期</p>
        {[
          { label: "今天", date: day() }, { label: "明天", date: day(1) },
          { label: "本周周末", date: weekend }, { label: "下周一", date: nextWeek },
        ].map((option) => <MenuItem key={option.label} label={option.label} accent="blue" onClick={() => choose(option.date)} />)}
        <div className="task-date-calendar"><Datepicker color="blue" inline value={value ? new Date(`${value}T12:00:00`) : undefined} onChange={(date) => choose(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`)} /></div>
        {onScheduleChange && <MenuItem label="时间与重复" kind="dropdown" accent="blue" onClick={() => setAdvanced(true)} />}
        <MenuItem label="不设日期" accent="blue" onClick={() => choose("")} />
        </>}
      </DropdownPanel>
    </div>
  </div>;
}
