import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gemmanic — AI Workspace",
  description: "A focused AI workspace inspired by Bionic.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
