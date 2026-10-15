import {
  NotificationBadge,
  Label,
  CircleIcon,
  ArtisticIcon,
} from "@forge-ui-official/core";
import { BellBoldDuotone } from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

// ─── 代码片段 ───

const CODE_IMPORT = `import { NotificationBadge, Label, CircleIcon, ArtisticIcon } from "@forge-ui-official/core";`;

// NotificationBadge
const CODE_NB_USAGE = `<NotificationBadge>99+</NotificationBadge>
<NotificationBadge color="orange">5</NotificationBadge>
<NotificationBadge color="green">新增</NotificationBadge>`;

const CODE_NB_COLORS = `<NotificationBadge color="purple">99+</NotificationBadge>
<NotificationBadge color="orange">99+</NotificationBadge>
<NotificationBadge color="green">99+</NotificationBadge>
<NotificationBadge color="yellow">99+</NotificationBadge>
<NotificationBadge color="cyan">99+</NotificationBadge>
<NotificationBadge color="black">99+</NotificationBadge>`;

const NB_PROPS: ApiTableRow[] = [
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "徽章内容，通常是数字或极短文字。" },
  { attr: "color", type: "'purple' | 'orange' | 'green' | 'yellow' | 'cyan' | 'black'", defaultValue: "'purple'", description: "主色，共 6 种。" },
  { attr: "className", type: "string", defaultValue: "—", description: "额外 className。" },
];

// Label
const CODE_LABEL_USAGE = `<Label>默认</Label>
<Label color="blue" variant="outline">描边</Label>
<Label color="green" variant="solid">实底</Label>`;

const CODE_LABEL_COLORS = `<Label color="purple">紫色</Label>
<Label color="blue">蓝色</Label>
<Label color="cyan">青色</Label>
<Label color="green">绿色</Label>
<Label color="red">红色</Label>
<Label color="yellow">黄色</Label>
<Label color="gray">灰色</Label>`;

const CODE_LABEL_SIZES = `<Label size="lg">大</Label>
<Label size="md">中</Label>
<Label size="sm">小</Label>`;

const CODE_LABEL_VARIANT = `<Label variant="outline">描边</Label>
<Label variant="solid">实底</Label>`;

const LABEL_PROPS: ApiTableRow[] = [
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "标签内容。" },
  { attr: "color", type: "'purple' | 'blue' | 'cyan' | 'green' | 'red' | 'yellow' | 'gray'", defaultValue: "'purple'", description: "主色，共 7 种。" },
  { attr: "size", type: "'lg' | 'md' | 'sm'", defaultValue: "'md'", description: "标签尺寸。" },
  { attr: "variant", type: "'outline' | 'solid'", defaultValue: "'outline'", description: "描边或实底样式。" },
  { attr: "className", type: "string", defaultValue: "—", description: "额外 className。" },
];

// CircleIcon
const CODE_CIRCLE_USAGE = `<CircleIcon color="purple" variant="solid">
  <BellBoldDuotone size={18} />
</CircleIcon>`;

const CODE_CIRCLE_VARIANTS = `<CircleIcon variant="solid"><BellBoldDuotone size={18} /></CircleIcon>
<CircleIcon variant="light"><BellBoldDuotone size={18} /></CircleIcon>
<CircleIcon variant="neutral"><BellBoldDuotone size={18} /></CircleIcon>`;

const CODE_CIRCLE_SIZES = `<CircleIcon size="lg"><BellBoldDuotone size={24} /></CircleIcon>
<CircleIcon size="md"><BellBoldDuotone size={18} /></CircleIcon>
<CircleIcon size="sm"><BellBoldDuotone size={16} /></CircleIcon>
<CircleIcon size="xs"><BellBoldDuotone size={12} /></CircleIcon>`;

const CODE_CIRCLE_COLORS = `<CircleIcon color="purple">...</CircleIcon>
<CircleIcon color="blue">...</CircleIcon>
<CircleIcon color="green">...</CircleIcon>
<CircleIcon color="red">...</CircleIcon>
<CircleIcon color="yellow">...</CircleIcon>`;

const CIRCLE_PROPS: ApiTableRow[] = [
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "内嵌图标，推荐 @forge-ui-official/core/icons BoldDuotone。" },
  { attr: "color", type: "'purple' | 'blue' | 'red' | 'orange' | 'green' | 'yellow' | 'cyan' | 'black'", defaultValue: "'purple'", description: "主色，共 8 种。" },
  { attr: "variant", type: "'solid' | 'light' | 'neutral'", defaultValue: "'solid'", description: "实底 / 浅底 / 中性灰底。" },
  { attr: "size", type: "'lg' | 'md' | 'sm' | 'xs'", defaultValue: "'md'", description: "圆形直径，分别对应 40/32/28/20 px。" },
];

// ArtisticIcon
const CODE_ART_USAGE = `<ArtisticIcon color="purple" variant="gradient">
  <BellBoldDuotone size={24} />
</ArtisticIcon>`;

const CODE_ART_VARIANTS = `<ArtisticIcon variant="gradient"><BellBoldDuotone size={24} /></ArtisticIcon>
<ArtisticIcon variant="orbs"><BellBoldDuotone size={24} /></ArtisticIcon>`;

const CODE_ART_COLORS = `<ArtisticIcon color="black">...</ArtisticIcon>
<ArtisticIcon color="blue">...</ArtisticIcon>
<ArtisticIcon color="purple">...</ArtisticIcon>
<ArtisticIcon color="green">...</ArtisticIcon>
<ArtisticIcon color="red">...</ArtisticIcon>
<ArtisticIcon color="yellow">...</ArtisticIcon>
<ArtisticIcon color="cyan">...</ArtisticIcon>`;

const ART_PROPS: ApiTableRow[] = [
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "内嵌图标，推荐 @forge-ui-official/core/icons 24px BoldDuotone。" },
  { attr: "color", type: "'black' | 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'cyan'", defaultValue: "'purple'", description: "主色，共 7 种。" },
  { attr: "variant", type: "'gradient' | 'orbs'", defaultValue: "'gradient'", description: "渐变底 或 浮光球装饰。" },
];

export default function BadgeCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="徽章与标签"
        hint="展示数量、状态和分类，或用图标强调重要入口。"
      />

      <Section
        title="NotificationBadge"
        description="用数字标记未读数量或待处理事项。"
      >
        <SubSection title="导入组件" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            通过 children 传数字或极短文字，<InlineCode>color</InlineCode> 切换主色。
          </p>
          <PreviewBlock code={CODE_NB_USAGE} minHeight={140}>
            <NotificationBadge>99+</NotificationBadge>
            <NotificationBadge color="orange">5</NotificationBadge>
            <NotificationBadge color="green">新增</NotificationBadge>
          </PreviewBlock>
        </SubSection>

        <SubSection title="颜色" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            6 种颜色：purple / orange / green / yellow / cyan / black。
          </p>
          <PreviewBlock code={CODE_NB_COLORS} minHeight={140}>
            <NotificationBadge color="purple">99+</NotificationBadge>
            <NotificationBadge color="orange">99+</NotificationBadge>
            <NotificationBadge color="green">99+</NotificationBadge>
            <NotificationBadge color="yellow">99+</NotificationBadge>
            <NotificationBadge color="cyan">99+</NotificationBadge>
            <NotificationBadge color="black">99+</NotificationBadge>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={NB_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="Label"
        description="用文字标签标记状态、分类和类别。"
      >
        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            通过 <InlineCode>color</InlineCode> / <InlineCode>variant</InlineCode> / <InlineCode>size</InlineCode> 三维控制。
          </p>
          <PreviewBlock code={CODE_LABEL_USAGE} minHeight={140}>
            <Label>默认</Label>
            <Label color="blue" variant="outline">描边</Label>
            <Label color="green" variant="solid">实底</Label>
          </PreviewBlock>
        </SubSection>

        <SubSection title="颜色" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            7 种主色：purple / blue / cyan / green / red / yellow / gray。
          </p>
          <PreviewBlock code={CODE_LABEL_COLORS} minHeight={140}>
            <Label color="purple">紫色</Label>
            <Label color="blue">蓝色</Label>
            <Label color="cyan">青色</Label>
            <Label color="green">绿色</Label>
            <Label color="red">红色</Label>
            <Label color="yellow">黄色</Label>
            <Label color="gray">灰色</Label>
          </PreviewBlock>
        </SubSection>

        <SubSection title="尺寸" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 种尺寸：<InlineCode>lg</InlineCode> / <InlineCode>md</InlineCode> / <InlineCode>sm</InlineCode>。
          </p>
          <PreviewBlock code={CODE_LABEL_SIZES} minHeight={140}>
            <Label size="lg">大</Label>
            <Label size="md">中</Label>
            <Label size="sm">小</Label>
          </PreviewBlock>
        </SubSection>

        <SubSection title="样式" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>outline</InlineCode> 浅底描边（默认），<InlineCode>solid</InlineCode> 实底强调。
          </p>
          <PreviewBlock code={CODE_LABEL_VARIANT} minHeight={140}>
            <Label color="purple" variant="outline">描边</Label>
            <Label color="purple" variant="solid">实底</Label>
            <Label color="green" variant="outline">描边</Label>
            <Label color="green" variant="solid">实底</Label>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={LABEL_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="CircleIcon"
        description="将图标放在圆形容器中，适合列表和卡片入口。"
      >
        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            以 children 传入 @forge-ui-official/core/icons 图标即可，尺寸随 <InlineCode>size</InlineCode> 自动协调。
          </p>
          <PreviewBlock code={CODE_CIRCLE_USAGE} minHeight={140}>
            <CircleIcon color="purple" variant="solid">
              <BellBoldDuotone size={18} />
            </CircleIcon>
            <CircleIcon color="blue" variant="light">
              <BellBoldDuotone size={18} />
            </CircleIcon>
            <CircleIcon color="green" variant="neutral">
              <BellBoldDuotone size={18} />
            </CircleIcon>
          </PreviewBlock>
        </SubSection>

        <SubSection title="样式" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>solid</InlineCode> 实底，<InlineCode>light</InlineCode> 浅底，<InlineCode>neutral</InlineCode> 中性灰底。
          </p>
          <PreviewBlock code={CODE_CIRCLE_VARIANTS} minHeight={140}>
            <CircleIcon variant="solid">
              <BellBoldDuotone size={18} />
            </CircleIcon>
            <CircleIcon variant="light">
              <BellBoldDuotone size={18} />
            </CircleIcon>
            <CircleIcon variant="neutral">
              <BellBoldDuotone size={18} />
            </CircleIcon>
          </PreviewBlock>
        </SubSection>

        <SubSection title="尺寸" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            4 种尺寸：lg / md / sm / xs，图标大小需手动协调。
          </p>
          <PreviewBlock code={CODE_CIRCLE_SIZES} minHeight={140}>
            <CircleIcon size="lg">
              <BellBoldDuotone size={24} />
            </CircleIcon>
            <CircleIcon size="md">
              <BellBoldDuotone size={18} />
            </CircleIcon>
            <CircleIcon size="sm">
              <BellBoldDuotone size={16} />
            </CircleIcon>
            <CircleIcon size="xs">
              <BellBoldDuotone size={12} />
            </CircleIcon>
          </PreviewBlock>
        </SubSection>

        <SubSection title="颜色" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            8 种主色，示例为 solid 变体。
          </p>
          <PreviewBlock code={CODE_CIRCLE_COLORS} minHeight={140}>
            <CircleIcon color="purple"><BellBoldDuotone size={18} /></CircleIcon>
            <CircleIcon color="blue"><BellBoldDuotone size={18} /></CircleIcon>
            <CircleIcon color="red"><BellBoldDuotone size={18} /></CircleIcon>
            <CircleIcon color="orange"><BellBoldDuotone size={18} /></CircleIcon>
            <CircleIcon color="green"><BellBoldDuotone size={18} /></CircleIcon>
            <CircleIcon color="yellow"><BellBoldDuotone size={18} /></CircleIcon>
            <CircleIcon color="cyan"><BellBoldDuotone size={18} /></CircleIcon>
            <CircleIcon color="black"><BellBoldDuotone size={18} /></CircleIcon>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={CIRCLE_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="ArtisticIcon"
        description="用带装饰效果的图标强调功能入口。"
      >
        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            body 传入 24px 图标，<InlineCode>variant</InlineCode> 切换渐变或光球。
          </p>
          <PreviewBlock code={CODE_ART_USAGE} minHeight={160}>
            <ArtisticIcon color="purple" variant="gradient">
              <BellBoldDuotone size={24} />
            </ArtisticIcon>
            <ArtisticIcon color="blue" variant="orbs">
              <BellBoldDuotone size={24} />
            </ArtisticIcon>
          </PreviewBlock>
        </SubSection>

        <SubSection title="样式" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>gradient</InlineCode> 平滑渐变底；<InlineCode>orbs</InlineCode> 附加浮动高光球。
          </p>
          <PreviewBlock code={CODE_ART_VARIANTS} minHeight={160}>
            <ArtisticIcon variant="gradient">
              <BellBoldDuotone size={24} />
            </ArtisticIcon>
            <ArtisticIcon variant="orbs">
              <BellBoldDuotone size={24} />
            </ArtisticIcon>
          </PreviewBlock>
        </SubSection>

        <SubSection title="颜色" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            7 种主色。
          </p>
          <PreviewBlock code={CODE_ART_COLORS} minHeight={160}>
            <ArtisticIcon color="black"><BellBoldDuotone size={24} /></ArtisticIcon>
            <ArtisticIcon color="blue"><BellBoldDuotone size={24} /></ArtisticIcon>
            <ArtisticIcon color="purple"><BellBoldDuotone size={24} /></ArtisticIcon>
            <ArtisticIcon color="green"><BellBoldDuotone size={24} /></ArtisticIcon>
            <ArtisticIcon color="red"><BellBoldDuotone size={24} /></ArtisticIcon>
            <ArtisticIcon color="yellow"><BellBoldDuotone size={24} /></ArtisticIcon>
            <ArtisticIcon color="cyan"><BellBoldDuotone size={24} /></ArtisticIcon>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={ART_PROPS} />
        </SubSection>
      </Section>
    </div>
  );
}
