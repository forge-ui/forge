"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import { Form as FormPrimitive } from "@base-ui/react/form";
import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

// Form validation built on native constraint validation (required, pattern, min…)
// plus optional custom/async rules. Field-aware controls: TextField, TextArea,
// SelectOption, Combobox, NumberField, Slider, Toggle, CheckboxControl,
// CheckboxWithLabel, RadioGroup, CheckboxGroup.

export type FormValues = Record<string, unknown>;
export type FormValidationMode = "onSubmit" | "onBlur" | "onChange";

export interface FormProps {
  children: ReactNode;
  /** Runs only when every field is valid; receives values keyed by field `name`. */
  onSubmit?: (values: FormValues) => void;
  /** Server-side errors keyed by field `name`; shown until that field changes. */
  errors?: Record<string, string | string[]>;
  /** When fields validate. Invalid fields always re-validate as the user types. */
  validationMode?: FormValidationMode;
  className?: string;
}

export function Form({ children, onSubmit, errors, validationMode = "onSubmit", className }: FormProps) {
  return (
    <FormPrimitive
      errors={errors}
      validationMode={validationMode}
      onFormSubmit={(values) => onSubmit?.(values)}
      className={cn("flex flex-col gap-5", className)}
    >
      {children}
    </FormPrimitive>
  );
}

type ValidityKey = "valueMissing" | "typeMismatch" | "patternMismatch" | "tooShort" | "tooLong" | "rangeUnderflow" | "rangeOverflow" | "stepMismatch" | "badInput";

export interface FormFieldProps {
  /** Submitted key; also the key for `Form` `errors`. */
  name: string;
  /** One field-aware control (see list above). */
  children: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  /** Custom rule; return an error message (or messages) to mark the field invalid. May be async. */
  validate?: (value: unknown, values: FormValues) => string | string[] | null | void | Promise<string | string[] | null | void>;
  /** Replace the browser's built-in messages, e.g. `{ valueMissing: "请填写邮箱" }`. */
  messages?: Partial<Record<ValidityKey, string>>;
  disabled?: boolean;
  className?: string;
}

/** Label, description and validation message around one control. */
export function FormField({ name, children, label, description, validate, messages, disabled, className }: FormFieldProps) {
  const custom = Object.keys(messages ?? {}).map(key => [key as ValidityKey] as const);
  return (
    <FieldPrimitive.Root name={name} validate={validate} disabled={disabled} className={cn("group/field flex flex-col gap-1.5", className)}>
      {label && <FieldPrimitive.Label className="text-sm font-medium leading-5 tracking-fg text-fg-grey-700">{label}</FieldPrimitive.Label>}
      {children}
      {description && <FieldPrimitive.Description className="text-xs leading-4 tracking-fg text-fg-grey-700">{description}</FieldPrimitive.Description>}
      <FieldPrimitive.Validity>
        {(validity) => {
          const key = custom.find(([match]) => validity.validity[match])?.[0];
          return (
            <FieldPrimitive.Error match={validity.validity.valid === false} className="text-xs leading-4 tracking-fg text-fg-red">
              {key ? messages?.[key] : validity.error}
            </FieldPrimitive.Error>
          );
        }}
      </FieldPrimitive.Validity>
    </FieldPrimitive.Root>
  );
}

export interface FieldsetProps {
  legend: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

/** Groups related fields under a legend; `disabled` disables every control inside. */
export function Fieldset({ legend, children, disabled, className }: FieldsetProps) {
  return (
    <FieldsetPrimitive.Root disabled={disabled} className={cn("flex flex-col gap-4 border-0 p-0", className)}>
      <FieldsetPrimitive.Legend className="mb-1 text-base font-semibold leading-6 tracking-fg text-fg-black">{legend}</FieldsetPrimitive.Legend>
      {children}
    </FieldsetPrimitive.Root>
  );
}
