"use client";

import Link from "next/link";
import { useState } from "react";
import {
  TextField,
  TextArea,
  SelectOption,
  MediaUpload,
  ProfileImgUpload,
  FileUpload,
  Datepicker,
  Toggle,
  RadioButton,
  CheckboxControl,
  CheckboxWithLabel,
  IconSelector,
  IconPicker,
  ColorPicker,
} from "@forge-ui/react";
import {
  HomeBoldDuotone,
  SettingsBoldDuotone,
  UserBoldDuotone,
  ChartSquareBoldDuotone,
  LetterBoldDuotone,
  BellBoldDuotone,
  StarBoldDuotone,
  HeartBoldDuotone,
  MagniferLinear,
} from "solar-icon-set";
import { PageHeading, Section, SubSection, SubSectionGrid } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

// ─── 共享 sample 数据 ───

const sampleOptions = [
  { label: "Option 1", value: "o1" },
  { label: "Option 2", value: "o2" },
  { label: "Option 3", value: "o3" },
];

const iconList = [
  <HomeBoldDuotone key={0} size={20} />,
  <SettingsBoldDuotone key={1} size={20} />,
  <UserBoldDuotone key={2} size={20} />,
  <ChartSquareBoldDuotone key={3} size={20} />,
  <LetterBoldDuotone key={4} size={20} />,
  <BellBoldDuotone key={5} size={20} />,
  <StarBoldDuotone key={6} size={20} />,
  <HeartBoldDuotone key={7} size={20} />,
];

// ─── TextField 代码片段 ───

const CODE_IMPORT = `import {
  TextField, TextArea, SelectOption, Datepicker,
  Toggle, RadioButton, CheckboxControl, CheckboxWithLabel,
  MediaUpload, ProfileImgUpload, FileUpload,
  IconSelector, IconPicker, ColorPicker,
} from "@forge-ui/react";`;

const CODE_TF_USAGE = `<TextField placeholder="Placeholder text. . ." />
<TextField state="filled" value="Filled text" />
<TextField state="error" placeholder="Input" errorMessage="Error message" />`;

const CODE_TF_COLORS = `<TextField color="purple" placeholder="Purple" />
<TextField color="blue" placeholder="Blue" />
<TextField color="black" placeholder="Black" />`;

const CODE_TF_STATES = `<TextField placeholder="Idle" />
<TextField state="filled" value="Filled text" />
<TextField state="focus" placeholder="Focus" />
<TextField state="disabled" placeholder="Disabled" />
<TextField state="error" placeholder="Input" errorMessage="Error message" />`;

const CODE_TF_ICON = `<TextField iconLeft={<MagniferLinear size={20} />} placeholder="Search. . ." />
<TextField iconRight={<MagniferLinear size={20} />} placeholder="Input" />
<TextField suffix="cm" placeholder="Input length" />`;

const CODE_TF_SHAPE = `<TextField shape="rounded" placeholder="Rounded" />
<TextField shape="pill" placeholder="Pill" />`;

const TF_PROPS: ApiTableRow[] = [
  { attr: "value", type: "string", defaultValue: "—", description: "当前值（受控）。" },
  { attr: "placeholder", type: "string", defaultValue: "—", description: "占位文字。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "focus 高亮色。" },
  { attr: "shape", type: "'rounded' | 'pill'", defaultValue: "'rounded'", description: "圆角形状。" },
  { attr: "state", type: "'idle' | 'filled' | 'focus' | 'disabled' | 'error'", defaultValue: "'idle'", description: "展示态，用于静态截图或强制高亮。" },
  { attr: "iconLeft", type: "ReactNode", defaultValue: "—", description: "左侧图标槽。" },
  { attr: "iconRight", type: "ReactNode", defaultValue: "—", description: "右侧图标槽。" },
  { attr: "suffix", type: "ReactNode | string", defaultValue: "—", description: "后缀，可为字符串单位或 TextFieldSelectSuffix。" },
  { attr: "errorMessage", type: "string", defaultValue: "—", description: "error 态下方的错误文案。" },
];

// ─── TextArea ───

const CODE_TA_USAGE = `<TextArea placeholder="Placeholder text. . ." />
<TextArea label="Bio" placeholder="Tell us about yourself..." />`;

const TA_PROPS: ApiTableRow[] = [
  { attr: "value", type: "string", defaultValue: "—", description: "当前值。" },
  { attr: "placeholder", type: "string", defaultValue: "—", description: "占位文字。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "focus 高亮色。" },
  { attr: "state", type: "'idle' | 'filled' | 'focus' | 'disabled' | 'error'", defaultValue: "'idle'", description: "展示态。" },
  { attr: "label", type: "string", defaultValue: "—", description: "顶部标签文字。" },
  { attr: "headerAction", type: "ReactNode", defaultValue: "—", description: "标签右侧的动作插槽，常放 Link。" },
  { attr: "errorMessage", type: "string", defaultValue: "—", description: "error 文案。" },
];

// ─── SelectOption ───

const CODE_SELECT_USAGE = `<SelectOption options={options} />
<SelectOption type="single" value="o1" options={options} />
<SelectOption type="multiple" value={["a", "b"]} options={tagOptions} />`;

const CODE_SELECT_SHAPES = `<SelectOption shape="rounded" options={options} />
<SelectOption shape="pill" options={options} />`;

const SELECT_PROPS: ApiTableRow[] = [
  { attr: "options", type: "{ label: string; value: string }[]", defaultValue: "—", description: "下拉选项列表。" },
  { attr: "type", type: "'general' | 'single' | 'multiple' | 'image'", defaultValue: "'general'", description: "general / single 单选（行为一致）/ multiple 多选（tag 展示）/ image 图片选项。" },
  { attr: "value", type: "string | string[]", defaultValue: "—", description: "当前选中值，multiple 时为数组。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "高亮色。" },
  { attr: "shape", type: "'rounded' | 'pill'", defaultValue: "'rounded'", description: "圆角形状。" },
  { attr: "bgVariant", type: "'white' | 'grey'", defaultValue: "'white'", description: "背景色变体。" },
  { attr: "state", type: "'idle' | 'focus' | 'disabled' | 'error'", defaultValue: "'idle'", description: "展示态。" },
];

// ─── Datepicker ───

const CODE_DP_USAGE = `<Datepicker label="Select date" />
<Datepicker label="Date range" mode="range" />`;

const DP_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "—", description: "顶部标签文字。" },
  { attr: "mode", type: "'single' | 'range'", defaultValue: "'single'", description: "单日或区间选择。" },
  { attr: "value", type: "Date", defaultValue: "—", description: "single 模式的选中日期。" },
  { attr: "rangeStart / rangeEnd", type: "Date", defaultValue: "—", description: "range 模式的起止日期。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "高亮色。" },
  { attr: "onChange", type: "(date: Date) => void", defaultValue: "—", description: "single 模式选中回调。" },
  { attr: "onRangeChange", type: "(start: Date, end: Date | null) => void", defaultValue: "—", description: "range 模式：第一次点击 end 为 null，第二次给完整区间。" },
];

// ─── Toggle / Radio / Checkbox ───

const CODE_TOGGLE_USAGE = `<Toggle checked={on} onChange={setOn} />
<Toggle checked={on} color="blue" />
<Toggle checked={on} size="sm" />`;

const CODE_RADIO_USAGE = `<RadioButton checked={value === "a"} onChange={() => setValue("a")} />
<RadioButton checked={value === "b"} onChange={() => setValue("b")} color="blue" />`;

const CODE_CHECKBOX_USAGE = `<CheckboxControl checked={on} onChange={setOn} />
<CheckboxWithLabel label="I agree" checked={on} onChange={setOn} />`;

const TOGGLE_PROPS: ApiTableRow[] = [
  { attr: "checked", type: "boolean", defaultValue: "false", description: "开关状态。" },
  { attr: "onChange", type: "(checked: boolean) => void", defaultValue: "—", description: "切换回调。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "选中态主色。" },
  { attr: "size", type: "'md' | 'sm'", defaultValue: "'md'", description: "尺寸档位。" },
  { attr: "disabled", type: "boolean", defaultValue: "false", description: "禁用态。" },
];

const RADIO_PROPS: ApiTableRow[] = [
  { attr: "checked", type: "boolean", defaultValue: "false", description: "选中状态。" },
  { attr: "onChange", type: "(checked: boolean) => void", defaultValue: "—", description: "切换回调。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "选中态主色。" },
  { attr: "disabled", type: "boolean", defaultValue: "false", description: "禁用态。" },
];

const CHECKBOX_PROPS: ApiTableRow[] = [
  { attr: "checked", type: "boolean", defaultValue: "false", description: "选中状态。" },
  { attr: "onChange", type: "(checked: boolean) => void", defaultValue: "—", description: "切换回调。" },
  { attr: "color", type: "'purple' | 'blue' | 'green' | 'red' | 'orange' | 'black'", defaultValue: "'purple'", description: "选中态主色（CheckboxColor，6 色）。" },
];

const CHECKBOX_LABEL_PROPS: ApiTableRow[] = [
  { attr: "checked", type: "boolean", defaultValue: "false", description: "选中状态。" },
  { attr: "onChange", type: "(checked: boolean) => void", defaultValue: "—", description: "切换回调。" },
  { attr: "label", type: "string", defaultValue: "—", description: "右侧文字。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "选中态主色。" },
  { attr: "checkboxPosition", type: "'left' | 'right'", defaultValue: "'left'", description: "勾选框相对于 label 的位置。" },
  { attr: "icon", type: "ReactNode", defaultValue: "—", description: "label 前的小 icon。" },
  { attr: "avatar", type: "string", defaultValue: "—", description: "label 前的圆形头像 URL。" },
  { attr: "dotColor", type: "string", defaultValue: "—", description: "label 前的 dot 颜色（Tailwind bg-* class）。" },
  { attr: "disabled", type: "boolean", defaultValue: "false", description: "禁用态。" },
];

// ─── Upload ───

const CODE_UPLOAD_USAGE = `<MediaUpload label="Images" />
<ProfileImgUpload label="Avatar" />
<FileUpload label="Attachments" />`;

const MEDIAUPLOAD_PROPS: ApiTableRow[] = [
  { attr: "items", type: "MediaItem[]", defaultValue: "[]", description: "已上传图片数组（含 src / state / progress）。" },
  { attr: "label", type: "string", defaultValue: "—", description: "组件上方标签。" },
  { attr: "buttonLabel", type: "string", defaultValue: "'Add Image'", description: "添加按钮文案。" },
  { attr: "message", type: "string", defaultValue: "'Drag and drop image here, or click add image'", description: "拖拽提示文案。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "按钮 / icon 主色。" },
  { attr: "onUpload", type: "(files: FileList) => void", defaultValue: "—", description: "选择 / 拖入文件后回调。" },
  { attr: "onRemove", type: "(id: string) => void", defaultValue: "—", description: "条目删除回调。" },
];

const PROFILEIMG_PROPS: ApiTableRow[] = [
  { attr: "src", type: "string", defaultValue: "—", description: "已上传头像 URL；为空时显示占位。" },
  { attr: "label", type: "string", defaultValue: "—", description: "组件上方标签。" },
  { attr: "linkLabel", type: "string", defaultValue: "'Upload'", description: "上传链接文案。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "链接 + icon 主色。" },
  { attr: "onUpload", type: "(files: FileList) => void", defaultValue: "—", description: "选择文件回调。" },
];

const FILEUPLOAD_PROPS: ApiTableRow[] = [
  { attr: "files", type: "FileItem[]", defaultValue: "[]", description: "已上传文件数组（含 name / size / state / progress）。" },
  { attr: "label", type: "string", defaultValue: "—", description: "组件上方标签。" },
  { attr: "buttonLabel", type: "string", defaultValue: "'Add File'", description: "添加按钮文案。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "按钮主色。" },
  { attr: "onUpload", type: "(files: FileList) => void", defaultValue: "—", description: "选择 / 拖入文件后回调。" },
  { attr: "onRemove", type: "(id: string) => void", defaultValue: "—", description: "条目删除回调。" },
  { attr: "onRetry", type: "(id: string) => void", defaultValue: "—", description: "失败重传回调。" },
];

// ─── Pickers ───

const CODE_PICKER_USAGE = `<ColorPicker selectedIndex={0} />
<IconPicker icons={iconList} selectedIndex={0} onChange={setIndex} />
<IconSelector label="Icons" icons={iconList} selectedIndex={0} onChange={setIndex} />`;

const COLORPICKER_PROPS: ApiTableRow[] = [
  { attr: "colors", type: "string[]", defaultValue: "default palette", description: "色板（每项为 Tailwind bg-* class）。" },
  { attr: "selectedIndex", type: "number", defaultValue: "—", description: "当前选中下标。" },
  { attr: "onChange", type: "(index: number) => void", defaultValue: "—", description: "切换回调。" },
];

const ICONPICKER_PROPS: ApiTableRow[] = [
  { attr: "icons", type: "ReactNode[]", defaultValue: "—", description: "图标节点列表，用 solar-icon-set 实例。" },
  { attr: "selectedIndex", type: "number", defaultValue: "—", description: "当前选中下标。" },
  { attr: "onChange", type: "(index: number) => void", defaultValue: "—", description: "切换回调。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "选中态主色。" },
];

const ICONSELECTOR_PROPS: ApiTableRow[] = [
  { attr: "icons", type: "ReactNode[]", defaultValue: "—", description: "图标节点列表。" },
  { attr: "selectedIndex", type: "number", defaultValue: "—", description: "当前选中下标。" },
  { attr: "onChange", type: "(index: number) => void", defaultValue: "—", description: "切换回调。" },
  { attr: "label", type: "string", defaultValue: "—", description: "组件上方标签。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "选中态主色。" },
  { attr: "searchPlaceholder", type: "string", defaultValue: "'Search icon. . .'", description: "popover 内搜索框占位。" },
];

export default function InputFieldCasePage() {
  const [toggled, setToggled] = useState(true);
  const [radio, setRadio] = useState("o1");
  const [checked, setChecked] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(0);

  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Input Field"
        hint="表单元素大全：文本输入、选择器、日期、上传、开关、单选、复选、图标/颜色选择器。"
      />

      <Section
        title="TextField"
        description="单行文本输入，3 色 × 5 状态 × 2 形状，支持左右图标与后缀。"
      >
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            最小可用：只传 <InlineCode>placeholder</InlineCode>。受控时用 <InlineCode>value</InlineCode> + <InlineCode>onChange</InlineCode>。
          </p>
          <PreviewBlock code={CODE_TF_USAGE}>
            <div className="flex flex-col gap-3">
              <TextField placeholder="Placeholder text. . ." className="w-72" />
              <TextField state="filled" value="Filled text" className="w-72" />
              <TextField state="error" placeholder="Input" errorMessage="Error message" className="w-72" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Colors" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 种 focus 色：<InlineCode>purple</InlineCode> / <InlineCode>blue</InlineCode> / <InlineCode>black</InlineCode>。
          </p>
          <PreviewBlock code={CODE_TF_COLORS}>
            <div className="flex flex-col gap-3">
              <TextField color="purple" state="focus" placeholder="Purple focus" className="w-72" />
              <TextField color="blue" state="focus" placeholder="Blue focus" className="w-72" />
              <TextField color="black" state="focus" placeholder="Black focus" className="w-72" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="States" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            5 种状态：<InlineCode>idle</InlineCode> / <InlineCode>filled</InlineCode> / <InlineCode>focus</InlineCode> / <InlineCode>disabled</InlineCode> / <InlineCode>error</InlineCode>。
          </p>
          <PreviewBlock code={CODE_TF_STATES}>
            <div className="flex flex-col gap-3">
              <TextField placeholder="Idle" className="w-72" />
              <TextField state="filled" value="Filled text" className="w-72" />
              <TextField state="focus" placeholder="Focus" className="w-72" />
              <TextField state="disabled" placeholder="Disabled" className="w-72" />
              <TextField state="error" placeholder="Input" errorMessage="Error message" className="w-72" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="With Icon / Suffix" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>iconLeft</InlineCode> / <InlineCode>iconRight</InlineCode> 放搜索、筛选、清空图标；<InlineCode>suffix</InlineCode> 放单位或选择器。
          </p>
          <PreviewBlock code={CODE_TF_ICON}>
            <div className="flex flex-col gap-3">
              <TextField iconLeft={<MagniferLinear size={20} />} placeholder="Search. . ." className="w-72" />
              <TextField iconRight={<MagniferLinear size={20} />} placeholder="Input" className="w-72" />
              <TextField suffix="cm" placeholder="Input length" className="w-72" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Shape" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            圆角矩形或胶囊，通过 <InlineCode>shape</InlineCode> 切换。
          </p>
          <PreviewBlock code={CODE_TF_SHAPE}>
            <div className="flex flex-col gap-3">
              <TextField shape="rounded" placeholder="Rounded" className="w-72" />
              <TextField shape="pill" placeholder="Pill" className="w-72" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={TF_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="TextArea"
        description="多行文本输入，支持 label + headerAction，其余 props 与 TextField 对齐。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            带 <InlineCode>label</InlineCode> 可充当 form field 的完整单元。
          </p>
          <PreviewBlock code={CODE_TA_USAGE}>
            <div className="flex flex-col gap-3">
              <TextArea placeholder="Placeholder text. . ." className="w-80" />
              <TextArea label="Bio" placeholder="Tell us about yourself..." className="w-80" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={TA_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="SelectOption"
        description="下拉选择，支持单选 / 多选（tag 展示）/ 图片选项三种类型。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            通过 <InlineCode>type</InlineCode> 切换模式，<InlineCode>value</InlineCode> 为选中值。
          </p>
          <PreviewBlock code={CODE_SELECT_USAGE}>
            <div className="flex flex-col gap-3 min-w-[280px]">
              <SelectOption options={sampleOptions} />
              <SelectOption type="single" value="o1" options={sampleOptions} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Shape" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            圆角矩形或胶囊。
          </p>
          <PreviewBlock code={CODE_SELECT_SHAPES}>
            <div className="flex flex-col gap-3 min-w-[280px]">
              <SelectOption shape="rounded" options={sampleOptions} />
              <SelectOption shape="pill" options={sampleOptions} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={SELECT_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="Datepicker"
        description="日期选择，支持单日与区间两种模式。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            点击触发后弹出日历面板，支持 single / range 两种模式。
          </p>
          <PreviewBlock code={CODE_DP_USAGE} minHeight={200}>
            <div className="flex flex-wrap items-start gap-4">
              <Datepicker label="Select date" />
              <Datepicker label="Date range" mode="range" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={DP_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="Selection Controls"
        description="Toggle / RadioButton / CheckboxControl / CheckboxWithLabel 四类轻量控件，统一 3 色主色。"
      >
        <SubSectionGrid cols={2}>
        <SubSection title="Toggle" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            开关，<InlineCode>size</InlineCode> 支持 md / sm。
          </p>
          <PreviewBlock code={CODE_TOGGLE_USAGE} minHeight={120}>
            <Toggle checked={toggled} onChange={setToggled} />
          </PreviewBlock>
          <ApiTable rows={TOGGLE_PROPS} />
        </SubSection>

        <SubSection title="RadioButton" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            单选按钮，通常成组使用，父层管 value。
          </p>
          <PreviewBlock code={CODE_RADIO_USAGE} minHeight={140}>
            <div className="flex items-center gap-6">
              {sampleOptions.map((o) => (
                <label key={o.value} className="flex items-center gap-2 text-sm text-fg-grey-900">
                  <RadioButton checked={radio === o.value} onChange={() => setRadio(o.value)} />
                  {o.label}
                </label>
              ))}
            </div>
          </PreviewBlock>
          <ApiTable rows={RADIO_PROPS} />
        </SubSection>

        <SubSection title="CheckboxControl" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            勾选框本体，不含 label。
          </p>
          <PreviewBlock code={CODE_CHECKBOX_USAGE} minHeight={120}>
            <CheckboxControl checked={checked} onChange={setChecked} />
          </PreviewBlock>
          <ApiTable rows={CHECKBOX_PROPS} />
        </SubSection>

        <SubSection title="CheckboxWithLabel" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            勾选框 + 行内 label，支持 <InlineCode>icon</InlineCode> / <InlineCode>avatar</InlineCode> / <InlineCode>dotColor</InlineCode> 三种 leading。
          </p>
          <PreviewBlock code={CODE_CHECKBOX_USAGE} minHeight={120}>
            <CheckboxWithLabel
              label="I agree to the terms"
              checked={agreed}
              onChange={setAgreed}
            />
          </PreviewBlock>
          <ApiTable rows={CHECKBOX_LABEL_PROPS} />
        </SubSection>
        </SubSectionGrid>
      </Section>

      <Section
        title="Upload"
        description="三种上传区：MediaUpload 多图网格、ProfileImgUpload 头像单图、FileUpload 文件列表。"
      >
        <SubSectionGrid cols={2}>
        <SubSection title="MediaUpload" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            多图上传，传 <InlineCode>items</InlineCode> 注入已上传缩略图。
          </p>
          <PreviewBlock code={CODE_UPLOAD_USAGE} minHeight={240}>
            <MediaUpload label="Images" color="purple" />
          </PreviewBlock>
          <ApiTable rows={MEDIAUPLOAD_PROPS} />
        </SubSection>

        <SubSection title="ProfileImgUpload" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            单张头像上传，<InlineCode>src</InlineCode> 为已有头像 URL。
          </p>
          <PreviewBlock code={CODE_UPLOAD_USAGE} minHeight={140}>
            <ProfileImgUpload label="Avatar" color="blue" />
          </PreviewBlock>
          <ApiTable rows={PROFILEIMG_PROPS} />
        </SubSection>

        <SubSection title="FileUpload" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            通用文件上传，<InlineCode>files</InlineCode> 数组带 progress / state / 失败重传。
          </p>
          <PreviewBlock code={CODE_UPLOAD_USAGE} minHeight={200}>
            <FileUpload label="Attachments" color="black" />
          </PreviewBlock>
          <ApiTable rows={FILEUPLOAD_PROPS} />
        </SubSection>
        </SubSectionGrid>
      </Section>

      <Section
        title="Pickers"
        description="ColorPicker / IconPicker / IconSelector —— 三类可视化选择器。"
      >
        <SubSectionGrid cols={2}>
        <SubSection title="ColorPicker" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            固定色板，传 <InlineCode>colors</InlineCode> 自定义。
          </p>
          <PreviewBlock code={CODE_PICKER_USAGE} minHeight={120}>
            <ColorPicker selectedIndex={0} />
          </PreviewBlock>
          <ApiTable rows={COLORPICKER_PROPS} />
        </SubSection>

        <SubSection title="IconPicker" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            紧凑图标网格，<InlineCode>icons</InlineCode> 传图标节点数组。
          </p>
          <PreviewBlock code={CODE_PICKER_USAGE} minHeight={140}>
            <IconPicker icons={iconList} selectedIndex={selectedIcon} onChange={setSelectedIcon} />
          </PreviewBlock>
          <ApiTable rows={ICONPICKER_PROPS} />
        </SubSection>

        <SubSection title="IconSelector" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            带 label 的完整卡片，点击 <InlineCode>Select</InlineCode> 弹出搜索 popover。
          </p>
          <PreviewBlock code={CODE_PICKER_USAGE} minHeight={180}>
            <IconSelector label="Icons" icons={iconList} selectedIndex={selectedIcon} onChange={setSelectedIcon} />
          </PreviewBlock>
          <ApiTable rows={ICONSELECTOR_PROPS} />
        </SubSection>
        </SubSectionGrid>
      </Section>

      <Link href="/cases/input-field" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
