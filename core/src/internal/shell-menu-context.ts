"use client";

import { createContext } from "react";

/** True when a shell panel renders inside AppLayout's Base UI menu; its rows then become real menu items. */
export const ShellMenuContext = createContext(false);
