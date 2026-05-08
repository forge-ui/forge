"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "../../../lib/utils";
import { AltArrowDownLinear } from "solar-icon-set";
import { formAccents, type FormAccentColor } from "./form-utils";

// ============================================================
// TextFieldSelectSuffix — inline select dropdown designed to sit
// inside TextField's `suffix` slot. Matches Figma "+" Select" variant.
//
// Usage:
//   <TextField
//     suffix={
//       <TextFieldSelectSuffix
//         value="USD"
//         options={["USD","EUR","GBP"]}
//         onChange={setValue}
//         color="purple"
//       />
//     }
//   />
// ============================================================

export function TextFieldSelectSuffix({
  value,
  options,
  onChange,
  color = "purple",
}: {
  value: string;
  options: string[];
  onChange?: (value: string) => void;
  color?: FormAccentColor;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const accent = formAccents[color];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 cursor-pointer text-fg-grey-700 text-sm font-normal leading-5 tracking-fg hover:text-fg-black transition-colors"
      >
        {value}
        <AltArrowDownLinear size={16} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-48 py-2 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-100 shadow-[0px_4px_30px_0px_rgba(77,84,100,0.05)] z-50 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-y-auto max-h-60">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => { onChange?.(opt); setOpen(false); }}
                className={cn(
                  "h-12 px-4 py-3 flex items-center cursor-pointer hover:bg-fg-grey-100 transition-colors",
                  opt === value ? `${accent.text} font-semibold` : "text-fg-grey-700 font-semibold",
                )}
              >
                {opt}
              </div>
            ))}
          </div>
          {options.length > 4 && (
            <div className="w-1 bg-fg-grey-100 self-stretch shrink-0 relative">
              <div className={cn("absolute top-2 left-0 right-0 h-14 rounded-full", accent.bg)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
