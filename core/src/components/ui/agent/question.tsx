"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AltArrowLeftLinear, AltArrowRightLinear, CheckCircleLinear } from "../../../icons";
import { AgentCard, CardActions, ChoiceMark, SoftBadge, accentButton, fieldInput } from "../../../internal/agent-kit";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { pick, type AgentLocale } from "./agent-utils";

export type QuestionOption = {
  id: string;
  label: string;
  description?: string;
  /** Marks the option the agent would pick. */
  recommended?: boolean;
};

export type QuestionItem = {
  id: string;
  title: string;
  description?: string;
  options: QuestionOption[];
  multiple?: boolean;
  /** Adds a free-text field. Defaults to on when there are no options. */
  allowText?: boolean;
  textPlaceholder?: string;
};

export type QuestionAnswer = { optionIds: string[]; text?: string };

export type QuestionLabels = Partial<Record<"skip" | "skipSubmit" | "continue" | "submit" | "cancel" | "previous" | "next" | "sent" | "skipped", string>>;

export type QuestionProps = {
  questions: QuestionItem[];
  /** Called once with every answer; skipped questions are left out. */
  onSubmit: (answers: Record<string, QuestionAnswer>) => void;
  /** Adds a cancel button that drops the whole question. */
  onCancel?: () => void;
  /** Adds a skip button per question; the last skip submits what was answered. */
  skippable?: boolean;
  /**
   * Once answered, pass the answers back: the card shows what was chosen. Without it the card shows
   * a short "答案已提交" status after submitting.
   */
  answers?: Record<string, QuestionAnswer>;
  /**
   * A single single-choice question submits on click, and a single choice moves to the next question,
   * unless this is set; then every step waits for Continue.
   */
  confirm?: boolean;
  disabled?: boolean;
  submitLabel?: string;
  labels?: QuestionLabels;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};

const describe = (item: QuestionItem, answer: QuestionAnswer | undefined) => [
  ...item.options.filter(option => answer?.optionIds.includes(option.id)).map(option => option.label),
  ...(answer?.text ? [answer.text] : []),
].join("、");

/**
 * The agent asks before it guesses, in ApprovalCard's card: one or several questions with radio or
 * check options, free text, a pager and keyboard answers (1–9 picks, Enter continues). Answered, it
 * shows what was chosen.
 */
export function Question({ questions, onSubmit, onCancel, skippable = false, answers: answered, confirm = false, disabled = false, submitLabel, labels = {}, locale = "zh", size = "md", className }: QuestionProps) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Record<string, QuestionAnswer>>({});
  const [sent, setSent] = useState(false);
  const submitted = useRef(false);
  const status = useRef<HTMLDivElement>(null);
  useEffect(() => { if (sent) status.current?.focus({ preventScroll: true }); }, [sent]);
  const text = {
    skip: pick(locale, "跳过", "Skip"), skipSubmit: pick(locale, "跳过并提交", "Skip and submit"), continue: pick(locale, "继续", "Continue"),
    submit: submitLabel ?? pick(locale, "提交", "Submit"), cancel: pick(locale, "取消", "Cancel"), previous: pick(locale, "上一题", "Previous question"),
    next: pick(locale, "下一题", "Next question"), sent: pick(locale, "答案已提交", "Answers sent"), skipped: pick(locale, "未回答", "Skipped"), ...labels,
  };
  // A double click on submit must not send twice.
  const submit = (next: Record<string, QuestionAnswer>) => {
    if (submitted.current) return;
    submitted.current = true;
    onSubmit(next);
    if (!answered) setSent(true);
  };

  if (sent && !answered) {
    return (
      <AgentCard size={size} className={className} data-state="sent">
        <div ref={status} role="status" tabIndex={-1} className="flex items-center gap-2 text-sm font-medium text-fg-green-500 outline-none">
          <CheckCircleLinear size={18} color="var(--fg-green-500)" />{text.sent}
        </div>
      </AgentCard>
    );
  }

  if (answered) {
    return (
      <AgentCard size={size} className={className} data-state="answered">
        <div role="status" className="flex flex-col gap-1.5">
          {questions.map(item => (
            <p key={item.id} className="flex items-start gap-2 text-sm">
              <CheckCircleLinear size={16} color="var(--fg-green-500)" className="mt-0.5 shrink-0" />
              <span className="min-w-0 text-fg-grey-700">{item.title}：<span className="font-medium text-fg-black">{describe(item, answered[item.id]) || text.skipped}</span></span>
            </p>
          ))}
        </div>
      </AgentCard>
    );
  }

  const item = questions[step];
  if (!item) return null;
  const answer = draft[item.id] ?? { optionIds: [] };
  const last = step === questions.length - 1;
  const instant = questions.length === 1 && !item.multiple && !confirm;
  // Picking none of several options is a valid answer.
  const ready = Boolean(item.multiple) || answer.optionIds.length > 0 || Boolean(answer.text?.trim());
  const withText = item.allowText ?? item.options.length === 0;
  const showSubmit = !instant || withText;

  const update = (next: QuestionAnswer) => setDraft(current => ({ ...current, [item.id]: next }));
  const advance = (next = draft) => {
    if (last) submit(next);
    else setStep(step + 1);
  };
  const skip = () => {
    const next = { ...draft };
    delete next[item.id];
    setDraft(next);
    if (last) submit(next); else setStep(step + 1);
  };
  const choose = (option: QuestionOption) => {
    if (disabled) return;
    if (item.multiple) {
      update({ ...answer, optionIds: answer.optionIds.includes(option.id) ? answer.optionIds.filter(id => id !== option.id) : [...answer.optionIds, option.id] });
      return;
    }
    const next = { ...draft, [item.id]: { ...answer, optionIds: [option.id] } };
    setDraft(next);
    if (instant) submit(next);
    else if (!confirm && questions.length > 1 && !last) setStep(step + 1);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement) return;
    const index = Number(event.key) - 1;
    if (index >= 0 && index < item.options.length) { event.preventDefault(); choose(item.options[index]); }
    else if (event.key === "Enter" && ready && showSubmit) { event.preventDefault(); advance(); }
  };

  const pager = (questions.length > 1 || skippable) && (
    <span className="flex items-center gap-1 text-xs tabular-nums text-fg-grey-500">
      <button type="button" aria-label={text.previous} disabled={step === 0} onClick={() => setStep(step - 1)} className="rounded-md p-1 hover:bg-fg-grey-100 disabled:opacity-30">
        <AltArrowLeftLinear size={14} color="var(--fg-grey-700)" />
      </button>
      {step + 1} / {questions.length}
      <button type="button" aria-label={text.next} disabled={last || !ready} onClick={() => setStep(step + 1)} className="rounded-md p-1 hover:bg-fg-grey-100 disabled:opacity-30">
        <AltArrowRightLinear size={14} color="var(--fg-grey-700)" />
      </button>
    </span>
  );

  return (
    <AgentCard
      size={size}
      className={cn("outline-none", className)}
      role="group"
      aria-label={item.title}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      footer={(showSubmit || onCancel || skippable) && (
        <CardActions aside={pager || (item.options.length > 1 && size === "md" ? pick(locale, "可按数字键选择", "Press a number to pick") : undefined)}>
          {onCancel && <Button size="sm" variant="tertiary" color="grey" disabled={disabled} onClick={onCancel}>{text.cancel}</Button>}
          {skippable && <Button size="sm" variant="tertiary" color="grey" disabled={disabled} onClick={skip}>{last ? text.skipSubmit : text.skip}</Button>}
          {showSubmit && <button type="button" className={accentButton} disabled={disabled || !ready} onClick={() => advance()}>{last ? text.submit : text.continue}</button>}
        </CardActions>
      )}
    >
      <div key={item.id} className="forge-fade-up flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold leading-6 text-fg-black">{item.title}</p>
          {item.description && <p className="text-xs leading-5 text-fg-grey-700">{item.description}</p>}
        </div>
        {item.options.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {item.options.map(option => {
              const on = answer.optionIds.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={disabled}
                  aria-pressed={on}
                  onClick={() => choose(option)}
                  className={cn("flex items-start gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors disabled:opacity-50", on ? "bg-accent-soft text-accent" : "text-fg-black hover:bg-fg-grey-100")}
                >
                  <span className="pt-0.5"><ChoiceMark multiple={item.multiple} on={on} /></span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex flex-wrap items-center gap-2 font-medium">{option.label}{option.recommended && <SoftBadge tone="blue">{pick(locale, "推荐", "Recommended")}</SoftBadge>}</span>
                    {option.description && <span className={cn("text-xs", on ? "text-accent" : "text-fg-grey-500")}>{option.description}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {withText && (
          <input
            value={answer.text ?? ""}
            disabled={disabled}
            onChange={event => update({ ...answer, text: event.target.value })}
            onKeyDown={event => { if (event.key === "Enter" && ready) { event.preventDefault(); advance(); } }}
            placeholder={item.textPlaceholder ?? (item.options.length ? pick(locale, "或者直接写", "Or type your own") : pick(locale, "填写回答", "Type your answer"))}
            aria-label={item.textPlaceholder ?? item.title}
            className={fieldInput}
          />
        )}
      </div>
    </AgentCard>
  );
}

/* ───────────────── ChoiceCard (single question, Forge Agent / Ask AI harness) ───────────────── */

export type ChoiceOption = { id: string; label: string; description?: string };
export type ChoiceAnswer = { optionId: string } | { optionIds: string[] } | { text: string };

export type ChoiceCardProps = {
  title: string;
  options: ChoiceOption[];
  multiple?: boolean;
  allowText?: boolean;
  disabled?: boolean;
  /** What was chosen once answered; the card then shows it instead of the controls. */
  answered?: ReactNode;
  onAnswer: (answer: ChoiceAnswer) => void;
  onCancel?: () => void;
  locale?: AgentLocale;
};

/** One question from the agent, answered with one of its real candidates. A shorthand for `Question`. */
export function ChoiceCard({ title, options, multiple = false, allowText = false, disabled = false, answered, onAnswer, onCancel, locale = "zh" }: ChoiceCardProps) {
  if (answered) {
    return (
      <p role="status" className="flex items-center gap-2 text-sm tracking-fg text-fg-grey-700">
        <CheckCircleLinear size={16} color="var(--fg-green-500)" />
        {title}：<span className="font-medium text-fg-black">{answered}</span>
      </p>
    );
  }
  return (
    <Question
      size="sm"
      locale={locale}
      disabled={disabled}
      onCancel={onCancel}
      submitLabel={multiple ? pick(locale, "提交选择", "Submit") : pick(locale, "继续", "Continue")}
      questions={[{ id: "choice", title, options, multiple, allowText, textPlaceholder: allowText && options.length ? pick(locale, "或填写名称、ID", "Or enter a name or ID") : undefined }]}
      onSubmit={answers => {
        const answer = answers.choice ?? { optionIds: [] };
        if (multiple) onAnswer({ optionIds: answer.optionIds });
        else if (answer.optionIds[0]) onAnswer({ optionId: answer.optionIds[0] });
        else if (answer.text?.trim()) onAnswer({ text: answer.text.trim() });
      }}
    />
  );
}
