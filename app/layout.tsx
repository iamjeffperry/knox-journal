import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Knox Journal",
  description: "Remember every Project Zomboid run and learn from every death.",
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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
