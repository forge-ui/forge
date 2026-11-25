import type { StatusBadgeColor } from "@aideui/core";

const person = (name: string) => `/images/blocks/people/${name}.jpg`;

export type CustomerStage = "试用" | "签约" | "续约中" | "流失风险";

export type Customer = {
  id: string;
  name: string;
  industry: string;
  region: string;
  owner: { name: string; avatar: string };
  contact: { name: string; title: string; phone: string; email: string; avatar: string };
  plan: string;
  annualFee: number;
  health: number;
  stage: CustomerStage;
  since: string;
  renewalDate: string;
};

export const SALES = {
  lin: { name: "林悦", avatar: person("lin-yue") },
  chen: { name: "陈思远", avatar: person("chen-siyuan") },
  zhou: { name: "周予安", avatar: person("zhou-yuan") },
  jiang: { name: "江雨桐", avatar: person("jiang-yutong") },
};

export const CUSTOMERS: Customer[] = [
  { id: "c-1001", name: "华东电网研究院", industry: "能源", region: "上海", owner: SALES.chen, contact: { name: "苏晚晴", title: "数字化部主任", phone: "135 8841 2290", email: "suwq@ecgri.cn", avatar: person("su-wanqing") }, plan: "私有化 · 3 个模块", annualFee: 860000, health: 92, stage: "签约", since: "2024-03-12", renewalDate: "2027-03-11" },
  { id: "c-1002", name: "联通数字科技", industry: "通信", region: "北京", owner: SALES.lin, contact: { name: "陆景行", title: "产品总监", phone: "189 0172 3368", email: "lujx@cudt.com", avatar: person("lu-jingxing") }, plan: "私有化 · 全模块", annualFee: 1600000, health: 88, stage: "签约", since: "2025-06-01", renewalDate: "2026-12-31" },
  { id: "c-1003", name: "北理工信息学院", industry: "教育", region: "北京", owner: SALES.zhou, contact: { name: "许知夏", title: "实验室主任", phone: "137 2290 6618", email: "xuzx@bit.edu.cn", avatar: person("xu-zhixia") }, plan: "SaaS · 团队版", annualFee: 240000, health: 81, stage: "续约中", since: "2025-09-10", renewalDate: "2026-12-09" },
  { id: "c-1004", name: "富尔特装备", industry: "制造", region: "苏州", owner: SALES.chen, contact: { name: "顾承泽", title: "信息中心经理", phone: "186 2310 7745", email: "gucz@fuerte.cn", avatar: person("gu-chengze") }, plan: "私有化 · 2 个模块", annualFee: 550000, health: 64, stage: "试用", since: "2026-10-20", renewalDate: "2026-12-20" },
  { id: "c-1005", name: "翔业集团", industry: "交通", region: "深圳", owner: SALES.jiang, contact: { name: "沈清和", title: "IT 负责人", phone: "158 7720 4419", email: "shenqh@xiangye.com", avatar: person("shen-qinghe") }, plan: "SaaS · 企业版", annualFee: 380000, health: 47, stage: "流失风险", since: "2025-02-18", renewalDate: "2027-02-17" },
  { id: "c-1006", name: "云帆医疗", industry: "医疗", region: "杭州", owner: SALES.lin, contact: { name: "唐可欣", title: "数据科主任", phone: "136 5512 0087", email: "tangkx@yunfanmed.cn", avatar: person("tang-kexin") }, plan: "私有化 · 数据集平台", annualFee: 720000, health: 85, stage: "签约", since: "2025-11-02", renewalDate: "2027-01-20" },
  { id: "c-1007", name: "青石建设", industry: "建筑", region: "成都", owner: SALES.zhou, contact: { name: "宋知意", title: "总工办主任", phone: "139 6620 1834", email: "songzy@qingshi.build", avatar: person("song-zhiyi") }, plan: "SaaS · 团队版", annualFee: 180000, health: 73, stage: "签约", since: "2026-01-15", renewalDate: "2027-01-14" },
  { id: "c-1008", name: "星宇传媒", industry: "传媒", region: "广州", owner: SALES.jiang, contact: { name: "江雨桐", title: "运营总监", phone: "138 1024 5521", email: "jiangyt@xingyu.media", avatar: person("jiang-yutong") }, plan: "SaaS · 企业版", annualFee: 320000, health: 58, stage: "续约中", since: "2025-12-05", renewalDate: "2026-12-04" },
];

export const stageColor: Record<CustomerStage, StatusBadgeColor> = {
  试用: "blue",
  签约: "green",
  续约中: "yellow",
  流失风险: "red",
};

export type ContractStatus = "审批中" | "执行中" | "待回款" | "已完成" | "已退回";

export type Contract = {
  id: string;
  customerId: string;
  title: string;
  product: string;
  amount: number;
  received: number;
  signedAt: string;
  status: ContractStatus;
  owner: { name: string; avatar: string };
  lines: Array<{ name: string; spec: string; quantity: number; price: number }>;
  milestones: Array<{ title: string; date: string; amount: number; done: boolean }>;
};

export const CONTRACTS: Contract[] = [
  {
    id: "HT-2611-024",
    customerId: "c-1002",
    title: "智能体工场私有化部署",
    product: "智能体工场",
    amount: 550000,
    received: 275000,
    signedAt: "2026-11-24",
    status: "执行中",
    owner: SALES.lin,
    lines: [
      { name: "智能体工场 企业版授权", spec: "100 用户 · 永久", quantity: 1, price: 380000 },
      { name: "私有化部署实施", spec: "含 3 次现场", quantity: 1, price: 120000 },
      { name: "年度运维服务", spec: "首年", quantity: 1, price: 50000 },
    ],
    milestones: [
      { title: "合同签订", date: "2026-11-24", amount: 275000, done: true },
      { title: "部署验收", date: "2027-01-15", amount: 220000, done: false },
      { title: "运维期满", date: "2027-11-24", amount: 55000, done: false },
    ],
  },
  {
    id: "HT-2611-022",
    customerId: "c-1001",
    title: "数据集开发平台三期",
    product: "数据集开发平台",
    amount: 870000,
    received: 0,
    signedAt: "2026-11-22",
    status: "待回款",
    owner: SALES.chen,
    lines: [
      { name: "数据集开发平台 标注模块", spec: "50 并发", quantity: 1, price: 520000 },
      { name: "数据治理模块", spec: "含 2 个数据源适配", quantity: 1, price: 250000 },
      { name: "实施与培训", spec: "10 人天", quantity: 1, price: 100000 },
    ],
    milestones: [
      { title: "首付款", date: "2026-12-05", amount: 435000, done: false },
      { title: "验收款", date: "2027-03-01", amount: 435000, done: false },
    ],
  },
  {
    id: "HT-2611-019",
    customerId: "c-1003",
    title: "团队版续费",
    product: "SaaS 团队版",
    amount: 240000,
    received: 240000,
    signedAt: "2026-11-20",
    status: "已完成",
    owner: SALES.zhou,
    lines: [{ name: "SaaS 团队版", spec: "30 席位 · 1 年", quantity: 1, price: 240000 }],
    milestones: [{ title: "全款", date: "2026-11-20", amount: 240000, done: true }],
  },
  {
    id: "HT-2611-016",
    customerId: "c-1005",
    title: "企业版增购",
    product: "SaaS 企业版",
    amount: 120000,
    received: 0,
    signedAt: "2026-11-18",
    status: "已退回",
    owner: SALES.jiang,
    lines: [{ name: "SaaS 企业版增购", spec: "20 席位 · 剩余期限", quantity: 1, price: 120000 }],
    milestones: [{ title: "全款", date: "2026-12-18", amount: 120000, done: false }],
  },
  {
    id: "HT-2611-013",
    customerId: "c-1004",
    title: "垂类模型训练",
    product: "模型训练服务",
    amount: 180000,
    received: 0,
    signedAt: "2026-11-15",
    status: "审批中",
    owner: SALES.chen,
    lines: [{ name: "装备故障诊断模型训练", spec: "含数据清洗", quantity: 1, price: 180000 }],
    milestones: [{ title: "全款", date: "2026-12-30", amount: 180000, done: false }],
  },
  {
    id: "HT-2610-041",
    customerId: "c-1006",
    title: "医疗数据集平台",
    product: "数据集开发平台",
    amount: 720000,
    received: 504000,
    signedAt: "2026-10-28",
    status: "执行中",
    owner: SALES.lin,
    lines: [
      { name: "数据集开发平台 医疗版", spec: "私有化", quantity: 1, price: 600000 },
      { name: "脱敏规则包", spec: "HIS / PACS", quantity: 1, price: 120000 },
    ],
    milestones: [
      { title: "首付款", date: "2026-10-28", amount: 360000, done: true },
      { title: "上线款", date: "2026-11-20", amount: 144000, done: true },
      { title: "验收款", date: "2027-01-10", amount: 216000, done: false },
    ],
  },
  {
    id: "HT-2610-037",
    customerId: "c-1007",
    title: "团队版新签",
    product: "SaaS 团队版",
    amount: 180000,
    received: 180000,
    signedAt: "2026-10-16",
    status: "已完成",
    owner: SALES.zhou,
    lines: [{ name: "SaaS 团队版", spec: "20 席位 · 1 年", quantity: 1, price: 180000 }],
    milestones: [{ title: "全款", date: "2026-10-16", amount: 180000, done: true }],
  },
];

export const contractStatusColor: Record<ContractStatus, StatusBadgeColor> = {
  审批中: "blue",
  执行中: "grey",
  待回款: "yellow",
  已完成: "green",
  已退回: "red",
};

export type TicketPriority = "紧急" | "高" | "普通";
export type TicketStatus = "待处理" | "处理中" | "待确认" | "已关闭";

export type Ticket = { id: string; customerId: string; title: string; priority: TicketPriority; status: TicketStatus; assignee: { name: string; avatar: string }; createdAt: string; overdue?: boolean };

export const TICKETS: Ticket[] = [
  { id: "GD-3108", customerId: "c-1005", title: "SSO 登录后跳转到空白页", priority: "紧急", status: "处理中", assignee: SALES.zhou, createdAt: "11-25 09:12", overdue: true },
  { id: "GD-3107", customerId: "c-1001", title: "标注任务导出缺少字段", priority: "高", status: "待处理", assignee: SALES.chen, createdAt: "11-25 08:40" },
  { id: "GD-3105", customerId: "c-1006", title: "脱敏规则对新科室不生效", priority: "高", status: "处理中", assignee: SALES.lin, createdAt: "11-24 17:22" },
  { id: "GD-3102", customerId: "c-1008", title: "希望增加按部门统计用量", priority: "普通", status: "待确认", assignee: SALES.jiang, createdAt: "11-24 11:05" },
  { id: "GD-3099", customerId: "c-1002", title: "智能体定时任务偶发不触发", priority: "紧急", status: "处理中", assignee: SALES.lin, createdAt: "11-23 20:31", overdue: true },
  { id: "GD-3094", customerId: "c-1003", title: "新增 10 个席位", priority: "普通", status: "已关闭", assignee: SALES.zhou, createdAt: "11-22 14:16" },
  { id: "GD-3090", customerId: "c-1007", title: "知识库 PDF 解析乱码", priority: "高", status: "待确认", assignee: SALES.zhou, createdAt: "11-21 10:48" },
  { id: "GD-3086", customerId: "c-1004", title: "试用环境申请延期", priority: "普通", status: "待处理", assignee: SALES.chen, createdAt: "11-20 16:03" },
];

export const ticketStatusOrder: TicketStatus[] = ["待处理", "处理中", "待确认", "已关闭"];

export const ACTIVITIES = [
  { id: "a1", customerId: "c-1002", who: SALES.lin, title: "完成部署方案评审", detail: "客户确认采用双机热备，部署窗口定在 12 月第一周。", time: "今天 10:20", kind: "meeting" as const },
  { id: "a2", customerId: "c-1002", who: SALES.lin, title: "首付款到账", detail: "HT-2611-024 首付款 ¥275,000 已到账。", time: "昨天 16:05", kind: "payment" as const },
  { id: "a3", customerId: "c-1002", who: SALES.zhou, title: "处理工单 GD-3099", detail: "定时任务偶发不触发，已定位到时区配置，待客户确认。", time: "11-23 21:10", kind: "ticket" as const },
  { id: "a4", customerId: "c-1002", who: SALES.lin, title: "电话回访", detail: "产品总监反馈智能体工场使用顺畅，希望增加微信渠道。", time: "11-20 15:30", kind: "call" as const },
];

export const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

export const REVENUE_BY_MONTH = {
  signed: [62, 68, 71, 69, 78, 84, 88, 86, 95, 101, 112, 128],
  received: [48, 55, 60, 58, 66, 70, 75, 79, 82, 90, 97, 103],
};

export const PRODUCT_SHARE = [
  { label: "数据集开发平台", value: 42, color: "bg-fg-blue-500" },
  { label: "智能体工场", value: 31, color: "bg-fg-violet" },
  { label: "SaaS 订阅", value: 19, color: "bg-fg-cyan-500" },
  { label: "模型训练服务", value: 8, color: "bg-fg-yellow" },
];

export const yuan = (value: number) => `¥${value.toLocaleString("zh-CN")}`;
export const wan = (value: number) => `¥${(value / 10000).toLocaleString("zh-CN", { maximumFractionDigits: 1 })} 万`;
export const customerById = (id: string) => CUSTOMERS.find((customer) => customer.id === id);
