import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NusaData — Demografi Indonesia",
  description: "Peta interaktif demografi 38 provinsi Indonesia.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
