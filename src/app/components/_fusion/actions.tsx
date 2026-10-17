"use client";
import type { FusionExampleProps } from "./types";
import { AsyncActionExample, CopyExample, LockoutExample, MagneticExample, PlaybackExample, QuantityExample, RollingExample, SocialExample, ToggleActionExample } from "./actions-buttons";
import { EditorialExample, FollowExample, SpotlightExample } from "./actions-cards";
import { CorrectionExample, DeliveryExample, GlidingTooltipExample, QueueExample, ReadingExample, RetryExample, StackingToastExample, SwipeExample, SyncExample } from "./actions-feedback";
import "./actions-examples.css";

export function ActionsExamples(props: FusionExampleProps) {
  if (["001", "004", "005", "081"].includes(props.id)) return <AsyncActionExample key={props.id} {...props} />;
  if (["006", "012", "022"].includes(props.id)) return <ToggleActionExample key={props.id} {...props} />;
  switch (props.id) {
    case "002": return <MagneticExample {...props} />;
    case "007": return <PlaybackExample {...props} />;
    case "008": return <CopyExample {...props} />;
    case "009": return <RollingExample {...props} />;
    case "018": return <QuantityExample {...props} />;
    case "049": return <EditorialExample {...props} />;
    case "050": return <SpotlightExample {...props} />;
    case "054": return <FollowExample {...props} />;
    case "058": return <ReadingExample {...props} />;
    case "066": return <SocialExample {...props} />;
    case "067": return <LockoutExample {...props} />;
    case "070": return <StackingToastExample {...props} />;
    case "071": return <SwipeExample {...props} />;
    case "076": return <GlidingTooltipExample {...props} />;
    case "080": return <SyncExample {...props} />;
    case "083": return <QueueExample {...props} />;
    case "087": return <DeliveryExample {...props} />;
    case "089": return <CorrectionExample {...props} />;
    case "090": return <RetryExample {...props} />;
    default: return null;
  }
}
