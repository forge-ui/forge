"use client";

import { useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import {
  CloseCircleLinear,
  RefreshLinear,
  CheckCircleLinear,
} from "../../../icons";

// ============================================================
// FileUpload — Figma "File Upload" component
// 1. FileCard — individual file row with icon + name + size + status + actions
// 2. FileUpload — list of files + "Add File" button
// Supports 3 colors: purple / blue / black
// Supports 3 states: uploaded / success / uploading
// ============================================================

import { accentColors, type AccentColor } from "../accent-utils";

export type FileUploadColor = AccentColor;
export type FileState = "uploaded" | "success" | "uploading" | "error";

export interface FileItem {
  id: string;
  name: string;
  size: string;
  state?: FileState;
  /** Upload progress supplied by the caller, from 0 to 100. */
  progress?: number;
  uploadedBytes?: number;
  totalBytes?: number;
}

// ── FileTypeIcon — inline SVG assets bundled into the package ──
// Icons are data URLs generated from src/assets/file-icons/*.svg by
// scripts/gen-assets.mjs. Zero dependency on consumer public/ folder.

import { fileIconDataUrls } from "../../../assets/_inlined";

const extToIcon: Record<string, string> = {
  pdf: "pdf",
  doc: "doc", docx: "doc",
  txt: "txt", rtf: "txt",
  xls: "xls", xlsx: "xls", csv: "xls",
  ppt: "ppt", pptx: "ppt",
  png: "png", webp: "png",
  jpg: "jpg", jpeg: "jpg",
  gif: "gif", svg: "svg",
  eps: "eps",
  mp4: "mp4", mov: "mov", avi: "avi", mkv: "mkv",
  mp3: "mp3", wav: "wav", flac: "mp3",
  zip: "zip", tar: "zip", gz: "zip",
  rar: "rar",
  fig: "fig", psd: "psd", ai: "ai",
  folder: "folder",
};

function getFileExt(name: string): string {
  const parts = name.toLowerCase().split(".");
  // Fallback to full name so callers can pass bare keywords like "folder".
  return parts.length > 1 ? parts[parts.length - 1] : parts[0];
}

export function FileTypeIcon({ fileName, dim = false, className }: {
  fileName: string;
  dim?: boolean;
  className?: string;
}) {
  const ext = getFileExt(fileName);
  const iconName = extToIcon[ext] ?? "txt";
  const src = fileIconDataUrls[iconName] ?? fileIconDataUrls.txt;

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={ext}
      className={cn("w-12 h-12 shrink-0 object-contain", dim && "opacity-50", className)}
    />
  );
}

// ── FileCard ─────────────────────────────────────────────

export function FileCard({
  file,
  onRemove,
  onRetry,
  locale = "zh",
  color = "blue",
  className,
}: {
  file: FileItem;
  locale?: "zh" | "en";
  color?: FileUploadColor;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  className?: string;
}) {
  const state = file.state ?? "uploaded";
  const isUploading = state === "uploading";
  const isSuccess = state === "success";
  const isError = state === "error";
  const progress = typeof file.progress === "number" && Number.isFinite(file.progress) ? Math.max(0, Math.min(100, file.progress)) : undefined;
  const en = locale === "en";

  return (
    <div
      className={cn(
        "self-stretch p-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex items-center gap-3 overflow-hidden",
        className,
      )}
    >
      <FileTypeIcon fileName={file.name} dim={isUploading} />

      <div className="flex-1 inline-flex flex-col justify-center items-start gap-1 min-w-0">
        <span className="self-stretch text-fg-black text-sm font-semibold leading-5 tracking-fg truncate">
          {file.name}
        </span>
        <div className="self-stretch inline-flex items-center gap-1">
          <span className="text-fg-grey-700 text-xs font-medium leading-4 tracking-fg">
            {file.size}
          </span>
          {(isSuccess || isUploading || isError) && (
            <>
              <span className="text-fg-grey-700 text-xs font-medium leading-4 tracking-fg">-</span>
              <div className="flex items-center gap-1">
                {isSuccess && (
                  <>
                    <div className="p-1 bg-fg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircleLinear size={12} color="currentColor" />
                    </div>
                    <span className="text-fg-green-500 text-xs font-medium leading-4 tracking-fg">
                      {en ? "Uploaded" : "已上传"}
                    </span>
                  </>
                )}
                {isUploading && (
                  <>
                    <div className="p-1 bg-fg-yellow rounded-full flex items-center justify-center text-white">
                      <RefreshLinear size={10} />
                    </div>
                    <span className="text-fg-yellow text-xs font-medium leading-4 tracking-fg">
                      {en ? "Uploading" : "上传中"}
                    </span>
                  </>
                )}
                {isError && (
                  <>
                    <div className="p-1 bg-fg-red rounded-full flex items-center justify-center text-white">
                      <CloseCircleLinear size={10} />
                    </div>
                    <span className="text-fg-red text-xs font-medium leading-4 tracking-fg">
                      {en ? "Upload failed" : "上传失败"}
                    </span>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        {progress !== undefined && <div className="w-full mt-1" data-file-progress={progress}>
          <div className="mb-1 flex justify-between text-xs text-fg-grey-700"><span>{file.uploadedBytes !== undefined && file.totalBytes !== undefined ? `${new Intl.NumberFormat(locale).format(file.uploadedBytes)} / ${new Intl.NumberFormat(locale).format(file.totalBytes)} B` : en ? "Upload progress" : "上传进度"}</span><span>{Math.round(progress)}%</span></div>
          <div role="progressbar" aria-label={`${file.name} ${en ? "upload progress" : "上传进度"}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="h-1 w-full overflow-hidden rounded-full bg-fg-grey-200"><div className={cn("h-full rounded-full transition-[width] motion-reduce:transition-none", accentColors[color].bg)} style={{ width: `${progress}%` }} /></div>
        </div>}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isError && onRetry && (
          <button
            type="button"
            aria-label={`${en ? "Retry upload" : "重试上传"} ${file.name}`}
            title={en ? "Retry upload" : "重试上传"}
            onClick={() => onRetry(file.id)}
            className="w-5 h-5 flex items-center justify-center text-fg-grey-700 cursor-pointer hover:text-fg-black"
          >
            <RefreshLinear size={16} />
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            aria-label={`${en ? "Remove attachment" : "移除附件"} ${file.name}`}
            title={en ? "Remove attachment" : "移除附件"}
            onClick={() => onRemove(file.id)}
            className="w-5 h-5 flex items-center justify-center text-fg-grey-700 cursor-pointer hover:text-fg-black"
          >
            <CloseCircleLinear size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── FileUpload ───────────────────────────────────────────

export function FileUpload({
  files = [],
  label,
  buttonLabel,
  locale = "zh",
  color = "blue",
  onUpload,
  onRemove,
  onRetry,
  className,
}: {
  files?: FileItem[];
  label?: string;
  buttonLabel?: string;
  locale?: "zh" | "en";
  color?: FileUploadColor;
  onUpload?: (files: FileList) => void;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const accent = accentColors[color];
  const [dragOver, setDragOver] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) onUpload?.(e.dataTransfer.files);
  }

  return (
    <div className={cn("flex w-full max-w-72 flex-col gap-2", className)}>
      {label && (
        <span className="text-sm font-medium text-fg-grey-700 leading-5 tracking-fg">
          {label}
        </span>
      )}

      <div
        className={cn(
          "self-stretch flex flex-col gap-4 p-4 rounded-xl border-2 border-dashed transition-colors",
          dragOver ? cn("border-accent bg-accent-soft") : "border-transparent",
        )}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
      >
        {files.length > 0 && (
          <div className="self-stretch flex flex-col gap-3 overflow-hidden">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                locale={locale}
                color={color}
                onRemove={onRemove}
                onRetry={onRetry}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "px-4 py-3.5 rounded-full flex justify-center items-center overflow-hidden cursor-pointer self-start",
            accent.bg,
          )}
        >
          <span className="text-white text-sm font-bold leading-5 tracking-fg">
            {buttonLabel ?? (locale === "en" ? "Add files" : "添加文件")}
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) onUpload?.(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
