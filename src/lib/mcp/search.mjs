const synonymGroups = [
  ["看板", "仪表盘", "仪表板", "概览", "首屏", "dashboard", "overview"],
  ["看板", "任务看板", "泳道", "kanban", "board"],
  ["表格", "数据表", "table"],
  ["列表", "清单", "list", "table"],
  ["详情", "档案", "detail", "profile"],
  ["表单", "新建", "编辑", "录入", "form"],
  ["设置", "配置", "偏好", "settings"],
  ["审批", "确认", "approval", "confirm", "confirmation"],
  ["筛选", "过滤", "filter"],
  ["搜索", "检索", "search"],
  ["批量", "多选", "bulk", "selection", "checkbox"],
  ["导出", "下载", "export", "download"],
  ["订单", "order"],
  ["客户", "线索", "customer", "crm", "lead"],
  ["商品", "产品", "product"],
  ["财务", "账单", "发票", "交易", "finance", "invoice", "transaction"],
  ["智能体", "助手", "对话", "agent", "ai", "assistant", "chat"],
  ["日历", "日程", "calendar", "schedule"],
  ["文件", "附件", "上传", "file", "upload"],
  ["登录", "注册", "认证", "login", "register", "auth"],
  ["状态", "徽章", "标签", "status", "badge", "tag"],
  ["图表", "趋势", "统计", "chart", "trend", "metric"],
  ["指标", "kpi", "stat", "metric"],
  ["弹窗", "对话框", "modal", "dialog"],
  ["抽屉", "drawer"],
  ["分页", "pagination"],
  ["步骤", "分步", "stepper", "step"],
  ["通知", "消息", "notification", "message"],
  ["权限", "角色", "role", "permission"],
  ["成员", "团队", "member", "team"],
  ["项目", "project"],
  ["任务", "待办", "task", "todo"],
  ["布局", "侧栏", "导航", "layout", "sidebar", "navigation", "menu"],
  ["按钮", "button"],
  ["输入", "输入框", "input", "textfield", "field"],
  ["下拉", "选择", "select", "dropdown"],
  ["工作流", "编排", "workflow", "flow"],
  ["颜色", "主色", "色彩", "color", "accent", "token"],
];

const synonyms = new Map();
for (const group of synonymGroups) for (const word of group) synonyms.set(word, [...new Set([...(synonyms.get(word) ?? []), ...group])]);
const dictionary = [...synonyms.keys()].filter(word => /[一-龥]/.test(word)).sort((left, right) => right.length - left.length);

export const normalize = value => String(value ?? "").toLocaleLowerCase().replace(/[\s_\-/.()（）]+/g, "");

function splitChinese(token) {
  const parts = [];
  let rest = token;
  while (rest) {
    const word = dictionary.find(entry => rest.startsWith(entry));
    if (word) { parts.push(word); rest = rest.slice(word.length); continue; }
    const next = rest.search(new RegExp(dictionary.map(entry => entry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")));
    const chunk = next > 0 ? rest.slice(0, next) : rest;
    if (chunk.length > 1) parts.push(chunk);
    rest = next > 0 ? rest.slice(next) : "";
  }
  return parts;
}

export function queryTerms(query) {
  const raw = String(query).toLocaleLowerCase().split(/[\s,，、;；:：|/]+/).filter(Boolean);
  const tokens = raw.flatMap(token => /[一-龥]/.test(token) && token.length > 2 && !synonyms.has(token) ? splitChinese(token) : [token]);
  return [...new Set(tokens)].map(token => ({ token, variants: [...new Set([token, ...(synonyms.get(token) ?? [])])].map(normalize).filter(Boolean) }));
}

const fieldWeights = [["name", 1], ["title", 0.8], ["label", 0.8], ["category", 0.6], ["family", 0.7], ["description", 0.3], ["body", 0.08]];

// Best field match per term, plus a smaller share of the runner-up so items matching in several fields rank higher.
function termScore(fields, term) {
  const perField = fieldWeights.map(([field, weight]) => {
    const value = fields[field];
    if (!value) return 0;
    return Math.max(...term.variants.map((variant, index) => {
      const score = value === variant ? 100 : value.startsWith(variant) ? 60 : value.includes(variant) ? 35 : 0;
      return score * weight * (index === 0 ? 1 : 0.7);
    }));
  }).sort((left, right) => right - left);
  return perField[0] + perField[1] * 0.3;
}

function distance(left, right) {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (left[i - 1] === right[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[right.length];
}

export function closest(entries, query, limit = 3) {
  const target = normalize(query);
  return entries.map(entry => ({ entry, gap: distance(entry.fields.name, target) })).filter(item => item.gap <= Math.max(2, Math.floor(target.length / 4))).sort((left, right) => left.gap - right.gap).slice(0, limit).map(item => item.entry);
}

export function rank(entries, query) {
  const terms = queryTerms(query);
  if (!terms.length) return [];
  const scored = entries.map(entry => {
    const scores = terms.map(term => termScore(entry.fields, term));
    const matched = scores.filter(Boolean).length;
    return { entry, matched, score: scores.reduce((sum, value) => sum + value, 0) + matched * 20 + entry.boost };
  }).filter(item => item.matched > 0);
  return scored.sort((left, right) => right.score - left.score || left.entry.fields.name.localeCompare(right.entry.fields.name)).map(item => ({ ...item.entry, score: Math.round(item.score), matchedAll: item.matched === terms.length }));
}
