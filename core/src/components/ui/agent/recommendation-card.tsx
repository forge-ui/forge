/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set.
 */

import { cn } from "../../../lib/utils";
import { StatusBadge, type StatusBadgeColor } from "../data-table";
import { SurfaceCard } from "../surface-card";

export type RecommendationConfidence = "high" | "review" | "none";

export type RecommendationOption = {
  id: string;
  label: string;
  hint?: string;
  confidence?: RecommendationConfidence;
};

const CONFIDENCE_COLOR: Record<RecommendationConfidence, StatusBadgeColor> = {
  high: "green",
  review: "yellow",
  none: "grey",
};

const CONFIDENCE_LABEL: Record<RecommendationConfidence, string> = {
  high: "High confidence",
  review: "Needs review",
  none: "No signal",
};

export function RecommendationCard({
  title,
  body,
  confidence = "high",
  confidenceLabel,
  alternatives = [],
  acceptLabel = "Accept",
  onAccept,
  onSelectAlternative,
  className = "",
}: {
  title: string;
  body: string;
  confidence?: RecommendationConfidence;
  confidenceLabel?: string;
  alternatives?: RecommendationOption[];
  acceptLabel?: string;
  onAccept?: () => void;
  onSelectAlternative?: (id: string) => void;
  className?: string;
}) {
  return (
    <SurfaceCard
      className={className}
      title={title}
      action={<StatusBadge label={confidenceLabel ?? CONFIDENCE_LABEL[confidence]} color={CONFIDENCE_COLOR[confidence]} />}
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onAccept}
            className="inline-flex items-center justify-center rounded-full bg-accent px-3 py-2.5 text-xs font-bold leading-4 tracking-fg text-accent-foreground"
          >
            {acceptLabel}
          </button>
        </div>
      }
    >
      <p className="text-sm leading-6 text-fg-black">{body}</p>
      {alternatives.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-fg text-fg-grey-500">Other options</p>
          {alternatives.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectAlternative?.(option.id)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left hover:bg-fg-grey-100",
              )}
            >
              <span>
                <span className="block text-sm font-medium text-fg-black">{option.label}</span>
                {option.hint && <span className="block text-xs text-fg-grey-500">{option.hint}</span>}
              </span>
              {option.confidence && (
                <StatusBadge
                  label={CONFIDENCE_LABEL[option.confidence]}
                  color={CONFIDENCE_COLOR[option.confidence]}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </SurfaceCard>
  );
}
