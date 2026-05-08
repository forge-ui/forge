"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import { CheckCircleLinear, CloseCircleLinear, AddCircleLinear, UserBoldDuotone } from "solar-icon-set";

// Gallery icon from Figma — inline SVG composite with currentColor for theming
function GalleryIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Frame (outer rounded rect) */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0522 1.04175H10.1477C12.0222 1.04163 13.4902 1.04153 14.6367 1.19569C15.81 1.35337 16.7357 1.68241 17.4623 2.40898C18.1888 3.13555 18.5179 4.0613 18.6756 5.2346C18.8297 6.38107 18.8297 7.84914 18.8297 9.72357V9.79524C18.8297 11.3446 18.8297 12.6132 18.7455 13.6461C18.6609 14.6841 18.4876 15.5516 18.0997 16.2719C17.9286 16.5897 17.7183 16.8741 17.4623 17.1301C16.7357 17.8567 15.81 18.1858 14.6367 18.3434C13.4902 18.4976 12.0222 18.4975 10.1477 18.4974H10.0522C8.17773 18.4975 6.70967 18.4976 5.5632 18.3434C4.3899 18.1858 3.46415 17.8567 2.73758 17.1301C2.09373 16.4863 1.76121 15.6847 1.58436 14.7L1.58436 14.7C1.4106 13.7231 1.37882 12.508 1.37222 10.9988C1.37056 10.6148 1.37056 10.2087 1.37056 9.78044L1.37056 9.73316C1.37046 7.85872 1.37036 6.39066 1.52452 5.24419C1.68221 4.07088 2.01126 3.14514 2.73783 2.41856C3.4644 1.69199 4.39015 1.36295 5.56345 1.20526C6.70992 1.0511 8.17799 1.05121 10.0524 1.05132L10.0522 1.04175ZM5.72632 2.40272C4.68808 2.54228 4.06215 2.80765 3.59957 3.27023C3.13699 3.73281 2.87162 4.35874 2.73206 5.39698C2.59015 6.4528 2.58886 7.8399 2.58886 9.77094C2.58886 10.2004 2.58886 10.6039 2.59053 10.9853C2.59719 12.5076 2.63122 13.6214 2.78395 14.4807C2.93354 15.3217 3.18813 15.8615 3.59957 16.2725C4.06215 16.7352 4.68808 17.0006 5.72632 17.1402C6.78213 17.282 8.16923 17.2835 10.1003 17.2835C12.0313 17.2835 13.4184 17.282 14.4742 17.1402C15.5125 17.0006 16.1384 16.7352 16.601 16.2725C16.7716 16.1019 16.9114 15.9133 17.0275 15.6976C17.2967 15.197 17.4521 14.5277 17.5318 13.5489C17.6115 12.5704 17.6128 11.3501 17.6128 9.77094C17.6128 7.8399 17.6115 6.4528 17.4696 5.39698C17.33 4.35874 17.0647 3.73281 16.6021 3.27023C16.1395 2.80765 15.5135 2.54228 14.4753 2.40272C13.4195 2.2608 12.0324 2.25951 10.0503 2.25951C8.07928 2.25951 6.69221 2.2608 5.72632 2.40272Z"
        fill="currentColor"
      />
      {/* Sun (top-right circle) */}
      <circle cx="14.1667" cy="6.66667" r="1.66667" fill="currentColor" />
      {/* Mountain (bottom, lighter opacity) */}
      <path
        opacity="0.4"
        d="M18.3333 15.388L16.0738 13.354C15.2438 12.6071 14.0078 12.533 13.0944 13.1748L12.8562 13.342C12.2213 13.7882 11.3577 13.7133 10.8091 13.1647L7.38379 9.73947C6.70022 9.05591 5.60334 9.01937 4.87578 9.65588L4.07587 10.355C4.07609 10.533 4.0765 10.7063 4.07724 10.8751C4.08379 12.3715 4.11722 13.4673 4.26738 14.3113C4.41442 15.1385 4.66457 15.6694 5.069 16.0745C5.52369 16.5294 6.13906 16.7904 7.15987 16.9276C8.19773 17.0672 9.56168 17.0685 11.4611 17.0685C13.3606 17.0685 14.7244 17.0672 15.7622 16.9276C16.7827 16.7904 17.3981 16.5294 17.8528 16.0745C18.0204 15.9069 18.1578 15.7214 18.2719 15.5094C18.2931 15.4703 18.3133 15.4301 18.3333 15.388Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================
// MediaUpload — Figma "Media Upload" component
// Drop zone with icon + message + button, optional image preview row
// Supports 3 colors: purple / blue / black
// ============================================================

import { formAccents, type FormAccentColor } from "./form-utils";

// Media upload has a special "iconText" per Figma — black variant uses grey icon, not pure black
const iconTextOverride: Record<FormAccentColor, string> = {
  purple: formAccents.purple.text,
  blue: formAccents.blue.text,
  black: "text-fg-grey-700", // Figma: black badge uses grey icon
};

export type MediaUploadColor = FormAccentColor;

export interface MediaItem {
  id: string;
  src: string;
  state?: "success" | "uploading" | "error";
  progress?: number;
}

export function MediaUpload({
  items = [],
  label,
  buttonLabel = "Add Image",
  message = "Drag and drop image here, or click add image",
  color = "purple",
  onUpload,
  onRemove,
  className,
}: {
  items?: MediaItem[];
  label?: string;
  buttonLabel?: string;
  message?: string;
  color?: MediaUploadColor;
  onUpload?: (files: FileList) => void;
  onRemove?: (id: string) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const accent = formAccents[color];
  const iconBg = color === "black" ? "bg-fg-grey-200" : accent.bgTint;
  const iconText = iconTextOverride[color];

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) onUpload?.(e.dataTransfer.files);
  }

  return (
    <div className={cn("inline-flex flex-col gap-1 w-80 max-w-full", className)}>
      {label && (
        <span className="text-sm font-medium text-fg-grey-700 leading-5 tracking-fg">
          {label}
        </span>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={cn(
          "self-stretch p-6 bg-white rounded-xl outline outline-1 outline-offset-[-1px] flex flex-col justify-center items-center gap-4 overflow-hidden transition-colors",
          dragOver ? "outline-accent bg-accent-soft" : "outline-fg-grey-200",
        )}
      >
        {/* Preview row (if items exist) */}
        {items.length > 0 && (
          <div className="inline-flex items-start gap-4 flex-wrap justify-center">
            {items.map((item) => (
              <div key={item.id} className="relative inline-flex flex-col items-end">
                <img
                  className={cn("w-24 h-24 rounded-xl object-cover", item.state === "uploading" && "opacity-50")}
                  src={item.src}
                  alt=""
                />
                {item.state === "success" && (
                  <div className="w-6 h-6 p-1 absolute top-1 right-1 bg-emerald-500 rounded-full flex justify-center items-center">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7.5L5.5 10L11 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                {item.state === "error" && onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="w-8 h-8 p-1.5 absolute top-1 right-1 bg-rose-100 rounded-full flex justify-center items-center cursor-pointer text-fg-red"
                  >
                    <CloseCircleLinear size={20} />
                  </button>
                )}
                {item.state === "uploading" && typeof item.progress === "number" && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-1 bg-accent-soft rounded-full outline outline-1 outline-offset-[-1px] outline-accent">
                    <span className="text-accent text-xs font-semibold leading-4 tracking-fg">
                      {item.progress}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Icon — always visible with theme color */}
        <div className={cn("w-11 h-11 p-2 rounded-full flex justify-center items-center", iconBg)}>
          <GalleryIcon className={cn("w-5 h-5", iconText)} />
        </div>

        {/* Message */}
        <p className="self-stretch text-center text-fg-grey-700 text-sm font-normal leading-5 tracking-fg">
          {message}
        </p>

        {/* Button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "px-4 py-3.5 rounded-full flex justify-center items-center overflow-hidden cursor-pointer",
            accent.bg,
          )}
        >
          <span className="text-white text-sm font-bold leading-5 tracking-fg">
            {buttonLabel}
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) onUpload?.(e.target.files);
          }}
        />
      </div>
    </div>
  );
}

// ============================================================
// ProfileImgUpload — Figma "Profile Img" variant
// Circular avatar (64px) + "+ Upload" link in theme color
// ============================================================

export function ProfileImgUpload({
  src,
  label,
  linkLabel = "Upload",
  color = "purple",
  onUpload,
  className,
}: {
  src?: string;
  label?: string;
  linkLabel?: string;
  color?: MediaUploadColor;
  onUpload?: (files: FileList) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const accent = formAccents[color];

  return (
    <div className={cn("inline-flex flex-col gap-1 w-60 max-w-full", className)}>
      {label && (
        <span className="text-sm font-medium text-fg-grey-700 leading-5 tracking-fg">
          {label}
        </span>
      )}
      <div className="self-stretch flex items-center gap-3">
        {/* Avatar circle */}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-fg-grey-100 flex items-center justify-center shrink-0 text-fg-grey-500">
          {src ? (
            <img src={src} alt="" className="w-full h-full object-cover" />
          ) : (
            <UserBoldDuotone size={32} />
          )}
        </div>

        {/* Upload link */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-start gap-1 cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={accent.text}>
            <path d="M5 10H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10 5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className={cn("text-sm font-bold leading-5 tracking-fg", accent.text)}>
            {linkLabel}
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) onUpload?.(e.target.files);
          }}
        />
      </div>
    </div>
  );
}
