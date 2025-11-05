import { Header } from './header';
import { PropsWithChildren } from 'react';

export default function LayouDashboard(props: PropsWithChildren) {
  return (
    <>
      <Header />
      <main>{props.children}</main>
    </>
  );
}
