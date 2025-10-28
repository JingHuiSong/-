import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { CommandBar } from "@/components/command-bar";

export const metadata: Metadata = {
  title: "远见者旅行社 - 预见世界，预见自己",
  description: "远见者旅行社智能化旅游定制管理平台 - Apple风格极致体验",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans">
        <Providers>
          {children}
          <CommandBar />
        </Providers>
      </body>
    </html>
  );
}

