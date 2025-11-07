import { ViewportAnimation } from '@/components/viewport-animation';
import { Banner } from '@/containers/routes/home/banner';
import { Category } from '@/containers/routes/home/category';
import { Lowest } from '@/containers/routes/home/lowest';
import { Newest } from '@/containers/routes/home/newest';
import { Popular } from '@/containers/routes/home/popular';

export default function Home() {
  return (
    <>
      <ViewportAnimation>
        <Banner
          image="/images/routes/home/banner-1-desktop.png"
          imageMobile="/images/routes/home/banner-1-mobile.png"
        />
      </ViewportAnimation>
      <ViewportAnimation>
        <Category />
      </ViewportAnimation>
      <ViewportAnimation>
        <Newest />
      </ViewportAnimation>
      <ViewportAnimation>
        <Banner
          image="/images/routes/home/banner-2-desktop.png"
          imageMobile="/images/routes/home/banner-2-mobile.png"
        />
      </ViewportAnimation>
      <ViewportAnimation>
        <Popular />
      </ViewportAnimation>
      <ViewportAnimation>
        <Banner
          image="/images/routes/home/banner-3-desktop.png"
          imageMobile="/images/routes/home/banner-3-mobile.png"
        />
      </ViewportAnimation>
      <ViewportAnimation>
        <Lowest />
      </ViewportAnimation>
    </>
  );
}
