
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaCart | Discover More. Shop Better.",
  description:
    "Shop fashion, electronics accessories, footwear, and unique finds from trusted sellers on NovaCart.",
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
