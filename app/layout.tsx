import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import LayouBaset from "@/containers/layout/base";
import { Providers } from "./providers";
import LayouDashboard from "@/containers/layout/dashboard";
import { headers } from "next/headers";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
      <body className={vazirmatn.className}>
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
