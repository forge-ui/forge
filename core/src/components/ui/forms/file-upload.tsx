"use client";

import { useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import {
  CheckCircleLinear,
  CloseCircleLinear,
  RefreshLinear,
} from "solar-icon-set";

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
  className,
}: {
  file: FileItem;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  className?: string;
}) {
  const state = file.state ?? "uploaded";
  const isUploading = state === "uploading";
  const isSuccess = state === "success";
  const isError = state === "error";

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
                    <div className="p-1 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5.5L4 7.5L8 3.5" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-emerald-500 text-xs font-medium leading-4 tracking-fg">
                      Uploaded
                    </span>
                  </>
                )}
                {isUploading && (
                  <>
                    <div className="p-1 bg-fg-yellow rounded-full flex items-center justify-center text-white">
                      <RefreshLinear size={10} />
                    </div>
                    <span className="text-fg-yellow text-xs font-medium leading-4 tracking-fg">
                      Uploading
                    </span>
                  </>
                )}
                {isError && (
                  <>
                    <div className="p-1 bg-fg-red rounded-full flex items-center justify-center text-white">
                      <CloseCircleLinear size={10} />
                    </div>
                    <span className="text-fg-red text-xs font-medium leading-4 tracking-fg">
                      Failed
                    </span>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isError && onRetry && (
          <button
            type="button"
            onClick={() => onRetry(file.id)}
            className="w-5 h-5 flex items-center justify-center text-fg-grey-700 cursor-pointer hover:text-fg-black"
          >
            <RefreshLinear size={16} />
          </button>
        )}
        {onRemove && (
          <button
            type="button"
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
  buttonLabel = "Add File",
  color = "purple",
  onUpload,
  onRemove,
  onRetry,
  className,
}: {
  files?: FileItem[];
  label?: string;
  buttonLabel?: string;
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
    <div className={cn("inline-flex flex-col gap-2 w-72", className)}>
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
            {buttonLabel}
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) onUpload?.(e.target.files);
          }}
        />
      </div>
    </div>
  );
}
