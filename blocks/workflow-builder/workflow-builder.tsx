"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { Breadcrumbs, Button, CellText, StatusBadge, TabBar } from "@forge-ui-official/core";
import { AddSquareLinear, AltArrowDownLinear, CheckCircleLinear, FullScreenLinear, MinusSquareLinear, TrashBinMinimalisticLinear, WidgetLinear } from "@forge-ui-official/core/icons";

export type WorkflowNodeKind = "base" | "start" | "knowledge" | "condition" | "reply" | "ai" | "intent" | "form" | "variable" | "tool";

export interface WorkflowNode {
  id: string;
  kind: WorkflowNodeKind;
  title: string;
  x: number;
  y: number;
  expanded: boolean;
  fields: Record<string, string | boolean>;
}

export interface WorkflowEdge {
  from: string;
  port: string;
  to: string;
}

const meta: Record<WorkflowNodeKind, { label: string; chip: string; fill: string; category: string }> = {
  base: { label: "基本信息", chip: "bg-fg-blue", fill: "var(--fg-blue)", category: "系统" },
  start: { label: "开始", chip: "bg-fg-green-500", fill: "var(--fg-green-500)", category: "系统" },
  ai: { label: "AI 对话", chip: "bg-fg-violet", fill: "var(--fg-violet)", category: "AI 能力" },
  intent: { label: "意图识别", chip: "bg-fg-violet", fill: "var(--fg-violet)", category: "AI 能力" },
  knowledge: { label: "知识库检索", chip: "bg-fg-yellow-600", fill: "var(--fg-yellow-600)", category: "知识库" },
  condition: { label: "判断器", chip: "bg-fg-yellow-600", fill: "var(--fg-yellow-600)", category: "业务逻辑" },
  form: { label: "表单收集", chip: "bg-fg-cyan-500", fill: "var(--fg-cyan-500)", category: "业务逻辑" },
  reply: { label: "指定回复", chip: "bg-fg-cyan-500", fill: "var(--fg-cyan-500)", category: "业务逻辑" },
  variable: { label: "变量赋值", chip: "bg-fg-blue-400", fill: "var(--fg-blue-400)", category: "数据处理" },
  tool: { label: "自定义工具", chip: "bg-fg-grey-500", fill: "var(--fg-grey-500)", category: "其他" },
};

const paletteKinds: WorkflowNodeKind[] = ["ai", "intent", "knowledge", "condition", "form", "reply", "variable", "tool"];
const branches = [["IF", "if"], ["ELSE IF 1", "elseIf"], ["ELSE", "else"]];

export const defaultWorkflowNodes: WorkflowNode[] = [
  { id: "base", kind: "base", title: "基本信息", x: 0, y: 0, expanded: true, fields: { name: "售后知识库问答", description: "从模板「知识库问答助手」创建", prologue: "您好，我是售后小助手，您可以问我：\n- 怎么申请退换货？\n- 发票多久能开好？\n- 需要转人工服务", memory: false, upload: false, stt: false, tts: false } },
  { id: "start", kind: "start", title: "开始", x: 40, y: 700, expanded: true, fields: {} },
  { id: "kb", kind: "knowledge", title: "知识库检索", x: 380, y: 700, expanded: true, fields: { knowledge: "", mode: "向量检索", topN: "3", similarity: "0.6", maxChars: "5000", question: "开始 · 用户问题", showSource: false } },
  { id: "judge", kind: "condition", title: "判断器", x: 720, y: 600, expanded: true, fields: { if: "知识库检索 · 满足直接回答的分段列表", elseIf: "知识库检索 · 检索结果的分段列表" } },
  { id: "direct", kind: "reply", title: "直接回答", x: 1100, y: 300, expanded: true, fields: { type: "引用变量", value: "知识库检索 · 满足直接回答的分段内容", output: true } },
  { id: "chat", kind: "ai", title: "AI 对话", x: 1100, y: 640, expanded: true, fields: { model: "", system: "你是严谨的售后知识库问答助手。只依据检索到的资料回答；资料不足时明确说明，不要编造。", prompt: "已知信息：{{知识库检索.data}}\n问题：{{开始.question}}" } },
  { id: "empty", kind: "reply", title: "无结果回复", x: 1100, y: 1010, expanded: true, fields: { type: "自定义内容", value: "抱歉，没有在知识库查询到相关内容，请提供更详细的信息。", output: true } },
];

export const defaultWorkflowEdges: WorkflowEdge[] = [
  { from: "start", port: "out", to: "kb" },
  { from: "kb", port: "out", to: "judge" },
  { from: "judge", port: "if", to: "direct" },
  { from: "judge", port: "elseIf", to: "chat" },
  { from: "judge", port: "else", to: "empty" },
];

const models = ["请选择模型", "DeepSeek-V4", "Qwen3.5-Plus", "GLM-5"];
const knowledgeBases = ["暂无知识库", "售后服务手册", "发票与报销规范"];
const nodeWidth: Partial<Record<WorkflowNodeKind, number>> = { base: 260, condition: 280 };

const fieldLabel = "mb-1 block text-[11px] text-fg-grey-500";
const control = "w-full rounded-xl border border-fg-grey-200 bg-background px-3 py-2 text-xs text-fg-black outline-none focus:border-fg-blue";

function timestamp() {
  return new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-");
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return <label className="flex items-center justify-between gap-2 py-1 text-xs text-fg-black">
    {label}
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-5 w-9 rounded-full transition ${checked ? "bg-fg-blue" : "bg-fg-grey-200"}`}>
      <span className={`absolute top-0.5 size-4 rounded-full bg-background shadow transition-all ${checked ? "left-[18px]" : "left-0.5"}`} />
    </button>
  </label>;
}

function Port({ id, side }: { id: string; side: "in" | "out" }) {
  return <span data-port={id} className={`absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full border-2 border-white ${side === "in" ? "-left-[5px] bg-fg-grey-400" : "-right-[5px] bg-fg-blue"}`} />;
}

function BranchExits({ id }: { id: string }) {
  return <>{branches.map(([label, port]) => <div key={port} className="relative rounded-md bg-fg-grey-50 px-2 py-1.5 text-[11px] text-fg-grey-700">{label}<Port id={`${id}:${port}`} side="out" /></div>)}</>;
}

function NodeBody({ node, update }: { node: WorkflowNode; update: (fields: Record<string, string | boolean>) => void }) {
  const field = (key: string) => String(node.fields[key] ?? "");
  const set = (key: string) => (value: string | boolean) => update({ ...node.fields, [key]: value });
  switch (node.kind) {
    case "base":
      return <div className="flex flex-col gap-2">
        <label><span className={fieldLabel}>应用名称</span><input className={control} value={field("name")} onChange={event => set("name")(event.target.value)} /></label>
        <label><span className={fieldLabel}>描述</span><textarea className={`${control} resize-none`} rows={2} value={field("description")} onChange={event => set("description")(event.target.value)} /></label>
        <label><span className={fieldLabel}>开场白</span><textarea className={`${control} resize-none`} rows={5} value={field("prologue")} onChange={event => set("prologue")(event.target.value)} /></label>
        <Switch label="长期记忆" checked={Boolean(node.fields.memory)} onChange={set("memory")} />
        <Switch label="文件上传" checked={Boolean(node.fields.upload)} onChange={set("upload")} />
        <div className="flex items-center justify-between text-[11px] text-fg-grey-500">用户输入字段<button type="button" className="text-fg-blue">添加</button></div>
        <p className="text-[11px] text-fg-grey-400">暂无用户输入字段</p>
        <Switch label="语音输入 (STT)" checked={Boolean(node.fields.stt)} onChange={set("stt")} />
        <Switch label="语音播放 (TTS)" checked={Boolean(node.fields.tts)} onChange={set("tts")} />
      </div>;
    case "start":
      return <div className="flex flex-col gap-0.5 text-[11px] leading-4 text-fg-grey-600">
        <div className="mb-1 font-medium text-fg-black">输出变量</div>
        <div>question — 用户问题</div><div>time — 当前时间</div><div>history_context — 历史记录</div><div>chat_id — 对话 ID</div>
      </div>;
    case "knowledge":
      return <div className="flex flex-col gap-2">
        <label><span className={fieldLabel}>关联知识库</span><select className={control} value={field("knowledge")} onChange={event => set("knowledge")(event.target.value)}>{knowledgeBases.map((name, index) => <option key={name} value={index ? name : ""}>{name}</option>)}</select></label>
        <label><span className={fieldLabel}>检索模式</span><select className={control} value={field("mode")} onChange={event => set("mode")(event.target.value)}><option>向量检索</option><option>全文检索</option><option>混合检索</option></select></label>
        <div className="grid grid-cols-2 gap-2">
          <label><span className={fieldLabel}>Top N</span><input className={control} value={field("topN")} onChange={event => set("topN")(event.target.value)} /></label>
          <label><span className={fieldLabel}>相似度</span><input className={control} value={field("similarity")} onChange={event => set("similarity")(event.target.value)} /></label>
        </div>
        <label><span className={fieldLabel}>最大引用字符数</span><input className={control} value={field("maxChars")} onChange={event => set("maxChars")(event.target.value)} /></label>
        <label><span className={fieldLabel}>检索问题引用</span><select className={control} value={field("question")} onChange={event => set("question")(event.target.value)}><option>开始 · 用户问题</option><option>开始 · 历史记录</option></select></label>
        <Switch label="显示知识来源" checked={Boolean(node.fields.showSource)} onChange={set("showSource")} />
      </div>;
    case "condition":
      return <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-fg-grey-500">分支条件<button type="button" className="text-fg-blue">+ 添加分支</button></div>
        {branches.slice(0, 2).map(([label, key]) => <div key={key} className="rounded-xl border border-fg-grey-200 p-2">
          <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-fg-black">{label}<span className="text-fg-red">删除</span></div>
          <div className="flex flex-col gap-1.5 rounded-lg bg-fg-grey-50 p-1.5">
            <select className={control} value={field(key)} onChange={event => set(key)(event.target.value)}><option>知识库检索 · 满足直接回答的分段列表</option><option>知识库检索 · 检索结果的分段列表</option></select>
            <select className={control} defaultValue="不为空"><option>不为空</option><option>为空</option><option>包含</option></select>
          </div>
        </div>)}
        <div className="rounded-xl border border-fg-grey-200 p-2 text-[11px]"><div className="font-medium text-fg-black">ELSE</div><div className="text-fg-grey-400">其他分支（不满足以上条件时走此路）</div></div>
        <div className="mt-1 border-t border-fg-grey-100 pt-2 text-[11px] text-fg-grey-500">分支出口</div>
        <BranchExits id={node.id} />
      </div>;
    case "reply":
      return <div className="flex flex-col gap-2">
        <label><span className={fieldLabel}>回复类型</span><select className={control} value={field("type")} onChange={event => set("type")(event.target.value)}><option>引用变量</option><option>自定义内容</option></select></label>
        {field("type") === "引用变量"
          ? <label><span className={fieldLabel}>引用字段</span><select className={control} value={field("value")} onChange={event => set("value")(event.target.value)}><option>知识库检索 · 满足直接回答的分段内容</option><option>AI 对话 · 回答内容</option></select></label>
          : <label><span className={fieldLabel}>回复内容</span><textarea className={`${control} resize-none`} rows={3} value={field("value")} onChange={event => set("value")(event.target.value)} /></label>}
        <Switch label="返回内容" checked={Boolean(node.fields.output)} onChange={set("output")} />
      </div>;
    case "ai":
    case "intent":
      return <div className="flex flex-col gap-2">
        <label><span className={fieldLabel}>AI 模型</span><select className={control} value={field("model")} onChange={event => set("model")(event.target.value)}>{models.map((name, index) => <option key={name} value={index ? name : ""}>{name}</option>)}</select></label>
        <label><span className={fieldLabel}>系统提示词 (System)</span><textarea className={`${control} resize-none`} rows={3} value={field("system")} onChange={event => set("system")(event.target.value)} /></label>
        <label><span className={fieldLabel}>提示词 (Prompt)</span><textarea className={`${control} resize-none`} rows={2} value={field("prompt")} onChange={event => set("prompt")(event.target.value)} /></label>
      </div>;
    default:
      return <label><span className={fieldLabel}>说明</span><input className={control} value={field("note")} placeholder="补充这个节点要做什么" onChange={event => set("note")(event.target.value)} /></label>;
  }
}

function blankNode(kind: WorkflowNodeKind, index: number, x: number, y: number): WorkflowNode {
  const fields: Record<string, string | boolean> = kind === "ai" || kind === "intent" ? { model: "", system: "", prompt: "" } : kind === "reply" ? { type: "自定义内容", value: "", output: true } : {};
  return { id: `${kind}-${index}`, kind, title: meta[kind].label, x, y, expanded: true, fields };
}

function viewToFit(nodes: WorkflowNode[], sizes: Record<string, { width: number; height: number }>, width: number, height: number) {
  const right = Math.max(...nodes.map(node => node.x + (sizes[node.id]?.width ?? 250)));
  const bottom = Math.max(...nodes.map(node => node.y + (sizes[node.id]?.height ?? 200)));
  const scale = Math.max(0.3, Math.min(1, (width - 64) / right, (height - 48) / bottom));
  return { x: Math.max(16, (width - right * scale) / 2), y: 24, scale };
}

type Snapshot = { nodes: WorkflowNode[]; edges: WorkflowEdge[] };
type Run = { step: number; path: string[]; question: string; answer: string };

export interface WorkflowBuilderProps {
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
  className?: string;
}

export function WorkflowBuilder({ nodes: initialNodes = defaultWorkflowNodes, edges: initialEdges = defaultWorkflowEdges, className = "" }: WorkflowBuilderProps) {
  const [history, setHistory] = useState<{ stack: Snapshot[]; index: number }>({ stack: [{ nodes: initialNodes, edges: initialEdges }], index: 0 });
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState({ x: 40, y: 24, scale: 0.62 });
  const [ports, setPorts] = useState<Record<string, { x: number; y: number }>>({});
  const [sizes, setSizes] = useState<Record<string, { width: number; height: number }>>({});
  const [tab, setTab] = useState(1);
  const [published, setPublished] = useState(false);
  const [savedAt, setSavedAt] = useState("2026-11-09 15:27:41");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteTab, setPaletteTab] = useState(0);
  const [issuesOpen, setIssuesOpen] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [question, setQuestion] = useState("发票开错了怎么重开？");
  const [run, setRun] = useState<Run | null>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const drag = useRef<{ kind: "pan" | "node"; id?: string; startX: number; startY: number; originX: number; originY: number } | null>(null);
  const timer = useRef<number | null>(null);
  const fitted = useRef(false);

  const measure = useCallback(() => {
    const root = inner.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    const scale = box.width / root.offsetWidth || 1;
    const nextPorts: Record<string, { x: number; y: number }> = {};
    root.querySelectorAll<HTMLElement>("[data-port]").forEach(element => {
      const rect = element.getBoundingClientRect();
      nextPorts[element.dataset.port!] = { x: (rect.left + rect.width / 2 - box.left) / scale, y: (rect.top + rect.height / 2 - box.top) / scale };
    });
    const nextSizes: Record<string, { width: number; height: number }> = {};
    root.querySelectorAll<HTMLElement>("[data-node]").forEach(element => { nextSizes[element.dataset.node!] = { width: element.offsetWidth, height: element.offsetHeight }; });
    setPorts(nextPorts);
    setSizes(nextSizes);
    if (!fitted.current && canvas.current && Object.keys(nextSizes).length) {
      fitted.current = true;
      setView(viewToFit(nodes, nextSizes, canvas.current.clientWidth, canvas.current.clientHeight));
    }
  }, [nodes]);

  useLayoutEffect(() => {
    const root = inner.current;
    if (!root) return;
    const observer = new ResizeObserver(() => measure());
    root.querySelectorAll("[data-node]").forEach(element => observer.observe(element));
    const frame = requestAnimationFrame(measure);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [nodes, measure, tab]);

  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);

  function commit(next: Snapshot) {
    setNodes(next.nodes);
    setEdges(next.edges);
    setHistory(current => ({ stack: [...current.stack.slice(0, current.index + 1), next], index: current.index + 1 }));
  }

  function travel(offset: number) {
    const index = history.index + offset;
    const snapshot = history.stack[index];
    if (!snapshot) return;
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
    setHistory(current => ({ ...current, index }));
  }

  function updateFields(id: string, fields: Record<string, string | boolean>) {
    setNodes(current => current.map(node => node.id === id ? { ...node, fields } : node));
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const header = target.closest<HTMLElement>("[data-drag]");
    if (header && !target.closest("button")) {
      const node = nodes.find(item => item.id === header.dataset.drag);
      if (!node) return;
      drag.current = { kind: "node", id: node.id, startX: event.clientX, startY: event.clientY, originX: node.x, originY: node.y };
      setSelected(node.id);
    } else if (!target.closest("[data-node]") && !target.closest("[data-overlay]")) {
      drag.current = { kind: "pan", startX: event.clientX, startY: event.clientY, originX: view.x, originY: view.y };
      setSelected(null);
    } else return;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state) return;
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    if (state.kind === "pan") setView(current => ({ ...current, x: state.originX + dx, y: state.originY + dy }));
    else setNodes(current => current.map(node => node.id === state.id ? { ...node, x: state.originX + dx / view.scale, y: state.originY + dy / view.scale } : node));
  }

  function onPointerUp() {
    if (drag.current?.kind === "node") commit({ nodes, edges });
    drag.current = null;
  }

  function zoom(delta: number) {
    setView(current => ({ ...current, scale: Math.min(1.2, Math.max(0.35, Math.round((current.scale + delta) * 100) / 100)) }));
  }

  function fit() {
    setView(viewToFit(nodes, sizes, canvas.current?.clientWidth ?? 1200, canvas.current?.clientHeight ?? 640));
  }

  function beautify() {
    const depth: Record<string, number> = { start: 0 };
    const queue = ["start"];
    while (queue.length) {
      const id = queue.shift()!;
      edges.filter(edge => edge.from === id).forEach(edge => { if (depth[edge.to] === undefined) { depth[edge.to] = depth[id] + 1; queue.push(edge.to); } });
    }
    const last = Math.max(0, ...Object.values(depth)) + 1;
    const columns = new Map<number, WorkflowNode[]>();
    nodes.filter(node => node.kind !== "base").forEach(node => { const column = depth[node.id] ?? last; columns.set(column, [...(columns.get(column) ?? []), node]); });
    const top = (sizes.base?.height ?? 520) + 60;
    const placed = nodes.map(node => {
      if (node.kind === "base") return { ...node, x: 0, y: 0 };
      const column = depth[node.id] ?? last;
      const list = columns.get(column) ?? [];
      const offset = list.slice(0, list.indexOf(node)).reduce((sum, item) => sum + (sizes[item.id]?.height ?? 220) + 40, 0);
      return { ...node, x: column * 340 + 40, y: top + offset };
    });
    commit({ nodes: placed, edges });
  }

  function addNode(kind: WorkflowNodeKind) {
    const right = Math.max(...nodes.map(node => node.x + (sizes[node.id]?.width ?? 250)));
    const node = blankNode(kind, nodes.length, right + 80, 120);
    commit({ nodes: [...nodes, node], edges });
    setSelected(node.id);
    setPaletteOpen(false);
  }

  function debug(text: string) {
    if (!text.trim()) return;
    if (timer.current) window.clearInterval(timer.current);
    const chat = nodes.find(node => node.id === "chat");
    const path = ["start", "kb", "judge", chat?.fields.model ? "chat" : "empty"];
    const answer = chat?.fields.model ? "发票开错可以在开票后 30 天内申请重开：在订单详情点「申请换开」，填写正确抬头和税号，原发票会作废，新发票 1–2 个工作日内发到邮箱。" : String(nodes.find(node => node.id === "empty")?.fields.value ?? "");
    setRun({ step: 0, path, question: text, answer });
    timer.current = window.setInterval(() => {
      setRun(current => {
        if (!current || current.step >= current.path.length) { if (timer.current) window.clearInterval(timer.current); return current; }
        return { ...current, step: current.step + 1 };
      });
    }, 650);
  }

  const appName = String(nodes.find(node => node.kind === "base")?.fields.name ?? "工作流");
  const issues = [
    !nodes.find(node => node.id === "chat")?.fields.model ? "AI 对话：未选择 AI 模型" : null,
    !nodes.find(node => node.id === "kb")?.fields.knowledge ? "知识库检索：未关联知识库" : null,
  ].filter((item): item is string => Boolean(item));
  const curves = edges.flatMap(edge => {
    const from = ports[`${edge.from}:${edge.port}`];
    const to = ports[`${edge.to}:in`];
    if (!from || !to) return [];
    const bend = Math.max(60, Math.abs(to.x - from.x) / 2);
    const target = run ? run.path.indexOf(edge.to) : -1;
    const active = Boolean(run && target > 0 && target <= run.step && run.path[target - 1] === edge.from);
    return [{ key: `${edge.from}-${edge.port}-${edge.to}`, d: `M ${from.x} ${from.y} C ${from.x + bend} ${from.y}, ${to.x - bend} ${to.y}, ${to.x} ${to.y}`, active }];
  });
  const bounds = useMemo(() => ({
    width: Math.max(1400, ...nodes.map(node => node.x + (sizes[node.id]?.width ?? 260) + 80)),
    height: Math.max(1300, ...nodes.map(node => node.y + (sizes[node.id]?.height ?? 240) + 80)),
  }), [nodes, sizes]);
  const miniScale = Math.min(180 / bounds.width, 110 / bounds.height);
  const toolbarButton = (label: string, onClick: () => void, disabled?: boolean, icon?: ReactNode) => <Button color="blue" variant="tertiary" size="sm" iconLeft={icon} disabled={disabled} onClick={onClick}>{label}</Button>;

  return <div className={`flex min-w-0 flex-col overflow-hidden rounded-3xl border border-fg-grey-200 bg-background ${className}`}>
    <header className="flex flex-col gap-3 px-4 pt-5 sm:px-5">
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-2xl font-semibold leading-8 tracking-fg text-fg-black">{appName}</h1>
          <span className="inline-flex items-center gap-2 whitespace-nowrap"><span className="text-sm text-fg-grey-600">类型</span><CellText>高级工作流</CellText></span>
          <span className="inline-flex items-center gap-2 whitespace-nowrap"><span className="text-sm text-fg-grey-600">状态</span><StatusBadge label={published ? "已发布" : "未发布"} color={published ? "green" : "grey"} /></span>
        </div>
        <Breadcrumbs color="blue" items={[{ label: "工作台", href: "#overview" }, { label: "应用智能体", href: "#apps" }, { label: appName }]} />
      </div>
      <div className="-mx-4 border-b border-fg-grey-200 px-4 sm:-mx-5 sm:px-5">
        <TabBar color="blue" tabs={[{ label: "概览", active: tab === 0 }, { label: "编排", active: tab === 1 }, { label: "日志", active: tab === 2 }]} onChange={setTab} />
      </div>
    </header>

    {tab === 1 ? <>
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 border-b border-fg-grey-200 bg-background px-3 py-2 sm:px-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-fg-grey-500">
          <span>保存时间：<span className="text-fg-grey-700">{savedAt}</span></span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${published ? "bg-fg-green-50 text-fg-green-700" : "bg-fg-grey-100 text-fg-grey-600"}`}>{published ? "已发布" : "未发布"}</span>
          {issues.length
            ? <button type="button" onClick={() => setIssuesOpen(open => !open)} className="inline-flex items-center gap-1 rounded-full border border-fg-grey-200 bg-background px-2 py-0.5 text-[10px] font-medium text-fg-yellow-800 hover:bg-fg-grey-50">{issues.length} 警告</button>
            : <span className="inline-flex items-center gap-1 text-[10px] text-fg-green-700"><CheckCircleLinear size={12} />检查通过</span>}
        </div>
        <div className="relative ml-auto flex flex-wrap items-center gap-1.5 sm:gap-2">
          {toolbarButton("撤销", () => travel(-1), history.index <= 0)}
          {toolbarButton("重做", () => travel(1), history.index >= history.stack.length - 1)}
          {toolbarButton("模板中心", () => commit({ nodes: defaultWorkflowNodes, edges: defaultWorkflowEdges }))}
          {toolbarButton("添加组件", () => setPaletteOpen(open => !open), false, <WidgetLinear size={16} />)}
          {toolbarButton("全部展开", () => commit({ nodes: nodes.map(node => ({ ...node, expanded: true })), edges }))}
          {toolbarButton("全部收起", () => commit({ nodes: nodes.map(node => ({ ...node, expanded: false })), edges }))}
          {toolbarButton("一键美化", beautify)}
          {toolbarButton("调试", () => setDebugOpen(true))}
          {toolbarButton("保存", () => setSavedAt(timestamp()))}
          <Button color="blue" size="sm" onClick={() => { setPublished(true); setSavedAt(timestamp()); }}>发布</Button>
          {paletteOpen ? <div className="absolute right-0 top-[calc(100%+6px)] z-50 flex w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-fg-grey-200 bg-background shadow-[0_8px_24px_rgba(16,24,40,0.12)]">
            <div className="flex border-b border-fg-grey-100">
              {["基础组件", "工具", "应用"].map((label, index) => <button key={label} type="button" onClick={() => setPaletteTab(index)} className={`flex-1 px-3 py-2.5 text-sm font-medium ${paletteTab === index ? "border-b-2 border-fg-blue text-fg-blue" : "text-fg-grey-600 hover:text-fg-black"}`}>{label}</button>)}
            </div>
            <div className="max-h-80 overflow-y-auto py-1">
              {paletteTab === 0 ? [...new Set(paletteKinds.map(kind => meta[kind].category))].map(category => <div key={category} className="pb-1">
                <div className="px-3 py-1.5 text-[11px] font-medium text-fg-grey-400">{category}</div>
                <div className="flex flex-wrap gap-2 px-3 pb-2">
                  {paletteKinds.filter(kind => meta[kind].category === category).map(kind => <button key={kind} type="button" onClick={() => addNode(kind)} className="flex w-[calc(50%-4px)] items-center gap-2 rounded-lg border border-fg-grey-200 bg-background px-2.5 py-2 text-left text-sm text-fg-black transition-colors hover:border-fg-blue hover:bg-fg-blue-50/30">
                    <span className={`flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white ${meta[kind].chip}`}>{meta[kind].label.slice(0, 1)}</span>{meta[kind].label}
                  </button>)}
                </div>
              </div>) : <div className="flex flex-col gap-1 px-3 py-2">
                {(paletteTab === 1 ? ["查询订单状态", "创建售后工单", "发送企业微信通知"] : ["售后问答助手", "发票信息提取"]).map(name => <button key={name} type="button" onClick={() => addNode("tool")} className="flex w-full items-center gap-2 rounded-lg border border-transparent px-2.5 py-2 text-left text-sm hover:border-fg-grey-200 hover:bg-fg-grey-50">
                  <span className={`flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white ${meta.tool.chip}`}>{name.slice(0, 1)}</span>{name}
                </button>)}
              </div>}
            </div>
          </div> : null}
        </div>
      </div>
      {issuesOpen && issues.length ? <div className="flex flex-col gap-1 border-b border-fg-grey-200 bg-fg-yellow-50 px-4 py-2 text-xs text-fg-yellow-800">{issues.map(issue => <span key={issue}>警告 · {issue}</span>)}</div> : null}

      <div ref={canvas} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
        className="relative h-[680px] cursor-grab touch-none overflow-hidden bg-fg-grey-100 [background-image:radial-gradient(var(--fg-grey-300)_1px,transparent_1px)] [background-size:16px_16px] active:cursor-grabbing">
        <div ref={inner} className="absolute left-0 top-0 origin-top-left" style={{ width: bounds.width, height: bounds.height, transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}>
          <svg className="pointer-events-none absolute inset-0 overflow-visible" width={bounds.width} height={bounds.height} aria-hidden>
            {curves.map(curve => <path key={curve.key} d={curve.d} fill="none" stroke={curve.active ? "var(--fg-blue)" : "var(--fg-grey-400)"} strokeWidth={curve.active ? 2.5 : 1.5} />)}
          </svg>
          {nodes.map(node => {
            const position = run ? run.path.indexOf(node.id) : -1;
            const status = !run || position === -1 ? null : position < run.step ? "done" : position === run.step ? "running" : null;
            const border = selected === node.id ? "border-fg-blue ring-1 ring-fg-blue-100" : status === "running" ? "border-fg-blue" : status === "done" ? "border-fg-green-500" : "border-fg-grey-200";
            return <div key={node.id} data-node={node.id} className={`absolute cursor-default rounded-lg border bg-background shadow-[0_1px_4px_rgba(16,24,40,0.05)] ${border}`} style={{ left: node.x, top: node.y, width: nodeWidth[node.kind] ?? 250 }} onClick={() => setSelected(node.id)}>
              {node.kind !== "base" ? <Port id={`${node.id}:in`} side="in" /> : null}
              {node.kind !== "condition" && node.kind !== "reply" ? <Port id={`${node.id}:out`} side="out" /> : null}
              <div data-drag={node.id} className="flex cursor-move items-center gap-1.5 px-2 py-1.5">
                <span className={`flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white ${meta[node.kind].chip}`}>{meta[node.kind].label.slice(0, 1)}</span>
                <div className="min-w-0 flex-1 truncate text-xs font-semibold text-fg-black">{node.title}</div>
                {status ? <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${status === "done" ? "bg-fg-green-50 text-fg-green-700" : "bg-fg-blue-50 text-fg-blue-700"}`}>{status === "done" ? "完成" : "运行中"}</span> : null}
                <button type="button" title={node.expanded ? "收起" : "展开"} onClick={() => commit({ nodes: nodes.map(item => item.id === node.id ? { ...item, expanded: !item.expanded } : item), edges })} className="rounded p-0.5 text-fg-grey-400 hover:bg-fg-grey-50 hover:text-fg-grey-700"><span className={`block transition-transform ${node.expanded ? "rotate-180" : ""}`}><AltArrowDownLinear size={14} /></span></button>
                {node.kind !== "base" && node.kind !== "start" ? <button type="button" title="删除" onClick={() => commit({ nodes: nodes.filter(item => item.id !== node.id), edges: edges.filter(edge => edge.from !== node.id && edge.to !== node.id) })} className="rounded p-0.5 text-fg-grey-400 hover:bg-fg-red/5 hover:text-fg-red"><TrashBinMinimalisticLinear size={12} /></button> : null}
              </div>
              {node.expanded
                ? <div className="border-t border-fg-grey-100 px-2 py-2" onPointerDown={event => event.stopPropagation()}><NodeBody node={node} update={fields => updateFields(node.id, fields)} /></div>
                : node.kind === "condition" ? <div className="flex flex-col gap-1 border-t border-fg-grey-100 px-2 py-2"><BranchExits id={node.id} /></div> : null}
            </div>;
          })}
        </div>

        <div data-overlay className="absolute bottom-3 left-3 flex flex-col overflow-hidden rounded-lg border border-fg-grey-200 bg-background shadow-sm">
          <button type="button" aria-label="放大" onClick={() => zoom(0.1)} className="p-1.5 text-fg-grey-700 hover:bg-fg-grey-50"><AddSquareLinear size={16} /></button>
          <button type="button" aria-label="缩小" onClick={() => zoom(-0.1)} className="border-y border-fg-grey-100 p-1.5 text-fg-grey-700 hover:bg-fg-grey-50"><MinusSquareLinear size={16} /></button>
          <button type="button" aria-label="适应画布" onClick={fit} className="p-1.5 text-fg-grey-700 hover:bg-fg-grey-50"><FullScreenLinear size={16} /></button>
        </div>
        <span className="pointer-events-none absolute bottom-3 left-14 hidden rounded-lg bg-background/90 px-2 py-1 text-[11px] text-fg-grey-500 shadow-sm sm:block">{nodes.length} 节点 · {edges.length} 连线 · 拖动空白处平移，点击节点编辑</span>
        <div className="pointer-events-none absolute bottom-3 right-3 hidden rounded-lg border border-fg-grey-200 bg-background p-2 shadow-sm sm:block">
          <svg width={bounds.width * miniScale} height={bounds.height * miniScale} aria-hidden>
            {nodes.map(node => <rect key={node.id} x={node.x * miniScale} y={node.y * miniScale} width={(sizes[node.id]?.width ?? 250) * miniScale} height={(sizes[node.id]?.height ?? 200) * miniScale} rx={2} fill={meta[node.kind].fill} />)}
          </svg>
        </div>

        {debugOpen ? <div data-overlay className="absolute bottom-3 right-3 z-40 flex h-[min(520px,calc(100%-24px))] w-[min(380px,calc(100%-24px))] flex-col overflow-hidden rounded-2xl border border-fg-grey-200 bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b border-fg-grey-100 px-4 py-3"><span className="text-sm font-semibold text-fg-black">调试</span><button type="button" className="text-xs text-fg-grey-500 hover:text-fg-black" onClick={() => { setDebugOpen(false); setRun(null); }}>关闭</button></div>
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 text-sm">
            {run ? <>
              <div className="self-end rounded-2xl rounded-br-md bg-fg-blue-50 px-3 py-2 text-fg-grey-900">{run.question}</div>
              <ol className="flex flex-col gap-1 text-xs text-fg-grey-600">
                {run.path.map((id, index) => <li key={id} className="flex items-center gap-2"><span className={`size-1.5 rounded-full ${index < run.step ? "bg-fg-green-500" : index === run.step ? "bg-fg-blue" : "bg-fg-grey-300"}`} />{nodes.find(node => node.id === id)?.title}{index < run.step ? " · 完成" : index === run.step ? " · 运行中" : ""}</li>)}
              </ol>
              {run.step >= run.path.length ? <div className="rounded-2xl rounded-bl-md border border-fg-grey-100 bg-fg-grey-50 px-3 py-2 leading-6 text-fg-grey-800">{run.answer}</div> : null}
            </> : <p className="text-xs text-fg-grey-500">输入一个问题，按工作流跑一遍，节点会依次标出运行状态。</p>}
          </div>
          <form className="flex gap-2 border-t border-fg-grey-100 p-3" onSubmit={event => { event.preventDefault(); debug(question); }}>
            <input value={question} onChange={event => setQuestion(event.target.value)} className="h-9 min-w-0 flex-1 rounded-lg border border-fg-grey-200 px-3 text-sm outline-none focus:border-fg-blue" placeholder="输入调试问题" />
            <Button color="blue" size="sm" type="submit">发送</Button>
          </form>
        </div> : null}
      </div>
    </> : tab === 0 ? <div className="grid gap-4 p-5 md:grid-cols-2">
      {[["应用名称", appName], ["描述", String(nodes.find(node => node.kind === "base")?.fields.description ?? "")], ["节点", `${nodes.length} 个 · ${edges.length} 条连线`], ["发布状态", published ? "已发布" : "未发布"]].map(([label, value]) => <div key={label} className="rounded-2xl border border-fg-grey-200 p-4"><p className="text-xs text-fg-grey-500">{label}</p><p className="mt-1 text-sm text-fg-black">{value}</p></div>)}
    </div> : <ul className="divide-y divide-fg-grey-100 p-5">
      {[["发票开错了怎么重开？", "林悦", "11-09 15:02", "知识库命中"], ["退货运费谁承担？", "周远", "11-09 14:40", "知识库命中"], ["能不能开专票？", "苏婉清", "11-09 11:16", "无结果回复"]].map(([text, user, time, route]) => <li key={text} className="flex flex-wrap items-center gap-3 py-3 text-sm"><span className="min-w-0 flex-1 truncate text-fg-black">{text}</span><span className="text-xs text-fg-grey-500">{user} · {time}</span><StatusBadge label={route} color={route === "无结果回复" ? "yellow" : "green"} /></li>)}
    </ul>}
  </div>;
}
