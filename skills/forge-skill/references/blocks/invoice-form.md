# 新建发票表单

分类：表单。选择付款客户、填写收费明细，自动汇总优惠、税额与应收合计后发送发票。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Button、IconButton、Panel、PlusIcon、SelectOption、TextField、cn。

## 最小可用示例

```tsx
import { InvoiceForm } from "@/components/blocks/invoice-form";

export default function Example() {
  return (<InvoiceForm onSend={(value, total) => console.log(value.invoiceId, total)} />);
}
```

## InvoiceForm Props

| Prop | 必填 | Type |
|---|---|---|
| value | 否 | `InvoiceFormValue \| undefined` |
| onSave | 否 | `((value: InvoiceFormValue) => void) \| undefined` |
| onSend | 否 | `((value: InvoiceFormValue, total: number) => void) \| undefined` |
| onCancel | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |
