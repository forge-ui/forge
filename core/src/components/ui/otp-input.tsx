"use client";

// Third-party license notices: core/THIRD_PARTY_NOTICES.md.
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "../../internal/motion";
import type { MotionPreference } from "../../lib/motion";

export type OtpInputProps = {
  length?: number;
  locale?: "zh" | "en";
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  /** Check on the server. No built-in passcode or simulated verification. */
  verify?: (value: string) => boolean | Promise<boolean>;
  onSuccess?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  name?: string;
  inputLabel?: string;
  hint?: ReactNode;
  verifyingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  motion?: MotionPreference;
  className?: string;
};
const teeth = Array.from({ length: 16 }, (_, i) => [50 + (i === 0 || i === 15 ? 0 : (i % 2 ? 1.7 : -1.7) / 54 * 100), i / 15 * 100]);
const edge = teeth.map(([x, y]) => `${x}% ${y}%`).join(", ");
const halves = [`polygon(0% 0%, ${edge}, 0% 100%)`, `polygon(100% 0%, ${edge}, 100% 100%)`];
const crack = `M ${teeth.map(([x, y]) => `${x * .54} ${y * .68}`).join(" L ")}`;
const ease = [.16, 1, .3, 1] as const;

export function OtpInput({ length = 6, locale = "zh", value: controlled, defaultValue = "", onChange, onComplete, verify, onSuccess,
  disabled = false, autoFocus = false, name, inputLabel = locale === "zh" ? "验证码" : "Verification code", hint = locale === "zh" ? "请输入验证码" : "Enter your verification code", verifyingLabel = locale === "zh" ? "正在验证…" : "Verifying…",
  successLabel = locale === "zh" ? "验证成功" : "Verified", errorLabel = locale === "zh" ? "验证码不正确，请重试" : "Incorrect code. Try again", motion: motionPreference = "auto", className = "" }: OtpInputProps) {
  const size = Number.isFinite(length) ? Math.max(2, Math.min(10, Math.round(length))) : 6;
  const clean = (text: string) => text.replace(/\D/g, "").slice(0, size);
  const [internal, setInternal] = useState(defaultValue);
  const value = clean(controlled ?? internal);
  const [result, setResult] = useState<{ value: string; state: "idle" | "pending" | "ok" | "err" }>({ value: "", state: "idle" });
  const state = value === result.value && value.length === size ? result.state : "idle";
  const [caret, setCaret] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const request = useRef(0);
  const reduced = useReducedMotion(motionPreference);
  const hintId = useId();
  // Disabling editing does not cancel an already submitted verification.
  useEffect(() => () => { request.current++; }, []);
  function change(next: string) {
    next = clean(next);
    if (next === value || disabled || state === "pending") return;
    const generation = ++request.current;
    if (controlled === undefined) setInternal(next);
    onChange?.(next);
    setResult({ value: next, state: "idle" });
    if (next.length !== size) return;
    onComplete?.(next);
    if (!verify) return;
    setResult({ value: next, state: "pending" });
    void Promise.resolve().then(() => verify(next)).then(ok => {
      if (generation !== request.current || input.current?.value !== next) return;
      setResult({ value: next, state: ok ? "ok" : "err" });
      if (ok) onSuccess?.(next);
    }, () => {
      if (generation === request.current && input.current?.value === next) setResult({ value: next, state: "err" });
    });
  }
  useLayoutEffect(() => { if (result.state === "pending" && (result.value !== value || result.value.length !== size)) request.current++; }, [result, value, size]);
  const message = state === "pending" ? verifyingLabel : state === "ok" ? successLabel : state === "err" ? errorLabel : hint;
  return <div className={`forge-otp ${className}`} data-motion={motionPreference} data-status={state} data-disabled={disabled || undefined} style={{ "--forge-otp-count": size } as React.CSSProperties}>
    <div className="forge-otp__stage">
      <motion.div className="forge-otp__row" aria-hidden="true" animate={state === "err" && !reduced ? { x: [0, -13, 12, -10, 8, -5, 3, 0] } : { x: 0 }} transition={{ duration: reduced ? 0 : .66 }}>
        {Array.from({ length: size }, (_, i) => <span className="forge-otp__slot" key={i}>
          {i === Math.ceil(size / 2) && <span className="forge-otp__sep">-</span>}
          <motion.div className="forge-otp__cell" data-state={state === "ok" || state === "err" ? state : focused && i === Math.min(caret ?? value.length, size - 1) ? "focus" : "idle"} data-filled={Boolean(value[i])}
            animate={state === "ok" && !reduced ? { y: [0, -10, 0], scale: [1, 1.06, 1] } : { y: 0, scale: 1 }} transition={{ duration: reduced ? 0 : .6, delay: reduced ? 0 : i * .055 }}>
            <motion.div className="forge-otp__whole" animate={{ opacity: state === "err" && !reduced ? [1, 1, 0, 0, 1] : 1 }} transition={{ duration: reduced ? 0 : 3.8, times: [0, .35, .36, .9, 1] }}>
              <div className="forge-otp__egg"><Digit value={value[i] ?? ""} index={i} reduced={reduced} /></div>
            </motion.div>
            {halves.map((clipPath, side) => {
              const sign = side ? 1 : -1;
              const broken = state === "err" && !reduced;
              return <motion.div key={side} className="forge-otp__half" style={{ clipPath }}
                animate={broken ? { x: [0, 0, sign * 3.5, sign * (46 + i * 7), 0], y: [0, 0, 0, 104, 0], rotate: [0, 0, sign * 7, sign * 56, 0], opacity: [1, 1, 1, 0, 1] } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
                transition={{ duration: reduced ? 0 : 3.8, times: [0, .35, .46, .76, 1], delay: reduced ? 0 : i * .04, ease }}>
                <div className="forge-otp__egg"><Digit value={value[i] ?? ""} index={i} reduced={reduced} /></div>
              </motion.div>;
            })}
            <motion.svg className="forge-otp__crack" viewBox="0 0 54 68" animate={{ opacity: state === "err" && !reduced ? [0, 1, 1, 0] : 0 }} transition={{ duration: 1.8, times: [0, .2, .8, 1] }}>
              <motion.path d={crack} initial={false} animate={{ pathLength: state === "err" ? 1 : 0 }} transition={{ duration: reduced ? 0 : .54, delay: reduced ? 0 : .3 + i * .08 }} />
            </motion.svg>
            <span className="forge-otp__caret" />
          </motion.div>
        </span>)}
      </motion.div>
      <input ref={input} className="forge-otp__field" type="text" inputMode="numeric" autoComplete="one-time-code" name={name} autoFocus={autoFocus}
        aria-label={inputLabel} aria-describedby={hintId} aria-invalid={state === "err" || undefined} aria-busy={state === "pending" || undefined}
        value={value} disabled={disabled} readOnly={state === "pending"} spellCheck={false} onChange={event => change(event.target.value)}
        onSelect={event => setCaret(event.currentTarget.selectionStart)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
    </div>
    <p id={hintId} className={`forge-otp__hint ${state === "ok" ? "forge-otp__hintOk" : state === "err" ? "forge-otp__hintErr" : ""}`} role="status">{message}</p>
  </div>;
}
function Digit({ value, index, reduced }: { value: string; index: number; reduced: boolean }) {
  return <AnimatePresence initial={false} mode="sync"><motion.span key={value} className="forge-otp__digit"
    initial={reduced ? false : { y: (index % 2 ? -1 : 1) * 30, opacity: 0, filter: "blur(5px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
    exit={reduced ? { opacity: 0 } : { y: (index % 2 ? -1 : 1) * 30, opacity: 0, filter: "blur(5px)" }} transition={{ duration: reduced ? 0 : .46, ease }}>{value}</motion.span></AnimatePresence>;
}
