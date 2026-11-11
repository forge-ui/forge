import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { CSSProperties } from "react";
import "@fontsource-variable/manrope";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { themeBootScript } from "@/lib/theme-boot";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Forge UI · 中文后台 React 组件库", template: `%s · ${SITE_NAME}` },
  description: "面向中文后台的 React 组件库：组件、页面组件和后台模板，配套 Skill、MCP 和页面检查。",
  applicationName: SITE_NAME,
  openGraph: { type: "website", siteName: SITE_NAME, locale: "zh_CN", images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
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
    <html lang="zh-CN" data-accent="blue" className="h-full antialiased" style={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
