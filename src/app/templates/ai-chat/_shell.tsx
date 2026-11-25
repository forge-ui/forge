"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Avatar, Button, CommandSearch, Modal, Popover, TabBar, TextArea, Toggle, cn } from "@aideui/core";
import {
  AltArrowDownLinear,
  AltArrowRightLinear,
  ChatRoundLineLinear,
  ClockCircleLinear,
  FolderLinear,
  MagniferLinear,
  PenNewSquareLinear,
  SidebarMinimalisticLinear,
  WidgetLinear,
  CrownBold,
  Logout2Bold,
  PenBold,
  SettingsBold,
  UserPlusBold,
} from "@aideui/core/icons";
import { PROJECTS, THREADS } from "./_data";

export const BASE = "/templates/ai-chat";

const SidebarContext = createContext<{ sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }>({ sidebarOpen: true, setSidebarOpen: () => undefined });

export const useSidebar = () => useContext(SidebarContext);

export function AiChatShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const activeThread = pathname === BASE ? params.get("thread") ?? (params.get("new") ? null : "hero") : null;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ website: true, console: true });
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden bg-fg-grey-50 text-fg-black">
      {sidebarOpen && (
        <aside className="flex w-[264px] shrink-0 flex-col">
          <div className="flex h-14 items-center justify-between px-4">
            <Link href={BASE} className="text-base font-semibold tracking-fg">
              Forge
            </Link>
            <IconAction label="收起侧栏" onClick={() => setSidebarOpen(false)}>
              <SidebarMinimalisticLinear size={18} />
            </IconAction>
          </div>
          <nav className="flex flex-col gap-0.5 px-2">
            <NavRow icon={<PenNewSquareLinear size={18} />} label="新对话" onClick={() => router.push(`${BASE}?new=1`)} active={pathname === BASE && !!params.get("new")} />
            <NavRow icon={<MagniferLinear size={18} />} label="搜索" hint="⌘K" onClick={() => setSearchOpen(true)} />
            <NavRow icon={<WidgetLinear size={18} />} label="插件" onClick={() => router.push(`${BASE}/plugins`)} active={pathname === `${BASE}/plugins`} />
            <NavRow icon={<ClockCircleLinear size={18} />} label="自动化" onClick={() => router.push(`${BASE}/automations`)} active={pathname === `${BASE}/automations`} />
          </nav>
          <div className="mt-5 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-2 pb-4">
            <section className="flex flex-col gap-0.5">
              <SectionLabel>项目</SectionLabel>
              {PROJECTS.map((project) => {
                const projectPath = `${BASE}/projects/${project.id}`;
                return (
                  <div key={project.id} className="flex flex-col gap-0.5">
                    <div className={cn("group flex h-9 items-center rounded-xl pr-1 transition-colors hover:bg-fg-grey-100", pathname === projectPath && "bg-fg-grey-200/70")}>
                      <Button variant="unstyled" type="button" onClick={() => router.push(projectPath)} className="flex h-full min-w-0 flex-1 items-center gap-2.5 px-2.5 text-left text-sm">
                        <FolderLinear size={18} className="shrink-0 text-fg-grey-700" />
                        <span className={cn("truncate", pathname === projectPath && "font-medium")}>{project.name}</span>
                      </Button>
                      <Button variant="unstyled"
                        type="button"
                        aria-label={expanded[project.id] ? `收起${project.name}` : `展开${project.name}`}
                        onClick={() => setExpanded((previous) => ({ ...previous, [project.id]: !previous[project.id] }))}
                        className="flex size-7 items-center justify-center rounded-lg text-fg-grey-700 hover:bg-fg-grey-200"
                      >
                        {expanded[project.id] ? <AltArrowDownLinear size={14} /> : <AltArrowRightLinear size={14} />}
                      </Button>
                    </div>
                    {expanded[project.id] &&
                      project.threadIds.map((id) => {
                        const thread = THREADS.find((item) => item.id === id)!;
                        return <ThreadRow key={id} title={thread.title} active={id === activeThread} indent onClick={() => router.push(`${BASE}?thread=${id}`)} />;
                      })}
                  </div>
                );
              })}
            </section>
            <section className="flex flex-col gap-0.5">
              <SectionLabel>对话</SectionLabel>
              {THREADS.filter((thread) => !thread.projectId).map((thread) => (
                <ThreadRow key={thread.id} title={thread.title} active={thread.id === activeThread} onClick={() => router.push(`${BASE}?thread=${thread.id}`)} />
              ))}
            </section>
          </div>
          <ProfileMenu onOpenSettings={() => setSettingsOpen(true)} />
        </aside>
      )}

      <main className={cn("flex min-w-0 flex-1 overflow-hidden bg-background", sidebarOpen && "my-2 mr-2 rounded-2xl border border-fg-grey-200")}>
        <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>{children}</SidebarContext.Provider>
      </main>

      <Modal open={searchOpen} onOpenChange={setSearchOpen} title="搜索">
        <CommandSearch
          color="black"
          autoFocus
          query={search}
          onQueryChange={setSearch}
          placeholder="搜索对话、项目或插件"
          emptyLabel="没有找到匹配的内容"
          items={[
            ...THREADS.map((thread) => ({ id: `thread:${thread.id}`, label: thread.title, group: "对话", hint: thread.updated, icon: <ChatRoundLineLinear size={16} /> })),
            ...PROJECTS.map((project) => ({ id: `project:${project.id}`, label: project.name, group: "项目", icon: <FolderLinear size={16} /> })),
            { id: "page:plugins", label: "插件", group: "页面", icon: <WidgetLinear size={16} /> },
            { id: "page:automations", label: "自动化", group: "页面", icon: <ClockCircleLinear size={16} /> },
          ]}
          onSelect={(item) => {
            const [kind, id] = item.id.split(":");
            setSearchOpen(false);
            setSearch("");
            if (kind === "thread") router.push(`${BASE}?thread=${id}`);
            if (kind === "project") router.push(`${BASE}/projects/${id}`);
            if (kind === "page") router.push(`${BASE}/${id}`);
          }}
        />
      </Modal>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

function ProfileMenu({ onOpenSettings }: { onOpenSettings: () => void }) {
  const [open, setOpen] = useState(false);
  const items: Array<{ label: string; icon: ReactNode; hint?: string; danger?: boolean; onSelect?: () => void }> = [
    { label: "个人资料", icon: <PenBold size={20} />, onSelect: onOpenSettings },
    { label: "设置", icon: <SettingsBold size={20} />, hint: "⌘,", onSelect: onOpenSettings },
    { label: "套餐与用量", icon: <CrownBold size={20} />, hint: "68%" },
    { label: "邀请成员", icon: <UserPlusBold size={20} /> },
    { label: "退出登录", icon: <Logout2Bold size={20} />, danger: true },
  ];
  return (
    <div className="px-3 pb-3">
      <Popover
        open={open}
        onOpenChange={setOpen}
        side="top"
        align="start"
        sideOffset={8}
        width="w-(--anchor-width)"
        className="rounded-2xl p-3"
        trigger={
          <Button variant="unstyled"
            type="button"
            aria-label="打开林晓的个人菜单"
            className={cn(
              "flex w-full items-center gap-3 overflow-hidden rounded-xl p-4 text-left transition-colors",
              open ? "bg-fg-black text-white" : "bg-fg-grey-50 outline outline-1 -outline-offset-1 outline-fg-grey-200",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/protask/crm/john-hoegan-avatar.png" alt="林晓" className="size-10 shrink-0 rounded-full object-cover" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className={cn("line-clamp-1 text-sm font-medium leading-5 tracking-fg", open ? "text-white" : "text-fg-black")}>林晓</span>
              <span className={cn("line-clamp-1 text-xs font-medium leading-4.5 tracking-fg", open ? "text-white/70" : "text-fg-grey-700")}>团队版 · 比特林克</span>
            </div>
            <AltArrowDownLinear size={20} className={cn("shrink-0 transition-transform", open ? "rotate-180 text-white" : "text-fg-grey-700")} />
          </Button>
        }
      >
        {(close) => (
          <div className="flex flex-col gap-1" role="menu" aria-label="个人菜单">
            {items.map((item) => (
              <Button variant="unstyled"
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  close();
                  item.onSelect?.();
                }}
                className={cn("flex w-full items-center gap-2 rounded-full px-3.5 py-3 text-left transition-colors hover:bg-fg-grey-100", item.danger ? "text-fg-red" : "text-fg-grey-700")}
              >
                <span className="flex size-6 items-center justify-center">{item.icon}</span>
                <span className="line-clamp-1 flex-1 text-sm font-medium leading-5 tracking-fg">{item.label}</span>
                {item.hint && <span className="text-xs text-fg-grey-500">{item.hint}</span>}
              </Button>
            ))}
          </div>
        )}
      </Popover>
    </div>
  );
}

const SETTINGS_TABS = ["通用", "个性化", "数据", "账户"];

function SettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [tab, setTab] = useState(0);
  const [theme, setTheme] = useState("跟随系统");
  const [prefs, setPrefs] = useState({ enterToSend: true, showReasoning: true, memory: true, history: true, training: false });
  const [about, setAbout] = useState("我负责比特林克的官网和数据集控制台前端，用 Next.js 和 Forge UI。回答请用简体中文，代码注释用英文。");
  const toggle = (key: keyof typeof prefs) => setPrefs((previous) => ({ ...previous, [key]: !previous[key] }));

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="设置" width="w-[640px]">
      <div className="flex flex-col gap-5">
        <TabBar tabs={SETTINGS_TABS.map((label, index) => ({ label, active: index === tab }))} color="black" onChange={setTab} />
        {tab === 0 && (
          <div className="flex flex-col">
            <SettingRow title="外观" description="浅色、深色或跟随系统">
              <div className="flex gap-1 rounded-xl bg-fg-grey-100 p-1">
                {["浅色", "深色", "跟随系统"].map((option) => (
                  <Button variant="unstyled" key={option} type="button" onClick={() => setTheme(option)} className={cn("h-8 rounded-lg px-3 text-sm", option === theme ? "bg-background font-medium shadow-[0_1px_2px_rgba(0,0,0,0.06)]" : "text-fg-grey-700")}>
                    {option}
                  </Button>
                ))}
              </div>
            </SettingRow>
            <SettingRow title="回车发送" description="关闭后用 ⌘ + 回车发送">
              <Toggle checked={prefs.enterToSend} onChange={() => toggle("enterToSend")} ariaLabel="回车发送" />
            </SettingRow>
            <SettingRow title="显示思考过程" description="回复前先展开思考步骤">
              <Toggle checked={prefs.showReasoning} onChange={() => toggle("showReasoning")} ariaLabel="显示思考过程" />
            </SettingRow>
          </div>
        )}
        {tab === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <TextArea label="关于你" value={about} onChange={setAbout} rows={4} />
              <span className="text-xs text-fg-grey-700">每个新对话都会带上这段说明</span>
            </div>
            <SettingRow title="记忆" description="让助手记住对话里提到的偏好">
              <Toggle checked={prefs.memory} onChange={() => toggle("memory")} ariaLabel="记忆" />
            </SettingRow>
          </div>
        )}
        {tab === 2 && (
          <div className="flex flex-col">
            <SettingRow title="保存对话记录" description="关闭后新对话不会出现在侧栏">
              <Toggle checked={prefs.history} onChange={() => toggle("history")} ariaLabel="保存对话记录" />
            </SettingRow>
            <SettingRow title="用于改进模型" description="团队版默认关闭，你的数据不会用于训练">
              <Toggle checked={prefs.training} onChange={() => toggle("training")} ariaLabel="用于改进模型" />
            </SettingRow>
            <SettingRow title="导出数据" description="打包所有对话和文件，完成后发到邮箱">
              <Button size="sm" variant="tertiary" color="grey">导出</Button>
            </SettingRow>
          </div>
        )}
        {tab === 3 && (
          <div className="flex flex-col">
            <SettingRow title="林晓" description="linxiao@bitilinks.cn">
              <Avatar src="/images/protask/crm/john-hoegan-avatar.png" alt="林晓" size="md" />
            </SettingRow>
            <SettingRow title="套餐" description="团队版 · 30 个席位，下次续费 2027-03-01">
              <Button size="sm" variant="tertiary" color="grey">管理</Button>
            </SettingRow>
            <SettingRow title="删除账户" description="删除后对话、项目和文件都无法恢复">
              <Button size="sm" variant="tertiary" color="red">删除</Button>
            </SettingRow>
          </div>
        )}
      </div>
    </Modal>
  );
}

function SettingRow({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-fg-grey-100 py-4 last:border-b-0">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-fg-grey-700">{description}</span>
      </div>
      {children}
    </div>
  );
}

export function IconAction({ label, active, onClick, children }: { label: string; active?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Button variant="unstyled"
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn("flex size-8 items-center justify-center rounded-lg text-fg-grey-700 transition-colors hover:bg-fg-grey-100 hover:text-fg-black", active && "text-fg-black")}
    >
      {children}
    </Button>
  );
}

function NavRow({ icon, label, hint, active, onClick }: { icon: ReactNode; label: string; hint?: string; active?: boolean; onClick: () => void }) {
  return (
    <Button variant="unstyled" type="button" onClick={onClick} className={cn("flex h-9 items-center gap-2.5 rounded-xl px-2.5 text-sm text-fg-black transition-colors hover:bg-fg-grey-100", active && "bg-fg-grey-200/70 font-medium")}>
      <span className="text-fg-grey-700">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {hint && <span className="text-xs text-fg-grey-700">{hint}</span>}
    </Button>
  );
}

function ThreadRow({ title, active, indent, onClick }: { title: string; active: boolean; indent?: boolean; onClick: () => void }) {
  return (
    <Button variant="unstyled"
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn("flex h-9 items-center rounded-xl pr-2.5 text-left text-sm transition-colors", indent ? "pl-9" : "pl-2.5", active ? "bg-fg-grey-200/70 font-medium text-fg-black" : "text-fg-grey-900 hover:bg-fg-grey-100")}
    >
      <span className="truncate">{title}</span>
    </Button>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <span className="px-2.5 pb-1 text-xs text-fg-grey-700">{children}</span>;
}

export function PageFrame({ title, description, action, children }: { title: string; description?: string; action?: ReactNode; children: ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-8 pb-12 pt-6">
        <header className="flex items-start gap-3">
          {!sidebarOpen && (
            <IconAction label="展开侧栏" onClick={() => setSidebarOpen(true)}>
              <SidebarMinimalisticLinear size={18} />
            </IconAction>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-fg">{title}</h1>
            {description && <p className="text-sm text-fg-grey-700">{description}</p>}
          </div>
          {action}
        </header>
        {children}
      </div>
    </div>
  );
}
