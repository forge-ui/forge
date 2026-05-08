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
  type CardTheme,
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
  title = "Total Balance",
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
  className?: string;
}) {
  const themeKey = resolveCardTheme(theme);
  const cfg = cardThemes[themeKey];
  const isWhite = themeKey === "white";

  const transferBtn = isWhite
    ? "bg-fg-violet text-white"
    : "bg-fg-black text-white";
  const requestBtn = isWhite
    ? "bg-white outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-fg-black"
    : "outline outline-1 outline-offset-[-1px] outline-white/20 text-white";
  const divider = isWhite ? "outline-fg-grey-200" : "outline-white/20";
  const cardNumColor = isWhite ? "text-fg-black" : "text-white";

  return (
    <div className={cn("w-80 p-6 rounded-card inline-flex flex-col gap-5 overflow-hidden relative", cfg.bg, className)}>
      <CardGlow theme={cfg} />

      {cardNumber && (
        <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
          {cardIcon && <img className="w-6 h-6 rounded" src={cardIcon} alt="" />}
          <span className={cn("text-sm font-medium leading-5 tracking-fg", cardNumColor)}>{cardNumber}</span>
          <span className={cardNumColor}><AltArrowDownLinear size={16} /></span>
        </div>
      )}

      <div className="self-stretch flex flex-col gap-2 relative z-10">
        <span className={cn("text-sm font-medium leading-5 tracking-fg", cfg.titleColor)}>{title}</span>
        <div className={cn("self-stretch text-4xl font-semibold leading-11 tracking-fg", cfg.valueColor)}>
          {balanceHidden ? "$*****" : balance}
        </div>
      </div>

      <CardTrend trend={trend} direction={trendDirection} subtitle={subtitle} theme={cfg} />

      <div className={cn("self-stretch h-0 outline outline-1 outline-offset-[-0.50px] relative z-10", divider)} />

      <div className="self-stretch inline-flex gap-3 relative z-10">
        <button onClick={onTransfer} className={cn("flex-1 h-10 px-4 rounded-xl inline-flex justify-center items-center gap-2 cursor-pointer text-sm font-semibold leading-5 tracking-fg", transferBtn)}>
          <RoundTransferHorizontalLinear size={20} />
          Transfer
        </button>
        <button onClick={onRequest} className={cn("flex-1 h-10 px-4 rounded-xl inline-flex justify-center items-center gap-2 cursor-pointer text-sm font-semibold leading-5 tracking-fg", requestBtn)}>
          <DownloadLinear size={20} />
          Request
        </button>
      </div>
    </div>
  );
}
