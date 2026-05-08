/* eslint-disable @next/next/no-img-element */

import { PlayBoldDuotone, DocumentTextLinear, DownloadLinear } from "solar-icon-set";
import { accentColors, type AccentColor } from "./accent-utils";

// Chat-specific color tokens (play button, waveform, file subtitle)
const chatColors: Record<AccentColor, {
  playBtnBg: string;
  playIcon: string;            // hex for solar icon
  waveMain: string;            // received primary bars (12)
  waveLightReceived: string;   // received secondary bars (9)
  waveLightSent: string;       // sent secondary bars (9)
  fileSubText: string;         // file size text on sent (colored bg)
  filesPlusBg: string;         // +N tile bg
  filesPlusText: string;       // +N text color
}> = {
  purple: {
    playBtnBg: "bg-purple-100",
    playIcon: "#7C3AED",
    waveMain: "bg-fg-violet",
    waveLightReceived: "bg-purple-300",
    waveLightSent: "bg-violet-400",
    fileSubText: "text-violet-300",
    filesPlusBg: "bg-purple-100",
    filesPlusText: "text-fg-violet",
  },
  blue: {
    playBtnBg: "bg-indigo-50",
    playIcon: "#2563EB",
    waveMain: "bg-blue-600",
    waveLightReceived: "bg-indigo-200",
    waveLightSent: "bg-indigo-400",
    fileSubText: "text-indigo-300",
    filesPlusBg: "bg-indigo-50",
    filesPlusText: "text-blue-600",
  },
  black: {
    playBtnBg: "bg-gray-200",
    playIcon: "#020617",
    waveMain: "bg-fg-black",
    waveLightReceived: "bg-gray-400",
    waveLightSent: "bg-gray-600",
    fileSubText: "text-neutral-400",
    filesPlusBg: "bg-gray-200",
    filesPlusText: "text-fg-black",
  },
};

// 21 waveform bar heights (Tailwind h-N classes), per Figma
const WAVE_HEIGHTS = [
  "h-2", "h-5", "h-8", "h-4", "h-2.5", "h-1.5", "h-5", "h-7", "h-3", "h-1.5", "h-7", "h-8",
  "h-5", "h-1.5", "h-3", "h-6", "h-8", "h-5", "h-2.5", "h-4", "h-1",
] as const;

export function ChatBubble({
  type,
  variant = "text",
  color = "purple",
  content,
  time,
  avatar,
  senderName,
  images,
  extraImageCount,
  fileName,
  fileSize,
  voiceDuration,
  className = "",
}: {
  type: "sent" | "received";
  variant?: "text" | "voice" | "file" | "image";
  color?: AccentColor;
  content?: string;
  time?: string;
  avatar?: string;
  senderName?: string;
  images?: string[];
  extraImageCount?: number;
  fileName?: string;
  fileSize?: string;
  voiceDuration?: string;
  className?: string;
}) {
  const isSent = type === "sent";
  const accent = accentColors[color];
  const c = chatColors[color];

  // Per Figma: received bubble misses bottom-left, sent misses bottom-right
  const cornerClass = isSent
    ? "rounded-tl-xl rounded-tr-xl rounded-bl-xl"
    : "rounded-tl-xl rounded-tr-xl rounded-br-xl";

  const bubbleBg = isSent ? accent.bg : "bg-white";
  const bubbleText = isSent ? "text-white" : "text-fg-black";
  const fileSubColor = isSent ? c.fileSubText : "text-fg-grey-700";

  return (
    <div className={`flex gap-2.5 ${isSent ? "justify-end" : "justify-start"} ${className}`}>
      {!isSent && avatar && (
        <img
          src={avatar}
          alt={senderName ?? ""}
          className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
        />
      )}

      <div className={`max-w-[70%] flex flex-col gap-1 ${isSent ? "items-end" : "items-start"}`}>
        {!isSent && senderName && (
          <span className="text-xs text-fg-grey-700 font-medium">{senderName}</span>
        )}

        {/* TEXT */}
        {variant === "text" && (
          <div className={`p-3 ${bubbleBg} ${cornerClass} inline-flex justify-start items-start gap-2 overflow-hidden`}>
            <p className={`flex-1 text-sm font-normal leading-5 tracking-fg ${bubbleText}`}>
              {content}
            </p>
          </div>
        )}

        {/* VOICE */}
        {variant === "voice" && (
          <div className={`p-3 ${bubbleBg} ${cornerClass} inline-flex justify-start items-center gap-3 overflow-hidden`}>
            <div className={`p-2.5 ${c.playBtnBg} rounded-full flex justify-center items-center shrink-0`}>
              <PlayBoldDuotone size={20} color={c.playIcon} />
            </div>
            <div className="flex justify-center items-center gap-1.5">
              {WAVE_HEIGHTS.map((h, i) => {
                const isPrimary = i < 12;
                const barColor = isPrimary
                  ? (isSent ? "bg-white" : c.waveMain)
                  : (isSent ? c.waveLightSent : c.waveLightReceived);
                return <div key={i} className={`w-0.5 ${h} ${barColor} rounded-[10px]`} />;
              })}
            </div>
            {voiceDuration && (
              <span className={`text-xs ml-1 ${isSent ? "text-white/80" : "text-fg-grey-500"}`}>
                {voiceDuration}
              </span>
            )}
          </div>
        )}

        {/* FILE */}
        {variant === "file" && (
          <div className={`p-3 ${bubbleBg} ${cornerClass} inline-flex justify-start items-center gap-2 overflow-hidden`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              isSent ? "bg-white/20" : "bg-fg-grey-100"
            }`}>
              <DocumentTextLinear size={20} color={isSent ? "white" : c.playIcon} />
            </div>
            <div className="inline-flex flex-col justify-center items-start gap-0.5 min-w-0">
              <p className={`text-sm font-semibold leading-5 tracking-fg truncate ${bubbleText}`}>
                {fileName ?? content ?? ""}
              </p>
              {fileSize && (
                <p className={`text-xs font-medium leading-4 tracking-fg ${fileSubColor}`}>
                  {fileSize}
                </p>
              )}
            </div>
            {!isSent && (
              <button className="ml-2 shrink-0 opacity-70 hover:opacity-100 transition-opacity">
                <DownloadLinear size={18} color="#71717A" />
              </button>
            )}
          </div>
        )}

        {/* IMAGE — figma uses 64×64 thumbnails (no bubble bg), with optional +N tile */}
        {variant === "image" && images && images.length > 0 && (
          <div className="inline-flex justify-start items-start gap-3">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-16 h-16 rounded-xl object-cover"
              />
            ))}
            {extraImageCount !== undefined && extraImageCount > 0 && (
              <div className={`w-16 h-16 p-2.5 ${c.filesPlusBg} rounded-xl inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden`}>
                <span className={`text-sm font-semibold leading-5 tracking-fg ${c.filesPlusText}`}>
                  +{extraImageCount}
                </span>
              </div>
            )}
          </div>
        )}

        {time && <span className="text-2xs text-fg-grey-500 px-1">{time}</span>}
      </div>
    </div>
  );
}
