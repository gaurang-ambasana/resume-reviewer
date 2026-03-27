import type { Metadata } from "next";
import "./globals.css";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Resume Destroyer",
  description:
    "Upload your resume and get clear, practical feedback to improve it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
