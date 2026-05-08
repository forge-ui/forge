// ============================================================
// Plain glyph icons — solar-icon-set 没有的纯几何图标
// 跟 Figma button 的 path 1:1 还原（不带 circle 包装）
// ============================================================

export function PlusIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0"
    >
      <path d="M5 10H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0"
    >
      <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0"
    >
      <path d="M4.5 10.5L8.5 14L15.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
