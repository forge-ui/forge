/* eslint-disable @next/next/no-img-element */

import { askAiIconDataUrl } from "../assets/_inlined";

// Each SVG image has its own gradient ID scope, including multiple headers.
export function AskAiIcon() {
  return <img src={askAiIconDataUrl} width={24} height={24} alt="" aria-hidden="true" className="h-6 w-6 shrink-0" />;
}
