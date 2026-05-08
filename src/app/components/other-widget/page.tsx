"use client";

import Link from "next/link";
import { CurrencyConverter, RatingStars, ImageGrid, ProductRow } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { CurrencyConverter, RatingStars, ImageGrid, ProductRow } from "@forge-ui-official/core";`;

const CODE_CURRENCY_USAGE = `<CurrencyConverter
  title="Exchange"
  subtitle="Live rates"
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
  title="Product Name"
  subtitle="3 Variants"
/>`;

const CURRENCY_PROPS: ApiTableRow[] = [
  { attr: "title / subtitle", type: "string", defaultValue: "'Title Here' / 'Text here'", description: "卡片头部文案。" },
  { attr: "color", type: "'purple' | 'blue' | 'dark'", defaultValue: "'purple'", description: "Convert 按钮颜色。" },
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
  { attr: "overflowClassName", type: "string", defaultValue: "purple", description: "溢出块的配色 class，默认紫色调。" },
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
        title="Other Widget"
        hint="四个独立小部件：CurrencyConverter / RatingStars / ImageGrid / ProductRow。"
      />

      <Section
        title="CurrencyConverter"
        description="货币兑换卡片。两个输入 + 汇率说明 + Convert 按钮。3 种按钮色。"
      >
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_CURRENCY_USAGE} minHeight={360}>
            <CurrencyConverter
              title="Exchange"
              subtitle="Live rates"
              fromCurrency="USD"
              toCurrency="EUR"
              exchangeRateText="1 USD = 0.92 EUR"
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={CURRENCY_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="RatingStars"
        description="评分星级。数字 + N 颗星（solar-icon-set StarBold）。"
      >
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_RATING_USAGE}>
            <RatingStars value={4.2} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="Sizes" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 种尺寸，<InlineCode>md</InlineCode> 为默认（16px 星 + 14px 字号）。
          </p>
          <PreviewBlock code={CODE_RATING_SIZES}>
            <RatingStars value={4.2} size="sm" />
            <RatingStars value={4.2} size="md" />
            <RatingStars value={4.2} size="lg" />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={RATING_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="ImageGrid"
        description="水平图片排列，支持尾部 +N 占位。"
      >
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_IMAGEGRID_USAGE}>
            <ImageGrid images={gridImages} overflowCount={3} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={IMAGEGRID_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="ProductRow"
        description="紧凑产品行：44×44 缩略图 + 标题 + 副标题。无外框，常用在 list / dropdown 里。"
      >
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_PRODUCTROW_USAGE}>
            <ProductRow
              image="https://i.pravatar.cc/44?img=20"
              title="Product Name"
              subtitle="3 Variants"
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={PRODUCTROW_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/other-widget" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
