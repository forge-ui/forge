/** Shared appearance for document and floating-note folders. */
export const folderShadow = "inset 0 1px 2px rgba(255,255,255,.16), 0 12px 20px -14px rgba(0,0,0,.22)";
export const folderBackShadow = "drop-shadow(0 12px 10px rgba(0,0,0,.1))";
export const folderFrontFill = (ink: string) => `linear-gradient(145deg, color-mix(in srgb, ${ink} 62%, white), ${ink})`;
export const folderBackFill = (ink: string) => `color-mix(in srgb, ${ink} 88%, black)`;
export const folderOutline = (left = 54) => `M5 10 H${left - 5} C${left} 10 ${left} 0 ${left + 6} 0 H${left + 23} C${left + 29} 0 ${left + 29} 10 ${left + 35} 10 H95 Q100 10 100 16 V94 Q100 100 94 100 H6 Q0 100 0 94 V16 Q0 10 5 10 Z`;
