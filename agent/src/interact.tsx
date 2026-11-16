"use client";

import { useState } from "react";
import { Button, ToolChips, type ToolChipItem } from "@forge-ui-official/core";
import { CheckCircleLinear } from "@forge-ui-official/core/icons";

/**
 * Components the agent puts in front of the user to act on: pick from real candidates, confirm a
 * change, follow the steps of a run. They only report what the user did; the runtime decides what
 * that means (the Ask AI harness checks candidates, signatures and record versions on the server).
 */

export type ChoiceOption = { id: string; label: string; description?: string };
export type ChoiceAnswer = { optionId: string } | { optionIds: string[] } | { text: string };

export function ChoiceCard({ title, options, multiple = false, allowText = false, disabled = false, answered, onAnswer, onCancel }: {
  title: string;
  options: ChoiceOption[];
  multiple?: boolean;
  allowText?: boolean;
  disabled?: boolean;
  /** What was chosen once answered; the card then shows it instead of the controls. */
  answered?: string;
  onAnswer: (answer: ChoiceAnswer) => void;
  onCancel?: () => void;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const [text, setText] = useState("");
  if (answered) {
    return (
      <div className="flex items-center gap-1.5 text-[13px] text-fg-grey-700">
        <CheckCircleLinear size={14} className="text-fg-green-500" />
        {title}：<span className="text-fg-black">{answered}</span>
      </div>
    );
  }
  const toggle = (id: string) => setPicked(current => (current.includes(id) ? current.filter(item => item !== id) : [...current, id]));
  return (
    <div role="group" aria-label={title} className="flex flex-col gap-2 rounded-xl border border-fg-grey-200 bg-background p-3">
      <p className="text-[13px] font-semibold text-fg-black">{title}</p>
      {options.length > 0 && (
        <div className="flex flex-col gap-1">
          {options.map(option => {
            const on = picked.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                disabled={disabled}
                aria-pressed={multiple ? on : undefined}
                onClick={() => (multiple ? toggle(option.id) : onAnswer({ optionId: option.id }))}
                className="flex min-w-0 flex-col rounded-lg border border-fg-grey-200 px-3 py-2 text-left transition-colors hover:border-accent hover:bg-fg-grey-50 disabled:opacity-50 aria-pressed:border-accent aria-pressed:bg-fg-blue-50"
              >
                <span className="text-[13px] text-fg-black">{option.label}</span>
                {option.description && <span className="text-xs text-fg-grey-700">{option.description}</span>}
              </button>
            );
          })}
        </div>
      )}
      {allowText && (
        <form className="flex gap-2" onSubmit={event => { event.preventDefault(); if (text.trim()) onAnswer({ text: text.trim() }); }}>
          <input
            value={text}
            disabled={disabled}
            onChange={event => setText(event.target.value)}
            placeholder={options.length ? "或填写名称、ID" : "填写补充信息"}
            aria-label={options.length ? "或填写名称、ID" : "填写补充信息"}
            className="min-w-0 flex-1 rounded-lg border border-fg-grey-200 bg-background px-3 py-1.5 text-[13px] text-fg-black outline-none focus:border-accent"
          />
          <Button size="sm" variant="secondary" type="submit" disabled={disabled || !text.trim()}>继续</Button>
        </form>
      )}
      {(multiple || onCancel) && (
        <div className="flex items-center gap-2">
          {multiple && <Button size="sm" disabled={disabled || !picked.length} onClick={() => onAnswer({ optionIds: picked })}>提交选择</Button>}
          {onCancel && <Button size="sm" variant="tertiary" color="grey" disabled={disabled} onClick={onCancel}>取消</Button>}
        </div>
      )}
    </div>
  );
}

export type ConfirmField = { label: string; before?: string; after: string };

export function ConfirmCard({ title, fields = [], body, confirmLabel = "确认", cancelLabel = "取消", state = "pending", result, onConfirm, onCancel }: {
  title: string;
  fields?: ConfirmField[];
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  state?: "pending" | "working" | "done" | "cancelled";
  /** Shown once done, e.g. the saved record from the receipt. */
  result?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div role="group" aria-label={title} data-state={state} className="flex flex-col gap-2 rounded-xl border border-fg-grey-200 bg-background p-3">
      <p className="text-[13px] font-semibold text-fg-black">{title}</p>
      {body && <p className="text-[13px] leading-5 text-fg-grey-700">{body}</p>}
      {fields.length > 0 && (
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-[13px]">
          {fields.map(field => (
            <div key={field.label} className="contents">
              <dt className="text-fg-grey-700">{field.label}</dt>
              <dd className="min-w-0 break-words text-fg-black">
                {field.before !== undefined && field.before !== field.after && <><span className="text-fg-grey-500 line-through">{field.before || "空"}</span>{" → "}</>}
                {field.after || "空"}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {state === "done" ? (
        <p className="flex items-center gap-1.5 text-[13px] text-fg-green-500"><CheckCircleLinear size={14} />{result ?? "已完成"}</p>
      ) : state === "cancelled" ? (
        <p className="text-[13px] text-fg-grey-700">已取消</p>
      ) : (
        (onConfirm || onCancel) && (
          <div className="flex items-center gap-2">
            {onConfirm && <Button size="sm" loading={state === "working"} onClick={onConfirm}>{confirmLabel}</Button>}
            {onCancel && <Button size="sm" variant="tertiary" color="grey" disabled={state === "working"} onClick={onCancel}>{cancelLabel}</Button>}
          </div>
        )
      )}
    </div>
  );
}

export type ProgressStep = { id: string; title: string; status: "running" | "waiting-user" | "waiting-external" | "completed" | "cancelled" | "failed"; meta?: string };

const STEP_STATUS: Record<ProgressStep["status"], NonNullable<ToolChipItem["status"]>> = {
  running: "running", "waiting-user": "pending", "waiting-external": "pending", completed: "complete", cancelled: "cancelled", failed: "error",
};

/** The steps of a run as one folding list; open while something is running or waiting. */
export function RunProgress({ steps }: { steps: ProgressStep[] }) {
  if (!steps.length) return null;
  const items: ToolChipItem[] = steps.map(step => ({ id: step.id, kind: "run", label: step.title, chip: step.meta ?? "", status: STEP_STATUS[step.status] }));
  const active = steps.some(step => step.status === "running" || step.status.startsWith("waiting"));
  const failed = steps.some(step => step.status === "failed");
  return <ToolChips items={items} size="sm" defaultOpen={active || failed} summary={`${steps.length} 个步骤`} state={active ? "running" : failed ? "error" : "success"} />;
}
