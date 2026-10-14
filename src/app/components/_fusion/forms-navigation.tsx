"use client";
import "./forms-navigation-examples.css";
import type { CSSProperties } from "react";
import { FormExamples } from "./forms-navigation-forms";
import { NavigationExamples } from "./forms-navigation-menus";
import type { FusionExampleProps } from "./types";
const menuIds = new Set(["010", "011", "027", "037", "041", "042", "045", "047", "048", "074"]);
export function FormsNavigationExamples(props: FusionExampleProps) {
  return <div className="forge-fusion-fn w-full min-w-0 text-sm text-fg-black" data-motion={props.motion} style={{ "--fusion-accent": `var(--fg-${props.color === "purple" ? "violet" : props.color === "black" ? "black" : "blue"})` } as CSSProperties}>{menuIds.has(props.id) ? <NavigationExamples {...props} /> : <FormExamples {...props} />}</div>;
}
