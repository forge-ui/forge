import {
  ProgressBar,
  type ProgressColor,
  type ProgressSize,
  type ProgressLabelVariant,
  type ProgressLabelSize,
} from "@forge-ui-official/core";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

const progressColors: ProgressColor[] = [
  "purple", "blue", "green", "red", "orange", "yellow", "cyan", "gray",
];
const progressSizes: ProgressSize[] = ["sm", "md"];
const labelVariants: ProgressLabelVariant[] = ["default", "value"];
const labelSizes: ProgressLabelSize[] = ["xs", "sm"];

export default function ProgressCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Progress"
        hint="ProgressBar — 8 色 × 2 size × label / value 变体 × onDark 两种背景。"
      />

      {/* ============ Bar — Colors × Sizes ============ */}
      <Section
        title="Bar"
        description="基础条形进度条，8 色 × 2 size（sm h-2 / md h-3）。"
      >
        {progressSizes.map((s) => (
          <SubSection key={s} title={`Size: ${s}`} >
            {progressColors.map((c) => (
              <Labeled key={c} label={c}>
                <div className="w-64">
                  <ProgressBar value={65} color={c} size={s} />
                </div>
              </Labeled>
            ))}
          </SubSection>
        ))}
      </Section>

      {/* ============ Progress Bar — With Label ============ */}
      <Section
        title="Progress Bar — With Label"
        description="label + percentage 组合，default 灰中号 / value 黑粗体。2 label size × 2 variant。"
      >
        {labelVariants.map((v) => (
          <SubSection key={v} title={`Variant: ${v}`} >
            {labelSizes.map((ls) => (
              <Labeled key={ls} label={`${ls}`}>
                <div className="w-64">
                  <ProgressBar
                    value={65}
                    color="purple"
                    label={v === "value" ? "$400" : "Progress"}
                    labelVariant={v}
                    labelSize={ls}
                    showPercentage
                  />
                </div>
              </Labeled>
            ))}
          </SubSection>
        ))}
      </Section>

      {/* ============ Progress Bar — All Colors + Label ============ */}
      <Section
        title="Progress Bar — Colors × Label"
        description="完整 label + % 组合，8 色全铺。"
      >
        <SubSection title="default label (Progress 65%)" >
          {progressColors.map((c) => (
            <Labeled key={c} label={c}>
              <div className="w-64">
                <ProgressBar
                  value={65}
                  color={c}
                  label="Progress"
                  labelVariant="default"
                  showPercentage
                />
              </div>
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="value label ($400 65%)" >
          {progressColors.map((c) => (
            <Labeled key={c} label={c}>
              <div className="w-64">
                <ProgressBar
                  value={65}
                  color={c}
                  label="$400"
                  labelVariant="value"
                  showPercentage
                />
              </div>
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ On Dark ============ */}
      <Section
        title="Progress Bar — On Dark"
        description="深色卡片背景上使用，track 半透明，label / % 变白。"
      >
        <SubSection title="Dark surface" >
          {progressColors.map((c) => (
            <div key={c} className="p-5 bg-fg-black rounded-xl w-64">
              <ProgressBar
                value={65}
                color={c}
                label="Progress"
                labelVariant="default"
                showPercentage
                onDark
              />
            </div>
          ))}
        </SubSection>
      </Section>

      {/* ============ Progress Values ============ */}
      <Section
        title="Progress Bar — Value Range"
        description="0 / 25 / 50 / 75 / 100 各档。"
      >
        <SubSection title="Purple, sm" >
          {[0, 25, 50, 75, 100].map((v) => (
            <Labeled key={v} label={`${v}%`}>
              <div className="w-64">
                <ProgressBar value={v} color="purple" showPercentage />
              </div>
            </Labeled>
          ))}
        </SubSection>
      </Section>
    </div>
  );
}
