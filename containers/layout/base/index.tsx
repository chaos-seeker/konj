import { Footer } from "./footer";
import { Header } from "./header";
import { PropsWithChildren } from "react";

export default function LayouBase(props: PropsWithChildren) {
  return (
    <>
      <Header />
      <main>{props.children}</main>
      <Footer />
    </>
  );
}
