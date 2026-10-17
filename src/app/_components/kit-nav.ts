export type KitNavItem = {
  slug: string;
  label: string;
  surfaces?: Array<"components" | "cases">;
};

export type KitNavGroup = {
  title: string;
  items: KitNavItem[];
};

export const kitNavGroups: KitNavGroup[] = [
  {
    title: "基础",
    items: [
      { slug: "style-guide", label: "设计规范", surfaces: ["components"] },
      { slug: "button-link", label: "按钮与链接" },
    ],
  },
  {
    title: "表单",
    items: [
      { slug: "input-field", label: "表单与输入" },
      { slug: "filter", label: "筛选" },
      { slug: "chat-input-bar", label: "消息输入栏" },
    ],
  },
  {
    title: "数据展示",
    items: [
      { slug: "table", label: "数据表格" },
      { slug: "chart", label: "图表" },
      { slug: "list", label: "列表" },
      { slug: "card", label: "卡片" },
      { slug: "badge", label: "徽章与标签" },
      { slug: "calendar", label: "日历与日程" },
      { slug: "map", label: "地图" },
      { slug: "history", label: "历史记录" },
      { slug: "comment", label: "评论与评价" },
      { slug: "file-type", label: "文件展示", surfaces: ["components"] },
      { slug: "chat", label: "聊天" },
      { slug: "checklist", label: "待办清单" },
      { slug: "agent", label: "智能体" },
      { slug: "other-widget", label: "实用组件" },
    ],
  },
  {
    title: "反馈",
    items: [
      { slug: "progress", label: "进度" },
      { slug: "feedback", label: "消息反馈" },
    ],
  },
  {
    title: "浮层",
    items: [
      { slug: "modal", label: "确认弹窗" },
      { slug: "tooltip", label: "提示气泡" },
    ],
  },
  {
    title: "导航",
    items: [
      { slug: "menu", label: "菜单" },
      { slug: "tab", label: "页签与切换" },
      { slug: "pagination-stepper", label: "分页与步骤" },
      { slug: "page-header", label: "页面顶栏" },
      { slug: "toolbar", label: "工具栏" },
    ],
  },
  {
    title: "布局",
    items: [
      { slug: "grid", label: "布局栅格" },
      { slug: "menu-sections", label: "应用布局" },
      { slug: "accordion", label: "折叠面板" },
    ],
  },
];

export function surfaceNavGroups(surface: "components" | "cases") {
  return kitNavGroups
    .map((group) => ({
      title: group.title,
      items: group.items
        .filter((item) => !item.surfaces || item.surfaces.includes(surface))
        .map((item) => ({ href: `/${surface}/${item.slug}`, label: item.label })),
    }))
    .filter((group) => group.items.length > 0);
}
