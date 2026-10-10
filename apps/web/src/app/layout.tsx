
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaCart | Discover More. Shop Better.",
  description:
    "Shop fashion, electronics accessories, footwear, and more on NovaCart. Discover deals from local sellers and international collections.",
  applicationName: "NovaCart",
  keywords: [
    "NovaCart",
    "online shopping",
    "fashion",
    "electronics accessories",
    "marketplace",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5427d9",
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
