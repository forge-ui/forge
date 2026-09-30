"use client";

// Accepted interaction demo, rendered by the shared Core component.
import { useEffect, useRef, useState } from "react";
import { Button, StreamingAnswer } from "@forge-ui-official/core";
import { SAMPLES } from "./samples";
import { useDemoStream } from "./use-demo-stream";
import styles from "./prototype.module.css";

type Mode = "fade" | "blur" | "raw";
const MODES: { id: Mode; label: string; description: string }[] = [
  { id: "fade", label: "原站淡入", description: "新文字由浅入深，已显示的内容保持稳定。" },
  { id: "blur", label: "轻柔渐显", description: "在淡入的同时，文字从轻微模糊变得清晰。" },
  { id: "raw", label: "直接追加", description: "按收到的数据块直接显示，作为手感对照。" },
];

export default function StreamingPrototype() {
  const [mode, setMode] = useState<Mode>("fade");
  const [sampleId, setSampleId] = useState("english");
  const [duration, setDuration] = useState(500);
  const [jitter, setJitter] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [following, setFollowing] = useState(true);
  const [copied, setCopied] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const followingRef = useRef(true);
  const lastScrollTop = useRef(0);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sample = SAMPLES.find((item) => item.id === sampleId) ?? SAMPLES[0];
  const stream = useDemoStream({
    text: sample.answer,
    locale: sample.id === "english" ? "en" : "zh",
    jitter,
  });
  const active = ["waiting", "streaming", "settling"].includes(stream.phase);
  const hasStarted = stream.phase !== "idle";
  const status = {
    idle: "准备就绪", waiting: "正在准备", streaming: "正在生成",
    settling: "正在呈现", complete: "已完成", stopped: "已停止",
  }[stream.phase];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    const frame = requestAnimationFrame(() => {
      update();
      const selected = new URL(window.location.href).searchParams.get("variant");
      if (selected === "fade" || selected === "blur" || selected === "raw") setMode(selected);
    });
    return () => { cancelAnimationFrame(frame); media.removeEventListener("change", update); clearTimeout(copyTimer.current); };
  }, []);

  useEffect(() => {
    const node = content.current;
    if (!node) return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollArea = viewport.current;
        if (scrollArea && followingRef.current) scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: "instant" });
      });
    });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  function chooseMode(next: Mode) {
    stream.reset();
    setMode(next);
    const url = new URL(window.location.href);
    url.searchParams.set("variant", next);
    window.history.replaceState(null, "", url);
  }

  function followLatest() {
    followingRef.current = true;
    setFollowing(true);
    viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: "instant" });
  }

  function play() {
    followingRef.current = true;
    lastScrollTop.current = 0;
    setFollowing(true);
    setCopied(false);
    viewport.current?.scrollTo({ top: 0, behavior: "instant" });
    stream.start();
  }

  async function copy() {
    try {
      const answer = content.current?.querySelector<HTMLElement>(".forge-streaming-body");
      await navigator.clipboard.writeText(answer?.innerText ?? "");
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch { setCopied(false); }
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <a href="/cases/agent" className={styles.brand} aria-label="返回 Forge 组件案例">forge<span> / </span><span>交互实验室</span></a>
        <span className={styles.prototypeLabel}>流式消息 · 体验原型</span>
      </header>

      <section className={styles.settings} aria-label="演示设置">
        <div className={styles.modes} aria-label="输出效果">
          {MODES.map((item) => (
            <button key={item.id} type="button" aria-pressed={mode === item.id} onClick={() => chooseMode(item.id)}>{item.label}</button>
          ))}
        </div>
        <div className={styles.options}>
          <label>示例<select value={sampleId} onChange={(event) => setSampleId(event.target.value)} aria-label="示例内容">
            {SAMPLES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select></label>
          <label className={styles.duration}>淡入<input type="range" min="150" max="900" step="50" value={duration} disabled={mode === "raw"} onChange={(event) => { stream.reset(); setDuration(Number(event.target.value)); }} aria-label="淡入时长" /><output>{duration} ms</output></label>
          <label className={styles.checkbox}><input type="checkbox" checked={jitter} onChange={(event) => setJitter(event.target.checked)} />模拟停顿</label>
        </div>
      </section>

      <main className={styles.main}>
        <div
          ref={viewport}
          className={styles.viewport}
          tabIndex={0}
          aria-label="回答阅读区"
          onWheel={(event) => {
            if (event.deltaY < 0) { followingRef.current = false; setFollowing(false); }
          }}
          onScroll={(event) => {
            const el = event.currentTarget;
            const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 36;
            const movedUp = el.scrollTop < lastScrollTop.current;
            lastScrollTop.current = el.scrollTop;
            if (movedUp || !nearBottom) { followingRef.current = false; setFollowing(false); }
            else if (nearBottom) { followingRef.current = true; setFollowing(true); }
          }}
        >
          <div ref={content} className={styles.conversation}>
            {!hasStarted ? (
              <div className={styles.welcome}>
                <span className={styles.eyebrow}>A LITTLE LESS ABRUPT.</span>
                <h1>让回答，自然出现。</h1>
                <p>{MODES.find((item) => item.id === mode)?.description}</p>
                <div className={styles.welcomeNote}>选择示例，点击下方播放。</div>
              </div>
            ) : (
              <>
                <div className={styles.question}>{sample.prompt}</div>
                <div className={styles.response} aria-busy={active}>
                  <div className={styles.assistantName}><span className={styles.spark}>✳</span> Forge</div>
                  <div className={styles.thinking} data-visible={stream.phase === "waiting"} aria-hidden={stream.phase !== "waiting"}><span />正在整理回答…</div>
                  <StreamingAnswer
                    key={stream.runId}
                    className={styles.answer}
                    text={stream.receivedText}
                    status={stream.phase === "stopped" ? "stopped" : stream.phase === "settling" || stream.phase === "complete" ? "complete" : "streaming"}
                    format="markdown"
                    animation={mode === "blur" ? "blur" : "fade"}
                    duration={duration}
                    motion={mode === "raw" ? "none" : "auto"}
                    onDone={() => stream.finish(stream.runId)}
                  />
                  {(stream.phase === "complete" || stream.phase === "stopped") && (
                    <div className={styles.responseActions}>
                      <button type="button" onClick={copy}>{copied ? "已复制" : "复制回答"}</button>
                      <span>·</span><button type="button" onClick={play}>重新播放</button>
                      {stream.phase === "stopped" && <span>已保留当前内容</span>}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {!following && hasStarted && <button type="button" className={styles.latest} onClick={followLatest}>回到最新 ↓</button>}

        <div className={styles.dock}>
          <div className={styles.playBar}>
            <div className={styles.playCopy}><span>{sample.prompt}</span><small>{hasStarted ? "重放同一段内容，对比不同效果" : "播放一段示例回答"}</small></div>
            <Button color="black" size="md" onClick={active ? stream.stop : play}>{active ? "停止" : hasStarted ? "重播" : "播放示例"}</Button>
          </div>
          <div className={styles.telemetry}>
            <span role="status"><i data-active={active} />{status}</span>
            <span>已接收 {stream.receivedCount} 字符</span>
            <span>{(stream.elapsedMs / 1000).toFixed(1)} s</span>
            <span className={styles.localNote}>固定示例 · 本地模拟流{reducedMotion ? " · 动效已简化" : ""}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
