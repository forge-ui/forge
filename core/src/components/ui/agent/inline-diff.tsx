"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import { CheckCircleLinear, CloseCircleLinear, RestartCircleLinear } from "../../../icons";
import { AgentCard, CardActions, SoftBadge, accentButton } from "../../../internal/agent-kit";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { pick, type AgentLocale } from "./agent-utils";

export type InlineDiffSegment =
  | { type: "same"; text: string }
  | { type: "change"; id: string; before: string; after: string; /** Why the agent changed it; shown on hover. */ reason?: string };

export type InlineDiffDecision = "pending" | "accepted" | "rejected";

export type InlineDiffProps = {
  segments: InlineDiffSegment[];
  title?: ReactNode;
  /** Called with the text that results from the current decisions. */
  onApply?: (text: string, decisions: Record<string, InlineDiffDecision>) => void;
  onDecisionsChange?: (decisions: Record<string, InlineDiffDecision>) => void;
  applyLabel?: string;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};

/** The text the decisions produce: accepted changes take the new wording, the rest keep the old. */
export function resolveInlineDiff(segments: InlineDiffSegment[], decisions: Record<string, InlineDiffDecision>) {
  return segments.map(segment => (segment.type === "same" ? segment.text : decisions[segment.id] === "accepted" ? segment.after : segment.before)).join("");
}

/**
 * AI edits to prose shown in place: struck old words and new ones, each accepted or rejected on its
 * own (click, or A / R when focused), or all at once, then applied as the final text.
 */
export function InlineDiff({ segments, title, onApply, onDecisionsChange, applyLabel, locale = "zh", size = "md", className }: InlineDiffProps) {
  const changes = segments.filter((segment): segment is Extract<InlineDiffSegment, { type: "change" }> => segment.type === "change");
  const [decisions, setDecisions] = useState<Record<string, InlineDiffDecision>>({});
  const decide = (next: Record<string, InlineDiffDecision>) => { setDecisions(next); onDecisionsChange?.(next); };
  const set = (id: string, decision: InlineDiffDecision) => decide({ ...decisions, [id]: decisions[id] === decision ? "pending" : decision });
  const all = (decision: InlineDiffDecision) => decide(Object.fromEntries(changes.map(change => [change.id, decision])));
  const handled = changes.filter(change => (decisions[change.id] ?? "pending") !== "pending").length;
  const accepted = changes.filter(change => decisions[change.id] === "accepted").length;

  const onKeyDown = (event: KeyboardEvent, id: string) => {
    const key = event.key.toLowerCase();
    if (key === "a" || key === "y") { event.preventDefault(); set(id, "accepted"); }
    else if (key === "r" || key === "n") { event.preventDefault(); set(id, "rejected"); }
  };

  return (
    <AgentCard
      size={size}
      className={className}
      title={title ?? pick(locale, "修改建议", "Suggested edits")}
      action={<SoftBadge tone={handled === changes.length ? "green" : "blue"}>{pick(locale, `${handled}/${changes.length} 已处理`, `${handled}/${changes.length} reviewed`)}</SoftBadge>}
      footer={
        <CardActions aside={pick(locale, "点修改处，或按 A 接受、R 拒绝", "Click a change, or press A / R")}>
          <Button size="sm" variant="tertiary" color="grey" onClick={() => all("rejected")}>{pick(locale, "全部拒绝", "Reject all")}</Button>
          <Button size="sm" variant="tertiary" color="grey" onClick={() => all("accepted")}>{pick(locale, "全部接受", "Accept all")}</Button>
          {onApply && <button type="button" className={accentButton} disabled={!handled} onClick={() => onApply(resolveInlineDiff(segments, decisions), decisions)}>{applyLabel ?? pick(locale, `应用 ${accepted} 处修改`, `Apply ${accepted}`)}</button>}
        </CardActions>
      }
    >
      <p className="text-sm leading-7 text-fg-black">
        {segments.map((segment, index) => {
          if (segment.type === "same") return <span key={index}>{segment.text}</span>;
          const decision = decisions[segment.id] ?? "pending";
          return (
            <span key={segment.id} className="group relative inline">
              <span
                role="button"
                tabIndex={0}
                aria-label={pick(locale, `修改：${segment.before || "（新增）"} 改为 ${segment.after || "（删除）"}，${decision === "accepted" ? "已接受" : decision === "rejected" ? "已拒绝" : "待处理"}`, `Change ${segment.before} to ${segment.after}, ${decision}`)}
                onKeyDown={event => onKeyDown(event, segment.id)}
                title={segment.reason}
                className={cn("cursor-default rounded-[4px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent", decision === "pending" && "bg-fg-yellow-50")}
              >
                {decision !== "accepted" && segment.before && <span className={cn(decision === "pending" ? "bg-fg-red-50 text-fg-red line-through decoration-fg-red/60" : "")}>{segment.before}</span>}
                {decision !== "rejected" && segment.after && <span className={cn(decision === "pending" ? "bg-fg-green-50 text-fg-green-600 underline decoration-fg-green-300 underline-offset-4" : "text-fg-black")}>{segment.after}</span>}
              </span>
              <span className="pointer-events-none absolute -top-8 left-0 z-20 inline-flex items-center gap-0.5 whitespace-nowrap rounded-full bg-background p-0.5 opacity-0 shadow-[0px_4px_30px_0px_rgba(77,84,100,0.20)] outline outline-1 outline-offset-[-1px] outline-fg-grey-200 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
                {decision === "pending" ? (
                  <>
                    <button type="button" aria-label={pick(locale, "接受", "Accept")} onClick={() => set(segment.id, "accepted")} className="inline-flex h-6 items-center gap-1 rounded-full px-2 text-xs font-bold text-fg-green-600 hover:bg-fg-green-50"><CheckCircleLinear size={12} />{pick(locale, "接受", "Accept")}</button>
                    <button type="button" aria-label={pick(locale, "拒绝", "Reject")} onClick={() => set(segment.id, "rejected")} className="inline-flex h-6 items-center gap-1 rounded-full px-2 text-xs font-bold text-fg-red hover:bg-fg-red-50"><CloseCircleLinear size={12} />{pick(locale, "拒绝", "Reject")}</button>
                  </>
                ) : (
                  <button type="button" aria-label={pick(locale, "撤回决定", "Undo")} onClick={() => set(segment.id, decision)} className="inline-flex h-6 items-center gap-1 rounded-full px-2 text-xs font-bold text-fg-grey-700 hover:bg-fg-grey-100"><RestartCircleLinear size={12} />{pick(locale, "撤回", "Undo")}</button>
                )}
              </span>
            </span>
          );
        })}
      </p>
    </AgentCard>
  );
}
