"use client";

import { useState } from "react";
import { AppLayout, AppSwitcherDropdown, Button, ConfirmationDialog, Drawer, KebabMenu, Modal, PageHeader, TextField, type MotionPreference } from "@forge-ui-official/core";

const AVATAR = "/images/protask/crm/john-hoegan-avatar.png";

export default function ShellPopoverAcceptancePage() {
  const [position, setPosition] = useState<"topbar" | "sidebar">("topbar");
  const [teamMode, setTeamMode] = useState(false);
  const [count, setCount] = useState(2);
  const [selected, setSelected] = useState("app-0");
  const [motion, setMotion] = useState<MotionPreference>("none");
  const [search, setSearch] = useState("");
  const [event, setEvent] = useState("尚未操作");
  const [calls, setCalls] = useState(0);
  const [parent, setParent] = useState(false);
  const [child, setChild] = useState(false);
  const [sibling, setSibling] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [draft, setDraft] = useState("");
  const [content, setContent] = useState("normal");
  const [standalone, setStandalone] = useState(false);
  const [corner, setCorner] = useState("flow");
  const [transformed, setTransformed] = useState(false);
  const apps = Array.from({ length: count }, (_, i) => ({ id: `app-${i}`, name: `验收应用 ${i + 1} · 中文业务名称`, avatar: AVATAR, active: selected === `app-${i}` }));
  const record = (label: string) => { setCalls(n => n + 1); setEvent(label); };
  const items = Array.from({ length: count }, (_, i) => ({ label: `本地操作 ${i + 1}`, onSelect: () => record(`本地操作 ${i + 1}`) }));
  const title = (content === "chinese" || content === "combined") ? "需要保留完整阅读的业务弹窗标题".repeat(12) : content === "word" ? "UnbrokenBusinessTitle".repeat(20) : "父层业务弹窗";
  const controlClass = "min-w-0 rounded-lg border border-fg-grey-200 bg-fg-white px-3 py-2 text-sm text-fg-black";

  return <AppLayout motion={motion} mode="light" accent="blue" profilePosition={position}
    {...(teamMode ? { teamName: "验收团队", teams: apps, showTeamActions: true } : { appName: "验收工作空间", apps })}
    teamAvatar={AVATAR} appIcon={AVATAR} teamMemberCount={20}
    onAppChange={app => { setSelected(app.id); record(`选择应用 ${app.id}`); }}
    profile={{ avatar: AVATAR, name: "验收成员", role: "本地测试" }} notifications={3} messages={2}
    pageTitle="外壳与弹层验收" showDatePicker={false} showFavorite={false} showKebab={false}
    menuItems={[{ label: "本地验收", href: "/prototype/shell-popover-acceptance" }]}>
    <div className="min-w-0 space-y-6" data-testid="acceptance-root">
      <style>{`.batch1-transform-dialog { transform: translate(12px, 8px) scale(.96) !important; }`}</style>
      <header><h1 className="text-xl font-semibold text-fg-black">后台外壳与弹层 · 第一批验收</h1><p className="mt-2 text-sm text-fg-grey-700">仅使用本地测试数据。操作只记录结果，不连接真实业务。</p></header>
      <section aria-label="验收配置" className="flex flex-wrap gap-3">
        <label>入口位置 <select aria-label="入口位置" className={controlClass} value={position} onChange={e => setPosition(e.target.value as typeof position)}><option value="topbar">顶栏</option><option value="sidebar">侧栏</option></select></label>
        <label>入口类型 <select aria-label="入口类型" className={controlClass} value={teamMode ? "team" : "app"} onChange={e => setTeamMode(e.target.value === "team")}><option value="app">应用</option><option value="team">团队及操作区</option></select></label>
        <label>数据数量 <select aria-label="数据数量" className={controlClass} value={count} onChange={e => setCount(Number(e.target.value))}><option value={2}>2项</option><option value={20}>20项</option></select></label>
        <label>动效 <select aria-label="动效" className={controlClass} value={motion} onChange={e => setMotion(e.target.value as MotionPreference)}><option value="none">无动效</option><option value="auto">自动</option></select></label>
        <label>菜单位置 <select aria-label="菜单位置" className={controlClass} value={corner} onChange={e => setCorner(e.target.value)}><option value="flow">正文</option><option value="top-left">左上</option><option value="top-right">右上</option><option value="bottom-left">左下</option><option value="bottom-right">右下</option></select></label>
        <label>弹窗内容 <select aria-label="弹窗内容" className={controlClass} value={content} onChange={e => setContent(e.target.value)}><option value="normal">普通内容</option><option value="chinese">长中文标题</option><option value="word">连续英文标题</option><option value="code">宽代码</option><option value="body">30段正文</option><option value="footer">长页脚</option><option value="combined">长标题、代码、正文与页脚组合</option></select></label>
      </section>
      <p role="status" aria-label="本地操作记录" data-testid="local-result" className="break-words text-sm text-fg-grey-700">回调 {calls} 次：{event}</p>
      <section aria-label="独立搜索头部" className="min-w-0 border border-fg-grey-200 rounded-xl">
        <PageHeader variant="search" searchPlaceholder="搜索本地业务内容与中文名称" onSearch={setSearch}
          showCalendar onCalendarClick={() => record("独立日历")} notifications={3} onNotificationsClick={() => record("独立通知")}
          messages={2} onMessagesClick={() => record("独立消息")} onLanguageClick={() => record("独立语言")}
          showAddButton onAddClick={() => record("独立新增")} showProfile profile={{ avatar: AVATAR, name: "验收成员", role: "本地" }} onProfileClick={() => record("独立个人菜单")} />
        <p className="p-3 text-sm text-fg-grey-700" data-testid="search-result">搜索回写：{search || "空"}</p>
      </section>
      <section aria-label="弹层入口" className="flex flex-wrap items-center gap-3">
        <Button motion={motion} onClick={() => setParent(true)}>打开父层弹窗</Button>
        <Button motion={motion} variant="secondary" onClick={() => setDrawer(true)}>打开抽屉</Button>
        <Button motion={motion} variant="secondary" onClick={() => setConfirmation(true)}>打开受控确认</Button>
        <Button motion={motion} variant="secondary" onClick={() => setStandalone(v => !v)}>独立应用包装</Button>
        <div aria-label="页面菜单"><KebabMenu motion={motion} items={items} /></div>
      </section>
      {standalone && <section aria-label="独立应用包装" className="fixed left-4 top-4 z-40"><AppSwitcherDropdown appName="独立验收应用" appIcon={AVATAR} apps={apps} onAppChange={app => { setSelected(app.id); record(`包装选择 ${app.id}`); }} /><button type="button" aria-label="关闭独立应用包装" className="absolute right-2 top-2 rounded-lg bg-fg-white p-2 text-sm text-fg-black" onClick={() => setStandalone(false)}>关闭</button></section>}
      <Modal open={parent} onOpenChange={setParent} motion={motion} title={title} className={transformed ? "batch1-transform-dialog" : undefined}
        footer={<><Button motion={motion} variant="secondary" onClick={() => setParent(false)}>关闭父层页脚</Button><Button motion={motion} onClick={() => record("父层本地保存")}>{(content === "footer" || content === "combined") ? "保存并返回当前业务工作空间继续处理全部相关任务".repeat(4) : "本地保存"}</Button></>}>
        <div className="space-y-4 min-w-0">
          <label>弹窗内数据数量 <select aria-label="弹窗内数据数量" className={controlClass} value={count} onChange={e => setCount(Number(e.target.value))}><option value={2}>2项</option><option value={20}>20项</option></select></label>
          <label>定位对照 <select aria-label="弹窗定位对照" className={controlClass} value={transformed ? "transformed" : "normal"} onChange={e => setTransformed(e.target.value === "transformed")}><option value="normal">常规</option><option value="transformed">平移与缩放</option></select></label>
          <TextField label="父层草稿" value={draft} onChange={setDraft} />
          <div className="flex flex-wrap gap-3"><Button motion={motion} onClick={() => setChild(true)}>打开嵌套子层</Button><Button motion={motion} onClick={() => setSibling(true)}>打开同级子层</Button><div aria-label="弹窗内菜单"><KebabMenu motion={motion} items={[...items, { label: "从菜单打开子层", onSelect: () => { record("菜单打开子层"); setChild(true); } }]} /></div></div>
          {corner !== "flow" && <div aria-label="边角菜单" style={{ position: "fixed", zIndex: 1, ...(corner.startsWith("top") ? { top: 48 } : { bottom: 8 }), ...(corner.endsWith("left") ? { left: 8 } : { right: 8 }) }}><KebabMenu motion={motion} items={items} /></div>}
          {(content === "code" || content === "combined") && <pre tabIndex={0} aria-label="正文局部横滚代码" className="max-w-full overflow-x-auto rounded-lg bg-fg-grey-50 p-3 text-sm">{"const businessIdentifier = '" + "WideBusinessContent".repeat(80) + "';"}</pre>}
          {((content === "body" || content === "combined") ? Array.from({ length: 30 }, (_, i) => i + 1) : [1]).map(i => <p key={i} className="text-sm leading-6 text-fg-grey-700">正文第 {i} 段：保留完整内容与当前草稿，关闭子层后应继续停留在父层。</p>)}
          <Modal open={child} onOpenChange={setChild} motion={motion} title="嵌套子层" footer={<Button motion={motion} onClick={() => setChild(false)}>关闭子层页脚</Button>}><Button motion={motion} onClick={() => record("子层本地操作")}>子层本地操作</Button></Modal>
        </div>
      </Modal>
      <Modal open={sibling} onOpenChange={setSibling} motion={motion} title="同级子层" footer={<Button motion={motion} onClick={() => setSibling(false)}>关闭同级子层页脚</Button>}><p className="text-sm">关闭后返回父层入口。</p></Modal>
      <Drawer open={drawer} onOpenChange={setDrawer} motion={motion} title="共享行为回归抽屉" footer={<Button motion={motion} onClick={() => setDrawer(false)}>关闭抽屉页脚</Button>}><p>仅验证原有打开、键盘及关闭路径。</p></Drawer>
      <ConfirmationDialog open={confirmation} onOpenChange={setConfirmation} motion={motion} color="blue" title="确认本地操作？" description="不会删除或发送任何真实数据。" confirmLabel="确认本地记录" onConfirm={() => { record("受控确认"); setConfirmation(false); }} onCancel={() => record("受控取消")} />
      <div className="h-96" aria-hidden="true" />
    </div>
  </AppLayout>;
}
