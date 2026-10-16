"use client";

import { CurrencyConverter, RatingStars, ImageGrid, ProductRow } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample, ExampleGrid } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { CurrencyConverter, RatingStars, ImageGrid, ProductRow } from "@forge-ui-official/core";`;

const CODE_CURRENCY_USAGE = `<CurrencyConverter
  title="兑换"
  subtitle="实时汇率"
  fromCurrency="USD"
  toCurrency="EUR"
  exchangeRateText="1 USD = 0.92 EUR"
/>`;

const CODE_RATING_USAGE = `<RatingStars value={4.2} />`;

const CODE_RATING_SIZES = `<RatingStars value={4.2} size="sm" />
<RatingStars value={4.2} size="md" />
<RatingStars value={4.2} size="lg" />`;

const CODE_IMAGEGRID_USAGE = `<ImageGrid images={urls} overflowCount={3} />`;

const CODE_PRODUCTROW_USAGE = `<ProductRow
  image="https://i.pravatar.cc/44?img=20"
  title="商品名称"
  subtitle="3 种规格"
/>`;

const CURRENCY_PROPS: ApiTableRow[] = [
  { attr: "title / subtitle", type: "string", defaultValue: "'汇率换算' / '实时估算仅供参考'", description: "卡片头部文案。" },
  { attr: "color", type: "'purple' | 'blue' | 'dark'", defaultValue: "'blue'", description: "换算按钮的颜色。" },
  { attr: "fromCurrency / toCurrency", type: "string", defaultValue: "'USD'", description: "两个输入框的货币代码。" },
  { attr: "fromValue / toValue", type: "string", defaultValue: "—", description: "受控值。传了就用 controlled 模式，不传用 placeholder。" },
  { attr: "exchangeRateText", type: "string", defaultValue: "'1 EUR = 1.09 USD'", description: "底部汇率说明。" },
  { attr: "onConvert / onFromChange / onToChange", type: "() => void | (v: string) => void", defaultValue: "—", description: "交互回调。" },
];

const RATING_PROPS: ApiTableRow[] = [
  { attr: "value", type: "number", defaultValue: "—", description: "评分值，0-5（或自定义 total）。" },
  { attr: "total", type: "number", defaultValue: "5", description: "总星数。" },
  { attr: "showValue", type: "boolean", defaultValue: "true", description: "是否显示 \"X.X/N\" 数字。" },
  { attr: "size", type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: "尺寸。" },
];

const IMAGEGRID_PROPS: ApiTableRow[] = [
  { attr: "images", type: "string[]", defaultValue: "—", description: "图片 URL 数组，横向并列渲染。" },
  { attr: "size", type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: "单图尺寸（sm 48 / md 64 / lg 80）。" },
  { attr: "overflowCount", type: "number", defaultValue: "—", description: "尾部 +N 占位，> 0 时才渲染。" },
  { attr: "overflowClassName", type: "string", defaultValue: "bg-fg-blue-50 text-fg-blue", description: "溢出块的配色 class，默认 Forge 蓝。" },
];

const PRODUCTROW_PROPS: ApiTableRow[] = [
  { attr: "image", type: "string", defaultValue: "—", description: "左侧 44×44 缩略图 URL。" },
  { attr: "imageSlot", type: "ReactNode", defaultValue: "—", description: "自定义图槽（优先级高于 image）。" },
  { attr: "title", type: "string", defaultValue: "—", description: "主标题。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "副标题。" },
];

const gridImages = [
  "https://i.pravatar.cc/64?img=21",
  "https://i.pravatar.cc/64?img=22",
  "https://i.pravatar.cc/64?img=23",
];

export default function OtherWidgetCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="实用组件"
        hint="换算、评分、图片和商品行各做一件事。星级尺寸只演示一次。"
      />

      <Section title="用法" description="从货币换算卡片开始。金额和汇率文案由外面传入。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <SubSection title="最小示例" stack>
          <DocExample id="currencyconverter" title="CurrencyConverter" summary="左右两个币种，底部是汇率说明。" code={CODE_CURRENCY_USAGE} minHeight={360}>
            <CurrencyConverter title="兑换" subtitle="实时汇率" fromCurrency="USD" toCurrency="EUR" exchangeRateText="1 USD = 0.92 EUR" />
          </DocExample>
        </SubSection>
      </Section>

      <Section title="例子">
        <ExampleGrid>
          <DocExample id="ratingstars" title="RatingStars" summary="sm、md、lg 三档，分值算法相同。" code={CODE_RATING_SIZES}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <RatingStars value={4.2} size="sm" />
              <RatingStars value={4.2} size="md" />
              <RatingStars value={4.2} size="lg" />
            </div>
          </DocExample>
          <DocExample id="imagegrid" title="ImageGrid" summary="横向排图片。overflowCount 把装不下的数量收成 +N。" code={CODE_IMAGEGRID_USAGE}>
            <ImageGrid images={gridImages} overflowCount={3} />
          </DocExample>
          <DocExample id="productrow" title="ProductRow" summary="一行商品：缩略图、名称和规格说明。" code={CODE_PRODUCTROW_USAGE}>
            <ProductRow image="https://i.pravatar.cc/44?img=20" title="商品名称" subtitle="3 种规格" />
          </DocExample>
        </ExampleGrid>
      </Section>

      <Section title="API">
        <ApiBlock id="currencyconverter" title="CurrencyConverter" rows={CURRENCY_PROPS} />
        <ApiBlock id="ratingstars" title="RatingStars" rows={RATING_PROPS} />
        <ApiBlock id="imagegrid" title="ImageGrid" rows={IMAGEGRID_PROPS} />
        <ApiBlock id="productrow" title="ProductRow" rows={PRODUCTROW_PROPS} />
      </Section>
    </div>
  );
}
