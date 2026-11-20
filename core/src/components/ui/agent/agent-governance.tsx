"use client";

import { useState, type ReactNode } from "react";
import { CheckCircleLinear, LockKeyholeLinear, RestartCircleLinear, ShieldCheckBold } from "../../../icons";
import { AgentCard, Collapse, FieldChanges, SoftBadge, accentButton, rowAction } from "../../../internal/agent-kit";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
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
  motion?: MotionPreference;
  size?: "md" | "sm";
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
 * marks what builds on it and would be undone too; changes that cannot be taken back say so.
 */
export function ChangeLedger({ entries, title, onUndo, locale = "zh", motion = "auto", size = "md", className }: ChangeLedgerProps) {
  const [hover, setHover] = useState<string>();
  const [confirming, setConfirming] = useState<string>();
  const affected = new Set(hover ? dependentsOf(hover, entries) : []);
  const applied = entries.filter(entry => entry.status !== "undone").length;

  return (
    <AgentCard size={size} className={className} title={title ?? pick(locale, "变更记录", "Changes")} action={<SoftBadge tone={applied ? "blue" : "grey"}>{pick(locale, `${applied} 项生效中`, `${applied} applied`)}</SoftBadge>}>
      <ol className="flex flex-col gap-2">
        {entries.map(entry => {
          const undone = entry.status === "undone";
          const dependents = dependentsOf(entry.id, entries);
          const highlighted = hover === entry.id || affected.has(entry.id);
          return (
            <li key={entry.id} data-status={entry.status ?? "applied"} className={cn("flex flex-col gap-2 rounded-xl px-3 py-2.5 outline outline-1 outline-offset-[-1px] transition-colors duration-200", highlighted ? "bg-fg-yellow-50 outline-fg-yellow-200" : "bg-background outline-fg-grey-200", undone && "bg-fg-grey-50")}>
              <div className="flex min-w-0 items-center gap-2">
                {undone ? <RestartCircleLinear size={16} color="var(--fg-grey-500)" className="shrink-0" /> : <CheckCircleLinear size={16} color="var(--fg-green-500)" className="shrink-0" />}
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className={cn("truncate text-sm font-medium", undone ? "text-fg-grey-500 line-through" : "text-fg-black")}>{entry.title}</span>
                  {(entry.target || entry.actor || entry.time) && <span className="truncate text-xs text-fg-grey-500">{[entry.target, entry.actor, entry.time].filter(Boolean).join(" · ")}</span>}
                </span>
                {undone ? <SoftBadge>{pick(locale, "已撤销", "Undone")}</SoftBadge>
                  : entry.status === "irreversible" ? <SoftBadge><LockKeyholeLinear size={12} />{pick(locale, "不可撤销", "Can't undo")}</SoftBadge>
                    : onUndo && (
                      <span onPointerEnter={() => setHover(entry.id)} onPointerLeave={() => setHover(undefined)} onFocus={() => setHover(entry.id)} onBlur={() => setHover(undefined)}>
                        <button type="button" className={rowAction} onClick={() => (dependents.length ? setConfirming(entry.id) : onUndo(entry.id, []))}><RestartCircleLinear size={14} />{pick(locale, "撤销", "Undo")}</button>
                      </span>
                    )}
              </div>
              {entry.fields && entry.fields.length > 0 && !undone && <FieldChanges fields={entry.fields} empty={pick(locale, "空", "empty")} />}
              <Collapse open={confirming === entry.id && Boolean(onUndo)} motion={motion}>
                <div role="alertdialog" aria-label={pick(locale, "确认撤销", "Confirm undo")} className="flex flex-col gap-2 rounded-xl bg-fg-yellow-50 px-3 py-2.5 text-sm outline outline-1 outline-offset-[-1px] outline-fg-yellow-200">
                  <span className="font-medium text-fg-black">{pick(locale, `以下 ${dependents.length} 项基于这次修改，会一并撤销：`, `${dependents.length} later changes build on this and will be undone too:`)}</span>
                  <ul className="flex flex-col gap-0.5 text-xs text-fg-grey-700">{dependents.map(id => <li key={id}>· {entries.find(item => item.id === id)?.title}</li>)}</ul>
                  <span className="flex justify-end gap-2">
                    <Button size="sm" variant="tertiary" color="grey" onClick={() => setConfirming(undefined)}>{pick(locale, "算了", "Keep")}</Button>
                    <button type="button" className={accentButton} onClick={() => { onUndo?.(entry.id, dependents); setConfirming(undefined); }}>{pick(locale, `一起撤销 ${dependents.length + 1} 项`, `Undo ${dependents.length + 1}`)}</button>
                  </span>
                </div>
              </Collapse>
            </li>
          );
        })}
      </ol>
    </AgentCard>
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
  title?: ReactNode;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};

/** An agent run as a line of checkpoints, like git for agents: rewind to any of them and try again. */
export function AgentCheckpoints({ checkpoints, currentId, onRewind, title, locale = "zh", size = "md", className }: AgentCheckpointsProps) {
  const current = currentId ?? [...checkpoints].reverse().find(point => !point.abandoned)?.id;
  return (
    <AgentCard size={size} className={className} title={title ?? pick(locale, "检查点", "Checkpoints")} subtitle={pick(locale, "回到任意一步重来，放弃的尝试会保留", "Rewind to any point; abandoned attempts stay")}>
      <ol aria-label={pick(locale, "检查点", "Checkpoints")} className="flex flex-col">
        {checkpoints.map((point, index) => {
          const isCurrent = point.id === current;
          const last = index === checkpoints.length - 1;
          return (
            <li key={point.id} className={cn("group relative flex gap-3 pb-4 last:pb-0", point.abandoned && "opacity-50")}>
              {!last && <span aria-hidden="true" className={cn("absolute left-[7.5px] top-5 bottom-0 w-px", point.abandoned || checkpoints[index + 1]?.abandoned ? "border-l border-dashed border-fg-grey-300" : "bg-fg-grey-200")} />}
              <span aria-hidden="true" className={cn("mt-1 size-4 shrink-0 rounded-full outline outline-2 outline-offset-[-2px] transition-colors", isCurrent ? "bg-accent outline-accent shadow-[0_0_0_4px_var(--accent-soft)]" : point.abandoned ? "bg-background outline-fg-grey-300" : "bg-background outline-fg-grey-400")} />
              <div className={cn("flex min-w-0 flex-1 flex-col gap-0.5", point.abandoned && "pl-0")}>
                <div className="flex min-h-6 min-w-0 items-center gap-2">
                  <span className={cn("min-w-0 truncate text-sm", isCurrent ? "font-semibold text-fg-black" : "text-fg-black", point.abandoned && "line-through")}>{point.label}</span>
                  {isCurrent && <SoftBadge tone="blue">{pick(locale, "当前", "Current")}</SoftBadge>}
                  {point.abandoned && <SoftBadge>{pick(locale, "已放弃", "Abandoned")}</SoftBadge>}
                  <span className="flex-1" />
                  {point.time && <span className="shrink-0 text-xs tabular-nums text-fg-grey-500">{point.time}</span>}
                  {!isCurrent && !point.abandoned && onRewind && (
                    <span className="opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                      <button type="button" className={rowAction} onClick={() => onRewind(point.id)}><RestartCircleLinear size={14} />{pick(locale, "回到这里", "Rewind")}</button>
                    </span>
                  )}
                </div>
                {point.detail && <span className="text-xs leading-5 text-fg-grey-500">{point.detail}</span>}
              </div>
            </li>
          );
        })}
      </ol>
    </AgentCard>
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
  title?: ReactNode;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};

const LEVELS: { value: AutonomyLevel; zh: string; en: string; zhHint: string; enHint: string }[] = [
  { value: "ask", zh: "谨慎", en: "Careful", zhHint: "每个改动都先问你", enHint: "Asks before every change" },
  { value: "balanced", zh: "平衡", en: "Balanced", zhHint: "查询和低风险的自己做，其余先问你", enHint: "Does low-risk work, asks for the rest" },
  { value: "auto", zh: "放手", en: "Hands-off", zhHint: "只有高风险操作才问你", enHint: "Only asks for high-risk actions" },
];

const runsAlone = (level: AutonomyLevel, risk: AutonomyAction["risk"]) => level === "auto" ? risk !== "high" : level === "balanced" ? risk === "low" : false;

/** How much the agent may do on its own, said in plain words, with its real actions sorted by the choice. */
export function AutonomySelector({ value, onChange, actions = [], title, locale = "zh", size = "md", className }: AutonomySelectorProps) {
  const index = Math.max(0, LEVELS.findIndex(level => level.value === value));
  const current = LEVELS[index];
  const alone = actions.filter(action => runsAlone(value, action.risk));
  const asks = actions.filter(action => !runsAlone(value, action.risk));
  return (
    <AgentCard size={size} className={className} title={title ?? pick(locale, "自主程度", "Autonomy")} subtitle={pick(locale, current.zhHint, current.enHint)}>
      <div className="flex flex-col gap-4">
        <ButtonGroup
          shape="pill"
          color="blue"
          ariaLabel={pick(locale, "自主程度", "Autonomy")}
          items={LEVELS.map(level => ({ label: pick(locale, level.zh, level.en) }))}
          activeIndex={index}
          onChange={next => onChange(LEVELS[next].value)}
          className="w-full [&>button]:flex-1"
        />
        {actions.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {[
              { list: alone, zh: "自己做", en: "Runs on its own", icon: <CheckCircleLinear size={14} color="var(--fg-green-500)" /> },
              { list: asks, zh: "先问你", en: "Asks first", icon: <ShieldCheckBold size={14} color="var(--fg-yellow-700)" /> },
            ].map(column => (
              <div key={column.zh} className="flex flex-col gap-1.5 rounded-xl bg-fg-grey-50 px-3 py-2.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-fg-black">{column.icon}{pick(locale, column.zh, column.en)}<span className="ml-auto tabular-nums text-fg-grey-500">{column.list.length}</span></span>
                {column.list.map(action => <span key={action.id} className="forge-fade-up truncate text-sm text-fg-grey-900">{action.label}</span>)}
                {!column.list.length && <span className="text-sm text-fg-grey-500">—</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </AgentCard>
  );
}
