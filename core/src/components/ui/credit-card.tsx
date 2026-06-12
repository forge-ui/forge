import { cn } from "../../lib/utils";
import {
  financialThemes,
  FinancialOrbs,
  MastercardLogo,
  resolveCardWidthClass,
  type CardWidth,
  type FinancialTheme,
  type FinancialVariant,
} from "./card-utils";

// ============================================================
// CreditCard — physical credit-card UI
// Figma node 6352:22983
// Shares all theme / orb / logo primitives with DebitCard via
// card-utils (financialThemes + FinancialOrbs + MastercardLogo).
// ============================================================

function formatCardNumber(last4: string) {
  return `****  ****  ****  ${last4}`;
}

export function CreditCard({
  cardNumber = "9090",
  holderName = "John Doe",
  expiry = "07/25",
  theme = "dark",
  variant = "glow",
  width,
  className,
}: {
  cardNumber?: string;
  holderName?: string;
  expiry?: string;
  theme?: FinancialTheme;
  variant?: FinancialVariant;
  /** Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. */
  width?: CardWidth;
  className?: string;
}) {
  const cfg = financialThemes[theme];

  return (
    <div
      className={cn(
        "aspect-[9/5] rounded-2xl flex-col justify-between p-5 overflow-hidden relative",
        resolveCardWidthClass(width, "w-72"),
        cfg.bg,
        className,
      )}
    >
      <FinancialOrbs theme={cfg} variant={variant} />

      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col gap-1">
          <span className={cn("text-xs font-medium leading-4.5 tracking-fg", cfg.labelColor)}>
            Number
          </span>
          <span className={cn("text-sm font-semibold leading-5 tracking-fg", cfg.textColor)}>
            {formatCardNumber(cardNumber)}
          </span>
        </div>
        <MastercardLogo />
      </div>

      <div className="flex justify-between items-end relative z-10">
        <div className="flex flex-col gap-1">
          <span className={cn("text-xs font-medium leading-4.5 tracking-fg", cfg.labelColor)}>
            Name
          </span>
          <span className={cn("text-sm font-medium leading-5 tracking-fg", cfg.textColor)}>
            {holderName}
          </span>
        </div>
        <span className={cn("text-sm font-medium leading-5 tracking-fg", cfg.labelColor)}>
          {expiry}
        </span>
      </div>
    </div>
  );
}
