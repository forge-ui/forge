# 商品编辑表单

分类：表单。基本信息、图片、价格、库存、规格与物流分区的商品表单，侧栏设置分类与上架状态。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Button、Checkbox、ConfirmationDialog、IconButton、MediaUpload、PlusIcon、SelectOption、StatusBadge、TextArea、TextField、cn。

## 最小可用示例

```tsx
import { ProductForm } from "@/components/blocks/product-form";

export default function Example() {
  return (<ProductForm onSubmit={value => console.log(value.name)} onCancel={() => {}} />);
}
```

## ProductForm Props

| Prop | 必填 | Type |
|---|---|---|
| value | 否 | `ProductFormValue \| undefined` |
| media | 否 | `MediaItem[] \| undefined` |
| onSubmit | 否 | `((value: ProductFormValue) => void) \| undefined` |
| onCancel | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |
