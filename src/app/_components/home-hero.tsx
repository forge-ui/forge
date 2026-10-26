"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AddMember,
  Avatar,
  AvatarGroup,
  Button,
  ButtonGroup,
  ChatInputBar,
  Checkbox,
  CheckboxWithLabel,
  ColorPicker,
  Datepicker,
  LiquidTabs,
  Modal,
  OtpInput,
  ProgressBar,
  RadioWithLabel,
  SelectOption,
  TextField,
  ToastProvider,
  Toggle,
  useToast,
  type ChatInputBarQuickAction,
  type ProgressColor,
} from "@forge-ui-official/core";

const quickCards: ChatInputBarQuickAction[] = [
  { id: "image", label: "创建图片", kind: "image", placeholder: "描述你想创建的图片…" },
  { id: "note", label: "写笔记", kind: "note", placeholder: "写下想记录的内容…" },
  { id: "event", label: "安排日程", kind: "event", placeholder: "什么活动，什么时候？" },
  { id: "voice", label: "语音输入", kind: "voice", placeholder: "输入要转写的内容…" },
  { id: "docs", label: "分析文档", kind: "docs", placeholder: "上传文档，或者提一个问题…" },
];

const portraits = {
  alex: "/avatars/v9-01.jpg",
  mia: "/avatars/v9-02.jpg",
  lin: "/avatars/v9-03.jpg",
  noah: "/avatars/v9-04.jpg",
  su: "/avatars/v9-05.jpg",
  forge: "/avatars/v9-06.jpg",
} as const;

const members = [
  { id: "alex", name: "Alex Chen", role: "Design", avatar: portraits.alex, status: "online" as const },
  { id: "mia", name: "Mia Wang", role: "Engineering", avatar: portraits.mia, status: "online" as const },
  { id: "lin", name: "Lin Zhao", role: "Product", avatar: portraits.lin, status: "idle" as const },
  { id: "noah", name: "Noah Li", role: "Research", avatar: portraits.noah, status: "offline" as const },
];

const swatches = [
  { token: "bg-fg-blue", hex: "#3553FF", name: "Blue" },
  { token: "bg-fg-violet", hex: "#7239EA", name: "Violet" },
  { token: "bg-fg-green-500", hex: "#09B96D", name: "Green" },
  { token: "bg-fg-yellow", hex: "#F6C002", name: "Yellow" },
  { token: "bg-fg-red", hex: "#FE4A23", name: "Red" },
];

const roles = [
  { value: "design", label: "设计" },
  { value: "eng", label: "工程" },
  { value: "pm", label: "产品" },
];

const ranges = [{ label: "1D" }, { label: "7D" }, { label: "1M" }, { label: "1Y" }, { label: "All" }];

const launchDate = new Date(2026, 9, 26);

type Todo = { id: string; label: string; done: boolean };

const initialTodos: Todo[] = [
  { id: "avatar", label: "核对头像", done: true },
  { id: "form", label: "补齐表单", done: false },
  { id: "composer", label: "接上输入栏", done: false },
  { id: "modal", label: "打开欢迎弹窗", done: false },
  { id: "toast", label: "发出一条反馈", done: false },
];

function todoBand(percent: number): ProgressColor {
  if (percent <= 33) return "yellow";
  if (percent <= 66) return "blue";
  return "green";
}

function HomeWorkbench({ version, notesHref }: { version: string; notesHref: string }) {
  const { toast } = useToast();
  const [email, setEmail] = useState("hi@example.com");
  const [tags, setTags] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]);
  const [tagDraft, setTagDraft] = useState("");
  const [role, setRole] = useState("design");
  const [subscribed, setSubscribed] = useState(true);
  const [density, setDensity] = useState<"regular" | "compact">("regular");
  const [notify, setNotify] = useState(true);
  const [colorIndex, setColorIndex] = useState(0);
  const [date, setDate] = useState(launchDate);
  const [welcome, setWelcome] = useState(false);
  const [range, setRange] = useState(1);
  const [model, setModel] = useState("fast");
  const [todos, setTodos] = useState(initialTodos);

  const doneCount = todos.filter((item) => item.done).length;
  const percent = Math.round((doneCount / todos.length) * 100);
  const band = todoBand(percent);
  const swatch = swatches[colorIndex] ?? swatches[0];

  function toggleTodo(id: string) {
    setTodos((current) => current.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  }

  function addTag() {
    const label = tagDraft.trim();
    if (!label) return;
    const value = label.toLocaleLowerCase();
    setTags((current) => (current.some((tag) => tag.value === value) ? current : [...current, { label, value }]));
    setTagDraft("");
  }

  function sendToast(description: string) {
    toast({ title: "消息已发送", description, status: "success" });
  }

  return (
    <>
      <h1 className="sr-only">Forge 全宽工作台</h1>
      <div className="home-bento">
        <section className="home-card home-form" aria-label="表单">
          <p className="home-card-title">表单</p>
          <TextField
            className="home-field"
            color="blue"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="hi@example.com"
            aria-label="邮箱"
          />
          <TextField
            className="home-field"
            color="blue"
            tags={tags}
            value={tagDraft}
            onChange={setTagDraft}
            onRemoveTag={(value) => setTags((current) => current.filter((tag) => tag.value !== value))}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTag();
              }
            }}
            placeholder="Add tag…"
            aria-label="标签"
          />
          <SelectOption
            className="home-select"
            color="blue"
            width="100%"
            placeholder="选择角色"
            options={roles}
            value={role}
            onChange={setRole}
          />
          <div className="home-controls">
            <CheckboxWithLabel color="blue" label="订阅" checked={subscribed} onChange={setSubscribed} />
            <div className="home-radios" role="radiogroup" aria-label="密度">
              <RadioWithLabel color="blue" label="常规" checked={density === "regular"} onChange={() => setDensity("regular")} />
              <RadioWithLabel color="blue" label="紧凑" checked={density === "compact"} onChange={() => setDensity("compact")} />
            </div>
            <span className="home-switch">
              <Toggle color="blue" size="sm" checked={notify} onChange={setNotify} ariaLabel="通知" />
              <span>通知</span>
            </span>
          </div>
          <div className="home-color-row">
            <ColorPicker
              colors={swatches.map((item) => item.token)}
              selectedIndex={colorIndex}
              onChange={setColorIndex}
            />
            <span className="home-hex">{swatch.hex}</span>
          </div>
        </section>

        <section className="home-card home-verify" aria-label="验证账号">
          <div className="home-verify-head">
            <AvatarGroup overflowCount={6}>
              <Avatar src={portraits.alex} alt="Alex Chen" size="sm" />
              <Avatar src={portraits.mia} alt="Mia Wang" size="sm" />
              <Avatar src={portraits.lin} alt="Lin Zhao" size="sm" />
              <Avatar src={portraits.su} alt="苏敏" size="sm" />
            </AvatarGroup>
            <div>
              <p className="home-card-title">验证账号</p>
              <p className="home-card-note">输入验证码完成校验</p>
            </div>
          </div>
          <OtpInput
            className="home-otp"
            length={4}
            locale="zh"
            autoFocus={false}
            hint="输入验证码"
            onComplete={(code) => sendToast(`验证码 ${code}`)}
          />
        </section>

        <section className="home-card home-actions" aria-label="操作">
          <div className="home-buttons">
            <Button color="blue" size="sm" motion="auto">Primary</Button>
            <Button color="red" size="sm" motion="auto">Danger</Button>
            <Button color="grey" variant="tertiary" size="sm" motion="auto">Outlined</Button>
            <Button color="blue" variant="secondary" size="sm" motion="auto">Round</Button>
            <Button color="blue" size="sm" motion="auto" onClick={() => sendToast("Forge Toast 反馈示例")}>消息反馈</Button>
          </div>
          <Datepicker className="home-date" color="blue" locale="zh" value={date} onChange={setDate} />
        </section>

        <section className="home-card home-account" aria-label="创建账号">
          <div className="home-account-mark" aria-hidden="true">F</div>
          <p className="home-card-title">创建账号</p>
          <p className="home-card-note">全宽工作台，真组件可点</p>
          <Button color="blue" size="sm" motion="auto" className="home-start" onClick={() => setWelcome(true)}>
            开始使用
          </Button>
          <Link href={notesHref} className="home-notes">Forge {version} 更新说明</Link>
        </section>

        <div className="home-members">
          <AddMember
            accent="blue"
            defaultOpen
            rows={2}
            members={members}
            labels={{ title: "添加成员", search: "搜索成员" }}
            onAdd={() => new Promise((resolve) => window.setTimeout(resolve, 360))}
          />
        </div>

        <div className="home-mid">
          <LiquidTabs
            className="home-liquid"
            rows={3}
            visibleCount={2}
            corner={18}
            label="动态"
            tabs={[
              {
                id: "tips",
                label: "Tips",
                items: [
                  { id: "wide", title: "全宽工作台", subtitle: "组件铺满一屏", time: "刚刚" },
                  { id: "forms", title: "表单更全", subtitle: "输入、选择、开关", time: "今天" },
                  { id: "faces", title: "精致头像", subtitle: "肖像直接放进组件", time: "今天" },
                ],
              },
              {
                id: "updates",
                label: "Updates",
                items: [
                  { id: "todo", title: "今日待办", subtitle: "进度黄、蓝、绿", time: "今天" },
                  { id: "chat", title: "消息输入栏", subtitle: "快捷卡与模型", time: "今天" },
                  { id: "hello", title: "欢迎弹窗", subtitle: "开始使用即可打开", time: "今天" },
                ],
              },
            ]}
          />
          <section className="home-card home-profile" aria-label="Forge Design">
            <div className="home-profile-id">
              <Avatar src={portraits.forge} alt="Forge Design" size="md" />
              <div>
                <p className="home-profile-name">Forge Design</p>
                <p className="home-profile-handle">@forge-ui</p>
              </div>
            </div>
            <ButtonGroup
              ariaLabel="时间范围"
              color="blue"
              shape="pill"
              items={ranges}
              activeIndex={range}
              onChange={setRange}
              motion="auto"
            />
          </section>
        </div>

        <section className="home-card home-todo" aria-label="今日待办" data-todo-band={band} data-todo-percent={percent}>
          <ProgressBar value={percent} color={band} size="sm" label="今日待办" showPercentage motion="auto" />
          <ul className="home-todo-list">
            {todos.map((item) => (
              <li key={item.id} className={item.done ? "is-done" : `is-${band}`}>
                <span className={item.done ? "home-check is-done" : "home-check"}>
                  <Checkbox
                    checked={item.done}
                    color={item.done ? "green" : "blue"}
                    motion="auto"
                    aria-label={item.label}
                    onChange={() => toggleTodo(item.id)}
                  />
                </span>
                <span className="home-todo-label">{item.label}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="home-dock">
        <ChatInputBar
          className="home-composer"
          locale="zh"
          motion="auto"
          color="blue"
          placeholder="输入消息…"
          quickActions={quickCards}
          quickActionsLabel="快捷卡片"
          defaultQuickActionsOpen
          hasMessages={false}
          showAttachment={false}
          models={[
            { id: "fast", label: "Forge 快速模型" },
            { id: "balanced", label: "Forge 均衡模型" },
          ]}
          model={model}
          onModelChange={setModel}
          modelMenuLabel="模型"
          onSend={(message) => sendToast(message || "Forge Toast 反馈示例")}
        />
      </div>

      <Modal
        open={welcome}
        onOpenChange={setWelcome}
        title="欢迎使用 Forge"
        motion="auto"
        footer={
          <>
            <Button color="grey" variant="secondary" size="sm" motion="auto" onClick={() => setWelcome(false)}>取消</Button>
            <Button color="blue" size="sm" motion="auto" onClick={() => setWelcome(false)}>确定</Button>
          </>
        }
      >
        <p className="home-modal-copy">这是 Modal 真组件。生产首页把 Forge 组件铺满全宽工作台，并接入精致头像与消息输入栏。</p>
      </Modal>
    </>
  );
}

export function HomeHero({ version, notesHref }: { version: string; notesHref: string }) {
  return (
    <ToastProvider locale="zh" motion="auto">
      <section className="home-hero" id="home-hero" data-home-screen>
        <div className="home-hero-glow" aria-hidden="true" />
        <HomeWorkbench version={version} notesHref={notesHref} />
      </section>
    </ToastProvider>
  );
}
