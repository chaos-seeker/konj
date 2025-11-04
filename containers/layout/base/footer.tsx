import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className='flex flex-col border border-slate-200 container items-center bg-white rounded-t-xl'>
      <div className="py-4 flex items-center w-full justify-between">
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
  return (
    <p className="text-caption">توسعه توسط حمید شاهسونی</p>
  );
}
