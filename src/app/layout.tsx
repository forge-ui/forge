import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "@fontsource-variable/manrope";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forge",
  description: "SaaS Starter Kit",
};

const fontVariables = {
  "--font-manrope": "'Manrope Variable', system-ui, sans-serif",
  "--font-plus-jakarta-sans": "'Plus Jakarta Sans Variable', system-ui, sans-serif",
} as CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className="h-full antialiased" style={fontVariables} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
