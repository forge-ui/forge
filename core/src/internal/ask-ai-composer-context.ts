"use client";

import { createContext } from "react";

/** Only the fullscreen conversation composer opts into the compact PromptBar. */
export const AskAiCompactComposerContext = createContext(false);
