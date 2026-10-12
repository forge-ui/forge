/** Shared controlled generation state for chat and agent composers. */
export type ComposerStatus = "idle" | "running" | "stopping";

export type ComposerModel = { id: string; label: string };
