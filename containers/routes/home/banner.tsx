import Image from "next/image";
import Link from "next/link";

interface BannerProps {
  image: string;
  imageMobile: string;
}

export const Banner = (props: BannerProps) => {
  return (
    <div className="container">
      <div className="relative w-full aspect-16/14 md:aspect-21/7 overflow-hidden rounded-lg">
        <Link href="/">
          <Image
            src={props.imageMobile}
            alt="banner"
            fill
            className="object-cover md:hidden w-full overflow-hidden rounded-lg"
          />
          <Image
            src={props.image}
            alt="banner"
            fill
            className="object-cover hidden md:block"
          />
        </Link>
      </div>
    </div>
  );
};
