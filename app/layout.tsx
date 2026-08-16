import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LMS Train",
  description: "線上教育訓練系統 — 影片 + 考題 + 統計",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
