# 新建订单表单

分类：表单。商品、客户与配送三段式录单表单，带必填校验、金额实时计算与图片上传。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Button、MediaUpload、SelectOption、TextArea、TextField、cn。

## 最小可用示例

```tsx
import { OrderForm } from "@/components/blocks/order-form";

export default function Example() {
  return (<OrderForm onSubmit={value => console.log(value.customer)} onCancel={() => {}} />);
}
```

## OrderForm Props

| Prop | 必填 | Type |
|---|---|---|
| value | 否 | `OrderFormValue \| undefined` |
| onSubmit | 否 | `((value: OrderFormValue, images: MediaItem[]) => void) \| undefined` |
| onCancel | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |
