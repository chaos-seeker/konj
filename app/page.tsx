import { Banner } from "@/containers/routes/home/banner";
import { Category } from "@/containers/routes/home/category";
import { Newest } from "@/containers/routes/home/newest";
import { Popular } from "@/containers/routes/home/popular";
import { Lowest } from "@/containers/routes/home/llowest";

export default function Home() {
  return (
    <>
      <Banner
        image="/images/routes/home/banner-1-desktop.png"
        imageMobile="/images/routes/home/banner-1-mobile.png"
      />
      <Category />
      <Newest />
      <Banner
        image="/images/routes/home/banner-2-desktop.png"
        imageMobile="/images/routes/home/banner-2-mobile.png"
      />
      <Popular />
      <Banner
        image="/images/routes/home/banner-3-desktop.png"
        imageMobile="/images/routes/home/banner-3-mobile.png"
      />
      <Lowest />
    </>
  );
}
