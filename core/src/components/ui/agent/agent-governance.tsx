"use client";

import { useState, type ReactNode } from "react";
import { CheckCircleLinear, ClockCircleLinear, LockKeyholeLinear, RestartCircleLinear, ShieldCheckBold } from "../../../icons";
import { cn } from "../../../lib/utils";
import { pick, type AgentLocale } from "./agent-utils";

/* ───────────────────────── ChangeLedger ───────────────────────── */

export type LedgerField = { label: string; before?: string; after: string };

export type LedgerEntry = {
  id: string;
  /** What changed, e.g. "张三的角色". */
  title: string;
  /** Where, e.g. "账号管理" or a record number. */
  target?: string;
  fields?: LedgerField[];
  time?: string;
  /** Who made it, e.g. the agent's name. */
  actor?: string;
  status?: "applied" | "undone" | "irreversible";
  /** Entries this one builds on; undoing those undoes this one too. */
  dependsOn?: string[];
};

export type ChangeLedgerProps = {
  entries: LedgerEntry[];
  title?: ReactNode;
  /** Undo one entry; entries that depend on it are listed in the confirmation and undone with it. */
  onUndo?: (id: string, alsoUndone: string[]) => void;
  locale?: AgentLocale;
  className?: string;
};

function dependentsOf(id: string, entries: LedgerEntry[]): string[] {
  const found = new Set<string>();
  const visit = (current: string) => {
    for (const entry of entries) {
      if (entry.status !== "undone" && entry.dependsOn?.includes(current) && !found.has(entry.id)) {
        found.add(entry.id);
        visit(entry.id);
      }
    }
  };
  visit(id);
  return [...found];
}

/**
 * Everything an agent changed, each change with before and after and an undo. Pointing at Undo
 * shows what builds on it and would be undone too; changes that cannot be taken back say so.
 */
export function ChangeLedger({ entries, title, onUndo, locale = "zh", className }: ChangeLedgerProps) {
  const [hover, setHover] = useState<string>();
  const [confirming, setConfirming] = useState<string>();
  const affected = new Set(hover ? dependentsOf(hover, entries) : []);
  const applied = entries.filter(entry => entry.status !== "undone").length;

  return (
    <div className={cn("flex flex-col gap-2 rounded-xl border border-fg-grey-200 bg-background p-3 tracking-fg", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-fg-black">{title ?? pick(locale, "变更记录", "Changes")}</span>
        <span className="text-xs text-fg-grey-700">{pick(locale, `${applied} 项生效中`, `${applied} applied`)}</span>
      </div>
      <ol className="flex flex-col gap-1.5">
        {entries.map(entry => {
          const undone = entry.status === "undone";
          const dependents = dependentsOf(entry.id, entries);
          const highlighted = hover === entry.id || affected.has(entry.id);
          return (
            <li key={entry.id} data-status={entry.status ?? "applied"} className={cn("flex flex-col gap-1.5 rounded-lg border px-3 py-2 transition-colors", highlighted ? "border-fg-yellow-300 bg-fg-yellow-50" : "border-fg-grey-100", undone && "opacity-60")}>
              <div className="flex min-w-0 items-center gap-2 text-[13px]">
                {undone ? <RestartCircleLinear size={14} color="var(--fg-grey-500)" className="shrink-0" /> : <CheckCircleLinear size={14} color="var(--fg-green-500)" className="shrink-0" />}
                <span className={cn("min-w-0 flex-1 truncate text-fg-black", undone && "line-through")}>{entry.title}</span>
                {entry.target && <span className="shrink-0 rounded bg-fg-grey-100 px-1.5 py-px text-[11px] text-fg-grey-700">{entry.target}</span>}
                {undone ? <span className="shrink-0 text-xs text-fg-grey-500">{pick(locale, "已撤销", "Undone")}</span>
                  : entry.status === "irreversible" ? <span className="flex shrink-0 items-center gap-1 text-xs text-fg-grey-500"><LockKeyholeLinear size={12} />{pick(locale, "不可撤销", "Can't undo")}</span>
                    : onUndo && (
                      <button
                        type="button"
                        onPointerEnter={() => setHover(entry.id)}
                        onPointerLeave={() => setHover(undefined)}
                        onFocus={() => setHover(entry.id)}
                        onBlur={() => setHover(undefined)}
                        onClick={() => (dependents.length ? setConfirming(entry.id) : onUndo(entry.id, []))}
                        className="shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium text-accent hover:bg-fg-blue-50"
                      >
                        {pick(locale, "撤销", "Undo")}
                      </button>
                    )}
              </div>
              {entry.fields && entry.fields.length > 0 && (
                <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-0.5 pl-[22px] text-xs">
                  {entry.fields.map(field => (
                    <div key={field.label} className="contents">
                      <dt className="text-fg-grey-700">{field.label}</dt>
                      <dd className="min-w-0 break-words text-fg-black">
                        {field.before !== undefined && <><span className="text-fg-grey-500 line-through">{field.before || pick(locale, "空", "empty")}</span>{" → "}</>}
                        {field.after || pick(locale, "空", "empty")}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              {(entry.actor || entry.time) && <span className="pl-[22px] text-[11px] text-fg-grey-500">{[entry.actor, entry.time].filter(Boolean).join(" · ")}</span>}
              {confirming === entry.id && onUndo && (
                <div role="alertdialog" aria-label={pick(locale, "确认撤销", "Confirm undo")} className="ml-[22px] flex flex-col gap-1.5 rounded-lg bg-fg-yellow-50 px-2.5 py-2 text-xs text-fg-yellow-900">
                  <span>{pick(locale, `以下 ${dependents.length} 项基于这次修改，会一并撤销：`, `${dependents.length} later changes build on this and will be undone too:`)}</span>
                  <ul className="list-disc pl-4">{dependents.map(id => <li key={id}>{entries.find(item => item.id === id)?.title}</li>)}</ul>
                  <span className="flex gap-2">
                    <button type="button" onClick={() => { onUndo(entry.id, dependents); setConfirming(undefined); }} className="rounded-md bg-fg-black px-2 py-1 font-medium text-white">{pick(locale, `一起撤销 ${dependents.length + 1} 项`, `Undo ${dependents.length + 1}`)}</button>
                    <button type="button" onClick={() => setConfirming(undefined)} className="rounded-md px-2 py-1 font-medium text-fg-black hover:bg-fg-yellow-100">{pick(locale, "算了", "Keep")}</button>
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ───────────────────────── AgentCheckpoints ───────────────────────── */

export type Checkpoint = {
  id: string;
  label: string;
  detail?: string;
  time?: string;
  /** An attempt the run moved away from after a rewind; shown faded beside the line. */
  abandoned?: boolean;
};

export type AgentCheckpointsProps = {
  checkpoints: Checkpoint[];
  currentId?: string;
  /** Go back to this point; the next attempt branches from it. */
  onRewind?: (id: string) => void;
  locale?: AgentLocale;
  className?: string;
};

/** An agent run as a line of checkpoints, like git for agents: rewind to any of them and try again. */
export function AgentCheckpoints({ checkpoints, currentId, onRewind, locale = "zh", className }: AgentCheckpointsProps) {
  const current = currentId ?? [...checkpoints].reverse().find(point => !point.abandoned)?.id;
  return (
    <ol aria-label={pick(locale, "检查点", "Checkpoints")} className={cn("flex flex-col tracking-fg", className)}>
      {checkpoints.map((point, index) => {
        const isCurrent = point.id === current;
        const last = index === checkpoints.length - 1;
        return (
          <li key={point.id} className={cn("group relative flex gap-2.5 pb-3 last:pb-0", point.abandoned && "ml-5 opacity-50")}>
            {!last && <span aria-hidden="true" className={cn("absolute left-[5.5px] top-4 h-[calc(100%-12px)] w-px", point.abandoned ? "border-l border-dashed border-fg-grey-300 bg-transparent" : "bg-fg-grey-200")} />}
            <span aria-hidden="true" className={cn("mt-1 size-3 shrink-0 rounded-full border-2", isCurrent ? "border-accent bg-accent" : point.abandoned ? "border-fg-grey-300 bg-background" : "border-fg-grey-400 bg-background")} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex min-w-0 items-center gap-2 text-[13px]">
                <span className={cn("min-w-0 flex-1 truncate", isCurrent ? "font-semibold text-fg-black" : "text-fg-grey-900", point.abandoned && "line-through")}>{point.label}</span>
                {point.time && <span className="flex shrink-0 items-center gap-1 text-[11px] text-fg-grey-500"><ClockCircleLinear size={11} />{point.time}</span>}
                {!isCurrent && !point.abandoned && onRewind && (
                  <button type="button" onClick={() => onRewind(point.id)} className="flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-accent opacity-0 transition-opacity hover:bg-fg-blue-50 focus:opacity-100 group-hover:opacity-100">
                    <RestartCircleLinear size={12} />{pick(locale, "回到这里", "Rewind")}
                  </button>
                )}
              </div>
              {point.detail && <span className="text-xs leading-5 text-fg-grey-700">{point.detail}</span>}
              {point.abandoned && index > 0 && !checkpoints[index - 1].abandoned && <span className="text-[11px] text-fg-grey-500">{pick(locale, "已放弃的尝试", "Abandoned attempt")}</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ───────────────────────── AutonomySelector ───────────────────────── */

export type AutonomyLevel = "ask" | "balanced" | "auto";
export type AutonomyAction = { id: string; label: string; risk: "low" | "medium" | "high" };

export type AutonomySelectorProps = {
  value: AutonomyLevel;
  onChange: (value: AutonomyLevel) => void;
  /** Example actions, sorted by what this level lets the agent do on its own. */
  actions?: AutonomyAction[];
  locale?: AgentLocale;
  className?: string;
};

const LEVELS: { value: AutonomyLevel; zh: string; en: string; zhHint: string; enHint: string }[] = [
  { value: "ask", zh: "谨慎", en: "Careful", zhHint: "每个改动都先问你", enHint: "Asks before every change" },
  { value: "balanced", zh: "平衡", en: "Balanced", zhHint: "只读和低风险的自己做，其余先问", enHint: "Does low-risk work, asks for the rest" },
  { value: "auto", zh: "放手", en: "Hands-off", zhHint: "只有高风险的才问你", enHint: "Only asks for high-risk actions" },
];

const runsAlone = (level: AutonomyLevel, risk: AutonomyAction["risk"]) => level === "auto" ? risk !== "high" : level === "balanced" ? risk === "low" : false;

/** How much the agent may do on its own, said in plain words, with its real actions sorted by the choice. */
export function AutonomySelector({ value, onChange, actions = [], locale = "zh", className }: AutonomySelectorProps) {
  const current = LEVELS.find(level => level.value === value) ?? LEVELS[0];
  const alone = actions.filter(action => runsAlone(value, action.risk));
  const asks = actions.filter(action => !runsAlone(value, action.risk));
  return (
    <div className={cn("flex flex-col gap-3 tracking-fg", className)}>
      <div role="radiogroup" aria-label={pick(locale, "自主程度", "Autonomy")} className="grid grid-cols-3 gap-1 rounded-xl bg-fg-grey-100 p-1">
        {LEVELS.map(level => (
          <button key={level.value} type="button" role="radio" aria-checked={level.value === value} onClick={() => onChange(level.value)} className="rounded-lg px-2 py-1.5 text-[13px] font-medium text-fg-grey-700 transition-colors hover:text-fg-black aria-checked:bg-background aria-checked:text-fg-black aria-checked:shadow-sm">
            {pick(locale, level.zh, level.en)}
          </button>
        ))}
      </div>
      <p className="text-xs text-fg-grey-700">{pick(locale, current.zhHint, current.enHint)}</p>
      {actions.length > 0 && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[{ list: alone, zh: "自己做", en: "Runs on its own", icon: <CheckCircleLinear size={12} color="var(--fg-green-500)" /> }, { list: asks, zh: "先问你", en: "Asks first", icon: <ShieldCheckBold size={12} color="var(--fg-yellow-700)" /> }].map(column => (
            <div key={column.zh} className="flex flex-col gap-1 rounded-lg border border-fg-grey-200 p-2">
              <span className="flex items-center gap-1 font-medium text-fg-black">{column.icon}{pick(locale, column.zh, column.en)}<span className="ml-auto tabular-nums text-fg-grey-500">{column.list.length}</span></span>
              {column.list.map(action => <span key={action.id} className="truncate text-fg-grey-900">{action.label}</span>)}
              {!column.list.length && <span className="text-fg-grey-500">—</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
