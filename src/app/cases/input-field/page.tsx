"use client";

import { useState } from "react";
import {
  MagniferLinear,
  CalendarLinear,
  LetterLinear,
  EyeLinear,
  StarLinear,
  HeartLinear,
  BellLinear,
  BookmarkLinear,
  UserLinear,
  ChatDotsLinear,
  FlagLinear,
  PinLinear,
} from "solar-icon-set";
import {
  TextField,
  TextArea,
  SelectOption,
  Datepicker,
  MediaUpload,
  ProfileImgUpload,
  FileUpload,
  FileCard,
  FileTypeIcon,
  Toggle,
  RadioButton,
  CheckboxControl,
  CheckboxWithLabel,
  IconSelector,
  IconPicker,
  ColorPicker,
  TextFieldSelectSuffix,
  type TextFieldState,
  type TextFieldShape,
  type TextFieldColor,
  type TextAreaState,
  type SelectOptionState,
  type SelectOptionShape,
  type SelectOptionColor,
  type SelectOptionType,
  type DatepickerState,
  type DatepickerShape,
  type DatepickerColor,
  type ControlColor,
  type FileItem,
  type FileUploadColor,
  type MediaItem,
  type MediaUploadColor,
  type IconSelectorColor,
} from "@forge-ui-official/core";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

const fieldStates: TextFieldState[] = ["idle", "focus", "filled", "disabled", "error"];
const fieldShapes: TextFieldShape[] = ["rounded", "pill"];
const fieldColors: TextFieldColor[] = ["purple", "blue", "black"];

const selectStates: SelectOptionState[] = ["idle", "focus", "disabled", "error"];
const selectTypes: SelectOptionType[] = ["general", "single", "multiple", "image"];

const controlColors: ControlColor[] = ["purple", "blue", "black"];

const demoOptions = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" },
];

const imageOptions = [
  { value: "1", label: "Sneakers", image: "https://placehold.co/40x40/EBEBEB/333?text=1" },
  { value: "2", label: "Bag", image: "https://placehold.co/40x40/EBEBEB/333?text=2" },
  { value: "3", label: "Watch", image: "https://placehold.co/40x40/EBEBEB/333?text=3" },
];

const demoFiles: FileItem[] = [
  { id: "1", name: "report.pdf", size: "2.4 MB", state: "uploaded" },
  { id: "2", name: "preview.png", size: "880 KB", state: "success" },
  { id: "3", name: "archive.zip", size: "12 MB", state: "uploading" },
  { id: "4", name: "broken.docx", size: "1.2 MB", state: "error" },
];

const demoMedia: MediaItem[] = [
  { id: "m1", src: "https://placehold.co/96x96/D3C2F8/4C1D95?text=A", state: "success" },
  { id: "m2", src: "https://placehold.co/96x96/BEA4F5/4C1D95?text=B", state: "uploading", progress: 63 },
  { id: "m3", src: "https://placehold.co/96x96/F8B4B4/B91C1C?text=E", state: "error" },
];

const iconSet = [
  <StarLinear key="s" size={22} color="currentColor" />,
  <HeartLinear key="h" size={22} color="currentColor" />,
  <BellLinear key="b" size={22} color="currentColor" />,
  <BookmarkLinear key="bk" size={22} color="currentColor" />,
  <UserLinear key="u" size={22} color="currentColor" />,
  <ChatDotsLinear key="c" size={22} color="currentColor" />,
  <FlagLinear key="f" size={22} color="currentColor" />,
  <PinLinear key="p" size={22} color="currentColor" />,
];

export default function InputFieldCasePage() {
  const [toggleOn, setToggleOn] = useState(true);
  const [radio, setRadio] = useState(true);
  const [check, setCheck] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState<number | undefined>(0);
  const [selectedColor, setSelectedColor] = useState<number | undefined>(0);

  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Input Field"
        hint="TextField / TextArea / SelectOption / Datepicker / MediaUpload / FileUpload / Selection Control / Icon Selector。"
      />

      {/* ============ Text Field - States ============ */}
      <Section
        title="Text Field - States"
        description="5 种状态：idle / focus / filled / disabled / error。3 色 × 2 shape（rounded / pill）。"
      >
        {fieldColors.map((c) => (
          <SubSection key={c} title={`Color: ${c} (rounded)`}>
            {fieldStates.map((st) => (
              <Labeled key={st} label={st}>
                <div className="w-64">
                  <TextField
                    color={c}
                    state={st}
                    shape="rounded"
                    placeholder="Placeholder"
                    value={st === "filled" ? "Entered text" : undefined}
                    errorMessage={st === "error" ? "Error message goes here" : undefined}
                  />
                </div>
              </Labeled>
            ))}
          </SubSection>
        ))}
        {fieldColors.map((c) => (
          <SubSection key={`pill-${c}`} title={`Color: ${c} (pill)`}>
            {fieldStates.map((st) => (
              <Labeled key={st} label={st}>
                <div className="w-64">
                  <TextField
                    color={c}
                    state={st}
                    shape="pill"
                    placeholder="Placeholder"
                    value={st === "filled" ? "Entered text" : undefined}
                    errorMessage={st === "error" ? "Error message goes here" : undefined}
                  />
                </div>
              </Labeled>
            ))}
          </SubSection>
        ))}
      </Section>

      {/* ============ Text Field - With Icon ============ */}
      <Section
        title="Text Field - With Icon"
        description="左图标 / 右图标 / 后缀单位 / 搜索框。"
      >
        <SubSection title="Icon variants">
          <Labeled label="icon-left">
            <div className="w-64">
              <TextField
                placeholder="Search..."
                iconLeft={<MagniferLinear size={18} color="currentColor" />}
              />
            </div>
          </Labeled>
          <Labeled label="icon-right">
            <div className="w-64">
              <TextField
                placeholder="you@example.com"
                iconRight={<LetterLinear size={18} color="currentColor" />}
              />
            </div>
          </Labeled>
          <Labeled label="suffix unit">
            <div className="w-64">
              <TextField placeholder="Height" suffix="cm" />
            </div>
          </Labeled>
          <Labeled label="password">
            <div className="w-64">
              <TextField
                placeholder="Password"
                iconRight={<EyeLinear size={18} color="currentColor" />}
              />
            </div>
          </Labeled>
        </SubSection>
      </Section>

      {/* ============ Text Field - With Label ============ */}
      <Section
        title="Text Field - With Label"
        description="带 label 的输入框，可加 headerAction（帮助链接等）。"
      >
        <SubSection title="Inside Label">
          <Labeled label="plain">
            <div className="w-64">
              <TextField label="Email" placeholder="you@example.com" />
            </div>
          </Labeled>
          <Labeled label="with helper link">
            <div className="w-64">
              <TextField
                label="Password"
                placeholder="••••••••"
                headerAction={
                  <a href="#" className="text-xs font-semibold text-fg-violet hover:underline">
                    Forgot?
                  </a>
                }
              />
            </div>
          </Labeled>
          <Labeled label="error with message">
            <div className="w-64">
              <TextField
                label="Username"
                state="error"
                value="inv@lid"
                errorMessage="Only letters and numbers allowed"
              />
            </div>
          </Labeled>
        </SubSection>
      </Section>

      {/* ============ Text Field - Multiple (tags) ============ */}
      <Section
        title="Text Field - Multiple (tags)"
        description="带 chip 标签的输入，可删除单个 chip。3 色。"
      >
        <SubSection title="Tags per color">
          {fieldColors.map((c) => (
            <Labeled key={c} label={c}>
              <div className="w-72">
                <TextField
                  color={c}
                  state="filled"
                  tags={[
                    { label: "Design", value: "design" },
                    { label: "Product", value: "product" },
                    { label: "Research", value: "research" },
                  ]}
                  placeholder="Add tag..."
                />
              </div>
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ Text Field + Select Suffix ============ */}
      <Section
        title="Text Field + Select Suffix"
        description="输入 + 尾部下拉，常用于币种/单位切换。Suffix 组件挂在 TextField 的 suffix slot 里。"
      >
        <SubSection title="Currency amount">
          <Labeled label="USD / EUR / CNY">
            <div className="w-72">
              <TextField
                label="Amount"
                placeholder="0.00"
                suffix={
                  <TextFieldSelectSuffix
                    value="USD"
                    options={["USD", "EUR", "CNY"]}
                  />
                }
              />
            </div>
          </Labeled>
        </SubSection>
      </Section>

      {/* ============ Text Area ============ */}
      <Section
        title="Text Area"
        description="多行输入，state × shape × color 同 TextField。auto-grow 默认开。"
      >
        <SubSection title="States (purple, rounded)">
          {(["idle", "focus", "filled", "disabled", "error"] as TextAreaState[]).map((st) => (
            <Labeled key={st} label={st}>
              <div className="w-72">
                <TextArea
                  state={st}
                  placeholder="Write a short description..."
                  value={st === "filled" ? "Entered multiline text goes here." : undefined}
                  errorMessage={st === "error" ? "This field is required" : undefined}
                  rows={4}
                />
              </div>
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="With label">
          <Labeled label="plain">
            <div className="w-72">
              <TextArea label="Description" placeholder="Enter description" rows={4} />
            </div>
          </Labeled>
        </SubSection>
      </Section>

      {/* ============ Select Option - Types ============ */}
      <Section
        title="Select Option - Types"
        description="general / single / multiple / image 四种类型。3 色 × rounded / pill。"
      >
        <SubSection title="All types (purple, single trigger)">
          {selectTypes.map((t) => (
            <Labeled key={t} label={t}>
              <SelectOption
                type={t as SelectOptionType}
                options={t === "image" ? imageOptions : demoOptions}
                placeholder={`Select ${t}`}
                color="purple"
              />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ Select Option - States ============ */}
      <Section
        title="Select Option - States"
        description="idle / focus / disabled / error 4 态。"
      >
        <SubSection title="States (purple, single)">
          {selectStates.map((st) => (
            <Labeled key={st} label={st}>
              <SelectOption
                type="single"
                options={demoOptions}
                placeholder="Select option"
                value={st === "disabled" ? "a" : undefined}
                state={st}
                color="purple"
                errorMessage={st === "error" ? "Please pick one" : undefined}
              />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ Select Option - BG Variant ============ */}
      <Section
        title="Select Option - BG Variants"
        description="white / grey 两种背景，适应不同 section 底色。"
      >
        <SubSection title="BG variants">
          <Labeled label="white bg">
            <SelectOption type="general" options={demoOptions} placeholder="White bg" bgVariant="white" />
          </Labeled>
          <Labeled label="grey bg (in grey section)">
            <div className="p-4 bg-fg-grey-100 rounded-xl">
              <SelectOption type="general" options={demoOptions} placeholder="Grey section" bgVariant="grey" />
            </div>
          </Labeled>
        </SubSection>
      </Section>

      {/* ============ Datepicker ============ */}
      <Section
        title="Datepicker"
        description="点击展开日历，支持 single / range。state × shape × color。"
      >
        <SubSection title="States (purple, rounded)">
          {(["idle", "focus", "filled", "disabled", "error"] as DatepickerState[]).map((st) => (
            <Labeled key={st} label={st}>
              <Datepicker state={st} placeholder="Select date" color="purple" />
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Shape × Color">
          {fieldColors.map((c) =>
            (["rounded", "pill"] as DatepickerShape[]).map((sh) => (
              <Labeled key={`${c}-${sh}`} label={`${c} / ${sh}`}>
                <Datepicker color={c as DatepickerColor} shape={sh} placeholder="Pick date" />
              </Labeled>
            )),
          )}
        </SubSection>
      </Section>

      {/* ============ Media Upload ============ */}
      <Section
        title="Media Upload"
        description="图片拖拽上传，3 色。ProfileImgUpload 是头像版。"
      >
        <SubSection title="Colors">
          {(["purple", "blue", "black"] as MediaUploadColor[]).map((c) => (
            <Labeled key={c} label={c}>
              <MediaUpload color={c} label="Product images" items={demoMedia} />
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Profile Image Upload">
          <Labeled label="empty">
            <ProfileImgUpload />
          </Labeled>
          <Labeled label="with image">
            <ProfileImgUpload src="https://placehold.co/96x96/D3C2F8/4C1D95?text=Me" />
          </Labeled>
        </SubSection>
      </Section>

      {/* ============ File Upload ============ */}
      <Section
        title="File Upload"
        description="FileUpload（列表 + 按钮）+ FileCard（单条）+ FileTypeIcon（图标）。"
      >
        <SubSection title="File Upload (purple, with files)">
          <FileUpload label="Attachments" color="purple" files={demoFiles} />
        </SubSection>
        <SubSection title="Colors (2 files each)">
          {(["purple", "blue", "black"] as FileUploadColor[]).map((c) => (
            <Labeled key={c} label={c}>
              <FileUpload color={c} files={demoFiles.slice(0, 2)} />
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="File Type Icons">
          {["report.pdf", "data.xlsx", "plan.docx", "deck.pptx", "image.png", "archive.zip", "logo.svg", "file.unknown"].map((name) => (
            <Labeled key={name} label={name.split(".")[1] ?? "?"}>
              <FileTypeIcon fileName={name} />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ Selection Control ============ */}
      <Section
        title="Selection Control"
        description="Toggle / Radio / Checkbox 三组控件，3 色 × 多种状态。"
      >
        <SubSection title="Toggle (size md, 3 colors)">
          {controlColors.map((c) => (
            <Labeled key={c} label={c}>
              <Toggle color={c} checked={toggleOn} onChange={setToggleOn} />
            </Labeled>
          ))}
          <Labeled label="disabled on">
            <Toggle color="purple" checked disabled />
          </Labeled>
        </SubSection>
        <SubSection title="Toggle (sm)">
          {controlColors.map((c) => (
            <Labeled key={c} label={c}>
              <Toggle color={c} checked size="sm" />
            </Labeled>
          ))}
        </SubSection>

        <SubSection title="Radio Button (3 colors)">
          {controlColors.map((c) => (
            <Labeled key={c} label={c}>
              <RadioButton color={c} checked={radio} onChange={setRadio} />
            </Labeled>
          ))}
          <Labeled label="unchecked">
            <RadioButton />
          </Labeled>
          <Labeled label="disabled on">
            <RadioButton checked disabled />
          </Labeled>
        </SubSection>

        <SubSection title="Checkbox (3 colors)">
          {controlColors.map((c) => (
            <Labeled key={c} label={c}>
              <CheckboxControl color={c} checked={check} onChange={setCheck} />
            </Labeled>
          ))}
          <Labeled label="unchecked">
            <CheckboxControl />
          </Labeled>
        </SubSection>

        <SubSection title="Checkbox With Label">
          <Labeled label="left">
            <CheckboxWithLabel checked label="Subscribe to updates" />
          </Labeled>
          <Labeled label="right">
            <CheckboxWithLabel checked label="I agree to terms" checkboxPosition="right" />
          </Labeled>
        </SubSection>
      </Section>

      {/* ============ Icon Selector ============ */}
      <Section
        title="Icon Selector"
        description="ColorPicker（色点）+ IconPicker（图标网格）+ IconSelector（头像预览 + 搜索弹层）。"
      >
        <SubSection title="Color Picker">
          <ColorPicker selectedIndex={selectedColor} onChange={setSelectedColor} />
        </SubSection>

        <SubSection title="Icon Picker (3 colors)">
          {(["purple", "blue", "black"] as IconSelectorColor[]).map((c) => (
            <Labeled key={c} label={c}>
              <div className="w-64">
                <IconPicker
                  icons={iconSet}
                  color={c}
                  selectedIndex={selectedIcon}
                  onChange={setSelectedIcon}
                />
              </div>
            </Labeled>
          ))}
        </SubSection>

        <SubSection title="Icon Selector (full, 点击展开)">
          <IconSelector
            label="Select an icon"
            icons={iconSet}
            selectedIndex={selectedIcon}
            onChange={setSelectedIcon}
            color="purple"
          />
        </SubSection>
      </Section>
    </div>
  );
}
