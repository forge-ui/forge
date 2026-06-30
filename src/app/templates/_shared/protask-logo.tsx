export function ProtaskLogoMark({ tone = "purple" }: { tone?: "purple" | "white" }) {
  const primary = tone === "white" ? "#FFFFFF" : "var(--fg-violet)";
  const secondary = tone === "white" ? "rgba(255,255,255,0.48)" : "var(--fg-violet-300)";

  return (
    <svg className="size-8 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 3.5a12.5 12.5 0 1 1-12.5 12.5H11a5 5 0 1 0 5-5V3.5Z"
        fill={primary}
      />
      <path
        d="M3.5 16A12.5 12.5 0 0 1 16 3.5V11a5 5 0 0 0-5 5H3.5Z"
        fill={secondary}
      />
    </svg>
  );
}
