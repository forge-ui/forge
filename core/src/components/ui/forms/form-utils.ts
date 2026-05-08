// Re-export shared accent utilities for form components.
// Form components historically used `formAccents` / `FormAccentColor` —
// these are now aliases for the project-wide `accentColors` / `AccentColor`.

export {
  accentColors as formAccents,
  type AccentColor as FormAccentColor,
  type AccentConfig as FormAccentConfig,
} from "../accent-utils";
