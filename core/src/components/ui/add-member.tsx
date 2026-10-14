"use client";

// Third-party license notices: core/THIRD_PARTY_NOTICES.md.
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "../../internal/motion";
import type { MotionPreference } from "../../lib/motion";
import { AltArrowUpLinear, AltArrowLeftLinear, AltArrowRightLinear, MagniferLinear, CheckCircleLinear } from "../../icons";
import { accentColors, type AccentColor } from "./accent-utils";
import { Avatar } from "./avatar";
export type AddMemberItem = { id: string; name: string; role?: string; avatar?: string; status?: "online" | "idle" | "dnd" | "offline"; disabled?: boolean };
export type AddMemberLabels = {
  title: string; search: string; empty: string; add: string; adding: string; added: string; error: string;
  select: string; remove: string; selected: string; viewAll: string; previous: string; next: string;
};
export type AddMemberProps = {
  members: AddMemberItem[];
  /** Optional Forge theme; omitted preserves the original panel colors. */
  accent?: AccentColor;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Resolving confirms success. Reject to retain the selection for retry. */
  onAdd?: (ids: string[]) => void | Promise<void>;
  clearOnAdd?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  rows?: number;
  search?: boolean;
  disabled?: boolean;
  labels?: Partial<AddMemberLabels>;
  motion?: MotionPreference;
  className?: string;
};
const defaults: AddMemberLabels = { title: "项目成员", search: "搜索成员", empty: "没有匹配的成员", add: "添加到项目", adding: "正在添加…", added: "添加成功", error: "添加失败，请重试", select: "选择", remove: "移除", selected: "已选择", viewAll: "查看全部成员", previous: "上一页成员", next: "下一页成员" };
const spring = { type: "spring", stiffness: 320, damping: 30, mass: .9 } as const;
type Flight = { member: AddMemberItem; x: number; y: number; dx: number; dy: number; width: number; scale: number };
export function AddMember({ members, accent, selectedIds, defaultSelectedIds = [], onSelectionChange, onAdd, clearOnAdd = true,
  open, defaultOpen = false, onOpenChange, rows = 4, search = true, disabled = false, labels, motion: motionPreference = "auto", className = "" }: AddMemberProps) {
  const text = { ...defaults, ...labels };
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;
  const [internalSelected, setInternalSelected] = useState(defaultSelectedIds);
  const picked = [...new Set(selectedIds ?? internalSelected)].filter(id => members.some(member => member.id === id));
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const pending = useRef(false), alive = useRef(false);
  const reduced = useReducedMotion(motionPreference);
  const transition = reduced ? { duration: 0 } : spring;
  const [flight, setFlight] = useState<Flight | null>(null);
  const shell = useRef<HTMLDivElement>(null), stack = useRef<HTMLDivElement>(null);
  const id = useId();
  const needle = query.trim().toLocaleLowerCase();
  const filtered = members.filter(member => `${member.name} ${member.role ?? ""}`.toLocaleLowerCase().includes(needle));
  const perPage = Number.isFinite(rows) ? Math.max(2, Math.min(10, Math.floor(rows))) : 4;
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, pages - 1);
  const shown = filtered.slice(currentPage * perPage, (currentPage + 1) * perPage);
  const locked = disabled || status === "pending";
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => { if (!flight) return; const timer = setTimeout(() => setFlight(null), 800); return () => clearTimeout(timer); }, [flight]);
  function setOpen(next: boolean) { if (open === undefined) setInternalOpen(next); onOpenChange?.(next); }
  function choose(next: string[]) { if (selectedIds === undefined) setInternalSelected(next); onSelectionChange?.(next); }
  function toggle(member: AddMemberItem, button: HTMLButtonElement) {
    if (locked || member.disabled) return;
    const removing = picked.includes(member.id);
    const avatar = button.querySelector<HTMLElement>('.forge-member__avatar')?.getBoundingClientRect();
    flushSync(() => { choose(removing ? picked.filter(item => item !== member.id) : [...picked, member.id]); setStatus("idle"); });
    if (removing || reduced || !avatar || !shell.current) return;
    const target = [...(stack.current?.querySelectorAll<HTMLElement>('[data-member-id]') ?? [])].find(element => element.dataset.memberId === member.id) ?? stack.current?.querySelector<HTMLElement>('.forge-member__more');
    if (!target) return;
    const base = shell.current.getBoundingClientRect(), to = target.getBoundingClientRect();
    if (!to.width) return;
    setFlight({ member, x: avatar.left - base.left, y: avatar.top - base.top, dx: to.left + to.width / 2 - avatar.left - avatar.width / 2, dy: to.top + to.height / 2 - avatar.top - avatar.height / 2, width: avatar.width, scale: to.width / avatar.width });
  }
  async function add() {
    if (locked || pending.current || !picked.length || !onAdd) return;
    pending.current = true; setStatus("pending");
    try { await onAdd([...picked]); if (!alive.current) return; setStatus("success"); if (clearOnAdd) choose([]); }
    catch { if (alive.current) setStatus("error"); }
    finally { pending.current = false; }
  }
  function turn(by: number) { setDirection(by); setPage((currentPage + by + pages) % pages); if (!isOpen) setOpen(true); }
  return <div className={`forge-member ${className}`} data-motion={motionPreference} data-status={status} style={{ "--forge-member-r": "20px", ...(accent ? { "--forge-member-panel": accentColors[accent].hex, "--forge-member-foot": "var(--fg-white)", "--forge-member-ring-accent": accentColors[accent].hex } : {}) } as CSSProperties}>
    <svg className="forge-member__defs" aria-hidden="true"><defs><filter id={`${id}-goo`}><feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" /><feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11" result="goo" /><feBlend in="SourceGraphic" in2="goo" /></filter></defs></svg>
    <motion.div ref={shell} className="forge-member__shell" initial={reduced ? false : { opacity: 0, y: 24, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={transition}>
      <div className="forge-member__card"><button type="button" className="forge-member__head" disabled={disabled} aria-expanded={isOpen} aria-controls={`${id}-body`} onClick={() => setOpen(!isOpen)}>
        <span className="forge-member__title">{text.title}</span><motion.span className="forge-member__chevron" animate={{ rotate: isOpen ? 0 : 180 }} transition={transition}><AltArrowUpLinear size={20} color="currentColor" /></motion.span>
      </button>
      <motion.div id={`${id}-body`} className="forge-member__body" inert={!isOpen} aria-hidden={!isOpen || undefined} initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} transition={transition}>
        {search && <div className="forge-member__search"><MagniferLinear size={16} color="currentColor" /><input type="search" className="forge-member__searchInput" aria-label={text.search} placeholder={text.search} value={query} disabled={locked} onChange={event => { setQuery(event.target.value); setPage(0); }} onKeyDown={event => { if (event.key === "Enter") event.preventDefault(); if (event.key === "Escape") { setQuery(""); setPage(0); } }} /></div>}
        <ul className="forge-member__list">{shown.length === 0 && <li className="forge-member__empty">{text.empty}</li>}{shown.map((member, index) => {
          const selected = picked.includes(member.id);
          return <motion.li key={member.id} initial={reduced ? false : { opacity: 0, x: direction * 18, y: 12 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={reduced ? { duration: 0 } : { ...spring, delay: index * .06 }}>
            <button type="button" className="forge-member__row" disabled={locked || member.disabled} aria-pressed={selected} aria-label={`${selected ? text.remove : text.select} ${member.name}`} onClick={event => toggle(member, event.currentTarget)}>
              <span className="forge-member__avatar"><Avatar src={member.avatar} initials={member.name.slice(0, 2)} alt="" size="lg" />{member.status && <span aria-hidden="true" className={`forge-member__dot is-${member.status}`} />}</span>
              <span className="forge-member__meta"><span className="forge-member__name">{member.name}</span><span className="forge-member__role">{member.role}</span></span>
              <motion.span className={`forge-member__toggle${selected ? " is-on" : ""}`} aria-hidden="true" whileTap={reduced ? undefined : { scale: .9 }}>
                <span className="forge-member__goo" style={{ filter: `url(#${id}-goo)` }}><motion.span className="forge-member__fill" initial={false} animate={{ scale: selected ? 1 : 0, opacity: selected ? 1 : 0 }} transition={transition} />
                  {selected && !reduced && [-1, 1].map(sign => <motion.span key={sign} className="forge-member__blob" initial={{ opacity: 1, scale: .2, x: 0, y: 0 }} animate={{ opacity: [1, 1, 0], scale: [.2, .6, .1], x: [0, sign * 15, 0], y: [0, sign * -11, 0] }} transition={{ duration: .56 }} />)}
                </span><motion.span className="forge-member__ring" initial={false} animate={{ opacity: selected ? 0 : 1, scale: selected ? .82 : 1 }} transition={transition} />
                <motion.svg className="forge-member__sign" viewBox="0 0 24 24" initial={false} animate={{ rotate: selected ? 180 : 0 }} transition={transition}><rect className="forge-member__bar" x="6.5" y="11" width="11" height="2" rx="1" /><motion.rect className="forge-member__bar forge-member__barV" x="11" y="6.5" width="2" height="11" rx="1" initial={false} animate={{ scaleY: selected ? 0 : 1, opacity: selected ? 0 : 1 }} transition={transition} /></motion.svg>
              </motion.span>
            </button>
          </motion.li>;
        })}</ul>
        <motion.div className="forge-member__action" initial={false} animate={{ height: picked.length ? "auto" : 0, opacity: picked.length ? 1 : 0 }} transition={transition} inert={!picked.length}>
          <div className="forge-member__actionIn"><div ref={stack} className="forge-member__stack" aria-label={text.selected}><AnimatePresence initial={false}>{picked.slice(0, 4).map(memberId => { const member = members.find(person => person.id === memberId)!; return <motion.span key={memberId} className="forge-member__chip" data-member-id={memberId} initial={reduced ? false : { scale: .2 }} animate={{ scale: 1, opacity: !reduced && flight?.member.id === memberId ? 0 : 1 }} exit={{ scale: .2, opacity: 0 }} transition={transition}><Avatar src={member.avatar} initials={member.name.slice(0, 2)} alt={member.name} size="sm" /></motion.span>; })}</AnimatePresence>{picked.length > 4 && <span className="forge-member__chip forge-member__more">+{picked.length - 4}</span>}</div>
            <span className="forge-member__count">{text.selected} {picked.length}</span><motion.button type="button" className="forge-member__cta" disabled={locked || !onAdd || !picked.length} onClick={() => void add()} whileTap={reduced ? undefined : { scale: .96 }}>{status === "pending" ? text.adding : text.add}</motion.button>
          </div>
        </motion.div>
        <p className="forge-member__feedback" role="status">{status === "success" ? <><CheckCircleLinear size={16} color="currentColor" />{text.added}</> : status === "error" ? text.error : null}</p>
      </motion.div></div>
      <div className="forge-member__foot"><button type="button" className="forge-member__all" disabled={locked} onClick={() => { setQuery(""); setPage(0); setOpen(true); }}>{text.viewAll}</button><div className="forge-member__nav"><button type="button" aria-label={text.previous} disabled={locked || pages < 2} onClick={() => turn(-1)}><AltArrowLeftLinear size={18} color="currentColor" /></button><button type="button" aria-label={text.next} disabled={locked || pages < 2} onClick={() => turn(1)}><AltArrowRightLinear size={18} color="currentColor" /></button></div></div>
      {flight && !reduced && <div className="forge-member__fly" aria-hidden="true"><motion.span className="forge-member__ghost" style={{ left: flight.x, top: flight.y, width: flight.width, height: flight.width }} initial={{ x: 0, y: 0, scale: 1 }} animate={{ x: [0, flight.dx * .55, flight.dx], y: [0, flight.dy * .45 - 22, flight.dy], scale: [1, .8, flight.scale] }} transition={{ duration: .52, ease: [.22, 1, .36, 1] }} onAnimationComplete={() => setFlight(null)}><Avatar src={flight.member.avatar} initials={flight.member.name.slice(0, 2)} alt="" size="lg" /></motion.span></div>}
    </motion.div>
  </div>;
}
