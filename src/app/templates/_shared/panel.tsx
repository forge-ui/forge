import type { PanelProps } from "@forge-ui-official/core";
import { Panel as CorePanel } from "@forge-ui-official/core";

export function Panel(props: Omit<PanelProps, "variant">) {
  return <CorePanel {...props} variant="template" />;
}
