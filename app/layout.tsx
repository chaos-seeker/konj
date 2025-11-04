import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import LayouBaset from "@/containers/layout/base";
import { Providers } from "./providers";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "konj",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fs" dir="rtl">
      <body className={vazirmatn.className}>{
        <LayouBaset>
          <Providers>
            {children}
          </Providers>
        </LayouBaset>
      }</body>
    </html>
  );
}
