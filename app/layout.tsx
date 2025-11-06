import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LayouBaset from "@/containers/layout/base";
import { Providers } from "./providers";
import LayouDashboard from "@/containers/layout/dashboard";
import { headers } from "next/headers";

const iransans = localFont({
  src: "../public/fonts/IRANSansXV.woff2",
  variable: "--font-iransans",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "konj",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname")!;
  const isDashboard = pathname.includes("/dashboard");

  return (
    <html lang="fs" dir="rtl">
      <body className={iransans.className}>
        <Providers>
          {isDashboard ? (
            <LayouDashboard>{children}</LayouDashboard>
          ) : (
            <LayouBaset>{children}</LayouBaset>
          )}
        </Providers>
      </body>
    </html>
  );
}
