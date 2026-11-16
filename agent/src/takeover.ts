import { beginRun, endRun, pointAt, ripple, setStep, setStopHandler } from "./operator/overlay";

export type PageTakeover = {
  /** Says what is being done, in the bar at the bottom of the page. */
  step(label: string): void;
  /** Moves the pointer to an element (scrolling it into view) and pulses there, as a click would. */
  point(element: Element, label?: string): Promise<void>;
  /** Gives the page back to the user. */
  end(): void;
};

/**
 * The page takeover Forge Agent shows while it operates a page — the pointer, the frame, the bar with
 * 停止, and the user's own clicks and keys held off — for apps that drive the page with their own
 * logic, such as forge-starter filling a form for review. End it before the user has to act.
 */
export function takeOverPage({ label, onStop }: { label: string; onStop?: () => void }): PageTakeover {
  let active = true;
  setStopHandler(() => {
    end();
    onStop?.();
  });
  beginRun();
  setStep(label);
  function end() {
    if (!active) return;
    active = false;
    endRun();
  }
  return {
    step: text => { if (active) setStep(text); },
    point: async (element, text) => {
      if (!active) return;
      if (text) setStep(text);
      await pointAt(element, true);
      await ripple(true);
    },
    end,
  };
}
