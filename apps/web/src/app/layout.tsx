import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaCart | Shop Fashion & Accessories",
  description:
    "Discover fashion, electronics accessories, and products from trusted sellers on NovaCart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}