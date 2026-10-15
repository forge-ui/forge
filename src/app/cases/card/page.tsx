"use client";

import { useState } from "react";
import {
  SurfaceCard, StatCard, ProgressStatCard, LineChartStatCard,
  WheelChartStatCard, BarChartStatCard, ImageStatCard, BalanceCard,
  DebitCard, CreditCard, ProgressCard, HighlightCard, ActivityCard,
  ProjectCard, TaskCard, UserCard, EventCard, ProfileCard, Button,
} from "@forge-ui-official/core";
import { WalletBoldDuotone, CartLargeBoldDuotone } from "@forge-ui-official/core/icons";
import { PageHeading, Section } from "../_shared";

const demoAvatars = [
  "https://placehold.co/40x40/7269ef/ffffff?text=1",
  "https://placehold.co/40x40/3955ff/ffffff?text=2",
  "https://placehold.co/40x40/07111f/ffffff?text=3",
];

export default function CardCasePage() {
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [balanceAction, setBalanceAction] = useState("");
  const [profileSelected, setProfileSelected] = useState(false);

  return (
    <div className="flex flex-col gap-10">
      <PageHeading title="卡片" hint="查看统计、账户、项目和成员等常见场景。每种卡片保留一个完整案例，交互示例接续展示在本页下方。" />
      <div className="grid min-w-0 grid-cols-1 items-start gap-x-8 gap-y-10 2xl:grid-cols-2">
        <Section title="内容面板" description="集中展示审批风险、负责人和截止时间。">
          <SurfaceCard title="审批信息" subtitle="官网改版的上线审批" className="w-full">
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <div><dt className="text-fg-grey-700">风险</dt><dd className="mt-1 font-medium text-fg-black">低</dd></div>
              <div><dt className="text-fg-grey-700">负责人</dt><dd className="mt-1 font-medium text-fg-black">叶宁</dd></div>
              <div><dt className="text-fg-grey-700">截止时间</dt><dd className="mt-1 font-medium text-fg-black">今天</dd></div>
            </dl>
          </SurfaceCard>
        </Section>
        <Section title="订单统计" description="查看本周订单总量及较上周的变化。">
          <StatCard title="本周订单" value="1,245" trend="4.3%" trendDirection="up" subtitle="较上周" theme="blue" width="full" icon={<CartLargeBoldDuotone size={20} color="currentColor" />} />
        </Section>
        <Section title="目标完成情况" description="将当前订单量与本月目标放在一起查看。">
          <ProgressStatCard title="本月订单" value="1,245" trend="4.3%" theme="white" width="full" progressValue={65} progressColor="blue" />
        </Section>
        <Section title="收入趋势" description="用折线概览最近一周的收入变化。">
          <LineChartStatCard title="本周收入" value="¥12,400" trend="8.7%" theme="white" width="full" chartColor="blue" />
        </Section>
        <Section title="任务完成率" description="用圆环展示当前完成比例。">
          <WheelChartStatCard title="任务完成率" value="72%" trend="3.2%" theme="white" width="full" wheelPercent={72} wheelColor="purple" />
        </Section>
        <Section title="每日销售额" description="用柱形图比较最近五天的销售表现。">
          <BarChartStatCard title="今日销售额" value="¥2,100" trend="12%" theme="white" width="full" bars={[10, 22, 30, 40, 25]} barColor="blue" />
        </Section>
        <Section title="营销活动概览" description="结合活动业绩和参与成员展示推广成果。">
          <ImageStatCard title="秋季品牌推广" subtitle="10 月 1 日至今" value="¥18,420" trend="12.5%" trendSubtitle="今日增加 ¥150" theme="purple" width="full" avatars={demoAvatars} />
        </Section>
        <Section title="账户余额" description="切换金额显示，点击转账或收款查看演示反馈。">
          <Button variant="secondary" size="sm" onClick={() => setBalanceHidden((hidden) => !hidden)}>{balanceHidden ? "显示余额" : "隐藏余额"}</Button>
          <BalanceCard balance="¥9,256.09" balanceHidden={balanceHidden} trend="2.1%" subtitle="较上月" theme="white" width="full" cardNumber="**** 9090" onTransfer={() => setBalanceAction("已选择转账。此为演示，不会产生实际交易。")} onRequest={() => setBalanceAction("已选择收款。此为演示，不会产生实际交易。")} />
          <p role="status" className="text-sm text-fg-grey-700">{balanceAction || "演示账户，不会产生实际交易。"}</p>
        </Section>
        <Section title="借记卡账户" description="展示银行卡余额、尾号和有效期，卡号为演示数据。">
          <DebitCard balance="¥9,256.09" cardNumber="9090" expiry="07/28" theme="blue" variant="glow" width="full" />
        </Section>
        <Section title="信用卡信息" description="展示持卡人、卡号和有效期，卡号为演示数据。">
          <CreditCard cardNumber="9090" holderName="张明" expiry="07/28" theme="dark" variant="flat" width="full" />
        </Section>
        <Section title="项目进度汇总" description="展示已完成、进行中和未开始的任务数量。">
          <ProgressCard title="官网改版" value="71%" subtitle="24 项任务已完成" theme="white" width="full" progress={24 / 34 * 100} progressColor="var(--color-fg-blue)" items={[
            { label: "已完成", value: "24", color: "var(--color-fg-blue)" },
            { label: "进行中", value: "8", color: "var(--color-fg-violet)" },
            { label: "未开始", value: "2", color: "var(--color-fg-grey-500)" },
          ]} />
        </Section>
        <Section title="项目概览" description="查看项目目标、参与成员、完成进度和截止日期。">
          <ProjectCard title="营销官网改版" description="按照新的品牌规范改版网站首页。" progress={65} progressColor="blue" avatars={demoAvatars} date="10 月 25 日截止" width="full" />
        </Section>
        <Section title="任务执行" description="查看单项任务的执行进度与负责人。">
          <TaskCard title="发布测试版" description="面向 10% 的用户灰度发布，并观察运行指标。" progress={60} progressColor="purple" avatars={demoAvatars.slice(0, 2)} date="明天截止" width="full" />
        </Section>
        <Section title="成员工作概览" description="展示成员角色及参与项目、任务的数量。">
          <UserCard avatar={demoAvatars[0]} name="张明" subtitle={<span className="text-sm text-fg-grey-700">产品设计师</span>} stats={[{ label: "项目", value: "24" }, { label: "任务", value: "156" }]} className="w-full" />
        </Section>
        <Section title="团队日程" description="展示会议时间和参与成员。">
          <EventCard title="每周站会" timeRange="周一 10:00—10:30" color="blue" avatars={demoAvatars} className="w-full" />
        </Section>
        <Section title="选择协作成员" description="点击成员卡片切换选择状态。">
          <ProfileCard avatar={demoAvatars[0]} name="张明" subtitle="产品设计师" state={profileSelected ? "selected" : "idle"} accent="purple" onClick={() => setProfileSelected((selected) => !selected)} className="w-full" />
          <p role="status" className="text-sm text-fg-grey-700">{profileSelected ? "已选择张明" : "尚未选择成员"}</p>
        </Section>
        <Section title="商品推荐" description="展示商品细节及同类推荐。">
          <HighlightCard title="通勤好物" theme="purple" width="full" image="https://placehold.co/280x280/ffffff/07111f?text=Bag" annotations={[
            { label: "材质", value: "皮革", position: { top: "10%", left: "10%" } },
            { label: "颜色", value: "棕色", position: { bottom: "30%", right: "10%" } },
          ]} products={[
            { image: "https://placehold.co/40x40/7269ef/ffffff?text=1", name: "通勤包", subtitle: "皮革", value: "¥120" },
            { image: "https://placehold.co/40x40/3955ff/ffffff?text=2", name: "帆布包", subtitle: "帆布", value: "¥89" },
          ]} />
        </Section>
        <Section title="收款动态" description="展示到账通知、付款人和交易明细。">
          <ActivityCard icon={<WalletBoldDuotone size={20} color="var(--color-fg-violet)" />} headerText="收到付款" datetime="2 小时前" avatar={demoAvatars[0]} title="张明支付了 ¥1,250" description="营销服务账单 #302012" metadata={[{ label: "金额", value: "¥1,250" }, { label: "方式", value: "银行卡" }, { label: "状态", value: "已完成" }]} />
        </Section>
      </div>
    </div>
  );
}
