import {
  ChartTooltip,
  ChartCard,
  ChartListItem,
  ChartLegendItem,
  ChartValueRow,
  ChartStatFooter,
  MeterChart,
  HalfDonutChart,
  DashedHalfDonutChart,
  DonutChart,
  PieChart,
  MultilayerDonutChart,
  BubbleChart,
  BarChart,
  BarHorizontalChart,
  BarUpsideDownChart,
  SmoothLineChart,
} from "@forge-ui/react";
import { WalletLinear } from "solar-icon-set";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

export default function ChartCasePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="Chart"
        hint="ChartTooltip · ChartCard · ChartListItem · ChartStatFooter · MeterChart · HalfDonutChart · DashedHalfDonutChart · DonutChart · PieChart · MultilayerDonutChart · BubbleChart · BarChart · BarHorizontalChart · BarUpsideDownChart · SmoothLineChart"
      />

      <Section title="ChartTooltip" description="Dark tooltip for charts">
        <SubSection title="Example">
          <ChartTooltip
            items={[
              { color: "bg-fg-violet", label: "Revenue", value: "$4,200", trend: "up" },
              { color: "bg-blue-600", label: "Expenses", value: "$1,800", trend: "down" },
            ]}
          />
          <ChartTooltip
            items={[
              { color: "bg-emerald-500", value: "$12,500", trend: "up" },
            ]}
          />
        </SubSection>
      </Section>

      <Section title="ChartCard" description="Card wrapper for charts">
        <SubSection title="Example">
          <ChartCard title="Revenue Overview" subtitle="Monthly breakdown" size="4col">
            <DonutChart
              segments={[
                { value: 40, color: "bg-fg-violet" },
                { value: 30, color: "bg-blue-600" },
                { value: 20, color: "bg-emerald-500" },
                { value: 10, color: "bg-fg-yellow" },
              ]}
              centerValue="$8.4k"
              size="sm"
            />
          </ChartCard>
        </SubSection>
      </Section>

      <Section title="ChartListItem" description="Legend-style list item for charts">
        <SubSection title="Example">
          <div className="w-80 flex flex-col gap-3">
            <ChartListItem
              icon={WalletLinear}
              title="Revenue"
              subtitle="This month"
              value="$12,500"
              trend="+12.5%"
              trendDirection="up"
            />
            <ChartListItem
              title="Expenses"
              value="$3,200"
              trend="-4%"
              trendDirection="down"
            />
          </div>
        </SubSection>
      </Section>

      <Section title="ChartStatFooter" description="Footer stats for chart cards">
        <SubSection title="Example">
          <div className="w-96">
            <ChartStatFooter
              items={[
                { label: "Revenue", value: "$12.5k", color: "bg-fg-violet", trend: "+12%", trendDirection: "up" },
                { label: "Expenses", value: "$3.2k", color: "bg-blue-600", trend: "-4%", trendDirection: "down" },
                { label: "Profit", value: "$9.3k", color: "bg-emerald-500", trend: "+18%", trendDirection: "up" },
              ]}
            />
          </div>
        </SubSection>
      </Section>

      <Section title="MeterChart" description="Horizontal segmented meter — 3 / 2 / 1 段 Monochromatic">
        <SubSection title="Monochromatic 1 / 2 / 3 段">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <MeterChart
              segments={[
                { value: 50 },
                { value: 30 },
                { value: 20 },
              ]}
              subtitle="+$181 today"
              trend="10%"
              trendDirection="up"
            />
            <p className="self-stretch text-center text-sm leading-5 tracking-fg">
              <span className="text-fg-grey-700">You succeed earn </span>
              <span className="font-semibold text-fg-black">$240</span>
              <span className="text-fg-grey-700"> today, its higher than yesterday</span>
            </p>
            <ChartStatFooter
              items={[
                { label: "Label", value: "$20k", trendDirection: "up" },
                { label: "Label", value: "$16k", trendDirection: "down" },
                { label: "Label", value: "$1.5k", trendDirection: "up" },
              ]}
            />
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <MeterChart
              segments={[
                { value: 75 },
                { value: 25 },
              ]}
              subtitle="+$181 today"
              trend="10%"
              trendDirection="up"
            />
            <p className="self-stretch text-center text-sm leading-5 tracking-fg">
              <span className="text-fg-grey-700">You succeed earn </span>
              <span className="font-semibold text-fg-black">$240</span>
              <span className="text-fg-grey-700"> today, its higher than yesterday</span>
            </p>
            <ChartStatFooter
              items={[
                { label: "Label", value: "$20k", trendDirection: "up" },
                { label: "Label", value: "$16k", trendDirection: "down" },
              ]}
            />
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <MeterChart
              segments={[{ value: 75 }]}
              subtitle="+$181 today"
              trend="10%"
              trendDirection="up"
            />
            <p className="self-stretch text-center text-sm leading-5 tracking-fg">
              <span className="text-fg-grey-700">You succeed earn </span>
              <span className="font-semibold text-fg-black">$240</span>
              <span className="text-fg-grey-700"> today, its higher than yesterday</span>
            </p>
            <ChartStatFooter
              items={[
                { label: "Label", value: "$20,000", color: "bg-fg-violet", trendDirection: "up" },
                { label: "Label", value: "$40,000", color: "bg-fg-grey-200", trendDirection: "up" },
              ]}
            />
          </ChartCard>
        </SubSection>
      </Section>

      <Section title="HalfDonutChart" description="Semi-circle donut (Regular + List 两种)">
        <SubSection title="Regular">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <HalfDonutChart
              segments={[{ value: 75 }]}
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
            />
            <ChartStatFooter
              items={[
                { label: "Label", value: "$20k", trendDirection: "up" },
                { label: "Label", value: "$16k", trendDirection: "down" },
                { label: "Label", value: "$1.5k", trendDirection: "up" },
              ]}
            />
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <HalfDonutChart
              segments={[
                { value: 50 },
                { value: 25 },
              ]}
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
            />
            <ChartStatFooter
              items={[
                { label: "Label", value: "$20k", trendDirection: "up" },
                { label: "Label", value: "$16k", trendDirection: "up" },
              ]}
            />
          </ChartCard>
        </SubSection>
        <SubSection title="+List">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <HalfDonutChart
              segments={[{ value: 75 }]}
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
            </div>
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <HalfDonutChart
              segments={[
                { value: 50 },
                { value: 25 },
              ]}
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
            </div>
          </ChartCard>
        </SubSection>
      </Section>

      <Section title="DashedHalfDonutChart" description="Dashed semi-circle donut (Regular + List 两种)">
        <SubSection title="Regular">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <DashedHalfDonutChart
              segments={[{ value: 75 }]}
              trackColor="bg-purple-300"
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
            />
            <ChartStatFooter
              items={[
                { label: "Label", value: "$20k", trendDirection: "up" },
                { label: "Label", value: "$16k", trendDirection: "down" },
              ]}
            />
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <DashedHalfDonutChart
              segments={[
                { value: 50 },
                { value: 25 },
              ]}
              trackColor="bg-purple-300"
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
            />
            <ChartStatFooter
              items={[
                { label: "Label", value: "$20k", trendDirection: "up" },
                { label: "Label", value: "$16k", trendDirection: "up" },
                { label: "Label", value: "$1.5k", trendDirection: "up" },
              ]}
            />
          </ChartCard>
        </SubSection>
        <SubSection title="+List">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <DashedHalfDonutChart
              segments={[{ value: 75 }]}
              trackColor="bg-purple-300"
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
            </div>
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <DashedHalfDonutChart
              segments={[
                { value: 50 },
                { value: 25 },
              ]}
              trackColor="bg-purple-300"
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
            </div>
          </ChartCard>
        </SubSection>
      </Section>

      <Section title="DonutChart" description="Full donut — Regular / +List / 尺寸 sm/md/lg">
        <SubSection title="Sizes (sm / md / lg)">
          {(["sm", "md", "lg"] as const).map((s) => (
            <Labeled key={s} label={s}>
              <DonutChart
                size={s}
                segments={[
                  { value: 75 },
                  { value: 25 },
                ]}
                centerValue="75%"
                trend="10%"
                trendDirection="up"
                subtitle="+$181"
              />
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Regular">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <DonutChart
              size="md"
              segments={[{ value: 75 }]}
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="Label" value="$10,000" />
              <ChartLegendItem color="bg-fg-grey-200" label="Label" value="$10,000" /> {/* track, non-ramp */}
            </div>
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <DonutChart
              size="md"
              segments={[
                { value: 50 },
                { value: 25 },
              ]}
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="Label" value="$10,000" />
              <ChartLegendItem shade={3} label="Label" value="$10,000" />
            </div>
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <DonutChart
              size="md"
              segments={[
                { value: 50 },
                { value: 30 },
                { value: 20 },
              ]}
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
            />
            <ChartStatFooter
              items={[
                { label: "Label", value: "$20k", trendDirection: "up" },
                { label: "Label", value: "$16k", trendDirection: "up" },
                { label: "Label", value: "$1.5k", trendDirection: "up" },
              ]}
            />
          </ChartCard>
        </SubSection>
        <SubSection title="+List">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <DonutChart
              size="md"
              segments={[{ value: 75 }]}
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
            </div>
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <DonutChart
              size="md"
              segments={[
                { value: 50 },
                { value: 30 },
                { value: 20 },
              ]}
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
            </div>
          </ChartCard>
        </SubSection>
      </Section>

      <Section title="PieChart" description="Full pie (Regular / +List / 多色段 1-5 段)">
        <SubSection title="Sizes (sm / md / lg)">
          {(["sm", "md", "lg"] as const).map((s) => (
            <Labeled key={s} label={s}>
              <PieChart
                size={s}
                segments={[
                  { value: 50 },
                  { value: 30 },
                  { value: 20 },
                ]}
              />
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Regular (1-5 段)">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <PieChart segments={[{ value: 75 }]} />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="Label" value="$10,000" />
            </div>
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <PieChart
              segments={[
                { value: 60 },
                { value: 40 },
              ]}
            />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="Label" value="$10,000" />
              <ChartLegendItem shade={2} label="Label" value="$10,000" />
            </div>
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <PieChart
              segments={[
                { value: 50 },
                { value: 30 },
                { value: 20 },
              ]}
            />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="Label" value="$10,000" />
              <ChartLegendItem shade={2} label="Label" value="$10,000" />
              <ChartLegendItem shade={3} label="Label" value="$10,000" />
            </div>
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <PieChart
              segments={[
                { value: 40 },
                { value: 25 },
                { value: 20 },
                { value: 15 },
              ]}
            />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="Label" value="$10,000" />
              <ChartLegendItem shade={1} label="Label" value="$10,000" />
              <ChartLegendItem shade={2} label="Label" value="$10,000" />
              <ChartLegendItem shade={3} label="Label" value="$10,000" />
            </div>
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <PieChart
              segments={[
                { value: 35 },
                { value: 25 },
                { value: 20 },
                { value: 12 },
                { value: 8 },
              ]}
            />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="Label" value="$10,000" />
              <ChartLegendItem shade={1} label="Label" value="$10,000" />
              <ChartLegendItem shade={2} label="Label" value="$10,000" />
              <ChartLegendItem shade={3} label="Label" value="$10,000" />
              <ChartLegendItem shade={4} label="Label" value="$10,000" />
            </div>
          </ChartCard>
        </SubSection>
        <SubSection title="+List">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <PieChart segments={[{ value: 75 }]} />
            <div className="w-full flex flex-col gap-3">
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
            </div>
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <PieChart
              segments={[
                { value: 50 },
                { value: 30 },
                { value: 20 },
              ]}
            />
            <div className="w-full flex flex-col gap-3">
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
            </div>
          </ChartCard>
        </SubSection>
      </Section>

      <Section title="MultilayerDonutChart" description="嵌套 270° C 形 arc (1/2/3/4 层)">
        <SubSection title="1 / 2 / 3 / 4 层">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <MultilayerDonutChart
              layers={[{ value: 75 }]}
              centerValue="$75.5k"
              trend="10%"
              trendDirection="up"
              subtitle="from last month"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="Label" value="$10,000" />
            </div>
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <MultilayerDonutChart
              layers={[
                { value: 75 },
                { value: 60 },
              ]}
              centerValue="$75.5k"
              trend="10%"
              trendDirection="up"
              subtitle="from last month"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="Label" value="$10,000" />
              <ChartLegendItem shade={1} label="Label" value="$10,000" />
            </div>
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <MultilayerDonutChart
              layers={[
                { value: 75 },
                { value: 60 },
                { value: 45 },
              ]}
              centerValue="$75.5k"
              trend="10%"
              trendDirection="up"
              subtitle="from last month"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="Label" value="$10,000" />
              <ChartLegendItem shade={1} label="Label" value="$10,000" />
              <ChartLegendItem shade={2} label="Label" value="$10,000" />
            </div>
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <MultilayerDonutChart
              layers={[
                { value: 75 },
                { value: 60 },
                { value: 45 },
                { value: 30 },
              ]}
              centerValue="$75.5k"
              trend="10%"
              trendDirection="up"
              subtitle="from last month"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="Label" value="$10,000" />
              <ChartLegendItem shade={1} label="Label" value="$10,000" />
              <ChartLegendItem shade={2} label="Label" value="$10,000" />
              <ChartLegendItem shade={3} label="Label" value="$10,000" />
            </div>
          </ChartCard>
        </SubSection>
        <SubSection title="+List">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <MultilayerDonutChart
              layers={[
                { value: 75 },
                { value: 60 },
                { value: 45 },
              ]}
              centerValue="$75.5k"
              trend="10%"
              trendDirection="up"
              subtitle="from last month"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
            </div>
          </ChartCard>
        </SubSection>
      </Section>

      <Section title="BubbleChart" description="2 / 3 / 4 个 bubble 紧密排列 (Regular + List)">
        <SubSection title="Regular">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <BubbleChart
              bubbles={[
                { value: 65 },
                { value: 35 },
              ]}
            />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="Label" value="$10,000" />
              <ChartLegendItem shade={2} label="Label" value="$10,000" />
            </div>
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <BubbleChart
              bubbles={[
                { value: 58.33 },
                { value: 25 },
                { value: 8 },
              ]}
            />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="Label" value="$10,000" />
              <ChartLegendItem shade={2} label="Label" value="$10,000" />
              <ChartLegendItem shade={3} label="Label" value="$10,000" />
            </div>
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <BubbleChart
              bubbles={[
                { value: 58.33 },
                { value: 25 },
                { value: 8 },
                { value: 2 },
              ]}
            />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="Label" value="$10,000" />
              <ChartLegendItem shade={2} label="Label" value="$10,000" />
              <ChartLegendItem shade={3} label="Label" value="$10,000" />
              <ChartLegendItem shade={4} label="Label" value="$10,000" />
            </div>
          </ChartCard>
        </SubSection>
        <SubSection title="+List">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <BubbleChart
              bubbles={[
                { value: 65 },
                { value: 35 },
              ]}
            />
            <div className="w-full flex flex-col gap-3">
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
              <ChartListItem icon={WalletLinear} title="Title Here" subtitle="Subtext" value="$24,500" trend="10%" trendDirection="up" />
            </div>
          </ChartCard>
        </SubSection>
      </Section>

      <Section title="BarChart (Vertical)" description="Thin / Wide bars + tooltip + active label 高亮">
        <SubSection title="4 Col (thin / wide)">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <BarChart
              data={[
                { value: 30, label: "Lbl" },
                { value: 70, label: "Lbl" },
                { value: 55, label: "Lbl" },
                { value: 100, label: "Lbl" },
                { value: 80, label: "Lbl" },
                { value: 50, label: "Lbl" },
                { value: 35, label: "Lbl" },
              ]}
              activeIndex={3}
              showLabels
              showTooltip
              tooltipValue="$880"
              tooltipTrend="up"
            />
            <ChartValueRow value="$4,103" trend="10%" trendDirection="up" />
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <BarChart
              data={[
                { value: 30, label: "Lbl" },
                { value: 70, label: "Lbl" },
                { value: 55, label: "Lbl" },
                { value: 100, label: "Lbl" },
                { value: 80, label: "Lbl" },
                { value: 50, label: "Lbl" },
                { value: 35, label: "Lbl" },
              ]}
              barWidth="wide"
              activeIndex={3}
              showLabels
              showTooltip
              tooltipValue="$880"
              tooltipTrend="up"
            />
            <ChartValueRow value="$4,103" trend="10%" trendDirection="up" />
          </ChartCard>
        </SubSection>
        <SubSection title="6 Col / Full Width">
          <ChartCard title="Statistic" subtitle="Income and Expenses" size="6col">
            <BarChart
              data={[
                { value: 30, label: "Lbl" },
                { value: 60, label: "Lbl" },
                { value: 45, label: "Lbl" },
                { value: 80, label: "Lbl" },
                { value: 65, label: "Lbl" },
                { value: 100, label: "Lbl" },
                { value: 85, label: "Lbl" },
                { value: 55, label: "Lbl" },
                { value: 70, label: "Lbl" },
                { value: 40, label: "Lbl" },
                { value: 50, label: "Lbl" },
                { value: 30, label: "Lbl" },
              ]}
              activeIndex={5}
              barWidth="wide"
              showLabels
              showTooltip
              tooltipValue="$680"
              tooltipTrend="up"
            />
          </ChartCard>
        </SubSection>
      </Section>

      <Section title="BarHorizontalChart" description="Horizontal bar chart (Small thin / Medium wide)">
        <SubSection title="Small (h-2 rounded-full)">
          <ChartCard title="Statistic" subtitle="Income and Expenses" size="6col">
            <BarHorizontalChart
              data={[
                { value: 60, label: "Lbl" },
                { value: 20, label: "Lbl" },
                { value: 100, label: "Lbl" },
                { value: 80, label: "Lbl" },
                { value: 30, label: "Lbl" },
                { value: 85, label: "Lbl" },
                { value: 70, label: "Lbl" },
              ]}
              activeIndex={3}
              showLabels
              showTooltip
              tooltipValue="$680"
              tooltipTrend="up"
            />
          </ChartCard>
        </SubSection>
        <SubSection title="Medium (h-8 rounded-lg)">
          <ChartCard title="Statistic" subtitle="Income and Expenses" size="6col">
            <BarHorizontalChart
              data={[
                { value: 60, label: "Lbl" },
                { value: 20, label: "Lbl" },
                { value: 100, label: "Lbl" },
                { value: 80, label: "Lbl" },
                { value: 30, label: "Lbl" },
                { value: 85, label: "Lbl" },
              ]}
              barWidth="wide"
              activeIndex={2}
              showLabels
              showTooltip
              tooltipValue="$880"
              tooltipTrend="up"
            />
          </ChartCard>
        </SubSection>
      </Section>

      <Section title="BarUpsideDownChart" description="Dual-direction bar chart (Income violet 上 / Expenses red 下)">
        <SubSection title="4 Col (thin / wide)">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <BarUpsideDownChart
              data={[
                { upperValue: 50, lowerValue: 30, label: "Lbl" },
                { upperValue: 70, lowerValue: 60, label: "Lbl" },
                { upperValue: 30, lowerValue: 20, label: "Lbl" },
                { upperValue: 90, lowerValue: 50, label: "Lbl" },
                { upperValue: 60, lowerValue: 40, label: "Lbl" },
                { upperValue: 45, lowerValue: 35, label: "Lbl" },
                { upperValue: 65, lowerValue: 45, label: "Lbl" },
              ]}
              upperColor="bg-fg-violet"
              lowerColor="bg-fg-red"
              activeIndex={3}
              showLabels
              showTooltip
              tooltipUpperValue="$680"
              tooltipLowerValue="$280"
            />
            <ChartStatFooter
              items={[
                { label: "Label", value: "$20k", color: "bg-fg-violet", trendDirection: "up" },
                { label: "Label", value: "$16k", color: "bg-fg-red", trendDirection: "down" },
              ]}
            />
          </ChartCard>
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <BarUpsideDownChart
              data={[
                { upperValue: 50, lowerValue: 30, label: "Lbl" },
                { upperValue: 70, lowerValue: 60, label: "Lbl" },
                { upperValue: 30, lowerValue: 20, label: "Lbl" },
                { upperValue: 90, lowerValue: 50, label: "Lbl" },
                { upperValue: 60, lowerValue: 40, label: "Lbl" },
                { upperValue: 45, lowerValue: 35, label: "Lbl" },
                { upperValue: 65, lowerValue: 45, label: "Lbl" },
              ]}
              upperColor="bg-fg-violet"
              lowerColor="bg-fg-red"
              barWidth="wide"
              activeIndex={3}
              showLabels
              showTooltip
              tooltipUpperValue="$680"
              tooltipLowerValue="$280"
            />
            <ChartStatFooter
              items={[
                { label: "Label", value: "$20k", color: "bg-fg-violet", trendDirection: "up" },
                { label: "Label", value: "$16k", color: "bg-fg-red", trendDirection: "down" },
              ]}
            />
          </ChartCard>
        </SubSection>
        <SubSection title="6 Col (Statistic Income / Expenses)">
          <ChartCard title="Statistic" subtitle="Income and Expenses" size="6col">
            <BarUpsideDownChart
              data={[
                { upperValue: 50, lowerValue: 30, label: "Lbl" },
                { upperValue: 70, lowerValue: 60, label: "Lbl" },
                { upperValue: 30, lowerValue: 20, label: "Lbl" },
                { upperValue: 85, lowerValue: 55, label: "Lbl" },
                { upperValue: 100, lowerValue: 70, label: "Lbl" },
                { upperValue: 60, lowerValue: 40, label: "Lbl" },
                { upperValue: 45, lowerValue: 35, label: "Lbl" },
                { upperValue: 65, lowerValue: 45, label: "Lbl" },
                { upperValue: 55, lowerValue: 40, label: "Lbl" },
                { upperValue: 40, lowerValue: 30, label: "Lbl" },
                { upperValue: 50, lowerValue: 35, label: "Lbl" },
                { upperValue: 35, lowerValue: 25, label: "Lbl" },
              ]}
              upperColor="bg-fg-violet"
              lowerColor="bg-fg-red"
              barWidth="wide"
              activeIndex={4}
              showLabels
              showTooltip
              tooltipUpperValue="$680"
              tooltipLowerValue="$280"
            />
          </ChartCard>
        </SubSection>
      </Section>

      <Section title="组合用法 (ChartCard)" description="对照 figma：chart 放进 ChartCard，搭配 ChartStatFooter / ChartListItem">
        <SubSection title="Donut + ChartStatFooter">
          <ChartCard title="Revenue" subtitle="Monthly breakdown" size="4col">
            <DonutChart
              size="sm"
              segments={[{ value: 75 }]}
              centerValue="75%"
              trend="+10%"
              trendDirection="up"
            />
            <ChartStatFooter
              items={[
                { label: "Label", value: "$20k", trend: "up", trendDirection: "up" },
                { label: "Label", value: "$16k", trend: "down", trendDirection: "down" },
                { label: "Label", value: "$1.5k", trend: "up", trendDirection: "up" },
              ]}
            />
          </ChartCard>
        </SubSection>
        <SubSection title="Donut + ChartListItem 列表">
          <ChartCard title="Top Channels" subtitle="This month" size="4col">
            <DonutChart
              size="sm"
              segments={[
                { value: 45, color: "bg-fg-violet" },
                { value: 30, color: "bg-blue-600" },
                { value: 25, color: "bg-emerald-500" },
              ]}
              centerValue="75%"
              trend="+10%"
              trendDirection="up"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartListItem
                icon={WalletLinear}
                title="Title Here"
                subtitle="Subtitle"
                value="$24,500"
                trend="+12%"
                trendDirection="up"
              />
              <ChartListItem title="Title Here" subtitle="Subtitle" value="$24,500" trend="-4%" trendDirection="down" />
              <ChartListItem title="Title Here" subtitle="Subtitle" value="$24,500" trend="+3%" trendDirection="up" />
            </div>
          </ChartCard>
        </SubSection>
        <SubSection title="Bar + tooltip">
          <ChartCard title="Weekly Revenue" subtitle="Last 7 days" size="6col">
            <BarChart
              data={[
                { value: 40, label: "Mon" },
                { value: 65, label: "Tue" },
                { value: 30, label: "Wed" },
                { value: 80, label: "Thu" },
                { value: 55, label: "Fri" },
                { value: 70, label: "Sat" },
                { value: 45, label: "Sun" },
              ]}
              inactiveColor="bg-purple-300"
              activeIndex={3}
              barWidth="wide"
              showLabels
              showTooltip
              tooltipValue="$4,200"
              tooltipTrend="up"
            />
          </ChartCard>
        </SubSection>
      </Section>

      <Section title="SmoothLineChart" description="Catmull-Rom smoothed line with area fill">
        <SubSection title="4 Col (小卡片，仅 line + tooltip)">
          <ChartCard title="Title Here" subtitle="Text Here" size="4col">
            <SmoothLineChart
              series={[
                { data: [520, 620, 760, 700, 560, 680, 880, 820, 700, 780, 900, 720] },
              ]}
              activeIndex={6}
              showTooltip
              tooltipItems={[{ color: "bg-fg-violet", value: "$880", trend: "up" }]}
              height="h-28"
              yDomain={[400, 1000]}
            />
            <ChartStatFooter
              items={[
                { label: "Label", value: "$4,103", trend: "10%", trendDirection: "up" },
              ]}
            />
          </ChartCard>
        </SubSection>
        <SubSection title="6 Col (Statistic 样式 + 轴 + 两条 series)">
          <ChartCard title="Statistic" subtitle="Income and Expenses" size="6col">
            <SmoothLineChart
              series={[
                { data: [680, 820, 960, 880, 700, 820, 1040, 960, 780, 900, 1080, 900] },
                { color: "bg-emerald-500", data: [320, 420, 560, 480, 340, 460, 620, 540, 400, 520, 680, 520] },
              ]}
              activeIndex={6}
              yDomain={[0, 1200]}
              showYAxis
              yAxisLabels={["$1.2k", "$1k", "$800", "$600", "$400", "$200", "0"]}
              xAxisLabels={["Lbl", "Lbl", "Lbl", "Lbl", "Lbl", "Lbl", "Lbl", "Lbl", "Lbl", "Lbl", "Lbl", "Lbl"]}
              showTooltip
              tooltipItems={[
                { color: "bg-fg-violet", label: "Label", value: "$680", trend: "up" },
                { color: "bg-emerald-500", label: "Label", value: "$280", trend: "down" },
              ]}
              height="h-40"
            />
          </ChartCard>
        </SubSection>
      </Section>
    </div>
  );
}
