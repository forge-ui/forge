"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

export type FileInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue">;

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(props, ref) {
  return <input {...props} ref={ref} type="file" />;
});
