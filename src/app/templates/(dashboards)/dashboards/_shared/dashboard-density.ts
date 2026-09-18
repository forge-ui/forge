/**
 * Dashboard-gallery-only density overrides.
 *
 * These classes intentionally live with the templates: the gallery needs a
 * denser composition, while the public Core component defaults stay intact.
 */
export const compactStatCardClass =
  "!gap-3 !p-4 [&_.text-3xl]:!text-2xl [&_.leading-9]:!leading-8 [&_.h-16]:!h-12";

export const compactBalanceCardClass =
  "!gap-3 !p-4 [&_.text-4xl]:!text-3xl [&_.leading-11]:!leading-9 [&_.h-10]:!h-9";

export const compactImageStatCardClass =
  "!gap-4 !p-4 [&_.text-4xl]:!text-2xl [&_.leading-11]:!leading-8";

export const compactHighlightCardClass = "!h-96 !gap-3 !p-4";

export const compactListGroupClass =
  "[&>div:first-child]:!px-4 [&>div:first-child]:!pt-4 [&>div:last-child]:!gap-3 [&>div:last-child]:!px-4 [&>div:last-child]:!py-4";
