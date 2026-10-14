"use client";

import { CurrencyConverter, type CurrencyConverterColor } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";

const COLORS: CurrencyConverterColor[] = ["purple", "blue", "dark"];

export default function OtherWidgetCasePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading title="实用组件" hint="提供货币换算、星级评分、图片排列和产品条目。" />

      <Section
        title="Currency Converter"
        description="3 colors (purple · blue · dark) — Figma 严格还原"
      >
        <SubSection title="All colors">
          <div className="flex flex-wrap gap-4">
            {COLORS.map((c) => (
              <CurrencyConverter
                key={c}
                color={c}
                title="Title Here"
                subtitle="Text here"
                exchangeRateText="1 EUR = 1.09 USD"
              />
            ))}
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
