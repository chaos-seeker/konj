import { Footer } from './footer';
import { Header } from './header';
import { PropsWithChildren } from 'react';

export default function LayouBaset(props: PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen">{props.children}</main>
      <Footer />
    </>
  );
}
