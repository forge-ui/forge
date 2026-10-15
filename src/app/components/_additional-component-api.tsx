import { ApiTable, type ApiTableRow } from "./_api-table";
import { Section } from "./_shared";

const common: ApiTableRow[] = [
  { attr: "motion", type: "'auto' | 'none'", defaultValue: "'auto'", description: "跟随系统的减少动态效果偏好，或关闭动效。" },
];
const references: Record<string, { title: string; description: string; rows: ApiTableRow[] }[]> = {
  grid: [{ title: "Accordion", description: "按需展开一组内容，同一时间保持一个面板展开。", rows: [
    { attr: "items", type: "AccordionItem[]", defaultValue: "—", description: "各面板的标识、标题、内容及禁用状态。" },
    { attr: "value / defaultValue", type: "string | null", defaultValue: "null", description: "展开面板的标识，null 表示全部收起。" },
    { attr: "onValueChange", type: "(value: string | null) => void", defaultValue: "—", description: "展开或收起面板时触发。" }, ...common,
  ] }],
  tooltip: [{ title: "TooltipGroup", description: "协调一组提示的显示延迟，便于在相邻控件间连续查看。", rows: [
    { attr: "delay", type: "number", defaultValue: "200", description: "首次显示提示的等待时间，单位毫秒。" },
    { attr: "warmWindow", type: "number", defaultValue: "500", description: "关闭提示后，组内其他提示可立即显示的时间窗口，单位毫秒。" },
    { attr: "children", type: "ReactNode", defaultValue: "—", description: "需要统一管理提示的控件。" },
  ] }],
  agent: [{ title: "AddMember", description: "搜索和多选成员，提交后显示添加结果。", rows: [
    { attr: "members", type: "AddMemberItem[]", defaultValue: "—", description: "成员列表，包含标识、姓名及可选头像和角色。" },
    { attr: "onAdd", type: "(ids: string[]) => void | Promise<void>", defaultValue: "—", description: "提交选中的成员，可返回异步添加结果。" },
    { attr: "rows", type: "number", defaultValue: "4", description: "每页展示的成员行数。" },
    { attr: "labels", type: "Partial<AddMemberLabels>", defaultValue: "中文文案", description: "覆盖搜索、分页、添加及结果提示。" },
    ...common,
  ] }],
  "input-field": [{ title: "OtpInput", description: "输入并校验验证码，展示验证中、成功和错误状态。", rows: [
    { attr: "length", type: "number", defaultValue: "6", description: "验证码位数。" },
    { attr: "verify", type: "(code: string) => boolean | Promise<boolean>", defaultValue: "—", description: "验证完整验证码，返回是否通过。" },
    { attr: "locale", type: "'zh' | 'en'", defaultValue: "'zh'", description: "内置提示的语言，也可分别覆盖提示文字。" },
    ...common,
  ] }],
  tab: [{ title: "TabsContent", description: "为页签内容提供淡入、滑动及拖动切换。", rows: [
    { attr: "activeKey", type: "string | number", defaultValue: "—", description: "当前内容标识。" },
    { attr: "transition", type: "'fade' | 'slide'", defaultValue: "'fade'", description: "内容进入和切换方式。" },
    { attr: "panels", type: "{ key: string | number; content: ReactNode }[]", defaultValue: "—", description: "提供完整内容列表后启用触摸滚动和鼠标拖动。" },
    { attr: "onActiveKeyChange", type: "(key: string | number) => void", defaultValue: "—", description: "拖动切换后通知应用更新当前标识。" }, ...common,
  ] }, { title: "LiquidTabs", description: "切换内容分类，分类较多时通过更多菜单选择。", rows: [
    { attr: "tabs", type: "LiquidTabsTab[]", defaultValue: "—", description: "分类及各分类中的内容列表。" },
    { attr: "value / defaultValue", type: "string", defaultValue: "首个分类", description: "当前分类，或非受控模式的初始分类。" },
    { attr: "onValueChange", type: "(id: string) => void", defaultValue: "—", description: "切换分类时触发。" },
    { attr: "onSelect", type: "(item: LiquidTabsItem, tabId: string) => void", defaultValue: "—", description: "点击分类内的内容时触发。" },
    ...common,
  ] }],
  modal: [{ title: "ToastProvider", description: "在上下文内调用 useToast 展示、更新和关闭通知。", rows: [
    { attr: "locale", type: "'zh' | 'en'", defaultValue: "'zh'", description: "通知关闭按钮的语言。" },
    { attr: "stacked", type: "boolean", defaultValue: "false", description: "是否将多条通知叠放展示。" }, ...common,
  ] }, { title: "Drawer", description: "在页面侧边展开补充内容，关闭后返回原操作位置。", rows: [
    { attr: "open", type: "boolean", defaultValue: "—", description: "是否打开抽屉。" },
    { attr: "onOpenChange", type: "(open: boolean) => void", defaultValue: "—", description: "请求打开或关闭时通知应用更新状态。" },
    { attr: "children", type: "ReactNode", defaultValue: "—", description: "抽屉内容。" },
    ...common,
  ] }],
};
export function AdditionalComponentApi({ family, name, exclude = [] }: { family: string; name?: string; exclude?: string[] }) {
  return <>{references[family]?.filter(reference => (!name || reference.title === name) && !exclude.includes(reference.title)).map(reference => name ? <div key={reference.title}><h3 className="mb-3 text-sm font-semibold text-fg-grey-700">参数说明</h3><ApiTable rows={reference.rows} /></div> : <Section key={reference.title} title={reference.title} description={reference.description}><ApiTable rows={reference.rows} /></Section>)}</>;
}
