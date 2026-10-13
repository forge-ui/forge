"use client";

// Third-party license notices: core/THIRD_PARTY_NOTICES.md.
import { useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useReducedMotion } from "../../internal/motion";
import type { MotionPreference } from "../../lib/motion";
import { AltArrowDownLinear, AltArrowLeftLinear, AltArrowRightLinear } from "../../icons";
import type { ButtonColor } from "./button";
import { getDaysInMonth, isSameDay } from "./calendar-utils";

export type CalendarCardLabels = { changeMonth: string; previousMonth: string; nextMonth: string; previousYear: string; nextYear: string };
export type CalendarCardProps = {
  /** Default preserves the original card geometry; compact uses form typography. */
  size?: "default" | "compact";
  /** Plain removes both decorative card surfaces and their padding. */
  variant?: "card" | "plain";
  color?: ButtonColor;
  value?: Date;
  defaultDate?: Date;
  onChange?: (date: Date) => void;
  locale?: string;
  labels?: Partial<CalendarCardLabels>;
  disabled?: boolean;
  motion?: MotionPreference;
  className?: string;
};
const defaults: CalendarCardLabels = { changeMonth: "选择月份和年份", previousMonth: "上个月", nextMonth: "下个月", previousYear: "上一年", nextYear: "下一年" };
const calendarColors: Record<ButtonColor, string> = {
  purple: "var(--fg-violet)", dark: "var(--fg-violet-800)", blue: "var(--fg-blue)",
  red: "var(--fg-red)", green: "var(--fg-green-500)", yellow: "var(--fg-yellow)",
  grey: "var(--fg-grey-700)", black: "var(--foreground)", "blue-dark": "var(--fg-blue-800)",
};
const morph = { type: "spring", visualDuration: .42, bounce: .16 } as const;
function todayKey() { const d = new Date(); return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`; }
function subscribeToday(listener: () => void) {
  const timer = setInterval(listener, 60_000);
  window.addEventListener("focus", listener);
  return () => { clearInterval(timer); window.removeEventListener("focus", listener); };
}
const serverToday = () => "";
function turn(date: Date, by: number) { const next = new Date(date.getFullYear(), date.getMonth() + by, 1); next.setDate(Math.min(date.getDate(), getDaysInMonth(next.getFullYear(), next.getMonth()))); return next; }
export function CalendarCard({ size = "default", variant = "card", color = "red", value, defaultDate, locale = "zh-CN", labels, disabled = false, motion: motionPreference = "auto", className = "", onChange }: CalendarCardProps) {
  const appearance = {
    className: `forge-calendar ${className}`,
    "data-size": size,
    "data-variant": variant,
    "data-color": color,
    "data-motion": motionPreference,
    style: {
      "--forge-calendar-accent": calendarColors[color],
      "--forge-calendar-accent-ink": color === "yellow" ? "var(--fg-black)" : color === "black" ? "var(--background)" : "var(--fg-white)",
    } as CSSProperties,
  };
  const today = useSyncExternalStore(subscribeToday, todayKey, serverToday);
  const [internal, setInternal] = useState(defaultDate);
  const date = value ?? internal ?? (today ? new Date(today) : undefined);
  const reduced = useReducedMotion(motionPreference);
  const transition = reduced ? { duration: 0 } : morph;
  const id = useId();
  const [picking, setPicking] = useState(false);
  const [pickYear, setPickYear] = useState(2000);
  const [hover, setHover] = useState<number | null>(null);
  const [tears, setTears] = useState(0);
  const [direction, setDirection] = useState(1);
  const grid = useRef<HTMLDivElement>(null);
  const picker = useRef<HTMLDivElement>(null);
  const monthButton = useRef<HTMLButtonElement>(null);
  const focusNext = useRef(false);
  const text = { ...defaults, ...labels };
  const timestamp = date?.getTime();
  useLayoutEffect(() => {
    if (!focusNext.current) return;
    focusNext.current = false;
    if (picking) (picker.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]') ?? picker.current?.querySelector<HTMLButtonElement>('button:not(:disabled)'))?.focus();
    else grid.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus();
  }, [picking, timestamp]);
  if (!date || !Number.isFinite(date.getTime())) return <div {...appearance} aria-busy="true"><div className="forge-calendar__ghost" /></div>;
  const year = date.getFullYear(), month = date.getMonth(), day = date.getDate();
  const total = getDaysInMonth(year, month), lead = (new Date(year, month, 1).getDay() + 6) % 7;
  const months = Array.from({ length: 12 }, (_, m) => new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2020, m, 1)));
  const weekdays = Array.from({ length: 7 }, (_, d) => new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(new Date(2024, 0, 1 + d)));
  const full = (d: Date) => new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(d);
  function select(next: Date) {
    if (disabled || next.getFullYear() < 1900 || next.getFullYear() > 2100) return;
    setDirection(next.getTime() >= date!.getTime() ? 1 : -1);
    setHover(null);
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }
  function turnPage(by: number) { setTears(n => n + 1); select(turn(date!, by)); }
  function keys(event: KeyboardEvent<HTMLDivElement>) {
    const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    let next: Date;
    if (event.key in offsets) next = new Date(year, month, day + offsets[event.key]);
    else if (event.key === "PageUp" || event.key === "PageDown") next = turn(date!, event.key === "PageUp" ? -1 : 1);
    else if (event.key === "Home" || event.key === "End") next = new Date(year, month, event.key === "Home" ? 1 : total);
    else return;
    event.preventDefault(); focusNext.current = true; select(next);
  }
  return <div {...appearance} data-disabled={disabled || undefined}><LayoutGroup id={id}>
    <motion.div className="forge-calendar__shell" initial={reduced ? false : { opacity: 0, y: 14, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={transition}>
      <div className="forge-calendar__card"><header className="forge-calendar__head">
        <div className="forge-calendar__title" aria-live="polite" aria-label={full(date)}>
          <span className="forge-calendar__day" aria-hidden="true"><Odometer reduced={reduced} value={String(day)} /></span>
          <button ref={monthButton} type="button" className="forge-calendar__monthBtn" disabled={disabled} aria-expanded={picking} aria-controls={`${id}-picker`} aria-label={text.changeMonth}
            onClick={() => { setPickYear(year); setPicking(!picking); focusNext.current = true; }}>
            <span className="forge-calendar__month"><AnimatePresence initial={false} mode={reduced ? "sync" : "popLayout"}>
              <motion.span key={`${year}-${month}`} className="forge-calendar__monthName" initial={reduced ? false : { opacity: 0, x: direction * 14, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={transition}>{months[month]}</motion.span>
            </AnimatePresence></span><span className="forge-calendar__year"><Odometer reduced={reduced} value={String(year)} /></span>
            <motion.span animate={{ rotate: picking ? 180 : 0 }} transition={transition}><AltArrowDownLinear size={12} color="currentColor" /></motion.span>
          </button>
        </div>
        <div className="forge-calendar__navigation">
          <button type="button" className="forge-calendar__back" aria-label={text.previousMonth} disabled={disabled || year <= 1900 && month === 0} onClick={() => turnPage(-1)}><AltArrowLeftLinear size={16} color="currentColor" /></button>
          <CalendarIcon reduced={reduced} tears={tears} day={day} onTear={() => turnPage(1)} disabled={disabled || year >= 2100 && month === 11} label={text.nextMonth} />
        </div>
      </header>
      <div className="forge-calendar__progress" aria-hidden="true">{[0, 1, 2, 3].map(i => <span key={i} className="forge-calendar__seg"><motion.span className="forge-calendar__segFill" initial={false} animate={{ scaleX: Math.max(0, Math.min(1, day / total * 4 - i)) }} transition={transition} /></span>)}</div>
      <div className="forge-calendar__body">
        {picking ? <motion.div key="picker" ref={picker} id={`${id}-picker`} className="forge-calendar__picker" initial={reduced ? false : { opacity: 0, scale: .96, filter: "blur(6px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={transition}
          onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); setPicking(false); monthButton.current?.focus(); } }}>
          <div className="forge-calendar__yearRow"><button type="button" className="forge-calendar__step" disabled={disabled || pickYear <= 1900} aria-label={text.previousYear} onClick={() => setPickYear(y => y - 1)}><AltArrowLeftLinear size={16} color="currentColor" /></button>
            <span className="forge-calendar__yearBig" aria-live="polite"><Odometer reduced={reduced} value={String(pickYear)} /></span>
            <button type="button" className="forge-calendar__step" disabled={disabled || pickYear >= 2100} aria-label={text.nextYear} onClick={() => setPickYear(y => y + 1)}><AltArrowRightLinear size={16} color="currentColor" /></button></div>
          <div className="forge-calendar__months">{months.map((label, m) => <motion.button type="button" key={m} className="forge-calendar__monthCell" disabled={disabled} aria-pressed={pickYear === year && m === month} data-selected={pickYear === year && m === month || undefined}
            onClick={() => { select(new Date(pickYear, m, Math.min(day, getDaysInMonth(pickYear, m)))); setPicking(false); focusNext.current = true; }} whileTap={reduced ? undefined : { scale: .92 }}>
            {pickYear === year && m === month && <motion.span layoutId="month-selected" className="forge-calendar__mSelected" transition={transition} />}<span className="forge-calendar__num">{label}</span></motion.button>)}</div>
        </motion.div> : <motion.div key="days" className="forge-calendar__days" initial={reduced ? false : { opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={transition}>
          <div className="forge-calendar__week" aria-hidden="true">{weekdays.map((label, i) => <span key={i}>{label}</span>)}</div>
          <div ref={grid} className="forge-calendar__gridWrap" role="group" aria-label={`${months[month]} ${year}`} onKeyDown={keys} onPointerLeave={() => setHover(null)}>
            <motion.div key={`${year}-${month}`} className="forge-calendar__grid" initial={reduced ? false : { x: direction * 28, opacity: 0, filter: "blur(6px)" }} animate={{ x: 0, opacity: 1, filter: "blur(0px)" }} exit={{ x: -direction * 28, opacity: 0 }} transition={transition}>
              {Array.from({ length: lead + total }, (_, i) => { const d = i - lead + 1; if (d < 1) return <span className="forge-calendar__cell" key={i} />;
                const now = Boolean(today && isSameDay(new Date(year, month, d), new Date(today)));
                return <motion.button key={i} type="button" className="forge-calendar__cell forge-calendar__date" disabled={disabled} aria-label={full(new Date(year, month, d))} aria-pressed={d === day} aria-current={now ? "date" : undefined} tabIndex={d === day ? 0 : -1}
                  data-selected={d === day || undefined} data-today={now || undefined} onPointerEnter={event => { if (event.pointerType === "mouse") setHover(d); }} onClick={() => select(new Date(year, month, d))} whileTap={reduced ? undefined : { scale: .9 }}>
                  {hover === d && d !== day && <motion.span layoutId="hover" className="forge-calendar__hover" transition={transition} />}{d === day && <motion.span layoutId="selected" className="forge-calendar__selected" transition={transition} />}<span className="forge-calendar__num">{d}</span>
                </motion.button>; })}
            </motion.div>
          </div>
        </motion.div>}
      </div>
    </div></motion.div>
  </LayoutGroup></div>;
}
function Odometer({ value, reduced }: { value: string; reduced: boolean }) {
  return <AnimatePresence initial={false} mode={reduced ? "sync" : "popLayout"}>{value.split("").map((digit, i) => <motion.span key={`${value.length - i}:${digit}`} className="forge-calendar__digit" layout={reduced ? false : "position"}
    initial={reduced ? false : { y: "70%", opacity: 0, filter: "blur(3px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={reduced ? { opacity: 0 } : { y: "-70%", opacity: 0, filter: "blur(3px)" }} transition={reduced ? { duration: 0 } : morph}>{digit}</motion.span>)}</AnimatePresence>;
}
function CalendarIcon({ tears, day, onTear, disabled, label, reduced }: { tears: number; day: number; onTear: () => void; disabled: boolean; label: string; reduced: boolean }) {
  return <motion.button type="button" className="forge-calendar__icon" disabled={disabled} aria-label={label} onClick={onTear} whileHover={reduced ? undefined : { y: -1.5, rotate: -2 }} whileTap={reduced ? undefined : { scale: .92 }}>
    <span className="forge-calendar__iconTop" />{tears > 0 && !reduced && <motion.span key={tears} className="forge-calendar__leaf" initial={{ rotateX: 0, opacity: 1, y: 0 }} animate={{ rotateX: 75, opacity: 0, y: -10 }} transition={{ duration: .45 }} />}
    <span className="forge-calendar__dots">{Array.from({ length: 21 }, (_, i) => <motion.span key={`${i}-${tears}`} className="forge-calendar__dot" data-on={i === (day - 1) % 21 || undefined} initial={tears && !reduced ? { scale: .3, opacity: 0 } : false} animate={{ scale: 1, opacity: 1 }} transition={reduced ? { duration: 0 } : { ...morph, delay: tears ? .12 + i % 7 * .018 + Math.floor(i / 7) * .03 : 0 }} />)}</span>
  </motion.button>;
}
