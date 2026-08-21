/* eslint-disable @next/next/no-img-element */
import { cn } from "../../lib/utils";
import {
  AltArrowDownLinear,
  RoundTransferHorizontalLinear,
  DownloadLinear,
} from "solar-icon-set";
import {
  cardThemes,
  CardGlow,
  CardTrend,
  resolveCardTheme,
  resolveCardWidthClass,
  type CardTheme,
  type CardWidth,
  type LegacyCardTheme,
  type TrendDirection,
} from "./card-utils";

// ============================================================
// BalanceCard — Figma "Card & Balance" (node 6352:9444)
// Uses cardThemes for bg/text/glow. Balance-specific styling
// (transfer/request buttons, divider, card-number) is derived
// from the isWhite flag — white gets outlined buttons, colored
// themes get solid dark buttons.
// ============================================================

type BalanceCardTheme = CardTheme | LegacyCardTheme;

export function BalanceCard({
  title = "总余额",
  balance,
  trend,
  trendDirection = "up",
  subtitle,
  theme = "white",
  balanceHidden = false,
  cardNumber,
  cardIcon,
  onTransfer,
  onRequest,
  density = "default",
  width,
  className,
}: {
  title?: string;
  balance: string;
  trend?: string;
  trendDirection?: TrendDirection;
  subtitle?: string;
  theme?: BalanceCardTheme;
  balanceHidden?: boolean;
  cardNumber?: string;
  cardIcon?: string;
  onTransfer?: () => void;
  onRequest?: () => void;
  density?: "default" | "compact";
  /** Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. */
  width?: CardWidth;
  className?: string;
}) {
  const themeKey = resolveCardTheme(theme);
  const cfg = cardThemes[themeKey];
  const isWhite = themeKey === "white";
  const isCompact = density === "compact";

  const transferBtn = isWhite
    ? "bg-fg-violet text-white"
    : "bg-fg-black text-white";
  const requestBtn = isWhite
    ? "bg-white outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-fg-black"
    : "outline outline-1 outline-offset-[-1px] outline-white/20 text-white";
  const divider = isWhite ? "outline-fg-grey-200" : "outline-white/20";
  const cardNumColor = isWhite ? "text-fg-black" : "text-white";

  return (
    <div
      className={cn(
        "rounded-card flex-col overflow-hidden relative",
        isCompact ? "gap-3 p-4" : "gap-5 p-6",
        resolveCardWidthClass(width, "w-80"),
        cfg.bg,
        className,
      )}
    >
      <CardGlow theme={cfg} />

      {cardNumber && (
        <div className={cn("absolute flex items-center gap-2 z-10", isCompact ? "right-4 top-4" : "right-5 top-5")}>
          {cardIcon && <img className={cn("rounded", isCompact ? "size-5" : "size-6")} src={cardIcon} alt="" />}
          <span className={cn("text-sm font-medium leading-5 tracking-fg", cardNumColor)}>{cardNumber}</span>
          <span className={cardNumColor}><AltArrowDownLinear size={16} /></span>
        </div>
      )}

      <div className={cn("self-stretch flex flex-col relative z-10", isCompact ? "gap-1" : "gap-2")}>
        <span className={cn("text-sm font-medium leading-5 tracking-fg", cfg.titleColor)}>{title}</span>
        <div className={cn("self-stretch font-semibold tracking-fg", isCompact ? "text-3xl leading-9" : "text-4xl leading-11", cfg.valueColor)}>
          {balanceHidden ? "$*****" : balance}
        </div>
      </div>

      <CardTrend trend={trend} direction={trendDirection} subtitle={subtitle} theme={cfg} />

      <div className={cn("self-stretch h-0 outline outline-1 outline-offset-[-0.50px] relative z-10", divider)} />

      <div className="self-stretch inline-flex gap-3 relative z-10">
        <button type="button" onClick={onTransfer} className={cn("flex-1 px-4 rounded-xl inline-flex justify-center items-center gap-2 cursor-pointer text-sm font-semibold leading-5 tracking-fg", isCompact ? "h-9" : "h-10", transferBtn)}>
          <RoundTransferHorizontalLinear size={isCompact ? 18 : 20} />
          转账
        </button>
        <button type="button" onClick={onRequest} className={cn("flex-1 px-4 rounded-xl inline-flex justify-center items-center gap-2 cursor-pointer text-sm font-semibold leading-5 tracking-fg", isCompact ? "h-9" : "h-10", requestBtn)}>
          <DownloadLinear size={isCompact ? 18 : 20} />
          收款
        </button>
      </div>
    </div>
  );
}
