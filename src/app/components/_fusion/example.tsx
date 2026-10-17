"use client";

import dynamic from "next/dynamic";
import "./examples.css";
import { MotionConfig } from "motion/react";
import { MigrationPreview, type MigrationPreviewKind } from "../_migration-previews";
import { actionIds, formNavigationIds, agentChartIds, compositionIds, fusionItems } from "./registry";
import type { FusionExampleProps } from "./types";

const ActionsExamples = dynamic(() => import("./actions").then(module => module.ActionsExamples));
const FormsNavigationExamples = dynamic(() => import("./forms-navigation").then(module => module.FormsNavigationExamples));
const AgentChartExamples = dynamic(() => import("./agent-charts").then(module => module.AgentChartExamples));
const CompositionExamples = dynamic(() => import("./compositions").then(module => module.CompositionExamples));
const SidebarExample = dynamic(() => import("../../prototype/component-fusion/_sidebar-preview").then(module => module.SidebarFusionPreview));
const has = (ids: readonly string[], id: string) => ids.includes(id);

/** Formal core/component compositions only. Deferred prototypes are intentionally absent. */
export function FusionExample(props: FusionExampleProps) {
  const { id, locale, color, motion } = props;
  const item = fusionItems.find(item => item.id === id);
  if (!item) return null;
  let example;
  if (has(actionIds, id)) example = <ActionsExamples key={`${id}-${locale}`} {...props} />;
  else if (has(formNavigationIds, id)) example = <FormsNavigationExamples key={`${id}-${locale}`} {...props} />;
  else if (has(agentChartIds, id)) example = <AgentChartExamples key={`${id}-${locale}`} {...props} />;
  else if (has(compositionIds, id)) example = <CompositionExamples {...props} />;
  else if (id === "040") example = <SidebarExample locale={locale} color={color} motion={motion} />;
  else example = <MigrationPreview kind={item.kind as MigrationPreviewKind} locale={locale} color={color} motion={motion} hideControls />;
  return <MotionConfig reducedMotion={motion === "none" ? "always" : "user"}><div data-fusion-react={id} data-motion={motion} lang={locale === "zh" ? "zh-CN" : "en"} className="forge-fusion-example w-full min-w-0 text-sm text-fg-black" style={{ "--accent": color === "blue" ? "var(--fg-blue)" : color === "purple" ? "var(--fg-violet)" : "var(--fg-black)" } as React.CSSProperties}>{example}</div></MotionConfig>;
}
