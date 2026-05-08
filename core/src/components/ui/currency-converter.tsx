import { type ReactNode } from "react";
import { MenuDotsBold, AltArrowDownLinear, TransferVerticalLinear, InfoCircleBoldDuotone } from "solar-icon-set";
import { cn } from "../../lib/utils";

// ============================================================
// CurrencyConverter - 货币转换器卡片
// color: purple, blue, dark (controls the Convert button color)
// ============================================================

export type CurrencyConverterColor = "purple" | "blue" | "dark";

const buttonColors: Record<CurrencyConverterColor, string> = {
  purple: "bg-fg-violet",
  blue: "bg-blue-600",
  dark: "bg-fg-black",
};

interface CurrencyInputProps {
  value?: string;
  placeholder?: string;
  currency?: string;
  onChange?: (value: string) => void;
  onCurrencyChange?: () => void;
}

function CurrencyInput({
  value,
  placeholder = "Placeholder text. . .",
  currency = "USD",
  onChange,
  onCurrencyChange,
}: CurrencyInputProps) {
  return (
    <div className="self-stretch px-4 py-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex justify-start items-center gap-1 overflow-hidden">
      <div className="flex-1 h-6 flex justify-start items-center gap-2 overflow-hidden">
        {value !== undefined ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="justify-start text-fg-black text-sm font-normal leading-5 tracking-fg bg-transparent outline-none w-full"
          />
        ) : (
          <input
            type="text"
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            className="justify-start text-fg-grey-700 text-sm font-normal leading-5 tracking-fg bg-transparent outline-none w-full placeholder:text-fg-grey-700"
          />
        )}
      </div>
      <button
        onClick={onCurrencyChange}
        className="h-6 flex justify-start items-center gap-1 overflow-hidden cursor-pointer text-fg-grey-700"
      >
        <div className="justify-start text-sm font-normal leading-5 tracking-fg">
          {currency}
        </div>
        <div className="w-6 h-6 flex justify-center items-center gap-2">
          <AltArrowDownLinear size={20} />
        </div>
      </button>
    </div>
  );
}

export interface CurrencyConverterProps {
  title?: string;
  subtitle?: string;
  color?: CurrencyConverterColor;
  fromValue?: string;
  fromCurrency?: string;
  fromPlaceholder?: string;
  toValue?: string;
  toCurrency?: string;
  toPlaceholder?: string;
  exchangeRateText?: string;
  convertLabel?: string;
  convertIcon?: ReactNode;
  onMenuClick?: () => void;
  onConvert?: () => void;
  onFromChange?: (value: string) => void;
  onToChange?: (value: string) => void;
  onFromCurrencyChange?: () => void;
  onToCurrencyChange?: () => void;
  className?: string;
}

export function CurrencyConverter({
  title = "Title Here",
  subtitle = "Text here",
  color = "purple",
  fromValue,
  fromCurrency = "USD",
  fromPlaceholder,
  toValue,
  toCurrency = "USD",
  toPlaceholder,
  exchangeRateText = "1 EUR = 1.09 USD",
  convertLabel = "Convert",
  convertIcon,
  onMenuClick,
  onConvert,
  onFromChange,
  onToChange,
  onFromCurrencyChange,
  onToCurrencyChange,
  className,
}: CurrencyConverterProps) {
  return (
    <div
      className={cn(
        "w-96 bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col justify-start items-center overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="self-stretch p-6 inline-flex justify-start items-start gap-3">
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
          <div className="self-stretch justify-start text-fg-black text-xl font-semibold leading-8 tracking-fg">
            {title}
          </div>
          <div className="self-stretch justify-start text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
            {subtitle}
          </div>
        </div>
        <button
          onClick={onMenuClick}
          className="p-3.5 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-start items-center gap-2 cursor-pointer text-fg-grey-700"
        >
          <MenuDotsBold size={20} className="rotate-90" />
        </button>
      </div>

      {/* Body */}
      <div className="self-stretch px-6 pb-6 flex flex-col justify-center items-start gap-6">
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <CurrencyInput
            value={fromValue}
            placeholder={fromPlaceholder}
            currency={fromCurrency}
            onChange={onFromChange}
            onCurrencyChange={onFromCurrencyChange}
          />
          <CurrencyInput
            value={toValue}
            placeholder={toPlaceholder}
            currency={toCurrency}
            onChange={onToChange}
            onCurrencyChange={onToCurrencyChange}
          />
          <div className="self-stretch inline-flex justify-center items-center gap-2 text-fg-grey-700">
            <InfoCircleBoldDuotone size={16} />
            <div className="flex-1 justify-start text-xs font-medium leading-4 tracking-fg">
              {exchangeRateText}
            </div>
          </div>
        </div>

        {/* Convert button */}
        <button
          onClick={onConvert}
          className={cn(
            "self-stretch pl-3.5 pr-4 py-3.5 rounded-full inline-flex justify-center items-center gap-1 overflow-hidden cursor-pointer",
            buttonColors[color]
          )}
        >
          <span className="w-5 h-5 flex items-center justify-center text-white">
            {convertIcon ?? <TransferVerticalLinear size={20} />}
          </span>
          <div className="justify-start text-white text-sm font-bold leading-5 tracking-fg">
            {convertLabel}
          </div>
        </button>
      </div>
    </div>
  );
}
