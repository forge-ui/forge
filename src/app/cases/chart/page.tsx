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
} from "@forge-ui-official/core";
import { WalletLinear } from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection } from "../_shared";

export default function ChartCasePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="图表"
        hint="展示趋势、占比和分布，支持图例、提示和多组数据。"
      />

      <Section title="ChartTooltip" description="图表深色提示">
        <SubSection title="示例">
          <ChartTooltip
            items={[
              { color: "bg-fg-violet", label: "收入", value: "$4,200", trend: "up" },
              { color: "bg-fg-blue", label: "支出", value: "$1,800", trend: "down" },
            ]}
          />
          <ChartTooltip
            items={[
              { color: "bg-fg-green-500", value: "$12,500", trend: "up" },
            ]}
          />
        </SubSection>
      </Section>

      <Section title="ChartCard" description="图表内容容器">
        <SubSection title="示例">
          <ChartCard title="收入概览" subtitle="按月统计" size="4col" width="full">
            <DonutChart
              segments={[
                { value: 40, color: "bg-fg-violet" },
                { value: 30, color: "bg-fg-blue" },
                { value: 20, color: "bg-fg-green-500" },
                { value: 10, color: "bg-fg-yellow" },
              ]}
              centerValue="$8.4k"
              size="sm"
            />
          </ChartCard>
        </SubSection>
      </Section>

      <Section title="ChartListItem" description="图表图例列表项">
        <SubSection title="示例">
          <div className="w-80 flex flex-col gap-3">
            <ChartListItem
              icon={WalletLinear}
              title="收入"
              subtitle="本月"
              value="$12,500"
              trend="+12.5%"
              trendDirection="up"
            />
            <ChartListItem
              title="支出"
              value="$3,200"
              trend="-4%"
              trendDirection="down"
            />
          </div>
        </SubSection>
      </Section>

      <Section title="ChartStatFooter" description="图表底部统计">
        <SubSection title="示例">
          <div className="w-96">
            <ChartStatFooter
              items={[
                { label: "收入", value: "$12.5k", color: "bg-fg-violet", trend: "+12%", trendDirection: "up" },
                { label: "支出", value: "$3.2k", color: "bg-fg-blue", trend: "-4%", trendDirection: "down" },
                { label: "利润", value: "$9.3k", color: "bg-fg-green-500", trend: "+18%", trendDirection: "up" },
              ]}
            />
          </div>
        </SubSection>
      </Section>

      <Section title="MeterChart" description="用分段条展示三个渠道的收入占比">
        <SubSection title="渠道占比">

          <ChartCard title="项目概览" subtitle="本月收入分布" size="4col" width="full">
            <MeterChart
              segments={[{ value: 50 }, { value: 30 }, { value: 20 }]}
              subtitle="今日增加 ¥181"
              trend="10%"
              trendDirection="up"
            />
            <p className="self-stretch text-center text-sm leading-5 tracking-fg">
              <span className="text-fg-grey-700">你已获得 </span>
              <span className="font-semibold text-fg-black">$240</span>
              <span className="text-fg-grey-700">，高于昨日</span>
            </p>
            <ChartStatFooter
              items={[
                { label: "产品订阅", value: "$20,000", color: "bg-fg-violet", trendDirection: "up" },
                { label: "专业服务", value: "$40,000", color: "bg-fg-grey-200", trendDirection: "up" },
              ]}
            />
          </ChartCard>
        </SubSection>
      </Section>

      <Section title="HalfDonutChart" description="用半环展示目标完成情况">
        <SubSection title="常规">

          <ChartCard title="项目概览" subtitle="本月收入分布" size="4col" width="full">
            <HalfDonutChart
              segments={[
                { value: 50 },
                { value: 25 },
              ]}
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="今日增加 ¥181"
            />
            <ChartStatFooter
              items={[
                { label: "培训课程", value: "$20k", trendDirection: "up" },
                { label: "技术支持", value: "$16k", trendDirection: "up" },
              ]}
            />
          </ChartCard>
        </SubSection>

      </Section>

      <Section title="DashedHalfDonutChart" description="用虚线半环展示目标完成情况">
        <SubSection title="常规">

          <ChartCard title="项目概览" subtitle="本月收入分布" size="4col" width="full">
            <DashedHalfDonutChart
              segments={[
                { value: 50 },
                { value: 25 },
              ]}
              trackColor="bg-fg-violet-300"
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="今日增加 ¥181"
            />
            <ChartStatFooter
              items={[
                { label: "其他收入", value: "$20k", trendDirection: "up" },
                { label: "产品订阅", value: "$16k", trendDirection: "up" },
                { label: "专业服务", value: "$1.5k", trendDirection: "up" },
              ]}
            />
          </ChartCard>
        </SubSection>

      </Section>

      <Section title="DonutChart" description="用环形展示渠道占比与总额">

        <SubSection title="常规">

          <ChartCard title="项目概览" subtitle="本月收入分布" size="4col" width="full">
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
              subtitle="今日增加 ¥181"
            />
            <ChartStatFooter
              items={[
                { label: "培训课程", value: "$20k", trendDirection: "up" },
                { label: "技术支持", value: "$16k", trendDirection: "up" },
                { label: "其他收入", value: "$1.5k", trendDirection: "up" },
              ]}
            />
          </ChartCard>
        </SubSection>

      </Section>

      <Section title="PieChart" description="五个渠道的收入占比，配合图例查看具体金额">

        <SubSection title="渠道收入分布">

          <ChartCard title="项目概览" subtitle="本月收入分布" size="4col" width="full">
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
              <ChartLegendItem shade={0} label="产品订阅" value="¥35,000" />
              <ChartLegendItem shade={1} label="专业服务" value="¥25,000" />
              <ChartLegendItem shade={2} label="培训课程" value="¥20,000" />
              <ChartLegendItem shade={3} label="技术支持" value="¥12,000" />
              <ChartLegendItem shade={4} label="其他收入" value="¥8,000" />
            </div>
          </ChartCard>
        </SubSection>

      </Section>

      <Section title="MultilayerDonutChart" description="用四层进度环对比不同项目的完成情况">
        <SubSection title="四个项目进度">

          <ChartCard title="项目进度" subtitle="四个项目的目标完成率" size="4col" width="full">
            <MultilayerDonutChart
              layers={[
                { value: 75 },
                { value: 60 },
                { value: 45 },
                { value: 30 },
              ]}
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="较上月"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="官网改版" value="75%" />
              <ChartLegendItem shade={1} label="移动端设计" value="60%" />
              <ChartLegendItem shade={2} label="组件升级" value="45%" />
              <ChartLegendItem shade={3} label="文档完善" value="30%" />
            </div>
          </ChartCard>
        </SubSection>

      </Section>

      <Section title="BubbleChart" description="用气泡大小比较四组数据">
        <SubSection title="常规">

          <ChartCard title="项目概览" subtitle="本月收入分布" size="4col" width="full">
            <BubbleChart
              bubbles={[
                { value: 58.33 },
                { value: 25 },
                { value: 8 },
                { value: 2 },
              ]}
            />
            <div className="w-full flex flex-col gap-3">
              <ChartLegendItem shade={0} label="其他收入" value="$10,000" />
              <ChartLegendItem shade={2} label="产品订阅" value="$10,000" />
              <ChartLegendItem shade={3} label="专业服务" value="$10,000" />
              <ChartLegendItem shade={4} label="培训课程" value="$10,000" />
            </div>
          </ChartCard>
        </SubSection>

      </Section>

      <Section title="BarChart (Vertical)" description="按月比较收入，悬停查看数据">
        <SubSection title="紧凑卡片">

          <ChartCard title="项目概览" subtitle="本月收入分布" size="4col" width="full">
            <BarChart
              data={[
                { value: 30, label: "1月" },
                { value: 70, label: "2月" },
                { value: 55, label: "3月" },
                { value: 100, label: "4月" },
                { value: 80, label: "5月" },
                { value: 50, label: "6月" },
                { value: 35, label: "7月" },
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
        <SubSection title="宽幅趋势">
          <ChartCard title="统计" subtitle="收入与支出" size="6col">
            <BarChart
              data={[
                { value: 30, label: "8月" },
                { value: 60, label: "9月" },
                { value: 45, label: "10月" },
                { value: 80, label: "11月" },
                { value: 65, label: "12月" },
                { value: 100, label: "1月" },
                { value: 85, label: "2月" },
                { value: 55, label: "3月" },
                { value: 70, label: "4月" },
                { value: 40, label: "5月" },
                { value: 50, label: "6月" },
                { value: 30, label: "7月" },
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

      <Section title="BarHorizontalChart" description="横向比较各渠道收入">
        <SubSection title="紧凑样式">
          <ChartCard title="统计" subtitle="收入与支出" size="6col">
            <BarHorizontalChart
              data={[
                { value: 60, label: "8月" },
                { value: 20, label: "9月" },
                { value: 100, label: "10月" },
                { value: 80, label: "11月" },
                { value: 30, label: "12月" },
                { value: 85, label: "1月" },
                { value: 70, label: "2月" },
              ]}
              activeIndex={3}
              showLabels
              showTooltip
              tooltipValue="$680"
              tooltipTrend="up"
            />
          </ChartCard>
        </SubSection>
        <SubSection title="常规样式">
          <ChartCard title="统计" subtitle="收入与支出" size="6col">
            <BarHorizontalChart
              data={[
                { value: 60, label: "3月" },
                { value: 20, label: "4月" },
                { value: 100, label: "5月" },
                { value: 80, label: "6月" },
                { value: 30, label: "7月" },
                { value: 85, label: "8月" },
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

      <Section title="BarUpsideDownChart" description="对比各月收入与支出">
        <SubSection title="紧凑卡片">

          <ChartCard title="项目概览" subtitle="本月收入分布" size="4col" width="full">
            <BarUpsideDownChart
              data={[
                { upperValue: 50, lowerValue: 30, label: "9月" },
                { upperValue: 70, lowerValue: 60, label: "10月" },
                { upperValue: 30, lowerValue: 20, label: "11月" },
                { upperValue: 90, lowerValue: 50, label: "12月" },
                { upperValue: 60, lowerValue: 40, label: "1月" },
                { upperValue: 45, lowerValue: 35, label: "2月" },
                { upperValue: 65, lowerValue: 45, label: "3月" },
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
                { label: "技术支持", value: "$20k", color: "bg-fg-violet", trendDirection: "up" },
                { label: "其他收入", value: "$16k", color: "bg-fg-red", trendDirection: "down" },
              ]}
            />
          </ChartCard>
        </SubSection>
        <SubSection title="收入与支出">
          <ChartCard title="统计" subtitle="收入与支出" size="6col">
            <BarUpsideDownChart
              data={[
                { upperValue: 50, lowerValue: 30, label: "4月" },
                { upperValue: 70, lowerValue: 60, label: "5月" },
                { upperValue: 30, lowerValue: 20, label: "6月" },
                { upperValue: 85, lowerValue: 55, label: "7月" },
                { upperValue: 100, lowerValue: 70, label: "8月" },
                { upperValue: 60, lowerValue: 40, label: "9月" },
                { upperValue: 45, lowerValue: 35, label: "10月" },
                { upperValue: 65, lowerValue: 45, label: "11月" },
                { upperValue: 55, lowerValue: 40, label: "12月" },
                { upperValue: 40, lowerValue: 30, label: "1月" },
                { upperValue: 50, lowerValue: 35, label: "2月" },
                { upperValue: 35, lowerValue: 25, label: "3月" },
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

      <Section title="图表与统计组合" description="将图表、明细与统计放在同一卡片内，形成完整的数据概览。">
        <SubSection title="环图与底部统计">
          <ChartCard title="收入" subtitle="按月统计" size="4col" width="full">
            <DonutChart
              size="sm"
              segments={[{ value: 75 }]}
              centerValue="75%"
              trend="+10%"
              trendDirection="up"
            />
            <ChartStatFooter
              items={[
                { label: "产品订阅", value: "$20k", trend: "up", trendDirection: "up" },
                { label: "专业服务", value: "$16k", trend: "down", trendDirection: "down" },
                { label: "培训课程", value: "$1.5k", trend: "up", trendDirection: "up" },
              ]}
            />
          </ChartCard>
        </SubSection>
        <SubSection title="环图与明细列表">
          <ChartCard title="主要渠道" subtitle="本月" size="4col" width="full">
            <DonutChart
              size="sm"
              segments={[
                { value: 45, color: "bg-fg-violet" },
                { value: 30, color: "bg-fg-blue" },
                { value: 25, color: "bg-fg-green-500" },
              ]}
              centerValue="75%"
              trend="+10%"
              trendDirection="up"
            />
            <div className="w-full flex flex-col gap-3">
              <ChartListItem
                icon={WalletLinear}
                title="项目概览"
                subtitle="副标题"
                value="$24,500"
                trend="+12%"
                trendDirection="up"
              />
              <ChartListItem title="项目概览" subtitle="副标题" value="$24,500" trend="-4%" trendDirection="down" />
              <ChartListItem title="项目概览" subtitle="副标题" value="$24,500" trend="+3%" trendDirection="up" />
            </div>
          </ChartCard>
        </SubSection>
        <SubSection title="柱图与数据提示">
          <ChartCard title="每周收入" subtitle="最近 7 天" size="6col">
            <BarChart
              data={[
                { value: 40, label: "周一" },
                { value: 65, label: "周二" },
                { value: 30, label: "周三" },
                { value: 80, label: "周四" },
                { value: 55, label: "周五" },
                { value: 70, label: "周六" },
                { value: 45, label: "周日" },
              ]}
              inactiveColor="bg-fg-violet-300"
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

      <Section title="SmoothLineChart" description="用平滑折线比较收入与支出趋势">
        <SubSection title="紧凑折线">
          <ChartCard title="项目概览" subtitle="本月收入分布" size="4col" width="full">
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
                { label: "技术支持", value: "$4,103", trend: "10%", trendDirection: "up" },
              ]}
            />
          </ChartCard>
        </SubSection>
        <SubSection title="双系列趋势">
          <ChartCard title="统计" subtitle="收入与支出" size="6col">
            <SmoothLineChart
              series={[
                { data: [680, 820, 960, 880, 700, 820, 1040, 960, 780, 900, 1080, 900] },
                { color: "bg-fg-green-500", data: [320, 420, 560, 480, 340, 460, 620, 540, 400, 520, 680, 520] },
              ]}
              activeIndex={6}
              yDomain={[0, 1200]}
              showYAxis
              yAxisLabels={["$1.2k", "$1k", "$800", "$600", "$400", "$200", "0"]}
              xAxisLabels={["4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", "1月", "2月", "3月"]}
              showTooltip
              tooltipItems={[
                { color: "bg-fg-violet", label: "其他收入", value: "$680", trend: "up" },
                { color: "bg-fg-green-500", label: "产品订阅", value: "$280", trend: "down" },
              ]}
              height="h-40"
            />
          </ChartCard>
        </SubSection>
      </Section>
    </div>
  );
}
