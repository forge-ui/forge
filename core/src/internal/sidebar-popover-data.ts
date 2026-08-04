function svgDataUrl(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const chinaFlagDataUrl = svgDataUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    <rect width="40" height="40" fill="rgb(222 41 16)" />
    <path fill="rgb(255 222 0)" d="M10 5.5l1.46 4.49h4.72l-3.82 2.77 1.46 4.49L10 14.48l-3.82 2.77 1.46-4.49-3.82-2.77h4.72z" />
    <g fill="rgb(255 222 0)">
      <path d="M0-2.4l.56 1.73h1.82L.91.4l.56 1.73L0 1.06l-1.47 1.07.56-1.73-1.47-1.07h1.82z" transform="translate(23 7) rotate(24)" />
      <path d="M0-2.4l.56 1.73h1.82L.91.4l.56 1.73L0 1.06l-1.47 1.07.56-1.73-1.47-1.07h1.82z" transform="translate(27 12) rotate(48)" />
      <path d="M0-2.4l.56 1.73h1.82L.91.4l.56 1.73L0 1.06l-1.47 1.07.56-1.73-1.47-1.07h1.82z" transform="translate(27 19) rotate(72)" />
      <path d="M0-2.4l.56 1.73h1.82L.91.4l.56 1.73L0 1.06l-1.47 1.07.56-1.73-1.47-1.07h1.82z" transform="translate(23 24) rotate(96)" />
    </g>
  </svg>
`);

export const usFlagDataUrl = svgDataUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    <rect width="40" height="40" fill="rgb(255 255 255)" />
    <g fill="rgb(178 34 52)">
      <rect width="40" height="3.08" y="0" />
      <rect width="40" height="3.08" y="6.15" />
      <rect width="40" height="3.08" y="12.31" />
      <rect width="40" height="3.08" y="18.46" />
      <rect width="40" height="3.08" y="24.62" />
      <rect width="40" height="3.08" y="30.77" />
      <rect width="40" height="3.08" y="36.92" />
    </g>
    <rect width="18.5" height="21.54" fill="rgb(60 59 110)" />
    <g fill="rgb(255 255 255)">
      <circle cx="3" cy="3" r="0.9" /><circle cx="7" cy="3" r="0.9" /><circle cx="11" cy="3" r="0.9" /><circle cx="15" cy="3" r="0.9" />
      <circle cx="5" cy="7" r="0.9" /><circle cx="9" cy="7" r="0.9" /><circle cx="13" cy="7" r="0.9" /><circle cx="17" cy="7" r="0.9" />
      <circle cx="3" cy="11" r="0.9" /><circle cx="7" cy="11" r="0.9" /><circle cx="11" cy="11" r="0.9" /><circle cx="15" cy="11" r="0.9" />
      <circle cx="5" cy="15" r="0.9" /><circle cx="9" cy="15" r="0.9" /><circle cx="13" cy="15" r="0.9" /><circle cx="17" cy="15" r="0.9" />
      <circle cx="3" cy="19" r="0.9" /><circle cx="7" cy="19" r="0.9" /><circle cx="11" cy="19" r="0.9" /><circle cx="15" cy="19" r="0.9" />
    </g>
  </svg>
`);

export const taiwanFlagDataUrl = svgDataUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    <rect width="40" height="40" fill="rgb(254 0 0)" />
    <rect width="20" height="20" fill="rgb(0 0 149)" />
    <circle cx="10" cy="10" r="5.5" fill="rgb(255 255 255)" />
    <circle cx="10" cy="10" r="3.3" fill="rgb(0 0 149)" />
  </svg>
`);

export const japanFlagDataUrl = svgDataUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    <rect width="40" height="40" fill="rgb(255 255 255)" />
    <circle cx="20" cy="20" r="9" fill="rgb(188 0 45)" />
  </svg>
`);

/** @deprecated Use chinaFlagDataUrl. Kept for source compatibility. */
export const languageMarkDataUrl = chinaFlagDataUrl;

/** Starter products only need 中 / 英. Keep optional codes for type compat if needed later. */
export type LanguageCode = "zh-CN" | "en-US" | "zh-TW" | "ja-JP";

export const languageFlagDataUrls: Record<LanguageCode, string> = {
  "zh-CN": chinaFlagDataUrl,
  "zh-TW": taiwanFlagDataUrl,
  "en-US": usFlagDataUrl,
  "ja-JP": japanFlagDataUrl,
};

export const languageLabels: Record<LanguageCode, string> = {
  "zh-CN": "简体中文",
  "zh-TW": "繁体中文",
  "en-US": "English",
  "ja-JP": "日文",
};

export const messageMenuItems = [
  { label: "站内消息", badge: 99 },
  { label: "项目讨论" },
  { label: "审核评论", badge: 99 },
  { label: "客户支持" },
];

export const notificationItems = [
  {
    id: "1",
    tag: "构建更新",
    time: "刚刚",
    title: "客服知识库 SFT 数据集已生成",
    description: "本轮生成 1,248 条样本，自动质检命中 36 条待复核项，请进入任务队列处理。",
    read: false,
  },
  {
    id: "2",
    tag: "审核提醒",
    time: "5 分钟前",
    title: "信贷制度 RAG 评测集等待二审",
    description: "引用链路与答案一致性已完成自动检查，仍有 18 条高风险样本需要人工确认。",
    read: false,
  },
  {
    id: "3",
    tag: "系统",
    time: "1 小时前",
    title: "解析服务运行正常",
    description: "文档解析、切块、Embedding 与导出队列均处于健康状态。",
    read: true,
  },
];

/** Default language menu: Simplified Chinese + English only */
export const languageOptions: ReadonlyArray<{
  code: LanguageCode;
  label: string;
  flagUrl: string;
}> = [
  { code: "zh-CN", label: languageLabels["zh-CN"], flagUrl: languageFlagDataUrls["zh-CN"] },
  { code: "en-US", label: languageLabels["en-US"], flagUrl: languageFlagDataUrls["en-US"] },
];
