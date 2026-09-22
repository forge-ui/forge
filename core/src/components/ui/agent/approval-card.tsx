"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set.
 */

import { useState } from "react";
import { AltArrowLeftLinear, AltArrowRightLinear, CheckCircleLinear } from "solar-icon-set";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { SurfaceCard } from "../surface-card";

export type ApprovalQuestion = {
  id: string;
  prompt: string;
  type?: "radio" | "check";
  options: { id: string; label: string }[];
};

export function ApprovalCard({
  questions,
  skipLabel = "Skip",
  continueLabel = "Continue",
  sendLabel = "Send",
  sentLabel = "Answers sent",
  onSubmitted,
  className = "",
}: {
  questions: ApprovalQuestion[];
  skipLabel?: string;
  continueLabel?: string;
  sendLabel?: string;
  sentLabel?: string;
  onSubmitted?: (answers: Record<string, string[]>) => void;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [sent, setSent] = useState(false);
  const question = questions[index];
  const last = index === questions.length - 1;
  const selected = question ? answers[question.id] ?? [] : [];
  const multiple = question?.type === "check";

  function toggle(optionId: string) {
    if (!question) return;
    setAnswers((current) => {
      const prev = current[question.id] ?? [];
      const next = multiple
        ? prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
        : [optionId];
      return { ...current, [question.id]: next };
    });
    if (!multiple) {
      window.setTimeout(() => advance(), 280);
    }
  }

  function advance() {
    if (last) {
      setSent(true);
      onSubmitted?.(answers);
      return;
    }
    setIndex((n) => Math.min(questions.length - 1, n + 1));
  }

  if (!question) return null;

  if (sent) {
    return (
      <SurfaceCard className={className} padding="md">
        <div className="flex items-center gap-2 text-sm font-medium text-fg-green-500">
          <CheckCircleLinear size={18} color="var(--fg-green-500)" />
          {sentLabel}
        </div>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard
      className={className}
      padding="md"
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-xs text-fg-grey-500">
            <button
              type="button"
              aria-label="Previous question"
              disabled={index === 0}
              onClick={() => setIndex((n) => Math.max(0, n - 1))}
              className="rounded-md p-1 hover:bg-fg-grey-100 disabled:opacity-30"
            >
              <AltArrowLeftLinear size={14} color="var(--fg-grey-700)" />
            </button>
            <span>
              {index + 1} / {questions.length}
            </span>
            <button
              type="button"
              aria-label="Next question"
              disabled={last}
              onClick={() => setIndex((n) => Math.min(questions.length - 1, n + 1))}
              className="rounded-md p-1 hover:bg-fg-grey-100 disabled:opacity-30"
            >
              <AltArrowRightLinear size={14} color="var(--fg-grey-700)" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" color="grey" variant="tertiary" onClick={advance}>
              {skipLabel}
            </Button>
            <button
              type="button"
              onClick={advance}
              disabled={!multiple && selected.length === 0}
              className="inline-flex items-center justify-center rounded-full bg-accent px-3 py-2.5 text-xs font-bold leading-4 tracking-fg text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {last ? sendLabel : continueLabel}
            </button>
          </div>
        </div>
      }
    >
      <p className="mb-3 text-sm font-semibold leading-6 text-fg-black">{question.prompt}</p>
      <div className="flex flex-col gap-1.5">
        {question.options.map((option) => {
          const on = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(option.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                on ? "bg-accent-soft text-accent" : "text-fg-black hover:bg-fg-grey-100",
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center outline outline-1 outline-offset-[-1px]",
                  multiple ? "rounded-md" : "rounded-full",
                  on ? "bg-accent outline-accent" : "outline-fg-grey-300",
                )}
              >
                {on && <span className={cn("bg-white", multiple ? "h-1.5 w-1.5" : "h-1.5 w-1.5 rounded-full")} />}
              </span>
              {option.label}
            </button>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
