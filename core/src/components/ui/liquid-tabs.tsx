"use client";

// Third-party license notices: core/THIRD_PARTY_NOTICES.md.
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { useCallback, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion, useIsPresent } from "motion/react";
import { useReducedMotion } from "../../internal/motion";
import type { MotionPreference } from "../../lib/motion";
import { AltArrowDownLinear, CheckCircleLinear } from "../../icons";

export type LiquidTabsItem = { id: string; title: string; subtitle?: string; time?: string; icon?: ReactNode; disabled?: boolean };
export type LiquidTabsTab = { id: string; label: string; items: LiquidTabsItem[]; disabled?: boolean };
export type LiquidTabsProps = {
  tabs: LiquidTabsTab[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  onSelect?: (item: LiquidTabsItem, tabId: string) => void;
  visibleCount?: number;
  rows?: number;
  corner?: number;
  label?: string;
  moreLabel?: string;
  emptyLabel?: string;
  disabled?: boolean;
  motion?: MotionPreference;
  className?: string;
};
const spring = { type: "spring", visualDuration: .55, bounce: .12 } as const;
export function LiquidTabs({ tabs, value, defaultValue, onValueChange, onSelect, visibleCount = 3, rows = 4, corner = 20,
  label = "消息分类", moreLabel = "更多分类", emptyLabel = "暂无内容", disabled = false, motion: motionPreference = "auto", className = "" }: LiquidTabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const active = tabs.find(tab => tab.id === (value ?? internal) && !tab.disabled)?.id ?? tabs.find(tab => !tab.disabled)?.id;
  const [overflow, setOverflow] = useState<string>();
  const count = Number.isFinite(visibleCount) ? Math.max(1, Math.floor(visibleCount)) : 3;
  const fixed = tabs.slice(0, Math.max(0, count - 1));
  const remaining = tabs.slice(Math.max(0, count - 1));
  const last = remaining.find(tab => tab.id === active) ?? remaining.find(tab => tab.id === overflow) ?? remaining[0];
  const visible = tabs.length <= count ? tabs : [...fixed, ...(last ? [last] : [])];
  const [menuOpen, setMenuOpen] = useState(false);
  const [direction, setDirection] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [blob, setBlob] = useState({ x: 0, w: 0 });
  const root = useRef<HTMLDivElement>(null);
  const more = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLElement>());
  const uid = useId();
  const reduced = useReducedMotion(motionPreference);
  const transition = reduced ? { duration: 0 } : spring;
  const radius = Math.min(40, Math.max(0, corner));
  const rowCount = Number.isFinite(rows) ? Math.max(1, Math.floor(rows)) : 4;
  const tab = tabs.find(item => item.id === active);
  const measure = useCallback(() => {
    const element = active ? tabRefs.current.get(active) : undefined;
    if (!root.current || !element) {
      setBlob(previous => previous.w === 0 ? previous : { x: 0, w: 0 });
      return;
    }
    const base = root.current.getBoundingClientRect(), rect = element.getBoundingClientRect();
    setBlob(previous => previous.x === rect.left - base.left && previous.w === rect.width ? previous : { x: rect.left - base.left, w: rect.width });
  }, [active]);
  useLayoutEffect(() => {
    // The liquid background must use measured tab geometry before painting.
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    if (root.current) observer.observe(root.current);
    tabRefs.current.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [measure, tabs, overflow]);
  function select(id: string) {
    if (disabled || tabs.find(item => item.id === id)?.disabled) return;
    setDirection(tabs.findIndex(item => item.id === id) >= tabs.findIndex(item => item.id === active) ? 1 : -1);
    if (value === undefined) setInternal(id);
    onValueChange?.(id);
  }
  const panel = <LiquidPanel reduced={reduced} key={active ?? "empty"} id={`${uid}-panel-${encodeURIComponent(active ?? "empty")}`} labelledBy={active ? `${uid}-tab-${encodeURIComponent(active)}` : undefined} items={tab?.items.slice(0, rowCount) ?? []} selected={active ? selected[active] : undefined} direction={direction} disabled={disabled} emptyLabel={emptyLabel} onSelect={item => { if (active) { setSelected(current => ({ ...current, [active]: item.id })); onSelect?.(item, active); } }} />;
  return <LayoutGroup id={uid}><div ref={root} className={`forge-liquid ${className}`} data-motion={motionPreference} style={{ height: 52 + rowCount * 72 + 8 }}>
    <svg aria-hidden="true" className="forge-liquid__defs"><defs><filter id={`${uid}-goo`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" /><feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" /></filter></defs></svg>
    <div aria-hidden="true" className="forge-liquid__strip" style={{ height: 52 + radius, borderTopLeftRadius: radius + 4, borderTopRightRadius: radius + 4 }} />
    <div aria-hidden="true" className="forge-liquid__surface"><div className="forge-liquid__gooLayer" style={{ filter: `url(#${uid}-goo)` }}><div className="forge-liquid__body" style={{ top: 52, borderRadius: radius + 2 }} />
      {blob.w > 0 && <motion.div className="forge-liquid__blob" style={{ height: 70, borderRadius: radius + 2 }} initial={false} animate={{ x: blob.x, width: blob.w }} transition={transition} />}
    </div></div>
    <div className="forge-liquid__bar" style={{ height: 52 }}>
      <TabsPrimitive.Root value={active ?? null} onValueChange={next => { if (typeof next === "string") select(next); }} render={<div />} className="contents">
        <TabsPrimitive.List activateOnFocus loopFocus aria-label={label} className="forge-liquid__tabs">
          {visible.map(item => <TabsPrimitive.Tab key={item.id} value={item.id} ref={element => { if (element) tabRefs.current.set(item.id, element); else tabRefs.current.delete(item.id); }} id={`${uid}-tab-${encodeURIComponent(item.id)}`} aria-controls={`${uid}-panel-${encodeURIComponent(item.id)}`} disabled={disabled || item.disabled} className="forge-liquid__tab" data-active={active === item.id}>
            <span className="forge-liquid__tabLabel"><motion.span className="forge-liquid__tabText" initial={reduced ? false : { y: 10, opacity: 0, filter: "blur(3px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} transition={transition}>{item.label}</motion.span></span>
            {active === item.id && <motion.span layoutId="underline" className="forge-liquid__underline" transition={transition} />}
          </TabsPrimitive.Tab>)}
        </TabsPrimitive.List>
      </TabsPrimitive.Root>
      {tabs.length > count && <div ref={more} className="forge-liquid__more">
        <MenuPrimitive.Root open={menuOpen} onOpenChange={setMenuOpen} modal={false}>
          <MenuPrimitive.Trigger disabled={disabled} aria-label={moreLabel} className="forge-liquid__chevron"><motion.span className="forge-liquid__chevronIcon" animate={{ rotate: menuOpen ? 180 : 0 }} transition={transition}><AltArrowDownLinear size={18} color="currentColor" /></motion.span></MenuPrimitive.Trigger>
          {/* Portalled into the bar so the menu keeps the widget's CSS variables. */}
          <MenuPrimitive.Portal container={more}>
            <MenuPrimitive.Positioner side="bottom" align="end" sideOffset={4} collisionPadding={8} className="z-30">
              <MenuPrimitive.Popup aria-label={moreLabel} data-motion={reduced ? "none" : "auto"} className="forge-liquid__menu forge-popup" style={{ borderRadius: Math.max(10, radius - 6) }}>
                <MenuPrimitive.RadioGroup value={active} onValueChange={next => { setOverflow(next as string); select(next as string); }}>
                  {remaining.map(item => <MenuPrimitive.RadioItem key={item.id} value={item.id} disabled={item.disabled} closeOnClick className="forge-liquid__menuItem">{item.label}<MenuPrimitive.RadioItemIndicator><CheckCircleLinear size={14} color="currentColor" /></MenuPrimitive.RadioItemIndicator></MenuPrimitive.RadioItem>)}
                </MenuPrimitive.RadioGroup>
              </MenuPrimitive.Popup>
            </MenuPrimitive.Positioner>
          </MenuPrimitive.Portal>
        </MenuPrimitive.Root>
      </div>}
    </div>
    <div className="forge-liquid__panel" style={{ height: rowCount * 72 }}>{reduced ? panel : <AnimatePresence initial={false} mode="wait">{panel}</AnimatePresence>}</div>
  </div></LayoutGroup>;
}
function LiquidPanel({ id, labelledBy, items, selected, direction, onSelect, emptyLabel, disabled, reduced }: { reduced: boolean; id: string; labelledBy?: string; items: LiquidTabsItem[]; selected?: string; direction: number; onSelect: (item: LiquidTabsItem) => void; emptyLabel: string; disabled: boolean }) {
  const present = useIsPresent();
  const [hovered, setHovered] = useState<string>();
  return <motion.div id={id} role="tabpanel" aria-labelledby={labelledBy} inert={!present} aria-hidden={!present || undefined} initial={reduced ? false : { opacity: 0, x: direction * 18, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={reduced ? { opacity: 0 } : { opacity: 0, x: -direction * 18, filter: "blur(4px)" }} transition={reduced ? { duration: 0 } : { duration: .22 }} onPointerLeave={() => setHovered(undefined)}>
    <ul className="forge-liquid__list">{!items.length && <li className="forge-liquid__empty">{emptyLabel}</li>}{items.map((item, i) => <motion.li key={item.id} className="forge-liquid__item" initial={reduced ? false : { opacity: 0, x: direction * 18 }} animate={{ opacity: 1, x: 0 }} transition={reduced ? { duration: 0 } : { ...spring, delay: i * .04 }}>
      {i > 0 && <span aria-hidden="true" className="forge-liquid__divider" />}
      <motion.button type="button" disabled={disabled || item.disabled} aria-pressed={selected === item.id} className="forge-liquid__row" style={{ height: 72 }} onClick={() => onSelect(item)} onPointerEnter={() => setHovered(item.id)} onFocus={() => setHovered(item.id)} onBlur={() => setHovered(undefined)} whileTap={reduced ? undefined : { scale: .985 }}>
        {hovered === item.id && <motion.span aria-hidden="true" layoutId="row-hover" className="forge-liquid__hover" style={{ borderRadius: 12 }} transition={reduced ? { duration: 0 } : spring} />}
        <motion.span aria-hidden="true" className="forge-liquid__avatar" data-selected={selected === item.id} animate={{ scale: selected === item.id && !reduced ? [.9, 1.04, 1] : 1 }}>{item.icon ?? item.title.slice(0, 1)}</motion.span>
        <span className="forge-liquid__text"><span className="forge-liquid__title">{item.title}</span><span className="forge-liquid__subtitle">{item.subtitle}</span></span><span className="forge-liquid__time">{item.time}</span>
      </motion.button></motion.li>)}</ul>
  </motion.div>;
}

