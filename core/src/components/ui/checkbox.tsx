"use client";

// ============================================================
// Checkbox - 复选框
// color: purple, blue, green, red, orange
// checked/unchecked 状态
// ============================================================

const checkboxColors = {
  purple: "bg-fg-violet",
  blue: "bg-blue-600",
  green: "bg-emerald-500",
  red: "bg-fg-red",
  orange: "bg-fg-red",
  black: "bg-fg-black",
} as const;

export type CheckboxColor = keyof typeof checkboxColors;

export function Checkbox({
  checked = false,
  color = "purple",
  onChange,
}: {
  checked?: boolean;
  color?: CheckboxColor;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className="w-5 h-5 relative cursor-pointer"
    >
      {checked ? (
        <>
          <div className={`w-5 h-5 ${checkboxColors[color]} rounded-md`} />
          <svg
            className="absolute inset-0 w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5.28 10.36L8.33 13.22L14.72 6.86"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </>
      ) : (
        <div className="w-5 h-5 bg-white rounded-md border-2 border-stone-300" />
      )}
    </button>
  );
}
