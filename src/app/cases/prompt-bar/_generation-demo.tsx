"use client";

import { useEffect, useRef, useState } from "react";
import { Checkbox, PromptBar, StreamingAnswer } from "@forge-ui-official/core";
import { useDemoStream } from "@/app/_demos/use-demo-stream";

const SAMPLE_ANSWER = `一个舒服的阅读角，可以从一张桌子、一盏灯和几本书开始。

### 让大家愿意停留

选择安静、光线柔和的位置，摆上几本适合随手翻阅的摄影、设计和旅行书。邀请每位同事推荐一本书，附上一句自己的阅读感受。

- 准备便签，随时记录想分享的一句话。
- 每周留出十分钟，交流最近的发现。
- 两周后根据使用反馈，调整书目、座位和照明。

逐步完善这个小空间，让阅读成为团队日常的一部分。`;

const PHASE_LABELS = {
  idle: "准备就绪",
  waiting: "等待首段回答…",
  streaming: "正在生成…",
  settling: "正在呈现…",
  complete: "已完成",
  stopped: "已停止",
};

/** Local transport simulation: the caller owns cancellation and stop acknowledgement. */
export function PromptBarGenerationDemo() {
  const [draft, setDraft] = useState("为团队规划一个阅读角");
  const [submitted, setSubmitted] = useState("");
  const [stopping, setStopping] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const stopTimer = useRef<number | null>(null);
  const stream = useDemoStream({ text: SAMPLE_ANSWER, locale: "zh", jitter: false });
  const active = stream.phase === "waiting" || stream.phase === "streaming" || stream.phase === "settling";
  const status = stopping ? "stopping" : active ? "running" : "idle";

  useEffect(() => () => {
    if (stopTimer.current !== null) window.clearTimeout(stopTimer.current);
  }, []);

  function stop() {
    if (!active || stopTimer.current !== null) return;
    setStopping(true);
    stream.stop();
    // Model the delay before a server confirms cancellation, keeping the draft intact.
    stopTimer.current = window.setTimeout(() => {
      stopTimer.current = null;
      setStopping(false);
    }, 650);
  }

  return (
    <div className="flex min-w-0 max-w-3xl flex-col gap-5" data-prompt-generation-demo>
      <div className="flex flex-wrap items-center gap-4">
        <span role="status" className="text-sm text-fg-grey-700">
          {stopping ? "正在停止…" : PHASE_LABELS[stream.phase]}
        </span>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-fg-grey-700">
          <Checkbox checked={disabled} onChange={setDisabled} color="black" aria-label="禁用输入与发送" />
          禁用输入与发送（仍可停止）
        </label>
      </div>

      <div className="min-h-48 border-t border-fg-grey-200 pt-5" aria-label="PromptBar 回答预览">
        {submitted && <p className="mb-4 text-sm font-medium text-fg-black">{submitted}</p>}
        {stream.phase === "idle" ? (
          <p className="text-sm leading-7 text-fg-grey-700">发送后，右下角切换为停止按钮。等待回答时即可停止，也可以继续编辑下一条草稿。</p>
        ) : (
          <>
            {stream.phase === "waiting" && <p className="text-sm leading-7 text-fg-grey-700">正在准备回答…</p>}
            <StreamingAnswer
              key={stream.runId}
              text={stream.receivedText}
              status={stream.phase === "stopped" ? "stopped" : stream.phase === "settling" || stream.phase === "complete" ? "complete" : "streaming"}
              format="markdown"
              onDone={() => stream.finish(stream.runId)}
            />
          </>
        )}
      </div>

      <PromptBar
        value={draft}
        onChange={setDraft}
        onSend={(message) => { setSubmitted(message); stream.start(); }}
        status={status}
        onStop={stop}
        disabled={disabled}
        sendLabel="发送"
        placeholder="输入问题，或在生成时编辑下一条草稿…"
      />
      <p className="text-xs leading-6 text-fg-grey-500">本地模拟固定回答。停止确认约需 650 ms；已生成内容和下一条草稿都会保留。</p>
    </div>
  );
}
