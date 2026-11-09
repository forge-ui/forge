# 项目总览

分类：协作与项目。整体任务进度、各状态项目分布与需要关注的事项，项目可按状态筛选并在卡片和表格间切换。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Button、ButtonGroup、DataTable、Panel、PlusIcon、ProgressBar、StatusBadge、cn。

## 最小可用示例

```tsx
import { ProjectPortfolio } from "@/components/blocks/project-portfolio";

export default function Example() {
  return (<ProjectPortfolio onOpen={project => console.log(project.name)} />);
}
```

## ProjectPortfolio Props

| Prop | 必填 | Type |
|---|---|---|
| projects | 否 | `PortfolioProject[] \| undefined` |
| onCreate | 否 | `(() => void) \| undefined` |
| onOpen | 否 | `((project: PortfolioProject) => void) \| undefined` |
| className | 否 | `string \| undefined` |
