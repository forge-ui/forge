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
  Combobox,
  Autocomplete,
  NumberField,
  Slider,
  Form,
  FormField,
  Fieldset,
  RadioGroup,
  CheckboxGroup,
  Button,
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
  
} from "@forge-ui-official/core/icons";
import { FormKitExamples } from "../_admin-kit-examples";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample, ExampleGrid } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";
import { MagnifierBoldIcon } from "@solar-icons/react";

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


const cityOptions = [
  { value: "bj", label: "北京" },
  { value: "sh", label: "上海" },
  { value: "sz", label: "深圳" },
  { value: "hz", label: "杭州" },
  { value: "cd", label: "成都" },
  { value: "wh", label: "武汉" },
];

const CODE_COMBOBOX_USAGE = `const [city, setCity] = useState<string | null>(null);
const [tags, setTags] = useState<string[]>(["bj"]);

<Combobox label="城市" options={cityOptions} value={city} onChange={setCity} />
<Combobox multiple label="覆盖城市" options={cityOptions} value={tags} onChange={setTags} />`;

const CODE_AUTOCOMPLETE_USAGE = `const [keyword, setKeyword] = useState("");

<Autocomplete
  searchIcon
  label="搜索客户"
  value={keyword}
  onChange={setKeyword}
  options={["比特林克", "比特数据", { value: "北理工", description: "高校" }]}
/>`;

const CODE_NUMBERFIELD_USAGE = `<NumberField label="成员上限" min={1} max={50} value={seats} onChange={setSeats} suffix="人" />
<NumberField label="预算" step={1000} defaultValue={20000} format={{ style: "currency", currency: "CNY", maximumFractionDigits: 0 }} />`;

const CODE_SLIDER_USAGE = `<Slider label="相似度阈值" showValue value={threshold} onChange={setThreshold} format={{ style: "percent" }} min={0} max={1} step={0.05} />
<Slider label="价格区间" showValue value={range} onChange={setRange} min={0} max={1000} step={50} />`;

const NUMBERFIELD_PROPS: ApiTableRow[] = [
  { attr: "value / defaultValue", type: "number | null", defaultValue: "—", description: "当前数值；清空时为 null。" },
  { attr: "onChange", type: "(value: number | null) => void", defaultValue: "—", description: "数值变化时回调。" },
  { attr: "min / max / step", type: "number", defaultValue: "— / — / 1", description: "范围和步长。按钮、方向键、PageUp/PageDown 都按步长调整。" },
  { attr: "format", type: "Intl.NumberFormatOptions", defaultValue: "—", description: "显示格式，如货币、百分比、千分位。" },
  { attr: "suffix", type: "ReactNode", defaultValue: "—", description: "数字后的单位。" },
  { attr: "label / placeholder / errorMessage", type: "string", defaultValue: "—", description: "标题、占位文字和错误提示。" },
  { attr: "state / color / shape / width / name", type: "—", defaultValue: "—", description: "同 Combobox。" },
];

const SLIDER_PROPS: ApiTableRow[] = [
  { attr: "value / defaultValue", type: "number | [number, number]", defaultValue: "—", description: "传数组就是区间滑块，有两个把手。" },
  { attr: "onChange / onCommit", type: "(value) => void", defaultValue: "—", description: "拖动中持续回调 / 松手时回调一次。" },
  { attr: "min / max / step", type: "number", defaultValue: "0 / 100 / 1", description: "范围和步长。" },
  { attr: "format", type: "Intl.NumberFormatOptions", defaultValue: "—", description: "数值显示和读屏的格式。" },
  { attr: "label / showValue", type: "ReactNode / boolean", defaultValue: "— / false", description: "上方标题，以及右侧显示当前值。" },
  { attr: "ariaLabel", type: "string", defaultValue: "—", description: "没有可见标题时的读屏名称。" },
  { attr: "color / disabled / width / name", type: "—", defaultValue: "'blue' / false / '100%' / —", description: "主色、禁用、宽度和表单字段名。" },
];

const CODE_FORM_USAGE = `<Form onSubmit={(values) => save(values)} errors={serverErrors}>
  <Fieldset legend="联系人">
    <FormField name="email" label="邮箱" messages={{ valueMissing: "请填写邮箱", typeMismatch: "邮箱格式不对" }}>
      <TextField type="email" required placeholder="name@company.com" />
    </FormField>
    <FormField name="seats" label="席位数" validate={(value) => Number(value) > 0 ? null : "至少 1 个"}>
      <NumberField defaultValue={0} />
    </FormField>
  </Fieldset>
  <Button type="submit">保存</Button>
</Form>`;

const CODE_CHOICE_USAGE = `<RadioGroup ariaLabel="套餐" defaultValue="team" options={[
  { value: "free", label: "免费版" },
  { value: "team", label: "团队版", description: "最多 50 人" },
]} />
<CheckboxGroup selectAllLabel="全部通知" defaultValue={["mention"]} options={[
  { value: "mention", label: "被提及" },
  { value: "assign", label: "分配给我" },
]} />`;

const FORM_PROPS: ApiTableRow[] = [
  { attr: "onSubmit", type: "(values) => void", defaultValue: "—", description: "所有字段通过校验后调用，values 按字段 name 组织。" },
  { attr: "errors", type: "Record<string, string | string[]>", defaultValue: "—", description: "服务端返回的错误，按 name 显示在对应字段下，用户改动后消失。" },
  { attr: "validationMode", type: "'onSubmit' | 'onBlur' | 'onChange'", defaultValue: "'onSubmit'", description: "何时校验；出错的字段会在输入时重新校验。" },
];

const FORMFIELD_PROPS: ApiTableRow[] = [
  { attr: "name", type: "string", defaultValue: "—", description: "提交的字段名。" },
  { attr: "label / description", type: "ReactNode", defaultValue: "—", description: "标题和说明，自动关联到控件。" },
  { attr: "validate", type: "(value, values) => string | null | Promise", defaultValue: "—", description: "自定义规则，返回错误文案；可以是异步。" },
  { attr: "messages", type: "{ valueMissing?, typeMismatch?, … }", defaultValue: "—", description: "替换浏览器自带的校验文案（required、type、pattern、min/max 等）。" },
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "一个控件：TextField、TextArea、SelectOption、Combobox、NumberField、Slider、Toggle、Checkbox、RadioGroup、CheckboxGroup。" },
];

const RADIOGROUP_PROPS: ApiTableRow[] = [
  { attr: "options", type: "{ value, label, description?, disabled? }[]", defaultValue: "—", description: "选项。" },
  { attr: "value / defaultValue / onChange", type: "string / string / (value) => void", defaultValue: "—", description: "选中值。方向键在选项间移动并选中。" },
  { attr: "name / required", type: "string / boolean", defaultValue: "—", description: "表单字段名和必选。" },
  { attr: "orientation", type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: "排列方向。" },
];

const CHECKBOXGROUP_PROPS: ApiTableRow[] = [
  { attr: "options", type: "{ value, label, description?, disabled? }[]", defaultValue: "—", description: "选项。" },
  { attr: "value / defaultValue / onChange", type: "string[] / string[] / (value) => void", defaultValue: "—", description: "勾选的值。" },
  { attr: "selectAllLabel", type: "string", defaultValue: "—", description: "加一个“全选”父项，部分勾选时显示横线。" },
  { attr: "name / orientation / color", type: "—", defaultValue: "—", description: "同 RadioGroup。" },
];

const COMBOBOX_PROPS: ApiTableRow[] = [
  { attr: "options", type: "ComboboxOption[]", defaultValue: "—", description: "选项 { value, label, description?, icon?, disabled? }。输入文字按 label 过滤。" },
  { attr: "multiple", type: "boolean", defaultValue: "false", description: "多选。选中项显示为输入框里的标签，可逐个移除。" },
  { attr: "value / defaultValue", type: "string | null | string[]", defaultValue: "—", description: "选中的 value；多选时是数组。" },
  { attr: "onChange", type: "(value) => void", defaultValue: "—", description: "选中变化时回调；清除时单选返回 null。" },
  { attr: "label", type: "string", defaultValue: "—", description: "输入框上方标题，点击聚焦输入框。" },
  { attr: "placeholder", type: "string", defaultValue: "'搜索...'", description: "占位文字。" },
  { attr: "emptyText", type: "ReactNode", defaultValue: "'没有匹配项'", description: "没有匹配时的提示。" },
  { attr: "state", type: "'idle' | 'disabled' | 'error'", defaultValue: "'idle'", description: "error 时在下方显示 errorMessage。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "聚焦边框、选中项和标签颜色。" },
  { attr: "shape", type: "'rounded' | 'pill'", defaultValue: "'rounded'", description: "输入框外形。" },
  { attr: "width", type: "string", defaultValue: "'100%'", description: "输入框宽度，任意 CSS 宽度。" },
  { attr: "name", type: "string", defaultValue: "—", description: "表单字段名，提交选中的 value。" },
];

const AUTOCOMPLETE_PROPS: ApiTableRow[] = [
  { attr: "options", type: "(string | AutocompleteOption)[]", defaultValue: "—", description: "建议项；对象形式 { value, label?, description?, icon?, disabled? }。" },
  { attr: "value / defaultValue", type: "string", defaultValue: "—", description: "输入框文字。可以是任意文字，不要求在建议里。" },
  { attr: "onChange", type: "(value: string) => void", defaultValue: "—", description: "输入或选中建议时回调。" },
  { attr: "onSelect", type: "(option) => void", defaultValue: "—", description: "只在选中某条建议时回调。" },
  { attr: "emptyText", type: "ReactNode", defaultValue: "—", description: "没有匹配时的提示；不传则直接收起列表。" },
  { attr: "searchIcon", type: "boolean", defaultValue: "false", description: "左侧显示搜索图标。" },
  { attr: "state / color / shape / width / name", type: "—", defaultValue: "—", description: "同 Combobox。" },
];

const CODE_IMPORT = `import {
  TextField, TextArea, SelectOption, Datepicker,
  Toggle, RadioButton, CheckboxControl, CheckboxWithLabel,
  MediaUpload, ProfileImgUpload, FileUpload,
  IconSelector, IconPicker, ColorPicker,
  Combobox, Autocomplete, NumberField, Slider,
  Form, FormField, Fieldset, RadioGroup, CheckboxGroup,
} from "@forge-ui-official/core";`;

const CODE_TF_COLORS = `<TextField color="purple" state="focus" placeholder="紫色聚焦" />
<TextField color="blue" state="focus" placeholder="蓝色聚焦" />
<TextField color="black" state="focus" placeholder="黑色聚焦" />`;

const CODE_TF_STATES = `<TextField placeholder="默认" />
<TextField state="filled" value="已输入内容" />
<TextField state="focus" placeholder="聚焦" />
<TextField state="disabled" placeholder="禁用" />
<TextField state="error" placeholder="输入内容" errorMessage="请输入有效内容" />`;

const CODE_TF_FIELDS = `<TextField iconLeft={<MagnifierBoldIcon size={20} />} placeholder="搜索…" />
<TextField iconRight={<MagnifierBoldIcon size={20} />} placeholder="输入内容" />
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

const CODE_SELECT_USAGE = `const [single, setSingle] = useState<string>();
const [many, setMany] = useState<string[]>(["o1", "o2"]);

<SelectOption type="single" value={single} onChange={setSingle} options={options} />
<SelectOption type="multiple" value={many} onChange={setMany} options={options} />`;

const CODE_SELECT_SHAPES = `<SelectOption shape="rounded" value={single} onChange={setSingle} options={options} />
<SelectOption shape="pill" value={single} onChange={setSingle} options={options} />`;

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

const CODE_DP_USAGE = `const [day, setDay] = useState<Date>();
const [range, setRange] = useState<{ start?: Date; end?: Date | null }>({});

<Datepicker label="选择日期" value={day} onChange={setDay} />
<Datepicker label="日期区间" mode="range" rangeStart={range.start} rangeEnd={range.end ?? undefined}
  onRangeChange={(start, end) => setRange({ start, end })} />`;

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

// Both components are controlled: the demos keep the value in state, as real pages do.
function SelectOptionDemo() {
  const [single, setSingle] = useState<string>();
  const [many, setMany] = useState<string[]>([sampleOptions[0].value, sampleOptions[1].value]);
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-3">
      <SelectOption type="single" value={single} onChange={setSingle} options={sampleOptions} className="w-56" />
      <SelectOption type="multiple" value={many} onChange={setMany} options={sampleOptions} className="w-56" />
      <SelectOption shape="rounded" value={single} onChange={setSingle} options={sampleOptions} className="w-56" />
      <SelectOption shape="pill" value={single} onChange={setSingle} options={sampleOptions} className="w-56" />
    </div>
  );
}

function DatepickerDemo() {
  const [day, setDay] = useState<Date>();
  const [range, setRange] = useState<{ start?: Date; end?: Date | null }>({});
  return (
    <div className="flex flex-wrap items-start gap-4">
      <Datepicker label="选择日期" value={day} onChange={setDay} />
      <Datepicker label="日期区间" mode="range" rangeStart={range.start} rangeEnd={range.end ?? undefined} onRangeChange={(start, end) => setRange({ start, end })} />
    </div>
  );
}

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
            <TextField iconLeft={<MagnifierBoldIcon size={20} />} placeholder="搜索…" className="w-56" />
            <TextField iconRight={<MagnifierBoldIcon size={20} />} placeholder="输入内容" className="w-56" />
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
            <SelectOptionDemo />
          </DocExample>
          <DocExample id="combobox" title="Combobox" summary="选项多时边输入边筛选，单选或多选。" code={CODE_COMBOBOX_USAGE} minHeight={220}>
            <ComboboxDemo />
          </DocExample>
          <DocExample id="autocomplete" title="Autocomplete" summary="自由输入，同时给出可点选的建议。" code={CODE_AUTOCOMPLETE_USAGE} minHeight={200}>
            <AutocompleteDemo />
          </DocExample>
          <DocExample id="numberfield" title="NumberField" summary="带加减按钮的数字输入，可以设范围、步长和货币格式。" code={CODE_NUMBERFIELD_USAGE} minHeight={220}>
            <NumberFieldDemo />
          </DocExample>
          <DocExample id="slider" title="Slider" summary="拖动或用方向键调数值，传数组就是区间。" code={CODE_SLIDER_USAGE} minHeight={200}>
            <SliderDemo />
          </DocExample>
          <DocExample id="form" title="Form" summary="必填、格式和自定义规则在提交时校验，错误显示在字段下方。" code={CODE_FORM_USAGE} minHeight={360}>
            <FormDemo />
          </DocExample>
          <DocExample id="radiogroup" title="RadioGroup" summary="单选组和多选组，键盘可用方向键操作。" code={CODE_CHOICE_USAGE} minHeight={240}>
            <div className="flex w-full flex-wrap gap-10">
              <RadioGroup ariaLabel="套餐" defaultValue="team" options={[{ value: "free", label: "免费版" }, { value: "team", label: "团队版", description: "最多 50 人" }]} />
              <CheckboxGroup selectAllLabel="全部通知" defaultValue={["mention"]} options={[{ value: "mention", label: "被提及" }, { value: "assign", label: "分配给我" }]} />
            </div>
          </DocExample>
          <DocExample id="datepicker" title="Datepicker" summary="单日和日期区间是两种选择。" code={CODE_DP_USAGE} minHeight={200}>
            <DatepickerDemo />
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

      <FormKitExamples />

      <Section title="API" description="每个输入组件只列自己的字段。">
        <ApiBlock id="textfield" title="TextField" rows={TF_PROPS} />
        <ApiBlock id="textarea" title="TextArea" rows={TA_PROPS} />
        <ApiBlock id="selectoption" title="SelectOption" rows={SELECT_PROPS} />
        <ApiBlock id="combobox" title="Combobox" rows={COMBOBOX_PROPS} />
        <ApiBlock id="autocomplete" title="Autocomplete" rows={AUTOCOMPLETE_PROPS} />
        <ApiBlock id="numberfield" title="NumberField" rows={NUMBERFIELD_PROPS} />
        <ApiBlock id="slider" title="Slider" rows={SLIDER_PROPS} />
        <ApiBlock id="form" title="Form" rows={FORM_PROPS} />
        <ApiBlock id="formfield" title="FormField" rows={FORMFIELD_PROPS} />
        <ApiBlock id="radiogroup" title="RadioGroup" rows={RADIOGROUP_PROPS} />
        <ApiBlock id="checkboxgroup" title="CheckboxGroup" rows={CHECKBOXGROUP_PROPS} />
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

function ComboboxDemo() {
  const [city, setCity] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>(["bj"]);
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Combobox label="城市" options={cityOptions} value={city} onChange={setCity} />
      <Combobox multiple label="覆盖城市" options={cityOptions} value={tags} onChange={setTags} />
    </div>
  );
}

function AutocompleteDemo() {
  const [keyword, setKeyword] = useState("");
  return (
    <div className="w-full max-w-sm">
      <Autocomplete searchIcon label="搜索客户" value={keyword} onChange={setKeyword} options={["比特林克", "比特数据", { value: "北理工", description: "高校" }]} />
    </div>
  );
}

function NumberFieldDemo() {
  const [seats, setSeats] = useState<number | null>(5);
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <NumberField label="成员上限" min={1} max={50} value={seats} onChange={setSeats} suffix="人" />
      <NumberField label="预算" step={1000} defaultValue={20000} format={{ style: "currency", currency: "CNY", maximumFractionDigits: 0 }} />
    </div>
  );
}

function SliderDemo() {
  const [threshold, setThreshold] = useState(0.75);
  const [range, setRange] = useState<[number, number]>([200, 600]);
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Slider label="相似度阈值" showValue value={threshold} onChange={setThreshold} format={{ style: "percent" }} min={0} max={1} step={0.05} />
      <Slider label="价格区间" showValue value={range} onChange={setRange} min={0} max={1000} step={50} />
    </div>
  );
}

function FormDemo() {
  const [saved, setSaved] = useState<string | null>(null);
  return (
    <div className="w-full max-w-sm">
      <Form onSubmit={(values) => setSaved(JSON.stringify(values))}>
        <Fieldset legend="联系人">
          <FormField name="email" label="邮箱" messages={{ valueMissing: "请填写邮箱", typeMismatch: "邮箱格式不对" }}>
            <TextField type="email" required placeholder="name@company.com" />
          </FormField>
          <FormField name="seats" label="席位数" validate={(value) => Number(value) > 0 ? null : "至少 1 个"}>
            <NumberField defaultValue={0} />
          </FormField>
        </Fieldset>
        <Button type="submit" size="md">保存</Button>
        {saved && <p className="text-xs text-fg-grey-700">已提交：{saved}</p>}
      </Form>
    </div>
  );
}
