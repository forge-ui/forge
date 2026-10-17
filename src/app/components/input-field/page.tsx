"use client";

import { useState } from "react";
import {
  TextField,
  TextArea,
  SelectOption,
  MediaUpload,
  ProfileImgUpload,
  FileUpload,
  Datepicker,
  RadioButton,
  CheckboxControl,
  CheckboxWithLabel,
  IconSelector,
  IconPicker,
  ColorPicker,
} from "@forge-ui-official/core";
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
} from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample, ExampleGrid } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";

const sampleOptions = [
  { label: "选项一", value: "o1" },
  { label: "选项二", value: "o2" },
  { label: "选项三", value: "o3" },
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
const iconLabels = ["首页", "设置", "用户", "图表", "消息", "通知", "星标", "喜欢"];

const CODE_IMPORT = `import {
  TextField, TextArea, SelectOption, Datepicker,
  Toggle, RadioButton, CheckboxControl, CheckboxWithLabel,
  MediaUpload, ProfileImgUpload, FileUpload,
  IconSelector, IconPicker, ColorPicker,
} from "@forge-ui-official/core";`;

const CODE_TF_COLORS = `<TextField color="purple" state="focus" placeholder="紫色聚焦" />
<TextField color="blue" state="focus" placeholder="蓝色聚焦" />
<TextField color="black" state="focus" placeholder="黑色聚焦" />`;

const CODE_TF_STATES = `<TextField placeholder="默认" />
<TextField state="filled" value="已输入内容" />
<TextField state="focus" placeholder="聚焦" />
<TextField state="disabled" placeholder="禁用" />
<TextField state="error" placeholder="输入内容" errorMessage="请输入有效内容" />`;

const CODE_TF_FIELDS = `<TextField iconLeft={<MagniferLinear size={20} />} placeholder="搜索…" />
<TextField iconRight={<MagniferLinear size={20} />} placeholder="输入内容" />
<TextField suffix="cm" placeholder="输入长度" />
<TextField shape="rounded" placeholder="圆角矩形" />
<TextField shape="pill" placeholder="胶囊" />`;

const TF_PROPS: ApiTableRow[] = [
  { attr: "value", type: "string", defaultValue: "—", description: "当前值（受控）。" },
  { attr: "placeholder", type: "string", defaultValue: "—", description: "占位文字。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "focus 高亮色。" },
  { attr: "shape", type: "'rounded' | 'pill'", defaultValue: "'rounded'", description: "圆角形状。" },
  { attr: "state", type: "'idle' | 'filled' | 'focus' | 'disabled' | 'error'", defaultValue: "'idle'", description: "展示态，用于静态截图或强制高亮。" },
  { attr: "iconLeft", type: "ReactNode", defaultValue: "—", description: "左侧图标槽。" },
  { attr: "iconRight", type: "ReactNode", defaultValue: "—", description: "右侧图标槽。" },
  { attr: "suffix", type: "ReactNode | string", defaultValue: "—", description: "后缀，可为字符串单位或 TextFieldSelectSuffix。" },
  { attr: "errorMessage", type: "string", defaultValue: "—", description: "error 态下方的错误文案。" },
];

const CODE_TA_USAGE = `<TextArea placeholder="请输入内容…" />
<TextArea label="个人简介" placeholder="介绍一下自己…" />`;

const TA_PROPS: ApiTableRow[] = [
  { attr: "value", type: "string", defaultValue: "—", description: "当前值。" },
  { attr: "placeholder", type: "string", defaultValue: "—", description: "占位文字。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "focus 高亮色。" },
  { attr: "state", type: "'idle' | 'filled' | 'focus' | 'disabled' | 'error'", defaultValue: "'idle'", description: "展示态。" },
  { attr: "label", type: "string", defaultValue: "—", description: "顶部标签文字。" },
  { attr: "headerAction", type: "ReactNode", defaultValue: "—", description: "标签右侧的动作插槽，常放 Link。" },
  { attr: "errorMessage", type: "string", defaultValue: "—", description: "error 文案。" },
];

const CODE_SELECT_USAGE = `<SelectOption options={options} />
<SelectOption type="single" value="o1" options={options} />
<SelectOption type="multiple" value={["a", "b"]} options={tagOptions} />`;

const CODE_SELECT_SHAPES = `<SelectOption shape="rounded" options={options} />
<SelectOption shape="pill" options={options} />`;

const SELECT_PROPS: ApiTableRow[] = [
  { attr: "options", type: "SelectOptionItem[]", defaultValue: "—", description: "下拉选项列表，每项包含 value、label，可附 image、icon、description。" },
  { attr: "options[].icon / description", type: "ReactNode / string", defaultValue: "—", description: "可选图标和说明文字；普通选项保持原尺寸。" },
  { attr: "type", type: "'general' | 'single' | 'multiple' | 'image'", defaultValue: "'general'", description: "general / single 单选（行为一致）/ multiple 多选（tag 展示）/ image 图片选项。" },
  { attr: "value", type: "string | string[]", defaultValue: "—", description: "当前选中值，multiple 时为数组。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "高亮色。" },
  { attr: "shape", type: "'rounded' | 'pill'", defaultValue: "'rounded'", description: "圆角形状。" },
  { attr: "bgVariant", type: "'white' | 'grey'", defaultValue: "'white'", description: "背景色变体。" },
  { attr: "state", type: "'idle' | 'focus' | 'disabled' | 'error'", defaultValue: "'idle'", description: "展示态。" },
];

const CODE_DP_USAGE = `<Datepicker label="选择日期" />
<Datepicker label="日期区间" mode="range" />`;

const DP_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "—", description: "顶部标签文字。" },
  { attr: "mode", type: "'single' | 'range'", defaultValue: "'single'", description: "单日或区间选择。" },
  { attr: "value", type: "日期", defaultValue: "—", description: "single 模式的选中日期。" },
  { attr: "rangeStart / rangeEnd", type: "日期", defaultValue: "—", description: "range 模式的起止日期。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "高亮色。" },
  { attr: "onChange", type: "(date: Date) => void", defaultValue: "—", description: "single 模式选中回调。" },
  { attr: "onRangeChange", type: "(start: Date, end: Date | null) => void", defaultValue: "—", description: "range 模式：第一次点击 end 为 null，第二次给完整区间。" },
];

const CODE_RADIO_USAGE = `<RadioButton checked={value === "a"} onChange={() => setValue("a")} />
<RadioButton checked={value === "b"} onChange={() => setValue("b")} color="blue" />`;

const CODE_CHECKBOX_USAGE = `<CheckboxControl checked={on} onChange={setOn} />
<CheckboxWithLabel label="I agree" checked={on} onChange={setOn} />`;

const RADIO_PROPS: ApiTableRow[] = [
  { attr: "checked", type: "boolean", defaultValue: "false", description: "选中状态。" },
  { attr: "onChange", type: "(checked: boolean) => void", defaultValue: "—", description: "切换回调。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "选中态主色。" },
  { attr: "disabled", type: "boolean", defaultValue: "false", description: "禁用态。" },
];

const CHECKBOX_PROPS: ApiTableRow[] = [
  { attr: "checked", type: "boolean", defaultValue: "false", description: "选中状态。" },
  { attr: "onChange", type: "(checked: boolean) => void", defaultValue: "—", description: "切换回调。" },
  { attr: "color", type: "'purple' | 'blue' | 'green' | 'red' | 'orange' | 'black'", defaultValue: "'blue'", description: "选中态主色（CheckboxColor，6 色）。" },
];

const CHECKBOX_LABEL_PROPS: ApiTableRow[] = [
  { attr: "checked", type: "boolean", defaultValue: "false", description: "选中状态。" },
  { attr: "onChange", type: "(checked: boolean) => void", defaultValue: "—", description: "切换回调。" },
  { attr: "label", type: "string", defaultValue: "—", description: "右侧文字。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "选中态主色。" },
  { attr: "checkboxPosition", type: "'left' | 'right'", defaultValue: "'left'", description: "勾选框相对于 label 的位置。" },
  { attr: "icon", type: "ReactNode", defaultValue: "—", description: "label 前的小 icon。" },
  { attr: "avatar", type: "string", defaultValue: "—", description: "label 前的圆形头像 URL。" },
  { attr: "dotColor", type: "string", defaultValue: "—", description: "label 前的 dot 颜色（Tailwind bg-* class）。" },
  { attr: "disabled", type: "boolean", defaultValue: "false", description: "禁用态。" },
];

const CODE_UPLOAD_USAGE = `<MediaUpload label="图片" />
<ProfileImgUpload label="头像" />
<FileUpload label="附件" />`;

const MEDIAUPLOAD_PROPS: ApiTableRow[] = [
  { attr: "items", type: "MediaItem[]", defaultValue: "[]", description: "已上传图片数组（含 src / state / progress）。" },
  { attr: "label", type: "string", defaultValue: "—", description: "组件上方标签。" },
  { attr: "buttonLabel", type: "string", defaultValue: "'Add Image'", description: "添加按钮文案。" },
  { attr: "message", type: "string", defaultValue: "'Drag and drop image here, or click add image'", description: "拖拽提示文案。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "按钮 / icon 主色。" },
  { attr: "onUpload", type: "(files: FileList) => void", defaultValue: "—", description: "选择 / 拖入文件后回调。" },
  { attr: "onRemove", type: "(id: string) => void", defaultValue: "—", description: "条目删除回调。" },
];

const PROFILEIMG_PROPS: ApiTableRow[] = [
  { attr: "src", type: "string", defaultValue: "—", description: "已上传头像 URL；为空时显示占位。" },
  { attr: "label", type: "string", defaultValue: "—", description: "组件上方标签。" },
  { attr: "linkLabel", type: "string", defaultValue: "'Upload'", description: "上传链接文案。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "链接 + icon 主色。" },
  { attr: "onUpload", type: "(files: FileList) => void", defaultValue: "—", description: "选择文件回调。" },
];

const FILEUPLOAD_PROPS: ApiTableRow[] = [
  { attr: "files", type: "FileItem[]", defaultValue: "[]", description: "已上传文件数组（含 name / size / state / progress）。" },
  { attr: "label", type: "string", defaultValue: "—", description: "组件上方标签。" },
  { attr: "buttonLabel", type: "string", defaultValue: "'Add File'", description: "添加按钮文案。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "按钮主色。" },
  { attr: "onUpload", type: "(files: FileList) => void", defaultValue: "—", description: "选择 / 拖入文件后回调。" },
  { attr: "onRemove", type: "(id: string) => void", defaultValue: "—", description: "条目删除回调。" },
  { attr: "onRetry", type: "(id: string) => void", defaultValue: "—", description: "失败重传回调。" },
];

const CODE_PICKER_USAGE = `<ColorPicker selectedIndex={0} />
<IconPicker icons={iconList} selectedIndex={0} onChange={setIndex} />
<IconSelector label="图标" icons={iconList} labels={iconLabels} selectedIndex={0} onChange={setIndex} />`;

const COLORPICKER_PROPS: ApiTableRow[] = [
  { attr: "colors", type: "string[]", defaultValue: "default palette", description: "色板（每项为 Tailwind bg-* class）。" },
  { attr: "selectedIndex", type: "number", defaultValue: "—", description: "当前选中下标。" },
  { attr: "onChange", type: "(index: number) => void", defaultValue: "—", description: "切换回调。" },
];

const ICONPICKER_PROPS: ApiTableRow[] = [
  { attr: "icons", type: "ReactNode[]", defaultValue: "—", description: "图标节点列表，用 @forge-ui-official/core/icons 实例。" },
  { attr: "selectedIndex", type: "number", defaultValue: "—", description: "当前选中下标。" },
  { attr: "onChange", type: "(index: number) => void", defaultValue: "—", description: "切换回调。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "选中态主色。" },
];

const ICONSELECTOR_PROPS: ApiTableRow[] = [
  { attr: "icons", type: "ReactNode[]", defaultValue: "—", description: "图标节点列表。" },
  { attr: "labels", type: "string[]", defaultValue: "—", description: "与 icons 对齐的可访问名称；传入后搜索框会按名称过滤。" },
  { attr: "selectedIndex", type: "number", defaultValue: "—", description: "当前选中下标。" },
  { attr: "onChange", type: "(index: number) => void", defaultValue: "—", description: "切换回调。" },
  { attr: "label", type: "string", defaultValue: "—", description: "组件上方标签。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "选中态主色。" },
  { attr: "searchPlaceholder", type: "string", defaultValue: "'搜索图标...'", description: "图标搜索面板中的输入提示。" },
];

export default function InputFieldCasePage() {
  const [radio, setRadio] = useState("o1");
  const [checked, setChecked] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(0);

  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="表单与输入"
        hint="收集文本、选项、日期和文件。颜色和展示态在单行输入上定一次。"
      />

      <Section title="用法" description="从单行输入开始。传入占位文字即可收集一行文本。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
      </Section>

      <Section title="例子" description="同一颗输入框的状态、颜色、图标和外形放在一起，代码按行跟在下面。其它控件按种类各留一个。">
        <DocExample id="textfield" title="TextField" summary="展示态、聚焦色、图标、单位和外形都是单行输入。" code={`${CODE_TF_STATES}\n${CODE_TF_COLORS}\n${CODE_TF_FIELDS}`}>
          <div className="flex w-full flex-wrap items-start justify-center gap-3">
            <TextField placeholder="默认" className="w-56" />
            <TextField state="filled" value="已输入内容" className="w-56" />
            <TextField state="focus" placeholder="聚焦" className="w-56" />
            <TextField state="disabled" placeholder="禁用" className="w-56" />
            <TextField state="error" placeholder="输入内容" errorMessage="请输入有效内容" className="w-56" />
            <TextField color="purple" state="focus" placeholder="紫色聚焦" className="w-56" />
            <TextField color="blue" state="focus" placeholder="蓝色聚焦" className="w-56" />
            <TextField color="black" state="focus" placeholder="黑色聚焦" className="w-56" />
            <TextField iconLeft={<MagniferLinear size={20} />} placeholder="搜索…" className="w-56" />
            <TextField iconRight={<MagniferLinear size={20} />} placeholder="输入内容" className="w-56" />
            <TextField suffix="cm" placeholder="输入长度" className="w-56" />
            <TextField shape="rounded" placeholder="圆角矩形" className="w-56" />
            <TextField shape="pill" placeholder="胶囊" className="w-56" />
          </div>
        </DocExample>
        <ExampleGrid>
          <DocExample id="textarea" title="TextArea" summary="多行文本，标题写在输入区上方。" code={CODE_TA_USAGE}>
            <div className="flex flex-col gap-3">
              <TextArea placeholder="请输入内容…" className="w-full" />
              <TextArea label="个人简介" placeholder="介绍一下自己…" className="w-full" />
            </div>
          </DocExample>
          <DocExample id="selectoption" title="SelectOption" summary="未选、已选，再加上圆角和胶囊。" code={`${CODE_SELECT_USAGE}\n${CODE_SELECT_SHAPES}`}>
            <div className="flex w-full flex-wrap items-start justify-center gap-3">
              <SelectOption options={sampleOptions} className="w-56" />
              <SelectOption type="single" value="o1" options={sampleOptions} className="w-56" />
              <SelectOption shape="rounded" options={sampleOptions} className="w-56" />
              <SelectOption shape="pill" options={sampleOptions} className="w-56" />
            </div>
          </DocExample>
          <DocExample id="datepicker" title="Datepicker" summary="单日和日期区间是两种选择。" code={CODE_DP_USAGE} minHeight={200}>
            <div className="flex flex-wrap items-start gap-4">
              <Datepicker label="选择日期" />
              <Datepicker label="日期区间" mode="range" />
            </div>
          </DocExample>
          <DocExample id="radiobutton" title="RadioButton" summary="同一组里当前这一项处于选中态。" code={CODE_RADIO_USAGE} minHeight={140}>
            <div className="flex items-center gap-6">
              {sampleOptions.map((o) => (
                <label key={o.value} className="flex items-center gap-2 text-sm text-fg-grey-900">
                  <RadioButton checked={radio === o.value} onChange={() => setRadio(o.value)} />
                  {o.label}
                </label>
              ))}
            </div>
          </DocExample>
          <DocExample id="checkboxcontrol" title="CheckboxControl" summary="独立的勾选方框。" code={CODE_CHECKBOX_USAGE} minHeight={120}>
            <CheckboxControl checked={checked} onChange={setChecked} />
          </DocExample>
          <DocExample id="checkboxwithlabel" title="CheckboxWithLabel" summary="勾选方框和说明文字排在同一行。" code={CODE_CHECKBOX_USAGE} minHeight={120}>
            <CheckboxWithLabel
              label="我已阅读并同意条款"
              checked={agreed}
              onChange={setAgreed}
            />
          </DocExample>
          <DocExample id="mediaupload" title="MediaUpload" summary="一次放入多张图片，并显示缩略图。" code={CODE_UPLOAD_USAGE} minHeight={240}>
            <MediaUpload label="图片" color="blue" />
          </DocExample>
          <DocExample id="profileimgupload" title="ProfileImgUpload" summary="上传一张头像。" code={CODE_UPLOAD_USAGE} minHeight={140}>
            <ProfileImgUpload label="头像" color="blue" />
          </DocExample>
          <DocExample id="fileupload" title="FileUpload" summary="上传附件，列表里带进度和失败重传。" code={CODE_UPLOAD_USAGE} minHeight={200}>
            <FileUpload label="附件" color="black" />
          </DocExample>
          <DocExample id="colorpicker" title="ColorPicker" summary="从一排色块里点选颜色。" code={CODE_PICKER_USAGE} minHeight={120}>
            <ColorPicker selectedIndex={0} />
          </DocExample>
          <DocExample id="iconpicker" title="IconPicker" summary="在紧凑网格里点选一个图标。" code={CODE_PICKER_USAGE} minHeight={140}>
            <IconPicker icons={iconList} labels={iconLabels} selectedIndex={selectedIcon} onChange={setSelectedIcon} />
          </DocExample>
          <DocExample id="iconselector" title="IconSelector" summary="带标题的图标卡片，点开后可以搜索。" code={CODE_PICKER_USAGE} minHeight={180}>
            <IconSelector label="图标" icons={iconList} labels={iconLabels} selectedIndex={selectedIcon} onChange={setSelectedIcon} />
          </DocExample>
        </ExampleGrid>
      </Section>

      <Section title="API" description="每个输入组件只列自己的字段。">
        <ApiBlock id="textfield" title="TextField" rows={TF_PROPS} />
        <ApiBlock id="textarea" title="TextArea" rows={TA_PROPS} />
        <ApiBlock id="selectoption" title="SelectOption" rows={SELECT_PROPS} />
        <ApiBlock id="datepicker" title="Datepicker" rows={DP_PROPS} />
        <ApiBlock id="radiobutton" title="RadioButton" rows={RADIO_PROPS} />
        <ApiBlock id="checkboxcontrol" title="CheckboxControl" rows={CHECKBOX_PROPS} />
        <ApiBlock id="checkboxwithlabel" title="CheckboxWithLabel" rows={CHECKBOX_LABEL_PROPS} />
        <ApiBlock id="mediaupload" title="MediaUpload" rows={MEDIAUPLOAD_PROPS} />
        <ApiBlock id="profileimgupload" title="ProfileImgUpload" rows={PROFILEIMG_PROPS} />
        <ApiBlock id="fileupload" title="FileUpload" rows={FILEUPLOAD_PROPS} />
        <ApiBlock id="colorpicker" title="ColorPicker" rows={COLORPICKER_PROPS} />
        <ApiBlock id="iconpicker" title="IconPicker" rows={ICONPICKER_PROPS} />
        <ApiBlock id="iconselector" title="IconSelector" rows={ICONSELECTOR_PROPS} />
      </Section>
    </div>
  );
}
