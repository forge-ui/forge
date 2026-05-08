// case 页通用展示框 — 仅排版用，不属于 UI Kit
// case 内容必须从 @forge-ui-official/core import，禁止在 Section/SubSection 里手搓 UI 元素
//
// 两类排版 helper，各司其职：
//   · Section / SubSection / Labeled — 小组件矩阵（button/tag/badge 的 color × size 小 demo）
//   · BareSection / BarLabel / LabeledRow / DemoCard / DemoGrid — 大型矩阵页（card/calendar/form 多 subtitle × labeled-row）
//
// 两套 helper 在同一文件里，case 页按需 import 不跨文件。
//
// 视觉与 /docs 的 DocHeader/DocSection 对齐：统一字号、字体与行距。
// Section/BareSection 会从 title 自动 slugify 出 id 并打 data-case-section，
// 供 `_toc.tsx` 抽取右侧 TOC。

import { type ReactNode } from "react";
import { cn } from "@forge-ui-official/core";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const id = slugify(title);
  return (
    <section
      id={id}
      data-case-section={title}
      className="flex scroll-mt-24 flex-col gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-3xl font-semibold tracking-fg text-fg-black">
          {title}
        </h2>
        {description && (
          <p className="text-base font-normal leading-[1.8] text-fg-grey-900">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export function SubSection({
  title,
  stack = false,
  children,
}: {
  title: string;
  stack?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-fg-grey-700 uppercase tracking-fg">
        {title}
      </h3>
      <div
        className={
          stack
            ? "flex flex-col items-stretch gap-6 w-full"
            : "flex flex-wrap items-start gap-3"
        }
      >
        {children}
      </div>
    </div>
  );
}

// SubSectionGrid — 多个 SubSection 自适应分布：容器够宽并排，挤了自动降为一列
// auto-fit + minmax(min(100%, N), 1fr) 让每个 cell 至少 N px，否则一列。
// cols 是上限（最多几列），实际列数由容器宽度决定。
export function SubSectionGrid({
  cols = 2,
  children,
  className,
}: {
  cols?: 2 | 3;
  children: ReactNode;
  className?: string;
}) {
  const minWidth = cols === 3 ? "380px" : "560px";
  return (
    <div
      className={cn("grid items-start gap-x-6 gap-y-6 [&>*]:min-w-0", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minWidth}), 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

export function Labeled({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      {children}
      <span className="text-2xs text-fg-grey-500 font-medium">{label}</span>
    </div>
  );
}

export function PageHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <header className="flex flex-col gap-5">
      <h1 className="font-display text-4xl font-bold tracking-fg text-fg-black">
        {title}
      </h1>
      {hint && (
        <p className="max-w-2xl text-base font-normal leading-[1.8] text-fg-grey-900">
          {hint}
        </p>
      )}
    </header>
  );
}

// ── BareSection — 无 border 的 section（大型矩阵页用） ─────

export function BareSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const id = slugify(title);
  return (
    <section
      id={id}
      data-case-section={title}
      className={cn("flex scroll-mt-24 flex-col gap-6", className)}
    >
      <h2 className="font-display text-3xl font-semibold tracking-fg text-fg-black">
        {title}
      </h2>
      {children}
    </section>
  );
}

// ── BarLabel — grey bar 大标签（相当于 Figma 的 subtitle block） ──

export function BarLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-6 py-4 bg-fg-grey-100 rounded-lg">
      <span className="text-fg-black text-base font-bold leading-6 tracking-fg">
        {children}
      </span>
    </div>
  );
}

// ── LabeledRow — 左侧 label + 右侧 wrap content ──────────

export function LabeledRow({
  label,
  grey = false,
  children,
  className,
}: {
  label: string;
  grey?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-6",
        grey && "p-6 bg-fg-grey-50 rounded-xl",
        className,
      )}
    >
      <span className="w-20 text-fg-grey-700 text-sm font-medium tracking-fg capitalize pt-3 shrink-0">
        {label}
      </span>
      <div className="flex flex-wrap gap-4 flex-1">{children}</div>
    </div>
  );
}

// ── DemoCard — 白底卡片 + 标题 ─────────────────────────

export function DemoCard({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-6 bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200",
        className,
      )}
    >
      <span className="text-sm font-semibold text-fg-black tracking-fg">{title}</span>
      {children}
    </div>
  );
}

// ── DemoGrid — 响应式 grid 容器 ────────────────────────

export function DemoGrid({
  cols = 3,
  children,
  className,
}: {
  cols?: 2 | 3 | 4;
  children: ReactNode;
  className?: string;
}) {
  const colClass = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" }[cols];
  return <div className={cn("grid gap-6", colClass, className)}>{children}</div>;
}
