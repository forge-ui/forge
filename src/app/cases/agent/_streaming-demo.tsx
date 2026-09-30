"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, ButtonGroup, Checkbox, StreamingAnswer } from "@forge-ui-official/core";
import { useDemoStream } from "@/app/_demos/use-demo-stream";

const EXAMPLES = [
  {
    label: "中文", locale: "zh" as const,
    text: `一个舒服的阅读角，可以从一张桌子、一盏灯和几本书开始。

### 先让空间舒服起来

挑一个安静、光线柔和的位置，让书和笔记本随手可取。**第一批书可以少而有趣**，请每位同事推荐一本，并写下一句阅读感受。

- 放几本适合随手翻阅的摄影、设计或旅行书。
- 准备便签，留下想分享的一句话。
- 每周安排十分钟，自由交流最近的新发现。

运行两三周后，根据大家的使用习惯调整。阅读角会慢慢长成团队自己的样子。`,
  },
  {
    label: "English", locale: "en" as const,
    text: `A comfortable reading corner can start with a table, a lamp, and a few books.

### Make room for a quiet moment

Choose a calm spot with gentle light. Keep books and notebooks within reach. **Start with a small, interesting collection**, and invite each teammate to recommend one book with a short personal note.

- Include books about photography, design, or travel.
- Leave space for notes and new discoveries.
- Set aside ten minutes each week for an informal conversation.

After a few weeks, adjust the space around the way people use it. Let the reading corner grow with your team.`,
  },
];

const PHASE_LABELS = {
  idle: "准备就绪", waiting: "等待首段", streaming: "正在生成",
  settling: "正在呈现", complete: "已完成", stopped: "已停止",
};

export function StreamingAnswerDemo() {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [jitter, setJitter] = useState(false);
  const example = EXAMPLES[sampleIndex];
  const stream = useDemoStream({ text: example.text, locale: example.locale, jitter });
  const active = stream.phase === "waiting" || stream.phase === "streaming" || stream.phase === "settling";

  return (
    <div className="flex min-w-0 max-w-3xl flex-col gap-5" data-streaming-demo>
      <div className="flex flex-wrap items-center gap-4">
        <ButtonGroup
          items={EXAMPLES.map(({ label }) => ({ label }))}
          activeIndex={sampleIndex}
          onChange={(index) => { stream.reset(); setSampleIndex(index); }}
          color="black"
          ariaLabel="流式示例语言"
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm text-fg-grey-700">
          <Checkbox checked={jitter} color="black" onChange={(checked) => { stream.reset(); setJitter(checked); }} aria-label="模拟网络停顿" />
          模拟网络停顿
        </label>
        <span className="text-xs text-fg-grey-700">淡入 · 500 ms</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button color="black" size="sm" onClick={active ? stream.stop : stream.start}>
          {active ? "停止" : stream.phase === "idle" ? "播放示例" : "重新播放"}
        </Button>
        <span role="status" className="text-sm text-fg-grey-700">{PHASE_LABELS[stream.phase]}</span>
        <Link href="/prototype/streaming?variant=fade" className="text-sm text-fg-black underline underline-offset-4">
          打开完整演示
        </Link>
      </div>

      <div className="min-h-48 border-t border-fg-grey-200 pt-5" aria-label="流式回答预览">
        {stream.phase === "idle" ? (
          <p className="text-sm leading-7 text-fg-grey-700">点击播放，查看中英文 Markdown 随接收进度逐步淡入。</p>
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
    </div>
  );
}
