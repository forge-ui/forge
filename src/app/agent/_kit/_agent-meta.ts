// The Forge Agent components, one entry per documented demo. Plain data, so server pages can read it;
// the demos and code live in _agent-entries.tsx under the same slug.

export const AGENT_GROUPS = [
  { title: "对话与输入", description: "消息、输入框和面板：Forge Agent 的外壳。空对话时输入框上方是快捷卡片，有了消息自然收起。" },
  { title: "思考与工具", description: "思考、等待和工具调用。Reasoning、ToolCall 由宿主驱动状态和计时；ThinkingTrace、ToolChips 自带播放，适合演示和静态页面。" },
  { title: "提问与确认", description: "缺信息先问，改数据先确认，答完、确认完都留下结果。" },
  { title: "回答与引用", description: "正文流式出现，结论能回到出处，结构化结果用对应的卡片。" },
  { title: "运行", description: "多步任务：先给计划、跑起来看轨迹、随时回到检查点。" },
  { title: "治理", description: "智能体改过什么、能自己做多少，都摆在明面上。" },
  { title: "运营", description: "后台任务多了以后：哪些在跑、哪些等你、离开时发生了什么。" },
  { title: "观测", description: "上下文、耗时、花费和多智能体协作。" },
] as const;

export type AgentGroup = (typeof AGENT_GROUPS)[number]["title"];

export type AgentEntryMeta = {
  /** Page slug under /agent and the anchor id on /agent/api. */
  slug: string;
  id: string;
  title: string;
  group: AgentGroup;
  summary: string;
  /** Components whose API tables belong to this entry. */
  apis: string[];
  /** Selection note in skills/forge-skill/references/component-selection. */
  note?: string;
  /** Shares a row with its neighbour on /agent/api. */
  half?: boolean;
};

export const AGENT_ENTRIES: AgentEntryMeta[] = [
  { slug: "chat-input-bar", id: "chatinputbar", title: "ChatInputBar · 快捷卡片", group: "对话与输入", summary: "空对话时输入框上方展开快捷卡片，发送后自然收起，左侧加号可以再打开；@ 提及、/ 命令、模型和权限菜单、发送与停止都在这里。", apis: [], note: "chat-input-bar" },
  { slug: "composer", id: "composer", title: "Composer · 自己拼装", group: "对话与输入", summary: "同一套外观和快捷卡片，部件自己摆：头部放附件，工具栏加自定义按钮，模型菜单和发送放右边。", apis: ["Composer", "ComposerHeader", "ComposerInput", "ComposerToolbar", "ComposerAction", "ComposerModelMenu", "ComposerSend"], note: "composer" },
  { slug: "conversation", id: "conversation", title: "Conversation", group: "对话与输入", summary: "可以输入或点推荐提问；新回复自动跟随，上翻后出现“回到最新”。", apis: ["Conversation", "AgentMessage", "MessageActions", "PromptSuggestions"], note: "agent-conversation" },
  { slug: "agent-welcome", id: "agentwelcome", title: "AgentWelcome", group: "对话与输入", summary: "空对话的问候：它是谁、能做什么。起手任务交给输入框的快捷卡片。", apis: ["AgentWelcome"], note: "agent-welcome", half: true },
  { slug: "run-controls", id: "runcontrols", title: "RunControls / PromptQueue / AttachmentList", group: "对话与输入", summary: "运行中可以停止、插一句；停下后继续或重试。回答没结束时写的消息先排队，可调序、编辑、提前发。", apis: ["RunControls", "PromptQueue", "AttachmentList"], note: "composer-parts", half: true },
  { slug: "agent-panel", id: "agentpanel", title: "AgentPanel", group: "对话与输入", summary: "右侧面板：历史对话、新对话、消息区和输入框；宽屏时页面让出面板宽度。", apis: ["AgentPanel"], note: "agent-panel" },
  { slug: "conversation-list", id: "conversationlist", title: "ConversationList", group: "对话与输入", summary: "按今天、昨天、7 天内分组；置顶、重命名、删除，进行中和有新回复都有标记。面板的历史按钮里就是它。", apis: ["ConversationList"], note: "conversation-list" },
  { slug: "artifact-card", id: "artifactcard", title: "ArtifactCard", group: "对话与输入", summary: "生成中、已完成和失败三种状态。", apis: ["ArtifactCard"] },

  { slug: "reasoning", id: "reasoning", title: "Reasoning", group: "思考与工具", summary: "思考中实时计时，结束后折成“思考了 3.2 秒 · 3 步”。点“重新思考”看完整过程。", apis: ["Reasoning"], note: "thinking", half: true },
  { slug: "thinking-indicator", id: "thinkingindicator", title: "ThinkingIndicator", group: "思考与工具", summary: "第一个字出来前的等待：固定文案，或按阶段轮换并计时。", apis: ["ThinkingIndicator"], note: "thinking", half: true },
  { slug: "tool-call", id: "toolcall", title: "ToolCall / ToolCallGroup", group: "思考与工具", summary: "一次调用一行：状态、计时、摘要，展开看参数和结果；失败可重试，需要确认时就地允许或拒绝。", apis: ["ToolCall", "ToolCallGroup"], note: "tool-call" },
  { slug: "thinking-trace", id: "thinkingtrace", title: "ThinkingTrace", group: "思考与工具", summary: "自带播放的思考步骤，适合演示页；步骤可以直接停在完成态。", apis: ["ThinkingTrace"], note: "thinking-trace", half: true },
  { slug: "tool-chips", id: "toolchips", title: "ToolChips", group: "思考与工具", summary: "一次调用里同时看到思考、写入和文件增删。", apis: ["ToolChips"], note: "tool-chips", half: true },
  { slug: "agent-task-rows", id: "agenttaskrows", title: "AgentTaskRows", group: "思考与工具", summary: "任务带上完成、失败和进行中的子项。", apis: ["AgentTaskRows"], note: "agent-task-rows" },

  { slug: "question", id: "question", title: "Question", group: "提问与确认", summary: "一次问几件事：数字键选择、回车继续，可多选、可补充文字。", apis: ["Question"], note: "question", half: true },
  { slug: "approval", id: "approval", title: "Approval", group: "提问与确认", summary: "风险等级、改动明细、“仅这次 / 本次对话都允许”，拒绝时可以说明原因，倒计时在指针悬停时暂停。", apis: ["Approval"], note: "approval", half: true },
  { slug: "choice-card", id: "choicecard", title: "ChoiceCard / ConfirmCard", group: "提问与确认", summary: "Forge Agent 运行时（服务端会话、候选校验、签名确认、保存回执）用的两张卡，是 Question 和 Approval 的简写。", apis: ["ChoiceCard", "ConfirmCard"], note: "question" },
  { slug: "tool-approval", id: "toolapproval", title: "AgentParts 工具确认", group: "提问与确认", summary: "会改数据的工具先让用户允许或拒绝，再继续执行。", apis: [], note: "agent-parts" },
  { slug: "approval-card", id: "approvalcard", title: "ApprovalCard", group: "提问与确认", summary: "把选项列出来，等用户选定后再继续。", apis: ["ApprovalCard"], note: "approval-card", half: true },
  { slug: "recommendation-card", id: "recommendationcard", title: "RecommendationCard", group: "提问与确认", summary: "主建议下面列出可以替换的备选方案。", apis: ["RecommendationCard"], note: "recommendation-card", half: true },

  { slug: "agent-parts", id: "agentparts", title: "AgentParts", group: "回答与引用", summary: "一条 AI SDK 消息里的思考、两次工具调用、回答、来源和文件；打开开关后库存查询换成自定义卡片。", apis: ["AgentParts"], note: "agent-parts" },
  { slug: "streaming-answer", id: "streaminganswer", title: "StreamingAnswer", group: "回答与引用", summary: "回答带上来源和后续追问，也可以按接收进度逐段淡入。", apis: ["StreamingAnswer"], note: "streaming-answer", half: true },
  { slug: "cited-answer", id: "citedanswer", title: "CitedAnswer", group: "回答与引用", summary: "指向角标会高亮它支撑的那句话和下方来源，并预览原文摘录。", apis: ["CitedAnswer", "Citation"], note: "cited-answer", half: true },
  { slug: "inline-diff", id: "inlinediff", title: "InlineDiff", group: "回答与引用", summary: "AI 改写的文字就地显示删改：逐处接受或拒绝（也可按 A / R），或者全部处理后应用。", apis: ["InlineDiff"], note: "inline-diff" },
  { slug: "context-cards", id: "contextcards", title: "ContextCards", group: "回答与引用", summary: "检索到的段落带上来源文件和字数。", apis: ["ContextCards"], half: true },
  { slug: "insight-cards", id: "insightcards", title: "InsightCards", group: "回答与引用", summary: "每张卡用一句摘要配上折线、柱状或占比。", apis: ["InsightCards"], half: true },
  { slug: "agent-code-block", id: "agentcodeblock", title: "AgentCodeBlock", group: "回答与引用", summary: "文件名下面同时给出完整代码和增删行。", apis: ["AgentCodeBlock"], half: true },
  { slug: "agent-diff-table", id: "agentdifftable", title: "AgentDiffTable", group: "回答与引用", summary: "保留、删除和新增的行放在同一张审核表里。", apis: ["AgentDiffTable"], half: true },
  { slug: "agent-flowchart", id: "agentflowchart", title: "AgentFlowchart", group: "回答与引用", summary: "触发、条件和动作连成一条补货流程。", apis: ["AgentFlowchart"], half: true },
  { slug: "command-search", id: "commandsearch", title: "CommandSearch", group: "回答与引用", summary: "命令按规划、数据和流程分组，输入后即时筛选。", apis: ["CommandSearch"], half: true },

  { slug: "agent-plan", id: "agentplan", title: "AgentPlan", group: "运行", summary: "执行前可改名、调序、删改步骤；执行时逐步计时，失败的一步可以从这里重试。", apis: ["AgentPlan"], note: "agent-run", half: true },
  { slug: "agent-trail", id: "agenttrail", title: "AgentTrail / RunProgress", group: "运行", summary: "当前做到第几步、在做什么、子步骤和计时；等你确认的一步就地放审批。", apis: ["AgentTrail", "RunProgress"], note: "agent-run", half: true },
  { slug: "agent-checkpoints", id: "agentcheckpoints", title: "AgentCheckpoints", group: "运行", summary: "像 git 一样回到任意一步重来，放弃的尝试淡出但保留。", apis: ["AgentCheckpoints"], note: "agent-run" },

  { slug: "change-ledger", id: "changeledger", title: "ChangeLedger", group: "治理", summary: "每项改动有前后对比和撤销；撤销前列出会一并撤销的后续改动，发出去的邮件标为不可撤销。", apis: ["ChangeLedger"], note: "agent-governance", half: true },
  { slug: "autonomy-selector", id: "autonomyselector", title: "AutonomySelector", group: "治理", summary: "谨慎、平衡、放手三档，真实操作按“自己做 / 先问你”分好。", apis: ["AutonomySelector"], note: "agent-governance", half: true },

  { slug: "agent-inbox", id: "agentinbox", title: "AgentInbox / RunningNow", group: "运营", summary: "待你处理排在最前，运行中实时计时，展开看最近几步并就地处理。", apis: ["AgentInbox", "RunningNow"], note: "agent-ops", half: true },
  { slug: "away-summary", id: "awaysummary", title: "AwaySummary", group: "运营", summary: "回来时先看这张：离开多久、要你处理的、没做成的、做完的。", apis: ["AwaySummary"], note: "agent-ops", half: true },

  { slug: "context-usage", id: "contextusage", title: "ContextUsage", group: "观测", summary: "上下文被什么占着：可以把文件移出去，或压缩早期对话。", apis: ["ContextUsage"], note: "agent-observe", half: true },
  { slug: "agent-tree", id: "agenttree", title: "AgentTree / AgentLanes", group: "观测", summary: "谁派了谁、每个在做什么、花费按分支汇总；泳道看每个智能体的时间线。", apis: ["AgentTree", "AgentLanes"], note: "agent-observe", half: true },
  { slug: "trace-waterfall", id: "tracewaterfall", title: "TraceWaterfall", group: "观测", summary: "一次运行的时间和钱花在哪：模型调用、工具和子智能体按时间排开。", apis: ["TraceWaterfall"], note: "agent-observe" },
];

export const agentEntry = (slug: string) => AGENT_ENTRIES.find(entry => entry.slug === slug);

/** What each component is for, in a few words: shown next to its name in the gallery. */
export const AGENT_PURPOSE: Record<string, string> = {
  "chat-input-bar": "输入框与快捷卡片",
  composer: "自己拼装的输入框",
  conversation: "消息流",
  "agent-welcome": "空对话问候",
  "run-controls": "停止、排队与附件",
  "agent-panel": "侧边智能体面板",
  "conversation-list": "历史对话",
  "artifact-card": "生成的文件",
  reasoning: "思考过程与计时",
  "thinking-indicator": "等待第一个字",
  "tool-call": "工具调用与审批",
  "thinking-trace": "自动播放的思考步骤",
  "tool-chips": "一次调用的明细",
  "agent-task-rows": "任务与子项",
  question: "向用户提问",
  approval: "执行前审批",
  "choice-card": "候选与改动确认",
  "tool-approval": "AI SDK 工具确认",
  "approval-card": "列出选项等选择",
  "recommendation-card": "建议与备选",
  "agent-parts": "渲染 AI SDK 消息",
  "streaming-answer": "逐字淡入的回答",
  "cited-answer": "带出处的回答",
  "inline-diff": "原文里逐处改稿",
  "context-cards": "检索到的片段",
  "insight-cards": "一句话洞察配图",
  "agent-code-block": "代码与增删行",
  "agent-diff-table": "表格改动审核",
  "agent-flowchart": "流程图",
  "command-search": "命令搜索",
  "agent-plan": "执行前的计划",
  "agent-trail": "执行轨迹与进度",
  "agent-checkpoints": "回到任意一步",
  "change-ledger": "改动清单与撤销",
  "autonomy-selector": "自主程度",
  "agent-inbox": "后台任务收件箱",
  "away-summary": "离开期间发生了什么",
  "context-usage": "上下文用量",
  "agent-tree": "多智能体分工",
  "trace-waterfall": "耗时与花费",
};
