"use client";

import { PageHeading, Section } from "../../cases/_shared";
import { FusionFamilyExamples } from "../../components/_fusion/family-examples";
import { AnalysisScenario, MultiAgentScenario, OpsScenario, PlanScenario, RefundScenario, WritingScenario } from "./_scenarios";

export default function AgentScenariosPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading title="场景" hint="把组件串成完整流程：每个场景都可以直接操作，点“重放”从头再看。" />
      <Section title="经营分析问答"><AnalysisScenario /></Section>
      <Section title="退款处理"><RefundScenario /></Section>
      <Section title="多步任务"><PlanScenario /></Section>
      <Section title="文档写作"><WritingScenario /></Section>
      <Section title="后台任务中心"><OpsScenario /></Section>
      <Section title="多智能体协作"><MultiAgentScenario /></Section>
      <FusionFamilyExamples family="agent" />
    </div>
  );
}
