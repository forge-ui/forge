"use client";

import { pick } from "./agent-utils";
import { Question } from "./question";

export type ApprovalQuestion = {
  id: string;
  prompt: string;
  type?: "radio" | "check";
  options: { id: string; label: string }[];
};

/**
 * A short survey the agent asks before it continues: one question at a time, skippable, with a
 * pager and a "答案已提交" status. Rendered by `Question`; prefer Question for new code.
 */
export function ApprovalCard({
  questions,
  locale = "zh",
  skipLabel = pick(locale, "跳过", "Skip"),
  skipSubmitLabel = pick(locale, "跳过并提交", "Skip and submit"),
  continueLabel = pick(locale, "继续", "Continue"),
  sendLabel = pick(locale, "提交", "Send"),
  sentLabel = pick(locale, "答案已提交", "Answers sent"),
  onSubmitted,
  previousQuestionLabel = pick(locale, "上一题", "Previous question"),
  nextQuestionLabel = pick(locale, "下一题", "Next question"),
  className = "",
}: {
  questions: ApprovalQuestion[];
  locale?: "zh" | "en";
  skipLabel?: string;
  skipSubmitLabel?: string;
  continueLabel?: string;
  sendLabel?: string;
  sentLabel?: string;
  onSubmitted?: (answers: Record<string, string[]>) => void;
  previousQuestionLabel?: string;
  nextQuestionLabel?: string;
  className?: string;
}) {
  return (
    <Question
      confirm
      skippable
      locale={locale}
      className={className}
      questions={questions.map(question => ({ id: question.id, title: question.prompt, multiple: question.type === "check", allowText: false, options: question.options }))}
      labels={{ skip: skipLabel, skipSubmit: skipSubmitLabel, continue: continueLabel, submit: sendLabel, sent: sentLabel, previous: previousQuestionLabel, next: nextQuestionLabel }}
      onSubmit={answers => onSubmitted?.(Object.fromEntries(Object.entries(answers).map(([id, answer]) => [id, answer.optionIds])))}
    />
  );
}
