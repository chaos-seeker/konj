import Image from 'next/image';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="container flex flex-col items-center rounded-t-xl border border-slate-200 bg-white">
      <div className="flex w-full items-center justify-between py-4">
        <Copyright />
        <Logo />
      </div>
    </footer>
  );
};

function Logo() {
  return (
    <Link href="/">
      <Image
        src="/images/layout/logo.png"
        alt="logo"
        width={60}
        height={60}
        className="lg:w-[80px]"
      />
    </Link>
  );
}

const Copyright = () => {
  return <p className="text-sm">توسعه توسط حمید شاهسونی</p>;
};
