"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AltArrowLeftLinear, CheckCircleLinear, QuestionCircleBoldDuotone } from "../../../icons";
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
  /** Adds a free-text field; with no options the question is text only. */
  allowText?: boolean;
  textPlaceholder?: string;
};

export type QuestionAnswer = { optionIds: string[]; text?: string };

export type QuestionProps = {
  questions: QuestionItem[];
  onSubmit: (answers: Record<string, QuestionAnswer>) => void;
  onCancel?: () => void;
  /** Once answered, pass the answers back: the card turns into a one-line summary per question. */
  answers?: Record<string, QuestionAnswer>;
  /**
   * A single single-choice question submits on click unless this is set.
   * Several questions or multiple choice always confirm.
   */
  confirm?: boolean;
  disabled?: boolean;
  submitLabel?: string;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};

const describe = (item: QuestionItem, answer: QuestionAnswer | undefined) => [
  ...item.options.filter(option => answer?.optionIds.includes(option.id)).map(option => option.label),
  ...(answer?.text ? [answer.text] : []),
].join("、");

/**
 * The agent asks before it guesses: one or several questions with numbered options, free text and
 * keyboard answers (1–9 picks, Enter continues). Answered, it folds into what was chosen.
 */
export function Question({ questions, onSubmit, onCancel, answers: answered, confirm = false, disabled = false, submitLabel, locale = "zh", size = "md", className }: QuestionProps) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Record<string, QuestionAnswer>>({});
  const root = useRef<HTMLDivElement>(null);
  const small = size === "sm";

  if (answered) {
    return (
      <div className={cn("flex flex-col gap-1 tracking-fg text-fg-grey-700", small ? "text-xs" : "text-[13px]", className)}>
        {questions.map(item => (
          <p key={item.id} className="flex items-start gap-1.5">
            <CheckCircleLinear size={14} className="mt-0.5 shrink-0 text-fg-green-500" />
            <span>{item.title}：<span className="text-fg-black">{describe(item, answered[item.id]) || pick(locale, "未回答", "Skipped")}</span></span>
          </p>
        ))}
      </div>
    );
  }

  const item = questions[step];
  if (!item) return null;
  const answer = draft[item.id] ?? { optionIds: [] };
  const last = step === questions.length - 1;
  const instant = questions.length === 1 && !item.multiple && !confirm;
  const ready = answer.optionIds.length > 0 || Boolean(answer.text?.trim());
  const showSubmit = !instant || item.allowText || item.options.length === 0;

  const update = (next: QuestionAnswer) => setDraft(current => ({ ...current, [item.id]: next }));
  const advance = (next = draft) => {
    if (last) onSubmit(next);
    else setStep(step + 1);
  };
  const choose = (option: QuestionOption) => {
    if (disabled) return;
    if (item.multiple) {
      update({ ...answer, optionIds: answer.optionIds.includes(option.id) ? answer.optionIds.filter(id => id !== option.id) : [...answer.optionIds, option.id] });
      return;
    }
    const next = { ...draft, [item.id]: { optionIds: [option.id] } };
    setDraft(next);
    if (instant) onSubmit(next);
    else if (questions.length > 1 && !last) setStep(step + 1);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement) return;
    const index = Number(event.key) - 1;
    if (index >= 0 && index < item.options.length) { event.preventDefault(); choose(item.options[index]); }
    else if (event.key === "Enter" && ready && showSubmit) { event.preventDefault(); advance(); }
  };

  return (
    <div
      ref={root}
      role="group"
      aria-label={item.title}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className={cn("flex flex-col gap-2.5 rounded-xl border border-fg-grey-200 bg-background tracking-fg outline-none focus-visible:border-accent", small ? "p-3" : "p-4", className)}
    >
      <div className="flex items-start gap-2">
        <QuestionCircleBoldDuotone size={small ? 16 : 18} className="mt-0.5 shrink-0 text-accent" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className={cn("font-semibold text-fg-black", small ? "text-[13px]" : "text-sm")}>{item.title}</p>
          {item.description && <p className="text-xs leading-5 text-fg-grey-700">{item.description}</p>}
        </div>
        {questions.length > 1 && <span className="shrink-0 tabular-nums text-xs text-fg-grey-500">{step + 1}/{questions.length}</span>}
      </div>
      {item.options.length > 0 && (
        <div className="flex flex-col gap-1">
          {item.options.map((option, index) => {
            const on = answer.optionIds.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                disabled={disabled}
                aria-pressed={item.multiple || !instant ? on : undefined}
                onClick={() => choose(option)}
                className="group flex min-w-0 items-start gap-2.5 rounded-lg border border-fg-grey-200 px-3 py-2 text-left transition-colors hover:border-accent hover:bg-fg-grey-50 disabled:opacity-50 aria-pressed:border-accent aria-pressed:bg-fg-blue-50"
              >
                <kbd className="mt-px flex size-5 shrink-0 items-center justify-center rounded-md border border-fg-grey-200 bg-fg-grey-50 font-sans text-[11px] text-fg-grey-700 group-aria-pressed:border-accent group-aria-pressed:text-accent">{index + 1}</kbd>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className={cn("flex items-center gap-1.5 text-fg-black", small ? "text-[13px]" : "text-sm")}>
                    {option.label}
                    {option.recommended && <span className="rounded-full bg-fg-blue-50 px-1.5 py-px text-[11px] text-accent">{pick(locale, "推荐", "Recommended")}</span>}
                  </span>
                  {option.description && <span className="text-xs leading-5 text-fg-grey-700">{option.description}</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}
      {(item.allowText || item.options.length === 0) && (
        <input
          value={answer.text ?? ""}
          disabled={disabled}
          onChange={event => update({ ...answer, text: event.target.value })}
          onKeyDown={event => { if (event.key === "Enter" && ready) { event.preventDefault(); advance(); } }}
          placeholder={item.textPlaceholder ?? (item.options.length ? pick(locale, "或者直接写", "Or type your own") : pick(locale, "填写回答", "Type your answer"))}
          aria-label={item.textPlaceholder ?? item.title}
          className="min-w-0 rounded-lg border border-fg-grey-200 bg-background px-3 py-1.5 text-[13px] text-fg-black outline-none placeholder:text-fg-grey-500 focus:border-accent"
        />
      )}
      {(showSubmit || onCancel) && (
        <div className="flex items-center gap-2">
          {step > 0 && <Button size="sm" variant="tertiary" color="grey" iconLeft={<AltArrowLeftLinear size={14} />} onClick={() => setStep(step - 1)}>{pick(locale, "上一题", "Back")}</Button>}
          {showSubmit && <Button size="sm" disabled={disabled || !ready} onClick={() => advance()}>{last ? submitLabel ?? pick(locale, "提交", "Submit") : pick(locale, "下一题", "Next")}</Button>}
          {onCancel && <Button size="sm" variant="tertiary" color="grey" disabled={disabled} onClick={onCancel}>{pick(locale, "跳过", "Skip")}</Button>}
          <span className="ml-auto hidden text-[11px] text-fg-grey-500 sm:inline">{pick(locale, "按数字键选择", "Press a number to pick")}</span>
        </div>
      )}
    </div>
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
      <div className="flex items-center gap-1.5 text-[13px] tracking-fg text-fg-grey-700">
        <CheckCircleLinear size={14} className="text-fg-green-500" />
        {title}：<span className="text-fg-black">{answered}</span>
      </div>
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
