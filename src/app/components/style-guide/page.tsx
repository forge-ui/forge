import {
  ColorSwatch,
  ColorSection,
  TypefaceBlock,
  TypographyWeightSample,
  TypographySizeRow,
  type ColorScaleStop,
} from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { AnatomyLinks } from "../_anatomy-links";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const buildScale = (hexes: readonly string[]): ColorScaleStop[] =>
  hexes.map((hex, i) => ({ shade: String(i === 0 ? 50 : i * 100), hex }));

const colorFamilies = [
  { title: "紫色", darkLabelUntil: 200, hexes: ["#F1EBFD", "#D3C2F8", "#BEA4F5", "#A17AF1", "#8E61EE", "#7239EA", "#6834D5", "#5128A6", "#3F1F81", "#301862"] },
  { title: "蓝色",   darkLabelUntil: 200, hexes: ["#EBEEFF", "#C0CAFF", "#A2B0FF", "#788CFF", "#5D75FF", "#3553FF", "#304CE8", "#263BB5", "#1D2E8C", "#16236B"] },
  { title: "绿色",  darkLabelUntil: 400, hexes: ["#E6F8F0", "#B3E9D2", "#8EDFBC", "#5AD09D", "#3AC78A", "#09B96D", "#08A863", "#06834D", "#05663C", "#044E2E"] },
  { title: "红色",    darkLabelUntil: 300, hexes: ["#FFEDE9", "#FFC7BB", "#FFAC9A", "#FE866C", "#FE6E4F", "#FE4A23", "#E74320", "#B43519", "#8C2913", "#6B1F0F"] },
  { title: "黄色", darkLabelUntil: 600, hexes: ["#FEF9E6", "#FCEBB1", "#FBE28B", "#F9D555", "#F8CD35", "#F6C002", "#E0AF02", "#AF8801", "#876A01", "#675101"] },
  { title: "青色",   darkLabelUntil: 600, hexes: ["#ECFAFB", "#C5F0F3", "#A9E8ED", "#81DEE4", "#69D8DF", "#43CED7", "#3DBBC4", "#309299", "#257176", "#1C575A"] },
  { title: "黑色",  darkLabelUntil: 100, hexes: ["#E6E7E8", "#B0B3B8", "#8A8E95", "#545B65", "#333B47", "#000A19", "#000917", "#000712", "#00060E", "#00040B"] },
  { title: "灰色",   darkLabelUntil: 600, hexes: ["#F8F8F8", "#EBEBEB", "#E1E1E1", "#D3D3D3", "#CACACA", "#BDBDBD", "#ACACAC", "#868686", "#686868", "#4F4F4F"] },
];

const CODE_IMPORT = `import {
  ColorSwatch, ColorSection,
  TypefaceBlock, TypographyWeightSample, TypographySizeRow,
} from "@forge-ui-official/core";`;

const CODE_SWATCH = `<ColorSwatch label="Purple 500" hex="#8E61EE" tone="light" />`;

const CODE_SECTION = `<ColorSection
  title="紫色"
  darkLabelUntil={200}
  scale={[
    { shade: "50", hex: "#F1EBFD" },
    { shade: "100", hex: "#D3C2F8" },
    { shade: "500", hex: "#8E61EE" },
    { shade: "900", hex: "#301862" },
  ]}
/>`;

const CODE_TYPEFACE = `<TypefaceBlock name="Plus Jakarta Sans" />`;

const CODE_WEIGHT = `<TypographyWeightSample text="Display" weight={700} sizeClass="text-2xl leading-8" />`;

const CODE_SIZE_ROW = `<TypographySizeRow label="Display M - 24px" text="Display" sizeClass="text-2xl leading-8" />`;

const SWATCH_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "—", description: "色卡左上角标签。" },
  { attr: "hex", type: "string", defaultValue: "—", description: "背景色 HEX 值，右下角 pill 会显示大写去号版本。" },
  { attr: "tone", type: "'dark' | 'light'", defaultValue: "—", description: "决定 label 字色：深色底用 light，浅色底用 dark。" },
  { attr: "size", type: "'sm' | 'md' | 'lg'", defaultValue: "'sm'", description: "色卡尺寸，控制宽高、label 字号与 pill 内边距。" },
];

const SECTION_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "色系标题，同时作为每个 swatch 的 label 前缀。" },
  { attr: "scale", type: "{ shade: string; hex: string }[]", defaultValue: "—", description: "色阶数组，通常 10 档（50 / 100-900）。" },
  { attr: "darkLabelUntil", type: "number", defaultValue: "—", description: "shade 值 ≤ 此值的用深色文字，超过则白字。" },
  { attr: "swatchSize", type: "'sm' | 'md' | 'lg'", defaultValue: "'sm'", description: "每个 swatch 的尺寸。" },
];

const TYPEFACE_PROPS: ApiTableRow[] = [
  { attr: "name", type: "string", defaultValue: "—", description: "字体名称，显示在 Aa 右侧。" },
  { attr: "sample", type: "string", defaultValue: "'Aa'", description: "大字展示内容。" },
];

const WEIGHT_PROPS: ApiTableRow[] = [
  { attr: "text", type: "string", defaultValue: "—", description: "展示文案。" },
  { attr: "weight", type: "400 | 500 | 600 | 700", defaultValue: "—", description: "字重档位。" },
  { attr: "sizeClass", type: "string", defaultValue: "—", description: "Tailwind 字号 / 行高 class，如 text-2xl leading-8。" },
];

const SIZEROW_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "—", description: "行标题（如 Display XL - 32px）。" },
  { attr: "text", type: "string", defaultValue: "—", description: "每列展示文案。" },
  { attr: "sizeClass", type: "string", defaultValue: "—", description: "Tailwind 字号 / 行高 class。" },
];

const purpleScale = [
  { shade: "50", hex: "#F1EBFD" },
  { shade: "100", hex: "#D3C2F8" },
  { shade: "500", hex: "#8E61EE" },
  { shade: "900", hex: "#301862" },
];

export default function StyleGuideCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="设计规范"
        hint="了解 Forge 的颜色、字体、字号和字重，建立一致的界面风格。"
      />

      <AnatomyLinks />

      <Section
        title="配色体系"
        description="查看 Forge 的色系、色阶和基础颜色。"
      >
        <div className="flex flex-col gap-8 w-full">
          {colorFamilies.map((f) => (
            <ColorSection
              key={f.title}
              title={f.title}
              scale={buildScale(f.hexes)}
              darkLabelUntil={f.darkLabelUntil}
            />
          ))}
          <div className="flex flex-col items-start gap-4 w-full">
            <h3 className="text-xl font-semibold tracking-tight text-fg-black">白色</h3>
            <ColorSwatch label="白色" hex="#FFFFFF" tone="dark" />
          </div>
        </div>
      </Section>

      <Section
        title="字体与字号"
        description="查看标题与正文的字体、字号和四档字重。"
      >
        <div className="flex flex-col gap-10 w-full">
          <TypefaceBlock name="Plus Jakarta Sans" />

          <div className="self-stretch h-px bg-fg-grey-200" />

          <div className="flex flex-col gap-10">
            <TypographySizeRow label="Display XL - 32px" text="Display" sizeClass="text-[32px] leading-[44px]" />
            <TypographySizeRow label="Display L - 28px"  text="Display" sizeClass="text-[28px] leading-9" />
            <TypographySizeRow label="Display M - 24px"  text="Display" sizeClass="text-2xl leading-8" />
            <TypographySizeRow label="Display S - 20px"  text="Display" sizeClass="text-xl leading-7" />
          </div>

          <div className="self-stretch h-px bg-fg-grey-200" />

          <div className="flex flex-col gap-10">
            <TypographySizeRow label="Text XL - 18px" text="Text" sizeClass="text-lg leading-7" />
            <TypographySizeRow label="Text L - 16px"  text="Text" sizeClass="text-base leading-6" />
            <TypographySizeRow label="Text M - 14px"  text="Text" sizeClass="text-sm leading-5" />
            <TypographySizeRow label="Text S - 12px"  text="Text" sizeClass="text-xs leading-4" />
            <TypographySizeRow label="Text XS - 10px" text="Text" sizeClass="text-[10px] leading-4" />
          </div>
        </div>
      </Section>

      <Section
        title="ColorSwatch"
        description="展示颜色名称和色值。"
      >
        <SubSection title="导入组件" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            通过 <InlineCode>tone</InlineCode> 控制标签字色，<InlineCode>size</InlineCode> 控制尺寸。
          </p>
          <PreviewBlock code={CODE_SWATCH} minHeight={200}>
            <ColorSwatch label="Purple 500" hex="#8E61EE" tone="light" size="md" />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={SWATCH_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="ColorSection"
        description="展示同一色系的各档色阶。"
      >
        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            把完整 10 档色阶传入 <InlineCode>scale</InlineCode>，<InlineCode>darkLabelUntil</InlineCode> 控制字色翻转阈值。
          </p>
          <PreviewBlock code={CODE_SECTION} minHeight={160}>
            <div className="w-full">
              <ColorSection title="紫色" scale={purpleScale} darkLabelUntil={200} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={SECTION_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="TypefaceBlock"
        description="查看字体名称和字形样张。"
      >
        <SubSection title="使用方法" stack>
          <PreviewBlock code={CODE_TYPEFACE} minHeight={200}>
            <TypefaceBlock name="Plus Jakarta Sans" />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={TYPEFACE_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="TypographyWeightSample"
        description="比较同一字号下的不同字重。"
      >
        <SubSection title="使用方法" stack>
          <PreviewBlock code={CODE_WEIGHT} minHeight={140}>
            <TypographyWeightSample text="Display" weight={700} sizeClass="text-2xl leading-8" />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={WEIGHT_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="TypographySizeRow"
        description="比较不同字号和字重的文字效果。"
      >
        <SubSection title="使用方法" stack>
          <PreviewBlock code={CODE_SIZE_ROW} minHeight={180}>
            <div className="w-full">
              <TypographySizeRow label="Display M - 24px" text="Display" sizeClass="text-2xl leading-8" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={SIZEROW_PROPS} />
        </SubSection>
      </Section>
    </div>
  );
}
