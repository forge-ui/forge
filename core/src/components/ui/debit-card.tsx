import { cn } from "../../lib/utils";
import {
  financialThemes,
  FinancialOrbs,
  MastercardLogo,
  type FinancialTheme,
  type FinancialVariant,
} from "./card-utils";

// ============================================================
// DebitCard — physical debit-card UI
// Figma node 304:55050
// Reuses financialThemes + FinancialOrbs + MastercardLogo from
// card-utils (shared with CreditCard).
// ============================================================

export function DebitCard({
  balance = "$1,200.00",
  cardNumber = "9090",
  expiry = "07/25",
  theme = "dark",
  variant = "glow",
  className,
}: {
  balance?: string;
  cardNumber?: string;
  expiry?: string;
  theme?: FinancialTheme;
  variant?: FinancialVariant;
  className?: string;
}) {
  const cfg = financialThemes[theme];

  return (
    <div
      className={cn(
        "w-72 h-40 rounded-2xl inline-flex flex-col justify-between p-5 overflow-hidden relative",
        cfg.bg,
        className,
      )}
    >
      <FinancialOrbs theme={cfg} variant={variant} />

      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col gap-1">
          <span className={cn("text-xs font-medium leading-4.5 tracking-fg", cfg.labelColor)}>
            Balance
          </span>
          <span className={cn("text-lg font-semibold leading-6 tracking-fg", cfg.textColor)}>
            {balance}
          </span>
        </div>
        <MastercardLogo />
      </div>

      <div className="flex justify-between items-end relative z-10">
        <span className={cn("text-sm font-medium leading-5 tracking-fg", cfg.textColor)}>
          **** {cardNumber}
        </span>
        <span className={cn("text-sm font-medium leading-5 tracking-fg", cfg.labelColor)}>
          {expiry}
        </span>
      </div>
    </div>
  );
}
