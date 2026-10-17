/** Shared controlled generation state for chat and agent composers. */
export type ComposerStatus = "idle" | "running" | "stopping";

export type ComposerModel = { id: string; label: string };

/** Reply metadata is owned by the caller and forwarded with a send. */
export type ComposerReply = { id: string; name: string; content: string };
export type ComposerVoiceState = "idle" | "recording" | "processing";
