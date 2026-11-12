import type { ReactNode } from "react";
import { EnglishFooter, EnglishHeader } from "./_chrome";

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="en" className="flex min-h-screen flex-col bg-fg-grey-50">
      <EnglishHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-14 sm:px-8">{children}</main>
      <EnglishFooter />
    </div>
  );
}
