import {
  NotificationBadge,
  Label,
  CircleIcon,
  ArtisticIcon,
} from "@forge-ui-official/core";
import { BellBoldDuotone } from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";

// ─── 代码片段 ───

const CODE_IMPORT = `import { NotificationBadge, Label, CircleIcon, ArtisticIcon } from "@forge-ui-official/core";`;

// NotificationBadge
const CODE_NB_USAGE = `<NotificationBadge>99+</NotificationBadge>
<NotificationBadge color="orange">5</NotificationBadge>
<NotificationBadge color="green">新增</NotificationBadge>`;

const CODE_NB_COLORS = `<NotificationBadge color="blue">99+</NotificationBadge>
<NotificationBadge color="purple">99+</NotificationBadge>
<NotificationBadge color="orange">99+</NotificationBadge>
<NotificationBadge color="green">99+</NotificationBadge>
<NotificationBadge color="yellow">99+</NotificationBadge>
<NotificationBadge color="cyan">99+</NotificationBadge>
<NotificationBadge color="black">99+</NotificationBadge>`;

const NB_PROPS: ApiTableRow[] = [
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "徽章内容，通常是数字或极短文字。" },
  { attr: "color", type: "'blue' | 'purple' | 'orange' | 'green' | 'yellow' | 'cyan' | 'black'", defaultValue: "'blue'", description: "主色，共 7 种。" },
  { attr: "className", type: "string", defaultValue: "—", description: "额外 className。" },
];

// Label
const CODE_LABEL_SIZES = `<Label size="lg">大</Label>
<Label size="md">中</Label>
<Label size="sm">小</Label>`;

const CODE_LABEL_VARIANT = `<Label variant="outline">描边</Label>
<Label variant="solid">实底</Label>`;

const LABEL_PROPS: ApiTableRow[] = [
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "标签内容。" },
  { attr: "color", type: "'purple' | 'blue' | 'cyan' | 'green' | 'red' | 'yellow' | 'gray'", defaultValue: "'blue'", description: "主色，共 7 种。" },
  { attr: "size", type: "'lg' | 'md' | 'sm'", defaultValue: "'md'", description: "标签尺寸。" },
  { attr: "variant", type: "'outline' | 'solid'", defaultValue: "'outline'", description: "描边或实底样式。" },
  { attr: "className", type: "string", defaultValue: "—", description: "额外 className。" },
];

// CircleIcon
const CODE_CIRCLE_VARIANTS = `<CircleIcon variant="solid"><BellBoldDuotone size={18} /></CircleIcon>
<CircleIcon variant="light"><BellBoldDuotone size={18} /></CircleIcon>
<CircleIcon variant="neutral"><BellBoldDuotone size={18} /></CircleIcon>`;

const CODE_CIRCLE_SIZES = `<CircleIcon size="lg"><BellBoldDuotone size={24} /></CircleIcon>
<CircleIcon size="md"><BellBoldDuotone size={18} /></CircleIcon>
<CircleIcon size="sm"><BellBoldDuotone size={16} /></CircleIcon>
<CircleIcon size="xs"><BellBoldDuotone size={12} /></CircleIcon>`;

const CIRCLE_PROPS: ApiTableRow[] = [
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "内嵌图标，推荐 @forge-ui-official/core/icons BoldDuotone。" },
  { attr: "color", type: "'purple' | 'blue' | 'red' | 'orange' | 'green' | 'yellow' | 'cyan' | 'black'", defaultValue: "'blue'", description: "主色，共 8 种。" },
  { attr: "variant", type: "'solid' | 'light' | 'neutral'", defaultValue: "'solid'", description: "实底 / 浅底 / 中性灰底。" },
  { attr: "size", type: "'lg' | 'md' | 'sm' | 'xs'", defaultValue: "'md'", description: "圆形直径，分别对应 40/32/28/20 px。" },
];

// ArtisticIcon
const CODE_ART_VARIANTS = `<ArtisticIcon variant="gradient"><BellBoldDuotone size={24} /></ArtisticIcon>
<ArtisticIcon variant="orbs"><BellBoldDuotone size={24} /></ArtisticIcon>`;

const CODE_NB_ALL = `${CODE_NB_USAGE}
<NotificationBadge color="blue">99+</NotificationBadge>
<NotificationBadge color="purple">99+</NotificationBadge>
<NotificationBadge color="yellow">99+</NotificationBadge>
<NotificationBadge color="cyan">99+</NotificationBadge>
<NotificationBadge color="black">99+</NotificationBadge>`;

const CODE_LABEL_ALL = `${CODE_LABEL_SIZES}
${CODE_LABEL_VARIANT}`;

const CODE_CIRCLE_ALL = `${CODE_CIRCLE_SIZES}
${CODE_CIRCLE_VARIANTS}`;

const ART_PROPS: ApiTableRow[] = [
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "内嵌图标，推荐 @forge-ui-official/core/icons 24px BoldDuotone。" },
  { attr: "color", type: "'black' | 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'cyan'", defaultValue: "'blue'", description: "主色，共 7 种。" },
  { attr: "variant", type: "'gradient' | 'orbs'", defaultValue: "'gradient'", description: "渐变底 或 浮光球装饰。" },
];

export default function BadgeCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="徽章与标签"
        hint="同一个组件的颜色、尺寸和样式放在一起，代码按行跟在这组下面。"
      />

      <Section title="用法" description="未读数、文字标签、圆形图标和装饰图标各是一组。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <DocExample id="notificationbadge" title="NotificationBadge" summary="短文字和七种颜色都是计数徽章。" code={CODE_NB_ALL} minHeight={140}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <NotificationBadge>99+</NotificationBadge>
            <NotificationBadge color="orange">5</NotificationBadge>
            <NotificationBadge color="green">新增</NotificationBadge>
            <NotificationBadge color="blue">99+</NotificationBadge>
            <NotificationBadge color="purple">99+</NotificationBadge>
            <NotificationBadge color="yellow">99+</NotificationBadge>
            <NotificationBadge color="cyan">99+</NotificationBadge>
            <NotificationBadge color="black">99+</NotificationBadge>
          </div>
        </DocExample>
        <DocExample id="label" title="Label" summary="大中小，再加上描边和实底。" code={CODE_LABEL_ALL} minHeight={140}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Label size="lg">大</Label>
            <Label size="md">中</Label>
            <Label size="sm">小</Label>
            <Label variant="outline">描边</Label>
            <Label variant="solid">实底</Label>
          </div>
        </DocExample>
        <DocExample id="circleicon" title="CircleIcon" summary="四档尺寸，再加上实底、浅底和灰底。" code={CODE_CIRCLE_ALL} minHeight={140}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <CircleIcon size="lg"><BellBoldDuotone size={24} /></CircleIcon>
            <CircleIcon size="md"><BellBoldDuotone size={18} /></CircleIcon>
            <CircleIcon size="sm"><BellBoldDuotone size={16} /></CircleIcon>
            <CircleIcon size="xs"><BellBoldDuotone size={12} /></CircleIcon>
            <CircleIcon variant="solid"><BellBoldDuotone size={18} /></CircleIcon>
            <CircleIcon variant="light"><BellBoldDuotone size={18} /></CircleIcon>
            <CircleIcon variant="neutral"><BellBoldDuotone size={18} /></CircleIcon>
          </div>
        </DocExample>
        <DocExample id="artisticicon" title="ArtisticIcon" summary="渐变底和光球是两种装饰。" code={CODE_ART_VARIANTS} minHeight={160}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ArtisticIcon variant="gradient"><BellBoldDuotone size={24} /></ArtisticIcon>
            <ArtisticIcon variant="orbs"><BellBoldDuotone size={24} /></ArtisticIcon>
          </div>
        </DocExample>
      </Section>

      <Section title="API">
        <ApiBlock id="notificationbadge" title="NotificationBadge" rows={NB_PROPS} />
        <ApiBlock id="label" title="Label" rows={LABEL_PROPS} />
        <ApiBlock id="circleicon" title="CircleIcon" rows={CIRCLE_PROPS} />
        <ApiBlock id="artisticicon" title="ArtisticIcon" rows={ART_PROPS} />
      </Section>
    </div>
  );
}
