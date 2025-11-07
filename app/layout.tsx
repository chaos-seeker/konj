import './globals.css';
import { Providers } from './providers';
import LayouBase from '@/containers/layout/base';
import LayouDashboard from '@/containers/layout/dashboard';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import { PropsWithChildren } from 'react';

const iransans = localFont({
  src: '../public/fonts/IRANSansXV.woff2',
  variable: '--font-iransans',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'konj',
};

export default async function RootLayout(props: PropsWithChildren) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname')!;
  const isDashboard = pathname.includes('/dashboard');

  return (
    <html lang="fs" dir="rtl">
      <body className={iransans.className}>
        <Providers>
          {isDashboard ? (
            <LayouDashboard>{props.children}</LayouDashboard>
          ) : (
            <LayouBase>{props.children}</LayouBase>
          )}
        </Providers>
      </body>
    </html>
  );
}
