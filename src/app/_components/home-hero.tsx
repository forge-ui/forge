"use client";

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const templateLoading = () => <p className="home-template-loading" role="status">正在加载模板…</p>;
const OverviewExample = dynamic(() => import("../templates/(dashboards)/dashboards/ecommerce-2/page"), { loading: templateLoading });
const FinanceExample = dynamic(() => import("../templates/(dashboards)/dashboards/finance-1/page"), { loading: templateLoading });
const AgentExample = dynamic(() => import("../templates/agent/page"), { loading: templateLoading });
const BoardExample = dynamic(() => import("../templates/task-board/page"), { loading: templateLoading });
import {
  Avatar, AvatarGroup, Button, ButtonGroup, Checkbox, RadioButton, TabBar, TextField, SelectOption, Toggle,
  CalendarCard, RatingStars, OtpInput, FileCard, Modal, NotificationItem, Stepper, ConfirmationDialog,
  ProgressBar,
  ChatInputBar,
  type ChatInputBarQuickAction,
} from "@forge-ui-official/core";
function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="home-panel">
      {title ? <p className="home-panel-title">{title}</p> : null}
      <div className="home-panel-body">{children}</div>
    </section>
  );
}

function CalendarPanel() {
  return (
    <Panel>
      <CalendarCard color="blue" size="compact" variant="plain" motion="auto" className="max-w-full" />
    </Panel>
  );
}

function FormSamples() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("designer");
  const [enabled, setEnabled] = useState(true);
  const [rating, setRating] = useState(4);
  return <div className="home-form-samples">
    <TextField label="工作邮箱" type="email" placeholder="you@company.com" value={email} onChange={setEmail} color="blue" />
    <div className="home-form-detail-grid">
    <div className="home-form-role"><SelectOption className="w-full" label="团队角色" options={[{ value: "designer", label: "设计师" }, { value: "developer", label: "开发者" }, { value: "manager", label: "项目经理" }]} value={role} onChange={value => setRole(String(value))} color="blue" /></div>
    <div className="home-form-ring"><ProgressBar variant="ring" value={72} color="purple" label="完成度" showPercentage /></div>
    <div className="home-control-row"><span>接收项目通知</span><Toggle color="purple" checked={enabled} onChange={setEnabled} ariaLabel="接收项目通知" /></div>
    <ChoiceSamples />
    <RatingStars value={rating} onChange={setRating} size="sm" showValue={false} ariaLabel="体验评分" />
    </div>
  </div>;
}

function Wall() {
  return <div className="home-wall">
    <div className="home-col home-col-controls">
      <FormSamples />
      <SelectionSamples />
      <Panel><OtpInput defaultValue="432" hint="输入六位验证码" /></Panel>
      <ButtonSamples />
      <StatusSamples />
    </div>
    <div className="home-col home-col-main">
      <AiComposerSample />
      <FeedbackSamples />
      <InteractionSamples />

    </div>
    <div className="home-col home-col-calendar">
      <div className="home-people"><AvatarGroup overflowCount={3}><Avatar initials="林" color="blue" size="lg" /><Avatar initials="陈" color="purple" size="lg" /><Avatar initials="周" color="cyan" size="lg" /><Avatar initials="许" color="orange" size="lg" /></AvatarGroup></div>
      <CalendarPanel />
      <StepsSample />
      <FileSamples />
    </div>
  </div>;
}

function InteractionSamples() {
  const [deleted, setDeleted] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [notice, setNotice] = useState("");
  return <>
    <Panel title="长按确认"><Button variant="hold" color="red" locale="zh" confirmed={deleted} onConfirm={() => setDeleted(true)} onUndo={() => setDeleted(false)}>长按删除</Button><p className="home-composer-feedback" role="status">{deleted ? "示例已删除，可点击撤销" : "按住完成操作，提前松开即可取消"}</p></Panel>
    <Panel title="弹窗交互"><div className="home-interaction-actions"><Button color="blue" onClick={() => setOpen(true)}>打开弹窗</Button><Button color="black" variant="tertiary" onClick={() => setConfirm(true)}>确认操作</Button></div><p className="home-composer-feedback" role="status">{notice || "点击体验弹窗、关闭与确认反馈"}</p></Panel>
    <Modal open={open} onOpenChange={setOpen} title="邀请团队成员" footer={<><Button color="black" variant="tertiary" onClick={() => setOpen(false)}>取消</Button><Button color="blue" onClick={() => { setOpen(false); setNotice("示例邀请已确认"); }}>确认邀请</Button></>}><p>邀请同事一起查看项目、分享反馈与推进工作。</p></Modal>
    <ConfirmationDialog open={confirm} onOpenChange={setConfirm} title="确认归档示例？" description="这是当前页面的交互演示。" color="blue" confirmLabel="确认归档" onConfirm={() => { setConfirm(false); setNotice("示例已归档"); }} onCancel={() => setConfirm(false)} />
  </>;
}

function FileSamples() {
  return <div className="home-file-samples">
    <FileCard color="purple" file={{id:"brief",name:"品牌设计简报.pdf",size:"2.4 MB",state:"success"}} />
    <FileCard color="purple" file={{id:"assets",name:"视觉素材.zip",size:"18.6 MB",state:"uploading",progress:64}} />
  </div>;
}

function StatusSamples() {
  return <Panel><div className="home-status-samples"><span className="home-state-success">● 已完成</span><span className="home-state-warning">● 待评审</span><span className="home-state-error">● 需修改</span></div><div className="home-status-progress"><ProgressBar value={100} color="green" label="资料准备" showPercentage /><ProgressBar value={64} color="cyan" label="素材同步" showPercentage /></div></Panel>;
}

function ChoiceSamples() {
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState(0);
  return <div className="home-selection-controls">
    <Checkbox color="green" checked={checked} onChange={setChecked} aria-label="勾选示例" />
    <div role="radiogroup" aria-label="单选示例" className="home-radio-group">{[0, 1].map(i => <RadioButton key={i} checked={radio === i} onChange={() => setRadio(i)} ariaLabel={i === 0 ? "选项一" : "选项二"} />)}</div>
  </div>;
}

function SelectionSamples() {
  const [period, setPeriod] = useState(2);
  return <div className="home-selection-samples">
    <ProgressBar value={[28, 56, 72, 90][period]} color="purple" label="项目进度" showPercentage />
    <div className="home-period-hover" onPointerOver={event => {
      if (event.pointerType !== "mouse" || !(event.target instanceof Element)) return;
      const button = event.target.closest("button");
      if (!button || !event.currentTarget.contains(button)) return;
      const index = Array.from(event.currentTarget.querySelectorAll("button")).indexOf(button);
      if (index >= 0) setPeriod(index);
    }}><ButtonGroup items={[{ label: "本日" }, { label: "本周" }, { label: "本月" }, { label: "全年" }]} activeIndex={period} onChange={setPeriod} ariaLabel="统计周期" shape="pill" /></div>
  </div>;
}

function ButtonSamples() {
  const [clicked, setClicked] = useState("");
  return <div className="home-button-matrix">
    {(["primary", "secondary", "tertiary"] as const).map((variant, index) => <Button key={variant} color="blue" variant={variant} size="sm" onClick={() => setClicked(variant)}>{clicked === variant ? "已点击" : ["主要按钮", "次要按钮", "线框按钮"][index]}</Button>)}
  </div>;
}

const composerCards: ChatInputBarQuickAction[] = [
  { id: "image", label: "创建图片", kind: "image", placeholder: "描述你想创建的图片…" },
  { id: "note", label: "写笔记", kind: "note", placeholder: "写下想记录的内容…" },
  { id: "event", label: "安排日程", kind: "event", placeholder: "什么活动，什么时候？" },
  { id: "docs", label: "分析文档", kind: "docs", placeholder: "上传文档，或者提一个问题…" },
];

function FeedbackSamples() {
  const [read, setRead] = useState(false);
  return <>
    <Panel><NotificationItem title="设计评审已更新" body="陈一添加了两条反馈，邀请你一起查看。" time="刚刚" color="blue" onMarkRead={() => setRead(true)} actionLabel={read ? "已读" : "标为已读"} /></Panel>
  </>;
}

function StepsSample() {
  const [step, setStep] = useState(2);
  return <Panel><Stepper color="purple" current={step} onStepChange={setStep} items={[{id:"design",label:"设计"},{id:"review",label:"评审"},{id:"publish",label:"交付"}]} /></Panel>;
}

function AiComposerSample() {
  const [message, setMessage] = useState("");
  return <div className="home-ai-composer">
    <ChatInputBar locale="zh" color="blue" placeholder="今天有什么想法？" quickActions={composerCards} quickActionsLabel="提示卡片" defaultQuickActionsOpen hasMessages={false} showAttachment={false} onSend={setMessage} />
    <p className={message ? "home-composer-feedback" : "sr-only"} role="status">{message ? `已发送：${message}` : ""}</p>
  </div>;
}

const examples = [
  { label: "组件", href: "/components" },
  { label: "数据概览", href: "/templates/dashboards/ecommerce-2" },
  { label: "财务", href: "/templates/dashboards/finance-1" },
  { label: "智能体", href: "/templates/agent" },
  { label: "看板", href: "/templates/task-board" },
];

export function HomeHero({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const Example = [OverviewExample, FinanceExample, AgentExample, BoardExample][active - 1];
  return <>
    <div className="home-hero-copy">{children}</div>
    <section className="home-showcase" aria-label="Forge 组件与模板示例">
      <div className="home-showcase-heading">
        <TabBar ariaLabel="展示示例" color="black" appearance="dock" tabs={examples.map((example, index) => ({ label: example.label, active: active === index, id: `home-example-${index}`, controls: "home-example-panel" }))} onChange={setActive} />
        <a href={examples[active].href}>{active === 0 ? "浏览全部组件" : "打开完整模板"} <span aria-hidden="true">↗</span></a>
      </div>
      <div className="home-hero-stage" id="home-example-panel" role="tabpanel" aria-labelledby={`home-example-${active}`}>
        {active === 0 ? <Wall /> : <div className="home-template-preview" key={active}><Example /></div>}
      </div>
    </section>
  </>;
}
