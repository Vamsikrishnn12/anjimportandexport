import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ANJ Global Import & Export", template: "%s | ANJ Global" },
  description: "Import and export sourcing, trade coordination and logistics support from Tamil Nadu to India and global markets.",
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
