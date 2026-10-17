import MenuSectionsExample from "../../cases/menu-sections/page";
import { ApiTable, CodeBlock } from "../_api-table";
import { Section } from "../_shared";
export default function MenuSectionsPage() {
 return <><MenuSectionsExample /><Section title="使用方法"><CodeBlock code={'import { AppLayout } from "@forge-ui-official/core";\n\n<AppLayout menuSections={[\n  { label: "工作区", items: [{ label: "工作台", href: "/workspace" }] },\n  { label: "智能体", items: [{ label: "任务", href: "/tasks" }] },\n  { label: "平台", items: [{ label: "设置", href: "/settings" }] },\n]}>页面内容</AppLayout>'} /></Section><Section title="参数说明"><ApiTable rows={[
 { attr: "menuSections", type: "AppLayoutMenuSection[]", defaultValue: "—", description: "按顺序展示菜单分组，优先于旧菜单参数。空分组不显示。" },
 { attr: "menuSections[].label", type: "string", defaultValue: "—", description: "分组标题；不传或为空时不占用标题空间。" },
 { attr: "menuSections[].items", type: "AppLayoutMenuItem[]", defaultValue: "—", description: "菜单项；跨分组统一匹配当前路径，支持子菜单。" },
 { attr: "sidebarSlot", type: "ReactNode", defaultValue: "—", description: "自定义侧栏内容，优先于菜单分组。" },
 ]} /></Section></>;
}
