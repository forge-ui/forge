# 知识库

分类：协作与项目。按分类与收藏浏览团队文档，支持搜索、收藏与新建文档。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Avatar、Button、FileTypeIcon、Panel、PlusIcon、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { KnowledgeLibrary } from "@/components/blocks/knowledge-library";

export default function Example() {
  return (<KnowledgeLibrary onOpen={doc => console.log(doc.title)} />);
}
```

## KnowledgeLibrary Props

| Prop | 必填 | Type |
|---|---|---|
| documents | 否 | `LibraryDocument[] \| undefined` |
| onCreate | 否 | `(() => void) \| undefined` |
| onOpen | 否 | `((document: LibraryDocument) => void) \| undefined` |
| className | 否 | `string \| undefined` |
