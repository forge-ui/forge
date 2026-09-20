export interface AskAiLink {
  label: string;
  href: string;
}

export interface AskAiResponse {
  text: string;
  links?: AskAiLink[];
}

export interface AskAiMessage {
  role: "user" | "assistant";
  content: string;
  links?: AskAiLink[];
}

export interface AskAiRequest {
  /** Only included when the user enables page context. */
  context?: string;
  messages: AskAiMessage[];
  signal: AbortSignal;
}

/** Session row injected by the consumer. Core does not persist or fetch. */
export interface AskAiSessionItem {
  id: string;
  title: string;
}
