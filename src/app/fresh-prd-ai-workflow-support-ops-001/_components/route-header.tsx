import Link from "next/link";
import { Button } from "@forge-ui-official/core";
import { basePath } from "./data";

export function RouteHeader({
  eyebrow,
  title,
  primaryHref = `${basePath}/recovery/new`,
  primaryLabel = "Open recovery action",
}: {
  eyebrow: string;
  title: string;
  primaryHref?: string;
  primaryLabel?: string;
}) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-fg text-fg-blue">{eyebrow}</p>
        <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-fg text-fg-black">{title}</h1>
      </div>
      <Link href={primaryHref}>
        <Button color="blue" size="md">{primaryLabel}</Button>
      </Link>
    </header>
  );
}
