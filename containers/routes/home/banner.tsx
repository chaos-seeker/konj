import Image from 'next/image';
import Link from 'next/link';

interface BannerProps {
  image: string;
  imageMobile: string;
}

export const Banner = (props: BannerProps) => {
  return (
    <div className="container">
      <div className="relative aspect-16/14 w-full overflow-hidden rounded-lg md:aspect-21/7">
        <Link href="/explore">
          <Image
            src={props.imageMobile}
            alt="banner"
            fill
            className="w-full overflow-hidden rounded-lg object-cover md:hidden"
          />
          <Image
            src={props.image}
            alt="banner"
            fill
            className="hidden object-cover md:block"
          />
        </Link>
      </div>
    </div>
  );
};
